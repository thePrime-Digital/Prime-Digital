"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  severity: string;
  category: string;
  isRead: boolean;
  createdAt: string | null;
};

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    undefined,
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function severityClasses(
  severity: string,
) {
  if (
    severity ===
    "warning"
  ) {
    return "border-amber-200 bg-amber-50";
  }

  if (
    severity ===
      "urgent" ||
    severity ===
      "error"
  ) {
    return "border-red-200 bg-red-50";
  }

  return "border-slate-200 bg-white";
}

export default function StudentNotifications() {
  const [
    notifications,
    setNotifications,
  ] =
    useState<Notification[]>(
      [],
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

  const [
    markingRead,
    setMarkingRead,
  ] =
    useState(false);

  const markAllRead =
    useCallback(
      async () => {
        if (markingRead) {
          return;
        }

        setMarkingRead(
          true,
        );

        setError("");

        try {
          const response =
            await fetch(
              "/api/student/notifications",
              {
                method:
                  "PATCH",

                credentials:
                  "include",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    action:
                      "mark_all_read",
                  }),
              },
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to update notifications.",
            );
          }

          setNotifications(
            (
              current,
            ) =>
              current.map(
                (
                  item,
                ) => ({
                  ...item,

                  isRead:
                    true,
                }),
              ),
          );

          window.dispatchEvent(
            new Event(
              "student-notifications-updated",
            ),
          );
        } catch (
          updateError
        ) {
          setError(
            updateError instanceof
              Error
              ? updateError.message
              : "Unable to update notifications.",
          );
        } finally {
          setMarkingRead(
            false,
          );
        }
      },
      [
        markingRead,
      ],
    );

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError("");

        try {
          const response =
            await fetch(
              "/api/student/notifications",
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
                "Unable to load notifications.",
            );
          }

          const items:
            Notification[] =
            Array.isArray(
              result.notifications,
            )
              ? result.notifications
              : [];

          setNotifications(
            items,
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

  const hasUnread =
    notifications.some(
      (
        item,
      ) =>
        !item.isRead,
    );

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <header>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Student Portal
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Important announcements and school updates.
            </p>
          </header>

          {hasUnread && (
            <button
              type="button"
              onClick={
                markAllRead
              }
              disabled={
                markingRead
              }
              className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[10px] font-black text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markingRead ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}

              {markingRead
                ? "Marking Read..."
                : "Mark All Read"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={
                load
              }
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-[10px] font-black text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />

              Try Again
            </button>
          </div>
        )}

        {!error &&
        notifications.length ===
          0 ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Bell className="mx-auto h-6 w-6 text-[#8f0024]" />

            <p className="mt-3 text-xs font-semibold text-slate-500">
              You have no notifications right now.
            </p>
          </section>
        ) : (
          <div className="mt-6 space-y-3">
            {notifications.map(
              (
                item,
              ) => (
                <article
                  key={
                    item.id
                  }
                  className={`relative rounded-2xl border p-5 shadow-sm ${severityClasses(
                    item.severity,
                  )}`}
                >
                  {!item.isRead && (
                    <span
                      title="Unread"
                      className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#8f0024]"
                    />
                  )}

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8f0024] shadow-sm">
                      {item.severity ===
                        "warning" ||
                      item.severity ===
                        "urgent" ||
                      item.severity ===
                        "error" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900">
                          {
                            item.title
                          }
                        </h2>

                        {item.category && (
                          <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black uppercase text-slate-500">
                            {
                              item.category
                            }
                          </span>
                        )}

                        {!item.isRead && (
                          <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[8px] font-black uppercase text-[#8f0024]">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        {
                          item.message
                        }
                      </p>

                      {item.createdAt && (
                        <p className="mt-3 text-[9px] font-semibold text-slate-400">
                          {formatDate(
                            item.createdAt,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}