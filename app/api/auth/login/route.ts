import { NextResponse } from "next/server";

import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import {
  isValidEmail,
  normaliseEmail,
} from "@/lib/auth/validation";
import {
  findUserByEmail,
  toSafeUser,
} from "@/lib/data/users";

export const runtime = "nodejs";

interface LoginRequestBody {
  email?: unknown;
  password?: unknown;
}

function getRedirectPath(role: string): string {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "faculty") {
    return "/faculty";
  }

  if (role === "client") {
    return "/client-dashboard";
  }

  return "/dashboard";
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = normaliseEmail(body.email);

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!isValidEmail(email) || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    const passwordMatches = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    if (user.status === "pending") {
      return NextResponse.json(
        {
          error: "Your account is awaiting admin approval.",
          code: "ACCOUNT_PENDING",
          role: user.role,
          status: user.status,
        },
        { status: 403 },
      );
    }

    if (user.status === "blocked") {
      return NextResponse.json(
        {
          error:
            "Your account has been blocked. Please contact support.",
          code: "ACCOUNT_BLOCKED",
          role: user.role,
          status: user.status,
        },
        { status: 403 },
      );
    }

    const sessionToken = await createSessionToken({
      userId: user._id.toHexString(),
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json(
      {
        message: "Login successful.",
        user: toSafeUser(user),
        redirectTo: getRedirectPath(user.role),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { error: "Unable to log in right now." },
      { status: 500 },
    );
  }
}
