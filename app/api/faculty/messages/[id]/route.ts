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
          "Invalid message ID.",
      },
      {
        status: 400,
      },
    );
  }

  let body:
    PatchBody;

  try {
    body =
      (await request.json()) as PatchBody;
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
      "read" &&
    action !==
      "archive"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid message action.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "messages",
      );

    const message =
      await collection.findOne({
        _id:
          new ObjectId(
            id,
          ),

        $or: [
          {
            senderId:
              authorization.user._id,
          },

          {
            recipientId:
              authorization.user._id,
          },
        ],
      });

    if (!message) {
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

    const update:
      Record<
        string,
        unknown
      > = {
      updatedAt:
        new Date(),
    };

    if (
      action === "read"
    ) {
      update.readAt =
        new Date();
    }

    if (
      action ===
      "archive"
    ) {
      update.archived =
        true;
    }

    await collection.updateOne(
      {
        _id:
          message._id,
      },
      {
        $set:
          update,
      },
    );

    return NextResponse.json({
      message:
        "Message updated successfully.",
    });
  } catch (error) {
    console.error(
      "Faculty message PATCH error:",
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
