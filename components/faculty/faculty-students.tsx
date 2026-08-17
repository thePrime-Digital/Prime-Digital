"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  GraduationCap,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Search,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

type StudentClass = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  classes: StudentClass[];

  attendance:
    | number
    | null;

  averageGrade:
    | number
    | null;
};

export default function FacultyStudents() {
  const [
    students,
    setStudents,
  ] =
    useState<
      Student[]
    >([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    selected,
    setSelected,
  ] =
    useState<
      Student | null
    >(null);

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

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/faculty/students",
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
                "Unable to load students.",
            );
          }

          const loadedStudents =
            data.students ||
            [];

          setStudents(
            loadedStudents,
          );

          setSelected(
            (
              current,
            ) => {
              if (
                current
              ) {
                return (
                  loadedStudents.find(
                    (
                      item:
                        Student,
                    ) =>
                      item.id ===
                      current.id,
                  ) ||
                  loadedStudents[0] ||
                  null
                );
              }

              return (
                loadedStudents[0] ||
                null
              );
            },
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load students.",
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

  const filtered =
    useMemo(
      () => {
        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return students;
        }

        return students.filter(
          (
            student,
          ) =>
            student.name
              .toLowerCase()
              .includes(
                value,
              ) ||
            student.email
              .toLowerCase()
              .includes(
                value,
              ) ||
            student.classes.some(
              (
                item,
              ) =>
                item.name
                  .toLowerCase()
                  .includes(
                    value,
                  ),
            ),
        );
      },
      [
        students,
        search,
      ],
    );

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Workspace
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
              Students
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View students enrolled
              in your assigned classes.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search students..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none focus:border-[#8f0024]/30"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[460px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
          </div>
        ) : students.length ===
          0 ? (
          <div className="mt-5 flex min-h-[450px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                <Users className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-sm font-black text-slate-700">
                No enrolled students
                yet
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Students will appear here once they are enrolled into one of your assigned classes.
              </p>
            </div>
          </div>
        ) : (
          <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
            {/* TABLE */}

            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-[#281b1f]">
                      My Students
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-400">
                      {
                        filtered.length
                      }{" "}
                      student
                      {filtered.length ===
                      1
                        ? ""
                        : "s"}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Student
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Class
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Attendance
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Grade
                      </th>

                      <th className="px-5 py-3 text-right text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map(
                      (
                        student,
                      ) => (
                        <tr
                          key={
                            student.id
                          }
                          onClick={() =>
                            setSelected(
                              student,
                            )
                          }
                          className={[
                            "cursor-pointer border-t border-slate-100 transition hover:bg-[#fffafb]",

                            selected?.id ===
                            student.id
                              ? "bg-[#fff5f7]"
                              : "",
                          ].join(
                            " ",
                          )}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f4] text-[9px] font-black text-[#8f0024]">
                                {student.name
                                  .slice(
                                    0,
                                    2,
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="text-[10px] font-black text-slate-700">
                                  {
                                    student.name
                                  }
                                </p>

                                <p className="mt-1 text-[8px] text-slate-400">
                                  {
                                    student.email
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-[9px] font-semibold text-slate-600">
                            {student.classes[0]
                              ?.name ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            <MetricPill
                              value={
                                student.attendance
                              }
                              suffix="%"
                            />
                          </td>

                          <td className="px-4 py-4">
                            <MetricPill
                              value={
                                student.averageGrade
                              }
                              suffix="%"
                            />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black capitalize text-emerald-700">
                              {
                                student.status
                              }
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* STUDENT DETAIL */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">
              {selected ? (
                <>
                  <div className="border-b border-slate-100 p-5 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f4] text-lg font-black text-[#8f0024]">
                      {selected.name
                        .slice(
                          0,
                          2,
                        )
                        .toUpperCase()}
                    </div>

                    <h2 className="mt-3 text-sm font-black text-[#281b1f]">
                      {selected.name}
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-400">
                      Student Profile
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3">
                      <SmallMetric
                        label="Attendance"
                        value={
                          selected.attendance ===
                          null
                            ? "—"
                            : `${selected.attendance}%`
                        }
                      />

                      <SmallMetric
                        label="Average Grade"
                        value={
                          selected.averageGrade ===
                          null
                            ? "—"
                            : `${selected.averageGrade}%`
                        }
                      />
                    </div>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                      <DetailRow
                        icon={
                          Mail
                        }
                        text={
                          selected.email
                        }
                      />

                      <DetailRow
                        icon={
                          Phone
                        }
                        text={
                          selected.phone ||
                          "No phone"
                        }
                      />

                      <DetailRow
                        icon={
                          BookOpen
                        }
                        text={
                          selected.classes
                            .map(
                              (
                                item,
                              ) =>
                                item.name,
                            )
                            .join(
                              ", ",
                            ) ||
                          "No class"
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8f0024] text-[9px] font-black text-white"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message Student
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <UserRound className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-3 text-[10px] font-semibold text-slate-400">
                    Select a student
                  </p>
                </div>
              )}
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}

function MetricPill({
  value,
  suffix,
}: {
  value:
    | number
    | null;

  suffix: string;
}) {
  return (
    <span className="text-[9px] font-black text-slate-700">
      {value === null
        ? "—"
        : `${value}${suffix}`}
    </span>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-lg font-black text-[#8f0024]">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  text,
}: {
  icon:
    typeof Mail;

  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="min-w-0 break-words pt-2 text-[9px] font-semibold leading-4 text-slate-600">
        {text}
      </p>
    </div>
  );
}
