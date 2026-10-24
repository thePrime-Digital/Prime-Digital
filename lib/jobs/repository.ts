import "server-only";

import type { Filter, Sort } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import type { JobListing } from "@/lib/jobs/types";

export type JobSearchFilters = {
  search?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  category?: string;
  type?: string;
  companyKey?: string;
  workMode?: string;
  status?: string;
  sortBy?: "recent" | "company" | "title" | "location";
  savedIds?: string[];
  page?: number;
  limit?: number;
};

export type JobSearchResult = {
  jobs: JobListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function boundedInt(value: number | undefined, fallback: number, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.min(max, Math.floor(value)))
    : fallback;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchGlobalJobs(filters: JobSearchFilters = {}): Promise<JobSearchResult> {
  const db = await getDatabase();
  const collection = db.collection<JobListing>("job_listings");
  const page = boundedInt(filters.page, 1, 100000);
  const limit = boundedInt(filters.limit, 20, 100);

  const query: Filter<JobListing> = {
    locationReviewStatus: { $ne: "needs-review" },
    status: filters.status && ["active", "unverified"].includes(filters.status)
      ? filters.status as JobListing["status"]
      : { $nin: ["closed", "expired"] },
  };

  if (filters.countryCode) query.countryCode = filters.countryCode.toUpperCase();
  // Match primary city/state or additional listed locations.
  // Keep location conditions separate from keyword search $or.
  const locationConditions: Filter<JobListing>[] = [];

  if (filters.state) {
    locationConditions.push({
      $or: [
        { state: filters.state },
        { "locationStates.state": filters.state },
      ],
    });
  }

  if (filters.city) {
    locationConditions.push({
      $or: [
        { city: filters.city },
        { locations: filters.city },
        { "locationStates.city": filters.city },
      ],
    });
  }

  if (locationConditions.length > 0) {
    query.$and = locationConditions;
  }
  if (filters.category) query.category = filters.category;
  if (filters.type) query.type = filters.type;
  if (filters.companyKey) query.companyKey = filters.companyKey;
  if (filters.workMode && filters.workMode !== "unknown") {
    query.workMode = filters.workMode as JobListing["workMode"];
  }
  if (filters.savedIds) {
    query.id = { $in: filters.savedIds.slice(0, 200) };
  }
  const text = filters.search?.trim().slice(0, 100);
  if (text) {
    const pattern = escapeRegExp(text);
    query.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { company: { $regex: pattern, $options: "i" } },
      { category: { $regex: pattern, $options: "i" } },
      { locationLabel: { $regex: pattern, $options: "i" } },
    ];
  }

  const sorts: Record<string, Sort> = {
    recent: { lastSeenAt: -1, id: 1 },
    company: { company: 1, title: 1, id: 1 },
    title: { title: 1, id: 1 },
    location: { countryCode: 1, state: 1, city: 1, title: 1, id: 1 },
  };
  const sort = sorts[filters.sortBy ?? "recent"] ?? sorts.recent;

  const [jobs, total] = await Promise.all([
    collection.find(query, { projection: { _id: 0 } })
      .sort(sort).skip((page - 1) * limit).limit(limit).toArray(),
    collection.countDocuments(query),
  ]);

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getGlobalJobById(id: string): Promise<JobListing | null> {
  if (!/^[a-zA-Z0-9_-]{1,150}$/.test(id)) return null;
  const db = await getDatabase();
  return db.collection<JobListing>("job_listings").findOne(
    { id, locationReviewStatus: { $ne: "needs-review" }, status: { $nin: ["closed", "expired"] } },
    { projection: { _id: 0 } },
  );
}
