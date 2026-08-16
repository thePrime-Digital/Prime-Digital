"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  FileCheck2,
  GraduationCap,
  Loader2,
  RefreshCw,
  School,
  Users,
} from "lucide-react";

type ReportsData = {
  users: {
    total: number;
    students: number;
    faculty: number;
    clients: number;
    admins: number;
    active: number;
    pending: number;
    blocked: number;
    newLast30Days: number;
  };

  submissions: {
    admissions: number;
    contacts: number;
    careers: number;
    serviceLeads: number;
    total: number;
  };

  academic: {
    programs: number;
    activePrograms: number;
    classes: number;
    activeClasses: number;
  };

  activity: {
    adminActions: number;
  };

  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }[];
};

function width(
  value: number,
  total: number,
): string {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.max(
    3,
    Math.min(
      100,
      Math.round(
        (value / total) *
          100,
      ),
    ),
  )}%`;
}

function shortDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return `${String(
    date.getDate(),
  ).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

export default function AdminReports() {
  const [data, setData] =
    useState<ReportsData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/admin/reports",
              {
                method: "GET",
                credentials:
                  "include",
                cache:
                  "no-store",
              },
            );

          const payload =
            await response.json();

          if (!response.ok) {
            throw new Error(
              payload.error ||
                "Unable to load reports.",
            );
          }

          setData(payload);
        } catch (loadError) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load reports.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Loading reports...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
              Reports & Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Live platform overview from Prime Digital School data.
            </p>
          </div>

          <button
            type="button"
            onClick={
              load
            }
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[10px] font-black text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                icon={Users}
                label="Total Users"
                value={
                  data.users
                    .total
                }
                note={`${data.users.newLast30Days} new in 30 days`}
              />

              <Metric
                icon={
                  GraduationCap
                }
                label="Students"
                value={
                  data.users
                    .students
                }
                note={`${data.users.active} total active accounts`}
              />

              <Metric
                icon={
                  FileCheck2
                }
                label="Admissions"
                value={
                  data
                    .submissions
                    .admissions
                }
                note={`${data.submissions.total} total form submissions`}
              />

              <Metric
                icon={
                  School
                }
                label="Active Classes"
                value={
                  data.academic
                    .activeClasses
                }
                note={`${data.academic.classes} classes created`}
              />
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black text-[#271a1e]">
                  Account Distribution
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Registered users by platform role.
                </p>

                <div className="mt-6 space-y-5">
                  <Progress
                    label="Students"
                    value={
                      data.users
                        .students
                    }
                    total={
                      data.users
                        .total
                    }
                  />

                  <Progress
                    label="Faculty"
                    value={
                      data.users
                        .faculty
                    }
                    total={
                      data.users
                        .total
                    }
                  />

                  <Progress
                    label="Clients"
                    value={
                      data.users
                        .clients
                    }
                    total={
                      data.users
                        .total
                    }
                  />

                  <Progress
                    label="Admins"
                    value={
                      data.users
                        .admins
                    }
                    total={
                      data.users
                        .total
                    }
                  />
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black text-[#271a1e]">
                  Platform Enquiries
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Form activity received through the website.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniMetric
                    icon={
                      FileCheck2
                    }
                    label="Admissions"
                    value={
                      data
                        .submissions
                        .admissions
                    }
                  />

                  <MiniMetric
                    icon={
                      Activity
                    }
                    label="Contact"
                    value={
                      data
                        .submissions
                        .contacts
                    }
                  />

                  <MiniMetric
                    icon={
                      BriefcaseBusiness
                    }
                    label="Careers"
                    value={
                      data
                        .submissions
                        .careers
                    }
                  />

                  <MiniMetric
                    icon={
                      BarChart3
                    }
                    label="Service Leads"
                    value={
                      data
                        .submissions
                        .serviceLeads
                    }
                  />
                </div>
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black text-[#271a1e]">
                  Academic Setup
                </h2>

                <div className="mt-5 space-y-3">
                  <AcademicRow
                    icon={
                      BookOpen
                    }
                    label="Programs"
                    value={
                      data.academic
                        .programs
                    }
                    secondary={`${data.academic.activePrograms} active`}
                  />

                  <AcademicRow
                    icon={
                      School
                    }
                    label="Classes"
                    value={
                      data.academic
                        .classes
                    }
                    secondary={`${data.academic.activeClasses} active`}
                  />

                  <AcademicRow
                    icon={
                      Activity
                    }
                    label="Admin Actions"
                    value={
                      data.activity
                        .adminActions
                    }
                    secondary="Audit records"
                  />
                </div>
              </article>

              <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="text-sm font-black text-[#271a1e]">
                    Recent Registrations
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Latest accounts created on the platform.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px]">
                    <thead>
                      <tr className="bg-slate-50/70">
                        <th className="px-5 py-3 text-left text-[9px] font-black uppercase text-slate-400">
                          Account
                        </th>

                        <th className="px-4 py-3 text-left text-[9px] font-black uppercase text-slate-400">
                          Role
                        </th>

                        <th className="px-4 py-3 text-left text-[9px] font-black uppercase text-slate-400">
                          Status
                        </th>

                        <th className="px-5 py-3 text-right text-[9px] font-black uppercase text-slate-400">
                          Created
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.recentUsers.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center text-xs text-slate-400"
                          >
                            No registrations yet.
                          </td>
                        </tr>
                      ) : (
                        data.recentUsers.map(
                          (
                            user,
                          ) => (
                            <tr
                              key={
                                user.id
                              }
                              className="border-t border-slate-100"
                            >
                              <td className="px-5 py-4">
                                <p className="text-[11px] font-black text-slate-700">
                                  {
                                    user.name
                                  }
                                </p>

                                <p className="mt-1 text-[9px] text-slate-400">
                                  {
                                    user.email
                                  }
                                </p>
                              </td>

                              <td className="px-4 py-4 text-[10px] font-semibold capitalize text-slate-600">
                                {
                                  user.role
                                }
                              </td>

                              <td className="px-4 py-4 text-[10px] font-semibold capitalize text-slate-600">
                                {
                                  user.status
                                }
                              </td>

                              <td className="px-5 py-4 text-right text-[10px] text-slate-400">
                                {shortDate(
                                  user.createdAt,
                                )}
                              </td>
                            </tr>
                          ),
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon:
    typeof Users;
  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-[#271a1e]">
            {value}
          </p>

          <p className="mt-2 text-[9px] text-slate-400">
            {note}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon:
    typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <Icon className="h-4 w-4 text-[#8f0024]" />

      <p className="mt-3 text-[9px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Progress({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-600">
          {label}
        </p>

        <p className="text-[10px] font-black text-[#8f0024]">
          {value}
        </p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#8f0024]"
          style={{
            width:
              width(
                value,
                total,
              ),
          }}
        />
      </div>
    </div>
  );
}

function AcademicRow({
  icon: Icon,
  label,
  value,
  secondary,
}: {
  icon:
    typeof Users;
  label: string;
  value: number;
  secondary: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-[9px] text-slate-400">
          {secondary}
        </p>
      </div>

      <p className="text-xl font-black text-[#271a1e]">
        {value}
      </p>
    </div>
  );
}
