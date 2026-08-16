"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Bell,
  Building2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type SettingsData = {
  department: string;
  bio: string;
  officeHours: string;
  emailNotifications: boolean;
  messageNotifications: boolean;
  classReminders: boolean;
};

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  status: string;
};

export default function FacultySettings() {
  const [
    profile,
    setProfile,
  ] =
    useState<
      ProfileData
    >({
      name: "",
      email: "",
      phone: "",
      status: "",
    });

  const [
    settings,
    setSettings,
  ] =
    useState<
      SettingsData
    >({
      department: "",
      bio: "",
      officeHours: "",
      emailNotifications:
        true,
      messageNotifications:
        true,
      classReminders:
        true,
    });

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

        try {
          const response =
            await fetch(
              "/api/faculty/settings",
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
                "Unable to load settings.",
            );
          }

          setProfile(
            payload.profile,
          );

          setSettings(
            payload.settings,
          );
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
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/faculty/settings",
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
                phone:
                  profile.phone,

                ...settings,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to save settings.",
        );
      }

      setSuccess(
        payload.message,
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
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Faculty Profile
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#281b1f]">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your faculty profile
            and dashboard preferences.
          </p>
        </div>

        {error && (
          <Alert error>
            {error}
          </Alert>
        )}

        {success && (
          <Alert>
            {success}
          </Alert>
        )}

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <Section
              icon={
                UserRound
              }
              title="Profile Information"
              description="Your account identity and faculty information."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadOnly
                  label="Name"
                  value={
                    profile.name
                  }
                />

                <ReadOnly
                  label="Email"
                  value={
                    profile.email
                  }
                />

                <Input
                  label="Phone"
                  value={
                    profile.phone
                  }
                  onChange={(
                    value,
                  ) =>
                    setProfile(
                      (
                        current,
                      ) => ({
                        ...current,

                        phone:
                          value,
                      }),
                    )
                  }
                />

                <Input
                  label="Department"
                  value={
                    settings.department
                  }
                  onChange={(
                    value,
                  ) =>
                    setSettings(
                      (
                        current,
                      ) => ({
                        ...current,

                        department:
                          value,
                      }),
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Office Hours"
                    value={
                      settings.officeHours
                    }
                    onChange={(
                      value,
                    ) =>
                      setSettings(
                        (
                          current,
                        ) => ({
                          ...current,

                          officeHours:
                            value,
                        }),
                      )
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Faculty Bio
                  </label>

                  <textarea
                    rows={5}
                    maxLength={1000}
                    value={
                      settings.bio
                    }
                    onChange={(
                      event,
                    ) =>
                      setSettings(
                        (
                          current,
                        ) => ({
                          ...current,

                          bio:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs leading-5 outline-none"
                  />
                </div>
              </div>
            </Section>

            <Section
              icon={Bell}
              title="Notification Preferences"
              description="Choose which faculty alerts you want enabled."
            >
              <div className="space-y-3">
                <Toggle
                  title="Email Notifications"
                  text="Receive important platform updates by email."
                  value={
                    settings.emailNotifications
                  }
                  onChange={(
                    value,
                  ) =>
                    setSettings(
                      (
                        current,
                      ) => ({
                        ...current,

                        emailNotifications:
                          value,
                      }),
                    )
                  }
                />

                <Toggle
                  title="Message Notifications"
                  text="Receive alerts when a new message arrives."
                  value={
                    settings.messageNotifications
                  }
                  onChange={(
                    value,
                  ) =>
                    setSettings(
                      (
                        current,
                      ) => ({
                        ...current,

                        messageNotifications:
                          value,
                      }),
                    )
                  }
                />

                <Toggle
                  title="Class Reminders"
                  text="Receive reminders for upcoming class sessions."
                  value={
                    settings.classReminders
                  }
                  onChange={(
                    value,
                  ) =>
                    setSettings(
                      (
                        current,
                      ) => ({
                        ...current,

                        classReminders:
                          value,
                      }),
                    )
                  }
                />
              </div>
            </Section>

            <button
              type="button"
              onClick={
                save
              }
              disabled={
                saving
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#8f0024] px-6 text-[10px] font-black text-white disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Settings
            </button>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-[#72001c] p-5 text-white">
              <Building2 className="h-5 w-5" />

              <h2 className="mt-4 text-sm font-black">
                Prime Digital School
              </h2>

              <p className="mt-2 text-[9px] leading-5 text-white/65">
                Faculty workspace profile
                and teaching preferences.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#8f0024]" />

              <p className="mt-4 text-[10px] font-black text-slate-700">
                Account Status
              </p>

              <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-black capitalize text-emerald-700">
                {
                  profile.status
                }
              </span>

              <div className="mt-5 flex items-center gap-2 text-[8px] text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                {
                  profile.email
                }
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon:
    typeof UserRound;

  title: string;
  description: string;

  children:
    ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-[11px] font-black text-slate-700">
            {title}
          </h2>

          <p className="mt-1 text-[8px] text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-5">
        {children}
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;

  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
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
      <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="flex h-11 items-center rounded-lg border border-slate-100 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
        {value}
      </div>
    </div>
  );
}

function Toggle({
  title,
  text,
  value,
  onChange,
}: {
  title: string;
  text: string;
  value: boolean;

  onChange: (
    value: boolean,
  ) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-100 p-4">
      <div>
        <p className="text-[10px] font-black text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-[8px] text-slate-400">
          {text}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(
            !value,
          )
        }
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",

          value
            ? "bg-[#8f0024]"
            : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",

            value
              ? "left-6"
              : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;
  children:
    ReactNode;
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
