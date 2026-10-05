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

type RatingBody = {
  rating?: unknown;
};

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
    RatingBody;

  try {
    body =
      (await request.json()) as
        RatingBody;
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

  const rating =
    typeof body.rating ===
    "number"
      ? body.rating
      : Number(
          body.rating,
        );

  if (
    !Number.isInteger(
      rating,
    ) ||
    rating <
      1 ||
    rating >
      5
  ) {
    return NextResponse.json(
      {
        error:
          "Rating must be between 1 and 5.",
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

    const programs =
      await getStudentAccessiblePrograms(
        database,
        authorization.user,
      );

    if (
      !canStudentAccessLecture(
        programs,
        lecture,
      )
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

    const lectureId =
      lecture._id;

    const now =
      new Date();

    await database
      .collection<Document>(
        "lecture_ratings",
      )
      .updateOne(
        {
          lectureId,

          studentId:
            authorization.user
              ._id,
        },
        {
          $set: {
            rating,

            updatedAt:
              now,
          },

          $setOnInsert: {
            lectureId,

            studentId:
              authorization.user
                ._id,

            createdAt:
              now,
          },
        },
        {
          upsert:
            true,
        },
      );

    const summary =
      await database
        .collection<Document>(
          "lecture_ratings",
        )
        .aggregate<{
          averageRating: number;
          ratingCount: number;
        }>([
          {
            $match: {
              lectureId,
            },
          },

          {
            $group: {
              _id:
                null,

              averageRating: {
                $avg:
                  "$rating",
              },

              ratingCount: {
                $sum:
                  1,
              },
            },
          },

          {
            $project: {
              _id:
                0,

              averageRating:
                1,

              ratingCount:
                1,
            },
          },
        ])
        .toArray();

    const averageRating =
      Math.round(
        (
          summary[0]
            ?.averageRating ||
          0
        ) *
          100,
      ) /
      100;

    const ratingCount =
      summary[0]
        ?.ratingCount ||
      0;

    await database
      .collection<Document>(
        "recorded_lectures",
      )
      .updateOne(
        {
          _id:
            lectureId,
        },
        {
          $set: {
            averageRating,
            ratingCount,

            updatedAt:
              new Date(),
          },
        },
      );

    return NextResponse.json({
      message:
        "Your rating has been saved.",

      myRating:
        rating,

      averageRating,
      ratingCount,
    });
  } catch (error) {
    console.error(
      "Lecture rating error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to save your rating.",
      },
      {
        status:
          500,
      },
    );
  }
}