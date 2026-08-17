"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Check,
  Info,
  Loader2,
  Megaphone,
  RefreshCw,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  severity: string;
  isRead: boolean;

  createdAt:
    | string
    | null;

  publishedAt:
    | string
    | null;
};

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleString();
}

export default function FacultyNotifications() {
  const [
    notifications,
    setNotifications,
  ] =
    useState<
      Notification[]
    >([]);

  const [
    unread,
    setUnread,
  ] =
    useState(0);

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
              "/api/faculty/notifications",
              {
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
                "Unable to load notifications.",
            );
          }

          setNotifications(
            payload.notifications ||
              [],
          );

          setUnread(
            payload.unread ||
              0,
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load notifications.",
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

  async function markRead(
    item:
      Notification,
  ) {
    if (item.isRead) {
      return;
    }

    await fetch(
      `/api/faculty/notifications/${item.id}`,
      {
        method:
          "PATCH",

        credentials:
          "include",
      },
    );

    setNotifications(
      (
        current,
      ) =>
        current.map(
          (
            notification,
          ) =>
            notification.id ===
            item.id
              ? {
                  ...notification,

                  isRead:
                    true,
                }
              : notification,
        ),
    );

    setUnread(
      (
        current,
      ) =>
        Math.max(
          0,
          current - 1,
        ),
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Updates
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#281b1f]">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Announcements and updates
              from Prime Digital School.
            </p>
          </div>

          <button
            type="button"
            onClick={
              load
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[8px] font-black uppercase text-slate-400">
              Total Notifications
            </p>

            <p className="mt-2 text-3xl font-black text-[#281b1f]">
              {
                notifications.length
              }
            </p>
          </div>

          <div className="rounded-2xl bg-[#72001c] p-5 text-white shadow-sm">
            <p className="text-[8px] font-black uppercase text-white/60">
              Unread
            </p>

            <p className="mt-2 text-3xl font-black">
              {unread}
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[430px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
            </div>
          ) : notifications.length ===
            0 ? (
            <div className="flex min-h-[430px] items-center justify-center text-center">
              <div>
                <Bell className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-4 text-[10px] font-black text-slate-600">
                  No notifications yet
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(
                (
                  item,
                ) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      markRead(
                        item,
                      )
                    }
                    className={[
                      "flex w-full gap-4 p-5 text-left transition",

                      item.isRead
                        ? "bg-white"
                        : "bg-[#fff8fa]",
                    ].join(" ")}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                      {item.severity ===
                      "important" ? (
                        <Megaphone className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-slate-700">
                          {
                            item.title
                          }
                        </p>

                        {!item.isRead && (
                          <span className="rounded-full bg-[#8f0024] px-2 py-0.5 text-[6px] font-black uppercase text-white">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-[9px] leading-5 text-slate-500">
                        {
                          item.message
                        }
                      </p>

                      <p className="mt-2 text-[8px] text-slate-400">
                        {formatDate(
                          item.publishedAt ||
                            item.createdAt,
                        )}
                      </p>
                    </div>

                    {item.isRead && (
                      <Check className="mt-1 h-4 w-4 text-emerald-600" />
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
