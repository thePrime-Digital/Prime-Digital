import type {
  Document,
  WithId,
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
  serialiseClass,
} from "@/lib/faculty/data";

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
    const user =
      authorization.user;

    const database =
      await getDatabase();

    const classesCollection =
      database.collection(
        "classes",
      );

    const sessionCollection =
      database.collection(
        "faculty_sessions",
      );

    const enrollmentCollection =
      database.collection(
        "class_enrollments",
      );

    const submissionsCollection =
      database.collection(
        "assignment_submissions",
      );

    const notificationsCollection =
      database.collection(
        "notifications",
      );

    const classes =
      await classesCollection
        .find(
          getFacultyClassFilter(
            user,
          ),
        )
        .sort({
          createdAt: -1,
        })
        .toArray();

    const classIds =
      classes.map(
        (item) =>
          item._id,
      );

let enrollmentRecords:
  WithId<Document>[] = [];

    if (
      classIds.length >
      0
    ) {
      enrollmentRecords =
        await enrollmentCollection
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
    }

    const uniqueStudentIds =
      new Set<string>();

    const enrollmentCounts =
      new Map<
        string,
        number
      >();

    for (
      const enrollment
      of enrollmentRecords
    ) {
      const studentId =
        objectIdString(
          enrollment.studentId,
        );

      const classId =
        objectIdString(
          enrollment.classId,
        );

      if (studentId) {
        uniqueStudentIds.add(
          studentId,
        );
      }

      if (classId) {
        enrollmentCounts.set(
          classId,
          (
            enrollmentCounts.get(
              classId,
            ) || 0
          ) + 1,
        );
      }
    }

    const todayStart =
      new Date();

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

    const facultyFilter =
      getFacultyReferenceFilter(
        user,
      );

    const [
      todaySessions,
      upcomingSessions,
      pendingReviews,
      notifications,
    ] =
      await Promise.all([
        sessionCollection
          .find({
            ...facultyFilter,

            startAt: {
              $gte:
                todayStart,

              $lt:
                tomorrow,
            },
          })
          .sort({
            startAt: 1,
          })
          .toArray(),

        sessionCollection
          .find({
            ...facultyFilter,

            startAt: {
              $gte:
                new Date(),
            },
          })
          .sort({
            startAt: 1,
          })
          .limit(6)
          .toArray(),

        submissionsCollection.countDocuments(
          {
            ...facultyFilter,

            status: {
              $in: [
                "submitted",
                "pending_review",
              ],
            },
          },
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
                  "faculty",
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
            publishedAt: -1,
            createdAt: -1,
          })
          .limit(4)
          .toArray(),
      ]);

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
        faculty: {
          id:
            user._id.toHexString(),

          name:
            user.name,

          email:
            user.email,

          greeting,
        },

        summary: {
          students:
            uniqueStudentIds.size,

          totalClasses:
            classes.length,

          classesToday:
            todaySessions.length,

          pendingReviews,

          averageGrade:
            null,
        },

        classes:
          classes.map(
            (item) => ({
              ...serialiseClass(
                item,
              ),

              enrolledStudents:
                enrollmentCounts.get(
                  item._id.toHexString(),
                ) || 0,
            }),
          ),

        todaySchedule:
          todaySessions.map(
            (session) => ({
              id:
                session._id.toHexString(),

              classId:
                objectIdString(
                  session.classId,
                ),

              title:
                String(
                  session.title ||
                    "Class Session",
                ),

              startAt:
                session.startAt instanceof
                Date
                  ? session.startAt.toISOString()
                  : session.startAt,

              endAt:
                session.endAt instanceof
                Date
                  ? session.endAt.toISOString()
                  : session.endAt,

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
            }),
          ),

        upcomingSchedule:
          upcomingSessions.map(
            (session) => ({
              id:
                session._id.toHexString(),

              classId:
                objectIdString(
                  session.classId,
                ),

              title:
                String(
                  session.title ||
                    "Class Session",
                ),

              startAt:
                session.startAt instanceof
                Date
                  ? session.startAt.toISOString()
                  : session.startAt,

              endAt:
                session.endAt instanceof
                Date
                  ? session.endAt.toISOString()
                  : session.endAt,

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
            }),
          ),

        announcements:
          notifications.map(
            (item) => ({
              id:
                item._id.toHexString(),

              title:
                String(
                  item.title ||
                    "",
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
                item.createdAt instanceof
                Date
                  ? item.createdAt.toISOString()
                  : item.createdAt ||
                    null,
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
      "Faculty overview error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load faculty dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}
