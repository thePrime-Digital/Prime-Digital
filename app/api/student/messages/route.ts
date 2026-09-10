import {
  ObjectId,
  type Document,
  type Filter,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

import {
  objectAndStringValues,
  objectIdString,
  studentReferenceValues,
} from "@/lib/student/data";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

import type {
  UserDocument,
} from "@/types/user";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type CreateMessageBody = {
  recipientId?: unknown;
  subject?: unknown;
  body?: unknown;
};

type PatchBody = {
  messageId?: unknown;
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
  user: {
    _id: ObjectId;
  },
) {
  const database =
    await getDatabase();

  const users =
    await getUsersCollection();

  const enrollments =
    await database
      .collection<Document>(
        "class_enrollments",
      )
      .find({
        studentId: {
          $in:
            studentReferenceValues(
              user,
            ),
        },

        status: {
          $ne:
            "removed",
        },
      })
      .toArray();

  const classIds =
    Array.from(
      new Set(
        enrollments
          .map(
            (item) =>
              objectIdString(
                item.classId,
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

  const classes =
    classIds.length >
    0
      ? await database
          .collection<Document>(
            "classes",
          )
          .find({
            _id: {
              $in:
                classIds,
            },
          })
          .toArray()
      : [];

  const facultyIds =
    new Set<string>();

  const facultyEmails =
    new Set<string>();

  const facultyNames =
    new Set<string>();

  for (
    const item
    of classes
  ) {
    const facultyId =
      objectIdString(
        item.facultyId,
      );

    if (
      ObjectId.isValid(
        facultyId,
      )
    ) {
      facultyIds.add(
        facultyId,
      );
    }

    if (
      typeof item.facultyEmail ===
        "string" &&
      item.facultyEmail.trim()
    ) {
      facultyEmails.add(
        item.facultyEmail
          .trim()
          .toLowerCase(),
      );
    }

    if (
      typeof item.faculty ===
        "string" &&
      item.faculty.trim()
    ) {
      const faculty =
        item.faculty.trim();

      if (
        faculty.includes(
          "@",
        )
      ) {
        facultyEmails.add(
          faculty.toLowerCase(),
        );
      } else {
        facultyNames.add(
          faculty,
        );
      }
    }
  }

  const facultyMatchers:
    Filter<UserDocument>[] = [];

  const facultyObjectIds =
    Array.from(
      facultyIds,
    ).map(
      (id) =>
        new ObjectId(id),
    );

  if (
    facultyObjectIds.length >
    0
  ) {
    facultyMatchers.push({
      _id: {
        $in:
          facultyObjectIds,
      },
    });
  }

  if (
    facultyEmails.size >
    0
  ) {
    facultyMatchers.push({
      email: {
        $in:
          Array.from(
            facultyEmails,
          ),
      },
    });
  }

  if (
    facultyNames.size >
    0
  ) {
    facultyMatchers.push({
      name: {
        $in:
          Array.from(
            facultyNames,
          ),
      },
    });
  }

  const recipientOptions:
    Filter<UserDocument>[] = [
      {
        role:
          "admin",

        status:
          "active",
      },
    ];

  if (
    facultyMatchers.length >
    0
  ) {
    recipientOptions.push({
      role:
        "faculty",

      status:
        "active",

      $or:
        facultyMatchers,
    });
  }

  const recipients =
    await users
      .find({
        $or:
          recipientOptions,
      })
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
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const url =
      new URL(
        request.url,
      );

    const direction =
      url.searchParams.get(
        "direction",
      ) ||
      "all";

    const search =
      url.searchParams
        .get(
          "search",
        )
        ?.trim() ||
      "";

    const user =
      authorization.user;

    const participantValues =
      studentReferenceValues(
        user,
      );

    const participantFilter:
      Filter<Document> =
      direction === "sent"
        ? {
            senderId: {
              $in:
                participantValues,
            },
          }
        : direction ===
            "inbox"
          ? {
              recipientId: {
                $in:
                  participantValues,
              },
            }
          : {
              $or: [
                {
                  senderId: {
                    $in:
                      participantValues,
                  },
                },
                {
                  recipientId: {
                    $in:
                      participantValues,
                  },
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
          .find(
            filter,
          )
          .sort({
            createdAt:
              -1,
          })
          .limit(
            100,
          )
          .toArray(),

        collection.countDocuments({
          recipientId: {
            $in:
              participantValues,
          },

          archived: {
            $ne:
              true,
          },
        }),

        collection.countDocuments({
          senderId: {
            $in:
              participantValues,
          },

          archived: {
            $ne:
              true,
          },
        }),

        collection.countDocuments({
          recipientId: {
            $in:
              participantValues,
          },

          readAt:
            null,

          archived: {
            $ne:
              true,
          },
        }),

        getAllowedRecipients(
          user,
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
      "Student messages GET error:",
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
    await requireStudentApi();

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
      (await request.json()) as
        CreateMessageBody;
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
    subject.length <
      2 ||
    subject.length >
      150
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
    messageBody.length <
      1 ||
    messageBody.length >
      5000
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

    const recipient =
      allowed.find(
        (item) =>
          item.id ===
          recipientId,
      );

    if (!recipient) {
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

    const database =
      await getDatabase();

    const now =
      new Date();

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
            "student",

          recipientId:
            new ObjectId(
              recipientId,
            ),

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
      "Student message POST error:",
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

  const messageId =
    typeof body.messageId ===
    "string"
      ? body.messageId.trim()
      : "";

  if (
    !ObjectId.isValid(
      messageId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid message ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const result =
      await database
        .collection<Document>(
          "messages",
        )
        .updateOne(
          {
            _id:
              new ObjectId(
                messageId,
              ),

            recipientId: {
              $in:
                studentReferenceValues(
                  authorization.user,
                ),
            },
          },
          {
            $set: {
              readAt:
                new Date(),

              updatedAt:
                new Date(),
            },
          },
        );

    if (
      result.matchedCount ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Message not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message:
        "Message marked as read.",
    });
  } catch (error) {
    console.error(
      "Student message PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update message.",
      },
      {
        status: 500,
      },
    );
  }
}