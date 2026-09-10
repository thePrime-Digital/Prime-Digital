"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  CircleCheck,
  Clock3,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

import type {
  FeeRecord,
  FeeStudentOption,
} from "@/types/fee";

type Props = {
  role: "admin" | "faculty" | "student";
};

type ApiResponse = {
  fees?: FeeRecord[];
  students?: FeeStudentOption[];
  error?: string;
};

function money(value: number): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function dateLabel(value: string): string {
  return new Date(
    value,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function todayInput(): string {
  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      "0",
    );

  return `${year}-${month}-${day}`;
}

function currentMonthLabel(): string {
  return new Date().toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function statusClasses(
  status: FeeRecord["status"],
): string {
  if (
    status === "paid"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    status === "partial"
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    status === "overdue"
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-base font-black text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-[#8f0024]/50 focus:ring-4 focus:ring-[#8f0024]/5";

const labelClass =
  "mb-1.5 block text-[11px] font-bold text-slate-600";

export default function FeesDashboard({
  role,
}: Props) {
  const [
    fees,
    setFees,
  ] = useState<
    FeeRecord[]
  >([]);

  const [
    students,
    setStudents,
  ] = useState<
    FeeStudentOption[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    showCreate,
    setShowCreate,
  ] = useState(false);

  const [
    paymentFee,
    setPaymentFee,
  ] = useState<
    FeeRecord | null
  >(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const endpoint =
    role === "admin"
      ? "/api/admin/fees"
      : role === "faculty"
        ? "/api/faculty/fees"
        : "/api/student/fees";

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              endpoint,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            (await response
              .json()
              .catch(
                () => null,
              )) as
              | ApiResponse
              | null;

          if (
            !response.ok
          ) {
            throw new Error(
              data?.error ||
                "Unable to load fees.",
            );
          }

          setFees(
            Array.isArray(
              data?.fees,
            )
              ? data?.fees ?? []
              : [],
          );

          if (
            role === "admin"
          ) {
            setStudents(
              Array.isArray(
                data?.students,
              )
                ? data?.students ?? []
                : [],
            );
          }
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load fees.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        endpoint,
        role,
      ],
    );

  useEffect(() => {
    load();
  }, [load]);

  const totals =
    useMemo(
      () => ({
        billed:
          fees.reduce(
            (
              total,
              item,
            ) =>
              total +
              item.amount,
            0,
          ),

        paid:
          fees.reduce(
            (
              total,
              item,
            ) =>
              total +
              item.paid,
            0,
          ),

        balance:
          fees.reduce(
            (
              total,
              item,
            ) =>
              total +
              item.balance,
            0,
          ),

        overdue:
          fees.filter(
            (item) =>
              item.status ===
              "overdue",
          ).length,
      }),
      [fees],
    );

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return fees;
      }

      return fees.filter(
        (item) =>
          [
            item.studentName,
            item.studentEmail,
            item.enrollmentNo,
            item.invoiceId,
            item.particulars,
            item.month,
          ].some(
            (value) =>
              value
                .toLowerCase()
                .includes(
                  query,
                ),
          ),
      );
    }, [
      fees,
      search,
    ]);

  /* =========================================================
     CREATE FEE INVOICE
  ========================================================= */

  async function createFee(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const form =
      event.currentTarget;

    const data =
      new FormData(
        form,
      );

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/admin/fees",
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                studentId:
                  data.get(
                    "studentId",
                  ),

                parentName:
                  data.get(
                    "parentName",
                  ),

                classBoard:
                  data.get(
                    "classBoard",
                  ),

                enrollmentNo:
                  data.get(
                    "enrollmentNo",
                  ),

                academicYear:
                  data.get(
                    "academicYear",
                  ),

                particulars:
                  data.get(
                    "particulars",
                  ),

                month:
                  data.get(
                    "month",
                  ),

                dueDate:
                  data.get(
                    "dueDate",
                  ),

                amount:
                  data.get(
                    "amount",
                  ),
              }),
          },
        );

      const result =
        (await response
          .json()
          .catch(
            () => null,
          )) as
          | {
              error?: string;
            }
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          result?.error ||
            "Unable to create fee invoice.",
        );
      }

      form.reset();

      setShowCreate(false);

      setSuccess(
        "Fee invoice created successfully.",
      );

      await load();
    } catch (
      createError
    ) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create fee invoice.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     RECORD PAYMENT
  ========================================================= */

  async function recordPayment(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !paymentFee ||
      saving
    ) {
      return;
    }

    const form =
      event.currentTarget;

    const data =
      new FormData(
        form,
      );

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/fees/${paymentFee.id}/payments`,
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                amount:
                  data.get(
                    "amount",
                  ),

                date:
                  data.get(
                    "date",
                  ),

                mode:
                  data.get(
                    "mode",
                  ),

                transactionRef:
                  data.get(
                    "transactionRef",
                  ),

                bank:
                  data.get(
                    "bank",
                  ),
              }),
          },
        );

      const result =
        (await response
          .json()
          .catch(
            () => null,
          )) as
          | {
              error?: string;
            }
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          result?.error ||
            "Unable to record payment.",
        );
      }

      form.reset();

      setPaymentFee(null);

      setSuccess(
        "Payment recorded and receipt updated.",
      );

      await load();
    } catch (
      paymentError
    ) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Unable to record payment.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE FEE RECORD
     ADMIN ONLY
  ========================================================= */

  async function deleteFee(
    fee: FeeRecord,
  ) {
    if (
      role !== "admin"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete the fee record for ${fee.studentName}?\n\nInvoice: ${fee.invoiceId}\n\nThis will permanently delete the invoice and its payment history.`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/fees/${fee.id}`,
          {
            method:
              "DELETE",

            credentials:
              "include",
          },
        );

      const result =
        (await response
          .json()
          .catch(
            () => null,
          )) as
          | {
              error?: string;
              message?: string;
            }
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          result?.error ||
            "Unable to delete fee record.",
        );
      }

      /*
       * Remove immediately from UI.
       */
      setFees(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              fee.id,
          ),
      );

      setSuccess(
        result?.message ||
          "Fee record deleted successfully.",
      );
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete fee record.",
      );
    }
  }

  /* =========================================================
     AUTO-FILL STUDENT INFORMATION
  ========================================================= */

  function applyStudent(
    studentId: string,
    form:
      HTMLFormElement | null,
  ) {
    if (!form) {
      return;
    }

    const student =
      students.find(
        (item) =>
          item.id ===
          studentId,
      );

    if (!student) {
      return;
    }

    const values: Record<
      string,
      string
    > = {
      parentName:
        student.parentName,

      classBoard:
        student.classBoard,

      enrollmentNo:
        student.enrollmentNo,
    };

    for (
      const [
        name,
        value,
      ] of Object.entries(
        values,
      )
    ) {
      const field =
        form.elements.namedItem(
          name,
        );

      if (
        field instanceof
        HTMLInputElement
      ) {
        field.value =
          value;
      }
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8f0024]">
              Prime Digital School
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
              {role ===
              "student"
                ? "My Fees"
                : "Fees Management"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {role ===
              "admin"
                ? "Create invoices, record payments and issue fee receipts."
                : role ===
                    "faculty"
                  ? "View fee status for students assigned to your classes."
                  : "View your invoices, payment history and fee receipts."}
            </p>
          </div>

          {role ===
            "admin" && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowCreate(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#690019] px-4 text-xs font-black text-white transition hover:bg-[#820020]"
            >
              <Plus className="h-4 w-4" />

              New Fee Invoice
            </button>
          )}
        </div>

        {/* ===================================================
            ALERTS
        =================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Billed"
            value={money(
              totals.billed,
            )}
            icon={ReceiptText}
          />

          <SummaryCard
            title="Total Paid"
            value={money(
              totals.paid,
            )}
            icon={CircleCheck}
          />

          <SummaryCard
            title="Balance Due"
            value={money(
              totals.balance,
            )}
            icon={WalletCards}
          />

          <SummaryCard
            title="Overdue"
            value={String(
              totals.overdue,
            )}
            icon={Clock3}
          />
        </div>

        {/* ===================================================
            FEE RECORDS
        =================================================== */}

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Fee Records
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {filtered.length}{" "}
                record
                {filtered.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            <div className="relative w-full sm:w-[290px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Search fees..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm font-semibold text-slate-400">
              Loading fee records...
            </div>
          ) : filtered.length ===
            0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f4] text-[#8f0024]">
                <ReceiptText className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-800">
                No fee records found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                {role ===
                "admin"
                  ? "Create the first student fee invoice to begin tracking payments."
                  : "There are currently no fee records available for this account."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left">

                <thead className="bg-[#fafafa]">
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">

                    {role !==
                      "student" && (
                      <th className="px-5 py-3">
                        Student
                      </th>
                    )}

                    <th className="px-5 py-3">
                      Invoice
                    </th>

                    <th className="px-5 py-3">
                      Particulars
                    </th>

                    <th className="px-5 py-3">
                      Due Date
                    </th>

                    <th className="px-5 py-3">
                      Amount
                    </th>

                    <th className="px-5 py-3">
                      Paid
                    </th>

                    <th className="px-5 py-3">
                      Balance
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    (fee) => (
                      <tr
                        key={fee.id}
                        className="border-b border-slate-100 text-xs last:border-0 hover:bg-slate-50/60"
                      >

                        {role !==
                          "student" && (
                          <td className="px-5 py-4">
                            <p className="font-black text-slate-800">
                              {
                                fee.studentName
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {fee.enrollmentNo ||
                                fee.studentEmail}
                            </p>
                          </td>
                        )}

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-700">
                            {
                              fee.invoiceId
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {
                              fee.month
                            }
                          </p>
                        </td>

                        <td className="max-w-[250px] px-5 py-4">
                          <p className="line-clamp-2 font-semibold text-slate-700">
                            {
                              fee.particulars
                            }
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-600">
                          {dateLabel(
                            fee.dueDate,
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-black text-slate-800">
                          {money(
                            fee.amount,
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold text-emerald-700">
                          {money(
                            fee.paid,
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold text-[#8f0024]">
                          {money(
                            fee.balance,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em]",
                              statusClasses(
                                fee.status,
                              ),
                            ].join(
                              " ",
                            )}
                          >
                            {
                              fee.status
                            }
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">

                            {role ===
                              "admin" &&
                              fee.balance >
                                0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setError("");
                                    setSuccess("");
                                    setPaymentFee(
                                      fee,
                                    );
                                  }}
                                  className="whitespace-nowrap rounded-lg bg-[#690019] px-3 py-2 text-[10px] font-black text-white transition hover:bg-[#820020]"
                                >
                                  Record Payment
                                </button>
                              )}

                            {fee.receiptNo &&
                              fee.paid >
                                0 && (
                                <Link
                                  href={`/fees/${fee.id}/receipt`}
                                  target="_blank"
                                  className="whitespace-nowrap rounded-lg border border-[#8f0024]/25 px-3 py-2 text-[10px] font-black text-[#8f0024] transition hover:bg-[#fff1f4]"
                                >
                                  View Receipt
                                </Link>
                              )}

                            {role ===
                              "admin" && (
                              <button
                                type="button"
                                onClick={() =>
                                  deleteFee(
                                    fee,
                                  )
                                }
                                title="Delete fee record"
                                aria-label={`Delete fee record for ${fee.studentName}`}
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CREATE FEE INVOICE MODAL
      ===================================================== */}

      {showCreate &&
        role ===
          "admin" && (
          <ModalShell
            title="Create Fee Invoice"
            onClose={() =>
              setShowCreate(
                false,
              )
            }
          >
            <form
              onSubmit={
                createFee
              }
              className="p-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* STUDENT */}

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Student *
                  </label>

                  <select
                    name="studentId"
                    required
                    defaultValue=""
                    className={inputClass}
                    onChange={(
                      event,
                    ) =>
                      applyStudent(
                        event
                          .target
                          .value,

                        event
                          .currentTarget
                          .form,
                      )
                    }
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select student
                    </option>

                    {students.map(
                      (
                        student,
                      ) => (
                        <option
                          key={
                            student.id
                          }
                          value={
                            student.id
                          }
                        >
                          {
                            student.name
                          }{" "}
                          —{" "}
                          {
                            student.email
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* PARENT */}

                <div>
                  <label className={labelClass}>
                    Parent Name
                  </label>

                  <input
                    name="parentName"
                    className={inputClass}
                    placeholder="Auto-filled; enter once only if missing"
                  />
                </div>

                {/* ENROLLMENT */}

                <div>
                  <label className={labelClass}>
                    Enrollment No.
                  </label>

                  <input
                    name="enrollmentNo"
                    readOnly
                    className={`${inputClass} bg-slate-50`}
                    placeholder="Generated automatically"
                  />
                </div>

                {/* CLASS */}

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Class / Board / Program
                  </label>

                  <input
                    name="classBoard"
                    readOnly
                    className={`${inputClass} bg-slate-50`}
                    placeholder="Class / Board / Program"
                  />
                </div>

                {/* ACADEMIC YEAR */}

                <div>
                  <label className={labelClass}>
                    Academic Year *
                  </label>

                  <input
                    name="academicYear"
                    required
                    defaultValue="2026-27"
                    className={inputClass}
                  />
                </div>

                {/* MONTH */}

                <div>
                  <label className={labelClass}>
                    Month *
                  </label>

                  <input
                    name="month"
                    required
                    defaultValue={
                      currentMonthLabel()
                    }
                    className={inputClass}
                    placeholder="September 2026"
                  />
                </div>

                {/* PARTICULARS */}

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Particulars *
                  </label>

                  <input
                    name="particulars"
                    required
                    defaultValue="Monthly Fee Invoice — Monthly Tuition Fee"
                    className={inputClass}
                  />
                </div>

                {/* DUE DATE */}

                <div>
                  <label className={labelClass}>
                    Due Date *
                  </label>

                  <input
                    name="dueDate"
                    type="date"
                    required
                    className={inputClass}
                  />
                </div>

                {/* AMOUNT */}

                <div>
                  <label className={labelClass}>
                    Amount (₹) *
                  </label>

                  <input
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    className={inputClass}
                    placeholder="22000"
                  />
                </div>

              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(
                      false,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="h-10 rounded-lg bg-[#690019] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Invoice"}
                </button>

              </div>
            </form>
          </ModalShell>
        )}

      {/* =====================================================
          RECORD PAYMENT MODAL
      ===================================================== */}

      {paymentFee &&
        role ===
          "admin" && (
          <ModalShell
            title="Record Fee Payment"
            onClose={() =>
              setPaymentFee(
                null,
              )
            }
          >
            <form
              onSubmit={
                recordPayment
              }
              className="p-5"
            >

              <div className="mb-5 rounded-xl bg-[#fff7f8] p-4">
                <p className="text-sm font-black text-slate-900">
                  {
                    paymentFee.studentName
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Remaining balance:{" "}

                  <span className="font-black text-[#8f0024]">
                    {money(
                      paymentFee.balance,
                    )}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* PAYMENT AMOUNT */}

                <div>
                  <label className={labelClass}>
                    Payment Amount (₹) *
                  </label>

                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    max={
                      paymentFee.balance
                    }
                    step="0.01"
                    required
                    defaultValue={
                      paymentFee.balance
                    }
                    className={inputClass}
                  />
                </div>

                {/* PAYMENT DATE */}

                <div>
                  <label className={labelClass}>
                    Payment Date *
                  </label>

                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={
                      todayInput()
                    }
                    className={inputClass}
                  />
                </div>

                {/* PAYMENT MODE */}

                <div>
                  <label className={labelClass}>
                    Payment Mode *
                  </label>

                  <select
                    name="mode"
                    required
                    defaultValue="UPI"
                    className={inputClass}
                  >
                    <option>
                      UPI
                    </option>

                    <option>
                      Bank Transfer
                    </option>

                    <option>
                      Cash
                    </option>

                    <option>
                      Card
                    </option>

                    <option>
                      Cheque
                    </option>

                    <option>
                      Other
                    </option>
                  </select>
                </div>

                {/* TRANSACTION REF */}

                <div>
                  <label className={labelClass}>
                    Transaction Reference
                  </label>

                  <input
                    name="transactionRef"
                    className={inputClass}
                    placeholder="Transaction / UTR / Ref."
                  />
                </div>

                {/* BANK */}

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Bank
                  </label>

                  <input
                    name="bank"
                    className={inputClass}
                    placeholder="Bank name"
                  />
                </div>

              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setPaymentFee(
                      null,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="h-10 rounded-lg bg-[#690019] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving
                    ? "Recording..."
                    : "Record Payment"}
                </button>

              </div>
            </form>
          </ModalShell>
        )}
    </main>
  );
}