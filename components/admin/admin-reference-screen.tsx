"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";

type Row = Record<string, unknown>;
type Screen =
  | "reports"
  | "students"
  | "courses"
  | "tests"
  | "leads"
  | "fees"
  | "placement"
  | "staff"
  | "payroll"
  | "notices";

type ViewData = {
  rows: Row[];
  other: Row[];
  stats: Row;
};

const descriptions: Record<Screen, string> = {
  reports: "Download reports and review institute performance",
  students: "Manage registered students and student accounts",
  courses: "Programs, batches and enrolled students",
  tests: "Exam calendar, results and mark changes",
  leads: "Lead pipeline and admissions follow-ups",
  fees: "Collections, dues and fee management",
  placement: "Drives, offers and hiring partners",
  staff: "Faculty and staff directory",
  payroll: "Payroll preparation and employee records",
  notices: "Compose announcements for the institute",
};

const endpoints: Partial<Record<Screen, string>> = {
  reports: "/api/admin/reports",
  students: "/api/admin/users",
  courses: "/api/admin/catalog/classes?limit=100",
  tests: "/api/admin/director/tests",
  leads: "/api/admin/director/leads",
  fees: "/api/admin/director/overview",
  placement: "/api/admin/director/placement",
  staff: "/api/admin/director/payroll",
  payroll: "/api/admin/director/payroll",
  notices: "/api/admin/director/notices",
};

const blank: ViewData = {
  rows: [],
  other: [],
  stats: {},
};

function string(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function number(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function money(value: unknown): string {
  if (typeof value !== "number") return "â€”";
  return "â‚¹" + value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function date(value: unknown): string {
  const raw = string(value);
  if (!raw) return "â€”";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Cell({
  children,
}: {
  children: ReactNode;
}) {
  return <td>{children}</td>;
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="ad-table-scroll">
      <table className="ad-table">
        <thead>
          <tr>
            {headers.map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, index) => (
            <tr key={index}>
              {cells.map((cell, position) => (
                <Cell key={position}>{cell}</Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {!rows.length && (
        <p className="ad-empty">No matching records are available.</p>
      )}
    </div>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="ad-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="ad-card">
      <div className="ad-label">{label}</div>
      <div className="ad-value">{value}</div>
      {note && <p className="ad-sub">{note}</p>}
    </div>
  );
}

function Action({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link href={href} className={"ad-btn " + (primary ? "ad-red" : "")}>
      {children}
    </Link>
  );
}

export default function AdminReferenceScreen({
  screen,
}: {
  screen: Screen;
}) {
  const [data, setData] = useState<ViewData>(blank);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeAudience, setNoticeAudience] = useState("All students");
  const [company, setCompany] = useState("");
  const [roles, setRoles] = useState("");
  const [driveDate, setDriveDate] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testBatch, setTestBatch] = useState("");
  const [testCourse, setTestCourse] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const url = endpoints[screen];

      if (!url) throw new Error("Data source unavailable.");

      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });

      const result: Record<string, unknown> = await response.json();

      if (!response.ok) {
        throw new Error(string(result.error) || "Unable to load records.");
      }

      const firstRows =
        result.records ||
        result.users ||
        result.classes ||
        result.fees ||
        result.students ||
        [];

      const reportStats: Row = {
        ...(result.stats && typeof result.stats === "object"
          ? result.stats as Row
          : {}),
        ...(result.counts && typeof result.counts === "object"
          ? result.counts as Row
          : {}),
      };

      const normalized = Array.isArray(firstRows)
        ? firstRows as Row[]
        : [];

      const secondRows = Array.isArray(result.recentUsers)
        ? result.recentUsers as Row[]
        : [];

      setData({
        rows: normalized,
        other: secondRows,
        stats: screen === "reports" ? result : reportStats,
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load records."
      );
    } finally {
      setLoading(false);
    }
  }, [screen]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredRows = useMemo(() => {
    if (filter === "all") return data.rows;

    return data.rows.filter((item) => {
      const status = string(item.status).toLowerCase();
      const role = string(item.role).toLowerCase();
      return status === filter || role === filter;
    });
  }, [data.rows, filter]);

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let resource = "";
    let body: Record<string, unknown> = {};

    if (screen === "notices") {
      resource = "notices";
      body = {
        title: noticeTitle,
        message: noticeBody,
        audience: noticeAudience,
        pinToTop: false,
      };
    } else if (screen === "placement") {
      resource = "placement";
      body = {
        company,
        roles,
        driveDate,
      };
    } else if (screen === "tests") {
      resource = "tests";
      body = {
        title: testTitle,
        examDate: testDate,
        batch: testBatch,
        course: testCourse,
      };
    } else {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/director/" + resource, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save record.");
      }

      setFormOpen(false);
      setNoticeTitle("");
      setNoticeBody("");
      setCompany("");
      setRoles("");
      setDriveDate("");
      setTestTitle("");
      setTestDate("");
      setTestBatch("");
      setTestCourse("");

      await load();

      window.alert(
        resource === "notices"
          ? "Notice draft saved. It has not been sent."
          : "Record created successfully."
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save record."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeStudents = data.rows.filter(
    (item) => item.role === "student" && item.status === "active"
  );

  const facultyAndStaff = data.rows.filter(
    (item) => item.role === "faculty" || item.role === "staff"
  );

  const reports = [
    ["Admissions", "Leads, demos, admissions and conversion", "/admin/admissions"],
    ["Fees", "Collected, due, late, refunds and GST", "/admin/fees"],
    ["Attendance", "By student, batch and course", "/admin/classes"],
    ["Tests", "Scores, ranks and weak topics", "/admin/tests"],
    ["Faculty", "Classes, syllabus and teaching", "/admin/faculty"],
    ["Counsellors", "Calls, follow-ups and targets", "/admin/leads"],
    ["Placement", "Drives, offers and placed students", "/admin/placement"],
    ["Payroll", "Salary, deductions and staff cost", "/admin/payroll"],
  ];

  return (
    <div className="admin-screen">
      <div className="ad-top">
        <div>
          <h1>{screen.charAt(0).toUpperCase() + screen.slice(1)}</h1>
          <p className="ad-sub">{descriptions[screen]}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(screen === "tests" || screen === "placement" || screen === "notices") && (
            <button
              type="button"
              onClick={() => setFormOpen((old) => !old)}
              className="ad-btn ad-red"
            >
              <Plus size={14} />
              {screen === "tests"
                ? "New test"
                : screen === "placement"
                  ? "New drive"
                  : "New notice"}
            </button>
          )}

          {screen === "students" && (
            <Action href="/admin/management/students" primary>Add student</Action>
          )}

          {screen === "staff" && (
            <Action href="/admin/management/staff" primary>Add staff</Action>
          )}

          {screen === "courses" && (
            <>
              <Action href="/admin/classes">New batch</Action>
              <Action href="/admin/programs" primary>New course</Action>
            </>
          )}

          {screen === "fees" && (
            <Action href="/admin/management/fees">Fee management</Action>
          )}

          <button type="button" className="ad-btn" onClick={() => void load()}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="ad-card">
          <p className="ad-empty">Loading Admin records...</p>
        </div>
      ) : (
        <>
          {screen === "reports" && (
            <>
              <div className="ad-grid ad-four">
                {reports.map(([name, description, href]) => (
                  <div key={name} className="ad-card">
                    <h2>{name}</h2>
                    <p className="ad-muted mt-3 min-h-12">{description}</p>
                    <div className="mt-4 flex gap-2">
                      <Action href={href}>View</Action>
                      <button
                        type="button"
                        disabled
                        title="Excel export is not connected for this report."
                        className="ad-btn"
                      >
                        Excel
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Card title="Sent by email">
                  <p className="ad-muted">
                    Scheduled delivery requires a report scheduler and configured email service.
                    No automated report emails are currently enabled.
                  </p>
                  <div className="mt-4 border-t border-[#eee5df] py-4 text-xs">
                    Weekly summary <span className="ad-pill float-right">Not configured</span>
                  </div>
                  <div className="border-t border-[#eee5df] py-4 text-xs">
                    Daily fee collection <span className="ad-pill float-right">Not configured</span>
                  </div>
                  <div className="border-t border-[#eee5df] py-4 text-xs">
                    Monthly placement report <span className="ad-pill float-right">Not configured</span>
                  </div>
                </Card>
              </div>
            </>
          )}

          {screen === "students" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Active" value={activeStudents.length} />
                <Stat label="Accounts loaded" value={data.rows.length} />
                <Stat label="At risk" value="â€”" note="Academic risk model not connected" />
                <Stat label="Left this year" value="â€”" />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <button className="ad-btn" type="button" onClick={() => setFilter("all")}>All</button>
                <button className="ad-btn" type="button" onClick={() => setFilter("active")}>Active</button>
                <button className="ad-btn" type="button" onClick={() => setFilter("pending")}>Pending</button>
                <Action href="/admin/management/students">Manage accounts</Action>
              </div>

              <Card title="Student directory">
                <Table
                  headers={["Name", "Email", "Program", "Class", "Status", "Action"]}
                  rows={filteredRows
                    .filter((item) => item.role === "student")
                    .map((item) => [
                      <strong key="name">{string(item.name)}</strong>,
                      string(item.email),
                      string(item.program) || "â€”",
                      string(item.currentClass) || "â€”",
                      <span key="status" className="ad-pill ad-green">{string(item.status)}</span>,
                      <Action key="action" href="/admin/management/students">Open</Action>,
                    ])}
                />
              </Card>
            </>
          )}

          {screen === "courses" && (
            <Card title="Course batches">
              <Table
                headers={["Course / batch", "Program", "Capacity", "Status", "Action"]}
                rows={data.rows.map((item) => {
                  const details =
                    item.data && typeof item.data === "object"
                      ? item.data as Row
                      : item;

                  return [
                    <strong key="name">{string(details.name) || "Class"}</strong>,
                    string(details.program) || "â€”",
                    string(details.capacity) || "â€”",
                    <span key="status" className="ad-pill ad-green">
                      {string(item.status) || "Active"}
                    </span>,
                    <Action key="action" href="/admin/classes">Open</Action>,
                  ];
                })}
              />
              <p className="ad-muted mt-4">
                Course creation and batch enrollment remain available through the
                existing Programs and Classes management screens.
              </p>
            </Card>
          )}

          {screen === "tests" && (
            <>
              <div className="ad-grid ad-two mb-5">
                <Card title="This week">
                  {data.rows.length ? data.rows.slice(0, 8).map((item, index) => (
                    <div key={string(item.id) || index} className="border-b border-[#f1e9e4] py-3 last:border-0">
                      <p className="text-xs font-bold">{string(item.title)}</p>
                      <p className="ad-muted">
                        {string(item.batch)} Â· {date(item.examDate)} Â· {string(item.faculty)}
                      </p>
                    </div>
                  )) : <p className="ad-empty">No scheduled tests.</p>}
                </Card>

                <Card title="Mark changes to approve">
                  <p className="ad-empty">
                    No verified mark-change requests are available.
                    An audited assessment approval API is required.
                  </p>
                </Card>
              </div>

              <Card title="Average score by course, last 30 days">
                <p className="ad-empty">
                  Assessment results are not yet connected to this Admin dashboard.
                </p>
              </Card>
            </>
          )}

          {screen === "leads" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Leads loaded" value={data.rows.length} />
                <Stat
                  label="Not contacted"
                  value={data.rows.filter((r) => string(r.stage).toLowerCase().includes("new")).length}
                />
                <Stat
                  label="Demos"
                  value={data.rows.filter((r) => string(r.stage).toLowerCase().includes("demo")).length}
                />
                <Stat label="Conversion" value="â€”" note="Requires linked admissions" />
              </div>

              <div className="ad-grid ad-split">
                <Card title="By source">
                  {Array.from(new Set(data.rows.map((item) => string(item.source) || "Other"))).map((source) => {
                    const count = data.rows.filter(
                      (item) => (string(item.source) || "Other") === source
                    ).length;

                    return (
                      <div key={source} className="flex justify-between border-b border-[#efe7e1] py-4 text-xs">
                        <strong>{source}</strong>
                        <span>{count} leads</span>
                      </div>
                    );
                  })}

                  {!data.rows.length && <p className="ad-empty">No leads found.</p>}
                </Card>

                <Card title="Latest enquiries">
                  {data.rows.slice(0, 8).map((item, index) => (
                    <div key={string(item.id) || index} className="border-b border-[#f0e7e1] py-3 last:border-0">
                      <p className="text-xs font-bold">{string(item.name) || "Lead"}</p>
                      <p className="ad-muted">{string(item.course)} Â· {string(item.stage)}</p>
                    </div>
                  ))}
                  <p className="ad-muted mt-4">
                    Assignment and target-setting actions require an authorized Staff lead-management API.
                  </p>
                </Card>
              </div>
            </>
          )}

          {screen === "fees" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Collected" value={money(data.stats.collected)} />
                <Stat label="Outstanding" value={money(data.stats.outstanding)} />
                <Stat label="Over 15 days late" value={money(data.stats.overdue15)} />
                <Stat label="Students overdue" value={number(data.stats.overdueStudents)} />
              </div>

              <div className="ad-grid ad-two">
                <Card title="Waiting for approval">
                  <p className="ad-empty">
                    Discount, refund and installment-change approvals require a dedicated audited workflow.
                  </p>
                  <Action href="/admin/management/fees">Manage fees</Action>
                </Card>

                <Card title="Outstanding balances">
                  <p className="ad-muted">
                    Outstanding totals are calculated from recorded fee invoices.
                  </p>
                  <div className="mt-5 flex justify-between border-b py-3 text-xs">
                    <span>Total outstanding</span>
                    <strong>{money(data.stats.outstanding)}</strong>
                  </div>
                  <div className="flex justify-between border-b py-3 text-xs">
                    <span>Overdue more than 15 days</span>
                    <strong>{money(data.stats.overdue15)}</strong>
                  </div>
                  <Action href="/admin/management/fees">Open fee collection</Action>
                </Card>
              </div>
            </>
          )}

          {screen === "placement" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Drives recorded" value={data.rows.length} />
                <Stat
                  label="Open drives"
                  value={data.rows.filter((r) => string(r.status) === "open").length}
                />
                <Stat label="Placed, last 6 months" value="â€”" />
                <Stat label="Hiring partners" value="â€”" note="Partner registry not connected" />
              </div>

              <Card title="Drives">
                <Table
                  headers={["Date", "Company", "Roles", "Status"]}
                  rows={data.rows.map((item) => [
                    date(item.driveDate),
                    <strong key="company">{string(item.company)}</strong>,
                    string(item.roles),
                    <span key="status" className="ad-pill ad-yellow">{string(item.status) || "Open"}</span>,
                  ])}
                />
              </Card>
            </>
          )}

          {screen === "staff" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Active employees loaded" value={data.rows.length} />
                <Stat label="Faculty" value={data.rows.filter((r) => r.role === "faculty").length} />
                <Stat label="Staff" value={data.rows.filter((r) => r.role === "staff").length} />
                <Stat label="Leave requests" value="â€”" />
              </div>

              <div className="mb-4 flex gap-2">
                {["all", "faculty", "staff"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="ad-btn"
                    onClick={() => setFilter(value)}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>

              <Card title="Staff directory">
                <Table
                  headers={["Name", "Role", "Email", "Action"]}
                  rows={filteredRows.map((item) => [
                    <strong key="name">{string(item.name)}</strong>,
                    string(item.role),
                    string(item.email),
                    <Action key="action" href={item.role === "faculty" ? "/admin/faculty" : "/admin/staff"}>
                      Open
                    </Action>,
                  ])}
                />
              </Card>
            </>
          )}

          {screen === "payroll" && (
            <>
              <div className="ad-grid ad-four mb-5">
                <Stat label="Employees" value={data.rows.length} />
                <Stat label="Gross" value="â€”" />
                <Stat label="Deductions" value="â€”" />
                <Stat label="Net pay" value="â€”" />
              </div>

              <Card title="Steps">
                <div className="flex flex-wrap gap-2">
                  {[
                    "1 Â· Attendance locked",
                    "2 Â· Incentives added",
                    "3 Â· Review",
                    "4 Â· Approve",
                    "5 Â· Pay and send slips",
                  ].map((step) => (
                    <span key={step} className="ad-pill">{step}</span>
                  ))}
                </div>
                <p className="ad-muted mt-4">
                  These steps are a visual reference only. Actual payroll processing,
                  approvals, payments and payslip generation are not yet connected.
                </p>
              </Card>

              <div className="mt-5">
                <Card title="Employee roster">
                  <Table
                    headers={["Name", "Role", "Gross", "Deductions", "Net"]}
                    rows={data.rows.map((item) => [
                      <strong key="name">{string(item.name)}</strong>,
                      string(item.role),
                      "â€”",
                      "â€”",
                      "â€”",
                    ])}
                  />
                </Card>
              </div>
            </>
          )}

          {screen === "notices" && (
            <div className="ad-grid ad-two">
              <Card title="New notice">
                <form onSubmit={(event) => void createRecord(event)} className="space-y-4">
                  <label className="block text-xs font-bold">
                    Title
                    <input
                      required
                      maxLength={300}
                      className="ad-input"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="Notice title"
                    />
                  </label>

                  <label className="block text-xs font-bold">
                    Message
                    <textarea
                      required
                      rows={6}
                      maxLength={2000}
                      className="ad-input"
                      value={noticeBody}
                      onChange={(e) => setNoticeBody(e.target.value)}
                      placeholder="Notice content"
                    />
                  </label>

                  <label className="block text-xs font-bold">
                    Send to
                    <select
                      className="ad-input"
                      value={noticeAudience}
                      onChange={(e) => setNoticeAudience(e.target.value)}
                    >
                      <option>All students</option>
                      <option>Faculty</option>
                      <option>Staff</option>
                      <option>Everyone</option>
                    </select>
                  </label>

                  <p className="ad-muted">
                    This form saves a notice draft only. App notifications,
                    WhatsApp and email delivery are not connected yet.
                  </p>

                  <button type="submit" disabled={saving} className="ad-btn ad-red">
                    {saving ? "Saving..." : "Save draft"}
                  </button>
                </form>
              </Card>

              <Card title="Saved drafts">
                <Table
                  headers={["Notice", "Audience", "Created"]}
                  rows={data.rows.map((item) => [
                    <strong key="title">{string(item.title)}</strong>,
                    string(item.audience),
                    date(item.createdAt),
                  ])}
                />
                <p className="ad-muted mt-4">
                  These records have not been delivered to recipients.
                </p>
              </Card>
            </div>
          )}

          {formOpen && screen !== "notices" && (
            <div className="mt-5">
              <Card title={screen === "tests" ? "New test" : "New placement drive"}>
                <form
                  onSubmit={(event) => void createRecord(event)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {screen === "tests" ? (
                    <>
                      <label className="text-xs font-bold">
                        Test name
                        <input required className="ad-input" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
                      </label>
                      <label className="text-xs font-bold">
                        Date
                        <input required type="date" className="ad-input" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
                      </label>
                      <label className="text-xs font-bold">
                        Batch
                        <input className="ad-input" value={testBatch} onChange={(e) => setTestBatch(e.target.value)} />
                      </label>
                      <label className="text-xs font-bold">
                        Course
                        <input className="ad-input" value={testCourse} onChange={(e) => setTestCourse(e.target.value)} />
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="text-xs font-bold">
                        Company
                        <input required className="ad-input" value={company} onChange={(e) => setCompany(e.target.value)} />
                      </label>
                      <label className="text-xs font-bold">
                        Roles
                        <input required className="ad-input" value={roles} onChange={(e) => setRoles(e.target.value)} />
                      </label>
                      <label className="text-xs font-bold">
                        Drive date
                        <input required type="date" className="ad-input" value={driveDate} onChange={(e) => setDriveDate(e.target.value)} />
                      </label>
                    </>
                  )}

                  <div className="flex items-end">
                    <button type="submit" disabled={saving} className="ad-btn ad-red">
                      {saving ? "Saving..." : "Save record"}
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}