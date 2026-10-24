import "server-only";

import { getDatabase } from "@/lib/mongodb";

import {
  getMumbaiJobs,
  type MumbaiJob,
} from "@/lib/mumbai-jobs";

type StoredJob = MumbaiJob & {
  firstSeenAt: Date;
  lastSeenAt: Date;
  lastSyncAt: Date;
};

const LEGACY = "mumbai_job_listings";
const GLOBAL = "job_listings";

function validatedJob(job: MumbaiJob): MumbaiJob | null {
  if (
    !/^[a-zA-Z0-9_-]{1,150}$/.test(job.id) ||
    !job.title?.trim() ||
    !job.company?.trim() ||
    !["Mumbai", "Navi Mumbai"].includes(job.location)
  ) {
    return null;
  }

  try {
    const url = new URL(job.officialUrl);
    const career = new URL(job.careerUrl);

    if (
      url.protocol !== "https:" ||
      career.protocol !== "https:"
    ) {
      return null;
    }

    return {
      ...job,
      officialUrl: url.toString(),
      careerUrl: career.toString(),
    };
  } catch {
    return null;
  }
}

export async function syncMumbaiJobsToDatabase() {
  const discovered = await getMumbaiJobs();
  const db = await getDatabase();

  const legacy = db.collection<StoredJob>(LEGACY);
  const global = db.collection(GLOBAL);

  await legacy.createIndex(
    { companyKey: 1, officialUrl: 1 },
    { unique: true }
  );

  await global.createIndex(
    { id: 1 },
    { unique: true }
  );

  const unique = new Map<string, MumbaiJob>();

  for (const item of discovered) {
    const job = validatedJob(item);

    if (!job) continue;

    unique.set(
      `${job.companyKey}|${job.officialUrl}`,
      job
    );
  }

  const jobs = [...unique.values()];
  const now = new Date();

  let inserted = 0;
  let updated = 0;
  let globalInserted = 0;
  let globalUpdated = 0;

  for (let i = 0; i < jobs.length; i += 100) {
    const batch = jobs.slice(i, i + 100);

    const legacyResult = await legacy.bulkWrite(
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

    inserted += legacyResult.upsertedCount;
    updated += legacyResult.modifiedCount;

    const globalResult = await global.bulkWrite(
      batch.map((job) => ({
        updateOne: {
          filter: { id: job.id },
          update: {
            $set: {
              title: job.title,
              company: job.company,
              companyKey: job.companyKey,
              category: job.category,
              type: job.type,

              location: job.location,
              city: job.location,
              state: "Maharashtra",
              country: "India",
              countryCode: "IN",
              locationLabel:
                `${job.location}, Maharashtra, India`,

              officialUrl: job.officialUrl,
              careerUrl: job.careerUrl,
              postedDate: job.postedDate ?? null,

              lastSeenAt: now,
              lastSyncAt: now,
            },
            $setOnInsert: {
              id: job.id,
              firstSeenAt: now,
              lastVerifiedAt: null,
              status: "unverified",
              workMode: "unknown",
              experienceLevel: "unknown",
              experienceMinYears: null,
              experienceMaxYears: null,
              salaryMin: null,
              salaryMax: null,
              salaryCurrency: null,
              salaryPeriod: "unknown",
              skills: [],
              visaSponsorship: "unknown",
              sourceId: job.companyKey,
              sourceJobId: null,
              remoteEligibleCountries: [],
              workAuthorization: null,
            },
          },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    globalInserted += globalResult.upsertedCount;
    globalUpdated += globalResult.modifiedCount;
  }

  return {
    discovered: jobs.length,
    inserted,
    updated,
    totalStored: await legacy.countDocuments(),
    global: {
      inserted: globalInserted,
      updated: globalUpdated,
      totalStored: await global.countDocuments(),
    },
    completedAt: now.toISOString(),
  };
}

export async function getStoredMumbaiJobs():
  Promise<MumbaiJob[]> {
  const db = await getDatabase();
  const collection = db.collection<StoredJob>(LEGACY);

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

  const reviewCutoff =
    Date.now() - 7 * 24 * 60 * 60 * 1000;

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