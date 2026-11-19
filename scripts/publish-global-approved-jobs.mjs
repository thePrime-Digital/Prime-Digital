import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { MongoClient, BSON } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const APPLY = process.argv.includes("--apply");
const CONFIRMED = process.argv.includes("--confirm=707");

if (APPLY && !CONFIRMED) {
  throw new Error(
    "Publication requires --apply --confirm=707"
  );
}

const folder = path.resolve(
  "global-job-audit/final-publication"
);

function readJson(name) {
  return JSON.parse(
    fs.readFileSync(
      path.join(folder, name),
      "utf8"
    ).replace(/^\uFEFF/, "")
  );
}

const eligible = readJson(
  "Final_Employer_Eligible_For_Approval.json"
);

const held = readJson(
  "Final_Employer_Remaining_Review.json"
);

const recovery = readJson(
  "Final_Employer_Recovery_Report.json"
);

if (
  !Array.isArray(eligible) ||
  !Array.isArray(held) ||
  eligible.length !== 707 ||
  held.length !== 57 ||
  recovery.counts?.finalEligibleForManualApproval !== 707 ||
  recovery.counts?.remainingForReview !== 57
) {
  throw new Error("Final approval files do not reconcile.");
}

const countryNames = {
  AE: "United Arab Emirates",
  SG: "Singapore",
  GB: "United Kingdom",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia",
};

const batches = new Set([
  "GLOBAL_BATCH1_20261116",
  "GLOBAL_BATCH2_20261116",
]);

function normalizeUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:") return "";

    return (
      url.hostname.toLowerCase() +
      url.pathname.replace(/\/+$/, "").toLowerCase()
    );
  } catch {
    return "";
  }
}

const approvedIds = new Set();
const approvedSources = new Set();
const approvedUrls = new Set();

for (const item of eligible) {
  const id = String(item.id ?? "");
  const sourceId = String(item.sourceId ?? "");
  const url = normalizeUrl(item.officialUrl);

  if (
    !id ||
    !sourceId ||
    !url ||
    !countryNames[item.countryCode] ||
    approvedIds.has(id) ||
    approvedSources.has(sourceId) ||
    approvedUrls.has(url)
  ) {
    throw new Error(`Invalid approval entry: ${id}`);
  }

  approvedIds.add(id);
  approvedSources.add(sourceId);
  approvedUrls.add(url);
}

const heldIds = new Set(
  held.map((item) => String(item.id ?? ""))
);

for (const id of approvedIds) {
  if (heldIds.has(id)) {
    throw new Error(
      `Job appears in both approved and held lists: ${id}`
    );
  }
}

const uri = process.env.MONGODB_URI ??
  process.env.MONGO_URI;

if (!uri) {
  throw new Error("MongoDB URI missing.");
}

const dbName =
  process.env.MONGODB_DB_NAME ??
  process.env.MONGODB_DB ??
  "prime-digital-school";

if (dbName !== "prime-digital-school") {
  throw new Error("Unexpected MongoDB database.");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
});

const counts = {
  approvalCandidates: 707,
  heldForReview: 57,
  matchedStaging: 0,
  eligibleToPublish: 0,
  alreadyLive: 0,
  published: 0,
  stagingUpdated: 0,
  writeErrors: 0,
  verifiedPublished: 0,
  mode: APPLY ? "PUBLISH_APPLY" : "DRY_RUN",
};

const issues = [];
let backupPath = null;

const approvedCountryCounts = Object.fromEntries(
  Object.keys(countryNames).map((code) => [code, 0])
);

try {
  await client.connect();

  const db = client.db(dbName);

  const live = db.collection("job_listings");

  const staging = db.collection(
    "job_listing_import_staging"
  );

  const records = await staging.find({
    id: { $in: [...approvedIds] },
  }).toArray();

  counts.matchedStaging = records.length;

  if (records.length !== 707) {
    throw new Error(
      `Expected 707 staging records, found ${records.length}`
    );
  }

  const byId = new Map(
    records.map((job) => [job.id, job])
  );

  const selected = [];

  for (const item of eligible) {
    const job = byId.get(item.id);

    if (
      !job ||
      !batches.has(job.stagingBatch) ||
      job.publicationStatus !== "not-published" ||
      job.reviewStatus !== "pending-manual-review" ||
      job.sourceId !== item.sourceId ||
      job.countryCode !== item.countryCode ||
      job.country !== countryNames[item.countryCode] ||
      normalizeUrl(job.officialUrl) !==
        normalizeUrl(item.officialUrl) ||
      !job.title ||
      !job.company ||
      !job.location
    ) {
      throw new Error(
        `Staging record failed validation: ${item.id}`
      );
    }

    selected.push(job);
    approvedCountryCounts[job.countryCode]++;
  }

  const liveProjection = {
    id: 1,
    sourceId: 1,
    officialUrl: 1,
    applicationUrl: 1,
    url: 1,
  };

  const existing = await live.find(
    {},
    { projection: liveProjection }
  ).toArray();

  const knownIds = new Set();
  const knownUrls = new Set();

  for (const row of existing) {
    for (const value of [
      row.id,
      row.sourceId,
    ]) {
      if (value) {
        knownIds.add(String(value).toLowerCase());
      }
    }

    for (const value of [
      row.officialUrl,
      row.applicationUrl,
      row.url,
    ]) {
      const url = normalizeUrl(value);
      if (url) knownUrls.add(url);
    }
  }

  for (const job of selected) {
    if (
      knownIds.has(job.id.toLowerCase()) ||
      knownIds.has(job.sourceId.toLowerCase()) ||
      knownUrls.has(normalizeUrl(job.officialUrl))
    ) {
      counts.alreadyLive++;
    }
  }

  if (counts.alreadyLive !== 0) {
    throw new Error(
      `${counts.alreadyLive} approved jobs already exist in live collection. Publication stopped.`
    );
  }

  counts.eligibleToPublish = selected.length;

  if (APPLY) {
    const backupFolder = path.resolve("backups");

    fs.mkdirSync(backupFolder, {
      recursive: true,
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    backupPath = path.join(
      backupFolder,
      `PDS_Global_PrePublish_${timestamp}.json`
    );

    const existingLive = await live.find({}).toArray();

    const backup = {
      generatedAt: new Date().toISOString(),
      database: dbName,
      collection: "job_listings",
      records: existingLive,
    };

    const backupBytes = BSON.EJSON.stringify(
      backup,
      null,
      2
    );

    fs.writeFileSync(
      backupPath,
      backupBytes,
      { encoding: "utf8", flag: "wx" }
    );

    const backupHash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(backupPath))
      .digest("hex");

    console.log("Backup created:", backupPath);
    console.log("Backup SHA256:", backupHash);

    if (existingLive.length !== existing.length) {
      throw new Error(
        "Live collection changed during backup. Publication stopped."
      );
    }

    console.log(
      "Publishing approved international jobs..."
    );

    for (const job of selected) {
      try {
        // Recheck directly before each insertion.
        const existingMatch = await live.findOne({
          $or: [
            { id: job.id },
            { sourceId: job.sourceId },
            { officialUrl: job.officialUrl },
            { applicationUrl: job.officialUrl },
          ],
        });

        if (existingMatch) {
          counts.writeErrors++;

          issues.push({
            id: job.id,
            reason: "duplicate-before-insert",
          });

          continue;
        }

        const {
          _id,
          ...jobFields
        } = job;

        const now = new Date();

        const liveJob = {
          ...jobFields,
          status: "active",
          publicationStatus: "published",
          reviewStatus: "approved",
          publishedAt: now,
          updatedAt: now,
        };

        const result = await live.insertOne(liveJob);

        if (!result.acknowledged) {
          throw new Error(
            "Live insertion not acknowledged"
          );
        }

        counts.published++;

        // Update the matching staged record only.
        const stagingResult = await staging.updateOne(
          {
            _id: job._id,
            publicationStatus: "not-published",
          },
          {
            $set: {
              publicationStatus: "published",
              reviewStatus: "approved",
              publishedAt: now,
            },
          }
        );

        if (stagingResult.modifiedCount === 1) {
          counts.stagingUpdated++;
        } else {
          counts.writeErrors++;

          issues.push({
            id: job.id,
            reason: "staging-status-update-failed",
          });
        }

      } catch (error) {
        counts.writeErrors++;

        issues.push({
          id: job.id,
          reason: "publication-failed",
          detail: String(error.message ?? error),
        });
      }
    }

    counts.verifiedPublished =
      await live.countDocuments({
        id: { $in: [...approvedIds] },
        publicationStatus: "published",
        status: "active",
      });
  }

} finally {
  await client.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  counts,
  countryCounts: approvedCountryCounts,
  backupPath,
  issues,
};

const output = path.join(
  folder,
  APPLY
    ? "Final_Global_Publication_Apply_Report.json"
    : "Final_Global_Publication_Dry_Run.json"
);

fs.writeFileSync(
  output,
  JSON.stringify(report, null, 2),
  "utf8"
);

console.log("\nSTEP 34 - INTERNATIONAL PUBLICATION");
console.table(counts);

console.log("\nAPPROVED COUNTRY DISTRIBUTION");
console.table(approvedCountryCounts);

console.log("Report:", output);

if (
  counts.writeErrors > 0 ||
  (APPLY && counts.verifiedPublished !== counts.published) ||
  (APPLY && counts.stagingUpdated !== counts.published)
) {
  process.exitCode = 1;
}
