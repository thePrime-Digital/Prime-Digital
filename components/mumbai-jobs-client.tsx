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
import { ALL_JOB_COUNTRIES } from "@/lib/jobs/global-countries";
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

function CareerHeroAnimation() {
  return (
    <div
      aria-label="Animated career opportunities"
      className="relative mx-auto h-[350px] w-full max-w-[450px] select-none sm:h-[380px]"
    >
      <style>{`
        @keyframes pdsCareerFloatOne {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes pdsCareerFloatTwo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        @keyframes pdsCareerFloatThree {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pdsCareerOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pdsCareerEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pds-career-card-one {
          animation: pdsCareerFloatOne 6s ease-in-out infinite;
        }

        .pds-career-card-two {
          animation: pdsCareerFloatTwo 7s ease-in-out infinite;
        }

        .pds-career-card-three {
          animation: pdsCareerFloatThree 5.5s ease-in-out infinite;
        }

        .pds-career-orbit {
          animation: pdsCareerOrbit 65s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .pds-career-card-one,
          .pds-career-card-two,
          .pds-career-card-three,
          .pds-career-orbit {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background geometry */}
      <div
        aria-hidden="true"
        className="absolute inset-[20px] rounded-full border border-white/10"
      />

      <div
        aria-hidden="true"
        className="absolute inset-[55px] rounded-full border border-white/[0.07]"
      />

      <div
        aria-hidden="true"
        className="pds-career-orbit absolute inset-[35px] rounded-full border border-dashed border-white/20"
      >
        <span className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 rounded-full bg-white/70" />
      </div>

      {/* Data Analyst */}
      <div className="pds-career-card-one absolute left-2 top-10 z-10 w-[70%] rounded-2xl border border-white/80 bg-white/95 p-4 text-[#6b0a26] shadow-[0_18px_45px_rgba(30,0,14,0.18)] backdrop-blur-md sm:left-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 19V11" />
              <path d="M10 19V5" />
              <path d="M15 19v-8" />
              <path d="M20 19V8" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-base font-bold">Data Analyst</p>
            <p className="mt-1 text-xs text-[#76646b]">India</p>
          </div>
        </div>
      </div>

      {/* Software Engineer - Primary card */}
      <div className="pds-career-card-two absolute right-0 top-[125px] z-20 w-[88%] rounded-2xl border border-[#f5e9ed] bg-white p-5 text-[#6b0a26] shadow-[0_24px_60px_rgba(30,0,14,0.24)] sm:top-[135px]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <BriefcaseBusiness size={30} strokeWidth={1.7} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold tracking-tight sm:text-xl">
              Software Engineer
            </p>

            <p className="mt-2 text-sm text-[#76646b]">United Kingdom</p>
          </div>

          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#8a0c34]"
          />
        </div>
      </div>

      {/* Digital Marketing */}
      <div className="pds-career-card-three absolute bottom-8 right-2 z-30 w-[78%] rounded-2xl border border-white/80 bg-white/95 px-4 py-4 text-[#6b0a26] shadow-[0_18px_45px_rgba(30,0,14,0.18)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <ArrowUpRight size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold sm:text-base">Digital Marketing</p>
            <p className="mt-1 text-xs text-[#76646b]">Remote Opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [countryCode, setCountryCode] = useState("ALL");
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
  const [availableStates, setAvailableStates] = useState<string[]>([]);

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
  function changeCountry(value: string) {
    if (
      value !== "ALL" &&
      !ALL_JOB_COUNTRIES.some((item) => item.code === value)
    ) {
      return;
    }

    setCountryCode(value);
    setQuickLocation("All");
    setState("All");
    setCity("All");
    setCompany("All");
    setCategory("All");
    setJobType("All");
    setWorkMode("All");
    setPage(1);
    setSelectedKey(null);
    setAvailableCompanies([]);
    setAvailableCities([]);
    setAvailableStates([]);
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
    if (countryCode !== "ALL") qs.set("countryCode", countryCode);
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
          states?: string[];
        }>;
      })
      .then((d) => {
        if (!d.success || abort.signal.aborted) return;
        setAvailableCompanies((d.companies || []).map((x) => [x.key, x.name]));
        setAvailableCities(d.cities || []);
        setAvailableStates(d.states || []);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [pds, state, countryCode]);
  useEffect(() => {
    if (pds || !savedLoaded) return;
    const abort = new AbortController();
    const qs = new URLSearchParams({
      scope: "global",
      page: String(page),
      limit: String(PAGE_SIZE),
      sortBy,
    });
    if (countryCode !== "ALL") qs.set("countryCode", countryCode);
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
    countryCode,
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
    if (!pds && countryCode !== "IN") {
      return [...new Set(availableCities)].sort();
    }

    if (state === "All") return [];

    const region = INDIA_REGIONS.find((r) => r.name === state);

    return [
      ...new Set(
        !pds && availableCities.length ? availableCities : region?.cities || [],
      ),
    ].sort();
  }, [pds, countryCode, state, availableCities]);
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
    !pds && countryCode !== "IN",
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
    <main className="min-h-screen bg-[#f8f7f6] text-[#231c20]">
      {/* CAREERS HERO */}
      <section className="bg-gradient-to-r from-[#97002c] via-[#790021] to-[#510019] text-white">
        <div className="mx-auto max-w-[1600px] px-5 pb-7 pt-28 sm:px-8 sm:pt-32 lg:px-10">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.85fr)]">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-xs text-white/80"
              >
                <a href="/" className="hover:text-white hover:underline">
                  Home
                </a>
                <span>/</span>
                <span className="font-semibold text-white">Careers</span>
              </nav>

              <div className="mt-2 h-0.5 w-9 rounded-full bg-[#e9b24a]" />

              <h1 className="mt-4 text-[30px] font-extrabold tracking-tight sm:text-[38px] lg:text-[42px]">
                Discover your next opportunity
              </h1>

              <p className="mt-2 max-w-[660px] text-sm leading-6 text-white/85 sm:text-base">
                Explore opportunities from leading employers across India and
                beyond, including careers at Prime Digital School.
              </p>
            </div>

            <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-white p-1.5 shadow-[0_14px_35px_rgba(35,0,13,.15)]">
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 text-[#790021]">
                <Search size={19} className="shrink-0" />

                <span className="sr-only">Search jobs</span>

                <input
                  value={search}
                  onChange={(e) => change(setSearch, e.target.value)}
                  placeholder={
                    pds
                      ? "Search PDS jobs or departments"
                      : "Job title, keyword or company"
                  }
                  className="h-11 w-full min-w-0 bg-transparent text-sm text-[#231c20] outline-none placeholder:text-[#8c8589]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => change(setSearch, "")}
                    aria-label="Clear search"
                    className="shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <a
                href="#browse-jobs"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#790021] px-4 text-xs font-bold text-white transition hover:bg-[#5b0019] sm:px-6 sm:text-sm"
              >
                Search Jobs
                <ArrowRight size={16} className="hidden sm:block" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN JOB BOARD */}
      <div
        id="browse-jobs"
        className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-6 sm:px-8 lg:px-10"
      >
        <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_300px]">
          {/* LEFT FILTER SIDEBAR */}
          <aside
            aria-label="Job filters"
            className="rounded-2xl border border-[#eee6e8] bg-white p-5 shadow-[0_4px_24px_rgba(35,0,13,.045)] lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold text-[#790021]">
                <SlidersHorizontal size={20} />
                Filter jobs
              </h2>

              <button
                type="button"
                onClick={() => setMoreFilters((value) => !value)}
                className="rounded-lg border border-[#eadce1] p-2 text-[#790021] lg:hidden"
                aria-label="Toggle job filters"
                aria-expanded={moreFilters}
              >
                <ChevronDown
                  size={17}
                  className={moreFilters ? "rotate-180" : ""}
                />
              </button>
            </div>

            <div
              className={`${moreFilters ? "block" : "hidden"} mt-5 space-y-4 lg:block`}
            >
              {!pds && (
                <label className="block space-y-2">
                  <span className="text-xs font-bold text-[#342a2e]">
                    Location / Country
                  </span>

                  <select
                    value={countryCode}
                    onChange={(e) => changeCountry(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">All Countries</option>

                    {ALL_JOB_COUNTRIES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  {pds || countryCode === "IN"
                    ? "State / UT"
                    : "State / Region"}
                </span>

                <select
                  value={state}
                  onChange={(e) => {
                    change(setState, e.target.value);
                    setCity("All");
                    setQuickLocation("All");
                  }}
                  className={inputClass}
                >
                  <option value="All">All states / regions</option>

                  {(pds || countryCode === "IN"
                    ? INDIA_REGIONS.map((region) => ({
                        code: region.code,
                        name: region.name,
                      }))
                    : availableStates.map((name) => ({
                        code: name,
                        name,
                      }))
                  ).map((region) => (
                    <option key={region.code} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>

              {cities.length > 0 && (
                <label className="block space-y-2">
                  <span className="text-xs font-bold text-[#342a2e]">City</span>

                  <select
                    value={city}
                    onChange={(e) => change(setCity, e.target.value)}
                    className={inputClass}
                  >
                    <option value="All">All cities</option>

                    {cities.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
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

                  {categories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Employment type
                </span>

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
                  ).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Work mode
                </span>

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

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Company
                </span>

                <select
                  value={company}
                  onChange={(e) => change(setCompany, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All companies</option>

                  {companies.map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="border-t border-[#eee7e9] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    if (!pds) changeCountry("ALL");
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#790021] hover:underline"
                >
                  <X size={16} />
                  Reset filters
                </button>
              </div>
            </div>
          </aside>

          {/* CENTRAL JOB LISTINGS */}
          <section className="min-w-0 space-y-4" aria-label="Job opportunities">
            <div className="rounded-2xl border border-[#eee6e8] bg-white p-4 shadow-[0_4px_24px_rgba(35,0,13,.045)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                    {loading && !pds
                      ? "Loading jobs..."
                      : `${total.toLocaleString("en-IN")} jobs found`}
                  </h2>

                  <p className="mt-1 text-xs text-[#786b70]">
                    {pds
                      ? "Official Prime Digital School vacancies"
                      : countryCode === "ALL"
                        ? "Explore opportunities across all countries"
                        : `Opportunities in ${
                            ALL_JOB_COUNTRIES.find(
                              (item) => item.code === countryCode,
                            )?.name ?? "your selected country"
                          }`}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-xs text-[#62565b]">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(e) => change(setSortBy, e.target.value)}
                    className="h-10 max-w-[190px] rounded-lg border border-[#ded6d9] bg-white px-3 text-xs outline-none focus:border-[#790021]"
                  >
                    <option value="recent">
                      {pds ? "Featured first" : "Recently discovered"}
                    </option>
                    <option value="company">Company A-Z</option>
                    <option value="title">Job title A-Z</option>
                    <option value="location">Location A-Z</option>
                  </select>
                </label>
              </div>

              {/* JOB SOURCE TABS */}
              <div
                role="tablist"
                aria-label="Job source"
                className="mt-5 flex gap-5 overflow-x-auto border-b border-[#eee7e9] sm:gap-8"
              >
                {(
                  [
                    ["jobs", "Explore Opportunities"],
                    ["careers", "Prime Digital School Careers"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={tab === value}
                    onClick={() => switchTab(value)}
                    className={`min-h-12 shrink-0 border-b-[3px] px-1 text-xs font-bold transition sm:text-sm ${
                      tab === value
                        ? "border-[#790021] text-[#790021]"
                        : "border-transparent text-[#6d6367] hover:text-[#790021]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#65585d]">
                  <ShieldCheck size={15} className="text-[#790021]" />

                  {pds
                    ? "Official PDS career opportunities"
                    : "Employer career-site links"}
                </span>

                <button
                  type="button"
                  onClick={() => change(setSavedOnly, !savedOnly)}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition ${
                    savedOnly
                      ? "border-[#790021] bg-[#790021] text-white"
                      : "border-[#eadce1] bg-white text-[#790021] hover:bg-[#fff5f8]"
                  }`}
                >
                  <Bookmark size={15} />
                  {savedOnly ? "Showing saved" : "Saved jobs"}
                  <span>({savedCount})</span>
                </button>
              </div>
            </div>

            {error && !pds && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {loading && !pds && (
              <div className="rounded-xl border border-[#eee6e8] bg-white p-5 text-sm text-[#6b6064]">
                Fetching the latest job opportunities...
              </div>
            )}

            {!loading && visible.length === 0 && (
              <div className="rounded-2xl border border-[#eee6e8] bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fbedf1] text-[#790021]">
                  <BriefcaseBusiness size={28} />
                </div>

                <h3 className="mt-5 text-xl font-extrabold">
                  {emptyPds
                    ? "No open roles right now"
                    : "No matching jobs found"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#73696c]">
                  {emptyPds
                    ? "There are currently no published Prime Digital School vacancies. You may still submit your CV for future consideration."
                    : "Try adjusting your search or changing the selected filters."}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
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
                    {pds ? "Explore other jobs" : "Reset filters"}
                  </button>
                </div>
              </div>
            )}

            {/* JOB CARDS */}
            {visible.map((job) => {
              const saved = savedIds.includes(job.key);
              const expanded = selectedKey === job.key;
              const officialUrl = https(job.external?.officialUrl);

              return (
                <article
                  key={job.key}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-[0_4px_22px_rgba(35,0,13,.045)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(35,0,13,.09)] ${
                    expanded
                      ? "border-[#790021]"
                      : "border-[#eee5e8] hover:border-[#d9b8c2]"
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <Logo name={job.company} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedKey(expanded ? null : job.key)
                          }
                          className="text-left text-base font-extrabold leading-6 text-[#231c20] hover:text-[#790021] sm:text-lg"
                        >
                          {job.title}
                        </button>

                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#655b60]">
                          <Building2 size={14} />
                          {job.company}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={saved ? "Unsave job" : "Save job"}
                        aria-pressed={saved}
                        onClick={() => save(job.key)}
                        className="shrink-0 rounded-lg p-2 text-[#790021] hover:bg-[#fff1f5]"
                      >
                        <Bookmark
                          size={20}
                          fill={saved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[job.location, job.type, job.mode, job.category]
                        .filter(Boolean)
                        .map((value, index) => (
                          <span
                            key={`${index}-${value}`}
                            className="inline-flex items-center gap-1 rounded-full bg-[#f7f4f2] px-3 py-1.5 text-[11px] font-medium text-[#625b5e]"
                          >
                            {index === 0 && <Building2 size={12} />}
                            {index === 1 && <BriefcaseBusiness size={12} />}
                            {value}
                          </span>
                        ))}
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6a6064]">
                      {job.pds?.description ||
                        "Explore this opportunity, review the complete job requirements, and apply through the employer's official careers website."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ebed] pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedKey(expanded ? null : job.key)
                        }
                        aria-expanded={expanded}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#790021] hover:underline sm:text-sm"
                      >
                        {expanded ? "Hide details" : "View details"}

                        <ArrowRight
                          size={15}
                          className={expanded ? "rotate-90" : ""}
                        />
                      </button>

                      {job.pds ? (
                        <button
                          type="button"
                          onClick={() => applyPds(job.id)}
                          className={primary}
                        >
                          Apply now
                          <ArrowRight size={14} />
                        </button>
                      ) : officialUrl ? (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={primary}
                        >
                          Apply now
                          <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <a
                          href={`/job-connect/${encodeURIComponent(job.id)}`}
                          className={outline}
                        >
                          View job page
                          <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED JOB DETAILS */}
                  {expanded && (
                    <div className="border-t border-[#eee4e7] bg-[#fdfbfc] p-5 sm:p-6">
                      <h3 className="text-lg font-extrabold text-[#790021]">
                        Opportunity details
                      </h3>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Company", job.company],
                          ["Location", job.location],
                          ["Employment type", job.type],
                          [job.pds ? "Department" : "Industry", job.category],
                          ["Work mode", job.mode || "Not specified"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-xl border border-[#eee6e8] bg-white p-3"
                          >
                            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#91858a]">
                              {label}
                            </dt>

                            <dd className="mt-1 text-sm font-bold text-[#342a2e]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <h4 className="mt-5 text-sm font-extrabold">
                        About this opportunity
                      </h4>

                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#655a5f]">
                        {job.pds?.description ||
                          "Review the official employer listing for the complete responsibilities, experience requirements, eligibility criteria and application details."}
                      </p>

                      {job.pds && (
                        <>
                          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                              [
                                "Experience",
                                job.pds.experience || "Not specified",
                              ],
                              ["Vacancies", String(job.pds.vacancies)],
                              [
                                "Compensation",
                                job.pds.salary || "Not specified",
                              ],
                              ["Deadline", dateLabel(job.pds.deadline)],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="rounded-xl bg-[#f5eff1] p-3"
                              >
                                <dt className="text-xs text-[#766a6e]">
                                  {label}
                                </dt>

                                <dd className="mt-1 text-sm font-bold">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          {[
                            ["Responsibilities", job.pds.responsibilities],
                            ["Requirements", job.pds.requirements],
                          ].map(([heading, value]) =>
                            value ? (
                              <div key={heading} className="mt-5">
                                <h4 className="text-sm font-extrabold">
                                  {heading}
                                </h4>

                                <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-[#655a5f]">
                                  {paragraphs(value).map((line, index) => (
                                    <li key={index}>{line}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null,
                          )}
                        </>
                      )}

                      {job.external && (
                        <div className="mt-5 rounded-xl border border-[#eee1e5] bg-white p-4 text-xs leading-6 text-[#6e6368]">
                          Applications are completed through the employer&apos;s
                          official career website. Please confirm that the
                          vacancy remains open before applying.
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        {job.external && (
                          <a
                            href={`/job-connect/${encodeURIComponent(job.id)}`}
                            className={outline}
                          >
                            Full job page
                            <ArrowRight size={14} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => save(job.key)}
                          className={outline}
                        >
                          {savedIds.includes(job.key) ? (
                            <Check size={14} />
                          ) : (
                            <Bookmark size={14} />
                          )}

                          {savedIds.includes(job.key) ? "Saved" : "Save job"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                aria-label="Job pagination"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eee6e8] bg-white p-4"
              >
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => {
                    setPage((value) => Math.max(1, value - 1));
                    setSelectedKey(null);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#790021] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="text-xs font-semibold text-[#63595e]">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => {
                    setPage((value) => value + 1);
                    setSelectedKey(null);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#790021] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </nav>
            )}
          </section>

          {/* RIGHT CAREER HUB */}
          <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
            <section className="rounded-2xl border border-[#eee6e8] bg-white p-5 shadow-[0_4px_24px_rgba(35,0,13,.045)]">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-[#790021]">
                <BriefcaseBusiness size={18} />
                Featured opportunity
              </h3>

              {visible.length > 0 ? (
                <div className="mt-4 rounded-xl border border-[#ebcf9b] bg-[#fffaf0] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#a86a13]">
                    Explore this role
                  </p>

                  <h4 className="mt-2 text-base font-extrabold">
                    {visible[0].title}
                  </h4>

                  <p className="mt-1 text-xs text-[#6f6468]">
                    {visible[0].company}
                  </p>

                  <p className="mt-2 text-xs text-[#6f6468]">
                    {visible[0].location}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKey(visible[0].key);
                      document.getElementById("browse-jobs")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#790021]"
                  >
                    View opportunity
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#73676b]">
                  Featured opportunities will appear when matching jobs are
                  available.
                </p>
              )}

              <div className="mt-5 border-t border-[#eee7e9] pt-5">
                <h3 className="text-sm font-extrabold">
                  Quick tips for a stronger application
                </h3>

                <ul className="mt-4 space-y-4">
                  {[
                    "Keep your profile and resume up to date",
                    "Use relevant keywords from the job description",
                    "Save interesting jobs for future reference",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-xs leading-5 text-[#61585c]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d9a645] text-[#aa761b]">
                        <Check size={12} />
                      </span>

                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-[#790021] to-[#4c0016] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#f4cad6]">
                Prime Digital School
              </p>

              <h3 className="mt-3 text-xl font-extrabold">
                Build skills for your next career move.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/80">
                Explore professional programmes designed to help you prepare for
                opportunities in the digital economy.
              </p>

              <a
                href="/programs"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#790021] transition hover:bg-[#fff0f5]"
              >
                Explore programmes
                <ArrowRight size={15} />
              </a>
            </section>
          </aside>
        </div>

        {/* ORIGINAL PDS APPLICATION WORKFLOW */}
        {pds && (
          <div className="mt-12">
            <CareerApplicationForm jobs={pdsJobs} />
          </div>
        )}
      </div>
    </main>
  );
}
