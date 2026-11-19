import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { MongoClient, BSON } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const APPLY = process.argv.includes("--apply");
const CONFIRMED = process.argv.includes("--confirm=209");

const EXPECTED = 209;
const BATCH = "GLOBAL_MASTER_EXPANSION_20261118";

if (APPLY && !CONFIRMED) {
  throw new Error("Apply requires --apply --confirm=209");
}

const folder = path.resolve("global-job-audit/master-expansion");

function readJson(name) {
  return JSON.parse(
    fs.readFileSync(path.join(folder, name), "utf8")
      .replace(/^\uFEFF/, "")
  );
}

function saveJson(name, value) {
  fs.writeFileSync(
    path.join(folder, name),
    JSON.stringify(value, null, 2),
    "utf8"
  );
}

const candidates = readJson(
  "Step61_Employer_Verified_Eligible.json"
);

const verification = readJson(
  "Step61_Employer_Verification_Report.json"
);

if (
  !Array.isArray(candidates) ||
  candidates.length !== EXPECTED ||
  verification.counts?.officialFeedVerifiedAndLocationEligible !== EXPECTED ||
  verification.counts?.feedFailures !== 0
) {
  throw new Error("Step 61 prerequisites do not reconcile.");
}

const countryNames = {
  IN: "India",
  AE: "United Arab Emirates",
  SG: "Singapore",
  GB: "United Kingdom",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia"
};

const normalize = value => String(value ?? "").trim();

function normalizedUrl(value) {
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

const ids = new Set();
const sources = new Set();
const urls = new Set();

const countryCounts = Object.fromEntries(
  Object.keys(countryNames).map(code => [code, 0])
);

for (const job of candidates) {
  const id = normalize(job.id);
  const source = normalize(job.sourceId);
  const url = normalizedUrl(job.officialUrl);

  if (
    !id ||
    !source ||
    !url ||
    !normalize(job.company) ||
    !normalize(job.title) ||
    !normalize(job.location) ||
    job.country !== countryNames[job.countryCode] ||
    job.verificationStatus !== "official-feed-verified" ||
    job.reviewStatus !== "pending-manual-review" ||
    job.publicationStatus !== "not-published"
  ) {
    throw new Error(`Invalid candidate: ${id}`);
  }

  if (ids.has(id) || sources.has(source) || urls.has(url)) {
    throw new Error(`Duplicate candidate: ${id}`);
  }

  ids.add(id);
  sources.add(source);
  urls.add(url);

  countryCounts[job.countryCode]++;
}

const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

if (!uri) {
  throw new Error("MongoDB URI missing.");
}

const dbName =
  process.env.MONGODB_DB_NAME ??
  process.env.MONGODB_DB ??
  "prime-digital-school";

if (dbName !== "prime-digital-school") {
  throw new Error("Unexpected database.");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000
});

const counts = {
  inputCandidates: EXPECTED,
  verifiedCandidates: EXPECTED,
  alreadyLive: 0,
  alreadyStaged: 0,
  eligibleToPublish: 0,
  insertedIntoStaging: 0,
  published: 0,
  stagingUpdated: 0,
  verifiedPublished: 0,
  writeErrors: 0,
  mode: APPLY ? "MASTER_APPLY" : "DRY_RUN"
};

let backupPath = null;
let backupHash = null;

const idList = [...ids];
const sourceList = [...sources];
const urlList = candidates.map(job => job.officialUrl);

const collisionQuery = {
  $or: [
    { id: { $in: idList } },
    { sourceId: { $in: sourceList } },
    { officialUrl: { $in: urlList } },
    { applicationUrl: { $in: urlList } },
    { url: { $in: urlList } }
  ]
};

await client.connect();

try {
  const db = client.db(dbName);

  const live = db.collection("job_listings");
  const staging = db.collection("job_listing_import_staging");

  const projection = {
    id: 1,
    sourceId: 1,
    officialUrl: 1,
    applicationUrl: 1,
    url: 1
  };

  const liveRows = await live.find(
    {},
    { projection }
  ).toArray();

  const stagedRows = await staging.find(
    {},
    { projection }
  ).toArray();

  function collisionCount(rows) {
    let count = 0;

    for (const row of rows) {
      const rowUrls = [
        row.officialUrl,
        row.applicationUrl,
        row.url
      ].filter(Boolean);

      const matchingUrl = rowUrls.some(value =>
        urls.has(normalizedUrl(value))
      );

      if (
        ids.has(normalize(row.id)) ||
        sources.has(normalize(row.sourceId)) ||
        matchingUrl
      ) {
        count++;
      }
    }

    return count;
  }

  counts.alreadyLive = collisionCount(liveRows);
  counts.alreadyStaged = collisionCount(stagedRows);

  if (counts.alreadyLive || counts.alreadyStaged) {
    throw new Error(
      `Existing records detected: live=${counts.alreadyLive}, ` +
      `staging=${counts.alreadyStaged}`
    );
  }

  counts.eligibleToPublish = EXPECTED;

  if (APPLY) {
    const backupFolder = path.resolve("backups");

    fs.mkdirSync(backupFolder, { recursive: true });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    backupPath = path.join(
      backupFolder,
      `PDS_Master209_PrePublish_${timestamp}.json`
    );

    const backup = {
      generatedAt: new Date().toISOString(),
      database: dbName,
      collections: {
        job_listings: await live.find({}).toArray(),
        job_listing_import_staging:
          await staging.find({}).toArray()
      }
    };

    fs.writeFileSync(
      backupPath,
      BSON.EJSON.stringify(backup, null, 2),
      { encoding: "utf8", flag: "wx" }
    );

    backupHash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(backupPath))
      .digest("hex");

    console.log("Backup:", backupPath);
    console.log("Backup SHA256:", backupHash);

    const now = new Date();

    const stagedDocuments = candidates.map(job => ({
      ...job,
      batchId: BATCH,
      discoveryBatch: BATCH,
      stagingStatus: "staged",
      stagedAt: now.toISOString(),
      reviewStatus: "pending-manual-review",
      publicationStatus: "not-published"
    }));

    const liveDocuments = stagedDocuments.map(job => {
      const companyKey = normalize(job.company)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return {
        ...job,
        companyKey,
        locationLabel:
          job.locationLabel || `${job.location}, ${job.country}`,
        category: job.category || "Other",
        type: job.type || "Job",
        workMode: job.workMode || "unknown",
        experienceLevel: job.experienceLevel || "unknown",
        experienceMinYears: job.experienceMinYears ?? null,
        experienceMaxYears: job.experienceMaxYears ?? null,
        salaryMin: job.salaryMin ?? null,
        salaryMax: job.salaryMax ?? null,
        salaryPeriod: job.salaryPeriod || "unknown",
        skills: Array.isArray(job.skills) ? job.skills : [],
        visaSponsorship: job.visaSponsorship || "unknown",
        remoteEligibleCountries:
          Array.isArray(job.remoteEligibleCountries)
            ? job.remoteEligibleCountries
            : [],
        workAuthorization: job.workAuthorization ?? null,
        status: "active",
        publicationStatus: "published",
        reviewStatus: "approved",
        publishedAt: now,
        updatedAt: now
      };
    });

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // MongoDB operations must run sequentially in a transaction.
        const liveCollision = await live.countDocuments(
          collisionQuery,
          { session }
        );

        const stagingCollision = await staging.countDocuments(
          collisionQuery,
          { session }
        );

        if (liveCollision || stagingCollision) {
          throw new Error("Concurrent duplicate detected.");
        }

        const insertedStaging = await staging.insertMany(
          stagedDocuments,
          { ordered: true, session }
        );

        if (insertedStaging.insertedCount !== EXPECTED) {
          throw new Error("Incomplete staging insertion.");
        }

        const insertedLive = await live.insertMany(
          liveDocuments,
          { ordered: true, session }
        );

        if (insertedLive.insertedCount !== EXPECTED) {
          throw new Error("Incomplete live insertion.");
        }

        const updatedStaging = await staging.updateMany(
          {
            batchId: BATCH,
            id: { $in: idList },
            publicationStatus: "not-published"
          },
          {
            $set: {
              publicationStatus: "published",
              reviewStatus: "approved",
              publishedAt: now
            }
          },
          { session }
        );

        if (updatedStaging.modifiedCount !== EXPECTED) {
          throw new Error("Incomplete staging update.");
        }
      });
    } finally {
      await session.endSession();
    }

    counts.insertedIntoStaging = EXPECTED;
    counts.published = EXPECTED;
    counts.stagingUpdated = EXPECTED;

    counts.verifiedPublished = await live.countDocuments({
      id: { $in: idList },
      publicationStatus: "published",
      status: "active"
    });

    if (counts.verifiedPublished !== EXPECTED) {
      counts.writeErrors++;
      process.exitCode = 1;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts,
    countryCounts,
    backupPath,
    backupHash
  };

  const reportName = APPLY
    ? "Step62_Master209_Apply_Report.json"
    : "Step62_Master209_Dry_Run.json";

  saveJson(reportName, report);

  console.log("\nSTEP 62 - MASTER EXPANSION PUBLICATION");
  console.table(counts);

  console.log("\nCOUNTRY DISTRIBUTION");
  console.table(countryCounts);

  console.log("Report:", path.join(folder, reportName));

} finally {
  await client.close();
}
