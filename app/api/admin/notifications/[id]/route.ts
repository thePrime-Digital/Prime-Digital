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
  status?: unknown;
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
          "Invalid notification ID.",
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

  const status =
    typeof body.status ===
    "string"
      ? body.status
          .trim()
          .toLowerCase()
      : "";

  if (
    ![
      "draft",
      "published",
      "archived",
    ].includes(
      status,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid notification status.",
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
        "notifications",
      );

    const objectId =
      new ObjectId(id);

    const existing =
      await collection.findOne({
        _id:
          objectId,
      });

    if (!existing) {
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

    await collection.updateOne(
      {
        _id:
          objectId,
      },
      {
        $set: {
          status,

          publishedAt:
            status ===
            "published"
              ? existing.publishedAt ||
                new Date()
              : existing.publishedAt ||
                null,

          updatedAt:
            new Date(),
        },
      },
    );

    return NextResponse.json({
      message:
        status === "published"
          ? "Notification published."
          : status ===
            "archived"
            ? "Notification archived."
            : "Notification moved to draft.",
    });
  } catch (error) {
    console.error(
      "Admin notification PATCH error:",
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
