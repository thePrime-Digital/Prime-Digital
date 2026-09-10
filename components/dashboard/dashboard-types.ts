import type { LucideIcon } from "lucide-react";

export type DashboardRole =
  | "student"
  | "faculty"
  | "admin"
  | "client";

export type DashboardUser = {
  name: string;
  email: string;
};

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};