"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  GraduationCap,
  Lock,
  MessageCircle,
  Play,
  RefreshCw,
  Trophy,
} from "lucide-react";

type ClassItem = {
  id?: string;
  name?: string;
  program?: string;
  faculty?: string;
  schedule?: string;
  capacity?: number;
};

type SessionItem = {
  id?: string;
  title?: string;
  className?: string;
  startsAt?: string;
  startAt?: string;
  date?: string;
  startTime?: string;
  time?: string;
  location?: string;
  type?: string;
  meetingUrl?: string;
};

type AssignmentItem = {
  id?: string;
  title?: string;
  className?: string;
  dueAt?: string;
  maxScore?: number;
};

type Overview = {
  student?: {
    name?: string;
    program?: string;
    studentLevel?: string;
    currentClass?: string;
  };
  summary?: {
    enrolledClasses?: number;
    classesToday?: number;
    attendanceRate?: number;
    pendingAssignments?: number;
  };
  classes?: ClassItem[];
  todaySchedule?: SessionItem[];
  upcomingSchedule?: SessionItem[];
  assignments?: AssignmentItem[];
};

type Screen =
  | "timetable"
  | "course"
  | "tests"
  | "doubts"
  | "placement"
  | "certificates"
  | "progress";

const API = "/api/student/overview";

function formatDate(value: string | undefined): string {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(value: string | undefined): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSessionDate(session: SessionItem): Date | null {
  const raw = session.startsAt || session.startAt || session.date;

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatSessionTime(session: SessionItem): string {
  return (
    session.startTime ||
    session.time ||
    formatTime(session.startsAt || session.startAt)
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sr-card">
      <div className="sr-feature-head">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Empty({
  text,
}: {
  text: string;
}) {
  return <p className="sr-empty">{text}</p>;
}

function Header({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="sr-header">
      <div>
        <h1>{title}</h1>
        <p className="sr-sub">{subtitle}</p>
      </div>
      {children}
    </header>
  );
}

function Stat({
  title,
  value,
  detail,
}: {
  title: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="sr-card">
      <div className="sr-label">{title}</div>
      <div className="sr-stat">{value}</div>
      {detail && <p className="sr-note" style={{ marginTop: 9 }}>{detail}</p>}
    </div>
  );
}

export default function StudentReferenceScreen({
  screen,
}: {
  screen: Screen;
}) {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [calendarView, setCalendarView] = useState<"week" | "month">("week");
  const [selectedClass, setSelectedClass] = useState("");
  const [testTab, setTestTab] = useState<"upcoming" | "results">("upcoming");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API, {
        credentials: "include",
        cache: "no-store",
      });

      const payload: Overview & { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load student data.");
      }

      setData(payload);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load student data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const classes = data?.classes || [];
  const assignments = data?.assignments || [];

  const sessions = useMemo(() => {
    const all = [
      ...(data?.todaySchedule || []),
      ...(data?.upcomingSchedule || []),
    ];

    const seen = new Set<string>();

    return all.filter((session) => {
      const key =
        session.id ||
        `${session.title}-${session.startsAt || session.startAt || session.date || ""}`;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const currentClass =
    classes.find((item) => item.id === selectedClass) ||
    classes[0];

  const now = new Date();

  const weekDates = useMemo(() => {
    const start = new Date();
    const mondayOffset = (start.getDay() + 6) % 7;

    start.setDate(start.getDate() - mondayOffset + weekOffset * 7);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: calendarView === "month" ? 28 : 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [weekOffset, calendarView]);

  const titles: Record<Screen, [string, string]> = {
    timetable: ["Timetable", "Your upcoming classes and learning schedule"],
    course: ["Course", "Modules, classes and lesson progress"],
    tests: ["Tests", "Upcoming assessments and your results"],
    doubts: ["Doubts", "Ask questions and connect with faculty"],
    placement: ["Placement", "Get job-ready, step by step"],
    certificates: ["Certificates", "Your earned achievements and certificates"],
    progress: ["Learning Progress", "Track your learning journey"],
  };

  return (
    <div className="student-reference">
      <Header title={titles[screen][0]} subtitle={titles[screen][1]}>
        <button type="button" onClick={() => void load()} className="sr-btn sr-btn-outline">
          <RefreshCw size={14} /> Refresh
        </button>
      </Header>

      {error && (
        <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="sr-card">
          <Empty text="Loading your student records..." />
        </div>
      ) : (
        <>
          {screen === "timetable" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="sr-note">
                    {formatDate(weekDates[0]?.toISOString())} to{" "}
                    {formatDate(weekDates[weekDates.length - 1]?.toISOString())}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="sr-pill sr-pill-red">Classes</span>
                    <span className="sr-pill sr-pill-gold">Projects</span>
                    <span className="sr-pill sr-pill-green">Mentor</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="sr-tab"
                    data-active={calendarView === "week"}
                    onClick={() => setCalendarView("week")}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    className="sr-tab"
                    data-active={calendarView === "month"}
                    onClick={() => setCalendarView("month")}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    className="sr-btn sr-btn-outline"
                    aria-label="Previous week"
                    onClick={() => setWeekOffset((value) => value - 1)}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    className="sr-btn sr-btn-outline"
                    aria-label="Next week"
                    onClick={() => setWeekOffset((value) => value + 1)}
                  >
                    <ChevronRight size={15} />
                  </button>
                  <Link className="sr-btn sr-btn-outline" href="/dashboard/live-classes">
                    My classes
                  </Link>
                </div>
              </div>

              <section className="sr-card">
                <div className="sr-week">
                  {weekDates.map((day) => {
                    const daySessions = sessions.filter((session) => {
                      const date = getSessionDate(session);
                      return date?.toDateString() === day.toDateString();
                    });

                    const isToday = day.toDateString() === now.toDateString();

                    return (
                      <div key={day.toISOString()} className="sr-day">
                        <div className={`sr-day-head ${isToday ? "today" : ""}`}>
                          {day.toLocaleDateString("en-IN", { weekday: "short" })}{" "}
                          {day.getDate()}
                          {isToday ? " · Today" : ""}
                        </div>

                        {daySessions.map((session, index) => (
                          <Link
                            key={session.id || index}
                            className="sr-session"
                            href="/dashboard/live-classes"
                          >
                            <strong>{formatSessionTime(session)}</strong>
                            <span className="mt-1 block">
                              {session.title || session.className || "Class"}
                            </span>
                            <span className="block opacity-75">
                              {session.location || "View class details"}
                            </span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {!sessions.length && (
                  <p className="sr-note mt-4">
                    No scheduled sessions are currently available.
                  </p>
                )}
              </section>

              <div className="mt-5">
                <Panel title="Coming up">
                  {sessions.length ? (
                    sessions.slice(0, 6).map((session, index) => (
                      <div
                        key={session.id || index}
                        className="flex items-center justify-between gap-4 border-b border-[#eee5df] py-3 last:border-b-0"
                      >
                        <div>
                          <span className="sr-pill sr-pill-gold mr-3">Class</span>
                          <strong className="text-xs">
                            {session.title || session.className || "Upcoming class"}
                          </strong>
                        </div>
                        <span className="text-xs text-[#806970]">
                          {formatDate(session.startsAt || session.startAt || session.date)}{" "}
                          {formatSessionTime(session)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <Empty text="No upcoming sessions yet." />
                  )}
                </Panel>
              </div>
            </>
          )}

          {screen === "course" && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold">
                    {currentClass?.name || data?.student?.program || "My Course"}
                  </h2>
                  <p className="sr-sub">
                    {currentClass?.program || data?.student?.currentClass || "Enrolled learning"}
                  </p>
                </div>
                <Link className="sr-btn sr-btn-outline" href="/dashboard/learning-content">
                  <BookOpen size={15} /> Course content
                </Link>
              </div>

              <div className="sr-grid sr-grid-four mb-5">
                <Stat
                  title="Classes enrolled"
                  value={data?.summary?.enrolledClasses ?? 0}
                  detail="Your active classes"
                />
                <Stat
                  title="Classes today"
                  value={data?.summary?.classesToday ?? 0}
                  detail="Scheduled sessions"
                />
                <Stat
                  title="Attendance"
                  value={`${data?.summary?.attendanceRate ?? 0}%`}
                  detail="Recorded attendance"
                />
                <Stat
                  title="Pending assignments"
                  value={data?.summary?.pendingAssignments ?? 0}
                  detail="Work to submit"
                />
              </div>

              <div className="sr-grid sr-grid-main">
                <Panel title="Modules / Enrolled classes">
                  {classes.length ? (
                    <div className="sr-table-wrap">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Course / Class</th>
                            <th>Faculty</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classes.map((item, index) => (
                            <tr
                              key={item.id || index}
                              className="cursor-pointer hover:bg-[#fcf8f5]"
                              onClick={() => setSelectedClass(item.id || "")}
                            >
                              <td>{index + 1}</td>
                              <td>
                                <strong>{item.name || item.program || "Class"}</strong>
                              </td>
                              <td>{item.faculty || "—"}</td>
                              <td>
                                <span className="sr-pill sr-pill-green">
                                  Enrolled
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty text="No enrolled classes found." />
                  )}
                </Panel>

                <Panel title={currentClass?.name || "Course lessons"}>
                  <p className="sr-note">
                    {currentClass?.program || "Select a class to explore the material."}
                  </p>

                  <div className="sr-divider" />

                  {assignments.length ? (
                    <>
                      <p className="sr-label mb-3">ASSIGNMENTS IN YOUR COURSES</p>

                      {assignments.slice(0, 7).map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center justify-between gap-3 border-b border-[#f1e8e4] py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="sr-pill sr-pill-gold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-xs font-semibold">
                                {item.title || "Assignment"}
                              </p>
                              <p className="sr-note">
                                {item.className || ""}
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/dashboard/assignments"
                            className="text-xs font-bold text-[#390c19]"
                          >
                            Open
                          </Link>
                        </div>
                      ))}
                    </>
                  ) : (
                    <Empty text="No assignments have been published yet." />
                  )}

                  <Link
                    href="/dashboard/recorded-lectures"
                    className="sr-btn mt-5 w-full"
                  >
                    <Play size={14} /> Browse lectures
                  </Link>
                </Panel>
              </div>
            </>
          )}

          {screen === "tests" && (
            <>
              <div className="mb-5 flex justify-end gap-2">
                <button
                  type="button"
                  data-active={testTab === "upcoming"}
                  className="sr-tab"
                  onClick={() => setTestTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  data-active={testTab === "results"}
                  className="sr-tab"
                  onClick={() => setTestTab("results")}
                >
                  Results
                </button>
              </div>

              <div className="sr-grid sr-grid-four mb-5">
                <div className="sr-banner">
                  <span className="sr-pill sr-pill-gold">Tests</span>
                  <h2 className="mt-4 font-serif text-xl">
                    {testTab === "upcoming" ? "Your next assessment" : "Test results"}
                  </h2>
                  <p className="mt-3 text-xs text-white/70">
                    {testTab === "upcoming"
                      ? "Scheduled tests will appear once published."
                      : "Verified scores will appear once available."}
                  </p>
                </div>
                <Stat title="Average" value="—" detail="No linked test results" />
                <Stat title="Best" value="—" detail="No verified score" />
                <Stat title="Rank" value="—" detail="No batch ranking" />
              </div>

              <div className="sr-grid sr-grid-two">
                <Panel title={testTab === "upcoming" ? "Upcoming tests" : "Results"}>
                  <div className="sr-table-wrap">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th>Test</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <Empty text="No published test records are connected to your student account yet." />
                </Panel>

                <Panel title="Topics">
                  <p className="sr-note">
                    Topic strengths, weaknesses and personalised practice will
                    appear here when assessed results become available.
                  </p>

                  <div className="mt-7 flex min-h-36 items-center justify-center rounded-lg bg-[#faf5f0]">
                    <Trophy size={38} className="text-[#c0a6a8]" />
                  </div>
                </Panel>
              </div>
            </>
          )}

          {screen === "doubts" && (
            <div className="sr-grid sr-grid-main">
              <Panel title="Ask a question">
                <div className="space-y-4">
                  <label className="block text-xs font-bold">
                    Topic
                    <select className="sr-input" defaultValue="">
                      <option value="">Choose topic</option>
                      {classes.map((item, index) => (
                        <option key={item.id || index} value={item.id || index}>
                          {item.name || item.program || `Class ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-xs font-bold">
                    Your question
                    <textarea
                      className="sr-input"
                      rows={7}
                      placeholder="Write what you tried and what went wrong..."
                      readOnly
                      aria-describedby="doubts-unavailable"
                    />
                  </label>

                  <p id="doubts-unavailable" className="sr-note">
                    The screenshot's direct mentor Q&A system is not yet
                    connected. To send a question now, use Student Messages.
                  </p>

                  <Link href="/dashboard/messages" className="sr-btn">
                    <MessageCircle size={15} /> Open Messages
                  </Link>
                </div>
              </Panel>

              <Panel title="Question conversations">
                <div className="flex gap-2">
                  <span className="sr-pill sr-pill-gold">Open</span>
                  <span className="sr-pill">Answered</span>
                </div>

                <div className="mt-6 rounded-xl bg-[#faf6f2] p-7 text-center">
                  <CircleHelp size={30} className="mx-auto text-[#ab8e96]" />
                  <p className="mt-4 text-sm font-bold">
                    Your doubt conversations
                  </p>
                  <p className="sr-note mt-2">
                    Replies and resolution history will appear here when
                    the dedicated doubt-tracking system is connected.
                  </p>
                </div>
              </Panel>
            </div>
          )}

          {screen === "placement" && (
            <div className="sr-grid sr-grid-main">
              <Panel title="Readiness">
                <div className="flex items-center justify-between">
                  <p className="sr-note">Career preparation</p>
                  <span className="sr-pill sr-pill-gold">Not assessed</span>
                </div>

                <div className="sr-divider" />

                {[
                  ["Resume", "Prepare your latest resume"],
                  ["LinkedIn profile", "Complete your professional profile"],
                  ["Portfolio", "Add your course projects"],
                  ["Mock interviews", "Practice interview questions"],
                  ["Aptitude", "Build assessment readiness"],
                ].map(([name, detail]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 border-b border-[#f0e7e3] py-3 last:border-0"
                  >
                    <span className="sr-pill">To do</span>
                    <div>
                      <strong className="text-xs">{name}</strong>
                      <p className="sr-note">{detail}</p>
                    </div>
                  </div>
                ))}
              </Panel>

              <Panel title="Openings">
                <div className="flex gap-2">
                  <span className="sr-tab" data-active="true">Jobs</span>
                  <span className="sr-tab">Internships</span>
                </div>

                <div className="sr-divider" />

                <Empty text="No verified placement openings have been published to students yet." />

                <p className="sr-note">
                  Hiring drives can be managed in the Admin portal. A student
                  application and eligibility workflow is still required.
                </p>
              </Panel>
            </div>
          )}

          {screen === "certificates" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {classes.length ? (
                classes.map((item, index) => (
                  <div className="sr-card" key={item.id || index}>
                    <div className="flex min-h-[145px] flex-col items-center justify-center rounded-lg bg-[#f1e9e2] text-[#79636b]">
                      <Lock size={29} />
                      <p className="mt-3 text-xs font-bold">
                        {item.name || "Course certificate"}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <h2>{item.name || "Course"}</h2>
                      <span className="sr-pill">Unavailable</span>
                    </div>
                    <p className="sr-note mt-3">
                      No issued certificate has been linked to this enrollment.
                    </p>
                  </div>
                ))
              ) : (
                <div className="sr-card">
                  <div className="flex min-h-[145px] items-center justify-center rounded-lg bg-[#f1e9e2]">
                    <Lock size={30} className="text-[#8b737c]" />
                  </div>
                  <Empty text="No certificates are available." />
                </div>
              )}
            </div>
          )}

          {screen === "progress" && (
            <>
              <div className="sr-grid sr-grid-four mb-5">
                <Stat
                  title="Enrolled classes"
                  value={data?.summary?.enrolledClasses ?? 0}
                />
                <Stat
                  title="Attendance"
                  value={`${data?.summary?.attendanceRate ?? 0}%`}
                />
                <Stat
                  title="Classes today"
                  value={data?.summary?.classesToday ?? 0}
                />
                <Stat
                  title="Pending work"
                  value={data?.summary?.pendingAssignments ?? 0}
                />
              </div>

              <div className="sr-grid sr-grid-two">
                <Panel title="My learning">
                  {classes.length ? classes.map((item, index) => (
                    <div key={item.id || index} className="border-b py-4 last:border-0">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-sm">{item.name || "Course"}</strong>
                        <span className="sr-pill sr-pill-green">Enrolled</span>
                      </div>
                      <p className="sr-note mt-2">
                        {item.program || "Active course"}
                      </p>
                    </div>
                  )) : <Empty text="No enrolled classes yet." />}
                </Panel>

                <Panel title="Next steps">
                  <div className="space-y-3">
                    <Link href="/dashboard/recorded-lectures" className="sr-btn w-full">
                      <Play size={15} /> Watch lectures
                    </Link>
                    <Link href="/dashboard/assignments" className="sr-btn sr-btn-outline w-full">
                      <FileCheck2 size={15} /> View assignments
                    </Link>
                    <Link href="/dashboard/attendance" className="sr-btn sr-btn-outline w-full">
                      <CalendarDays size={15} /> Attendance records
                    </Link>
                  </div>
                  <p className="sr-note mt-5">
                    Module completion percentages require saved lesson-completion
                    records to calculate accurately.
                  </p>
                </Panel>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}