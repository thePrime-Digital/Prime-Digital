
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  GraduationCap,
  Loader2,
  Megaphone,
  RefreshCw,
  TrendingUp,
  Video,
  Wallet,
} from "lucide-react";

type ScheduleItem = {
  id: string;
  classId: string;
  className: string;
  title: string;
  startAt: string | null;
  endAt: string | null;
  mode: string;
  location: string;
};

type StudentOverview = {
  student: {
    id: string;
    name: string;
    email: string;
    greeting: string;
    studentLevel: string | null;
    currentClass: string | null;
    degreeName: string | null;
    program: string | null;
  };
  summary: {
    enrolledClasses: number;
    classesToday: number;
    attendanceRate: number | null;
    pendingAssignments: number;
  };
  classes: Array<{
    id: string;
    name: string;
    program: string;
    faculty: string;
    schedule: string;
    room: string;
    deliveryMode: string;
    status: string;
  }>;
  todaySchedule: ScheduleItem[];
  upcomingSchedule: ScheduleItem[];
  assignments: Array<{
    id: string;
    classId: string;
    className: string;
    title: string;
    description: string;
    dueAt: string | null;
    maxScore: number;
    submissionStatus: string | null;
    grade: number | null;
    feedback: string;
    submittedAt: string | null;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string | null;
  }>;
};

function dateLabel(
  value: string | null,
  includeTime = false,
) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    ...(includeTime
      ? {
          hour: "numeric" as const,
          minute: "2-digit" as const,
        }
      : {}),
  });
}

function Panel({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#ece6df] bg-white shadow-[0_2px_10px_rgba(40,18,23,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9e3] px-5 py-4">
        <div>
          <h2 className="text-sm font-extrabold text-[#281c20]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[11px] text-[#8a8182]">
              {subtitle}
            </p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8f0024] hover:underline"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}

function Empty({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="px-5 py-9 text-center text-xs font-medium text-[#91888a]">
      {children}
    </p>
  );
}

export default function StudentDashboard() {
  const [data, setData] =
    useState<StudentOverview | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/student/overview",
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const json =
        (await response.json()) as StudentOverview & {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          json.error ||
            "Unable to load your dashboard.",
        );
      }

      setData(json);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#f8f5f0]">
        <div className="text-center text-xs font-semibold text-[#8f0024]">
          <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin" />
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-full bg-[#f8f5f0] p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-200 bg-white p-6">
          <h1 className="font-bold text-[#8f0024]">
            Unable to load Student Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-xs font-bold text-white"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const { student, summary } = data;

  const cards = [
    {
      label: "Enrolled Classes",
      value: summary.enrolledClasses,
      note: "Active enrolments",
      icon: BookOpen,
      bg: "#fff0eb",
      ink: "#9a432f",
      href: "/dashboard/classes",
    },
    {
      label: "Today's Classes",
      value: summary.classesToday,
      note: "Sessions scheduled",
      icon: CalendarDays,
      bg: "#f0ecfc",
      ink: "#6945a6",
      href: "/dashboard/classes",
    },
    {
      label: "Attendance",
      value:
        summary.attendanceRate === null
          ? "—"
          : `${summary.attendanceRate}%`,
      note: "Present and late",
      icon: TrendingUp,
      bg: "#e8f5ef",
      ink: "#16805b",
      href: "/dashboard/attendance",
    },
    {
      label: "Pending Work",
      value: summary.pendingAssignments,
      note: "Assignments to submit",
      icon: ClipboardList,
      bg: "#fff4d9",
      ink: "#9a6b16",
      href: "/dashboard/assignments",
    },
  ];

  return (
    <main className="min-h-full bg-[#f8f5f0] px-4 py-5 text-[#281c20] sm:px-6 lg:px-8 lg:py-7">
      <div className="mx-auto max-w-[1450px] space-y-5">

        {/* PAGE HEADING */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8f0024]">
              Student Portal / Dashboard
            </p>

            <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
              Good to see you,{" "}
              {student.name.split(" ")[0]}!
            </h1>

            <p className="mt-1 text-xs text-[#857d80]">
              Here is an overview of your learning journey.
            </p>
          </div>

          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2c7cf] bg-white px-4 py-2.5 text-xs font-extrabold text-[#8f0024] hover:bg-[#fff1f4]"
          >
            <GraduationCap size={15} />
            My Courses
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* MAROON WELCOME CARD */}
        <section className="relative overflow-hidden rounded-xl bg-[#650019] px-5 py-6 text-white shadow-[0_10px_25px_rgba(101,0,25,0.12)] sm:px-7">
          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />

          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f1b8c8]">
                Your Learning Space
              </p>

              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                {student.greeting}, {student.name}
              </h2>

              <p className="mt-2 text-xs text-white/75">
                {student.program ||
                  "Your program will appear once assigned."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {student.studentLevel && (
                  <span className="rounded-md bg-white/15 px-3 py-1.5 text-[10px] font-semibold capitalize">
                    {student.studentLevel}
                  </span>
                )}

                {student.currentClass && (
                  <span className="rounded-md bg-white/15 px-3 py-1.5 text-[10px] font-semibold">
                    {student.currentClass}
                  </span>
                )}

                {student.degreeName && (
                  <span className="rounded-md bg-white/15 px-3 py-1.5 text-[10px] font-semibold">
                    {student.degreeName}
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/classes"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-extrabold text-[#650019] transition hover:bg-[#fff0f3]"
            >
              Continue Learning
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {!student.studentLevel && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Your academic profile is incomplete. Contact
            the school administration to assign your
            class and program.
          </p>
        )}

        {/* STATISTICS */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(
            ({
              label,
              value,
              note,
              icon: Icon,
              bg,
              ink,
              href,
            }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-xl border border-[#ece6df] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#877e81]">
                      {label}
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#281c20]">
                      {value}
                    </p>
                  </div>

                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{
                      background: bg,
                      color: ink,
                    }}
                  >
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-3 text-[10px] text-[#938a8c]">
                  {note}
                </p>
              </Link>
            ),
          )}
        </section>

        {/* TODAY'S SCHEDULE + COURSES */}
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <Panel
            title="Today's Schedule"
            subtitle="Classes planned for today"
            href="/dashboard/classes"
          >
            {data.todaySchedule.length === 0 ? (
              <Empty>
                No classes scheduled for today.
              </Empty>
            ) : (
              <div className="divide-y divide-[#eee9e3]">
                {data.todaySchedule
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#8f0024]">
                          <Clock3 size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-extrabold">
                            {item.title}
                          </p>

                          <p className="mt-1 text-[11px] text-[#8d8286]">
                            {item.className} ·{" "}
                            {item.mode ||
                              item.location ||
                              "Class"}
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-[#8f0024]">
                        {dateLabel(item.startAt, true)}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </Panel>

          <Panel
            title="My Courses"
            subtitle="Your currently enrolled classes"
            href="/dashboard/courses"
          >
            {data.classes.length === 0 ? (
              <Empty>
                No enrolled classes yet.
              </Empty>
            ) : (
              <div className="divide-y divide-[#eee9e3]">
                {data.classes
                  .slice(0, 4)
                  .map((item) => (
                    <Link
                      href={`/dashboard/classes/${encodeURIComponent(
                        item.id,
                      )}`}
                      key={item.id}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-[#fffafa]"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f7eff2] text-[#8f0024]">
                        <BookOpen size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">
                          {item.name}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-[#91878a]">
                          {item.faculty ||
                            item.program ||
                            "Course"}
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-[#8f0024]" />
                    </Link>
                  ))}
              </div>
            )}
          </Panel>
        </div>

        {/* ASSIGNMENTS + ANNOUNCEMENTS */}
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <Panel
            title="Upcoming Assignments"
            subtitle="Keep track of important due dates"
            href="/dashboard/assignments"
          >
            {data.assignments.length === 0 ? (
              <Empty>
                No assignments available.
              </Empty>
            ) : (
              <div className="divide-y divide-[#eee9e3]">
                {data.assignments
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[10px] text-[#91878a]">
                          {item.className} · Due{" "}
                          {dateLabel(item.dueAt)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          item.submissionStatus ===
                            "submitted" ||
                          item.submittedAt
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.submissionStatus ===
                          "submitted" ||
                        item.submittedAt
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Announcements"
            subtitle="Latest updates from your school"
            href="/dashboard/notifications"
          >
            {data.announcements.length === 0 ? (
              <Empty>
                No announcements yet.
              </Empty>
            ) : (
              <div className="divide-y divide-[#eee9e3]">
                {data.announcements
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 px-5 py-3.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fff2df] text-[#9e671d]">
                        <Megaphone size={16} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-bold">
                          {item.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#82787c]">
                          {item.message}
                        </p>

                        <p className="mt-1.5 text-[10px] text-[#a49b9e]">
                          {dateLabel(
                            item.createdAt,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Panel>
        </div>

        {/* QUICK ACCESS */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              href: "/dashboard/live-classes",
              icon: Video,
              title: "Live Classes",
              desc: "Join your scheduled classes",
            },
            {
              href: "/dashboard/fees",
              icon: Wallet,
              title: "Fees & Payments",
              desc: "View invoices and installments",
            },
            {
              href: "/dashboard/performance",
              icon: CheckCircle2,
              title: "Performance",
              desc: "Track your learning progress",
            },
          ].map(
            ({
              href,
              icon: Icon,
              title,
              desc,
            }) => (
              <Link
                href={href}
                key={href}
                className="flex items-center gap-3 rounded-xl border border-[#ece6df] bg-white p-4 transition hover:border-[#d9a7b4] hover:shadow-sm"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fff0f3] text-[#8f0024]">
                  <Icon size={19} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold">
                    {title}
                  </span>

                  <span className="mt-1 block text-[10px] text-[#91878a]">
                    {desc}
                  </span>
                </span>

                <ArrowRight
                  size={15}
                  className="text-[#8f0024]"
                />
              </Link>
            ),
          )}
        </section>
      </div>
    </main>
  );
}
