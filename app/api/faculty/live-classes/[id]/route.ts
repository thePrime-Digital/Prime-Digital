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
  getFacultyReferenceFilter,
} from "@/lib/faculty/data";

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
  recordingUrl?: unknown;
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
          "Invalid session ID.",
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

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "faculty_sessions",
      );

    const session =
      await collection.findOne({
        _id:
          new ObjectId(
            id,
          ),

        ...getFacultyReferenceFilter(
          authorization.user,
        ),
      });

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Live class session not found.",
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
      action ===
      "start"
    ) {
      update.status =
        "live";

      update.startedAt =
        new Date();
    } else if (
      action ===
      "complete"
    ) {
      update.status =
        "completed";

      update.endedAt =
        new Date();
    } else if (
      action ===
      "cancel"
    ) {
      update.status =
        "cancelled";
    } else if (
      action ===
      "recording"
    ) {
      const recordingUrl =
        typeof body.recordingUrl ===
        "string"
          ? body.recordingUrl.trim()
          : "";

      if (!recordingUrl) {
        return NextResponse.json(
          {
            error:
              "Recording URL is required.",
          },
          {
            status: 400,
          },
        );
      }

      update.recordingUrl =
        recordingUrl;
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid live class action.",
        },
        {
          status: 400,
        },
      );
    }

    await collection.updateOne(
      {
        _id:
          session._id,
      },
      {
        $set:
          update,
      },
    );

    return NextResponse.json({
      message:
        action ===
        "start"
          ? "Live class started."
          : action ===
            "complete"
            ? "Live class completed."
            : action ===
              "cancel"
              ? "Live class cancelled."
              : "Recording saved.",
    });
  } catch (error) {
    console.error(
      "Faculty live class PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update live class.",
      },
      {
        status: 500,
      },
    );
  }
}
