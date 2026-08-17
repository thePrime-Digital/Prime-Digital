import type {
  Filter,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  createUser,
  findUserByEmail,
  getUsersCollection,
} from "@/lib/data/users";

import {
  adminSafeUser,
  escapeRegex,
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

type CreateAccountBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;
  status?: unknown;
};

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  try {
    const url = new URL(request.url);

    const role =
      url.searchParams.get("role");

    const status =
      url.searchParams.get("status");

    const search =
      url.searchParams
        .get("search")
        ?.trim() || "";

    const requestedPage =
      Number(
        url.searchParams.get("page") || "1",
      );

    const requestedLimit =
      Number(
        url.searchParams.get("limit") || "25",
      );

    const page =
      Number.isFinite(requestedPage) &&
      requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit)
        ? Math.min(
            Math.max(
              Math.floor(requestedLimit),
              1,
            ),
            100,
          )
        : 25;

    const filter: Filter<UserDocument> = {};

    if (
      role &&
      isAllowedAdminRole(role)
    ) {
      filter.role = role;
    }

    if (
      status &&
      isAllowedUserStatus(status)
    ) {
      filter.status = status;
    }

    if (search) {
      const escaped = escapeRegex(search);

      filter.$or = [
        {
          name: {
            $regex: escaped,
            $options: "i",
          },
        },
        {
          email: {
            $regex: escaped,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: escaped,
            $options: "i",
          },
        },
      ];
    }

    const summaryFilter: Filter<UserDocument> = {};

    if (
      role &&
      isAllowedAdminRole(role)
    ) {
      summaryFilter.role = role;
    }

    const collection =
      await getUsersCollection();

    const [
      users,
      filteredTotal,
      totalAccounts,
      students,
      faculty,
      clients,
      admins,
      active,
      pending,
      blocked,
    ] = await Promise.all([
      collection
        .find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(
          (page - 1) * limit,
        )
        .limit(limit)
        .toArray(),

      collection.countDocuments(filter),

      collection.countDocuments(),

      collection.countDocuments({
        role: "student",
      }),

      collection.countDocuments({
        role: "faculty",
      }),

      collection.countDocuments({
        role: "client",
      }),

      collection.countDocuments({
        role: "admin",
      }),

      collection.countDocuments({
        status: "active",
      }),

      collection.countDocuments({
        status: "pending",
      }),

      collection.countDocuments({
        status: "blocked",
      }),
    ]);

    const [
      summaryTotal,
      summaryActive,
      summaryPending,
      summaryBlocked,
    ] = await Promise.all([
      collection.countDocuments(
        summaryFilter,
      ),

      collection.countDocuments({
        ...summaryFilter,
        status: "active",
      }),

      collection.countDocuments({
        ...summaryFilter,
        status: "pending",
      }),

      collection.countDocuments({
        ...summaryFilter,
        status: "blocked",
      }),
    ]);

    const currentAdminId =
      authorization.user._id.toHexString();

    return NextResponse.json(
      {
        users: users.map((user) =>
          adminSafeUser(
            user,
            currentAdminId,
          ),
        ),

        pagination: {
          page,
          limit,
          total: filteredTotal,
          totalPages: Math.max(
            1,
            Math.ceil(
              filteredTotal / limit,
            ),
          ),
        },

        counts: {
          total: totalAccounts,
          students,
          faculty,
          clients,
          admins,
          active,
          pending,
          blocked,
        },

        summary: {
          total: summaryTotal,
          active: summaryActive,
          pending: summaryPending,
          blocked: summaryBlocked,
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
      "Admin users GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load accounts.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  let body: CreateAccountBody;

  try {
    body =
      (await request.json()) as CreateAccountBody;
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

  const name =
    normaliseName(body.name);

  const email =
    normaliseEmail(body.email);

  const phone =
    normalisePhone(body.phone);

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const roleValue =
    typeof body.role === "string"
      ? body.role
          .trim()
          .toLowerCase()
      : "";

  const statusValue =
    typeof body.status === "string"
      ? body.status
          .trim()
          .toLowerCase()
      : "";

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

  if (
    !isAllowedAdminRole(roleValue)
  ) {
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

  const passwordError =
    getPasswordValidationError(
      password,
    );

  if (passwordError) {
    return NextResponse.json(
      {
        error: passwordError,
      },
      {
        status: 400,
      },
    );
  }

  let status: UserStatus;

  if (
    statusValue &&
    isAllowedUserStatus(
      statusValue,
    )
  ) {
    status = statusValue;
  } else {
    status =
      roleValue === "faculty"
        ? "pending"
        : "active";
  }

  try {
    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await hashPassword(password);

    const now = new Date();

    const userData: UserDocument = {
      name,
      email,
      phone,
      passwordHash,
      role: roleValue as UserRole,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const created =
      await createUser(userData);

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "ACCOUNT_CREATED",

      targetUserId:
        created._id.toHexString(),

      targetEmail:
        created.email,

      changes: [
        {
          field: "role",
          to: created.role,
        },
        {
          field: "status",
          to: created.status,
        },
      ],
    });

    return NextResponse.json(
      {
        message:
          "Account created successfully.",

        user: adminSafeUser(
          created,
          authorization.user._id.toHexString(),
        ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Admin account creation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create account.",
      },
      {
        status: 500,
      },
    );
  }
}


