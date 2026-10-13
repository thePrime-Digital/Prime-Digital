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
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

type Item = Record<string, unknown>;

type FacultyScreen =
  | "timetable"
  | "batches"
  | "review"
  | "tests"
  | "doubts"
  | "projects"
  | "leave"
  | "payslips";

type ScheduleResponse = {
  classes?: Item[];
  sessions?: Item[];
};

type AssignmentResponse = {
  classes?: Item[];
  assignments?: Item[];
};

type ClassResponse = {
  classes?: Item[];
};

type MessageResponse = {
  messages?: Item[];
};

type ReportsResponse = {
  summary?: Item;
  classPerformance?: Item[];
};

type FacultyData = {
  classes: Item[];
  sessions: Item[];
  assignments: Item[];
  messages: Item[];
  performance: Item[];
  reportSummary: Item;
};

const initialData: FacultyData = {
  classes: [],
  sessions: [],
  assignments: [],
  messages: [],
  performance: [],
  reportSummary: {},
};

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function fmtDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "Not set";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
}

function fmtTime(value: unknown): string {
  if (typeof value !== "string") return "";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
}

function sessionDate(item: Item): Date | null {
  const value = str(item.startAt);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function getJSON<T>(url: string): Promise<T> {
  const result = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  const data = await result.json();

  if (!result.ok) {
    throw new Error(data.error || "Unable to load faculty records.");
  }

  return data as T;
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="fp-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="fp-empty">{children}</p>;
}

function Stat({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="fp-card">
      <p className="fp-stat-label">{label}</p>
      <p className="fp-stat-value">{value}</p>
      {subtitle && <p className="fp-muted">{subtitle}</p>}
    </div>
  );
}

const screens: Record<FacultyScreen, { title: string; subtitle: string }> = {
  timetable: {
    title: "Timetable",
    subtitle: "Your class schedule",
  },
  batches: {
    title: "Batches",
    subtitle: "Students and batch performance",
  },
  review: {
    title: "Review",
    subtitle: "Review assignment submissions",
  },
  tests: {
    title: "Tests",
    subtitle: "Create, schedule and check results",
  },
  doubts: {
    title: "Doubts",
    subtitle: "Reply to student questions",
  },
  projects: {
    title: "Projects",
    subtitle: "Project work in your batches",
  },
  leave: {
    title: "Leave",
    subtitle: "Leave balance and requests",
  },
  payslips: {
    title: "Payslips",
    subtitle: "Your salary records",
  },
};

export default function FacultyReferenceScreen({
  screen,
}: {
  screen: FacultyScreen;
}) {
  const [data, setData] = useState<FacultyData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [week, setWeek] = useState(0);
  const [calendarMode, setCalendarMode] = useState<"week" | "month">("week");
  const [classId, setClassId] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("All");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let next: FacultyData = { ...initialData };

      if (screen === "timetable") {
        const response = await getJSON<ScheduleResponse>("/api/faculty/schedule");
        next.classes = response.classes || [];
        next.sessions = response.sessions || [];
      }

      if (screen === "batches") {
        const [classes, reports] = await Promise.all([
          getJSON<ClassResponse>("/api/faculty/classes"),
          getJSON<ReportsResponse>("/api/faculty/reports"),
        ]);
        next.classes = classes.classes || [];
        next.performance = reports.classPerformance || [];
        next.reportSummary = reports.summary || {};
      }

      if (screen === "review" || screen === "projects") {
        const response = await getJSON<AssignmentResponse>("/api/faculty/assignments");
        next.classes = response.classes || [];
        next.assignments = response.assignments || [];
      }

      if (screen === "doubts") {
        const response = await getJSON<MessageResponse>("/api/faculty/messages");
        next.messages = response.messages || [];
      }

      if (screen === "tests") {
        const response = await getJSON<ClassResponse>("/api/faculty/classes");
        next.classes = response.classes || [];
      }

      setData(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [screen]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentClass = classId || str(data.classes[0]?.id);

  const selectedBatch =
    data.classes.find((item) => str(item.id) === currentClass) ||
    data.classes[0];

  const batchPerformance =
    data.performance.find((item) => str(item.id) === currentClass);

  const assignments = data.assignments.filter(
    (item) => !currentClass || str(item.classId) === currentClass
  );

  const activeAssignment =
    assignments.find((item) => str(item.id) === selectedAssignment) ||
    assignments[0];

  const studentMessages = data.messages.filter(
    (item) => str(item.senderRole) === "student"
  );

  const activeMessage =
    studentMessages.find((item) => str(item.id) === selectedMessage) ||
    studentMessages[0];

  const calendarDates = useMemo(() => {
    const monday = new Date();
    const index = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - index + week * 7);
    monday.setHours(0, 0, 0, 0);

    return Array.from(
      { length: calendarMode === "week" ? 7 : 28 },
      (_, offset) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + offset);
        return date;
      }
    );
  }, [week, calendarMode]);

  async function sendReply() {
    if (!activeMessage || !reply.trim()) return;

    const recipientId = str(activeMessage.senderId);
    if (!recipientId) {
      setError("This message has no valid student sender.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await fetch("/api/faculty/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          subject: "Re: " + (str(activeMessage.subject) || "Student question"),
          body: reply.trim(),
        }),
      }).then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Unable to send reply.");
        }
      });

      setReply("");
      await load();
      window.alert("Reply sent.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send reply.");
    } finally {
      setSending(false);
    }
  }

  const reference = screens[screen];

  return (
    <div className="faculty-page">
      <div className="fp-top">
        <div>
          <h1>{reference.title}</h1>
          <p className="fp-muted">{reference.subtitle}</p>
        </div>

        <button type="button" onClick={() => void load()} className="fp-btn">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="fp-card">
          <Empty>Loading faculty records...</Empty>
        </div>
      ) : (
        <>
          {screen === "timetable" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="fp-muted">
                    {fmtDate(calendarDates[0]?.toISOString())} to{" "}
                    {fmtDate(calendarDates[calendarDates.length - 1]?.toISOString())}
                    {" · "}{data.sessions.length} scheduled sessions
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="fp-pill fp-red">Full-Stack</span>
                    <span className="fp-pill fp-yellow">Python</span>
                    <span className="fp-pill fp-green">Doubt clinic</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="fp-tabs">
                    <button
                      type="button"
                      className="fp-tab"
                      aria-pressed={calendarMode === "week"}
                      onClick={() => setCalendarMode("week")}
                    >
                      Week
                    </button>
                    <button
                      type="button"
                      className="fp-tab"
                      aria-pressed={calendarMode === "month"}
                      onClick={() => setCalendarMode("month")}
                    >
                      Month
                    </button>
                  </div>

                  <button type="button" onClick={() => setWeek((w) => w - 1)} className="fp-btn" aria-label="Previous">
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" onClick={() => setWeek((w) => w + 1)} className="fp-btn" aria-label="Next">
                    <ChevronRight size={16} />
                  </button>

                  <Link href="/faculty/schedule" className="fp-btn">
                    Manage timetable
                  </Link>
                </div>
              </div>

              <Panel title="">
                <div className="fp-week">
                  {calendarDates.map((day) => {
                    const daySessions = data.sessions.filter(
                      (session) =>
                        sessionDate(session)?.toDateString() === day.toDateString()
                    );

                    const isToday =
                      day.toDateString() === new Date().toDateString();

                    return (
                      <div key={day.toISOString()}>
                        <div className={"fp-date " + (isToday ? "fp-today" : "")}>
                          {day.toLocaleDateString("en-IN", { weekday: "short" })}{" "}
                          {day.getDate()}
                          {isToday ? " · Today" : ""}
                        </div>

                        {daySessions.map((session, index) => (
                          <Link
                            key={str(session.id) || index}
                            href="/faculty/schedule"
                            className="fp-session"
                          >
                            <strong>{fmtTime(session.startAt)} – {fmtTime(session.endAt)}</strong>
                            <span className="block">{str(session.title) || "Class"}</span>
                            <span className="block opacity-70">{str(session.location) || str(session.mode)}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {!data.sessions.length && (
                  <p className="fp-muted mt-4">No classes have been scheduled yet.</p>
                )}
              </Panel>
            </>
          )}

          {screen === "batches" && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
                <div className="fp-tabs">
                  {data.classes.map((item) => (
                    <button
                      key={str(item.id)}
                      type="button"
                      className="fp-tab"
                      aria-pressed={currentClass === str(item.id)}
                      onClick={() => setClassId(str(item.id))}
                    >
                      {str(item.name) || "Batch"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fp-grid fp-four mb-5">
                <Stat label="Students" value={num(selectedBatch?.enrolledStudents)} />
                <Stat label="Syllabus" value="—" subtitle="Module tracking not linked" />
                <Stat
                  label="Attendance"
                  value={
                    typeof batchPerformance?.attendanceRate === "number"
                      ? `${batchPerformance.attendanceRate}%`
                      : "—"
                  }
                />
                <Stat
                  label="Avg test"
                  value={
                    typeof batchPerformance?.averageGrade === "number"
                      ? `${batchPerformance.averageGrade}%`
                      : "—"
                  }
                  subtitle="Based on graded assignments"
                />
              </div>

              <Panel
                title="Students"
                action={
                  <div className="flex gap-2">
                    <Link href="/faculty/messages" className="fp-btn">
                      Message batch
                    </Link>
                    <Link href="/faculty/students" className="fp-btn">
                      View students
                    </Link>
                  </div>
                }
              >
                {selectedBatch ? (
                  <div className="fp-table-wrap">
                    <table className="fp-table">
                      <thead>
                        <tr>
                          <th>Batch</th>
                          <th>Students</th>
                          <th>Attendance</th>
                          <th>Avg grade</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{str(selectedBatch.name)}</strong></td>
                          <td>{num(selectedBatch.enrolledStudents)}</td>
                          <td>
                            {typeof batchPerformance?.attendanceRate === "number"
                              ? `${batchPerformance.attendanceRate}%`
                              : "—"}
                          </td>
                          <td>
                            {typeof batchPerformance?.averageGrade === "number"
                              ? `${batchPerformance.averageGrade}%`
                              : "—"}
                          </td>
                          <td>
                            <Link className="font-bold text-[#9c1235] underline" href="/faculty/students">
                              Open
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : <Empty>No batches assigned to your account.</Empty>}
              </Panel>
            </>
          )}

          {screen === "review" && (
            <>
              <div className="mb-4 flex justify-end gap-2">
                <Link href="/faculty/assignments" className="fp-btn">
                  Assignment manager
                </Link>
              </div>

              <div className="fp-grid fp-split">
                <Panel title="Assignments to review">
                  {data.assignments.length ? (
                    data.assignments.map((item) => (
                      <button
                        key={str(item.id)}
                        type="button"
                        onClick={() => {
                          setClassId(str(item.classId));
                          setSelectedAssignment(str(item.id));
                        }}
                        className={
                          "block w-full border-b px-3 py-4 text-left text-xs last:border-0 " +
                          (activeAssignment?.id === item.id ? "bg-[#fff7ec]" : "hover:bg-[#fbf7f3]")
                        }
                      >
                        <p className="font-bold">{str(item.title)}</p>
                        <p className="fp-muted">{str(item.className)}</p>
                        <span className="fp-pill fp-yellow mt-2">
                          {num(item.pendingReviews)} pending
                        </span>
                      </button>
                    ))
                  ) : <Empty>No assignments are available to review.</Empty>}
                </Panel>

                <Panel title={str(activeAssignment?.title) || "Submission review"}>
                  {activeAssignment ? (
                    <>
                      <p className="fp-muted">
                        {str(activeAssignment.className)} · {num(activeAssignment.pendingReviews)} pending reviews
                      </p>

                      <div className="mt-5 rounded-lg bg-[#f8f4ee] p-4 text-xs leading-6">
                        Choose an assignment below to open its submissions,
                        inspect the student's work, enter feedback and publish final marks.
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link href="/faculty/assignments" className="fp-btn fp-btn-red">
                          Open grading workflow <ArrowRight size={14} />
                        </Link>
                      </div>
                    </>
                  ) : <Empty>Choose an assignment to review.</Empty>}

                  <p className="fp-muted mt-5">
                    Grading continues through your existing secure assignment API.
                    Published grades cannot be edited.
                  </p>
                </Panel>
              </div>
            </>
          )}

          {screen === "tests" && (
            <>
              <div className="mb-4 flex justify-end gap-2">
                <div className="fp-tabs">
                  {["All", "Scheduled", "Drafts", "Done"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="fp-tab"
                      aria-pressed={tab === value}
                      onClick={() => setTab(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <Panel title="My tests">
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Batch</th>
                        <th>When</th>
                        <th>Questions</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  </table>
                </div>

                <Empty>
                  No tests in the selected category.
                  The dedicated Faculty test creation and grading API has not been built.
                </Empty>
              </Panel>

              <div className="fp-grid fp-four mt-5">
                <Stat label="Last test average" value="—" />
                <Stat label="Highest" value="—" />
                <Stat label="Lowest" value="—" />
                <Stat label="Took the test" value="—" />
              </div>

              <div className="mt-5">
                <Panel title="Hardest questions">
                  <Empty>Question-level results will appear after tests are implemented.</Empty>
                </Panel>
              </div>
            </>
          )}

          {screen === "doubts" && (
            <div className="fp-grid fp-split">
              <Panel title="Student questions">
                {studentMessages.length ? studentMessages.map((item) => (
                  <button
                    key={str(item.id)}
                    type="button"
                    onClick={() => {
                      setSelectedMessage(str(item.id));
                      setReply("");
                    }}
                    className={
                      "block w-full border-b px-3 py-4 text-left last:border-0 " +
                      (activeMessage?.id === item.id ? "bg-[#fff7ec]" : "hover:bg-[#faf6f2]")
                    }
                  >
                    <p className="text-xs font-bold">
                      {str(item.subject) || "Student question"}
                    </p>
                    <p className="fp-muted">{str(item.senderName)}</p>
                    <p className="fp-muted">{fmtDate(item.createdAt)}</p>
                  </button>
                )) : <Empty>No student questions received yet.</Empty>}
              </Panel>

              <Panel title={str(activeMessage?.subject) || "Question details"}>
                {activeMessage ? (
                  <>
                    <p className="fp-muted">{str(activeMessage.senderName)}</p>

                    <div className="mt-4 whitespace-pre-wrap rounded-xl bg-[#f1e8e1] p-4 text-xs leading-6">
                      {str(activeMessage.body)}
                    </div>

                    <label className="mt-5 block text-xs font-bold">
                      Reply
                      <textarea
                        className="fp-input"
                        rows={6}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your reply..."
                      />
                    </label>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={sending || !reply.trim()}
                        onClick={() => void sendReply()}
                        className="fp-btn fp-btn-red"
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </>
                ) : (
                  <Empty>Select a student message to reply.</Empty>
                )}

                <p className="fp-muted mt-5">
                  Replies use your existing Faculty Messages API.
                  A dedicated doubt-resolution status system is not yet available.
                </p>
              </Panel>
            </div>
          )}

          {screen === "projects" && (
            <>
              <div className="mb-4 flex justify-end">
                <Link href="/faculty/assignments" className="fp-btn fp-btn-red">
                  New project assignment
                </Link>
              </div>

              <Panel
                title="Project teams / assignments"
                action={
                  <div className="fp-tabs">
                    {data.classes.map((item) => (
                      <button
                        key={str(item.id)}
                        type="button"
                        className="fp-tab"
                        aria-pressed={currentClass === str(item.id)}
                        onClick={() => setClassId(str(item.id))}
                      >
                        {str(item.name)}
                      </button>
                    ))}
                  </div>
                }
              >
                {assignments.length ? (
                  <div className="fp-table-wrap">
                    <table className="fp-table">
                      <thead>
                        <tr>
                          <th>Project / assignment</th>
                          <th>Batch</th>
                          <th>Submissions</th>
                          <th>Pending review</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((item) => (
                          <tr key={str(item.id)}>
                            <td><strong>{str(item.title)}</strong></td>
                            <td>{str(item.className)}</td>
                            <td>{num(item.submissionCount)}</td>
                            <td>{num(item.pendingReviews)}</td>
                            <td>
                              <Link
                                href="/faculty/assignments"
                                className="font-bold text-[#ad123d] underline"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <Empty>No project assignments found for this batch.</Empty>}

                <p className="fp-muted mt-4">
                  This screen displays real assignments. Team-based milestones,
                  project allocations and review dates require a separate project API.
                </p>
              </Panel>
            </>
          )}

          {screen === "leave" && (
            <>
              <div className="fp-grid fp-four mb-5">
                <Stat label="Casual balance" value="—" />
                <Stat label="Sick balance" value="—" />
                <Stat label="Earned days" value="—" />
                <Stat label="Pending requests" value="—" />
              </div>

              <div className="fp-grid fp-two">
                <Panel title="Apply">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-bold">
                      Type
                      <select className="fp-input" disabled>
                        <option>Casual</option>
                        <option>Sick</option>
                        <option>Earned</option>
                      </select>
                    </label>

                    <label className="text-xs font-bold">
                      Who takes my class
                      <select className="fp-input" disabled>
                        <option>Not assigned</option>
                      </select>
                    </label>

                    <label className="text-xs font-bold">
                      From
                      <input type="date" className="fp-input" disabled />
                    </label>

                    <label className="text-xs font-bold">
                      To
                      <input type="date" className="fp-input" disabled />
                    </label>
                  </div>

                  <label className="mt-4 block text-xs font-bold">
                    Reason
                    <textarea
                      rows={4}
                      className="fp-input"
                      placeholder="Reason for leave"
                      disabled
                    />
                  </label>

                  <button type="button" disabled className="fp-btn fp-btn-red mt-4">
                    Apply
                  </button>

                  <p className="fp-muted mt-3">
                    Applications will be enabled after Admin leave approvals,
                    entitlement balances and substitute rules are connected.
                  </p>
                </Panel>

                <Panel title="History">
                  <Empty>No approved leave history or balances are connected yet.</Empty>
                </Panel>
              </div>
            </>
          )}

          {screen === "payslips" && (
            <div className="fp-grid fp-split">
              <Panel title="Months">
                <Empty>No payslips have been issued to your account yet.</Empty>
              </Panel>

              <Panel
                title="Payslip details"
                action={
                  <button type="button" className="fp-btn fp-btn-red" disabled>
                    <Download size={15} /> Download PDF
                  </button>
                }
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-4 text-xs font-bold">Earnings</p>
                    <div className="border-b py-3 text-xs">Basic —</div>
                    <div className="border-b py-3 text-xs">HRA —</div>
                    <div className="border-b py-3 text-xs">Incentives —</div>
                  </div>

                  <div>
                    <p className="mb-4 text-xs font-bold">Deductions</p>
                    <div className="border-b py-3 text-xs">PF —</div>
                    <div className="border-b py-3 text-xs">Professional tax —</div>
                    <div className="border-b py-3 text-xs">TDS —</div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-[#390c19] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Net pay</span>
                    <strong className="text-xl text-[#f6c44f]">—</strong>
                  </div>
                </div>

                <p className="fp-muted mt-4">
                  Salary figures and PDF downloads require verified payroll
                  records from Admin. No example amounts are displayed.
                </p>
              </Panel>
            </div>
          )}
        </>
      )}
    </div>
  );
}