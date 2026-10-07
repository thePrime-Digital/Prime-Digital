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

type PlanDocument = {
  studentId: ObjectId;

  studentName: string;
  studentEmail: string;

  courseName: string;
  academicYear: string;

  notes: string;

  installments: Installment[];

  totalAmount: number;
  totalPaid: number;
  pendingAmount: number;

  status:
    | "pending"
    | "partial"
    | "paid"
    | "overdue";

  createdAt: Date;
  updatedAt: Date;
};

function serializePlan(
  plan:
    PlanDocument & {
      _id: ObjectId;
    },
) {
  return {
    id:
      plan._id.toString(),

    studentId:
      plan.studentId.toString(),

    studentName:
      plan.studentName,

    studentEmail:
      plan.studentEmail,

    courseName:
      plan.courseName,

    academicYear:
      plan.academicYear,

    notes:
      plan.notes,

    installments:
      plan.installments,

    totalAmount:
      plan.totalAmount,

    totalPaid:
      plan.totalPaid,

    pendingAmount:
      plan.pendingAmount,

    status:
      plan.status,

    createdAt:
      plan.createdAt.toISOString(),

    updatedAt:
      plan.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session =
    await getSessionFromCookies();

  if (
    !session
  ) {
    return NextResponse.json(
      {
        error:
          "Authentication required.",
      },
      {
        status:
          401,
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
      "active" ||
    user.role !==
      "student"
  ) {
    return NextResponse.json(
      {
        error:
          "Student access required.",
      },
      {
        status:
          403,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const plans =
      await database
        .collection<PlanDocument>(
          "fee_installment_plans",
        )
        .find({
          studentId:
            user._id,
        })
        .sort({
          createdAt:
            -1,
        })
        .toArray();

    return NextResponse.json({
      plans:
        plans.map(
          (
            plan,
          ) =>
            serializePlan(
              plan,
            ),
        ),
    });
  } catch (
    error
  ) {
    console.error(
      "Student installment GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load installment plans.",
      },
      {
        status:
          500,
      },
    );
  }
}