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
  calculateFeeStatus,
  cleanFeeText,
  createFeeReceiptNumber,
  getFeesCollection,
  positiveFeeAmount,
  serializeFee,
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

type PaymentBody = {
  amount?: unknown;
  date?: unknown;
  mode?: unknown;
  transactionRef?: unknown;
  bank?: unknown;
};

function parsePaymentDate(
  value: unknown,
): Date {
  if (
    typeof value ===
      "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value.trim(),
    )
  ) {
    const date =
      new Date(
        `${value.trim()}T12:00:00`,
      );

    if (
      !Number.isNaN(
        date.getTime(),
      )
    ) {
      return date;
    }
  }

  return new Date();
}

export async function POST(
  request: Request,
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

  let body:
    PaymentBody;

  try {
    body =
      (await request.json()) as
        PaymentBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const amount =
    positiveFeeAmount(
      body.amount,
    );

  if (!amount) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid payment amount.",
      },
      {
        status: 400,
      },
    );
  }

  const mode =
    cleanFeeText(
      body.mode,
      50,
    );

  if (!mode) {
    return NextResponse.json(
      {
        error:
          "Please select a payment mode.",
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

    const currentBalance =
      Math.max(
        0,
        fee.amount -
          fee.paid,
      );

    if (
      amount >
      currentBalance
    ) {
      return NextResponse.json(
        {
          error:
            `Payment cannot exceed the remaining balance of ₹${currentBalance.toLocaleString(
              "en-IN",
            )}.`,
        },
        {
          status: 400,
        },
      );
    }

    const paid =
      Math.round(
        (
          fee.paid +
          amount
        ) *
          100,
      ) / 100;

    const balance =
      Math.max(
        0,
        Math.round(
          (
            fee.amount -
            paid
          ) *
            100,
        ) / 100,
      );

    const now =
      new Date();

    const isFirstReceipt =
      !fee.receiptNo;

    const receiptNo =
      fee.receiptNo ||
      (await createFeeReceiptNumber());

    const payment = {
      id:
        new ObjectId().toHexString(),

      date:
        parsePaymentDate(
          body.date,
        ),

      amount,

      mode,

      transactionRef:
        cleanFeeText(
          body.transactionRef,
          120,
        ),

      bank:
        cleanFeeText(
          body.bank,
          120,
        ),
    };

    const setFields = {
      paid,
      balance,

      receiptNo,

      receiptIssuedAt:
        isFirstReceipt
          ? now
          : fee.receiptIssuedAt ||
            now,

      status:
        calculateFeeStatus(
          fee.amount,
          paid,
          fee.dueDate,
        ),

      updatedAt:
        now,
    };

    await collection.updateOne(
      {
        _id:
          fee._id,
      },
      {
        $set:
          setFields,

        $push: {
          payments:
            payment,
        },
      },
    );

    const updated =
      await collection.findOne({
        _id:
          fee._id,
      });

    if (!updated) {
      throw new Error(
        "Updated payment record could not be loaded.",
      );
    }

    return NextResponse.json({
      message:
        "Payment recorded successfully.",

      fee:
        serializeFee(
          updated,
        ),
    });
  } catch (error) {
    console.error(
      "Fee payment POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to record payment.",
      },
      {
        status: 500,
      },
    );
  }
}