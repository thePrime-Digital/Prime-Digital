import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

import {
  canStudentAccessLecture,
  dateValue,
  ensureRecordedLectureIndexes,
  getStudentAccessiblePrograms,
} from "@/lib/recorded-lectures";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type CommentBody = {
  comment?: unknown;
};

async function getAccessibleLecture(
  id: string,
  database: Awaited<
    ReturnType<
      typeof getDatabase
    >
  >,
  user: Parameters<
    typeof getStudentAccessiblePrograms
  >[1],
) {
  const lecture =
    await database
      .collection<Document>(
        "recorded_lectures",
      )
      .findOne({
        _id:
          new ObjectId(
            id,
          ),

        status:
          "published",
      });

  if (!lecture) {
    return {
      lecture:
        null,

      allowed:
        false,
    };
  }

  const programs =
    await getStudentAccessiblePrograms(
      database,
      user,
    );

  return {
    lecture,

    allowed:
      canStudentAccessLecture(
        programs,
        lecture,
      ),
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

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
          "Invalid lecture ID.",
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

    const access =
      await getAccessibleLecture(
        id,
        database,
        authorization.user,
      );

    if (
      !access.lecture
    ) {
      return NextResponse.json(
        {
          error:
            "Recorded lecture not found.",
        },
        {
          status:
            404,
        },
      );
    }

    if (
      !access.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this lecture.",
        },
        {
          status:
            403,
        },
      );
    }

    const comments =
      await database
        .collection<Document>(
          "lecture_comments",
        )
        .find({
          lectureId:
            access.lecture
              ._id,

          status:
            "active",
        })
        .sort({
          createdAt:
            -1,
        })
        .limit(
          100,
        )
        .toArray();

    return NextResponse.json(
      {
        comments:
          comments.map(
            (comment) => ({
              id:
                comment._id.toHexString(),

              studentName:
                String(
                  comment.studentName ||
                    "Student",
                ),

              comment:
                String(
                  comment.comment ||
                    "",
                ),

              isMine:
                comment.studentId instanceof
                  ObjectId &&
                comment.studentId.equals(
                  authorization.user
                    ._id,
                ),

              createdAt:
                dateValue(
                  comment.createdAt,
                ),
            }),
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
      "Lecture comments GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load comments.",
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
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

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
          "Invalid lecture ID.",
      },
      {
        status:
          400,
      },
    );
  }

  let body:
    CommentBody;

  try {
    body =
      (await request.json()) as
        CommentBody;
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

  const comment =
    typeof body.comment ===
    "string"
      ? body.comment.trim()
      : "";

  if (
    comment.length <
      2 ||
    comment.length >
      1000
  ) {
    return NextResponse.json(
      {
        error:
          "Comment must be between 2 and 1000 characters.",
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

    const access =
      await getAccessibleLecture(
        id,
        database,
        authorization.user,
      );

    if (
      !access.lecture
    ) {
      return NextResponse.json(
        {
          error:
            "Recorded lecture not found.",
        },
        {
          status:
            404,
        },
      );
    }

    if (
      !access.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this lecture.",
        },
        {
          status:
            403,
        },
      );
    }

    const now =
      new Date();

    await database
      .collection<Document>(
        "lecture_comments",
      )
      .insertOne({
        lectureId:
          access.lecture
            ._id,

        studentId:
          authorization.user
            ._id,

        studentName:
          authorization.user
            .name,

        comment,

        status:
          "active",

        createdAt:
          now,

        updatedAt:
          now,
      });

    const commentCount =
      await database
        .collection<Document>(
          "lecture_comments",
        )
        .countDocuments({
          lectureId:
            access.lecture
              ._id,

          status:
            "active",
        });

    await database
      .collection<Document>(
        "recorded_lectures",
      )
      .updateOne(
        {
          _id:
            access.lecture
              ._id,
        },
        {
          $set: {
            commentCount,

            updatedAt:
              new Date(),
          },
        },
      );

    return NextResponse.json(
      {
        message:
          "Comment posted successfully.",

        commentCount,
      },
      {
        status:
          201,
      },
    );
  } catch (error) {
    console.error(
      "Lecture comment POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to post your comment.",
      },
      {
        status:
          500,
      },
    );
  }
}