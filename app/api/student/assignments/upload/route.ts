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
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const MAX_FILE_SIZE =
  4 * 1024 * 1024;

const ALLOWED_EXTENSIONS =
  new Set([
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "txt",
    "jpg",
    "jpeg",
    "png",
    "webp",
    "zip",
  ]);

function safeFileName(
  value: string,
): string {
  return (
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
      ) ||
    "assignment-file"
  );
}

function fileExtension(
  fileName: string,
): string {
  return (
    fileName
      .split(".")
      .pop()
      ?.toLowerCase() ||
    ""
  );
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

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
            "Please choose a file.",
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

    const extension =
      fileExtension(
        value.name,
      );

    if (
      !ALLOWED_EXTENSIONS.has(
        extension,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Upload PDF, Word, PowerPoint, Excel, text, image or ZIP files.",
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
      `assignment-submissions/${authorization.user._id.toHexString()}/${Date.now()}-${randomUUID()}-${fileName}`;

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
    });
  } catch (error) {
    console.error(
      "Student assignment upload error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to upload assignment file.",
      },
      {
        status: 500,
      },
    );
  }
}