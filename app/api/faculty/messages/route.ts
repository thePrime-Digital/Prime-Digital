import {
  ObjectId,
  type Document,
  type Filter,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireFacultyApi,
} from "@/lib/auth/api-faculty-authorization";

import {
  getClassReferenceFilter,
  getFacultyClassFilter,
  objectIdString,
} from "@/lib/faculty/data";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type CreateMessageBody = {
  recipientId?: unknown;
  subject?: unknown;
  body?: unknown;
};

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function serialiseMessage(
  message: Document,
) {
  return {
    id:
      message._id.toHexString(),

    senderId:
      objectIdString(
        message.senderId,
      ),

    senderName:
      String(
        message.senderName ||
          "",
      ),

    senderEmail:
      String(
        message.senderEmail ||
          "",
      ),

    senderRole:
      String(
        message.senderRole ||
          "",
      ),

    recipientId:
      objectIdString(
        message.recipientId,
      ),

    recipientName:
      String(
        message.recipientName ||
          "",
      ),

    recipientEmail:
      String(
        message.recipientEmail ||
          "",
      ),

    recipientRole:
      String(
        message.recipientRole ||
          "",
      ),

    subject:
      String(
        message.subject ||
          "",
      ),

    body:
      String(
        message.body ||
          "",
      ),

    readAt:
      message.readAt instanceof
      Date
        ? message.readAt.toISOString()
        : message.readAt ||
          null,

    createdAt:
      message.createdAt instanceof
      Date
        ? message.createdAt.toISOString()
        : message.createdAt ||
          null,
  };
}

async function getAllowedRecipients(
  user: any,
) {
  const database =
    await getDatabase();

  const users =
    await getUsersCollection();

  const classes =
    await database
      .collection<Document>(
        "classes",
      )
      .find(
        getFacultyClassFilter(
          user,
        ),
      )
      .toArray();

  const classIds =
    classes.map(
      (item) =>
        item._id,
    );

  const enrollments =
    classIds.length >
    0
      ? await database
          .collection<Document>(
            "class_enrollments",
          )
          .find({
            ...getClassReferenceFilter(
              classIds,
            ),

            status: {
              $ne:
                "removed",
            },
          })
          .toArray()
      : [];

  const studentIds =
    Array.from(
      new Set(
        enrollments
          .map(
            (item) =>
              objectIdString(
                item.studentId,
              ),
          )
          .filter(
            (id) =>
              ObjectId.isValid(
                id,
              ),
          ),
      ),
    ).map(
      (id) =>
        new ObjectId(id),
    );

  const recipientFilter:
    Record<
      string,
      unknown
    > = {
    status:
      "active",

    $or: [
      {
        role:
          "admin",
      },
    ],
  };

  if (
    studentIds.length >
    0
  ) {
    recipientFilter.$or = [
      {
        role:
          "admin",
      },

      {
        _id: {
          $in:
            studentIds,
        },

        role:
          "student",
      },
    ];
  }

  const recipients =
    await users
      .find(
        recipientFilter,
      )
      .sort({
        role: 1,
        name: 1,
      })
      .toArray();

  return recipients.map(
    (recipient) => ({
      id:
        recipient._id.toHexString(),

      name:
        recipient.name,

      email:
        recipient.email,

      role:
        recipient.role,
    }),
  );
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const url =
      new URL(request.url);

    const direction =
      url.searchParams.get(
        "direction",
      ) || "all";

    const search =
      url.searchParams
        .get("search")
        ?.trim() || "";

    const userId =
      authorization.user._id;

    const participantFilter =
      direction === "sent"
        ? {
            senderId:
              userId,
          }
        : direction === "inbox"
          ? {
              recipientId:
                userId,
            }
          : {
              $or: [
                {
                  senderId:
                    userId,
                },
                {
                  recipientId:
                    userId,
                },
              ],
            };

    const filter:
      Filter<Document> = {
      ...participantFilter,

      archived: {
        $ne:
          true,
      },
    };

    if (search) {
      const escaped =
        escapeRegex(
          search,
        );

      filter.$and = [
        participantFilter,

        {
          archived: {
            $ne:
              true,
          },
        },

        {
          $or: [
            {
              subject: {
                $regex:
                  escaped,

                $options:
                  "i",
              },
            },

            {
              body: {
                $regex:
                  escaped,

                $options:
                  "i",
              },
            },

            {
              senderName: {
                $regex:
                  escaped,

                $options:
                  "i",
              },
            },

            {
              recipientName: {
                $regex:
                  escaped,

                $options:
                  "i",
              },
            },
          ],
        },
      ];
    }

    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "messages",
      );

    const [
      messages,
      inbox,
      sent,
      unread,
      recipients,
    ] =
      await Promise.all([
        collection
          .find(filter)
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .toArray(),

        collection.countDocuments({
          recipientId:
            userId,

          archived: {
            $ne:
              true,
          },
        }),

        collection.countDocuments({
          senderId:
            userId,

          archived: {
            $ne:
              true,
          },
        }),

        collection.countDocuments({
          recipientId:
            userId,

          readAt:
            null,

          archived: {
            $ne:
              true,
          },
        }),

        getAllowedRecipients(
          authorization.user,
        ),
      ]);

    return NextResponse.json(
      {
        messages:
          messages.map(
            serialiseMessage,
          ),

        recipients,

        counts: {
          inbox,
          sent,
          unread,
        },
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
      "Faculty messages GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load messages.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    CreateMessageBody;

  try {
    body =
      (await request.json()) as CreateMessageBody;
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

  const recipientId =
    typeof body.recipientId ===
    "string"
      ? body.recipientId.trim()
      : "";

  const subject =
    typeof body.subject ===
    "string"
      ? body.subject.trim()
      : "";

  const messageBody =
    typeof body.body ===
    "string"
      ? body.body.trim()
      : "";

  if (
    !ObjectId.isValid(
      recipientId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid recipient.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    subject.length < 2 ||
    subject.length > 150
  ) {
    return NextResponse.json(
      {
        error:
          "Subject must be between 2 and 150 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    messageBody.length < 1 ||
    messageBody.length > 5000
  ) {
    return NextResponse.json(
      {
        error:
          "Message must be between 1 and 5000 characters.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const allowed =
      await getAllowedRecipients(
        authorization.user,
      );

    const allowedRecipient =
      allowed.find(
        (recipient) =>
          recipient.id ===
          recipientId,
      );

    if (!allowedRecipient) {
      return NextResponse.json(
        {
          error:
            "You cannot message this account.",
        },
        {
          status: 403,
        },
      );
    }

    const now =
      new Date();

    const database =
      await getDatabase();

    const result =
      await database
        .collection<Document>(
          "messages",
        )
        .insertOne({
          senderId:
            authorization.user._id,

          senderName:
            authorization.user.name,

          senderEmail:
            authorization.user.email,

          senderRole:
            "faculty",

          recipientId:
            new ObjectId(
              recipientId,
            ),

          recipientName:
            allowedRecipient.name,

          recipientEmail:
            allowedRecipient.email,

          recipientRole:
            allowedRecipient.role,

          subject,

          body:
            messageBody,

          readAt:
            null,

          archived:
            false,

          createdAt:
            now,

          updatedAt:
            now,
        });

    return NextResponse.json(
      {
        message:
          "Message sent successfully.",

        id:
          result.insertedId.toHexString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty message POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to send message.",
      },
      {
        status: 500,
      },
    );
  }
}
