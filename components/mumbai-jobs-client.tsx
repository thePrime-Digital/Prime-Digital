"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import type {
  MumbaiEmployer,
  MumbaiJob,
  MumbaiJobCategory,
} from "@/lib/mumbai-jobs";

type Props = {
  jobs: MumbaiJob[];
  sources: MumbaiEmployer[];
  checkedAt: string;
};

const STORAGE_KEY = "pds-mumbai-saved-jobs-v1";

const categories: ("All" | MumbaiJobCategory)[] = [
  "All",
  "Technology",
  "Banking & Finance",
  "Consulting",
  "Engineering",
  "Consumer & Retail",
  "Media & Internet",
  "Conglomerate",
];

const types = [
  "All",
  "Job",
  "Full-time",
  "Internship",
  "Apprenticeship",
  "Contract",
];

const fieldStyle =
  "h-11 w-full rounded-xl border border-[#e9e3e5] bg-white px-3.5 text-sm text-[#32212a] outline-none transition focus:border-[#850028] focus:ring-2 focus:ring-[#850028]/10";


function CompanyLogo({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#f0e4e7] bg-[#fff5f7] text-sm font-black tracking-tight text-[#890028]">
      {initials}
    </div>
  );
}

export default function MumbaiJobsClient({
  jobs,
  sources,
  checkedAt,
}: Props) {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");
  const [category, setCategory] =
    useState<"All" | MumbaiJobCategory>("All");
  const [jobType, setJobType] = useState("All");
  const [sortBy, setSortBy] = useState("company");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        setSavedIds(
          parsed.filter(
            (id): id is string => typeof id === "string"
          )
        );
      }
    } catch {
      // Storage may not be available.
    }
  }, []);

  function toggleSaved(id: string) {
    setSavedIds((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // Storage may not be available.
      }

      return updated;
    });
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = jobs.filter((job) => {
      if (company !== "All" && job.companyKey !== company) return false;
      if (category !== "All" && job.category !== category) return false;
      if (jobType !== "All" && job.type !== jobType) return false;
      if (savedOnly && !savedIds.includes(job.id)) return false;

      if (!query) return true;

      return [
        job.title,
        job.company,
        job.category,
        job.location,
        job.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return [...results].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "location") {
        return (
          a.location.localeCompare(b.location) ||
          a.title.localeCompare(b.title)
        );
      }
      return (
        a.company.localeCompare(b.company) ||
        a.title.localeCompare(b.title)
      );
    });
  }, [
    jobs,
    search,
    company,
    category,
    jobType,
    sortBy,
    savedOnly,
    savedIds,
  ]);

  const selected =
    (filtered.find((job) => job.id === selectedId) ??
      filtered[0] ??
      null);

  const mumbaiCount = jobs.filter(
    (job) => job.location === "Mumbai"
  ).length;

  const naviCount = jobs.filter(
    (job) => job.location === "Navi Mumbai"
  ).length;

  const activeFilters = [
    company !== "All",
    category !== "All",
    jobType !== "All",
    savedOnly,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setCompany("All");
    setCategory("All");
    setJobType("All");
    setSavedOnly(false);
    setSortBy("company");
  }

  return (
    <main className="min-h-screen bg-[#f8f6f5] text-[#24141b]">
      {/* Premium hero */}
      <section className="relative isolate overflow-hidden bg-[#490018] pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
        <div className="pointer-events-none absolute -right-24 -top-40 h-[460px] w-[460px] rounded-full bg-[#a51d4c]/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-240px] left-1/4 h-[420px] w-[420px] rounded-full bg-[#a85164]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-wide text-[#ffe6ed] backdrop-blur">
            <Sparkles size={14} />
            PRIME DIGITAL SCHOOL CAREERS HUB
          </div>

          <div className="mt-7 max-w-[820px]">
            <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[60px]">
              Your next career move
              <span className="block text-[#f8b8c9]">
                starts right here.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Discover opportunities across Mumbai and Navi Mumbai,
              sourced from official employer career websites.
              Explore roles and apply directly with the company.
            </p>
          </div>

          <div className="mt-9 max-w-[1020px] rounded-[22px] border border-white/20 bg-white p-2 shadow-[0_25px_65px_rgba(14,0,8,0.25)]">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-4 text-[#8d8090]">
                <Search size={20} className="shrink-0 text-[#8e0030]" />
                <input
                  aria-label="Search vacancies"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, skills, keyword or company"
                  className="w-full bg-transparent text-sm text-[#24141b] outline-none placeholder:text-slate-400"
                />
                {search && (
                  <button
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-[#8e0030]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <a
                href="#browse-jobs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#890026] px-7 text-sm font-bold text-white transition hover:bg-[#65001d]"
              >
                Explore Jobs
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-9 gap-y-4 text-sm">
            <div>
              <span className="text-2xl font-bold">{jobs.length}</span>
              <span className="ml-2 text-white/65">Discovered listings</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{mumbaiCount}</span>
              <span className="ml-2 text-white/65">Mumbai</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{naviCount}</span>
              <span className="ml-2 text-white/65">Navi Mumbai</span>
            </div>
          </div>
        </div>
      </section>

      <div
        id="browse-jobs"
        className="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-10 sm:px-6 lg:px-10"
      >
        {/* Section heading */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9a2547]">
              Explore opportunities
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Find a role that fits you.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse available listings and explore opportunities
              on official company career sites.
            </p>
          </div>

          <span className="rounded-full border border-[#e9dfe2] bg-white px-4 py-2 text-xs font-medium text-slate-500">
            Last checked: {checkedAt}
          </span>
        </div>

        {/* Filter toolbar */}
        <div className="rounded-[22px] border border-[#eae2e4] bg-white p-4 shadow-[0_8px_30px_rgba(50,20,30,0.035)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <SlidersHorizontal size={17} className="text-[#8d0028]" />
              Refine your search
              {activeFilters > 0 && (
                <span className="rounded-full bg-[#fff0f4] px-2 py-0.5 text-[11px] text-[#8d0028]">
                  {activeFilters}
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-[#8d0028] hover:underline"
            >
              Reset filters
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              aria-label="Company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className={fieldStyle}
            >
              <option value="All">All companies</option>
              {sources.map((source) => (
                <option key={source.key} value={source.key}>
                  {source.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Industry"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as "All" | MumbaiJobCategory
                )
              }
              className={fieldStyle}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All industries" : item}
                </option>
              ))}
            </select>

            <select
              aria-label="Employment type"
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
              className={fieldStyle}
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All employment types" : item}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort jobs"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className={fieldStyle}
            >
              <option value="company">Sort by company</option>
              <option value="title">Sort by job title</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e9eb] pt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">
                {filtered.length} matching jobs
              </span>

              <button
                onClick={() => setSavedOnly(!savedOnly)}
                className={
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition " +
                  (savedOnly
                    ? "border-[#890026] bg-[#890026] text-white"
                    : "border-[#eadfe3] bg-white text-slate-600 hover:border-[#890026]")
                }
              >
                <Bookmark size={14} />
                Saved ({savedIds.length})
              </button>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-[#890026]" />
              Official employer sources
            </span>
          </div>
        </div>

        {/* Main two-panel board */}
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(340px,0.88fr)_minmax(0,1.12fr)]">
          <section aria-label="Job listings" className="space-y-3 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
            {filtered.length === 0 && (
              <div className="rounded-[22px] border border-[#eae2e4] bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#890026]">
                  <Search size={27} />
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  No matching jobs found
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Try broadening your search or changing the filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#890026] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}

            {filtered.map((job) => {
              const active = selected?.id === job.id;
              const isSaved = savedIds.includes(job.id);

              return (
                <article
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  aria-label={"View details for " + job.title}
                  aria-pressed={active}
                  onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest("a,button")) return;
                    setSelectedId(job.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(job.id);
                    }
                  }}
                  className={
                    "group relative cursor-pointer overflow-hidden rounded-[20px] border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(65,0,25,0.08)] " +
                    (active
                      ? "border-[#a72c4e] shadow-[0_10px_30px_rgba(65,0,25,0.075)]"
                      : "border-[#eae2e4] shadow-sm")
                  }
                >
                  {active && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#890026]" />
                  )}

                  <div className="flex items-start gap-3">
                    <CompanyLogo name={job.company} />

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setSelectedId(job.id)}
                        className="text-left text-[15px] font-bold leading-snug text-[#2b1720] transition hover:text-[#92002d]"
                      >
                        {job.title}
                      </button>

                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Building2 size={13} />
                        {job.company}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={isSaved ? "Unsave job" : "Save job"}
                      aria-pressed={isSaved}
                      onClick={() => toggleSaved(job.id)}
                      className={
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition " +
                        (isSaved
                          ? "bg-[#fff0f4] text-[#890026]"
                          : "text-slate-400 hover:bg-[#fff0f4] hover:text-[#890026]")
                      }
                    >
                      <Bookmark
                        size={18}
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f5f5] px-3 py-1.5 text-[11px] font-medium text-slate-600">
                      <MapPin size={12} />
                      {job.location}
                    </span>
                    <span className="rounded-full bg-[#f7f5f5] px-3 py-1.5 text-[11px] font-medium text-slate-600">
                      {job.type}
                    </span>
                    <span className="rounded-full bg-[#fff0f4] px-3 py-1.5 text-[11px] font-medium text-[#92002d]">
                      {job.category}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f2ebed] pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedId(job.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#890026] hover:underline"
                    >
                      View details
                      <ArrowRight size={14} />
                    </button>

                    <a
                      href={job.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#890026] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#65001d]"
                    >
                      Apply Now
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </section>

          <aside
            aria-label="Selected job details"
            className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2"
          >
            {selected ? (
              <div className="overflow-hidden rounded-[24px] border border-[#eae2e4] bg-white shadow-[0_14px_45px_rgba(55,20,35,0.055)]">
                <div className="h-2 bg-gradient-to-r from-[#67001e] via-[#a32950] to-[#df9aaf]" />

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <CompanyLogo name={selected.company} />
                  </div>

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#9e3454]">
                    Opportunity details
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-[#28131d] sm:text-[32px]">
                    {selected.title}
                  </h2>

                  <p className="mt-3 text-base font-semibold text-[#890026]">
                    {selected.company}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8f6f6] px-3 py-2 text-xs text-slate-600">
                      <MapPin size={14} />
                      {selected.location}
                    </span>
                    <span className="rounded-lg bg-[#f8f6f6] px-3 py-2 text-xs text-slate-600">
                      {selected.type}
                    </span>
                    <span className="rounded-lg bg-[#f8f6f6] px-3 py-2 text-xs text-slate-600">
                      {selected.category}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <a
                      href={selected.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#890026] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(137,0,38,0.2)] transition hover:bg-[#65001d]"
                    >
                      Apply on company site
                      <ArrowUpRight size={17} />
                    </a>

                    <a
                      href={
                        "/job-connect/" +
                        encodeURIComponent(selected.id)
                      }
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e7d9de] bg-white px-5 py-3 text-sm font-bold text-[#890026] transition hover:bg-[#fff4f7]"
                    >
                      Full job page
                      <ArrowRight size={17} />
                    </a>
                  </div>

                  <div className="mt-8 border-t border-[#f0e9eb] pt-7">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold">
                      <BriefcaseBusiness size={18} className="text-[#890026]" />
                      About this opportunity
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      This role was discovered from an official
                      employer career source. View the full listing
                      to explore responsibilities, qualifications,
                      eligibility and salary details where provided.
                    </p>

                    <div className="mt-6 grid gap-4 rounded-2xl bg-[#faf7f7] p-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Company
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {selected.company}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Location
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {selected.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Employment
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {selected.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Posted date
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {selected.postedDate || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-[#f0e2e6] bg-[#fff9fa] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-[#890026]"
                      />
                      <div>
                        <p className="text-xs font-bold">
                          Apply through the official employer
                        </p>
                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          Discovery status does not confirm
                          vacancy availability. Check the official
                          listing for current location and application
                          requirements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a
                      href={selected.careerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#890026] hover:underline"
                    >
                      Explore company careers
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={() => toggleSaved(selected.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#890026] hover:underline"
                    >
                      {savedIds.includes(selected.id) ? (
                        <Check size={15} />
                      ) : (
                        <Bookmark size={15} />
                      )}
                      {savedIds.includes(selected.id)
                        ? "Saved"
                        : "Save this job"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#eae2e4] bg-white p-10 text-center text-sm text-slate-500">
                Select a job to explore its details.
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}