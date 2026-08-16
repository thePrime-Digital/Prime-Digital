import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  createAdminAuditLog,
} from "@/lib/data/admin-audit";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  schoolName:
    "Prime Digital School",

  supportEmail:
    "",

  supportPhone:
    "",

  timezone:
    "Asia/Kolkata",

  admissionsOpen:
    true,

  facultySignupOpen:
    true,

  clientSignupOpen:
    true,

  announcement:
    "",
};

type SettingsBody = {
  schoolName?: unknown;
  supportEmail?: unknown;
  supportPhone?: unknown;
  timezone?: unknown;
  admissionsOpen?: unknown;
  facultySignupOpen?: unknown;
  clientSignupOpen?: unknown;
  announcement?: unknown;
};

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection(
        "platform_settings",
      );

    const settings =
      await collection.findOne({
        key: "main",
      });

    return NextResponse.json(
      {
        settings: {
          ...DEFAULT_SETTINGS,
          ...(settings || {}),
          _id: undefined,
          key: undefined,
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
      "Settings GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load settings.",
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
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  let body:
    SettingsBody;

  try {
    body =
      (await request.json()) as SettingsBody;
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

  const schoolName =
    typeof body.schoolName ===
    "string"
      ? body.schoolName.trim()
      : "";

  const supportEmail =
    typeof body.supportEmail ===
    "string"
      ? body.supportEmail.trim()
      : "";

  const supportPhone =
    typeof body.supportPhone ===
    "string"
      ? body.supportPhone.trim()
      : "";

  const timezone =
    typeof body.timezone ===
    "string"
      ? body.timezone.trim()
      : "Asia/Kolkata";

  const announcement =
    typeof body.announcement ===
    "string"
      ? body.announcement.trim()
      : "";

  if (
    schoolName.length < 2 ||
    schoolName.length > 100
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid school name.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    supportEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      supportEmail,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid support email.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    announcement.length >
    500
  ) {
    return NextResponse.json(
      {
        error:
          "Announcement cannot exceed 500 characters.",
      },
      {
        status: 400,
      },
    );
  }

  const settings = {
    schoolName,
    supportEmail,
    supportPhone,
    timezone,

    admissionsOpen:
      body.admissionsOpen ===
      true,

    facultySignupOpen:
      body.facultySignupOpen ===
      true,

    clientSignupOpen:
      body.clientSignupOpen ===
      true,

    announcement,

    updatedAt:
      new Date(),

    updatedBy:
      authorization.user._id,

    updatedByEmail:
      authorization.user.email,
  };

  try {
    const database =
      await getDatabase();

    await database
      .collection(
        "platform_settings",
      )
      .updateOne(
        {
          key:
            "main",
        },
        {
          $set: {
            ...settings,
            key:
              "main",
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

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "PLATFORM_SETTINGS_UPDATED",

      changes: [
        {
          field:
            "settings",
          to:
            "updated",
        },
      ],
    });

    return NextResponse.json({
      message:
        "Platform settings saved successfully.",

      settings,
    });
  } catch (error) {
    console.error(
      "Settings PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to save settings.",
      },
      {
        status: 500,
      },
    );
  }
}
