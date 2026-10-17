import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import type { MumbaiJob } from "@/lib/mumbai-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

async function findJob(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,150}$/.test(id)) return null;

  const db = await getDatabase();

  return db.collection<MumbaiJob>("mumbai_job_listings").findOne(
    { id },
    { projection: { _id: 0 } }
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await findJob(id);

  if (!job) {
    return {
      title: "Job Not Found | Prime Digital School",
      robots: { index: false },
    };
  }

  return {
    title: `${job.title} | ${job.company} | Prime Digital School`,
    description: `Explore ${job.title} at ${job.company} in ${job.location}.`,
    alternates: {
      canonical: `/mumbai-jobs/${encodeURIComponent(id)}`,
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await findJob(id);

  if (!job) notFound();

  const destination = (() => {
    try {
      const url = new URL(job.officialUrl);
      return url.protocol === "https:" ? url.toString() : null;
    } catch {
      return null;
    }
  })();

  return (
    <main className="min-h-screen bg-[#f8f6f4] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/mumbai-jobs"
          className="text-sm font-bold text-[#8f0024]"
        >
          ← Back to all jobs
        </Link>

        <article className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8f0024]">
            Prime Digital School Careers Hub
          </p>

          <h1 className="mt-4 text-3xl font-black text-slate-950">
            {job.title}
          </h1>

          <p className="mt-3 text-lg font-semibold text-slate-700">
            {job.company}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {job.location}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[job.category, job.type].map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#fff0f4] px-3 py-2 text-xs font-bold text-[#8f0024]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {destination ? (
              <a
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#8f0024] px-6 py-3 text-sm font-bold text-white"
              >
                Apply on employer website ↗
              </a>
            ) : (
              <p className="text-sm text-red-700">
                An official application link is unavailable.
              </p>
            )}
          </div>

          <section className="mt-9 border-t pt-7">
            <h2 className="text-lg font-black">
              Job information
            </h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Company</dt>
                <dd className="font-semibold">{job.company}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Location</dt>
                <dd className="font-semibold">{job.location}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Industry</dt>
                <dd className="font-semibold">{job.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Employment type</dt>
                <dd className="font-semibold">{job.type}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Date posted</dt>
                <dd className="font-semibold">
                  {job.postedDate || "Not provided"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-8 rounded-xl bg-[#fff6f8] p-5">
            <h2 className="text-sm font-black">
              Before you apply
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The complete job description, qualifications and
              application requirements must be checked on the
              employer's official listing. This vacancy may have
              changed or closed since it was discovered.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}