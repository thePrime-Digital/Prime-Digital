"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Archive,
  ExternalLink,
  Loader2,
  PlayCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Video,
  X,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
};

type Lecture = {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  type: string;
  url: string;
  unit: string;
  status: string;
  createdAt: string | null;
};

type LectureForm = {
  classId: string;
  title: string;
  description: string;
  url: string;
  unit: string;
};

function isGoogleDriveUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (
        url.hostname === "drive.google.com" ||
        url.hostname === "docs.google.com"
      )
    );
  } catch {
    return false;
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Recently added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FacultyRecordedLectures() {
  const [classes, setClasses] =
    useState<FacultyClass[]>([]);

  const [lectures, setLectures] =
    useState<Lecture[]>([]);

  const [classFilter, setClassFilter] =
    useState("");

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

  const [modalOpen, setModalOpen] =
    useState(false);

  const [form, setForm] =
    useState<LectureForm>({
      classId: "",
      title: "",
      description: "",
      url: "",
      unit: "",
    });

  const load = useCallback(
    async (nextClassFilter = classFilter) => {
      setLoading(true);
      setError("");

      try {
        const params =
          new URLSearchParams();

        if (nextClassFilter) {
          params.set(
            "classId",
            nextClassFilter,
          );
        }

        const response =
          await fetch(
            `/api/faculty/content?${params.toString()}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error ||
              "Unable to load recorded lectures.",
          );
        }

        setClasses(
          payload.classes || [],
        );

        const videoLectures =
          Array.isArray(payload.content)
            ? payload.content.filter(
                (item: Lecture) =>
                  String(
                    item.type || "",
                  ).toLowerCase() ===
                  "video",
              )
            : [];

        setLectures(
          videoLectures,
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load recorded lectures.",
        );
      } finally {
        setLoading(false);
      }
    },
    [classFilter],
  );

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setForm({
      classId:
        classFilter ||
        classes[0]?.id ||
        "",
      title: "",
      description: "",
      url: "",
      unit: "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setError("");
  }

  async function createLecture() {
    setError("");
    setSuccess("");

    if (!form.classId) {
      setError(
        "Please select a class.",
      );
      return;
    }

    if (
      form.title.trim().length < 2
    ) {
      setError(
        "Please enter a lecture title.",
      );
      return;
    }

    if (
      !isGoogleDriveUrl(
        form.url.trim(),
      )
    ) {
      setError(
        "Please enter a valid Google Drive link.",
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/faculty/content",
          {
            method: "POST",
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              classId:
                form.classId,

              title:
                form.title.trim(),

              description:
                form.description.trim(),

              type:
                "video",

              url:
                form.url.trim(),

              unit:
                form.unit.trim(),
            }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to add lecture.",
        );
      }

      setModalOpen(false);

      setSuccess(
        "Recorded lecture added successfully.",
      );

      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to add lecture.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    lecture: Lecture,
  ) {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/faculty/content",
          {
            method: "PATCH",
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: lecture.id,

              action:
                lecture.status ===
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
            "Unable to update lecture.",
        );
      }

      setSuccess(
        lecture.status ===
        "archived"
          ? "Lecture restored."
          : "Lecture archived.",
      );

      await load();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update lecture.",
      );
    }
  }

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return lectures;
      }

      return lectures.filter(
        (lecture) =>
          lecture.title
            .toLowerCase()
            .includes(query) ||
          lecture.className
            .toLowerCase()
            .includes(query) ||
          lecture.unit
            .toLowerCase()
            .includes(query),
      );
    }, [
      lectures,
      search,
    ]);

  const activeLectures =
    lectures.filter(
      (lecture) =>
        lecture.status !==
        "archived",
    ).length;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              Recorded Lectures
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Share Google Drive lecture
              recordings with your assigned
              classes.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={
              classes.length === 0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Add Recorded Lecture
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

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Total Lectures"
            value={
              lectures.length
            }
          />

          <Metric
            label="Active"
            value={
              activeLectures
            }
          />

          <Metric
            label="Classes"
            value={
              classes.length
            }
          />
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search lectures..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-xs outline-none focus:border-[#8f0024]/30"
              />
            </div>

            <select
              value={
                classFilter
              }
              onChange={(
                event,
              ) => {
                const value =
                  event.target.value;

                setClassFilter(
                  value,
                );

                void load(
                  value,
                );
              }}
              className="h-10 min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="">
                All Classes
              </option>

              {classes.map(
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

            <button
              type="button"
              onClick={() =>
                void load()
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
        ) : filtered.length ===
          0 ? (
          <section className="mt-5 flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <Video className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No recorded lectures yet
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Add your first Google Drive
                lecture recording for one of
                your assigned classes.
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
                  className={[
                    "overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",

                    lecture.status ===
                    "archived"
                      ? "border-slate-200 opacity-65"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#72001c] to-[#a00b35]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                      <PlayCircle className="h-7 w-7" />
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
                      {lecture.unit ||
                        lecture.className}
                    </p>

                    <h2 className="mt-1 text-sm font-black text-[#281b1f]">
                      {lecture.title}
                    </h2>

                    <p className="mt-1 text-[9px] font-semibold text-slate-500">
                      {lecture.className}
                    </p>

                    <p className="mt-3 line-clamp-3 min-h-[54px] text-[9px] leading-5 text-slate-400">
                      {lecture.description ||
                        "No description provided."}
                    </p>

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      {lecture.url && (
                        <a
                          href={
                            lecture.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#8f0024] px-3 text-[8px] font-black text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open Lecture
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void changeStatus(
                            lecture,
                          )
                        }
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                      >
                        {lecture.status ===
                        "archived" ? (
                          <RotateCcw className="h-3 w-3" />
                        ) : (
                          <Archive className="h-3 w-3" />
                        )}

                        {lecture.status ===
                        "archived"
                          ? "Restore"
                          : "Archive"}
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0"
            onClick={
              closeModal
            }
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  Recorded Lectures
                </p>

                <h2 className="mt-1 text-xl font-black text-[#281b1f]">
                  Add Lecture
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  saving
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

              <div className="sm:col-span-2">
                <Input
                  label="Lecture Title"
                  value={
                    form.title
                  }
                  placeholder="Introduction to Python"
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
              </div>

              <Input
                label="Unit / Module"
                value={
                  form.unit
                }
                placeholder="Module 1"
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

              <Input
                label="Google Drive Link"
                value={
                  form.url
                }
                type="url"
                placeholder="https://drive.google.com/..."
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
                  placeholder="What students will learn in this lecture..."
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-[#8f0024]/40"
                />
              </div>

              <div className="sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-[10px] font-black text-blue-800">
                  Google Drive Access
                </p>

                <p className="mt-1 text-[9px] leading-5 text-blue-700">
                  Make sure the Drive video is
                  shared with the students who
                  need access, or set it to
                  “Anyone with the link”.
                </p>
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
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void createLecture()
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  Add Lecture
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
  children: ReactNode;
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
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange:
    (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>
        {label}
      </Label>

      <input
        type={type}
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={
          placeholder
        }
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40"
      />
    </div>
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
      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-[#281b1f]">
        {value}
      </p>
    </article>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;
  children: ReactNode;
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
