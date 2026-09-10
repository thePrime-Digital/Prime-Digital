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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type SubmitBody = {
  text?: unknown;
  fileUrl?: unknown;
};

function validHttpUrl(
  value: string,
): boolean {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

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
    SubmitBody;

  try {
    body =
      (await request.json()) as
        SubmitBody;
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

  const text =
    typeof body.text ===
    "string"
      ? body.text.trim()
      : "";

  const fileUrl =
    typeof body.fileUrl ===
    "string"
      ? body.fileUrl.trim()
      : "";

  if (
    !text &&
    !fileUrl
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter an answer or attach your assignment file.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    text.length >
    20000
  ) {
    return NextResponse.json(
      {
        error:
          "Assignment response is too long.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    fileUrl.length >
      1500 ||
    !validHttpUrl(
      fileUrl,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please provide a valid http or https attachment.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const assignment =
      await database
        .collection<Document>(
          "assignments",
        )
        .findOne({
          _id:
            new ObjectId(id),

          status:
            "published",
        });

    if (!assignment) {
      return NextResponse.json(
        {
          error:
            "This assignment is not available for submission.",
        },
        {
          status: 404,
        },
      );
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
      return NextResponse.json(
        {
          error:
            "Assignment class is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    const classObjectId =
      new ObjectId(
        classId,
      );

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
              classObjectId,
              classId,
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
            "You are not enrolled in this assignment's class.",
        },
        {
          status: 403,
        },
      );
    }

    const submissions =
      database.collection<Document>(
        "assignment_submissions",
      );

    /*
     * A student is allowed exactly one submission.
     * Once a submission exists, it can never be edited
     * or resubmitted.
     */
    const existing =
      await submissions.findOne({
        assignmentId: {
          $in: [
            assignment._id,
            assignment._id.toHexString(),
          ],
        },

        studentId: {
          $in:
            studentValues,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "This assignment has already been submitted. Your submission is final and cannot be edited or resubmitted.",
        },
        {
          status: 409,
        },
      );
    }

    const now =
      new Date();

    await submissions.insertOne({
      assignmentId:
        assignment._id,

      assignmentTitle:
        String(
          assignment.title ||
            "Assignment",
        ),

      classId:
        classObjectId,

      className:
        String(
          assignment.className ||
            "",
        ),

      facultyId:
        assignment.facultyId,

      facultyName:
        assignment.facultyName,

      facultyEmail:
        assignment.facultyEmail,

      studentId:
        authorization.user._id,

      studentName:
        authorization.user.name,

      studentEmail:
        authorization.user.email,

      text,
      fileUrl,

      status:
        "submitted",

      submittedAt:
        now,

      createdAt:
        now,

      updatedAt:
        now,
    });

    return NextResponse.json(
      {
        message:
          "Assignment submitted successfully. This submission is now final.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Student assignment submission error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit assignment.",
      },
      {
        status: 500,
      },
    );
  }
}