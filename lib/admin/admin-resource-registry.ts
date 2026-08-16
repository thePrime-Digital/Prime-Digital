export type AdminResourceKey =
  | "admissions"
  | "contacts"
  | "careers"
  | "service-leads";

export type AdminResourceConfig = {
  key: AdminResourceKey;
  collection: string;
  label: string;
  searchFields: string[];
  statuses: string[];
  defaultStatus: string;
};

const COMMON_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "approved",
  "rejected",
  "closed",
];

const registry: Record<
  AdminResourceKey,
  AdminResourceConfig
> = {
  admissions: {
    key: "admissions",
    collection:
      "admission_applications",

    label:
      "Admission Applications",

    searchFields: [
      "name",
      "fullName",
      "studentName",
      "email",
      "phone",
      "program",
      "course",
      "message",
    ],

    statuses:
      COMMON_STATUSES,

    defaultStatus:
      "new",
  },

  contacts: {
    key: "contacts",
    collection:
      "contact_submissions",

    label:
      "Contact Enquiries",

    searchFields: [
      "name",
      "fullName",
      "email",
      "phone",
      "subject",
      "message",
    ],

    statuses:
      COMMON_STATUSES,

    defaultStatus:
      "new",
  },

  careers: {
    key: "careers",
    collection:
      "career_applications",

    label:
      "Career Applications",

    searchFields: [
      "name",
      "fullName",
      "email",
      "phone",
      "position",
      "role",
      "message",
    ],

    statuses:
      COMMON_STATUSES,

    defaultStatus:
      "new",
  },

  "service-leads": {
    key:
      "service-leads",

    collection:
      "service_leads",

    label:
      "Service Leads",

    searchFields: [
      "name",
      "fullName",
      "email",
      "phone",
      "company",
      "service",
      "interest",
      "message",
    ],

    statuses:
      COMMON_STATUSES,

    defaultStatus:
      "new",
  },
};

export function getAdminResourceConfig(
  resource: string,
): AdminResourceConfig | null {
  if (
    resource === "admissions" ||
    resource === "contacts" ||
    resource === "careers" ||
    resource ===
      "service-leads"
  ) {
    return registry[resource];
  }

  return null;
}
