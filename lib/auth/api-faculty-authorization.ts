import {
  NextResponse,
} from "next/server";

import {
  getCurrentUser,
} from "@/lib/auth/current-user";

type CurrentUser =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getCurrentUser
      >
    >
  >;

export type FacultyApiAuthorization =
  | {
      ok: true;
      user: CurrentUser;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function requireFacultyApi():
  Promise<FacultyApiAuthorization> {
  const user =
    await getCurrentUser();

  if (!user) {
    return {
      ok: false,

      response:
        NextResponse.json(
          {
            error:
              "Authentication required.",
          },
          {
            status: 401,
          },
        ),
    };
  }

  if (
    user.role !==
    "faculty"
  ) {
    return {
      ok: false,

      response:
        NextResponse.json(
          {
            error:
              "Faculty access required.",
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
