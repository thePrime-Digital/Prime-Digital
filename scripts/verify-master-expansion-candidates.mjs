import fs from "node:fs";
import path from "node:path";

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

const candidates = readJson("Master_Expansion_Candidates.json");

if (!Array.isArray(candidates)) {
  throw new Error("Candidate input must be an array.");
}

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

function parseSource(value) {
  const match = normalize(value).match(
    /^(greenhouse|lever|ashby):([^:]+):(.+)$/
  );

  if (!match) return null;

  return {
    provider: match[1],
    token: match[2],
    nativeId: match[3]
  };
}

async function fetchJson(url) {
  let lastError;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(60000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < 4) {
        await new Promise(resolve =>
          setTimeout(resolve, attempt * 2000)
        );
      }
    }
  }

  throw lastError;
}

async function fetchFeed(provider, token) {
  if (provider === "greenhouse") {
    const data = await fetchJson(
      `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
    );

    if (!Array.isArray(data.jobs)) {
      throw new Error("Invalid Greenhouse feed");
    }

    return data.jobs.map(job => ({
      id: normalize(job.id),
      title: normalize(job.title),
      url: normalize(job.absolute_url)
    }));
  }

  if (provider === "ashby") {
    const data = await fetchJson(
      `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(token)}`
    );

    if (!Array.isArray(data.jobs)) {
      throw new Error("Invalid Ashby feed");
    }

    return data.jobs
      .filter(job => job.isListed !== false)
      .map(job => ({
        id: normalize(job.id || job.jobUrl),
        title: normalize(job.title),
        url: normalize(job.jobUrl)
      }));
  }

  if (provider === "lever") {
    const result = [];

    for (let skip = 0; skip <= 10000; skip += 100) {
      const page = await fetchJson(
        `https://api.lever.co/v0/postings/${encodeURIComponent(token)}` +
        `?mode=json&limit=100&skip=${skip}`
      );

      if (!Array.isArray(page)) {
        throw new Error("Invalid Lever feed");
      }

      for (const job of page) {
        result.push({
          id: normalize(job.id),
          title: normalize(job.text),
          url: normalize(job.hostedUrl)
        });
      }

      if (page.length < 100) {
        return result;
      }
    }

    throw new Error("Lever pagination limit exceeded");
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

const locationPatterns = {
  IN: /\b(india|mumbai|bengaluru|bangalore|hyderabad|pune|chennai|noida|delhi|gurugram|gurgaon|ahmedabad|kolkata)\b/i,
  AE: /\b(united arab emirates|uae|dubai|abu dhabi)\b/i,
  SG: /\bsingapore\b/i,
  GB: /\b(united kingdom|uk|london|manchester|bristol|edinburgh)\b/i,
  DE: /\b(germany|berlin|munich|frankfurt|hamburg)\b/i,
  CA: /\b(canada|toronto|vancouver|montreal|ottawa)\b/i,
  AU: /\b(australia|sydney|melbourne|brisbane|perth)\b/i
};

const eligible = [];
const held = [];
const failures = [];

const feedCache = new Map();
const seenIds = new Set();
const seenSources = new Set();
const seenUrls = new Set();

let checked = 0;

console.log("\nSTEP 61 - MASTER OFFICIAL EMPLOYER VERIFICATION");

for (const job of candidates) {
  checked++;

  const source = parseSource(job.sourceId);

  const hold = (reason, detail = null) => {
    held.push({
      ...job,
      reviewReason: reason,
      reviewDetail: detail,
      reviewStatus: "needs-review",
      publicationStatus: "not-published"
    });
  };

  if (!source) {
    hold("invalid-source-id");
    continue;
  }

  const key = `${source.provider}:${source.token}`.toLowerCase();

  if (!feedCache.has(key)) {
    try {
      const feed = await fetchFeed(
        source.provider,
        source.token
      );

      feedCache.set(key, {
        jobs: new Map(feed.map(item => [item.id, item]))
      });

      console.log(
        `[PASS] ${key}: ${feed.length} official postings`
      );
    } catch (error) {
      const detail = String(error.message ?? error);

      feedCache.set(key, { error: detail });

      failures.push({
        provider: source.provider,
        token: source.token,
        error: detail
      });

      console.log(`[FAIL] ${key}: ${detail}`);
    }
  }

  const feed = feedCache.get(key);

  if (feed.error) {
    hold("employer-feed-failed", feed.error);
    continue;
  }

  const official = feed.jobs.get(source.nativeId);

  if (!official) {
    hold("missing-from-current-feed");
    continue;
  }

  if (
    !normalizedUrl(job.officialUrl) ||
    normalizedUrl(job.officialUrl) !==
      normalizedUrl(official.url)
  ) {
    hold("official-url-mismatch");
    continue;
  }

  if (normalize(job.title) !== official.title) {
    hold("title-changed", {
      candidate: normalize(job.title),
      official: official.title
    });
    continue;
  }

  const location = normalize(job.location);

  if (!location) {
    hold("missing-location");
    continue;
  }

  // Hold multiple distinct locations for further verification.
  const locationParts = [
    ...new Set(
      location
        .split(/[;|]/)
        .map(value => value.trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  if (locationParts.length > 1) {
    hold("multiple-locations-need-review");
    continue;
  }

  const expectedPattern = locationPatterns[job.countryCode];

  if (!expectedPattern || !expectedPattern.test(location)) {
    hold("country-location-not-explicit");
    continue;
  }

  const matchedCountries = Object.entries(locationPatterns)
    .filter(([, pattern]) => pattern.test(location))
    .map(([code]) => code);

  if (
    matchedCountries.length !== 1 ||
    matchedCountries[0] !== job.countryCode
  ) {
    hold("ambiguous-country-location");
    continue;
  }

  const id = normalize(job.id);
  const sourceId = normalize(job.sourceId);
  const url = normalizedUrl(job.officialUrl);

  if (
    !id ||
    !sourceId ||
    seenIds.has(id) ||
    seenSources.has(sourceId) ||
    seenUrls.has(url)
  ) {
    hold("duplicate-or-invalid-identity");
    continue;
  }

  seenIds.add(id);
  seenSources.add(sourceId);
  seenUrls.add(url);

  eligible.push({
    ...job,
    verificationStatus: "official-feed-verified",
    reviewStatus: "pending-manual-review",
    publicationStatus: "not-published",
    stagingStatus: "prepared"
  });

  if (checked % 50 === 0) {
    console.log(`Checked ${checked}/${candidates.length}`);
  }
}

saveJson("Step61_Employer_Verified_Eligible.json", eligible);
saveJson("Step61_Employer_Verification_Held.json", held);
saveJson("Step61_Employer_Verification_Failures.json", failures);

const countryCounts = {
  IN: 0, AE: 0, SG: 0, GB: 0,
  DE: 0, CA: 0, AU: 0
};

for (const job of eligible) {
  countryCounts[job.countryCode]++;
}

const counts = {
  inputCandidates: candidates.length,
  checkedCandidates: checked,
  officialFeedVerifiedAndLocationEligible: eligible.length,
  needsReview: held.length,
  feedFailures: failures.length,
  databaseWrites: 0,
  jobsPublished: 0,
  mode: "READ_ONLY_VERIFICATION"
};

saveJson("Step61_Employer_Verification_Report.json", {
  generatedAt: new Date().toISOString(),
  counts,
  countryCounts,
  heldReasons: Object.fromEntries(
    [...new Set(held.map(job => job.reviewReason))]
      .map(reason => [
        reason,
        held.filter(job => job.reviewReason === reason).length
      ])
  )
});

console.log("\nFINAL RESULTS");
console.table(counts);

console.log("\nCOUNTRY DISTRIBUTION");
console.table(countryCounts);

console.log("\nHELD REASONS");
console.table(
  Object.fromEntries(
    [...new Set(held.map(job => job.reviewReason))]
      .map(reason => [
        reason,
        held.filter(job => job.reviewReason === reason).length
      ])
  )
);

console.log("\nMongoDB writes: ZERO");
console.log("Jobs published: ZERO");
console.log("STEP 61 COMPLETED");
