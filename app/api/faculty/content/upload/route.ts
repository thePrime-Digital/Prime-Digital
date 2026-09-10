import {
  randomUUID,
} from "node:crypto";

import {
  put,
} from "@vercel/blob";

import {
  NextResponse,
} from "next/server";

import {
  requireFacultyApi,
} from "@/lib/auth/api-faculty-authorization";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const MAX_FILE_SIZE =
  4 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-powerpoint",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/plain",

    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

function safeFileName(
  value: string,
): string {
  const cleaned =
    value
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      )
      .slice(
        0,
        120,
      );

  return (
    cleaned ||
    "resource"
  );
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

  try {
    const formData =
      await request.formData();

    const value =
      formData.get(
        "file",
      );

    if (
      !(value instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a file.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      value.size === 0
    ) {
      return NextResponse.json(
        {
          error:
            "The selected file is empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      value.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "File must be smaller than 4 MB.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !ALLOWED_TYPES.has(
        value.type,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Upload PDF, Word, PowerPoint, Excel, text or image files.",
        },
        {
          status: 400,
        },
      );
    }

    const fileName =
      safeFileName(
        value.name,
      );

    const pathname =
      `course-content/${authorization.user._id.toHexString()}/${Date.now()}-${randomUUID()}-${fileName}`;

const blob =
  await put(
    pathname,
    value,
    {
      access:
        "private",
    },
  );

    return NextResponse.json({
      url:
        blob.url,

      fileName:
        value.name,

      size:
        value.size,

      contentType:
        value.type,
    });
  } catch (error) {
    console.error(
      "Faculty content upload error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to upload file.",
      },
      {
        status: 500,
      },
    );
  }
}