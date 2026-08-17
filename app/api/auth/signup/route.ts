import { MongoServerError } from "mongodb";
import { NextResponse } from "next/server";

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
  createUser,
  findUserByEmail,
  toSafeUser,
} from "@/lib/data/users";
import {
  isPublicSignupRole,
  type UserDocument,
  type UserStatus,
} from "@/types/user";

export const runtime = "nodejs";

interface SignupRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: SignupRequestBody;

  try {
    body =
      (await request.json()) as SignupRequestBody;
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

  const name = normaliseName(body.name);
  const email = normaliseEmail(body.email);
  const phone = normalisePhone(body.phone);

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const requestedRole =
    typeof body.role === "string"
      ? body.role.trim().toLowerCase()
      : "";

  if (!isValidName(name)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid name between 2 and 100 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        error: "Please enter a valid email address.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      {
        error: "Please enter a valid phone number.",
      },
      {
        status: 400,
      },
    );
  }

  const passwordError =
    getPasswordValidationError(password);

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

  if (!isPublicSignupRole(requestedRole)) {
    return NextResponse.json(
      {
        error:
          "Invalid signup role. Public signup is available only for students, faculty and clients.",
      },
      {
        status: 400,
      },
    );
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

    const status: UserStatus =
      requestedRole === "faculty"
        ? "pending"
        : "active";

    const now = new Date();

    const userData: UserDocument = {
      name,
      email,
      phone,
      passwordHash,
      role: requestedRole,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const createdUser =
      await createUser(userData);

    const requiresApproval =
      createdUser.status === "pending";

    return NextResponse.json(
      {
        message: requiresApproval
          ? "Your faculty application has been submitted for approval."
          : "Your account has been created successfully. You can now log in.",
        user: toSafeUser(createdUser),
        requiresApproval,
        canLogin:
          createdUser.status === "active",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
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

    console.error(
      "Signup API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create your account right now.",
      },
      {
        status: 500,
      },
    );
  }
}