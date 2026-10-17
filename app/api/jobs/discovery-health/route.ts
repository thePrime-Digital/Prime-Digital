import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const supplied = Buffer.from(
    request.headers.get("authorization") || ""
  );
  const expected = Buffer.from(`Bearer ${secret}`);

  return (
    supplied.length === expected.length &&
    timingSafeEqual(supplied, expected)
  );
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const db = await getDatabase();

    const records = await db
      .collection("mumbai_job_listings")
      .find(
        {},
        {
          projection: {
            _id: 0,
            id: 1,
            company: 1,
            lastSeenAt: 1,
          },
        }
      )
      .toArray();

    const timestamps = records
      .map((job) =>
        job.lastSeenAt
          ? new Date(job.lastSeenAt).getTime()
          : NaN
      )
      .filter(Number.isFinite);

    const latest = timestamps.length
      ? Math.max(...timestamps)
      : null;

    const now = Date.now();
    const reviewAge = 7 * 24 * 60 * 60 * 1000;

    const rows = records.map((job) => {
      const seen = job.lastSeenAt
        ? new Date(job.lastSeenAt).getTime()
        : NaN;

      let status:
        | "seen-latest-sync"
        | "not-seen-latest-sync"
        | "needs-review" = "needs-review";

      if (
        latest !== null &&
        Number.isFinite(seen) &&
        seen === latest
      ) {
        status = "seen-latest-sync";
      } else if (
        Number.isFinite(seen) &&
        now - seen <= reviewAge
      ) {
        status = "not-seen-latest-sync";
      }

      return {
        id: job.id,
        company: job.company,
        lastSeenAt: Number.isFinite(seen)
          ? new Date(seen).toISOString()
          : null,
        discoveryStatus: status,
      };
    });

    const summary = {
      total: rows.length,
      seenLatestSync: rows.filter(
        (row) => row.discoveryStatus === "seen-latest-sync"
      ).length,
      notSeenLatestSync: rows.filter(
        (row) => row.discoveryStatus === "not-seen-latest-sync"
      ).length,
      needsReview: rows.filter(
        (row) => row.discoveryStatus === "needs-review"
      ).length,
    };

    return NextResponse.json({
      success: true,
      latestDiscoveryAt: latest
        ? new Date(latest).toISOString()
        : null,
      summary,
      jobs: rows,
      databaseModified: false,
      note:
        "Discovery status does not confirm whether a vacancy is open or closed.",
    });
  } catch (error) {
    console.error("Job discovery health failed:", error);

    return NextResponse.json(
      { error: "Unable to check discovery health." },
      { status: 500 }
    );
  }
}