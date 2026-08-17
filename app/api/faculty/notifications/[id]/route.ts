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

export async function PATCH(
  _request: Request,
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

  const { id } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid notification ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const notificationId =
      new ObjectId(
        id,
      );

    const notification =
      await database
        .collection<Document>(
          "notifications",
        )
        .findOne({
          _id:
            notificationId,

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
                "faculty",
            },

            {
              audienceType:
                "user",

              audienceUserId:
                authorization.user._id,
            },

            {
              audienceType:
                "user",

              audienceUserId:
                authorization.user._id.toHexString(),
            },
          ],
        });

    if (!notification) {
      return NextResponse.json(
        {
          error:
            "Notification not found.",
        },
        {
          status: 404,
        },
      );
    }

    await database
      .collection<Document>(
        "notification_reads",
      )
      .updateOne(
        {
          notificationId,
          userId:
            authorization.user._id,
        },
        {
          $set: {
            readAt:
              new Date(),
          },

          $setOnInsert: {
            notificationId,
            userId:
              authorization.user._id,

            createdAt:
              new Date(),
          },
        },
        {
          upsert:
            true,
        },
      );

    return NextResponse.json({
      message:
        "Notification marked as read.",
    });
  } catch (error) {
    console.error(
      "Faculty notification PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update notification.",
      },
      {
        status: 500,
      },
    );
  }
}
