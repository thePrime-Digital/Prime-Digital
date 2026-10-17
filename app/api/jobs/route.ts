import { NextResponse } from "next/server";
import { getStoredMumbaiJobs } from "@/lib/mumbai-jobs-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await getStoredMumbaiJobs();
    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API failed:", error);
    return NextResponse.json(
      { error: "Could not load jobs." },
      { status: 500 }
    );
  }
}