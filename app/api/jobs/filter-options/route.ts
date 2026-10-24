import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { INDIA_REGIONS, normalizeIndianCity } from "@/lib/jobs/locations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Option = { key: string; name: string };
const valid = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function GET(request: NextRequest) {
  try {
    const regionName = request.nextUrl.searchParams.get("state")?.slice(0, 100) ?? "";
    const region = INDIA_REGIONS.find((item) => item.name === regionName);
    const db = await getDatabase();
    const jobs = db.collection("job_listings");
    const visible = {
      locationReviewStatus: { $ne: "needs-review" },
      status: { $nin: ["closed", "expired"] },
      countryCode: "IN",
    };

    const [companies, cities, additionalCities, locationStates] = await Promise.all([
      jobs.aggregate<{ _id: string; name: string }>([
        { $match: visible },
        { $match: { companyKey: { $type: "string", $ne: "" } } },
        { $group: { _id: "$companyKey", name: { $first: "$company" } } },
        { $sort: { name: 1 } },
        { $limit: 1000 },
      ]).toArray(),
      region ? jobs.distinct("city", { ...visible, $or: [
        { state: region.name }, { "locationStates.state": region.name },
      ] }) : Promise.resolve([]),
      region ? jobs.distinct("locations", { ...visible, $or: [
        { state: region.name }, { "locationStates.state": region.name },
      ] }) : Promise.resolve([]),
      region ? jobs.distinct("locationStates.city", {
        ...visible, "locationStates.state": region.name,
      }) : Promise.resolve([]),
    ]);

    const allowed = new Set(region?.cities ?? []);
    const cityNames = new Set<string>();
    for (const candidate of [...cities, ...additionalCities, ...locationStates]) {
      if (!valid(candidate)) continue;
      const city = normalizeIndianCity(candidate) ?? candidate.trim();
      if (allowed.has(city)) cityNames.add(city);
    }
    // Static registry is a fallback if imported records do not yet use structured locations.
    const cityOptions = [...cityNames].sort((a, b) => a.localeCompare(b));
    const companyOptions: Option[] = companies
      .filter((item) => valid(item._id) && valid(item.name))
      .map((item) => ({ key: item._id, name: item.name }));

    return NextResponse.json({ success: true, companies: companyOptions, cities: cityOptions }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Job Connect filter options failed:", error);
    return NextResponse.json({ success: false, error: "Unable to load filter options." }, { status: 500 });
  }
}