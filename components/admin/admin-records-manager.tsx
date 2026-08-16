"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSearch,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type ColumnConfig = {
  label: string;
  keys: string[];
};

type AdminRecord = {
  id: string;
  status: string;
  adminNote: string;
  createdAt: string | null;

  updatedAt: string | null;

  data: Record<string, unknown>;
};

type ApiResponse = {
  records: AdminRecord[];

  statuses: string[];

  counts: Record<string, number>;

  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
};

type Props = {
  resource: "admissions" | "contacts" | "careers" | "service-leads";

  title: string;
  description: string;

  columns: ColumnConfig[];

  embedded?: boolean;

  variant?: "default" | "admissions";
};

function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getValue(record: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "—";
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(displayValue).join(", ");
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function shortDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function statusStyle(status: string): string {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "reviewing") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  if (status === "contacted") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "closed") {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function AdminRecordsManager({
  resource,
  title,
  description,
  columns,
  embedded = false,
  variant = "default",
}: Props) {
  const isAdmissions = variant === "admissions";
  const [records, setRecords] = useState<AdminRecord[]>([]);

  const [statuses, setStatuses] = useState<string[]>([]);

  const [counts, setCounts] = useState<Record<string, number>>({
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<AdminRecord | null>(null);

  const [editStatus, setEditStatus] = useState("");

  const [adminNote, setAdminNote] = useState("");

  const [saving, setSaving] = useState(false);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      params.set("page", String(page));

      params.set("limit", "25");

      const response = await fetch(
        `/api/admin/resources/${resource}?${params.toString()}`,
        {
          method: "GET",

          credentials: "include",

          cache: "no-store",
        },
      );

      const data = (await response.json()) as
        | ApiResponse
        | {
            error?: string;
          };

      if (!response.ok) {
        throw new Error(
          "error" in data
            ? data.error || "Unable to load records."
            : "Unable to load records.",
        );
      }

      const payload = data as ApiResponse;

      setRecords(payload.records || []);

      setStatuses(payload.statuses || []);

      setCounts(
        payload.counts || {
          total: 0,
        },
      );

      setTotalPages(payload.pagination?.totalPages || 1);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load records.",
      );
    } finally {
      setLoading(false);
    }
  }, [resource, search, status, page]);

  useEffect(() => {
    setPage(1);
    setSearch("");
    setSearchInput("");
    setStatus("all");
  }, [resource]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  function openRecord(record: AdminRecord) {
    setSelected(record);
    setEditStatus(record.status);
    setAdminNote(record.adminNote || "");
    setError("");
    setSuccess("");
  }

  async function saveRecord() {
    if (!selected) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/resources/${resource}/${selected.id}`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: editStatus,

            adminNote,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        record?: AdminRecord;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to save record.");
      }

      setSuccess(data.message || "Record updated.");

      setSelected(null);

      await loadRecords();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save record.",
      );
    } finally {
      setSaving(false);
    }
  }

  const content = (
    <>
      {!embedded &&
        (isAdmissions ? (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#650018] via-[#8f0024] to-[#a9183b] px-6 py-7 text-white shadow-lg sm:px-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

            <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/5" />

            <div className="relative z-10 grid gap-7 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Admissions Control Centre
                </div>

                <h1 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                  Manage every applicant from enquiry to decision.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                  Review applications, track communication, record decisions and
                  keep your admission workflow organised from one dashboard.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/admissions"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-[10px] font-black text-[#8f0024] transition hover:bg-[#fff4f7]"
                  >
                    View Public Admissions Page
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>

                  <div className="flex h-10 items-center rounded-lg border border-white/15 bg-white/10 px-4 text-[10px] font-bold text-white/80">
                    Applications update automatically
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/60">
                  Admission Journey
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      number: "01",
                      label: "New Application",
                      text: "Application received",
                    },
                    {
                      number: "02",
                      label: "Reviewing",
                      text: "Team reviews applicant",
                    },
                    {
                      number: "03",
                      label: "Contacted",
                      text: "Applicant communication",
                    },
                    {
                      number: "04",
                      label: "Decision",
                      text: "Approve, reject or close",
                    },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[9px] font-black text-[#8f0024]">
                        {step.number}
                      </div>

                      <div>
                        <p className="text-[10px] font-black text-white">
                          {step.label}
                        </p>

                        <p className="mt-0.5 text-[9px] text-white/55">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
                {title}
              </h1>

              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          </div>
        ))}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={isAdmissions ? "Total Applications" : "Total"}
          value={counts.total || 0}
          helper={isAdmissions ? "All received applications" : undefined}
        />

        <SummaryCard
          label={isAdmissions ? "New Applications" : "New"}
          value={counts.new || 0}
          helper={isAdmissions ? "Awaiting first review" : undefined}
        />

        <SummaryCard
          label={isAdmissions ? "Under Review" : "Reviewing"}
          value={counts.reviewing || 0}
          helper={isAdmissions ? "Currently being assessed" : undefined}
        />

        <SummaryCard
          label="Contacted"
          value={counts.contacted || 0}
          helper={isAdmissions ? "Applicants contacted" : undefined}
        />
      </section>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              placeholder="Search records..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-[#8f0024]/40 focus:bg-white focus:ring-4 focus:ring-[#8f0024]/5"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);

              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none"
          >
            <option value="all">All Statuses</option>

            {statuses.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch(searchInput);

              setPage(1);
            }}
            className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => loadRecords()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400"
                  >
                    {column.label}
                  </th>
                ))}

                <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Received
                </th>

                <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 3}
                    className="py-16 text-center"
                  >
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#8f0024]" />

                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      Loading records...
                    </p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 3}
                    className="py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                      <FileSearch className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-sm font-black text-slate-700">
                      {isAdmissions
                        ? "No admission applications yet"
                        : "No records found"}
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-slate-400">
                      {isAdmissions
                        ? "Applications submitted through the Prime Digital School admissions form will automatically appear here."
                        : "Try changing your search or status filter."}
                    </p>

                    {isAdmissions && (
                      <a
                        href="/admissions"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-[10px] font-black text-[#8f0024]"
                      >
                        Open Admissions Page
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 transition hover:bg-[#fffafb]"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.label}
                        className="max-w-[240px] px-5 py-4 text-[11px] font-semibold text-slate-700"
                      >
                        <span className="line-clamp-2">
                          {displayValue(getValue(record.data, column.keys))}
                        </span>
                      </td>
                    ))}

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${statusStyle(
                          record.status,
                        )}`}
                      >
                        {titleCase(record.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[10px] text-slate-500">
                      {shortDate(record.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openRecord(record)}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-[9px] font-black text-slate-600 transition hover:border-[#8f0024]/30 hover:text-[#8f0024]"
                      >
                        <Eye className="h-3 w-3" />
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-[10px] font-semibold text-slate-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                  Record Details
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  {title}
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Received {shortDate(selected.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(selected.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      {titleCase(key)}
                    </p>

                    <p className="mt-2 break-words text-[11px] font-semibold leading-5 text-slate-700">
                      {displayValue(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-black text-slate-700">
                  Application Status
                </label>

                <select
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none"
                >
                  {statuses.map((option) => (
                    <option key={option} value={option}>
                      {titleCase(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[11px] font-black text-slate-700">
                  Internal Admin Note
                </label>

                <textarea
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  rows={5}
                  placeholder="Add notes about follow-up, decision, call status, etc."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveRecord}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">{content}</div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper?: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#8f0024] via-[#bd3156] to-[#efb3c3]" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-[#271a1e]">
            {value}
          </p>

          {helper && (
            <p className="mt-2 text-[9px] font-medium text-slate-400">
              {helper}
            </p>
          )}
        </div>

        <div className="h-10 w-10 rounded-xl bg-[#fff1f4] transition group-hover:bg-[#8f0024]" />
      </div>
    </article>
  );
}
