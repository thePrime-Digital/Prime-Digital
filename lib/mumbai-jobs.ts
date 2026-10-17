import "server-only";

import {
  unstable_cache,
} from "next/cache";

import * as cheerio from "cheerio";

export type MumbaiJobCategory =
  | "Technology"
  | "Banking & Finance"
  | "Consulting"
  | "Engineering"
  | "Consumer & Retail"
  | "Media & Internet"
  | "Conglomerate";

export type MumbaiJobType =
  | "Job"
  | "Full-time"
  | "Internship"
  | "Apprenticeship"
  | "Contract";

export type MumbaiJob = {
  id: string;
  title: string;
  company: string;
  companyKey: string;
  category: MumbaiJobCategory;
  type: MumbaiJobType;

  location:
    | "Mumbai"
    | "Navi Mumbai";

  officialUrl: string;
  careerUrl: string;

  postedDate?:
    string;
};

export type MumbaiEmployer = {
  key: string;
  name: string;
  category: MumbaiJobCategory;
  url: string;
};

type LiveSource = {
  key: string;
  name: string;
  category: MumbaiJobCategory;
  careerUrl: string;
  listingUrl: string;
  allowedHosts: string[];
  assumeLocal?: boolean;
  maxItems?: number;
};

const EMPLOYERS: MumbaiEmployer[] = [
  {
    key: "reliance",
    name: "Reliance Industries",
    category: "Conglomerate",
    url: "https://careers.ril.com/",
  },
  {
    key: "jio",
    name: "Reliance Jio",
    category: "Technology",
    url: "https://careers.jio.com/",
  },
  {
    key: "tcs",
    name: "Tata Consultancy Services",
    category: "Technology",
    url: "https://www.tcs.com/careers/india",
  },
  {
    key: "wipro",
    name: "Wipro",
    category: "Technology",
    url: "https://careers.wipro.com/",
  },
  {
    key: "infosys",
    name: "Infosys",
    category: "Technology",
    url: "https://www.infosys.com/careers/",
  },
  {
    key: "tech-mahindra",
    name: "Tech Mahindra",
    category: "Technology",
    url: "https://careers.techmahindra.com/",
  },
  {
    key: "capgemini",
    name: "Capgemini",
    category: "Technology",
    url: "https://careers.capgemini.com/",
  },
  {
    key: "accenture",
    name: "Accenture",
    category: "Consulting",
    url: "https://www.accenture.com/in-en/careers/jobsearch",
  },
  {
    key: "ltimindtree",
    name: "LTIMindtree",
    category: "Technology",
    url: "https://careers.ltimindtree.com/",
  },
  {
    key: "ibm",
    name: "IBM",
    category: "Technology",
    url: "https://www.ibm.com/careers/search",
  },
  {
    key: "oracle",
    name: "Oracle",
    category: "Technology",
    url: "https://careers.oracle.com/jobs/",
  },
  {
    key: "microsoft",
    name: "Microsoft",
    category: "Technology",
    url: "https://jobs.careers.microsoft.com/global/en/search",
  },
  {
    key: "google",
    name: "Google",
    category: "Technology",
    url: "https://www.google.com/about/careers/applications/jobs/results/",
  },
  {
    key: "amazon",
    name: "Amazon",
    category: "Technology",
    url: "https://www.amazon.jobs/en/location/mumbai-india",
  },
  {
    key: "deloitte",
    name: "Deloitte",
    category: "Consulting",
    url: "https://southasiacareers.deloitte.com/",
  },
  {
    key: "ey",
    name: "EY",
    category: "Consulting",
    url: "https://careers.ey.com/",
  },
  {
    key: "pwc",
    name: "PwC India",
    category: "Consulting",
    url: "https://www.pwc.in/careers.html",
  },
  {
    key: "kpmg",
    name: "KPMG India",
    category: "Consulting",
    url: "https://kpmg.com/in/en/careers.html",
  },
  {
    key: "citi",
    name: "Citi",
    category: "Banking & Finance",
    url: "https://jobs.citi.com/",
  },
  {
    key: "hsbc",
    name: "HSBC",
    category: "Banking & Finance",
    url: "https://portal.careers.hsbc.com/careers?location=India",
  },
  {
    key: "jpmorgan",
    name: "JPMorgan Chase",
    category: "Banking & Finance",
    url: "https://careers.jpmorgan.com/us/en/search-results",
  },
  {
    key: "morgan-stanley",
    name: "Morgan Stanley",
    category: "Banking & Finance",
    url: "https://www.morganstanley.com/careers/career-opportunities-search",
  },
  {
    key: "barclays",
    name: "Barclays",
    category: "Banking & Finance",
    url: "https://search.jobs.barclays/",
  },
  {
    key: "deutsche-bank",
    name: "Deutsche Bank",
    category: "Banking & Finance",
    url: "https://careers.db.com/",
  },
  {
    key: "hdfc-bank",
    name: "HDFC Bank",
    category: "Banking & Finance",
    url: "https://www.hdfcbank.com/personal/about-us/careers",
  },
  {
    key: "icici-bank",
    name: "ICICI Bank",
    category: "Banking & Finance",
    url: "https://www.icicicareers.com/",
  },
  {
    key: "axis-bank",
    name: "Axis Bank",
    category: "Banking & Finance",
    url: "https://www.axisbank.com/careers",
  },
  {
    key: "kotak",
    name: "Kotak Mahindra Bank",
    category: "Banking & Finance",
    url: "https://www.kotak.com/en/about-us/careers.html",
  },
  {
    key: "idfc-first",
    name: "IDFC FIRST Bank",
    category: "Banking & Finance",
    url: "https://www.idfcfirstbank.com/careers",
  },
  {
    key: "lt",
    name: "Larsen & Toubro",
    category: "Engineering",
    url: "https://www.larsentoubro.com/careers",
  },
  {
    key: "mahindra",
    name: "Mahindra Group",
    category: "Conglomerate",
    url: "https://jobs.mahindracareers.com/",
  },
  {
    key: "aditya-birla",
    name: "Aditya Birla Group",
    category: "Conglomerate",
    url: "https://careers.adityabirla.com/",
  },
  {
    key: "tata",
    name: "Tata Group",
    category: "Conglomerate",
    url: "https://www.tata.com/careers/jobs",
  },
  {
    key: "unilever",
    name: "Hindustan Unilever",
    category: "Consumer & Retail",
    url: "https://careers.unilever.com/",
  },
  {
    key: "pg",
    name: "Procter & Gamble",
    category: "Consumer & Retail",
    url: "https://www.pgcareers.com/",
  },
  {
    key: "siemens",
    name: "Siemens",
    category: "Engineering",
    url: "https://jobs.siemens.com/careers",
  },
  {
    key: "disney",
    name: "Disney",
    category: "Media & Internet",
    url: "https://www.disneycareers.com/en/search-jobs",
  },
  {
    key: "bookmyshow",
    name: "BookMyShow",
    category: "Media & Internet",
    url: "https://in.bookmyshow.com/careers/",
  },
  {
    key: "dream-sports",
    name: "Dream Sports",
    category: "Media & Internet",
    url: "https://www.dreamsports.group/careers/",
  },
  {
    key: "browserstack",
    name: "BrowserStack",
    category: "Technology",
    url: "https://www.browserstack.com/careers",
  },
];

const LIVE_SOURCES: LiveSource[] = [
  {
    key: "reliance",
    name: "Reliance Industries",
    category: "Conglomerate",
    careerUrl:
      "https://careers.ril.com/",
    listingUrl:
      "https://careers.ril.com/rilcareers/frmJobSearch.aspx",
    allowedHosts: [
      "careers.ril.com",
    ],
    maxItems: 30,
  },

  {
    key: "citi",
    name: "Citi",
    category: "Banking & Finance",
    careerUrl:
      "https://jobs.citi.com/",
    listingUrl:
      "https://jobs.citi.com/location/mumbai-maharashtra-india-jobs/287/1269750-1264418-1275339/4",
    allowedHosts: [
      "jobs.citi.com",
    ],
    assumeLocal: true,
    maxItems: 30,
  },

  {
    key: "amazon",
    name: "Amazon",
    category: "Technology",
    careerUrl:
      "https://www.amazon.jobs/en/location/mumbai-india",
    listingUrl:
      "https://www.amazon.jobs/en/location/mumbai-india",
    allowedHosts: [
      "amazon.jobs",
      "www.amazon.jobs",
    ],
    assumeLocal: true,
    maxItems: 30,
  },

  {
    key: "hsbc",
    name: "HSBC",
    category: "Banking & Finance",
    careerUrl:
      "https://portal.careers.hsbc.com/careers?location=India",
    listingUrl:
      "https://portal.careers.hsbc.com/careers/%2A/mumbai_maharashtra_india?domain=hsbc.com",
    allowedHosts: [
      "portal.careers.hsbc.com",
      "apply.careers.hsbc.com",
    ],
    assumeLocal: true,
    maxItems: 30,
  },

  {
    key: "wipro",
    name: "Wipro",
    category: "Technology",
    careerUrl:
      "https://careers.wipro.com/",
    listingUrl:
      "https://careers.wipro.com/search/?q=&locationsearch=Mumbai",
    allowedHosts: [
      "careers.wipro.com",
    ],
    assumeLocal: true,
    maxItems: 25,
  },

  {
    key: "capgemini",
    name: "Capgemini",
    category: "Technology",
    careerUrl:
      "https://careers.capgemini.com/",
    listingUrl:
      "https://careers.capgemini.com/search/?createNewAlert=false&q=&locationsearch=Mumbai",
    allowedHosts: [
      "careers.capgemini.com",
    ],
    assumeLocal: true,
    maxItems: 25,
  },

  {
    key: "deloitte",
    name: "Deloitte",
    category: "Consulting",
    careerUrl:
      "https://southasiacareers.deloitte.com/",
    listingUrl:
      "https://southasiacareers.deloitte.com/search/?createNewAlert=false&q=&locationsearch=Mumbai",
    allowedHosts: [
      "southasiacareers.deloitte.com",
    ],
    assumeLocal: true,
    maxItems: 25,
  },

  {
    key: "ey",
    name: "EY",
    category: "Consulting",
    careerUrl:
      "https://careers.ey.com/",
    listingUrl:
      "https://careers.ey.com/ey/search/?createNewAlert=false&q=&locationsearch=Mumbai",
    allowedHosts: [
      "careers.ey.com",
    ],
    assumeLocal: true,
    maxItems: 25,
  },

  {
    key: "accenture",
    name: "Accenture",
    category: "Consulting",
    careerUrl:
      "https://www.accenture.com/in-en/careers/jobsearch",
    listingUrl:
      "https://www.accenture.com/in-en/careers/jobsearch",
    allowedHosts: [
      "accenture.com",
      "www.accenture.com",
    ],
    maxItems: 25,
  },

  {
    key: "jio",
    name: "Reliance Jio",
    category: "Technology",
    careerUrl:
      "https://careers.jio.com/",
    listingUrl:
      "https://careers.jio.com/",
    allowedHosts: [
      "careers.jio.com",
    ],
    maxItems: 20,
  },
];

/**
 * Additional official search-page candidates for Navi Mumbai.
 *
 * Results still pass through the existing job URL,
 * title and location checks. A configured search does
 * not guarantee that the employer returns vacancies.
 */
const NAVI_SEARCH_AREAS = [
  "Navi Mumbai",
  "Airoli",
];

const NAVI_SEARCH_EMPLOYERS = new Set([
  "capgemini",
  "ey",
  "deloitte",
  "wipro",
]);

const NAVI_SOURCES: LiveSource[] = LIVE_SOURCES
  .filter((source) =>
    NAVI_SEARCH_EMPLOYERS.has(source.key) &&
    source.listingUrl.includes("locationsearch=Mumbai")
  )
  .flatMap((source) =>
    NAVI_SEARCH_AREAS.map((area) => ({
      ...source,
      listingUrl: source.listingUrl.replace(
        "locationsearch=Mumbai",
        `locationsearch=${encodeURIComponent(area)}`
      ),
      assumeLocal: false,
      maxItems: 25,
    }))
  );

const COLLECTION_SOURCES: LiveSource[] = [
  ...LIVE_SOURCES,
  ...NAVI_SOURCES,
];
export const OFFICIAL_MUMBAI_JOB_SOURCES =
  EMPLOYERS;

const NAVI_MUMBAI_TERMS = [
  "navi mumbai",
  "new bombay",
  "airoli",
  "ghansoli",
  "vashi",
  "sanpada",
  "nerul",
  "seawoods",
  "belapur",
  "cbd belapur",
  "kharghar",
  "kopar khairane",
  "mahape",
  "rabale",
  "turbhe",

  "juinagar",
  "new mumbai",
  "koparkhairane",
  "kopar-khairane",
  "taloja",
  "kamothe",
  "kalamboli",
];

const MUMBAI_TERMS = [
  "mumbai",
  "bombay",
  "powai",
  "andheri",
  "bandra",
  "bkc",
  "kurla",
  "goregaon",
  "malad",
  "worli",
  "lower parel",
  "nariman point",
  "fort",
  "colaba",
  "sion",
  "dadar",
];

const BAD_TITLES = [
  "right to information",
  "privacy policy",
  "terms and conditions",
  "contact us",
  "about us",
  "learn more",
  "read more",
  "view details",
  "view jobs",
  "search jobs",
  "job search",
  "careers",
  "career",
  "home",
  "login",
  "register",
  "apply now",
  "click here",
];

function cleanText(
  value: string,
): string {
  return value
    .replace(
      /\s+/g,
      " ",
    )
    .replace(
      /\u00a0/g,
      " ",
    )
    .trim();
}

function hostAllowed(
  hostname: string,
  allowedHosts: string[],
): boolean {
  const host =
    hostname
      .toLowerCase()
      .replace(
        /^www\./,
        "",
      );

  return allowedHosts.some(
    (
      allowed,
    ) => {
      const normalised =
        allowed
          .toLowerCase()
          .replace(
            /^www\./,
            "",
          );

      return (
        host ===
          normalised ||
        host.endsWith(
          `.${normalised}`,
        )
      );
    },
  );
}

function officialUrl(
  href: string,
  source: LiveSource,
): string | null {
  try {
    const url =
      new URL(
        href,
        source.listingUrl,
      );

    if (
      url.protocol !==
        "https:" &&
      url.protocol !==
        "http:"
    ) {
      return null;
    }

    if (
      !hostAllowed(
        url.hostname,
        source.allowedHosts,
      )
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function locationFromText(
  value: string,
): "Mumbai" | "Navi Mumbai" | null {
  const text = value
    .toLowerCase()
    .replace(/%20/gi, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const containsLocation = (term: string): boolean => {
    const normalized = term
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return text.includes(normalized);
  };

  // Check Navi Mumbai first because it also contains "Mumbai".
  if (NAVI_MUMBAI_TERMS.some(containsLocation)) {
    return "Navi Mumbai";
  }

  if (MUMBAI_TERMS.some(containsLocation)) {
    return "Mumbai";
  }

  return null;
}
function looksLikeJobLink(
  value: string,
): boolean {
  const lower =
    value.toLowerCase();

  return (
    lower.includes(
      "/job/",
    ) ||
    lower.includes(
      "/jobs/",
    ) ||
    lower.includes(
      "jobdetails",
    ) ||
    lower.includes(
      "jobdetail",
    ) ||
    lower.includes(
      "jbid=",
    ) ||
    lower.includes(
      "jobid=",
    ) ||
    lower.includes(
      "requisition",
    ) ||
    lower.includes(
      "/position/",
    ) ||
    lower.includes(
      "/vacancy/",
    )
  );
}

function inferType(
  text: string,
): MumbaiJobType {
  const lower =
    text.toLowerCase();

  if (
    lower.includes(
      "internship",
    ) ||
    lower.includes(
      "intern ",
    )
  ) {
    return "Internship";
  }

  if (
    lower.includes(
      "apprentice",
    )
  ) {
    return "Apprenticeship";
  }

  if (
    lower.includes(
      "contract",
    )
  ) {
    return "Contract";
  }

  if (
    lower.includes(
      "full time",
    ) ||
    lower.includes(
      "full-time",
    )
  ) {
    return "Full-time";
  }

  return "Job";
}

function isBadTitle(
  title: string,
): boolean {
  const value =
    cleanText(
      title,
    ).toLowerCase();

  if (
    value.length <
      3 ||
    value.length >
      180
  ) {
    return true;
  }

  return BAD_TITLES.some(
    (
      item,
    ) =>
      value ===
      item,
  );
}

function extractDate(
  text: string,
): string | undefined {
  const match =
    text.match(
      /\b(?:posted(?:\s+on)?|date(?:\s+posted)?)[\s:–-]*([0-3]?\d[\s./-](?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2})[\s./-]\d{2,4})/i,
    ) ||
    text.match(
      /\b([0-3]?\d\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b/i,
    );

  return match?.[1]
    ? cleanText(
        match[1],
      )
    : undefined;
}

function makeId(
  source:
    string,
  url:
    string,
): string {
  const value =
    `${source}|${url}`;

  let hash =
    0;

  for (
    let index =
      0;
    index <
    value.length;
    index +=
      1
  ) {
    hash =
      (
        hash *
          31 +
        value.charCodeAt(
          index,
        )
      ) >>>
      0;
  }

  return `${source}-${hash.toString(
    36,
  )}`;
}

function titleFromElement(
  $:
    cheerio.CheerioAPI,
  element:
    any,
): string {
  const anchor =
    $(element);

  const anchorText =
    cleanText(
      anchor.text(),
    );

  if (
    anchorText &&
    !isBadTitle(
      anchorText,
    )
  ) {
    return anchorText;
  }

  const container =
    anchor
      .closest(
        "article,li,tr,[class*='job'],[class*='result'],[class*='card']",
      )
      .first();

  const heading =
    cleanText(
      container
        .find(
          "h1,h2,h3,h4,[class*='title']",
        )
        .first()
        .text(),
    );

  if (
    heading &&
    !isBadTitle(
      heading,
    )
  ) {
    return heading;
  }

  return "";
}

function contextFromElement(
  $:
    cheerio.CheerioAPI,
  element:
    any,
): string {
  const anchor =
    $(element);

  const container =
    anchor
      .closest(
        "article,li,tr,[class*='job'],[class*='result'],[class*='card']",
      )
      .first();

  const text =
    container.length
      ? container.text()
      : anchor
          .parent()
          .text();

  return cleanText(
    text,
  ).slice(
    0,
    1200,
  );
}

function findJsonJobs(
  $:
    cheerio.CheerioAPI,
  source:
    LiveSource,
): MumbaiJob[] {
  const jobs:
    MumbaiJob[] = [];

  const seen =
    new Set<string>();

  function inspect(
    value:
      unknown,
  ) {
    if (
      Array.isArray(
        value,
      )
    ) {
      for (
        const item
        of value
      ) {
        inspect(
          item,
        );
      }

      return;
    }

    if (
      !value ||
      typeof value !==
        "object"
    ) {
      return;
    }

    const record =
      value as
        Record<
          string,
          any
        >;

    const rawType =
      record["@type"];

    const isJob =
      rawType ===
        "JobPosting" ||
      (
        Array.isArray(
          rawType,
        ) &&
        rawType.includes(
          "JobPosting",
        )
      );

    if (isJob) {
      const title =
        cleanText(
          String(
            record.title ||
              "",
          ),
        );

      const rawUrl =
        String(
          record.url ||
            "",
        );

      const url =
        officialUrl(
          rawUrl,
          source,
        );

      const locationText =
        cleanText(
          JSON.stringify(
            record.jobLocation ||
              record.applicantLocationRequirements ||
              "",
          ),
        );

      const location =
        locationFromText(
          locationText,
        ) ||
        (
          null
        );

      if (
        url &&
        location &&
        title &&
        !isBadTitle(
          title,
        )
      ) {
        const key =
          `${title}|${url}`;

        if (
          !seen.has(
            key,
          )
        ) {
          seen.add(
            key,
          );

          jobs.push({
            id:
              makeId(
                source.key,
                url,
              ),

            title,
            company:
              source.name,
            companyKey:
              source.key,
            category:
              source.category,

            type:
              inferType(
                String(
                  record.employmentType ||
                    "",
                ),
              ),

            location,

            officialUrl:
              url,

            careerUrl:
              source.careerUrl,

            postedDate:
              typeof record.datePosted ===
              "string"
                ? record.datePosted
                : undefined,
          });
        }
      }
    }

    for (
      const child
      of Object.values(
        record,
      )
    ) {
      if (
        child &&
        typeof child ===
          "object"
      ) {
        inspect(
          child,
        );
      }
    }
  }

  $(
    'script[type="application/ld+json"]',
  ).each(
    (
      _index,
      element,
    ) => {
      try {
        const text =
          $(element)
            .html();

        if (!text) {
          return;
        }

        inspect(
          JSON.parse(
            text,
          ),
        );
      } catch {
        // Ignore invalid JSON-LD.
      }
    },
  );

  return jobs;
}

async function fetchSource(
  source:
    LiveSource,
): Promise<MumbaiJob[]> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      10000,
    );

  try {
    const response =
      await fetch(
        source.listingUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 PrimeDigitalSchool-Jobs/1.0",

            Accept:
              "text/html,application/xhtml+xml",

            "Accept-Language":
              "en-IN,en;q=0.9",
          },

          signal:
            controller.signal,

          cache:
            "no-store",
        },
      );

    if (
      !response.ok
    ) {
      console.warn(
        `[Mumbai Jobs] ${source.name}: HTTP ${response.status}`,
      );

      return [];
    }

    const html =
      await response.text();

    const $ =
      cheerio.load(
        html,
      );

    const results:
      MumbaiJob[] = [];

    const seen =
      new Set<string>();

    function add(
      job:
        MumbaiJob,
    ) {
      const key =
        job.officialUrl;

      if (
        seen.has(
          key,
        )
      ) {
        return;
      }

      seen.add(
        key,
      );

      results.push(
        job,
      );
    }

    for (
      const job
      of findJsonJobs(
        $,
        source,
      )
    ) {
      add(
        job,
      );
    }

    $(
      "a[href]",
    ).each(
      (
        _index,
        element,
      ) => {
        if (
          results.length >=
          (
            source.maxItems ||
            25
          )
        ) {
          return;
        }

        const href =
          $(element)
            .attr(
              "href",
            );

        if (!href) {
          return;
        }

        const url =
          officialUrl(
            href,
            source,
          );

        if (
          !url ||
          !looksLikeJobLink(
            url,
          )
        ) {
          return;
        }

        const title =
          titleFromElement(
            $,
            element,
          );

        if (
          !title ||
          isBadTitle(
            title,
          )
        ) {
          return;
        }

        const context =
          contextFromElement(
            $,
            element,
          );

        const location =
          locationFromText(
            `${title} ${context} ${url}`,
          ) ||
          (
            null
          );

        if (!location) {
          return;
        }

        add({
          id:
            makeId(
              source.key,
              url,
            ),

          title,

          company:
            source.name,

          companyKey:
            source.key,

          category:
            source.category,

          type:
            inferType(
              context,
            ),

          location,

          officialUrl:
            url,

          careerUrl:
            source.careerUrl,

          postedDate:
            extractDate(
              context,
            ),
        });
      },
    );

    console.log(
      `[Mumbai Jobs] ${source.name}: ${results.length} real openings`,
    );

    return results.slice(
      0,
      source.maxItems ||
        25,
    );
  } catch (error) {
    console.warn(
      `[Mumbai Jobs] Failed: ${source.name}`,
      error,
    );

    return [];
  } finally {
    clearTimeout(
      timeout,
    );
  }
}

const cachedMumbaiJobs =
  unstable_cache(
    async () => {
      const groups =
        await Promise.all(
          COLLECTION_SOURCES.map(fetchSource),
        );

      const jobs =
        groups.flat();

      const unique =
        new Map<
          string,
          MumbaiJob
        >();

      for (
        const job
        of jobs
      ) {
        unique.set(
          job.officialUrl,
          job,
        );
      }

      return Array.from(
        unique.values(),
      ).sort(
        (
          a,
          b,
        ) =>
          a.company.localeCompare(
            b.company,
          ) ||
          a.title.localeCompare(
            b.title,
          ),
      );
    },

    [
      "prime-digital-mumbai-navi-jobs-v5",
    ],

    {
      revalidate:
        900,

      tags: [
        "prime-digital-mumbai-jobs",
      ],
    },
  );

export async function getMumbaiJobs():
  Promise<MumbaiJob[]> {
  return cachedMumbaiJobs();
}