import {
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  getAdminResourceConfig,
} from "@/lib/admin/admin-resource-registry";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type AdmissionBody = {
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

function text(
  value: unknown,
  maxLength: number,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(
      /[\u0000-\u001F\u007F]/g,
      "",
    )
    .replace(
      /[<>]/g,
      "",
    )
    .trim()
    .slice(
      0,
      maxLength,
    );
}

function createReference() {
  const date =
    new Date();

  const day =
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

  const random =
    Math.random()
      .toString(
        36,
      )
      .slice(
        2,
        8,
      )
      .toUpperCase();

  return `PDS-ADM-${day}-${random}`;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body:
    AdmissionBody;

  try {
    body =
      (await request.json()) as
        AdmissionBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid application data.",
      },
      {
        status: 400,
      },
    );
  }

  const studentName =
    text(
      body.studentName,
      120,
    );

  const parentName =
    text(
      body.parentName,
      120,
    );

  const email =
    text(
      body.email,
      160,
    ).toLowerCase();

  const phone =
    text(
      body.phone,
      30,
    );

  const grade =
    text(
      body.grade,
      80,
    );

  const program =
    text(
      body.program,
      120,
    );

  const currentSchool =
    text(
      body.currentSchool,
      180,
    );

  const message =
    text(
      body.message,
      3000,
    );

  if (
    studentName.length <
    2
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter the student's full name.",
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
      30
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

  if (!grade) {
    return NextResponse.json(
      {
        error:
          "Please select the class or academic level.",
      },
      {
        status: 400,
      },
    );
  }

  if (!program) {
    return NextResponse.json(
      {
        error:
          "Please select a program.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    body.consent !==
    true
  ) {
    return NextResponse.json(
      {
        error:
          "Please confirm your consent before submitting.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    /*
     * Check whether admissions are
     * currently enabled by Admin.
     */
    const platformSettings =
      await database
        .collection(
          "platform_settings",
        )
        .findOne({
          key: "main",
        });

    if (
      platformSettings?.admissionsOpen ===
      false
    ) {
      return NextResponse.json(
        {
          error:
            "Admissions are currently closed.",
        },
        {
          status: 403,
        },
      );
    }

    const config =
      getAdminResourceConfig(
        "admissions",
      );

    if (!config) {
      return NextResponse.json(
        {
          error:
            "Admissions are temporarily unavailable.",
        },
        {
          status: 500,
        },
      );
    }

    const collection =
      database.collection<Document>(
        config.collection,
      );

    /*
     * Prevent accidental duplicate
     * applications from repeated clicks.
     */
    const existing =
      await collection.findOne({
        email,
        phone,

        status: {
          $nin: [
            "rejected",
            "closed",
          ],
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An active admission application already exists for these contact details.",
        },
        {
          status: 409,
        },
      );
    }

    const now =
      new Date();

    const reference =
      createReference();

    await collection.insertOne({
      reference,

      studentName,

      name:
        studentName,

      fullName:
        studentName,

      parentName,

      email,

      phone,

      grade,

      program,

      currentSchool,

      message,

      status:
        config.defaultStatus,

      adminNote:
        "",

      source:
        "public-admissions-page",

      consentAt:
        now,

      createdAt:
        now,

      updatedAt:
        now,
    });

    return NextResponse.json(
      {
        message:
          "Your admission application has been submitted successfully.",

        reference,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Public admissions POST error:",
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