 import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import {
  isUserRole,
  type UserRole,
} from "@/types/user";

export const SESSION_COOKIE_NAME =
  "prime_digital_session";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7;

const JWT_ISSUER = "prime-digital-school";
const JWT_AUDIENCE = "prime-digital-school-users";

export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
}

let cachedSecretKey: Uint8Array | null = null;

function getJwtSecretKey(): Uint8Array {
  if (cachedSecretKey) {
    return cachedSecretKey;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is missing. Add it to your .env.local file.",
    );
  }

  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 bytes.",
    );
  }

  cachedSecretKey = new TextEncoder().encode(secret);

  return cachedSecretKey;
}

export async function createSessionToken(
  session: SessionData,
): Promise<string> {
  const currentTimestamp = Math.floor(
    Date.now() / 1000,
  );

  return new SignJWT({
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(session.userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt(currentTimestamp)
    .setExpirationTime(
      currentTimestamp + SESSION_DURATION_SECONDS,
    )
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionData> {
  const { payload } = await jwtVerify(
    token,
    getJwtSecretKey(),
    {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    },
  );

  if (!payload.sub) {
    throw new Error(
      "Session token does not contain a user ID.",
    );
  }

  if (typeof payload.email !== "string") {
    throw new Error(
      "Session token does not contain an email.",
    );
  }

  if (!isUserRole(payload.role)) {
    throw new Error(
      "Session token contains an invalid role.",
    );
  }

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export async function setSessionCookie(
  token: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  );
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    },
  );
}

export async function getSessionFromCookies(): Promise<
  SessionData | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME,
  )?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}