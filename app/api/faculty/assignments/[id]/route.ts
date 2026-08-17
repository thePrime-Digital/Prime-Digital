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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PatchBody = {
  action?: unknown;
  status?: unknown;
  submissionId?: unknown;
  grade?: unknown;
  feedback?: unknown;
};

async function getOwnedAssignment(
  database: Awaited<
    ReturnType<
      typeof getDatabase
    >
  >,

  assignmentId: ObjectId,

  user: any,
) {
  const assignment =
    await database
      .collection<Document>(
        "assignments",
      )
      .findOne({
        _id:
          assignmentId,
      });

  if (!assignment) {
    return null;
  }

  const classId =
    objectIdString(
      assignment.classId,
    );

  if (
    !ObjectId.isValid(
      classId,
    )
  ) {
    return null;
  }

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
          user,
        ),
      });

  if (!classRecord) {
    return null;
  }

  return {
    assignment,
    classRecord,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

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
          "Invalid assignment ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const owned =
      await getOwnedAssignment(
        database,
        new ObjectId(id),
        authorization.user,
      );

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Assignment not found.",
        },
        {
          status: 404,
        },
      );
    }

    const submissions =
      await database
        .collection<Document>(
          "assignment_submissions",
        )
        .find({
          $or: [
            {
              assignmentId:
                owned.assignment._id,
            },
            {
              assignmentId:
                owned.assignment._id.toHexString(),
            },
          ],
        })
        .sort({
          submittedAt: -1,
          createdAt: -1,
        })
        .toArray();

    const studentIds =
      Array.from(
        new Set(
          submissions
            .map(
              (item) =>
                objectIdString(
                  item.studentId,
                ),
            )
            .filter(
              (studentId) =>
                ObjectId.isValid(
                  studentId,
                ),
            ),
        ),
      ).map(
        (studentId) =>
          new ObjectId(
            studentId,
          ),
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
            })
            .toArray()
        : [];

    const studentMap =
      new Map(
        students.map(
          (student) => [
            student._id.toHexString(),
            student,
          ],
        ),
      );

    return NextResponse.json(
      {
        assignment: {
          id:
            owned.assignment._id.toHexString(),

          title:
            String(
              owned.assignment.title ||
                "",
            ),

          description:
            String(
              owned.assignment.description ||
                "",
            ),

          classId:
            owned.classRecord._id.toHexString(),

          className:
            String(
              owned.classRecord.name ||
                "",
            ),

          maxScore:
            typeof owned.assignment.maxScore ===
            "number"
              ? owned.assignment.maxScore
              : 100,

          dueAt:
            owned.assignment.dueAt instanceof
            Date
              ? owned.assignment.dueAt.toISOString()
              : owned.assignment.dueAt ||
                null,

          status:
            String(
              owned.assignment.status ||
                "draft",
            ),
        },

        submissions:
          submissions.map(
            (submission) => {
              const studentId =
                objectIdString(
                  submission.studentId,
                );

              const student =
                studentMap.get(
                  studentId,
                );

              return {
                id:
                  submission._id.toHexString(),

                studentId,

                studentName:
                  student?.name ||
                  String(
                    submission.studentName ||
                      "Student",
                  ),

                studentEmail:
                  student?.email ||
                  String(
                    submission.studentEmail ||
                      "",
                  ),

                text:
                  String(
                    submission.text ||
                      submission.answer ||
                      "",
                  ),

                fileUrl:
                  String(
                    submission.fileUrl ||
                      submission.attachmentUrl ||
                      "",
                  ),

                status:
                  String(
                    submission.status ||
                      "submitted",
                  ),

                grade:
                  typeof submission.grade ===
                  "number"
                    ? submission.grade
                    : null,

                feedback:
                  String(
                    submission.feedback ||
                      "",
                  ),

                submittedAt:
                  submission.submittedAt instanceof
                  Date
                    ? submission.submittedAt.toISOString()
                    : submission.submittedAt ||
                      submission.createdAt ||
                      null,
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
      "Faculty assignment detail error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load assignment details.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireFacultyApi();

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
          "Invalid assignment ID.",
      },
      {
        status: 400,
      },
    );
  }

  let body:
    PatchBody;

  try {
    body =
      (await request.json()) as PatchBody;
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

  const action =
    typeof body.action ===
    "string"
      ? body.action
          .trim()
          .toLowerCase()
      : "";

  try {
    const database =
      await getDatabase();

    const owned =
      await getOwnedAssignment(
        database,
        new ObjectId(id),
        authorization.user,
      );

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Assignment not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      action ===
      "change_status"
    ) {
      const status =
        typeof body.status ===
        "string"
          ? body.status
              .trim()
              .toLowerCase()
          : "";

      if (
        ![
          "draft",
          "published",
          "closed",
        ].includes(
          status,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid assignment status.",
          },
          {
            status: 400,
          },
        );
      }

      await database
        .collection<Document>(
          "assignments",
        )
        .updateOne(
          {
            _id:
              owned.assignment._id,
          },
          {
            $set: {
              status,
              updatedAt:
                new Date(),
            },
          },
        );

      return NextResponse.json({
        message:
          "Assignment status updated successfully.",
      });
    }

    if (
      action ===
      "grade_submission"
    ) {
      const submissionId =
        typeof body.submissionId ===
        "string"
          ? body.submissionId.trim()
          : "";

      const grade =
        Number(
          body.grade,
        );

      const feedback =
        typeof body.feedback ===
        "string"
          ? body.feedback.trim()
          : "";

      if (
        !ObjectId.isValid(
          submissionId,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid submission ID.",
          },
          {
            status: 400,
          },
        );
      }

      const maxScore =
        typeof owned.assignment.maxScore ===
        "number"
          ? owned.assignment.maxScore
          : 100;

      if (
        !Number.isFinite(
          grade,
        ) ||
        grade < 0 ||
        grade > maxScore
      ) {
        return NextResponse.json(
          {
            error:
              `Grade must be between 0 and ${maxScore}.`,
          },
          {
            status: 400,
          },
        );
      }

      const submission =
        await database
          .collection<Document>(
            "assignment_submissions",
          )
          .findOne({
            _id:
              new ObjectId(
                submissionId,
              ),

            $or: [
              {
                assignmentId:
                  owned.assignment._id,
              },
              {
                assignmentId:
                  owned.assignment._id.toHexString(),
              },
            ],
          });

      if (!submission) {
        return NextResponse.json(
          {
            error:
              "Submission not found.",
          },
          {
            status: 404,
          },
        );
      }

      await database
        .collection<Document>(
          "assignment_submissions",
        )
        .updateOne(
          {
            _id:
              submission._id,
          },
          {
            $set: {
              grade,
              feedback,
              status:
                "graded",

              gradedAt:
                new Date(),

              gradedBy:
                authorization.user._id,

              updatedAt:
                new Date(),
            },
          },
        );

      return NextResponse.json({
        message:
          "Submission graded successfully.",
      });
    }

    return NextResponse.json(
      {
        error:
          "Invalid assignment action.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error(
      "Faculty assignment PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update assignment.",
      },
      {
        status: 500,
      },
    );
  }
}
