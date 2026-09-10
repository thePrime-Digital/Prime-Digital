import { ObjectId, type Document } from "mongodb";

import { NextResponse } from "next/server";

import { requireStudentApi } from "@/lib/auth/api-student-authorization";

import {
  objectAndStringValues,
  objectIdString,
  studentReferenceValues,
} from "@/lib/student/data";

import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

function dateValue(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

export async function GET(): Promise<NextResponse> {
  const authorization = await requireStudentApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  try {
    const database = await getDatabase();

    const user = authorization.user;

    const studentValues = studentReferenceValues(user);

    const enrollments = await database
      .collection<Document>("class_enrollments")
      .find({
        studentId: {
          $in: studentValues,
        },

        status: {
          $ne: "removed",
        },
      })
      .toArray();

    const classIds = Array.from(
      new Set(
        enrollments
          .map((item) => objectIdString(item.classId))
          .filter((id) => ObjectId.isValid(id)),
      ),
    ).map((id) => new ObjectId(id));

    if (classIds.length === 0) {
      return NextResponse.json({
        assignments: [],
      });
    }

    const classValues = objectAndStringValues(classIds);

    const classes = await database
      .collection<Document>("classes")
      .find({
        _id: {
          $in: classIds,
        },
      })
      .toArray();

    const classNames = new Map<string, string>(
      classes.map((item) => [
        item._id.toHexString(),

        String(item.name || "Class"),
      ]),
    );

    const assignments = await database
      .collection<Document>("assignments")
      .find({
        classId: {
          $in: classValues,
        },

        status: {
          $in: ["published", "closed"],
        },
      })
      .sort({
        dueAt: 1,
        createdAt: -1,
      })
      .toArray();

    const assignmentIds = assignments.map((item) => item._id);

    const submissions =
      assignmentIds.length > 0
        ? await database
            .collection<Document>("assignment_submissions")
            .find({
              assignmentId: {
                $in: objectAndStringValues(assignmentIds),
              },

              studentId: {
                $in: studentValues,
              },
            })
            .sort({
              submittedAt: -1,

              createdAt: -1,
            })
            .toArray()
        : [];

    const submissionMap = new Map<string, Document>();

    for (const submission of submissions) {
      const assignmentId = objectIdString(submission.assignmentId);

      if (assignmentId && !submissionMap.has(assignmentId)) {
        submissionMap.set(assignmentId, submission);
      }
    }

    return NextResponse.json(
      {
        assignments: assignments.map((assignment) => {
          const id = assignment._id.toHexString();

          const classId = objectIdString(assignment.classId);

          const submission = submissionMap.get(id);

          return {
            id,

            classId,

            className:
              classNames.get(classId) ||
              String(assignment.className || "Class"),

            title: String(assignment.title || "Assignment"),

            description: String(assignment.description || ""),

            attachmentUrl: String(assignment.attachmentUrl || ""),

            dueAt: dateValue(assignment.dueAt),

            maxScore:
              typeof assignment.maxScore === "number"
                ? assignment.maxScore
                : 100,

            submission: submission
              ? {
                  id: submission._id.toHexString(),

                  text: String(submission.text || submission.answer || ""),

                  fileUrl: String(
                    submission.fileUrl || submission.attachmentUrl || "",
                  ),

                  status: String(submission.status || "submitted"),

                  grade:
                    typeof submission.grade === "number"
                      ? submission.grade
                      : null,

                  feedback: String(submission.feedback || ""),

                  submittedAt: dateValue(
                    submission.submittedAt || submission.createdAt,
                  ),
                }
              : null,
          };
        }),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Student assignments error:", error);

    return NextResponse.json(
      {
        error: "Unable to load assignments.",
      },
      {
        status: 500,
      },
    );
  }
}
