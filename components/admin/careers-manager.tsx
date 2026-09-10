"use client";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  Archive,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";

type JobStatus = "draft" | "published" | "closed";

type CareerJob = {
  id: string;

  title: string;
  department: string;
  location: string;

  employmentType: string;
  workMode: string;

  experience: string;

  vacancies: number;

  salary: string;

  description: string;
  responsibilities: string;
  requirements: string;

  deadline: string | null;

  status: JobStatus;

  featured: boolean;

  applicationCount: number;

  publishedAt: string | null;

  closedAt: string | null;

  createdAt: string | null;

  updatedAt: string | null;
};

type Counts = {
  total: number;
  draft: number;
  published: number;
  closed: number;
  applications: number;
  newApplications: number;
};

type JobForm = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  vacancies: string;
  salary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  deadline: string;
  status: JobStatus;
  featured: boolean;
};

const EMPTY_FORM: JobForm = {
  title: "",

  department: "",

  location: "",

  employmentType: "Full Time",

  workMode: "On-site",

  experience: "",

  vacancies: "1",

  salary: "",

  description: "",

  responsibilities: "",

  requirements: "",

  deadline: "",

  status: "draft",

  featured: false,
};

function dateInputValue(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatDate(value: string | null): string {
  if (!value) {
    return "No deadline";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No deadline";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  });
}

function statusClasses(status: JobStatus): string {
  if (status === "published") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "closed") {
    return "bg-slate-100 text-slate-600";
  }

  return "bg-amber-50 text-amber-700";
}

export default function CareersManager() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);

  const [counts, setCounts] = useState<Counts>({
    total: 0,

    draft: 0,

    published: 0,

    closed: 0,

    applications: 0,

    newApplications: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"" | JobStatus>("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editing, setEditing] = useState<CareerJob | null>(null);

  const [form, setForm] = useState<JobForm>(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [workingId, setWorkingId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const response = await fetch(`/api/admin/careers?${params.toString()}`, {
        credentials: "include",

        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load career jobs.");
      }

      setJobs(payload.jobs || []);

      setCounts(
        payload.counts || {
          total: 0,

          draft: 0,

          published: 0,

          closed: 0,

          applications: 0,

          newApplications: 0,
        },
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load career jobs.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [load]);

  function openCreate() {
    setEditing(null);

    setForm(EMPTY_FORM);

    setError("");
    setSuccess("");

    setModalOpen(true);
  }

  function openEdit(job: CareerJob) {
    setEditing(job);

    setForm({
      title: job.title,

      department: job.department,

      location: job.location,

      employmentType: job.employmentType || "Full Time",

      workMode: job.workMode || "On-site",

      experience: job.experience,

      vacancies: String(job.vacancies || 1),

      salary: job.salary,

      description: job.description,

      responsibilities: job.responsibilities,

      requirements: job.requirements,

      deadline: dateInputValue(job.deadline),

      status: job.status,

      featured: job.featured,
    });

    setError("");
    setSuccess("");

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditing(null);

    setForm(EMPTY_FORM);

    setError("");
  }

  async function saveJob() {
    setSaving(true);

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        editing ? `/api/admin/careers/${editing.id}` : "/api/admin/careers",
        {
          method: editing ? "PATCH" : "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...form,

            vacancies: Number(form.vacancies),
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save career job.");
      }

      setModalOpen(false);

      setEditing(null);

      setForm(EMPTY_FORM);

      setSuccess(payload.message || "Career job saved successfully.");

      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save career job.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateJob(
    job: CareerJob,

    data: Record<string, unknown>,
  ) {
    setWorkingId(job.id);

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/careers/${job.id}`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update career job.");
      }

      setSuccess(payload.message || "Career job updated.");

      await load();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update career job.",
      );
    } finally {
      setWorkingId("");
    }
  }

  async function deleteJob(job: CareerJob) {
    const confirmed = window.confirm(
      `Delete "${job.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setWorkingId(job.id);

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/careers/${job.id}`, {
        method: "DELETE",

        credentials: "include",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete career job.");
      }

      setSuccess(payload.message || "Career job deleted.");

      await load();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete career job.",
      );
    } finally {
      setWorkingId("");
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/careers/applications"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#8f0024]/20 bg-white px-5 text-xs font-black text-[#8f0024] transition hover:bg-[#fff1f4]"
          >
            <Users className="h-4 w-4" />
            Manage Applications
          </Link>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white shadow-sm transition hover:bg-[#76001e]"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </button>
        </div>
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Jobs"
            value={counts.total}
            icon={BriefcaseBusiness}
          />

          <StatCard
            label="Published"
            value={counts.published}
            icon={CheckCircle2}
          />

          <StatCard
            label="Applications"
            value={counts.applications}
            icon={Users}
          />

          <StatCard
            label="New Applications"
            value={counts.newApplications}
            icon={Clock3}
          />
        </section>

        {error && !modalOpen && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, departments or locations..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs outline-none focus:border-[#8f0024]/30"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "" | JobStatus)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="">All Statuses</option>

              <option value="draft">Draft</option>

              <option value="published">Published</option>

              <option value="closed">Closed</option>
            </select>
          </div>

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-14 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-[#8f0024]" />

              <h2 className="mt-4 text-sm font-black text-slate-800">
                No career jobs found
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Create your first vacancy to start recruitment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <article key={job.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-[8px] font-black uppercase",

                            statusClasses(job.status),
                          ].join(" ")}
                        >
                          {job.status}
                        </span>

                        {job.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff1f4] px-3 py-1 text-[8px] font-black uppercase text-[#8f0024]">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-lg font-black text-[#271a1e]">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-xs font-bold text-[#8f0024]">
                        {job.department}
                      </p>

                      <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <InfoPill icon={MapPin} text={job.location} />

                        <InfoPill
                          icon={BriefcaseBusiness}
                          text={`${job.employmentType} • ${job.workMode}`}
                        />

                        <InfoPill
                          icon={Users}
                          text={`${job.vacancies} ${
                            job.vacancies === 1 ? "Vacancy" : "Vacancies"
                          }`}
                        />

                        <InfoPill
                          icon={Clock3}
                          text={`Deadline: ${formatDate(job.deadline)}`}
                        />
                      </div>

                      <p className="mt-4 text-[9px] font-semibold text-slate-400">
                        Applications:{" "}
                        <span className="font-black text-slate-600">
                          {job.applicationCount}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:max-w-[330px] xl:justify-end">
                      <button
                        type="button"
                        onClick={() => openEdit(job)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[9px] font-black text-slate-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={workingId === job.id}
                        onClick={() =>
                          void updateJob(job, {
                            featured: !job.featured,
                          })
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[9px] font-black text-slate-600 disabled:opacity-50"
                      >
                        <Star className="h-3.5 w-3.5" />

                        {job.featured ? "Unfeature" : "Feature"}
                      </button>

                      {job.status === "draft" && (
                        <button
                          type="button"
                          disabled={workingId === job.id}
                          onClick={() =>
                            void updateJob(job, {
                              status: "published",
                            })
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-[9px] font-black text-white disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Publish
                        </button>
                      )}

                      {job.status === "published" && (
                        <button
                          type="button"
                          disabled={workingId === job.id}
                          onClick={() =>
                            void updateJob(job, {
                              status: "closed",
                            })
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-700 px-3 text-[9px] font-black text-white disabled:opacity-50"
                        >
                          <Archive className="h-3.5 w-3.5" />
                          Close
                        </button>
                      )}

                      {job.status === "closed" && (
                        <button
                          type="button"
                          disabled={workingId === job.id}
                          onClick={() =>
                            void updateJob(job, {
                              status: "published",
                            })
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-3 text-[9px] font-black text-white disabled:opacity-50"
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={workingId === job.id}
                        onClick={() => void deleteJob(job)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-[9px] font-black text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close job editor"
            className="absolute inset-0"
            onClick={closeModal}
          />

          <section className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                  Recruitment
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  {editing ? "Edit Career Job" : "Create Career Job"}
                </h2>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job Title">
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        title: event.target.value,
                      }))
                    }
                    placeholder="e.g. AI & Coding Trainer"
                    className="input"
                  />
                </Field>

                <Field label="Department">
                  <input
                    value={form.department}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        department: event.target.value,
                      }))
                    }
                    placeholder="e.g. Academics"
                    className="input"
                  />
                </Field>

                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        location: event.target.value,
                      }))
                    }
                    placeholder="e.g. Vashi, Navi Mumbai"
                    className="input"
                  />
                </Field>

                <Field label="Employment Type">
                  <select
                    value={form.employmentType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        employmentType: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option>Full Time</option>

                    <option>Part Time</option>

                    <option>Internship</option>

                    <option>Contract</option>

                    <option>Freelance</option>
                  </select>
                </Field>

                <Field label="Work Mode">
                  <select
                    value={form.workMode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        workMode: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option>On-site</option>

                    <option>Hybrid</option>

                    <option>Remote</option>
                  </select>
                </Field>

                <Field label="Experience">
                  <input
                    value={form.experience}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        experience: event.target.value,
                      }))
                    }
                    placeholder="e.g. 1-3 years"
                    className="input"
                  />
                </Field>

                <Field label="Vacancies">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={form.vacancies}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        vacancies: event.target.value,
                      }))
                    }
                    className="input"
                  />
                </Field>

                <Field label="Salary / Compensation">
                  <input
                    value={form.salary}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        salary: event.target.value,
                      }))
                    }
                    placeholder="e.g. ₹30,000 - ₹45,000 / month"
                    className="input"
                  />
                </Field>

                <Field label="Application Deadline">
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        deadline: event.target.value,
                      }))
                    }
                    className="input"
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        status: event.target.value as JobStatus,
                      }))
                    }
                    className="input"
                  >
                    <option value="draft">Draft</option>

                    <option value="published">Published</option>

                    <option value="closed">Closed</option>
                  </select>
                </Field>
              </div>

              <div className="mt-4 space-y-4">
                <Field label="Job Description">
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        description: event.target.value,
                      }))
                    }
                    placeholder="Describe the position and what the candidate will work on..."
                    className="input min-h-[120px] resize-y py-3"
                  />
                </Field>

                <Field label="Responsibilities">
                  <textarea
                    rows={5}
                    value={form.responsibilities}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        responsibilities: event.target.value,
                      }))
                    }
                    placeholder={
                      "One responsibility per line...\nTeach and mentor students\nPrepare learning material\nTrack student performance"
                    }
                    className="input min-h-[120px] resize-y py-3"
                  />
                </Field>

                <Field label="Requirements">
                  <textarea
                    rows={5}
                    value={form.requirements}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        requirements: event.target.value,
                      }))
                    }
                    placeholder={
                      "One requirement per line...\nStrong communication skills\nRelevant teaching experience\nKnowledge of digital tools"
                    }
                    className="input min-h-[120px] resize-y py-3"
                  />
                </Field>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        featured: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#8f0024]"
                  />

                  <div>
                    <p className="text-xs font-black text-slate-700">
                      Featured Job
                    </p>

                    <p className="mt-1 text-[9px] text-slate-400">
                      Featured opportunities can be highlighted on the public
                      Careers page.
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}
            </div>

            <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button
                type="button"
                disabled={saving}
                onClick={closeModal}
                className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void saveJob()}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                {editing
                  ? "Save Changes"
                  : form.status === "published"
                    ? "Publish Job"
                    : "Create Job"}
              </button>
            </footer>
          </section>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          min-height: 44px;
          border: 1px solid rgb(226 232 240);
          border-radius: 0.75rem;
          background: white;
          padding-left: 0.875rem;
          padding-right: 0.875rem;
          font-size: 0.75rem;
          outline: none;
        }

        .input:focus {
          border-color: rgba(143, 0, 36, 0.4);
          box-shadow: 0 0 0 4px rgba(143, 0, 36, 0.05);
        }
      `}</style>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-[#271a1e]">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function InfoPill({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[9px] font-bold text-slate-600">
      <Icon className="h-3.5 w-3.5 text-[#8f0024]" />

      {text}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;

  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      {children}
    </div>
  );
}
