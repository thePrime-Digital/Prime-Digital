import {
  ObjectId,
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
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = [
  "draft",
  "published",
  "archived",
];

const SEVERITIES = [
  "info",
  "important",
  "success",
];

type CreateNotificationBody = {
  title?: unknown;
  message?: unknown;
  audienceType?: unknown;
  audienceRole?: unknown;
  audienceUserId?: unknown;
  severity?: unknown;
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
  item: Document,
) {
  return {
    id:
      item._id.toHexString(),

    title:
      String(item.title || ""),

    message:
      String(item.message || ""),

    severity:
      String(item.severity || "info"),

    status:
      String(item.status || "draft"),

    audienceType:
      String(item.audienceType || "all"),

    audienceRole:
      item.audienceRole
        ? String(
            item.audienceRole,
          )
        : null,

    audienceUserId:
      item.audienceUserId instanceof
      ObjectId
        ? item.audienceUserId.toHexString()
        : item.audienceUserId
          ? String(
              item.audienceUserId,
            )
          : null,

    audienceUserName:
      item.audienceUserName
        ? String(
            item.audienceUserName,
          )
        : null,

    createdByName:
      String(
        item.createdByName ||
          "",
      ),

    publishedAt:
      item.publishedAt instanceof Date
        ? item.publishedAt.toISOString()
        : item.publishedAt || null,

    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : item.createdAt || null,

    updatedAt:
      item.updatedAt instanceof Date
        ? item.updatedAt.toISOString()
        : item.updatedAt || null,
  };
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  try {
    const url =
      new URL(request.url);

    const status =
      url.searchParams.get(
        "status",
      );

    const search =
      url.searchParams
        .get("search")
        ?.trim() || "";

    const filter:
      Filter<Document> = {};

    if (
      status &&
      STATUSES.includes(
        status,
      )
    ) {
      filter.status =
        status;
    }

    if (search) {
      const escaped =
        escapeRegex(search);

      filter.$or = [
        {
          title: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
        {
          message: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
      ];
    }

    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "notifications",
      );

    const [
      notifications,
      total,
      draft,
      published,
      archived,
    ] =
      await Promise.all([
        collection
          .find(filter)
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .toArray(),

        collection.countDocuments(),

        collection.countDocuments({
          status:
            "draft",
        }),

        collection.countDocuments({
          status:
            "published",
        }),

        collection.countDocuments({
          status:
            "archived",
        }),
      ]);

    return NextResponse.json(
      {
        notifications:
          notifications.map(
            serialise,
          ),

        counts: {
          total,
          draft,
          published,
          archived,
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
      "Admin notifications GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load notifications.",
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
    await requireAdminApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  let body:
    CreateNotificationBody;

  try {
    body =
      (await request.json()) as CreateNotificationBody;
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

  const title =
    typeof body.title ===
    "string"
      ? body.title.trim()
      : "";

  const message =
    typeof body.message ===
    "string"
      ? body.message.trim()
      : "";

  const audienceType =
    typeof body.audienceType ===
    "string"
      ? body.audienceType.trim()
      : "";

  const audienceRole =
    typeof body.audienceRole ===
    "string"
      ? body.audienceRole.trim()
      : "";

  const audienceUserId =
    typeof body.audienceUserId ===
    "string"
      ? body.audienceUserId.trim()
      : "";

  const severity =
    typeof body.severity ===
    "string"
      ? body.severity.trim()
      : "info";

  const status =
    typeof body.status ===
    "string"
      ? body.status.trim()
      : "draft";

  if (
    title.length < 2 ||
    title.length > 150
  ) {
    return NextResponse.json(
      {
        error:
          "Notification title must be between 2 and 150 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    message.length < 1 ||
    message.length > 3000
  ) {
    return NextResponse.json(
      {
        error:
          "Notification message must be between 1 and 3000 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    ![
      "all",
      "role",
      "user",
    ].includes(
      audienceType,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid notification audience.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !SEVERITIES.includes(
      severity,
    ) ||
    !STATUSES.includes(
      status,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid notification configuration.",
      },
      {
        status: 400,
      },
    );
  }

  const notification:
    Record<string, unknown> = {
      title,
      message,
      audienceType,
      audienceRole:
        null,
      audienceUserId:
        null,
      audienceUserName:
        null,
      severity,
      status,

      createdBy:
        authorization.user._id,

      createdByName:
        authorization.user.name,

      publishedAt:
        status ===
        "published"
          ? new Date()
          : null,

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    };

  if (
    audienceType ===
    "role"
  ) {
    if (
      ![
        "student",
        "faculty",
        "client",
        "admin",
      ].includes(
        audienceRole,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid role.",
        },
        {
          status: 400,
        },
      );
    }

    notification.audienceRole =
      audienceRole;
  }

  if (
    audienceType ===
    "user"
  ) {
    if (
      !ObjectId.isValid(
        audienceUserId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid account.",
        },
        {
          status: 400,
        },
      );
    }

    const users =
      await getUsersCollection();

    const targetUser =
      await users.findOne({
        _id:
          new ObjectId(
            audienceUserId,
          ),
      });

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "Target account was not found.",
        },
        {
          status: 404,
        },
      );
    }

    notification.audienceUserId =
      targetUser._id;

    notification.audienceUserName =
      targetUser.name;
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection(
        "notifications",
      );

    const result =
      await collection.insertOne(
        notification,
      );

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "NOTIFICATION_CREATED",

      changes: [
        {
          field:
            "status",
          to:
            status,
        },
        {
          field:
            "audience",
          to:
            audienceType,
        },
      ],
    });

    return NextResponse.json(
      {
        message:
          status ===
          "published"
            ? "Notification published successfully."
            : "Notification draft created.",

        id:
          result.insertedId.toHexString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Admin notification POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create notification.",
      },
      {
        status: 500,
      },
    );
  }
}
