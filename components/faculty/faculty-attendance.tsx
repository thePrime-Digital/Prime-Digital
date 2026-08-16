"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  MinusCircle,
  RefreshCw,
  Save,
  Users,
  X,
  XCircle,
} from "lucide-react";

type AttendanceStatus =
  | ""
  | "present"
  | "absent"
  | "late"
  | "excused";

type FacultyClass = {
  id: string;
  name: string;
  program: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AttendanceStatus;
  note: string;
};

type OverviewPoint = {
  date: string;
  rate: number;
};

type AttendanceData = {
  classes: FacultyClass[];

  selectedClass:
    | FacultyClass
    | null;

  date: string;

  students: Student[];

  stats: {
    totalStudents: number;
    marked: number;
    present: number;
    absent: number;
    late: number;
    excused: number;

    attendanceRate:
      | number
      | null;
  };

  overview:
    OverviewPoint[];
};

function todayKey() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function statusLabel(
  value: AttendanceStatus,
) {
  if (
    value === "present"
  ) {
    return "Present";
  }

  if (
    value === "absent"
  ) {
    return "Absent";
  }

  if (
    value === "late"
  ) {
    return "Late";
  }

  if (
    value === "excused"
  ) {
    return "Excused";
  }

  return "Not Marked";
}

export default function FacultyAttendance() {
  const [
    data,
    setData,
  ] =
    useState<
      AttendanceData | null
    >(null);

  const [
    classId,
    setClassId,
  ] =
    useState("");

  const [
    date,
    setDate,
  ] =
    useState(
      todayKey(),
    );

  const [
    students,
    setStudents,
  ] =
    useState<
      Student[]
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

  const load =
    useCallback(
      async (
        nextClassId =
          classId,

        nextDate =
          date,
      ) => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          if (
            nextClassId
          ) {
            params.set(
              "classId",
              nextClassId,
            );
          }

          params.set(
            "date",
            nextDate,
          );

          const response =
            await fetch(
              `/api/faculty/attendance?${params.toString()}`,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const payload =
            await response.json();

          if (!response.ok) {
            throw new Error(
              payload.error ||
                "Unable to load attendance.",
            );
          }

          setData(
            payload,
          );

          setStudents(
            payload.students ||
              [],
          );

          if (
            !nextClassId &&
            payload.selectedClass
              ?.id
          ) {
            setClassId(
              payload.selectedClass
                .id,
            );
          }
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load attendance.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        classId,
        date,
      ],
    );

  useEffect(() => {
    load();
  }, []);

  function changeClass(
    value: string,
  ) {
    setClassId(value);
    setSuccess("");
    load(
      value,
      date,
    );
  }

  function changeDate(
    value: string,
  ) {
    setDate(value);
    setSuccess("");
    load(
      classId,
      value,
    );
  }

  function markStudent(
    studentId: string,
    status: AttendanceStatus,
  ) {
    setStudents(
      (
        current,
      ) =>
        current.map(
          (student) =>
            student.id ===
            studentId
              ? {
                  ...student,
                  status,
                }
              : student,
        ),
    );
  }

  function markAllPresent() {
    setStudents(
      (
        current,
      ) =>
        current.map(
          (student) => ({
            ...student,

            status:
              "present",
          }),
        ),
    );
  }

  async function saveAttendance() {
    if (!classId) {
      setError(
        "Please select a class.",
      );

      return;
    }

    const marked =
      students.filter(
        (student) =>
          student.status,
      );

    if (
      marked.length ===
      0
    ) {
      setError(
        "Mark at least one student before saving.",
      );

      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/faculty/attendance",
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
                classId,
                date,

                records:
                  marked.map(
                    (
                      student,
                    ) => ({
                      studentId:
                        student.id,

                      status:
                        student.status,

                      note:
                        student.note,
                    }),
                  ),
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to save attendance.",
        );
      }

      setSuccess(
        payload.message ||
          "Attendance saved.",
      );

      await load(
        classId,
        date,
      );
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to save attendance.",
      );
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    if (
      students.length ===
      0
    ) {
      return;
    }

    const rows = [
      [
        "Student",
        "Email",
        "Status",
        "Date",
      ],

      ...students.map(
        (student) => [
          student.name,
          student.email,
          statusLabel(
            student.status,
          ),
          date,
        ],
      ),
    ];

    const csv =
      rows
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value,
                  ).replace(
                    /"/g,
                    '""',
                  )}"`,
              )
              .join(","),
        )
        .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const anchor =
      document.createElement(
        "a",
      );

    anchor.href = url;

    anchor.download =
      `attendance-${date}.csv`;

    anchor.click();

    URL.revokeObjectURL(
      url,
    );
  }

  const liveStats =
    useMemo(
      () => {
        const counts = {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          marked: 0,
        };

        for (
          const student
          of students
        ) {
          if (
            !student.status
          ) {
            continue;
          }

          counts.marked +=
            1;

          if (
            student.status ===
            "present"
          ) {
            counts.present +=
              1;
          }

          if (
            student.status ===
            "absent"
          ) {
            counts.absent +=
              1;
          }

          if (
            student.status ===
            "late"
          ) {
            counts.late +=
              1;
          }

          if (
            student.status ===
            "excused"
          ) {
            counts.excused +=
              1;
          }
        }

        const rate =
          counts.marked >
          0
            ? Math.round(
                (
                  (
                    counts.present +
                    counts.late
                  ) /
                  counts.marked
                ) *
                  100,
              )
            : null;

        return {
          ...counts,
          rate,
        };
      },
      [students],
    );

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              Record Attendance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Mark and manage student
              attendance for your
              classes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                exportCsv
              }
              disabled={
                students.length ===
                0
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[10px] font-black text-slate-600 disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export
            </button>

            <button
              type="button"
              onClick={
                markAllPresent
              }
              disabled={
                students.length ===
                0
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#fff1f4] px-4 text-[10px] font-black text-[#8f0024] disabled:opacity-40"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark All Present
            </button>
          </div>
        </div>

        {error && (
          <Alert error>
            {error}
          </Alert>
        )}

        {success && (
          <Alert>
            {success}
          </Alert>
        )}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>
                Class
              </Label>

              <select
                value={
                  classId
                }
                onChange={(
                  event,
                ) =>
                  changeClass(
                    event.target
                      .value,
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none"
              >
                {!data?.classes
                  ?.length && (
                  <option value="">
                    No classes assigned
                  </option>
                )}

                {data?.classes.map(
                  (
                    item,
                  ) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {item.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <Label>
                Attendance Date
              </Label>

              <input
                type="date"
                value={
                  date
                }
                onChange={(
                  event,
                ) =>
                  changeDate(
                    event.target
                      .value,
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric
            label="Students"
            value={
              students.length
            }
          />

          <Metric
            label="Present"
            value={
              liveStats.present
            }
          />

          <Metric
            label="Absent"
            value={
              liveStats.absent
            }
          />

          <Metric
            label="Late"
            value={
              liveStats.late
            }
          />

          <Metric
            label="Attendance"
            value={
              liveStats.rate ===
              null
                ? "—"
                : `${liveStats.rate}%`
            }
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-black text-[#281b1f]">
                  Student Attendance
                </h2>

                <p className="mt-1 text-[9px] text-slate-400">
                  {data?.selectedClass
                    ?.name ||
                    "Select a class"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  load(
                    classId,
                    date,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : students.length ===
              0 ? (
              <EmptyStudents />
            ) : (
              <div className="divide-y divide-slate-100">
                {students.map(
                  (
                    student,
                  ) => (
                    <div
                      key={
                        student.id
                      }
                      className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[9px] font-black text-[#8f0024]">
                          {student.name
                            .slice(
                              0,
                              2,
                            )
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-black text-slate-700">
                            {
                              student.name
                            }
                          </p>

                          <p className="mt-1 truncate text-[8px] text-slate-400">
                            {
                              student.email
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusButton
                          active={
                            student.status ===
                            "present"
                          }
                          icon={
                            Check
                          }
                          label="Present"
                          onClick={() =>
                            markStudent(
                              student.id,
                              "present",
                            )
                          }
                          activeClass="bg-emerald-600 text-white border-emerald-600"
                        />

                        <StatusButton
                          active={
                            student.status ===
                            "absent"
                          }
                          icon={
                            X
                          }
                          label="Absent"
                          onClick={() =>
                            markStudent(
                              student.id,
                              "absent",
                            )
                          }
                          activeClass="bg-red-600 text-white border-red-600"
                        />

                        <StatusButton
                          active={
                            student.status ===
                            "late"
                          }
                          icon={
                            Clock3
                          }
                          label="Late"
                          onClick={() =>
                            markStudent(
                              student.id,
                              "late",
                            )
                          }
                          activeClass="bg-amber-500 text-white border-amber-500"
                        />

                        <StatusButton
                          active={
                            student.status ===
                            "excused"
                          }
                          icon={
                            MinusCircle
                          }
                          label="Excused"
                          onClick={() =>
                            markStudent(
                              student.id,
                              "excused",
                            )
                          }
                          activeClass="bg-slate-700 text-white border-slate-700"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {students.length >
              0 && (
              <div className="flex justify-end border-t border-slate-100 p-4">
                <button
                  type="button"
                  onClick={
                    saveAttendance
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-[10px] font-black text-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  Save Attendance
                </button>
              </div>
            )}
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black text-[#281b1f]">
                Attendance Overview
              </h2>

              <p className="mt-1 text-[9px] text-slate-400">
                Last 14 days
              </p>

              <div className="mt-6 flex h-40 items-end gap-1.5">
                {(data?.overview ||
                  []).map(
                  (
                    point,
                  ) => (
                    <div
                      key={
                        point.date
                      }
                      className="flex h-full min-w-0 flex-1 items-end"
                      title={`${point.date}: ${point.rate}%`}
                    >
                      <div
                        className="w-full rounded-t bg-[#8f0024]"
                        style={{
                          height:
                            `${Math.max(
                              4,
                              point.rate,
                            )}%`,
                        }}
                      />
                    </div>
                  ),
                )}
              </div>
            </article>

            <article className="rounded-2xl bg-[#72001c] p-5 text-white shadow-sm">
              <Users className="h-5 w-5" />

              <p className="mt-4 text-[9px] font-black uppercase tracking-wider text-white/60">
                Class Statistics
              </p>

              <p className="mt-2 text-3xl font-black">
                {liveStats.rate ===
                null
                  ? "—"
                  : `${liveStats.rate}%`}
              </p>

              <p className="mt-1 text-[9px] text-white/65">
                Current attendance rate
              </p>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Label({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;

  value:
    | number
    | string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#281b1f]">
        {value}
      </p>
    </article>
  );
}

function StatusButton({
  active,
  icon: Icon,
  label,
  onClick,
  activeClass,
}: {
  active: boolean;
  icon:
    typeof Check;
  label: string;
  onClick: () => void;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[8px] font-black transition",

        active
          ? activeClass
          : "border-slate-200 bg-white text-slate-500",
      ].join(" ")}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function EmptyStudents() {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
          <Users className="h-6 w-6" />
        </div>

        <p className="mt-4 text-[11px] font-black text-slate-700">
          No enrolled students
        </p>

        <p className="mt-2 max-w-sm text-[9px] leading-5 text-slate-400">
          Students must first be enrolled
          into this class before attendance
          can be recorded.
        </p>
      </div>
    </div>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;

  children:
    React.ReactNode;
}) {
  return (
    <div
      className={[
        "mt-5 rounded-lg border px-4 py-3 text-xs font-semibold",

        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
