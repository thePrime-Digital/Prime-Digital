import "server-only";

import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "mumbai_job_listings";

type JobRecord = {
  id?: string;
  company?: string;
  companyKey?: string;
  title?: string;
  officialUrl?: string;
  firstSeenAt?: Date;
  lastSeenAt?: Date;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ageHours(
  date: Date | undefined,
  now: number,
): number | null {
  if (!date) return null;

  const timestamp = new Date(date).getTime();

  if (!Number.isFinite(timestamp)) return null;

  return Math.max(0, (now - timestamp) / HOUR);
}

export async function getMumbaiJobFreshnessReport() {
  const db = await getDatabase();

  const collection = db.collection<JobRecord>(COLLECTION);

  const records = await collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          id: 1,
          company: 1,
          companyKey: 1,
          title: 1,
          firstSeenAt: 1,
          lastSeenAt: 1,
        },
      },
    )
    .toArray();

  const now = Date.now();

  let recentlyDiscovered = 0;
  let needsRechecking = 0;
  let stale = 0;
  let missingTimestamp = 0;

  const companies = new Map<
    string,
    {
      name: string;
      total: number;
      recent: number;
      recheck: number;
      stale: number;
    }
  >();

  for (const job of records) {
    const hours = ageHours(job.lastSeenAt, now);

    let status: "recent" | "recheck" | "stale";

    if (hours === null) {
      missingTimestamp += 1;
      stale += 1;
      status = "stale";
    } else if (hours <= 48) {
      recentlyDiscovered += 1;
      status = "recent";
    } else if (hours <= 7 * 24) {
      needsRechecking += 1;
      status = "recheck";
    } else {
      stale += 1;
      status = "stale";
    }

    const key = job.companyKey || "unknown";

    const entry = companies.get(key) || {
      name: job.company || key,
      total: 0,
      recent: 0,
      recheck: 0,
      stale: 0,
    };

    entry.total += 1;

    if (status === "recent") entry.recent += 1;
    if (status === "recheck") entry.recheck += 1;
    if (status === "stale") entry.stale += 1;

    companies.set(key, entry);
  }

  const latestSeen = records
    .map((record) =>
      record.lastSeenAt
        ? new Date(record.lastSeenAt).getTime()
        : NaN,
    )
    .filter(Number.isFinite);

  return {
    generatedAt: new Date(now).toISOString(),
    totalStored: records.length,
    recentlyDiscovered,
    needsRechecking,
    stale,
    missingTimestamp,
    lastJobSeenAt: latestSeen.length
      ? new Date(Math.max(...latestSeen)).toISOString()
      : null,
    thresholds: {
      recentHours: 48,
      recheckDays: 7,
    },
    companies: [...companies.values()].sort(
      (a, b) => b.total - a.total,
    ),
    note:
      "Freshness measures when the collector last discovered a listing. It does not independently establish whether the vacancy remains open.",
  };
}

export async function getMumbaiJobStaleCandidates() {
  const db = await getDatabase();

  const collection = db.collection<JobRecord>(COLLECTION);

  const cutoff = new Date(Date.now() - 7 * DAY);

  const candidates = await collection
    .find(
      {
        $or: [
          { lastSeenAt: { $lt: cutoff } },
          { lastSeenAt: { $exists: false } },
        ],
      },
      {
        projection: {
          _id: 0,
          id: 1,
          company: 1,
          companyKey: 1,
          title: 1,
          officialUrl: 1,
          lastSeenAt: 1,
        },
      },
    )
    .sort({ lastSeenAt: 1 })
    .limit(500)
    .toArray();

  return candidates.map((job) => ({
    id: job.id || "",
    company: job.company || "",
    companyKey: job.companyKey || "",
    title: job.title || "",
    officialUrl: job.officialUrl || "",
    lastSeenAt: job.lastSeenAt
      ? new Date(job.lastSeenAt).toISOString()
      : null,
    status: "needs-verification" as const,
  }));
}