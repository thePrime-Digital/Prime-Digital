import {
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
} from "@/lib/faculty/data";

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

    uploadedByName:
      String(
        item.uploadedByName ||
          "",
      ),

    uploadedByRole:
      String(
        item.uploadedByRole ||
          "",
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

async function getFacultyPrograms(
  database: Awaited<
    ReturnType<
      typeof getDatabase
    >
  >,
  user: Parameters<
    typeof getFacultyClassFilter
  >[0],
): Promise<string[]> {
  const classes =
    await database
      .collection<Document>(
        "classes",
      )
      .find(
        getFacultyClassFilter(
          user,
        ),
      )
      .project({
        program:
          1,
      })
      .toArray();

  return Array.from(
    new Set(
      classes
        .map(
          (item) =>
            String(
              item.program ||
                "",
            ).trim(),
        )
        .filter(
          (
            program,
          ) =>
            Boolean(
              program,
            ) &&
            isStudentProgram(
              program,
            ),
        ),
    ),
  );
}

export async function GET():
  Promise<NextResponse> {
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

    const programs =
      await getFacultyPrograms(
        database,
        authorization.user,
      );

    if (
      programs.length ===
      0
    ) {
      return NextResponse.json({
        programs: [],
        ebooks: [],
      });
    }

    const ebooks =
      await database
        .collection<Document>(
          "course_ebooks",
        )
        .find({
          program: {
            $in:
              programs,
          },

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
        programs,

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
      "Faculty eBooks GET error:",
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
    await requireFacultyApi();

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

    const allowedPrograms =
      await getFacultyPrograms(
        database,
        authorization.user,
      );

    if (
      !allowedPrograms.includes(
        program,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You can only manage eBooks for courses assigned to your faculty account.",
        },
        {
          status:
            403,
        },
      );
    }

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

          uploadedBy:
            authorization
              .user
              ._id,

          uploadedByName:
            authorization
              .user
              .name,

          uploadedByEmail:
            authorization
              .user
              .email,

          uploadedByRole:
            "faculty",

          updatedAt:
            now,
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

    if (!ebook) {
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
      "Faculty eBooks POST error:",
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