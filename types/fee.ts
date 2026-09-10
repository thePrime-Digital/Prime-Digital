export type FeeStatus =
  | "pending"
  | "partial"
  | "paid"
  | "overdue";

export type FeePayment = {
  id: string;
  date: string;
  amount: number;
  mode: string;
  transactionRef: string;
  bank: string;
};

export type FeeRecord = {
  id: string;

  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;

  parentName: string;
  classBoard: string;
  enrollmentNo: string;
  academicYear: string;

  invoiceId: string;
  receiptNo: string;
  receiptIssuedAt: string | null;

  particulars: string;
  month: string;

  dueDate: string;

  amount: number;
  paid: number;
  balance: number;

  status: FeeStatus;

  payments: FeePayment[];

  createdAt: string;
  updatedAt: string;
};

export type FeeStudentOption = {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentName: string;
  enrollmentNo: string;
  classBoard: string;
};