"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useContactAuth } from "self-iam";

import { SelfIAMProvider } from "../providers";

const CAMPUS_IMAGE = "/pds-assets/campus-building.jpg";

type SignupRole = "student" | "faculty";
type StudentLevel = "foundation" | "Profession";

const studentLevelOptions: {
  value: StudentLevel;
  label: string;
}[] = [
  {
    value: "foundation",
    label: "Foundation Programs (6th–12th Standard)",
  },
  {
    value: "Profession",
    label: "Professional Programs",
  },
];

const foundationClasses = [
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
];

const foundationProgramOptions: Record<string, string[]> = {
  "6th Standard": [
    "Digital Foundations & Smart Computing",
    "Creative Coding with Scratch",
    "Young Game Creators",
    "Junior Robotics & Electronics",
    "Digital Design & Creativity",
    "AI for Young Learners",
  ],

  "7th Standard": [
    "Digital Foundations & Smart Computing",
    "Creative Coding with Scratch",
    "Young Game Creators",
    "Junior Robotics & Electronics",
    "Digital Design & Creativity",
    "AI for Young Learners",
  ],

  "8th Standard": [
    "Python Programming Foundations",
    "Web Development Fundamentals",
    "AI & Prompt Engineering",
    "Robotics & IoT Foundations",
    "Cybersecurity & Digital Safety",
    "Data Skills & Spreadsheets",
    "UI/UX & Product Design",
    "App Building Fundamentals",
  ],

  "9th Standard": [
    "Python Programming Foundations",
    "Web Development Fundamentals",
    "AI & Prompt Engineering",
    "Robotics & IoT Foundations",
    "Cybersecurity & Digital Safety",
    "Data Skills & Spreadsheets",
    "UI/UX & Product Design",
    "App Building Fundamentals",
  ],

  "10th Standard": [
    "Python Development & Automation",
    "Front-End Web Development",
    "Applied AI & Generative AI",
    "Robotics & IoT Projects",
    "Cybersecurity Foundations",
    "Data Analytics Foundations",
    "Digital Product & UI/UX Design",
    "Tech Entrepreneurship",
    "Capstone & Portfolio Development",
  ],

  "11th Standard": [
    "Advanced Python & DSA",
    "Full-Stack Web Development",
    "AI & Machine Learning",
    "Data Analytics & Power BI",
    "Cybersecurity & Ethical Hacking",
    "Cloud Computing & DevOps",
    "UI/UX & Digital Product Design",
    "Startup & Tech Entrepreneurship",
    "Career Capstone & Portfolio",
  ],

  "12th Standard": [
    "Advanced Python & DSA",
    "Full-Stack Web Development",
    "AI & Machine Learning",
    "Data Analytics & Power BI",
    "Cybersecurity & Ethical Hacking",
    "Cloud Computing & DevOps",
    "UI/UX & Digital Product Design",
    "Startup & Tech Entrepreneurship",
    "Career Capstone & Portfolio",
  ],
};

const professionalProgramOptions = [
  "Technology & Coding",
  "AI, Robotics & Future Tech",
  "Business & Digital Marketing",
  "Design & Creative Arts",
  "Entrepreneurship & Innovation",
];

function getProgramOptions(
  studentLevel: StudentLevel,
  currentClass: string,
): string[] {
  if (studentLevel === "foundation") {
    return foundationProgramOptions[currentClass] ?? [];
  }

  return professionalProgramOptions;
}

function SignupForm() {
  const router = useRouter();
  const auth = useContactAuth();

  const [role, setRole] =
    useState<SignupRole>("student");

  const [studentLevel, setStudentLevel] =
    useState<StudentLevel>("foundation");

  const [currentClass, setCurrentClass] =
    useState("");

  const [selectedProgram, setSelectedProgram] =
    useState("");

  const [customProgram, setCustomProgram] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [passwordValue, setPasswordValue] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const programOptions =
    getProgramOptions(
      studentLevel,
      currentClass,
    );

  const passwordHasLength =
    passwordValue.length >= 8;

  const passwordHasNumber =
    /\d/.test(passwordValue);

  const passwordHasSpecial =
    /[^A-Za-z0-9]/.test(
      passwordValue,
    );

  const fieldClass =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10";

  const labelClass =
    "mb-1 block text-xs font-bold text-[#111827]";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const name =
      String(
        formData.get(
          "name",
        ) ?? "",
      ).trim();

    const email =
      String(
        formData.get(
          "email",
        ) ?? "",
      ).trim();

    const phone =
      String(
        formData.get(
          "phone",
        ) ?? "",
      ).trim();

    const password =
      String(
        formData.get(
          "password",
        ) ?? "",
      );

    const confirmPassword =
      String(
        formData.get(
          "confirmPassword",
        ) ?? "",
      );

    const selectedStudentLevel =
      String(
        formData.get(
          "studentLevel",
        ) ?? "",
      ).trim();

    const selectedCurrentClass =
      String(
        formData.get(
          "currentClass",
        ) ?? "",
      ).trim();

    const selectedProgramOption =
      String(
        formData.get(
          "program",
        ) ?? "",
      ).trim();

    const customProgramName =
      String(
        formData.get(
          "customProgram",
        ) ?? "",
      ).trim();

    const program =
      selectedProgramOption ===
      "Others"
        ? customProgramName
        : selectedProgramOption;

    const parentPhone =
      String(
        formData.get(
          "parentPhone",
        ) ?? "",
      ).trim();

    const subjectExpertise =
      String(
        formData.get(
          "subjectExpertise",
        ) ?? "",
      ).trim();

    const experience =
      String(
        formData.get(
          "experience",
        ) ?? "",
      ).trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "Password and confirm password do not match.",
      );

      return;
    }

    if (
      role === "student" &&
      !selectedStudentLevel
    ) {
      setErrorMessage(
        "Please select your program level.",
      );

      return;
    }

    if (
      role === "student" &&
      studentLevel ===
        "foundation" &&
      !selectedCurrentClass
    ) {
      setErrorMessage(
        "Please select your current standard.",
      );

      return;
    }

    if (
      role === "student" &&
      selectedProgramOption ===
        "Others" &&
      !customProgramName
    ) {
      setErrorMessage(
        "Please enter the program name you want.",
      );

      return;
    }

    if (
      role === "student" &&
      !program
    ) {
      setErrorMessage(
        "Please select a program.",
      );

      return;
    }

    if (
      role === "student" &&
      studentLevel ===
        "foundation" &&
      !parentPhone
    ) {
      setErrorMessage(
        "Please enter the parent phone number.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const effectiveCurrentClass =
        selectedStudentLevel ===
        "foundation"
          ? selectedCurrentClass
          : "working";

      const response =
        await fetch(
          "/api/auth/signup",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              phone,
              password,
              role,

              ...(role ===
              "student"
                ? {
                    studentLevel:
                      selectedStudentLevel,

                    currentClass:
                      effectiveCurrentClass,

                    degreeName: "",

                    program,

                    parentPhone:
                      selectedStudentLevel ===
                      "foundation"
                        ? parentPhone
                        : "",
                  }
                : {}),

              ...(role ===
              "faculty"
                ? {
                    subjectExpertise,
                    experience,
                  }
                : {}),
            }),
          },
        );

      const data =
        (await response
          .json()
          .catch(
            () => null,
          )) as {
          message?: string;
          error?: string;
          requiresApproval?: boolean;
        } | null;

      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to create your account right now.",
        );
      }

      setSuccessMessage(
        data?.message ??
          (
            role ===
            "faculty"
              ? "Your faculty application has been submitted for approval."
              : "Your account has been created successfully."
          ),
      );

      setSubmitted(true);

      form.reset();

      setSelectedProgram("");
      setCustomProgram("");

      if (
        role !==
        "faculty"
      ) {
        window.setTimeout(
          () => {
            router.push(
              "/login?registered=1",
            );
          },
          1500,
        );
      }
    } catch (
      error: unknown
    ) {
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

      <section className="relative z-10 grid min-h-[calc(100vh-118px)] items-start gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:px-14">
        {/* LEFT SIDE */}

        <div className="hidden lg:block lg:pt-16">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#fff1f4] px-4 py-2 text-sm font-black text-[#8f0024] shadow-sm">
              <span>
                👥
              </span>

              Join Our Community
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-[#111827]">
              Create Your Account

              <br />

              & Start Learning

              <br />

              With{" "}

              <span className="text-[#8f0024]">
                Prime Digital
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base font-medium leading-7 text-[#4b5563]">
              Join thousands of
              learners gaining
              in-demand skills and
              building successful
              careers with Prime
              Digital School.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Expert-Led Courses",
                "Industry Recognized Certificates",
                "Career Support & Guidance",
                "Learn Anytime, Anywhere",
              ].map(
                (
                  item,
                ) => (
                  <div
                    key={
                      item
                    }
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8f0024] text-xs font-black text-white">
                      ✓
                    </span>

                    <span className="text-sm font-black text-[#111827]">
                      {
                        item
                      }
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* SIGNUP CARD */}

        <div className="mx-auto w-full max-w-[560px]">
          <div className="rounded-[18px] border border-white/90 bg-white/[0.985] px-6 py-7 shadow-[0_30px_90px_rgba(35,0,12,0.30)] backdrop-blur-2xl sm:px-8 sm:py-8">
            {!submitted ? (
              <>
                {/* HEADING */}

                <div className="mb-4">
                  <h2 className="text-[30px] font-black leading-tight tracking-[-1px] text-[#111111]">
                    Create Your{" "}

                    <span className="text-[#8f0024]">
                      Account
                    </span>
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Get started with
                    Prime Digital
                    School
                  </p>
                </div>

                {/* ROLE */}

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={
                      isSubmitting
                    }
                    onClick={() => {
                      setRole(
                        "student",
                      );

                      setErrorMessage(
                        "",
                      );
                    }}
                    className={[
                      "h-10 rounded-md border text-sm font-bold transition",

                      role ===
                      "student"
                        ? "border-[#8f0024] bg-[#8f0024] text-white shadow-sm"
                        : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    Student
                  </button>

                  <button
                    type="button"
                    disabled={
                      isSubmitting
                    }
                    onClick={() => {
                      setRole(
                        "faculty",
                      );

                      setErrorMessage(
                        "",
                      );
                    }}
                    className={[
                      "h-10 rounded-md border text-sm font-bold transition",

                      role ===
                      "faculty"
                        ? "border-[#8f0024] bg-[#8f0024] text-white shadow-sm"
                        : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    Faculty
                  </button>
                </div>

                {/* FORM */}

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-3"
                >
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="signup-name"
                      className={
                        labelClass
                      }
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                        />

                        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                      </svg>

                      <input
                        id="signup-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="signup-email"
                      className={
                        labelClass
                      }
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />

                        <path d="m3 7 9 6 9-6" />
                      </svg>

                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email address"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10"
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className={
                        labelClass
                      }
                    >
                      Mobile Number
                    </label>

                    <div className="flex gap-2">
                      <div className="flex h-10 w-[104px] flex-shrink-0 items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700">
                        <span>
                          🇮🇳
                        </span>

                        <span>
                          +91
                        </span>

                        <span className="text-[9px] text-slate-500">
                          ▼
                        </span>
                      </div>

                      <div className="relative flex-1">
                        <input
                          id="signup-phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          required
                          placeholder="Enter your mobile number"
                          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label
                      htmlFor="signup-password"
                      className={
                        labelClass
                      }
                    >
                      Create Password
                    </label>

                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="10"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>

                      <input
                        id="signup-password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={
                          8
                        }
                        autoComplete="new-password"
                        value={
                          passwordValue
                        }
                        onChange={(
                          event,
                        ) =>
                          setPasswordValue(
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Create a strong password"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-12 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (
                              value,
                            ) =>
                              !value,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500"
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2 text-[9px] leading-4">
                      <span
                        className={
                          passwordHasLength
                            ? "font-semibold text-emerald-600"
                            : "text-slate-400"
                        }
                      >
                        ✓ At least 8
                        characters
                      </span>

                      <span
                        className={
                          passwordHasNumber
                            ? "font-semibold text-emerald-600"
                            : "text-slate-400"
                        }
                      >
                        ✓ One number
                      </span>

                      <span
                        className={
                          passwordHasSpecial
                            ? "font-semibold text-emerald-600"
                            : "text-slate-400"
                        }
                      >
                        ✓ One special
                        character
                      </span>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>
                    <label
                      htmlFor="signup-confirm-password"
                      className={
                        labelClass
                      }
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="10"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>

                      <input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={
                          8
                        }
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-12 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024] focus:ring-2 focus:ring-[#8f0024]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              value,
                            ) =>
                              !value,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500"
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* STUDENT */}

                  {role ===
                    "student" && (
                    <div className="space-y-3 border-t border-slate-100 pt-3">
                      {/* LEVEL */}

                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Program Level
                        </label>

                        <select
                          name="studentLevel"
                          value={
                            studentLevel
                          }
                          required
                          onChange={(
                            event,
                          ) => {
                            const value =
                              event
                                .target
                                .value as StudentLevel;

                            setStudentLevel(
                              value,
                            );

                            setCurrentClass(
                              value ===
                                "Profession"
                                ? "working"
                                : "",
                            );

                            setSelectedProgram(
                              "",
                            );

                            setCustomProgram(
                              "",
                            );
                          }}
                          className={
                            fieldClass
                          }
                        >
                          {studentLevelOptions.map(
                            (
                              option,
                            ) => (
                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {
                                  option.label
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {/* STANDARD */}

                      {studentLevel ===
                        "foundation" && (
                        <div>
                          <label
                            className={
                              labelClass
                            }
                          >
                            Current
                            Standard
                          </label>

                          <select
                            name="currentClass"
                            value={
                              currentClass
                            }
                            required
                            onChange={(
                              event,
                            ) => {
                              setCurrentClass(
                                event
                                  .target
                                  .value,
                              );

                              setSelectedProgram(
                                "",
                              );

                              setCustomProgram(
                                "",
                              );
                            }}
                            className={
                              fieldClass
                            }
                          >
                            <option
                              value=""
                              disabled
                            >
                              Select your
                              standard
                            </option>

                            {foundationClasses.map(
                              (
                                item,
                              ) => (
                                <option
                                  key={
                                    item
                                  }
                                  value={
                                    item
                                  }
                                >
                                  {
                                    item
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      )}

                      {/* PROFESSIONAL CLASS */}

                      {studentLevel ===
                        "Profession" && (
                        <input
                          type="hidden"
                          name="currentClass"
                          value="working"
                        />
                      )}

                      {/* PROGRAM */}

                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Select Program
                        </label>

                        <select
                          key={`${studentLevel}-${currentClass}`}
                          name="program"
                          value={
                            selectedProgram
                          }
                          required
                          disabled={
                            studentLevel ===
                              "foundation" &&
                            !currentClass
                          }
                          onChange={(
                            event,
                          ) => {
                            const value =
                              event
                                .target
                                .value;

                            setSelectedProgram(
                              value,
                            );

                            if (
                              value !==
                              "Others"
                            ) {
                              setCustomProgram(
                                "",
                              );
                            }
                          }}
                          className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
                        >
                          <option
                            value=""
                            disabled
                          >
                            {studentLevel ===
                              "foundation" &&
                            !currentClass
                              ? "Select your standard first"
                              : "Select a program"}
                          </option>

                          {programOptions.map(
                            (
                              programName,
                            ) => (
                              <option
                                key={
                                  programName
                                }
                                value={
                                  programName
                                }
                              >
                                {
                                  programName
                                }
                              </option>
                            ),
                          )}

                          {(studentLevel ===
                            "Profession" ||
                            Boolean(
                              currentClass,
                            )) && (
                            <option value="Others">
                              Others
                            </option>
                          )}
                        </select>
                      </div>

                      {/* CUSTOM PROGRAM */}

                      {selectedProgram ===
                        "Others" && (
                        <div className="rounded-lg border border-[#8f0024]/10 bg-[#fff7f8] p-3">
                          <label
                            htmlFor="signup-custom-program"
                            className={
                              labelClass
                            }
                          >
                            Program Name
                          </label>

                          <input
                            id="signup-custom-program"
                            name="customProgram"
                            type="text"
                            required
                            minLength={
                              2
                            }
                            maxLength={
                              120
                            }
                            value={
                              customProgram
                            }
                            onChange={(
                              event,
                            ) =>
                              setCustomProgram(
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="Enter the program you want to learn"
                            className={
                              fieldClass
                            }
                          />

                          <p className="mt-2 text-[10px] leading-4 text-slate-500">
                            Can&apos;t
                            find your
                            preferred
                            program above?
                            Enter the
                            program you
                            want and our
                            team will
                            review your
                            request.
                          </p>
                        </div>
                      )}

                      {/* PARENT PHONE */}

                      {studentLevel ===
                        "foundation" && (
                        <div>
                          <label
                            className={
                              labelClass
                            }
                          >
                            Parent Phone
                            Number
                          </label>

                          <input
                            name="parentPhone"
                            type="tel"
                            inputMode="numeric"
                            required
                            placeholder="Parent contact number"
                            className={
                              fieldClass
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* FACULTY */}

                  {role ===
                    "faculty" && (
                    <div className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Subject
                          Expertise
                        </label>

                        <input
                          name="subjectExpertise"
                          type="text"
                          required
                          placeholder="Maths, Coding, AI..."
                          className={
                            fieldClass
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Experience
                        </label>

                        <select
                          name="experience"
                          defaultValue=""
                          required
                          className={
                            fieldClass
                          }
                        >
                          <option
                            value=""
                            disabled
                          >
                            Select
                            experience
                          </option>

                          <option>
                            0 - 1 Year
                          </option>

                          <option>
                            1 - 3 Years
                          </option>

                          <option>
                            3 - 5 Years
                          </option>

                          <option>
                            5+ Years
                          </option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* TERMS */}

                  <label className="flex cursor-pointer items-start gap-2 pt-1 text-[10px] leading-4 text-slate-700">
                    <input
                      type="checkbox"
                      required
                      className="mt-[1px] h-4 w-4 flex-shrink-0 accent-[#8f0024]"
                    />

                    <span>
                      I agree to the{" "}

                      <Link
                        href="/terms"
                        className="font-semibold text-[#8f0024] hover:underline"
                      >
                        Terms &
                        Conditions
                      </Link>{" "}

                      and{" "}

                      <Link
                        href="/privacy-policy"
                        className="font-semibold text-[#8f0024] hover:underline"
                      >
                        Privacy Policy
                      </Link>{" "}

                      of Prime Digital
                      School.
                    </span>
                  </label>

                  {/* ERROR */}

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
                    >
                      {
                        errorMessage
                      }
                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                    className="flex h-11 w-full items-center rounded-md bg-[#8f0024] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(143,0,36,0.22)] transition hover:bg-[#74001d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex-1 text-center">
                      {isSubmitting
                        ? role ===
                          "faculty"
                          ? "Submitting Application..."
                          : "Creating Account..."
                        : role ===
                            "faculty"
                          ? "Submit Application"
                          : "Create Account"}
                    </span>

                    {!isSubmitting && (
                      <span className="text-lg">
                        →
                      </span>
                    )}
                  </button>
                </form>

                {/* OR */}

                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-[10px] font-medium text-slate-500">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* SOCIAL */}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      auth.isConfigured &&
                      auth.signInWithGoogle()
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="font-black text-[#4285F4]">
                      G
                    </span>

                    Continue with Google
                  </button>

                  <button
                    type="button"
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="grid grid-cols-2 gap-[1px]">
                      <i className="h-[5px] w-[5px] bg-[#f35325]" />
                      <i className="h-[5px] w-[5px] bg-[#81bc06]" />
                      <i className="h-[5px] w-[5px] bg-[#05a6f0]" />
                      <i className="h-[5px] w-[5px] bg-[#ffba08]" />
                    </span>

                    Continue with
                    Microsoft
                  </button>
                </div>

                <p className="mt-4 text-center text-[11px] font-medium text-slate-600">
                  Already have an
                  account?{" "}

                  <Link
                    href="/login"
                    className="font-bold text-[#8f0024] hover:underline"
                  >
                    Login Now
                  </Link>
                </p>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f4] text-3xl font-black text-[#8f0024]">
                  ✓
                </div>

                <h2 className="mt-5 text-3xl font-black text-[#111827]">
                  {role ===
                  "faculty"
                    ? "Application Submitted"
                    : "Account Created"}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  {successMessage ||
                    (
                      role ===
                      "faculty"
                        ? "Your faculty account has been submitted for admin approval. You will be notified once approved."
                        : "Your account has been created successfully. You will be redirected to login."
                    )}
                </p>

                <Link
                  href="/login"
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-[#8f0024] px-7 text-sm font-bold text-white transition hover:bg-[#74001d]"
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