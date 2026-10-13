import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default function ClientDashboardLayout({
  children: _children,
}: {
  children: ReactNode;
}) {
  redirect("/");
}