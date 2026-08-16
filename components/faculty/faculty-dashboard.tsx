"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Loader2,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

type DashboardData = {
  faculty: {
    id: string;
    name: string;
    email: string;
    greeting: string;
  };

  summary: {
    students: number;
    totalClasses: number;
    classesToday: number;
    pendingReviews: number;
    averageGrade:
      | number
      | null;
  };

  todaySchedule: {
    id: string;
    classId: string;
    title: string;
    startAt: string;
    endAt: string;
    mode: string;
    location: string;
  }[];

  announcements: {
    id: string;
    title: string;
    message: string;
    severity: string;
    createdAt:
      | string
      | null;
  }[];
};

function formatTime(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  );
}

export default function FacultyDashboard() {
  const [
    data,
    setData,
  ] =
    useState<
      DashboardData | null
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
              "/api/faculty/overview",
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
                "Unable to load dashboard.",
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
              : "Unable to load dashboard.",
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

  if (loading) {
    return (
      <LoadingState text="Loading faculty dashboard..." />
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error ||
            "Dashboard unavailable."}
        </div>
      </main>
    );
  }

  const firstName =
    data.faculty.name
      .split(" ")[0] ||
    data.faculty.name;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                Faculty Portal
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#281b1f]">
                {data.faculty.greeting},{" "}
                {firstName} 👋
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Here&apos;s what is
                happening with your
                classes today.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/faculty/attendance"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#8f0024]/20 bg-white px-4 text-[10px] font-black text-[#8f0024]"
              >
                <ClipboardCheck className="h-4 w-4" />
                View Attendance
              </Link>

              <Link
                href="/faculty/live-classes"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white"
              >
                <Video className="h-4 w-4" />
                Start Live Class
              </Link>

              <Link
                href="/faculty/content"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[10px] font-black text-slate-600"
              >
                <BookOpen className="h-4 w-4" />
                Upload Content
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="My Students"
            value={
              data.summary.students
            }
            note="Across your assigned classes"
          />

          <StatCard
            icon={CalendarDays}
            label="Classes Today"
            value={
              data.summary.classesToday
            }
            note={`${data.summary.totalClasses} classes assigned`}
          />

          <StatCard
            icon={FileCheck2}
            label="Pending Reviews"
            value={
              data.summary.pendingReviews
            }
            note="Assignment submissions"
          />

          <StatCard
            icon={TrendingUp}
            label="Average Grade"
            value={
              data.summary.averageGrade ===
              null
                ? "—"
                : `${data.summary.averageGrade}%`
            }
            note="Based on graded submissions"
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-5">
            {/* TODAY SCHEDULE */}

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Today&apos;s Schedule
                  </h2>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Your scheduled sessions
                    for today.
                  </p>
                </div>

                <Link
                  href="/faculty/schedule"
                  className="inline-flex items-center gap-1 text-[9px] font-black text-[#8f0024]"
                >
                  Full Schedule
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {data.todaySchedule.length ===
              0 ? (
                <EmptyBlock
                  icon={
                    CalendarDays
                  }
                  title="No sessions today"
                  text="Your scheduled class sessions will appear here."
                  href="/faculty/schedule"
                  action="Open Schedule"
                />
              ) : (
                <div className="divide-y divide-slate-100 px-5">
                  {data.todaySchedule.map(
                    (
                      session,
                    ) => (
                      <div
                        key={
                          session.id
                        }
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
                      >
                        <div className="w-32 shrink-0">
                          <p className="text-[10px] font-black text-[#8f0024]">
                            {formatTime(
                              session.startAt,
                            )}
                          </p>

                          <p className="mt-1 text-[8px] text-slate-400">
                            to{" "}
                            {formatTime(
                              session.endAt,
                            )}
                          </p>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-black text-slate-800">
                            {
                              session.title
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {session.mode ||
                              "Class"}

                            {session.location
                              ? ` · ${session.location}`
                              : ""}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-[#fff1f4] px-3 py-1.5 text-[8px] font-black text-[#8f0024]">
                          Scheduled
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </article>

            {/* CLASS OVERVIEW */}

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Teaching Overview
                  </h2>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Quick access to your
                    academic workspace.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <QuickLink
                  href="/faculty/classes"
                  icon={
                    GraduationCap
                  }
                  title="My Classes"
                  text={`${data.summary.totalClasses} assigned`}
                />

                <QuickLink
                  href="/faculty/students"
                  icon={Users}
                  title="Students"
                  text={`${data.summary.students} enrolled`}
                />

                <QuickLink
                  href="/faculty/assignments"
                  icon={
                    FileCheck2
                  }
                  title="Assignments"
                  text={`${data.summary.pendingReviews} to review`}
                />
              </div>
            </article>
          </div>

          <div className="space-y-5">
            {/* PENDING */}

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Assignments to Review
                  </h2>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Student submissions
                    awaiting review.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                  <FileCheck2 className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#fff7f9] p-5 text-center">
                <p className="text-3xl font-black text-[#8f0024]">
                  {data.summary.pendingReviews}
                </p>

                <p className="mt-2 text-[9px] font-semibold text-slate-500">
                  Pending submissions
                </p>

                <Link
                  href="/faculty/assignments"
                  className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#8f0024] px-4 text-[9px] font-black text-white"
                >
                  Review Assignments
                </Link>
              </div>
            </article>

            {/* ANNOUNCEMENTS */}

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Recent Announcements
                  </h2>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Updates from administration.
                  </p>
                </div>

                <Bell className="h-4 w-4 text-[#8f0024]" />
              </div>

              {data.announcements.length ===
              0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[10px] font-semibold text-slate-400">
                    No announcements yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.announcements.map(
                    (
                      announcement,
                    ) => (
                      <div
                        key={
                          announcement.id
                        }
                        className="px-5 py-4"
                      >
                        <p className="text-[10px] font-black text-slate-700">
                          {
                            announcement.title
                          }
                        </p>

                        <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-400">
                          {
                            announcement.message
                          }
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;

  value:
    | number
    | string;

  note: string;
}) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-[#281b1f]">
            {value}
          </p>

          <p className="mt-2 text-[9px] text-slate-400">
            {note}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024] transition group-hover:bg-[#8f0024] group-hover:text-white">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#8f0024]/20 hover:bg-[#fff8fa]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#8f0024] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-[10px] font-black text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-[9px] text-slate-400">
        {text}
      </p>
    </Link>
  );
}

function EmptyBlock({
  icon: Icon,
  title,
  text,
  href,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[11px] font-black text-slate-700">
        {title}
      </p>

      <p className="mt-2 text-[9px] text-slate-400">
        {text}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex h-9 items-center rounded-lg border border-[#8f0024]/20 px-4 text-[9px] font-black text-[#8f0024]"
      >
        {action}
      </Link>
    </div>
  );
}

function LoadingState({
  text,
}: {
  text: string;
}) {
  return (
    <main className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

        <p className="mt-3 text-[10px] font-semibold text-slate-400">
          {text}
        </p>
      </div>
    </main>
  );
}
