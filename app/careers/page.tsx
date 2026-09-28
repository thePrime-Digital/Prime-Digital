import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
} from "lucide-react";

import CareerApplicationForm from "@/components/careers/career-application-form";
import CareerApplyButton from "@/components/careers/career-apply-button";

import { getPublishedCareerJobs } from "@/lib/careers/public-careers";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "/careers/hero-team.jpg";

const CULTURE_1 = "/careers/culture-1.jpg";

const CULTURE_2 = "/careers/culture-2.jpg";

const CULTURE_3 = "/careers/culture-3.jpg";

const whyWork = [
  {
    icon: "✦",
    title: "Real Impact",
    desc: "Shape student journeys and help build a future-ready learning ecosystem.",
  },
  {
    icon: "⚙",
    title: "Innovation Culture",
    desc: "Work with digital tools, modern systems, and AI-powered education ideas.",
  },
  {
    icon: "↗",
    title: "Career Growth",
    desc: "Grow with mentorship, leadership opportunities, and meaningful ownership.",
  },
  {
    icon: "♡",
    title: "People-first Place",
    desc: "A supportive team where educators, creators, and builders collaborate.",
  },
];

const benefits = [
  "Competitive salary packages",
  "Flexible working environment",
  "Learning and development support",
  "Leadership growth opportunities",
  "Performance-based incentives",
  "Collaborative modern workspace",
  "Recognition and reward culture",
  "Meaningful education impact",
];

const process = ["Apply", "Screening", "Interview", "Demo / Task", "Offer"];

const testimonials = [
  {
    quote:
      "Prime Digital School gives you space to create, teach, and genuinely impact students.",
    name: "Academic Team",
    role: "Mentor",
  },
  {
    quote:
      "The team culture is young, energetic, and focused on building something meaningful.",
    name: "Digital Team",
    role: "Learning Executive",
  },
  {
    quote:
      "Every day feels like building the future of education with real ownership.",
    name: "Growth Team",
    role: "Operations",
  },
];

const studentSuccessStories = [
  {
    id: 1,
    name: "Aditya Verma",
    image: "/students/aditya-verma.webp",
    category: "Placement",
    achievement: "Technology • Career Preparation",
    review:
      "Practical projects and mentor guidance helped me strengthen my skills and become more confident about professional opportunities.",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Akshay Patil",
    image: "/students/akshay-patil.webp",
    category: "Internship",
    achievement: "Portfolio • Internship Preparation",
    review:
      "The learning experience helped me build confidence, improve my portfolio, and prepare for internship opportunities.",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Ananya Joshi",
    image: "/students/ananya-joshi.webp",
    category: "Projects",
    achievement: "Hands-on Learning • Projects",
    review:
      "Hands-on learning made complex concepts easier to understand and gave me practical experience beyond theory.",
    rating: 4.7,
  },
];

function formatCareerDeadline(value: string | null): string {
  if (!value) {
    return "Open until filled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Open until filled";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BriefcaseBusinessIcon() {
  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f4] text-2xl text-[#8f0024]">
      💼
    </div>
  );
}

export default async function CareersPage() {
  let positions: Awaited<ReturnType<typeof getPublishedCareerJobs>> = [];

  let jobsUnavailable = false;

  try {
    positions = await getPublishedCareerJobs();
  } catch (error) {
    jobsUnavailable = true;

    console.error("[CAREERS_PAGE] Unable to load published vacancies:", error);
  }

  return (
    <main className="min-h-screen bg-[#f7f3f4] pt-[135px] text-[#101828]">
      {/* HERO */}
      <section className="px-5 pb-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px] text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-[#fff1f4] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
            We Are Hiring
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#101828] sm:text-5xl lg:text-6xl">
            Build the Future of Education{" "}
            <span className="text-[#8f0024]">With Us</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
            Join a passionate team of educators, designers, technologists, and
            innovators working together to create smarter learning experiences
            for students.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="#open-positions"
              className="rounded-lg bg-[#8f0024] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(143,0,36,0.22)] transition hover:bg-[#70001c]"
            >
              View Open Roles
            </Link>

            <Link
              href="#apply"
              className="rounded-lg border border-[#8f0024]/25 bg-white px-6 py-3 text-sm font-bold text-[#8f0024] transition hover:bg-[#fff4f7]"
            >
              Apply Now
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-[#eadada] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="relative h-[260px] overflow-hidden rounded-xl sm:h-[360px]">
              <Image
                src={HERO_IMAGE}
                alt="Prime Digital School team"
                fill
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Why Work With Us?
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              A place to grow, build, and make a difference.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyWork.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-[#eadada] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(143,0,36,0.12)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f4] text-xl font-black text-[#8f0024] transition-all duration-300 group-hover:bg-[#8f0024] group-hover:text-white">
                  {item.icon}
                </div>

                <h3 className="mt-4 text-base font-black text-[#101828]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ===================================================== */}
      {/* STUDENT SUCCESS STORIES */}
      {/* ===================================================== */}

      <section className="bg-[#fbf8f6] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">

          {/* HEADER */}

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[680px]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
                Student Success Stories
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828] sm:text-4xl">
                See the impact your work can help create.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667085] sm:text-base">
                From practical projects to career preparation, our learners
                build confidence and real-world digital skills through hands-on
                experiences.
              </p>
            </div>

            <Link
              href="/student-stories"
              className="group inline-flex w-fit items-center gap-2 text-sm font-black text-[#8f0024] transition hover:text-[#70001c]"
            >
              View More Stories

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* STORY CARDS */}

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {studentSuccessStories.map((story) => (
              <article
                key={story.id}
                className="group flex h-full flex-col rounded-[22px] border border-[#eadfe1] bg-white p-6 shadow-[0_12px_35px_rgba(69,18,31,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8f0024]/20 hover:shadow-[0_20px_45px_rgba(69,18,31,0.10)]"
              >
                {/* PROFILE */}

                <div className="flex items-start gap-4">
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#8f0024] shadow-[0_8px_20px_rgba(143,0,36,0.16)]">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      sizes="60px"
                      className="object-cover object-[center_30%]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-[#172033]">
                      {story.name}
                    </h3>

                    {/* RATING */}

                    <div className="mt-1.5 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const filled =
                          index < Math.round(story.rating);

                        return (
                          <Star
                            key={index}
                            size={14}
                            className={
                              filled
                                ? "fill-[#f7b500] text-[#f7b500]"
                                : "fill-transparent text-[#d7d7d7]"
                            }
                          />
                        );
                      })}

                      <span className="ml-1 text-[11px] font-bold text-slate-500">
                        {story.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* CATEGORY */}

                    <span className="mt-2 inline-flex rounded-full bg-[#fff1f4] px-3 py-1 text-[10px] font-black text-[#8f0024]">
                      {story.category}
                    </span>
                  </div>
                </div>

                {/* REVIEW */}

                <p className="mt-5 flex-1 text-sm leading-7 text-[#667085]">
                  “{story.review}”
                </p>

                {/* ACHIEVEMENT */}

                <div className="mt-5 border-t border-[#f0e6e7] pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8f0024]">
                    Achievement
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#475467]">
                    {story.achievement}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* DISCLAIMER */}

          <p className="mx-auto mt-6 max-w-[760px] text-center text-[10px] leading-5 text-[#98A2B3]">
            Illustrative student-experience stories and demo ratings are shown
            for website preview purposes. Confirm student feedback, outcomes,
            and publication permission before presenting them as verified
            testimonials.
          </p>

        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1050px] rounded-2xl border border-[#eadada] bg-white p-7 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Employee Benefits
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Designed for ambitious educators and builders.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8f0024] text-[10px] font-black text-white">
                  ✓
                </span>

                <p className="text-sm font-semibold leading-6 text-[#475467]">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section
        id="open-positions"
        className="bg-white px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Open Positions
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Find your next role at Prime Digital School.
            </h2>
          </div>

          {jobsUnavailable ? (
            <div className="mt-10 rounded-2xl border border-[#eadada] bg-[#fffafb] px-6 py-14 text-center">
              <BriefcaseBusinessIcon />

              <h3 className="mt-4 text-lg font-black text-[#101828]">
                Open positions temporarily unavailable
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#667085]">
                We are temporarily unable to load our current career
                opportunities. Please try again shortly.
              </p>
            </div>
          ) : positions.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-[#eadada] bg-[#fffafb] px-6 py-14 text-center">
              <BriefcaseBusinessIcon />

              <h3 className="mt-4 text-lg font-black text-[#101828]">
                No open positions right now
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#667085]">
                We do not currently have any published vacancies. Please check
                back soon for new opportunities at Prime Digital School.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {positions.map((job) => (
                <article
                  key={job.id}
                  className="relative flex flex-col rounded-xl border border-[#eadada] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(143,0,36,0.12)]"
                >
                  {job.featured && (
                    <div className="absolute right-4 top-4 rounded-full bg-[#8f0024] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                      Featured
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pr-20">
                    <span className="rounded-full bg-[#fff1f4] px-3 py-1 text-xs font-black text-[#8f0024]">
                      {job.employmentType}
                    </span>

                    {job.workMode && (
                      <span className="rounded-full bg-[#f7f3f4] px-3 py-1 text-[10px] font-bold text-[#667085]">
                        {job.workMode}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8f0024]">
                    {job.department}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#101828]">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-xs font-bold text-[#667085]">
                    📍 {job.location}
                  </p>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#667085]">
                    {job.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-[#f0e6e7] pt-4 text-xs text-[#667085]">
                    {job.experience && (
                      <p>
                        <span className="font-black text-[#101828]">
                          Experience:
                        </span>{" "}
                        {job.experience}
                      </p>
                    )}

                    <p>
                      <span className="font-black text-[#101828]">
                        Vacancies:
                      </span>{" "}
                      {job.vacancies}
                    </p>

                    {job.salary && (
                      <p>
                        <span className="font-black text-[#101828]">
                          Compensation:
                        </span>{" "}
                        {job.salary}
                      </p>
                    )}

                    <p>
                      <span className="font-black text-[#101828]">
                        Deadline:
                      </span>{" "}
                      {formatCareerDeadline(job.deadline)}
                    </p>
                  </div>

                  <CareerApplyButton jobId={job.id} />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1050px] text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Our Hiring Process
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
            Simple, transparent, and fast.
          </h2>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-6 hidden h-[2px] bg-[#eadada] md:block" />

            <div className="relative grid gap-6 md:grid-cols-5">
              {process.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8f0024] text-sm font-black text-white shadow-[0_12px_24px_rgba(143,0,36,0.22)]">
                    {index + 1}
                  </div>

                  <p className="mt-3 text-sm font-black text-[#101828]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CULTURE */}
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1220px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 h-[240px] overflow-hidden rounded-2xl shadow-sm sm:col-span-1 sm:h-[380px]">
              <Image
                src={HERO_IMAGE}
                alt="Prime Digital School workspace"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="grid gap-4">
              <div className="relative h-[180px] overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={CULTURE_1}
                  alt="Prime Digital School team discussion"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="relative h-[180px] overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={CULTURE_2}
                  alt="Prime Digital School classroom collaboration"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="relative col-span-2 h-[210px] overflow-hidden rounded-2xl shadow-sm">
              <Image
                src={CULTURE_3}
                alt="Prime Digital School presentation"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Life at Prime
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828] sm:text-4xl">
              Work with a team that believes education can be better.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#667085] sm:text-base">
              Our workplace brings together teachers, technologists, designers,
              operations experts, and student success teams. We value ownership,
              clear communication, creativity, and care.
            </p>

            <div className="mt-7 rounded-2xl border border-[#eadada] bg-[#fffafb] p-6">
              <h3 className="text-lg font-black text-[#101828]">
                Our Culture Promise
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#667085]">
                You will be encouraged to think, lead, experiment, and improve
                the learning experience for students every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <CareerApplicationForm jobs={positions} />

      {/* TESTIMONIALS */}
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Team Voices
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              What our people say.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-[#eadada] bg-[#fffafb] p-6 shadow-sm"
              >
                <p className="text-sm leading-7 text-[#667085]">
                  “{item.quote}”
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8f0024] text-sm font-black text-white">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#101828]">
                      {item.name}
                    </p>

                    <p className="text-xs text-[#667085]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px] rounded-2xl bg-[#8f0024] px-6 py-14 text-center text-white shadow-[0_24px_60px_rgba(143,0,36,0.22)] sm:px-10">
          <h2 className="text-3xl font-black tracking-tight">
            Ready to make a difference?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80">
            Become part of Prime Digital School and help us build a smarter,
            stronger, and more future-ready education system.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="#apply"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#8f0024] transition hover:bg-[#fff4f7]"
            >
              Apply Now
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Contact HR
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#181818] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1220px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-black">Prime Digital School</h3>

            <p className="mt-2 text-xs text-white/55">
              A future-ready digital school for modern education.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-white/60">
            <Link href="/privacy-policy">Privacy Policy</Link>

            <Link href="/terms">Terms of Service</Link>

            <Link href="/support">Support Hub</Link>

            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
