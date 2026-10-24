import fs from "node:fs/promises";
import { MongoClient } from "mongodb";

const INPUT = "PDS_India_Candidates_For_Review.json";
const OUTPUT = "PDS_India_Staging_Verification_Report.json";
const APPLY = process.env.PDS_STAGING_APPLY === "YES";
const LIMIT = Number(process.env.PDS_STAGE_LIMIT || 2000);

const read = async file => JSON.parse(
  (await fs.readFile(file, "utf8")).replace(/^\uFEFF/, "")
);

function normalizedUrl(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return "";
    return u.hostname.toLowerCase() +
      u.pathname.replace(/\/+$/, "").toLowerCase();
  } catch {
    return "";
  }
}

const HOSTS = {
  greenhouse: [
    "job-boards.greenhouse.io",
    "boards.greenhouse.io"
  ],
  lever: [
    "jobs.lever.co",
    "jobs.eu.lever.co"
  ],
  ashby: [
    "jobs.ashbyhq.com"
  ]
};

function validUrl(value, provider) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      HOSTS[provider]?.includes(u.hostname);
  } catch {
    return false;
  }
}

const INDIA =
  /\bindia\b|\bbangalore\b|\bbengaluru\b|\bmumbai\b|\bpune\b|\bhyderabad\b|\bchennai\b|\bdelhi\b|\bnoida\b|\bgurugram\b|\bgurgaon\b|\bkolkata\b|\bahmedabad\b|\bjaipur\b|\bkochi\b|\bchandigarh\b|\bindore\b|\bgandhinagar\b|\bcoimbatore\b|\bbhubaneswar\b|\blucknow\b|\bsurat\b|\bvadodara\b|\bnagpur\b|\bmysuru\b|\bvisakhapatnam\b|\bthiruvananthapuram\b/i;

const PLACEHOLDER =
  /referrals only|expressions? of interest|talent pool|general application|future opportunit/i;

function sourceParts(job) {
  const sourceId = String(job.sourceId || "");
  const parts = sourceId.split(":");
  const provider = String(job.source || parts[0] || "").toLowerCase();

  if (
    parts.length < 3 ||
    parts[0].toLowerCase() !== provider ||
    !/^[a-z0-9_-]+$/i.test(parts[1])
  ) {
    return null;
  }

  return {
    provider,
    token: parts[1],
    nativeId: parts.slice(2).join(":")
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  return response.json();
}

const cache = new Map();

async function getFeed(provider, token, region) {
  const key = provider + ":" + token + ":" + region;

  if (cache.has(key)) return cache.get(key);

  const task = (async () => {
    if (provider === "greenhouse") {
      const data = await fetchJson(
        "https://boards-api.greenhouse.io/v1/boards/" +
        encodeURIComponent(token) + "/jobs"
      );
      if (!Array.isArray(data.jobs)) throw Error("Invalid Greenhouse feed");
      return data.jobs;
    }

    if (provider === "ashby") {
      const data = await fetchJson(
        "https://api.ashbyhq.com/posting-api/job-board/" +
        encodeURIComponent(token)
      );
      if (!Array.isArray(data.jobs)) throw Error("Invalid Ashby feed");
      return data.jobs.filter(j => j.isListed !== false);
    }

    if (provider === "lever") {
      const result = [];
      const base = region === "eu"
        ? "https://api.eu.lever.co"
        : "https://api.lever.co";

      for (let skip = 0; skip < 2000; skip += 100) {
        const page = await fetchJson(
          base + "/v0/postings/" +
          encodeURIComponent(token) +
          "?mode=json&limit=100&skip=" + skip
        );

        if (!Array.isArray(page)) throw Error("Invalid Lever feed");
        result.push(...page);
        if (page.length < 100) break;
      }

      return result;
    }

    throw Error("Unsupported ATS provider");
  })();

  cache.set(key, task);
  return task;
}

function details(job, provider) {
  if (provider === "greenhouse") {
    return {
      id: String(job.id || ""),
      title: job.title || "",
      location: job.location?.name || "",
      url: job.absolute_url || ""
    };
  }

  if (provider === "lever") {
    return {
      id: String(job.id || ""),
      title: job.text || "",
      location: [
        job.categories?.location,
        ...(job.categories?.allLocations || [])
      ].filter(Boolean).join("; "),
      url: job.hostedUrl || ""
    };
  }

  return {
    id: String(job.id || ""),
    title: job.title || "",
    location: [
      job.location,
      ...(job.secondaryLocations || []).map(x => x.location)
    ].filter(Boolean).join("; "),
    url: job.jobUrl || job.applyUrl || ""
  };
}

const all = await read(INPUT);

if (!Array.isArray(all)) {
  throw Error("Candidates JSON must be an array");
}

if (!Number.isInteger(LIMIT) || LIMIT < 1) {
  throw Error("Invalid PDS_STAGE_LIMIT");
}

const candidates = all.slice(0, LIMIT);

const counts = {
  inputCandidates: all.length,
  selectedForVerification: candidates.length,
  verifiedInOfficialFeeds: 0,
  failedOrMissingFromFeed: 0,
  locationOrContentIssues: 0,
  duplicateCandidates: 0,
  alreadyInDatabase: 0,
  readyForStaging: 0,
  insertedIntoStaging: 0,
  writeErrors: 0,
  mode: APPLY ? "STAGING_APPLY" : "DRY_RUN"
};

const issues = [];
const verified = [];
const seenIds = new Set();
const seenUrls = new Set();

console.log("Starting official ATS verification...");

for (const [index, job] of candidates.entries()) {
  const source = sourceParts(job);
  const url = normalizedUrl(job.officialUrl);
  const id = String(job.sourceId || "").toLowerCase();

  if (
    !source ||
    !url ||
    !id ||
    !job.title ||
    !job.company ||
    !validUrl(job.officialUrl, source.provider)
  ) {
    counts.locationOrContentIssues++;
    issues.push({ id: job.id, reason: "invalid-fields-or-source" });
    continue;
  }

  if (seenIds.has(id) || seenUrls.has(url)) {
    counts.duplicateCandidates++;
    issues.push({ id: job.id, reason: "duplicate-candidate" });
    continue;
  }

  seenIds.add(id);
  seenUrls.add(url);

  if (PLACEHOLDER.test(job.title) || PLACEHOLDER.test(job.company)) {
    counts.locationOrContentIssues++;
    issues.push({ id: job.id, reason: "placeholder-job" });
    continue;
  }

  try {
    const region = new URL(job.officialUrl).hostname === "jobs.eu.lever.co"
      ? "eu" : "";

    const feed = await getFeed(
      source.provider,
      source.token,
      region
    );

    const current = feed
      .map(row => details(row, source.provider))
      .find(row =>
        row.id === source.nativeId ||
        (
          normalizedUrl(row.url) &&
          normalizedUrl(row.url) === url
        )
      );

    if (!current) {
      counts.failedOrMissingFromFeed++;
      issues.push({ id: job.id, reason: "not-in-current-feed" });
      continue;
    }

    if (
      !current.title ||
      !INDIA.test(current.location) ||
      !validUrl(current.url, source.provider) ||
      normalizedUrl(current.url) !== url ||
      PLACEHOLDER.test(current.title)
    ) {
      counts.locationOrContentIssues++;
      issues.push({
        id: job.id,
        reason: "feed-content-or-location-mismatch"
      });
      continue;
    }

    counts.verifiedInOfficialFeeds++;

    verified.push({
      ...job,
      title: current.title,
      location: current.location,
      officialUrl: current.url,
      reviewStatus: "pending-manual-review",
      publicationStatus: "not-published",
      auditStatus: "candidate-for-review",
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    counts.failedOrMissingFromFeed++;
    issues.push({
      id: job.id,
      reason: "feed-request-failed",
      detail: String(error.message || error)
    });
  }

  if ((index + 1) % 100 === 0) {
    console.log(
      "Processed " + (index + 1) + "/" + candidates.length
    );
  }
}

if (!process.env.MONGODB_URI) {
  throw Error("MONGODB_URI missing from .env");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000
});

try {
  await client.connect();

  const db = client.db("prime-digital-school");
  const live = db.collection("job_listings");
  const staging = db.collection("job_listing_import_staging");

  const projection = {
    id: 1,
    sourceId: 1,
    officialUrl: 1,
    applicationUrl: 1,
    url: 1
  };

  const [liveJobs, stagedJobs] = await Promise.all([
    live.find({}, { projection }).toArray(),
    staging.find({}, { projection }).toArray()
  ]);

  const knownIds = new Set();
  const knownUrls = new Set();

  for (const row of [...liveJobs, ...stagedJobs]) {
    for (const value of [row.id, row.sourceId]) {
      if (value) knownIds.add(String(value).toLowerCase());
    }

    for (const value of [
      row.officialUrl,
      row.applicationUrl,
      row.url
    ]) {
      const key = normalizedUrl(value);
      if (key) knownUrls.add(key);
    }
  }

  const fresh = [];

  for (const job of verified) {
    const id = String(job.id).toLowerCase();
    const sourceId = String(job.sourceId).toLowerCase();
    const url = normalizedUrl(job.officialUrl);

    if (
      knownIds.has(id) ||
      knownIds.has(sourceId) ||
      knownUrls.has(url)
    ) {
      counts.alreadyInDatabase++;
      continue;
    }

    knownIds.add(id);
    knownIds.add(sourceId);
    knownUrls.add(url);
    fresh.push(job);
  }

  counts.readyForStaging = fresh.length;

  if (APPLY) {
    console.log("Inserting verified jobs into staging only...");

    for (const job of fresh) {
      try {
        const now = new Date();

        const result = await staging.updateOne(
          { id: job.id },
          {
            $setOnInsert: {
              ...job,
              createdAt: now,
              stagedAt: now
            }
          },
          { upsert: true }
        );

        counts.insertedIntoStaging += result.upsertedCount || 0;

      } catch (error) {
        counts.writeErrors++;
        issues.push({
          id: job.id,
          reason: "staging-insert-failed",
          detail: String(error.message || error)
        });
      }
    }
  }

} finally {
  await client.close();
}

await fs.writeFile(
  OUTPUT,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    counts,
    issues,
    notes: [
      "No live job collection writes",
      "All new jobs require manual review",
      "Feed verification does not guarantee future availability"
    ]
  }, null, 2),
  "utf8"
);

console.log("\nSTAGING VERIFICATION SUMMARY");
console.table(counts);
console.log("Report:", OUTPUT);
console.log("Live jobs modified: 0");

if (counts.writeErrors > 0) {
  process.exitCode = 1;
}