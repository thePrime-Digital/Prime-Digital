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
  getDatabase,
} from "@/lib/mongodb";

import {
  getFeesCollection,
  serializeFee,
} from "@/lib/data/fees";

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
        .project({
          _id: 1,
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
        fees: [],
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

    const studentIds =
      studentIdStrings
        .filter(
          (id) =>
            ObjectId.isValid(
              id,
            ),
        )
        .map(
          (id) =>
            new ObjectId(
              id,
            ),
        );

    if (
      studentIds.length ===
      0
    ) {
      return NextResponse.json({
        fees: [],
      });
    }

    const collection =
      await getFeesCollection();

    const fees =
      await collection
        .find({
          studentId: {
            $in:
              studentIds,
          },
        })
        .sort({
          dueDate: -1,
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json(
      {
        fees:
          fees.map(
            serializeFee,
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
      "Faculty fees GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load student fee records.",
      },
      {
        status: 500,
      },
    );
  }
}