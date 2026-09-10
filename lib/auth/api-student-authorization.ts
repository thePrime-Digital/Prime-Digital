import {
  NextResponse,
} from "next/server";

import {
  getCurrentUser,
} from "@/lib/auth/current-user";

export async function requireStudentApi() {
  const user =
    await getCurrentUser();

  if (!user) {
    return {
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
    "student"
  ) {
    return {
      response:
        NextResponse.json(
          {
            error:
              "Student access required.",
          },
          {
            status: 403,
          },
        ),
    };
  }

  return {
    user,
  };
}