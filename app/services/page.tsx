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
  },
  {
    title: "Admissions Growth Engine",
    desc: "Lead capture, enquiry tracking, follow-up automation, forms, and conversion-focused landing pages.",
  },
  {
    title: "AI Support Desk",
    desc: "Instant FAQ handling, student support, parent queries, and automated service workflows.",
  },
];

const pricing = [
  {
    name: "Launch",
    price: "₹14,999",
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
    price: "₹29,999",
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
  "Can Prime Digital Solutions build AI automation?",
  "Can this later become a mobile app?",
  "How long does a basic website take?",
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* PRIME DIGITAL SOLUTIONS NAV */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-400/10 bg-[#05070a]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8 lg:px-0">
          <Link href="/services" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_26px_rgba(34,211,238,0.22)]">
              <span className="text-lg font-black text-cyan-300">P</span>
              <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-cyan-300/40 blur-md" />
            </div>

            <div className="leading-none">
              <p className="text-sm font-black tracking-tight text-white">
                PRIME DIGITAL
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Solutions
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-black uppercase tracking-[0.18em] text-white/50 transition hover:text-cyan-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:border-cyan-300/40 hover:text-cyan-300 sm:inline-flex"
            >
              School Site
            </Link>

            <Link
              href="/contact"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#020609] shadow-[0_0_30px_rgba(34,211,238,0.28)] transition hover:bg-cyan-300"
            >
              Start Project
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-5 pb-20 pt-36 sm:px-8 lg:px-10">
        <div className="absolute left-1/2 top-0 h-[620px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-[#8f1730]/40 blur-[110px]" />

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Prime Digital Solutions
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
              One Intelligent Platform.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Unlimited Digital Possibilities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              We build websites, portals, dashboards, CRM systems, AI
              automations, and complete digital ecosystems for schools,
              institutes, startups, and growing businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#solutions"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-[#031014] shadow-[0_14px_35px_rgba(34,211,238,0.25)] transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Explore Solutions
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                Book Consultation
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#081217] p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-bold text-white/45">
                      Solution Console
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      Live Build System
                    </p>
                  </div>

                  <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-black text-cyan-300">
                    ACTIVE
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {["Website Build", "AI Workflow", "Dashboard Engine"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-black">{item}</p>
                          <p className="text-xs text-cyan-300">
                            {index === 0 ? "92%" : index === 1 ? "74%" : "88%"}
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={[
                              "h-full rounded-full bg-cyan-400",
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
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"
                    >
                      <p className="text-lg font-black text-cyan-300">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10px] text-white/45">
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
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center backdrop-blur-xl"
            >
              <p className="text-3xl font-black text-cyan-300">{item.value}</p>
              <p className="mt-2 text-xs font-bold text-white/50">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Solution Suite
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Digital architecture for high-performance growth.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] hover:shadow-[0_24px_70px_rgba(34,211,238,0.08)]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-black text-cyan-300 transition group-hover:bg-cyan-400 group-hover:text-[#031014]">
                  {item.number}
                </div>

                <h3 className="text-xl font-black text-white">{item.title}</h3>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  {item.desc}
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex text-sm font-black text-cyan-300"
                >
                  Discuss Project →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEMS */}
      <section
        id="systems"
        className="bg-white/[0.025] px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Intelligent Systems
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                We do not just make pages. We build connected systems.
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">
                Prime Digital Solutions connects frontend design, backend logic,
                databases, automation, dashboards, and reporting into one clean
                digital workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {systems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-[#071014] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                >
                  <p className="text-sm font-black text-white">{item}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[76%] rounded-full bg-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Work Examples
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Systems we can build for you.
              </h2>
            </div>

            <Link
              href="/contact"
              className="w-fit rounded-xl border border-cyan-300/25 px-5 py-3 text-sm font-black text-cyan-300 transition hover:bg-cyan-300/10"
            >
              Start Your Project
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((item, index) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0b0f14] shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/35 hover:shadow-[0_28px_90px_rgba(34,211,238,0.12)]"
              >
                <div className="relative h-[230px] overflow-hidden border-b border-white/10 bg-[#081016]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(143,23,48,0.25),transparent_36%)]" />

                  <div className="absolute left-5 right-5 top-5 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="h-2.5 w-24 rounded-full bg-cyan-300/70" />
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-300">
                        Live
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="h-2.5 w-full rounded-full bg-white/12" />
                      <div className="h-2.5 w-[76%] rounded-full bg-white/12" />
                      <div className="h-2.5 w-[52%] rounded-full bg-white/12" />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="h-14 rounded-xl border border-cyan-300/15 bg-cyan-300/15" />
                      <div className="h-14 rounded-xl border border-white/10 bg-white/10" />
                      <div className="h-14 rounded-xl border border-[#8f1730]/35 bg-[#8f1730]/45" />
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur">
                      <p className="text-[10px] font-bold text-white/40">
                        Users
                      </p>
                      <p className="mt-1 text-sm font-black text-cyan-300">
                        {index === 0 ? "10K+" : index === 1 ? "4.8K" : "24/7"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur">
                      <p className="text-[10px] font-bold text-white/40">
                        Speed
                      </p>
                      <p className="mt-1 text-sm font-black text-white">
                        {index === 0
                          ? "Fast"
                          : index === 1
                            ? "Auto"
                            : "Instant"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur">
                      <p className="text-[10px] font-bold text-white/40">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-black text-[#ffcc4d]">
                        Ready
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    PROJECT 0{index + 1}
                  </p>

                  <h3 className="mt-4 text-2xl font-black leading-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/55">
                    {item.desc}
                  </p>

                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-300 transition group-hover:gap-4"
                  >
                    Build Similar System <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAL CONNECTION BLOCK */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[34px] bg-[#101114] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
          <div className="grid min-h-[330px] md:grid-cols-2">
            <div className="relative flex flex-col justify-center overflow-hidden bg-[#111316] px-8 py-12 md:px-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_34%)]" />

              <div className="relative z-10">
                <h2 className="max-w-[360px] text-4xl font-light leading-[1.12] tracking-[-1px] text-white md:text-5xl">
                  The Platform
                  <br />
                  Solutions
                </h2>

                <p className="mt-7 max-w-[360px] text-sm leading-7 text-white/45">
                  Access complete enterprise architecture designed for
                  high-performance operations.
                </p>

                <Link
                  href="/services"
                  className="mt-9 inline-flex h-14 items-center justify-center gap-8 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 text-sm font-black text-[#061014] transition hover:-translate-y-1"
                >
                  Enter Portal
                  <span className="text-2xl">→</span>
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden bg-[#8f1730] px-8 py-12 md:px-16">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />

              <div className="relative z-10">
                <h2 className="max-w-[360px] text-4xl font-light leading-[1.12] tracking-[-1px] text-white md:text-5xl">
                  The Executive
                  <br />
                  School
                </h2>

                <p className="mt-7 max-w-[360px] text-sm leading-7 text-white/55">
                  Upskill your leadership team with certified masterclasses on
                  platform optimization.
                </p>

                <Link
                  href="/programs"
                  className="mt-9 inline-flex h-14 items-center justify-center gap-8 rounded-xl bg-[#d7b43f] px-8 text-sm font-black text-[#351509] transition hover:-translate-y-1 hover:bg-[#e6c64f]"
                >
                  Enroll Now
                  <span>◇</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="bg-white/[0.025] px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Pricing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Choose how you want to start.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={[
                  "rounded-[1.5rem] border p-6",
                  plan.featured
                    ? "border-cyan-300/45 bg-cyan-300/[0.07] shadow-[0_24px_70px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-white/[0.035]",
                ].join(" ")}
              >
                {plan.featured && (
                  <div className="mb-4 w-fit rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-[#031014]">
                    Recommended
                  </div>
                )}

                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {plan.desc}
                </p>

                <p className="mt-6 text-3xl font-black text-cyan-300">
                  {plan.price}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-center gap-3 text-sm text-white/65"
                    >
                      <span className="text-cyan-300">✓</span>
                      {feature}
                    </p>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className={[
                    "mt-7 flex h-12 items-center justify-center rounded-xl text-sm font-black",
                    plan.featured
                      ? "bg-cyan-400 text-[#031014] hover:bg-cyan-300"
                      : "border border-white/15 text-white hover:bg-white/10",
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
      <section id="faq" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Questions before we start?
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4"
              >
                <p className="text-sm font-black text-white">{faq}</p>
                <span className="text-cyan-300">+</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-cyan-400 to-blue-500 p-8 text-center text-[#031014] shadow-[0_30px_90px_rgba(34,211,238,0.20)] sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Ready to Transform Your Digital Presence?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#031014]/70 sm:text-base">
            Let Prime Digital Solutions build your website, app, AI system,
            student portal, CRM, or complete digital ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-[#031014] px-6 py-3 text-sm font-black text-white transition hover:bg-black"
            >
              Book Free Consultation
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-[#031014]/20 px-6 py-3 text-sm font-black text-[#031014] transition hover:bg-white/30"
            >
              Back to School Site
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black">Prime Digital Solutions</p>
            <p className="mt-2 text-xs text-white/45">
              Websites • Apps • AI • Dashboards • CRM • Digital Growth
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-bold text-white/45">
            <Link href="/">School Site</Link>
            <Link href="/about">About</Link>
            <Link href="/programs">Programs</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
