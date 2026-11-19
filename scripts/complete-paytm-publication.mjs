import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { MongoClient, BSON } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const APPLY = process.argv.includes("--apply");
const CONFIRMED = process.argv.includes("--confirm=1110");
const EXPECTED = 1110;
const BATCH = "GLOBAL_PAYTM_MASTER_20261118";

if (APPLY && !CONFIRMED) {
  throw new Error("Apply requires --apply --confirm=1110");
}

const folder = path.resolve("global-job-audit/master-expansion");
const inputPath = path.join(
  folder,
  "Step52_Paytm_1110_Verified_Prepared.json"
);

const candidates = JSON.parse(
  fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "")
);

if (!Array.isArray(candidates) || candidates.length !== EXPECTED) {
  throw new Error("Prepared candidate count mismatch.");
}

const normalize = value => String(value ?? "").trim();

function normalizedUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("Invalid HTTPS URL.");
  }
  return (
    url.hostname.toLowerCase() +
    url.pathname.replace(/\/+$/, "").toLowerCase()
  );
}

const ids = new Set();
const sources = new Set();
const urls = new Set();

for (const job of candidates) {
  const id = normalize(job.id);
  const source = normalize(job.sourceId);
  const url = normalizedUrl(job.officialUrl);
  const nativeId = normalize(job.sourceJobId);

  if (
    !id ||
    !nativeId ||
    source !== `lever:paytmpayments:${nativeId}` ||
    job.company !== "Paytm Payments Services" ||
    job.countryCode !== "IN" ||
    job.country !== "India" ||
    !normalize(job.title) ||
    !normalize(job.location) ||
    job.publicationStatus !== "not-published" ||
    url !== `jobs.lever.co/paytmpayments/${nativeId}`.toLowerCase()
  ) {
    throw new Error(`Invalid prepared candidate: ${id}`);
  }

  if (ids.has(id) || sources.has(source) || urls.has(url)) {
    throw new Error(`Duplicate prepared candidate: ${id}`);
  }

  ids.add(id);
  sources.add(source);
  urls.add(url);
}

console.log("Checking current official Paytm feed...");

const officialJobs = new Map();

for (let skip = 0; skip <= 10000; skip += 100) {
  const url =
    `https://api.lever.co/v0/postings/paytmpayments` +
    `?mode=json&limit=100&skip=${skip}`;

  let page;
  let lastError;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(120000)
      });

      if (!response.ok) {
        throw new Error(`Official feed HTTP ${response.status}`);
      }

      page = await response.json();
      lastError = null;
      break;
    } catch (error) {
      lastError = error;

      console.log(
        `Feed request failed at offset ${skip}, ` +
        `attempt ${attempt}/5: ${error.message}`
      );

      if (attempt < 5) {
        await new Promise(resolve =>
          setTimeout(resolve, attempt * 3000)
        );
      }
    }
  }

  if (lastError) {
    throw new Error(
      `Official feed unavailable after 5 attempts: ${lastError.message}`
    );
  }

  if (!Array.isArray(page)) {
    throw new Error("Invalid official feed response.");
  }

  for (const posting of page) {
    officialJobs.set(normalize(posting.id), posting);
  }

  console.log(`Official feed postings: ${officialJobs.size}`);

  if (page.length < 100) break;

  if (skip === 10000) {
    throw new Error("Official feed pagination safety limit reached.");
  }
}

for (const job of candidates) {
  const official = officialJobs.get(normalize(job.sourceJobId));

  if (
    !official ||
    normalize(official.text) !== normalize(job.title) ||
    normalizedUrl(official.hostedUrl) !== normalizedUrl(job.officialUrl)
  ) {
    throw new Error(
      `Official feed re-verification failed: ${job.id}`
    );
  }
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
  throw new Error("Unexpected MongoDB database.");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000
});

const counts = {
  inputCandidates: EXPECTED,
  officialFeedVerified: EXPECTED,
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

  const [liveRows, stagedRows] = await Promise.all([
    live.find({}, {
      projection: {
        id: 1,
        sourceId: 1,
        officialUrl: 1,
        applicationUrl: 1,
        url: 1
      }
    }).toArray(),
    staging.find({}, {
      projection: {
        id: 1,
        sourceId: 1,
        officialUrl: 1,
        applicationUrl: 1,
        url: 1
      }
    }).toArray()
  ]);

  const collisionCount = rows => {
    let count = 0;

    for (const row of rows) {
      const id = normalize(row.id);
      const source = normalize(row.sourceId);

      const rowUrls = [
        row.officialUrl,
        row.applicationUrl,
        row.url
      ].filter(Boolean);

      const matchingUrl = rowUrls.some(value => {
        try {
          return urls.has(normalizedUrl(value));
        } catch {
          return false;
        }
      });

      if (
        ids.has(id) ||
        sources.has(source) ||
        matchingUrl
      ) {
        count++;
      }
    }

    return count;
  };

  counts.alreadyLive = collisionCount(liveRows);
  counts.alreadyStaged = collisionCount(stagedRows);

  if (counts.alreadyLive || counts.alreadyStaged) {
    throw new Error(
      `Duplicates detected: live=${counts.alreadyLive}, ` +
      `staging=${counts.alreadyStaged}. No writes performed.`
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
      `PDS_Paytm_Master_PrePublish_${timestamp}.json`
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
    const nowIso = now.toISOString();

    const stagedDocuments = candidates.map(job => ({
      ...job,
      batchId: BATCH,
      discoveryBatch: BATCH,
      stagingStatus: "staged",
      verificationStatus: "official-feed-verified",
      reviewStatus: "pending-manual-review",
      publicationStatus: "not-published",
      stagedAt: nowIso
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
          job.locationLabel || `${job.location}, India`,
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
        reviewStatus: "approved",
        publicationStatus: "published",
        publishedAt: now,
        updatedAt: now
      };
    });

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const liveCollision = await live.countDocuments(
          collisionQuery,
          { session }
        );

        const stagingCollision = await staging.countDocuments(
          collisionQuery,
          { session }
        );

        if (liveCollision || stagingCollision) {
          throw new Error("Concurrent collision detected.");
        }

        const stageResult = await staging.insertMany(
          stagedDocuments,
          { ordered: true, session }
        );

        if (stageResult.insertedCount !== EXPECTED) {
          throw new Error("Incomplete staging insertion.");
        }

        const liveResult = await live.insertMany(
          liveDocuments,
          { ordered: true, session }
        );

        if (liveResult.insertedCount !== EXPECTED) {
          throw new Error("Incomplete live insertion.");
        }

        const updateResult = await staging.updateMany(
          {
            batchId: BATCH,
            publicationStatus: "not-published",
            id: { $in: idList }
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

        if (updateResult.modifiedCount !== EXPECTED) {
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
    backupPath,
    backupHash
  };

  const reportPath = path.join(
    folder,
    APPLY
      ? "Step53_Paytm_Master_Apply_Report.json"
      : "Step53_Paytm_Master_Dry_Run.json"
  );

  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  console.log("\nSTEP 53 - MASTER PAYTM PUBLICATION");
  console.table(counts);
  console.log("Report:", reportPath);

} finally {
  await client.close();
}
