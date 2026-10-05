import {
  Db,
  ObjectId,
  type Document,
  type WithId,
} from "mongodb";

import {
  objectIdString,
  studentReferenceValues,
} from "@/lib/student/data";

import type {
  UserDocument,
} from "@/types/user";

export async function ensureRecordedLectureIndexes(
  database: Db,
): Promise<void> {
  try {
    await Promise.all([
      database
        .collection("recorded_lectures")
        .createIndex({
          program: 1,
          subject: 1,
          status: 1,
        }),

      database
        .collection("recorded_lectures")
        .createIndex({
          facultyId: 1,
          createdAt: -1,
        }),

      database
        .collection("recorded_lectures")
        .createIndex({
          averageRating: -1,
          ratingCount: -1,
        }),

      database
        .collection("lecture_ratings")
        .createIndex(
          {
            lectureId: 1,
            studentId: 1,
          },
          {
            unique: true,
          },
        ),

      database
        .collection("lecture_comments")
        .createIndex({
          lectureId: 1,
          createdAt: -1,
        }),
    ]);
  } catch (error) {
    console.error(
      "Recorded lecture index setup warning:",
      error,
    );
  }
}

export function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

export function recommendationScore(
  averageRating: number,
  ratingCount: number,
): number {
  if (
    !Number.isFinite(ratingCount) ||
    ratingCount <= 0
  ) {
    return 0;
  }

  const rating =
    Number.isFinite(averageRating)
      ? averageRating
      : 0;

  /*
   * Bayesian weighted rating.
   *
   * This prevents:
   * 5.0 from 1 student
   *
   * from automatically beating:
   * 4.9 from 100+ students.
   */
  const priorMean =
    4;

  const priorWeight =
    5;

  return (
    rating * ratingCount +
    priorMean * priorWeight
  ) /
    (
      ratingCount +
      priorWeight
    );
}

export function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    return value.toISOString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return null;
}

export async function getStudentAccessiblePrograms(
  database: Db,
  user: WithId<UserDocument>,
): Promise<string[]> {
  const programs =
    new Set<string>();

  if (
    typeof user.program ===
      "string" &&
    user.program.trim()
  ) {
    programs.add(
      user.program.trim(),
    );
  }

  const enrollments =
    await database
      .collection<Document>(
        "class_enrollments",
      )
      .find({
        studentId: {
          $in:
            studentReferenceValues(
              user,
            ),
        },

        status: {
          $ne:
            "removed",
        },
      })
      .toArray();

  const classIds =
    Array.from(
      new Set(
        enrollments
          .map(
            (item) =>
              objectIdString(
                item.classId,
              ),
          )
          .filter(
            (id) =>
              ObjectId.isValid(
                id,
              ),
          ),
      ),
    ).map(
      (id) =>
        new ObjectId(
          id,
        ),
    );

  if (
    classIds.length >
    0
  ) {
    const classes =
      await database
        .collection<Document>(
          "classes",
        )
        .find({
          _id: {
            $in:
              classIds,
          },
        })
        .project({
          program:
            1,
        })
        .toArray();

    for (
      const classRecord
      of classes
    ) {
      const program =
        String(
          classRecord.program ||
            "",
        ).trim();

      if (program) {
        programs.add(
          program,
        );
      }
    }
  }

  return Array.from(
    programs,
  );
}

export function canStudentAccessLecture(
  programs: string[],
  lecture: Document,
): boolean {
  const program =
    String(
      lecture.program ||
        "",
    ).trim();

  return Boolean(
    program &&
      programs.includes(
        program,
      ),
  );
}