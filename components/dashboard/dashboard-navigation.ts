import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileArchive,
  FileCheck2,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  MessageSquare,
  MonitorPlay,
  PackageCheck,
  Presentation,
  ReceiptText,
  School,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";

import type {
  DashboardNavigationItem,
  DashboardRole,
} from "@/components/dashboard/dashboard-types";

export const facultyNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/faculty",
    icon: LayoutDashboard,
  },
  {
    label: "Schedule",
    href: "/faculty/schedule",
    icon: CalendarDays,
  },
  {
    label: "My Classes",
    href: "/faculty/classes",
    icon: School,
  },
  {
    label: "Students",
    href: "/faculty/students",
    icon: Users,
  },
  {
    label: "Attendance",
    href: "/faculty/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Assignments",
    href: "/faculty/assignments",
    icon: CheckSquare,
  },
  {
    label: "Course Content",
    href: "/faculty/content",
    icon: LibraryBig,
  },
  {
    label: "Live Classes",
    href: "/faculty/live-classes",
    icon: MonitorPlay,
  },
  {
    label: "Reports",
    href: "/faculty/reports",
    icon: BarChart3,
  },
  {
    label: "Messages",
    href: "/faculty/messages",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    href: "/faculty/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/faculty/settings",
    icon: Settings,
  },
];

export const adminNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Account Directory",
    href: "/admin/users",
    icon: UsersRound,
  },
  {
    label: "Faculty",
    href: "/admin/faculty",
    icon: UserCheck,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: BriefcaseBusiness,
  },
  {
    label: "Admissions",
    href: "/admin/admissions",
    icon: FileCheck2,
  },
  {
    label: "Programs",
    href: "/admin/programs",
    icon: BookOpen,
  },
  {
    label: "Classes",
    href: "/admin/classes",
    icon: Presentation,
  },
  {
    label: "Submissions",
    href: "/admin/submissions",
    icon: FileText,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const clientNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/client-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/client-dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Services",
    href: "/client-dashboard/services",
    icon: Wrench,
  },
  {
    label: "Deliverables",
    href: "/client-dashboard/deliverables",
    icon: PackageCheck,
  },
  {
    label: "Requests",
    href: "/client-dashboard/requests",
    icon: FileText,
  },
  {
    label: "Meetings",
    href: "/client-dashboard/meetings",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    href: "/client-dashboard/messages",
    icon: MessageSquare,
  },
  {
    label: "Documents",
    href: "/client-dashboard/documents",
    icon: FileArchive,
  },
  {
    label: "Payments",
    href: "/client-dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    href: "/client-dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/client-dashboard/settings",
    icon: Settings,
  },
];

export function getDashboardNavigation(
  role: DashboardRole,
): DashboardNavigationItem[] {
  if (role === "admin") {
    return adminNavigation;
  }

  if (role === "client") {
    return clientNavigation;
  }

  return facultyNavigation;
}

export function getRoleTitle(
  role: DashboardRole,
): string {
  if (role === "admin") {
    return "Administrator";
  }

  if (role === "client") {
    return "Prime Digital Solutions";
  }

  return "Mathematics Department";
}



