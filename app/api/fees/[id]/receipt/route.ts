import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  getSessionFromCookies,
} from "@/lib/auth/session";

import {
  findUserById,
} from "@/lib/data/users";

import {
  getFeesCollection,
  serializeFee,
} from "@/lib/data/fees";

import {
  getClassReferenceFilter,
  getFacultyClassFilter,
  objectIdString,
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

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const session =
    await getSessionFromCookies();

  if (!session) {
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

  const user =
    await findUserById(
      session.userId,
    );

  if (
    !user ||
    user.status !==
      "active"
  ) {
    return NextResponse.json(
      {
        error:
          "Access denied.",
      },
      {
        status: 403,
      },
    );
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
          "Invalid receipt.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const collection =
      await getFeesCollection();

    const fee =
      await collection.findOne({
        _id:
          new ObjectId(
            id,
          ),
      });

    if (!fee) {
      return NextResponse.json(
        {
          error:
            "Receipt not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      fee.paid <= 0 ||
      !fee.receiptNo
    ) {
      return NextResponse.json(
        {
          error:
            "A receipt is available after a payment has been recorded.",
        },
        {
          status: 404,
        },
      );
    }

    const feeStudentId =
      fee.studentId.toHexString();

    if (
      user.role ===
      "student"
    ) {
      if (
        feeStudentId !==
        user._id.toHexString()
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot access this receipt.",
          },
          {
            status: 403,
          },
        );
      }
    } else if (
      user.role ===
      "faculty"
    ) {
      const database =
        await getDatabase();

      const classes =
        await database
          .collection(
            "classes",
          )
          .find(
            getFacultyClassFilter(
              user,
            ),
          )
          .project({
            _id: 1,
          })
          .toArray();

      const classIds =
        classes.map(
          (item) =>
            item._id,
        );

      const enrollments =
        classIds.length >
        0
          ? await database
              .collection(
                "class_enrollments",
              )
              .find({
                ...getClassReferenceFilter(
                  classIds,
                ),

                status: {
                  $ne:
                    "removed",
                },
              })
              .toArray()
          : [];

      const allowed =
        enrollments.some(
          (item) =>
            objectIdString(
              item.studentId,
            ) ===
            feeStudentId,
        );

      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "You cannot access this receipt.",
          },
          {
            status: 403,
          },
        );
      }
    } else if (
      user.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        fee:
          serializeFee(
            fee,
          ),

        generatedAt:
          new Date().toISOString(),
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
      "Fee receipt GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load receipt.",
      },
      {
        status: 500,
      },
    );
  }
}