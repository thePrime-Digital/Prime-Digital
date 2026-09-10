"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  Loader2,
  Megaphone,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

type StudentLevel =
  | "foundation"
  | "advanced"
  | "college";

type StudentOverview = {
  student: {
    id: string;
    name: string;
    email: string;
    greeting: string;

    studentLevel:
      | StudentLevel
      | null;

    currentClass:
      | string
      | null;

    degreeName:
      | string
      | null;

    program:
      | string
      | null;
  };

  summary: {
    enrolledClasses: number;
    classesToday: number;

    attendanceRate:
      | number
      | null;

    pendingAssignments: number;
  };

  classes: {
    id: string;
    name: string;
    program: string;
    faculty: string;
    schedule: string;
    room: string;
    deliveryMode: string;
    status: string;
  }[];

  todaySchedule: {
    id: string;
    classId: string;
    className: string;
    title: string;

    startAt:
      | string
      | null;

    endAt:
      | string
      | null;

    mode: string;
    location: string;
  }[];

  upcomingSchedule: {
    id: string;
    classId: string;
    className: string;
    title: string;

    startAt:
      | string
      | null;

    endAt:
      | string
      | null;

    mode: string;
    location: string;
  }[];

  assignments: {
    id: string;
    classId: string;
    className: string;
    title: string;
    description: string;

    dueAt:
      | string
      | null;

    maxScore: number;

    submissionStatus:
      | string
      | null;

    grade:
      | number
      | null;

    feedback: string;

    submittedAt:
      | string
      | null;
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

function levelLabel(
  level:
    | StudentLevel
    | null,
): string {
  if (
    level ===
    "foundation"
  ) {
    return "Foundation";
  }

  if (
    level ===
    "advanced"
  ) {
    return "Advanced";
  }

  if (
    level ===
    "college"
  ) {
    return "College";
  }

  return "Student";
}

function dateTimeLabel(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "Not scheduled";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Not scheduled";
  }

  return date.toLocaleString(
    undefined,
    {
      day:
        "2-digit",

      month:
        "short",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function dueLabel(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "No due date";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "No due date";
  }

  return date.toLocaleDateString(
    undefined,
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

function announcementClasses(
  severity: string,
): string {
  if (
    severity ===
    "warning"
  ) {
    return "border-amber-200 bg-amber-50";
  }

  if (
    severity ===
      "urgent" ||
    severity ===
      "error"
  ) {
    return "border-red-200 bg-red-50";
  }

  if (
    severity ===
    "success"
  ) {
    return "border-emerald-200 bg-emerald-50";
  }

  return "border-slate-200 bg-slate-50";
}

export default function StudentDashboard() {
  const [
    data,
    setData,
  ] =
    useState<
      StudentOverview | null
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

  const loadOverview =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/student/overview",
              {
                method:
                  "GET",

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
                "Unable to load dashboard.",
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
              : "Unable to load dashboard.",
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
    loadOverview();
  }, [loadOverview]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

          <p className="mt-3 text-xs font-bold text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <main className="p-5 sm:p-7 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-black text-red-800">
            Student dashboard could not be loaded.
          </p>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadOverview
            }
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-xs font-black text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const {
    student,
    summary,
  } = data;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-2xl bg-[#690019] shadow-sm">
          <div className="p-6 text-white sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">
              Prime Digital School
            </p>

            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {student.greeting},{" "}
                  {student.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black">
                    {levelLabel(
                      student.studentLevel,
                    )}
                  </span>

                  {student.currentClass && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black">
                      {student.currentClass}
                    </span>
                  )}

                  {student.degreeName && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black">
                      {student.degreeName}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-pink-100">
                  {student.program ||
                    "Your program has not been assigned yet."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-4">
                <p className="text-[9px] font-black uppercase tracking-wider text-pink-200">
                  Student Portal
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {student.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!student.studentLevel && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
            Your academic profile is incomplete. An administrator needs to assign your student level, class/year and program.
          </div>
        )}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Enrolled Classes"
            value={
              summary.enrolledClasses
            }
            icon={BookOpen}
            note="Active class enrollments"
          />

          <SummaryCard
            label="Classes Today"
            value={
              summary.classesToday
            }
            icon={
              CalendarDays
            }
            note="Scheduled for today"
          />

          <SummaryCard
            label="Attendance"
            value={
              summary.attendanceRate ===
              null
                ? "—"
                : `${summary.attendanceRate}%`
            }
            icon={
              TrendingUp
            }
            note="Present + late"
          />

          <SummaryCard
            label="Pending Assignments"
            value={
              summary.pendingAssignments
            }
            icon={
              ClipboardList
            }
            note="Published and not submitted"
          />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeading
              title="Today's Schedule"
              subtitle="Your classes scheduled for today"
              icon={
                Clock3
              }
            />

            {data.todaySchedule.length ===
            0 ? (
              <EmptyState text="No classes are scheduled for today." />
            ) : (
              <div className="divide-y divide-slate-100">
                {data.todaySchedule.map(
                  (
                    session,
                  ) => (
                    <div
                      key={
                        session.id
                      }
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {
                            session.title
                          }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-[#8f0024]">
                          {
                            session.className
                          }
                        </p>

                        <p className="mt-2 text-[10px] text-slate-500">
                          {session.mode ||
                            "Class"}
                          {session.location
                            ? ` • ${session.location}`
                            : ""}
                        </p>
                      </div>

                      <span className="w-fit rounded-lg bg-[#fff1f4] px-3 py-2 text-[10px] font-black text-[#8f0024]">
                        {dateTimeLabel(
                          session.startAt,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeading
              title="My Classes"
              subtitle="Current enrollments"
              icon={
                GraduationCap
              }
            />

            {data.classes.length ===
            0 ? (
              <EmptyState text="You have not been enrolled in a class yet." />
            ) : (
              <div className="space-y-3 p-4">
                {data.classes
                  .slice(
                    0,
                    5,
                  )
                  .map(
                    (
                      classRecord,
                    ) => (
                      <div
                        key={
                          classRecord.id
                        }
                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <p className="text-xs font-black text-slate-800">
                          {
                            classRecord.name
                          }
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-[#8f0024]">
                          {classRecord.program ||
                            student.program ||
                            "Prime Digital School"}
                        </p>

                        {(classRecord.faculty ||
                          classRecord.schedule) && (
                          <p className="mt-2 text-[9px] text-slate-500">
                            {classRecord.faculty ||
                              ""}
                            {classRecord.faculty &&
                            classRecord.schedule
                              ? " • "
                              : ""}
                            {classRecord.schedule ||
                              ""}
                          </p>
                        )}
                      </div>
                    ),
                  )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeading
              title="Assignments"
              subtitle="Published work from your classes"
              icon={
                ClipboardList
              }
            />

            {data.assignments.length ===
            0 ? (
              <EmptyState text="No published assignments yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {data.assignments.map(
                  (
                    assignment,
                  ) => (
                    <div
                      key={
                        assignment.id
                      }
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-slate-800">
                            {
                              assignment.title
                            }
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-[#8f0024]">
                            {
                              assignment.className
                            }
                          </p>
                        </div>

                        {assignment.submissionStatus ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black capitalize text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            {
                              assignment.submissionStatus
                            }
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-700">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] font-semibold text-slate-500">
                        <span>
                          Due{" "}
                          {dueLabel(
                            assignment.dueAt,
                          )}
                        </span>

                        {assignment.grade !==
                          null && (
                          <span className="font-black text-emerald-700">
                            Grade:{" "}
                            {
                              assignment.grade
                            }
                            /
                            {
                              assignment.maxScore
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeading
              title="Announcements"
              subtitle="Latest school updates"
              icon={
                Megaphone
              }
            />

            {data.announcements.length ===
            0 ? (
              <EmptyState text="No announcements right now." />
            ) : (
              <div className="space-y-3 p-4">
                {data.announcements.map(
                  (
                    announcement,
                  ) => (
                    <div
                      key={
                        announcement.id
                      }
                      className={`rounded-xl border p-4 ${announcementClasses(
                        announcement.severity,
                      )}`}
                    >
                      <p className="text-xs font-black text-slate-800">
                        {
                          announcement.title
                        }
                      </p>

                      <p className="mt-2 text-[10px] leading-5 text-slate-600">
                        {
                          announcement.message
                        }
                      </p>

                      {announcement.createdAt && (
                        <p className="mt-2 text-[9px] font-semibold text-slate-400">
                          {dateTimeLabel(
                            announcement.createdAt,
                          )}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </section>
        </div>

        {data.upcomingSchedule.length >
          0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeading
              title="Upcoming Classes"
              subtitle="Your next scheduled sessions"
              icon={
                CalendarDays
              }
            />

            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {data.upcomingSchedule.map(
                (
                  session,
                ) => (
                  <div
                    key={
                      session.id
                    }
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-black text-slate-800">
                      {
                        session.title
                      }
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#8f0024]">
                      {
                        session.className
                      }
                    </p>

                    <p className="mt-3 text-[10px] font-bold text-slate-500">
                      {dateTimeLabel(
                        session.startAt,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;

  value:
    | string
    | number;

  note: string;
  icon: typeof BookOpen;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-[#271a1e]">
            {value}
          </p>

          <p className="mt-1 text-[9px] font-semibold text-slate-400">
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

function SectionHeading({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h2 className="text-sm font-black text-[#271a1e]">
          {title}
        </h2>

        <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-8 text-center">
      <p className="text-xs font-semibold text-slate-400">
        {text}
      </p>
    </div>
  );
}