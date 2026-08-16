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
  objectIdString,
  serialiseClass,
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

const ATTENDANCE_STATUSES = [
  "present",
  "absent",
  "late",
  "excused",
] as const;

type AttendanceStatus =
  (typeof ATTENDANCE_STATUSES)[number];

type SaveAttendanceBody = {
  classId?: unknown;
  date?: unknown;

  records?: {
    studentId?: unknown;
    status?: unknown;
    note?: unknown;
  }[];
};

function validDateKey(
  value: string,
): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    value,
  );
}

function todayKey(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function attendanceClassFilter(
  classId: ObjectId,
) {
  return {
    $or: [
      {
        classId,
      },
      {
        classId:
          classId.toHexString(),
      },
    ],
  };
}

function enrollmentClassFilter(
  classId: ObjectId,
) {
  return {
    $or: [
      {
        classId,
      },
      {
        classId:
          classId.toHexString(),
      },
    ],
  };
}

export async function GET(
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

  try {
    const database =
      await getDatabase();

    const classesCollection =
      database.collection<Document>(
        "classes",
      );

    const enrollmentsCollection =
      database.collection<Document>(
        "class_enrollments",
      );

    const attendanceCollection =
      database.collection<Document>(
        "attendance_records",
      );

    const classes =
      await classesCollection
        .find(
          getFacultyClassFilter(
            authorization.user,
          ),
        )
        .sort({
          name: 1,
        })
        .toArray();

    const url =
      new URL(request.url);

    const requestedClassId =
      url.searchParams
        .get("classId")
        ?.trim() || "";

    const requestedDate =
      url.searchParams
        .get("date")
        ?.trim() || todayKey();

    const date =
      validDateKey(
        requestedDate,
      )
        ? requestedDate
        : todayKey();

    let selectedClass =
      classes[0] || null;

    if (
      requestedClassId &&
      ObjectId.isValid(
        requestedClassId,
      )
    ) {
      selectedClass =
        classes.find(
          (item) =>
            item._id.toHexString() ===
            requestedClassId,
        ) ||
        null;
    }

    if (!selectedClass) {
      return NextResponse.json(
        {
          classes:
            classes.map(
              serialiseClass,
            ),

          selectedClass:
            null,

          date,

          students: [],

          stats: {
            totalStudents: 0,
            marked: 0,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            attendanceRate: null,
          },

          overview: [],
        },
        {
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    const enrollments =
      await enrollmentsCollection
        .find({
          ...enrollmentClassFilter(
            selectedClass._id,
          ),

          status: {
            $ne:
              "removed",
          },
        })
        .toArray();

    const studentIds =
      Array.from(
        new Set(
          enrollments
            .map(
              (item) =>
                objectIdString(
                  item.studentId,
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

    const users =
      await getUsersCollection();

    const students =
      studentIds.length >
      0
        ? await users
            .find({
              _id: {
                $in:
                  studentIds,
              },

              role:
                "student",
            })
            .sort({
              name: 1,
            })
            .toArray()
        : [];

    const attendanceRecords =
      await attendanceCollection
        .find({
          ...attendanceClassFilter(
            selectedClass._id,
          ),

          date,
        })
        .toArray();

    const attendanceMap =
      new Map<
        string,
        {
          status: string;
          note: string;
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

      if (studentId) {
        attendanceMap.set(
          studentId,
          {
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
          },
        );
      }
    }

    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    for (
      const value
      of attendanceMap.values()
    ) {
      if (
        value.status ===
        "present"
      ) {
        counts.present +=
          1;
      }

      if (
        value.status ===
        "absent"
      ) {
        counts.absent +=
          1;
      }

      if (
        value.status ===
        "late"
      ) {
        counts.late +=
          1;
      }

      if (
        value.status ===
        "excused"
      ) {
        counts.excused +=
          1;
      }
    }

    const marked =
      counts.present +
      counts.absent +
      counts.late +
      counts.excused;

    const attended =
      counts.present +
      counts.late;

    const attendanceRate =
      marked > 0
        ? Math.round(
            (
              attended /
              marked
            ) *
              100,
          )
        : null;

    const overviewStart =
      new Date();

    overviewStart.setDate(
      overviewStart.getDate() -
        13,
    );

    const overviewStartKey =
      overviewStart
        .toISOString()
        .slice(0, 10);

    const overviewRecords =
      await attendanceCollection
        .find({
          ...attendanceClassFilter(
            selectedClass._id,
          ),

          date: {
            $gte:
              overviewStartKey,
          },
        })
        .sort({
          date: 1,
        })
        .toArray();

    const overviewMap =
      new Map<
        string,
        {
          present: number;
          total: number;
        }
      >();

    for (
      const record
      of overviewRecords
    ) {
      const recordDate =
        typeof record.date ===
        "string"
          ? record.date
          : "";

      if (!recordDate) {
        continue;
      }

      const current =
        overviewMap.get(
          recordDate,
        ) || {
          present: 0,
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
        current.present +=
          1;
      }

      overviewMap.set(
        recordDate,
        current,
      );
    }

    const overview: {
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

      const values =
        overviewMap.get(
          key,
        );

      overview.push({
        date:
          key,

        rate:
          values &&
          values.total >
            0
            ? Math.round(
                (
                  values.present /
                  values.total
                ) *
                  100,
              )
            : 0,
      });
    }

    return NextResponse.json(
      {
        classes:
          classes.map(
            serialiseClass,
          ),

        selectedClass:
          serialiseClass(
            selectedClass,
          ),

        date,

        students:
          students.map(
            (student) => {
              const attendance =
                attendanceMap.get(
                  student._id.toHexString(),
                );

              return {
                id:
                  student._id.toHexString(),

                name:
                  student.name,

                email:
                  student.email,

                phone:
                  student.phone,

                status:
                  attendance?.status ||
                  "",

                note:
                  attendance?.note ||
                  "",
              };
            },
          ),

        stats: {
          totalStudents:
            students.length,

          marked,

          present:
            counts.present,

          absent:
            counts.absent,

          late:
            counts.late,

          excused:
            counts.excused,

          attendanceRate,
        },

        overview,
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
      "Faculty attendance GET error:",
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
    SaveAttendanceBody;

  try {
    body =
      (await request.json()) as SaveAttendanceBody;
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

  const date =
    typeof body.date ===
    "string"
      ? body.date.trim()
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

  if (
    !validDateKey(
      date,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid attendance date.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !Array.isArray(
      body.records,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Attendance records are required.",
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
            "This class is not assigned to your faculty account.",
        },
        {
          status: 403,
        },
      );
    }

    const enrollments =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .find({
          ...enrollmentClassFilter(
            classRecord._id,
          ),

          status: {
            $ne:
              "removed",
          },
        })
        .toArray();

    const allowedStudentIds =
      new Set(
        enrollments
          .map(
            (item) =>
              objectIdString(
                item.studentId,
              ),
          )
          .filter(Boolean),
      );

    const operations: any[] =
      [];

    for (
      const record
      of body.records
    ) {
      const studentId =
        typeof record.studentId ===
        "string"
          ? record.studentId.trim()
          : "";

      const status =
        typeof record.status ===
        "string"
          ? record.status
              .trim()
              .toLowerCase()
          : "";

      const note =
        typeof record.note ===
        "string"
          ? record.note.trim()
          : "";

      if (
        !ObjectId.isValid(
          studentId,
        ) ||
        !allowedStudentIds.has(
          studentId,
        )
      ) {
        continue;
      }

      if (
        !ATTENDANCE_STATUSES.includes(
          status as AttendanceStatus,
        )
      ) {
        continue;
      }

      const studentObjectId =
        new ObjectId(
          studentId,
        );

      operations.push({
        updateOne: {
          filter: {
            classId:
              classRecord._id,

            studentId:
              studentObjectId,

            date,
          },

          update: {
            $set: {
              status,
              note,

              facultyId:
                authorization.user._id,

              facultyName:
                authorization.user.name,

              facultyEmail:
                authorization.user.email,

              updatedAt:
                new Date(),
            },

            $setOnInsert: {
              classId:
                classRecord._id,

              className:
                classRecord.name,

              studentId:
                studentObjectId,

              date,

              createdAt:
                new Date(),
            },
          },

          upsert:
            true,
        },
      });
    }

    if (
      operations.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid attendance records were supplied.",
        },
        {
          status: 400,
        },
      );
    }

    await database
      .collection<Document>(
        "attendance_records",
      )
      .bulkWrite(
        operations,
      );

    return NextResponse.json({
      message:
        "Attendance saved successfully.",

      saved:
        operations.length,
    });
  } catch (error) {
    console.error(
      "Faculty attendance POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to save attendance.",
      },
      {
        status: 500,
      },
    );
  }
}
