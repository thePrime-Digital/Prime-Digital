"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Archive,
  Bell,
  CheckCircle2,
  Loader2,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";

type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  audienceType: string;
  audienceRole:
    | string
    | null;
  audienceUserId:
    | string
    | null;
  audienceUserName:
    | string
    | null;
  createdByName: string;
  publishedAt:
    | string
    | null;
  createdAt:
    | string
    | null;
};

function formatDate(
  value:
    | string
    | null,
): string {
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

  return date
    .toISOString()
    .slice(0, 16)
    .replace(
      "T",
      " ",
    ) + " UTC";
}

function statusStyle(
  status: string,
): string {
  if (
    status === "published"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    status === "archived"
  ) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function AdminNotifications() {
  const [
    notifications,
    setNotifications,
  ] =
    useState<
      NotificationRecord[]
    >([]);

  const [
    accounts,
    setAccounts,
  ] =
    useState<
      Account[]
    >([]);

  const [counts, setCounts] =
    useState({
      total: 0,
      draft: 0,
      published: 0,
      archived: 0,
    });

  const [status, setStatus] =
    useState("all");

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [form, setForm] =
    useState({
      title: "",
      message: "",
      severity: "info",
      audienceType:
        "all",
      audienceRole:
        "student",
      audienceUserId:
        "",
      status: "draft",
    });

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          if (
            status !== "all"
          ) {
            params.set(
              "status",
              status,
            );
          }

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          const response =
            await fetch(
              `/api/admin/notifications?${params.toString()}`,
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
                "Unable to load notifications.",
            );
          }

          setNotifications(
            data.notifications ||
              [],
          );

          setCounts(
            data.counts || {
              total: 0,
              draft: 0,
              published: 0,
              archived: 0,
            },
          );
        } catch (loadError) {
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
      [
        status,
        search,
      ],
    );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    async function getAccounts() {
      try {
        const response =
          await fetch(
            "/api/admin/users?limit=100",
            {
              credentials:
                "include",
              cache:
                "no-store",
            },
          );

        const data =
          await response.json();

        if (response.ok) {
          setAccounts(
            data.users || [],
          );
        }
      } catch {
        // Individual audience is optional.
      }
    }

    getAccounts();
  }, []);

  function openCreate() {
    setForm({
      title: "",
      message: "",
      severity: "info",
      audienceType:
        "all",
      audienceRole:
        "student",
      audienceUserId:
        "",
      status: "draft",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function create() {
    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/notifications",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                form,
              ),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create notification.",
        );
      }

      setModalOpen(false);
      setSuccess(
        data.message ||
          "Notification created.",
      );

      await load();
    } catch (createError) {
      setError(
        createError instanceof
          Error
          ? createError.message
          : "Unable to create notification.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    item:
      NotificationRecord,
    nextStatus: string,
  ) {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/notifications/${item.id}`,
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
                status:
                  nextStatus,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update notification.",
        );
      }

      setSuccess(
        data.message,
      );

      await load();
    } catch (updateError) {
      setError(
        updateError instanceof
          Error
          ? updateError.message
          : "Unable to update notification.",
      );
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create announcements for the entire platform, a specific role or an individual account.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreate
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[11px] font-black text-white"
          >
            <Plus className="h-4 w-4" />
            Create Notification
          </button>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Total"
            value={
              counts.total
            }
          />

          <Metric
            label="Draft"
            value={
              counts.draft
            }
          />

          <Metric
            label="Published"
            value={
              counts.published
            }
          />

          <Metric
            label="Archived"
            value={
              counts.archived
            }
          />
        </section>

        {error && (
          <Alert error>
            {error}
          </Alert>
        )}

        {success && (
          <Alert>
            {success}
          </Alert>
        )}

        <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={
                  searchInput
                }
                onChange={(
                  event,
                ) =>
                  setSearchInput(
                    event.target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    setSearch(
                      searchInput,
                    );
                  }
                }}
                placeholder="Search notifications..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none"
              />
            </div>

            <select
              value={status}
              onChange={(
                event,
              ) =>
                setStatus(
                  event.target
                    .value,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

              <option value="archived">
                Archived
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                setSearch(
                  searchInput,
                )
              }
              className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white"
            >
              Search
            </button>

            <button
              type="button"
              onClick={
                load
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : notifications.length ===
              0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                  <Bell className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-black text-slate-700">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map(
                (
                  item,
                ) => (
                  <article
                    key={
                      item.id
                    }
                    className="p-5 transition hover:bg-[#fffafb]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                          {item.audienceType ===
                          "all" ? (
                            <Megaphone className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xs font-black text-slate-800">
                              {item.title}
                            </h2>

                            <span
                              className={`rounded-full border px-2 py-1 text-[8px] font-black capitalize ${statusStyle(
                                item.status,
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <p className="mt-2 max-w-3xl text-[10px] leading-5 text-slate-500">
                            {item.message}
                          </p>

                          <p className="mt-3 text-[9px] text-slate-400">
                            Audience:{" "}
                            <strong>
                              {item.audienceType ===
                              "all"
                                ? "Everyone"
                                : item.audienceType ===
                                  "role"
                                  ? item.audienceRole
                                  : item.audienceUserName}
                            </strong>

                            {" · "}

                            {formatDate(
                              item.createdAt,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {item.status !==
                          "published" && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                item,
                                "published",
                              )
                            }
                            className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-50 px-3 text-[9px] font-black text-emerald-700"
                          >
                            <Send className="h-3 w-3" />
                            Publish
                          </button>
                        )}

                        {item.status !==
                          "archived" && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                item,
                                "archived",
                              )
                            }
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-[9px] font-black text-slate-600"
                          >
                            <Archive className="h-3 w-3" />
                            Archive
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ),
              )
            )}
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() =>
              setModalOpen(
                false,
              )
            }
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  Platform Announcement
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  Create Notification
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <Field
                label="Title"
                value={
                  form.title
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      title:
                        value,
                    }),
                  )
                }
              />

              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-700">
                  Message
                </label>

                <textarea
                  value={
                    form.message
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        message:
                          event.target
                            .value,
                      }),
                    )
                  }
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Audience"
                  value={
                    form.audienceType
                  }
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        audienceType:
                          value,
                      }),
                    )
                  }
                  options={[
                    [
                      "all",
                      "Everyone",
                    ],
                    [
                      "role",
                      "Specific Role",
                    ],
                    [
                      "user",
                      "Individual User",
                    ],
                  ]}
                />

                <Select
                  label="Importance"
                  value={
                    form.severity
                  }
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        severity:
                          value,
                      }),
                    )
                  }
                  options={[
                    [
                      "info",
                      "Information",
                    ],
                    [
                      "important",
                      "Important",
                    ],
                    [
                      "success",
                      "Positive Update",
                    ],
                  ]}
                />
              </div>

              {form.audienceType ===
                "role" && (
                <Select
                  label="Role"
                  value={
                    form.audienceRole
                  }
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        audienceRole:
                          value,
                      }),
                    )
                  }
                  options={[
                    [
                      "student",
                      "Students",
                    ],
                    [
                      "faculty",
                      "Faculty",
                    ],
                    [
                      "client",
                      "Clients",
                    ],
                    [
                      "admin",
                      "Admins",
                    ],
                  ]}
                />
              )}

              {form.audienceType ===
                "user" && (
                <div>
                  <label className="mb-2 block text-[10px] font-black text-slate-700">
                    Account
                  </label>

                  <select
                    value={
                      form.audienceUserId
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          audienceUserId:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                  >
                    <option value="">
                      Select account...
                    </option>

                    {accounts.map(
                      (
                        account,
                      ) => (
                        <option
                          key={
                            account.id
                          }
                          value={
                            account.id
                          }
                        >
                          {account.name} — {account.role}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              <Select
                label="Initial Status"
                value={
                  form.status
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      status:
                        value,
                    }),
                  )
                }
                options={[
                  [
                    "draft",
                    "Save as Draft",
                  ],
                  [
                    "published",
                    "Publish Now",
                  ],
                ]}
              />

              {error && (
                <Alert error>
                  {error}
                </Alert>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(
                      false,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    create
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  Save Notification
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[9px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-[#271a1e]">
        {value}
      </p>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;

  onChange: (
    value: string,
  ) => void;

  options:
    [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
      >
        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (
            <option
              key={
                optionValue
              }
              value={
                optionValue
              }
            >
              {optionLabel}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <div
      className={[
        "mt-5 rounded-lg border px-4 py-3 text-xs font-semibold",

        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
