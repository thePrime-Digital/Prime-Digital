"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useContactAuth } from "self-iam";
import { SelfIAMProvider } from "../providers";

const CAMPUS_IMAGE = "/pds-assets/campus-building.jpg";
const LOGO_IMAGE = "/pds-assets/pds-logo-real-transparent.png";

type SignupRole = "student" | "faculty" | "client";

const roles: {
  id: SignupRole;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "student",
    title: "Student",
    desc: "Learn programs and access your student dashboard.",
    icon: "🎓",
  },
  {
    id: "faculty",
    title: "Faculty",
    desc: "Teach, guide students and manage learning.",
    icon: "👩‍🏫",
  },
  {
    id: "client",
    title: "Client",
    desc: "Access programs, services and digital solutions.",
    icon: "💼",
  },
];

function SignupForm() {
  const router = useRouter();
  const auth = useContactAuth();

  const [role, setRole] = useState<SignupRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            message?: string;
            error?: string;
            requiresApproval?: boolean;
          }
        | null;

      if (!response.ok) {
        throw new Error(
          data?.error ?? "Unable to create your account right now.",
        );
      }

      setSuccessMessage(
        data?.message ??
          (role === "faculty"
            ? "Your faculty application has been submitted for approval."
            : "Your account has been created successfully."),
      );
      setSubmitted(true);
      form.reset();

      if (role !== "faculty") {
        window.setTimeout(() => {
          router.push("/login?registered=1");
        }, 1500);
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1b050c] pt-[118px]">
      <Image
        src={CAMPUS_IMAGE}
        alt="Prime Digital School campus"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/82 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <section className="relative z-10 grid min-h-[calc(100vh-118px)] items-center gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:px-14">
        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#fff1f4] px-4 py-2 text-sm font-black text-[#8f0024] shadow-sm">
              <span>👥</span>
              Join Our Community
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-[#111827]">
              Create Your Account
              <br />
              & Start Learning
              <br />
              With{" "}
              <span className="text-[#8f0024]">Prime Digital</span>
            </h1>

            <p className="mt-6 max-w-md text-base font-medium leading-7 text-[#4b5563]">
              Join thousands of learners gaining in-demand skills and building
              successful careers with Prime Digital School.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Expert-Led Courses",
                "Industry Recognized Certificates",
                "Career Support & Guidance",
                "Learn Anytime, Anywhere",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8f0024] text-xs font-black text-white">
                    ✓
                  </span>
                  <span className="text-sm font-black text-[#111827]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative mt-10 h-[310px] w-[310px]">
              <Image
                src={LOGO_IMAGE}
                alt="Prime Digital School"
                fill
                priority
                sizes="310px"
                className="object-contain mix-blend-multiply drop-shadow-[0_22px_35px_rgba(60,0,15,0.28)]"
              />
            </div>
          </div>
        </div>

        {/* SIGNUP CARD */}
        <div className="mx-auto w-full max-w-[560px]">
          <div className="rounded-[2rem] border border-white/80 bg-white/[0.98] p-6 shadow-[0_35px_100px_rgba(35,0,12,0.38)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="relative h-20 w-20">
                <Image
                  src={LOGO_IMAGE}
                  alt="Prime Digital School"
                  fill
                  priority
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              <select
                defaultValue="English"
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            {!submitted ? (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-black tracking-tight text-[#111827] sm:text-4xl">
                    Create <span className="text-[#8f0024]">Your</span> Account
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Let&apos;s get started with your learning journey
                  </p>
                </div>

                {/* ROLE SELECT */}
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                  {roles.map((item) => {
                    const active = role === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          setRole(item.id);
                          setErrorMessage("");
                        }}
                        className={[
                          "rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1",
                          active
                            ? "border-[#8f0024] bg-[#fff1f4] shadow-[0_14px_28px_rgba(143,0,36,0.12)]"
                            : "border-slate-200 bg-white hover:border-[#8f0024]/35",
                        ].join(" ")}
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <p
                          className={[
                            "mt-2 text-sm font-black",
                            active ? "text-[#8f0024]" : "text-[#111827]",
                          ].join(" ")}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-slate-500">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-black text-[#111827]">
                      {role === "client" ? "Full Name / Company Name" : "Full Name"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f0024]">
                        ♙
                      </span>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder={
                          role === "client"
                            ? "Enter your name or company name"
                            : "Enter your full name"
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#111827]">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f0024]">
                          ✉
                        </span>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="Enter your email"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black text-[#111827]">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f0024]">
                          ☎
                        </span>
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder="Enter your phone number"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#111827]">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f0024]">
                          🔒
                        </span>
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          placeholder="Create password"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black text-[#111827]">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f0024]">
                          🔒
                        </span>
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          placeholder="Confirm password"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500"
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {role === "student" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-black text-[#111827]">
                          Select Program
                        </label>
                        <select
                          name="program"
                          defaultValue=""
                          required
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        >
                          <option value="" disabled>
                            Select a program
                          </option>
                          <option>Technology & Coding</option>
                          <option>AI, Robotics & Future Tech</option>
                          <option>Business & Digital Marketing</option>
                          <option>Design & Creative Arts</option>
                          <option>Entrepreneurship & Innovation</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-black text-[#111827]">
                          Parent Phone Number
                        </label>
                        <input
                          name="parentPhone"
                          type="tel"
                          placeholder="Parent contact number"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                      </div>
                    </div>
                  )}

                  {role === "faculty" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-black text-[#111827]">
                          Subject Expertise
                        </label>
                        <input
                          name="subjectExpertise"
                          type="text"
                          required
                          placeholder="Maths, Coding, AI, English..."
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-black text-[#111827]">
                          Experience
                        </label>
                        <select
                          name="experience"
                          defaultValue=""
                          required
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                        >
                          <option value="" disabled>
                            Select experience
                          </option>
                          <option>0 - 1 Year</option>
                          <option>1 - 3 Years</option>
                          <option>3 - 5 Years</option>
                          <option>5+ Years</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {role === "client" && (
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#111827]">
                        Interest
                      </label>
                      <select
                        name="interest"
                        defaultValue=""
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                      >
                        <option value="" disabled>
                          Select your interest
                        </option>
                        <option>Prime Digital School Programs</option>
                        <option>Prime Digital Solutions</option>
                        <option>Website / App Development</option>
                        <option>AI Automation</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 text-xs font-semibold leading-5 text-slate-600">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 accent-[#8f0024]"
                    />
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-black text-[#8f0024] underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-black text-[#8f0024] underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-13 min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[#8f0024] text-sm font-black text-white shadow-[0_14px_28px_rgba(143,0,36,0.24)] transition hover:bg-[#70001c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                    {!isSubmitting && <span className="text-lg">→</span>}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => auth.isConfigured && auth.signInWithGoogle()}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="font-black text-[#4285F4]">G</span>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="grid grid-cols-2 gap-[2px]">
                      <i className="h-[6px] w-[6px] bg-[#f35325]" />
                      <i className="h-[6px] w-[6px] bg-[#81bc06]" />
                      <i className="h-[6px] w-[6px] bg-[#05a6f0]" />
                      <i className="h-[6px] w-[6px] bg-[#ffba08]" />
                    </span>
                    Continue with Microsoft
                  </button>
                </div>

                <p className="mt-6 text-center text-sm font-semibold text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-black text-[#8f0024] hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f4] text-3xl">
                  ✓
                </div>

                <h2 className="mt-5 text-3xl font-black text-[#111827]">
                  {role === "faculty"
                    ? "Application Submitted"
                    : "Account Created"}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  {successMessage ||
                    (role === "faculty"
                      ? "Your faculty account has been submitted for admin approval. You will be notified once approved."
                      : "Your account has been created successfully. You will be redirected to login.")}
                </p>

                <Link
                  href="/login"
                  className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-[#8f0024] px-7 text-sm font-black text-white transition hover:bg-[#70001c]"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SignupPage() {
  return (
    <SelfIAMProvider>
      <SignupForm />
    </SelfIAMProvider>
  );
}