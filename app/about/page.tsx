import Link from "next/link";
import Image from "next/image";
import AboutHeroAnimation from "@/components/about/AboutHeroAnimation";

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
      <section className="relative isolate overflow-hidden bg-[#790021] text-white">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#65001b] via-[#790021] to-[#430011]" />

        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
      `,
            backgroundSize: "70px 70px",
          }}
        />

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#bc174d]/20 blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#e1a74b]/10 blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-[105px] sm:px-8 sm:pt-[115px] lg:px-10 lg:pb-10 lg:pt-[120px]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#f2be59] shadow-[0_0_15px_rgba(242,190,89,0.7)]" />

                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f3c86a]">
                  About Prime Digital School
                </p>
              </div>

              <h1 className="mt-4 max-w-2xl text-[34px] font-black leading-[1.1] tracking-[-0.035em] text-white sm:text-[42px] lg:text-[48px]">
                Shaping Future
                <br />
                Leaders Through
                <br />
                <span className="text-[#f3c86a]">Digital Education</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#f2dfe5] sm:text-base">
                Prime Digital School is a modern learning ecosystem designed to
                bring students, parents, and educators together through smart
                technology, structured academics, and future-ready learning.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/programs"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#790021] shadow-[0_14px_35px_rgba(20,0,10,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fff2f5]"
                >
                  Explore Programs
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* RIGHT ANIMATION */}
            <div className="relative min-w-0">
              <AboutHeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-[#f7f3f4] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              Who We Are
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              We are building a smarter way for students to learn and grow.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Prime Digital School is not just a classroom. It is a complete
              learning platform where students can attend classes, revise
              lessons, track progress, receive feedback, and grow through guided
              mentorship.
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              Our focus is to make education more transparent, more personal,
              and more outcome-driven.
            </p>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-2"
            aria-label="Our approach to learning"
          >
            <div className="rounded-[1.5rem] bg-[#790021] p-6 text-white shadow-[0_18px_42px_rgba(121,0,33,0.16)] sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#f0c16b]">
                  Our approach
                </span>
                <span className="text-2xl font-black text-white/30">01</span>
              </div>
              <h3 className="mt-4 text-2xl font-black">
                Student-first. Future-ready.
              </h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                A connected learning experience that brings guidance, technology
                and progress together.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#eadce1] bg-white p-5 shadow-sm">
              <span className="text-xs font-black tracking-[0.18em] text-[#990024]">
                02 / LEARN
              </span>
              <h3 className="mt-4 text-lg font-black text-slate-950">
                Structured Learning
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Clear lessons, resources and practical learning pathways.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#eadce1] bg-white p-5 shadow-sm">
              <span className="text-xs font-black tracking-[0.18em] text-[#990024]">
                03 / GROW
              </span>
              <h3 className="mt-4 text-lg font-black text-slate-950">
                Guided Progress
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mentorship, feedback and greater visibility into progress.
              </p>
            </div>
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

      {/* AWARDS & RECOGNITION */}
      <section
        id="awards-recognition"
        className="relative overflow-hidden bg-[#fffafb] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* SECTION HEADING */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#990024]">
              Awards & Recognition
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Recognised for Excellence.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Celebrating the recognitions and achievements that mark our
              journey towards quality education and student success.
            </p>
          </div>

          {/* AWARD CARDS */}
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* JUSTDIAL AWARD */}
            <article className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-[#eadce1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
              <div className="relative flex h-[300px] items-center justify-center rounded-2xl bg-[#faf5f6] p-4 sm:h-[340px]">
                <div className="relative h-full w-full">
                  <Image
                    src="/about/justdail-award-1.png"
                    alt="Prime Digital School Justdial certification 2022"
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-6">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-[#990024]">
                  2022
                </span>

                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Justdial Certification
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  Prime Digital School, Vashi, Navi Mumbai, featured with a
                  Justdial certification in 2022.
                </p>

                <div className="mt-5 border-t border-[#eadce1] pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#990024]">
                    Justdial · 2022
                  </span>
                </div>
              </div>
            </article>

            {/* URBANPRO AWARD */}
            <article className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-[#eadce1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
              <div className="relative flex h-[300px] items-center justify-center rounded-2xl bg-[#faf5f6] p-4 sm:h-[340px]">
                <div className="relative h-full w-full">
                  <Image
                    src="/about/urban-pro-1.jpeg"
                    alt="UrbanPro Students Choice Award 2023"
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-6">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-[#990024]">
                  2023
                </span>

                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  UrbanPro Students' Choice Award
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  Students' Choice Award 2023 for Digital Marketing, presented
                  to Prime Digital School, Vashi, Navi Mumbai.
                </p>

                <div className="mt-5 border-t border-[#eadce1] pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#990024]">
                    UrbanPro · 2023 Winner
                  </span>
                </div>
              </div>
            </article>
          </div>
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
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
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

          <div className="overflow-hidden rounded-[2rem] bg-[#790021] p-7 text-white shadow-[0_22px_55px_rgba(121,0,33,0.17)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f0c16b]">
              A connected experience
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
              Everything students need to move forward.
            </h3>
            <div className="mt-7 space-y-3">
              {[
                ["01", "Learn", "Classes, lessons and digital resources"],
                ["02", "Track", "Attendance, feedback and learning progress"],
                ["03", "Grow", "Mentorship and future-focused skills"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-4"
                >
                  <span className="rounded-lg bg-white px-3 py-2 text-sm font-black text-[#790021]">
                    {number}
                  </span>
                  <div>
                    <p className="font-extrabold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/75">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
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
              feel informed, and every educator feel empowered with better
              tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#8f0024] px-8 py-10 text-white shadow-[0_24px_70px_rgba(155,0,35,0.25)] sm:px-12 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border-[38px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-16 h-32 w-32 rounded-full bg-[#f0c16b]/10 blur-3xl"
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f0c16b]">
                Join Prime Digital School
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Ready to experience smarter learning?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Explore our programs, connect with our team, and start your
                journey with Prime Digital School today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/programs"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#990024] transition hover:bg-[#fff4f7]"
              >
                View Programs
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
