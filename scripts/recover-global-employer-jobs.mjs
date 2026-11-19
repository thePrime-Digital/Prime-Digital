import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

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

const approved = readJson(
  "Final_Employer_Approval_Candidates.json"
);

const flagged = readJson(
  "Final_Employer_Review_Required.json"
);

if (
  !Array.isArray(approved) ||
  !Array.isArray(flagged) ||
  approved.length !== 707 ||
  flagged.length !== 57
) {
  throw new Error("Step 33 verification report mismatch.");
}

const counts = {
  originalEligible: approved.length,
  originalFlagged: flagged.length,
  rechecked: 0,
  recovered: 0,
  stillMissing: 0,
  changedDetails: 0,
  feedFailures: 0,
  finalEligibleForManualApproval: 0,
  remainingForReview: 0,
  databaseWrites: 0,
  jobsPublished: 0,
  mode: "READ_ONLY_RECOVERY",
};

const recovered = [];
const unresolved = [];
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
    provider: match[1].toLowerCase(),
    token: match[2],
    nativeId: match[3],
  };
}

async function fetchJson(url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function getFeed(provider, token, region) {
  if (provider === "greenhouse") {
    const payload = await fetchJson(
      `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
    );

    if (!Array.isArray(payload.jobs)) {
      throw new Error("Invalid Greenhouse feed");
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
      throw new Error("Invalid Ashby feed");
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
    const base = region === "eu"
      ? "https://api.eu.lever.co"
      : "https://api.lever.co";

    const jobs = [];

    for (let skip = 0; skip < 2000; skip += 100) {
      const payload = await fetchJson(
        `${base}/v0/postings/${encodeURIComponent(token)}?mode=json&limit=100&skip=${skip}`
      );

      if (!Array.isArray(payload)) {
        throw new Error("Invalid Lever feed");
      }

      jobs.push(...payload);

      if (payload.length < 100) break;
    }

    return jobs.map((job) => ({
      id: normalize(job.id),
      title: normalize(job.text),
      location: normalize([
        job.categories?.location,
        ...(job.categories?.allLocations ?? []),
      ].filter(Boolean).join("; ")),
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

let staged;

try {
  await client.connect();

  const ids = flagged.map((job) => job.id);

  staged = await client
    .db(dbName)
    .collection("job_listing_import_staging")
    .find({
      id: { $in: ids },
      publicationStatus: "not-published",
    })
    .toArray();

} finally {
  await client.close();
}

const stagedById = new Map(
  staged.map((job) => [job.id, job])
);

const groups = new Map();

for (const item of flagged) {
  const job = stagedById.get(item.id);

  if (!job) {
    unresolved.push({
      ...item,
      recoveryReason: "staged-record-not-found",
    });

    continue;
  }

  const source = parseSourceId(job.sourceId);

  if (!source) {
    unresolved.push({
      ...item,
      recoveryReason: "invalid-source-id",
    });

    continue;
  }

  const region =
    normalize(job.officialUrl).includes("jobs.eu.lever.co")
      ? "eu"
      : "global";

  const key =
    `${source.provider}:${source.token}:${region}`;

  if (!groups.has(key)) {
    groups.set(key, {
      ...source,
      region,
      jobs: [],
    });
  }

  groups.get(key).jobs.push({
    staged: job,
    previousIssue: item,
    nativeId: source.nativeId,
  });
}

for (const group of groups.values()) {
  let feed;

  try {
    feed = await getFeed(
      group.provider,
      group.token,
      group.region
    );
  } catch (error) {
    counts.feedFailures++;

    failures.push({
      provider: group.provider,
      token: group.token,
      error: String(error.message ?? error),
    });

    for (const item of group.jobs) {
      unresolved.push({
        ...item.previousIssue,
        recoveryReason: "feed-unavailable",
      });
    }

    continue;
  }

  const feedById = new Map(
    feed.map((job) => [job.id, job])
  );

  for (const item of group.jobs) {
    counts.rechecked++;

    const job = item.staged;

    const current = feedById.get(item.nativeId);

    if (
      !current ||
      normalizedUrl(current.url) !==
        normalizedUrl(job.officialUrl)
    ) {
      counts.stillMissing++;

      unresolved.push({
        ...item.previousIssue,
        recoveryReason: "not-found-or-url-mismatch",
      });

      continue;
    }

    if (
      normalize(current.title) !== normalize(job.title) ||
      normalize(current.location) !== normalize(job.location)
    ) {
      counts.changedDetails++;

      unresolved.push({
        ...item.previousIssue,
        recoveryReason: "job-details-changed",
        currentTitle: current.title,
        currentLocation: current.location,
      });

      continue;
    }

    counts.recovered++;

    recovered.push({
      id: job.id,
      sourceId: job.sourceId,
      company: job.company,
      countryCode: job.countryCode,
      officialUrl: job.officialUrl,
      verifiedAt: new Date().toISOString(),
    });
  }
}

const finalEligible = [
  ...approved,
  ...recovered,
];

const uniqueEligible = [
  ...new Map(
    finalEligible.map((job) => [job.id, job])
  ).values(),
];

counts.finalEligibleForManualApproval =
  uniqueEligible.length;

counts.remainingForReview = unresolved.length;

if (
  uniqueEligible.length + unresolved.length !== 764
) {
  throw new Error(
    "Final reconciliation mismatch. No approval report written."
  );
}

function save(name, value) {
  fs.writeFileSync(
    path.join(folder, name),
    JSON.stringify(value, null, 2),
    "utf8"
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  counts,
  failures,
};

save("Final_Employer_Recovery_Report.json", report);

save(
  "Final_Employer_Eligible_For_Approval.json",
  uniqueEligible
);

save(
  "Final_Employer_Remaining_Review.json",
  unresolved
);

console.log("\nSTEP 33B - EMPLOYER RECOVERY AUDIT");
console.table(counts);

console.log("MongoDB writes: ZERO");
console.log("Jobs published: ZERO");
console.log("Reports:", folder);
