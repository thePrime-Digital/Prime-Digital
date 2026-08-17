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

type CreateLiveClassBody = {
  classId?: unknown;
  title?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  meetingUrl?: unknown;
  notes?: unknown;
};

function serialiseSession(
  session: Document,
) {
  const endAt =
    session.endAt instanceof
    Date
      ? session.endAt
      : session.endAt
        ? new Date(
            session.endAt,
          )
        : null;

  let status =
    typeof session.status ===
    "string"
      ? session.status
      : "scheduled";

  if (
    !session.status &&
    endAt &&
    !Number.isNaN(
      endAt.getTime(),
    ) &&
    endAt <
      new Date()
  ) {
    status =
      "completed";
  }

  return {
    id:
      session._id.toHexString(),

    classId:
      objectIdString(
        session.classId,
      ),

    className:
      String(
        session.className ||
          "",
      ),

    title:
      String(
        session.title ||
          "Live Class",
      ),

    startAt:
      session.startAt instanceof
      Date
        ? session.startAt.toISOString()
        : session.startAt ||
          null,

    endAt:
      session.endAt instanceof
      Date
        ? session.endAt.toISOString()
        : session.endAt ||
          null,

    meetingUrl:
      String(
        session.meetingUrl ||
          session.location ||
          "",
      ),

    recordingUrl:
      String(
        session.recordingUrl ||
          "",
      ),

    notes:
      String(
        session.notes ||
          "",
      ),

    status,
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

    const sessions =
      await database
        .collection<Document>(
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
      "Faculty live classes GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load live classes.",
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
    CreateLiveClassBody;

  try {
    body =
      (await request.json()) as CreateLiveClassBody;
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

  const meetingUrl =
    typeof body.meetingUrl ===
    "string"
      ? body.meetingUrl.trim()
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
    endAt <=
    startAt
  ) {
    return NextResponse.json(
      {
        error:
          "End time must be after start time.",
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
                "Live Class",
            ),

          startAt,
          endAt,

          mode:
            "Online",

          meetingUrl,

          location:
            meetingUrl,

          recordingUrl:
            "",

          notes,

          status:
            "scheduled",

          createdAt:
            now,

          updatedAt:
            now,
        });

    return NextResponse.json(
      {
        message:
          "Live class scheduled successfully.",

        id:
          result.insertedId.toHexString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty live class POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to schedule live class.",
      },
      {
        status: 500,
      },
    );
  }
}
