"use client";

import {
  useState,
} from "react";

import FeesDashboard from "@/components/fees/fees-dashboard";
import FeeInstallments from "@/components/fees/fee-installments";

type FeesRole =
  | "admin"
  | "faculty"
  | "student";

type FeesTab =
  | "dues"
  | "installments";

export default function FeesCenter({
  role,
}: {
  role: FeesRole;
}) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<FeesTab>(
      "dues",
    );

  /*
   * Keep faculty on the existing fee dashboard.
   * EMI management is for Admin + Student.
   */
  if (
    role === "faculty"
  ) {
    return (
      <FeesDashboard
        role="faculty"
      />
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc]">
      {/* ========================================= */}
      {/* FEE TABS */}
      {/* ========================================= */}

      <div className="border-b border-slate-200 bg-white px-5 pt-4 sm:px-7 lg:px-8">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "dues",
              )
            }
            className={[
              "rounded-lg px-5 py-2.5 text-xs font-black transition",
              activeTab ===
              "dues"
                ? "bg-white text-[#8f0024] shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-800",
            ].join(
              " ",
            )}
          >
            Dues & Collections
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "installments",
              )
            }
            className={[
              "rounded-lg px-5 py-2.5 text-xs font-black transition",
              activeTab ===
              "installments"
                ? "bg-white text-[#8f0024] shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-800",
            ].join(
              " ",
            )}
          >
            EMI Installments
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}

      {activeTab ===
      "dues" ? (
        <FeesDashboard
          role={role}
        />
      ) : (
        <FeeInstallments
          role={role}
        />
      )}
    </div>
  );
}