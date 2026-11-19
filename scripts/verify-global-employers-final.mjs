import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const expectedCountries = {
  AE: 14,
  SG: 126,
  GB: 286,
  DE: 132,
  CA: 163,
  AU: 43,
};

const batches = [
  "GLOBAL_BATCH1_20261116",
  "GLOBAL_BATCH2_20261116",
];

const counts = {
  expectedRecords: 764,
  stagedRecords: 0,
  checkedRecords: 0,
  officialFeedVerified: 0,
  locationOrTitleChanged: 0,
  missingFromFeed: 0,
  feedFailures: 0,
  duplicateSourceIds: 0,
  invalidRecords: 0,
  eligibleForManualApproval: 0,
  needsReview: 0,
  databaseWrites: 0,
  jobsPublished: 0,
  mode: "READ_ONLY_VERIFICATION",
};

const approvedCandidates = [];
const flagged = [];
const failures = [];

function normalize(value) {
  return String(value ?? "").trim();
}

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

function parseSourceId(value) {
  const match = normalize(value).match(
    /^([^:]+):([^:]+):(.+)$/
  );

  if (!match) return null;

  return {
    provider: match[1],
    token: match[2],
    nativeId: match[3],
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function fetchFeed(provider, token) {
  if (provider === "greenhouse") {
    const payload = await fetchJson(
      `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
    );

    if (!Array.isArray(payload.jobs)) {
      throw new Error("Invalid Greenhouse response");
    }

    return payload.jobs.map((job) => ({
      id: normalize(job.id),
      title: normalize(job.title),
      location: normalize(job.location?.name),
      url: normalize(job.absolute_url),
    }));
  }

  if (provider === "ashby") {
    const payload = await fetchJson(
      `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(token)}`
    );

    if (!Array.isArray(payload.jobs)) {
      throw new Error("Invalid Ashby response");
    }

    return payload.jobs
      .filter((job) => job.isListed !== false)
      .map((job) => ({
        id: normalize(job.id || job.jobUrl),
        title: normalize(job.title),
        location: normalize([
          job.location,
          ...(Array.isArray(job.secondaryLocations)
            ? job.secondaryLocations.map((item) =>
                typeof item === "string"
                  ? item
                  : item?.location
              )
            : []),
        ].filter(Boolean).join("; ")),
        url: normalize(job.jobUrl),
      }));
  }

  if (provider === "lever") {
    const payload = await fetchJson(
      `https://api.lever.co/v0/postings/${encodeURIComponent(token)}?mode=json`
    );

    if (!Array.isArray(payload)) {
      throw new Error("Invalid Lever response");
    }

    return payload.map((job) => ({
      id: normalize(job.id),
      title: normalize(job.text),
      location: normalize(
        job.categories?.allLocations?.join("; ") ||
        job.categories?.location
      ),
      url: normalize(job.hostedUrl),
    }));
  }

  throw new Error(`Unsupported provider: ${provider}`);
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
  serverSelectionTimeoutMS: 15000,
});

let records;

try {
  await client.connect();

  records = await client
    .db(dbName)
    .collection("job_listing_import_staging")
    .find({
      stagingBatch: { $in: batches },
    })
    .toArray();

} finally {
  await client.close();
}

counts.stagedRecords = records.length;

if (records.length !== 764) {
  throw new Error(
    `Expected 764 records, found ${records.length}`
  );
}

const countryCounts = Object.fromEntries(
  Object.keys(expectedCountries).map((code) => [code, 0])
);

const grouped = new Map();
const seenSourceIds = new Set();

for (const job of records) {
  const source = parseSourceId(job.sourceId);

  if (
    !source ||
    !Object.hasOwn(expectedCountries, job.countryCode) ||
    job.publicationStatus !== "not-published" ||
    job.reviewStatus !== "pending-manual-review" ||
    !job.id ||
    !job.title ||
    !job.company ||
    !normalizedUrl(job.officialUrl)
  ) {
    counts.invalidRecords++;

    flagged.push({
      id: job.id,
      sourceId: job.sourceId,
      reason: "invalid-staging-fields",
    });

    continue;
  }

  if (seenSourceIds.has(job.sourceId)) {
    counts.duplicateSourceIds++;

    flagged.push({
      id: job.id,
      sourceId: job.sourceId,
      reason: "duplicate-source-id",
    });

    continue;
  }

  seenSourceIds.add(job.sourceId);
  countryCounts[job.countryCode]++;

  const key = `${source.provider}:${source.token}`;

  if (!grouped.has(key)) {
    grouped.set(key, {
      ...source,
      jobs: [],
    });
  }

  grouped.get(key).jobs.push(job);
}

for (const [code, expected] of Object.entries(expectedCountries)) {
  if (countryCounts[code] !== expected) {
    throw new Error(
      `${code} expected ${expected}, found ${countryCounts[code]}`
    );
  }
}

let processed = 0;

for (const group of grouped.values()) {
  let feed;

  try {
    feed = await fetchFeed(
      group.provider,
      group.token
    );
  } catch (error) {
    counts.feedFailures++;

    failures.push({
      provider: group.provider,
      token: group.token,
      error: String(error.message ?? error),
    });

    for (const job of group.jobs) {
      flagged.push({
        id: job.id,
        sourceId: job.sourceId,
        reason: "official-feed-unavailable",
      });
    }

    continue;
  }

  const feedById = new Map(
    feed.map((job) => [job.id, job])
  );

  for (const job of group.jobs) {
    processed++;
    counts.checkedRecords++;

    const source = parseSourceId(job.sourceId);

    const current = feedById.get(source.nativeId);

    if (
      !current ||
      normalizedUrl(current.url) !==
        normalizedUrl(job.officialUrl)
    ) {
      counts.missingFromFeed++;

      flagged.push({
        id: job.id,
        sourceId: job.sourceId,
        reason: "missing-or-url-mismatch",
      });

      continue;
    }

    counts.officialFeedVerified++;

    if (
      normalize(current.title) !== normalize(job.title) ||
      normalize(current.location) !== normalize(job.location)
    ) {
      counts.locationOrTitleChanged++;

      flagged.push({
        id: job.id,
        sourceId: job.sourceId,
        reason: "job-details-changed",
        previousTitle: job.title,
        currentTitle: current.title,
        previousLocation: job.location,
        currentLocation: current.location,
      });

      continue;
    }

    approvedCandidates.push({
      id: job.id,
      sourceId: job.sourceId,
      company: job.company,
      countryCode: job.countryCode,
      officialUrl: job.officialUrl,
      verifiedAt: new Date().toISOString(),
    });
  }

  if (
    processed > 0 &&
    processed % 100 < group.jobs.length
  ) {
    console.log(
      `Processed approximately ${processed}/764`
    );
  }
}

counts.eligibleForManualApproval = approvedCandidates.length;
counts.needsReview = flagged.length;

const outputFolder = path.resolve(
  "global-job-audit",
  "final-publication"
);

fs.mkdirSync(outputFolder, { recursive: true });

function save(name, value) {
  fs.writeFileSync(
    path.join(outputFolder, name),
    JSON.stringify(value, null, 2),
    "utf8"
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  counts,
  countryCounts,
  failures,
};

save("Final_Employer_Verification_Report.json", report);
save("Final_Employer_Approval_Candidates.json", approvedCandidates);
save("Final_Employer_Review_Required.json", flagged);

console.log("\nSTEP 33 - FINAL EMPLOYER VERIFICATION");
console.table(counts);

console.log("\nCOUNTRY DISTRIBUTION");
console.table(countryCounts);

console.log("Reports:", outputFolder);
console.log("MongoDB writes: ZERO");
console.log("Jobs published: ZERO");
