"use client";

import { useEffect, useState, type FormEvent } from "react";
import { programs } from "@/lib/program-data";

import {
  FileText,
  CheckCircle2,
  Award,
  Phone,
  Mail,
  Star,
  UserCircle,
  GraduationCap,
  ClipboardList,
  ChevronDown,
  MessageCircle,
  Clock,
  BookOpen,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";

const admissionProgramsByGrade: Record<string, string[]> = {
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

const inputClass =
  "h-[49px] w-full rounded-lg border border-[#897172] bg-white px-4 text-[#1A1C1C] outline-none focus:border-[#5C021A] focus:ring-2 focus:ring-[#5C021A]/10";

const labelClass = "text-sm font-semibold tracking-[0.7px] text-[#1A1C1C]";

type AuthResponse = {
  authenticated?: boolean;
  user?: {
    role?: string;
    status?: string;
  };
};

export default function AdmissionsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successReference, setSuccessReference] = useState("");

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programMessage, setProgramMessage] = useState("");

  const [courseSlug, setCourseSlug] = useState("");
  const [courseName, setCourseName] = useState("");
  const [isCourseEnrolment, setIsCourseEnrolment] = useState(false);

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessError, setAccessError] = useState("");

  const availablePrograms = selectedGrade
    ? (admissionProgramsByGrade[selectedGrade] ?? [])
    : [];

  useEffect(() => {
    let cancelled = false;

    async function initialiseApplication() {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("course");

      // Normal admissions remain available without a course URL.
      if (!slug) {
        if (!cancelled) {
          setCheckingAccess(false);
        }
        return;
      }

      const selectedCourse = programs.find((item) => item.slug === slug);

      if (!selectedCourse) {
        window.location.replace("/programs");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = (await response.json()) as AuthResponse;

        if (!response.ok || !result.authenticated) {
          const courseUrl = `/programs/${encodeURIComponent(slug)}`;

          window.location.replace(
            `/login?next=${encodeURIComponent(courseUrl)}`,
          );
          return;
        }

        if (result.user?.role !== "student") {
          if (!cancelled) {
            setAccessError(
              "Course enrolment is available only through an active student account.",
            );
            setCheckingAccess(false);
          }
          return;
        }

        if (!cancelled) {
          setCourseSlug(slug);
          setCourseName(
            `${selectedCourse.title} ${selectedCourse.highlight}`.trim(),
          );
          setIsCourseEnrolment(true);
          setCheckingAccess(false);
        }
      } catch {
        if (!cancelled) {
          setAccessError(
            "We couldn't verify your student login. Please refresh the page and try again.",
          );
          setCheckingAccess(false);
        }
      }
    }

    void initialiseApplication();

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!checkingAccess && isCourseEnrolment) {
      document.getElementById("application-form")?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [checkingAccess, isCourseEnrolment]);
  async function handleAdmissionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || accessError || checkingAccess) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const program = isCourseEnrolment
      ? courseName
      : String(formData.get("program") ?? "").trim();

    if (!program) {
      setFormError("Please select a program before submitting.");
      return;
    }

    if (isCourseEnrolment && !courseSlug) {
      setFormError("The selected course could not be verified.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    setSuccessReference("");

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug: isCourseEnrolment ? courseSlug : undefined,

          studentName: formData.get("studentName"),
          parentName: formData.get("parentName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          grade: formData.get("grade"),
          program,
          currentSchool: formData.get("currentSchool"),
          message: formData.get("message"),
          consent: formData.get("consent") === "on",
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
        reference?: string;
      } | null;

      if (response.status === 401 && isCourseEnrolment) {
        const courseUrl = `/programs/${encodeURIComponent(courseSlug)}`;

        window.location.replace(`/login?next=${encodeURIComponent(courseUrl)}`);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit application.");
      }

      setSuccessReference(data?.reference || "Submitted");

      form.reset();
      setSelectedGrade("");
      setSelectedProgram("");
      setProgramMessage("");

      window.setTimeout(() => {
        document.getElementById("application-form")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F3F3] px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#DCC0C1] bg-white p-10 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#5C021A]/10">
            <LockKeyhole className="h-8 w-8 text-[#5C021A]" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#5C021A]">
            Preparing Your Application
          </h1>

          <p className="mt-3 text-sm text-[#5F5E5E]">
            Verifying student access and selected course...
          </p>
        </div>
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F3F3] px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#DCC0C1] bg-white p-10 text-center shadow-lg">
          <LockKeyhole className="mx-auto h-12 w-12 text-[#5C021A]" />

          <h1 className="mt-5 text-2xl font-bold text-[#5C021A]">
            Student Access Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#5F5E5E]">{accessError}</p>

          <a
            href={`/programs/${encodeURIComponent(
              new URLSearchParams(
                typeof window !== "undefined" ? window.location.search : "",
              ).get("course") || "",
            )}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5C021A] px-6 py-3 text-white"
          >
            Return to Course
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F3F3] pt-14 font-sans text-[#1A1C1C]">
      {/* HERO */}
      <section className="flex justify-center overflow-hidden bg-[#F3F3F3] px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-10 lg:flex-row lg:gap-24">
          <div className="relative z-10 flex w-full flex-col gap-5 lg:w-[604px]">
            <div className="w-fit rounded-full bg-[#FFDADB] px-4 py-1.5 text-sm font-medium tracking-[0.8px] text-[#5C021A]">
              {isCourseEnrolment
                ? "COURSE ENROLMENT APPLICATION"
                : "FALL 2026 ADMISSIONS OPEN"}
            </div>

            <h1 className="text-3xl font-bold leading-[1.25] tracking-[-0.96px] text-[#1A1C1C] md:text-[48px]">
              {isCourseEnrolment
                ? "Begin Your Learning Journey"
                : "Shape Your Future at Prime Digital Excellence"}
            </h1>

            <p className="max-w-[576px] text-base leading-[1.56] text-[#5F5E5E] md:text-lg">
              {isCourseEnrolment
                ? `Complete your application for ${courseName}. Our counsellor will contact you to discuss the course and next steps.`
                : "Join a vibrant community of innovators. Follow our streamlined admission process and take the first step towards a transformative educational experience."}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <a
                href="#application-form"
                className="rounded-lg bg-[#5C021A] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[#7B1C2E]"
              >
                Start Application
              </a>

              <a
                href="/downloads/prime-digital-school-prospectus.pdf"
                download
                className="rounded-lg border border-[#5C021A] bg-transparent px-8 py-4 text-base font-medium text-[#5C021A] transition-colors hover:bg-[#5C021A]/5"
              >
                Download Prospectus
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[350px] w-full justify-center md:min-h-[508px] lg:flex-1 lg:justify-end">
            <div className="absolute right-[-40px] top-[-40px] z-0 h-[256px] w-[256px] rounded-full bg-[#5C021A]/10 blur-[32px]" />

            <div className="relative z-10 flex h-[350px] w-full max-w-[596px] items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white/40 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] md:h-[500px]">
              <div className="absolute inset-0 bg-[#5C021A]/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION JOURNEY */}
      <section className="flex justify-center bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              The Admission Journey
            </h2>
            <div className="h-1 w-20 bg-[#5C021A]" />
          </div>

          <div className="relative mt-4 w-full max-w-[1232px]">
            <div className="absolute left-0 right-0 top-[32px] z-0 hidden h-[2px] bg-gradient-to-r from-[#5C021A] via-[#5C021A]/20 to-transparent md:block" />
            <div className="absolute bottom-0 left-[32px] top-0 z-0 w-[2px] bg-[#5C021A]/20 md:hidden" />

            <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:gap-4">
              {[
                {
                  icon: UserCircle,
                  description: "Submit your online application & documents.",
                },
                {
                  icon: ClipboardList,
                  description: "Initial review & academic screening.",
                },
                {
                  icon: MessageCircle,
                  description: isCourseEnrolment
                    ? "Counsellor contacts you to discuss the course."
                    : "Personal interview with faculty members.",
                },
                {
                  icon: CheckCircle2,
                  description: isCourseEnrolment
                    ? "Discuss course fees and payment arrangements."
                    : "Offer of admission extended.",
                },
                {
                  icon: GraduationCap,
                  description: "Enrollment & campus orientation.",
                },
              ].map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="flex w-full flex-row items-center gap-4 text-left md:w-[220px] md:flex-col md:text-center"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5C021A] shadow-md md:h-16 md:w-16">
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <h3 className="mb-1 text-base font-normal leading-[28px] text-[#5C021A] md:text-lg">
                        Step {index + 1}
                      </h3>

                      <p className="text-sm leading-[20px] text-[#5F5E5E]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="flex justify-center bg-[#F3F3F3] px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              Eligibility Criteria
            </h2>

            <p className="max-w-2xl text-sm leading-[24px] text-[#5F5E5E] md:text-base">
              Review the basic prerequisites needed before beginning your
              application process.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Age & Grade",
                description:
                  "Students applying for Foundation Programs should be currently studying in Grades 6 through 12.",
              },
              {
                icon: BookOpen,
                title: "Academic Background",
                description:
                  "Minimum 60% aggregate in the previous year's final examinations or equivalent grade certificate.",
              },
              {
                icon: FileText,
                title: "Documents Required",
                description:
                  "Valid birth certificate, transfer certificate, and academic transcripts from the last institution.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-4 rounded-xl border border-[#DCC0C1] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5C021A]/10">
                    <Icon className="h-5 w-5 text-[#5C021A]" />
                  </div>

                  <h3 className="font-serif text-base font-normal text-[#1A1C1C]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-[24px] text-[#5F5E5E] md:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEE STRUCTURE */}
      <section className="flex justify-center bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              Fee Structure
            </h2>

            <p className="max-w-xl text-sm leading-[24px] text-[#5F5E5E] md:text-base">
              Explore our tuition packages across different grade levels. Our
              counsellor will confirm the applicable fees.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {[
              {
                title: "Foundation",
                subtitle: "Grades 6th to 12th",
                label: "Foundation Programs",
                details:
                  "Build strong digital, coding, technology and future-ready skills alongside school education.",
                features: [
                  "Coding & Computer Fundamentals",
                  "AI, Robotics & Emerging Technology",
                  "Web, Data & Digital Skills",
                  "Projects, Portfolio & Career Exposure",
                ],
              },
              {
                title: "Professional Courses",
                subtitle: "Career-focused professional learning",
                label: "Career & Skill Programs",
                details:
                  "Industry-oriented programs designed to develop practical, job-ready and business-ready digital skills.",
                features: [
                  "Technology & Coding",
                  "AI, Robotics & Future Tech",
                  "Business & Digital Marketing",
                  "Design, Entrepreneurship & Innovation",
                ],
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`relative flex flex-col rounded-xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 md:p-8 ${
                  index === 1
                    ? "border-2 border-[#5C021A] shadow-[0px_20px_35px_-15px_rgba(92,2,26,0.25)]"
                    : "border border-[#DCC0C1] shadow-sm hover:shadow-lg"
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#5C021A] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    Professional
                  </div>
                )}

                <div className="mb-5">
                  <span className="inline-flex rounded-full bg-[#5C021A]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C021A]">
                    {item.label}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#1A1C1C]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-semibold text-[#5F5E5E]">
                  {item.subtitle}
                </p>

                <div className="mb-6 mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#5C021A]">TBD</span>
                  <span className="text-sm text-[#5F5E5E]">/ program</span>
                </div>

                <p className="mb-6 text-sm leading-6 text-[#5F5E5E]">
                  {item.details}
                </p>

                <ul className="mb-8 flex flex-1 flex-col gap-4">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5C021A]" />
                      <span className="text-sm leading-6 text-[#1A1C1C]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#application-form"
                  className={`flex min-h-[52px] w-full items-center justify-center rounded-lg text-base font-bold transition-colors ${
                    index === 1
                      ? "bg-[#5C021A] text-white hover:bg-[#7B1C2E]"
                      : "border border-[#5C021A] text-[#5C021A] hover:bg-[#5C021A] hover:text-white"
                  }`}
                >
                  Enquire Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENT CHECKLIST */}
      <section className="flex justify-center bg-[#E2E2E2] px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-10 md:gap-16 lg:flex-row">
          <div className="flex w-full flex-col gap-4 md:gap-6 lg:w-1/2">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              Submission Checklist
            </h2>

            <p className="text-base leading-[28px] text-[#5F5E5E] md:text-lg">
              Ensure you have all relevant documents ready for a smooth
              application process.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:gap-4 lg:w-1/2">
            {[
              "Student's Birth Certificate or Passport",
              "Previous Academic Transcripts",
              "Transfer Certificate (if applicable)",
              "2 Recent Passport-sized Photographs",
              "Proof of Address / Residency",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-lg bg-white/50 p-4 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5C021A]" />
                <span className="text-sm font-medium text-[#1A1C1C] md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section className="flex justify-center bg-[#F3F3F3] px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-12">
          <div className="flex max-w-[472px] flex-col gap-4">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              Scholarship Opportunities
            </h2>

            <p className="text-base leading-[28px] text-[#5F5E5E] md:text-lg">
              We believe in making quality education accessible. Explore our
              financial aid programs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: Award,
                title: "Merit-Based Scholarship",
                text: "Awarded to students exhibiting exceptional academic excellence in previous grades.",
              },
              {
                icon: Star,
                title: "Tech Innovator Award",
                text: "For students who demonstrate a strong portfolio or projects in coding and technology.",
              },
              {
                icon: HeartIcon,
                title: "Financial Aid Grant",
                text: "The transparency in fees and the scholarship opportunities made it possible for our diverse community to thrive.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center rounded-xl border border-[#DCC0C1] bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1 md:p-8"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#5C021A]/5 md:h-20 md:w-20">
                    <Icon className="h-6 w-6 text-[#5C021A] md:h-8 md:w-8" />
                  </div>

                  <h3 className="mb-3 font-serif text-base font-normal text-[#1A1C1C]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-[24px] text-[#5F5E5E] md:text-base">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="application-form"
        className="flex scroll-mt-28 justify-center bg-white px-6 py-16 md:px-12 md:py-20"
      >
        <div className="flex w-full max-w-[1280px] flex-col gap-10 md:gap-12 lg:flex-row">
          <div className="flex w-full flex-col gap-6 md:gap-8 lg:w-[65%]">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              {isCourseEnrolment
                ? "Course Enrolment Application"
                : "Ready to Apply?"}
            </h2>

            {isCourseEnrolment && (
              <div className="flex items-start gap-4 rounded-xl border border-[#DCC0C1] bg-[#F8F4F5] p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#5C021A]/10">
                  <BookOpen className="h-6 w-6 text-[#5C021A]" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5C021A]">
                    Your Selected Course
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#1A1C1C]">
                    {courseName}
                  </h3>

                  <p className="mt-1 text-sm text-[#5F5E5E]">
                    Fill in the form below. Our counsellor will contact you
                    after submission.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleAdmissionSubmit}
              className="flex flex-col gap-6"
            >
              {/* STUDENT DETAILS */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="studentName" className={labelClass}>
                    Student Name
                  </label>

                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    required
                    placeholder="Full name as per records"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="parentName" className={labelClass}>
                    Parent/Guardian Name
                  </label>

                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* GRADE */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="grade" className={labelClass}>
                    Standard Seeking Admission
                  </label>

                  <select
                    id="grade"
                    name="grade"
                    required
                    value={selectedGrade}
                    onChange={(event) => {
                      setSelectedGrade(event.target.value);
                      setSelectedProgram("");
                      setProgramMessage("");
                    }}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Standard
                    </option>

                    {Object.keys(admissionProgramsByGrade).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}

                    <option value="Professional / Other">
                      Professional / Other
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="currentSchool" className={labelClass}>
                    Current School
                  </label>

                  <input
                    id="currentSchool"
                    name="currentSchool"
                    type="text"
                    placeholder="Current school or institution"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* PROGRAM */}
              {isCourseEnrolment ? (
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Selected Course</label>

                  <input
                    type="text"
                    value={courseName}
                    readOnly
                    className={`${inputClass} bg-[#F8F4F5] font-semibold text-[#5C021A]`}
                  />

                  <p className="text-xs text-[#5F5E5E]">
                    The course has been selected automatically from the Programs
                    page.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label htmlFor="program" className={labelClass}>
                    Program
                  </label>

                  {!selectedGrade ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setProgramMessage(
                            "Please select your standard first.",
                          );
                        }}
                        className="flex h-[49px] w-full items-center justify-between rounded-lg border border-[#897172] bg-[#F7F7F7] px-4 text-left text-[#8A8A8A] transition hover:border-[#5C021A]"
                      >
                        <span>Select your standard first</span>

                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {programMessage && (
                        <p className="text-xs font-semibold text-red-600">
                          {programMessage}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        id="program"
                        key={selectedGrade}
                        name="program"
                        required
                        value={selectedProgram}
                        onChange={(event) => {
                          setSelectedProgram(event.target.value);
                          setProgramMessage("");
                        }}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select Program
                        </option>

                        {availablePrograms.map((programName) => (
                          <option key={programName} value={programName}>
                            {programName}
                          </option>
                        ))}
                      </select>

                      {selectedGrade === "Professional / Other" && (
                        <p className="text-xs text-[#5F5E5E]">
                          For professional courses, please choose the course
                          from our Programs page and use Enroll Now.
                        </p>
                      )}

                      {selectedGrade !== "Professional / Other" && (
                        <p className="text-xs text-[#5F5E5E]">
                          Showing programs available for{" "}
                          <span className="font-semibold text-[#5C021A]">
                            {selectedGrade}
                          </span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* MESSAGE */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className={labelClass}>
                  Additional Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Any specific queries or requirements..."
                  className="h-[122px] w-full resize-none rounded-lg border border-[#897172] bg-white p-4 outline-none focus:border-[#5C021A] focus:ring-2 focus:ring-[#5C021A]/10"
                />
              </div>

              {/* CONSENT */}
              <label className="flex items-start gap-3 rounded-lg bg-[#F8F4F5] p-4">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#5C021A]"
                />

                <span className="text-xs leading-5 text-[#5F5E5E]">
                  I confirm that the information provided is accurate and
                  consent to Prime Digital School using these details for the
                  admission process and counselling follow-up.
                </span>
              </label>

              {/* ERROR */}
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  {formError}
                </div>
              )}

              {/* SUCCESS */}
              {successReference && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" />

                    <div>
                      <p className="text-base font-bold text-emerald-800">
                        Your application has been submitted successfully.
                      </p>

                      <p className="mt-2 text-sm leading-6 text-emerald-700">
                        Our counsellor will contact you shortly.
                      </p>

                      <p className="mt-3 text-sm text-emerald-700">
                        Application Reference:{" "}
                        <span className="font-black">{successReference}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-[#5C021A] py-4 text-base font-medium text-white transition-colors hover:bg-[#7B1C2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </button>
            </form>
          </div>

          {/* ADMISSIONS HELP */}
          <div className="w-full rounded-2xl bg-[#7B1C2E] p-8 md:p-10 lg:w-[35%]">
            <div className="flex h-full flex-col">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FFB8C2]">
                  Admissions Support
                </p>

                <h3 className="mt-3 text-2xl font-bold text-white">
                  Need Help With Your Application?
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">
                  Our admissions team can help you choose the right program,
                  understand eligibility, complete your application, and answer
                  questions about enrollment.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-5">
                <a
                  href="tel:+918693093542"
                  className="group flex items-start gap-4 rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Phone className="h-5 w-5 text-[#FFB8C2]" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
                      Call Admissions
                    </p>

                    <p className="mt-1 text-base font-bold text-white">
                      +91 86930 93542
                    </p>

                    <p className="mt-1 text-xs text-white/70">
                      Monday - Saturday, 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:team@primedigital.school"
                  className="group flex items-start gap-4 rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-5 w-5 text-[#FFB8C2]" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
                      Email Us
                    </p>

                    <p className="mt-1 break-all text-base font-bold text-white">
                      team@primedigital.school
                    </p>

                    <p className="mt-1 text-xs text-white/70">
                      Our team usually responds within 24 hours.
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/918693093542?text=Hi%20Prime%20Digital%20School%2C%20I%20need%20help%20with%20admissions."
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#5C021A] transition hover:bg-[#FFF1F4]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat With Admissions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="flex justify-center bg-[#F3F3F3] px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
          <h2 className="text-center text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
            What Parents Say
          </h2>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[
              {
                name: "Eleanor Rigby",
                role: "Parent of Grade 9 Student",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                quote:
                  "The admissions process was incredibly smooth. From the first inquiry to enrollment, the staff was professional and supportive.",
              },
              {
                name: "Michael Chang",
                role: "Parent of Grade 11 Student",
                image:
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                quote:
                  "We were looking for a school that values both academics and character development. Prime Digital has exceeded our expectations.",
              },
              {
                name: "Sarah & Tom",
                role: "Parents of Grade 6 Student",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                quote:
                  "The transparency in fees and the diverse community made us confident in our decision. Truly an amazing institution for future leaders.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between gap-6 rounded-xl border border-[#DCC0C1] bg-white p-6 shadow-sm md:p-8"
              >
                <div>
                  <svg
                    className="mb-4 h-6 w-6 text-[#5C021A]/20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 1.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                  </svg>

                  <p className="text-sm italic leading-[24px] text-[#5F5E5E] md:text-base">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 bg-cover bg-center md:h-12 md:w-12"
                    style={{
                      backgroundImage: `url("${item.image}")`,
                    }}
                  />

                  <div>
                    <h4 className="text-sm font-bold text-[#1A1C1C] md:text-base">
                      {item.name}
                    </h4>

                    <p className="text-xs text-[#5F5E5E]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex justify-center bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="flex w-full max-w-[1232px] flex-col items-center gap-10 md:gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-[40px] tracking-[-0.32px] text-[#1A1C1C] md:text-[32px]">
              Frequently Asked Questions
            </h2>

            <p className="text-sm leading-[24px] text-[#5F5E5E] md:text-base">
              Find quick answers to common admission queries.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            {[
              "When is the latest I can apply for Fall 2026?",
              "Is the entrance exam mandatory for all grades?",
              "Do you offer boarding facilities for international students?",
              "How do I apply for a scholarship during admission?",
              "What is the student-to-teacher ratio?",
            ].map((question) => (
              <div
                key={question}
                className="flex items-center justify-between rounded-xl border border-[#DCC0C1] px-4 py-5 md:px-6 md:py-6"
              >
                <span className="text-sm font-bold text-[#1A1C1C] md:text-base">
                  {question}
                </span>

                <ChevronDown className="h-5 w-5 shrink-0 text-[#1A1C1C]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="flex justify-center bg-white px-6 pb-16 md:px-12 md:pb-20">
        <div className="relative flex w-full max-w-[1232px] flex-col items-center overflow-hidden rounded-[24px] bg-[#5C021A] px-6 py-16 text-center md:px-8 md:py-20">
          <div className="absolute right-[-128px] top-[-128px] z-0 h-[256px] w-[256px] rounded-full bg-white/5" />
          <div className="absolute bottom-[-128px] left-[-128px] z-0 h-[256px] w-[256px] rounded-full bg-white/5" />

          <div className="relative z-10 flex max-w-[672px] flex-col items-center gap-6">
            <h2 className="text-3xl font-bold leading-[1.17] tracking-[-0.96px] text-white md:text-[48px]">
              Ready to Join Prime Digital School?
            </h2>

            <p className="text-base leading-[1.56] text-white/90 md:text-lg">
              Take the leap and become part of a community that fosters
              innovation, leadership, and digital mastery.
            </p>

            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4 md:gap-6">
              <a
                href="#application-form"
                className="rounded-lg bg-white px-8 py-4 text-sm font-bold text-[#5C021A] transition-colors hover:bg-gray-100 md:px-10 md:text-base"
              >
                Start Application
              </a>

              <a
                href="mailto:team@primedigital.school"
                className="rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/20 md:px-10 md:text-base"
              >
                Contact Admissions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
