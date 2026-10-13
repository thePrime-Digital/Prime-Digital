"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell, CalendarDays, CheckSquare, ChevronDown,
  ClipboardCheck, CreditCard, GraduationCap,
  LayoutDashboard, LogOut, Menu, MessageCircle,
  Search, Settings, TrendingUp, UserRound,
  Users, X, type LucideIcon
} from "lucide-react";

type Item = { label: string; href: string; icon: LucideIcon };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Main",
    items: [
      { label: "Home", href: "/staff", icon: LayoutDashboard },
      { label: "Tasks", href: "/staff/tasks", icon: CheckSquare },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Leads", href: "/staff/leads", icon: Users },
      { label: "Demos", href: "/staff/demos", icon: CalendarDays },
      { label: "Admissions", href: "/staff/admissions", icon: GraduationCap },
      { label: "Counselling", href: "/staff/counselling", icon: MessageCircle },
    ],
  },
  {
    title: "Office",
    items: [
      { label: "Students", href: "/staff/students", icon: Users },
      { label: "Fees", href: "/staff/fees", icon: CreditCard },
      { label: "Reports", href: "/staff/reports", icon: TrendingUp },
    ],
  },
  {
    title: "My Work",
    items: [
      { label: "Attendance", href: "/staff/attendance", icon: ClipboardCheck },
      { label: "Profile", href: "/staff/profile", icon: UserRound },
    ],
  },
];

const nav = groups.flatMap((group) => group.items);

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length > 1
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : (words[0] || "ST").slice(0, 2).toUpperCase();
}

export default function StaffDashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const active = (href: string) =>
    href === "/staff"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const current = nav.find((item) => active(item.href))?.label || "Staff";

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Logout failed");
      window.location.replace("/login");
    } catch {
      setLoggingOut(false);
      window.alert("Logout failed. Please try again.");
    }
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-[#390b17] text-white">
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
          <GraduationCap size={23} />
        </div>
        <div>
          <p className="text-sm font-black">Prime Digital</p>
          <p className="text-[10px] font-bold tracking-[0.18em] text-white/55">STAFF</p>
        </div>
      </div>

      <nav className="staff-no-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <section key={group.title} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={
                    "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition " +
                    (active(item.href)
                      ? "bg-[#7d3540] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white")
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </section>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 pb-9 pt-3">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="staff-portal fixed inset-0 z-[9998] flex overflow-hidden bg-[#f7f3ed] text-[#2e2021]">
      <aside className="hidden h-full w-[226px] shrink-0 lg:block">
        {sidebar}
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9998] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-[9999] w-[250px] transition-transform lg:hidden " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 z-10 rounded-lg bg-white/10 p-2"
        >
          <X size={16} />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[66px] shrink-0 items-center justify-between gap-4 border-b border-[#eee7e0] bg-white px-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden w-full max-w-[350px] md:block">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              aria-label="Search Staff pages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff pages..."
              className="h-9 w-full rounded-lg border border-[#ede7e2] bg-[#faf8f5] pl-9 pr-3 text-xs outline-none focus:border-[#8f0024]"
            />
            {search.trim() && (
              <div className="absolute left-0 right-0 top-11 z-50 rounded-xl border bg-white p-2 shadow-lg">
                {nav
                  .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      onClick={() => setSearch("")}
                      className="block rounded-lg px-3 py-2 text-xs hover:bg-[#fff2f3]"
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <p className="text-sm font-bold text-[#390b17] md:hidden">{current}</p>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/staff/tasks" aria-label="Tasks" className="text-[#390b17]">
              <Bell size={18} />
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e9bd61] text-xs font-extrabold text-[#390b17]">
                  {initials(user.name)}
                </span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border bg-white p-3 shadow-xl">
                  <p className="truncate text-xs font-bold">{user.name}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{user.email}</p>
                  <Link
                    href="/staff/profile"
                    onClick={() => setProfileOpen(false)}
                    className="mt-3 flex items-center gap-2 border-t py-3 text-xs"
                  >
                    <Settings size={15} /> My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="flex items-center gap-2 text-xs text-red-700"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="staff-no-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f7f3ed]">
          {children}
        </main>
      </div>
    </div>
  );
}