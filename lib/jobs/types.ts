import type { MumbaiJob } from "@/lib/mumbai-jobs";

/**
 * Global Job Connect data types.
 *
 * Legacy Mumbai jobs remain supported during migration.
 * Missing employer-provided details must stay null or unknown.
 */

export type CountryCode =
  | "IN"
  | "AE"
  | "SG"
  | "GB"
  | "CA"
  | "AU"
  | (string & {});

export type WorkMode = "on-site" | "hybrid" | "remote" | "unknown";

export type ExperienceLevel =
  | "fresher"
  | "entry"
  | "mid"
  | "senior"
  | "unknown";

export type JobStatus = "active" | "unverified" | "expired" | "closed";

export type VisaSponsorship = "yes" | "no" | "unknown";

export type SalaryPeriod = "annual" | "monthly" | "hourly" | "unknown";

export type EmploymentType =
  | "Job"
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Apprenticeship"
  | "Contract"
  | "Temporary"
  | "Other";

export type JobLocation = {
  countryCode: CountryCode | null;
  country: string | null;
  state: string | null;
  city: string | null;
  locationLabel: string;
  workMode: WorkMode;
};

export type JobSalary = {
  min: number | null;
  max: number | null;
  currency: string | null;
  period: SalaryPeriod;
};

export type JobExperience = {
  level: ExperienceLevel;
  minYears: number | null;
  maxYears: number | null;
};

export type JobVerification = {
  status: JobStatus;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  lastVerifiedAt: string | null;
};

export type JobListing = Omit<MumbaiJob, "location" | "category" | "type"> & {
  location: string;
  category: string;
  type: EmploymentType | string;

  countryCode?: CountryCode | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  locations?: string[];
  locationStates?: Array<{
    city: string;
    state: string | null;
  }>;
  locationLabel?: string;

  workMode?: WorkMode;

  experienceLevel?: ExperienceLevel;
  experienceMinYears?: number | null;
  experienceMaxYears?: number | null;

  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: SalaryPeriod;

  skills?: string[];

  sourceId?: string | null;
  sourceJobId?: string | null;

  postedAt?: string | null;
  firstSeenAt?: string | null;
  lastSeenAt?: string | null;
  lastVerifiedAt?: string | null;

  status?: JobStatus;
  visaSponsorship?: VisaSponsorship;

  remoteEligibleCountries?: CountryCode[];
  workAuthorization?: string | null;

  locationReviewStatus?: "needs-review" | "verified";

  locationReviewReason?: string;
  locationReviewSuggestedCity?: string | null;
  locationReviewFlaggedAt?: Date | string | null;
};

/**
 * A normalized record can be constructed from an
 * existing MumbaiJob without changing its ID or URL.
 */
export function legacyJobToListing(job: MumbaiJob): JobListing {
  return {
    ...job,

    countryCode: "IN",
    country: "India",
    state: "Maharashtra",
    city: job.location,
    locationLabel: `${job.location}, Maharashtra, India`,

    workMode: "unknown",

    experienceLevel: "unknown",
    experienceMinYears: null,
    experienceMaxYears: null,

    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: "unknown",

    skills: [],

    sourceId: job.companyKey,
    sourceJobId: null,

    postedAt: null,
    firstSeenAt: null,
    lastSeenAt: null,
    lastVerifiedAt: null,

    status: "unverified",
    visaSponsorship: "unknown",

    remoteEligibleCountries: [],
    workAuthorization: null,
  };
}

export function isValidJobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
