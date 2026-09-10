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
  objectAndStringValues,
  objectIdString,
  studentReferenceValues,
} from "@/lib/student/data";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type AttendanceStats = {
  total: number;
  attended: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
};

function emptyStats(): AttendanceStats {
  return {
    total: 0,
    attended: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  };
}

function addAttendance(
  stats: AttendanceStats,
  status: string,
) {
  stats.total += 1;

  if (status === "present") {
    stats.present += 1;
    stats.attended += 1;
  }

  if (status === "late") {
    stats.late += 1;
    stats.attended += 1;
  }

  if (status === "absent") {
    stats.absent += 1;
  }

  if (status === "excused") {
    stats.excused += 1;
  }
}

function attendanceRate(
  stats: AttendanceStats,
): number | null {
  if (stats.total === 0) {
    return null;
  }

  return Math.round(
    (stats.attended / stats.total) *
      100,
  );
}

export async function GET():
  Promise<NextResponse> {
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

    const user =
      authorization.user;

    const studentValues =
      studentReferenceValues(
        user,
      );

    const enrollments =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .find({
          studentId: {
            $in:
              studentValues,
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
          new ObjectId(id),
      );

    if (
      classIds.length ===
      0
    ) {
      return NextResponse.json({
        summary: {
          total: 0,
          attended: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          rate: null,
        },

        classes: [],
        recent: [],
        trend: [],
      });
    }

    const classValues =
      objectAndStringValues(
        classIds,
      );

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
        .toArray();

    const classNames =
      new Map<
        string,
        string
      >(
        classes.map(
          (item) => [
            item._id.toHexString(),

            String(
              item.name ||
                "Class",
            ),
          ],
        ),
      );

    const records =
      await database
        .collection<Document>(
          "attendance_records",
        )
        .find({
          studentId: {
            $in:
              studentValues,
          },

          classId: {
            $in:
              classValues,
          },
        })
        .sort({
          date: -1,
          createdAt: -1,
        })
        .toArray();

    const overall =
      emptyStats();

    const byClass =
      new Map<
        string,
        AttendanceStats
      >();

    for (
      const record
      of records
    ) {
      const status =
        typeof record.status ===
        "string"
          ? record.status
              .trim()
              .toLowerCase()
          : "";

      addAttendance(
        overall,
        status,
      );

      const classId =
        objectIdString(
          record.classId,
        );

      if (!classId) {
        continue;
      }

      const stats =
        byClass.get(
          classId,
        ) ||
        emptyStats();

      addAttendance(
        stats,
        status,
      );

      byClass.set(
        classId,
        stats,
      );
    }

    const classBreakdown =
      classes.map(
        (classRecord) => {
          const id =
            classRecord._id.toHexString();

          const stats =
            byClass.get(id) ||
            emptyStats();

          return {
            id,

            name:
              String(
                classRecord.name ||
                  "Class",
              ),

            total:
              stats.total,

            attended:
              stats.attended,

            present:
              stats.present,

            absent:
              stats.absent,

            late:
              stats.late,

            excused:
              stats.excused,

            rate:
              attendanceRate(
                stats,
              ),
          };
        },
      );

    const trendStart =
      new Date();

    trendStart.setDate(
      trendStart.getDate() -
        13,
    );

    const trendStartKey =
      trendStart
        .toISOString()
        .slice(0, 10);

    const trendMap =
      new Map<
        string,
        AttendanceStats
      >();

    for (
      const record
      of records
    ) {
      const date =
        typeof record.date ===
        "string"
          ? record.date
          : "";

      if (
        !date ||
        date <
          trendStartKey
      ) {
        continue;
      }

      const stats =
        trendMap.get(
          date,
        ) ||
        emptyStats();

      addAttendance(
        stats,
        typeof record.status ===
        "string"
          ? record.status
          : "",
      );

      trendMap.set(
        date,
        stats,
      );
    }

    const trend: {
      date: string;
      rate: number;
    }[] = [];

    for (
      let offset = 13;
      offset >= 0;
      offset -= 1
    ) {
      const day =
        new Date();

      day.setDate(
        day.getDate() -
          offset,
      );

      const key =
        day
          .toISOString()
          .slice(0, 10);

      const stats =
        trendMap.get(
          key,
        );

      trend.push({
        date: key,

        rate:
          attendanceRate(
            stats ||
              emptyStats(),
          ) || 0,
      });
    }

    return NextResponse.json(
      {
        summary: {
          total:
            overall.total,

          attended:
            overall.attended,

          present:
            overall.present,

          absent:
            overall.absent,

          late:
            overall.late,

          excused:
            overall.excused,

          rate:
            attendanceRate(
              overall,
            ),
        },

        classes:
          classBreakdown,

        recent:
          records
            .slice(
              0,
              20,
            )
            .map(
              (record) => {
                const classId =
                  objectIdString(
                    record.classId,
                  );

                return {
                  id:
                    record._id.toHexString(),

                  classId,

                  className:
                    classNames.get(
                      classId,
                    ) ||
                    String(
                      record.className ||
                        "Class",
                    ),

                  date:
                    typeof record.date ===
                    "string"
                      ? record.date
                      : "",

                  status:
                    typeof record.status ===
                    "string"
                      ? record.status
                      : "",

                  note:
                    typeof record.note ===
                    "string"
                      ? record.note
                      : "",
                };
              },
            ),

        trend,
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
      "Student attendance error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load attendance.",
      },
      {
        status: 500,
      },
    );
  }
}