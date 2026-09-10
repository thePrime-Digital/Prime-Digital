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

function dateValue(
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

    const enrollments =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .find({
          studentId: {
            $in:
              studentReferenceValues(
                authorization.user,
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
          new ObjectId(id),
      );

    if (
      classIds.length ===
      0
    ) {
      return NextResponse.json({
        liveNow: [],
        upcoming: [],
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

    const now =
      new Date();

    const searchStart =
      new Date(
        now.getTime() -
          12 *
            60 *
            60 *
            1000,
      );

    const sessions =
      await database
        .collection<Document>(
          "faculty_sessions",
        )
        .find({
          classId: {
            $in:
              classValues,
          },

          startAt: {
            $gte:
              searchStart,
          },

          status: {
            $ne:
              "cancelled",
          },
        })
        .sort({
          startAt: 1,
        })
        .limit(50)
        .toArray();

    const serialised =
      sessions.map(
        (session) => {
          const classId =
            objectIdString(
              session.classId,
            );

          const start =
            session.startAt instanceof
            Date
              ? session.startAt
              : new Date(
                  String(
                    session.startAt ||
                      "",
                  ),
                );

          const end =
            session.endAt instanceof
            Date
              ? session.endAt
              : new Date(
                  String(
                    session.endAt ||
                      "",
                  ),
                );

          const live =
            !Number.isNaN(
              start.getTime(),
            ) &&
            !Number.isNaN(
              end.getTime(),
            ) &&
            start <= now &&
            end >= now;

          return {
            id:
              session._id.toHexString(),

            classId,

            className:
              classNames.get(
                classId,
              ) ||
              String(
                session.className ||
                  "Class",
              ),

            title:
              String(
                session.title ||
                  "Class Session",
              ),

            startAt:
              dateValue(
                session.startAt,
              ),

            endAt:
              dateValue(
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

            meetingUrl:
              String(
                session.meetingUrl ||
                  session.joinUrl ||
                  session.url ||
                  session.link ||
                  "",
              ),

            status:
              String(
                session.status ||
                  "scheduled",
              ),

            live,
          };
        },
      );

    return NextResponse.json(
      {
        liveNow:
          serialised.filter(
            (session) =>
              session.live,
          ),

        upcoming:
          serialised
            .filter(
              (session) => {
                if (
                  session.live ||
                  !session.startAt
                ) {
                  return false;
                }

                const date =
                  new Date(
                    session.startAt,
                  );

                return (
                  !Number.isNaN(
                    date.getTime(),
                  ) &&
                  date > now
                );
              },
            )
            .slice(
              0,
              20,
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
      "Student live classes error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load live classes.",
      },
      {
        status: 500,
      },
    );
  }
}