"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";

type UserRole =
  | "student"
  | "faculty"
  | "client"
  | "admin";

type UserStatus =
  | "active"
  | "pending"
  | "blocked";

type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  isCurrentAdmin?: boolean;
};

type Counts = {
  total: number;
  students: number;
  faculty: number;
  clients: number;
  admins: number;
  active: number;
  pending: number;
  blocked: number;
};

type SummaryCounts = {
  total: number;
  active: number;
  pending: number;
  blocked: number;
};

type AccountDirectoryProps = {
  initialRole?: UserRole | "all";
  lockRole?: boolean;
  title?: string;
  description?: string;
};

const emptyCounts: Counts = {
  total: 0,
  students: 0,
  faculty: 0,
  clients: 0,
  admins: 0,
  active: 0,
  pending: 0,
  blocked: 0,
};

const emptySummary: SummaryCounts = {
  total: 0,
  active: 0,
  pending: 0,
  blocked: 0,
};

function roleLabel(
  role: UserRole,
): string {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "faculty") {
    return "Faculty";
  }

  if (role === "client") {
    return "Client";
  }

  return "Student";
}

function statusClasses(
  status: UserStatus,
): string {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (status === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-red-50 text-red-700 border-red-100";
}

export default function AccountDirectory({
  initialRole = "all",
  lockRole = false,
  title = "Account Directory",
  description =
    "Manage registered accounts across Prime Digital School.",
}: AccountDirectoryProps) {
  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [counts, setCounts] =
    useState<Counts>(emptyCounts);

  const [summary, setSummary] =
    useState<SummaryCounts>(
      emptySummary,
    );

  const [role, setRole] =
    useState<UserRole | "all">(
      initialRole,
    );

  const [status, setStatus] =
    useState<UserStatus | "all">(
      "all",
    );

  const [search, setSearch] =
    useState("");

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [page, setPage] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingAccount,
    setEditingAccount,
  ] = useState<Account | null>(
    null,
  );

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",

      role:
        initialRole !== "all"
          ? initialRole
          : ("student" as UserRole),

      status:
        initialRole === "faculty"
          ? ("pending" as UserStatus)
          : ("active" as UserStatus),

      password: "",
    });

  const loadAccounts =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          if (role !== "all") {
            params.set(
              "role",
              role,
            );
          }

          if (
            status !== "all"
          ) {
            params.set(
              "status",
              status,
            );
          }

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          params.set(
            "page",
            String(page),
          );

          params.set(
            "limit",
            "25",
          );

          const response =
            await fetch(
              `/api/admin/users?${params.toString()}`,
              {
                method: "GET",
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
                "Unable to load accounts.",
            );
          }

          setAccounts(
            data.users || [],
          );

          setCounts(
            data.counts ||
              emptyCounts,
          );

          setSummary(
            data.summary || {
              total:
                data.counts?.total || 0,

              active:
                data.counts?.active || 0,

              pending:
                data.counts?.pending || 0,

              blocked:
                data.counts?.blocked || 0,
            },
          );

          setTotalPages(
            data.pagination
              ?.totalPages || 1,
          );
        } catch (loadError) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load accounts.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        role,
        status,
        search,
        page,
      ],
    );

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  function openCreate() {
    setEditingAccount(null);

    setForm({
      name: "",
      email: "",
      phone: "",

      role:
        initialRole !== "all"
          ? initialRole
          : "student",

      status:
        initialRole ===
        "faculty"
          ? "pending"
          : "active",

      password: "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEdit(
    account: Account,
  ) {
    setEditingAccount(account);

    setForm({
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      status: account.status,
      password: "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function saveAccount() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        editingAccount
          ? `/api/admin/users/${editingAccount.id}`
          : "/api/admin/users";

      const method =
        editingAccount
          ? "PATCH"
          : "POST";

      const body =
        editingAccount
          ? {
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: form.role,
              status: form.status,

              newPassword:
                form.password ||
                undefined,
            }
          : {
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: form.role,
              status: form.status,
              password:
                form.password,
            };

      const response =
        await fetch(endpoint, {
          method,
          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(body),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save account.",
        );
      }

      setModalOpen(false);

      setSuccess(
        data.message ||
          "Account saved successfully.",
      );

      await loadAccounts();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save account.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(
    account: Account,
    nextStatus: UserStatus,
  ) {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/users/${account.id}`,
          {
            method: "PATCH",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status:
                nextStatus,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update account.",
        );
      }

      setSuccess(
        data.message ||
          "Account updated.",
      );

      await loadAccounts();
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Unable to update account.",
      );
    }
  }

  const roleTabs: {
    value:
      | UserRole
      | "all";

    label: string;
    count: number;
  }[] = [
    {
      value: "all",
      label: "All",
      count: counts.total,
    },
    {
      value: "student",
      label: "Students",
      count: counts.students,
    },
    {
      value: "faculty",
      label: "Faculty",
      count: counts.faculty,
    },
    {
      value: "client",
      label: "Clients",
      count: counts.clients,
    },
    {
      value: "admin",
      label: "Admins",
      count: counts.admins,
    },
  ];

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
              {title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[11px] font-black text-white shadow-sm transition hover:bg-[#71001c]"
          >
            <Plus className="h-4 w-4" />
            Create Account
          </button>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Accounts"
            value={summary.total}
            icon={Users}
          />

          <StatCard
            label="Active"
            value={summary.active}
            icon={UserCheck}
          />

          <StatCard
            label="Pending"
            value={summary.pending}
            icon={RefreshCw}
          />

          <StatCard
            label="Blocked"
            value={summary.blocked}
            icon={Ban}
          />
        </section>

        {error && !modalOpen && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {!lockRole && (
            <div className="border-b border-slate-100 px-4 pt-4">
              <div className="flex flex-wrap gap-1">
                {roleTabs.map(
                  (tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => {
                        setRole(
                          tab.value,
                        );
                        setPage(1);
                      }}
                      className={[
                        "rounded-t-lg border-b-2 px-4 py-3 text-[11px] font-black transition",

                        role ===
                        tab.value
                          ? "border-[#8f0024] text-[#8f0024]"
                          : "border-transparent text-slate-500 hover:text-slate-800",
                      ].join(" ")}
                    >
                      {tab.label} (
                      {tab.count})
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    setSearch(
                      searchInput,
                    );
                    setPage(1);
                  }
                }}
                placeholder="Search by name, email or phone..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-[#8f0024]/40 focus:bg-white focus:ring-4 focus:ring-[#8f0024]/5"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target
                    .value as
                    | UserStatus
                    | "all",
                );

                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="blocked">
                Blocked
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch(
                  searchInput,
                );
                setPage(1);
              }}
              className="h-10 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() =>
                loadAccounts()
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              aria-label="Refresh accounts"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-5 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Account
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Role
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Created
                  </th>

                  <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center"
                    >
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#8f0024]" />

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Loading accounts...
                      </p>
                    </td>
                  </tr>
                ) : accounts.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-xs font-semibold text-slate-400"
                    >
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.map(
                    (account) => (
                      <tr
                        key={account.id}
                        className="border-b border-slate-100 transition hover:bg-[#fffafb]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-xs font-black text-[#8f0024]">
                              {account.name
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate-800">
                                  {
                                    account.name
                                  }
                                </p>

                                {account.isCurrentAdmin && (
                                  <span className="rounded-full bg-[#fff1f4] px-2 py-0.5 text-[8px] font-black text-[#8f0024]">
                                    You
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {
                                  account.email
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-[11px] font-semibold text-slate-600">
                          {account.phone}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600">
                            {roleLabel(
                              account.role,
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-black capitalize ${statusClasses(
                              account.status,
                            )}`}
                          >
                            {account.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-[10px] text-slate-500">
                          {new Date(
                            account.createdAt,
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {account.role ===
                              "faculty" &&
                              account.status ===
                                "pending" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    quickStatus(
                                      account,
                                      "active",
                                    )
                                  }
                                  className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-50 px-3 text-[9px] font-black text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  <Check className="h-3 w-3" />
                                  Approve
                                </button>
                              )}

                            {!account.isCurrentAdmin &&
                              account.status !==
                                "blocked" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    quickStatus(
                                      account,
                                      "blocked",
                                    )
                                  }
                                  className="inline-flex h-8 items-center gap-1 rounded-md bg-red-50 px-3 text-[9px] font-black text-red-700 transition hover:bg-red-100"
                                >
                                  <Ban className="h-3 w-3" />
                                  Block
                                </button>
                              )}

                            {!account.isCurrentAdmin &&
                              account.status ===
                                "blocked" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    quickStatus(
                                      account,
                                      "active",
                                    )
                                  }
                                  className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-50 px-3 text-[9px] font-black text-emerald-700"
                                >
                                  <UserCheck className="h-3 w-3" />
                                  Activate
                                </button>
                              )}

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  account,
                                )
                              }
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-[9px] font-black text-slate-600 transition hover:border-[#8f0024]/25 hover:text-[#8f0024]"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-[10px] font-semibold text-slate-400">
              Page {page} of{" "}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((value) =>
                    Math.max(
                      1,
                      value - 1,
                    ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage((value) =>
                    Math.min(
                      totalPages,
                      value + 1,
                    ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close modal"
            onClick={() =>
              setModalOpen(false)
            }
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8f0024]">
                  {editingAccount
                    ? "Account Management"
                    : "Registration"}
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  {editingAccount
                    ? "Edit Account"
                    : "Create Account"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <FormField
                label="Full Name"
                value={form.name}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      name: value,
                    }),
                  )
                }
                placeholder="Enter full name"
              />

              <FormField
                label="Email Address"
                value={form.email}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      email: value,
                    }),
                  )
                }
                placeholder="Enter email"
                type="email"
              />

              <FormField
                label="Phone Number"
                value={form.phone}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      phone: value,
                    }),
                  )
                }
                placeholder="Enter phone number"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-black text-slate-700">
                    Role
                  </label>

                  <select
                    value={form.role}
                    disabled={
                      editingAccount
                        ?.isCurrentAdmin
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,

                          role:
                            event.target
                              .value as UserRole,
                        }),
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none disabled:bg-slate-100"
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="faculty">
                      Faculty
                    </option>

                    <option value="client">
                      Client
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black text-slate-700">
                    Status
                  </label>

                  <select
                    value={form.status}
                    disabled={
                      editingAccount
                        ?.isCurrentAdmin
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,

                          status:
                            event.target
                              .value as UserStatus,
                        }),
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none disabled:bg-slate-100"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="blocked">
                      Blocked
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black text-slate-700">
                  {editingAccount
                    ? "Set New Password (Optional)"
                    : "Temporary Password"}
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,

                        password:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder={
                    editingAccount
                      ? "Leave blank to keep current password"
                      : "Minimum 8 characters"
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                />

                {editingAccount && (
                  <p className="mt-2 text-[9px] leading-4 text-slate-400">
                    Existing passwords are never displayed.
                    Entering a new password here replaces the old password securely.
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[10px] font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveAccount}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editingAccount
                    ? "Save Changes"
                    : "Create Account"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-[#271a1e]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1f4] text-[#8f0024]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
      />
    </div>
  );
}

