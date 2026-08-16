"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Loader2,
  MapPin,
  MonitorPlay,
  Search,
  Users,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
  program: string;
  schedule: string;
  room: string;

  capacity:
    | number
    | null;

  deliveryMode: string;
  status: string;
  enrolledStudents: number;
};

function statusClass(
  status: string,
) {
  if (
    status === "active"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    status === "completed"
  ) {
    return "bg-blue-50 text-blue-700";
  }

  if (
    status === "cancelled"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function FacultyClasses() {
  const [
    classes,
    setClasses,
  ] =
    useState<
      FacultyClass[]
    >([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/faculty/classes",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Unable to load classes.",
            );
          }

          setClasses(
            data.classes ||
              [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load classes.",
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

  const filtered =
    classes.filter(
      (item) => {
        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return true;
        }

        return (
          item.name
            .toLowerCase()
            .includes(
              value,
            ) ||
          item.program
            .toLowerCase()
            .includes(
              value,
            )
        );
      },
    );

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              My Classes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Access your assigned
              classes, students,
              assignments and course
              content.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search classes..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none focus:border-[#8f0024]/30"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : filtered.length ===
          0 ? (
          <div className="mt-5 flex min-h-[440px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <GraduationCap className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No classes assigned
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Classes assigned to your faculty account by an administrator will appear here.
              </p>
            </div>
          </div>
        ) : (
          <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(
              (
                item,
              ) => {
                const percentage =
                  item.capacity &&
                  item.capacity >
                    0
                    ? Math.min(
                        100,
                        Math.round(
                          (
                            item.enrolledStudents /
                            item.capacity
                          ) *
                            100,
                        ),
                      )
                    : 0;

                return (
                  <article
                    key={
                      item.id
                    }
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="h-1.5 bg-[#8f0024]" />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                          <BookOpen className="h-4 w-4" />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[8px] font-black capitalize ${statusClass(
                            item.status,
                          )}`}
                        >
                          {
                            item.status
                          }
                        </span>
                      </div>

                      <h2 className="mt-4 text-base font-black text-[#281b1f]">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-[10px] font-semibold text-[#8f0024]">
                        {item.program ||
                          "Prime Digital School"}
                      </p>

                      <div className="mt-5 space-y-3">
                        <Info
                          icon={
                            Users
                          }
                          label="Students"
                          value={`${item.enrolledStudents}${
                            item.capacity
                              ? ` / ${item.capacity}`
                              : ""
                          }`}
                        />

                        <Info
                          icon={
                            CalendarDays
                          }
                          label="Schedule"
                          value={
                            item.schedule ||
                            "Not scheduled"
                          }
                        />

                        <Info
                          icon={
                            item.deliveryMode
                              .toLowerCase()
                              .includes(
                                "online",
                              )
                              ? MonitorPlay
                              : MapPin
                          }
                          label="Location"
                          value={
                            item.room ||
                            item.deliveryMode ||
                            "Not specified"
                          }
                        />
                      </div>

                      {item.capacity && (
                        <div className="mt-5">
                          <div className="flex items-center justify-between">
                            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                              Enrollment
                            </p>

                            <p className="text-[8px] font-black text-[#8f0024]">
                              {percentage}%
                            </p>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#8f0024]"
                              style={{
                                width:
                                  `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                        <Link
                          href={`/faculty/students?classId=${item.id}`}
                          className="rounded-lg bg-slate-50 px-2 py-2 text-center text-[8px] font-black text-slate-600 hover:bg-[#fff1f4] hover:text-[#8f0024]"
                        >
                          Students
                        </Link>

                        <Link
                          href={`/faculty/assignments?classId=${item.id}`}
                          className="rounded-lg bg-slate-50 px-2 py-2 text-center text-[8px] font-black text-slate-600 hover:bg-[#fff1f4] hover:text-[#8f0024]"
                        >
                          Assignments
                        </Link>

                        <Link
                          href={`/faculty/content?classId=${item.id}`}
                          className="rounded-lg bg-slate-50 px-2 py-2 text-center text-[8px] font-black text-slate-600 hover:bg-[#fff1f4] hover:text-[#8f0024]"
                        >
                          Content
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon:
    typeof Users;

  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#8f0024]">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-600">
          {value}
        </p>
      </div>
    </div>
  );
}
