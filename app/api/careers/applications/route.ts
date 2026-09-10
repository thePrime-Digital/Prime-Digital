import {
  randomUUID,
} from "node:crypto";

import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  put,
} from "@vercel/blob";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const MAX_CV_SIZE =
  4 * 1024 * 1024;

const ALLOWED_EXTENSIONS =
  new Set([
    "pdf",
    "doc",
    "docx",
  ]);

function value(
  formData: FormData,
  key: string,
): string {
  const raw =
    formData.get(
      key,
    );

  return typeof raw ===
    "string"
    ? raw.trim()
    : "";
}

function safeFileName(
  name: string,
): string {
  const cleaned =
    name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      );

  return (
    cleaned ||
    "resume.pdf"
  );
}

function createReference(
  date: Date,
): string {
  const datePart =
    date
      .toISOString()
      .slice(
        0,
        10,
      )
      .replace(
        /-/g,
        "",
      );

  const token =
    randomUUID()
      .replace(
        /-/g,
        "",
      )
      .slice(
        0,
        6,
      )
      .toUpperCase();

  return `PDS-CAREER-${datePart}-${token}`;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let formData:
    FormData;

  try {
    formData =
      await request.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid application form.",
      },
      {
        status: 400,
      },
    );
  }

  /*
   * Honeypot spam protection.
   * Real users never see/fill this.
   */
  if (
    value(
      formData,
      "website",
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Unable to submit application.",
      },
      {
        status: 400,
      },
    );
  }

  const jobId =
    value(
      formData,
      "jobId",
    );

  const fullName =
    value(
      formData,
      "fullName",
    );

  const email =
    value(
      formData,
      "email",
    ).toLowerCase();

  const phone =
    value(
      formData,
      "phone",
    );

  const city =
    value(
      formData,
      "city",
    );

  const experience =
    value(
      formData,
      "experience",
    );

  const linkedin =
    value(
      formData,
      "linkedin",
    );

  const portfolio =
    value(
      formData,
      "portfolio",
    );

  const coverLetter =
    value(
      formData,
      "coverLetter",
    );

  const consent =
    value(
      formData,
      "consent",
    );

  if (
    !ObjectId.isValid(
      jobId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid career opportunity.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    fullName.length <
      2 ||
    fullName.length >
      120
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter your full name.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  ) {
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

  if (
    phone.length <
      7 ||
    phone.length >
      25
  ) {
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

  if (
    city.length <
      2 ||
    city.length >
      120
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter your city.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    coverLetter.length >
    5000
  ) {
    return NextResponse.json(
      {
        error:
          "Your message is too long.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    consent !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Please confirm the application consent.",
      },
      {
        status: 400,
      },
    );
  }

  const cvValue =
    formData.get(
      "cv",
    );

  if (
    !(cvValue instanceof File) ||
    cvValue.size ===
      0
  ) {
    return NextResponse.json(
      {
        error:
          "Please upload your CV or resume.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    cvValue.size >
    MAX_CV_SIZE
  ) {
    return NextResponse.json(
      {
        error:
          "CV must be smaller than 4 MB.",
      },
      {
        status: 400,
      },
    );
  }

  const extension =
    cvValue.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "";

  if (
    !ALLOWED_EXTENSIONS.has(
      extension,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "CV must be a PDF, DOC or DOCX file.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const jobs =
      database.collection<Document>(
        "career_jobs",
      );

    const applications =
      database.collection<Document>(
        "career_applications",
      );

    const objectId =
      new ObjectId(
        jobId,
      );

    const job =
      await jobs.findOne({
        _id:
          objectId,

        status:
          "published",
      });

    if (!job) {
      return NextResponse.json(
        {
          error:
            "This career opportunity is no longer accepting applications.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      job.deadline instanceof
        Date &&
      job.deadline.getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "The application deadline for this position has passed.",
        },
        {
          status: 409,
        },
      );
    }

    const existing =
      await applications.findOne({
        jobId:
          objectId,

        email,
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An application for this position has already been submitted using this email address.",
        },
        {
          status: 409,
        },
      );
    }

    const now =
      new Date();

    const reference =
      createReference(
        now,
      );

    const cleanedFileName =
      safeFileName(
        cvValue.name,
      );

    const blob =
      await put(
        `career-applications/${jobId}/${reference}-${cleanedFileName}`,
        cvValue,
        {
          access:
            "private",

          addRandomSuffix:
            true,
        },
      );

    const result =
      await applications.insertOne({
        reference,

        jobId:
          objectId,

        jobTitle:
          String(
            job.title ||
              "Career Opportunity",
          ),

        department:
          String(
            job.department ||
              "",
          ),

        fullName,
        email,
        phone,
        city,
        experience,
        linkedin,
        portfolio,
        coverLetter,

        cvUrl:
          blob.url,

        cvFileName:
          cvValue.name,

        cvSize:
          cvValue.size,

        cvContentType:
          cvValue.type,

        status:
          "new",

        internalNotes:
          "",

        source:
          "careers-page",

        consentAt:
          now,

        createdAt:
          now,

        updatedAt:
          now,

        statusHistory: [
          {
            status:
              "new",

            at:
              now,

            source:
              "application",
          },
        ],
      });

    return NextResponse.json(
      {
        message:
          "Application submitted successfully.",

        reference,

        applicationId:
          result.insertedId.toHexString(),

        jobTitle:
          String(
            job.title ||
              "",
          ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Career application POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit your application right now. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}