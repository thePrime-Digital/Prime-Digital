import {
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
  }>;
};

type CreateBody = {
  data?: unknown;
  status?: unknown;
};

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

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

function sanitiseData(
  input: unknown,
  config: CatalogConfig,
  requireRequiredFields: boolean,
): {
  ok: true;
  data: Record<string, unknown>;
} | {
  ok: false;
  error: string;
} {
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
    const raw =
      source[field.key];

    if (
      raw === undefined
    ) {
      if (
        requireRequiredFields &&
        field.required
      ) {
        return {
          ok: false,
          error:
            `${field.label} is required.`,
        };
      }

      continue;
    }

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

  const { resource } =
    await context.params;

  const config =
    getCatalogConfig(resource);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown catalog resource.",
      },
      {
        status: 404,
      },
    );
  }

  try {
    const url =
      new URL(request.url);

    const search =
      url.searchParams
        .get("search")
        ?.trim() || "";

    const status =
      url.searchParams
        .get("status")
        ?.trim() || "";

    const pageValue =
      Number(
        url.searchParams.get(
          "page",
        ) || "1",
      );

    const limitValue =
      Number(
        url.searchParams.get(
          "limit",
        ) || "25",
      );

    const page =
      Number.isFinite(
        pageValue,
      ) &&
      pageValue > 0
        ? Math.floor(
            pageValue,
          )
        : 1;

    const limit =
      Number.isFinite(
        limitValue,
      )
        ? Math.min(
            100,
            Math.max(
              1,
              Math.floor(
                limitValue,
              ),
            ),
          )
        : 25;

    const filter:
      Filter<Document> = {};

    if (
      status &&
      config.statuses.includes(
        status,
      )
    ) {
      filter.status = status;
    }

    if (search) {
      const escaped =
        escapeRegex(search);

      filter.$or =
        config.searchFields.map(
          (field) => ({
            [field]: {
              $regex:
                escaped,

              $options:
                "i",
            },
          }),
        );
    }

    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        config.collection,
      );

    const [
      records,
      filteredTotal,
      total,
    ] =
      await Promise.all([
        collection
          .find(filter)
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .skip(
            (page - 1) *
              limit,
          )
          .limit(limit)
          .toArray(),

        collection.countDocuments(
          filter,
        ),

        collection.countDocuments(),
      ]);

    const statusPairs =
      await Promise.all(
        config.statuses.map(
          async (
            statusName,
          ) => [
            statusName,

            await collection.countDocuments(
              {
                status:
                  statusName,
              },
            ),
          ],
        ),
      );

    const counts:
      Record<string, number> =
        {
          total,
        };

    for (
      const [
        statusName,
        count,
      ] of statusPairs
    ) {
      counts[
        String(statusName)
      ] =
        Number(count);
    }

    return NextResponse.json(
      {
        resource:
          config.resource,

        statuses:
          config.statuses,

        records:
          records.map(
            (record) =>
              serialise(
                record,
                config.defaultStatus,
              ),
          ),

        counts,

        pagination: {
          page,
          limit,
          total:
            filteredTotal,

          totalPages:
            Math.max(
              1,
              Math.ceil(
                filteredTotal /
                  limit,
              ),
            ),
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
      `Admin catalog ${resource} GET error:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load records.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
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

  const { resource } =
    await context.params;

  const config =
    getCatalogConfig(resource);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown catalog resource.",
      },
      {
        status: 404,
      },
    );
  }

  let body:
    CreateBody;

  try {
    body =
      (await request.json()) as CreateBody;
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
    sanitiseData(
      body.data,
      config,
      true,
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

  let status =
    config.defaultStatus;

  if (
    typeof body.status ===
      "string" &&
    config.statuses.includes(
      body.status,
    )
  ) {
    status =
      body.status;
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        config.collection,
      );

    const now =
      new Date();

    const result =
      await collection.insertOne(
        {
          ...clean.data,
          status,
          createdAt:
            now,
          updatedAt:
            now,
        },
      );

    const created =
      await collection.findOne({
        _id:
          result.insertedId,
      });

    if (!created) {
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
        `${config.resource.toUpperCase()}_CREATED`,

      targetUserId:
        result.insertedId.toHexString(),

      changes: [
        {
          field:
            "status",
          to:
            status,
        },
      ],
    });

    return NextResponse.json(
      {
        message:
          `${config.resource === "programs" ? "Program" : "Class"} created successfully.`,

        record:
          serialise(
            created,
            config.defaultStatus,
          ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      `Admin catalog ${resource} POST error:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create record.",
      },
      {
        status: 500,
      },
    );
  }
}
