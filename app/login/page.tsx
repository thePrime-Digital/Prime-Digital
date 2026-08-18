"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useContactAuth } from "self-iam";
import { SelfIAMProvider } from "../providers";

const CAMPUS_IMAGE = "/login/campus-building.png";
const NORMAL_SHIELD = "/login/normal-shield.png";
const SPINNING_3D_LOGO = "/login/logo-3d-transparent.png";
const LOGIN_HERO_IMAGE = "/login/login-hero.jpeg";

function LoginForm() {
  const auth = useContactAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data: { error?: string; redirectTo?: string } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        // Server returned non-JSON (e.g. HTML error page)
      }

      if (!response.ok) {
        setError(data.error || "Unable to log in. Please try again.");
        return;
      }

      window.location.assign(data.redirectTo || "/dashboard");
    } catch (requestError) {
      console.error("Login request failed:", requestError);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page relative min-h-screen isolate overflow-hidden bg-[#220009] pt-[118px]">
      {/* Background */}
      <Image
        src={CAMPUS_IMAGE}
        alt="Prime Digital School campus"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      {/* Left 3D logo area */}
      <section className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[57%] items-center justify-center lg:flex">
        <div className="relative h-[min(68vh,650px)] w-[min(34vw,500px)]">
          <Image
            src={SPINNING_3D_LOGO}
            alt="Prime Digital School 3D shield"
            fill
            priority
            loading="eager"
            unoptimized
            sizes="34vw"
            className="premium-logo-spin object-contain"
          />
        </div>
      </section>

      {/* Login card */}
      <section className="relative z-30 ml-auto flex min-h-[calc(100vh-118px)] w-full items-center justify-center px-5 py-6 sm:px-8 lg:w-[42%] lg:justify-center lg:px-8 xl:px-12">
        <div className="w-full max-w-[455px] rounded-[2rem] border border-white/80 bg-white/[0.98] p-7 shadow-[0_30px_90px_rgba(20,0,7,0.42)] backdrop-blur-2xl sm:p-8">
          {/* Top */}
          <div className="mb-7 flex items-start justify-between">
            <div className="relative h-14 w-14">
              <Image
                src={NORMAL_SHIELD}
                alt="Prime Digital School"
                fill
                priority
                sizes="56px"
                className="object-contain"
              />
            </div>

            <select
              defaultValue="English"
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#9b0023] focus:ring-4 focus:ring-[#9b0023]/10"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-950">
              Welcome Back!
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#9b0023]">
              Continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b0023]"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9b0023] focus:bg-white focus:ring-4 focus:ring-[#9b0023]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b0023]"
                >
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9b0023] focus:bg-white focus:ring-4 focus:ring-[#9b0023]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9b0023]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                <input type="checkbox" className="h-4 w-4 accent-[#9b0023]" />
                Remember me
              </label>

              <a
                href="/forgot-password"
                className="text-xs font-bold text-[#9b0023] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#9b0023] text-sm font-bold text-white shadow-[0_14px_26px_rgba(155,0,35,0.28)] transition hover:bg-[#780018] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login to Your Portal"}
              {!loading && <span className="text-lg leading-none">→</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => auth.isConfigured && auth.signInWithGoogle()}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="font-black text-[#4285F4]">G</span>
              Google
            </button>

            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="grid grid-cols-2 gap-[2px]">
                <i className="h-[6px] w-[6px] bg-[#f35325]" />
                <i className="h-[6px] w-[6px] bg-[#81bc06]" />
                <i className="h-[6px] w-[6px] bg-[#05a6f0]" />
                <i className="h-[6px] w-[6px] bg-[#ffba08]" />
              </span>
              Microsoft
            </button>
          </div>
          <p className="mt-5 text-center text-sm font-semibold text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-black text-[#9b0023] hover:underline"
            >
              Create Account
            </Link>
          </p>
          {/* Bottom hero */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#9b0023]/15 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
            <Image
              src={LOGIN_HERO_IMAGE}
              alt="Prime Digital School mission"
              fill
              sizes="455px"
              className="scale-[1.04] object-cover object-left -translate-x-6"
            />

            {/* Clean readable white side */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-[36%] via-white/70 via-[60%] to-white" />

            <div className="relative flex min-h-[128px] items-center justify-end px-5 py-4">
              <div className="w-[46%] max-w-[190px] text-right">
                <p className="text-[17px] font-black leading-[1.05] tracking-tight text-slate-950">
                  Your Future
                  <br />
                  <span className="text-[#9b0023]">Our Mission</span>
                </p>

                <p className="mt-2 text-[10.5px] leading-4 text-slate-600">
                  Empowering students to achieve excellence and build a better
                  tomorrow.
                </p>

                <a
                  href="/programs"
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#9b0023] px-4 py-2 text-[10px] font-bold text-white shadow-[0_8px_16px_rgba(155,0,35,0.22)] transition hover:bg-[#780018]"
                >
                  Know More
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
  .premium-logo-spin {
    animation: shieldFullSpin 22s linear infinite;
    transform-origin: center center;
    transform-style: preserve-3d;
    backface-visibility: visible;
    filter: drop-shadow(0 34px 28px rgba(35, 0, 10, 0.45));
    will-change: transform;
  }

  @keyframes shieldFullSpin {
    0% {
      transform: perspective(1800px) rotateX(2deg) rotateY(0deg) scale(1);
    }

    25% {
      transform: perspective(1800px) rotateX(2deg) rotateY(90deg) scale(0.96);
    }

    50% {
      transform: perspective(1800px) rotateX(2deg) rotateY(180deg) scale(1);
    }

    75% {
      transform: perspective(1800px) rotateX(2deg) rotateY(270deg) scale(0.96);
    }

    100% {
      transform: perspective(1800px) rotateX(2deg) rotateY(360deg) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .premium-logo-spin {
      animation: none;
    }
  }
`}</style>
    </main>
  );
}

export default function LoginPage() {
  return (
    <SelfIAMProvider>
      <LoginForm />
    </SelfIAMProvider>
  );
}
