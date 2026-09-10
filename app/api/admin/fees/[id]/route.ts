import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  getFeesCollection,
} from "@/lib/data/fees";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
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
          "Invalid fee record.",
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
            "Fee record not found.",
        },
        {
          status: 404,
        },
      );
    }

    await collection.deleteOne({
      _id:
        fee._id,
    });

    return NextResponse.json({
      message:
        "Fee record deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete fee record error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete fee record.",
      },
      {
        status: 500,
      },
    );
  }
}