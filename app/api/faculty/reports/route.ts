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
  getClassReferenceFilter,
  getFacultyClassFilter,
  getFacultyReferenceFilter,
  objectIdString,
} from "@/lib/faculty/data";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function objectAndStringValues(
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

    const classIds =
      classes.map(
        (item) =>
          item._id,
      );

    if (
      classIds.length ===
      0
    ) {
      return NextResponse.json({
        summary: {
          classes: 0,
          students: 0,
          teachingHours: 0,
          assignments: 0,
          pendingReviews: 0,
          attendanceRate: null,
          averageGrade: null,
        },

        classPerformance: [],
        attendanceTrend: [],
      });
    }

    const [
      enrollments,
      attendance,
      assignments,
      sessions,
    ] =
      await Promise.all([
        database
          .collection<Document>(
            "class_enrollments",
          )
          .find({
            ...getClassReferenceFilter(
              classIds,
            ),

            status: {
              $ne:
                "removed",
            },
          })
          .toArray(),

        database
          .collection<Document>(
            "attendance_records",
          )
          .find(
            getClassReferenceFilter(
              classIds,
            ),
          )
          .toArray(),

        database
          .collection<Document>(
            "assignments",
          )
          .find({
            classId: {
              $in:
                objectAndStringValues(
                  classIds,
                ),
            },
          })
          .toArray(),

        database
          .collection<Document>(
            "faculty_sessions",
          )
          .find(
            getFacultyReferenceFilter(
              authorization.user,
            ),
          )
          .toArray(),
      ]);

    const assignmentIds =
      assignments.map(
        (item) =>
          item._id,
      );

    const submissions =
      assignmentIds.length >
      0
        ? await database
            .collection<Document>(
              "assignment_submissions",
            )
            .find({
              assignmentId: {
                $in:
                  objectAndStringValues(
                    assignmentIds,
                  ),
              },
            })
            .toArray()
        : [];

    const uniqueStudents =
      new Set<string>();

    const enrolledByClass =
      new Map<
        string,
        Set<string>
      >();

    for (
      const enrollment
      of enrollments
    ) {
      const classId =
        objectIdString(
          enrollment.classId,
        );

      const studentId =
        objectIdString(
          enrollment.studentId,
        );

      if (
        !classId ||
        !studentId
      ) {
        continue;
      }

      uniqueStudents.add(
        studentId,
      );

      const current =
        enrolledByClass.get(
          classId,
        ) ||
        new Set<string>();

      current.add(
        studentId,
      );

      enrolledByClass.set(
        classId,
        current,
      );
    }

    const attendanceByClass =
      new Map<
        string,
        {
          attended: number;
          total: number;
        }
      >();

    let totalAttendance =
      0;

    let totalAttended =
      0;

    for (
      const record
      of attendance
    ) {
      const classId =
        objectIdString(
          record.classId,
        );

      if (!classId) {
        continue;
      }

      const current =
        attendanceByClass.get(
          classId,
        ) || {
          attended: 0,
          total: 0,
        };

      current.total +=
        1;

      totalAttendance +=
        1;

      if (
        record.status ===
          "present" ||
        record.status ===
          "late"
      ) {
        current.attended +=
          1;

        totalAttended +=
          1;
      }

      attendanceByClass.set(
        classId,
        current,
      );
    }

    const assignmentToClass =
      new Map<
        string,
        string
      >();

    const assignmentCountByClass =
      new Map<
        string,
        number
      >();

    for (
      const assignment
      of assignments
    ) {
      const assignmentId =
        assignment._id.toHexString();

      const classId =
        objectIdString(
          assignment.classId,
        );

      if (!classId) {
        continue;
      }

      assignmentToClass.set(
        assignmentId,
        classId,
      );

      assignmentCountByClass.set(
        classId,
        (
          assignmentCountByClass.get(
            classId,
          ) || 0
        ) + 1,
      );
    }

    const gradesByClass =
      new Map<
        string,
        number[]
      >();

    const allGrades:
      number[] = [];

    let pendingReviews =
      0;

    for (
      const submission
      of submissions
    ) {
      if (
        submission.status ===
          "submitted" ||
        submission.status ===
          "pending_review"
      ) {
        pendingReviews +=
          1;
      }

      if (
        typeof submission.grade !==
        "number"
      ) {
        continue;
      }

      const assignmentId =
        objectIdString(
          submission.assignmentId,
        );

      const classId =
        assignmentToClass.get(
          assignmentId,
        );

      if (!classId) {
        continue;
      }

      const values =
        gradesByClass.get(
          classId,
        ) || [];

      values.push(
        submission.grade,
      );

      gradesByClass.set(
        classId,
        values,
      );

      allGrades.push(
        submission.grade,
      );
    }

    let teachingMinutes =
      0;

    for (
      const session
      of sessions
    ) {
      const start =
        session.startAt instanceof
        Date
          ? session.startAt
          : new Date(
              session.startAt,
            );

      const end =
        session.endAt instanceof
        Date
          ? session.endAt
          : new Date(
              session.endAt,
            );

      if (
        Number.isNaN(
          start.getTime(),
        ) ||
        Number.isNaN(
          end.getTime(),
        ) ||
        end <= start
      ) {
        continue;
      }

      if (
        session.status ===
        "cancelled"
      ) {
        continue;
      }

      teachingMinutes +=
        Math.round(
          (
            end.getTime() -
            start.getTime()
          ) /
            60000,
        );
    }

    const classPerformance =
      classes.map(
        (classRecord) => {
          const classId =
            classRecord._id.toHexString();

          const attendanceValues =
            attendanceByClass.get(
              classId,
            );

          const grades =
            gradesByClass.get(
              classId,
            ) || [];

          const attendanceRate =
            attendanceValues &&
            attendanceValues.total >
              0
              ? Math.round(
                  (
                    attendanceValues.attended /
                    attendanceValues.total
                  ) *
                    100,
                )
              : null;

          const averageGrade =
            grades.length >
            0
              ? Math.round(
                  grades.reduce(
                    (
                      total,
                      grade,
                    ) =>
                      total +
                      grade,
                    0,
                  ) /
                    grades.length,
                )
              : null;

          return {
            id:
              classId,

            name:
              String(
                classRecord.name ||
                  "Class",
              ),

            program:
              String(
                classRecord.program ||
                  "",
              ),

            students:
              enrolledByClass.get(
                classId,
              )?.size || 0,

            assignments:
              assignmentCountByClass.get(
                classId,
              ) || 0,

            attendanceRate,
            averageGrade,
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
        {
          attended: number;
          total: number;
        }
      >();

    for (
      const record
      of attendance
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

      const current =
        trendMap.get(
          date,
        ) || {
          attended: 0,
          total: 0,
        };

      current.total +=
        1;

      if (
        record.status ===
          "present" ||
        record.status ===
          "late"
      ) {
        current.attended +=
          1;
      }

      trendMap.set(
        date,
        current,
      );
    }

    const attendanceTrend:
      {
        date: string;
        rate: number;
      }[] = [];

    for (
      let offset = 13;
      offset >= 0;
      offset -= 1
    ) {
      const date =
        new Date();

      date.setDate(
        date.getDate() -
          offset,
      );

      const key =
        date
          .toISOString()
          .slice(0, 10);

      const values =
        trendMap.get(
          key,
        );

      attendanceTrend.push({
        date:
          key,

        rate:
          values &&
          values.total >
            0
            ? Math.round(
                (
                  values.attended /
                  values.total
                ) *
                  100,
              )
            : 0,
      });
    }

    return NextResponse.json(
      {
        summary: {
          classes:
            classes.length,

          students:
            uniqueStudents.size,

          teachingHours:
            Math.round(
              (
                teachingMinutes /
                60
              ) *
                10,
            ) /
            10,

          assignments:
            assignments.length,

          pendingReviews,

          attendanceRate:
            totalAttendance >
            0
              ? Math.round(
                  (
                    totalAttended /
                    totalAttendance
                  ) *
                    100,
                )
              : null,

          averageGrade:
            allGrades.length >
            0
              ? Math.round(
                  allGrades.reduce(
                    (
                      total,
                      grade,
                    ) =>
                      total +
                      grade,
                    0,
                  ) /
                    allGrades.length,
                )
              : null,
        },

        classPerformance,

        attendanceTrend,
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
      "Faculty reports error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load faculty reports.",
      },
      {
        status: 500,
      },
    );
  }
}
