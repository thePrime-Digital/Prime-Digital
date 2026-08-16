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
  getFacultyClassFilter,
  objectIdString,
  serialiseClass,
} from "@/lib/faculty/data";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const CONTENT_TYPES = [
  "document",
  "link",
  "video",
  "note",
];

type CreateContentBody = {
  classId?: unknown;
  title?: unknown;
  description?: unknown;
  type?: unknown;
  url?: unknown;
  unit?: unknown;
};

type UpdateContentBody = {
  id?: unknown;
  action?: unknown;
};

function contentClassValues(
  ids: ObjectId[],
) {
  return [
    ...ids,
    ...ids.map(
      (id) =>
        id.toHexString(),
    ),
  ];
}

function serialiseContent(
  item: Document,
) {
  return {
    id:
      item._id.toHexString(),

    classId:
      objectIdString(
        item.classId,
      ),

    className:
      String(
        item.className ||
          "",
      ),

    title:
      String(
        item.title ||
          "",
      ),

    description:
      String(
        item.description ||
          "",
      ),

    type:
      String(
        item.type ||
          "document",
      ),

    url:
      String(
        item.url ||
          "",
      ),

    unit:
      String(
        item.unit ||
          "",
      ),

    status:
      String(
        item.status ||
          "active",
      ),

    createdAt:
      item.createdAt instanceof
      Date
        ? item.createdAt.toISOString()
        : item.createdAt ||
          null,
  };
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const classes =
      await database
        .collection<Document>(
          "classes",
        )
        .find(
          getFacultyClassFilter(
            authorization.user,
          ),
        )
        .sort({
          name: 1,
        })
        .toArray();

    const classIds =
      classes.map(
        (item) =>
          item._id,
      );

    const url =
      new URL(request.url);

    const requestedClassId =
      url.searchParams
        .get("classId")
        ?.trim() || "";

    let filter:
      Record<
        string,
        unknown
      > = {
      classId: {
        $in:
          contentClassValues(
            classIds,
          ),
      },
    };

    if (
      requestedClassId &&
      classIds.some(
        (id) =>
          id.toHexString() ===
          requestedClassId,
      )
    ) {
      filter = {
        $or: [
          {
            classId:
              new ObjectId(
                requestedClassId,
              ),
          },
          {
            classId:
              requestedClassId,
          },
        ],
      };
    }

    const content =
      classIds.length >
      0
        ? await database
            .collection<Document>(
              "course_content",
            )
            .find(filter)
            .sort({
              createdAt: -1,
            })
            .toArray()
        : [];

    return NextResponse.json(
      {
        classes:
          classes.map(
            serialiseClass,
          ),

        content:
          content.map(
            serialiseContent,
          ),
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
      "Faculty content GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load course content.",
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
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    CreateContentBody;

  try {
    body =
      (await request.json()) as CreateContentBody;
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

  const classId =
    typeof body.classId ===
    "string"
      ? body.classId.trim()
      : "";

  const title =
    typeof body.title ===
    "string"
      ? body.title.trim()
      : "";

  const description =
    typeof body.description ===
    "string"
      ? body.description.trim()
      : "";

  const type =
    typeof body.type ===
    "string"
      ? body.type
          .trim()
          .toLowerCase()
      : "";

  const url =
    typeof body.url ===
    "string"
      ? body.url.trim()
      : "";

  const unit =
    typeof body.unit ===
    "string"
      ? body.unit.trim()
      : "";

  if (
    !ObjectId.isValid(
      classId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid class.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    title.length < 2 ||
    title.length > 150
  ) {
    return NextResponse.json(
      {
        error:
          "Content title must be between 2 and 150 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !CONTENT_TYPES.includes(
      type,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid content type.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const classRecord =
      await database
        .collection<Document>(
          "classes",
        )
        .findOne({
          _id:
            new ObjectId(
              classId,
            ),

          ...getFacultyClassFilter(
            authorization.user,
          ),
        });

    if (!classRecord) {
      return NextResponse.json(
        {
          error:
            "This class is not assigned to your account.",
        },
        {
          status: 403,
        },
      );
    }

    const now =
      new Date();

    const result =
      await database
        .collection<Document>(
          "course_content",
        )
        .insertOne({
          facultyId:
            authorization.user._id,

          facultyName:
            authorization.user.name,

          facultyEmail:
            authorization.user.email,

          classId:
            classRecord._id,

          className:
            classRecord.name,

          title,
          description,
          type,
          url,
          unit,

          status:
            "active",

          createdAt:
            now,

          updatedAt:
            now,
        });

    return NextResponse.json(
      {
        message:
          "Course content added successfully.",

        id:
          result.insertedId.toHexString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty content POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to add course content.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    UpdateContentBody;

  try {
    body =
      (await request.json()) as UpdateContentBody;
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

  const id =
    typeof body.id ===
    "string"
      ? body.id.trim()
      : "";

  const action =
    typeof body.action ===
    "string"
      ? body.action
          .trim()
          .toLowerCase()
      : "";

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid content ID.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    action !==
      "archive" &&
    action !==
      "restore"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid content action.",
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
        "course_content",
      );

    const item =
      await collection.findOne({
        _id:
          new ObjectId(
            id,
          ),
      });

    if (!item) {
      return NextResponse.json(
        {
          error:
            "Content item not found.",
        },
        {
          status: 404,
        },
      );
    }

    const classId =
      objectIdString(
        item.classId,
      );

    if (
      !ObjectId.isValid(
        classId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Content class reference is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    const ownedClass =
      await database
        .collection<Document>(
          "classes",
        )
        .findOne({
          _id:
            new ObjectId(
              classId,
            ),

          ...getFacultyClassFilter(
            authorization.user,
          ),
        });

    if (!ownedClass) {
      return NextResponse.json(
        {
          error:
            "You cannot modify this content.",
        },
        {
          status: 403,
        },
      );
    }

    await collection.updateOne(
      {
        _id:
          item._id,
      },
      {
        $set: {
          status:
            action ===
            "archive"
              ? "archived"
              : "active",

          updatedAt:
            new Date(),
        },
      },
    );

    return NextResponse.json({
      message:
        action ===
        "archive"
          ? "Content archived."
          : "Content restored.",
    });
  } catch (error) {
    console.error(
      "Faculty content PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update content.",
      },
      {
        status: 500,
      },
    );
  }
}
