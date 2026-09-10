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
  studentReferenceValues,
} from "@/lib/student/data";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        error:
          "Invalid class ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const classId =
      new ObjectId(id);

    const studentValues =
      studentReferenceValues(
        authorization.user,
      );

    const enrollment =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .findOne({
          studentId: {
            $in:
              studentValues,
          },

          classId: {
            $in: [
              classId,
              id,
            ],
          },

          status: {
            $ne:
              "removed",
          },
        });

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "You are not enrolled in this class.",
        },
        {
          status: 403,
        },
      );
    }

    const classRecord =
      await database
        .collection<Document>(
          "classes",
        )
        .findOne({
          _id:
            classId,
        });

    if (!classRecord) {
      return NextResponse.json(
        {
          error:
            "Class not found.",
        },
        {
          status: 404,
        },
      );
    }

    const classValues = [
      classId,
      id,
    ];

    const now =
      new Date();

    const [
      attendance,
      assignmentCount,
      contentCount,
      upcomingCount,
    ] =
      await Promise.all([
        database
          .collection<Document>(
            "attendance_records",
          )
          .find({
            classId: {
              $in:
                classValues,
            },

            studentId: {
              $in:
                studentValues,
            },
          })
          .toArray(),

        database
          .collection<Document>(
            "assignments",
          )
          .countDocuments({
            classId: {
              $in:
                classValues,
            },

            status:
              "published",
          }),

        database
          .collection<Document>(
            "course_content",
          )
          .countDocuments({
            $and: [
              {
                $or: [
                  {
                    classId: {
                      $in:
                        classValues,
                    },
                  },

                  {
                    classIds: {
                      $in:
                        classValues,
                    },
                  },
                ],
              },

              {
                status: {
                  $nin: [
                    "draft",
                    "hidden",
                    "removed",
                    "archived",
                  ],
                },
              },
            ],
          }),

        database
          .collection<Document>(
            "faculty_sessions",
          )
          .countDocuments({
            classId: {
              $in:
                classValues,
            },

            startAt: {
              $gte:
                now,
            },

            status: {
              $ne:
                "cancelled",
            },
          }),
      ]);

    const attended =
      attendance.filter(
        (record) =>
          record.status ===
            "present" ||
          record.status ===
            "late",
      ).length;

    const attendanceRate =
      attendance.length > 0
        ? Math.round(
            (
              attended /
              attendance.length
            ) *
              100,
          )
        : null;

    return NextResponse.json(
      {
        class: {
          id,

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

          faculty:
            String(
              classRecord.faculty ||
                classRecord.facultyName ||
                "",
            ),

          schedule:
            String(
              classRecord.schedule ||
                "",
            ),

          room:
            String(
              classRecord.room ||
                "",
            ),

          deliveryMode:
            String(
              classRecord.deliveryMode ||
                "",
            ),

          notes:
            String(
              classRecord.notes ||
                "",
            ),

          status:
            String(
              classRecord.status ||
                "",
            ),
        },

        summary: {
          attendanceRate,
          assignments:
            assignmentCount,
          learningContent:
            contentCount,
          upcomingClasses:
            upcomingCount,
        },
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
      "Student class details error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load class details.",
      },
      {
        status: 500,
      },
    );
  }
}