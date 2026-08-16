import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  getSessionFromCookies,
} from "@/lib/auth/session";
import {
  findUserById,
  toSafeUser,
} from "@/lib/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const session =
      await getSessionFromCookies();

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "You are not logged in.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    const user = await findUserById(
      session.userId,
    );

    if (!user) {
      await clearSessionCookie();

      return NextResponse.json(
        {
          authenticated: false,
          error:
            "The account connected to this session no longer exists.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    if (user.status !== "active") {
      await clearSessionCookie();

      return NextResponse.json(
        {
          authenticated: false,
          error:
            user.status === "blocked"
              ? "Your account has been blocked."
              : "Your account is awaiting approval.",
          code:
            user.status === "blocked"
              ? "ACCOUNT_BLOCKED"
              : "ACCOUNT_PENDING",
        },
        {
          status: 403,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: toSafeUser(user),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error: unknown) {
    console.error(
      "Current-user API error:",
      error,
    );

    return NextResponse.json(
      {
        authenticated: false,
        error:
          "Unable to verify your session.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  }
}