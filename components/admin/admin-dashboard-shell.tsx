"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Students", href: "/admin/students", icon: GraduationCap },
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
      { label: "Tests", href: "/admin/tests", icon: ClipboardList },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Users },
      { label: "Fees", href: "/admin/fees", icon: CreditCard },
      { label: "Placement", href: "/admin/placement", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "Team",
    items: [
      { label: "Staff", href: "/admin/staff", icon: Users },
      { label: "Payroll", href: "/admin/payroll", icon: Wallet },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notices", href: "/admin/notices", icon: Bell },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const quickTools: NavItem[] = [
  { label: "Account Directory", href: "/admin/users", icon: Users },
  { label: "Faculty Management", href: "/admin/faculty", icon: GraduationCap },
  { label: "Admissions", href: "/admin/admissions", icon: FileText },
  { label: "Programs", href: "/admin/programs", icon: BookOpen },
  { label: "Classes", href: "/admin/classes", icon: ClipboardList },
  { label: "Submissions", href: "/admin/submissions", icon: FileText },
  { label: "Career Applications", href: "/admin/careers/applications", icon: BriefcaseBusiness },
  { label: "Messages", href: "/admin/messages", icon: Bell },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

const links = [...groups.flatMap((group) => group.items), ...quickTools];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AdminDashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
    setSearch("");
  }, [pathname]);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) window.location.replace("/login");
      } catch {
        window.location.replace("/login");
      }
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void checkSession();
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Logout failed");
      window.location.replace("/login");
    } catch {
      setLoggingOut(false);
      window.alert("Unable to log out. Please try again.");
    }
  }

  function active(href: string) {
    return href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");
  }

  const matching = search.trim()
    ? links.filter((item) =>
        item.label.toLowerCase().includes(search.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-[#390c19] text-white">
      <Link
  href="/admin"
  className="flex min-h-[100px] shrink-0 items-center gap-3 border-b border-white/10 px-4"
>
  <img
    src="/images/pds-original-logo.png"
    alt="Prime Digital School"
    className="h-[78px] w-[62px] shrink-0 object-contain"
  />
  <div className="min-w-0">
    <p className="whitespace-nowrap font-serif text-[17px] font-bold text-[#fff4e7]">
      Prime Digital
    </p>
    <p className="mt-1 text-[11px] font-extrabold tracking-[0.15em] text-[#f6c44f]">
      ADMIN
    </p>
  </div>
</Link>

      <nav className="admin-hide-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.17em] text-white/35">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const selected = active(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={selected ? "page" : undefined}
                    className={
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition " +
                      (selected
                        ? "bg-[#793740] text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white")
                    }
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.17em] text-white/35">
            More Tools
          </p>
          {quickTools.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  "flex min-h-9 items-center gap-3 rounded-lg px-3 py-2 text-[11px] font-semibold " +
                  (active(item.href) ? "bg-[#793740]" : "text-white/65 hover:bg-white/10")
                }
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 pb-9 pt-3">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-portal fixed inset-0 z-[9998] flex overflow-hidden bg-[#f6f2ec] text-[#261a1f]">
      <aside className="hidden h-full w-[236px] shrink-0 lg:block">
        {sidebar}
      </aside>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
          className="fixed inset-0 z-[9998] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-[9999] w-[260px] transition-transform lg:hidden " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
          className="absolute right-3 top-3 rounded-lg bg-white/15 p-2"
        >
          <X size={16} />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[65px] shrink-0 items-center gap-3 border-b border-[#eae2dd] bg-white px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="relative hidden w-full max-w-[370px] sm:block">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Admin pages..."
              className="h-9 w-full rounded-lg border border-[#e9e3dd] bg-[#f9f6f2] pl-9 pr-3 text-xs outline-none focus:border-[#af123e]"
            />
            {search.trim() && (
              <div className="absolute left-0 right-0 top-11 z-50 max-h-72 overflow-y-auto rounded-xl border bg-white p-2 shadow-xl">
                {matching.length ? matching.map((item) => (
                  <button
                    type="button"
                    key={item.href}
                    onClick={() => {
                      setSearch("");
                      router.push(item.href);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-[#fff0f3]"
                  >
                    {item.label}
                  </button>
                )) : (
                  <p className="p-3 text-xs text-slate-500">No matching pages</p>
                )}
              </div>
            )}
          </div>

          <span className="hidden text-xs font-semibold text-slate-500 lg:block">
            Institute Administration
          </span>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/admin/notifications"
              aria-label="Notifications"
              className="grid h-9 w-9 place-items-center rounded-lg text-[#4d1a28] hover:bg-[#fff0f3]"
            >
              <Bell size={18} />
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-label="Admin profile"
                className="flex items-center gap-2"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ad123d] text-[11px] font-black text-white">
                  {getInitials(user.name)}
                </span>
                <ChevronDown size={14} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border bg-white p-3 shadow-xl">
                  <p className="truncate text-xs font-bold">{user.name}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{user.email}</p>

                  <Link
                    href="/admin/settings"
                    className="mt-3 flex items-center gap-2 border-t py-3 text-xs"
                  >
                    <Settings size={15} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={() => void logout()}
                    className="flex items-center gap-2 text-xs text-red-700 disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-hide-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}