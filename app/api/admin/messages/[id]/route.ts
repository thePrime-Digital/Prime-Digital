import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBody = {
  action?: unknown;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  if (!ObjectId.isValid(id)) {
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
    UpdateBody;

  try {
    body =
      (await request.json()) as UpdateBody;
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
    action !== "read" &&
    action !== "archive" &&
    action !== "unarchive"
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
      database.collection(
        "messages",
      );

    const objectId =
      new ObjectId(id);

    const message =
      await collection.findOne({
        _id:
          objectId,

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
      Record<string, unknown> = {
        updatedAt:
          new Date(),
      };

    if (action === "read") {
      update.readAt =
        new Date();
    }

    if (action === "archive") {
      update.archived =
        true;
    }

    if (action === "unarchive") {
      update.archived =
        false;
    }

    await collection.updateOne(
      {
        _id:
          objectId,
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
      "Admin message PATCH error:",
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
