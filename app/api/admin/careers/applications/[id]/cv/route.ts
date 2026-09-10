import {
  ObjectId,
  type Document,
} from "mongodb";

import {
  get,
} from "@vercel/blob";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

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

function safeFileName(
  value: string,
): string {
  return value.replace(
    /["\r\n]/g,
    "",
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const {
    id,
  } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid application ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const application =
      await database
        .collection<Document>(
          "career_applications",
        )
        .findOne({
          _id:
            new ObjectId(
              id,
            ),
        });

    if (!application) {
      return NextResponse.json(
        {
          error:
            "Application not found.",
        },
        {
          status: 404,
        },
      );
    }

    const cvUrl =
      typeof application.cvUrl ===
      "string"
        ? application.cvUrl
        : "";

    if (!cvUrl) {
      return NextResponse.json(
        {
          error:
            "CV is not available.",
        },
        {
          status: 404,
        },
      );
    }

    const result =
      await get(
        cvUrl,
        {
          access:
            "private",
        },
      );

    if (
      !result ||
      result.statusCode !==
        200
    ) {
      return NextResponse.json(
        {
          error:
            "CV could not be loaded.",
        },
        {
          status: 404,
        },
      );
    }

    const fileName =
      safeFileName(
        String(
          application.cvFileName ||
            "resume",
        ),
      );

    return new Response(
      result.stream,
      {
        headers: {
          "Content-Type":
            result.blob.contentType ||
            String(
              application.cvContentType ||
                "application/octet-stream",
            ),

          "Content-Disposition":
            `inline; filename="${fileName}"`,

          "Cache-Control":
            "private, no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(
      "Admin career CV GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to open CV.",
      },
      {
        status: 500,
      },
    );
  }
}