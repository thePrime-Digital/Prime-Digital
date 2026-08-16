import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireFacultyApi,
} from "@/lib/auth/api-faculty-authorization";

import {
  getFacultyClassFilter,
  getFacultyReferenceFilter,
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

type CreateSessionBody = {
  classId?: unknown;
  title?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  mode?: unknown;
  location?: unknown;
  notes?: unknown;
};

function serialiseSession(
  session: Record<
    string,
    any
  >,
) {
  return {
    id:
      session._id.toHexString(),

    classId:
      objectIdString(
        session.classId,
      ),

    title:
      String(
        session.title ||
          "Class Session",
      ),

    startAt:
      session.startAt instanceof
      Date
        ? session.startAt.toISOString()
        : session.startAt,

    endAt:
      session.endAt instanceof
      Date
        ? session.endAt.toISOString()
        : session.endAt,

    mode:
      String(
        session.mode ||
          "",
      ),

    location:
      String(
        session.location ||
          "",
      ),

    notes:
      String(
        session.notes ||
          "",
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

    const classes =
      await database
        .collection(
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

    const sessions =
      await database
        .collection(
          "faculty_sessions",
        )
        .find(
          getFacultyReferenceFilter(
            authorization.user,
          ),
        )
        .sort({
          startAt: 1,
        })
        .limit(500)
        .toArray();

    return NextResponse.json(
      {
        classes:
          classes.map(
            serialiseClass,
          ),

        sessions:
          sessions.map(
            serialiseSession,
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
      "Faculty schedule GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load schedule.",
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
    CreateSessionBody;

  try {
    body =
      (await request.json()) as CreateSessionBody;
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

  const mode =
    typeof body.mode ===
    "string"
      ? body.mode.trim()
      : "";

  const location =
    typeof body.location ===
    "string"
      ? body.location.trim()
      : "";

  const notes =
    typeof body.notes ===
    "string"
      ? body.notes.trim()
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

  const startAt =
    new Date(
      typeof body.startAt ===
      "string"
        ? body.startAt
        : "",
    );

  const endAt =
    new Date(
      typeof body.endAt ===
      "string"
        ? body.endAt
        : "",
    );

  if (
    Number.isNaN(
      startAt.getTime(),
    ) ||
    Number.isNaN(
      endAt.getTime(),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please provide valid session times.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    endAt <= startAt
  ) {
    return NextResponse.json(
      {
        error:
          "Session end time must be after the start time.",
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
        .collection(
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
          status: 403,
        },
      );
    }

    const now =
      new Date();

    const result =
      await database
        .collection(
          "faculty_sessions",
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

          title:
            title ||
            String(
              classRecord.name ||
                "Class Session",
            ),

          startAt,
          endAt,

          mode:
            mode ||
            classRecord.deliveryMode ||
            "Offline",

          location:
            location ||
            classRecord.room ||
            "",

          notes,

          createdAt:
            now,

          updatedAt:
            now,
        });

    const created =
      await database
        .collection(
          "faculty_sessions",
        )
        .findOne({
          _id:
            result.insertedId,
        });

    return NextResponse.json(
      {
        message:
          "Class session scheduled successfully.",

        session:
          created
            ? serialiseSession(
                created,
              )
            : null,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty schedule POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create class session.",
      },
      {
        status: 500,
      },
    );
  }
}
