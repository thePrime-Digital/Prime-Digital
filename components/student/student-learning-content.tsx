"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BookOpen,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Video,
} from "lucide-react";

type ContentData = {
  classes: {
    id: string;
    name: string;
  }[];

  content: {
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
  }[];
};

function ResourceIcon({ type }: { type: string }) {
  const normalised = type.toLowerCase();

  if (normalised.includes("video")) {
    return <Video className="h-5 w-5" />;
  }

  return <FileText className="h-5 w-5" />;
}

export default function StudentLearningContent() {
  const [data, setData] = useState<ContentData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student/content", {
        credentials: "include",

        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load learning content.");
      }

      setData(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load learning content.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (error || !data) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-black text-red-800">
            Unable to load learning content.
          </p>

          <p className="mt-2 text-xs text-red-700">{error}</p>

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
            Learning Content
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Study materials and resources shared by your faculty.
          </p>
        </header>

        {data.content.length === 0 ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
              <BookOpen className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-sm font-black text-slate-900">
              No learning content yet
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Materials shared for your enrolled classes will appear here.
            </p>
          </section>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.content.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                  <ResourceIcon type={item.type} />
                </div>

                <p className="mt-4 text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  {item.className}
                </p>

                <h2 className="mt-1 text-sm font-black text-slate-900">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black capitalize text-slate-600">
                    {item.type}
                  </span>

                  {item.duration && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
                      {item.duration}
                    </span>
                  )}
                </div>

                {item.url && (
                  <a
                    href={`/api/course-content/${item.id}/open`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white"
                  >
                    Open Resource
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
