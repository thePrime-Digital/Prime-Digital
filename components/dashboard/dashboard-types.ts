import type { LucideIcon } from "lucide-react";

export type DashboardRole =
  | "student"
  | "faculty"
  | "staff"
  | "admin";

export type DashboardUser = {
  name: string;
  email: string;
};

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};