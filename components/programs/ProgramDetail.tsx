import Image from "next/image";
import Link from "next/link";
import type { Program } from "@/lib/program-data";

import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Download,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  Monitor,
  PenTool,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

type ProgramDetailProps = {
  program: Program;
};

const learningIcons = [
  Lightbulb,
  Code2,
  Monitor,
  PenTool,
  Target,
  CheckCircle2,
];

const statIcons = [CalendarDays, FolderKanban, Award, Users];

const journeyIcons = [
  GraduationCap,
  BookOpen,
  Code2,
  FolderKanban,
  Rocket,
  Award,
];

export default function ProgramDetail({ program }: ProgramDetailProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffafa] text-[#1c1b1b]">
      {/* ====================================================== */}
      {/* BREADCRUMB */}
      {/* ====================================================== */}
      <section className="px-5 pb-3 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 text-xs font-semibold text-[#7a6c70]">
          <Link
            href="/programs"
            className="flex items-center gap-1 transition hover:text-[#9f1735]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Programs
          </Link>

          <span>/</span>

          <span className="text-[#9f1735]">
            {program.title} {program.highlight}
          </span>
        </div>
      </section>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}
      <section className="relative px-5 pb-12 pt-5 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#f7dbe3]/65 blur-[110px]" />

        <div className="pointer-events-none absolute right-[-100px] top-12 h-80 w-80 rounded-full bg-[#f5cad6]/55 blur-[110px]" />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          {/* LEFT CONTENT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7c5ce] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#9f1735] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Future Ready Program
            </div>

            <h1 className="max-w-[620px] text-4xl font-black leading-[1.02] tracking-[-0.04em] text-[#171317] sm:text-5xl lg:text-[64px]">
              {program.title}
              <br />
              <span className="text-[#a30f32]">{program.highlight}</span>
            </h1>

            <p className="mt-6 max-w-[580px] text-sm leading-7 text-[#62575a] sm:text-base">
              {program.description}
            </p>

            {/* META */}
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#ead6dc] bg-white px-4 py-3 text-xs font-bold text-[#4f4548] shadow-sm">
                <Users className="h-4 w-4 text-[#a30f32]" />
                {program.age}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#ead6dc] bg-white px-4 py-3 text-xs font-bold text-[#4f4548] shadow-sm">
                <Clock3 className="h-4 w-4 text-[#a30f32]" />
                {program.duration}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#ead6dc] bg-white px-4 py-3 text-xs font-bold text-[#4f4548] shadow-sm">
                <GraduationCap className="h-4 w-4 text-[#a30f32]" />
                {program.level}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/admissions"
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-[#9f1735] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(159,23,53,0.22)] transition hover:-translate-y-1 hover:bg-[#86132d]"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="/downloads/prime-digital-school-brochure.pdf"
                download
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl border border-[#c993a1] bg-white px-7 text-sm font-black text-[#9f1735] transition hover:-translate-y-1 hover:bg-[#fff1f4]"
              >
                <Download className="h-4 w-4" />
                Download Brochure
              </a>
            </div>
          </div>

          {/* RIGHT HERO IMAGE */}
          <div className="relative">
            <div className="relative h-[360px] overflow-hidden rounded-[34px] border border-[#ead7dc] bg-[#f8ecef] shadow-[0_28px_80px_rgba(100,30,48,0.13)] sm:h-[430px] lg:h-[500px]">
              <Image
                src={program.image}
                alt={`${program.title} ${program.highlight}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#400b17]/10 via-transparent to-transparent" />
            </div>

            {/* FLOATING CARD */}
            <div className="absolute -bottom-5 right-4 rounded-2xl border border-[#ead6dc] bg-white/95 px-5 py-4 shadow-[0_20px_45px_rgba(92,2,26,0.18)] backdrop-blur-md sm:right-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9f1735] text-white">
                  <Rocket className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-black text-[#9f1735]">
                    Future Ready Skills
                  </p>

                  <p className="mt-1 text-[11px] text-[#75696c]">
                    Learn • Build • Create • Grow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* STATS STRIP */}
      {/* ====================================================== */}
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-[26px] bg-gradient-to-r from-[#8b0829] via-[#a40d34] to-[#8b0829] shadow-[0_18px_50px_rgba(92,2,26,0.2)] sm:grid-cols-2 lg:grid-cols-4">
          {program.stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];

            return (
              <div
                key={`${stat.title}-${stat.value}`}
                className="flex items-center gap-4 border-white/10 p-6 sm:border-r lg:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-base font-black text-white">
                    {stat.value}
                  </p>

                  {stat.subtext && (
                    <p className="mt-1 text-[10px] text-white/60">
                      {stat.subtext}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHAT YOU WILL LEARN */}
      {/* ====================================================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            title="What You'll Learn"
            description="Build practical skills through guided learning, hands-on exercises, and real-world projects."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {program.learning.map((item, index) => {
              const Icon = learningIcons[index % learningIcons.length];

              return (
                <article
                  key={item.title}
                  className="group relative min-h-[220px] overflow-hidden rounded-[22px] border border-[#ead7dc] bg-white p-7 shadow-[0_12px_35px_rgba(71,25,37,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d69bab] hover:shadow-[0_24px_55px_rgba(159,23,53,0.1)]"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 bg-[radial-gradient(#c98799_1px,transparent_1px)] bg-[size:7px_7px] opacity-20" />

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#9f1735] text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-black text-[#21191b]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#695d60]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* LEARNING JOURNEY */}
      {/* ====================================================== */}
      <section className="bg-[#fff7f8] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            title="Your Learning Journey"
            description="A structured path that takes you from foundation concepts to practical application."
          />

          <div className="relative mt-12">
            <div className="absolute left-[7%] right-[7%] top-7 hidden h-px bg-[#d5a0ad] lg:block" />

            <div
              className="relative grid gap-7"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  program.journey.length,
                  6,
                )}, minmax(0, 1fr))`,
              }}
            >
              {program.journey.map((step, index) => {
                const Icon = journeyIcons[index % journeyIcons.length];

                return (
                  <div
                    key={`${step.title}-${step.time}`}
                    className="flex min-w-0 flex-col items-center text-center"
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#fff7f8] bg-[#9f1735] text-white shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-xs font-black text-[#271d20]">
                      {step.title}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#8b747a]">
                      {step.time}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CURRICULUM + CAPSTONE */}
      {/* ====================================================== */}
      <section
        id="curriculum"
        className="scroll-mt-24 px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            {/* CURRICULUM */}
            <div>
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9f1735]">
                  Structured Learning
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#201719]">
                  Curriculum
                </h2>
              </div>

              <div className="space-y-3">
                {program.curriculum.map((module, index) => (
                  <details
                    key={module.title}
                    open={index === 0}
                    className="group overflow-hidden rounded-2xl border border-[#ead7dc] bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 [&::-webkit-details-marker]:hidden">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9f1735] text-xs font-black text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#281f21]">
                          {module.title}
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-[#89767b]">
                          {module.lessons}
                        </p>
                      </div>

                      <ChevronDown className="h-4 w-4 shrink-0 text-[#9f1735] transition group-open:rotate-180" />
                    </summary>

                    <div className="border-t border-[#f0e2e6] bg-[#fff8f9] px-5 py-5">
                      <div className="space-y-3 pl-12">
                        {module.items.length > 0 ? (
                          module.items.map((item) => (
                            <div key={item} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b01b3d]" />

                              <p className="text-xs leading-5 text-[#6e6064]">
                                {item}
                              </p>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b01b3d]" />
                              <p className="text-xs leading-5 text-[#6e6064]">
                                Core concepts and fundamentals of {module.title}
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b01b3d]" />
                              <p className="text-xs leading-5 text-[#6e6064]">
                                Guided practical exercises and demonstrations
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b01b3d]" />
                              <p className="text-xs leading-5 text-[#6e6064]">
                                Hands-on activity and real-world application
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b01b3d]" />
                              <p className="text-xs leading-5 text-[#6e6064]">
                                Module assessment and skill review
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* CAPSTONE PROJECTS */}
            <div>
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9f1735]">
                    Build Your Portfolio
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#201719]">
                    Capstone Projects
                  </h2>
                </div>

                <span className="hidden text-xs font-black text-[#9f1735] sm:block">
                  {program.projects.length} Projects
                </span>
              </div>

              <div className="space-y-5">
                {program.projects.map((project) => (
                  <article
                    key={project.title}
                    className="group grid overflow-hidden rounded-[22px] border border-[#ead7dc] bg-white shadow-[0_12px_35px_rgba(71,25,37,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(159,23,53,0.1)] sm:grid-cols-[0.9fr_1.1fr]"
                  >
                    <div className="relative min-h-[210px] overflow-hidden bg-[#f2e8eb]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 40vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-6">
                      <h3 className="text-lg font-black text-[#241a1d]">
                        {project.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[#6b5e61]">
                        {project.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#9f1735]">
                        Project Details
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHY THIS PROGRAM */}
      {/* ====================================================== */}
      <section className="bg-[#fff7f8] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-5 md:grid-cols-3">
            <FeatureBox
              icon={ShieldCheck}
              title="Practical Learning"
              text="Learn through guided exercises and practical projects instead of theory alone."
            />

            <FeatureBox
              icon={Users}
              title="Mentor Support"
              text="Get structured guidance while progressing through each stage of the program."
            />

            <FeatureBox
              icon={Award}
              title="Portfolio & Certificate"
              text="Complete projects that demonstrate your skills and support future opportunities."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[30px] bg-gradient-to-r from-[#790821] via-[#a30f32] to-[#810922] px-7 py-10 text-white shadow-[0_28px_70px_rgba(92,2,26,0.24)] sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -left-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-64 rounded-full bg-[#f3be53]/20 blur-[95px]" />

          <div className="pointer-events-none absolute -right-14 top-0 h-64 w-64 rounded-full bg-[#f66b91]/20 blur-[90px]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                Start Your Journey Today
              </p>

              <h2 className="mt-3 max-w-[680px] text-3xl font-black tracking-tight sm:text-4xl">
                Start learning {program.title} {program.highlight}.
              </h2>

              <p className="mt-4 max-w-[650px] text-sm leading-7 text-white/75">
                Learn practical skills, complete meaningful projects, and build
                confidence through structured learning.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/admissions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-[#8f0b2b] transition hover:-translate-y-1"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#curriculum"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
              >
                <Download className="h-4 w-4" />
                Curriculum
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========================================================== */
/* SECTION HEADING */
/* ========================================================== */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-[720px] text-center">
      <h2 className="text-3xl font-black tracking-tight text-[#201719] sm:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#9f1735]" />

      {description && (
        <p className="mt-5 text-sm leading-7 text-[#706266]">{description}</p>
      )}
    </div>
  );
}

/* ========================================================== */
/* FEATURE BOX */
/* ========================================================== */

function FeatureBox({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#ead7dc] bg-white p-7 shadow-[0_12px_35px_rgba(71,25,37,0.05)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9f1735] text-white">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-black text-[#241a1d]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#6b5e61]">{text}</p>
    </div>
  );
}
