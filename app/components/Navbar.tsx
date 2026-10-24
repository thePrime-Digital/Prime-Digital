"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";

const PDA_CONNECTOR_URL = "https://services.primedigitalschool.com";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Career", href: "/job-connect" },
  { label: "Support", href: "/support" },
  { label: "About Us", href: "/about" },
];

type AuthUser = {
  name: string;
  email: string;
  role: string;
};

type AuthResponse = {
  authenticated?: boolean;
  user?: AuthUser;
};

function dashboardForRole(role: string): string {
  switch (role.toLowerCase()) {
    case "student":
      return "/dashboard";
    case "faculty":
      return "/faculty";
    case "admin":
      return "/admin";
    case "staff":
      return "/staff";
    default:
      return "/dashboard";
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = (await response.json()) as AuthResponse;

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    void loadSession();
  }, [pathname, loadSession]);

  useEffect(() => {
    const refreshSession = () => {
      void loadSession();
    };

    window.addEventListener("focus", refreshSession);

    return () => {
      window.removeEventListener("focus", refreshSession);
    };
  }, [loadSession]);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";

      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname],
  );

  const dashboardHref = dashboardForRole(user?.role || "student");

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setProfileOpen(false);
      setOpen(false);

      window.location.replace("/");
    } catch {
      window.alert("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  if (!visible || pathname === "/services") {
    return null;
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] px-4 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 rounded-[1.4rem] border border-[#8b0022]/15 bg-white/95 px-5 py-3 shadow-[0_18px_45px_rgba(30,10,18,0.10)] backdrop-blur-xl">
        {/* BRAND */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="text-lg font-black tracking-tight text-[#7c001d] max-[480px]:text-base xl:text-xl">
            Prime Digital School
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative whitespace-nowrap text-xs font-semibold transition xl:text-sm",
                  active
                    ? "text-[#7c001d]"
                    : "text-slate-600 hover:text-[#7c001d]",
                ].join(" ")}
              >
                {item.label}

                {active && (
                  <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-[#7c001d]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href={PDA_CONNECTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#0A54B7]/20 bg-[#EEF5FF] px-3 py-3 text-xs font-bold text-[#0A54B7] transition hover:border-[#0A54B7]/40 hover:bg-[#D7E5FA] xl:px-4 xl:text-sm"
          >
            Prime Digital Agency
            <ExternalLink size={14} />
          </a>

          {authLoading ? (
            <div
              aria-label="Checking session"
              className="h-11 w-36 animate-pulse rounded-xl bg-slate-100"
            />
          ) : user ? (
            <>
              {/* LOGGED-IN DASHBOARD */}
              <Link
                href={dashboardHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7c001d] px-4 text-xs font-bold text-white shadow-[0_10px_22px_rgba(124,0,29,0.17)] transition hover:bg-[#5f0016] xl:px-5 xl:text-sm"
              >
                Dashboard
                <ChevronRight size={16} />
              </Link>

              {/* LOGGED-IN AVATAR */}
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[#fff0f4]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7c001d] text-xs font-extrabold text-white ring-2 ring-[#eed5dd]">
                    {initials(user.name)}
                  </span>

                  <ChevronDown
                    size={15}
                    className={
                      "text-[#7c001d] transition " +
                      (profileOpen ? "rotate-180" : "")
                    }
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-[#eadce0] bg-white shadow-[0_20px_50px_rgba(40,0,15,0.15)]">
                    <div className="border-b border-[#f0e7ea] px-4 py-4">
                      <p className="truncate text-sm font-bold text-[#28131b]">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-[#fff0f4] px-2.5 py-1 text-[10px] font-bold capitalize text-[#7c001d]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#28131b] transition hover:bg-[#fff5f7]"
                    >
                      <LayoutDashboard size={17} />
                      My Dashboard
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#28131b] transition hover:bg-[#fff5f7]"
                    >
                      <UserRound size={17} />
                      Website Home
                    </Link>

                    <div className="border-t border-[#f0e7ea]">
                      <button
                        type="button"
                        onClick={() => void logout()}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* GUEST LOGIN */}
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#7c001d]/25 bg-white px-4 text-xs font-bold text-[#7c001d] transition hover:bg-[#fff4f7] xl:px-5 xl:text-sm"
              >
                Login
              </Link>

              {/* GUEST APPLY */}
              <Link
                href="/admissions"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7c001d] px-4 text-xs font-bold text-white transition hover:bg-[#5f0016] xl:px-6 xl:text-sm"
              >
                Apply Now
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#7c001d]/15 text-[#7c001d] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {open && (
        <div className="mx-auto mt-3 max-w-[1440px] rounded-[1.4rem] border border-[#8b0022]/15 bg-white p-4 shadow-[0_18px_45px_rgba(30,10,18,0.12)] lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-bold transition",
                    active
                      ? "bg-[#7c001d] text-white"
                      : "text-slate-700 hover:bg-[#fff4f7] hover:text-[#7c001d]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <a
              href={PDA_CONNECTOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#0A54B7]/20 bg-[#EEF5FF] px-4 py-3 text-sm font-bold text-[#0A54B7]"
            >
              Prime Digital Agency
              <ExternalLink size={15} />
            </a>

            {authLoading ? (
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <>
                <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#fff4f7] p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7c001d] text-xs font-bold text-white">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#3e1421]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#7c001d] px-4 py-3 text-sm font-bold text-white"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                  <ChevronRight size={15} />
                </Link>

                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={loggingOut}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[#7c001d]/25 bg-white px-4 py-3 text-center text-sm font-bold text-[#7c001d]"
                >
                  Login
                </Link>

                <Link
                  href="/admissions"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-[#7c001d] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
