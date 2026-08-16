"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Bell,
  Building2,
  Loader2,
  Save,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

type SettingsData = {
  schoolName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  admissionsOpen: boolean;
  facultySignupOpen: boolean;
  clientSignupOpen: boolean;
  announcement: string;
};

const defaults: SettingsData = {
  schoolName: "Prime Digital School",

  supportEmail: "",

  supportPhone: "",

  timezone: "Asia/Kolkata",

  admissionsOpen: true,

  facultySignupOpen: true,

  clientSignupOpen: true,

  announcement: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>(defaults);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",

        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load settings.");
      }

      setSettings({
        ...defaults,
        ...data.settings,
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save settings.");
      }

      setSuccess(data.message || "Settings saved.");

      if (data.settings) {
        setSettings((current) => ({
          ...current,
          ...data.settings,
        }));
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
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
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#271a1e]">Settings</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage core Prime Digital School platform configuration.
          </p>
        </div>

        {error && <Alert error>{error}</Alert>}

        {success && <Alert>{success}</Alert>}

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Section
              icon={Building2}
              title="Institute Information"
              description="Basic information used by the platform."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="School Name"
                  value={settings.schoolName}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,

                      schoolName: value,
                    }))
                  }
                />

                <Input
                  label="Support Email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,

                      supportEmail: value,
                    }))
                  }
                />

                <Input
                  label="Support Phone"
                  value={settings.supportPhone}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,

                      supportPhone: value,
                    }))
                  }
                />

                <div>
                  <label className="mb-2 block text-[10px] font-black text-slate-700">
                    Default Timezone
                  </label>

                  <select
                    value={settings.timezone}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,

                        timezone: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                  >
                    <option value="Asia/Kolkata">India — Asia/Kolkata</option>

                    <option value="Europe/London">UK — Europe/London</option>

                    <option value="America/New_York">
                      USA — America/New_York
                    </option>

                    <option value="Asia/Dubai">UAE — Asia/Dubai</option>
                  </select>
                </div>
              </div>
            </Section>

            <Section
              icon={Users}
              title="Access & Registration"
              description="Control which public application and registration flows are currently available."
            >
              <div className="grid gap-3 lg:grid-cols-3">
                <Toggle
                  title="Admissions"
                  description="Allow students to submit new admission applications."
                  checked={settings.admissionsOpen}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      admissionsOpen: checked,
                    }))
                  }
                />

                <Toggle
                  title="Faculty Signup"
                  description="Allow new faculty members to register for an account."
                  checked={settings.facultySignupOpen}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      facultySignupOpen: checked,
                    }))
                  }
                />

                <Toggle
                  title="Client Signup"
                  description="Allow Prime Digital Solutions clients to register."
                  checked={settings.clientSignupOpen}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      clientSignupOpen: checked,
                    }))
                  }
                />
              </div>
            </Section>

            <Section
              icon={Bell}
              title="Platform Announcement"
              description="Save an administrative announcement message."
            >
              <textarea
                value={settings.announcement}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,

                    announcement: event.target.value,
                  }))
                }
                rows={5}
                maxLength={500}
                placeholder="Enter platform announcement..."
                className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs leading-5 outline-none focus:border-[#8f0024]/40"
              />

              <p className="mt-2 text-right text-[9px] text-slate-400">
                {settings.announcement.length}/500
              </p>
            </Section>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#8f0024] px-6 text-xs font-black text-white disabled:opacity-50"
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
            <div className="rounded-xl bg-[#690019] p-5 text-white shadow-sm">
              <Settings className="h-5 w-5" />

              <h2 className="mt-4 text-sm font-black">
                Platform Configuration
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-white/65">
                These values are stored centrally in MongoDB so the platform can
                use one shared configuration source.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#8f0024]" />

              <h2 className="mt-4 text-xs font-black text-slate-700">
                Admin Protected
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Only an authenticated administrator can read or modify these
                settings.
              </p>
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
  icon: typeof Settings;

  title: string;
  description: string;

  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-xs font-black text-slate-800">{title}</h2>

          <p className="mt-1 text-[9px] text-slate-400">{description}</p>
        </div>
      </div>

      <div className="pt-5">{children}</div>
    </section>
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
  onChange: (value: string) => void;
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
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40"
      />
    </div>
  );
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-[#fcfcfd] p-4 transition hover:border-[#8f0024]/20 hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-black text-slate-800">{title}</p>

            <span
              className={[
                "rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider",

                checked
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {checked ? "Open" : "Closed"}
            </span>
          </div>

          <p className="mt-2 min-h-[34px] text-[9px] leading-4 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[9px] font-bold text-slate-400">
          {checked ? "Currently accepting" : "Currently disabled"}
        </span>

        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={[
            "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",

            checked ? "bg-[#8f0024]" : "bg-slate-300",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",

              checked ? "left-6" : "left-1",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;

  children: React.ReactNode;
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
