"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  Plus,
  Video,
  X,
} from "lucide-react";

type FacultyClass = {
  id: string;
  name: string;
  program: string;
  room: string;
  deliveryMode: string;
};

type Session = {
  id: string;
  classId: string;
  title: string;
  startAt: string;
  endAt: string;
  mode: string;
  location: string;
  notes: string;
};

type Props = {
  initialDate: string;
};

const dayNames = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateKey(
  value: Date,
): string {
  const year =
    value.getFullYear();

  const month =
    String(
      value.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      value.getDate(),
    ).padStart(
      2,
      "0",
    );

  return `${year}-${month}-${day}`;
}

function timeLabel(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  );
}

export default function FacultySchedule({
  initialDate,
}: Props) {
  const initial =
    useMemo(
      () =>
        new Date(
          `${initialDate}T00:00:00`,
        ),
      [initialDate],
    );

  const [
    currentMonth,
    setCurrentMonth,
  ] =
    useState(
      () =>
        new Date(
          initial.getFullYear(),
          initial.getMonth(),
          1,
        ),
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      initialDate,
    );

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
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState({
      classId: "",
      title: "",
      date:
        initialDate,
      startTime:
        "10:00",
      endTime:
        "11:00",
      mode:
        "Offline",
      location:
        "",
      notes:
        "",
    });

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/faculty/schedule",
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
                "Unable to load schedule.",
            );
          }

          setClasses(
            data.classes ||
              [],
          );

          setSessions(
            data.sessions ||
              [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load schedule.",
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

  const calendarDays =
    useMemo(() => {
      const year =
        currentMonth.getFullYear();

      const month =
        currentMonth.getMonth();

      const firstDay =
        new Date(
          year,
          month,
          1,
        ).getDay();

      const daysInMonth =
        new Date(
          year,
          month + 1,
          0,
        ).getDate();

      const values:
        (
          | {
              day: number;
              date: string;
            }
          | null
        )[] = [];

      for (
        let index = 0;
        index < firstDay;
        index += 1
      ) {
        values.push(
          null,
        );
      }

      for (
        let day = 1;
        day <=
        daysInMonth;
        day += 1
      ) {
        values.push({
          day,

          date:
            dateKey(
              new Date(
                year,
                month,
                day,
              ),
            ),
        });
      }

      return values;
    }, [currentMonth]);

  const sessionMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          Session[]
        >();

      for (
        const session
        of sessions
      ) {
        const key =
          dateKey(
            new Date(
              session.startAt,
            ),
          );

        const current =
          map.get(
            key,
          ) || [];

        current.push(
          session,
        );

        map.set(
          key,
          current,
        );
      }

      return map;
    }, [sessions]);

  const selectedSessions =
    sessionMap.get(
      selectedDate,
    ) || [];

  function previousMonth() {
    setCurrentMonth(
      (
        current,
      ) =>
        new Date(
          current.getFullYear(),
          current.getMonth() -
            1,
          1,
        ),
    );
  }

  function nextMonth() {
    setCurrentMonth(
      (
        current,
      ) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            1,
          1,
        ),
    );
  }

  function openSessionModal() {
    setForm(
      (
        current,
      ) => ({
        ...current,

        classId:
          classes[0]?.id ||
          "",

        date:
          selectedDate,

        title:
          "",

        location:
          classes[0]?.room ||
          "",

        mode:
          classes[0]
            ?.deliveryMode ||
          "Offline",
      }),
    );

    setError("");
    setSuccess("");
    setModalOpen(
      true,
    );
  }

  function chooseClass(
    classId: string,
  ) {
    const found =
      classes.find(
        (item) =>
          item.id ===
          classId,
      );

    setForm(
      (
        current,
      ) => ({
        ...current,

        classId,

        title:
          found?.name ||
          current.title,

        location:
          found?.room ||
          "",

        mode:
          found
            ?.deliveryMode ||
          "Offline",
      }),
    );
  }

  async function saveSession() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const start =
        new Date(
          `${form.date}T${form.startTime}:00`,
        );

      const end =
        new Date(
          `${form.date}T${form.endTime}:00`,
        );

      const response =
        await fetch(
          "/api/faculty/schedule",
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
                classId:
                  form.classId,

                title:
                  form.title,

                startAt:
                  start.toISOString(),

                endAt:
                  end.toISOString(),

                mode:
                  form.mode,

                location:
                  form.location,

                notes:
                  form.notes,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create session.",
        );
      }

      setModalOpen(
        false,
      );

      setSuccess(
        data.message ||
          "Session scheduled.",
      );

      await load();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to create session.",
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
              My Schedule
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your teaching
              calendar and scheduled
              class sessions.
            </p>
          </div>

          <button
            type="button"
            disabled={
              classes.length ===
              0
            }
            onClick={
              openSessionModal
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Add Class Session
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

        <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_330px]">
          {/* CALENDAR */}

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={
                  previousMonth
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-center">
                <p className="text-sm font-black text-[#281b1f]">
                  {
                    monthNames[
                      currentMonth.getMonth()
                    ]
                  }{" "}
                  {currentMonth.getFullYear()}
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  Select a date to
                  view sessions
                </p>
              </div>

              <button
                type="button"
                onClick={
                  nextMonth
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60">
              {dayNames.map(
                (
                  day,
                ) => (
                  <div
                    key={
                      day
                    }
                    className="px-2 py-3 text-center text-[8px] font-black uppercase tracking-wider text-slate-400"
                  >
                    {day}
                  </div>
                ),
              )}
            </div>

            {loading ? (
              <div className="flex min-h-[440px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8f0024]" />
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {calendarDays.map(
                  (
                    item,
                    index,
                  ) =>
                    item ? (
                      <button
                        key={
                          item.date
                        }
                        type="button"
                        onClick={() =>
                          setSelectedDate(
                            item.date,
                          )
                        }
                        className={[
                          "relative min-h-[88px] border-b border-r border-slate-100 p-2 text-left transition hover:bg-[#fffafb]",

                          selectedDate ===
                          item.date
                            ? "bg-[#fff5f7]"
                            : "",
                        ].join(
                          " ",
                        )}
                      >
                        <span
                          className={[
                            "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black",

                            selectedDate ===
                            item.date
                              ? "bg-[#8f0024] text-white"
                              : "text-slate-600",
                          ].join(
                            " ",
                          )}
                        >
                          {
                            item.day
                          }
                        </span>

                        {(sessionMap.get(
                          item.date,
                        ) || [])
                          .slice(
                            0,
                            2,
                          )
                          .map(
                            (
                              session,
                            ) => (
                              <div
                                key={
                                  session.id
                                }
                                className="mt-1 truncate rounded bg-[#fff1f4] px-1.5 py-1 text-[7px] font-bold text-[#8f0024]"
                              >
                                {timeLabel(
                                  session.startAt,
                                )}
                              </div>
                            ),
                          )}

                        {(sessionMap.get(
                          item.date,
                        ) || [])
                          .length >
                          2 && (
                          <p className="mt-1 text-[7px] font-bold text-slate-400">
                            +
                            {(sessionMap.get(
                              item.date,
                            ) || [])
                              .length -
                              2}{" "}
                            more
                          </p>
                        )}
                      </button>
                    ) : (
                      <div
                        key={
                          `blank-${index}`
                        }
                        className="min-h-[88px] border-b border-r border-slate-100 bg-slate-50/30"
                      />
                    ),
                )}
              </div>
            )}
          </article>

          {/* SELECTED DAY */}

          <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                Selected Day
              </p>

              <h2 className="mt-1 text-sm font-black text-[#281b1f]">
                {selectedDate}
              </h2>
            </div>

            {selectedSessions.length ===
            0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <p className="mt-4 text-[10px] font-black text-slate-700">
                  No classes scheduled
                </p>

                <p className="mt-2 text-[9px] leading-4 text-slate-400">
                  Add a session for
                  this date.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedSessions.map(
                  (
                    session,
                  ) => (
                    <div
                      key={
                        session.id
                      }
                      className="p-5"
                    >
                      <p className="text-[10px] font-black text-slate-800">
                        {
                          session.title
                        }
                      </p>

                      <div className="mt-3 space-y-2">
                        <Info
                          icon={
                            Clock3
                          }
                          text={`${timeLabel(
                            session.startAt,
                          )} - ${timeLabel(
                            session.endAt,
                          )}`}
                        />

                        <Info
                          icon={
                            session.mode
                              .toLowerCase()
                              .includes(
                                "online",
                              )
                              ? Video
                              : MapPin
                          }
                          text={
                            session.location ||
                            session.mode ||
                            "Class session"
                          }
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </aside>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close"
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
                  Faculty Schedule
                </p>

                <h2 className="mt-1 text-xl font-black text-[#281b1f]">
                  Add Class Session
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
                    chooseClass(
                      event.target
                        .value,
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
                <Label>
                  Session Title
                </Label>

                <input
                  value={
                    form.title
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
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
                  placeholder="e.g. Calculus Revision"
                />
              </div>

              <div>
                <Label>
                  Date
                </Label>

                <input
                  type="date"
                  value={
                    form.date
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        date:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
                />
              </div>

              <div>
                <Label>
                  Mode
                </Label>

                <select
                  value={
                    form.mode
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        mode:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                >
                  <option value="Offline">
                    Offline
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>
                </select>
              </div>

              <div>
                <Label>
                  Start Time
                </Label>

                <input
                  type="time"
                  value={
                    form.startTime
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        startTime:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
                />
              </div>

              <div>
                <Label>
                  End Time
                </Label>

                <input
                  type="time"
                  value={
                    form.endTime
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        endTime:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>
                  Room / Meeting Link
                </Label>

                <input
                  value={
                    form.location
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,

                        location:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
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
                    saveSession
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

                  Save Session
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
    <label className="mb-2 block text-[10px] font-black text-slate-700">
      {children}
    </label>
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

      <span>
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
