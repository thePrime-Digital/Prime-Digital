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
} from "@/lib/faculty/data";

import {
  getDatabase,
} from "@/lib/mongodb";

import {
  dateValue,
  ensureRecordedLectureIndexes,
} from "@/lib/recorded-lectures";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type CreateLectureBody = {
  classId?: unknown;
  title?: unknown;
  subject?: unknown;
  topic?: unknown;
  description?: unknown;
  recordingUrl?: unknown;
};

function stringValue(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function validWebUrl(
  value: string,
): boolean {
  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "https:" ||
      url.protocol ===
        "http:"
    );
  } catch {
    return false;
  }
}

function serialiseClass(
  item: Document,
) {
  return {
    id:
      item._id.toHexString(),

    name:
      String(
        item.name ||
          "Class",
      ),

    program:
      String(
        item.program ||
          "",
      ),
  };
}

function serialiseLecture(
  item: Document,
) {
  return {
    id:
      item._id.toHexString(),

    classId:
      item.classId instanceof
      ObjectId
        ? item.classId.toHexString()
        : String(
            item.classId ||
              "",
          ),

    className:
      String(
        item.className ||
          "",
      ),

    program:
      String(
        item.program ||
          "",
      ),

    subject:
      String(
        item.subject ||
          "",
      ),

    topic:
      String(
        item.topic ||
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

    recordingUrl:
      String(
        item.recordingUrl ||
          "",
      ),

    status:
      String(
        item.status ||
          "published",
      ),

    averageRating:
      typeof item.averageRating ===
      "number"
        ? item.averageRating
        : 0,

    ratingCount:
      typeof item.ratingCount ===
      "number"
        ? item.ratingCount
        : 0,

    commentCount:
      typeof item.commentCount ===
      "number"
        ? item.commentCount
        : 0,

    createdAt:
      dateValue(
        item.createdAt,
      ),

    updatedAt:
      dateValue(
        item.updatedAt,
      ),
  };
}

export async function GET():
  Promise<NextResponse> {
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

    await ensureRecordedLectureIndexes(
      database,
    );

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
          name:
            1,
        })
        .toArray();

    const lectures =
      await database
        .collection<Document>(
          "recorded_lectures",
        )
        .find({
          facultyId:
            authorization.user
              ._id,

          status: {
            $ne:
              "removed",
          },
        })
        .sort({
          createdAt:
            -1,
        })
        .toArray();

    return NextResponse.json(
      {
        classes:
          classes.map(
            serialiseClass,
          ),

        lectures:
          lectures.map(
            serialiseLecture,
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
      "Faculty recorded lectures GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load recorded lectures.",
      },
      {
        status:
          500,
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
    CreateLectureBody;

  try {
    body =
      (await request.json()) as
        CreateLectureBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status:
          400,
      },
    );
  }

  const classId =
    stringValue(
      body.classId,
    );

  const title =
    stringValue(
      body.title,
    );

  const subject =
    stringValue(
      body.subject,
    );

  const topic =
    stringValue(
      body.topic,
    );

  const description =
    stringValue(
      body.description,
    );

  const recordingUrl =
    stringValue(
      body.recordingUrl,
    );

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
        status:
          400,
      },
    );
  }

  if (
    title.length <
      2 ||
    title.length >
      160
  ) {
    return NextResponse.json(
      {
        error:
          "Lecture title must be between 2 and 160 characters.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    subject.length <
      2 ||
    subject.length >
      100
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid subject.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    topic.length <
      2 ||
    topic.length >
      120
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid topic.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    description.length >
    2000
  ) {
    return NextResponse.json(
      {
        error:
          "Description is too long.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !validWebUrl(
      recordingUrl,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid recording URL.",
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    await ensureRecordedLectureIndexes(
      database,
    );

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
            "This class is not assigned to your faculty account.",
        },
        {
          status:
            403,
        },
      );
    }

    const program =
      String(
        classRecord.program ||
          "",
      ).trim();

    if (!program) {
      return NextResponse.json(
        {
          error:
            "This class does not have a program assigned. Ask the administrator to assign the course/program to this class.",
        },
        {
          status:
            400,
        },
      );
    }

    const now =
      new Date();

    const result =
      await database
        .collection<Document>(
          "recorded_lectures",
        )
        .insertOne({
          facultyId:
            authorization.user
              ._id,

          facultyName:
            authorization.user
              .name,

          facultyEmail:
            authorization.user
              .email,

          classId:
            classRecord._id,

          className:
            String(
              classRecord.name ||
                "Class",
            ),

          program,

          subject,
          topic,
          title,
          description,
          recordingUrl,

          status:
            "published",

          averageRating:
            0,

          ratingCount:
            0,

          commentCount:
            0,

          createdAt:
            now,

          updatedAt:
            now,
        });

    const lecture =
      await database
        .collection<Document>(
          "recorded_lectures",
        )
        .findOne({
          _id:
            result.insertedId,
        });

    return NextResponse.json(
      {
        message:
          "Recorded lecture published successfully.",

        lecture:
          lecture
            ? serialiseLecture(
                lecture,
              )
            : null,
      },
      {
        status:
          201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty recorded lecture POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to publish the recorded lecture.",
      },
      {
        status:
          500,
      },
    );
  }
}