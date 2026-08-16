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
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type CreateAssignmentBody = {
  classId?: unknown;
  title?: unknown;
  description?: unknown;
  dueAt?: unknown;
  maxScore?: unknown;
  status?: unknown;
  attachmentUrl?: unknown;
};

function assignmentClassValues(
  classIds: ObjectId[],
) {
  return [
    ...classIds,
    ...classIds.map(
      (id) =>
        id.toHexString(),
    ),
  ];
}

function serialiseAssignment(
  assignment: Document,
  submissionCount = 0,
  pendingReviews = 0,
) {
  return {
    id:
      assignment._id.toHexString(),

    classId:
      objectIdString(
        assignment.classId,
      ),

    className:
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
      assignment.dueAt instanceof
      Date
        ? assignment.dueAt.toISOString()
        : assignment.dueAt ||
          null,

    maxScore:
      typeof assignment.maxScore ===
      "number"
        ? assignment.maxScore
        : 100,

    attachmentUrl:
      String(
        assignment.attachmentUrl ||
          "",
      ),

    status:
      typeof assignment.status ===
      "string"
        ? assignment.status
        : "draft",

    submissionCount,
    pendingReviews,

    createdAt:
      assignment.createdAt instanceof
      Date
        ? assignment.createdAt.toISOString()
        : assignment.createdAt ||
          null,

    updatedAt:
      assignment.updatedAt instanceof
      Date
        ? assignment.updatedAt.toISOString()
        : assignment.updatedAt ||
          null,
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

    const classes =
      await database
        .collection<Document>(
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

    const url =
      new URL(request.url);

    const requestedClassId =
      url.searchParams
        .get("classId")
        ?.trim() || "";

    let assignmentFilter:
      Record<
        string,
        unknown
      > = {
      classId: {
        $in:
          assignmentClassValues(
            classIds,
          ),
      },
    };

    if (
      requestedClassId &&
      classIds.some(
        (id) =>
          id.toHexString() ===
          requestedClassId,
      )
    ) {
      assignmentFilter = {
        $or: [
          {
            classId:
              new ObjectId(
                requestedClassId,
              ),
          },
          {
            classId:
              requestedClassId,
          },
        ],
      };
    }

    const assignments =
      classIds.length >
      0
        ? await database
            .collection<Document>(
              "assignments",
            )
            .find(
              assignmentFilter,
            )
            .sort({
              createdAt: -1,
            })
            .toArray()
        : [];

    const assignmentIds =
      assignments.map(
        (item) =>
          item._id,
      );

    const submissions =
      assignmentIds.length >
      0
        ? await database
            .collection<Document>(
              "assignment_submissions",
            )
            .find({
              assignmentId: {
                $in: [
                  ...assignmentIds,
                  ...assignmentIds.map(
                    (id) =>
                      id.toHexString(),
                  ),
                ],
              },
            })
            .toArray()
        : [];

    const totalMap =
      new Map<
        string,
        number
      >();

    const pendingMap =
      new Map<
        string,
        number
      >();

    for (
      const submission
      of submissions
    ) {
      const assignmentId =
        objectIdString(
          submission.assignmentId,
        );

      if (!assignmentId) {
        continue;
      }

      totalMap.set(
        assignmentId,
        (
          totalMap.get(
            assignmentId,
          ) || 0
        ) + 1,
      );

      if (
        submission.status ===
          "submitted" ||
        submission.status ===
          "pending_review"
      ) {
        pendingMap.set(
          assignmentId,
          (
            pendingMap.get(
              assignmentId,
            ) || 0
          ) + 1,
        );
      }
    }

    return NextResponse.json(
      {
        classes:
          classes.map(
            serialiseClass,
          ),

        assignments:
          assignments.map(
            (assignment) =>
              serialiseAssignment(
                assignment,

                totalMap.get(
                  assignment._id.toHexString(),
                ) || 0,

                pendingMap.get(
                  assignment._id.toHexString(),
                ) || 0,
              ),
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
      "Faculty assignments GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load assignments.",
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
    CreateAssignmentBody;

  try {
    body =
      (await request.json()) as CreateAssignmentBody;
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

  const title =
    typeof body.title ===
    "string"
      ? body.title.trim()
      : "";

  const description =
    typeof body.description ===
    "string"
      ? body.description.trim()
      : "";

  const attachmentUrl =
    typeof body.attachmentUrl ===
    "string"
      ? body.attachmentUrl.trim()
      : "";

  const status =
    body.status ===
    "published"
      ? "published"
      : "draft";

  const maxScore =
    Number(
      body.maxScore ??
        100,
    );

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
    title.length < 2 ||
    title.length > 150
  ) {
    return NextResponse.json(
      {
        error:
          "Assignment title must be between 2 and 150 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !Number.isFinite(
      maxScore,
    ) ||
    maxScore <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "Maximum score must be greater than zero.",
      },
      {
        status: 400,
      },
    );
  }

  const dueAt =
    new Date(
      typeof body.dueAt ===
      "string"
        ? body.dueAt
        : "",
    );

  if (
    Number.isNaN(
      dueAt.getTime(),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid due date.",
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
            "This class is not assigned to your account.",
        },
        {
          status: 403,
        },
      );
    }

    const now =
      new Date();

    const result =
      await database
        .collection<Document>(
          "assignments",
        )
        .insertOne({
          facultyId:
            authorization.user._id,

          facultyName:
            authorization.user.name,

          facultyEmail:
            authorization.user.email,

          classId:
            classRecord._id,

          className:
            classRecord.name,

          title,
          description,
          dueAt,
          maxScore,
          attachmentUrl,
          status,

          createdAt:
            now,

          updatedAt:
            now,
        });

    return NextResponse.json(
      {
        message:
          status ===
          "published"
            ? "Assignment published successfully."
            : "Assignment draft created.",

        id:
          result.insertedId.toHexString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Faculty assignment POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create assignment.",
      },
      {
        status: 500,
      },
    );
  }
}
