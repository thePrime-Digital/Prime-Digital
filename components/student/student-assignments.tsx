"use client";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  Award,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  LockKeyhole,
  Paperclip,
  Send,
  UploadCloud,
  X,
} from "lucide-react";

type Assignment = {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;

  status: string;

  attachmentUrl: string;
  dueAt: string | null;
  maxScore: number;

  submission: {
    id: string;
    text: string;
    fileUrl: string;
    status: string;
    grade: number | null;
    feedback: string;
    submittedAt: string | null;
  } | null;
};

type AssignmentResponse = {
  assignments: Assignment[];
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "No due date";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "No due date";
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

function remainingTime(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const due =
    new Date(value);

  if (
    Number.isNaN(
      due.getTime(),
    )
  ) {
    return "";
  }

  const difference =
    due.getTime() -
    Date.now();

  if (
    difference <=
    0
  ) {
    return "Deadline passed";
  }

  const days =
    Math.ceil(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        ),
    );

  if (
    days === 1
  ) {
    return "1 day remaining";
  }

  return `${days} days remaining`;
}

function displayFileName(
  value: string,
): string {
  if (!value) {
    return "";
  }

  try {
    const url =
      new URL(value);

    const name =
      decodeURIComponent(
        url.pathname
          .split("/")
          .pop() ||
          "",
      );

    return (
      name ||
      "Attached file"
    );
  } catch {
    return "Attached file";
  }
}

function assignmentStatus(
  assignment: Assignment,
): {
  label: string;
  classes: string;
} {
  /*
   * A graded or submitted assignment remains
   * graded/submitted even if Faculty later closes
   * the assignment itself.
   */
  if (
    assignment.submission
      ?.status ===
      "graded"
  ) {
    return {
      label:
        "Graded",

      classes:
        "bg-emerald-50 text-emerald-700",
    };
  }

  if (
    assignment.submission
  ) {
    const due =
      assignment.dueAt
        ? new Date(
            assignment.dueAt,
          )
        : null;

    const submitted =
      assignment.submission
        .submittedAt
        ? new Date(
            assignment.submission.submittedAt,
          )
        : null;

    if (
      due &&
      submitted &&
      !Number.isNaN(
        due.getTime(),
      ) &&
      !Number.isNaN(
        submitted.getTime(),
      ) &&
      submitted >
        due
    ) {
      return {
        label:
          "Submitted Late",

        classes:
          "bg-orange-50 text-orange-700",
      };
    }

    return {
      label:
        "Submitted",

      classes:
        "bg-blue-50 text-blue-700",
    };
  }

  if (
    assignment.status ===
    "closed"
  ) {
    return {
      label:
        "Closed",

      classes:
        "bg-slate-100 text-slate-600",
    };
  }

  if (
    assignment.dueAt
  ) {
    const due =
      new Date(
        assignment.dueAt,
      );

    if (
      !Number.isNaN(
        due.getTime(),
      ) &&
      due.getTime() <
        Date.now()
    ) {
      return {
        label:
          "Overdue",

        classes:
          "bg-red-50 text-red-700",
      };
    }
  }

  return {
    label:
      "Pending",

    classes:
      "bg-amber-50 text-amber-700",
  };
}

export default function StudentAssignments() {
  const [
    assignments,
    setAssignments,
  ] =
    useState<
      Assignment[]
    >([]);

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
    selected,
    setSelected,
  ] =
    useState<
      Assignment | null
    >(null);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    uploadedFileName,
    setUploadedFileName,
  ] =
    useState("");

  const [
    confirmed,
    setConfirmed,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState({
      text:
        "",

      fileUrl:
        "",
    });

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
              "/api/student/assignments",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            (await response.json()) as
              AssignmentResponse & {
                error?: string;
              };

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to load assignments.",
            );
          }

          setAssignments(
            result.assignments ||
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
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  function openAssignment(
    assignment: Assignment,
  ) {
    setSelected(
      assignment,
    );

    setForm({
      text:
        assignment.submission
          ?.text ||
        "",

      fileUrl:
        assignment.submission
          ?.fileUrl ||
        "",
    });

    setUploadedFileName(
      assignment.submission
        ?.fileUrl
        ? displayFileName(
            assignment.submission.fileUrl,
          )
        : "",
    );

    setConfirmed(
      false,
    );

    setError("");
    setSuccess("");
  }

  function closeAssignment() {
    if (
      submitting ||
      uploading
    ) {
      return;
    }

    setSelected(
      null,
    );

    setConfirmed(
      false,
    );

    setUploadedFileName(
      "",
    );

    setError("");
  }

  async function uploadFile(
    file: File,
  ) {
    setError("");

    if (
      file.size >
      4 * 1024 * 1024
    ) {
      setError(
        "File must be smaller than 4 MB.",
      );

      return;
    }

    setUploading(
      true,
    );

    try {
      const data =
        new FormData();

      data.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/student/assignments/upload",
          {
            method:
              "POST",

            credentials:
              "include",

            body:
              data,
          },
        );

      const payload =
        await response.json();

      if (
        !response.ok ||
        !payload.url
      ) {
        throw new Error(
          payload.error ||
            "Unable to upload file.",
        );
      }

      setForm(
        (
          current,
        ) => ({
          ...current,

          fileUrl:
            String(
              payload.url,
            ),
        }),
      );

      setUploadedFileName(
        String(
          payload.fileName ||
            file.name,
        ),
      );
    } catch (
      uploadError
    ) {
      setError(
        uploadError instanceof
          Error
          ? uploadError.message
          : "Unable to upload file.",
      );
    } finally {
      setUploading(
        false,
      );
    }
  }

  async function submitAssignment() {
    if (!selected) {
      return;
    }

    /*
     * UI protection.
     * Backend also blocks these cases.
     */
    if (
      selected.submission
    ) {
      setError(
        "This assignment has already been submitted. Your submission is final.",
      );

      return;
    }

    if (
      selected.status ===
      "closed"
    ) {
      setError(
        "This assignment has been closed and no longer accepts submissions.",
      );

      return;
    }

    setError("");
    setSuccess("");

    if (
      !form.text.trim() &&
      !form.fileUrl.trim()
    ) {
      setError(
        "Write an answer or attach your assignment file.",
      );

      return;
    }

    if (!confirmed) {
      setError(
        "Please confirm that you want to submit this assignment.",
      );

      return;
    }

    setSubmitting(
      true,
    );

    try {
      const response =
        await fetch(
          `/api/student/assignments/${selected.id}`,
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
                text:
                  form.text,

                fileUrl:
                  form.fileUrl,
              }),
          },
        );

      const payload =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          payload.error ||
            "Unable to submit assignment.",
        );
      }

      setSuccess(
        payload.message ||
          "Assignment submitted successfully. Your submission is now final.",
      );

      setSelected(
        null,
      );

      setConfirmed(
        false,
      );

      setUploadedFileName(
        "",
      );

      await load();
    } catch (
      submitError
    ) {
      setError(
        submitError instanceof
          Error
          ? submitError.message
          : "Unable to submit assignment.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
            Assignments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review, submit and track your academic work.
          </p>
        </header>

        {error &&
          !selected && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {assignments.length ===
        0 ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-7 w-7 text-[#8f0024]" />

            <h2 className="mt-4 text-sm font-black text-slate-900">
              No assignments
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Published and completed assignments for your enrolled classes will appear here.
            </p>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {assignments.map(
              (
                assignment,
              ) => {
                const status =
                  assignmentStatus(
                    assignment,
                  );

                return (
                  <article
                    key={
                      assignment.id
                    }
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8f0024]">
                            {
                              assignment.className
                            }
                          </p>

                          <h2 className="mt-2 text-lg font-black text-[#271a1e]">
                            {
                              assignment.title
                            }
                          </h2>

                          {assignment.description && (
                            <p className="mt-2 line-clamp-2 max-w-3xl text-xs leading-6 text-slate-500">
                              {
                                assignment.description
                              }
                            </p>
                          )}
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1.5 text-[9px] font-black ${status.classes}`}
                        >
                          {
                            status.label
                          }
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[9px] font-bold text-slate-600">
                          <CalendarClock className="h-3.5 w-3.5 text-[#8f0024]" />

                          Due{" "}
                          {formatDate(
                            assignment.dueAt,
                          )}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[9px] font-bold text-slate-600">
                          <Award className="h-3.5 w-3.5 text-[#8f0024]" />

                          {
                            assignment.maxScore
                          }{" "}
                          Marks
                        </span>

                        {assignment.dueAt && (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-[#fff7f8] px-3 py-2 text-[9px] font-bold text-[#8f0024]">
                            <Clock3 className="h-3.5 w-3.5" />

                            {remainingTime(
                              assignment.dueAt,
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <p className="text-[9px] font-semibold text-slate-400">
                        {assignment.submission
                          ? `Submitted ${formatDate(
                              assignment.submission.submittedAt,
                            )}`
                          : assignment.status ===
                              "closed"
                            ? "This assignment is closed."
                            : "No submission yet"}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          openAssignment(
                            assignment,
                          )
                        }
                        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white"
                      >
                        {assignment.submission
                          ?.status ===
                        "graded"
                          ? "View Result"
                          : assignment.submission
                            ? "View Submission"
                            : assignment.status ===
                                "closed"
                              ? "View Assignment"
                              : "Open Assignment"}
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}
      </div>

      {selected && (
        <AssignmentModal
          assignment={
            selected
          }
          form={
            form
          }
          setForm={
            setForm
          }
          uploadedFileName={
            uploadedFileName
          }
          setUploadedFileName={
            setUploadedFileName
          }
          uploading={
            uploading
          }
          submitting={
            submitting
          }
          confirmed={
            confirmed
          }
          setConfirmed={
            setConfirmed
          }
          error={
            error
          }
          uploadFile={
            uploadFile
          }
          submitAssignment={
            submitAssignment
          }
          closeAssignment={
            closeAssignment
          }
        />
      )}
    </main>
  );
}

function AssignmentModal({
  assignment,
  form,
  setForm,
  uploadedFileName,
  setUploadedFileName,
  uploading,
  submitting,
  confirmed,
  setConfirmed,
  error,
  uploadFile,
  submitAssignment,
  closeAssignment,
}: {
  assignment: Assignment;

  form: {
    text: string;
    fileUrl: string;
  };

  setForm:
    Dispatch<
      SetStateAction<{
        text: string;
        fileUrl: string;
      }>
    >;

  uploadedFileName: string;

  setUploadedFileName:
    Dispatch<
      SetStateAction<string>
    >;

  uploading: boolean;
  submitting: boolean;
  confirmed: boolean;

  setConfirmed:
    Dispatch<
      SetStateAction<boolean>
    >;

  error: string;

  uploadFile:
    (
      file: File,
    ) => Promise<void>;

  submitAssignment:
    () => Promise<void>;

  closeAssignment:
    () => void;
}) {
  const status =
    assignmentStatus(
      assignment,
    );

  const graded =
    assignment.submission
      ?.status ===
      "graded";

  const submitted =
    Boolean(
      assignment.submission,
    );

  const closed =
    assignment.status ===
    "closed";

  return (
    <div className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-5">
      <button
        type="button"
        aria-label="Close assignment"
        onClick={
          closeAssignment
        }
        className="absolute inset-0"
      />

      <section className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="shrink-0 bg-[#690019] px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-pink-200">
                  {
                    assignment.className
                  }
                </p>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[8px] font-black">
                  {
                    status.label
                  }
                </span>
              </div>

              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                {
                  assignment.title
                }
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-semibold text-white/70">
                <span>
                  Due{" "}
                  {formatDate(
                    assignment.dueAt,
                  )}
                </span>

                <span>
                  {
                    assignment.maxScore
                  }{" "}
                  Marks
                </span>

                {assignment.dueAt && (
                  <span className="text-pink-200">
                    {remainingTime(
                      assignment.dueAt,
                    )}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={
                uploading ||
                submitting
              }
              onClick={
                closeAssignment
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.85fr_1.35fr]">
            <section>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                  Assignment Instructions
                </p>

                <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-600">
                  {assignment.description ||
                    "No additional instructions were provided."}
                </p>

                {assignment.attachmentUrl && (
                  <a
                    href={
                      assignment.attachmentUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-[#8f0024]"
                  >
                    <Paperclip className="h-4 w-4" />

                    Faculty Attachment

                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Submission Details
                </p>

                <div className="mt-4 space-y-3 text-[10px]">
                  <Detail
                    label="Maximum Score"
                    value={`${assignment.maxScore} marks`}
                  />

                  <Detail
                    label="Deadline"
                    value={formatDate(
                      assignment.dueAt,
                    )}
                  />

                  <Detail
                    label="Status"
                    value={
                      status.label
                    }
                  />
                </div>
              </div>
            </section>

            <section>
              {graded &&
              assignment.submission ? (
                <GradedSubmission
                  assignment={
                    assignment
                  }
                />
              ) : submitted &&
                assignment.submission ? (
                <SubmittedSubmission
                  assignment={
                    assignment
                  }
                />
              ) : closed ? (
                <ClosedAssignment />
              ) : (
                <>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                      Your Submission
                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      Submit your work
                    </h3>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-700">
                        Written Answer
                      </label>

                      <span
                        className={[
                          "text-[9px] font-bold",

                          form.text.length >
                          19000
                            ? "text-red-600"
                            : "text-slate-400",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          form.text.length
                        }{" "}
                        / 20,000
                      </span>
                    </div>

                    <textarea
                      rows={
                        8
                      }
                      maxLength={
                        20000
                      }
                      value={
                        form.text
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            current,
                          ) => ({
                            ...current,

                            text:
                              event.target
                                .value,
                          }),
                        )
                      }
                      placeholder="Write your assignment response here..."
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-4 text-xs leading-6 outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="text-[10px] font-black text-slate-700">
                      Attach Your Work
                    </label>

                    <label
                      className={[
                        "mt-2 flex min-h-[130px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 text-center transition",

                        uploading
                          ? "cursor-not-allowed border-slate-200 bg-slate-50"
                          : "cursor-pointer border-[#8f0024]/20 bg-[#fff8fa] hover:border-[#8f0024]/40 hover:bg-[#fff1f4]",
                      ].join(
                        " ",
                      )}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />

                          <p className="mt-3 text-xs font-black text-slate-700">
                            Uploading your file...
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#8f0024] shadow-sm">
                            <UploadCloud className="h-5 w-5" />
                          </div>

                          <p className="mt-3 text-xs font-black text-slate-800">
                            Choose assignment file
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            PDF, DOCX, PPTX, XLSX, images or ZIP • Max 4 MB
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        disabled={
                          uploading
                        }
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp,.zip"
                        onChange={(
                          event,
                        ) => {
                          const file =
                            event.target
                              .files?.[0];

                          if (
                            file
                          ) {
                            void uploadFile(
                              file,
                            );
                          }

                          event.target.value =
                            "";
                        }}
                        className="hidden"
                      />
                    </label>

                    {uploadedFileName && (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-black text-emerald-800">
                              {
                                uploadedFileName
                              }
                            </p>

                            <p className="mt-0.5 text-[8px] text-emerald-600">
                              Ready for submission
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName(
                              "",
                            );

                            setForm(
                              (
                                current,
                              ) => ({
                                ...current,

                                fileUrl:
                                  "",
                              }),
                            );
                          }}
                          className="text-[9px] font-black text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-[8px] font-black uppercase text-slate-400">
                      Or
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-700">
                      External Link
                      <span className="font-semibold text-slate-400">
                        {" "}
                        (Optional)
                      </span>
                    </label>

                    <div className="relative mt-2">
                      <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="url"
                        value={
                          uploadedFileName
                            ? ""
                            : form.fileUrl
                        }
                        disabled={
                          Boolean(
                            uploadedFileName,
                          )
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              fileUrl:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        placeholder={
                          uploadedFileName
                            ? "Remove uploaded file to use a link"
                            : "Google Drive, OneDrive, GitHub or other https link"
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-xs outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[10px] font-semibold text-red-700">
                      {error}
                    </div>
                  )}

                  <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={
                        confirmed
                      }
                      onChange={(
                        event,
                      ) =>
                        setConfirmed(
                          event.target
                            .checked,
                        )
                      }
                      className="mt-0.5 h-4 w-4 accent-[#8f0024]"
                    />

                    <span className="text-[10px] leading-5 text-slate-600">
                      I understand that once I submit this assignment, it cannot be edited or resubmitted.
                    </span>
                  </label>
                </>
              )}
            </section>
          </div>
        </div>

        <footer className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] font-semibold text-slate-400">
              {graded
                ? "This assignment has been graded. The published grade is final."
                : submitted
                  ? "Your submission is final and cannot be edited or resubmitted."
                  : closed
                    ? "This assignment is closed and no longer accepts submissions."
                    : "Once submitted, your assignment cannot be edited or resubmitted."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  uploading ||
                  submitting
                }
                onClick={
                  closeAssignment
                }
                className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600 disabled:opacity-50"
              >
                Close
              </button>

              {!submitted &&
                !closed && (
                  <button
                    type="button"
                    disabled={
                      uploading ||
                      submitting ||
                      !confirmed
                    }
                    onClick={() =>
                      void submitAssignment()
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white shadow-sm transition hover:bg-[#76001e] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}

                    Submit Assignment
                  </button>
                )}
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

function SubmittedSubmission({
  assignment,
}: {
  assignment: Assignment;
}) {
  const submission =
    assignment.submission;

  if (!submission) {
    return null;
  }

  return (
    <div>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-blue-700">
              Submitted — Final
            </p>

            <p className="mt-1 text-sm font-black text-blue-900">
              Your work has been submitted successfully.
            </p>
          </div>
        </div>

        <p className="mt-4 text-[10px] leading-5 text-blue-800">
          Your submission is locked. It cannot be edited, replaced or resubmitted.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          Your Submission
        </p>

        {submission.text && (
          <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-600">
            {
              submission.text
            }
          </p>
        )}

        {submission.fileUrl && (
          <a
            href={`/api/assignment-submissions/${submission.id}/open`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-[9px] font-black text-white"
          >
            <Paperclip className="h-3.5 w-3.5" />

            Open Submitted File

            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <p className="mt-4 text-[9px] font-semibold text-slate-400">
          Submitted{" "}
          {formatDate(
            submission.submittedAt,
          )}
        </p>
      </div>
    </div>
  );
}

function GradedSubmission({
  assignment,
}: {
  assignment: Assignment;
}) {
  const submission =
    assignment.submission;

  if (!submission) {
    return null;
  }

  return (
    <div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600">
            <Award className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-700">
              Graded — Final
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-900">
              {submission.grade ??
                0}
              {" / "}
              {
                assignment.maxScore
              }
            </p>
          </div>
        </div>

        {submission.feedback && (
          <div className="mt-5 border-t border-emerald-200 pt-4">
            <p className="text-[9px] font-black uppercase text-emerald-700">
              Faculty Feedback
            </p>

            <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-emerald-900">
              {
                submission.feedback
              }
            </p>
          </div>
        )}

        <p className="mt-4 text-[9px] font-semibold text-emerald-700">
          This published grade is final and cannot be changed.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          Your Submission
        </p>

        {submission.text && (
          <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-600">
            {
              submission.text
            }
          </p>
        )}

        {submission.fileUrl && (
          <a
            href={`/api/assignment-submissions/${submission.id}/open`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8f0024] px-4 py-2 text-[9px] font-black text-white"
          >
            <Paperclip className="h-3.5 w-3.5" />

            Open Submitted File

            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <p className="mt-4 text-[9px] font-semibold text-slate-400">
          Submitted{" "}
          {formatDate(
            submission.submittedAt,
          )}
        </p>
      </div>
    </div>
  );
}

function ClosedAssignment() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
        <LockKeyhole className="h-5 w-5" />
      </div>

      <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
        Assignment Closed
      </p>

      <h3 className="mt-2 text-lg font-black text-slate-900">
        Submissions are no longer accepted
      </h3>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        This assignment has been closed by your faculty. You can still review the assignment details, but you cannot submit new work.
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="text-right font-black text-slate-700">
        {value}
      </span>
    </div>
  );
}