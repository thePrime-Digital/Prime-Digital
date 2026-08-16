"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select";

type FieldDefinition = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

type ColumnDefinition = {
  label: string;
  key: string;
};

type RecordItem = {
  id: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  data: Record<string, unknown>;
};

type Props = {
  resource:
    | "programs"
    | "classes";

  title: string;
  description: string;
  createLabel: string;
  fields: FieldDefinition[];
  columns: ColumnDefinition[];
};

function pretty(
  value: string,
): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function display(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

function statusClass(
  status: string,
): string {
  if (
    status === "active"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    status === "completed"
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (
    status === "archived" ||
    status === "cancelled"
  ) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function CatalogManager({
  resource,
  title,
  description,
  createLabel,
  fields,
  columns,
}: Props) {
  const [
    records,
    setRecords,
  ] =
    useState<
      RecordItem[]
    >([]);

  const [
    statuses,
    setStatuses,
  ] =
    useState<string[]>([]);

  const [
    counts,
    setCounts,
  ] =
    useState<
      Record<string, number>
    >({
      total: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<
      RecordItem | null
    >(null);

  const [
    formStatus,
    setFormStatus,
  ] = useState("");

  const [form, setForm] =
    useState<
      Record<string, string>
    >({});

  const initialForm =
    useMemo(() => {
      const result:
        Record<string, string> =
          {};

      for (
        const field
        of fields
      ) {
        result[field.key] =
          "";
      }

      return result;
    }, [fields]);

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          if (
            status !== "all"
          ) {
            params.set(
              "status",
              status,
            );
          }

          params.set(
            "page",
            String(page),
          );

          params.set(
            "limit",
            "25",
          );

          const response =
            await fetch(
              `/api/admin/catalog/${resource}?${params.toString()}`,
              {
                method:
                  "GET",

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
                "Unable to load records.",
            );
          }

          setRecords(
            data.records || [],
          );

          setStatuses(
            data.statuses || [],
          );

          setCounts(
            data.counts || {
              total: 0,
            },
          );

          setTotalPages(
            data.pagination
              ?.totalPages || 1,
          );
        } catch (loadError) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load records.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        resource,
        search,
        status,
        page,
      ],
    );

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);

    setForm({
      ...initialForm,
    });

    setFormStatus(
      statuses[0] ||
        (resource ===
        "programs"
          ? "draft"
          : "scheduled"),
    );

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEdit(
    item: RecordItem,
  ) {
    const nextForm:
      Record<string, string> =
        {};

    for (
      const field
      of fields
    ) {
      const value =
        item.data[
          field.key
        ];

      nextForm[field.key] =
        value === null ||
        value === undefined
          ? ""
          : String(value);
    }

    setEditing(item);
    setForm(nextForm);
    setFormStatus(
      item.status,
    );
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        editing
          ? `/api/admin/catalog/${resource}/${editing.id}`
          : `/api/admin/catalog/${resource}`;

      const response =
        await fetch(endpoint, {
          method:
            editing
              ? "PATCH"
              : "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              data:
                form,

              status:
                formStatus,
            }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save.",
        );
      }

      setModalOpen(false);

      setSuccess(
        data.message ||
          "Saved successfully.",
      );

      await load();
    } catch (saveError) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to save.",
      );
    } finally {
      setSaving(false);
    }
  }

  const firstStatus =
    statuses[0];

  const secondStatus =
    statuses[1];

  const thirdStatus =
    statuses[2];

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
              {title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreate
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[11px] font-black text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />

            {createLabel}
          </button>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total"
            value={
              counts.total ||
              0
            }
          />

          <SummaryCard
            label={
              firstStatus
                ? pretty(
                    firstStatus,
                  )
                : "Status"
            }
            value={
              firstStatus
                ? counts[
                    firstStatus
                  ] || 0
                : 0
            }
          />

          <SummaryCard
            label={
              secondStatus
                ? pretty(
                    secondStatus,
                  )
                : "Status"
            }
            value={
              secondStatus
                ? counts[
                    secondStatus
                  ] || 0
                : 0
            }
          />

          <SummaryCard
            label={
              thirdStatus
                ? pretty(
                    thirdStatus,
                  )
                : "Status"
            }
            value={
              thirdStatus
                ? counts[
                    thirdStatus
                  ] || 0
                : 0
            }
          />
        </section>

        {error &&
          !modalOpen && (
            <Alert type="error">
              {error}
            </Alert>
          )}

        {success && (
          <Alert type="success">
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

                    setPage(1);
                  }
                }}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-[#8f0024]/40"
              />
            </div>

            <select
              value={status}
              onChange={(
                event,
              ) => {
                setStatus(
                  event.target
                    .value,
                );

                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="all">
                All Statuses
              </option>

              {statuses.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option
                    }
                    value={
                      option
                    }
                  >
                    {pretty(
                      option,
                    )}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch(
                  searchInput,
                );
                setPage(1);
              }}
              className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() =>
                load()
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {columns.map(
                    (
                      column,
                    ) => (
                      <th
                        key={
                          column.key
                        }
                        className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400"
                      >
                        {
                          column.label
                        }
                      </th>
                    ),
                  )}

                  <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        2
                      }
                      className="py-16 text-center"
                    >
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#8f0024]" />

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Loading...
                      </p>
                    </td>
                  </tr>
                ) : records.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        2
                      }
                      className="py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                        <BookOpen className="h-6 w-6" />
                      </div>

                      <p className="mt-4 text-sm font-black text-slate-700">
                        No {title.toLowerCase()} yet
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        Use {createLabel} to add your first record.
                      </p>
                    </td>
                  </tr>
                ) : (
                  records.map(
                    (
                      item,
                    ) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-slate-100 transition hover:bg-[#fffafb]"
                      >
                        {columns.map(
                          (
                            column,
                          ) => (
                            <td
                              key={
                                column.key
                              }
                              className="max-w-[260px] px-5 py-4 text-[11px] font-semibold text-slate-700"
                            >
                              {display(
                                item.data[
                                  column.key
                                ],
                              )}
                            </td>
                          ),
                        )}

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${statusClass(
                              item.status,
                            )}`}
                          >
                            {pretty(
                              item.status,
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                item,
                              )
                            }
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-[9px] font-black text-slate-600 hover:text-[#8f0024]"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-[10px] font-semibold text-slate-400">
              Page {page} of{" "}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (
                      current,
                    ) =>
                      Math.max(
                        1,
                        current -
                          1,
                      ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={
                  page >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (
                      current,
                    ) =>
                      Math.min(
                        totalPages,
                        current +
                          1,
                      ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={() =>
              setModalOpen(
                false,
              )
            }
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                  {editing
                    ? "Edit Record"
                    : "New Record"}
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  {editing
                    ? `Edit ${resource === "programs" ? "Program" : "Class"}`
                    : createLabel}
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

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {fields.map(
                (
                  field,
                ) => (
                  <div
                    key={
                      field.key
                    }
                    className={
                      field.type ===
                      "textarea"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label className="mb-2 block text-[11px] font-black text-slate-700">
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-[#8f0024]">
                          *
                        </span>
                      )}
                    </label>

                    {field.type ===
                    "textarea" ? (
                      <textarea
                        rows={4}
                        value={
                          form[
                            field.key
                          ] || ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              [field.key]:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder={
                          field.placeholder
                        }
                        className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-[#8f0024]/40"
                      />
                    ) : field.type ===
                      "select" ? (
                      <select
                        value={
                          form[
                            field.key
                          ] || ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              [field.key]:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none"
                      >
                        <option value="">
                          Select...
                        </option>

                        {field.options?.map(
                          (
                            option,
                          ) => (
                            <option
                              key={
                                option
                              }
                              value={
                                option
                              }
                            >
                              {
                                option
                              }
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <input
                        type={
                          field.type ===
                          "number"
                            ? "number"
                            : "text"
                        }
                        value={
                          form[
                            field.key
                          ] || ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              [field.key]:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder={
                          field.placeholder
                        }
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40"
                      />
                    )}
                  </div>
                ),
              )}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black text-slate-700">
                  Status
                </label>

                <select
                  value={
                    formStatus
                  }
                  onChange={(
                    event,
                  ) =>
                    setFormStatus(
                      event.target
                        .value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none"
                >
                  {statuses.map(
                    (
                      option,
                    ) => (
                      <option
                        key={
                          option
                        }
                        value={
                          option
                        }
                      >
                        {pretty(
                          option,
                        )}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {error &&
                modalOpen && (
                  <div className="sm:col-span-2">
                    <Alert type="error">
                      {error}
                    </Alert>
                  </div>
                )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
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
                    save
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editing
                    ? "Save Changes"
                    : "Create"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="absolute left-0 top-0 h-1 w-full bg-[#8f0024]" />

      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#271a1e]">
        {value}
      </p>
    </article>
  );
}

function Alert({
  type,
  children,
}: {
  type:
    | "error"
    | "success";
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "mt-5 rounded-lg border px-4 py-3 text-xs font-semibold",

        type ===
        "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
