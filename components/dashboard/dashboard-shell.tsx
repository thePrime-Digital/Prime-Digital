"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getDashboardNavigation,
  getRoleTitle,
} from "@/components/dashboard/dashboard-navigation";

import type {
  DashboardRole,
  DashboardUser,
} from "@/components/dashboard/dashboard-types";

type DashboardShellProps = {
  role: DashboardRole;
  user: DashboardUser;
  children: ReactNode;
};

function getInitials(
  name: string,
): string {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length ===
    0
  ) {
    return "PD";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

export default function DashboardShell({
  role,
  user,
  children,
}: DashboardShellProps) {
  const pathname =
    usePathname();

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false);

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] =
    useState(0);

  const navigation =
    getDashboardNavigation(
      role,
    );

  const roleTitle =
    getRoleTitle(
      role,
    );

  const baseRoute =
    role === "student"
      ? "/dashboard"
      : role === "faculty"
        ? "/faculty"
        : role === "admin"
          ? "/admin"
          : "/client-dashboard";

  const notificationsRoute =
    role === "student"
      ? "/dashboard/notifications"
      : role === "faculty"
        ? "/faculty/notifications"
        : role === "admin"
          ? "/admin/notifications"
          : "/client-dashboard/notifications";

  const settingsRoute =
    role === "student"
      ? "/dashboard/settings"
      : role === "faculty"
        ? "/faculty/settings"
        : role === "admin"
          ? "/admin/settings"
          : "/client-dashboard/settings";

  const searchResults =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return [];
      }

      return navigation
        .filter(
          (item) =>
            item.label
              .toLowerCase()
              .includes(
                query,
              ),
        )
        .slice(
          0,
          6,
        );
    }, [
      navigation,
      searchQuery,
    ]);

  const loadStudentUnread =
    useCallback(
      async () => {
        if (
          role !==
          "student"
        ) {
          setUnreadNotifications(
            0,
          );

          return;
        }

        try {
          const response =
            await fetch(
              "/api/student/notifications",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          if (
            !response.ok
          ) {
            return;
          }

          const data =
            await response.json();

          const notifications =
            Array.isArray(
              data.notifications,
            )
              ? data.notifications
              : [];

          setUnreadNotifications(
            notifications.filter(
              (
                item: {
                  isRead?: boolean;
                },
              ) =>
                item.isRead !==
                true,
            ).length,
          );
        } catch {
          // Notification count is non-critical.
        }
      },
      [
        role,
      ],
    );

  useEffect(() => {
    loadStudentUnread();
  }, [
    loadStudentUnread,
    pathname,
  ]);

  useEffect(() => {
    function handleUpdated() {
      loadStudentUnread();
    }

    window.addEventListener(
      "student-notifications-updated",
      handleUpdated,
    );

    return () => {
      window.removeEventListener(
        "student-notifications-updated",
        handleUpdated,
      );
    };
  }, [
    loadStudentUnread,
  ]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setSearchQuery("");
  }, [
    pathname,
  ]);

  /*
   * Protect against the browser restoring
   * a cached dashboard page after logout.
   *
   * If a protected page is restored from
   * the Back/Forward Cache, verify that the
   * user's session still exists.
   */
  useEffect(() => {
    let checking =
      false;

    async function verifySession() {
      if (checking) {
        return;
      }

      checking =
        true;

      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              credentials:
                "include",

              cache:
                "no-store",

              headers: {
                "Cache-Control":
                  "no-cache",
              },
            },
          );

        if (
          !response.ok
        ) {
          window.location.replace(
            "/login",
          );

          return;
        }
      } catch {
        window.location.replace(
          "/login",
        );
      } finally {
        checking =
          false;
      }
    }

    function handlePageShow(
      event: PageTransitionEvent,
    ) {
      if (
        event.persisted
      ) {
        void verifySession();
      }
    }

    window.addEventListener(
      "pageshow",
      handlePageShow,
    );

    return () => {
      window.removeEventListener(
        "pageshow",
        handlePageShow,
      );
    };
  }, []);

  function isActive(
    href: string,
  ) {
    if (
      href ===
      baseRoute
    ) {
      return (
        pathname ===
        href
      );
    }

    return (
      pathname ===
        href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const response =
        await fetch(
          "/api/auth/logout",
          {
            method:
              "POST",

            credentials:
              "include",

            cache:
              "no-store",

            headers: {
              "Cache-Control":
                "no-cache",
            },
          },
        );

      if (
        !response.ok
      ) {
        console.error(
          "Logout request failed.",
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error,
      );
    } finally {
      /*
       * replace() instead of assign()
       * prevents the current dashboard
       * page from remaining as the latest
       * history entry.
       */
      window.location.replace(
        "/login",
      );
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#690019] text-white">
      <div className="border-b border-white/10 px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-sm font-black">
            {getInitials(
              user.name,
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black">
              {user.name}
            </p>

            <p className="mt-0.5 truncate text-[10px] font-medium text-white/65">
              {roleTitle}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isActive(
                  item.href,
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={() =>
                    setMobileOpen(
                      false,
                    )
                  }
                  className={[
                    "group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-semibold transition",

                    active
                      ? "bg-white/14 text-white shadow-sm"
                      : "text-white/76 hover:bg-white/8 hover:text-white",
                  ].join(
                    " ",
                  )}
                >
                  <Icon
                    className="h-[16px] w-[16px] shrink-0"
                    strokeWidth={
                      1.8
                    }
                  />

                  <span className="truncate">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <LogOut
            className="h-4 w-4"
            strokeWidth={
              1.8
            }
          />

          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9998] flex overflow-hidden bg-[#f7f7f8] text-[#201a1d]">
      <aside className="hidden h-full w-[230px] shrink-0 lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() =>
            setMobileOpen(
              false,
            )
          }
          className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[9999] w-[260px] transform transition-transform duration-300 lg:hidden",

          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(
          " ",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileOpen(
              false,
            )
          }
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[64px] shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex w-full items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  true,
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href={
                baseRoute
              }
              className="hidden shrink-0 text-[13px] font-black text-[#690019] sm:block"
            >
              Prime Digital School
            </Link>

            <div className="relative mx-auto hidden w-full max-w-[360px] md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={
                  searchQuery
                }
                onChange={(
                  event,
                ) =>
                  setSearchQuery(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Search portal..."
                className="h-9 w-full rounded-full border border-slate-200 bg-[#fafafa] pl-9 pr-4 text-xs outline-none transition focus:border-[#8d2440]/40 focus:ring-4 focus:ring-[#8d2440]/5"
              />

              {searchQuery &&
                searchResults.length >
                  0 && (
                  <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {searchResults.map(
                      (
                        item,
                      ) => {
                        const Icon =
                          item.icon;

                        return (
                          <Link
                            key={
                              item.href
                            }
                            href={
                              item.href
                            }
                            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-xs font-bold text-slate-700 last:border-0 hover:bg-slate-50"
                          >
                            <Icon className="h-4 w-4 text-[#8f0024]" />

                            {
                              item.label
                            }
                          </Link>
                        );
                      },
                    )}
                  </div>
                )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href={
                  notificationsRoute
                }
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              >
                <Bell className="h-[17px] w-[17px]" />

                {role ===
                  "student" &&
                  unreadNotifications >
                    0 && (
                    <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#8f0024] px-1 text-[7px] font-black text-white">
                      {unreadNotifications >
                      9
                        ? "9+"
                        : unreadNotifications}
                    </span>
                  )}
              </Link>

              <div className="h-6 w-px bg-slate-200" />

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (
                        value,
                      ) =>
                        !value,
                    )
                  }
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#690019] text-[10px] font-black text-white">
                    {getInitials(
                      user.name,
                    )}
                  </div>

                  <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-4">
                      <p className="truncate text-xs font-black text-slate-800">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href={
                        settingsRoute
                      }
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4" />

                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      disabled={
                        loggingOut
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />

                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f7f8]">
          {children}
        </div>
      </div>
    </div>
  );
}