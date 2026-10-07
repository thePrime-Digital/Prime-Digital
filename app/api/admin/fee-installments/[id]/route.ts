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

type Installment = {
  id: string;
  title: string;

  amount: number;
  paidAmount: number;

  dueDate: string;
  paidDate: string;

  paymentMode: string;
  receiptNo: string;
};

type PlanStatus =
  | "pending"
  | "partial"
  | "paid"
  | "overdue";

type PlanDocument = {
  installments: Installment[];

  totalAmount: number;
  totalPaid: number;
  pendingAmount: number;

  status: PlanStatus;

  updatedAt: Date;
};

function text(
  value: unknown,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function calculateStatus(
  installments:
    Installment[],
): PlanStatus {
  const total =
    installments.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.amount,
      0,
    );

  const paid =
    installments.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.paidAmount,
      0,
    );

  if (
    total >
      0 &&
    paid >=
      total
  ) {
    return "paid";
  }

  const now =
    new Date();

  now.setHours(
    0,
    0,
    0,
    0,
  );

  const overdue =
    installments.some(
      (
        item,
      ) => {
        if (
          item.paidAmount >=
          item.amount
        ) {
          return false;
        }

        const dueDate =
          new Date(
            `${item.dueDate}T00:00:00`,
          );

        return (
          !Number.isNaN(
            dueDate.getTime(),
          ) &&
          dueDate <
            now
        );
      },
    );

  if (
    overdue
  ) {
    return "overdue";
  }

  return paid >
    0
    ? "partial"
    : "pending";
}

async function requireAdmin() {
  const session =
    await getSessionFromCookies();

  if (
    !session
  ) {
    return {
      response:
        NextResponse.json(
          {
            error:
              "Authentication required.",
          },
          {
            status:
              401,
          },
        ),
    };
  }

  const user =
    await findUserById(
      session.userId,
    );

  if (
    !user ||
    user.status !==
      "active" ||
    user.role !==
      "admin"
  ) {
    return {
      response:
        NextResponse.json(
          {
            error:
              "Admin access required.",
          },
          {
            status:
              403,
          },
        ),
    };
  }

  return {
    user,
  };
}

/* =========================================
   UPDATE INSTALLMENT
========================================= */

export async function PATCH(
  request: Request,
  context:
    RouteContext,
) {
  const authorization =
    await requireAdmin();

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
          "Invalid plan.",
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const body =
      (await request.json()) as
        Record<
          string,
          unknown
        >;

    const installmentId =
      text(
        body.installmentId,
      );

    const paidAmount =
      Number(
        body.paidAmount,
      );

    const database =
      await getDatabase();

    const collection =
      database.collection<PlanDocument>(
        "fee_installment_plans",
      );

    const objectId =
      new ObjectId(
        id,
      );

    const plan =
      await collection.findOne({
        _id:
          objectId,
      });

    if (
      !plan
    ) {
      return NextResponse.json(
        {
          error:
            "Plan not found.",
        },
        {
          status:
            404,
        },
      );
    }

    const current =
      plan.installments.find(
        (
          item,
        ) =>
          item.id ===
          installmentId,
      );

    if (
      !current
    ) {
      return NextResponse.json(
        {
          error:
            "Installment not found.",
        },
        {
          status:
            404,
        },
      );
    }

    if (
      !Number.isFinite(
        paidAmount,
      ) ||
      paidAmount <
        0 ||
      paidAmount >
        current.amount
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid paid amount.",
        },
        {
          status:
            400,
        },
      );
    }

    const installments =
      plan.installments.map(
        (
          item,
        ) =>
          item.id ===
          installmentId
            ? {
                ...item,

                paidAmount,

                paidDate:
                  text(
                    body.paidDate,
                  ),

                paymentMode:
                  text(
                    body.paymentMode,
                  ),

                receiptNo:
                  text(
                    body.receiptNo,
                  ),
              }
            : item,
      );

    const totalAmount =
      installments.reduce(
        (
          sum,
          item,
        ) =>
          sum +
          item.amount,
        0,
      );

    const totalPaid =
      installments.reduce(
        (
          sum,
          item,
        ) =>
          sum +
          item.paidAmount,
        0,
      );

    await collection.updateOne(
      {
        _id:
          objectId,
      },
      {
        $set: {
          installments,

          totalAmount,

          totalPaid,

          pendingAmount:
            Math.max(
              0,
              totalAmount -
                totalPaid,
            ),

          status:
            calculateStatus(
              installments,
            ),

          updatedAt:
            new Date(),
        },
      },
    );

    return NextResponse.json({
      message:
        "Installment payment updated successfully.",
    });
  } catch (
    error
  ) {
    console.error(
      "Installment PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update installment.",
      },
      {
        status:
          500,
      },
    );
  }
}

/* =========================================
   DELETE PLAN
========================================= */

export async function DELETE(
  _request: Request,
  context:
    RouteContext,
) {
  const authorization =
    await requireAdmin();

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
          "Invalid plan.",
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
        .collection(
          "fee_installment_plans",
        )
        .deleteOne({
          _id:
            new ObjectId(
              id,
            ),
        });

    if (
      result.deletedCount !==
      1
    ) {
      return NextResponse.json(
        {
          error:
            "Plan not found.",
        },
        {
          status:
            404,
        },
      );
    }

    return NextResponse.json({
      message:
        "Installment plan deleted successfully.",
    });
  } catch (
    error
  ) {
    console.error(
      "Installment DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete installment plan.",
      },
      {
        status:
          500,
      },
    );
  }
}