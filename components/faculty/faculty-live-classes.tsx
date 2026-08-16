"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Link2,
  Loader2,
  Play,
  Plus,
  Radio,
  Square,
  Video,
  X,
  XCircle,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
};

type Session = {
  id: string;
  classId: string;
  className: string;
  title: string;

  startAt:
    | string
    | null;

  endAt:
    | string
    | null;

  meetingUrl: string;
  recordingUrl: string;
  notes: string;
  status: string;
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

export default function FacultyLiveClasses() {
  const [
    classes,
    setClasses,
  ] =
    useState<
      FacultyClass[]
    >([]);

  const [
    sessions,
    setSessions,
  ] =
    useState<
      Session[]
    >([]);

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
    recordingSession,
    setRecordingSession,
  ] =
    useState<
      Session | null
    >(null);

  const [
    recordingUrl,
    setRecordingUrl,
  ] =
    useState("");

  const [
    form,
    setForm,
  ] =
    useState({
      classId: "",
      title: "",
      startAt: "",
      endAt: "",
      meetingUrl: "",
      notes: "",
    });

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/faculty/live-classes",
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
                "Unable to load live classes.",
            );
          }

          setClasses(
            payload.classes ||
              [],
          );

          setSessions(
            payload.sessions ||
              [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load live classes.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  const now =
    new Date();

  const upcoming =
    useMemo(
      () =>
        sessions
          .filter(
            (session) =>
              session.status ===
                "scheduled" ||
              session.status ===
                "live",
          )
          .sort(
            (a, b) =>
              new Date(
                a.startAt ||
                  0,
              ).getTime() -
              new Date(
                b.startAt ||
                  0,
              ).getTime(),
          ),
      [sessions],
    );

  const past =
    useMemo(
      () =>
        sessions
          .filter(
            (session) =>
              session.status ===
                "completed" ||
              session.status ===
                "cancelled",
          )
          .sort(
            (a, b) =>
              new Date(
                b.startAt ||
                  0,
              ).getTime() -
              new Date(
                a.startAt ||
                  0,
              ).getTime(),
          ),
      [sessions],
    );

  const primary =
    upcoming[0] ||
    null;

  function openCreate() {
    const start =
      new Date();

    start.setHours(
      start.getHours() +
        1,
    );

    start.setMinutes(
      0,
      0,
      0,
    );

    const end =
      new Date(
        start,
      );

    end.setHours(
      end.getHours() +
        1,
    );

    function localValue(
      value: Date,
    ) {
      const offset =
        value.getTimezoneOffset();

      const local =
        new Date(
          value.getTime() -
            offset *
              60000,
        );

      return local
        .toISOString()
        .slice(0, 16);
    }

    setForm({
      classId:
        classes[0]?.id ||
        "",

      title:
        classes[0]?.name ||
        "",

      startAt:
        localValue(
          start,
        ),

      endAt:
        localValue(
          end,
        ),

      meetingUrl: "",
      notes: "",
    });

    setError("");
    setModalOpen(
      true,
    );
  }

  async function createSession() {
    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/faculty/live-classes",
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

                startAt:
                  new Date(
                    form.startAt,
                  ).toISOString(),

                endAt:
                  new Date(
                    form.endAt,
                  ).toISOString(),
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to schedule live class.",
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
          : "Unable to schedule live class.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function action(
    session:
      Session,

    nextAction:
      | "start"
      | "complete"
      | "cancel",
  ) {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/faculty/live-classes/${session.id}`,
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
                  nextAction,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to update live class.",
        );
      }

      setSuccess(
        payload.message,
      );

      await load();

      if (
        nextAction ===
          "start" &&
        session.meetingUrl
      ) {
        window.open(
          session.meetingUrl,
          "_blank",
          "noopener,noreferrer",
        );
      }
    } catch (
      actionError
    ) {
      setError(
        actionError instanceof
          Error
          ? actionError.message
          : "Unable to update live class.",
      );
    }
  }

  async function saveRecording() {
    if (
      !recordingSession
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/faculty/live-classes/${recordingSession.id}`,
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
                  "recording",

                recordingUrl,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to save recording.",
        );
      }

      setRecordingSession(
        null,
      );

      setRecordingUrl(
        "",
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
          : "Unable to save recording.",
      );
    } finally {
      setSaving(false);
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
              Live Classes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Schedule, launch and
              manage online teaching
              sessions.
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
            Schedule Live Class
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

        {loading ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : (
          <>
            <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {primary ? (
                  <>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider",

                              primary.status ===
                              "live"
                                ? "bg-red-50 text-red-700"
                                : "bg-[#fff1f4] text-[#8f0024]",
                            ].join(" ")}
                          >
                            {primary.status ===
                            "live"
                              ? "Live Now"
                              : "Upcoming"}
                          </span>

                          {primary.status ===
                            "live" && (
                            <Radio className="h-4 w-4 animate-pulse text-red-600" />
                          )}
                        </div>

                        <h2 className="mt-4 text-xl font-black text-[#281b1f]">
                          {
                            primary.title
                          }
                        </h2>

                        <p className="mt-1 text-[10px] font-bold text-[#8f0024]">
                          {
                            primary.className
                          }
                        </p>

                        <div className="mt-5 space-y-2">
                          <Info
                            icon={
                              CalendarDays
                            }
                            text={
                              formatDate(
                                primary.startAt,
                              )
                            }
                          />

                          <Info
                            icon={
                              Clock3
                            }
                            text={`Ends ${formatDate(
                              primary.endAt,
                            )}`}
                          />

                          <Info
                            icon={
                              Link2
                            }
                            text={
                              primary.meetingUrl
                                ? "Meeting link ready"
                                : "No meeting link"
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {primary.status ===
                          "scheduled" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                action(
                                  primary,
                                  "start",
                                )
                              }
                              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-[9px] font-black text-white"
                            >
                              <Play className="h-4 w-4" />
                              Start Now
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                action(
                                  primary,
                                  "cancel",
                                )
                              }
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-[9px] font-black text-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </button>
                          </>
                        )}

                        {primary.status ===
                          "live" && (
                          <button
                            type="button"
                            onClick={() =>
                              action(
                                primary,
                                "complete",
                              )
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-5 text-[9px] font-black text-white"
                          >
                            <Square className="h-3.5 w-3.5" />
                            End Class
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                      <Video className="h-7 w-7" />
                    </div>

                    <h2 className="mt-4 text-sm font-black text-slate-700">
                      No upcoming live
                      classes
                    </h2>

                    <p className="mt-2 text-[10px] text-slate-400">
                      Schedule a live
                      class when you are
                      ready.
                    </p>
                  </div>
                )}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black text-[#281b1f]">
                  Pre-Class Checklist
                </h2>

                <p className="mt-1 text-[9px] text-slate-400">
                  Quick readiness check
                </p>

                <div className="mt-5 space-y-3">
                  <Checklist
                    ready={
                      Boolean(
                        primary,
                      )
                    }
                    text="Class selected"
                  />

                  <Checklist
                    ready={
                      Boolean(
                        primary?.meetingUrl,
                      )
                    }
                    text="Meeting link ready"
                  />

                  <Checklist
                    ready={
                      Boolean(
                        primary?.startAt,
                      )
                    }
                    text="Schedule confirmed"
                  />

                  <Checklist
                    ready={
                      Boolean(
                        primary &&
                        primary.status !==
                          "cancelled",
                      )
                    }
                    text="Session active"
                  />
                </div>

                {primary?.meetingUrl && (
                  <a
                    href={
                      primary.meetingUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#8f0024]/20 text-[9px] font-black text-[#8f0024]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Meeting Link
                  </a>
                )}
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Later & Upcoming
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {upcoming
                    .slice(
                      primary
                        ? 1
                        : 0,
                      6,
                    )
                    .map(
                      (
                        session,
                      ) => (
                        <div
                          key={
                            session.id
                          }
                          className="p-5"
                        >
                          <p className="text-[10px] font-black text-slate-700">
                            {
                              session.title
                            }
                          </p>

                          <p className="mt-1 text-[8px] font-bold text-[#8f0024]">
                            {
                              session.className
                            }
                          </p>

                          <p className="mt-2 text-[8px] text-slate-400">
                            {formatDate(
                              session.startAt,
                            )}
                          </p>
                        </div>
                      ),
                    )}

                  {upcoming.length <=
                    (primary
                      ? 1
                      : 0) && (
                    <div className="p-8 text-center text-[9px] text-slate-400">
                      No additional sessions.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-black text-[#281b1f]">
                    Past Classes &
                    Recordings
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {past
                    .slice(
                      0,
                      8,
                    )
                    .map(
                      (
                        session,
                      ) => (
                        <div
                          key={
                            session.id
                          }
                          className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-black text-slate-700">
                              {
                                session.title
                              }
                            </p>

                            <p className="mt-1 text-[8px] text-slate-400">
                              {formatDate(
                                session.startAt,
                              )}
                            </p>
                          </div>

                          {session.recordingUrl ? (
                            <a
                              href={
                                session.recordingUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#fff1f4] px-3 text-[8px] font-black text-[#8f0024]"
                            >
                              <Play className="h-3 w-3" />
                              Recording
                            </a>
                          ) : session.status ===
                            "completed" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setRecordingSession(
                                  session,
                                );

                                setRecordingUrl(
                                  "",
                                );
                              }}
                              className="h-8 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                            >
                              Add Recording
                            </button>
                          ) : (
                            <span className="text-[8px] font-bold capitalize text-slate-400">
                              {
                                session.status
                              }
                            </span>
                          )}
                        </div>
                      ),
                    )}

                  {past.length ===
                    0 && (
                    <div className="p-8 text-center text-[9px] text-slate-400">
                      No past sessions.
                    </div>
                  )}
                </div>
              </article>
            </section>
          </>
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
            <ModalHeader
              title="Schedule Live Class"
              onClose={() =>
                setModalOpen(
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
                  ) => {
                    const value =
                      event.target
                        .value;

                    const found =
                      classes.find(
                        (
                          item,
                        ) =>
                          item.id ===
                          value,
                      );

                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        classId:
                          value,

                        title:
                          found?.name ||
                          current.title,
                      }),
                    );
                  }}
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
                  label="Session Title"
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

              <Input
                label="Start"
                type="datetime-local"
                value={
                  form.startAt
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      startAt:
                        value,
                    }),
                  )
                }
              />

              <Input
                label="End"
                type="datetime-local"
                value={
                  form.endAt
                }
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      endAt:
                        value,
                    }),
                  )
                }
              />

              <div className="sm:col-span-2">
                <Input
                  label="Meeting URL"
                  value={
                    form.meetingUrl
                  }
                  onChange={(
                    value,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        meetingUrl:
                          value,
                      }),
                    )
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Label>
                  Notes
                </Label>

                <textarea
                  rows={4}
                  value={
                    form.notes
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        notes:
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
                    createSession
                  }
                  disabled={
                    saving ||
                    !form.classId
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:bg-slate-300"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  Schedule Class
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {recordingSession && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() =>
              setRecordingSession(
                null,
              )
            }
          />

          <section className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <ModalHeader
              title="Add Recording"
              onClose={() =>
                setRecordingSession(
                  null,
                )
              }
            />

            <div className="p-6">
              <Input
                label="Recording URL"
                value={
                  recordingUrl
                }
                onChange={
                  setRecordingUrl
                }
              />

              <button
                type="button"
                onClick={
                  saveRecording
                }
                disabled={
                  saving ||
                  !recordingUrl.trim()
                }
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8f0024] text-[10px] font-black text-white disabled:bg-slate-300"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Save Recording
              </button>
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
          Live Teaching
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

function Info({
  icon: Icon,
  text,
}: {
  icon:
    typeof Clock3;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[9px] text-slate-500">
      <Icon className="h-3.5 w-3.5 text-[#8f0024]" />
      {text}
    </div>
  );
}

function Checklist({
  ready,
  text,
}: {
  ready: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
      {ready ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      ) : (
        <XCircle className="h-4 w-4 text-slate-300" />
      )}

      <span className="text-[9px] font-bold text-slate-600">
        {text}
      </span>
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
