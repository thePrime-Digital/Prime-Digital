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
  getClassReferenceFilter,
  getFacultyClassFilter,
  objectIdString,
} from "@/lib/faculty/data";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

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
        students: [],
        classes: [],
      });
    }

    const enrollments =
      await database
        .collection(
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
        .toArray();

    const studentIdStrings =
      Array.from(
        new Set(
          enrollments
            .map(
              (item) =>
                objectIdString(
                  item.studentId,
                ),
            )
            .filter(Boolean),
        ),
      );

    const validStudentIds =
      studentIdStrings
        .filter(
          (id) =>
            ObjectId.isValid(
              id,
            ),
        )
        .map(
          (id) =>
            new ObjectId(id),
        );

    const users =
      await getUsersCollection();

    const students =
      validStudentIds.length >
      0
        ? await users
            .find({
              _id: {
                $in:
                  validStudentIds,
              },

              role:
                "student",
            })
            .toArray()
        : [];

    const classMap =
      new Map(
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

    const studentClasses =
      new Map<
        string,
        {
          id: string;
          name: string;
        }[]
      >();

    for (
      const enrollment
      of enrollments
    ) {
      const studentId =
        objectIdString(
          enrollment.studentId,
        );

      const classId =
        objectIdString(
          enrollment.classId,
        );

      if (
        !studentId ||
        !classId
      ) {
        continue;
      }

      const current =
        studentClasses.get(
          studentId,
        ) || [];

      if (
        !current.some(
          (item) =>
            item.id ===
            classId,
        )
      ) {
        current.push({
          id:
            classId,

          name:
            classMap.get(
              classId,
            ) ||
            "Class",
        });
      }

      studentClasses.set(
        studentId,
        current,
      );
    }

    const attendanceRecords =
      await database
        .collection(
          "attendance_records",
        )
        .find({
          ...getClassReferenceFilter(
            classIds,
          ),
        })
        .toArray();

    const attendanceMap =
      new Map<
        string,
        {
          total: number;
          present: number;
        }
      >();

    for (
      const record
      of attendanceRecords
    ) {
      const studentId =
        objectIdString(
          record.studentId,
        );

      if (!studentId) {
        continue;
      }

      const current =
        attendanceMap.get(
          studentId,
        ) || {
          total: 0,
          present: 0,
        };

      current.total += 1;

      if (
        record.status ===
          "present" ||
        record.status ===
          "late"
      ) {
        current.present +=
          1;
      }

      attendanceMap.set(
        studentId,
        current,
      );
    }

    const submissions =
      await database
        .collection(
          "assignment_submissions",
        )
        .find({
          ...getClassReferenceFilter(
            classIds,
          ),

          grade: {
            $type:
              "number",
          },
        })
        .toArray();

    const gradeMap =
      new Map<
        string,
        number[]
      >();

    for (
      const submission
      of submissions
    ) {
      const studentId =
        objectIdString(
          submission.studentId,
        );

      if (
        !studentId ||
        typeof submission.grade !==
        "number"
      ) {
        continue;
      }

      const values =
        gradeMap.get(
          studentId,
        ) || [];

      values.push(
        submission.grade,
      );

      gradeMap.set(
        studentId,
        values,
      );
    }

    return NextResponse.json(
      {
        classes:
          classes.map(
            (item) => ({
              id:
                item._id.toHexString(),

              name:
                String(
                  item.name ||
                    "Class",
                ),
            }),
          ),

        students:
          students.map(
            (student) => {
              const id =
                student._id.toHexString();

              const attendance =
                attendanceMap.get(
                  id,
                );

              const grades =
                gradeMap.get(
                  id,
                ) || [];

              const averageGrade =
                grades.length >
                0
                  ? Math.round(
                      grades.reduce(
                        (
                          total,
                          value,
                        ) =>
                          total +
                          value,
                        0,
                      ) /
                        grades.length,
                    )
                  : null;

              const attendanceRate =
                attendance &&
                attendance.total >
                  0
                  ? Math.round(
                      (
                        attendance.present /
                        attendance.total
                      ) *
                        100,
                    )
                  : null;

              return {
                id,

                name:
                  student.name,

                email:
                  student.email,

                phone:
                  student.phone,

                status:
                  student.status,

                classes:
                  studentClasses.get(
                    id,
                  ) || [],

                attendance:
                  attendanceRate,

                averageGrade,
              };
            },
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
      "Faculty students error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load students.",
      },
      {
        status: 500,
      },
    );
  }
}
