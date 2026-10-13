
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import StudentDashboardShell from "@/components/student/student-dashboard-shell";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export default async function StudentDashboardLayout({
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

  if (user.role === "faculty") {
    redirect("/faculty");
  }

  if (user.role === "staff") {
    redirect("/staff");
  }

  if (user.role !== "student") {
    redirect("/login");
  }

  if (user.status !== "active") {
    redirect("/login");
  }

  return (
    <StudentDashboardShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </StudentDashboardShell>
  );
}
