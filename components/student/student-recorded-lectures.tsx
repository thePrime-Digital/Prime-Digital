"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ExternalLink,
  Loader2,
  PlayCircle,
  RefreshCw,
  Search,
  Video,
} from "lucide-react";

type Lecture = {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  type: string;
  url: string;
  fileName: string;
  duration: string;
  status: string;
  createdAt: string | null;
};

type ContentData = {
  classes: {
    id: string;
    name: string;
  }[];

  content: Lecture[];
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Recently added";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Recently added";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default function StudentRecordedLectures() {
  const [data, setData] =
    useState<ContentData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [classFilter, setClassFilter] =
    useState("");

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/student/content",
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
                "Unable to load recorded lectures.",
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
              : "Unable to load recorded lectures.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  const lectures =
    useMemo(() => {
      const items =
        Array.isArray(
          data?.content,
        )
          ? data!.content
          : [];

      return items.filter(
        (item) =>
          String(
            item.type || "",
          ).toLowerCase() ===
          "video",
      );
    }, [data]);

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return lectures.filter(
        (lecture) => {
          if (
            classFilter &&
            lecture.classId !==
              classFilter
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            lecture.title
              .toLowerCase()
              .includes(
                query,
              ) ||
            lecture.className
              .toLowerCase()
              .includes(
                query,
              ) ||
            lecture.description
              .toLowerCase()
              .includes(
                query,
              )
          );
        },
      );
    }, [
      lectures,
      search,
      classFilter,
    ]);

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
        <div className="mx-auto max-w-7xl rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-black text-red-800">
            Unable to load recorded lectures.
          </p>

          <p className="mt-2 text-xs text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              void load()
            }
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
            Recorded Lectures
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Watch lecture recordings
            shared by your faculty.
          </p>
        </header>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
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
                placeholder="Search recorded lectures..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-xs outline-none focus:border-[#8f0024]/30"
              />
            </div>

            <select
              value={
                classFilter
              }
              onChange={(
                event,
              ) =>
                setClassFilter(
                  event.target
                    .value,
                )
              }
              className="h-10 min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="">
                All Classes
              </option>

              {data.classes.map(
                (item) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {item.name}
                  </option>
                ),
              )}
            </select>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Available Lectures
            </p>

            <p className="mt-2 text-3xl font-black text-[#281b1f]">
              {lectures.length}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Enrolled Classes
            </p>

            <p className="mt-2 text-3xl font-black text-[#281b1f]">
              {data.classes.length}
            </p>
          </article>
        </section>

        {filtered.length ===
        0 ? (
          <section className="mt-5 flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <Video className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No recorded lectures available
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Recorded lectures shared by
                your faculty will appear here.
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(
              (lecture) => (
                <article
                  key={
                    lecture.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#72001c] to-[#a00b35]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                      <PlayCircle className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#fff1f4] px-2.5 py-1 text-[8px] font-black text-[#8f0024]">
                        Recorded Lecture
                      </span>

                      <span className="text-[8px] font-semibold text-slate-400">
                        {formatDate(
                          lecture.createdAt,
                        )}
                      </span>
                    </div>

                    <p className="mt-4 text-[8px] font-black uppercase tracking-wider text-[#8f0024]">
                      {lecture.className}
                    </p>

                    <h2 className="mt-1 text-sm font-black text-[#281b1f]">
                      {lecture.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 min-h-[54px] text-[9px] leading-5 text-slate-400">
                      {lecture.description ||
                        "Lecture recording shared by your faculty."}
                    </p>

                    {lecture.url && (
                      <a
                        href={`/api/course-content/${lecture.id}/open`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8f0024] text-[9px] font-black text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Watch Lecture
                      </a>
                    )}
                  </div>
                </article>
              ),
            )}
          </section>
        )}
      </div>
    </main>
  );
}
