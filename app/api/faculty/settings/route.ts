import {
  NextResponse,
} from "next/server";

import {
  requireFacultyApi,
} from "@/lib/auth/api-faculty-authorization";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const DEFAULT_SETTINGS = {
  department:
    "",

  bio:
    "",

  officeHours:
    "",

  emailNotifications:
    true,

  messageNotifications:
    true,

  classReminders:
    true,
};

type PatchBody = {
  phone?: unknown;
  department?: unknown;
  bio?: unknown;
  officeHours?: unknown;
  emailNotifications?: unknown;
  messageNotifications?: unknown;
  classReminders?: unknown;
};

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const settings =
      await database
        .collection(
          "faculty_settings",
        )
        .findOne({
          facultyId:
            authorization.user._id,
        });

    return NextResponse.json(
      {
        profile: {
          name:
            authorization.user.name,

          email:
            authorization.user.email,

          phone:
            authorization.user.phone ||
            "",

          status:
            authorization.user.status,
        },

        settings: {
          ...DEFAULT_SETTINGS,

          ...(settings
            ? {
                department:
                  settings.department ||
                  "",

                bio:
                  settings.bio ||
                  "",

                officeHours:
                  settings.officeHours ||
                  "",

                emailNotifications:
                  settings.emailNotifications !==
                  false,

                messageNotifications:
                  settings.messageNotifications !==
                  false,

                classReminders:
                  settings.classReminders !==
                  false,
              }
            : {}),
        },
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "Faculty settings GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load faculty settings.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    PatchBody;

  try {
    body =
      (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const phone =
    typeof body.phone ===
    "string"
      ? body.phone.trim()
      : "";

  const department =
    typeof body.department ===
    "string"
      ? body.department.trim()
      : "";

  const bio =
    typeof body.bio ===
    "string"
      ? body.bio.trim()
      : "";

  const officeHours =
    typeof body.officeHours ===
    "string"
      ? body.officeHours.trim()
      : "";

  if (
    phone.length > 30
  ) {
    return NextResponse.json(
      {
        error:
          "Phone number is too long.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    department.length >
    100
  ) {
    return NextResponse.json(
      {
        error:
          "Department cannot exceed 100 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    bio.length > 1000
  ) {
    return NextResponse.json(
      {
        error:
          "Bio cannot exceed 1000 characters.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const users =
      await getUsersCollection();

    await users.updateOne(
      {
        _id:
          authorization.user._id,
      },
      {
        $set: {
          phone,

          updatedAt:
            new Date(),
        },
      },
    );

    const database =
      await getDatabase();

    const settings = {
      department,
      bio,
      officeHours,

      emailNotifications:
        body.emailNotifications !==
        false,

      messageNotifications:
        body.messageNotifications !==
        false,

      classReminders:
        body.classReminders !==
        false,

      updatedAt:
        new Date(),
    };

    await database
      .collection(
        "faculty_settings",
      )
      .updateOne(
        {
          facultyId:
            authorization.user._id,
        },
        {
          $set: {
            ...settings,

            facultyId:
              authorization.user._id,
          },

          $setOnInsert: {
            createdAt:
              new Date(),
          },
        },
        {
          upsert:
            true,
        },
      );

    return NextResponse.json({
      message:
        "Faculty settings saved successfully.",

      settings,

      profile: {
        name:
          authorization.user.name,

        email:
          authorization.user.email,

        phone,
      },
    });
  } catch (error) {
    console.error(
      "Faculty settings PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to save faculty settings.",
      },
      {
        status: 500,
      },
    );
  }
}
