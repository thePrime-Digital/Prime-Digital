import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { MumbaiJob } from "@/lib/mumbai-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: Context,
) {
  const { id } = await context.params;

  if (!/^[a-zA-Z0-9_-]{1,150}$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid job ID." },
      { status: 400 }
    );
  }

  try {
    const db = await getDatabase();

    const job = await db
      .collection<MumbaiJob>("mumbai_job_listings")
      .findOne(
        { id },
        { projection: { _id: 0 } }
      );

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Job detail API failed:", error);

    return NextResponse.json(
      { error: "Unable to load job." },
      { status: 500 }
    );
  }
}