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
  getAdminResourceConfig,
} from "@/lib/admin/admin-resource-registry";

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
  }>;
};

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

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

    const pageNumber =
      Number(
        url.searchParams.get(
          "page",
        ) || "1",
      );

    const limitNumber =
      Number(
        url.searchParams.get(
          "limit",
        ) || "25",
      );

    const page =
      Number.isFinite(
        pageNumber,
      ) &&
      pageNumber > 0
        ? Math.floor(
            pageNumber,
          )
        : 1;

    const limit =
      Number.isFinite(
        limitNumber,
      )
        ? Math.min(
            Math.max(
              Math.floor(
                limitNumber,
              ),
              1,
            ),
            100,
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
      filter.status =
        status;
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
      total,
      overallTotal,
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

    const statusEntries =
      await Promise.all(
        config.statuses.map(
          async (
            statusName,
          ) => {
            const count =
              await collection.countDocuments(
                {
                  status:
                    statusName,
                },
              );

            return [
              statusName,
              count,
            ] as const;
          },
        ),
      );

    const explicitStatusCount =
      statusEntries.reduce(
        (
          totalCount,
          [, count],
        ) =>
          totalCount +
          count,
        0,
      );

    const counts =
      Object.fromEntries(
        statusEntries,
      ) as Record<
        string,
        number
      >;

    // Older/public submissions may
    // not yet have a status field.
    counts.new =
      (counts.new || 0) +
      Math.max(
        0,
        overallTotal -
          explicitStatusCount,
      );

    return NextResponse.json(
      {
        resource:
          config.key,

        label:
          config.label,

        statuses:
          config.statuses,

        records:
          records.map(
            (record) =>
              safeDocument(
                record,
                config.defaultStatus,
              ),
          ),

        counts: {
          total:
            overallTotal,

          ...counts,
        },

        pagination: {
          page,
          limit,
          total,

          totalPages:
            Math.max(
              1,
              Math.ceil(
                total /
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
      `Admin ${resource} GET error:`,
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
