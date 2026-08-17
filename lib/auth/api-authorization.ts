import type {
  WithId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  getSessionFromCookies,
} from "@/lib/auth/session";

import {
  findUserById,
} from "@/lib/data/users";

import type {
  UserDocument,
} from "@/types/user";

type AdminApiSuccess = {
  ok: true;
  user: WithId<UserDocument>;
};

type AdminApiFailure = {
  ok: false;
  response: NextResponse;
};

export type AdminApiAuthorization =
  | AdminApiSuccess
  | AdminApiFailure;

export async function requireAdminApi(): Promise<
  AdminApiAuthorization
> {
  const session =
    await getSessionFromCookies();

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Authentication required.",
          code: "UNAUTHENTICATED",
        },
        {
          status: 401,
        },
      ),
    };
  }

  const user = await findUserById(
    session.userId,
  );

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "The account connected to this session no longer exists.",
          code: "ACCOUNT_NOT_FOUND",
        },
        {
          status: 401,
        },
      ),
    };
  }

  if (user.status !== "active") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            user.status === "blocked"
              ? "This account has been blocked."
              : "This account is awaiting approval.",
          code:
            user.status === "blocked"
              ? "ACCOUNT_BLOCKED"
              : "ACCOUNT_PENDING",
        },
        {
          status: 403,
        },
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Administrator access is required.",
          code: "ADMIN_REQUIRED",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return {
    ok: true,
    user,
  };
}
