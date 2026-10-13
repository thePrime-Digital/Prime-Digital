"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import AdminDirectorWorkspace from "@/components/admin/admin-director-workspace";

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

type Row = Record<string, unknown>;
type Payload = Record<string, unknown>;

const titles: Record<Screen, string> = {
  reports: "Reports",
  students: "Students",
  courses: "Courses",
  tests: "Tests",
  leads: "Leads",
  fees: "Fees",
  placement: "Placement",
  staff: "Staff",
  payroll: "Payroll",
  notices: "Notices",
};

const subtitles: Record<Screen, string> = {
  reports: "Download reports and review institute performance",
  students: "All student accounts and enrolments",
  courses: "Programs, batches and course management",
  tests: "Exam calendar, results and mark changes",
  leads: "Lead sources, follow-ups and admissions",
  fees: "Collections, outstanding dues and approvals",
  placement: "Drives, offers and hiring partners",
  staff: "Faculty and staff overview",
  payroll: "Employee roster and payroll preparation",
  notices: "Compose notices and review drafts",
};

const urls: Record<Screen, string> = {
  reports: "/api/admin/reports",
  students: "/api/admin/users",
  courses: "/api/admin/catalog/classes",
  tests: "/api/admin/director/tests",
  leads: "/api/admin/director/leads",
  fees: "/api/admin/director/overview",
  placement: "/api/admin/director/placement",
  staff: "/api/admin/director/payroll",
  payroll: "/api/admin/director/payroll",
  notices: "/api/admin/director/notices",
};

function label(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "—";
}

function money(value: unknown): string {
  if (typeof value !== "number") return "—";
  return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
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
    <section className="af-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({
  title,
  value,
  note,
}: {
  title: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="af-card">
      <p className="af-label">{title}</p>
      <p className="af-value">{value}</p>
      {note && <p className="af-note mt-2">{note}</p>}
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: { title: string; key: string }[];
  rows: Row[];
}) {
  return (
    <div className="af-table-scroll">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.title}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={label(row.id) + index}>
              {columns.map((column) => (
                <td key={column.key}>{label(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {!rows.length && (
        <p className="af-empty">No records available yet.</p>
      )}
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
    <Link href={href} className={"af-btn " + (primary ? "af-btn-red" : "")}>
      {children}
    </Link>
  );
}

export default function AdminFinalScreen({ screen }: { screen: Screen }) {
  const [payload, setPayload] = useState<Payload>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(urls[screen], {
        credentials: "include",
        cache: "no-store",
      });

      const data: Payload = await response.json();

      if (!response.ok) {
        throw new Error(label(data.error));
      }

      setPayload(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [screen]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const candidates = [
      payload.records,
      payload.users,
      payload.classes,
      payload.items,
      payload.data,
    ];

    const selected = candidates.find((value) => Array.isArray(value));
    return (Array.isArray(selected) ? selected : []) as Row[];
  }, [payload]);

  const stats = (
    payload.stats && typeof payload.stats === "object"
      ? payload.stats
      : {}
  ) as Row;

  const filtered = rows.filter((row) =>
    filter === "all" ||
    label(row.role).toLowerCase() === filter ||
    label(row.status).toLowerCase() === filter
  );

  const students = rows.filter((row) => row.role === "student");
  const people = rows.filter((row) =>
    row.role === "faculty" || row.role === "staff"
  );

  const reportCards = [
    ["Admissions", "Leads, demos, admissions, conversion", "/admin/admissions"],
    ["Fees", "Collected, due, late, refunds and GST", "/admin/management/fees"],
    ["Attendance", "By student, batch and course", "/admin/classes"],
    ["Tests", "Scores, ranks, weak topics", "/admin/tests"],
    ["Faculty", "Classes, syllabus, ratings and replies", "/admin/faculty"],
    ["Counsellors", "Calls, follow-ups and targets", "/admin/leads"],
    ["Placement", "Drives, offers and placed students", "/admin/placement"],
    ["Payroll", "Salary, deductions and staff cost", "/admin/payroll"],
  ];

  return (
    <div className="admin-final">
      <div className="af-header">
        <div>
          <h1>{titles[screen]}</h1>
          <p className="af-sub">{subtitles[screen]}</p>
        </div>

        <div className="flex flex-wrap gap-2">
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
            <Action href="/admin/management/fees" primary>Manage fees</Action>
          )}

          {screen === "reports" && (
            <Action href="/admin/management/reports">Detailed reports</Action>
          )}

          <button type="button" className="af-btn" onClick={() => void load()}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="af-card">
          <p className="af-empty">Loading Admin records...</p>
        </div>
      ) : (
        <>
          {screen === "reports" && (
            <>
              <div className="af-grid af-four">
                {reportCards.map(([name, description, href]) => (
                  <div className="af-card" key={name}>
                    <h2>{name}</h2>
                    <p className="af-note mt-3 min-h-12">{description}</p>
                    <div className="mt-4 flex gap-2">
                      <Action href={href}>View</Action>
                      <Action href="/admin/management/reports">Export options</Action>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Panel title="Sent by email">
                  {["Weekly summary", "Daily fee collection", "Monthly placement report"].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-[#eee5df] py-4 text-xs last:border-0">
                      <strong>{item}</strong>
                      <span className="af-pill">Not configured</span>
                    </div>
                  ))}
                  <p className="af-note mt-4">
                    Automated scheduled email delivery needs a separate scheduler and email integration.
                  </p>
                </Panel>
              </div>
            </>
          )}

          {screen === "students" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Student accounts loaded" value={students.length} />
                <Stat title="Active" value={students.filter((r) => r.status === "active").length} />
                <Stat title="At risk" value="—" note="Requires academic risk records" />
                <Stat title="Left this year" value="—" />
              </div>

              <div className="mb-4 flex gap-2">
                {["all", "active", "pending"].map((value) => (
                  <button key={value} type="button" className="af-btn" onClick={() => setFilter(value)}>
                    {value === "all" ? "All statuses" : value}
                  </button>
                ))}
              </div>

              <Panel title="Students" action={<Action href="/admin/management/students">Open management <ArrowRight size={14} /></Action>}>
                <DataTable
                  columns={[
                    { title: "Name", key: "name" },
                    { title: "Email", key: "email" },
                    { title: "Program", key: "program" },
                    { title: "Status", key: "status" },
                  ]}
                  rows={filtered.filter((r) => r.role === "student")}
                />
              </Panel>
            </>
          )}

          {screen === "courses" && (
            <Panel title="Courses and batches" action={<Action href="/admin/management/courses">Course hub</Action>}>
              <DataTable
                columns={[
                  { title: "Course / batch", key: "name" },
                  { title: "Program", key: "program" },
                  { title: "Faculty", key: "faculty" },
                  { title: "Capacity", key: "capacity" },
                  { title: "Status", key: "status" },
                ]}
                rows={rows}
              />
              <p className="af-note mt-4">
                Use Programs and Classes to create and update actual course records.
              </p>
            </Panel>
          )}

          {screen === "tests" && (
            <>
              <div className="af-grid af-two mb-5">
                <Panel title="Exam calendar">
                  <DataTable
                    columns={[
                      { title: "Test", key: "title" },
                      { title: "Batch", key: "batch" },
                      { title: "Date", key: "examDate" },
                    ]}
                    rows={rows}
                  />
                </Panel>

                <Panel title="Mark changes to approve">
                  <p className="af-empty">
                    No audited mark-change workflow is connected yet.
                  </p>
                </Panel>
              </div>

              <Panel title="Average score by course">
                <p className="af-empty">
                  Verified assessment result statistics are not available yet.
                </p>
              </Panel>
            </>
          )}

          {screen === "leads" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Leads loaded" value={rows.length} />
                <Stat title="New" value={rows.filter((r) => r.stage === "new").length} />
                <Stat title="Demos" value={rows.filter((r) => label(r.stage).toLowerCase().includes("demo")).length} />
                <Stat title="Conversion" value="—" />
              </div>

              <div className="af-grid af-two">
                <Panel title="By source">
                  {Array.from(new Set(rows.map((r) => label(r.source)))).map((source) => (
                    <div key={source} className="flex justify-between border-b py-3 text-xs">
                      <strong>{source}</strong>
                      <span>{rows.filter((r) => label(r.source) === source).length} leads</span>
                    </div>
                  ))}
                  {!rows.length && <p className="af-empty">No leads recorded.</p>}
                </Panel>

                <Panel title="Latest enquiries">
                  <DataTable
                    columns={[
                      { title: "Lead", key: "name" },
                      { title: "Course", key: "course" },
                      { title: "Stage", key: "stage" },
                    ]}
                    rows={rows.slice(0, 10)}
                  />
                </Panel>
              </div>
            </>
          )}

          {screen === "fees" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Collected" value={money(stats.collected)} />
                <Stat title="Outstanding" value={money(stats.outstanding)} />
                <Stat title="Over 15 days late" value={money(stats.overdue15)} />
                <Stat title="Overdue students" value={label(stats.overdueStudents)} />
              </div>

              <div className="af-grid af-two">
                <Panel title="Waiting for approval">
                  <p className="af-empty">
                    Refund, discount and installment approval records require a dedicated workflow.
                  </p>
                  <Action href="/admin/management/fees">Open Fees Center</Action>
                </Panel>

                <Panel title="Outstanding balances">
                  <div className="flex justify-between border-b py-4 text-xs">
                    <strong>Total outstanding</strong>
                    <span>{money(stats.outstanding)}</span>
                  </div>
                  <div className="flex justify-between border-b py-4 text-xs">
                    <strong>Late over 15 days</strong>
                    <span>{money(stats.overdue15)}</span>
                  </div>
                  <p className="af-note mt-4">
                    Course-wise dues require linked invoice and enrollment data.
                  </p>
                </Panel>
              </div>
            </>
          )}

          {screen === "placement" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Recorded drives" value={rows.length} />
                <Stat title="Open drives" value={rows.filter((r) => r.status === "open").length} />
                <Stat title="Placed, last 6 months" value="—" />
                <Stat title="Hiring partners" value="—" />
              </div>

              <Panel title="Drives">
                <DataTable
                  columns={[
                    { title: "Date", key: "driveDate" },
                    { title: "Company", key: "company" },
                    { title: "Roles", key: "roles" },
                    { title: "Status", key: "status" },
                  ]}
                  rows={rows}
                />
              </Panel>
            </>
          )}

          {screen === "staff" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Employee records" value={people.length || rows.length} />
                <Stat title="Faculty" value={rows.filter((r) => r.role === "faculty").length} />
                <Stat title="Staff" value={rows.filter((r) => r.role === "staff").length} />
                <Stat title="Leave requests" value="—" />
              </div>

              <div className="mb-4 flex gap-2">
                {["all", "faculty", "staff"].map((value) => (
                  <button key={value} className="af-btn" type="button" onClick={() => setFilter(value)}>
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>

              <Panel title="Staff" action={<Action href="/admin/management/staff">Manage staff</Action>}>
                <DataTable
                  columns={[
                    { title: "Name", key: "name" },
                    { title: "Role", key: "role" },
                    { title: "Email", key: "email" },
                  ]}
                  rows={filtered}
                />
              </Panel>
            </>
          )}

          {screen === "payroll" && (
            <>
              <div className="af-grid af-four mb-5">
                <Stat title="Employees" value={rows.length} />
                <Stat title="Gross" value="—" />
                <Stat title="Deductions" value="—" />
                <Stat title="Net pay" value="—" />
              </div>

              <div className="mb-5">
                <Panel title="Steps">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "1 · Attendance locked",
                      "2 · Incentives added",
                      "3 · Review",
                      "4 · Approve",
                      "5 · Pay and send slips",
                    ].map((value) => <span className="af-pill" key={value}>{value}</span>)}
                  </div>
                  <p className="af-note mt-4">
                    These are the proposed payroll stages, not completed payroll actions.
                  </p>
                </Panel>
              </div>

              <Panel title="Review">
                <DataTable
                  columns={[
                    { title: "Name", key: "name" },
                    { title: "Role", key: "role" },
                    { title: "Email", key: "email" },
                  ]}
                  rows={rows}
                />
                <p className="af-note mt-4">
                  Salary calculation, statutory deductions, approval and payout are not connected.
                </p>
              </Panel>
            </>
          )}

          {screen === "notices" && (
            <div className="af-grid af-two">
              <Panel title="Compose notice">
                <p className="af-note">
                  Use the notice editor below to save a draft. It does not automatically
                  send app notifications, emails or WhatsApp messages.
                </p>
              </Panel>

              <Panel title="Saved notices">
                <DataTable
                  columns={[
                    { title: "Notice", key: "title" },
                    { title: "Audience", key: "audience" },
                    { title: "Created", key: "createdAt" },
                  ]}
                  rows={rows}
                />
              </Panel>
            </div>
          )}
        </>
      )}

      {(screen === "tests" ||
        screen === "placement" ||
        screen === "notices") && (
        <div className="mt-5">
          <AdminDirectorWorkspace screen={screen} />
        </div>
      )}
    </div>
  );
}