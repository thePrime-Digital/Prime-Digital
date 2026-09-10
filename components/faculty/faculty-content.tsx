"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  Archive,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  MonitorPlay,
  Plus,
  RefreshCw,
  RotateCcw,
  StickyNote,
  Upload,
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
  createdAt: string | null;
};

type ContentForm = {
  classId: string;
  title: string;
  description: string;
  type: string;
  url: string;
  unit: string;
};

function iconForType(type: string) {
  if (type === "video") {
    return MonitorPlay;
  }

  if (type === "link") {
    return Link2;
  }

  if (type === "note") {
    return StickyNote;
  }

  return FileText;
}

export default function FacultyContent() {
  const [classes, setClasses] = useState<FacultyClass[]>([]);

  const [content, setContent] = useState<ContentItem[]>([]);

  const [classFilter, setClassFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [uploadingFile, setUploadingFile] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState("");

  const [form, setForm] = useState<ContentForm>({
    classId: "",
    title: "",
    description: "",
    type: "document",
    url: "",
    unit: "",
  });

  const load = useCallback(
    async (nextClassFilter = classFilter) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (nextClassFilter) {
          params.set("classId", nextClassFilter);
        }

        const response = await fetch(
          `/api/faculty/content?${params.toString()}`,
          {
            credentials: "include",

            cache: "no-store",
          },
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load course content.");
        }

        setClasses(payload.classes || []);

        setContent(payload.content || []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
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
    void load();
  }, [load]);

  function openCreate() {
    setForm({
      classId: classFilter || classes[0]?.id || "",

      title: "",

      description: "",

      type: "document",

      url: "",

      unit: "",
    });

    setError("");
    setSuccess("");

    setUploadedFileName("");

    setUploadingFile(false);

    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploadingFile) {
      return;
    }

    setModalOpen(false);

    setError("");
    setUploadedFileName("");
  }

  async function uploadDocument(file: File) {
    setError("");
    setUploadedFileName("");

    if (file.size === 0) {
      setError("The selected file is empty.");

      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("File must be smaller than 4 MB.");

      return;
    }

    setUploadingFile(true);

    try {
      const uploadData = new FormData();

      uploadData.append("file", file);

      const response = await fetch("/api/faculty/content/upload", {
        method: "POST",

        credentials: "include",

        body: uploadData,
      });

      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to upload file.");
      }

      setForm((current) => ({
        ...current,

        url: String(payload.url),
      }));

      setUploadedFileName(String(payload.fileName || file.name));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload file.",
      );
    } finally {
      setUploadingFile(false);
    }
  }

  async function createContent() {
    setError("");
    setSuccess("");

    if (!form.classId) {
      setError("Please select a class.");

      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a content title.");

      return;
    }

    if (form.type !== "note" && !form.url.trim()) {
      setError(
        form.type === "document"
          ? "Upload a document or enter a resource URL."
          : "Please enter a resource URL.",
      );

      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/faculty/content", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to add content.");
      }

      setModalOpen(false);

      setUploadedFileName("");

      setSuccess(payload.message || "Content added successfully.");

      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to add content.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeContentStatus(item: ContentItem) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/faculty/content", {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: item.id,

          action: item.status === "archived" ? "restore" : "archive",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update content.");
      }

      setSuccess(payload.message || "Content updated successfully.");

      await load();
    } catch (updateError) {
      setError(
        updateError instanceof Error
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
              Organise class notes, documents, links and learning resources.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={classes.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </button>
        </div>

        {error && !modalOpen && <Alert error>{error}</Alert>}

        {success && !modalOpen && <Alert>{success}</Alert>}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={classFilter}
              onChange={(event) => {
                setClassFilter(event.target.value);
              }}
              className="h-10 min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
            >
              <option value="">All Classes</option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void load()}
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
        ) : content.length === 0 ? (
          <div className="mt-5 flex min-h-[430px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <BookOpen className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No course content yet
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Add your first learning resource to start building the content
                library.
              </p>
            </div>
          </div>
        ) : (
          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.map((item) => {
              const Icon = iconForType(item.type);

              return (
                <article
                  key={item.id}
                  className={[
                    "rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",

                    item.status === "archived"
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
                    {item.unit || item.className}
                  </p>

                  <h2 className="mt-1 text-sm font-black text-[#281b1f]">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 min-h-[54px] text-[9px] leading-5 text-slate-400">
                    {item.description || "No description provided."}
                  </p>

                  <p className="mt-3 text-[8px] font-semibold text-slate-400">
                    {item.className}
                  </p>

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    {item.url && (
                      <a
                        href={`/api/course-content/${item.id}/open`}
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
                      onClick={() => void changeContentStatus(item)}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                    >
                      {item.status === "archived" ? (
                        <RotateCcw className="h-3 w-3" />
                      ) : (
                        <Archive className="h-3 w-3" />
                      )}

                      {item.status === "archived" ? "Restore" : "Archive"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close content modal"
            className="absolute inset-0"
            onClick={closeModal}
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
                onClick={closeModal}
                disabled={saving || uploadingFile}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Class</Label>

                <select
                  value={form.classId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      classId: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="">Select class...</option>

                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Content Title"
                value={form.title}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,

                    title: value,
                  }))
                }
              />

              <Input
                label="Unit / Module"
                value={form.unit}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,

                    unit: value,
                  }))
                }
              />

              <div>
                <Label>Content Type</Label>

                <select
                  value={form.type}
                  onChange={(event) => {
                    const nextType = event.target.value;

                    setUploadedFileName("");

                    setForm((current) => ({
                      ...current,

                      type: nextType,

                      url: "",
                    }));
                  }}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="document">Document</option>

                  <option value="link">Link</option>

                  <option value="video">Video</option>

                  <option value="note">Note</option>
                </select>
              </div>

              {form.type === "document" ? (
                <div>
                  <Label>Upload Document</Label>

                  <label
                    className={[
                      "flex min-h-11 items-center justify-center gap-2 rounded-lg border border-dashed px-3 text-[10px] font-black transition",

                      uploadingFile
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                        : "cursor-pointer border-[#8f0024]/30 bg-[#fff7f8] text-[#8f0024] hover:bg-[#fff1f4]",
                    ].join(" ")}
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose File
                      </>
                    )}

                    <input
                      type="file"
                      disabled={uploadingFile}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          void uploadDocument(file);
                        }

                        event.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 text-[8px] leading-4 text-slate-400">
                    PDF, Word, PowerPoint, Excel, text or image. Maximum 4 MB.
                  </p>

                  {uploadedFileName && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                      <span className="min-w-0 truncate text-[9px] font-bold text-emerald-700">
                        {uploadedFileName}
                      </span>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label>Or Resource URL</Label>

                    <input
                      type="url"
                      value={form.url}
                      onChange={(event) => {
                        setUploadedFileName("");

                        setForm((current) => ({
                          ...current,

                          url: event.target.value,
                        }));
                      }}
                      placeholder="https://..."
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
                    />
                  </div>
                </div>
              ) : form.type === "note" ? (
                <div>
                  <Label>Resource</Label>

                  <div className="flex h-11 items-center rounded-lg border border-slate-100 bg-slate-50 px-3 text-[9px] font-semibold text-slate-400">
                    Notes do not require a file or URL.
                  </div>
                </div>
              ) : (
                <Input
                  label={form.type === "video" ? "Video URL" : "Resource URL"}
                  value={form.url}
                  type="url"
                  placeholder="https://..."
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,

                      url: value,
                    }))
                  }
                />
              )}

              <div className="sm:col-span-2">
                <Label>Description</Label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      description: event.target.value,
                    }))
                  }
                  placeholder={
                    form.type === "note"
                      ? "Write the note or learning material here..."
                      : "Describe this learning resource..."
                  }
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-[#8f0024]/40"
                />
              </div>

              {error && modalOpen && (
                <div className="sm:col-span-2">
                  <Alert error>{error}</Alert>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploadingFile}
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void createContent()}
                  disabled={saving || uploadingFile}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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

function Label({ children }: { children: ReactNode }) {
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

  onChange: (value: string) => void;

  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40"
      />
    </div>
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
