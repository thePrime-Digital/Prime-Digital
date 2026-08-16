import {
  redirect,
} from "next/navigation";

import LogoutButton from "@/components/auth/logout-button";

import {
  getCurrentUser,
} from "@/lib/auth/current-user";

export const dynamic =
  "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  if (user.role === "client") {
    redirect("/client-dashboard");
  }

  if (
    user.role !== "student" &&
    user.role !== "faculty"
  ) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 pb-16 pt-36">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl bg-white p-7 shadow-xl sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8f0024]">
                Prime Digital School
              </p>

              <h1 className="mt-3 text-4xl font-black text-slate-950">
                {user.role === "faculty"
                  ? "Faculty Dashboard"
                  : "Student Dashboard"}
              </h1>

              <p className="mt-3 text-slate-600">
                Welcome, {user.name}.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-black text-amber-900">
              Dashboard design is under development.
            </p>

            <p className="mt-2 text-sm text-amber-800">
              Your login and role protection are working correctly.
            </p>

            <p className="mt-2 text-sm text-amber-800">
              Role: {user.role} · Status: {user.status}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
