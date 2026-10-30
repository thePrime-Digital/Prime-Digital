"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileCheck2,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type Item = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const main: Item[] = [
  { name: "Home", href: "/faculty", icon: Home },
  { name: "Timetable", href: "/faculty/timetable", icon: CalendarDays },
  { name: "Reports", href: "/faculty/reports", icon: BriefcaseBusiness },
];

const teaching: Item[] = [
  { name: "Attendance", href: "/faculty/attendance", icon: ClipboardCheck },
  { name: "Batches", href: "/faculty/batches", icon: Users },
  { name: "Students", href: "/faculty/students", icon: GraduationCap },
  { name: "Assignments", href: "/faculty/assignments", icon: ClipboardList },
  { name: "Review", href: "/faculty/review", icon: ClipboardList },
  { name: "Tests", href: "/faculty/tests", icon: FileCheck2 },
  { name: "Doubts", href: "/faculty/doubts", icon: MessageCircle },
  { name: "Content", href: "/faculty/content", icon: BookOpen },
  { name: "eBooks", href: "/faculty/ebooks", icon: BookOpen },
  { name: "Live Classes", href: "/faculty/live-classes", icon: CalendarDays },
  { name: "Recorded Lectures", href: "/faculty/recorded-lectures", icon: BookOpen },
  { name: "Projects", href: "/faculty/projects", icon: FolderOpen },
];

const work: Item[] = [
  { name: "Leave", href: "/faculty/leave", icon: Clock3 },
  { name: "Payslips", href: "/faculty/payslips", icon: ReceiptText },
  { name: "Fees", href: "/faculty/fees", icon: ReceiptText },
  { name: "Profile", href: "/faculty/settings", icon: Settings },
  { name: "Messages", href: "/faculty/messages", icon: MessageCircle },
  { name: "Notifications", href: "/faculty/notifications", icon: Bell },
];


const more: Item[] = [
  { name: "Assignments", href: "/faculty/assignments", icon: ClipboardList },
  { name: "Students", href: "/faculty/students", icon: GraduationCap },
  { name: "Live Classes", href: "/faculty/live-classes", icon: CalendarDays },
  { name: "Recorded Lectures", href: "/faculty/recorded-lectures", icon: BookOpen },
  { name: "eBooks", href: "/faculty/ebooks", icon: BookOpen },
  { name: "Reports", href: "/faculty/reports", icon: BriefcaseBusiness },
  { name: "Messages", href: "/faculty/messages", icon: MessageCircle },
  { name: "Notifications", href: "/faculty/notifications", icon: Bell },
  { name: "Fees", href: "/faculty/fees", icon: ReceiptText },
];

const all = [...main, ...teaching, ...work, ...more];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "FC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function FacultyDashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMenu(false);
    setProfile(false);
    setSearch("");
  }, [path]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/faculty/notifications", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!cancelled && data && typeof data.unread === "number") {
          setUnread(data.unread);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [path]);

  function isActive(item: Item) {
    return item.href === "/faculty"
      ? path === item.href
      : path === item.href || path.startsWith(item.href + "/");
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const result = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!result.ok) throw new Error("Logout failed");

      window.location.replace("/login");
    } catch {
      setLoggingOut(false);
      window.alert("Unable to log out. Please try again.");
    }
  }

  function links(items: Item[]) {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMenu(false)}
          aria-current={active ? "page" : undefined}
          className={
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition " +
            (active
              ? "bg-[#633023] text-[#f6c44f]"
              : "text-white/85 hover:bg-white/10")
          }
        >
          <Icon size={16} />
          <span>{item.name}</span>
        </Link>
      );
    });
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-[#390c19] text-white">
      <Link
        href="/faculty"
        className="flex min-h-[105px] shrink-0 items-center gap-3 border-b border-white/10 px-4"
      >
        <img
          src="/images/pds-original-logo.png"
          alt="Prime Digital School"
          className="h-[77px] w-[64px] shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="whitespace-nowrap font-serif text-[17px] font-bold leading-tight text-[#fff4df]">
            Prime Digital
          </p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#f6c44f]">
            FACULTY
          </p>
        </div>
      </Link>

      <nav className="faculty-hidden-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-5">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#c7a3aa]">
            Main
          </p>
          {links(main)}
        </div>

        <div className="mb-5">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#c7a3aa]">
            Teaching
          </p>
          {links(teaching)}
        </div>

        <div className="mb-5">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#c7a3aa]">
            My Work
          </p>
          {links(work)}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 pb-10 pt-3">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-xs font-semibold text-white/85 hover:bg-white/10"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  const matching = search.trim()
    ? all.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="faculty-workspace fixed inset-0 z-[9998] flex min-h-0 overflow-hidden bg-[#f8f4ee]">
      <aside className="hidden h-full w-[240px] shrink-0 lg:block">
        {sidebar}
      </aside>

      {menu && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMenu(false)}
          className="fixed inset-0 z-[9998] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-[9999] w-[250px] transition-transform lg:hidden " +
          (menu ? "translate-x-0" : "-translate-x-full")
        }
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenu(false)}
          className="absolute right-3 top-3 z-20 rounded-lg bg-white/20 p-2 text-white"
        >
          <X size={17} />
        </button>

        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[66px] shrink-0 items-center gap-3 border-b border-[#efe6df] bg-white px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
            className="lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="relative w-full max-w-[380px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#957d84]"
            />

            <input
              type="search"
              aria-label="Search Faculty pages"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#eee4db] bg-[#f8f4ee] pl-9 pr-3 text-xs outline-none focus:border-[#390c19]"
            />

            {search.trim() && (
              <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border bg-white p-2 shadow-xl">
                {matching.length ? matching.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setSearch("");
                      router.push(item.href);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-[#faf1ec]"
                  >
                    {item.name}
                  </button>
                )) : <p className="p-3 text-xs text-slate-500">No matching pages</p>}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/faculty/notifications"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-[#efe5df]"
              aria-label="Notifications"
            >
              <Bell size={17} />

              {unread > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-[#b71940] px-1 text-[10px] text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Faculty account"
                onClick={() => setProfile(!profile)}
                className="flex items-center gap-1"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#390c19] text-xs font-black text-[#f6c44f]">
                  {initials(user.name)}
                </span>
                <ChevronDown size={13} />
              </button>

              {profile && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border bg-white p-4 shadow-xl">
                  <p className="truncate text-xs font-bold">{user.name}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{user.email}</p>
                  <Link href="/faculty/settings" className="mt-4 block border-t py-3 text-xs">
                    Profile and Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="text-xs font-bold text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="faculty-content faculty-hidden-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}