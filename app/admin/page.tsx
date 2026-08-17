import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  GraduationCap,
  UserCheck,
  UsersRound,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof UsersRound;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
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

      <p className="mt-3 text-[10px] font-semibold text-slate-500">
        {note}
      </p>
    </article>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                Administration
              </p>

              <h1 className="mt-1 text-xl font-black text-[#271a1e]">
                Prime Digital School Overview
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Manage users, approvals, admissions and platform activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/admin/faculty"
                className="rounded-lg bg-[#8f0024] px-4 py-2 text-[11px] font-bold text-white"
              >
                Faculty Approvals
              </a>

              <a
                href="/admin/admissions"
                className="rounded-lg border border-[#8f0024]/20 px-4 py-2 text-[11px] font-bold text-[#8f0024]"
              >
                Admissions
              </a>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={UsersRound}
            label="Total Users"
            value="—"
            note="Students, faculty & clients"
          />

          <StatCard
            icon={UserCheck}
            label="Faculty Pending"
            value="—"
            note="Awaiting approval"
          />

          <StatCard
            icon={FileCheck2}
            label="Admissions"
            value="—"
            note="Applications received"
          />

          <StatCard
            icon={BriefcaseBusiness}
            label="Service Leads"
            value="—"
            note="Prime Digital Solutions"
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-[#271a1e]">
                  Pending Faculty Approvals
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  New faculty registrations requiring review
                </p>
              </div>

              <a
                href="/admin/faculty"
                className="text-[10px] font-black text-[#8f0024]"
              >
                View All →
              </a>
            </div>

            <div className="mt-5 flex min-h-[235px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60">
              <div className="text-center">
                <UserCheck className="mx-auto h-8 w-8 text-[#8f0024]/45" />

                <p className="mt-3 text-xs font-black text-slate-700">
                  API connection is next
                </p>

                <p className="mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
                  Pending faculty accounts from MongoDB will appear here.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black text-[#271a1e]">
              Quick Management
            </h2>

            <div className="mt-4 space-y-2">
              {[
                {
                  title: "Manage Users",
                  href: "/admin/users",
                },
                {
                  title: "Review Admissions",
                  href: "/admin/admissions",
                },
                {
                  title: "View Service Leads",
                  href: "/admin/submissions",
                },
                {
                  title: "Platform Reports",
                  href: "/admin/reports",
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 transition hover:border-[#8f0024]/20 hover:bg-[#fff9fa]"
                >
                  <span className="text-[11px] font-bold text-slate-700">
                    {item.title}
                  </span>

                  <ArrowRight className="h-3.5 w-3.5 text-[#8f0024]" />
                </a>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
