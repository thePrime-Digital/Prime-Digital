import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  getMumbaiJobFreshnessReport,
  getMumbaiJobStaleCandidates,
} from "@/lib/mumbai-jobs-freshness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret || secret.length < 32) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(
    request.headers.get("authorization") || "",
  );

  return (
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const [report, staleCandidates] = await Promise.all([
      getMumbaiJobFreshnessReport(),
      getMumbaiJobStaleCandidates(),
    ]);

    return NextResponse.json({
      success: true,
      report,
      staleCandidates,
    });
  } catch (error) {
    console.error("Jobs freshness report failed:", error);

    return NextResponse.json(
      { error: "Unable to calculate job freshness." },
      { status: 500 },
    );
  }
}