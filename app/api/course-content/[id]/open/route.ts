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
          "Invalid content ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const content =
      await database
        .collection<Document>(
          "course_content",
        )
        .findOne({
          _id:
            new ObjectId(id),
        });

    if (!content) {
      return NextResponse.json(
        {
          error:
            "Learning resource not found.",
        },
        {
          status: 404,
        },
      );
    }

    const contentUrl =
      typeof content.url ===
      "string"
        ? content.url.trim()
        : typeof content.fileUrl ===
          "string"
          ? content.fileUrl.trim()
          : "";

    if (!contentUrl) {
      return NextResponse.json(
        {
          error:
            "This resource does not contain a file.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * External links/videos do not need Blob signing.
     */
    if (
      !contentUrl.includes(
        ".private.blob.vercel-storage.com",
      )
    ) {
      return NextResponse.redirect(
        contentUrl,
        307,
      );
    }

    const classId =
      objectIdString(
        content.classId,
      );

    if (
      !ObjectId.isValid(
        classId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid class reference.",
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
      "faculty"
    ) {
      const facultyClass =
        await database
          .collection<Document>(
            "classes",
          )
          .findOne({
            _id:
              classObjectId,

            ...getFacultyClassFilter(
              user,
            ),
          });

      allowed =
        Boolean(
          facultyClass,
        );
    }

    if (
      user.role ===
      "student"
    ) {
      const enrollment =
        await database
          .collection<Document>(
            "class_enrollments",
          )
          .findOne({
            classId: {
              $in: [
                classObjectId,
                classId,
              ],
            },

            studentId: {
              $in: [
                user._id,
                user._id.toHexString(),
              ],
            },

            status: {
              $ne:
                "removed",
            },
          });

      allowed =
        Boolean(
          enrollment,
        );
    }

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this learning resource.",
        },
        {
          status: 403,
        },
      );
    }

    const pathname =
      blobPathname(
        contentUrl,
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
      "Course content open error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to open learning resource.",
      },
      {
        status: 500,
      },
    );
  }
}