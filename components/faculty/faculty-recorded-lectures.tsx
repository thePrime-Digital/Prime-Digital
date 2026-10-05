"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Archive,
  BookOpen,
  ExternalLink,
  Loader2,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Save,
  Star,
  Video,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
  program: string;
};

type Lecture = {
  id: string;
  classId: string;
  className: string;
  program: string;
  subject: string;
  topic: string;
  title: string;
  description: string;
  recordingUrl: string;
  status: string;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

const EMPTY_FORM = {
  classId: "",
  subject: "",
  topic: "",
  title: "",
  description: "",
  recordingUrl: "",
};

export default function FacultyRecordedLectures() {
  const [
    classes,
    setClasses,
  ] =
    useState<FacultyClass[]>([]);

  const [
    lectures,
    setLectures,
  ] =
    useState<Lecture[]>([]);

  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM,
    );

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
    updatingId,
    setUpdatingId,
  ] =
    useState("");

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

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          "",
        );

        try {
          const response =
            await fetch(
              "/api/faculty/recorded-lectures",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.error ||
                "Unable to load recorded lectures.",
            );
          }

          setClasses(
            Array.isArray(
              data.classes,
            )
              ? data.classes
              : [],
          );

          setLectures(
            Array.isArray(
              data.lectures,
            )
              ? data.lectures
              : [],
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
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  async function publishLecture(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(
      true,
    );

    setError(
      "",
    );

    setSuccess(
      "",
    );

    try {
      const response =
        await fetch(
          "/api/faculty/recorded-lectures",
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

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to publish lecture.",
        );
      }

      setForm(
        EMPTY_FORM,
      );

      setSuccess(
        data.message ||
          "Recorded lecture published successfully.",
      );

      await load();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to publish lecture.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  async function updateStatus(
    lecture:
      Lecture,
  ) {
    const action =
      lecture.status ===
      "published"
        ? "archive"
        : "restore";

    setUpdatingId(
      lecture.id,
    );

    setError(
      "",
    );

    setSuccess(
      "",
    );

    try {
      const response =
        await fetch(
          `/api/faculty/recorded-lectures/${lecture.id}`,
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
                action,
              }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to update lecture.",
        );
      }

      setSuccess(
        data.message,
      );

      await load();
    } catch (
      actionError
    ) {
      setError(
        actionError instanceof
          Error
          ? actionError.message
          : "Unable to update lecture.",
      );
    } finally {
      setUpdatingId(
        "",
      );
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Faculty Workspace
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
            Recorded Lectures
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Publish recordings by subject and topic. Students can watch, rate
            and comment, and the strongest lectures rise in recommendations.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                <Video className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Publish Lecture
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Publish under one of your assigned classes.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : classes.length === 0 ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
                No classes are currently assigned to your faculty account.
              </div>
            ) : (
              <form
                onSubmit={
                  publishLecture
                }
                className="mt-6 space-y-4"
              >
                <FieldLabel>
                  Assigned Class
                </FieldLabel>

                <select
                  required
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
                          event.target.value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#8f0024]"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select class
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
                        {item.program
                          ? ` — ${item.program}`
                          : ""}
                      </option>
                    ),
                  )}
                </select>

                <Field
                  label="Subject"
                  value={
                    form.subject
                  }
                  placeholder="Example: Python"
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        subject:
                          value,
                      }),
                    )
                  }
                />

                <Field
                  label="Topic"
                  value={
                    form.topic
                  }
                  placeholder="Example: For & While Loops"
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        topic:
                          value,
                      }),
                    )
                  }
                />

                <Field
                  label="Lecture Title"
                  value={
                    form.title
                  }
                  placeholder="Example: Python Loops Explained"
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
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <textarea
                    value={
                      form.description
                    }
                    maxLength={
                      2000
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
                            event.target.value,
                        }),
                      )
                    }
                    placeholder="What will students learn in this lecture?"
                    className="min-h-[100px] w-full resize-y rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-[#8f0024]"
                  />
                </div>

                <Field
                  label="Recording URL"
                  value={
                    form.recordingUrl
                  }
                  placeholder="Google Drive, YouTube, Vimeo or video link"
                  type="url"
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        recordingUrl:
                          value,
                      }),
                    )
                  }
                />

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? "Publishing..."
                    : "Publish Recorded Lecture"}
                </button>
              </form>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  My Recorded Lectures
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  {lectures.length} lecture
                  {lectures.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void load()
                }
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-black text-slate-600"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : lectures.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center p-8 text-center">
                <div>
                  <BookOpen className="mx-auto h-9 w-9 text-slate-300" />

                  <p className="mt-4 text-sm font-black text-slate-700">
                    No recorded lectures yet
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Publish your first lecture using the form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lectures.map(
                  (
                    lecture,
                  ) => (
                    <article
                      key={
                        lecture.id
                      }
                      className="p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#fff1f4] px-2.5 py-1 text-[9px] font-black text-[#8f0024]">
                              {lecture.subject}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">
                              {lecture.topic}
                            </span>

                            {lecture.status !==
                              "published" && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-700">
                                Archived
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-sm font-black text-slate-900">
                            {lecture.title}
                          </h3>

                          <p className="mt-1 text-[10px] font-semibold text-slate-500">
                            {lecture.program} · {lecture.className}
                          </p>

                          {lecture.description && (
                            <p className="mt-3 max-w-xl text-xs leading-6 text-slate-500">
                              {lecture.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-500" />
                              {lecture.averageRating.toFixed(
                                1,
                              )}{" "}
                              ({lecture.ratingCount})
                            </span>

                            <span>
                              {lecture.commentCount} comments
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <a
                            href={
                              lecture.recordingUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-black text-slate-600"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Preview
                          </a>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              lecture.id
                            }
                            onClick={() =>
                              void updateStatus(
                                lecture,
                              )
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#fff1f4] px-3 text-[10px] font-black text-[#8f0024] disabled:opacity-50"
                          >
                            {updatingId ===
                            lecture.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : lecture.status ===
                              "published" ? (
                              <Archive className="h-3.5 w-3.5" />
                            ) : (
                              <RotateCcw className="h-3.5 w-3.5" />
                            )}

                            {lecture.status ===
                            "published"
                              ? "Archive"
                              : "Restore"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-[10px] font-black uppercase tracking-wide text-slate-600">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (
    value: string,
  ) => void;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        required
        type={type}
        value={value}
        placeholder={
          placeholder
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]"
      />
    </div>
  );
}