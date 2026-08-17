import Image from "next/image";
import Link from "next/link";

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

const positions = [
  {
    role: "Academic Mentor",
    type: "Full Time",
    location: "Vashi / Hybrid",
    desc: "Teach, guide, and mentor students with strong academic support.",
  },
  {
    role: "Digital Learning Executive",
    type: "Full Time",
    location: "Vashi",
    desc: "Manage digital classes, resources, dashboards, and student support systems.",
  },
  {
    role: "AI & Coding Trainer",
    type: "Part Time",
    location: "Hybrid",
    desc: "Train students in coding, AI tools, robotics basics, and future skills.",
  },
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

export default function CareersPage() {
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

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {positions.map((job) => (
              <div
                key={job.role}
                className="rounded-xl border border-[#eadada] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(143,0,36,0.12)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-[#fff1f4] px-3 py-1 text-xs font-black text-[#8f0024]">
                    {job.type}
                  </span>
                  <span className="text-xs font-bold text-[#667085]">
                    {job.location}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#101828]">
                  {job.role}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#667085]">
                  {job.desc}
                </p>

                <Link
                  href="#apply"
                  className="mt-5 inline-flex rounded-lg bg-[#8f0024] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#70001c]"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
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

      {/* CULTURE - ONLY 4 PICTURES USED */}
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

      {/* APPLY FORM */}
      <section id="apply" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1220px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-[#8f0024] p-8 text-white sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Apply Today
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Ready to join our team?
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/80">
              Send us your details and our hiring team will contact you if your
              profile matches our current openings.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <p>📍 Vashi, Navi Mumbai</p>
              <p>✉ careers@primedigital.school</p>
              <p>☎ +91 88504 47887</p>
            </div>
          </div>

          <form className="grid gap-4 p-8 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="tel"
                placeholder="Phone Number"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
              />

              <select
                defaultValue=""
                className="h-12 rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option>Academic Mentor</option>
                <option>Digital Learning Executive</option>
                <option>AI & Coding Trainer</option>
                <option>Other</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Portfolio / LinkedIn / Resume Link"
              className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
            />

            <textarea
              placeholder="Tell us why you want to join Prime Digital School..."
              className="h-32 resize-none rounded-lg border border-[#d8c4c6] p-4 text-sm outline-none focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
            />

            <button
              type="submit"
              className="h-12 rounded-lg bg-[#8f0024] text-sm font-bold text-white transition hover:bg-[#70001c]"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>

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