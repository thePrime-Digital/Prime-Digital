"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock3,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { MumbaiEmployer } from "@/lib/mumbai-jobs";
import type { JobListing } from "@/lib/jobs/types";
import type { PublicCareerJob } from "@/lib/careers/public-careers";
import { INDIA_REGIONS } from "@/lib/jobs/locations";
import CareerApplicationForm from "@/components/careers/career-application-form";

type Tab = "jobs" | "careers";
type Props = {
  jobs: JobListing[];
  initialTotal: number;
  sources: MumbaiEmployer[];
  checkedAt: string;
  pdsJobs?: PublicCareerJob[];
  initialTab?: Tab;
};
type JobsApi = {
  success: boolean;
  jobs?: JobListing[];
  total?: number;
  totalPages?: number;
  error?: string;
};
type DisplayJob = {
  key: string;
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  mode?: string;
  source: Tab;
  external?: JobListing;
  pds?: PublicCareerJob;
};
const PAGE_SIZE = 20;
const STORAGE_KEY = "pds-mumbai-saved-jobs-v1";
const inputClass =
  "h-11 w-full rounded-lg border border-[#d8d4d3] bg-white px-3 text-sm text-[#25212a] outline-none focus:border-[#7d0a2b] focus:ring-2 focus:ring-[#7d0a2b]/10";
const primary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#7d0a2b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#59051f]";
const outline =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm font-semibold text-[#7d0a2b] hover:bg-[#fcf3f6]";
function locationOf(j: JobListing) {
  return (
    j.locationLabel ||
    [j.city, j.state, j.country].filter(Boolean).join(", ") ||
    j.location ||
    "Location not specified"
  );
}
function https(value?: string | null) {
  try {
    if (!value) return null;
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
function normal(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]/g, "");
}
function Logo({ name }: { name: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f9eaf0] font-bold text-[#7d0a2b]">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => x[0] || "")
        .join("")
        .toUpperCase()}
    </span>
  );
}
function dateLabel(value: string | null) {
  if (!value) return "Open until filled";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Open until filled"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}
function paragraphs(value: string) {
  return value
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function MumbaiJobsClient({
  jobs,
  initialTotal,
  sources,
  checkedAt,
  pdsJobs = [],
  initialTab = "jobs",
}: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const pds = tab === "careers";
  const [items, setItems] = useState<JobListing[]>(jobs);
  const [externalTotal, setExternalTotal] = useState(initialTotal);
  const [externalPages, setExternalPages] = useState(
    Math.ceil(initialTotal / PAGE_SIZE),
  );
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [quickLocation, setQuickLocation] = useState("All");
  const [state, setState] = useState("All");
  const [city, setCity] = useState("All");
  const [company, setCompany] = useState("All");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [moreFilters, setMoreFilters] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCompanies, setAvailableCompanies] = useState<
    Array<[string, string]>
  >([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search), 350);
    return () => window.clearTimeout(t);
  }, [search]);
  useEffect(() => {
    try {
      const x: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(x))
        setSavedIds(x.filter((v): v is string => typeof v === "string"));
    } catch {}
    setSavedLoaded(true);
  }, []);
  function save(key: string) {
    setSavedIds((old) => {
      const next = old.includes(key)
        ? old.filter((x) => x !== key)
        : [...old, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function reset() {
    setSearch("");
    setDebounced("");
    setQuickLocation("All");
    setState("All");
    setCity("All");
    setCompany("All");
    setCategory("All");
    setJobType("All");
    setWorkMode("All");
    setSortBy("recent");
    setSavedOnly(false);
    setPage(1);
    setSelectedKey(null);
  }
  function change<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
    setSelectedKey(null);
  }
  function switchTab(next: Tab) {
    if (next === tab) return;
    setTab(next);
    reset();
    setError("");
    const url = new URL(window.location.href);
    if (next === "careers") url.searchParams.set("tab", "careers");
    else url.searchParams.delete("tab");
    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }
  function chooseQuickLocation(value: string) {
    setQuickLocation(value);
    setState("All");
    setCity("All");
    if (value !== "All") {
      const region = INDIA_REGIONS.find((r) => r.cities.includes(value));
      if (region) setState(region.name);
      setCity(value);
    }
    setPage(1);
    setSelectedKey(null);
  }
  function applyPds(id: string) {
    window.dispatchEvent(
      new CustomEvent("career-job-selected", { detail: { jobId: id } }),
    );
    document
      .getElementById("apply")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (pds) return;
    const abort = new AbortController();
    const qs = new URLSearchParams();
    if (state !== "All") qs.set("state", state);
    fetch(`/api/jobs/filter-options?${qs}`, {
      signal: abort.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json() as Promise<{
          success: boolean;
          companies?: Array<{ key: string; name: string }>;
          cities?: string[];
        }>;
      })
      .then((d) => {
        if (!d.success || abort.signal.aborted) return;
        setAvailableCompanies((d.companies || []).map((x) => [x.key, x.name]));
        setAvailableCities(d.cities || []);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [pds, state]);
  useEffect(() => {
    if (pds || !savedLoaded) return;
    const abort = new AbortController();
    const qs = new URLSearchParams({
      scope: "global",
      page: String(page),
      limit: String(PAGE_SIZE),
      sortBy,
    });
    if (state !== "All") qs.set("state", state);
    if (city !== "All") qs.set("city", city);
    if (company !== "All") qs.set("companyKey", company);
    if (category !== "All") qs.set("category", category);
    if (jobType !== "All") qs.set("type", jobType);
    if (workMode !== "All") qs.set("workMode", workMode);
    if (debounced.trim()) qs.set("search", debounced.trim());
    if (savedOnly)
      qs.set(
        "savedIds",
        savedIds.filter((x) => !x.startsWith("pds-career-")).join(","),
      );
    setLoading(true);
    setError("");
    fetch(`/api/jobs?${qs}`, { signal: abort.signal, cache: "no-store" })
      .then(async (r) => {
        const d: JobsApi = await r.json();
        if (!r.ok || !d.success || !Array.isArray(d.jobs))
          throw Error(d.error || "Unable to load jobs");
        return d;
      })
      .then((d) => {
        if (abort.signal.aborted) return;
        setItems(d.jobs || []);
        setExternalTotal(d.total || 0);
        setExternalPages(d.totalPages || 0);
      })
      .catch((e: unknown) => {
        if (abort.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Unable to load jobs");
        setItems([]);
        setExternalTotal(0);
        setExternalPages(0);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [
    pds,
    savedLoaded,
    page,
    state,
    city,
    company,
    category,
    jobType,
    workMode,
    sortBy,
    debounced,
    savedOnly,
    savedIds,
  ]);

  const companies = useMemo(() => {
    if (pds)
      return [["pds", "Prime Digital School"]] as Array<[string, string]>;
    if (availableCompanies.length) return availableCompanies;
    const map = new Map<string, string>();
    for (const s of sources) map.set(s.key, s.name);
    for (const j of jobs) map.set(j.companyKey, j.company);
    return [...map].sort((a, b) => a[1].localeCompare(b[1]));
  }, [pds, availableCompanies, sources, jobs]);
  const categories = useMemo(
    () =>
      pds
        ? [...new Set(pdsJobs.map((x) => x.department))].filter(Boolean).sort()
        : [
            ...new Set([
              "Technology",
              "Banking & Finance",
              "Consulting",
              "Engineering",
              "Consumer & Retail",
              "Media & Internet",
              "Conglomerate",
              ...jobs.map((x) => x.category),
            ]),
          ]
            .filter(Boolean)
            .sort(),
    [pds, pdsJobs, jobs],
  );
  const cities = useMemo(() => {
    if (state === "All") return [];
    const region = INDIA_REGIONS.find((r) => r.name === state);
    return [
      ...new Set(
        !pds && availableCities.length ? availableCities : region?.cities || [],
      ),
    ].sort();
  }, [pds, state, availableCities]);
  const pdsFiltered = useMemo(
    () =>
      pdsJobs
        .filter((j) => {
          const q = debounced.toLowerCase().trim();
          if (
            q &&
            ![
              j.title,
              j.department,
              j.location,
              j.description,
              j.requirements,
              j.responsibilities,
            ].some((v) => v.toLowerCase().includes(q))
          )
            return false;
          if (state !== "All") {
            const region = INDIA_REGIONS.find((r) => r.name === state);
            if (
              !j.location.toLowerCase().includes(state.toLowerCase()) &&
              !region?.cities.some((c) =>
                j.location.toLowerCase().includes(c.toLowerCase()),
              )
            )
              return false;
          }
          if (
            city !== "All" &&
            !j.location.toLowerCase().includes(city.toLowerCase())
          )
            return false;
          if (company !== "All" && company !== "pds") return false;
          if (category !== "All" && j.department !== category) return false;
          if (jobType !== "All" && normal(j.employmentType) !== normal(jobType))
            return false;
          if (workMode !== "All" && normal(j.workMode) !== normal(workMode))
            return false;
          if (savedOnly && !savedIds.includes(`pds-career-${j.id}`))
            return false;
          return true;
        })
        .sort((a, b) =>
          sortBy === "title"
            ? a.title.localeCompare(b.title)
            : sortBy === "location"
              ? a.location.localeCompare(b.location)
              : sortBy === "company"
                ? a.department.localeCompare(b.department)
                : Number(b.featured) - Number(a.featured),
        ),
    [
      pdsJobs,
      debounced,
      state,
      city,
      company,
      category,
      jobType,
      workMode,
      savedOnly,
      savedIds,
      sortBy,
    ],
  );
  const total = pds ? pdsFiltered.length : externalTotal;
  const totalPages = pds ? Math.ceil(total / PAGE_SIZE) : externalPages;
  const visible: DisplayJob[] = pds
    ? pdsFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((j) => ({
        key: `pds-career-${j.id}`,
        id: j.id,
        title: j.title,
        company: "Prime Digital School",
        location: j.location,
        type: j.employmentType,
        category: j.department,
        mode: j.workMode,
        source: "careers",
        pds: j,
      }))
    : items.map((j) => ({
        key: j.id,
        id: j.id,
        title: j.title,
        company: j.company,
        location: locationOf(j),
        type: j.type,
        category: j.category,
        mode: j.workMode,
        source: "jobs",
        external: j,
      }));
  const selected =
    visible.find((x) => x.key === selectedKey) || visible[0] || null;
  const savedCount = savedIds.filter((x) =>
    pds ? x.startsWith("pds-career-") : !x.startsWith("pds-career-"),
  ).length;
  const activeFilters = [
    state !== "All",
    city !== "All",
    company !== "All",
    category !== "All",
    jobType !== "All",
    workMode !== "All",
    savedOnly,
  ].filter(Boolean).length;
  const emptyPds =
    pds && pdsJobs.length === 0 && !savedOnly && !search && !activeFilters;

  return (
    <main className="min-h-screen bg-[#f6f4f2] text-[#1b1b1f]">
      {/* Site-wide Navbar and Footer remain provided by the Next.js layout. */}
      <section className="bg-[#6b0a26] text-white">
        <div className="mx-auto max-w-[1248px] px-5 pb-8 pt-28 sm:px-8 sm:pt-32">
          <div className="flex items-center gap-2 text-xs text-[#f1dce2]">
            <a href="/" className="hover:underline">
              Home
            </a>
            <span>/</span>
            <span className="font-semibold text-white">Careers</span>
          </div>
          <h1 className="mt-4 max-w-[1100px] text-3xl font-bold tracking-tight sm:text-[44px] sm:leading-[1.15]">
            Your next career move starts right here.
          </h1>
          <p className="mt-3 max-w-[1050px] text-base leading-7 text-[#f1dce2]">
            Explore opportunities from leading employers across India and
            discover careers at Prime Digital School.
          </p>
          <div className="mt-6 flex w-full max-w-[900px] flex-col gap-1.5 rounded-xl bg-white p-1.5 shadow-lg sm:flex-row sm:items-stretch">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 px-3 text-[#7d0a2b]">
              <Search size={19} />
              <span className="sr-only">Search jobs</span>
              <input
                value={search}
                onChange={(e) => change(setSearch, e.target.value)}
                placeholder={
                  pds
                    ? "Search PDS jobs or departments"
                    : "Job title, keyword or company"
                }
                className="w-full min-w-0 bg-transparent text-sm text-[#1b1b1f] outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => change(setSearch, "")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <a href="#browse-jobs" className={`${primary} min-h-12 shrink-0 px-6`}>
              Search jobs <ArrowRight size={16} />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#f1dce2]">
            <span>
              <strong className="text-base text-white">{total}</strong> matching
              listings
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" />
            <span>
              <strong className="text-base text-white">
                {pds ? "PDS" : "India"}
              </strong>{" "}
              {pds ? "internal jobs" : "nationwide jobs"}
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" />
            <span>
              <strong className="text-base text-white">{savedCount}</strong>{" "}
              saved jobs
            </span>
          </div>
        </div>
      </section>
      <div className="border-b border-[#e3e1df] bg-white">
        <div className="mx-auto flex max-w-[1248px] flex-wrap items-center justify-between gap-x-5 px-5 sm:px-8">
          <div role="tablist" aria-label="Job source" className="flex gap-7">
            {(
              [
                ["jobs", "Explore Opportunities", externalTotal],
                ["careers", "Prime Digital School Careers", pdsJobs.length],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => switchTab(value)}
                className={`flex min-h-14 items-center gap-2 border-b-[3px] text-sm font-semibold ${tab === value ? "border-[#7d0a2b] text-[#7d0a2b]" : "border-transparent text-[#4b4347] hover:text-[#7d0a2b]"}`}
              >
                {label}
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${tab === value ? "bg-[#7d0a2b] text-white" : "bg-[#f1eeee] text-[#655a5e]"}`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        id="browse-jobs"
        className="mx-auto max-w-[1248px] scroll-mt-28 px-5 pb-12 pt-8 sm:px-8"
      >
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8f1a3a]">
          {pds ? "Prime Digital School Recruitment" : "Explore Opportunities"}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Find a role that fits you.
        </h2>
        <p className="mt-2 text-sm text-[#625d60]">
          {pds
            ? "Browse published job openings at Prime Digital School."
            : "Browse external employer vacancies with nationwide location filters."}
        </p>
        <section
          aria-label="Job filters"
          className="mt-6 rounded-xl border border-[#e4e0de] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal size={16} className="text-[#7d0a2b]" />
              Refine your search
            </h3>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMoreFilters((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-[#7d0a2b]"
              >
                {moreFilters ? "Fewer filters" : "More filters"}
                <ChevronDown
                  size={15}
                  className={moreFilters ? "rotate-180" : ""}
                />
              </button>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-semibold text-[#7d0a2b]"
              >
                Reset filters
              </button>
            </div>
          </div>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-lg border border-[#d8d4d3] px-3 text-[#7d0a2b]">
            <Search size={17} />
            <span className="sr-only">Filter jobs</span>
            <input
              value={search}
              onChange={(e) => change(setSearch, e.target.value)}
              placeholder={
                pds
                  ? "Search PDS jobs, departments or locations"
                  : "Search job title, keyword or company"
              }
              className="w-full bg-transparent text-sm text-[#1b1b1f] outline-none"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1">
              <span className="text-xs text-[#625d60]">State / UT</span>
              <select
                value={state}
                onChange={(e) => {
                  change(setState, e.target.value);
                  setCity("All");
                  setQuickLocation("All");
                }}
                className={inputClass}
              >
                <option value="All">All states / UTs</option>
                {INDIA_REGIONS.map((r) => (
                  <option key={r.code} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#625d60]">City</span>
              <select
                value={city}
                onChange={(e) => change(setCity, e.target.value)}
                className={inputClass}
                disabled={state === "All"}
              >
                <option value="All">All cities</option>
                {cities.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#625d60]">Company</span>
              <select
                value={company}
                onChange={(e) => change(setCompany, e.target.value)}
                className={inputClass}
              >
                <option value="All">All companies</option>
                {companies.map(([k, n]) => (
                  <option key={k} value={k}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#625d60]">
                {pds ? "Department" : "Industry"}
              </span>
              <select
                value={category}
                onChange={(e) => change(setCategory, e.target.value)}
                className={inputClass}
              >
                <option value="All">
                  {pds ? "All departments" : "All industries"}
                </option>
                {categories.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {moreFilters && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs text-[#625d60]">Employment type</span>
                <select
                  value={jobType}
                  onChange={(e) => change(setJobType, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All employment types</option>
                  {(pds
                    ? [
                        "Full Time",
                        "Part Time",
                        "Internship",
                        "Contract",
                        "Freelance",
                      ]
                    : [
                        "Job",
                        "Full-time",
                        "Part-time",
                        "Internship",
                        "Apprenticeship",
                        "Contract",
                        "Temporary",
                      ]
                  ).map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-[#625d60]">Work mode</span>
                <select
                  value={workMode}
                  onChange={(e) => change(setWorkMode, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All work modes</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
              </label>
              <div className="space-y-1">
                <span className="text-xs text-[#625d60]">Country</span>
                <div className={`${inputClass} flex items-center`}>India</div>
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#efeeee] pt-4">
            <div className="flex items-center gap-3">
              <strong className="text-sm">
                {loading && !pds ? "Loading..." : `${total} matching jobs`}
              </strong>
              <button
                type="button"
                onClick={() => change(setSavedOnly, !savedOnly)}
                className={`flex min-h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${savedOnly ? "bg-[#7d0a2b] text-white" : "border-[#d8c9ce] text-[#7d0a2b]"}`}
              >
                <Bookmark size={13} /> Saved ({savedCount})
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#625d60]">
                <ShieldCheck size={13} className="mr-1 inline text-[#7d0a2b]" />
                {pds ? "Official PDS vacancies" : "Employer career-site links"}
              </span>
              <label className="flex items-center gap-2 text-xs text-[#625d60]">
                Sort by
                <select
                  value={sortBy}
                  onChange={(e) => change(setSortBy, e.target.value)}
                  className="h-9 rounded-lg border border-[#d8d4d3] px-2 text-xs"
                >
                  <option value="recent">
                    {pds ? "Featured first" : "Recently discovered"}
                  </option>
                  <option value="company">
                    {pds ? "Department A–Z" : "Company A–Z"}
                  </option>
                  <option value="title">Job title A–Z</option>
                  <option value="location">Location A–Z</option>
                </select>
              </label>
            </div>
          </div>
          {error && !pds && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
        {visible.length === 0 && !loading ? (
          <div className="mt-5 rounded-xl border border-[#e4e0de] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f9eaf0] text-[#7d0a2b]">
              <BriefcaseBusiness size={28} />
            </div>
            <h3 className="mt-5 text-xl font-bold">
              {emptyPds ? "No open roles right now" : "No matching jobs found"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#625d60]">
              {emptyPds
                ? "There are no published Prime Digital School vacancies at the moment. You can send us your CV for future consideration."
                : "Try changing your filters or searching for a different role."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              {pds && (
                <a href="#apply" className={primary}>
                  Send your CV
                </a>
              )}
              <button
                type="button"
                onClick={pds ? () => switchTab("jobs") : reset}
                className={outline}
              >
                {pds ? "Browse Job Board" : "Reset filters"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <section
              aria-label="Job listings"
              className="space-y-3 lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto lg:pr-2"
            >
              {visible.map((j) => {
                const saved = savedIds.includes(j.key);
                const active = selected?.key === j.key;
                const url = https(j.external?.officialUrl);
                return (
                  <article
                    key={j.key}
                    onClick={() => setSelectedKey(j.key)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${j.title} at ${j.company}`}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;

                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedKey(j.key);
                      }
                    }}
                    className={`cursor-pointer rounded-[18px] border bg-white p-5 transition-all duration-200 hover:border-[#7d0a2b] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d0a2b] ${
                      active
                        ? "border-[#7d0a2b] shadow-md"
                        : "border-[#eadfda] shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Logo name={j.company} />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          className="text-left text-sm font-bold hover:text-[#7d0a2b]"
                          onClick={() => setSelectedKey(j.key)}
                        >
                          {j.title}
                        </button>
                        <p className="mt-1 text-xs text-[#625d60]">
                          {j.company}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={saved ? "Unsave job" : "Save job"}
                        aria-pressed={saved}
                        onClick={(event) => {
                          event.stopPropagation();
                          save(j.key);
                        }}
                        className="p-2 text-[#7d0a2b]"
                      >
                        <Bookmark
                          size={18}
                          fill={saved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[j.location, j.type, j.category]
                        .filter(Boolean)
                        .map((v, i) => (
                          <span
                            key={`${v}-${i}`}
                            className="rounded bg-[#f6f4f2] px-2 py-1 text-[11px] text-[#625d60]"
                          >
                            {v}
                          </span>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0eeee] pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedKey(j.key)}
                        className="flex min-h-10 items-center gap-1 text-xs font-semibold text-[#7d0a2b]"
                      >
                        View details <ArrowRight size={13} />
                      </button>
                      {j.pds ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            applyPds(j.id);
                          }}
                          className={outline}
                        >
                          Apply now <ArrowRight size={13} />
                        </button>
                      ) : url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className={outline}
                        >
                          Apply now <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <span className="text-xs text-[#625d60]">
                          Link unavailable
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
              {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-[#e4e0de] bg-white p-3">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => {
                      setPage((v) => Math.max(1, v - 1));
                      setSelectedKey(null);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-[#7d0a2b] disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-xs">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => {
                      setPage((v) => v + 1);
                      setSelectedKey(null);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-[#7d0a2b] disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
            <aside
              aria-label="Selected job details"
              className="overflow-hidden rounded-xl border border-[#e4e0de] bg-white lg:sticky lg:top-24 lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto"
            >
              {selected ? (
                <>
                  <div className="h-1 bg-[#7d0a2b]" />
                  <div className="p-5 sm:p-6">
                    <div className="flex gap-3">
                      <Logo name={selected.company} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8f1a3a]">
                          Opportunity details
                        </p>
                        <h3 className="mt-2 text-2xl font-bold">
                          {selected.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-[#7d0a2b]">
                          <Building2 size={15} />
                          {selected.company}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {selected.pds ? (
                        <button
                          type="button"
                          onClick={() => applyPds(selected.id)}
                          className={primary}
                        >
                          Apply to PDS <ArrowRight size={14} />
                        </button>
                      ) : https(selected.external?.officialUrl) ? (
                        <a
                          href={https(selected.external?.officialUrl)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={primary}
                        >
                          Apply on company site <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span className="text-sm text-[#625d60]">
                          Application URL unavailable
                        </span>
                      )}
                      {selected.external && (
                        <a
                          href={`/job-connect/${encodeURIComponent(selected.id)}`}
                          className={outline}
                        >
                          Full job page <ArrowRight size={14} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => save(selected.key)}
                        className={outline}
                      >
                        {savedIds.includes(selected.key) ? (
                          <Check size={14} />
                        ) : (
                          <Bookmark size={14} />
                        )}{" "}
                        Save
                      </button>
                    </div>
                    <dl className="mt-5 overflow-hidden rounded-lg border border-[#e4e0de] text-sm">
                      {[
                        ["Company", selected.company],
                        ["Location", selected.location],
                        ["Employment type", selected.type],
                        [
                          selected.pds ? "Department" : "Industry",
                          selected.category,
                        ],
                      ].map(([label, value], i) => (
                        <div
                          key={label}
                          className={`grid grid-cols-[38%_62%] gap-2 px-3 py-2.5 ${i % 2 ? "bg-white" : "bg-[#f8f7f6]"}`}
                        >
                          <dt className="text-[#625d60]">{label}</dt>
                          <dd className="font-semibold">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <h4 className="mt-6 text-sm font-bold">
                      About this opportunity
                    </h4>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#625d60]">
                      {selected.pds?.description ||
                        "Review the complete employer listing for responsibilities, eligibility, salary and application status."}
                    </p>
                    {selected.pds && (
                      <>
                        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f8f7f6] p-4 text-xs">
                          {[
                            [
                              "Experience",
                              selected.pds.experience || "Not specified",
                            ],
                            ["Vacancies", String(selected.pds.vacancies)],
                            [
                              "Compensation",
                              selected.pds.salary || "Not specified",
                            ],
                            ["Deadline", dateLabel(selected.pds.deadline)],
                          ].map(([l, v]) => (
                            <div key={l}>
                              <dt className="text-[#625d60]">{l}</dt>
                              <dd className="mt-1 font-bold">{v}</dd>
                            </div>
                          ))}
                        </dl>
                        {[
                          ["Responsibilities", selected.pds.responsibilities],
                          ["Requirements", selected.pds.requirements],
                        ].map(([heading, value]) =>
                          value ? (
                            <div key={heading} className="mt-5">
                              <h4 className="text-sm font-bold">{heading}</h4>
                              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#625d60]">
                                {paragraphs(value).map((line, i) => (
                                  <li key={i}>{line}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null,
                        )}
                      </>
                    )}
                    {selected.external && (
                      <div className="mt-5 rounded-lg border border-[#e4e0de] bg-[#f8f7f6] p-3 text-xs leading-5 text-[#625d60]">
                        You will complete your application on the
                        employer&apos;s career site. Please confirm the vacancy
                        is still open before applying.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-sm text-[#625d60]">
                  Select a job to see details.
                </div>
              )}
            </aside>
          </div>
        )}
        {pds && (
          <div className="mt-14">
            <CareerApplicationForm jobs={pdsJobs} />
          </div>
        )}
        <p className="mt-8 text-xs leading-5 text-[#747076]">
          * The displayed time is the page render time, not a confirmation that
          individual vacancies remain open. External listings should be verified
          on the employer website.
        </p>
      </div>
    </main>
  );
}
