import { NextResponse } from "next/server";
import { login as selfIamLogin, ContactKitError, type ContactKitConfig } from "self-iam";

import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import {
  isValidEmail,
  normaliseEmail,
} from "@/lib/auth/validation";
import {
  findUserByEmail,
  toSafeUser,
} from "@/lib/data/users";
import { hashPassword } from "@/lib/auth/password";

export const runtime = "nodejs";

const selfIamConfig: ContactKitConfig | null =
  process.env.NEXT_PUBLIC_SELFIAM_API_URL &&
  process.env.SELFIAM_PUBLISHABLE_KEY
    ? {
        apiUrl: process.env.NEXT_PUBLIC_SELFIAM_API_URL,
        publishableKey: process.env.SELFIAM_PUBLISHABLE_KEY,
      }
    : null;

function getRedirectPath(role: string): string {
  if (role === "admin") return "/admin";
  if (role === "faculty") return "/faculty";
  if (role === "client") return "/client-dashboard";
  return "/dashboard";
}

async function loginLocal(
  email: string,
  password: string,
): Promise<NextResponse> {
  const localUser = await findUserByEmail(email);

  if (!localUser) {
    return NextResponse.json(
      { error: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
      { status: 401 },
    );
  }

  const passwordMatches = await verifyPasswordHash(password, localUser.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
      { status: 401 },
    );
  }

  if (localUser.status === "pending") {
    return NextResponse.json(
      { error: "Your account is awaiting admin approval.", code: "ACCOUNT_PENDING", role: localUser.role, status: localUser.status },
      { status: 403 },
    );
  }

  if (localUser.status === "blocked") {
    return NextResponse.json(
      { error: "Your account has been blocked. Please contact support.", code: "ACCOUNT_BLOCKED", role: localUser.role, status: localUser.status },
      { status: 403 },
    );
  }

  const sessionToken = await createSessionToken({
    userId: localUser._id.toHexString(),
    email: localUser.email,
    role: localUser.role,
  });

  await setSessionCookie(sessionToken);

  return NextResponse.json(
    { message: "Login successful.", user: toSafeUser(localUser), redirectTo: getRedirectPath(localUser.role) },
    { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = normaliseEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!isValidEmail(email) || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    if (selfIamConfig) {
      try {
        await selfIamLogin(
          { method: "email", identity: email, password },
          selfIamConfig,
        );
      } catch (err: unknown) {
        if (err instanceof ContactKitError) {
          if (err.status === 401 || err.status === 404) {
            return loginLocal(email, password);
          }
          console.error("self-IAM login error:", err.message, err.status);
          return NextResponse.json(
            { error: "Unable to log in right now. Please try again." },
            { status: 500 },
          );
        }
        console.error("self-IAM login error:", err);
        return loginLocal(email, password);
      }

      const localUser = await findUserByEmail(email);

      if (!localUser) {
        return NextResponse.json(
          { error: "Account not found locally. Please sign up first.", code: "ACCOUNT_NOT_FOUND" },
          { status: 401 },
        );
      }

      if (localUser.status === "pending") {
        return NextResponse.json(
          { error: "Your account is awaiting admin approval.", code: "ACCOUNT_PENDING", role: localUser.role, status: localUser.status },
          { status: 403 },
        );
      }

      if (localUser.status === "blocked") {
        return NextResponse.json(
          { error: "Your account has been blocked. Please contact support.", code: "ACCOUNT_BLOCKED", role: localUser.role, status: localUser.status },
          { status: 403 },
        );
      }

      const sessionToken = await createSessionToken({
        userId: localUser._id.toHexString(),
        email: localUser.email,
        role: localUser.role,
      });

      await setSessionCookie(sessionToken);

      return NextResponse.json(
        { message: "Login successful.", user: toSafeUser(localUser), redirectTo: getRedirectPath(localUser.role) },
        { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    return loginLocal(email, password);
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Unable to log in right now." },
      { status: 500 },
    );
  }
}
