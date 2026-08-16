import {
  ObjectId,
  type Document,
  type Filter,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  createAdminAuditLog,
} from "@/lib/data/admin-audit";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      message.senderId instanceof ObjectId
        ? message.senderId.toHexString()
        : String(message.senderId || ""),

    senderName:
      String(message.senderName || ""),

    senderEmail:
      String(message.senderEmail || ""),

    senderRole:
      String(message.senderRole || ""),

    recipientId:
      message.recipientId instanceof ObjectId
        ? message.recipientId.toHexString()
        : String(message.recipientId || ""),

    recipientName:
      String(message.recipientName || ""),

    recipientEmail:
      String(message.recipientEmail || ""),

    recipientRole:
      String(message.recipientRole || ""),

    subject:
      String(message.subject || ""),

    body:
      String(message.body || ""),

    readAt:
      message.readAt instanceof Date
        ? message.readAt.toISOString()
        : message.readAt || null,

    archived:
      message.archived === true,

    createdAt:
      message.createdAt instanceof Date
        ? message.createdAt.toISOString()
        : message.createdAt || null,
  };
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
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

    const adminId =
      authorization.user._id;

    const participantFilter =
      direction === "sent"
        ? {
            senderId:
              adminId,
          }
        : direction === "inbox"
          ? {
              recipientId:
                adminId,
            }
          : {
              $or: [
                {
                  senderId:
                    adminId,
                },
                {
                  recipientId:
                    adminId,
                },
              ],
            };

    const filter:
      Filter<Document> = {
        ...participantFilter,
        archived: {
          $ne: true,
        },
      };

    if (search) {
      const escaped =
        escapeRegex(search);

      filter.$and = [
        {
          ...participantFilter,
        },
        {
          archived: {
            $ne: true,
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
            {
              senderEmail: {
                $regex:
                  escaped,
                $options:
                  "i",
              },
            },
            {
              recipientEmail: {
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

    const messages =
      await collection
        .find(filter)
        .sort({
          createdAt: -1,
        })
        .limit(100)
        .toArray();

    const [
      inbox,
      sent,
      unread,
    ] =
      await Promise.all([
        collection.countDocuments({
          recipientId:
            adminId,
          archived: {
            $ne: true,
          },
        }),

        collection.countDocuments({
          senderId:
            adminId,
          archived: {
            $ne: true,
          },
        }),

        collection.countDocuments({
          recipientId:
            adminId,
          readAt: null,
          archived: {
            $ne: true,
          },
        }),
      ]);

    return NextResponse.json(
      {
        messages:
          messages.map(
            serialiseMessage,
          ),

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
      "Admin messages GET error:",
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
    await requireAdminApi();

  if ("response" in authorization) {
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

  if (!ObjectId.isValid(recipientId)) {
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
    authorization.user._id.toHexString() ===
    recipientId
  ) {
    return NextResponse.json(
      {
        error:
          "You cannot send a message to your own account.",
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
    const users =
      await getUsersCollection();

    const recipient =
      await users.findOne({
        _id:
          new ObjectId(
            recipientId,
          ),
      });

    if (!recipient) {
      return NextResponse.json(
        {
          error:
            "Recipient account was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      recipient.status ===
      "blocked"
    ) {
      return NextResponse.json(
        {
          error:
            "Messages cannot be sent to a blocked account.",
        },
        {
          status: 400,
        },
      );
    }

    const database =
      await getDatabase();

    const collection =
      database.collection(
        "messages",
      );

    const now =
      new Date();

    const result =
      await collection.insertOne(
        {
          senderId:
            authorization.user._id,

          senderName:
            authorization.user.name,

          senderEmail:
            authorization.user.email,

          senderRole:
            "admin",

          recipientId:
            recipient._id,

          recipientName:
            recipient.name,

          recipientEmail:
            recipient.email,

          recipientRole:
            recipient.role,

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
        },
      );

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "MESSAGE_SENT",

      targetUserId:
        recipient._id.toHexString(),

      targetEmail:
        recipient.email,

      changes: [
        {
          field:
            "subject",
          to:
            subject,
        },
      ],
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
      "Admin message POST error:",
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
