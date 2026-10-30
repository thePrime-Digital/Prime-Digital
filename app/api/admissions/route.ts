import { randomBytes } from "node:crypto";

import { type Document } from "mongodb";

import { NextResponse } from "next/server";

import { getAdminResourceConfig } from "@/lib/admin/admin-resource-registry";

import { getCurrentUser } from "@/lib/auth/current-user";

import { programs } from "@/lib/program-data";

import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

type AdmissionBody = {
  courseSlug?: unknown;
  studentName?: unknown;
  parentName?: unknown;
  email?: unknown;
  phone?: unknown;
  grade?: unknown;
  program?: unknown;
  currentSchool?: unknown;
  message?: unknown;
  consent?: unknown;
};

function text(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function createReference(): string {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const random = randomBytes(4).toString("hex").toUpperCase();

  return `PDS-ADM-${day}-${random}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: AdmissionBody;

  try {
    const parsed: unknown = await request.json();

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Invalid application data." },
        { status: 400 },
      );
    }

    body = parsed as AdmissionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid application data." },
      { status: 400 },
    );
  }

  const courseSlug = text(body.courseSlug, 150);
  const isCourseEnrolment = courseSlug.length > 0;

  const studentName = text(body.studentName, 120);
  const parentName = text(body.parentName, 120);
  const email = text(body.email, 160).toLowerCase();
  const phone = text(body.phone, 30);
  const grade = text(body.grade, 80);
  const currentSchool = text(body.currentSchool, 180);
  const message = text(body.message, 3000);

  let program = text(body.program, 200);

  let applicantUserId: string | undefined;

  /*
   * For course enrolments, the authenticated student and
   * selected course must be verified on the server.
   *
   * General admissions continue using their existing
   * public submission workflow.
   */
  if (isCourseEnrolment) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json(
        {
          error:
            "Please log in with your student account to enrol in this course.",
        },
        { status: 401 },
      );
    }

    const selectedCourse = programs.find((item) => item.slug === courseSlug);

    if (!selectedCourse) {
      return NextResponse.json(
        {
          error:
            "The selected course is invalid. Please return to the Programs page.",
        },
        { status: 400 },
      );
    }

    program = [selectedCourse.title, selectedCourse.highlight]
      .filter(Boolean)
      .join(" ")
      .trim();

    /*
     * Associate the application with the logged-in user.
     * String conversion supports ObjectId/string IDs.
     */
    applicantUserId = String(currentUser._id);
  }

  /*
   * Existing field validations.
   */
  if (studentName.length < 2) {
    return NextResponse.json(
      {
        error: "Please enter the student's full name.",
      },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      {
        error: "Please enter a valid email address.",
      },
      { status: 400 },
    );
  }

  if (phone.length < 7 || phone.length > 30) {
    return NextResponse.json(
      {
        error: "Please enter a valid phone number.",
      },
      { status: 400 },
    );
  }

  if (!grade) {
    return NextResponse.json(
      {
        error: "Please select the class or academic level.",
      },
      { status: 400 },
    );
  }

  if (!program) {
    return NextResponse.json(
      {
        error: "Please select a program.",
      },
      { status: 400 },
    );
  }

  if (body.consent !== true) {
    return NextResponse.json(
      {
        error: "Please confirm your consent before submitting.",
      },
      { status: 400 },
    );
  }

  try {
    const database = await getDatabase();

    /*
     * Respect the existing Admin admission switch.
     */
    const platformSettings = await database
      .collection("platform_settings")
      .findOne({
        key: "main",
      });

    if (platformSettings?.admissionsOpen === false) {
      return NextResponse.json(
        {
          error: "Admissions are currently closed.",
        },
        { status: 403 },
      );
    }

    /*
     * Reuse the existing admissions resource.
     * No new collection is created.
     */
    const config = getAdminResourceConfig("admissions");

    if (!config) {
      return NextResponse.json(
        {
          error: "Admissions are temporarily unavailable.",
        },
        { status: 500 },
      );
    }

    const collection = database.collection<Document>(config.collection);

    /*
     * Duplicate checks:
     *
     * Course enrolment:
     * Prevent duplicate active applications for the
     * same course by the same logged-in student.
     *
     * General admission:
     * Preserve the existing email + phone behaviour,
     * limited to general admission submissions.
     */
    const duplicateQuery: Document = isCourseEnrolment
      ? {
          applicantUserId,
          courseSlug,
          status: {
            $nin: ["rejected", "closed"],
          },
        }
      : {
          email,
          phone,
          $or: [
            {
              courseSlug: {
                $exists: false,
              },
            },
            {
              courseSlug: "",
            },
          ],
          status: {
            $nin: ["rejected", "closed"],
          },
        };

    const existing = await collection.findOne(duplicateQuery);

    if (existing) {
      return NextResponse.json(
        {
          error: isCourseEnrolment
            ? "You already have an active application for this course. Our counsellor will contact you shortly."
            : "An active admission application already exists for these contact details.",
        },
        { status: 409 },
      );
    }

    const now = new Date();
    const reference = createReference();

    const application: Document = {
      reference,

      studentName,
      name: studentName,
      fullName: studentName,

      parentName,
      email,
      phone,
      grade,
      program,
      currentSchool,
      message,

      status: config.defaultStatus,
      adminNote: "",

      source: isCourseEnrolment
        ? "program-enrolment"
        : "public-admissions-page",

      consentAt: now,
      createdAt: now,
      updatedAt: now,
    };

    if (isCourseEnrolment) {
      application.courseSlug = courseSlug;
      application.applicantUserId = applicantUserId;
    }

    await collection.insertOne(application);

    return NextResponse.json(
      {
        message:
          "Your application has been submitted successfully. Our counsellor will contact you shortly.",
        reference,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Public admissions POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to submit your application right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
