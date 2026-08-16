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
  isValidHttpUrl,
  isValidPhone,
} from "@/lib/forms/validation";
import type {
  CareerApplication,
} from "@/types/submissions";

export const runtime = "nodejs";

interface CareerRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  position?: unknown;
  experience?: unknown;
  linkedinUrl?: unknown;
  portfolioUrl?: unknown;
  resumeUrl?: unknown;
  coverLetter?: unknown;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: CareerRequestBody;

  try {
    body =
      (await request.json()) as CareerRequestBody;
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

  const position = cleanText(
    body.position,
    150,
  );

  const experience = cleanText(
    body.experience,
    500,
  );

  const linkedinUrl = cleanText(
    body.linkedinUrl,
    500,
  );

  const portfolioUrl = cleanText(
    body.portfolioUrl,
    500,
  );

  const resumeUrl = cleanText(
    body.resumeUrl,
    1000,
  );

  const coverLetter = cleanMultilineText(
    body.coverLetter,
    10000,
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

  if (!position) {
    return NextResponse.json(
      {
        error: "Please enter the position.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidHttpUrl(linkedinUrl)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid LinkedIn URL.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidHttpUrl(portfolioUrl)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid portfolio URL.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidHttpUrl(resumeUrl)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid resume URL.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const now = new Date();

    const application:
      CareerApplication = {
        name,
        email,
        phone,
        position,
        experience,
        linkedinUrl,
        portfolioUrl,
        resumeUrl,
        coverLetter,
        status: "new",
        createdAt: now,
        updatedAt: now,
      };

    const applicationId =
      await insertSubmission(
        SUBMISSION_COLLECTIONS.careers,
        application,
      );

    return NextResponse.json(
      {
        message:
          "Your career application has been submitted successfully.",
        applicationId,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.error(
      "Career application error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit your application right now.",
      },
      {
        status: 500,
      },
    );
  }
}
