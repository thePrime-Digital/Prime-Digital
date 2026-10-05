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
  dateValue,
  ensureRecordedLectureIndexes,
  escapeRegex,
  getStudentAccessiblePrograms,
  recommendationScore,
} from "@/lib/recorded-lectures";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function numberValue(
  value: unknown,
): number {
  return typeof value ===
    "number"
    ? value
    : 0;
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

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

    const programs =
      await getStudentAccessiblePrograms(
        database,
        authorization.user,
      );

    if (
      programs.length ===
      0
    ) {
      return NextResponse.json({
        programs: [],
        subjects: [],
        lectures: [],
      });
    }

    const url =
      new URL(
        request.url,
      );

    const search =
      url.searchParams
        .get("search")
        ?.trim() ||
      "";

    const subject =
      url.searchParams
        .get("subject")
        ?.trim() ||
      "";

    const sort =
      url.searchParams
        .get("sort")
        ?.trim()
        .toLowerCase() ||
      "recommended";

    const collection =
      database.collection<Document>(
        "recorded_lectures",
      );

    const baseFilter:
      Record<
        string,
        unknown
      > = {
      status:
        "published",

      program: {
        $in:
          programs,
      },
    };

    const subjectsRaw =
      await collection.distinct(
        "subject",
        baseFilter,
      );

    const subjects =
      subjectsRaw
        .map(
          (value) =>
            String(
              value ||
                "",
            ).trim(),
        )
        .filter(Boolean)
        .sort(
          (
            a,
            b,
          ) =>
            a.localeCompare(
              b,
            ),
        );

    const filter:
      Record<
        string,
        unknown
      > = {
      ...baseFilter,
    };

    if (subject) {
      filter.subject =
        subject;
    }

    if (search) {
      const regex =
        new RegExp(
          escapeRegex(
            search,
          ),
          "i",
        );

      filter.$or = [
        {
          title:
            regex,
        },
        {
          subject:
            regex,
        },
        {
          topic:
            regex,
        },
        {
          description:
            regex,
        },
        {
          facultyName:
            regex,
        },
        {
          program:
            regex,
        },
      ];
    }

    const lectures =
      await collection
        .find(
          filter,
        )
        .limit(
          250,
        )
        .toArray();

    const lectureIds =
      lectures.map(
        (lecture) =>
          lecture._id,
      );

    const myRatings =
      lectureIds.length >
      0
        ? await database
            .collection<Document>(
              "lecture_ratings",
            )
            .find({
              lectureId: {
                $in:
                  lectureIds,
              },

              studentId:
                authorization
                  .user
                  ._id,
            })
            .toArray()
        : [];

    const ratingMap =
      new Map<
        string,
        number
      >();

    for (
      const rating
      of myRatings
    ) {
      const lectureId =
        rating.lectureId instanceof
        ObjectId
          ? rating.lectureId.toHexString()
          : String(
              rating.lectureId ||
                "",
            );

      ratingMap.set(
        lectureId,
        numberValue(
          rating.rating,
        ),
      );
    }

    const serialised =
      lectures.map(
        (lecture) => {
          const averageRating =
            numberValue(
              lecture.averageRating,
            );

          const ratingCount =
            numberValue(
              lecture.ratingCount,
            );

          return {
            id:
              lecture._id.toHexString(),

            program:
              String(
                lecture.program ||
                  "",
              ),

            subject:
              String(
                lecture.subject ||
                  "",
              ),

            topic:
              String(
                lecture.topic ||
                  "",
              ),

            title:
              String(
                lecture.title ||
                  "",
              ),

            description:
              String(
                lecture.description ||
                  "",
              ),

            recordingUrl:
              String(
                lecture.recordingUrl ||
                  "",
              ),

            facultyName:
              String(
                lecture.facultyName ||
                  "Faculty",
              ),

            averageRating,
            ratingCount,

            commentCount:
              numberValue(
                lecture.commentCount,
              ),

            myRating:
              ratingMap.get(
                lecture._id.toHexString(),
              ) ||
              0,

            recommendationScore:
              recommendationScore(
                averageRating,
                ratingCount,
              ),

            createdAt:
              dateValue(
                lecture.createdAt,
              ),
          };
        },
      );

    if (
      sort ===
      "highest"
    ) {
      serialised.sort(
        (
          a,
          b,
        ) =>
          b.averageRating -
            a.averageRating ||
          b.ratingCount -
            a.ratingCount ||
          new Date(
            b.createdAt ||
              0,
          ).getTime() -
            new Date(
              a.createdAt ||
                0,
            ).getTime(),
      );
    } else if (
      sort ===
      "newest"
    ) {
      serialised.sort(
        (
          a,
          b,
        ) =>
          new Date(
            b.createdAt ||
              0,
          ).getTime() -
          new Date(
            a.createdAt ||
              0,
          ).getTime(),
      );
    } else {
      serialised.sort(
        (
          a,
          b,
        ) =>
          b.recommendationScore -
            a.recommendationScore ||
          b.averageRating -
            a.averageRating ||
          b.ratingCount -
            a.ratingCount ||
          new Date(
            b.createdAt ||
              0,
          ).getTime() -
            new Date(
              a.createdAt ||
                0,
            ).getTime(),
      );
    }

    return NextResponse.json(
      {
        programs,
        subjects,
        lectures:
          serialised,
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
      "Student recorded lectures GET error:",
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