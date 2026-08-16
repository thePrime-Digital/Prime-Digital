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
  getAdminResourceConfig,
} from "@/lib/admin/admin-resource-registry";

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

type RouteContext = {
  params: Promise<{
    resource: string;
    id: string;
  }>;
};

type UpdateBody = {
  status?: unknown;
  adminNote?: unknown;
};

function serialiseValue(
  value: unknown,
): unknown {
  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }

  if (
    value &&
    typeof value ===
      "object" &&
    "toHexString" in value &&
    typeof (
      value as {
        toHexString?: unknown;
      }
    ).toHexString ===
      "function"
  ) {
    return (
      value as {
        toHexString(): string;
      }
    ).toHexString();
  }

  if (Array.isArray(value)) {
    return value.map(
      serialiseValue,
    );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    const result:
      Record<string, unknown> =
        {};

    for (
      const [
        key,
        childValue,
      ] of Object.entries(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      result[key] =
        serialiseValue(
          childValue,
        );
    }

    return result;
  }

  return value;
}

function safeDocument(
  document: Document,
  defaultStatus: string,
) {
  const data:
    Record<string, unknown> =
      {};

  for (
    const [key, value]
    of Object.entries(
      document,
    )
  ) {
    if (
      [
        "password",
        "passwordHash",
        "token",
        "secret",
      ].includes(key)
    ) {
      continue;
    }

    if (
      key === "_id" ||
      key === "status" ||
      key === "adminNote" ||
      key === "createdAt" ||
      key === "updatedAt"
    ) {
      continue;
    }

    data[key] =
      serialiseValue(value);
  }

  return {
    id:
      document._id.toHexString(),

    status:
      typeof document.status ===
      "string"
        ? document.status
        : defaultStatus,

    adminNote:
      typeof document.adminNote ===
      "string"
        ? document.adminNote
        : "",

    createdAt:
      document.createdAt
        ? serialiseValue(
            document.createdAt,
          )
        : null,

    updatedAt:
      document.updatedAt
        ? serialiseValue(
            document.updatedAt,
          )
        : null,

    data,
  };
}

export async function GET(
  _request: Request,
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
    resource,
    id,
  } = await context.params;

  const config =
    getAdminResourceConfig(
      resource,
    );

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown admin resource.",
      },
      {
        status: 404,
      },
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        error:
          "Invalid record ID.",
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
        config.collection,
      );

    const record =
      await collection.findOne({
        _id:
          new ObjectId(id),
      });

    if (!record) {
      return NextResponse.json(
        {
          error:
            "Record not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      record:
        safeDocument(
          record,
          config.defaultStatus,
        ),
    });
  } catch (error) {
    console.error(
      `Admin ${resource} GET detail error:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load record.",
      },
      {
        status: 500,
      },
    );
  }
}

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
    resource,
    id,
  } = await context.params;

  const config =
    getAdminResourceConfig(
      resource,
    );

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown admin resource.",
      },
      {
        status: 404,
      },
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        error:
          "Invalid record ID.",
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

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        config.collection,
      );

    const existing =
      await collection.findOne({
        _id:
          new ObjectId(id),
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const update:
      Record<string, unknown> =
        {};

    const changes: {
      field: string;
      from?: unknown;
      to?: unknown;
    }[] = [];

    if (
      body.status !==
      undefined
    ) {
      const nextStatus =
        typeof body.status ===
        "string"
          ? body.status
              .trim()
              .toLowerCase()
          : "";

      if (
        !config.statuses.includes(
          nextStatus,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid status.",
          },
          {
            status: 400,
          },
        );
      }

      const oldStatus =
        typeof existing.status ===
        "string"
          ? existing.status
          : config.defaultStatus;

      if (
        nextStatus !==
        oldStatus
      ) {
        update.status =
          nextStatus;

        changes.push({
          field:
            "status",

          from:
            oldStatus,

          to:
            nextStatus,
        });
      }
    }

    if (
      body.adminNote !==
      undefined
    ) {
      const note =
        typeof body.adminNote ===
        "string"
          ? body.adminNote
              .trim()
          : "";

      const oldNote =
        typeof existing.adminNote ===
        "string"
          ? existing.adminNote
          : "";

      if (
        note !==
        oldNote
      ) {
        update.adminNote =
          note;

        changes.push({
          field:
            "adminNote",

          from:
            oldNote,

          to:
            note,
        });
      }
    }

    if (
      Object.keys(update)
        .length === 0
    ) {
      return NextResponse.json({
        message:
          "No changes were required.",

        record:
          safeDocument(
            existing,
            config.defaultStatus,
          ),
      });
    }

    update.updatedAt =
      new Date();

    await collection.updateOne(
      {
        _id:
          existing._id,
      },
      {
        $set:
          update,
      },
    );

    const updated =
      await collection.findOne({
        _id:
          existing._id,
      });

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "Record could not be reloaded.",
        },
        {
          status: 500,
        },
      );
    }

    const possibleEmail =
      typeof updated.email ===
      "string"
        ? updated.email
        : undefined;

    await createAdminAuditLog(
      {
        actorId:
          authorization.user._id.toHexString(),

        actorEmail:
          authorization.user.email,

        action:
          `${config.key.toUpperCase()}_UPDATED`,

        targetUserId:
          id,

        targetEmail:
          possibleEmail,

        changes,
      },
    );

    return NextResponse.json({
      message:
        "Record updated successfully.",

      record:
        safeDocument(
          updated,
          config.defaultStatus,
        ),
    });
  } catch (error) {
    console.error(
      `Admin ${resource} PATCH error:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update record.",
      },
      {
        status: 500,
      },
    );
  }
}
