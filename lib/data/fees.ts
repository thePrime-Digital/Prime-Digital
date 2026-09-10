import {
  ObjectId,
  type Collection,
} from "mongodb";

import {
  getDatabase,
} from "@/lib/mongodb";

import type {
  FeeRecord,
  FeeStatus,
} from "@/types/fee";

export type FeePaymentDocument = {
  id: string;
  date: Date;
  amount: number;
  mode: string;
  transactionRef: string;
  bank: string;
};

export type FeeDocument = {
  _id?: ObjectId;

  studentId: ObjectId;

  studentName: string;
  studentEmail: string;
  studentPhone: string;

  parentName: string;
  classBoard: string;
  enrollmentNo: string;
  academicYear: string;

  invoiceId: string;
  receiptNo: string;
  receiptIssuedAt?: Date | null;

  particulars: string;
  month: string;

  dueDate: Date;

  amount: number;
  paid: number;
  balance: number;

  status: FeeStatus;

  payments: FeePaymentDocument[];

  createdBy: ObjectId;

  createdAt: Date;
  updatedAt: Date;
};

type FeeCounterDocument = {
  _id: string;
  sequence: number;
};

export async function getFeesCollection():
  Promise<Collection<FeeDocument>> {
  const database =
    await getDatabase();

  return database.collection<FeeDocument>(
    "fee_invoices",
  );
}

export function cleanFeeText(
  value: unknown,
  maxLength = 200,
): string {
  return typeof value === "string"
    ? value
        .replace(
          /[\u0000-\u001F\u007F]/g,
          "",
        )
        .replace(
          /[<>]/g,
          "",
        )
        .trim()
        .slice(
          0,
          maxLength,
        )
    : "";
}

export function positiveFeeAmount(
  value: unknown,
): number | null {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return Math.round(
    amount * 100,
  ) / 100;
}

export function calculateFeeStatus(
  amount: number,
  paid: number,
  dueDate: Date,
): FeeStatus {
  if (paid >= amount) {
    return "paid";
  }

  if (paid > 0) {
    return "partial";
  }

  const now =
    new Date();

  const due =
    new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      23,
      59,
      59,
      999,
    );

  return due < now
    ? "overdue"
    : "pending";
}

export function serializeFee(
  fee: FeeDocument & {
    _id: ObjectId;
  },
): FeeRecord {
  const status =
    calculateFeeStatus(
      fee.amount,
      fee.paid,
      fee.dueDate,
    );

  return {
    id:
      fee._id.toHexString(),

    studentId:
      fee.studentId.toHexString(),

    studentName:
      fee.studentName,

    studentEmail:
      fee.studentEmail,

    studentPhone:
      fee.studentPhone,

    parentName:
      fee.parentName,

    classBoard:
      fee.classBoard,

    enrollmentNo:
      fee.enrollmentNo,

    academicYear:
      fee.academicYear,

    invoiceId:
      fee.invoiceId,

    receiptNo:
      fee.receiptNo.replace(
        /^ST-REC-/,
        "PDS-REC-",
      ),

    receiptIssuedAt:
      fee.receiptIssuedAt instanceof Date
        ? fee.receiptIssuedAt.toISOString()
        : null,

    particulars:
      fee.particulars,

    month:
      fee.month,

    dueDate:
      fee.dueDate.toISOString(),

    amount:
      fee.amount,

    paid:
      fee.paid,

    balance:
      Math.max(
        0,
        Math.round(
          (
            fee.amount -
            fee.paid
          ) *
            100,
        ) / 100,
      ),

    status,

    payments:
      Array.isArray(
        fee.payments,
      )
        ? fee.payments.map(
            (payment) => ({
              id:
                payment.id,

              date:
                payment.date.toISOString(),

              amount:
                payment.amount,

              mode:
                payment.mode,

              transactionRef:
                payment.transactionRef,

              bank:
                payment.bank,
            }),
          )
        : [],

    createdAt:
      fee.createdAt.toISOString(),

    updatedAt:
      fee.updatedAt.toISOString(),
  };
}

export function createFeeInvoiceId():
  string {
  return `invoice-${Date.now()}`;
}

export async function createFeeReceiptNumber():
  Promise<string> {
  const database =
    await getDatabase();

  const year =
    new Date().getFullYear();

  const collection =
    database.collection<FeeCounterDocument>(
      "fee_counters",
    );

  const counter =
    await collection.findOneAndUpdate(
      {
        _id:
          `receipt-${year}`,
      },
      {
        $inc: {
          sequence: 1,
        },
      },
      {
        upsert: true,
        returnDocument:
          "after",
      },
    );

  const sequence =
    typeof counter?.sequence ===
      "number"
      ? counter.sequence
      : 1;

  return `PDS-REC-${year}-${String(
    sequence,
  ).padStart(3, "0")}`;
}