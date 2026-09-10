import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  createAdminAuditLog,
} from "@/lib/data/admin-audit";

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type EnrolBody = {
  studentIds?: unknown;
};

type RemoveBody = {
  studentId?: unknown;
};

function objectIdString(
  value: unknown,
): string {
  if (
    value instanceof
    ObjectId
  ) {
    return value.toHexString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return "";
}

async function getClass(
  id: string,
) {
  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return null;
  }

  const database =
    await getDatabase();

  return database
    .collection<Document>(
      "classes",
    )
    .findOne({
      _id:
        new ObjectId(id),
    });
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  const classRecord =
    await getClass(id);

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

  try {
    const database =
      await getDatabase();

    const classObjectId =
      new ObjectId(id);

    const enrollments =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .find({
          classId: {
            $in: [
              classObjectId,
              id,
            ],
          },

          status: {
            $ne:
              "removed",
          },
        })
        .toArray();

    const enrolledIds =
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

    const users =
      await getUsersCollection();

    const students =
      await users
        .find({
          role:
            "student",

          status:
            "active",
        })
        .sort({
          name: 1,
        })
        .toArray();

    const capacity =
      typeof classRecord.capacity ===
      "number"
        ? classRecord.capacity
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

          capacity,

          enrolledCount:
            enrolledIds.size,
        },

        students:
          students.map(
            (student) => {
              const studentId =
                student._id.toHexString();

              return {
                id:
                  studentId,

                name:
                  student.name,

                email:
                  student.email,

                studentLevel:
                  student.studentLevel ||
                  null,

                currentClass:
                  student.currentClass ||
                  null,

                degreeName:
                  student.degreeName ||
                  null,

                program:
                  student.program ||
                  null,

                enrolled:
                  enrolledIds.has(
                    studentId,
                  ),
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
      "Admin class students GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load class students.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  const classRecord =
    await getClass(id);

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

  let body:
    EnrolBody;

  try {
    body =
      (await request.json()) as
        EnrolBody;
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

  if (
    !Array.isArray(
      body.studentIds,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select at least one student.",
      },
      {
        status: 400,
      },
    );
  }

  const studentIds =
    Array.from(
      new Set(
        body.studentIds
          .filter(
            (
              value,
            ): value is string =>
              typeof value ===
              "string",
          )
          .map(
            (value) =>
              value.trim(),
          )
          .filter(
            (value) =>
              ObjectId.isValid(
                value,
              ),
          ),
      ),
    );

  if (
    studentIds.length ===
    0
  ) {
    return NextResponse.json(
      {
        error:
          "Please select at least one valid student.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const users =
      await getUsersCollection();

    const studentObjectIds =
      studentIds.map(
        (studentId) =>
          new ObjectId(
            studentId,
          ),
      );

    const students =
      await users
        .find({
          _id: {
            $in:
              studentObjectIds,
          },

          role:
            "student",

          status:
            "active",
        })
        .toArray();

    if (
      students.length !==
      studentIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more selected students are unavailable.",
        },
        {
          status: 400,
        },
      );
    }

    const classObjectId =
      new ObjectId(id);

    const enrollments =
      database.collection<Document>(
        "class_enrollments",
      );

    const current =
      await enrollments
        .find({
          classId: {
            $in: [
              classObjectId,
              id,
            ],
          },

          status: {
            $ne:
              "removed",
          },
        })
        .toArray();

    const currentlyEnrolled =
      new Set(
        current
          .map(
            (item) =>
              objectIdString(
                item.studentId,
              ),
          )
          .filter(Boolean),
      );

    const additions =
      students.filter(
        (student) =>
          !currentlyEnrolled.has(
            student._id.toHexString(),
          ),
      );

    const capacity =
      typeof classRecord.capacity ===
      "number"
        ? classRecord.capacity
        : null;

    if (
      capacity !==
        null &&
      current.length +
        additions.length >
        capacity
    ) {
      return NextResponse.json(
        {
          error:
            `Class capacity is ${capacity}. Only ${Math.max(
              0,
              capacity -
                current.length,
            )} more student(s) can be enrolled.`,
        },
        {
          status: 400,
        },
      );
    }

    const now =
      new Date();

    for (
      const student
      of additions
    ) {
      const studentId =
        student._id.toHexString();

      const existing =
        await enrollments.findOne({
          classId: {
            $in: [
              classObjectId,
              id,
            ],
          },

          studentId: {
            $in: [
              student._id,
              studentId,
            ],
          },
        });

      if (existing) {
        await enrollments.updateOne(
          {
            _id:
              existing._id,
          },
          {
            $set: {
              classId:
                classObjectId,

              className:
                String(
                  classRecord.name ||
                    "Class",
                ),

              studentId:
                student._id,

              studentName:
                student.name,

              studentEmail:
                student.email,

              status:
                "active",

              enrolledAt:
                now,

              enrolledBy:
                authorization.user._id,

              updatedAt:
                now,
            },

            $unset: {
              removedAt:
                "",

              removedBy:
                "",
            },
          },
        );
      } else {
        await enrollments.insertOne({
          classId:
            classObjectId,

          className:
            String(
              classRecord.name ||
                "Class",
            ),

          studentId:
            student._id,

          studentName:
            student.name,

          studentEmail:
            student.email,

          status:
            "active",

          enrolledAt:
            now,

          enrolledBy:
            authorization.user._id,

          createdAt:
            now,

          updatedAt:
            now,
        });
      }
    }

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CLASS_STUDENTS_ENROLLED",

      targetUserId:
        id,

      changes: [
        {
          field:
            "students",

          to:
            additions.map(
              (student) =>
                student.email,
            ),
        },
      ],
    });

    return NextResponse.json({
      message:
        additions.length ===
        0
          ? "Selected students were already enrolled."
          : `${additions.length} student(s) enrolled successfully.`,
    });
  } catch (error) {
    console.error(
      "Admin class enrollment POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to enrol students.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const { id } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
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

  let body:
    RemoveBody;

  try {
    body =
      (await request.json()) as
        RemoveBody;
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

  const studentId =
    typeof body.studentId ===
    "string"
      ? body.studentId.trim()
      : "";

  if (
    !ObjectId.isValid(
      studentId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid student ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const now =
      new Date();

    const result =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .updateMany(
          {
            classId: {
              $in: [
                new ObjectId(
                  id,
                ),
                id,
              ],
            },

            studentId: {
              $in: [
                new ObjectId(
                  studentId,
                ),
                studentId,
              ],
            },

            status: {
              $ne:
                "removed",
            },
          },
          {
            $set: {
              status:
                "removed",

              removedAt:
                now,

              removedBy:
                authorization.user._id,

              updatedAt:
                now,
            },
          },
        );

    if (
      result.matchedCount ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Student is not enrolled in this class.",
        },
        {
          status: 404,
        },
      );
    }

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CLASS_STUDENT_REMOVED",

      targetUserId:
        id,

      changes: [
        {
          field:
            "studentId",

          from:
            studentId,

          to:
            "removed",
        },
      ],
    });

    return NextResponse.json({
      message:
        "Student removed from class successfully.",
    });
  } catch (error) {
    console.error(
      "Admin class enrollment DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove student.",
      },
      {
        status: 500,
      },
    );
  }
}