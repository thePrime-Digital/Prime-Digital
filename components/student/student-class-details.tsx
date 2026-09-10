"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Loader2,
  Video,
} from "lucide-react";

type ClassData = {
  class: {
    id: string;
    name: string;
    program: string;
    faculty: string;
    schedule: string;
    room: string;
    deliveryMode: string;
    notes: string;
    status: string;
  };

  summary: {
    attendanceRate:
      | number
      | null;

    assignments: number;
    learningContent: number;
    upcomingClasses: number;
  };
};

export default function StudentClassDetails({
  classId,
}: {
  classId: string;
}) {
  const [
    data,
    setData,
  ] =
    useState<ClassData | null>(
      null,
    );

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
              `/api/student/classes/${classId}`,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Unable to load class.",
            );
          }

          setData(
            result,
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load class.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        classId,
      ],
    );

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-xs font-semibold text-red-700">
          {error ||
            "Unable to load class."}
        </div>
      </main>
    );
  }

  const classRecord =
    data.class;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/classes"
          className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-[#8f0024]"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to My Classes
        </Link>

        <section className="mt-5 rounded-2xl bg-[#690019] p-6 text-white shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <GraduationCap className="h-6 w-6" />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-pink-200">
            My Class
          </p>

          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            {classRecord.name}
          </h1>

          <p className="mt-2 text-sm font-semibold text-pink-100">
            {classRecord.program ||
              "Prime Digital School"}
          </p>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Attendance"
            value={
              data.summary
                .attendanceRate ===
              null
                ? "—"
                : `${data.summary.attendanceRate}%`
            }
          />

          <Metric
            label="Assignments"
            value={
              data.summary.assignments
            }
          />

          <Metric
            label="Learning Resources"
            value={
              data.summary.learningContent
            }
          />

          <Metric
            label="Upcoming Classes"
            value={
              data.summary.upcomingClasses
            }
          />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-900">
              Class Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Info
                label="Faculty"
                value={
                  classRecord.faculty ||
                  "Not assigned"
                }
              />

              <Info
                label="Schedule"
                value={
                  classRecord.schedule ||
                  "Not scheduled"
                }
              />

              <Info
                label="Delivery Mode"
                value={
                  classRecord.deliveryMode ||
                  "Not specified"
                }
              />

              <Info
                label="Room / Location"
                value={
                  classRecord.room ||
                  "Not specified"
                }
              />

              <Info
                label="Status"
                value={
                  classRecord.status ||
                  "Active"
                }
              />
            </div>

            {classRecord.notes && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Class Notes
                </p>

                <p className="mt-2 text-xs leading-6 text-slate-600">
                  {
                    classRecord.notes
                  }
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-900">
              Class Resources
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              Open the relevant section for this class.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <QuickLink
                href="/dashboard/attendance"
                label="Attendance"
                icon={
                  <ClipboardCheck className="h-5 w-5" />
                }
              />

              <QuickLink
                href="/dashboard/assignments"
                label="Assignments"
                icon={
                  <ClipboardList className="h-5 w-5" />
                }
              />

              <QuickLink
                href="/dashboard/learning-content"
                label="Learning Content"
                icon={
                  <BookOpen className="h-5 w-5" />
                }
              />

              <QuickLink
                href="/dashboard/live-classes"
                label="Live Classes"
                icon={
                  <Video className="h-5 w-5" />
                }
              />
            </div>

            <div className="mt-5 rounded-xl bg-[#fff7f8] p-4">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#8f0024]" />

                <p className="text-[10px] leading-5 text-slate-600">
                  New sessions, assignments, attendance and learning resources created by your faculty will automatically appear in your Student Portal.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#271a1e]">
        {value}
      </p>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#8f0024]/20 hover:bg-[#fff7f8]"
    >
      <div className="text-[#8f0024]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-black text-slate-800">
        {label}
      </p>
    </Link>
  );
}