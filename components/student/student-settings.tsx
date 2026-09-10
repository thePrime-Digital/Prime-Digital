"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  LockKeyhole,
  Loader2,
  Save,
  Settings,
} from "lucide-react";

type SettingsUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentLevel: string | null;
  currentClass: string | null;
  degreeName: string | null;
  program: string | null;
};

function levelLabel(
  value: string | null,
) {
  if (
    value ===
    "foundation"
  ) {
    return "Foundation";
  }

  if (
    value ===
    "advanced"
  ) {
    return "Advanced";
  }

  if (
    value ===
    "college"
  ) {
    return "College";
  }

  return "Not assigned";
}

export default function StudentSettings() {
  const [
    user,
    setUser,
  ] =
    useState<SettingsUser | null>(
      null,
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
    form,
    setForm,
  ] =
    useState({
      name:
        "",

      phone:
        "",

      newPassword:
        "",

      confirmPassword:
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
              "/api/student/settings",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to load settings.",
            );
          }

          setUser(
            result.user,
          );

          setForm({
            name:
              result.user.name ||
              "",

            phone:
              result.user.phone ||
              "",

            newPassword:
              "",

            confirmPassword:
              "",
          });
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load settings.",
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
    load();
  }, [load]);

  async function save() {
    setError("");
    setSuccess("");

    if (
      form.newPassword &&
      form.newPassword !==
        form.confirmPassword
    ) {
      setError(
        "The new passwords do not match.",
      );

      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/student/settings",
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
                name:
                  form.name,

                phone:
                  form.phone,

                newPassword:
                  form.newPassword ||
                  undefined,
              }),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "Unable to save settings.",
        );
      }

      setUser(
        result.user,
      );

      setSuccess(
        result.message ||
          "Profile updated successfully.",
      );

      setForm(
        (
          current,
        ) => ({
          ...current,

          newPassword:
            "",

          confirmPassword:
            "",
        }),
      );
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Unable to save settings.",
      );
    } finally {
      setSaving(
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

  if (!user) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-xs font-semibold text-red-700">
          {error ||
            "Unable to load your profile."}
        </div>
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal account information and password.
          </p>
        </header>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
              <Settings className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                You can update your name and phone number.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full Name"
              value={
                form.name
              }
              onChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    name:
                      value,
                  }),
                )
              }
            />

            <Field
              label="Phone Number"
              value={
                form.phone
              }
              onChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    phone:
                      value,
                  }),
                )
              }
              type="tel"
            />

            <ReadOnly
              label="Email"
              value={
                user.email
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900">
            Academic Information
          </h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Academic information is controlled by Prime Digital School administration.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ReadOnly
              label="Student Level"
              value={levelLabel(
                user.studentLevel,
              )}
            />

            <ReadOnly
              label="Class / Year"
              value={
                user.currentClass ||
                "Not assigned"
              }
            />

            {user.degreeName && (
              <ReadOnly
                label="Degree"
                value={
                  user.degreeName
                }
              />
            )}

            <ReadOnly
              label="Program"
              value={
                user.program ||
                "Not assigned"
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-[#8f0024]" />

            <div>
              <h2 className="text-sm font-black text-slate-900">
                Change Password
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Leave both fields blank if you do not want to change your password.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label="New Password"
              value={
                form.newPassword
              }
              onChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    newPassword:
                      value,
                  }),
                )
              }
              type="password"
            />

            <Field
              label="Confirm New Password"
              value={
                form.confirmPassword
              }
              onChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    confirmPassword:
                      value,
                  }),
                )
              }
              type="password"
            />
          </div>
        </section>

        <button
          type="button"
          disabled={
            saving
          }
          onClick={
            save
          }
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#8f0024] px-6 text-xs font-black text-white disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          Save Changes
        </button>
      </div>
    </main>
  );
}

function Field({
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
      <label className="mb-2 block text-[10px] font-black text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event
              .target
              .value,
          )
        }
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
      />
    </div>
  );
}

function ReadOnly({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 min-h-11 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-700">
        {value}
      </div>
    </div>
  );
}