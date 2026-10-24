"use client";

import { useState, type ReactNode } from "react";

type Tab = "jobs" | "careers";

export default function JobConnectTabs({
  initialTab,
  externalJobs,
  schoolCareers,
}: {
  initialTab: Tab;
  externalJobs: ReactNode;
  schoolCareers: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  function selectTab(next: Tab) {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === "careers") url.searchParams.set("tab", "careers");
    else url.searchParams.delete("tab");
    window.history.replaceState(window.history.state, "", url.pathname + url.search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <nav aria-label="Job Connect sections" className="sticky top-16 z-30 border-b border-[#eadfe3] bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3">
          <button type="button" role="tab" aria-selected={tab === "jobs"} onClick={() => selectTab("jobs")}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition ${tab === "jobs" ? "bg-[#890026] text-white" : "bg-[#fff0f4] text-[#890026] hover:bg-[#fbe2e9]"}`}>
            Explore Jobs
          </button>
          <button type="button" role="tab" aria-selected={tab === "careers"} onClick={() => selectTab("careers")}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition ${tab === "careers" ? "bg-[#890026] text-white" : "bg-[#fff0f4] text-[#890026] hover:bg-[#fbe2e9]"}`}>
            Careers at PDS
          </button>
        </div>
      </nav>
      <div id="explore-jobs" hidden={tab !== "jobs"}>{externalJobs}</div>
      <div id="school-careers" hidden={tab !== "careers"}>{schoolCareers}</div>
    </>
  );
}