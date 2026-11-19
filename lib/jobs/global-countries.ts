/**
 * Prime Digital School
 * Global Job Opportunities - Country Registry
 *
 * PDS provides job listings only.
 * Hiring, work permits, and visa sponsorship
 * are handled by the respective employers.
 */

export const GLOBAL_COUNTRIES = [
  {
    code: "AE",
    name: "United Arab Emirates",
    shortName: "UAE",
    currency: "AED",
    enabled: true,
  },
  {
    code: "SG",
    name: "Singapore",
    shortName: "Singapore",
    currency: "SGD",
    enabled: true,
  },
  {
    code: "GB",
    name: "United Kingdom",
    shortName: "UK",
    currency: "GBP",
    enabled: true,
  },
  {
    code: "DE",
    name: "Germany",
    shortName: "Germany",
    currency: "EUR",
    enabled: true,
  },
  {
    code: "CA",
    name: "Canada",
    shortName: "Canada",
    currency: "CAD",
    enabled: true,
  },
  {
    code: "AU",
    name: "Australia",
    shortName: "Australia",
    currency: "AUD",
    enabled: true,
  },
] as const;

export const INDIA_COUNTRY_OPTION = {
  code: "IN",
  name: "India",
  shortName: "India",
  currency: "INR",
  enabled: true,
} as const;

export const ALL_JOB_COUNTRIES = [
  INDIA_COUNTRY_OPTION,
  ...GLOBAL_COUNTRIES,
] as const;

export type SupportedCountryCode =
  (typeof ALL_JOB_COUNTRIES)[number]["code"];

export function getCountryByCode(
  code: string | null | undefined,
) {
  if (!code) return null;

  const normalized = code.trim().toUpperCase();

  return (
    ALL_JOB_COUNTRIES.find(
      (country) => country.code === normalized,
    ) ?? null
  );
}

export function isSupportedCountry(
  code: string | null | undefined,
): boolean {
  return getCountryByCode(code) !== null;
}

export function getInternationalCountries() {
  return GLOBAL_COUNTRIES.filter(
    (country) => country.enabled,
  );
}

export const GLOBAL_JOBS_DISCLAIMER =
  "Prime Digital School is a job listing platform. " +
  "Applications are submitted directly to employers. " +
  "Recruitment, eligibility, work authorization, " +
  "and any visa sponsorship are the responsibility " +
  "of the respective employer.";
