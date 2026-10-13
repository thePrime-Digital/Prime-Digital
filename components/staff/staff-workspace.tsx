"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight, Bell, CalendarDays, Check, Clock3,
  CreditCard, Download, Loader2, Plus,
  RefreshCw, Search, TrendingUp, Users,
} from "lucide-react";

type RecordItem = Record<string, unknown> & { id?: string };

type Field = {
  name: string;
  label: string;
  kind?: "date" | "datetime-local" | "select" | "tel" | "email" | "textarea";
  choices?: string[];
};

type Config = {
  title: string;
  description: string;
  resource?: string;
  fields?: Field[];
  columns?: string[];
  labels?: string[];
};

export const screens = {
  home: { title: "Home", description: "Your daily admissions and operations workspace." },
  tasks: {
    title: "Tasks", description: "Stay on top of your work.",
    resource: "tasks",
    fields: [
      { name: "title", label: "Task" },
      { name: "dueDate", label: "Due date", kind: "date" },
      { name: "details", label: "Details", kind: "textarea" },
    ],
    columns: ["title", "dueDate", "status"],
    labels: ["Task", "Due", "Status"],
  },
  leads: {
    title: "Leads", description: "Manage enquiries and follow-ups.",
    resource: "leads",
    fields: [
      { name: "name", label: "Lead name" },
      { name: "phone", label: "Phone", kind: "tel" },
      { name: "email", label: "Email", kind: "email" },
      { name: "course", label: "Interested course" },
      { name: "source", label: "Source", kind: "select", choices: ["Website", "Walk-in", "Instagram", "Google", "WhatsApp", "Referral", "Other"] },
      { name: "stage", label: "Stage", kind: "select", choices: ["New", "Contacted", "Counselled", "Demo booked", "Applied", "Closed"] },
      { name: "nextFollowUp", label: "Next follow-up", kind: "datetime-local" },
      { name: "note", label: "Notes", kind: "textarea" },
    ],
    columns: ["name", "course", "stage", "nextFollowUp"],
    labels: ["Lead", "Course", "Stage", "Follow-up"],
  },
  demos: {
    title: "Demos", description: "Book and track demo classes and walk-ins.",
    resource: "demos",
    fields: [
      { name: "name", label: "Student / lead" },
      { name: "course", label: "Course" },
      { name: "date", label: "Demo date", kind: "date" },
      { name: "time", label: "Time" },
      { name: "mode", label: "Mode", kind: "select", choices: ["In centre", "Online"] },
      { name: "status", label: "Outcome", kind: "select", choices: ["Booked", "Came", "No-show"] },
      { name: "note", label: "Notes", kind: "textarea" },
    ],
    columns: ["name", "course", "date", "time", "status"],
    labels: ["Lead", "Course", "Date", "Time", "Outcome"],
  },
  admissions: {
    title: "Admissions", description: "Review the existing admissions pipeline.",
    resource: "admissions",
    columns: ["studentName", "program", "grade", "status", "reference"],
    labels: ["Student", "Program", "Class", "Status", "Reference"],
  },
  counselling: {
    title: "Counselling", description: "Track counselling sessions and reports.",
    resource: "counselling",
    fields: [
      { name: "name", label: "Student name" },
      { name: "phone", label: "WhatsApp number", kind: "tel" },
      { name: "studentClass", label: "Class" },
      { name: "session", label: "Session date", kind: "date" },
      { name: "reportStatus", label: "Report status", kind: "select", choices: ["Not started", "Draft", "To approve"] },
      { name: "note", label: "Counselling notes", kind: "textarea" },
    ],
    columns: ["name", "studentClass", "session", "reportStatus"],
    labels: ["Student", "Class", "Session", "Report"],
  },
  students: {
    title: "Students", description: "Active student directory.",
    resource: "students",
    columns: ["name", "enrollmentNo", "program", "currentClass"],
    labels: ["Student", "ID", "Program", "Class"],
  },
  fees: {
    title: "Fees", description: "Review outstanding fees and invoice status.",
    resource: "fees",
    columns: ["studentName", "invoiceId", "amount", "paid", "balance", "status"],
    labels: ["Student", "Invoice", "Amount", "Paid", "Balance", "Status"],
  },
  reports: {
    title: "Reports", description: "Admissions and sales activity at a glance.",
  },
  attendance: {
    title: "Attendance", description: "Your check-in and check-out history.",
    resource: "attendance",
  },
  profile: {
    title: "Profile", description: "Your details and notification preferences.",
    resource: "profile",
  },
} satisfies Record<string, Config>;

export type StaffScreen = keyof typeof screens;

function label(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value !== "string") return "—";

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  return value;
}

function Card({
  title,
  children,
  extra,
}: {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e8e1db] bg-white shadow-[0_2px_7px_rgba(32,17,18,0.035)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#efeae5] px-5 py-4">
        <h2 className="text-sm font-extrabold">{title}</h2>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Stat({
  name,
  value,
  sub,
}: {
  name: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[#ece5df] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{name}</p>
      <p className="mt-2 text-2xl font-black text-[#3f101c]">{value}</p>
      {sub && <p className="mt-2 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

const buttonClass = "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#ad123d] px-4 py-2 text-xs font-bold text-white hover:bg-[#850e30] disabled:opacity-50";
const inputClass = "w-full rounded-lg border border-[#e6e0dc] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#ad123d]";

async function fetchRecords(resource: string) {
  const res = await fetch("/api/staff/" + resource, {
    credentials: "include",
    cache: "no-store",
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Unable to load data.");
  return body as {
    records?: RecordItem[];
    record?: RecordItem | null;
    user?: { name: string; email: string; phone: string };
  };
}

export default function StaffWorkspace({ screen }: { screen: StaffScreen }) {
  const config: Config = screens[screen];
  const resource = config.resource;

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("");
  const [profileUser, setProfileUser] = useState({
    name: "", email: "", phone: "",
  });
  const [reportData, setReportData] = useState({
    leads: [] as RecordItem[],
    demos: [] as RecordItem[],
    admissions: [] as RecordItem[],
    tasks: [] as RecordItem[],
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (screen === "home" || screen === "reports") {
        const [leads, demos, admissions, tasks] = await Promise.all([
          fetchRecords("leads"),
          fetchRecords("demos"),
          fetchRecords("admissions"),
          fetchRecords("tasks"),
        ]);
        setReportData({
          leads: leads.records || [],
          demos: demos.records || [],
          admissions: admissions.records || [],
          tasks: tasks.records || [],
        });
      } else if (resource) {
        const data = await fetchRecords(resource);
        setRecords(data.records || []);
        if (data.user) setProfileUser(data.user);
        if (screen === "profile" && data.record) {
          const next: Record<string, string> = {};
          for (const [key, value] of Object.entries(data.record)) {
            if (typeof value === "string" || typeof value === "boolean") {
              next[key] = String(value);
            }
          }
          setForm(next);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [resource, screen]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resource) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/staff/" + resource, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save.");
      setNotice(data.message || "Saved.");
      if (screen !== "profile") setForm({});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  async function update(id: string, changes: Record<string, string>) {
    if (!resource) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/staff/" + resource, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed.");
      setNotice("Record updated.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function attendanceAction(action: "checkin" | "checkout") {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/staff/attendance", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Attendance failed.");
      setNotice(result.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Attendance failed.");
    } finally {
      setSaving(false);
    }
  }

  const visible = records.filter((item) =>
    !filter || JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
  );

  const leadCount = reportData.leads.length;
  const admissionCount = reportData.admissions.length;
  const bookedDemos = reportData.demos.filter((d) => d.status === "Booked").length;
  const pendingTasks = reportData.tasks.filter((t) => t.status !== "done").length;
  const conversion = "—";

  const summaryCards = [
    { name: "Tracked Leads", value: leadCount, sub: "Leads created by you" },
    { name: "Admission Applications", value: admissionCount, sub: "Current application records" },
    { name: "Demos Booked", value: bookedDemos, sub: "Your pending demos" },
    { name: "Open Tasks", value: pendingTasks, sub: "Tasks not yet completed" },
  ];

  const profileFields: Field[] = [
    { name: "phone", label: "Phone" },
    { name: "designation", label: "Designation" },
    { name: "location", label: "Location" },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9f5f6b]">
            Prime Digital School / Staff
          </p>
          <h1 className="mt-2 text-[26px] font-black tracking-tight">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border border-[#e6ddd7] bg-white px-4 py-2 text-xs font-bold"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-xs text-green-800">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-xl bg-white p-16 text-[#ad123d]">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {(screen === "home" || screen === "reports") && (
            <>
              {screen === "home" && (
                <div className="rounded-xl bg-[#490e20] p-6 text-white">
                  <p className="text-xs text-white/65">Staff Workspace</p>
                  <h2 className="mt-2 text-2xl font-black">Your daily overview</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Follow up on leads, manage demos and finish your assigned tasks.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/staff/leads" className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#490e20]">
                      Add lead
                    </Link>
                    <Link href="/staff/demos" className="rounded-lg border border-white/25 px-4 py-2 text-xs font-bold">
                      Book demo
                    </Link>
                    <Link href="/staff/admissions" className="rounded-lg border border-white/25 px-4 py-2 text-xs font-bold">
                      Admissions
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <Stat key={card.name} {...card} />
                ))}
              </div>

              {screen === "home" ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  <Card
                    title="Recent Follow-ups"
                    extra={<Link href="/staff/leads" className="text-xs font-bold text-[#ad123d]">All leads →</Link>}
                  >
                    {reportData.leads.length ? (
                      <div className="space-y-3">
                        {reportData.leads.slice(0, 6).map((item) => (
                          <div key={String(item.id)} className="flex justify-between gap-3 border-b pb-3 text-xs last:border-0">
                            <div>
                              <p className="font-bold">{label(item.name)}</p>
                              <p className="mt-1 text-slate-500">{label(item.course)}</p>
                            </div>
                            <span className="font-semibold text-[#9c2444]">{label(item.stage)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No leads entered yet.</p>
                    )}
                  </Card>

                  <Card title="Your Task List" extra={<Link href="/staff/tasks" className="text-xs font-bold text-[#ad123d]">Open tasks →</Link>}>
                    {reportData.tasks.length ? (
                      <div className="space-y-3">
                        {reportData.tasks.slice(0, 6).map((item) => (
                          <div key={String(item.id)} className="flex items-center justify-between gap-3 border-b pb-3 text-xs">
                            <span>{label(item.title)}</span>
                            <span className="font-bold text-[#ad123d]">{label(item.status)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No tasks added yet.</p>
                    )}
                  </Card>

                  <Card title="Upcoming Demos">
                    {reportData.demos.length ? (
                      <div className="space-y-3">
                        {reportData.demos.slice(0, 5).map((d) => (
                          <div key={String(d.id)} className="flex items-center justify-between gap-3 text-xs">
                            <div>
                              <p className="font-bold">{label(d.name)}</p>
                              <p className="text-slate-500">{label(d.course)}</p>
                            </div>
                            <span className="text-[#ad123d]">{label(d.date)}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-slate-500">No demos booked yet.</p>}
                  </Card>

                  <Card title="Quick Access">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Tasks", "/staff/tasks"],
                        ["Admissions", "/staff/admissions"],
                        ["Students", "/staff/students"],
                        ["Fees", "/staff/fees"],
                      ].map(([name, href]) => (
                        <Link key={href} href={href} className="flex items-center justify-between rounded-lg border p-3 text-xs font-bold hover:bg-[#fff4f6]">
                          {name} <ArrowRight size={14} />
                        </Link>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  <Card title="Lead Performance">
                    <div className="space-y-4">
                      <Stat name="Tracked leads" value={leadCount} />
                      <Stat name="Verified lead-to-admission conversion" value={conversion} sub="Requires admissions linked to individual leads. Not yet available." />
                    </div>
                  </Card>
                  <Card title="Activity Summary">
                    <div className="space-y-3 text-xs">
                      <p>Booked demos: <strong>{bookedDemos}</strong></p>
                      <p>Open tasks: <strong>{pendingTasks}</strong></p>
                      <p>Admission applications: <strong>{admissionCount}</strong></p>
                      <p className="text-slate-500">Call metrics, targets and individual admissions attribution need additional tracking.</p>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}

          {screen === "attendance" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat name="Recorded Days" value={records.length} />
                <Stat name="Checked Out" value={records.filter((r) => Boolean(r.checkOutAt)).length} />
                <Stat name="Open Check-ins" value={records.filter((r) => Boolean(r.checkInAt) && !r.checkOutAt).length} />
              </div>
              <Card title="Today">
                <div className="flex flex-wrap gap-3">
                  <button disabled={saving} type="button" onClick={() => void attendanceAction("checkin")} className={buttonClass}>
                    <Clock3 size={15} /> Check In
                  </button>
                  <button disabled={saving} type="button" onClick={() => void attendanceAction("checkout")} className={buttonClass}>
                    <Check size={15} /> Check Out
                  </button>
                </div>
                <p className="mt-4 text-xs text-slate-500">Attendance timestamps are recorded on the server. Leave approval is not enabled yet.</p>
              </Card>
              <Card title="Attendance History">
                {records.length ? (
                  <div className="space-y-3">
                    {records.map((record) => (
                      <div key={String(record.id)} className="flex flex-wrap justify-between gap-3 rounded-lg border p-3 text-xs">
                        <strong>{label(record.dateKey)}</strong>
                        <span>In: {label(record.checkInAt)}</span>
                        <span>Out: {label(record.checkOutAt)}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-slate-500">No attendance history yet.</p>}
              </Card>
            </>
          )}

          {screen === "profile" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card title="Personal Details">
                <div className="mb-5 space-y-2 rounded-lg bg-[#faf6f2] p-4 text-xs">
                  <p><strong>Name:</strong> {profileUser.name}</p>
                  <p><strong>Email:</strong> {profileUser.email}</p>
                  <p className="text-slate-500">Account email and name are managed by the administrator.</p>
                </div>

                <form onSubmit={(e) => void submit(e)} className="space-y-4">
                  {profileFields.map((field) => (
                    <label key={field.name} className="block text-xs font-semibold">
                      {field.label}
                      <input
                        value={form[field.name] ?? (field.name === "phone" ? profileUser.phone : "")}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        className={"mt-2 " + inputClass}
                      />
                    </label>
                  ))}
                  <button disabled={saving} className={buttonClass}>
                    Save Profile
                  </button>
                </form>
              </Card>

              <Card title="Alerts & Preferences">
                <form onSubmit={(e) => void submit(e)} className="space-y-5">
                  {[
                    ["alertLeads", "New lead"],
                    ["alertFollowups", "Follow-up reminders"],
                    ["alertFees", "Fee payment alerts"],
                  ].map(([key, title]) => (
                    <label key={key} className="flex items-center justify-between gap-3 text-xs">
                      <span>{title}</span>
                      <input
                        type="checkbox"
                        checked={form[key] !== "false"}
                        onChange={(e) => setForm({ ...form, [key]: String(e.target.checked) })}
                        className="accent-[#ad123d]"
                      />
                    </label>
                  ))}
                  <button className={buttonClass} disabled={saving}>Save Preferences</button>
                  <p className="text-xs text-slate-500">These preferences are stored; automated notifications require a separate notification service.</p>
                </form>
              </Card>
            </div>
          )}

          {resource && !["profile", "attendance"].includes(screen) && (
            <>
              {config.fields && (
                <Card title={"Add " + config.title.replace(/s$/, "")}>
                  <form onSubmit={(e) => void submit(e)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {config.fields.map((field) => (
                      <label key={field.name} className="block text-xs font-semibold">
                        {field.label}
                        {field.kind === "textarea" ? (
                          <textarea
                            value={form[field.name] || ""}
                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                            rows={2}
                            className={"mt-2 " + inputClass}
                          />
                        ) : field.kind === "select" ? (
                          <select
                            value={form[field.name] || ""}
                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                            className={"mt-2 " + inputClass}
                          >
                            <option value="">Select</option>
                            {field.choices?.map((choice) => (
                              <option key={choice} value={choice}>{choice}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.kind || "text"}
                            value={form[field.name] || ""}
                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                            className={"mt-2 " + inputClass}
                          />
                        )}
                      </label>
                    ))}
                    <div className="flex items-end">
                      <button type="submit" disabled={saving} className={buttonClass}>
                        <Plus size={15} />
                        {saving ? "Saving..." : "Save Record"}
                      </button>
                    </div>
                  </form>
                </Card>
              )}

              <Card
                title={config.fields ? "Your Records" : config.title + " Records"}
                extra={
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Filter..."
                      aria-label="Filter records"
                      className="w-40 rounded-lg border px-3 py-2 pl-8 text-xs outline-none"
                    />
                  </div>
                }
              >
                {visible.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[580px] text-left text-xs">
                      <thead>
                        <tr className="border-b text-[10px] uppercase tracking-wider text-slate-500">
                          {config.labels?.map((name) => (
                            <th key={name} className="px-3 py-3">{name}</th>
                          ))}
                          {["tasks", "leads", "demos", "counselling"].includes(screen) && <th className="px-3 py-3">Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((row) => (
                          <tr key={String(row.id)} className="border-b border-[#f1ece8] last:border-0">
                            {config.columns?.map((column) => (
                              <td key={column} className="px-3 py-4">
                                {["amount", "paid", "balance"].includes(column)
                                  ? "₹" + label(row[column])
                                  : label(row[column])}
                              </td>
                            ))}
                            {["tasks", "leads", "demos", "counselling"].includes(screen) && (
                              <td className="px-3 py-3">
                                {screen === "tasks" ? (
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => void update(String(row.id), {
                                      status: row.status === "done" ? "pending" : "done",
                                    })}
                                    className="rounded-lg border border-[#e9dce0] px-3 py-1.5 text-[11px] font-bold text-[#a0193b]"
                                  >
                                    {row.status === "done" ? "Reopen" : "Done"}
                                  </button>
                                ) : (
                                  <select
                                    aria-label="Update status"
                                    disabled={saving}
                                    value={String(row[screen === "leads" ? "stage" : screen === "demos" ? "status" : "reportStatus"] || "")}
                                    onChange={(e) =>
                                      void update(String(row.id), {
                                        [screen === "leads" ? "stage" : screen === "demos" ? "status" : "reportStatus"]: e.target.value,
                                      })
                                    }
                                    className="rounded-lg border px-2 py-1.5 text-[11px]"
                                  >
                                    <option value="">Select</option>
                                    {(screen === "leads"
                                      ? ["New", "Contacted", "Counselled", "Demo booked", "Applied", "Closed"]
                                      : screen === "demos"
                                        ? ["Booked", "Came", "No-show"]
                                        : ["Not started", "Draft", "To approve"]
                                    ).map((choice) => (
                                      <option key={choice} value={choice}>{choice}</option>
                                    ))}
                                  </select>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#e7d9d8] bg-[#fffbfa] p-12 text-center">
                    <p className="text-sm font-bold">No records found</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {filter ? "Try a different filter." : "Records will appear here when available."}
                    </p>
                  </div>
                )}

                {screen === "fees" && (
                  <p className="mt-4 text-xs text-slate-500">
                    Fee collection, payment recording and receipt issuing remain restricted to authorized Admin workflows.
                  </p>
                )}
                {screen === "admissions" && (
                  <p className="mt-4 text-xs text-slate-500">
                    Admission approval and document verification remain in the Admin workflow.
                  </p>
                )}
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}