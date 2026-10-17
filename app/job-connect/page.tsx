import type { Metadata } from "next";

import MumbaiJobsClient from "@/components/mumbai-jobs-client";

import {
  getMumbaiJobs,
  OFFICIAL_MUMBAI_JOB_SOURCES,
  type MumbaiJob,
} from "@/lib/mumbai-jobs";

import { getStoredMumbaiJobs } from "@/lib/mumbai-jobs-store";

export const runtime = "nodejs";
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Job Connect | Prime Digital School",
  description:
    "Discover jobs and internships across Mumbai and Navi Mumbai through Prime Digital School Job Connect.",
  alternates: {
    canonical: "/job-connect",
  },
};

export default async function MumbaiJobsPage() {
  let jobs: MumbaiJob[] = [];

  try {
    jobs = await getStoredMumbaiJobs();
  } catch (error) {
    console.error("Mumbai Jobs database unavailable:", error);
  }

  if (jobs.length === 0) {
    jobs = await getMumbaiJobs();
  }

  const checkedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <MumbaiJobsClient
      jobs={jobs}
      sources={OFFICIAL_MUMBAI_JOB_SOURCES}
      checkedAt={checkedAt}
    />
  );
}