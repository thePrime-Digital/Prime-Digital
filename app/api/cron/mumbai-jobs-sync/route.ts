import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { syncMumbaiJobsToDatabase } from "@/lib/mumbai-jobs-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";

  if (!secret || secret.length < 32) {
    return NextResponse.json(
      { error: "CRON_SECRET is missing or too short." },
      { status: 503 }
    );
  }

  const expected = Buffer.from("Bearer " + secret);
  const received = Buffer.from(auth);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const result = await syncMumbaiJobsToDatabase();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Mumbai jobs sync failed:", error);
    return NextResponse.json(
      { error: "Synchronization failed." },
      { status: 500 }
    );
  }
}

// Vercel Cron invokes this endpoint using GET.
// Reuse the existing authenticated synchronization logic.
export async function GET(request: Request) {
  return POST(request);
}