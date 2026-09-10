"use client";
import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  RefreshCw,
  Settings,
  TrendingUp,
  Video,
} from "lucide-react";

type Section =
  | "courses"
  | "classes"
  | "attendance"
  | "assignments"
  | "learning-content"
  | "live-classes"
  | "performance"
  | "messages"
  | "notifications"
  | "settings";

type StudentOverview = {
  student: {
    id: string;
    name: string;
    email: string;
    greeting: string;
    studentLevel: "foundation" | "advanced" | "college" | null;
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
    startAt: string | null;
    endAt: string | null;
    mode: string;
    location: string;
  }[];

  upcomingSchedule: {
    id: string;
    classId: string;
    className: string;
    title: string;
    startAt: string | null;
    endAt: string | null;
    mode: string;
    location: string;
  }[];

  assignments: {
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
  }[];

  announcements: {
    id: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string | null;
  }[];
};

function levelLabel(level: StudentOverview["student"]["studentLevel"]) {
  if (level === "foundation") {
    return "Foundation";
  }

  if (level === "advanced") {
    return "Advanced";
  }

  if (level === "college") {
    return "College";
  }

  return "Student";
}

function dateLabel(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function shortDate(value: string | null) {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const sectionInfo: Record<
  Section,
  {
    title: string;
    description: string;
  }
> = {
  courses: {
    title: "My Courses",
    description: "Your Prime Digital School program and academic pathway.",
  },

  classes: {
    title: "My Classes",
    description: "Classes you are currently enrolled in.",
  },

  attendance: {
    title: "Attendance",
    description: "Track your attendance and participation.",
  },

  assignments: {
    title: "Assignments",
    description: "View your published assignments and submission status.",
  },

  "learning-content": {
    title: "Learning Content",
    description: "Study materials, resources and faculty content.",
  },

  "live-classes": {
    title: "Live Classes",
    description: "Upcoming scheduled learning sessions.",
  },

  performance: {
    title: "Performance",
    description: "Review attendance and recent academic results.",
  },

  messages: {
    title: "Messages",
    description: "Communicate with your faculty and school.",
  },

  notifications: {
    title: "Notifications",
    description: "Important school announcements and updates.",
  },

  settings: {
    title: "Settings",
    description: "Review your student profile and account information.",
  },
};

export default function StudentPortalSection({
  section,
}: {
  section: Section;
}) {
  const [data, setData] = useState<StudentOverview | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student/overview", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load student data.");
      }

      setData(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load student data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const recentAverage = useMemo(() => {
    if (!data) {
      return null;
    }

    const graded = data.assignments.filter(
      (assignment) =>
        typeof assignment.grade === "number" && assignment.maxScore > 0,
    );

    if (graded.length === 0) {
      return null;
    }

    const percentages = graded.map(
      (assignment) => ((assignment.grade || 0) / assignment.maxScore) * 100,
    );

    return Math.round(
      percentages.reduce((total, value) => total + value, 0) /
        percentages.length,
    );
  }, [data]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

          <p className="mt-3 text-xs font-bold text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="p-5 sm:p-7 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-black text-red-800">Unable to load this page.</p>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadData}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-xs font-black text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const info = sectionInfo[section];

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
            {info.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{info.description}</p>
        </header>

        <div className="mt-6">
          {section === "courses" && <CoursesView data={data} />}

          {section === "classes" && <ClassesView data={data} />}

          {section === "attendance" && <AttendanceView data={data} />}

          {section === "assignments" && <AssignmentsView data={data} />}

          {section === "learning-content" && <LearningContentView />}

          {section === "live-classes" && <LiveClassesView data={data} />}

          {section === "performance" && (
            <PerformanceView data={data} recentAverage={recentAverage} />
          )}

          {section === "messages" && <MessagesView />}

          {section === "notifications" && <NotificationsView data={data} />}

          {section === "settings" && <SettingsView data={data} />}
        </div>
      </div>
    </main>
  );
}

function CoursesView({ data }: { data: StudentOverview }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-2xl bg-[#690019] p-6 text-white shadow-sm sm:p-8">
        <BookOpen className="h-7 w-7 text-pink-200" />

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-pink-200">
          Current Program
        </p>

        <h2 className="mt-2 text-2xl font-black">
          {data.student.program || "Program not assigned"}
        </h2>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>{levelLabel(data.student.studentLevel)}</Badge>

          {data.student.currentClass && (
            <Badge>{data.student.currentClass}</Badge>
          )}

          {data.student.degreeName && <Badge>{data.student.degreeName}</Badge>}
        </div>
      </section>

      <div className="grid gap-3">
        <Metric label="Enrolled Classes" value={data.summary.enrolledClasses} />

        <Metric
          label="Assignments Pending"
          value={data.summary.pendingAssignments}
        />
      </div>
    </div>
  );
}

function ClassesView({ data }: { data: StudentOverview }) {
  if (data.classes.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap />}
        title="No classes yet"
        text="You have not been enrolled in an academic class yet."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.classes.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
            <GraduationCap className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-sm font-black text-slate-900">
            {item.name}
          </h2>

          <p className="mt-1 text-[10px] font-bold text-[#8f0024]">
            {item.program || data.student.program}
          </p>

          <div className="mt-4 space-y-2 text-[10px] text-slate-500">
            <p>Faculty: {item.faculty || "Not assigned"}</p>

            <p>Schedule: {item.schedule || "Not scheduled"}</p>

            <p>Mode: {item.deliveryMode || "Not specified"}</p>

            {item.room && <p>Room: {item.room}</p>}
            <Link
              href={`/dashboard/classes/${item.id}`}
              className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white"
            >
              Open Class
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function AttendanceView({ data }: { data: StudentOverview }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Overall Attendance
            </p>

            <p className="mt-1 text-3xl font-black text-[#271a1e]">
              {data.summary.attendanceRate === null
                ? "—"
                : `${data.summary.attendanceRate}%`}
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          Present and late attendance records count as attended.
        </p>
      </section>

      <Metric label="Classes Today" value={data.summary.classesToday} />
    </div>
  );
}

function AssignmentsView({ data }: { data: StudentOverview }) {
  if (data.assignments.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList />}
        title="No assignments"
        text="No published assignments are available yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.assignments.map((assignment) => (
        <article
          key={assignment.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black text-[#8f0024]">
                {assignment.className}
              </p>

              <h2 className="mt-1 text-sm font-black text-slate-900">
                {assignment.title}
              </h2>

              {assignment.description && (
                <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500">
                  {assignment.description}
                </p>
              )}
            </div>

            {assignment.submissionStatus ? (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black capitalize text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />

                {assignment.submissionStatus}
              </span>
            ) : (
              <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black text-amber-700">
                Pending
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500">
            <span>Due: {shortDate(assignment.dueAt)}</span>

            <span>Max Score: {assignment.maxScore}</span>

            {assignment.grade !== null && (
              <span className="font-black text-emerald-700">
                Grade: {assignment.grade}/{assignment.maxScore}
              </span>
            )}
          </div>

          {assignment.feedback && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-[9px] font-black uppercase text-slate-400">
                Faculty Feedback
              </p>

              <p className="mt-2 text-xs text-slate-600">
                {assignment.feedback}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function LearningContentView() {
  return (
    <EmptyState
      icon={<FileText />}
      title="Learning content"
      text="Faculty study material and course resources will appear here."
    />
  );
}

function LiveClassesView({ data }: { data: StudentOverview }) {
  if (data.upcomingSchedule.length === 0) {
    return (
      <EmptyState
        icon={<Video />}
        title="No upcoming classes"
        text="There are no scheduled live classes right now."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.upcomingSchedule.map((session) => (
        <article
          key={session.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <Video className="h-5 w-5 text-[#8f0024]" />

          <h2 className="mt-4 text-sm font-black text-slate-900">
            {session.title}
          </h2>

          <p className="mt-1 text-[10px] font-black text-[#8f0024]">
            {session.className}
          </p>

          <p className="mt-4 text-xs font-semibold text-slate-600">
            {dateLabel(session.startAt)}
          </p>

          <p className="mt-2 text-[10px] text-slate-500">
            {session.mode || "Class Session"}

            {session.location ? ` • ${session.location}` : ""}
          </p>
        </article>
      ))}
    </div>
  );
}

function PerformanceView({
  data,
  recentAverage,
}: {
  data: StudentOverview;
  recentAverage: number | null;
}) {
  const graded = data.assignments.filter(
    (assignment) => assignment.grade !== null,
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Metric
          label="Attendance"
          value={
            data.summary.attendanceRate === null
              ? "—"
              : `${data.summary.attendanceRate}%`
          }
        />

        <Metric
          label="Recent Graded Average"
          value={recentAverage === null ? "—" : `${recentAverage}%`}
        />
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-sm font-black text-slate-900">Recent Results</h2>
        </div>

        {graded.length === 0 ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-400">
            No graded assignments yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {graded.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="text-xs font-black text-slate-800">
                    {assignment.title}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold text-slate-400">
                    {assignment.className}
                  </p>
                </div>

                <span className="text-sm font-black text-emerald-700">
                  {assignment.grade}/{assignment.maxScore}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MessagesView() {
  return (
    <EmptyState
      icon={<MessageSquare />}
      title="Messages"
      text="Your faculty and school conversations will appear here."
    />
  );
}

function NotificationsView({ data }: { data: StudentOverview }) {
  if (data.announcements.length === 0) {
    return (
      <EmptyState
        icon={<Bell />}
        title="No notifications"
        text="You have no school notifications right now."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.announcements.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
              <Bell className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">
                {item.title}
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                {item.message}
              </p>

              {item.createdAt && (
                <p className="mt-2 text-[9px] font-semibold text-slate-400">
                  {dateLabel(item.createdAt)}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function SettingsView({ data }: { data: StudentOverview }) {
  return (
    <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Settings className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-sm font-black text-slate-900">Student Profile</h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Your current account and academic information.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ProfileField label="Full Name" value={data.student.name} />

        <ProfileField label="Email" value={data.student.email} />

        <ProfileField
          label="Student Level"
          value={levelLabel(data.student.studentLevel)}
        />

        <ProfileField
          label="Class / Year"
          value={data.student.currentClass || "Not assigned"}
        />

        {data.student.degreeName && (
          <ProfileField label="Degree" value={data.student.degreeName} />
        )}

        <ProfileField
          label="Program"
          value={data.student.program || "Not assigned"}
        />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#271a1e]">{value}</p>
    </article>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black">
      {children}
    </span>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
        {icon}
      </div>

      <h2 className="mt-4 text-sm font-black text-slate-900">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
        {text}
      </p>
    </section>
  );
}
