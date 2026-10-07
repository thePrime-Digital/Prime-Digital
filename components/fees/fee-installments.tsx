"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Plus,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

type Role =
  | "admin"
  | "student";

type StudentOption = {
  id: string;
  name: string;
  email: string;
  program: string;
  currentClass: string;
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

type InstallmentPlan = {
  id: string;
  studentId: string;
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

  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  plans?: InstallmentPlan[];
  students?: StudentOption[];

  message?: string;
  error?: string;
};

type DraftInstallment = {
  id: string;
  title: string;
  amount: string;
  paidAmount: string;
  dueDate: string;
};

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024]/50 focus:ring-4 focus:ring-[#8f0024]/5";

const labelClass =
  "mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-[#8f0024]";

function todayInput() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1,
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

function money(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      maximumFractionDigits:
        0,
    },
  ).format(
    value,
  );
}

function dateLabel(
  value: string,
) {
  if (
    !value
  ) {
    return "-";
  }

  const date =
    new Date(
      `${value}T00:00:00`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  );
}

function statusClass(
  status:
    InstallmentPlan["status"],
) {
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
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function FeeInstallments({
  role,
}: {
  role: Role;
}) {
  const [
    plans,
    setPlans,
  ] =
    useState<
      InstallmentPlan[]
    >([]);

  const [
    students,
    setStudents,
  ] =
    useState<
      StudentOption[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    studentId,
    setStudentId,
  ] =
    useState("");

  const [
    courseName,
    setCourseName,
  ] =
    useState("");

  const [
    academicYear,
    setAcademicYear,
  ] =
    useState(
      "2026-27",
    );

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    rows,
    setRows,
  ] =
    useState<
      DraftInstallment[]
    >([
      {
        id:
          crypto.randomUUID(),

        title:
          "Installment 1",

        amount:
          "",

        paidAmount:
          "0",

        dueDate:
          todayInput(),
      },
    ]);

  const [
    paymentTarget,
    setPaymentTarget,
  ] =
    useState<{
      plan: InstallmentPlan;
      installment: Installment;
    } | null>(
      null,
    );

  /* =========================================
     LOAD
  ========================================= */

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          "",
        );

        try {
          const endpoint =
            role ===
            "admin"
              ? "/api/admin/fee-installments"
              : "/api/student/fee-installments";

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
                () =>
                  null,
              )) as
              | ApiResponse
              | null;

          if (
            !response.ok
          ) {
            throw new Error(
              data?.error ??
                "Unable to load installment plans.",
            );
          }

          setPlans(
            Array.isArray(
              data?.plans,
            )
              ? data.plans
              : [],
          );

          if (
            role ===
            "admin"
          ) {
            setStudents(
              Array.isArray(
                data?.students,
              )
                ? data.students
                : [],
            );
          }
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load installment plans.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        role,
      ],
    );

  useEffect(
    () => {
      load();
    },
    [
      load,
    ],
  );

  /* =========================================
     CREATE PLAN CALCULATIONS
  ========================================= */

  const draftTotals =
    useMemo(
      () => {
        const total =
          rows.reduce(
            (
              sum,
              item,
            ) =>
              sum +
              (
                Number(
                  item.amount,
                ) ||
                0
              ),
            0,
          );

        const paid =
          rows.reduce(
            (
              sum,
              item,
            ) =>
              sum +
              (
                Number(
                  item.paidAmount,
                ) ||
                0
              ),
            0,
          );

        return {
          total,

          paid,

          pending:
            Math.max(
              0,
              total -
                paid,
            ),
        };
      },
      [
        rows,
      ],
    );

  const allTotals =
    useMemo(
      () => ({
        total:
          plans.reduce(
            (
              sum,
              plan,
            ) =>
              sum +
              plan.totalAmount,
            0,
          ),

        paid:
          plans.reduce(
            (
              sum,
              plan,
            ) =>
              sum +
              plan.totalPaid,
            0,
          ),

        pending:
          plans.reduce(
            (
              sum,
              plan,
            ) =>
              sum +
              plan.pendingAmount,
            0,
          ),

        overdue:
          plans.filter(
            (
              plan,
            ) =>
              plan.status ===
              "overdue",
          ).length,
      }),
      [
        plans,
      ],
    );

  /* =========================================
     INSTALLMENT ROWS
  ========================================= */

  function updateRow(
    id: string,
    field:
      keyof Omit<
        DraftInstallment,
        "id"
      >,
    value: string,
  ) {
    setRows(
      (
        current,
      ) =>
        current.map(
          (
            item,
          ) =>
            item.id ===
            id
              ? {
                  ...item,

                  [field]:
                    value,
                }
              : item,
        ),
    );
  }

  function addInstallment() {
    setRows(
      (
        current,
      ) => [
        ...current,

        {
          id:
            crypto.randomUUID(),

          title:
            `Installment ${
              current.length +
              1
            }`,

          amount:
            "",

          paidAmount:
            "0",

          dueDate:
            todayInput(),
        },
      ],
    );
  }

  function removeInstallment(
    id: string,
  ) {
    setRows(
      (
        current,
      ) => {
        if (
          current.length ===
          1
        ) {
          return current;
        }

        return current.filter(
          (
            item,
          ) =>
            item.id !==
            id,
        );
      },
    );
  }

  /* =========================================
     CREATE PLAN
  ========================================= */

  async function createPlan(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      saving
    ) {
      return;
    }

    if (
      !studentId
    ) {
      setError(
        "Please select a student.",
      );

      return;
    }

    const invalid =
      rows.some(
        (
          item,
        ) => {
          const amount =
            Number(
              item.amount,
            );

          const paidAmount =
            Number(
              item.paidAmount,
            );

          return (
            !item.title.trim() ||
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
            !item.dueDate
          );
        },
      );

    if (
      invalid
    ) {
      setError(
        "Please check each installment amount, paid amount and due date.",
      );

      return;
    }

    setSaving(
      true,
    );

    setError(
      "",
    );

    setSuccess(
      "",
    );

    try {
      const response =
        await fetch(
          "/api/admin/fee-installments",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                studentId,

                courseName,

                academicYear,

                notes,

                installments:
                  rows.map(
                    (
                      item,
                    ) => ({
                      title:
                        item.title,

                      amount:
                        Number(
                          item.amount,
                        ),

                      paidAmount:
                        Number(
                          item.paidAmount,
                        ),

                      dueDate:
                        item.dueDate,
                    }),
                  ),
              }),
          },
        );

      const data =
        (await response
          .json()
          .catch(
            () =>
              null,
          )) as
          | ApiResponse
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to create installment plan.",
        );
      }

      setSuccess(
        data?.message ??
          "Installment plan created.",
      );

      setStudentId(
        "",
      );

      setCourseName(
        "",
      );

      setNotes(
        "",
      );

      setRows([
        {
          id:
            crypto.randomUUID(),

          title:
            "Installment 1",

          amount:
            "",

          paidAmount:
            "0",

          dueDate:
            todayInput(),
        },
      ]);

      await load();
    } catch (
      createError
    ) {
      setError(
        createError instanceof
          Error
          ? createError.message
          : "Unable to create installment plan.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  /* =========================================
     UPDATE PAYMENT
  ========================================= */

  async function updatePayment(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !paymentTarget ||
      saving
    ) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

    setSaving(
      true,
    );

    setError(
      "",
    );

    try {
      const response =
        await fetch(
          `/api/admin/fee-installments/${paymentTarget.plan.id}`,
          {
            method:
              "PATCH",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                installmentId:
                  paymentTarget
                    .installment
                    .id,

                paidAmount:
                  form.get(
                    "paidAmount",
                  ),

                paidDate:
                  form.get(
                    "paidDate",
                  ),

                paymentMode:
                  form.get(
                    "paymentMode",
                  ),

                receiptNo:
                  form.get(
                    "receiptNo",
                  ),
              }),
          },
        );

      const data =
        (await response
          .json()
          .catch(
            () =>
              null,
          )) as
          | ApiResponse
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to update payment.",
        );
      }

      setPaymentTarget(
        null,
      );

      setSuccess(
        data?.message ??
          "Payment updated.",
      );

      await load();
    } catch (
      paymentError
    ) {
      setError(
        paymentError instanceof
          Error
          ? paymentError.message
          : "Unable to update payment.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  /* =========================================
     DELETE PLAN
  ========================================= */

  async function deletePlan(
    plan:
      InstallmentPlan,
  ) {
    if (
      role !==
      "admin"
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete fee plan for ${plan.studentName}?`,
      )
    ) {
      return;
    }

    setError(
      "",
    );

    try {
      const response =
        await fetch(
          `/api/admin/fee-installments/${plan.id}`,
          {
            method:
              "DELETE",

            credentials:
              "include",
          },
        );

      const data =
        (await response
          .json()
          .catch(
            () =>
              null,
          )) as
          | ApiResponse
          | null;

      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to delete plan.",
        );
      }

      setSuccess(
        data?.message ??
          "Installment plan deleted.",
      );

      await load();
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof
          Error
          ? deleteError.message
          : "Unable to delete plan.",
      );
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
            Prime Digital School
          </p>

          <h1 className="mt-1 text-2xl font-black text-slate-900">
            {role ===
            "admin"
              ? "Fee Installment Plans"
              : "My Installments"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {role ===
            "admin"
              ? "Create and manage student fee installment schedules."
              : "Track your installment schedule, payments and pending balance."}
          </p>
        </div>

        {/* ========================================= */}
        {/* ALERTS */}
        {/* ========================================= */}

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

        {/* ========================================= */}
        {/* ADMIN CREATE PLAN */}
        {/* ========================================= */}

        {role ===
          "admin" && (
          <form
            onSubmit={
              createPlan
            }
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-black text-slate-900">
              Create Installment Plan
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Student
                </label>

                <select
                  value={
                    studentId
                  }
                  required
                  onChange={(
                    event,
                  ) => {
                    const id =
                      event
                        .target
                        .value;

                    setStudentId(
                      id,
                    );

                    const student =
                      students.find(
                        (
                          item,
                        ) =>
                          item.id ===
                          id,
                      );

                    setCourseName(
                      student?.program ??
                        "",
                    );
                  }}
                  className={inputClass}
                >
                  <option value="">
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
                        -{" "}
                        {
                          student.email
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Course
                </label>

                <input
                  value={
                    courseName
                  }
                  onChange={(
                    event,
                  ) =>
                    setCourseName(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Course name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Academic Year
                </label>

                <input
                  value={
                    academicYear
                  }
                  onChange={(
                    event,
                  ) =>
                    setAcademicYear(
                      event
                        .target
                        .value,
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* TOTALS */}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Plan Total"
                value={money(
                  draftTotals.total,
                )}
              />

              <SummaryCard
                label="Paid"
                value={money(
                  draftTotals.paid,
                )}
              />

              <SummaryCard
                label="Pending"
                value={money(
                  draftTotals.pending,
                )}
              />
            </div>

            {/* NOTES */}

            <div className="mt-5">
              <label className={labelClass}>
                Notes
              </label>

              <textarea
                value={
                  notes
                }
                onChange={(
                  event,
                ) =>
                  setNotes(
                    event
                      .target
                      .value,
                  )
                }
                rows={3}
                placeholder="Optional payment notes"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs outline-none focus:border-[#8f0024]/50 focus:ring-4 focus:ring-[#8f0024]/5"
              />
            </div>

            {/* INSTALLMENTS */}

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-[820px] w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-3 py-3">
                      No.
                    </th>

                    <th className="px-3 py-3">
                      Installment
                    </th>

                    <th className="px-3 py-3">
                      Amount
                    </th>

                    <th className="px-3 py-3">
                      Paid
                    </th>

                    <th className="px-3 py-3">
                      Due Date
                    </th>

                    <th className="px-3 py-3">
                      Remove
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map(
                    (
                      item,
                      index,
                    ) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-t border-slate-100"
                      >
                        <td className="px-3 py-3 text-xs font-black">
                          {index +
                            1}
                        </td>

                        <td className="px-3 py-3">
                          <input
                            value={
                              item.title
                            }
                            onChange={(
                              event,
                            ) =>
                              updateRow(
                                item.id,
                                "title",
                                event
                                  .target
                                  .value,
                              )
                            }
                            className={inputClass}
                          />
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="0"
                            value={
                              item.amount
                            }
                            onChange={(
                              event,
                            ) =>
                              updateRow(
                                item.id,
                                "amount",
                                event
                                  .target
                                  .value,
                              )
                            }
                            className={inputClass}
                          />
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="0"
                            value={
                              item.paidAmount
                            }
                            onChange={(
                              event,
                            ) =>
                              updateRow(
                                item.id,
                                "paidAmount",
                                event
                                  .target
                                  .value,
                              )
                            }
                            className={inputClass}
                          />
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="date"
                            value={
                              item.dueDate
                            }
                            onChange={(
                              event,
                            ) =>
                              updateRow(
                                item.id,
                                "dueDate",
                                event
                                  .target
                                  .value,
                              )
                            }
                            className={inputClass}
                          />
                        </td>

                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              removeInstallment(
                                item.id,
                              )
                            }
                            disabled={
                              rows.length ===
                              1
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-black text-red-600 disabled:opacity-40"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  addInstallment
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#8f0024]/20 bg-[#fff7f8] px-4 text-xs font-black text-[#8f0024]"
              >
                <Plus className="h-4 w-4" />

                Add Installment
              </button>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create Fee Plan"}
              </button>
            </div>
          </form>
        )}

        {/* ========================================= */}
        {/* SUMMARY */}
        {/* ========================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Fee"
            value={money(
              allTotals.total,
            )}
          />

          <SummaryCard
            label="Total Paid"
            value={money(
              allTotals.paid,
            )}
          />

          <SummaryCard
            label="Pending"
            value={money(
              allTotals.pending,
            )}
          />

          <SummaryCard
            label="Overdue Plans"
            value={String(
              allTotals.overdue,
            )}
          />
        </div>

        {/* ========================================= */}
        {/* PLANS */}
        {/* ========================================= */}

        <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
              Loading installment plans...
            </div>
          ) : plans.length ===
            0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <WalletCards className="mx-auto h-8 w-8 text-[#8f0024]" />

              <h3 className="mt-3 text-sm font-black text-slate-900">
                No installment plans
              </h3>
            </div>
          ) : (
            plans.map(
              (
                plan,
              ) => (
                <section
                  key={
                    plan.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900">
                          {
                            plan.studentName
                          }
                        </h2>

                        <span
                          className={[
                            "rounded-full border px-2 py-1 text-[9px] font-black uppercase",
                            statusClass(
                              plan.status,
                            ),
                          ].join(
                            " ",
                          )}
                        >
                          {
                            plan.status
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          plan.courseName ||
                          "Course"
                        }{" "}
                        -{" "}
                        {
                          plan.academicYear
                        }
                      </p>
                    </div>

                    {role ===
                      "admin" && (
                      <button
                        type="button"
                        onClick={() =>
                          deletePlan(
                            plan,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-[10px] font-black text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />

                        Delete
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-slate-50 px-5 py-4">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        Total
                      </p>

                      <p className="font-black">
                        {money(
                          plan.totalAmount,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        Paid
                      </p>

                      <p className="font-black text-emerald-700">
                        {money(
                          plan.totalPaid,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        Pending
                      </p>

                      <p className="font-black text-[#8f0024]">
                        {money(
                          plan.pendingAmount,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-[9px] font-black uppercase text-slate-400">
                          <th className="px-5 py-3">
                            Installment
                          </th>

                          <th className="px-5 py-3">
                            Amount
                          </th>

                          <th className="px-5 py-3">
                            Paid
                          </th>

                          <th className="px-5 py-3">
                            Due Date
                          </th>

                          <th className="px-5 py-3">
                            Paid Date
                          </th>

                          <th className="px-5 py-3">
                            Payment Mode
                          </th>

                          <th className="px-5 py-3">
                            Receipt
                          </th>

                          {role ===
                            "admin" && (
                            <th className="px-5 py-3">
                              Action
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {plan.installments.map(
                          (
                            installment,
                          ) => (
                            <tr
                              key={
                                installment.id
                              }
                              className="border-b border-slate-100 text-xs"
                            >
                              <td className="px-5 py-4 font-black">
                                {
                                  installment.title
                                }
                              </td>

                              <td className="px-5 py-4">
                                {money(
                                  installment.amount,
                                )}
                              </td>

                              <td className="px-5 py-4 text-emerald-700">
                                {money(
                                  installment.paidAmount,
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {dateLabel(
                                  installment.dueDate,
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {dateLabel(
                                  installment.paidDate,
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {
                                  installment.paymentMode ||
                                  "-"
                                }
                              </td>

                              <td className="px-5 py-4">
                                {
                                  installment.receiptNo ||
                                  "-"
                                }
                              </td>

                              {role ===
                                "admin" && (
                                <td className="px-5 py-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPaymentTarget(
                                        {
                                          plan,
                                          installment,
                                        },
                                      )
                                    }
                                    className="rounded-lg bg-[#8f0024] px-3 py-2 text-[10px] font-black text-white"
                                  >
                                    Update Payment
                                  </button>
                                </td>
                              )}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              ),
            )
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* PAYMENT MODAL */}
      {/* ========================================= */}

      {paymentTarget && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Update Payment
                </h2>

                <p className="text-xs text-slate-400">
                  {
                    paymentTarget
                      .installment
                      .title
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPaymentTarget(
                    null,
                  )
                }
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                updatePayment
              }
              className="p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Paid Amount
                  </label>

                  <input
                    name="paidAmount"
                    type="number"
                    min="0"
                    max={
                      paymentTarget
                        .installment
                        .amount
                    }
                    defaultValue={
                      paymentTarget
                        .installment
                        .paidAmount
                    }
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Paid Date
                  </label>

                  <input
                    name="paidDate"
                    type="date"
                    defaultValue={
                      paymentTarget
                        .installment
                        .paidDate
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Payment Mode
                  </label>

                  <select
                    name="paymentMode"
                    defaultValue={
                      paymentTarget
                        .installment
                        .paymentMode ||
                      "UPI"
                    }
                    className={inputClass}
                  >
                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>

                    <option value="Card">
                      Card
                    </option>

                    <option value="Cheque">
                      Cheque
                    </option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Receipt Number
                  </label>

                  <input
                    name="receiptNo"
                    defaultValue={
                      paymentTarget
                        .installment
                        .receiptNo
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentTarget(
                      null,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-black"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}