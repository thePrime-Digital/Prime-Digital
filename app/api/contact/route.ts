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
  ContactSubmission,
} from "@/types/submissions";

export const runtime = "nodejs";

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: ContactRequestBody;

  try {
    body =
      (await request.json()) as ContactRequestBody;
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

  const name = cleanText(body.name, 100);
  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);
  const subject = cleanText(
    body.subject,
    150,
  );
  const message = cleanMultilineText(
    body.message,
    5000,
  );

  if (name.length < 2) {
    return NextResponse.json(
      {
        error: "Please enter your name.",
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

  if (phone && !isValidPhone(phone)) {
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

  if (message.length < 5) {
    return NextResponse.json(
      {
        error: "Please enter your message.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const now = new Date();

    const submission: ContactSubmission = {
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    const submissionId =
      await insertSubmission(
        SUBMISSION_COLLECTIONS.contact,
        submission,
      );

    return NextResponse.json(
      {
        message:
          "Your message has been submitted successfully.",
        submissionId,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.error(
      "Contact submission error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit your message right now.",
      },
      {
        status: 500,
      },
    );
  }
}
