import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  adminSafeUser,
  countActiveAdmins,
  findAdminUserById,
  isAllowedAdminRole,
  isAllowedUserStatus,
} from "@/lib/data/admin-users";

import {
  createAdminAuditLog,
} from "@/lib/data/admin-audit";

import {
  getPasswordValidationError,
  hashPassword,
} from "@/lib/auth/password";

import {
  isValidEmail,
  isValidName,
  isValidPhone,
  normaliseEmail,
  normaliseName,
  normalisePhone,
} from "@/lib/auth/validation";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import type {
  UserDocument,
  UserRole,
  UserStatus,
} from "@/types/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateAccountBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  role?: unknown;
  status?: unknown;
  newPassword?: unknown;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  const user =
    await findAdminUserById(id);

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Account not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(
    {
      user: adminSafeUser(
        user,
        authorization.user._id.toHexString(),
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
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        error:
          "Invalid account ID.",
      },
      {
        status: 400,
      },
    );
  }

  let body: UpdateAccountBody;

  try {
    body =
      (await request.json()) as UpdateAccountBody;
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

  try {
    const collection =
      await getUsersCollection();

    const targetUser =
      await collection.findOne({
        _id: new ObjectId(id),
      });

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "Account not found.",
        },
        {
          status: 404,
        },
      );
    }

    const actorId =
      authorization.user._id.toHexString();

    const isSelf =
      actorId === id;

    const update:
      Partial<UserDocument> = {};

    const auditChanges: {
      field: string;
      from?: unknown;
      to?: unknown;
    }[] = [];

        if (body.name !== undefined) {
      const name =
        normaliseName(body.name);

      if (!isValidName(name)) {
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

      if (name !== targetUser.name) {
        update.name = name;

        auditChanges.push({
          field: "name",
          from: targetUser.name,
          to: name,
        });
      }
    }

    if (body.email !== undefined) {
      const email =
        normaliseEmail(body.email);

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

      if (email !== targetUser.email) {
        const duplicate =
          await collection.findOne({
            email,
            _id: {
              $ne: targetUser._id,
            },
          });

        if (duplicate) {
          return NextResponse.json(
            {
              error:
                "Another account already uses this email.",
            },
            {
              status: 409,
            },
          );
        }

        update.email = email;

        auditChanges.push({
          field: "email",
          from: targetUser.email,
          to: email,
        });
      }
    }

    if (body.phone !== undefined) {
      const phone =
        normalisePhone(body.phone);

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

      if (phone !== targetUser.phone) {
        update.phone = phone;

        auditChanges.push({
          field: "phone",
          from: targetUser.phone,
          to: phone,
        });
      }
    }

    if (body.role !== undefined) {
      const role =
        typeof body.role === "string"
          ? body.role
              .trim()
              .toLowerCase()
          : "";

      if (!isAllowedAdminRole(role)) {
        return NextResponse.json(
          {
            error:
              "Invalid account role.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        isSelf &&
        role !== "admin"
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot remove your own administrator role.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        targetUser.role === "admin" &&
        role !== "admin" &&
        targetUser.status === "active"
      ) {
        const activeAdmins =
          await countActiveAdmins();

        if (activeAdmins <= 1) {
          return NextResponse.json(
            {
              error:
                "You cannot remove the last active administrator.",
            },
            {
              status: 400,
            },
          );
        }
      }

      if (role !== targetUser.role) {
        update.role =
          role as UserRole;

        auditChanges.push({
          field: "role",
          from: targetUser.role,
          to: role,
        });
      }
    }

    if (body.status !== undefined) {
      const status =
        typeof body.status === "string"
          ? body.status
              .trim()
              .toLowerCase()
          : "";

      if (
        !isAllowedUserStatus(
          status,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid account status.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        isSelf &&
        status !== "active"
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot block your own administrator account.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        targetUser.role === "admin" &&
        targetUser.status === "active" &&
        status !== "active"
      ) {
        const activeAdmins =
          await countActiveAdmins();

        if (activeAdmins <= 1) {
          return NextResponse.json(
            {
              error:
                "You cannot disable the last active administrator.",
            },
            {
              status: 400,
            },
          );
        }
      }

      if (status !== targetUser.status) {
        update.status =
          status as UserStatus;

        auditChanges.push({
          field: "status",
          from: targetUser.status,
          to: status,
        });
      }
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

        if (passwordError) {
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

        auditChanges.push({
          field: "password",
          to: "reset",
        });
      }
    }

    if (
      Object.keys(update).length ===
      0
    ) {
      return NextResponse.json({
        message:
          "No changes were required.",

        user: adminSafeUser(
          targetUser,
          actorId,
        ),
      });
    }

    update.updatedAt =
      new Date();

    await collection.updateOne(
      {
        _id: targetUser._id,
      },
      {
        $set: update,
      },
    );

    const updatedUser =
      await collection.findOne({
        _id: targetUser._id,
      });

    if (!updatedUser) {
      return NextResponse.json(
        {
          error:
            "Account could not be reloaded after update.",
        },
        {
          status: 500,
        },
      );
    }

    await createAdminAuditLog({
      actorId,

      actorEmail:
        authorization.user.email,

      action:
        "ACCOUNT_UPDATED",

      targetUserId:
        updatedUser._id.toHexString(),

      targetEmail:
        updatedUser.email,

      changes:
        auditChanges,
    });

    return NextResponse.json({
      message:
        "Account updated successfully.",

      user: adminSafeUser(
        updatedUser,
        actorId,
      ),
    });
  } catch (error) {
    console.error(
      "Admin account PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update account.",
      },
      {
        status: 500,
      },
    );
  }
}


