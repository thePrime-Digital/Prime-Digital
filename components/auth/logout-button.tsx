"use client";

import {
  useState,
} from "react";

export default function LogoutButton() {
  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error: unknown) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#8f0024] px-5 text-sm font-black text-white transition hover:bg-[#70001c] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
