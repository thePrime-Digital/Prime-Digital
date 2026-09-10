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
  serialiseStudentClass,
  studentReferenceValues,
} from "@/lib/student/data";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function isoValue(
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

function serialiseSession(
  session: Document,
  classNames:
    Map<string, string>,
) {
  const classId =
    objectIdString(
      session.classId,
    );

  return {
    id:
      objectIdString(
        session._id,
      ),

    classId,

    className:
      classNames.get(
        classId,
      ) ||
      String(
        session.className ||
          "",
      ),

    title:
      String(
        session.title ||
          "Class Session",
      ),

    startAt:
      isoValue(
        session.startAt,
      ),

    endAt:
      isoValue(
        session.endAt,
      ),

    mode:
      String(
        session.mode ||
          "",
      ),

    location:
      String(
        session.location ||
          "",
      ),
  };
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
    const user =
      authorization.user;

    const database =
      await getDatabase();

    const enrollmentsCollection =
      database.collection<Document>(
        "class_enrollments",
      );

    const classesCollection =
      database.collection<Document>(
        "classes",
      );

    const sessionsCollection =
      database.collection<Document>(
        "faculty_sessions",
      );

    const attendanceCollection =
      database.collection<Document>(
        "attendance_records",
      );

    const assignmentsCollection =
      database.collection<Document>(
        "assignments",
      );

    const submissionsCollection =
      database.collection<Document>(
        "assignment_submissions",
      );

    const notificationsCollection =
      database.collection<Document>(
        "notifications",
      );

    const studentValues =
      studentReferenceValues(
        user,
      );

    const enrollments =
      await enrollmentsCollection
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

    const classIdStrings =
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
      );

    const classIds =
      classIdStrings.map(
        (id) =>
          new ObjectId(id),
      );

    const classValues =
      objectAndStringValues(
        classIds,
      );

    const classes =
      classIds.length >
      0
        ? await classesCollection
            .find({
              _id: {
                $in:
                  classIds,
              },
            })
            .sort({
              name: 1,
            })
            .toArray()
        : [];

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

    const now =
      new Date();

    const todayStart =
      new Date(now);

    todayStart.setHours(
      0,
      0,
      0,
      0,
    );

    const tomorrow =
      new Date(
        todayStart,
      );

    tomorrow.setDate(
      tomorrow.getDate() +
        1,
    );

    const [
      attendanceRecords,
      todaySessions,
      upcomingSessions,
      assignments,
      notifications,
    ] =
      await Promise.all([
        classValues.length >
        0
          ? attendanceCollection
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
              .toArray()
          : Promise.resolve(
              [],
            ),

        classValues.length >
        0
          ? sessionsCollection
              .find({
                classId: {
                  $in:
                    classValues,
                },

                startAt: {
                  $gte:
                    todayStart,

                  $lt:
                    tomorrow,
                },

                status: {
                  $ne:
                    "cancelled",
                },
              })
              .sort({
                startAt: 1,
              })
              .toArray()
          : Promise.resolve(
              [],
            ),

        classValues.length >
        0
          ? sessionsCollection
              .find({
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
              })
              .sort({
                startAt: 1,
              })
              .limit(6)
              .toArray()
          : Promise.resolve(
              [],
            ),

        classValues.length >
        0
          ?assignmentsCollection
  .find({
    classId: {
      $in:
        classValues,
    },

    status: {
      $in: [
        "published",
        "closed",
      ],
    },
  })
              .sort({
                dueAt: 1,
                createdAt: -1,
              })
              .toArray()
          : Promise.resolve(
              [],
            ),

        notificationsCollection
          .find({
            status:
              "published",

            $or: [
              {
                audienceType:
                  "all",
              },

              {
                audienceType:
                  "role",

                audienceRole:
                  "student",
              },

              {
                audienceType:
                  "user",

                audienceUserId:
                  user._id,
              },

              {
                audienceType:
                  "user",

                audienceUserId:
                  user._id.toHexString(),
              },
            ],
          })
          .sort({
            publishedAt:
              -1,

            createdAt:
              -1,
          })
          .limit(5)
          .toArray(),
      ]);

    const assignmentIds =
      assignments.map(
        (item) =>
          item._id,
      );

    const assignmentValues =
      objectAndStringValues(
        assignmentIds,
      );

    const submissions =
      assignmentValues.length >
      0
        ? await submissionsCollection
            .find({
              studentId: {
                $in:
                  studentValues,
              },

              assignmentId: {
                $in:
                  assignmentValues,
              },
            })
            .sort({
              submittedAt: -1,
              createdAt: -1,
            })
            .toArray()
        : [];

    const submissionMap =
      new Map<
        string,
        Document
      >();

    for (
      const submission
      of submissions
    ) {
      const assignmentId =
        objectIdString(
          submission.assignmentId,
        );

      if (
        assignmentId &&
        !submissionMap.has(
          assignmentId,
        )
      ) {
        submissionMap.set(
          assignmentId,
          submission,
        );
      }
    }

    let attended =
      0;

    for (
      const record
      of attendanceRecords
    ) {
      if (
        record.status ===
          "present" ||
        record.status ===
          "late"
      ) {
        attended +=
          1;
      }
    }

    const attendanceRate =
      attendanceRecords.length >
      0
        ? Math.round(
            (
              attended /
              attendanceRecords.length
            ) *
              100,
          )
        : null;

const pendingAssignments =
  assignments.filter(
    (assignment) =>
      assignment.status ===
        "published" &&
      !submissionMap.has(
        assignment._id.toHexString(),
      ),
  ).length;

    const hour =
      new Date().getHours();

    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 17
          ? "Good Afternoon"
          : "Good Evening";

    return NextResponse.json(
      {
        student: {
          id:
            user._id.toHexString(),

          name:
            user.name,

          email:
            user.email,

          greeting,

          studentLevel:
            user.studentLevel ||
            null,

          currentClass:
            user.currentClass ||
            null,

          degreeName:
            user.degreeName ||
            null,

          program:
            user.program ||
            null,
        },

        summary: {
          enrolledClasses:
            classes.length,

          classesToday:
            todaySessions.length,

          attendanceRate,

          pendingAssignments,
        },

        classes:
          classes.map(
            serialiseStudentClass,
          ),

        todaySchedule:
          todaySessions.map(
            (session) =>
              serialiseSession(
                session,
                classNames,
              ),
          ),

        upcomingSchedule:
          upcomingSessions.map(
            (session) =>
              serialiseSession(
                session,
                classNames,
              ),
          ),

        assignments:
          assignments
            .map(
              (assignment) => {
                const id =
                  assignment._id.toHexString();

                const classId =
                  objectIdString(
                    assignment.classId,
                  );

                const submission =
                  submissionMap.get(
                    id,
                  );

                return {
                  id,

                  classId,

                  className:
                    classNames.get(
                      classId,
                    ) ||
                    String(
                      assignment.className ||
                        "",
                    ),

                  title:
                    String(
                      assignment.title ||
                        "Untitled Assignment",
                    ),

                  description:
                    String(
                      assignment.description ||
                        "",
                    ),

                  dueAt:
                    isoValue(
                      assignment.dueAt,
                    ),

                  maxScore:
                    typeof assignment.maxScore ===
                    "number"
                      ? assignment.maxScore
                      : 100,

                  submissionStatus:
                    submission
                      ? String(
                          submission.status ||
                            "submitted",
                        )
                      : null,

                  grade:
                    submission &&
                    typeof submission.grade ===
                      "number"
                      ? submission.grade
                      : null,

                  feedback:
                    submission
                      ? String(
                          submission.feedback ||
                            "",
                        )
                      : "",

                  submittedAt:
                    submission
                      ? isoValue(
                          submission.submittedAt ||
                            submission.createdAt,
                        )
                      : null,
                };
              },
            )
           ,

        announcements:
          notifications.map(
            (item) => ({
              id:
                item._id.toHexString(),

              title:
                String(
                  item.title ||
                    "Announcement",
                ),

              message:
                String(
                  item.message ||
                    "",
                ),

              severity:
                String(
                  item.severity ||
                    "info",
                ),

              createdAt:
                isoValue(
                  item.publishedAt ||
                    item.createdAt,
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
      "Student overview error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load student dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}