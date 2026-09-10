import {
  NextResponse,
} from "next/server";

import {
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

import {
  getPasswordValidationError,
  hashPassword,
} from "@/lib/auth/password";

import {
  isValidName,
  isValidPhone,
  normaliseName,
  normalisePhone,
} from "@/lib/auth/validation";

import {
  getUsersCollection,
} from "@/lib/data/users";

import type {
  UserDocument,
} from "@/types/user";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type UpdateSettingsBody = {
  name?: unknown;
  phone?: unknown;
  newPassword?: unknown;
};

function settingsResponse(
  user: {
    _id: {
      toHexString(): string;
    };

    name: string;
    email: string;
    phone: string;

    studentLevel?: string;
    currentClass?: string;
    degreeName?: string;
    program?: string;
  },
) {
  return {
    id:
      user._id.toHexString(),

    name:
      user.name,

    email:
      user.email,

    phone:
      user.phone,

    studentLevel:
      user.studentLevel ||
      null,

    currentClass:
      user.currentClass ||
      null,

    degreeName:
      user.degreeName ||
      null,

    program:
      user.program ||
      null,
  };
}

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  return NextResponse.json(
    {
      user:
        settingsResponse(
          authorization.user,
        ),
    },
    {
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    },
  );
}

export async function PATCH(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    UpdateSettingsBody;

  try {
    body =
      (await request.json()) as
        UpdateSettingsBody;
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

  const update:
    Partial<UserDocument> = {};

  if (
    body.name !==
    undefined
  ) {
    const name =
      normaliseName(
        body.name,
      );

    if (
      !isValidName(
        name,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid name.",
        },
        {
          status: 400,
        },
      );
    }

    update.name =
      name;
  }

  if (
    body.phone !==
    undefined
  ) {
    const phone =
      normalisePhone(
        body.phone,
      );

    if (
      !isValidPhone(
        phone,
      )
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

    update.phone =
      phone;
  }

  if (
    body.newPassword !==
    undefined
  ) {
    const newPassword =
      typeof body.newPassword ===
      "string"
        ? body.newPassword
        : "";

    if (newPassword) {
      const passwordError =
        getPasswordValidationError(
          newPassword,
        );

      if (
        passwordError
      ) {
        return NextResponse.json(
          {
            error:
              passwordError,
          },
          {
            status: 400,
          },
        );
      }

      update.passwordHash =
        await hashPassword(
          newPassword,
        );
    }
  }

  if (
    Object.keys(
      update,
    ).length ===
    0
  ) {
    return NextResponse.json({
      message:
        "No changes were required.",

      user:
        settingsResponse(
          authorization.user,
        ),
    });
  }

  try {
    const collection =
      await getUsersCollection();

    update.updatedAt =
      new Date();

    await collection.updateOne(
      {
        _id:
          authorization.user._id,
      },
      {
        $set:
          update,
      },
    );

    const updated =
      await collection.findOne({
        _id:
          authorization.user._id,
      });

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "Account could not be reloaded.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      message:
        "Profile updated successfully.",

      user:
        settingsResponse(
          updated,
        ),
    });
  } catch (error) {
    console.error(
      "Student settings error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update your profile.",
      },
      {
        status: 500,
      },
    );
  }
}