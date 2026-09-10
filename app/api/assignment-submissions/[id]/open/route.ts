import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  issueSignedToken,
  presignUrl,
} from "@vercel/blob";

import {
  NextResponse,
} from "next/server";

import {
  getCurrentUser,
} from "@/lib/auth/current-user";

import {
  getFacultyClassFilter,
} from "@/lib/faculty/data";

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

function blobPathname(
  value: string,
): string {
  const url =
    new URL(value);

  return url.pathname.replace(
    /^\/+/,
    "",
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const user =
    await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Authentication required.",
      },
      {
        status: 401,
      },
    );
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
          "Invalid submission ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const submission =
      await database
        .collection<Document>(
          "assignment_submissions",
        )
        .findOne({
          _id:
            new ObjectId(id),
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

    const fileUrl =
      typeof submission.fileUrl ===
      "string"
        ? submission.fileUrl.trim()
        : typeof submission.attachmentUrl ===
          "string"
          ? submission.attachmentUrl.trim()
          : "";

    if (!fileUrl) {
      return NextResponse.json(
        {
          error:
            "This submission does not contain an attachment.",
        },
        {
          status: 404,
        },
      );
    }

    let allowed =
      false;

    if (
      user.role ===
      "admin"
    ) {
      allowed =
        true;
    }

    if (
      user.role ===
      "student"
    ) {
      const studentId =
        objectIdString(
          submission.studentId,
        );

      allowed =
        studentId ===
        user._id.toHexString();
    }

    if (
      user.role ===
      "faculty"
    ) {
      const assignmentId =
        objectIdString(
          submission.assignmentId,
        );

      if (
        ObjectId.isValid(
          assignmentId,
        )
      ) {
        const assignment =
          await database
            .collection<Document>(
              "assignments",
            )
            .findOne({
              _id:
                new ObjectId(
                  assignmentId,
                ),
            });

        const classId =
          objectIdString(
            submission.classId ||
              assignment?.classId,
          );

        if (
          ObjectId.isValid(
            classId,
          )
        ) {
          const facultyClass =
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

          allowed =
            Boolean(
              facultyClass,
            );
        }
      }
    }

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this submission.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Google Drive, OneDrive, GitHub etc.
     * can still be used as external attachment links.
     */
    if (
      !fileUrl.includes(
        ".private.blob.vercel-storage.com",
      )
    ) {
      return NextResponse.redirect(
        fileUrl,
        307,
      );
    }

    const pathname =
      blobPathname(
        fileUrl,
      );

    const validUntil =
      Date.now() +
      5 * 60 * 1000;

    const token =
      await issueSignedToken({
        pathname,

        operations: [
          "get",
        ],

        validUntil,
      });

    const {
      presignedUrl,
    } =
      await presignUrl(
        token,
        {
          pathname,

          operation:
            "get",

          access:
            "private",

          validUntil,
        },
      );

    return NextResponse.redirect(
      presignedUrl,
      307,
    );
  } catch (error) {
    console.error(
      "Assignment submission open error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to open submission attachment.",
      },
      {
        status: 500,
      },
    );
  }
}