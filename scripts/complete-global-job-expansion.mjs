import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const TARGET = 3376;
const CONCURRENCY = 8;

const OUTPUT = path.resolve(
  "global-job-audit/master-expansion"
);

fs.mkdirSync(OUTPUT, { recursive: true });

function readJson(file) {
  return JSON.parse(
    fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")
  );
}

function save(name, data) {
  fs.writeFileSync(
    path.join(OUTPUT, name),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

const original = readJson("config/job-sources.json");

const originalSources = Array.isArray(original)
  ? original
  : original.sources;

if (!Array.isArray(originalSources)) {
  throw new Error("Invalid original source registry.");
}

const expansionPath =
  "config/job-sources-expansion.json";

let additionalSources = [];

if (fs.existsSync(expansionPath)) {
  const expansion = readJson(expansionPath);

  additionalSources = Array.isArray(expansion)
    ? expansion
    : expansion.sources;

  if (!Array.isArray(additionalSources)) {
    throw new Error("Invalid expansion source registry.");
  }
}

const sourceMap = new Map();

for (const source of [
  ...originalSources,
  ...additionalSources
]) {
  if (source.enabled === false) continue;

  const provider = String(source.provider ?? "")
    .trim()
    .toLowerCase();

  const token = String(source.token ?? "").trim();

  if (
    !["greenhouse", "lever", "ashby"].includes(provider) ||
    !/^[a-zA-Z0-9_-]+$/.test(token)
  ) {
    continue;
  }

  sourceMap.set(`${provider}:${token.toLowerCase()}`, {
    ...source,
    provider,
    token
  });
}

const sources = [...sourceMap.values()];

const COUNTRIES = {
  IN: {
    name: "India",
    currency: "INR",
    pattern: /\b(?:india|bengaluru|bangalore|mumbai|pune|hyderabad|chennai|delhi|noida|gurugram|gurgaon|kolkata|ahmedabad|jaipur|kochi)\b/i
  },
  AE: {
    name: "United Arab Emirates",
    currency: "AED",
    pattern: /\b(?:united arab emirates|uae|dubai|abu dhabi|sharjah)\b/i
  },
  SG: {
    name: "Singapore",
    currency: "SGD",
    pattern: /\bsingapore\b/i
  },
  GB: {
    name: "United Kingdom",
    currency: "GBP",
    pattern: /\b(?:united kingdom|england|scotland|wales|london|manchester|birmingham|edinburgh|bristol|leeds|glasgow)\b/i
  },
  DE: {
    name: "Germany",
    currency: "EUR",
    pattern: /\b(?:germany|deutschland|berlin|munich|münchen|hamburg|frankfurt|düsseldorf|stuttgart|cologne)\b/i
  },
  CA: {
    name: "Canada",
    currency: "CAD",
    pattern: /\b(?:canada|toronto|vancouver|montreal|montréal|ottawa|calgary|edmonton|winnipeg)\b/i
  },
  AU: {
    name: "Australia",
    currency: "AUD",
    pattern: /\b(?:australia|sydney|melbourne|brisbane|perth|adelaide|canberra)\b/i
  }
};

const OUTSIDE =
  /\b(?:united states|usa|california|new york|san francisco|jordan|kuwait|oman|turkey|france|spain|italy|ireland|netherlands|switzerland|new zealand|japan|china|hong kong|philippines|brazil|mexico|portugal|poland|sweden|norway|denmark|finland|south africa|saudi arabia|qatar|belgium|austria)\b/i;

const HOSTS = {
  greenhouse: new Set([
    "job-boards.greenhouse.io",
    "boards.greenhouse.io"
  ]),
  lever: new Set([
    "jobs.lever.co",
    "jobs.eu.lever.co"
  ]),
  ashby: new Set([
    "jobs.ashbyhq.com"
  ])
};

function str(value) {
  return String(value ?? "").trim();
}

function urlKey(value) {
  try {
    const url = new URL(str(value));

    if (url.protocol !== "https:") return "";

    return (
      url.hostname.toLowerCase() +
      url.pathname.replace(/\/+$/, "").toLowerCase()
    );
  } catch {
    return "";
  }
}

function validUrl(provider, value) {
  try {
    const url = new URL(str(value));

    return (
      url.protocol === "https:" &&
      HOSTS[provider]?.has(
        url.hostname.toLowerCase()
      )
    );
  } catch {
    return false;
  }
}

function countryFor(location, providerCountry) {
  const text = str(location);

  const matches = Object.entries(COUNTRIES)
    .filter(([, value]) => value.pattern.test(text))
    .map(([code]) => code);

  const unique = [...new Set(matches)];

  const explicit = str(providerCountry).toUpperCase();

  if (OUTSIDE.test(text) || unique.length > 1) {
    return null;
  }

  if (explicit && COUNTRIES[explicit]) {
    if (unique.length && unique[0] !== explicit) {
      return null;
    }

    return explicit;
  }

  return unique.length === 1 ? unique[0] : null;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function getFeed(source) {
  const token = encodeURIComponent(source.token);

  if (source.provider === "greenhouse") {
    const data = await fetchJson(
      `https://boards-api.greenhouse.io/v1/boards/${token}/jobs`
    );

    if (!Array.isArray(data.jobs)) {
      throw new Error("Invalid Greenhouse response");
    }

    return data.jobs.map(job => ({
      id: str(job.id),
      title: str(job.title),
      location: str(job.location?.name),
      country: "",
      url: str(job.absolute_url)
    }));
  }

  if (source.provider === "lever") {
    const results = [];

    for (let skip = 0; skip < 10000; skip += 100) {
      const jobs = await fetchJson(
        `https://api.lever.co/v0/postings/${token}?mode=json&skip=${skip}&limit=100`
      );

      if (!Array.isArray(jobs)) {
        throw new Error("Invalid Lever response");
      }

      for (const job of jobs) {
        const locations = Array.isArray(
          job.categories?.allLocations
        )
          ? job.categories.allLocations
          : [];

        results.push({
          id: str(job.id),
          title: str(job.text),
          location: [
            str(job.categories?.location),
            ...locations
          ].filter(Boolean).join("; "),
          country: str(job.country),
          url: str(job.hostedUrl)
        });
      }

      if (jobs.length < 100) break;
    }

    return results;
  }

  if (source.provider === "ashby") {
    const data = await fetchJson(
      `https://api.ashbyhq.com/posting-api/job-board/${token}`
    );

    if (!Array.isArray(data.jobs)) {
      throw new Error("Invalid Ashby response");
    }

    return data.jobs
      .filter(job => job.isListed !== false)
      .map(job => ({
        id: str(job.id),
        title: str(job.title),
        location: [
          str(job.location),
          ...(Array.isArray(job.secondaryLocations)
            ? job.secondaryLocations.map(item =>
                str(
                  typeof item === "string"
                    ? item
                    : item?.location
                )
              )
            : [])
        ].filter(Boolean).join("; "),
        country: "",
        url: str(job.jobUrl)
      }));
  }

  throw new Error("Unsupported provider");
}

const uri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI;

if (!uri) {
  throw new Error("MongoDB connection missing.");
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

const existingIds = new Set();
const existingSources = new Set();
const existingUrls = new Set();

await client.connect();

try {
  const db = client.db(dbName);

  for (const collectionName of [
    "job_listings",
    "job_listing_import_staging"
  ]) {
    const cursor = db.collection(collectionName).find(
      {},
      {
        projection: {
          _id: 0,
          id: 1,
          sourceId: 1,
          officialUrl: 1,
          applicationUrl: 1,
          url: 1
        }
      }
    );

    for await (const record of cursor) {
      if (record.id) {
        existingIds.add(str(record.id).toLowerCase());
      }

      if (record.sourceId) {
        existingSources.add(
          str(record.sourceId).toLowerCase()
        );
      }

      for (const value of [
        record.officialUrl,
        record.applicationUrl,
        record.url
      ]) {
        const key = urlKey(value);

        if (key) existingUrls.add(key);
      }
    }
  }
} finally {
  await client.close();
}

const candidates = [];
const review = [];
const failures = [];

const seenIds = new Set();
const seenSources = new Set();
const seenUrls = new Set();

let checkedSources = 0;
let scannedVacancies = 0;
let existingDuplicates = 0;

function processJob(source, job) {
  scannedVacancies++;

  if (
    !job.id ||
    !job.title ||
    !validUrl(source.provider, job.url)
  ) {
    return;
  }

  const sourceId =
    `${source.provider}:${source.token}:${job.id}`;

  const id = "global-" +
    crypto.createHash("sha256")
      .update(sourceId)
      .digest("hex")
      .slice(0, 20);

  const url = urlKey(job.url);

  if (
    existingIds.has(id.toLowerCase()) ||
    existingSources.has(sourceId.toLowerCase()) ||
    existingUrls.has(url) ||
    seenIds.has(id.toLowerCase()) ||
    seenSources.has(sourceId.toLowerCase()) ||
    seenUrls.has(url)
  ) {
    existingDuplicates++;
    return;
  }

  seenIds.add(id.toLowerCase());
  seenSources.add(sourceId.toLowerCase());
  seenUrls.add(url);

  const countryCode = countryFor(
    job.location,
    job.country
  );

  const record = {
    id,
    company: str(source.company),
    title: job.title,
    location: job.location,
    countryCode,
    country: countryCode
      ? COUNTRIES[countryCode].name
      : null,
    salaryCurrency: countryCode
      ? COUNTRIES[countryCode].currency
      : null,
    officialUrl: job.url,
    source: source.provider,
    sourceId,
    sourceJobId: job.id,
    publicationStatus: "not-published",
    reviewStatus: "pending-manual-review",
    verificationStatus: "official-feed-verified",
    discoveryBatch: "GLOBAL_MASTER_EXPANSION_20261118"
  };

  if (!countryCode) {
    review.push({
      ...record,
      reason: "ambiguous-or-unsupported-location"
    });

    return;
  }

  candidates.push(record);
}

const queue = [...sources];

async function worker() {
  while (queue.length) {
    const source = queue.shift();

    if (!source) return;

    try {
      const jobs = await getFeed(source);

      for (const job of jobs) {
        processJob(source, job);
      }
    } catch (error) {
      failures.push({
        company: source.company,
        provider: source.provider,
        token: source.token,
        error: String(error.message ?? error)
      });
    }

    checkedSources++;

    if (checkedSources % 25 === 0) {
      console.log(
        `Progress: ${checkedSources}/${sources.length} employers`
      );
    }
  }
}

await Promise.all(
  Array.from(
    {
      length: Math.min(CONCURRENCY, sources.length)
    },
    () => worker()
  )
);

candidates.sort(
  (a, b) =>
    a.countryCode.localeCompare(b.countryCode) ||
    a.company.localeCompare(b.company) ||
    a.title.localeCompare(b.title)
);

const selected = candidates.slice(0, TARGET);

const countryCounts = Object.fromEntries(
  Object.keys(COUNTRIES).map(code => [
    code,
    selected.filter(job =>
      job.countryCode === code
    ).length
  ])
);

const summary = {
  targetAdditionalJobs: TARGET,
  registeredEmployers: sources.length,
  originalEmployers: originalSources.length,
  expansionEmployers: additionalSources.length,
  checkedSources,
  failedSources: failures.length,
  scannedVacancies,
  existingDuplicates,
  newVerifiedCandidates: candidates.length,
  selectedForApprovalReview: selected.length,
  manualReview: review.length,
  stillNeeded: Math.max(0, TARGET - candidates.length),
  targetReached: candidates.length >= TARGET,
  countryCounts,
  databaseWrites: 0,
  jobsPublished: 0,
  mode: "READ_ONLY_MASTER_EXPANSION"
};

save("Master_Expansion_Candidates.json", selected);
save("Master_Expansion_Manual_Review.json", review);
save("Master_Expansion_Failures.json", failures);
save("Master_Expansion_Summary.json", summary);

console.log("\nSTEP 46 - MASTER GLOBAL JOB EXPANSION");
console.table(summary);

console.log("\nCOUNTRY DISTRIBUTION");
console.table(countryCounts);

console.log("\nMongoDB writes: ZERO");
console.log("Jobs published: ZERO");

console.log(
  summary.targetReached
    ? "DISCOVERY TARGET REACHED"
    : "ADDITIONAL EMPLOYER SOURCES REQUIRED"
);