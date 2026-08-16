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
  ServiceLead,
} from "@/types/submissions";

export const runtime = "nodejs";

interface ServiceLeadRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
  budget?: unknown;
  timeline?: unknown;
  message?: unknown;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: ServiceLeadRequestBody;

  try {
    body =
      (await request.json()) as ServiceLeadRequestBody;
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

  const company = cleanText(
    body.company,
    150,
  );

  const service = cleanText(
    body.service,
    200,
  );

  const budget = cleanText(
    body.budget,
    100,
  );

  const timeline = cleanText(
    body.timeline,
    100,
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

  if (!service) {
    return NextResponse.json(
      {
        error:
          "Please select or enter a service.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const now = new Date();

    const lead: ServiceLead = {
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    const leadId =
      await insertSubmission(
        SUBMISSION_COLLECTIONS.services,
        lead,
      );

    return NextResponse.json(
      {
        message:
          "Your project enquiry has been submitted successfully.",
        leadId,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.error(
      "Service lead submission error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit your enquiry right now.",
      },
      {
        status: 500,
      },
    );
  }
}
