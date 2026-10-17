"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  MapPin,
  RefreshCw,
  SearchX,
} from "lucide-react";

type PlacementJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  officialUrl: string;
  postedDate: string | null;
};

type PlacementResponse = {
  courses: string[];
  matchingCourses: string[];
  jobs: PlacementJob[];
  internships: PlacementJob[];
  total: number;
  message: string;
  error?: string;
};

const readiness = [
  ["Resume", "Prepare your latest resume"],
  ["LinkedIn profile", "Complete your professional profile"],
  ["Portfolio", "Add your course projects"],
  ["Mock interviews", "Practice interview questions"],
  ["Aptitude", "Build assessment readiness"],
];

export default function StudentPlacementJobs() {
  const [data, setData] = useState<PlacementResponse | null>(null);
  const [tab, setTab] = useState<"jobs" | "internships">("jobs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student/placement-jobs", {
        credentials: "include",
        cache: "no-store",
      });

      const payload = (await response.json()) as PlacementResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load placement jobs.");
      }

      setData(payload);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load placement jobs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = tab === "jobs" ? data?.jobs || [] : data?.internships || [];

  return (
    <div className="student-reference">
      <header className="sr-header">
        <div>
          <h1>Placement</h1>
          <p className="sr-sub">
            Career preparation and opportunities matched to your enrolled course
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="sr-btn sr-btn-outline"
          disabled={loading}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 rounded-2xl border border-[#eadbdc] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#fff1f4] p-3 text-[#830024]">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9b6b78]">
              Your enrolled course
            </p>
            <h2 className="mt-1 text-base font-bold text-[#3d1020]">
              {loading
                ? "Checking enrollment..."
                : data?.courses.length
                  ? data.courses.join(", ")
                  : "No enrolled course found"}
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-6 text-[#866f77]">
          Suggestions are matched to your recorded enrollment and job titles.
          They are not eligibility or hiring confirmations.
        </p>
      </div>

      <div className="sr-grid sr-grid-main">
        <section className="sr-card">
          <h2 className="font-serif text-xl font-bold">Readiness</h2>

          <div className="mt-4 flex items-center justify-between">
            <p className="sr-note">Career preparation</p>
            <span className="sr-pill sr-pill-gold">Not assessed</span>
          </div>

          <div className="sr-divider" />

          {readiness.map(([name, detail]) => (
            <div
              key={name}
              className="flex items-center gap-3 border-b border-[#f0e7e3] py-3 last:border-0"
            >
              <span className="sr-pill">To do</span>
              <div>
                <strong className="text-xs">{name}</strong>
                <p className="sr-note">{detail}</p>
              </div>
            </div>
          ))}

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#faf6f3] p-4 text-xs text-[#765963]">
            <FileText size={17} />
            Prepare your resume and portfolio before applying.
          </div>
        </section>

        <section className="sr-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold">Matched openings</h2>
              <p className="sr-note mt-2">
                Jobs from the Mumbai & Navi Mumbai Jobs Board
              </p>
            </div>

            <span className="rounded-full bg-[#fff2f5] px-3 py-1.5 text-xs font-bold text-[#850027]">
              {data?.total ?? 0} matches
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("jobs")}
              className="sr-tab"
              data-active={tab === "jobs"}
            >
              Jobs ({data?.jobs.length ?? 0})
            </button>

            <button
              type="button"
              onClick={() => setTab("internships")}
              className="sr-tab"
              data-active={tab === "internships"}
            >
              Internships ({data?.internships.length ?? 0})
            </button>
          </div>

          <div className="sr-divider" />

          {loading ? (
            <p className="sr-note py-8 text-center">
              Matching vacancies to your course...
            </p>
          ) : data?.message ? (
            <div className="py-10 text-center">
              <BookOpen size={30} className="mx-auto text-[#9b7881]" />
              <p className="mt-4 text-sm text-[#765963]">{data.message}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="py-10 text-center">
              <SearchX size={32} className="mx-auto text-[#a7868e]" />
              <h3 className="mt-4 text-sm font-bold">
                No matching {tab === "jobs" ? "jobs" : "internships"} yet
              </h3>
              <p className="sr-note mt-2">
                Relevant openings will appear when they're available
                in our collected job listings.
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
              {visible.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-[#efe4e5] bg-white p-4 transition hover:border-[#cda9b5] hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#fff1f4] p-3 text-[#870025]">
                      <BriefcaseBusiness size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold leading-6 text-[#351622]">
                        {job.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#746670]">
                        <Building2 size={13} />
                        {job.company}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#746670]">
                        <MapPin size={13} />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={job.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#820023] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#65001c]"
                    >
                      Apply on employer site
                      <ArrowUpRight size={14} />
                    </a>

                    <Link
                      href={`/job-connect/${encodeURIComponent(job.id)}`}
                      className="inline-flex items-center rounded-lg border border-[#e8d8dd] px-4 py-2.5 text-xs font-bold text-[#820023] hover:bg-[#fff4f6]"
                    >
                      Full job page
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="sr-note mt-5 border-t border-[#f0e8e8] pt-4">
            Vacancies may change or close. Always verify availability,
            location and eligibility directly with the employer.
          </p>
        </section>
      </div>
    </div>
  );
}