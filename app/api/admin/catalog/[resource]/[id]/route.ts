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
  getCatalogConfig,
  type CatalogConfig,
} from "@/lib/admin/catalog-registry";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    resource: string;
    id: string;
  }>;
};

type UpdateBody = {
  data?: unknown;
  status?: unknown;
};

function serialise(
  document: Document,
  defaultStatus: string,
) {
  const data:
    Record<string, unknown> = {};

  for (
    const [key, value]
    of Object.entries(document)
  ) {
    if (
      [
        "_id",
        "status",
        "createdAt",
        "updatedAt",
      ].includes(key)
    ) {
      continue;
    }

    data[key] = value;
  }

  return {
    id:
      document._id.toHexString(),

    status:
      typeof document.status === "string"
        ? document.status
        : defaultStatus,

    createdAt:
      document.createdAt instanceof Date
        ? document.createdAt.toISOString()
        : document.createdAt || null,

    updatedAt:
      document.updatedAt instanceof Date
        ? document.updatedAt.toISOString()
        : document.updatedAt || null,

    data,
  };
}

function sanitisePatch(
  input: unknown,
  config: CatalogConfig,
): {
  ok: true;
  data: Record<string, unknown>;
} | {
  ok: false;
  error: string;
} {
  if (
    input === undefined
  ) {
    return {
      ok: true,
      data: {},
    };
  }

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return {
      ok: false,
      error:
        "Invalid record data.",
    };
  }

  const source =
    input as Record<
      string,
      unknown
    >;

  const result:
    Record<string, unknown> = {};

  for (
    const field
    of config.fields
  ) {
    if (
      !(field.key in source)
    ) {
      continue;
    }

    const raw =
      source[field.key];

    if (
      field.type === "number"
    ) {
      if (
        raw === "" ||
        raw === null
      ) {
        result[field.key] =
          null;

        continue;
      }

      const numberValue =
        Number(raw);

      if (
        !Number.isFinite(
          numberValue,
        ) ||
        numberValue < 0
      ) {
        return {
          ok: false,
          error:
            `${field.label} must be a valid number.`,
        };
      }

      result[field.key] =
        numberValue;

      continue;
    }

    const stringValue =
      typeof raw === "string"
        ? raw.trim()
        : String(raw).trim();

    if (
      field.required &&
      !stringValue
    ) {
      return {
        ok: false,
        error:
          `${field.label} is required.`,
      };
    }

    if (
      field.type ===
        "select" &&
      stringValue &&
      field.options &&
      !field.options.includes(
        stringValue,
      )
    ) {
      return {
        ok: false,
        error:
          `Invalid ${field.label}.`,
      };
    }

    result[field.key] =
      stringValue;
  }

  return {
    ok: true,
    data: result,
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
    getCatalogConfig(resource);

  if (
    !config ||
    !ObjectId.isValid(id)
  ) {
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

  const database =
    await getDatabase();

  const record =
    await database
      .collection<Document>(
        config.collection,
      )
      .findOne({
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
      serialise(
        record,
        config.defaultStatus,
      ),
  });
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
    getCatalogConfig(resource);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown resource.",
      },
      {
        status: 404,
      },
    );
  }

  if (
    !ObjectId.isValid(id)
  ) {
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

  const clean =
    sanitisePatch(
      body.data,
      config,
    );

if ("error" in clean) {
  return NextResponse.json(
    {
      error:
        clean.error,
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
            "Record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const update:
      Record<string, unknown> =
        {
          ...clean.data,
        };

    const changes: {
      field: string;
      from?: unknown;
      to?: unknown;
    }[] = [];

    for (
      const [
        key,
        value,
      ] of Object.entries(
        clean.data,
      )
    ) {
      if (
        existing[key] !==
        value
      ) {
        changes.push({
          field:
            key,

          from:
            existing[key],

          to:
            value,
        });
      }
    }

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
      changes.length === 0
    ) {
      return NextResponse.json({
        message:
          "No changes were required.",

        record:
          serialise(
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
          objectId,
      },
      {
        $set:
          update,
      },
    );

    const updated =
      await collection.findOne({
        _id:
          objectId,
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

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        `${config.resource.toUpperCase()}_UPDATED`,

      targetUserId:
        id,

      changes,
    });

    return NextResponse.json({
      message:
        `${config.resource === "programs" ? "Program" : "Class"} updated successfully.`,

      record:
        serialise(
          updated,
          config.defaultStatus,
        ),
    });
  } catch (error) {
    console.error(
      `Admin catalog ${resource} PATCH error:`,
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
