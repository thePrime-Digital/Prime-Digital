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
  getDatabase,
} from "@/lib/mongodb";

import {
  isStudentProgram,
} from "@/types/user";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type EbookBody = {
  title?: unknown;
  program?: unknown;
  driveUrl?: unknown;
};

function textValue(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function getDriveFileId(
  input: string,
): string | null {
  if (!input) {
    return null;
  }

  try {
    const url =
      new URL(input);

    if (
      url.protocol !==
      "https:"
    ) {
      return null;
    }

    const hostname =
      url.hostname.toLowerCase();

    if (
      hostname !==
        "drive.google.com" &&
      hostname !==
        "docs.google.com"
    ) {
      return null;
    }

    const fileMatch =
      url.pathname.match(
        /\/file\/d\/([^/]+)/,
      );

    const fileId =
      fileMatch?.[1] ||
      url.searchParams.get(
        "id",
      ) ||
      "";

    if (
      !/^[a-zA-Z0-9_-]{10,}$/.test(
        fileId,
      )
    ) {
      return null;
    }

    return fileId;
  } catch {
    return null;
  }
}

function previewUrl(
  fileId: string,
): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function serialiseEbook(
  item: Document,
) {
  const fileId =
    String(
      item.driveFileId ||
        "",
    );

  return {
    id:
      item._id.toHexString(),

    title:
      String(
        item.title ||
          "Course eBook",
      ),

    program:
      String(
        item.program ||
          "",
      ),

    driveFileId:
      fileId,

    previewUrl:
      fileId
        ? previewUrl(
            fileId,
          )
        : "",

    status:
      String(
        item.status ||
          "active",
      ),

    createdAt:
      item.createdAt instanceof
      Date
        ? item.createdAt.toISOString()
        : item.createdAt ||
          null,

    updatedAt:
      item.updatedAt instanceof
      Date
        ? item.updatedAt.toISOString()
        : item.updatedAt ||
          null,
  };
}

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const ebooks =
      await database
        .collection<Document>(
          "course_ebooks",
        )
        .find({
          status: {
            $ne:
              "removed",
          },
        })
        .sort({
          program:
            1,
        })
        .toArray();

    return NextResponse.json(
      {
        ebooks:
          ebooks.map(
            serialiseEbook,
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
      "Admin eBooks GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load eBooks.",
      },
      {
        status:
          500,
      },
    );
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  let body:
    EbookBody;

  try {
    body =
      (await request.json()) as
        EbookBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status:
          400,
      },
    );
  }

  const title =
    textValue(
      body.title,
    );

  const program =
    textValue(
      body.program,
    );

  const driveUrl =
    textValue(
      body.driveUrl,
    );

  if (
    title.length <
      2 ||
    title.length >
      150
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid eBook title.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !isStudentProgram(
      program,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid course.",
      },
      {
        status:
          400,
      },
    );
  }

  const driveFileId =
    getDriveFileId(
      driveUrl,
    );

  if (
    !driveFileId
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid Google Drive PDF link.",
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "course_ebooks",
      );

    const now =
      new Date();

    await collection.updateOne(
      {
        program,
      },
      {
        $set: {
          title,
          program,

          source:
            "google-drive",

          driveFileId,

          status:
            "active",

          updatedAt:
            now,

          updatedBy:
            authorization
              .user
              ._id,
        },

        $setOnInsert: {
          createdAt:
            now,
        },
      },
      {
        upsert:
          true,
      },
    );

    const ebook =
      await collection.findOne({
        program,
      });

    if (
      !ebook
    ) {
      return NextResponse.json(
        {
          error:
            "eBook could not be saved.",
        },
        {
          status:
            500,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "eBook saved successfully.",

        ebook:
          serialiseEbook(
            ebook,
          ),
      },
      {
        status:
          201,
      },
    );
  } catch (error) {
    console.error(
      "Admin eBooks POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to save eBook.",
      },
      {
        status:
          500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const url =
    new URL(
      request.url,
    );

  const id =
    url.searchParams
      .get(
        "id",
      )
      ?.trim() ||
    "";

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid eBook ID.",
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const result =
      await database
        .collection<Document>(
          "course_ebooks",
        )
        .updateOne(
          {
            _id:
              new ObjectId(
                id,
              ),
          },
          {
            $set: {
              status:
                "removed",

              updatedAt:
                new Date(),

              updatedBy:
                authorization
                  .user
                  ._id,
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
            "eBook not found.",
        },
        {
          status:
            404,
        },
      );
    }

    return NextResponse.json({
      message:
        "eBook removed.",
    });
  } catch (error) {
    console.error(
      "Admin eBooks DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove eBook.",
      },
      {
        status:
          500,
      },
    );
  }
}