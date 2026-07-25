import Image from "next/image";
import Link from "next/link";

const PIC_IMAGE = "/about/pic.jpg";
const STUDENTS_IMAGE = "/about/strudents.jpg";
const LAPTOP_HERO_IMAGE = "/about/laptop-hero.jpg";

const stats = [
  { value: "10K+", label: "Students Guided" },
  { value: "150+", label: "Expert Educators" },
  { value: "25+", label: "Programs" },
  { value: "24/7", label: "Digital Access" },
];

const values = [
  {
    title: "Student-first Education",
    desc: "Every student learns differently. We focus on structured support, individual growth, and confidence-building.",
  },
  {
    title: "Digital Learning Ecosystem",
    desc: "We combine classes, assignments, performance tracking, parent updates, and learning resources in one connected system.",
  },
];

const story = [
  {
    title: "Foundation",
    desc: "We start with strong academic basics, discipline, and personal understanding of every learner.",
  },
  {
    title: "Guidance",
    desc: "Our educators guide students through structured classes, feedback, and consistent learning habits.",
  },
  {
    title: "Digital Growth",
    desc: "Students use smart tools, dashboards, resources, and reports to make learning more visible.",
  },
  {
    title: "Future Skills",
    desc: "We prepare students with confidence, communication, technology exposure, and practical learning.",
  },
];

const team = [
  {
    name: "Academic Mentors",
    role: "Subject Experts",
    desc: "Focused on concept clarity, discipline, and student confidence.",
  },
  {
    name: "Digital Learning Team",
    role: "Technology & Systems",
    desc: "Building dashboards, reports, digital classes, and learning tools.",
  },
  {
    name: "Student Success Team",
    role: "Support & Progress",
    desc: "Helping students and parents stay informed, supported, and guided.",
  },
];

const differences = [
  "Personalized learning dashboard",
  "Smart attendance and performance reports",
  "Digital resources and recorded learning",
  "Parent-friendly communication",
  "Future-skill based programs",
  "Student-first mentorship",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f3f4] text-slate-950">
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
                About Prime Digital School
              </p>

              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Shaping Future Leaders Through{" "}
                <span className="text-[#990024]">Digital Education</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                Prime Digital School is a modern learning ecosystem designed to
                bring students, parents, and educators together through smart
                technology, structured academics, and future-ready learning.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/programs"
                  className="rounded-full bg-[#990024] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(153,0,36,0.22)] transition hover:bg-[#78001c]"
                >
                  Explore Programs
                </Link>

                <Link
                  href="/contact"
                  className="rounded-full border border-[#990024]/20 bg-white px-6 py-3 text-sm font-bold text-[#990024] transition hover:bg-[#fff4f7]"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#990024]/10 blur-2xl" />
              <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-yellow-200/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-[#eadce1] bg-white p-3 shadow-[0_24px_70px_rgba(30,10,18,0.12)]">
                <div className="relative h-[330px] overflow-hidden rounded-[1.45rem] sm:h-[410px]">
                  <Image
                    src={STUDENTS_IMAGE}
                    alt="Students learning together"
                    fill
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="scale-[1.15] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              Who We Are
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              We are building a smarter way for students to learn and grow.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Prime Digital School is not just a classroom. It is a complete
              learning platform where students can attend classes, revise
              lessons, track progress, receive feedback, and grow through guided
              mentorship.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Our focus is to make education more transparent, more personal,
              and more outcome-driven.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="relative h-[340px] overflow-hidden rounded-[1.45rem]">
              <Image
                src={PIC_IMAGE}
                alt="Prime Digital School group"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT DRIVES US */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              What Drives Us
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A school built on clarity, care, and technology.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {values.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-[#eadce1] bg-[#fffafb] p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#990024] text-lg font-black text-white">
                  {index + 1}
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY TIMELINE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
            Our Story
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            From foundation to future success.
          </h2>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[#d9b8c2] lg:block" />

          <div className="grid gap-6 lg:grid-cols-2">
            {story.map((item, index) => (
              <div
                key={item.title}
                className={[
                  "rounded-[1.6rem] border border-[#eadce1] bg-white p-6 shadow-sm",
                  index % 2 === 0 ? "lg:mr-10" : "lg:ml-10 lg:translate-y-12",
                ].join(" ")}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7e6eb] text-sm font-black text-[#990024]">
                  {index + 1}
                </div>

                <h3 className="text-lg font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAROON STATS */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[1.6rem] bg-[#8f0024] shadow-[0_20px_60px_rgba(143,0,36,0.24)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="border-white/10 px-6 py-7 text-center text-white lg:border-r last:border-r-0"
            >
              <p className="text-3xl font-black">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-white/75">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              Our Success Team
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              The people behind student growth.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-[1.6rem] border border-[#eadce1] bg-[#fffafb] p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#990024] to-[#c14361] text-xl font-black text-white">
                  {member.name.charAt(0)}
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-bold text-[#990024]">
                  {member.role}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              Why We Are Different
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              We connect learning, tracking, support, and outcomes.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Prime Digital School gives students and parents more visibility,
              more structure, and a more modern learning experience.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {differences.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#eadce1] bg-white p-4 shadow-sm"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#990024] text-[10px] font-black text-white">
                    ✓
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="relative h-[245px] overflow-hidden rounded-[1.45rem]">
                <Image
                  src={LAPTOP_HERO_IMAGE}
                  alt="Digital learning on laptop"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="relative h-[245px] overflow-hidden rounded-[1.45rem]">
                <Image
                  src={STUDENTS_IMAGE}
                  alt="Students learning zoomed out"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="rounded-[2rem] border border-[#eadce1] bg-[#fffafb] p-8 shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#990024] text-2xl text-white">
              ★
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              We turn learning into confidence.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Our goal is to help every student feel supported, every parent
              feel informed, and every educator feel empowered with better tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#8f0024] text-white shadow-[0_24px_70px_rgba(155,0,35,0.25)] lg:grid-cols-[1fr_0.75fr]">
          <div className="p-8 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
              Join Prime Digital School
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to experience smarter learning?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Explore our programs, connect with our team, and start your
              journey with Prime Digital School today.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/programs"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#990024] transition hover:bg-[#fff4f7]"
              >
                View Programs
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Talk to Us
              </Link>
            </div>
          </div>

          <div className="relative min-h-[260px]">
            <Image
              src={STUDENTS_IMAGE}
              alt="Prime Digital School students"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8f0024] via-[#8f0024]/40 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}