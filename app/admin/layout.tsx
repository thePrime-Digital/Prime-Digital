import "./admin-reference-final.css";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import AdminDashboardShell from "@/components/admin/admin-dashboard-shell";

import "./admin-theme.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "student") redirect("/dashboard");
  if (user.role === "faculty") redirect("/faculty");
  if (user.role === "staff") redirect("/staff");
  if (user.role !== "admin" || user.status !== "active") {
    redirect("/login");
  }

  return (
    <AdminDashboardShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </AdminDashboardShell>
  );
}