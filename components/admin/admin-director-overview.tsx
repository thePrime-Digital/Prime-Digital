"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CreditCard,
  GraduationCap,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";

type Overview = {
  stats: {
    students: number;
    faculty: number;
    staff: number;
    pendingFaculty: number;
    classes: number;
    admissions: number;
    leads: number;
    demos: number;
    collected: number;
    outstanding: number;
    overdue15: number;
    overdueStudents: number;
  };
  pipeline: { stage: string; count: number }[];
};

const linkStyle =
  "flex items-center justify-between rounded-lg border border-[#eee3df] px-4 py-3 text-xs font-semibold hover:bg-[#fff3f5]";

function money(value: number) {
  return "₹" + value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/director/overview", {
        credentials: "include",
        cache: "no-store",
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to load overview");
      setData(payload as Overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Loading failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const stats = data?.stats;

  const cards = [
    {
      label: "Active students",
      value: stats?.students,
      note: "Active student accounts",
      href: "/admin/students",
    },
    {
      label: "Admission applications",
      value: stats?.admissions,
      note: "All existing applications",
      href: "/admin/admissions",
    },
    {
      label: "Fees collected",
      value: stats ? money(stats.collected) : undefined,
      note: "Recorded fee payments",
      href: "/admin/fees",
    },
    {
      label: "Fees outstanding",
      value: stats ? money(stats.outstanding) : undefined,
      note: "Unpaid invoice balances",
      href: "/admin/fees",
    },
    {
      label: "Active faculty",
      value: stats?.faculty,
      note: "Approved faculty accounts",
      href: "/admin/faculty",
    },
    {
      label: "Active classes",
      value: stats?.classes,
      note: "Non-archived class records",
      href: "/admin/classes",
    },
  ];

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 p-5 sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black tracking-tight">
            Institute overview
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Live records from Prime Digital School
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-xs font-bold"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center rounded-xl bg-white p-12">
          <Loader2 className="animate-spin text-[#ad123d]" />
        </div>
      )}

      {!loading && data && (
        <>
          <section>
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Key numbers
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {cards.map((card) => (
                <Link
                  href={card.href}
                  key={card.label}
                  className="rounded-xl border border-[#ebe3dd] bg-white p-4 shadow-sm hover:border-[#cfa4ad]"
                >
                  <p className="text-[11px] font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-3 break-words text-[23px] font-black text-[#390c19]">
                    {card.value ?? "—"}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">{card.note}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-xl border border-[#ebe3dd] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-black">Action needed</h2>
                <Bell size={16} className="text-[#ad123d]" />
              </div>

              <div className="space-y-2">
                <Link href="/admin/fees" className={linkStyle}>
                  <span>Fees over 15 days late</span>
                  <strong className="text-[#ad123d]">
                    {money(stats?.overdue15 ?? 0)}
                  </strong>
                </Link>
                <Link href="/admin/faculty" className={linkStyle}>
                  <span>Pending faculty approvals</span>
                  <strong className="text-[#ad123d]">
                    {stats?.pendingFaculty ?? 0}
                  </strong>
                </Link>
                <Link href="/admin/leads" className={linkStyle}>
                  <span>Tracked leads</span>
                  <strong>{stats?.leads ?? 0}</strong>
                </Link>
                <Link href="/admin/fees" className={linkStyle}>
                  <span>Students with overdue invoices</span>
                  <strong>{stats?.overdueStudents ?? 0}</strong>
                </Link>
              </div>
            </section>

            <section className="rounded-xl border border-[#ebe3dd] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-black">Admissions pipeline</h2>
                <Link href="/admin/admissions" className="text-xs font-bold text-[#ad123d]">
                  View all →
                </Link>
              </div>

              {data.pipeline.length ? (
                <div className="space-y-4">
                  {data.pipeline.map((item) => (
                    <div key={item.stage}>
                      <div className="mb-1 flex justify-between gap-3 text-xs">
                        <span className="capitalize">{item.stage}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e7e5]">
                        <div
                          className="h-full rounded-full bg-[#b41943]"
                          style={{
                            width:
                              Math.max(
                                2,
                                (item.count / Math.max(1, ...data.pipeline.map((p) => p.count))) * 100
                              ) + "%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No admissions pipeline records yet.
                </p>
              )}
            </section>
          </div>

          <section className="rounded-xl border border-[#ebe3dd] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black">Finance snapshot</h2>
            <p className="mt-1 text-xs text-slate-400">
              Current recorded balances. These are not monthly revenue figures.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-[#f8f5f2] p-4">
                <p className="text-xs text-slate-500">Collected</p>
                <p className="mt-2 text-xl font-black text-green-700">
                  {money(stats?.collected ?? 0)}
                </p>
              </div>
              <div className="rounded-lg bg-[#f8f5f2] p-4">
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className="mt-2 text-xl font-black">
                  {money(stats?.outstanding ?? 0)}
                </p>
              </div>
              <div className="rounded-lg bg-[#f8f5f2] p-4">
                <p className="text-xs text-slate-500">Overdue 15+ days</p>
                <p className="mt-2 text-xl font-black text-[#ad123d]">
                  {money(stats?.overdue15 ?? 0)}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Academics", description: "Students, classes, courses and tests", href: "/admin/courses", icon: BookOpen },
              { title: "Admissions", description: "Applications and student intake", href: "/admin/admissions", icon: GraduationCap },
              { title: "Finance", description: "Fee invoices and payments", href: "/admin/fees", icon: CreditCard },
              { title: "Team", description: "Faculty and staff management", href: "/admin/staff", icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link href={item.href} key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                  <Icon size={21} className="text-[#ad123d]" />
                  <h3 className="mt-3 text-sm font-black">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#ad123d]">
                    Open <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}