import {
  randomUUID,
} from "node:crypto";

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

type PlanStatus =
  | "pending"
  | "partial"
  | "paid"
  | "overdue";

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

  status: PlanStatus;

  createdAt: Date;
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

  if (
    paid >
    0
  ) {
    return "partial";
  }

  return "pending";
}

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
   GET
========================================= */

export async function GET() {
  const authorization =
    await requireAdmin();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const plans =
      await database
        .collection<PlanDocument>(
          "fee_installment_plans",
        )
        .find({})
        .sort({
          createdAt:
            -1,
        })
        .toArray();

    const students =
      await database
        .collection(
          "users",
        )
        .find({
          role:
            "student",

          status:
            "active",
        })
        .project({
          name:
            1,

          email:
            1,

          program:
            1,

          currentClass:
            1,
        })
        .sort({
          name:
            1,
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

      students:
        students.map(
          (
            student,
          ) => ({
            id:
              student._id.toString(),

            name:
              text(
                student.name,
              ),

            email:
              text(
                student.email,
              ),

            program:
              text(
                student.program,
              ),

            currentClass:
              text(
                student.currentClass,
              ),
          }),
        ),
    });
  } catch (
    error
  ) {
    console.error(
      "Installment GET error:",
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

/* =========================================
   POST
========================================= */

export async function POST(
  request: Request,
) {
  const authorization =
    await requireAdmin();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const body =
      (await request.json()) as
        Record<
          string,
          unknown
        >;

    const studentId =
      text(
        body.studentId,
      );

    if (
      !ObjectId.isValid(
        studentId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid student.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !Array.isArray(
        body.installments,
      ) ||
      body.installments.length ===
        0
    ) {
      return NextResponse.json(
        {
          error:
            "Add at least one installment.",
        },
        {
          status:
            400,
        },
      );
    }

    const installments:
      Installment[] =
      [];

    for (
      const raw of
        body.installments
    ) {
      const item =
        raw as
          Record<
            string,
            unknown
          >;

      const amount =
        Number(
          item.amount,
        );

      const paidAmount =
        Number(
          item.paidAmount ??
            0,
        );

      const dueDate =
        text(
          item.dueDate,
        );

      const title =
        text(
          item.title,
        );

      if (
        !title ||
        !Number.isFinite(
          amount,
        ) ||
        amount <=
          0 ||
        !Number.isFinite(
          paidAmount,
        ) ||
        paidAmount <
          0 ||
        paidAmount >
          amount ||
        !dueDate
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid installment details.",
          },
          {
            status:
              400,
          },
        );
      }

      installments.push({
        id:
          randomUUID(),

        title,

        amount,

        paidAmount,

        dueDate,

        paidDate:
          paidAmount >
          0
            ? new Date()
                .toISOString()
                .slice(
                  0,
                  10,
                )
            : "",

        paymentMode:
          "",

        receiptNo:
          "",
      });
    }

    const database =
      await getDatabase();

    const student =
      await database
        .collection(
          "users",
        )
        .findOne({
          _id:
            new ObjectId(
              studentId,
            ),

          role:
            "student",
        });

    if (
      !student
    ) {
      return NextResponse.json(
        {
          error:
            "Student not found.",
        },
        {
          status:
            404,
        },
      );
    }

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

    const now =
      new Date();

    const document:
      PlanDocument = {
      studentId:
        student._id,

      studentName:
        text(
          student.name,
        ),

      studentEmail:
        text(
          student.email,
        ),

      courseName:
        text(
          body.courseName,
        ) ||
        text(
          student.program,
        ),

      academicYear:
        text(
          body.academicYear,
        ) ||
        "2026-27",

      notes:
        text(
          body.notes,
        ),

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

      createdAt:
        now,

      updatedAt:
        now,
    };

    await database
      .collection<PlanDocument>(
        "fee_installment_plans",
      )
      .insertOne(
        document,
      );

    return NextResponse.json(
      {
        message:
          "Installment plan created successfully.",
      },
      {
        status:
          201,
      },
    );
  } catch (
    error
  ) {
    console.error(
      "Installment POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create installment plan.",
      },
      {
        status:
          500,
      },
    );
  }
}