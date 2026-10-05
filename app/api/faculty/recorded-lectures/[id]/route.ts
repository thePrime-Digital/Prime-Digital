import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireFacultyApi,
} from "@/lib/auth/api-faculty-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PatchBody = {
  action?: unknown;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const {
    id,
  } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid lecture ID.",
      },
      {
        status:
          400,
      },
    );
  }

  let body:
    PatchBody;

  try {
    body =
      (await request.json()) as
        PatchBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status:
          400,
      },
    );
  }

  const action =
    typeof body.action ===
    "string"
      ? body.action
          .trim()
          .toLowerCase()
      : "";

  if (
    action !==
      "archive" &&
    action !==
      "restore"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid lecture action.",
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const lecture =
      await database
        .collection<Document>(
          "recorded_lectures",
        )
        .findOne({
          _id:
            new ObjectId(
              id,
            ),

          facultyId:
            authorization.user
              ._id,
        });

    if (!lecture) {
      return NextResponse.json(
        {
          error:
            "Recorded lecture not found.",
        },
        {
          status:
            404,
        },
      );
    }

    await database
      .collection<Document>(
        "recorded_lectures",
      )
      .updateOne(
        {
          _id:
            lecture._id,
        },
        {
          $set: {
            status:
              action ===
              "archive"
                ? "archived"
                : "published",

            updatedAt:
              new Date(),
          },
        },
      );

    return NextResponse.json({
      message:
        action ===
        "archive"
          ? "Lecture archived."
          : "Lecture restored.",
    });
  } catch (error) {
    console.error(
      "Faculty recorded lecture PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update the lecture.",
      },
      {
        status:
          500,
      },
    );
  }
}