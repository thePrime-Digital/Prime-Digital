"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FolderKanban,
  MessageSquare,
  ReceiptText,
} from "lucide-react";

function MiniCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FolderKanban;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-[#271a1e]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-[17px] w-[17px]" />
        </div>
      </div>
    </article>
  );
}

export default function ClientDashboardPage() {
  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                Prime Digital Solutions
              </p>

              <h1 className="mt-1 text-xl font-black text-[#271a1e]">
                Welcome to Your Client Portal
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Track projects, deliverables, meetings and communication in one place.
              </p>
            </div>

            <a
              href="/client-dashboard/requests"
              className="w-fit rounded-lg bg-[#8f0024] px-4 py-2 text-[11px] font-bold text-white"
            >
              + New Request
            </a>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MiniCard
            label="Active Projects"
            value="1"
            icon={FolderKanban}
          />

          <MiniCard
            label="Deliverables"
            value="4"
            icon={FileCheck2}
          />

          <MiniCard
            label="Upcoming Meetings"
            value="1"
            icon={CalendarDays}
          />

          <MiniCard
            label="Open Requests"
            value="2"
            icon={MessageSquare}
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700">
                  In Development
                </span>

                <h2 className="mt-3 text-lg font-black text-[#271a1e]">
                  Website Development
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  Prime Digital Solutions Project
                </p>
              </div>

              <a
                href="/client-dashboard/projects"
                className="text-[10px] font-black text-[#8f0024]"
              >
                View Project →
              </a>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500">
                  Overall Progress
                </p>

                <p className="text-xs font-black text-[#8f0024]">
                  64%
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[64%] rounded-full bg-[#8f0024]" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <Clock3 className="h-4 w-4 text-[#8f0024]" />

                <p className="mt-3 text-[9px] font-bold uppercase text-slate-400">
                  Current Milestone
                </p>

                <p className="mt-1 text-[11px] font-black text-slate-700">
                  Frontend Integration
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <CalendarDays className="h-4 w-4 text-[#8f0024]" />

                <p className="mt-3 text-[9px] font-bold uppercase text-slate-400">
                  Next Delivery
                </p>

                <p className="mt-1 text-[11px] font-black text-slate-700">
                  Upcoming
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <CheckCircle2 className="h-4 w-4 text-[#8f0024]" />

                <p className="mt-3 text-[9px] font-bold uppercase text-slate-400">
                  Completed
                </p>

                <p className="mt-1 text-[11px] font-black text-slate-700">
                  4 Deliverables
                </p>
              </div>
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black text-[#271a1e]">
                Upcoming Meeting
              </h2>

              <div className="mt-4 rounded-lg bg-[#fff7f9] p-4">
                <p className="text-xs font-black text-[#8f0024]">
                  Project Review Meeting
                </p>

                <p className="mt-2 text-[10px] text-slate-500">
                  Your next scheduled project discussion will appear here.
                </p>

                <a
                  href="/client-dashboard/meetings"
                  className="mt-4 inline-flex text-[10px] font-black text-[#8f0024]"
                >
                  View Meetings →
                </a>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-[#8f0024]" />

                <h2 className="text-sm font-black text-[#271a1e]">
                  Payment Status
                </h2>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                Invoices and payment information will be available in your Payments section.
              </p>

              <a
                href="/client-dashboard/payments"
                className="mt-4 inline-flex text-[10px] font-black text-[#8f0024]"
              >
                View Payments →
              </a>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
