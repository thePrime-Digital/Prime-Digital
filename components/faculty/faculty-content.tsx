"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Archive,
  BookOpen,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  MonitorPlay,
  Plus,
  RefreshCw,
  RotateCcw,
  StickyNote,
  X,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
};

type ContentItem = {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  type: string;
  url: string;
  unit: string;
  status: string;

  createdAt:
    | string
    | null;
};

function iconForType(
  type: string,
) {
  if (
    type === "video"
  ) {
    return MonitorPlay;
  }

  if (
    type === "link"
  ) {
    return Link2;
  }

  if (
    type === "note"
  ) {
    return StickyNote;
  }

  return FileText;
}

export default function FacultyContent() {
  const [
    classes,
    setClasses,
  ] =
    useState<
      FacultyClass[]
    >([]);

  const [
    content,
    setContent,
  ] =
    useState<
      ContentItem[]
    >([]);

  const [
    classFilter,
    setClassFilter,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState({
      classId: "",
      title: "",
      description: "",
      type:
        "document",
      url: "",
      unit: "",
    });

  const load =
    useCallback(
      async (
        nextClassFilter =
          classFilter,
      ) => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          if (
            nextClassFilter
          ) {
            params.set(
              "classId",
              nextClassFilter,
            );
          }

          const response =
            await fetch(
              `/api/faculty/content?${params.toString()}`,
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
                "Unable to load course content.",
            );
          }

          setClasses(
            payload.classes ||
              [],
          );

          setContent(
            payload.content ||
              [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load content.",
          );
        } finally {
          setLoading(false);
        }
      },
      [classFilter],
    );

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({
      classId:
        classFilter ||
        classes[0]?.id ||
        "",

      title: "",
      description: "",
      type:
        "document",
      url: "",
      unit: "",
    });

    setError("");
    setModalOpen(
      true,
    );
  }

  async function createContent() {
    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/faculty/content",
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

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to add content.",
        );
      }

      setModalOpen(
        false,
      );

      setSuccess(
        payload.message,
      );

      await load();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to add content.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeContentStatus(
    item:
      ContentItem,
  ) {
    setError("");

    try {
      const response =
        await fetch(
          "/api/faculty/content",
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
                id:
                  item.id,

                action:
                  item.status ===
                  "archived"
                    ? "restore"
                    : "archive",
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to update content.",
        );
      }

      setSuccess(
        payload.message,
      );

      await load();
    } catch (
      updateError
    ) {
      setError(
        updateError instanceof
          Error
          ? updateError.message
          : "Unable to update content.",
      );
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              Content Library
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organise class notes,
              documents, links and
              learning resources.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreate
            }
            disabled={
              classes.length ===
              0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </button>
        </div>

        {error &&
          !modalOpen && (
            <Alert error>
              {error}
            </Alert>
          )}

        {success && (
          <Alert>
            {success}
          </Alert>
        )}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={
                classFilter
              }
              onChange={(
                event,
              ) => {
                const value =
                  event.target
                    .value;

                setClassFilter(
                  value,
                );

                load(value);
              }}
              className="h-10 min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="">
                All Classes
              </option>

              {classes.map(
                (
                  item,
                ) => (
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
        </section>

        {loading ? (
          <div className="flex min-h-[430px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : content.length ===
          0 ? (
          <div className="mt-5 flex min-h-[430px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <BookOpen className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No course content yet
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Add your first learning
                resource to start building
                the content library.
              </p>
            </div>
          </div>
        ) : (
          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.map(
              (
                item,
              ) => {
                const Icon =
                  iconForType(
                    item.type,
                  );

                return (
                  <article
                    key={
                      item.id
                    }
                    className={[
                      "rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",

                      item.status ===
                      "archived"
                        ? "border-slate-200 opacity-65"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black capitalize text-slate-500">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-4 text-[8px] font-black uppercase tracking-wider text-[#8f0024]">
                      {item.unit ||
                        item.className}
                    </p>

                    <h2 className="mt-1 text-sm font-black text-[#281b1f]">
                      {
                        item.title
                      }
                    </h2>

                    <p className="mt-2 line-clamp-3 min-h-[54px] text-[9px] leading-5 text-slate-400">
                      {item.description ||
                        "No description provided."}
                    </p>

                    <p className="mt-3 text-[8px] font-semibold text-slate-400">
                      {
                        item.className
                      }
                    </p>

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      {item.url && (
                        <a
                          href={
                            item.url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#8f0024] px-3 text-[8px] font-black text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          changeContentStatus(
                            item,
                          )
                        }
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                      >
                        {item.status ===
                        "archived" ? (
                          <RotateCcw className="h-3 w-3" />
                        ) : (
                          <Archive className="h-3 w-3" />
                        )}

                        {item.status ===
                        "archived"
                          ? "Restore"
                          : "Archive"}
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}
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
                  Course Content
                </p>

                <h2 className="mt-1 text-xl font-black text-[#281b1f]">
                  Add Content
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
              <div className="sm:col-span-2">
                <Label>
                  Class
                </Label>

                <select
                  value={
                    form.classId
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        classId:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="">
                    Select class...
                  </option>

                  {classes.map(
                    (
                      item,
                    ) => (
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

              <Input
                label="Content Title"
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

              <Input
                label="Unit / Module"
                value={
                  form.unit
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      unit:
                        value,
                    }),
                  )
                }
              />

              <div>
                <Label>
                  Content Type
                </Label>

                <select
                  value={
                    form.type
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        type:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="document">
                    Document
                  </option>

                  <option value="link">
                    Link
                  </option>

                  <option value="video">
                    Video
                  </option>

                  <option value="note">
                    Note
                  </option>
                </select>
              </div>

              <Input
                label="Resource URL"
                value={
                  form.url
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      url:
                        value,
                    }),
                  )
                }
              />

              <div className="sm:col-span-2">
                <Label>
                  Description
                </Label>

                <textarea
                  rows={5}
                  value={
                    form.description
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        description:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs"
                />
              </div>

              {error &&
                modalOpen && (
                  <div className="sm:col-span-2">
                    <Alert error>
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
                    createContent
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  Add Content
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Label({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}

function Input({
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
      <Label>
        {label}
      </Label>

      <input
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
      />
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
