"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  BookOpen,
  ExternalLink,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  STUDENT_PROGRAMS,
} from "@/types/user";

type Ebook = {
  id: string;
  title: string;
  program: string;
  driveFileId: string;
  previewUrl: string;
  status: string;

  createdAt:
    | string
    | null;

  updatedAt:
    | string
    | null;
};

type FormState = {
  title: string;
  program: string;
  driveUrl: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  program: "",
  driveUrl: "",
};

export default function AdminEbooks() {
  const [
    ebooks,
    setEbooks,
  ] =
    useState<Ebook[]>([]);

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
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
    removingId,
    setRemovingId,
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
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/admin/ebooks",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            (await response.json()) as {
              ebooks?: Ebook[];
              error?: string;
            };

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Unable to load eBooks.",
            );
          }

          setEbooks(
            Array.isArray(
              data.ebooks,
            )
              ? data.ebooks
              : [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load eBooks.",
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

  async function saveEbook(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/admin/ebooks",
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
        (await response.json()) as {
          message?: string;
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save eBook.",
        );
      }

      setSuccess(
        data.message ||
          "eBook saved successfully.",
      );

      setForm(
        EMPTY_FORM,
      );

      await load();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to save eBook.",
      );
    } finally {
      setSaving(false);
    }
  }

  function editEbook(
    ebook: Ebook,
  ) {
    setForm({
      title:
        ebook.title,

      program:
        ebook.program,

      driveUrl:
        `https://drive.google.com/file/d/${ebook.driveFileId}/view`,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top:
        0,

      behavior:
        "smooth",
    });
  }

  async function removeEbook(
    ebook: Ebook,
  ) {
    const confirmed =
      window.confirm(
        `Remove the eBook for "${ebook.program}"?`,
      );

    if (!confirmed) {
      return;
    }

    setRemovingId(
      ebook.id,
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/ebooks?id=${encodeURIComponent(
            ebook.id,
          )}`,
          {
            method:
              "DELETE",

            credentials:
              "include",
          },
        );

      const data =
        (await response.json()) as {
          message?: string;
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove eBook.",
        );
      }

      setSuccess(
        data.message ||
          "eBook removed successfully.",
      );

      await load();
    } catch (
      removeError
    ) {
      setError(
        removeError instanceof
          Error
          ? removeError.message
          : "Unable to remove eBook.",
      );
    } finally {
      setRemovingId("");
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8f0024]">
            Prime Digital School
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
            Course eBooks
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Assign one official eBook to each Prime Digital School course.
            Students will only see the eBook assigned to their enrolled course.
          </p>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Add / Update eBook
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Saving the same course again will update its existing eBook.
                </p>
              </div>
            </div>

            <form
              onSubmit={
                saveEbook
              }
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wide text-slate-600">
                  Course
                </label>

                <select
                  value={
                    form.program
                  }
                  required
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        program:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select course
                  </option>

                  {STUDENT_PROGRAMS.map(
                    (
                      program,
                    ) => (
                      <option
                        key={
                          program
                        }
                        value={
                          program
                        }
                      >
                        {
                          program
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wide text-slate-600">
                  eBook Title
                </label>

                <input
                  value={
                    form.title
                  }
                  required
                  maxLength={
                    150
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        title:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="Example: Python Programming Foundations eBook"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-xs outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wide text-slate-600">
                  Google Drive PDF Link
                </label>

                <input
                  value={
                    form.driveUrl
                  }
                  required
                  type="url"
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        driveUrl:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="https://drive.google.com/file/d/..."
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-xs outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                />
              </div>

              <div className="rounded-xl border border-[#8f0024]/10 bg-[#fff7f8] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8f0024]" />

                  <div>
                    <p className="text-[10px] font-black text-[#8f0024]">
                      Google Drive protection
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Upload the PDF to Google Drive as Viewer access and disable
                      download, print and copy for viewers before adding the link.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  saving
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8f0024] px-5 text-xs font-black text-white transition hover:bg-[#70001c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : "Save eBook"}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Assigned eBooks
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  {ebooks.length} course eBook
                  {ebooks.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  configured
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void load()
                }
                disabled={
                  loading
                }
                className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={[
                    "h-3.5 w-3.5",

                    loading
                      ? "animate-spin"
                      : "",
                  ].join(
                    " ",
                  )}
                />

                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : ebooks.length ===
              0 ? (
              <div className="flex min-h-[320px] items-center justify-center p-8 text-center">
                <div>
                  <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-4 text-sm font-black text-slate-700">
                    No eBooks added yet
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Add the first course eBook using the form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {ebooks.map(
                  (
                    ebook,
                  ) => (
                    <article
                      key={
                        ebook.id
                      }
                      className="p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wide text-[#8f0024]">
                            {
                              ebook.program
                            }
                          </p>

                          <h3 className="mt-1 text-sm font-black text-slate-900">
                            {
                              ebook.title
                            }
                          </h3>

                          <p className="mt-2 text-[10px] text-slate-400">
                            Google Drive protected PDF
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <a
                            href={
                              ebook.previewUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-black text-slate-600 transition hover:bg-slate-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />

                            Preview
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              editEbook(
                                ebook,
                              )
                            }
                            className="h-9 rounded-lg bg-[#fff1f4] px-3 text-[10px] font-black text-[#8f0024]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              removingId ===
                              ebook.id
                            }
                            onClick={() =>
                              void removeEbook(
                                ebook,
                              )
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-[10px] font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {removingId ===
                            ebook.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}

                            Remove
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