import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import StaffDashboardShell from "@/components/staff/staff-dashboard-shell";
import "./staff-theme.css";

export const dynamic = "force-dynamic";

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");
  if (user.role === "faculty") redirect("/faculty");
  if (user.role === "student") redirect("/dashboard");
  if (user.role !== "staff" || user.status !== "active") redirect("/login");

  return (
    <StaffDashboardShell
      user={{ name: user.name, email: user.email }}
    >
      {children}
    </StaffDashboardShell>
  );
}