import "server-only";
import { getDatabase } from "@/lib/mongodb";
import { getMumbaiJobs, type MumbaiJob } from "@/lib/mumbai-jobs";

type StoredJob = MumbaiJob & {
  firstSeenAt: Date;
  lastSeenAt: Date;
  lastSyncAt: Date;
};

const COLLECTION = "mumbai_job_listings";

export async function syncMumbaiJobsToDatabase() {
  const jobs = await getMumbaiJobs();
  const db = await getDatabase();
  const collection = db.collection<StoredJob>(COLLECTION);

  await collection.createIndex(
    { companyKey: 1, officialUrl: 1 },
    { unique: true }
  );

  const now = new Date();
  const unique = new Map<string, MumbaiJob>();

  for (const job of jobs) {
    try {
      const url = new URL(job.officialUrl);
      if (url.protocol !== "https:") continue;
      unique.set(job.companyKey + "|" + url.href, {
        ...job,
        officialUrl: url.href,
      });
    } catch {
      continue;
    }
  }

  const values = [...unique.values()];
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < values.length; i += 100) {
    const batch = values.slice(i, i + 100);
    const result = await collection.bulkWrite(
      batch.map((job) => ({
        updateOne: {
          filter: {
            companyKey: job.companyKey,
            officialUrl: job.officialUrl,
          },
          update: {
            $set: {
              ...job,
              lastSeenAt: now,
              lastSyncAt: now,
            },
            $setOnInsert: {
              firstSeenAt: now,
            },
          },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    inserted += result.upsertedCount;
    updated += result.modifiedCount;
  }

  return {
    discovered: values.length,
    inserted,
    updated,
    totalStored: await collection.countDocuments(),
    completedAt: now.toISOString(),
  };
}

export async function getStoredMumbaiJobs(): Promise<MumbaiJob[]> {
  const db = await getDatabase();
  const collection = db.collection<StoredJob>(COLLECTION);

  const rows = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ lastSeenAt: -1 })
    .limit(2000)
    .toArray();

  const latestSeenMs = rows.reduce((latest, row) => {
    const value = row.lastSeenAt
      ? new Date(row.lastSeenAt).getTime()
      : NaN;

    return Number.isFinite(value)
      ? Math.max(latest, value)
      : latest;
  }, 0);

  const reviewCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

  function getDiscoveryStatus(lastSeenAt?: Date) {
    const timestamp = lastSeenAt
      ? new Date(lastSeenAt).getTime()
      : NaN;

    if (!Number.isFinite(timestamp)) {
      return "needs-review";
    }

    if (latestSeenMs > 0 && timestamp === latestSeenMs) {
      return "seen-latest-sync";
    }

    if (timestamp < reviewCutoff) {
      return "needs-review";
    }

    return "not-seen-latest-sync";
  }
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    companyKey: row.companyKey,
    category: row.category,
    type: row.type,
    location: row.location,
    officialUrl: row.officialUrl,
    careerUrl: row.careerUrl,
    postedDate: row.postedDate,
    discoveryStatus: getDiscoveryStatus(row.lastSeenAt),
    lastSeenAt: row.lastSeenAt
      ? new Date(row.lastSeenAt).toISOString()
      : undefined,
  }));
}