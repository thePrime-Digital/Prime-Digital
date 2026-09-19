"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  FolderKanban,
  GraduationCap,
  HeartHandshake,
  Star,
} from "lucide-react";

import { useMemo, useState } from "react";

type StoryCategory =
  | "Placement"
  | "Internship"
  | "Career Support"
  | "Projects";

type Story = {
  id: number;
  name: string;
  initials: string;
  image: string;
  category: StoryCategory;
  title: string;
  story: string;
  organisation: string;
  role: string;
  date: string;
  rating: number;
};

const filters = [
  "All",
  "Placement",
  "Internship",
  "Career Support",
  "Projects",
] as const;

type Filter = (typeof filters)[number];

/*
  Illustrative review copy and ratings for the website preview.
  Confirm actual feedback, outcomes, and publication permission
  before presenting these as verified student testimonials.
*/

const stories: Story[] = [
  {
    id: 1,
    name: "Aditya Verma",
    initials: "AV",
    image: "/students/aditya-verma.webp",
    category: "Placement",
    title: "Placement Journey",
    story:
      "Practical projects and mentor guidance helped me strengthen my skills and become more confident about professional opportunities.",
    organisation: "Career Outcome",
    role: "Technology",
    date: "2026",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Aditya Agarwal",
    initials: "AA",
    image: "/students/aditya-agarwal.webp",
    category: "Projects",
    title: "Project Experience",
    story:
      "Working on practical projects helped me understand how the concepts I learned can be applied to real-world problems.",
    organisation: "Prime Digital School",
    role: "Student Project",
    date: "2026",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Akshay Patil",
    initials: "AP",
    image: "/students/akshay-patil.webp",
    category: "Internship",
    title: "Internship Experience",
    story:
      "The learning experience helped me build confidence, improve my portfolio, and prepare for internship opportunities.",
    organisation: "Career Experience",
    role: "Internship",
    date: "2026",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Alok Singh",
    initials: "AS",
    image: "/students/alok-singh.webp",
    category: "Career Support",
    title: "Career Guidance",
    story:
      "The guidance I received helped me understand career options, improve my preparation, and plan my next steps.",
    organisation: "Prime Digital School",
    role: "Career Support",
    date: "2026",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Ananya Joshi",
    initials: "AJ",
    image: "/students/ananya-joshi.webp",
    category: "Projects",
    title: "Building Real Skills",
    story:
      "Hands-on learning made complex concepts easier to understand and gave me practical experience beyond theory.",
    organisation: "Prime Digital School",
    role: "Project Learning",
    date: "2026",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Arpit Gupta",
    initials: "AG",
    image: "/students/arpit-gupta.webp",
    category: "Placement",
    title: "Career Preparation",
    story:
      "The structured learning approach helped me improve both technical skills and the confidence needed for career opportunities.",
    organisation: "Career Outcome",
    role: "Digital Skills",
    date: "2026",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Harshita More",
    initials: "HM",
    image: "/students/harshita-more.webp",
    category: "Internship",
    title: "Industry Exposure",
    story:
      "Projects and mentor feedback helped me understand how digital skills are used in professional environments.",
    organisation: "Industry Exposure",
    role: "Internship",
    date: "2026",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Karan Deshmukh",
    initials: "KD",
    image: "/students/karan-deshmukh.webp",
    category: "Career Support",
    title: "Mentorship Experience",
    story:
      "Having access to guidance and feedback helped me identify my strengths and work on areas that needed improvement.",
    organisation: "Prime Digital School",
    role: "Mentorship",
    date: "2026",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Ranjeet",
    initials: "R",
    image: "/students/ranjeet.webp",
    category: "Projects",
    title: "Learning by Building",
    story:
      "Creating practical projects gave me a much clearer understanding of the subject and helped me build my portfolio.",
    organisation: "Prime Digital School",
    role: "Student Project",
    date: "2026",
    rating: 4.7,
  },
  {
    id: 10,
    name: "Akash",
    initials: "A",
    image: "/students/akash.webp",
    category: "Placement",
    title: "Preparing for Opportunities",
    story:
      "The combination of skills, projects, and career preparation gave me a structured path toward professional opportunities.",
    organisation: "Career Outcome",
    role: "Career Preparation",
    date: "2026",
    rating: 4.9,
  },
  {
    id: 11,
    name: "Aman",
    initials: "A",
    image: "/students/aman.webp",
    category: "Internship",
    title: "Practical Experience",
    story:
      "The practical learning approach helped me become more comfortable working on real assignments and professional tasks.",
    organisation: "Industry Experience",
    role: "Internship",
    date: "2026",
    rating: 4.5,
  },
  {
    id: 12,
    name: "Darshit",
    initials: "D",
    image: "/students/darshit.webp",
    category: "Career Support",
    title: "Building Confidence",
    story:
      "The learning environment and regular guidance helped me become more confident about my skills and career direction.",
    organisation: "Prime Digital School",
    role: "Career Support",
    date: "2026",
    rating: 4.8,
  },
  {
    id: 13,
    name: "Kanade",
    initials: "K",
    image: "/students/kanade.webp",
    category: "Placement",
    title: "Portfolio Preparation",
    story:
      "Working through projects and receiving guidance gave me clearer examples of my skills to include in a portfolio.",
    organisation: "Career Outcome",
    role: "Portfolio Development",
    date: "2026",
    rating: 4.8,
  },
  {
    id: 14,
    name: "Vaibhava",
    initials: "V",
    image: "/students/vaibhava.webp",
    category: "Projects",
    title: "From Idea to Project",
    story:
      "Breaking a larger idea into manageable milestones helped me develop a working project and explain the decisions behind it.",
    organisation: "Prime Digital School",
    role: "Student Project",
    date: "2026",
    rating: 4.6,
  },
  {
    id: 15,
    name: "Ritamvara",
    initials: "R",
    image: "/students/ritamvara.webp",
    category: "Internship",
    title: "Workplace Skills Practice",
    story:
      "Practicing documentation, teamwork, and presenting my work helped me understand how digital skills can be used in professional assignments.",
    organisation: "Career Experience",
    role: "Internship Preparation",
    date: "2026",
    rating: 4.9,
  },
  {
    id: 16,
    name: "Priyanka",
    initials: "P",
    image: "/students/priyanka.webp",
    category: "Career Support",
    title: "Clearer Next Steps",
    story:
      "Career discussions helped me identify relevant skills to develop and create a structured plan for my next learning milestones.",
    organisation: "Prime Digital School",
    role: "Career Support",
    date: "2026",
    rating: 4.5,
  },
  {
    id: 17,
    name: "Neha Singh",
    initials: "NS",
    image: "/students/neha-singh.webp",
    category: "Placement",
    title: "Showcasing Practical Skills",
    story:
      "Completing a portfolio of projects gave me concrete examples to discuss while exploring professional opportunities.",
    organisation: "Career Outcome",
    role: "Career Preparation",
    date: "2026",
    rating: 4.7,
  },
  {
    id: 18,
    name: "Omkar Paturkar",
    initials: "OP",
    image: "/students/omkar-paturkar.webp",
    category: "Projects",
    title: "Learning Through Feedback",
    story:
      "Creating and improving a practical project after each round of feedback gave me a deeper understanding of the subject.",
    organisation: "Prime Digital School",
    role: "Student Project",
    date: "2026",
    rating: 4.4,
  },
];

function getCategoryIcon(category: StoryCategory) {
  if (category === "Placement") {
    return BriefcaseBusiness;
  }

  if (category === "Internship") {
    return GraduationCap;
  }

  if (category === "Projects") {
    return FolderKanban;
  }

  return HeartHandshake;
}

export default function StudentStoriesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const [visibleCount, setVisibleCount] = useState(9);

  const filteredStories = useMemo(() => {
    if (activeFilter === "All") {
      return stories;
    }

    return stories.filter(
      (story) => story.category === activeFilter
    );
  }, [activeFilter]);

  const visibleStories = filteredStories.slice(
    0,
    visibleCount
  );

  function handleFilterChange(filter: Filter) {
    setActiveFilter(filter);
    setVisibleCount(9);
  }

  return (
    <main className="min-h-screen bg-[#fbf8f6] pb-24 pt-[140px]">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden px-5 pb-10 sm:px-8 lg:px-12">

        <div className="pointer-events-none absolute -left-24 top-0 h-[300px] w-[300px] rounded-full bg-[#8f0024]/5 blur-[90px]" />

        <div className="pointer-events-none absolute -right-24 top-10 h-[300px] w-[300px] rounded-full bg-[#d8b04c]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[1180px] text-center">

          <div className="flex items-center justify-center gap-4">

            <span className="h-px w-8 bg-[#8f0024]/40" />

            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8f0024] sm:text-xs">
              Student Stories
            </p>

            <span className="h-px w-8 bg-[#8f0024]/40" />

          </div>

          <h1 className="mt-4 text-4xl font-black tracking-[-1.5px] text-[#7c001d] sm:text-5xl lg:text-[58px]">
            Student Success Stories
          </h1>

          <p className="mx-auto mt-5 max-w-[650px] text-sm font-medium leading-7 text-slate-500 sm:text-base">
            Explore practical learning, projects and career preparation
            through illustrative student-experience stories.
          </p>

          <div className="mx-auto mt-6 h-[2px] w-14 rounded-full bg-[#8f0024]" />

          <p className="mx-auto mt-4 max-w-[680px] text-xs font-semibold text-[#8f0024]">
            Example review copy and demo ratings shown for layout preview;
            these are not verified student testimonials or outcomes.
          </p>

        </div>

      </section>


      {/* ====================================================== */}
      {/* FILTERS */}
      {/* ====================================================== */}

      <section className="px-5 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-[1180px]">

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">

            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={[
                    "rounded-full border px-6 py-3 text-xs font-black transition-all duration-300 sm:text-sm",
                    active
                      ? "border-[#8f0024] bg-[#8f0024] text-white shadow-[0_10px_25px_rgba(143,0,36,0.18)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#8f0024]/30 hover:text-[#8f0024]",
                  ].join(" ")}
                >
                  {filter}
                </button>
              );
            })}

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* STUDENT STORIES */}
      {/* ====================================================== */}

      <section className="mt-8 px-5 sm:px-8 lg:px-12">

        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-2 lg:grid-cols-3">

          {visibleStories.map((story) => {
            const CategoryIcon = getCategoryIcon(
              story.category
            );

            return (
              <article
                key={story.id}
                className="group flex min-h-[330px] flex-col rounded-[22px] border border-[#eadfe1] bg-white p-6 shadow-[0_14px_45px_rgba(69,18,31,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#8f0024]/20 hover:shadow-[0_22px_55px_rgba(69,18,31,0.11)]"
              >

                {/* STUDENT PROFILE */}

                <div className="flex items-start gap-4">

                  {/* STUDENT PHOTO */}

                  <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8f0024] to-[#5d0017] text-sm font-black text-white shadow-[0_8px_20px_rgba(143,0,36,0.18)]">

                    <Image
                      src={story.image}
                      alt={`Portrait provided for ${story.name}`}
                      fill
                      sizes="58px"
                      className="object-cover object-[center_30%]"
                    />

                  </div>

                  {/* STUDENT NAME AND RATING */}

                  <div className="min-w-0 flex-1">

                    <h2 className="text-[16px] font-black text-[#172033]">
                      {story.name}
                    </h2>

                    {/* STAR RATING */}

                    <div className="mt-1.5 flex items-center gap-1">

                      {Array.from({ length: 5 }).map(
                        (_, index) => {
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
                        }
                      )}

                      <span className="ml-1 text-[11px] font-bold text-slate-500">
                        {story.rating.toFixed(1)}
                      </span>

                    </div>

                    {/* CATEGORY */}

                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff2f5] px-3 py-1 text-[10px] font-bold text-[#8f0024]">

                      <CategoryIcon size={12} />

                      {story.category}

                      {" — "}

                      {story.title}

                    </div>

                  </div>

                </div>


                {/* ====================================================== */}
                {/* REVIEW */}
                {/* ====================================================== */}

                <blockquote className="mt-6 flex-1 text-[14px] font-medium leading-6 text-slate-600">
                  “{story.story}”
                </blockquote>


                {/* ====================================================== */}
                {/* META */}
                {/* ====================================================== */}

                <div className="mt-6 border-t border-slate-100 pt-4">

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold text-slate-500">

                    <div className="flex items-center gap-2">

                      <BriefcaseBusiness
                        size={14}
                        className="text-[#8f0024]"
                      />

                      <span>
                        {story.organisation}
                      </span>

                      <span className="text-slate-300">
                        |
                      </span>

                      <span>
                        {story.role}
                      </span>

                    </div>

                    <div className="flex items-center gap-1.5">

                      <CalendarDays
                        size={14}
                        className="text-[#8f0024]"
                      />

                      {story.date}

                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </div>


        {/* ====================================================== */}
        {/* LOAD MORE */}
        {/* ====================================================== */}

        {visibleCount < filteredStories.length && (

          <div className="mt-10 flex justify-center">

            <button
              type="button"
              onClick={() =>
                setVisibleCount(
                  (count) => count + 6
                )
              }
              className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#8f0024] px-8 text-sm font-black text-white shadow-[0_14px_30px_rgba(143,0,36,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-[#70001c]"
            >

              Load More

              <ArrowRight size={17} />

            </button>

          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="mt-20 px-5 sm:px-8 lg:px-12">

        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#690019] via-[#820020] to-[#a11233] px-7 py-10 text-center text-white shadow-[0_25px_65px_rgba(105,0,25,0.2)] sm:px-10 sm:py-12">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />

          <div className="relative">

            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/65">
              Your Journey Can Start Here
            </p>

            <h2 className="mx-auto mt-3 max-w-[650px] text-3xl font-black tracking-tight sm:text-4xl">
              Build Skills. Create Projects. Prepare for Your Future.
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-white/75">
              Explore Prime Digital School programs designed around practical
              learning, digital skills and future-focused education.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <Link
                href="/programs"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-black text-[#7c001d] transition hover:-translate-y-1"
              >

                Explore Programs

                <ArrowRight size={16} />

              </Link>

              <Link
                href="/admissions"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/15"
              >

                Apply Now

              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}