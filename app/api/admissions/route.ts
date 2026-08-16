import { NextResponse } from "next/server";

import {
  insertSubmission,
  SUBMISSION_COLLECTIONS,
} from "@/lib/data/submissions";
import {
  cleanEmail,
  cleanMultilineText,
  cleanPhone,
  cleanText,
  isValidEmail,
  isValidPhone,
} from "@/lib/forms/validation";
import type {
  AdmissionApplication,
} from "@/types/submissions";

export const runtime = "nodejs";

interface AdmissionRequestBody {
  studentName?: unknown;
  parentName?: unknown;
  email?: unknown;
  phone?: unknown;
  program?: unknown;
  currentQualification?: unknown;
  message?: unknown;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: AdmissionRequestBody;

  try {
    body =
      (await request.json()) as AdmissionRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const studentName = cleanText(
    body.studentName,
    100,
  );

  const parentName = cleanText(
    body.parentName,
    100,
  );

  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);

  const program = cleanText(
    body.program,
    150,
  );

  const currentQualification = cleanText(
    body.currentQualification,
    200,
  );

  const message = cleanMultilineText(
    body.message,
    5000,
  );

  if (studentName.length < 2) {
    return NextResponse.json(
      {
        error:
          "Please enter the student's name.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid email address.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid phone number.",
      },
      {
        status: 400,
      },
    );
  }

  if (!program) {
    return NextResponse.json(
      {
        error: "Please select a program.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const now = new Date();

    const application:
      AdmissionApplication = {
        studentName,
        parentName,
        email,
        phone,
        program,
        currentQualification,
        message,
        status: "new",
        createdAt: now,
        updatedAt: now,
      };

    const applicationId =
      await insertSubmission(
        SUBMISSION_COLLECTIONS.admissions,
        application,
      );

    return NextResponse.json(
      {
        message:
          "Your admission application has been submitted successfully.",
        applicationId,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.error(
      "Admission application error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit the admission application right now.",
      },
      {
        status: 500,
      },
    );
  }
}
