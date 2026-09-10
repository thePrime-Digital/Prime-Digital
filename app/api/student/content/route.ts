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
  objectAndStringValues,
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

function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    return value.toISOString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return null;
}

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireStudentApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const user =
      authorization.user;

    const enrollments =
      await database
        .collection<Document>(
          "class_enrollments",
        )
        .find({
          studentId: {
            $in:
              studentReferenceValues(
                user,
              ),
          },

          status: {
            $ne:
              "removed",
          },
        })
        .toArray();

    const classIds =
      Array.from(
        new Set(
          enrollments
            .map(
              (item) =>
                objectIdString(
                  item.classId,
                ),
            )
            .filter(
              (id) =>
                ObjectId.isValid(
                  id,
                ),
            ),
        ),
      ).map(
        (id) =>
          new ObjectId(id),
      );

    if (
      classIds.length ===
      0
    ) {
      return NextResponse.json({
        content: [],
        classes: [],
      });
    }

    const classValues =
      objectAndStringValues(
        classIds,
      );

    const classes =
      await database
        .collection<Document>(
          "classes",
        )
        .find({
          _id: {
            $in:
              classIds,
          },
        })
        .toArray();

    const classNames =
      new Map<
        string,
        string
      >(
        classes.map(
          (item) => [
            item._id.toHexString(),

            String(
              item.name ||
                "Class",
            ),
          ],
        ),
      );

    const contentRecords =
      await database
        .collection<Document>(
          "course_content",
        )
        .find({
          $or: [
            {
              classId: {
                $in:
                  classValues,
              },
            },

            {
              classIds: {
                $in:
                  classValues,
              },
            },
          ],
        })
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .toArray();

    const visible =
      contentRecords.filter(
        (item) => {
          const status =
            typeof item.status ===
            "string"
              ? item.status
                  .trim()
                  .toLowerCase()
              : "published";

          return ![
            "draft",
            "hidden",
            "removed",
            "archived",
          ].includes(
            status,
          );
        },
      );

    return NextResponse.json(
      {
        classes:
          classes.map(
            (item) => ({
              id:
                item._id.toHexString(),

              name:
                String(
                  item.name ||
                    "Class",
                ),
            }),
          ),

        content:
          visible.map(
            (item) => {
              const classId =
                objectIdString(
                  item.classId,
                );

              const type =
                String(
                  item.contentType ||
                    item.resourceType ||
                    item.type ||
                    "resource",
                );

              const url =
                String(
                  item.url ||
                    item.fileUrl ||
                    item.contentUrl ||
                    item.attachmentUrl ||
                    item.link ||
                    "",
                );

              return {
                id:
                  item._id.toHexString(),

                classId,

                className:
                  classNames.get(
                    classId,
                  ) ||
                  String(
                    item.className ||
                      "Class",
                  ),

                title:
                  String(
                    item.title ||
                      item.name ||
                      "Learning Resource",
                  ),

                description:
                  String(
                    item.description ||
                      item.notes ||
                      "",
                  ),

                type,

                url,

                fileName:
                  String(
                    item.fileName ||
                      item.filename ||
                      "",
                  ),

                duration:
                  String(
                    item.duration ||
                      "",
                  ),

                status:
                  String(
                    item.status ||
                      "published",
                  ),

                createdAt:
                  dateValue(
                    item.createdAt,
                  ),
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
      "Student content error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load learning content.",
      },
      {
        status: 500,
      },
    );
  }
}