import type { Metadata } from "next";

import MumbaiJobsClient from "@/components/mumbai-jobs-client";

import { OFFICIAL_MUMBAI_JOB_SOURCES } from "@/lib/mumbai-jobs";

import { searchGlobalJobs } from "@/lib/jobs/repository";

import {
  getPublishedCareerJobs,
  type PublicCareerJob,
} from "@/lib/careers/public-careers";

import type { JobListing } from "@/lib/jobs/types";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job Connect | Prime Digital School",
  description:
    "Explore job opportunities across India and discover career openings at Prime Digital School.",
  alternates: {
    canonical: "/job-connect",
  },
};

type PageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function JobConnectPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;

  const initialTab: "jobs" | "careers" = tab === "careers" ? "careers" : "jobs";

  let externalJobs: JobListing[] = [];

  let externalTotal = 0;

  let pdsJobs: PublicCareerJob[] = [];

  const [externalResult, pdsResult] = await Promise.allSettled([
    searchGlobalJobs({
      page: 1,
      limit: 20,
      sortBy: "recent",
    }),

    getPublishedCareerJobs(),
  ]);

  if (externalResult.status === "fulfilled") {
    externalJobs = externalResult.value.jobs;
    externalTotal = externalResult.value.total;
  } else {
    console.error(
      "[JOB_CONNECT] Unable to load external jobs:",
      externalResult.reason,
    );
  }

  if (pdsResult.status === "fulfilled") {
    pdsJobs = pdsResult.value;
  } else {
    console.error(
      "[JOB_CONNECT] Unable to load PDS career jobs:",
      pdsResult.reason,
    );
  }

  const checkedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <MumbaiJobsClient
      jobs={externalJobs}
      initialTotal={externalTotal}
      sources={OFFICIAL_MUMBAI_JOB_SOURCES}
      checkedAt={checkedAt}
      pdsJobs={pdsJobs}
      initialTab={initialTab}
    />
  );
}
