"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Loader2,
  MessageCircleQuestion,
  Megaphone,
  RefreshCw,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type StudentSection =
  | "timetable"
  | "learning-progress"
  | "lessons"
  | "exams"
  | "doubts"
  | "certificates"
  | "notices";

type ScheduleItem = {
  id: string;
  className: string;
  title: string;
  startAt: string | null;
  endAt: string | null;
  mode: string;
  location: string;
};

type Overview = {
  student?: {
    name?: string;
    program?: string | null;
  };
  summary?: {
    enrolledClasses?: number;
    attendanceRate?: number | null;
    pendingAssignments?: number;
  };
  classes?: Array<{
    id: string;
    name: string;
    program: string;
    faculty: string;
    schedule: string;
    status: string;
  }>;
  todaySchedule?: ScheduleItem[];
  upcomingSchedule?: ScheduleItem[];
  assignments?: Array<{
    id: string;
    title: string;
    className: string;
    dueAt: string | null;
    submissionStatus: string | null;
    submittedAt: string | null;
  }>;
  announcements?: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string | null;
  }>;
};

const config: Record<
  StudentSection,
  {
    title: string;
    subtitle: string;
    icon: LucideIcon;
  }
> = {
  timetable: {
    title: "My Timetable",
    subtitle: "Keep track of your upcoming classes.",
    icon: CalendarDays,
  },
  "learning-progress": {
    title: "Learning Progress",
    subtitle: "Review your academic activity and enrolled courses.",
    icon: TrendingUp,
  },
  lessons: {
    title: "My Lessons",
    subtitle: "Explore lessons, class material and learning resources.",
    icon: BookOpen,
  },
  exams: {
    title: "Exams",
    subtitle: "Exam information and assessments.",
    icon: FileQuestion,
  },
  doubts: {
    title: "Doubts & Questions",
    subtitle: "Get help with your lessons and assignments.",
    icon: MessageCircleQuestion,
  },
  certificates: {
    title: "My Certificates",
    subtitle: "View your achievements and certificates.",
    icon: Trophy,
  },
  notices: {
    title: "Notices",
    subtitle: "Important announcements from Prime Digital School.",
    icon: Megaphone,
  },
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Panel({
  title,
  children,
  link,
  linkLabel = "View all",
}: {
  title: string;
  children: ReactNode;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#ece3df] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eae5] px-5 py-4">
        <h2 className="text-sm font-extrabold text-[#311e24]">
          {title}
        </h2>

        {link && (
          <Link
            href={link}
            className="flex items-center gap-1 text-xs font-bold text-[#8f0024] hover:underline"
          >
            {linkLabel}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

function Empty({
  heading,
  description,
  href,
  action,
}: {
  heading: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#e6d4d7] bg-[#fffafb] p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff0f3] text-[#8f0024]">
        <BookOpen size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#311e24]">
        {heading}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
        {description}
      </p>

      {href && action && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6f001c]"
        >
          {action}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function ScheduleList({
  records,
}: {
  records: ScheduleItem[];
}) {
  if (records.length === 0) {
    return (
      <Empty
        heading="No classes scheduled"
        description="Your timetable will update when classes are assigned."
        href="/dashboard/classes"
        action="View My Classes"
      />
    );
  }

  return (
    <div className="space-y-3">
      {records.map((item, index) => (
        <div
          key={item.id || String(index)}
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#efe8e4] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f7e7eb] text-[#8f0024]">
              <Clock3 size={18} />
            </span>

            <div>
              <p className="text-sm font-bold">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {item.className}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {[item.mode, item.location]
                  .filter(Boolean)
                  .join(" · ") || "Class"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-[#8f0024]">
              {formatDate(item.startAt)}
            </p>

            {item.endAt && (
              <p className="mt-1 text-[11px] text-slate-400">
                Ends {formatDate(item.endAt)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudentRedesignSection({
  section,
}: {
  section: StudentSection;
}) {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/student/overview",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load student information.");
      }

      const result = (await response.json()) as Overview;
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load student information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const page = config[section];
  const Icon = page.icon;

  const classes = data?.classes ?? [];
  const today = data?.todaySchedule ?? [];
  const upcoming = data?.upcomingSchedule ?? [];
  const announcements = data?.announcements ?? [];
  const assignments = data?.assignments ?? [];

  return (
    <main className="min-h-full bg-[#f8f5f0] px-4 py-6 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1450px] space-y-6">

        {/* PAGE HEADING */}
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8f0024]">
            Student Portal / {page.title}
          </p>

          <h1 className="mt-2 text-2xl font-black text-[#2b1920]">
            {page.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {page.subtitle}
          </p>
        </header>

        {/* BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-[#650019] p-6 text-white sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[32px] border-white/5" />

          <div className="relative flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10">
              <Icon size={28} />
            </span>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                Prime Digital School
              </p>

              <h2 className="mt-1 text-xl font-black">
                {page.title}
              </h2>

              <p className="mt-1 text-xs text-white/70">
                {page.subtitle}
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center rounded-2xl border bg-white p-16 text-[#8f0024]">
            <Loader2 className="animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-xs font-bold text-white"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* TIMETABLE */}
            {section === "timetable" && (
              <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="Today's Classes">
                  <ScheduleList records={today} />
                </Panel>

                <Panel title="Upcoming Classes">
                  <ScheduleList records={upcoming} />
                </Panel>
              </div>
            )}

            {/* LEARNING PROGRESS */}
            {section === "learning-progress" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Enrolled Classes",
                      value: data?.summary?.enrolledClasses ?? 0,
                    },
                    {
                      label: "Attendance",
                      value:
                        data?.summary?.attendanceRate == null
                          ? "—"
                          : `${data.summary.attendanceRate}%`,
                    },
                    {
                      label: "Pending Assignments",
                      value:
                        data?.summary?.pendingAssignments ?? 0,
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-[#eae1dc] bg-white p-6"
                    >
                      <p className="text-xs font-semibold text-slate-500">
                        {card.label}
                      </p>

                      <p className="mt-3 text-3xl font-black text-[#8f0024]">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Panel
                  title="Your Learning Activities"
                  link="/dashboard/performance"
                  linkLabel="View Performance"
                >
                  <p className="text-xs leading-6 text-slate-500">
                    The figures above come from your student overview.
                    Detailed lesson-completion tracking requires
                    connected lesson progress records.
                  </p>
                </Panel>
              </>
            )}

            {/* LESSONS */}
            {section === "lessons" && (
              <Panel
                title="Your Enrolled Courses"
                link="/dashboard/learning-content"
                linkLabel="Learning Materials"
              >
                {classes.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {classes.map((item) => (
                      <Link
                        key={item.id}
                        href={`/dashboard/classes/${encodeURIComponent(item.id)}`}
                        className="rounded-xl border border-[#eee4df] bg-[#fffafb] p-5 transition hover:border-[#8f0024]/30"
                      >
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0f3] text-[#8f0024]">
                          <GraduationCap size={22} />
                        </span>

                        <h3 className="mt-4 text-sm font-extrabold">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs text-slate-500">
                          {item.program || item.faculty || "Course"}
                        </p>

                        <span className="mt-5 flex items-center gap-2 text-xs font-bold text-[#8f0024]">
                          Open Class
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty
                    heading="No enrolled courses"
                    description="Courses and lessons will appear once you have been enrolled."
                    href="/dashboard/courses"
                    action="View Courses"
                  />
                )}
              </Panel>
            )}

            {/* EXAMS */}
            {section === "exams" && (
              <Panel title="Exams & Assessments">
                <Empty
                  heading="Exam schedule not connected yet"
                  description="This screen is prepared for scheduled exams, exam attempts, results and grades. A separate exam API is required before those features can be used."
                  href="/dashboard/assignments"
                  action="View Assignments"
                />
              </Panel>
            )}

            {/* DOUBTS */}
            {section === "doubts" && (
              <Panel title="Ask for Academic Help">
                <Empty
                  heading="Have a question?"
                  description="You can use your existing student messaging section to contact the school. A dedicated doubt-submission and resolution workflow is not connected yet."
                  href="/dashboard/messages"
                  action="Open Messages"
                />
              </Panel>
            )}

            {/* CERTIFICATES */}
            {section === "certificates" && (
              <Panel title="My Certificates">
                <Empty
                  heading="Certificate records not connected yet"
                  description="Issued certificates, certificate previews and verification details will appear once a dedicated certificate data source is connected."
                />
              </Panel>
            )}

            {/* NOTICES */}
            {section === "notices" && (
              <Panel
                title="School Announcements"
                link="/dashboard/notifications"
                linkLabel="Notifications"
              >
                {announcements.length ? (
                  <div className="space-y-3">
                    {announcements.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-xl border border-[#eee5e0] p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#fff1e4] text-[#9a661a]">
                            <Megaphone size={18} />
                          </span>

                          <div>
                            <h3 className="text-sm font-bold">
                              {item.title}
                            </h3>

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                              {item.message}
                            </p>

                            <p className="mt-2 text-[11px] text-slate-400">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty
                    heading="No announcements"
                    description="School announcements will appear here when published."
                  />
                )}
              </Panel>
            )}

            {/* RELATED LEARNING ACCESS */}
            {(section === "learning-progress" ||
              section === "lessons") && (
              <Panel title="Assignments">
                {assignments.length ? (
                  <div className="space-y-3">
                    {assignments.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eee5e0] p-4"
                      >
                        <div>
                          <h3 className="text-xs font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[11px] text-slate-500">
                            {item.className} · {formatDate(item.dueAt)}
                          </p>
                        </div>

                        <span className="rounded-full bg-[#fff1e4] px-3 py-1 text-[10px] font-bold text-[#915c1a]">
                          {item.submissionStatus ||
                            (item.submittedAt
                              ? "Submitted"
                              : "Pending")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No assignments found.
                  </p>
                )}

                <Link
                  href="/dashboard/assignments"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#8f0024]"
                >
                  View All Assignments
                  <ArrowRight size={14} />
                </Link>
              </Panel>
            )}
          </>
        )}
      </div>
    </main>
  );
}