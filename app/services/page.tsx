import Link from "next/link";

const navItems = [
  { label: "Solutions", href: "#solutions" },
  { label: "Systems", href: "#systems" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const stats = [
  { value: "25+", label: "Digital Solutions" },
  { value: "10K+", label: "Users Impacted" },
  { value: "99%", label: "Build Quality" },
  { value: "24/7", label: "Digital Access" },
];

const solutions = [
  {
    number: "01",
    title: "Website & Landing Page Systems",
    desc: "Premium websites, school portals, landing pages, and high-conversion digital storefronts.",
  },
  {
    number: "02",
    title: "Student & Admin Dashboards",
    desc: "Role-based portals for students, parents, educators, admins, fees, homework, attendance, and reports.",
  },
  {
    number: "03",
    title: "AI Automation Workflows",
    desc: "AI chatbots, lead handling, support automation, content workflows, and internal productivity systems.",
  },
  {
    number: "04",
    title: "CRM & Admission Funnels",
    desc: "Admission forms, lead tracking, enquiry management, follow-ups, and conversion-focused pipelines.",
  },
  {
    number: "05",
    title: "Branding & UI Experience",
    desc: "Modern design systems, brand identity, app UI, dashboard interfaces, presentations, and digital assets.",
  },
  {
    number: "06",
    title: "Analytics & Performance Reports",
    desc: "Dashboards that track learning, revenue, users, leads, attendance, results, and operational performance.",
  },
  {
    number: "07",
    title: "Marketing",
    desc: "Strategic campaigns, audience targeting, lead generation, promotional planning, and growth-focused marketing solutions.",
  },
  {
    number: "08",
    title: "Social Media Marketing",
    desc: "Content strategy, social campaigns, posting, audience engagement, brand growth, and performance across major platforms.",
  },
  {
    number: "09",
    title: "PR Team",
    desc: "Public relations, media outreach, brand communication, reputation management, partnerships, and visibility-focused campaigns.",
  },
];

const systems = [
  "School ERP",
  "Student Portal",
  "Parent Dashboard",
  "Educator Console",
  "AI Helpdesk",
  "CRM Pipeline",
  "Fee Management",
  "Performance Reports",
];

const projects = [
  {
    title: "Learning Management Platform",
    desc: "A complete student, teacher, parent, and admin ecosystem for modern digital education.",
    image: "/services/projects/learning-management-platform.png",
  },
  {
    title: "Admissions Growth Engine",
    desc: "Lead capture, enquiry tracking, follow-up automation, forms, and conversion-focused landing pages.",
    image: "/services/projects/admissions-growth-engine.png",
  },
  {
    title: "AI Support Desk",
    desc: "Instant FAQ handling, student support, parent queries, and automated service workflows.",
    image: "/services/projects/ai-support-desk.png",
  },
];

const pricing = [
  {
    name: "Launch",
    price: "₹9,999",
    desc: "For landing pages and small digital launches.",
    features: [
      "1 premium page",
      "Responsive design",
      "Contact form",
      "Basic SEO",
    ],
  },
  {
    name: "Growth",
    price: "₹19,999",
    desc: "For serious websites and business systems.",
    features: ["Up to 5 pages", "Premium UI", "Lead system", "Basic dashboard"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For portals, dashboards, CRM, AI, and apps.",
    features: [
      "Custom platform",
      "Database setup",
      "Admin control",
      "AI automation",
    ],
  },
];

const faqs = [
  "Can you build a complete school website?",
  "Can you build student, parent, educator, and admin dashboards?",
  "Can Prime Digital Agency build AI automation?",
  "Can this later become a mobile app?",
  "How long does a basic website take?",
];

export default function ServicesPage() {
  return (
    <main className="services-page min-h-screen overflow-hidden bg-white text-slate-950">
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8 lg:px-0">
          <Link href="/" className="flex items-center">
            <img
              src="/logoPDA.png"
              alt="Prime Digital Agency"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 transition hover:text-cyan-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 sm:inline-flex"
            >
              School Site
            </Link>

            <Link
              href="/contact"
              className="rounded-full bg-cyan-500 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(6,182,212,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              Start Project
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-5 pb-20 pt-36 sm:px-8 lg:px-10">
        <div className="absolute left-1/2 top-[-160px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-200/40 blur-[150px]" />

        <div className="absolute right-[-100px] top-40 h-[420px] w-[420px] rounded-full bg-rose-100/70 blur-[120px]" />

        <div className="absolute bottom-0 left-[-160px] h-[360px] w-[360px] rounded-full bg-blue-100/70 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-700">
              Prime Digital Agency
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              One Intelligent
              <br />
              Platform.
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">
                Unlimited Digital
                <br />
                Possibilities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              We build websites, portals, dashboards, CRM systems, AI
              automations, and complete digital ecosystems for schools,
              institutes, startups, and growing businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#solutions"
                className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(6,182,212,0.22)] transition hover:-translate-y-1 hover:bg-cyan-600"
              >
                Explore Solutions
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50"
              >
                Book Consultation
              </Link>
            </div>
          </div>

          {/* HERO CONSOLE */}
          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400">
                      Solution Console
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      Live Build System
                    </p>
                  </div>

                  <div className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                    ACTIVE
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {["Website Build", "AI Workflow", "Dashboard Engine"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-black text-slate-800">
                            {item}
                          </p>

                          <p className="text-xs font-black text-cyan-600">
                            {index === 0 ? "92%" : index === 1 ? "74%" : "88%"}
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={[
                              "h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500",

                              index === 0
                                ? "w-[92%]"
                                : index === 1
                                  ? "w-[74%]"
                                  : "w-[88%]",
                            ].join(" ")}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {stats.slice(0, 3).map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                    >
                      <p className="text-lg font-black text-cyan-600">
                        {item.value}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1180px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
            >
              <p className="text-3xl font-black text-cyan-600">{item.value}</p>

              <p className="mt-2 text-xs font-bold text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section
        id="solutions"
        className="relative bg-slate-50/70 px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100 blur-[120px]" />

        <div className="relative mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
              Solution Suite
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Digital architecture for high-performance growth.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
              Modern systems designed to help businesses, schools and
              organisations operate smarter.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-[0_24px_60px_rgba(6,182,212,0.12)]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-black text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                  {item.number}
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {item.desc}
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex text-sm font-black text-cyan-600 transition group-hover:translate-x-1"
                >
                  Discuss Project →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEMS */}
      <section id="systems" className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
                Intelligent Systems
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                We do not just make pages. We build connected systems.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                Prime Digital Agency connects frontend design, backend
                logic, databases, automation, dashboards, and reporting into one
                clean digital workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {systems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-800">{item}</p>

                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="bg-slate-50/70 px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
                Work Examples
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Systems we can build for you.
              </h2>
            </div>

            <Link
              href="/contact"
              className="w-fit rounded-xl border border-cyan-200 bg-white px-5 py-3 text-sm font-black text-cyan-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              Start Your Project
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((item, index) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-[0_28px_70px_rgba(6,182,212,0.14)]"
              >
                <div className="relative h-[230px] overflow-hidden border-b border-slate-200 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
                </div>

                <div className="p-7">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                    PROJECT 0{index + 1}
                  </p>

                  <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-slate-500">
                    {item.desc}
                  </p>

                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-600 transition group-hover:gap-4"
                  >
                    Build Similar System
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ALL DIGITAL ↔ PRIME DIGITAL SCHOOL */}
      <section className="bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1232px] overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_30px_85px_rgba(15,23,42,0.12)]">
          <div className="grid min-h-[370px] grid-cols-1 md:grid-cols-2">
            {/* ====================================== */}
            {/* ALL DIGITAL SOLUTIONS — LIGHT */}
            {/* ====================================== */}
            <div className="relative flex flex-col justify-center overflow-hidden border-b border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50 px-8 py-12 md:border-b-0 md:border-r md:px-16">
              <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-200/55 blur-[100px]" />

              <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-blue-100/70 blur-[110px]" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-10 items-center rounded-full border border-cyan-200 bg-white/80 px-5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-700">
                  Prime Digital Agency
                </div>

                <h2 className="max-w-[420px] text-4xl font-light leading-[1.12] tracking-[-1.5px] text-slate-950 md:text-5xl">
                  The Platform
                  <br />
                  Solutions
                </h2>

                <p className="mt-7 max-w-[400px] text-sm leading-7 text-slate-500">
                  Access our complete digital architecture built for websites,
                  apps, dashboards, AI systems, and high-performance operations.
                </p>

                <Link
                  href="/services"
                  className="mt-9 inline-flex h-14 items-center justify-center gap-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 text-sm font-black text-white shadow-[0_18px_40px_rgba(6,182,212,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(6,182,212,0.32)]"
                >
                  Enter Portal
                  <span className="text-2xl leading-none">→</span>
                </Link>
              </div>
            </div>

            {/* ====================================== */}
            {/* PRIME DIGITAL SCHOOL — MAROON */}
            {/* ====================================== */}
            <div className="relative flex flex-col justify-center overflow-hidden bg-[#9f1735] px-8 py-12 md:px-16">
              <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-[95px]" />

              <div className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-[#d8b04c]/10 blur-[100px]" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/90">
                  Prime Digital School
                </div>

                <h2 className="max-w-[420px] text-4xl font-light leading-[1.12] tracking-[-1.5px] text-white md:text-5xl">
                  The Executive
                  <br />
                  School
                </h2>

                <p className="mt-7 max-w-[400px] text-sm leading-7 text-white/65">
                  Upskill students and future leaders with structured programs,
                  digital education, expert mentors, and practical learning.
                </p>

                <Link
                  href="/programs"
                  className="mt-9 inline-flex h-14 items-center justify-center gap-9 rounded-xl bg-[#e0b938] px-8 text-sm font-black text-[#321508] shadow-[0_18px_38px_rgba(46,15,5,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#edc84d]"
                >
                  Enroll Now
                  <span className="text-xl leading-none">◇</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="bg-slate-50/70 px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
              Pricing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Choose how you want to start.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
              Flexible starting points for websites, digital platforms and
              complete business systems.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={[
                  "relative rounded-[1.5rem] border p-6 transition hover:-translate-y-1",

                  plan.featured
                    ? "border-cyan-300 bg-gradient-to-b from-cyan-50 to-white shadow-[0_24px_60px_rgba(6,182,212,0.15)]"
                    : "border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]",
                ].join(" ")}
              >
                {plan.featured && (
                  <div className="mb-4 w-fit rounded-full bg-cyan-500 px-3 py-1 text-xs font-black text-white">
                    Recommended
                  </div>
                )}

                <h3 className="text-xl font-black text-slate-900">
                  {plan.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {plan.desc}
                </p>

                <p className="mt-6 text-3xl font-black text-cyan-600">
                  {plan.price}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-black text-cyan-700">
                        ✓
                      </span>

                      {feature}
                    </p>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className={[
                    "mt-7 flex h-12 items-center justify-center rounded-xl text-sm font-black transition",

                    plan.featured
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : "border border-slate-200 bg-white text-slate-800 hover:border-cyan-300 hover:bg-cyan-50",
                  ].join(" ")}
                >
                  Start Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Questions before we start?
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:border-cyan-300 hover:shadow-md"
              >
                <p className="text-sm font-black text-slate-800">{faq}</p>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-lg font-black text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                  +
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[2rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 p-8 text-center shadow-[0_30px_80px_rgba(6,182,212,0.15)] sm:p-12">
          <div className="absolute left-[-80px] top-[-80px] h-64 w-64 rounded-full bg-cyan-300/50 blur-[100px]" />

          <div className="absolute bottom-[-100px] right-[-80px] h-72 w-72 rounded-full bg-blue-300/40 blur-[110px]" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">
              Start Building
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Ready to Transform Your Digital Presence?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              Let Prime Digital Agency build your website, app, AI system,
              student portal, CRM, or complete digital ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-cyan-600"
              >
                Book Free Consultation
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50"
              >
                Back to School Site
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ALL DIGITAL SOLUTIONS - CUSTOM LIGHT FOOTER */}
      <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
        {/* soft background glow */}
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-100/70 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-100/60 blur-[120px]" />

        <div className="relative mx-auto max-w-[1180px] px-5 pb-8 pt-16 sm:px-8 lg:px-0">
          {/* MAIN FOOTER GRID */}
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr]">
            {/* BRAND */}
            <div className="max-w-[330px]">
              <Link href="/" className="inline-flex items-center">
                <img
                  src="/logoPDA.png"
                  alt="Prime Digital Agency"
                  className="h-20 w-auto object-contain"
                />
              </Link>

              <p className="mt-6 max-w-[290px] text-sm leading-7 text-slate-500">
                Defining the next era of enterprise efficiency through modular
                intelligence and unified digital ecosystems.
              </p>

              {/* SOCIAL */}
              <div className="mt-7 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-600 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                >
                  IG
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-600 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                >
                  FB
                </a>

                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-600 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                >
                  IN
                </a>
              </div>
            </div>

            {/* SOLUTIONS */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-950">
                Solutions
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="#solutions"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Website Systems
                </Link>

                <Link
                  href="#systems"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  CRM Ecosystem
                </Link>

                <Link
                  href="#systems"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  AI Automation
                </Link>

                <Link
                  href="#projects"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Digital Platforms
                </Link>

                <Link
                  href="#solutions"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Analytics Systems
                </Link>
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-950">
                Company
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/about"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  About Our Mission
                </Link>

                <Link
                  href="/services"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Strategic Partners
                </Link>

                <Link
                  href="/careers"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Careers
                </Link>

                <Link
                  href="/contact"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Contact
                </Link>

                <Link
                  href="/"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  School Site
                </Link>
              </div>
            </div>

            {/* SUPPORT */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-950">
                Legal & Support
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Support Center
                </Link>

                <Link
                  href="/contact"
                  className="text-xs font-semibold text-slate-500 transition hover:translate-x-1 hover:text-cyan-600"
                >
                  Project Support
                </Link>

                <a
                  href="mailto:info@primedigitalschool.com"
                  className="text-xs font-semibold text-slate-500 transition hover:text-cyan-600"
                >
                  info@primedigitalschool.com
                </a>
              </div>

              <Link
                href="/contact"
                className="mt-7 inline-flex h-10 items-center rounded-full bg-cyan-500 px-5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(6,182,212,0.18)] transition hover:-translate-y-1 hover:bg-cyan-600"
              >
                Start A Project
              </Link>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mt-14 h-px bg-slate-200" />

          {/* BOTTOM BAR */}
          <div className="flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
            <p className="text-[9px] font-semibold text-slate-400">
              © 2026 Prime Digital Agency. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Secure Systems
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Privacy Focused
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Digital Excellence
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
