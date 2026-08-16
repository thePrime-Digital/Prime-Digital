"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Eye,
  FileCheck2,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
};

type Assignment = {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;

  dueAt:
    | string
    | null;

  maxScore: number;
  attachmentUrl: string;
  status: string;
  submissionCount: number;
  pendingReviews: number;
};

type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  text: string;
  fileUrl: string;
  status: string;

  grade:
    | number
    | null;

  feedback: string;

  submittedAt:
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

  return date.toLocaleString(
    [],
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  );
}

export default function FacultyAssignments() {
  const [
    classes,
    setClasses,
  ] =
    useState<
      FacultyClass[]
    >([]);

  const [
    assignments,
    setAssignments,
  ] =
    useState<
      Assignment[]
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
    createOpen,
    setCreateOpen,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    selected,
    setSelected,
  ] =
    useState<
      Assignment | null
    >(null);

  const [
    submissions,
    setSubmissions,
  ] =
    useState<
      Submission[]
    >([]);

  const [
    detailLoading,
    setDetailLoading,
  ] =
    useState(false);

  const [
    gradeDrafts,
    setGradeDrafts,
  ] =
    useState<
      Record<
        string,
        {
          grade: string;
          feedback: string;
        }
      >
    >({});

  const [
    form,
    setForm,
  ] =
    useState({
      classId: "",
      title: "",
      description: "",
      dueAt: "",
      maxScore:
        "100",
      attachmentUrl:
        "",
      status:
        "draft",
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
              `/api/faculty/assignments?${params.toString()}`,
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
                "Unable to load assignments.",
            );
          }

          setClasses(
            payload.classes ||
              [],
          );

          setAssignments(
            payload.assignments ||
              [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load assignments.",
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
      dueAt: "",
      maxScore:
        "100",
      attachmentUrl:
        "",
      status:
        "draft",
    });

    setError("");
    setSuccess("");
    setCreateOpen(
      true,
    );
  }

  async function createAssignment() {
    setSaving(true);
    setError("");

    try {
      const dueAt =
        new Date(
          form.dueAt,
        );

      const response =
        await fetch(
          "/api/faculty/assignments",
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
              JSON.stringify({
                ...form,

                dueAt:
                  dueAt.toISOString(),
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to create assignment.",
        );
      }

      setCreateOpen(
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
          : "Unable to create assignment.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function openAssignment(
    assignment:
      Assignment,
  ) {
    setSelected(
      assignment,
    );

    setDetailLoading(
      true,
    );

    setError("");

    try {
      const response =
        await fetch(
          `/api/faculty/assignments/${assignment.id}`,
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
            "Unable to load assignment.",
        );
      }

      const loaded =
        payload.submissions ||
        [];

      setSubmissions(
        loaded,
      );

      const drafts:
        Record<
          string,
          {
            grade: string;
            feedback: string;
          }
        > = {};

      for (
        const submission
        of loaded
      ) {
        drafts[
          submission.id
        ] = {
          grade:
            submission.grade ===
            null
              ? ""
              : String(
                  submission.grade,
                ),

          feedback:
            submission.feedback ||
            "",
        };
      }

      setGradeDrafts(
        drafts,
      );
    } catch (
      detailError
    ) {
      setError(
        detailError instanceof
          Error
          ? detailError.message
          : "Unable to load assignment.",
      );
    } finally {
      setDetailLoading(
        false,
      );
    }
  }

  async function changeStatus(
    assignment:
      Assignment,

    status: string,
  ) {
    setError("");

    try {
      const response =
        await fetch(
          `/api/faculty/assignments/${assignment.id}`,
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
                  "change_status",

                status,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to update assignment.",
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
          : "Unable to update assignment.",
      );
    }
  }

  async function saveGrade(
    submission:
      Submission,
  ) {
    if (!selected) {
      return;
    }

    const draft =
      gradeDrafts[
        submission.id
      ];

    if (!draft) {
      return;
    }

    setError("");

    try {
      const response =
        await fetch(
          `/api/faculty/assignments/${selected.id}`,
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
                  "grade_submission",

                submissionId:
                  submission.id,

                grade:
                  Number(
                    draft.grade,
                  ),

                feedback:
                  draft.feedback,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to save grade.",
        );
      }

      setSuccess(
        payload.message,
      );

      await openAssignment(
        selected,
      );

      await load();
    } catch (
      gradeError
    ) {
      setError(
        gradeError instanceof
          Error
          ? gradeError.message
          : "Unable to save grade.",
      );
    }
  }

  const totalPending =
    assignments.reduce(
      (
        total,
        assignment,
      ) =>
        total +
        assignment.pendingReviews,
      0,
    );

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              Assignments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create assignments,
              review submissions and
              grade student work.
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
            Create Assignment
          </button>
        </div>

        {error &&
          !createOpen && (
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
            label="Assignments"
            value={
              assignments.length
            }
          />

          <Metric
            label="Published"
            value={
              assignments.filter(
                (item) =>
                  item.status ===
                  "published",
              ).length
            }
          />

          <Metric
            label="Pending Reviews"
            value={
              totalPending
            }
          />
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="max-w-sm">
            <Label>
              Filter by Class
            </Label>

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
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
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
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-[430px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : assignments.length ===
          0 ? (
          <EmptyAssignments
            hasClasses={
              classes.length >
              0
            }
          />
        ) : (
          <section className="mt-5 grid gap-4 lg:grid-cols-2">
            {assignments.map(
              (
                assignment,
              ) => (
                <article
                  key={
                    assignment.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                      <ClipboardList className="h-4 w-4" />
                    </div>

                    <StatusPill
                      status={
                        assignment.status
                      }
                    />
                  </div>

                  <h2 className="mt-4 text-sm font-black text-[#281b1f]">
                    {
                      assignment.title
                    }
                  </h2>

                  <p className="mt-1 text-[9px] font-bold text-[#8f0024]">
                    {
                      assignment.className
                    }
                  </p>

                  <p className="mt-3 line-clamp-2 text-[9px] leading-5 text-slate-400">
                    {assignment.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <SmallStat
                      label="Submitted"
                      value={
                        assignment.submissionCount
                      }
                    />

                    <SmallStat
                      label="Review"
                      value={
                        assignment.pendingReviews
                      }
                    />

                    <SmallStat
                      label="Marks"
                      value={
                        assignment.maxScore
                      }
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[8px] text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-[#8f0024]" />

                    Due{" "}
                    {formatDate(
                      assignment.dueAt,
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        openAssignment(
                          assignment,
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#8f0024] px-3 text-[8px] font-black text-white"
                    >
                      <Eye className="h-3 w-3" />
                      Review
                    </button>

                    {assignment.status ===
                      "draft" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(
                            assignment,
                            "published",
                          )
                        }
                        className="h-8 rounded-lg border border-emerald-200 px-3 text-[8px] font-black text-emerald-700"
                      >
                        Publish
                      </button>
                    )}

                    {assignment.status ===
                      "published" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(
                            assignment,
                            "closed",
                          )
                        }
                        className="h-8 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                      >
                        Close
                      </button>
                    )}

                    {assignment.attachmentUrl && (
                      <a
                        href={
                          assignment.attachmentUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                      >
                        <ExternalLink className="h-3 w-3" />
                        File
                      </a>
                    )}
                  </div>
                </article>
              ),
            )}
          </section>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() =>
              setCreateOpen(
                false,
              )
            }
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <ModalHeader
              title="Create Assignment"
              onClose={() =>
                setCreateOpen(
                  false,
                )
              }
            />

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

              <div className="sm:col-span-2">
                <Input
                  label="Assignment Title"
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
              </div>

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

              <Input
                label="Due Date & Time"
                type="datetime-local"
                value={
                  form.dueAt
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      dueAt:
                        value,
                    }),
                  )
                }
              />

              <Input
                label="Maximum Score"
                type="number"
                value={
                  form.maxScore
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      maxScore:
                        value,
                    }),
                  )
                }
              />

              <div className="sm:col-span-2">
                <Input
                  label="Attachment URL (Optional)"
                  value={
                    form.attachmentUrl
                  }
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        attachmentUrl:
                          value,
                      }),
                    )
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Label>
                  Status
                </Label>

                <select
                  value={
                    form.status
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        status:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="draft">
                    Save as Draft
                  </option>

                  <option value="published">
                    Publish Now
                  </option>
                </select>
              </div>

              {error &&
                createOpen && (
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
                    setCreateOpen(
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
                    createAssignment
                  }
                  disabled={
                    saving
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  Create Assignment
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() =>
              setSelected(
                null,
              )
            }
          />

          <section className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <ModalHeader
              title={
                selected.title
              }
              onClose={() =>
                setSelected(
                  null,
                )
              }
            />

            <div className="p-6">
              <div className="rounded-xl bg-[#fff7f9] p-4">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  {
                    selected.className
                  }
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-600">
                  {selected.description ||
                    "No description."}
                </p>
              </div>

              <h3 className="mt-6 text-xs font-black text-[#281b1f]">
                Student Submissions
              </h3>

              {detailLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#8f0024]" />
                </div>
              ) : submissions.length ===
                0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-10 text-center">
                  <FileCheck2 className="mx-auto h-6 w-6 text-slate-300" />

                  <p className="mt-3 text-[10px] font-black text-slate-600">
                    No submissions yet
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {submissions.map(
                    (
                      submission,
                    ) => (
                      <div
                        key={
                          submission.id
                        }
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[10px] font-black text-slate-700">
                              {
                                submission.studentName
                              }
                            </p>

                            <p className="mt-1 text-[8px] text-slate-400">
                              {
                                submission.studentEmail
                              }
                            </p>

                            <p className="mt-2 text-[8px] text-slate-400">
                              Submitted{" "}
                              {formatDate(
                                submission.submittedAt,
                              )}
                            </p>
                          </div>

                          <StatusPill
                            status={
                              submission.status
                            }
                          />
                        </div>

                        {submission.text && (
                          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-[9px] leading-5 text-slate-600">
                            {
                              submission.text
                            }
                          </p>
                        )}

                        {submission.fileUrl && (
                          <a
                            href={
                              submission.fileUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-[8px] font-black text-[#8f0024]"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open Submission
                          </a>
                        )}

                        <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr_auto]">
                          <input
                            type="number"
                            min={0}
                            max={
                              selected.maxScore
                            }
                            value={
                              gradeDrafts[
                                submission.id
                              ]?.grade ||
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setGradeDrafts(
                                (
                                  current,
                                ) => ({
                                  ...current,

                                  [submission.id]:
                                    {
                                      grade:
                                        event
                                          .target
                                          .value,

                                      feedback:
                                        current[
                                          submission.id
                                        ]
                                          ?.feedback ||
                                        "",
                                    },
                                }),
                              )
                            }
                            placeholder={`/${selected.maxScore}`}
                            className="h-10 rounded-lg border border-slate-200 px-3 text-xs"
                          />

                          <input
                            value={
                              gradeDrafts[
                                submission.id
                              ]?.feedback ||
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setGradeDrafts(
                                (
                                  current,
                                ) => ({
                                  ...current,

                                  [submission.id]:
                                    {
                                      grade:
                                        current[
                                          submission.id
                                        ]
                                          ?.grade ||
                                        "",

                                      feedback:
                                        event
                                          .target
                                          .value,
                                    },
                                }),
                              )
                            }
                            placeholder="Feedback..."
                            className="h-10 rounded-lg border border-slate-200 px-3 text-xs"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              saveGrade(
                                submission,
                              )
                            }
                            className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-[#8f0024] px-4 text-[8px] font-black text-white"
                          >
                            <Save className="h-3 w-3" />
                            Grade
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
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
  type = "text",
}: {
  label: string;
  value: string;

  onChange: (
    value: string,
  ) => void;

  type?: string;
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
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
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

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-base font-black text-[#281b1f]">
        {value}
      </p>

      <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: string;
}) {
  const styles =
    status ===
      "published" ||
    status ===
      "graded"
      ? "bg-emerald-50 text-emerald-700"
      : status ===
          "closed"
        ? "bg-slate-100 text-slate-600"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[8px] font-black capitalize ${styles}`}
    >
      {status.replace(
        "_",
        " ",
      )}
    </span>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
          Faculty Assignments
        </p>

        <h2 className="mt-1 text-xl font-black text-[#281b1f]">
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyAssignments({
  hasClasses,
}: {
  hasClasses: boolean;
}) {
  return (
    <div className="mt-5 flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
          <BookOpen className="h-7 w-7" />
        </div>

        <h2 className="mt-4 text-sm font-black text-slate-700">
          {hasClasses
            ? "No assignments yet"
            : "No classes assigned"}
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-slate-400">
          {hasClasses
            ? "Create your first assignment for one of your classes."
            : "An administrator must first assign a class to this faculty account."}
        </p>
      </div>
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
