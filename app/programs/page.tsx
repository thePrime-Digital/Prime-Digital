"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";

import {
  Search,
  Star,
  Code,
  Laptop,
  Smartphone,
  BrainCircuit,
  Database,
  Network,
  MessageSquare,
  Megaphone,
  Share2,
  LineChart,
  PenTool,
  Palette,
  Box,
  Video,
  Briefcase,
  Lightbulb,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Shield,
  Home,
  CheckCircle2,
  ChevronDown,
  Globe,
  Users,
  Award,
  BookOpen,
  Target,
  Sparkles,
  GraduationCap,
  Zap,
  Clock,
  BarChart3,
} from "lucide-react";

type GradeKey = "6-7" | "8-9" | "10" | "11-12";

type ProgramTrack = "foundation" | "professional";

type StandardKey = "6" | "7" | "8" | "9" | "10" | "11" | "12";

type GradeCourse = {
  slug: string;
  title: string;
  image: string;
  duration: string;
  level: string;
  desc: string;
};

type GradePathway = {
  badge: string;
  title: string;
  stage: string;
  description: string;
  href: string;
  courses: GradeCourse[];
};

const gradePathways: Record<GradeKey, GradePathway> = {
  "6-7": {
    badge: "Grades 6-7",
    title: "Digital Explorer Pathway",
    stage: "Explore & Create",
    description:
      "Fun, visual and project-based technology learning designed to build confidence, curiosity and strong digital foundations.",
    href: "/programs/digital-explorer",

    courses: [
      {
        slug: "digital-foundations",
        title: "Digital Foundations & Smart Computing",
        image: "/programs/grades-6-7/digital-foundations-smart-computing.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Build confidence with computers, cloud tools, internet safety, productivity apps and responsible digital habits.",
      },
      {
        slug: "creative-coding-scratch",
        title: "Creative Coding with Scratch",
        image: "/programs/grades-6-7/creative-coding-with-scratch.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Learn coding logic through animations, interactive stories, events, loops and visual programming projects.",
      },
      {
        slug: "young-game-creators",
        title: "Young Game Creators",
        image: "/programs/grades-6-7/young-game-creators.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Design playable games while learning movement, scoring, challenges, logic and creative problem-solving.",
      },
      {
        slug: "junior-robotics-electronics",
        title: "Junior Robotics & Electronics",
        image: "/programs/grades-6-7/junior-robotics-electronics.png",
        duration: "10 Weeks",
        level: "Beginner",
        desc: "Explore circuits, sensors, motors, automation and beginner robotics through guided hands-on activities.",
      },
      {
        slug: "digital-design-creativity",
        title: "Digital Design & Creativity",
        image: "/programs/grades-6-7/digital-design-creativity.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Create posters, presentations, visual stories and simple interfaces using age-appropriate design tools.",
      },
      {
        slug: "ai-young-learners",
        title: "AI for Young Learners",
        image: "/programs/grades-6-7/ai-for-young-learners.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Understand what AI is, how it is used, responsible prompting and creative ways to use AI for learning.",
      },
    ],
  },

  "8-9": {
    badge: "Grades 8-9",
    title: "Tech Builder Pathway",
    stage: "Build & Apply",
    description:
      "Students move from exploring technology to building practical solutions with coding, AI, data, design and smart systems.",
    href: "/programs/tech-builder",

    courses: [
      {
        slug: "python-foundations",
        title: "Python Programming Foundations",
        image: "/programs/grades-8-9/python-programming-foundations.png",
        duration: "10 Weeks",
        level: "Beginner",
        desc: "Learn Python syntax, variables, conditions, loops, functions and problem-solving through practical projects.",
      },
      {
        slug: "web-development-foundations",
        title: "Web Development Fundamentals",
        image: "/programs/grades-8-9/web-development-fundamentals.png",
        duration: "10 Weeks",
        level: "Beginner",
        desc: "Build responsive websites using HTML, CSS and beginner JavaScript while learning how the web works.",
      },
      {
        slug: "ai-prompt-engineering-students",
        title: "AI & Prompt Engineering",
        image: "/programs/grades-8-9/ai-prompt-engineering.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Explore generative AI, effective prompting, responsible AI use and practical AI-assisted student workflows.",
      },
      {
        slug: "robotics-iot-foundations",
        title: "Robotics & IoT Foundations",
        image: "/programs/grades-8-9/robotics-iot-foundations.png",
        duration: "10 Weeks",
        level: "Beginner",
        desc: "Explore sensors, automation, smart devices, IoT concepts and the logic behind connected systems.",
      },
      {
        slug: "cybersecurity-digital-safety",
        title: "Cybersecurity & Digital Safety",
        image: "/programs/grades-8-9/cybersecurity-digital-safety.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Learn cyber hygiene, passwords, phishing, privacy, network safety and introductory defensive security.",
      },
      {
        slug: "data-skills-spreadsheets",
        title: "Data Skills & Spreadsheets",
        image: "/programs/grades-8-9/data-skills-spreadsheets.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Use spreadsheets, formulas, charts and structured data to discover patterns and communicate useful insights.",
      },
      {
        slug: "ui-ux-product-design-foundations",
        title: "UI/UX & Product Design",
        image: "/programs/grades-8-9/ui-ux-product-design.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Learn user flows, wireframes, interface design, basic Figma and the foundations of digital product thinking.",
      },
      {
        slug: "app-building-foundations",
        title: "App Building Fundamentals",
        image: "/programs/grades-8-9/app-building-fundamentals.png",
        duration: "10 Weeks",
        level: "Beginner",
        desc: "Understand screens, navigation, app logic, forms and simple no-code or low-code application building.",
      },
    ],
  },

  "10": {
    badge: "Grade 10",
    title: "Future Tech & Portfolio Pathway",
    stage: "Advance & Showcase",
    description:
      "A deeper project-based pathway that develops technical depth, stronger problem-solving and a portfolio students can showcase.",
    href: "/programs/future-tech-portfolio",

    courses: [
      {
        slug: "python-development-automation",
        title: "Python Development & Automation",
        image: "/programs/grades-10/python-development-automation.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Strengthen Python through functions, files, automation workflows, APIs concepts and structured projects.",
      },
      {
        slug: "front-end-web-development",
        title: "Front-End Web Development",
        image: "/programs/grades-10/front-end-web-development.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Create polished responsive websites using HTML, CSS, JavaScript and modern front-end development practices.",
      },
      {
        slug: "applied-ai-generative-ai",
        title: "Applied AI & Generative AI",
        image: "/programs/grades-10/applied-ai-generative-ai.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Use generative AI responsibly, design effective workflows and build practical AI-assisted projects.",
      },
      {
        slug: "robotics-iot-projects",
        title: "Robotics & IoT Projects",
        image: "/programs/grades-10/robotics-iot-projects.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Build smart-system concepts using sensors, automation, connected devices and project-based engineering.",
      },
      {
        slug: "cybersecurity-foundations-grade-10",
        title: "Cybersecurity Foundations",
        image: "/programs/grades-10/cybersecurity-foundations.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Understand networks, threats, authentication, system protection and responsible defensive cybersecurity concepts.",
      },
      {
        slug: "data-analytics-foundations",
        title: "Data Analytics Foundations",
        image: "/programs/grades-10/data-analytics-foundations.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Analyze data with spreadsheets, charts and introductory analytics methods while building dashboard-style projects.",
      },
      {
        slug: "digital-product-ui-ux",
        title: "Digital Product & UI/UX Design",
        image: "/programs/grades-10/digital-product-ui-ux-design.png",
        duration: "10 Weeks",
        level: "Intermediate",
        desc: "Research users, create wireframes, design interfaces and build presentable digital product prototypes.",
      },
      {
        slug: "tech-entrepreneurship-grade-10",
        title: "Tech Entrepreneurship",
        image: "/programs/grades-10/tech-entrepreneurship.png",
        duration: "8 Weeks",
        level: "Beginner",
        desc: "Learn idea validation, simple business models, digital products, pitching and technology-based entrepreneurship.",
      },
      {
        slug: "capstone-portfolio-development",
        title: "Capstone & Portfolio Development",
        image: "/programs/grades-10/capstone-portfolio-development.png",
        duration: "8 Weeks",
        level: "Project Based",
        desc: "Combine technical skills into a final project, document the work and build a student technology portfolio.",
      },
    ],
  },
  "11-12": {
    badge: "Grades 11-12",

    title: "Career Tech & Specialization Pathway",

    stage: "Specialize & Career Prepare",

    description:
      "An advanced pathway for Grades 11-12 focused on career-oriented technology skills, deeper specialization, industry tools, portfolio development and future-ready projects.",

    href: "/programs/career-tech-specialization",

    courses: [
      {
        slug: "advanced-python-dsa",

        title: "Advanced Python & DSA",

        image: "/programs/grades-11-12/advanced-python-dsa.png",

        duration: "12 Weeks",

        level: "Advanced",

        desc: "Strengthen Python programming with object-oriented programming, data structures, algorithms, problem-solving and real-world coding projects.",
      },

      {
        slug: "full-stack-development-students",

        title: "Full-Stack Web Development",

        image: "/programs/grades-11-12/full-stack-web-development.png",

        duration: "14 Weeks",

        level: "Intermediate",

        desc: "Build complete web applications using React, Next.js, APIs, authentication, databases and modern deployment workflows.",
      },

      {
        slug: "ai-machine-learning-students",

        title: "AI & Machine Learning",

        image: "/programs/grades-11-12/ai-machine-learning.png",

        duration: "12 Weeks",

        level: "Intermediate",

        desc: "Learn Python-based AI, datasets, machine learning, prediction, classification, computer vision and practical AI application development.",
      },

      {
        slug: "data-analytics-power-bi",

        title: "Data Analytics & Power BI",

        image: "/programs/grades-11-12/data-analytics-power-bi.png",

        duration: "10 Weeks",

        level: "Intermediate",

        desc: "Analyze real datasets using Excel, SQL, Power BI, dashboards, KPIs and business intelligence techniques.",
      },

      {
        slug: "cybersecurity-ethical-hacking",

        title: "Cybersecurity & Ethical Hacking",

        image: "/programs/grades-11-12/cybersecurity-ethical-hacking.png",

        duration: "12 Weeks",

        level: "Intermediate",

        desc: "Learn networking, vulnerabilities, defensive security, ethical hacking concepts, threat analysis and practical cybersecurity labs.",
      },

      {
        slug: "cloud-devops-foundations",

        title: "Cloud Computing & DevOps",

        image: "/programs/grades-11-12/cloud-computing-devops.png",

        duration: "12 Weeks",

        level: "Intermediate",

        desc: "Learn AWS fundamentals, Linux, Git, Docker, CI/CD, cloud deployment and modern DevOps workflows.",
      },

      {
        slug: "product-design-advanced",

        title: "UI/UX & Digital Product Design",

        image: "/programs/grades-11-12/ui-ux-digital-product-design.png",

        duration: "10 Weeks",

        level: "Intermediate",

        desc: "Research users, create product flows, build high-fidelity interfaces, prototype in Figma and develop portfolio-ready product designs.",
      },

      {
        slug: "startup-entrepreneurship",

        title: "Startup & Tech Entrepreneurship",

        image: "/programs/grades-11-12/startup-tech-entrepreneurship.png",

        duration: "10 Weeks",

        level: "Intermediate",

        desc: "Validate ideas, research markets, build MVP concepts, understand startup finance, branding, customer acquisition and pitching.",
      },

      {
        slug: "career-capstone-portfolio",

        title: "Career Capstone & Portfolio",

        image: "/programs/grades-11-12/career-capstone-portfolio.png",

        duration: "8 Weeks",

        level: "Project Based",

        desc: "Build a major real-world project, prepare a professional portfolio, document technical work and present it for college, internships and future careers.",
      },
    ],
  },
};

export default function ProgramsPage() {
  const [activeTrack, setActiveTrack] = React.useState<ProgramTrack | null>(
    null,
  );

  const [activeStandard, setActiveStandard] = React.useState<StandardKey>("6");

  const activeGrade: GradeKey =
    activeStandard === "6" || activeStandard === "7"
      ? "6-7"
      : activeStandard === "8" || activeStandard === "9"
        ? "8-9"
        : activeStandard === "10"
          ? "10"
          : "11-12";

  const activePathway = gradePathways[activeGrade];

  return (
    <div className="min-h-screen font-sans bg-white text-[#1C1B1B] overflow-x-hidden">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative w-full min-h-[520px] flex flex-col items-center justify-center pt-[79px] pb-[80px] px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/pds-assets/hero-students.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-8"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#FCF9F8] via-[#FCF9F8]/95 to-[#F6F3F2]" />
        </div>

        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #5C021A 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-[800px] w-full mx-auto flex flex-col items-center gap-[15px]">
          <div className="inline-flex items-center gap-2 bg-[#5C021A]/10 text-[#5C021A] text-sm font-semibold px-5 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>Discover Your Path to Success</span>
          </div>

          <div className="text-center w-full flex flex-col items-center gap-3">
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight max-w-[724px]">
              Explore Industry-Aligned{" "}
              <span className="text-[#5C021A]">Programs</span>
            </h1>

            <p className="text-lg md:text-[18px] text-[#5D5F5F] leading-[1.7] max-w-[640px]">
              Master the skills of tomorrow, today. From AI to UI/UX Design, get
              hands-on experience and build a portfolio that stands out in the
              digital economy.
            </p>
          </div>

          <div className="relative w-full max-w-[576px] mt-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5C021A]" />

            <input
              type="text"
              placeholder="Search for programs (e.g., Python, UI Design...)"
              className="w-full pl-14 pr-6 py-[18px] bg-white border border-[#DCC0C1] rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-[16px] leading-[19px] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#5C021A]/20 focus:border-[#5C021A]"
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <section className="bg-[#7B1C2E] py-12 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
              10k+
            </h3>

            <p className="text-[#FF8A96] text-base mt-1">Active Students</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
              95%
            </h3>

            <p className="text-[#FF8A96] text-base mt-1">Placement Rate</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
              50+
            </h3>

            <p className="text-[#FF8A96] text-base mt-1">Expert Instructors</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
              120+
            </h3>

            <p className="text-[#FF8A96] text-base mt-1">Global Partners</p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROGRAM SELECTOR */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-white px-6 py-20 md:px-20">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#5C021A]/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#FF8A96]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[1200px]">
          {/* ============================================= */}
          {/* SECTION HEADING */}
          {/* ============================================= */}

          <div className="mx-auto mb-10 flex max-w-[820px] flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#5C021A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5C021A]">
              <GraduationCap className="h-4 w-4" />
              Choose Your Learning Path
            </div>

            <h2 className="text-[32px] font-semibold leading-tight text-[#1A1A1A] md:text-[42px]">
              Find the Right{" "}
              <span className="text-[#5C021A]">Learning Path</span>
            </h2>

            <p className="mt-4 max-w-[720px] text-base leading-7 text-[#5D5F5F] md:text-lg">
              Choose a grade-focused Foundation Batch for school students or
              explore career-focused Professional Courses for advanced learning.
            </p>
          </div>

          {/* ============================================= */}
          {/* MAIN TWO OPTIONS */}
          {/* ============================================= */}

          <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-5 md:grid-cols-2">
            {/* FOUNDATION BATCH */}

            <button
              type="button"
              onClick={() => setActiveTrack("foundation")}
              className={`group relative overflow-hidden rounded-[24px] border p-6 text-left transition-all duration-300 md:p-8 ${
                activeTrack === "foundation"
                  ? "border-[#5C021A] bg-[#5C021A] text-white shadow-[0_18px_40px_rgba(92,2,26,0.18)]"
                  : "border-[#E4D2D7] bg-[#FFF9FA] text-[#1C1B1B] hover:-translate-y-1 hover:border-[#5C021A]/40 hover:shadow-lg"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  activeTrack === "foundation"
                    ? "bg-white/15 text-white"
                    : "bg-[#5C021A]/10 text-[#5C021A]"
                }`}
              >
                <GraduationCap className="h-7 w-7" />
              </div>

              <p
                className={`mt-6 text-[10px] font-black uppercase tracking-[0.16em] ${
                  activeTrack === "foundation"
                    ? "text-white/70"
                    : "text-[#A14A5D]"
                }`}
              >
                Grades 6-12
              </p>

              <h3 className="mt-1 text-2xl font-black">Foundation Batch</h3>

              <p
                className={`mt-3 text-sm leading-6 ${
                  activeTrack === "foundation"
                    ? "text-white/75"
                    : "text-[#5D5F5F]"
                }`}
              >
                Structured grade-wise technology learning designed for students
                from Grades 6 to 12.
              </p>

              <div
                className={`mt-6 inline-flex items-center gap-2 text-xs font-black ${
                  activeTrack === "foundation" ? "text-white" : "text-[#5C021A]"
                }`}
              >
                Select Foundation Batch
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>

            {/* PROFESSIONAL COURSES */}

            <button
              type="button"
              onClick={() => setActiveTrack("professional")}
              className={`group relative overflow-hidden rounded-[24px] border p-6 text-left transition-all duration-300 md:p-8 ${
                activeTrack === "professional"
                  ? "border-[#5C021A] bg-[#5C021A] text-white shadow-[0_18px_40px_rgba(92,2,26,0.18)]"
                  : "border-[#E4D2D7] bg-[#FFF9FA] text-[#1C1B1B] hover:-translate-y-1 hover:border-[#5C021A]/40 hover:shadow-lg"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  activeTrack === "professional"
                    ? "bg-white/15 text-white"
                    : "bg-[#5C021A]/10 text-[#5C021A]"
                }`}
              >
                <Briefcase className="h-7 w-7" />
              </div>

              <p
                className={`mt-6 text-[10px] font-black uppercase tracking-[0.16em] ${
                  activeTrack === "professional"
                    ? "text-white/70"
                    : "text-[#A14A5D]"
                }`}
              >
                Career & Industry Skills
              </p>

              <h3 className="mt-1 text-2xl font-black">Professional Courses</h3>

              <p
                className={`mt-3 text-sm leading-6 ${
                  activeTrack === "professional"
                    ? "text-white/75"
                    : "text-[#5D5F5F]"
                }`}
              >
                Advanced technology, design, business and digital programs built
                for professional and career-focused learning.
              </p>

              <div
                className={`mt-6 inline-flex items-center gap-2 text-xs font-black ${
                  activeTrack === "professional"
                    ? "text-white"
                    : "text-[#5C021A]"
                }`}
              >
                Explore Professional Courses
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* ============================================= */}
          {/* NO SELECTION YET */}
          {/* ============================================= */}

          {activeTrack === null && (
            <div className="mx-auto mt-8 max-w-[960px] rounded-2xl border border-dashed border-[#DCC0C1] bg-[#FCF9F8] px-6 py-5 text-center">
              <p className="text-sm font-semibold text-[#6B5A5E]">
                Select Foundation Batch or Professional Courses above to view
                available programs.
              </p>
            </div>
          )}

          {/* ============================================= */}
          {/* FOUNDATION BATCH */}
          {/* ============================================= */}

          {activeTrack === "foundation" && (
            <div className="mt-12">
              {/* FOUNDATION HEADER */}

              <div className="mb-8 rounded-[24px] border border-[#E4D2D7] bg-gradient-to-r from-[#FFF7F8] to-white p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="rounded-full bg-[#5C021A]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#5C021A]">
                      Foundation Batch
                    </span>

                    <h3 className="mt-4 text-2xl font-black text-[#1C1B1B] md:text-3xl">
                      Choose Your Grade
                    </h3>

                    <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#5D5F5F] md:text-base">
                      Every stage has a structured learning pathway with
                      age-appropriate technology, projects and practical skills.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#5C021A]/5 px-4 py-3 text-xs font-bold text-[#5C021A]">
                    Grades 6-12
                  </div>
                </div>
              </div>

              {/* GRADE SELECTOR */}

              <div className="mb-10 grid grid-cols-2 gap-2 rounded-2xl border border-[#E6D3D8] bg-[#FFF9FA] p-2 sm:grid-cols-4 lg:grid-cols-7">
                {(
                  [
                    ["6", "Grade 6"],
                    ["7", "Grade 7"],
                    ["8", "Grade 8"],
                    ["9", "Grade 9"],
                    ["10", "Grade 10"],
                    ["11", "Grade 11"],
                    ["12", "Grade 12"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveStandard(key)}
                    className={`rounded-xl px-5 py-3.5 text-sm font-black transition-all ${
                      activeStandard === key
                        ? "bg-[#5C021A] text-white shadow-md"
                        : "bg-transparent text-[#5C021A] hover:bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* SELECTED GRADE PATHWAY */}

              <div className="mb-10 rounded-[24px] border border-[#E4D2D7] bg-gradient-to-r from-[#FFF7F8] to-white p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-[760px]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#5C021A]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#5C021A]">
                        {activePathway.badge}
                      </span>

                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#A14A5D]">
                        {activePathway.stage}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-bold text-[#1C1B1B] md:text-3xl">
                      {activePathway.title}
                    </h3>

                    <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5D5F5F] md:text-base">
                      {activePathway.description}
                    </p>
                  </div>

                  <Link
                    href={activePathway.href}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5C021A] px-6 text-sm font-bold text-white transition hover:bg-[#7B1C2E]"
                  >
                    Explore Full Pathway
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* FOUNDATION COURSE OPTIONS */}

              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5C021A]">
                    Foundation Course Options
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-[#1C1B1B]">
                    Grade {activeStandard} Courses
                  </h3>
                </div>

                <span className="hidden text-sm font-semibold text-[#7A686D] sm:block">
                  {activePathway.courses.length} options
                </span>
              </div>

              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {activePathway.courses.map((course) => (
                  <article
                    key={course.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#DCC0C1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute right-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-[#5C021A] backdrop-blur-sm">
                        {activePathway.badge}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#5C021A]/5 px-3 py-1 text-xs font-semibold text-[#5C021A]">
                          {course.duration}
                        </span>

                        <span className="rounded-full bg-[#5C021A]/5 px-3 py-1 text-xs font-semibold text-[#5C021A]">
                          {course.level}
                        </span>
                      </div>

                      <h4 className="text-xl font-semibold leading-snug text-[#1C1B1B]">
                        {course.title}
                      </h4>

                      <p className="mt-3 text-sm leading-6 text-[#5D5F5F]">
                        {course.desc}
                      </p>

                      <div className="mt-auto pt-6">
                        <Link
                          href={`${activePathway.href}?course=${course.slug}`}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#9f1735] text-sm font-bold text-[#9f1735] transition hover:bg-[#9f1735] hover:text-white"
                        >
                          View Course
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* PROFESSIONAL COURSES */}
          {/* ============================================= */}

          {activeTrack === "professional" && (
            <div className="mt-12">
              <div className="mb-10 rounded-[24px] border border-[#E4D2D7] bg-gradient-to-r from-[#FFF7F8] to-white p-6 md:p-8">
                <div className="max-w-[760px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#5C021A]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#5C021A]">
                      Professional Courses
                    </span>

                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#A14A5D]">
                      Industry & Career Focused
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-[#1C1B1B] md:text-3xl">
                    Build Professional Skills
                  </h3>

                  <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5D5F5F] md:text-base">
                    Explore advanced programs across artificial intelligence,
                    software development, cloud, data, cybersecurity, design,
                    marketing, entrepreneurship and other career-ready skills.
                  </p>
                </div>
              </div>

              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5C021A]">
                    Professional Programs
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-[#1C1B1B]">
                    Explore Professional Courses
                  </h3>
                </div>

                <span className="hidden text-sm font-semibold text-[#7A686D] sm:block">
                  {programs.length} courses
                </span>
              </div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((prog) => (
                  <article
                    key={prog.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#DCC0C1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />

                        <span className="text-sm font-bold text-[#1C1B1B]">
                          4.9
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {prog.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#5C021A]/5 px-3 py-1 text-xs font-semibold text-[#5C021A]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-2xl font-semibold text-[#1C1B1B]">
                        {prog.title}
                      </h4>

                      <p className="mt-3 line-clamp-2 text-base leading-relaxed text-[#5D5F5F]">
                        {prog.desc}
                      </p>

                      <div className="mt-auto pt-6">
                        <Link
                          href={`/programs/${prog.slug}`}
                          className="flex h-12 w-full items-center justify-center rounded-lg border border-[#9f1735] text-sm font-bold text-[#9f1735] transition hover:bg-[#9f1735] hover:text-white"
                        >
                          View Program
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* ADMISSIONS HUB */}
      {/* ===================================================== */}

      <section className="bg-white px-6 pb-20 pt-6 md:px-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden rounded-[28px] border border-[#7a0019]/15 bg-gradient-to-br from-[#fff7f8] via-white to-[#fffaf5] shadow-[0_22px_60px_rgba(90,0,18,0.08)]">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-6 border-b border-[#7a0019]/10 px-6 py-7 md:px-9 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#7a0019]/10 text-[#7a0019]">
                  <GraduationCap size={30} />
                </div>

                <div>
                  <p className="m-0 text-[10px] font-black uppercase tracking-[0.16em] text-[#a77c20]">
                    Join Prime Digital School
                  </p>

                  <h2 className="mt-1 text-[30px] font-bold leading-tight text-[#1C1B1B] md:text-[36px]">
                    Admissions
                  </h2>

                  <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#5D5F5F]">
                    Your future starts here. Explore the admission requirements,
                    important dates, fees, and application process.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                  <CheckCircle2 size={16} />
                  ADMISSIONS OPEN
                </span>

                <div className="border-l border-[#7a0019]/15 pl-4">
                  <p className="m-0 text-[9px] font-bold uppercase tracking-[0.1em] text-[#7A686D]">
                    Academic Session
                  </p>

                  <p className="mt-1 text-sm font-black text-[#7a0019]">
                    2026–27
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* ADMISSION INFORMATION CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {/* PROCESS */}

              <div className="border-b border-[#7a0019]/10 p-6 md:border-r xl:border-b-0">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <CheckCircle2 size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">
                  Admission Process
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    "Explore Program",
                    "Check Eligibility",
                    "Submit Application",
                    "Review & Confirmation",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-2 text-xs leading-5 text-[#5D5F5F]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7a0019] text-[9px] font-black text-white">
                        {index + 1}
                      </span>

                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ELIGIBILITY */}

              <div className="border-b border-[#7a0019]/10 p-6 lg:border-r xl:border-b-0">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <Users size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">
                  Eligibility
                </h3>

                <p className="mt-4 text-xs leading-5 text-[#5D5F5F]">
                  Students from 6th to 12th standard can apply depending on the
                  selected program and learning pathway.
                </p>
              </div>

              {/* FEES */}

              <div className="border-b border-[#7a0019]/10 p-6 md:border-r lg:border-r-0 xl:border-b-0 xl:border-r">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <CreditCard size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">Fees</h3>

                <p className="mt-4 text-xs leading-5 text-[#5D5F5F]">
                  Fees vary depending on the selected program, duration, and
                  learning level.
                </p>

                <p className="mt-2 text-[11px] font-bold text-[#7a0019]">
                  Flexible payment options available.
                </p>
              </div>

              {/* DOCUMENTS */}

              <div className="border-b border-[#7a0019]/10 p-6 lg:border-r xl:border-b-0">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <BookOpen size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">
                  Required Documents
                </h3>

                <ul className="mt-4 list-disc space-y-2 pl-4 text-xs leading-5 text-[#5D5F5F]">
                  <li>Academic Records</li>
                  <li>Student ID / Aadhaar</li>
                  <li>Passport-size Photo</li>
                  <li>Address Proof</li>
                </ul>
              </div>

              {/* IMPORTANT DATES */}

              <div className="border-b border-[#7a0019]/10 p-6 md:border-r xl:border-b-0">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <Clock size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">
                  Important Dates
                </h3>

                <div className="mt-4 space-y-3 text-xs leading-5 text-[#5D5F5F]">
                  <div>
                    <span className="font-bold text-[#1C1B1B]">
                      Applications:
                    </span>
                    <br />
                    Currently Open
                  </div>

                  <div>
                    <span className="font-bold text-[#1C1B1B]">Session:</span>
                    <br />
                    2026–27
                  </div>
                </div>
              </div>

              {/* SCHOLARSHIPS */}

              <div className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a0019]/10 text-[#7a0019]">
                  <Award size={20} />
                </div>

                <h3 className="text-sm font-black text-[#1C1B1B]">
                  Scholarships
                </h3>

                <p className="mt-4 text-xs leading-5 text-[#5D5F5F]">
                  Merit-based and need-based scholarship opportunities may be
                  available for eligible students.
                </p>
              </div>
            </div>

            {/* ================================================= */}
            {/* CTA AREA */}
            {/* ================================================= */}

            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#7a0019]/10 bg-white/70 px-6 py-6 md:flex-row md:px-9">
              <div>
                <p className="m-0 text-sm font-black text-[#1C1B1B]">
                  Ready to take the next step?
                </p>

                <p className="mt-1 text-xs text-[#6B7280]">
                  Download the prospectus or begin your application today.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="/downloads/prime-digital-school-prospectus.pdf"
                  download
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#7a0019] px-6 text-sm font-black text-white shadow-[0_10px_24px_rgba(122,0,25,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#5a0012]"
                >
                  Download Prospectus
                </a>

                <Link
                  href="/admissions#application-form"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#7a0019]/30 bg-white px-7 text-sm font-black text-[#7a0019] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff3f6]"
                >
                  Apply Now
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* LEARNING PATHS */}
      {/* ===================================================== */}

      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-16">
            Explore Structured Learning Paths
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Software */}

            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <Code className="text-white w-5 h-5" />

                <span className="text-white text-base font-medium">
                  Software Engineering
                </span>
              </div>

              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0" />

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">HTML & CSS</span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">
                    JavaScript Base
                  </span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">
                    React & Next.js
                  </span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Backend APIs</span>
                </div>
              </div>
            </div>

            {/* Design */}

            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <PenTool className="text-white w-5 h-5" />

                <span className="text-white text-base font-medium">
                  Product Design
                </span>
              </div>

              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0" />

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">
                    UI Fundamentals
                  </span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">UX Research</span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Wireframing</span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Prototyping</span>
                </div>
              </div>
            </div>

            {/* Entrepreneurship */}

            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <Lightbulb className="text-white w-5 h-5" />

                <span className="text-white text-base font-medium">
                  Tech Entrepreneurship
                </span>
              </div>

              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0" />

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">
                    Ideation Phase
                  </span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">
                    Market Analysis
                  </span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">MVP Building</span>
                </div>

                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Pitching</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CATEGORIES */}
      {/* ===================================================== */}

      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] mb-12">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Coding */}

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <Code className="text-[#5C021A] w-8 h-8" />

              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">
                Coding
              </h4>

              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Python Basics
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Web Development
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Mobile Apps
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Game Design
                </li>
              </ul>
            </div>

            {/* AI */}

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <Database className="text-[#5C021A] w-8 h-8" />

              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">
                AI & Data
              </h4>

              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Machine Learning
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Data Science
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Neural Networks
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Prompt Engineering
                </li>
              </ul>
            </div>

            {/* Marketing */}

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <Megaphone className="text-[#5C021A] w-8 h-8" />

              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">
                Marketing
              </h4>

              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Social Media
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  SEO Basics
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Ad Campaigns
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Copywriting
                </li>
              </ul>
            </div>

            {/* Design */}

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <Palette className="text-[#5C021A] w-8 h-8" />

              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">
                Design
              </h4>

              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Graphic Design
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  3D Modeling
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  UI/UX Design
                </li>

                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Motion Graphics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROJECT SHOWCASE */}
      {/* ===================================================== */}

      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center">
              Projects Showcase
            </h2>

            <p className="text-base text-[#5D5F5F] text-center max-w-2xl mt-2">
              Get inspired by real-world applications and projects built by our
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Smartphone className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                Smart Home Hub
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Control lights and temperature via a mobile app built with React
                Native.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Network className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                Community Website
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Develop a localized marketplace platform using HTML/CSS and
                JavaScript.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <MessageSquare className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                AI Chatbot
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Train a custom AI model to handle school administrative queries.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Box className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                NFT Marketplace
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Create a simple platform for trading digital student artwork
                safely.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Shield className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                Vulnerability Scanner
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Build a tool to identify basic security risks in local networks.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <BarChart3 className="text-[#5C021A] w-6 h-6 mb-4" />

              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                Stock Market Sim
              </h4>

              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Design a dashboard to visualize financial trends and portfolio
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CERTIFICATION */}
      {/* ===================================================== */}

      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1C1B1B] leading-tight">
              Get Certified for Your Skills
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />

                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">
                    Industry-Recognized
                  </h4>

                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Our certificates are recognized by top tech companies
                    globally, adding immediate value to your resume.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />

                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">
                    Portfolio Verified
                  </h4>

                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Every certification mandates a completed capstone project,
                    proving you have practical experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />

                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">
                    Blockchain Secured
                  </h4>

                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Instantly verify your credentials online with our secure
                    digital credentialing network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative flex justify-center py-10">
            <div className="absolute inset-0 bg-[#5C021A]/5 rounded-xl -rotate-2 transform scale-95" />

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-10 w-full max-w-[500px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rotate-2 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#5C021A]">
                  Prime Digital School
                </h2>

                <span className="text-sm text-[#5D5F5F]">ID: PDS-2026-X98</span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl text-[#1C1B1B] mb-2">
                  Certificate of Completion
                </h3>

                <p className="text-base text-[#5D5F5F] italic mb-4">
                  This acknowledges that
                </p>

                <div className="border-b border-[#5C021A]/20 pb-2 mb-6">
                  <span className="text-3xl text-[#1C1B1B] font-serif">
                    Ankit Mali
                  </span>
                </div>

                <p className="text-base text-[#1C1B1B] mb-2">
                  has successfully completed the
                </p>

                <p className="text-base font-bold text-[#1C1B1B]">
                  AI & Machine Learning Explorer Program
                </p>
              </div>

              <div className="border-t border-[#5C021A]/10 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-[#1C1B1B] mb-1">
                    June 26, 2026
                  </p>

                  <p className="text-sm text-[#5D5F5F]">Date of Issue</p>
                </div>

                <div className="opacity-30">
                  <AwardIcon className="w-12 h-12 text-[#5C021A]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW IT WORKS */}
      {/* ===================================================== */}

      <section className="bg-[#FCF9F8] py-20 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-16">
          <div className="text-center max-w-2xl">
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1A1A1A] leading-tight mb-4">
              How It Works
            </h2>

            <p className="text-lg text-[#5D5F5F]">
              Your journey from curiosity to career-ready in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              {
                step: "01",
                icon: Search,
                title: "Choose Your Path",
                desc: "Browse our programs and find the one that matches your passion and goals.",
              },
              {
                step: "02",
                icon: Laptop,
                title: "Learn by Doing",
                desc: "Engage with hands-on projects, live sessions, and real-world case studies.",
              },
              {
                step: "03",
                icon: Target,
                title: "Build Your Portfolio",
                desc: "Apply your skills to capstone projects that showcase your expertise.",
              },
              {
                step: "04",
                icon: Award,
                title: "Get Certified & Placed",
                desc: "Earn industry-recognized certificates and launch your dream career.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white border border-[#DCC0C1] rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#5C021A] text-white flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>

                <div className="w-12 h-12 bg-[#5C021A]/10 rounded-lg flex items-center justify-center text-[#5C021A] mb-6 group-hover:bg-[#5C021A] group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-[#5D5F5F] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* WHERE SKILLS TAKE YOU */}
      {/* ===================================================== */}

      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-12">
            Where These Skills Take You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-[#5C021A]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                  Tech Startups & Agencies
                </h4>

                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Frontend
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    UI/UX
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Agile
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <LineChart className="w-6 h-6 text-[#5C021A]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                  Finance & Analytics
                </h4>

                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Python
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Data Viz
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    SQL
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <MonitorPlay className="w-6 h-6 text-[#5C021A]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                  Media & Entertainment
                </h4>

                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Animation
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    3D Mod
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#5C021A]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">
                  Corporate IT & Security
                </h4>

                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Networks
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    PenTest
                  </span>

                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">
                    Compliance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAQ */}
      {/* ===================================================== */}

      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="w-full flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="w-full border border-[#DCC0C1] rounded-xl hover:bg-[#F6F3F2] cursor-pointer transition-colors"
              >
                <div className="w-full px-5 py-5 flex justify-between items-center">
                  <span className="text-base font-bold text-[#1C1B1B]">
                    {faq}
                  </span>

                  <div className="w-3.5 h-3.5 rounded-full bg-[#5C021A] flex items-center justify-center shrink-0">
                    <ChevronDown className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========================================================= */
/* NORMAL PROGRAM DATA */
/* ========================================================= */

const programs = [
  {
    slug: "ai-robotics-explorer",
    title: "AI & Machine Learning",
    image: "/pds-assets/program-ai-robotics.jpg",
    tags: ["12 Weeks", "Intermediate"],
    desc: "Learn artificial intelligence, machine learning, computer vision, intelligent systems, and practical AI applications.",
  },
  {
    slug: "web-development-pro",
    title: "Full-Stack Web Development",
    image: "/pds-assets/program-web-dev.jpg",
    tags: ["12 Weeks", "Intermediate"],
    desc: "Build complete modern web applications using frontend, backend, APIs, databases, and deployment tools.",
  },
  {
    slug: "aws-devops",
    title: "AWS & DevOps",
    image: "/programs/aws-devops/hero.png",
    tags: ["12 Weeks", "Intermediate"],
    desc: "Learn cloud computing, AWS services, Linux, Git, Docker, CI/CD, infrastructure, monitoring, and modern DevOps deployment workflows.",
  },
  {
    slug: "data-science-analytics-junior",
    title: "Data Science",
    image: "/programs/data-science/hero.png",
    tags: ["12 Weeks", "Intermediate"],
    desc: "Explore data science with Python, statistics, visualization, machine learning, and real-world datasets.",
  },
  {
    slug: "cyber-defense-junior",
    title: "Cybersecurity",
    image: "/programs/cyber-defense/hero.png",
    tags: ["12 Weeks", "Beginner"],
    desc: "Learn cyber safety, networks, threats, security tools, incident response, and ethical security practices.",
  },
  {
    slug: "ux-ui-design-mastery",
    title: "UI/UX Design",
    image: "/programs/ux-ui/hero.png",
    tags: ["12 Weeks", "All Levels"],
    desc: "Design intuitive digital experiences using research, wireframing, prototyping, usability testing, and Figma.",
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    image: "/programs/data-analytics/hero.png",
    tags: ["10 Weeks", "Beginner"],
    desc: "Turn raw data into useful insights using spreadsheets, SQL, dashboards, visualization, and business analytics.",
  },
  {
    slug: "teen-entrepreneurship",
    title: "Entrepreneurship",
    image: "/programs/entrepreneurship/hero.png",
    tags: ["12 Weeks", "Beginner"],
    desc: "Learn idea validation, business planning, branding, finance, leadership, product development, and pitching.",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    image: "/programs/digital-marketing/hero.png",
    tags: ["10 Weeks", "Beginner"],
    desc: "Learn social media marketing, SEO, content strategy, paid campaigns, analytics, branding, and audience growth.",
  },
  {
    slug: "graphic-design-motion-graphics",
    title: "Graphic Design & Motion Graphics",
    image: "/programs/graphic-design-motion-graphics/hero.png",
    tags: ["12 Weeks", "All Levels"],
    desc: "Create visual identities, graphics, digital artwork, animated content, and professional motion-design projects.",
  },
  {
    slug: "software-testing",
    title: "Software Testing",
    image: "/programs/software-testing/hero.png",
    tags: ["10 Weeks", "Beginner"],
    desc: "Learn manual testing, test cases, bug reporting, API testing, quality assurance, and test automation fundamentals.",
  },
  {
    slug: "python-programming-explorer",
    title: "Python Programming Explorer",
    image: "/programs/python-programming/hero.png",
    tags: ["10 Weeks", "Beginner"],
    desc: "Learn Python programming through coding challenges, automation, games, problem solving, and practical projects.",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    image: "/programs/mobile-app-development/hero.png",
    tags: ["12 Weeks", "Intermediate"],
    desc: "Design and build modern mobile applications with interactive interfaces, APIs, state management, and deployment.",
  },
  {
    slug: "digital-content-creation",
    title: "Digital Content Creation",
    image: "/programs/digital-content/hero.png",
    tags: ["12 Weeks", "Beginner"],
    desc: "Create videos, graphics, social content, digital stories, and a professional creative portfolio.",
  },
];

/* ========================================================= */
/* FAQ DATA */
/* ========================================================= */

const faqs = [
  "Do I need prior coding experience to join?",
  "What hardware or software requirements are there?",
  "Is job placement guaranteed after graduation?",
  "Can I switch my learning path mid-program?",
  "Are there any scholarship opportunities available?",
];

/* ========================================================= */
/* CUSTOM ICONS */
/* ========================================================= */

function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function MonitorPlay(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
      <polygon points="10 8 15 10 10 12 10 8" />
    </svg>
  );
}
