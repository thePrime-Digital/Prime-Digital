import {
  ObjectId,
  type Document,
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
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const STATUSES = [
  "new",
  "under_review",
  "shortlisted",
  "interview",
  "hired",
  "rejected",
] as const;

type ApplicationStatus =
  (typeof STATUSES)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PatchBody = {
  status?: unknown;
  internalNotes?: unknown;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const {
    id,
  } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid application ID.",
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

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "career_applications",
      );

    const objectId =
      new ObjectId(
        id,
      );

    const existing =
      await collection.findOne({
        _id:
          objectId,
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Application not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updates:
      Record<
        string,
        unknown
      > = {};

    let statusChanged =
      false;

    if (
      body.status !==
      undefined
    ) {
      if (
        typeof body.status !==
          "string" ||
        !STATUSES.includes(
          body.status as
            ApplicationStatus,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid application status.",
          },
          {
            status: 400,
          },
        );
      }

      updates.status =
        body.status;

      statusChanged =
        body.status !==
        existing.status;
    }

    if (
      body.internalNotes !==
      undefined
    ) {
      if (
        typeof body.internalNotes !==
        "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Internal notes must be text.",
          },
          {
            status: 400,
          },
        );
      }

      const notes =
        body.internalNotes.trim();

      if (
        notes.length >
        5000
      ) {
        return NextResponse.json(
          {
            error:
              "Internal notes cannot exceed 5000 characters.",
          },
          {
            status: 400,
          },
        );
      }

      updates.internalNotes =
        notes;
    }

    if (
      Object.keys(
        updates,
      ).length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        },
      );
    }

    const now =
      new Date();

    updates.updatedAt =
      now;

    const updateDocument:
      Document = {
        $set:
          updates,
      };

    if (
      statusChanged
    ) {
      updateDocument.$push = {
        statusHistory: {
          status:
            updates.status,

          at:
            now,

          source:
            "admin",

          changedBy:
            authorization.user._id,

          changedByEmail:
            authorization.user.email,
        },
      };
    }

    await collection.updateOne(
      {
        _id:
          objectId,
      },
      updateDocument,
    );

    const changes:
      Array<{
        field: string;
        from?: unknown;
        to?: unknown;
      }> = [];

    if (
      body.status !==
      undefined &&
      statusChanged
    ) {
      changes.push({
        field:
          "status",

        from:
          existing.status ||
          "new",

        to:
          body.status,
      });
    }

    if (
      body.internalNotes !==
      undefined
    ) {
      changes.push({
        field:
          "internalNotes",

        to:
          "updated",
      });
    }

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CAREER_APPLICATION_UPDATED",

      targetUserId:
        id,

      changes,
    });

    return NextResponse.json({
      message:
        "Application updated successfully.",

      application: {
        id,

        status:
          updates.status ??
          existing.status,

        internalNotes:
          updates.internalNotes ??
          existing.internalNotes ??
          "",
      },
    });
  } catch (error) {
    console.error(
      "Admin career application PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update application.",
      },
      {
        status: 500,
      },
    );
  }
}