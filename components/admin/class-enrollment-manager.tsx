"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  Search,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

type StudentItem = {
  id: string;
  name: string;
  email: string;
  studentLevel: string | null;
  currentClass: string | null;
  degreeName: string | null;
  program: string | null;
  enrolled: boolean;
};

type EnrollmentData = {
  class: {
    id: string;
    name: string;
    capacity: number | null;
    enrolledCount: number;
  };

  students: StudentItem[];
};

type Props = {
  classId: string;
  className: string;
  onClose: () => void;
};

function pretty(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  return value
    .replace(
      /[-_]/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function ClassEnrollmentManager({
  classId,
  className,
  onClose,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<EnrollmentData | null>(
      null,
    );

  const [
    selected,
    setSelected,
  ] =
    useState<string[]>([]);

  const [
    search,
    setSearch,
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

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              `/api/admin/classes/${classId}/students`,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Unable to load students.",
            );
          }

          setData(
            result,
          );

          setSelected(
            [],
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
          setLoading(
            false,
          );
        }
      },
      [
        classId,
      ],
    );

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  const enrolled =
    useMemo(
      () =>
        data?.students.filter(
          (student) =>
            student.enrolled,
        ) || [],
      [
        data,
      ],
    );

  const available =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return (
          data?.students.filter(
            (student) => {
              if (
                student.enrolled
              ) {
                return false;
              }

              if (!query) {
                return true;
              }

              return (
                student.name
                  .toLowerCase()
                  .includes(
                    query,
                  ) ||
                student.email
                  .toLowerCase()
                  .includes(
                    query,
                  ) ||
                (
                  student.currentClass ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    query,
                  ) ||
                (
                  student.program ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    query,
                  )
              );
            },
          ) || []
        );
      },
      [
        data,
        search,
      ],
    );

  function toggle(
    studentId: string,
  ) {
    setSelected(
      (current) =>
        current.includes(
          studentId,
        )
          ? current.filter(
              (id) =>
                id !==
                studentId,
            )
          : [
              ...current,
              studentId,
            ],
    );
  }

  async function enrollSelected() {
    if (
      selected.length ===
      0
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/classes/${classId}/students`,
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
                studentIds:
                  selected,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to enrol students.",
        );
      }

      setSuccess(
        result.message ||
          "Students enrolled successfully.",
      );

      await load();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to enrol students.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  async function removeStudent(
    student: StudentItem,
  ) {
    const confirmed =
      window.confirm(
        `Remove ${student.name} from ${className}?`,
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/classes/${classId}/students`,
          {
            method:
              "DELETE",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                studentId:
                  student.id,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to remove student.",
        );
      }

      setSuccess(
        result.message ||
          "Student removed.",
      );

      await load();
    } catch (
      removeError
    ) {
      setError(
        removeError instanceof
          Error
          ? removeError.message
          : "Unable to remove student.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  const remaining =
    data?.class.capacity ===
      null ||
    data?.class.capacity ===
      undefined
      ? null
      : Math.max(
          0,
          data.class.capacity -
            data.class.enrolledCount,
        );

  return (
    <div className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/45 p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={
          onClose
        }
        className="absolute inset-0"
      />

      <section className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Class Enrollment
            </p>

            <h2 className="mt-1 text-xl font-black text-[#271a1e]">
              {className}
            </h2>

            {data && (
              <p className="mt-2 text-[10px] font-semibold text-slate-500">
                {data.class.enrolledCount} enrolled
                {data.class.capacity !==
                null
                  ? ` / ${data.class.capacity} capacity`
                  : ""}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

            <p className="mt-3 text-xs font-semibold text-slate-500">
              Loading students...
            </p>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                {success}
              </div>
            )}

            <section>
              <div className="flex items-center gap-2">
                <UsersRound className="h-4 w-4 text-[#8f0024]" />

                <h3 className="text-sm font-black text-slate-900">
                  Enrolled Students
                </h3>

                <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[9px] font-black text-[#8f0024]">
                  {enrolled.length}
                </span>
              </div>

              {enrolled.length ===
              0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-7 text-center text-xs font-semibold text-slate-400">
                  No students are enrolled in this class yet.
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  {enrolled.map(
                    (student) => (
                      <div
                        key={
                          student.id
                        }
                        className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <StudentInfo
                          student={
                            student
                          }
                        />

                        <button
                          type="button"
                          disabled={
                            saving
                          }
                          onClick={() =>
                            removeStudent(
                              student,
                            )
                          }
                          className="inline-flex h-8 w-fit items-center gap-1.5 rounded-md border border-red-200 px-3 text-[9px] font-black text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />

                          Remove
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-[#8f0024]" />

                    <h3 className="text-sm font-black text-slate-900">
                      Enroll Students
                    </h3>
                  </div>

                  {remaining !==
                    null && (
                    <p className="mt-1 text-[10px] text-slate-400">
                      {remaining} seat(s) remaining
                    </p>
                  )}
                </div>

                <div className="relative w-full sm:max-w-xs">
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
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-[#8f0024]/40"
                  />
                </div>
              </div>

              {available.length ===
              0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-7 text-center text-xs font-semibold text-slate-400">
                  No available students found.
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  {available.map(
                    (student) => (
                      <label
                        key={
                          student.id
                        }
                        className="flex cursor-pointer items-center gap-4 border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selected.includes(
                              student.id,
                            )
                          }
                          onChange={() =>
                            toggle(
                              student.id,
                            )
                          }
                          disabled={
                            remaining ===
                            0
                          }
                          className="h-4 w-4 accent-[#8f0024]"
                        />

                        <StudentInfo
                          student={
                            student
                          }
                        />
                      </label>
                    ),
                  )}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={
                    saving ||
                    selected.length ===
                      0 ||
                    remaining ===
                      0
                  }
                  onClick={
                    enrollSelected
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-40"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}

                  Enroll Selected
                  {selected.length >
                    0
                    ? ` (${selected.length})`
                    : ""}
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

function StudentInfo({
  student,
}: {
  student: StudentItem;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-black text-slate-800">
        {student.name}
      </p>

      <p className="mt-1 truncate text-[9px] text-slate-400">
        {student.email}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {student.studentLevel && (
          <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[8px] font-black text-[#8f0024]">
            {pretty(
              student.studentLevel,
            )}
          </span>
        )}

        {student.currentClass && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-500">
            {student.currentClass}
          </span>
        )}

        {student.program && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-500">
            {student.program}
          </span>
        )}
      </div>
    </div>
  );
}