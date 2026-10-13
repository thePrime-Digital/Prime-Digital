"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

type Row = Record<string, unknown> & { id?: string };

type Field = {
  key: string;
  label: string;
  type?: "text" | "date" | "textarea" | "select";
  options?: string[];
};

type ScreenConfig = {
  title: string;
  description: string;
  endpoint: string;
  fields?: Field[];
  columns: { key: string; label: string }[];
  note?: string;
};

const configs: Record<string, ScreenConfig> = {
  tests: {
    title: "Tests",
    description: "Exam calendar and test planning",
    endpoint: "tests",
    fields: [
      { key: "title", label: "Test name" },
      { key: "course", label: "Course" },
      { key: "batch", label: "Batch" },
      { key: "examDate", label: "Exam date", type: "date" },
      { key: "faculty", label: "Faculty" },
      { key: "notes", label: "Instructions", type: "textarea" },
    ],
    columns: [
      { key: "examDate", label: "Date" },
      { key: "title", label: "Test" },
      { key: "course", label: "Course" },
      { key: "batch", label: "Batch" },
      { key: "faculty", label: "Faculty" },
    ],
    note: "Exam calendar creation is available. Mark-change approvals and score analytics need a connected assessment workflow.",
  },
  leads: {
    title: "Leads",
    description: "Enquiry pipeline across Staff accounts",
    endpoint: "leads",
    columns: [
      { key: "name", label: "Lead" },
      { key: "course", label: "Course" },
      { key: "source", label: "Source" },
      { key: "stage", label: "Stage" },
      { key: "nextFollowUp", label: "Follow-up" },
    ],
    note: "Read-only overview of Staff-created leads. Assignment and target rules are not enabled yet.",
  },
  placement: {
    title: "Placement",
    description: "Hiring partners, placement drives and opportunities",
    endpoint: "placement",
    fields: [
      { key: "company", label: "Company" },
      { key: "roles", label: "Available roles" },
      { key: "driveDate", label: "Drive date", type: "date" },
      { key: "notes", label: "Drive notes", type: "textarea" },
    ],
    columns: [
      { key: "driveDate", label: "Date" },
      { key: "company", label: "Company" },
      { key: "roles", label: "Roles" },
      { key: "status", label: "Status" },
    ],
    note: "Placement drives can be recorded. Student applications, offers and verified placement rates require additional workflows.",
  },
  payroll: {
    title: "Payroll",
    description: "Staff roster and payroll preparation",
    endpoint: "payroll",
    columns: [
      { key: "name", label: "Employee" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
    ],
    note: "This is an employee roster only. Gross salary, deductions, statutory compliance, approval, payouts and payslips are not yet implemented.",
  },
  notices: {
    title: "Notices",
    description: "Compose institute announcements",
    endpoint: "notices",
    fields: [
      { key: "title", label: "Notice title" },
      { key: "message", label: "Message", type: "textarea" },
      {
        key: "audience",
        label: "Audience",
        type: "select",
        options: ["All students", "Faculty", "Staff", "Everyone"],
      },
    ],
    columns: [
      { key: "title", label: "Notice" },
      { key: "audience", label: "Audience" },
      { key: "createdAt", label: "Created" },
    ],
    note: "Saved notices are drafts. They are not delivered to app users, WhatsApp or email.",
  },
};

function display(value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value !== "string") return "—";

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
    }
  }

  return value;
}

const inputClass =
  "mt-2 w-full rounded-lg border border-[#e9e2dc] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#ad123d]";

export default function AdminDirectorWorkspace({
  screen,
}: {
  screen: "tests" | "leads" | "placement" | "payroll" | "notices";
}) {
  const config = configs[screen];
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/director/" + config.endpoint,
        { credentials: "include", cache: "no-store" }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load records");

      setRows(Array.isArray(data.records) ? data.records : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/director/" + config.endpoint,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save.");

      setSuccess(data.message || "Saved.");
      setForm({});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = rows.filter((row) =>
    !search ||
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-[1500px] space-y-5 p-5 sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black tracking-tight">
            {config.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {config.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-xs font-bold"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {config.note && (
        <p className="rounded-lg border border-[#e9dfd5] bg-white px-4 py-3 text-xs text-slate-600">
          {config.note}
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-xs text-green-700">
          {success}
        </div>
      )}

      {config.fields && (
        <section className="rounded-xl border border-[#e9e1db] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black">
            {screen === "notices" ? "New notice draft" : screen === "tests" ? "Schedule test" : "Add placement drive"}
          </h2>

          <form onSubmit={(event) => void submit(event)} className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {config.fields.map((field) => (
              <label key={field.key} className="block text-xs font-semibold">
                {field.label}

                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                  />
                )}
              </label>
            ))}

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#ad123d] px-5 py-3 text-xs font-bold text-white hover:bg-[#890d30] disabled:opacity-50"
              >
                <Plus size={15} />
                {saving ? "Saving..." : screen === "notices" ? "Save Draft" : "Save Record"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-[#e9e1db] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-black">
              {screen === "payroll" ? "Employee roster" : "Records"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              {rows.length} record(s)
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="h-9 w-44 rounded-lg border pl-9 pr-3 text-xs outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="animate-spin text-[#ad123d]" />
          </div>
        ) : filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead>
                <tr className="border-b bg-[#fdfbf9] text-[10px] uppercase tracking-wider text-slate-500">
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-5 py-4">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={String(row.id)} className="border-b border-[#f1ece8] last:border-0">
                    {config.columns.map((column) => (
                      <td key={column.key} className="px-5 py-4">
                        {display(row[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-14 text-center">
            <h3 className="text-sm font-bold">No records found</h3>
            <p className="mt-2 text-xs text-slate-500">
              {search ? "Try a different search." : "Records will appear here when available."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}