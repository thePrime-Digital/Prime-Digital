"use client";
import "@/app/dashboard/student-feature-polish.css";

import "@/app/dashboard/student-reference.css";

import "@/app/dashboard/student-brand-theme.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Globe,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  MessageCircleQuestion,
  MessageSquare,
  MonitorPlay,
  ReceiptText,
  Search,
  Settings,
  Trophy,
  TrendingUp,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  user: {
    name: string;
    email: string;
  };
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const main: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Timetable", href: "/dashboard/timetable", icon: CalendarDays },
  { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
];

const learn: NavItem[] = [
  { label: "Course", href: "/dashboard/courses", icon: BookOpen },
  { label: "My Classes", href: "/dashboard/classes", icon: GraduationCap },
  { label: "Live Classes", href: "/dashboard/live-classes", icon: MonitorPlay },
  { label: "Lectures", href: "/dashboard/recorded-lectures", icon: Video },
  { label: "Lessons", href: "/dashboard/lessons", icon: LibraryBig },
  { label: "Learning Content", href: "/dashboard/learning-content", icon: LibraryBig },
  { label: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
  { label: "Tests", href: "/dashboard/exams", icon: FileQuestion },
  { label: "Doubts", href: "/dashboard/doubts", icon: MessageCircleQuestion },
  { label: "Learning Progress", href: "/dashboard/learning-progress", icon: TrendingUp },
];

const career: NavItem[] = [
  { label: "Placement", href: "/dashboard/placement", icon: Trophy },
  { label: "Performance", href: "/dashboard/performance", icon: Trophy },
  {
    label: "Certificates",
    href: "/dashboard/certificates",
    icon: CheckCircle2,
  },
];

const finance: NavItem[] = [
  { label: "Fees", href: "/dashboard/fees", icon: ReceiptText },
];

const support: NavItem[] = [
  { label: "Notices", href: "/dashboard/notices", icon: Bell },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const more: NavItem[] = [
  { label: "My Classes", href: "/dashboard/classes", icon: GraduationCap },
  { label: "Live Classes", href: "/dashboard/live-classes", icon: MonitorPlay },
  { label: "Lessons", href: "/dashboard/lessons", icon: LibraryBig },
  {
    label: "Learning Content",
    href: "/dashboard/learning-content",
    icon: LibraryBig,
  },
  { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
];

const navigation = [
  ...main,
  ...learn,
  ...career,
  ...finance,
  ...support,
];
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "ST";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function StudentDashboardShell({ user, children }: Props) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Keep the active menu item in view after route changes.
  useEffect(() => {
    const navigationPanels = document.querySelectorAll<HTMLElement>(
      '[data-student-navigation="true"]',
    );

    navigationPanels.forEach((panel) => {
      const active = panel.querySelector<HTMLElement>('[aria-current="page"]');

      if (!active) return;

      const panelRect = panel.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      const offset =
        activeRect.top -
        panelRect.top -
        panel.clientHeight / 2 +
        activeRect.height / 2;

      panel.scrollTop += offset;
    });
  }, [pathname]);
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const currentPage =
    navigation
      .filter((item) => isActive(item.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ||
    "Student Portal";

  const searchResults = search.trim()
    ? navigation.filter((item) =>
        item.label.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : [];

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

      window.location.replace("/login");
    } catch {
      setLoggingOut(false);
      window.alert("Unable to log out. Please try again.");
    }
  }

  function renderLinks(items: NavItem[]) {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          aria-current={active ? "page" : undefined}
          className={[
            "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition",
            active
              ? "bg-[#8f0024] text-white shadow-sm"
              : "text-white/70 hover:bg-white/10 hover:text-white",
          ].join(" ")}
        >
          <Icon size={16} strokeWidth={1.8} />
          <span className="flex-1 truncate">{item.label}</span>
          {active && <ArrowRight size={12} />}
        </Link>
      );
    });
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-[#510014] text-white">
      <Link
        href="/dashboard"
        onClick={() => setMobileOpen(false)}
        className="flex min-h-[150px] shrink-0 items-center gap-3 border-b border-white/10 px-4"
      >
        <div className="flex h-[105px] w-[76px] shrink-0 items-center justify-center">
          <img
            src="/images/pds-original-logo.png"
            alt="Prime Digital School"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-[17px] font-extrabold leading-tight tracking-[-0.6px] text-[#fff4e7]">
            Prime Digital
          </p>

          <p className="mt-1 text-[12px] font-black uppercase tracking-[0.16em] text-[#f3c861]">
            STUDENT
          </p>
        </div>
      </Link>

      <nav
        data-student-navigation="true"
        aria-label="Student navigation"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <section>
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
            Main
          </p>
          {renderLinks(main)}
        </section>

        <section>
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
            Learn
          </p>
          {renderLinks(learn)}
        </section>

        <section>
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
            Career
          </p>
          {renderLinks(career)}
        </section>

        <section>
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
            Finance
          </p>
          {renderLinks(finance)}
        </section>

        <section>
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
            Support
          </p>
          {renderLinks(support)}
        </section>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 pb-10 pt-3">
        <Link
          href="/"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-xs font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <Globe size={16} />
          Visit Website
          <ArrowRight size={14} className="ml-auto opacity-60" />
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-xs font-bold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
  return (
    <div className="student-dashboard-brand fixed inset-0 z-[9998] flex min-h-0 overflow-hidden bg-[#f8f5f0] text-[#281c20]">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden h-full w-[270px] shrink-0 lg:block">
        {sidebar}
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="student-dashboard-brand fixed inset-0 z-[9998] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[9999] w-[270px] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/15"
        >
          <X size={16} />
        </button>
        {sidebar}
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* HEADER */}
        <header className="flex h-[66px] shrink-0 items-center justify-between gap-3 border-b border-[#ece5df] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-[10px] text-slate-400">Student Portal</p>
              <h2 className="text-sm font-black text-[#550017]">
                {currentPage}
              </h2>
            </div>
          </div>

          <div className="relative hidden w-full max-w-[360px] sm:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search portal pages..."
              className="h-9 w-full rounded-lg border border-[#e9e2df] bg-[#faf8f6] pl-9 pr-3 text-xs outline-none focus:border-[#8f0024]"
            />

            {search.trim() && (
              <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border bg-white shadow-xl">
                {searchResults.length ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearch("")}
                      className="block px-4 py-3 text-xs font-semibold hover:bg-[#fff0f3]"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-xs text-slate-500">
                    No matching page.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              aria-label="Notifications"
              className="grid h-9 w-9 place-items-center rounded-lg text-[#550017] hover:bg-[#fff0f3]"
            >
              <Bell size={18} />
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-[#fff0f3]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#390c19] text-[10px] font-black text-white">
                  {initials(user.name)}
                </span>

                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border bg-white shadow-xl">
                  <div className="border-b px-4 py-3">
                    <p className="truncate text-xs font-bold">{user.name}</p>
                    <p className="mt-1 truncate text-[10px] text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs hover:bg-slate-50"
                  >
                    <Settings size={15} />
                    Settings
                  </Link>

                                    <Link
                    href="/"
                    rel="noopener noreferrer"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs hover:bg-slate-50"
                  >
                    <Globe size={15} />
                    Visit Website
                  </Link>
<button
                    type="button"
                    onClick={() => void logout()}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f8f5f0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
