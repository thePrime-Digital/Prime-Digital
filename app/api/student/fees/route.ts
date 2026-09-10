import {
  NextResponse,
} from "next/server";

import {
  requireStudentApi,
} from "@/lib/auth/api-student-authorization";

import {
  getFeesCollection,
  serializeFee,
} from "@/lib/data/fees";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

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
    const collection =
      await getFeesCollection();

    const fees =
      await collection
        .find({
          studentId:
            authorization.user._id,
        })
        .sort({
          dueDate: -1,
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json(
      {
        fees:
          fees.map(
            serializeFee,
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
      "Student fees GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load your fee records.",
      },
      {
        status: 500,
      },
    );
  }
}