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
    const database =
      await getDatabase();

    const classesCollection =
      database.collection(
        "classes",
      );

    const enrollmentCollection =
      database.collection(
        "class_enrollments",
      );

    const classes =
      await classesCollection
        .find(
          getFacultyClassFilter(
            authorization.user,
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

    const counts =
      new Map<
        string,
        number
      >();

    if (
      classIds.length >
      0
    ) {
      const enrollments =
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

      for (
        const enrollment
        of enrollments
      ) {
        const classId =
          objectIdString(
            enrollment.classId,
          );

        if (classId) {
          counts.set(
            classId,
            (
              counts.get(
                classId,
              ) || 0
            ) + 1,
          );
        }
      }
    }

    return NextResponse.json(
      {
        classes:
          classes.map(
            (item) => ({
              ...serialiseClass(
                item,
              ),

              enrolledStudents:
                counts.get(
                  item._id.toHexString(),
                ) || 0,
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
      "Faculty classes error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load classes.",
      },
      {
        status: 500,
      },
    );
  }
}
