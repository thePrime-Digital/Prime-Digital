import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuditRow = {
  Company?: string;
  HTTPStatus?: string;
  OriginalURL?: string;
  FinalURL?: string;
  Error?: string;
};

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) return false;

  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (
      !body ||
      !Array.isArray(body.records) ||
      body.records.length < 1 ||
      body.records.length > 200 ||
      typeof body.dryRun !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Provide 1-200 records and dryRun boolean." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const jobs = db.collection("mumbai_job_listings");
    const checks = db.collection("mumbai_job_link_checks");

    const issues: string[] = [];
    const approved: Array<{
      jobId: string;
      company: string;
      originalUrl: string;
      finalUrl: string;
      httpStatus: number | null;
      reachable: boolean;
      error: string;
    }> = [];

    const seen = new Set<string>();

    for (const [index, raw] of body.records.entries()) {
      const row = raw as AuditRow;
      const url = String(row?.OriginalURL || "").trim();
      const company = String(row?.Company || "").trim();
      const status = String(row?.HTTPStatus || "").trim();

      if (!url.startsWith("https://") || !company) {
        issues.push(`Row ${index + 1}: Invalid URL or company`);
        continue;
      }

      if (seen.has(url)) {
        issues.push(`Row ${index + 1}: Duplicate URL`);
        continue;
      }

      seen.add(url);

      const job = await jobs.findOne({
        officialUrl: url,
        company,
      });

      if (!job || typeof job.id !== "string") {
        issues.push(`Row ${index + 1}: No matching stored job`);
        continue;
      }

      const httpStatus = /^[1-5]\d\d$/.test(status)
        ? Number(status)
        : null;

      if (httpStatus === null && status !== "Error") {
        issues.push(`Row ${index + 1}: Invalid HTTP status`);
        continue;
      }

      const finalUrl = String(row.FinalURL || "").trim();

      if (finalUrl && !finalUrl.startsWith("https://")) {
        issues.push(`Row ${index + 1}: Invalid final URL`);
        continue;
      }

      approved.push({
        jobId: job.id,
        company: job.company as string,
        originalUrl: url,
        finalUrl,
        httpStatus,
        reachable: httpStatus !== null &&
          httpStatus >= 200 &&
          httpStatus < 300,
        error: String(row.Error || "").slice(0, 500),
      });
    }

    if (body.dryRun === true) {
      return NextResponse.json({
        success: true,
        mode: "preview",
        received: body.records.length,
        matched: approved.length,
        unmatched: issues.length,
        reachable: approved.filter(r => r.reachable).length,
        errors: issues.slice(0, 30),
        databaseModified: false,
      });
    }

    if (issues.length > 0) {
      return NextResponse.json(
        {
          error: "Import rejected because some records are invalid.",
          issues: issues.slice(0, 30),
          databaseModified: false,
        },
        { status: 422 }
      );
    }

    await checks.createIndex(
      { jobId: 1 },
      { unique: true }
    );

    const importedAt = new Date();

    const operations = approved.map(row => ({
      updateOne: {
        filter: { jobId: row.jobId },
        update: {
          $set: {
            ...row,
            linkStatus: row.reachable
              ? "http-reachable"
              : "http-error",
            vacancyStatus: "unverified",
            verificationMethod: "HTTP request only",
            importedAt,
          },
        },
        upsert: true,
      },
    }));

    const result = await checks.bulkWrite(operations, {
      ordered: true,
    });

    return NextResponse.json({
      success: true,
      mode: "committed",
      received: body.records.length,
      matched: approved.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      collection: "mumbai_job_link_checks",
      originalJobsModified: false,
    });
  } catch (error) {
    console.error("Job verification failed:", error);

    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 }
    );
  }
}