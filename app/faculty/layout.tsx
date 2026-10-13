import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import FacultyDashboardShell from "@/components/faculty/faculty-dashboard-shell";
import { getCurrentUser } from "@/lib/auth/current-user";

import "./faculty-theme.css";

export const dynamic = "force-dynamic";

export default async function FacultyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  if (user.role === "staff") {
    redirect("/staff");
  }

  if (user.role === "student") {
    redirect("/dashboard");
  }

  if (user.role !== "faculty") {
    redirect("/login");
  }

  if (user.status !== "active") {
    redirect("/login");
  }

  return (
    <FacultyDashboardShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </FacultyDashboardShell>
  );
}