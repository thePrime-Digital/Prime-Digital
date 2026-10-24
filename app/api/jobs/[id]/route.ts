import { NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";
import type { MumbaiJob } from "@/lib/mumbai-jobs";
import type { JobListing } from "@/lib/jobs/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ID_PATTERN = /^[a-zA-Z0-9_-]{1,150}$/;

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!ID_PATTERN.test(id)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid job ID.",
      },
      { status: 400 },
    );
  }

  try {
    const db = await getDatabase();

    const globalJob = await db
      .collection<JobListing>("job_listings")
      .findOne({ id }, { projection: { _id: 0 } });

    if (globalJob) {
      if (
        globalJob.locationReviewStatus === "needs-review" ||
        globalJob.status === "closed" ||
        globalJob.status === "expired"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "This job is temporarily unavailable.",
          },
          {
            status: 404,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          source: "global",
          job: globalJob,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // Fallback is permitted only when no global
    // record exists for this ID.
    const legacyJob = await db
      .collection<MumbaiJob>("mumbai_job_listings")
      .findOne({ id }, { projection: { _id: 0 } });

    if (!legacyJob) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: "legacy",
        job: legacyJob,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Job detail API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve job details.",
      },
      { status: 500 },
    );
  }
}
