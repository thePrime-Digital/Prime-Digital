import type {
  ReactNode,
} from "react";

import {
  redirect,
} from "next/navigation";

import DashboardShell from "@/components/dashboard/dashboard-shell";

import {
  getCurrentUser,
} from "@/lib/auth/current-user";

export const dynamic =
  "force-dynamic";

export default async function FacultyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  if (user.role === "client") {
    redirect("/client-dashboard");
  }

  if (user.role === "student") {
    redirect("/dashboard");
  }

  if (user.role !== "faculty") {
    redirect("/login");
  }

  return (
    <DashboardShell
      role="faculty"
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardShell>
  );
}
