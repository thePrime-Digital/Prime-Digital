import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { INDIA_REGIONS, normalizeIndianCity } from "@/lib/jobs/locations";
import {
  ALL_JOB_COUNTRIES,
  getCountryByCode,
} from "@/lib/jobs/global-countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Option = { key: string; name: string };

const valid = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const requestedCountry = params.get("countryCode") ?? "IN";
    const selectedCountry = getCountryByCode(requestedCountry);

    if (!selectedCountry) {
      return NextResponse.json(
        { success: false, error: "Unsupported country." },
        { status: 400 },
      );
    }

    const countryCode = selectedCountry.code;
    const state = params.get("state")?.trim().slice(0, 100) ?? "";

    const db = await getDatabase();
    const jobs = db.collection("job_listings");

    const visible = {
      locationReviewStatus: { $ne: "needs-review" },
      status: { $nin: ["closed", "expired"] },
      publicationStatus: { $ne: "not-published" },
      countryCode,
    };

    const region =
      countryCode === "IN"
        ? INDIA_REGIONS.find((item) => item.name === state)
        : undefined;

    const companyRows = await jobs.aggregate<{
      _id: string;
      name: string;
    }>([
      { $match: visible },
      {
        $match: {
          companyKey: { $type: "string", $ne: "" },
        },
      },
      {
        $group: {
          _id: "$companyKey",
          name: { $first: "$company" },
        },
      },
      { $sort: { name: 1 } },
      { $limit: 1000 },
    ]).toArray();

    const companies: Option[] = companyRows
      .filter((item) => valid(item._id) && valid(item.name))
      .map((item) => ({
        key: item._id,
        name: item.name,
      }));

    if (countryCode === "IN") {
      const locationFilter = region
        ? {
            ...visible,
            $or: [
              { state: region.name },
              { "locationStates.state": region.name },
            ],
          }
        : null;

      const [primary, additional, nested] = locationFilter
        ? await Promise.all([
            jobs.distinct("city", locationFilter),
            jobs.distinct("locations", locationFilter),
            jobs.distinct(
              "locationStates.city",
              {
                ...visible,
                "locationStates.state": region!.name,
              },
            ),
          ])
        : [[], [], []];

      const allowed = new Set(region?.cities ?? []);
      const cities = [...new Set(
        [...primary, ...additional, ...nested]
          .filter(valid)
          .map((city) => normalizeIndianCity(city) ?? city.trim())
          .filter((city) => allowed.has(city)),
      )].sort((a, b) => a.localeCompare(b));

      return NextResponse.json(
        {
          success: true,
          countryCode,
          countries: ALL_JOB_COUNTRIES,
          states: INDIA_REGIONS.map((item) => item.name),
          companies,
          cities,
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    const [rawStates, rawCities, rawAdditionalCities] =
      await Promise.all([
        jobs.distinct("state", visible),
        jobs.distinct("city", {
          ...visible,
          ...(state ? { state } : {}),
        }),
        jobs.distinct("locations", {
          ...visible,
          ...(state ? { state } : {}),
        }),
      ]);

    const states = rawStates
      .filter(valid)
      .map((value) => value.trim())
      .filter((value) => value.length <= 100)
      .sort((a, b) => a.localeCompare(b));

    const cities = [...new Set(
      [...rawCities, ...rawAdditionalCities]
        .filter(valid)
        .map((value) => value.trim())
        .filter((value) => value.length <= 100),
    )].sort((a, b) => a.localeCompare(b));

    return NextResponse.json(
      {
        success: true,
        countryCode,
        countries: ALL_JOB_COUNTRIES,
        states: [...new Set(states)],
        companies,
        cities,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Job filter options failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load filter options.",
      },
      { status: 500 },
    );
  }
}
