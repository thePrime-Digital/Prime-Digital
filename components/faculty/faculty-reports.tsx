"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BarChart3,
  BookOpen,
  Clock3,
  FileCheck2,
  GraduationCap,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

type ReportData = {
  summary: {
    classes: number;
    students: number;
    teachingHours: number;
    assignments: number;
    pendingReviews: number;

    attendanceRate:
      | number
      | null;

    averageGrade:
      | number
      | null;
  };

  classPerformance: {
    id: string;
    name: string;
    program: string;
    students: number;
    assignments: number;

    attendanceRate:
      | number
      | null;

    averageGrade:
      | number
      | null;
  }[];

  attendanceTrend: {
    date: string;
    rate: number;
  }[];
};

export default function FacultyReports() {
  const [
    data,
    setData,
  ] =
    useState<
      ReportData | null
    >(null);

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
              "/api/faculty/reports",
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
                "Unable to load reports.",
            );
          }

          setData(
            payload,
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load reports.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Analytics
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#281b1f]">
              Reports & Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track teaching activity,
              attendance and student
              performance.
            </p>
          </div>

          <button
            type="button"
            onClick={
              load
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[9px] font-black text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : data ? (
          <>
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                icon={BookOpen}
                label="My Classes"
                value={
                  data.summary.classes
                }
                note="Assigned classes"
              />

              <Metric
                icon={Users}
                label="Students"
                value={
                  data.summary.students
                }
                note="Unique students"
              />

              <Metric
                icon={Clock3}
                label="Teaching Hours"
                value={
                  data.summary.teachingHours
                }
                note="Scheduled teaching time"
              />

              <Metric
                icon={FileCheck2}
                label="Assignments"
                value={
                  data.summary.assignments
                }
                note={`${data.summary.pendingReviews} pending reviews`}
              />
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-[#281b1f]">
                      Attendance Trend
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-400">
                      Last 14 days
                    </p>
                  </div>

                  <BarChart3 className="h-5 w-5 text-[#8f0024]" />
                </div>

                <div className="mt-8 flex h-52 items-end gap-2">
                  {data.attendanceTrend.map(
                    (
                      point,
                    ) => (
                      <div
                        key={
                          point.date
                        }
                        className="flex h-full min-w-0 flex-1 flex-col justify-end"
                        title={`${point.date}: ${point.rate}%`}
                      >
                        <div
                          className="w-full rounded-t-md bg-[#8f0024]"
                          style={{
                            height:
                              `${Math.max(
                                4,
                                point.rate,
                              )}%`,
                          }}
                        />

                        <p className="mt-2 truncate text-center text-[6px] text-slate-400">
                          {point.date.slice(
                            5,
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Highlight
                  icon={
                    GraduationCap
                  }
                  label="Average Grade"
                  value={
                    data.summary.averageGrade ===
                    null
                      ? "—"
                      : `${data.summary.averageGrade}%`
                  }
                />

                <Highlight
                  icon={
                    TrendingUp
                  }
                  label="Attendance Rate"
                  value={
                    data.summary.attendanceRate ===
                    null
                      ? "—"
                      : `${data.summary.attendanceRate}%`
                  }
                />
              </div>
            </section>

            <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-black text-[#281b1f]">
                  Course Completion & Engagement
                </h2>

                <p className="mt-1 text-[9px] text-slate-400">
                  Performance by assigned
                  class.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[8px] font-black uppercase text-slate-400">
                        Class
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase text-slate-400">
                        Students
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase text-slate-400">
                        Assignments
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase text-slate-400">
                        Attendance
                      </th>

                      <th className="px-5 py-3 text-right text-[8px] font-black uppercase text-slate-400">
                        Avg Grade
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.classPerformance.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-14 text-center text-[10px] text-slate-400"
                        >
                          No class analytics
                          available yet.
                        </td>
                      </tr>
                    ) : (
                      data.classPerformance.map(
                        (
                          item,
                        ) => (
                          <tr
                            key={
                              item.id
                            }
                            className="border-t border-slate-100"
                          >
                            <td className="px-5 py-4">
                              <p className="text-[10px] font-black text-slate-700">
                                {
                                  item.name
                                }
                              </p>

                              <p className="mt-1 text-[8px] text-slate-400">
                                {
                                  item.program
                                }
                              </p>
                            </td>

                            <td className="px-4 py-4 text-[10px] font-bold text-slate-600">
                              {
                                item.students
                              }
                            </td>

                            <td className="px-4 py-4 text-[10px] font-bold text-slate-600">
                              {
                                item.assignments
                              }
                            </td>

                            <td className="px-4 py-4 text-[10px] font-bold text-slate-600">
                              {item.attendanceRate ===
                              null
                                ? "—"
                                : `${item.attendanceRate}%`}
                            </td>

                            <td className="px-5 py-4 text-right text-[10px] font-black text-[#8f0024]">
                              {item.averageGrade ===
                              null
                                ? "—"
                                : `${item.averageGrade}%`}
                            </td>
                          </tr>
                        ),
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon:
    typeof Users;

  label: string;

  value:
    | number
    | string;

  note: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-[#281b1f]">
            {value}
          </p>

          <p className="mt-2 text-[8px] text-slate-400">
            {note}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function Highlight({
  icon: Icon,
  label,
  value,
}: {
  icon:
    typeof TrendingUp;

  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl bg-[#72001c] p-6 text-white shadow-sm">
      <Icon className="h-5 w-5" />

      <p className="mt-5 text-[8px] font-black uppercase tracking-wider text-white/60">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black">
        {value}
      </p>
    </article>
  );
}
