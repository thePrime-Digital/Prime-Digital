import { NextRequest, NextResponse } from "next/server";
import { getStoredMumbaiJobs } from "@/lib/mumbai-jobs-store";
import { searchGlobalJobs, type JobSearchFilters } from "@/lib/jobs/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEYS = ["scope", "search", "countryCode", "state", "city", "category", "type", "workMode", "companyKey", "status", "sortBy", "savedIds", "page", "limit"];
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,150}$/;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    // Preserve the original contract for existing student/dashboard consumers.
    if (!KEYS.some((key) => params.has(key))) {
      const jobs = await getStoredMumbaiJobs();
      return NextResponse.json({ success: true, count: jobs.length, jobs }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    // scope=global guarantees nationwide results, even without other filters.
    const get = (key: string) => params.get(key)?.trim().slice(0, 100) || undefined;
    const positive = (key: string, fallback: number, max: number) => {
      const raw = params.get(key);
      if (!raw || !/^\d+$/.test(raw)) return fallback;
      const value = Number(raw);
      return Number.isSafeInteger(value) && value > 0 ? Math.min(value, max) : fallback;
    };
    const sortBy = get("sortBy");
    const savedIds = params.has("savedIds")
      ? (params.get("savedIds") ?? "").split(",").filter((id) => ID_PATTERN.test(id)).slice(0, 200)
      : undefined;
    const filters: JobSearchFilters = {
      search: get("search"), countryCode: get("countryCode"), state: get("state"),
      city: get("city"), category: get("category"), type: get("type"),
      companyKey: get("companyKey"), workMode: get("workMode"), status: get("status"),
      sortBy: sortBy && ["recent", "company", "title", "location"].includes(sortBy)
        ? sortBy as JobSearchFilters["sortBy"] : "recent",
      savedIds,
      page: positive("page", 1, 100000), limit: positive("limit", 20, 100),
    };
    const result = await searchGlobalJobs(filters);
    return NextResponse.json({
      success: true, count: result.jobs.length, total: result.total,
      page: result.page, limit: result.limit, totalPages: result.totalPages,
      hasNextPage: result.page < result.totalPages,
      hasPreviousPage: result.page > 1, jobs: result.jobs,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Jobs API failed:", error);
    return NextResponse.json({ success: false, error: "Could not load jobs." }, { status: 500 });
  }
}
