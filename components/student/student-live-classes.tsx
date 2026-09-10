"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  ExternalLink,
  Loader2,
  Radio,
  RefreshCw,
  Video,
} from "lucide-react";

type Session = {
  id: string;
  classId: string;
  className: string;
  title: string;
  startAt: string | null;
  endAt: string | null;
  mode: string;
  location: string;
  meetingUrl: string;
  status: string;
  live: boolean;
};

type LiveClassData = {
  liveNow: Session[];
  upcoming: Session[];
};

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not scheduled";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Not scheduled";
  }

  return date.toLocaleString(
    undefined,
    {
      weekday:
        "short",

      day:
        "2-digit",

      month:
        "short",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

export default function StudentLiveClasses() {
  const [
    data,
    setData,
  ] =
    useState<LiveClassData | null>(
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
              "/api/student/live-classes",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to load live classes.",
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
              : "Unable to load live classes.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
      </main>
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-black text-red-800">
            Unable to load live classes.
          </p>

          <p className="mt-2 text-xs text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={load}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-xs font-black text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
            Live Classes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Join live sessions and review your upcoming class schedule.
          </p>
        </header>

        {data.liveNow.length >
          0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-600" />

              <h2 className="text-sm font-black text-slate-900">
                Live Now
              </h2>
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {data.liveNow.map(
                (session) => (
                  <SessionCard
                    key={
                      session.id
                    }
                    session={
                      session
                    }
                    live
                  />
                ),
              )}
            </div>
          </section>
        )}

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#8f0024]" />

            <h2 className="text-sm font-black text-slate-900">
              Upcoming Classes
            </h2>
          </div>

          {data.upcoming.length ===
          0 ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Video className="mx-auto h-6 w-6 text-[#8f0024]" />

              <p className="mt-3 text-xs font-semibold text-slate-500">
                No upcoming live classes are scheduled.
              </p>
            </div>
          ) : (
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.upcoming.map(
                (session) => (
                  <SessionCard
                    key={
                      session.id
                    }
                    session={
                      session
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SessionCard({
  session,
  live = false,
}: {
  session: Session;
  live?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
          <Video className="h-4 w-4" />
        </div>

        {live && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-black uppercase text-red-600">
            Live Now
          </span>
        )}
      </div>

      <p className="mt-4 text-[9px] font-black uppercase text-[#8f0024]">
        {session.className}
      </p>

      <h3 className="mt-1 text-sm font-black text-slate-900">
        {session.title}
      </h3>

      <p className="mt-3 text-xs font-semibold text-slate-600">
        {formatDate(
          session.startAt,
        )}
      </p>

      <p className="mt-2 text-[10px] text-slate-500">
        {session.mode ||
          "Class Session"}

        {session.location
          ? ` • ${session.location}`
          : ""}
      </p>

      {session.meetingUrl && (
        <a
          href={
            session.meetingUrl
          }
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white"
        >
          Join Class
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </article>
  );
}