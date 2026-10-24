import fs from "node:fs/promises";
import { MongoClient, BSON } from "mongodb";

const APPLY = process.env.PDS_PUBLISH_APPLY === "YES";
const dbName = "prime-digital-school";
const MAX_BATCH = 1169;

const INDIA = /\bindia\b|\bbangalore\b|\bbengaluru\b|\bmumbai\b|\bpune\b|\bhyderabad\b|\bchennai\b|\bdelhi\b|\bnoida\b|\bgurugram\b|\bgurgaon\b|\bkolkata\b|\bahmedabad\b|\bjaipur\b|\bkochi\b|\bchandigarh\b|\bindore\b|\bgandhinagar\b|\bcoimbatore\b|\blucknow\b|\bsurat\b|\bvadodara\b|\bnagpur\b|\bmysuru\b|\bvisakhapatnam\b|\bthiruvananthapuram\b/i;

const HOSTS = new Set([
  "job-boards.greenhouse.io",
  "boards.greenhouse.io",
  "jobs.lever.co",
  "jobs.eu.lever.co",
  "jobs.ashbyhq.com"
]);

function urlKey(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return "";
    return u.hostname.toLowerCase() +
      u.pathname.replace(/\/+$/, "").toLowerCase();
  } catch {
    return "";
  }
}

function safeJob(job) {
  if (!job.id || !job.sourceId ||
      !job.company || !job.title ||
      !job.location || !job.officialUrl) return false;

  if (!job.verifiedAt ||
      job.reviewStatus !== "pending-manual-review" ||
      job.publicationStatus !== "not-published" ||
      job.auditStatus !== "candidate-for-review") return false;

  if (!INDIA.test(String(job.location))) return false;

  try {
    const u = new URL(job.officialUrl);
    return u.protocol === "https:" &&
      HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000
});

const counts = {
  stagedRecords: 0,
  verifiedEligible: 0,
  skippedUnverified: 0,
  skippedDuplicates: 0,
  published: 0,
  errors: 0
};

const errors = [];

try {
  await client.connect();

  const db = client.db(dbName);
  const live = db.collection("job_listings");
  const staging = db.collection("job_listing_import_staging");

  const stagedJobs = await staging.find({}).toArray();
  counts.stagedRecords = stagedJobs.length;

  const eligible = stagedJobs.filter(safeJob);
  counts.verifiedEligible = eligible.length;
  counts.skippedUnverified =
    stagedJobs.length - eligible.length;

  if (eligible.length > MAX_BATCH) {
    throw Error(
      "More verified records than expected. Aborting for safety."
    );
  }

  const existingLive = await live.find({}).toArray();

  console.log("\nPRE-PUBLISH STATUS");
  console.table({
    existingLive: existingLive.length,
    staged: stagedJobs.length,
    eligibleToPublish: eligible.length,
    heldForReview: counts.skippedUnverified
  });

  if (existingLive.length !== 138) {
    throw Error(
      "Live job count changed from 138. Review before publishing."
    );
  }

  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, "-");

  await fs.writeFile(
    `backups/PDS_Live_Jobs_PrePublish_${stamp}.json`,
    BSON.EJSON.stringify(existingLive, null, 2),
    "utf8"
  );

  const backupPath =
    `backups/PDS_Live_Jobs_PrePublish_${stamp}.json`;

  console.log("Backup saved:", backupPath);

  const knownIds = new Set();
  const knownUrls = new Set();

  for (const row of existingLive) {
    for (const value of [row.id, row.sourceId]) {
      if (value) {
        knownIds.add(String(value).toLowerCase());
      }
    }

    for (const value of [
      row.officialUrl,
      row.applicationUrl,
      row.url
    ]) {
      const k = urlKey(value);
      if (k) knownUrls.add(k);
    }
  }

  for (const job of eligible) {
    const id = String(job.id).toLowerCase();
    const sourceId = String(job.sourceId).toLowerCase();
    const key = urlKey(job.officialUrl);

    if (
      knownIds.has(id) ||
      knownIds.has(sourceId) ||
      knownUrls.has(key)
    ) {
      counts.skippedDuplicates++;
      continue;
    }

    if (!APPLY) {
      counts.published++;
      knownIds.add(id);
      knownIds.add(sourceId);
      knownUrls.add(key);
      continue;
    }

    try {
      // Recheck the database immediately before insertion.
      const duplicate = await live.findOne({
        $or: [
          { id: job.id },
          { sourceId: job.sourceId },
          { officialUrl: job.officialUrl },
          { applicationUrl: job.officialUrl },
          { url: job.officialUrl }
        ]
      }, {
        projection: { _id: 1 }
      });

      if (duplicate) {
        counts.skippedDuplicates++;
        continue;
      }

      const {
        _id,
        stagedAt,
        ...data
      } = job;

      const liveJob = {
        ...data,
        id: job.id,
        company: job.company,
        title: job.title,
        location: job.location,
        primaryCity: String(job.location).split(/[;,]/)[0].trim(),
        allLocations: String(job.location)
          .split(";").map(x => x.trim()).filter(Boolean),
        officialUrl: job.officialUrl,
        applicationUrl: job.officialUrl,
        status: "active",
        reviewStatus: "approved",
        publicationStatus: "published",
        publishedAt: now,
        updatedAt: now
      };

      await live.insertOne(liveJob);

      counts.published++;

      knownIds.add(id);
      knownIds.add(sourceId);
      knownUrls.add(key);

      // Update only the staged record successfully inserted.
      await staging.updateOne(
        { _id: job._id },
        {
          $set: {
            reviewStatus: "approved",
            publicationStatus: "published",
            publishedAt: now
          }
        }
      );

    } catch (error) {
      counts.errors++;
      errors.push({
        id: job.id,
        message: String(error.message || error)
      });
    }
  }

  const finalLive = await live.countDocuments();
  const finalStaged = await staging.countDocuments();
  const pending = await staging.countDocuments({
    reviewStatus: "pending-manual-review"
  });

  const report = {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? "PUBLISH_APPLY" : "DRY_RUN",
    counts,
    finalLive,
    finalStaged,
    pending,
    errors
  };

  await fs.writeFile(
    "PDS_Publishing_Final_Report.json",
    JSON.stringify(report, null, 2),
    "utf8"
  );

  console.log("\nPDS PUBLISHING SUMMARY");
  console.table({
    ...counts,
    finalLive,
    finalStaged,
    pendingReview: pending
  });

  console.log("Report: PDS_Publishing_Final_Report.json");

  if (counts.errors > 0) process.exitCode = 1;

} finally {
  await client.close();
}