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

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const notifications =
      await database
        .collection<Document>(
          "notifications",
        )
        .find({
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
        })
        .sort({
          publishedAt: -1,
          createdAt: -1,
        })
        .limit(100)
        .toArray();

    const notificationIds =
      notifications.map(
        (item) =>
          item._id,
      );

    const reads =
      notificationIds.length >
      0
        ? await database
            .collection<Document>(
              "notification_reads",
            )
            .find({
              userId:
                authorization.user._id,

              notificationId: {
                $in:
                  notificationIds,
              },
            })
            .toArray()
        : [];

    const readSet =
      new Set(
        reads.map(
          (item) =>
            item.notificationId instanceof
            ObjectId
              ? item.notificationId.toHexString()
              : String(
                  item.notificationId ||
                    "",
                ),
        ),
      );

    return NextResponse.json(
      {
        notifications:
          notifications.map(
            (item) => ({
              id:
                item._id.toHexString(),

              title:
                String(
                  item.title ||
                    "",
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

              isRead:
                readSet.has(
                  item._id.toHexString(),
                ),

              createdAt:
                item.createdAt instanceof
                Date
                  ? item.createdAt.toISOString()
                  : item.createdAt ||
                    null,

              publishedAt:
                item.publishedAt instanceof
                Date
                  ? item.publishedAt.toISOString()
                  : item.publishedAt ||
                    null,
            }),
          ),

        unread:
          notifications.filter(
            (item) =>
              !readSet.has(
                item._id.toHexString(),
              ),
          ).length,
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
      "Faculty notifications error:",
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
