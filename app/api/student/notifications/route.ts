import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type PatchBody = {
  action?: unknown;
};

function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    return value.toISOString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return null;
}

function idValue(
  value: unknown,
): string {
  if (
    value instanceof
    ObjectId
  ) {
    return value.toHexString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return "";
}

function notificationFilter(
  user: {
    _id: ObjectId;
  },
) {
  return {
    status:
      "published",

    $or: [
      {
        audienceType:
          "all",
      },

      {
        audienceType:
          "role",

        audienceRole:
          "student",
      },

      {
        audienceType:
          "user",

        audienceUserId:
          user._id,
      },

      {
        audienceType:
          "user",

        audienceUserId:
          user._id.toHexString(),
      },
    ],
  };
}

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const user =
      authorization.user;

    const notifications =
      await database
        .collection<Document>(
          "notifications",
        )
        .find(
          notificationFilter(
            user,
          ),
        )
        .sort({
          publishedAt:
            -1,

          createdAt:
            -1,
        })
        .limit(
          50,
        )
        .toArray();

    const userId =
      user._id.toHexString();

    return NextResponse.json(
      {
        notifications:
          notifications.map(
            (item) => {
              const readBy =
                Array.isArray(
                  item.readBy,
                )
                  ? item.readBy
                  : [];

              return {
                id:
                  item._id.toHexString(),

                title:
                  String(
                    item.title ||
                      "Notification",
                  ),

                message:
                  String(
                    item.message ||
                      "",
                  ),

                severity:
                  String(
                    item.severity ||
                      "info",
                  ),

                category:
                  String(
                    item.category ||
                      "",
                  ),

                isRead:
                  readBy.some(
                    (
                      value,
                    ) =>
                      idValue(
                        value,
                      ) ===
                      userId,
                  ),

                createdAt:
                  dateValue(
                    item.publishedAt ||
                      item.createdAt,
                  ),
              };
            },
          ),
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
      "Student notifications error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load notifications.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
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
        status: 400,
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
    "mark_all_read"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid notification action.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    await database
      .collection<Document>(
        "notifications",
      )
      .updateMany(
        notificationFilter(
          authorization.user,
        ),
        {
          $addToSet: {
            readBy:
              authorization.user._id,
          },

          $set: {
            updatedAt:
              new Date(),
          },
        },
      );

    return NextResponse.json({
      message:
        "Notifications marked as read.",
    });
  } catch (error) {
    console.error(
      "Student notification PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update notifications.",
      },
      {
        status: 500,
      },
    );
  }
}