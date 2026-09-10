"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";

type AttendanceData = {
  summary: {
    total: number;
    attended: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number | null;
  };

  classes: {
    id: string;
    name: string;
    total: number;
    attended: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number | null;
  }[];

  recent: {
    id: string;
    classId: string;
    className: string;
    date: string;
    status: string;
    note: string;
  }[];

  trend: {
    date: string;
    rate: number;
  }[];
};

function statusClasses(
  status: string,
) {
  if (
    status === "present"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    status === "late"
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    status === "absent"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function StudentAttendance() {
  const [
    data,
    setData,
  ] =
    useState<AttendanceData | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/student/attendance",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to load attendance.",
            );
          }

          setData(
            result,
          );
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
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <LoaderScreen text="Loading attendance..." />
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <ErrorScreen
        error={error}
        reload={load}
      />
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Header
          title="Attendance"
          description="Track your attendance across all enrolled classes."
        />

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Overall Attendance"
            value={
              data.summary.rate ===
              null
                ? "—"
                : `${data.summary.rate}%`
            }
            icon={
              TrendingUp
            }
          />

          <Metric
            label="Present"
            value={
              data.summary.present
            }
            icon={
              CheckCircle2
            }
          />

          <Metric
            label="Late"
            value={
              data.summary.late
            }
            icon={
              Clock3
            }
          />

          <Metric
            label="Absent"
            value={
              data.summary.absent
            }
            icon={
              XCircle
            }
          />
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-sm font-black text-slate-900">
              Attendance by Class
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              Present and late records count as attended.
            </p>
          </div>

          {data.classes.length ===
          0 ? (
            <Empty text="No attendance records are available yet." />
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {data.classes.map(
                (item) => (
                  <article
                    key={
                      item.id
                    }
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black text-slate-800">
                        {
                          item.name
                        }
                      </p>

                      <span className="text-sm font-black text-[#8f0024]">
                        {item.rate ===
                        null
                          ? "—"
                          : `${item.rate}%`}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#8f0024]"
                        style={{
                          width:
                            `${item.rate || 0}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-[9px] font-semibold text-slate-500">
                      <span>
                        Present{" "}
                        {
                          item.present
                        }
                      </span>

                      <span>
                        Late{" "}
                        {
                          item.late
                        }
                      </span>

                      <span>
                        Absent{" "}
                        {
                          item.absent
                        }
                      </span>

                      <span>
                        Excused{" "}
                        {
                          item.excused
                        }
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-sm font-black text-slate-900">
              Recent Attendance
            </h2>
          </div>

          {data.recent.length ===
          0 ? (
            <Empty text="Your attendance history will appear here." />
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent.map(
                (record) => (
                  <div
                    key={
                      record.id
                    }
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-800">
                        {
                          record.className
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {
                          record.date
                        }
                      </p>

                      {record.note && (
                        <p className="mt-2 text-[10px] text-slate-500">
                          {
                            record.note
                          }
                        </p>
                      )}
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-[9px] font-black capitalize ${statusClasses(
                        record.status,
                      )}`}
                    >
                      {
                        record.status
                      }
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
        Student Portal
      </p>

      <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
        {title}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </header>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof CalendarCheck;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-[#271a1e]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function Empty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-10 text-center text-xs font-semibold text-slate-400">
      {text}
    </div>
  );
}

function LoaderScreen({
  text,
}: {
  text: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

        <p className="mt-3 text-xs font-bold text-slate-500">
          {text}
        </p>
      </div>
    </main>
  );
}

function ErrorScreen({
  error,
  reload,
}: {
  error: string;
  reload: () => void;
}) {
  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-black text-red-800">
          Unable to load attendance.
        </p>

        <p className="mt-2 text-xs text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={reload}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-xs font-black text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}