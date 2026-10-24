import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDatabase } from "@/lib/mongodb";
import type { JobListing } from "@/lib/jobs/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

async function findJob(id: string): Promise<JobListing | null> {
  if (!/^[a-zA-Z0-9_-]{1,150}$/.test(id)) {
    return null;
  }

  const db = await getDatabase();

  const job = await db
    .collection<JobListing>("job_listings")
    .findOne({ id }, { projection: { _id: 0 } });

  if (
    !job ||
    job.locationReviewStatus === "needs-review" ||
    job.status === "closed" ||
    job.status === "expired"
  ) {
    return null;
  }

  return job;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await findJob(id);

  if (!job) {
    return {
      title: "Job Not Found | Prime Digital School",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const location =
    job.locationLabel || job.location || "Location not specified";

  return {
    title: `${job.title} | ${job.company} | Prime Digital School`,
    description: `Explore ${job.title} at ${job.company} in ${location}.`,
    alternates: {
      canonical: `/job-connect/${encodeURIComponent(id)}`,
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await findJob(id);

  if (!job) {
    notFound();
  }

  const location =
    job.locationLabel || job.location || "Location not specified";

  const destination = (() => {
    try {
      const url = new URL(job.officialUrl);

      return url.protocol === "https:" ? url.toString() : null;
    } catch {
      return null;
    }
  })();

  const workMode =
    job.workMode && job.workMode !== "unknown" ? job.workMode : null;

  const experienceLevel =
    job.experienceLevel && job.experienceLevel !== "unknown"
      ? job.experienceLevel
      : null;

  return (
    <main className="min-h-screen bg-[#f8f6f4] px-4 pb-12 pt-32">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/job-connect"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8f0024] transition hover:text-[#65001d]"
        >
          ← Back to all jobs
        </Link>

        <article className="mt-6 rounded-2xl border border-[#eadfe2] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8f0024]">
            Prime Digital School Careers Hub
          </p>

          <h1 className="mt-4 text-3xl font-black text-slate-950">
            {job.title}
          </h1>

          <p className="mt-3 text-lg font-semibold text-slate-700">
            {job.company}
          </p>

          <p className="mt-2 text-sm text-slate-500">{location}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[job.category, job.type].map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#fff0f4] px-3 py-2 text-xs font-bold text-[#8f0024]"
              >
                {item}
              </span>
            ))}

            {workMode && (
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold capitalize text-slate-700">
                {workMode}
              </span>
            )}

            {experienceLevel && (
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold capitalize text-slate-700">
                {experienceLevel} level
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {destination ? (
              <a
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#8f0024] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#65001d]"
              >
                Apply on employer website ↗
              </a>
            ) : (
              <p className="text-sm text-red-700">
                An official application link is unavailable.
              </p>
            )}
          </div>

          <section className="mt-9 border-t border-[#f0e8ea] pt-7">
            <h2 className="text-lg font-black text-slate-900">
              Job information
            </h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Company</dt>
                <dd className="font-semibold text-slate-900">{job.company}</dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">Location</dt>
                <dd className="font-semibold text-slate-900">{location}</dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">Industry</dt>
                <dd className="font-semibold text-slate-900">{job.category}</dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">Employment type</dt>
                <dd className="font-semibold text-slate-900">{job.type}</dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">Date posted</dt>
                <dd className="font-semibold text-slate-900">
                  {job.postedDate || "Not provided"}
                </dd>
              </div>

              {workMode && (
                <div>
                  <dt className="text-xs text-slate-500">Work mode</dt>
                  <dd className="font-semibold capitalize text-slate-900">
                    {workMode}
                  </dd>
                </div>
              )}

              {experienceLevel && (
                <div>
                  <dt className="text-xs text-slate-500">Experience level</dt>
                  <dd className="font-semibold capitalize text-slate-900">
                    {experienceLevel}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="mt-8 rounded-xl border border-[#f1e3e7] bg-[#fff6f8] p-5">
            <h2 className="text-sm font-black text-slate-900">
              Before you apply
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The complete job description, qualifications and application
              requirements must be checked on the employer&apos;s official
              listing. This vacancy may have changed or closed since it was
              discovered.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
