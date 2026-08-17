"use client";

import {
  useState,
} from "react";

import AdminRecordsManager from "@/components/admin/admin-records-manager";

type SubmissionTab =
  | "contacts"
  | "careers"
  | "service-leads";

export default function SubmissionsHub() {
  const [tab, setTab] =
    useState<SubmissionTab>(
      "contacts",
    );

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
            Submissions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review contact enquiries, career applications and Prime Digital Solutions leads.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <TabButton
            active={
              tab ===
              "contacts"
            }
            onClick={() =>
              setTab(
                "contacts",
              )
            }
          >
            Contact Enquiries
          </TabButton>

          <TabButton
            active={
              tab ===
              "careers"
            }
            onClick={() =>
              setTab(
                "careers",
              )
            }
          >
            Career Applications
          </TabButton>

          <TabButton
            active={
              tab ===
              "service-leads"
            }
            onClick={() =>
              setTab(
                "service-leads",
              )
            }
          >
            Service Leads
          </TabButton>
        </div>

        {tab ===
          "contacts" && (
          <AdminRecordsManager
            embedded
            resource="contacts"
            title="Contact Enquiries"
            description=""
            columns={[
              {
                label:
                  "Name",
                keys: [
                  "name",
                  "fullName",
                ],
              },
              {
                label:
                  "Email",
                keys: [
                  "email",
                ],
              },
              {
                label:
                  "Phone",
                keys: [
                  "phone",
                ],
              },
              {
                label:
                  "Subject",
                keys: [
                  "subject",
                  "message",
                ],
              },
            ]}
          />
        )}

        {tab ===
          "careers" && (
          <AdminRecordsManager
            embedded
            resource="careers"
            title="Career Applications"
            description=""
            columns={[
              {
                label:
                  "Applicant",
                keys: [
                  "name",
                  "fullName",
                ],
              },
              {
                label:
                  "Email",
                keys: [
                  "email",
                ],
              },
              {
                label:
                  "Position",
                keys: [
                  "position",
                  "role",
                  "jobTitle",
                ],
              },
              {
                label:
                  "Phone",
                keys: [
                  "phone",
                ],
              },
            ]}
          />
        )}

        {tab ===
          "service-leads" && (
          <AdminRecordsManager
            embedded
            resource="service-leads"
            title="Service Leads"
            description=""
            columns={[
              {
                label:
                  "Lead",
                keys: [
                  "name",
                  "fullName",
                ],
              },
              {
                label:
                  "Email",
                keys: [
                  "email",
                ],
              },
              {
                label:
                  "Service",
                keys: [
                  "service",
                  "interest",
                ],
              },
              {
                label:
                  "Company",
                keys: [
                  "company",
                  "businessName",
                ],
              },
            ]}
          />
        )}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-4 py-2.5 text-[10px] font-black transition",
        active
          ? "bg-[#8f0024] text-white"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
