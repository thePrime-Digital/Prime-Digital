import Link from "next/link";

const contactCards = [
  {
    icon: "☎",
    title: "Call Us",
    value: "+91 88504 47887",
  },
  {
    icon: "✉",
    title: "Email Us",
    value: "team@primedigital.school",
  },
  {
    icon: "⌖",
    title: "Visit Us",
    value: "Prime Digital School, Vashi, Sector 17",
  },
  {
    icon: "◉",
    title: "WhatsApp",
    value: "+91 88504 47887",
  },
];

const teams = [
  {
    title: "Admissions",
    desc: "For application status and enrollment queries.",
    button: "Get Help",
  },
  {
    title: "Technical Support",
    desc: "For platform access and digital tool issues.",
    button: "Get Help",
  },
  {
    title: "Careers",
    desc: "For job openings and faculty applications.",
    button: "Contact Us",
  },
  {
    title: "Partnership",
    desc: "For corporate tie-ups and institutional links.",
    button: "Partner Up",
  },
];

const socialLinks = ["in", "f", "◎", "✕", "▶"];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f4f1f1] pt-[175px] text-[#101828]">
      {/* HERO */}
      <section className="px-5 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px] text-center">
          <h1 className="text-3xl font-black tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Get in <span className="text-[#8f0024]">Touch</span> With Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
            Have questions about admissions, programs, or anything else?
            We&apos;d love to hear from you. Our team is here to help you
            navigate your digital education journey.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="px-5 pb-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((item) => (
            <div
              key={item.title}
              className="group cursor-pointer rounded-xl border border-[#eadada] bg-white px-5 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:border-[#8f0024]/35 hover:shadow-[0_24px_45px_rgba(143,0,36,0.16)]"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f4] text-xl font-black text-[#8f0024] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#8f0024] group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mt-4 text-base font-black text-[#101828]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#667085]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1220px] gap-10 lg:grid-cols-[1fr_0.95fr]">
          {/* FORM */}
          <div>
            <h2 className="text-xl font-black text-[#101828]">
              Send Us a Message
            </h2>

            <form className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 99999 00000"
                    className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    I am a...
                  </label>
                  <select
                    defaultValue="Prospective Student"
                    className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  >
                    <option>Prospective Student</option>
                    <option>Student</option>
                    <option>Parent</option>
                    <option>Educator</option>
                    <option>Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#101828]">
                  Subject / Program
                </label>
                <select
                  defaultValue="Admissions Inquiry"
                  className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                >
                  <option>Admissions Inquiry</option>
                  <option>Program Inquiry</option>
                  <option>Technical Support</option>
                  <option>Career Inquiry</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#101828]">
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  className="h-36 w-full resize-none rounded-lg border border-[#d8c4c6] bg-white p-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                />
              </div>

              <button
                type="submit"
                className="mt-1 h-12 rounded-lg bg-[#8f0024] text-sm font-bold text-white shadow-[0_12px_25px_rgba(143,0,36,0.22)] transition hover:bg-[#70001c]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* REAL MAP + INFO */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-[#eadada] bg-white shadow-sm">
              <iframe
                title="Prime Digital School Vashi Sector 17 location map"
                src="https://www.google.com/maps?q=Vashi%20Sector%2017%2C%20Navi%20Mumbai%2C%20Maharashtra&output=embed"
                className="h-[310px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="rounded-xl border border-[#eadada] bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-[#101828]">
                Contact Information
              </h3>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <span className="mt-1 text-[#8f0024]">⌖</span>
                  <div>
                    <p className="text-sm font-black text-[#101828]">
                      Main Headquarters
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#667085]">
                      Prime Digital School
                      <br />
                      Sector 17, Vashi
                      <br />
                      Navi Mumbai, Maharashtra
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 text-[#8f0024]">◷</span>
                  <div>
                    <p className="text-sm font-black text-[#101828]">
                      Office Hours
                    </p>

                    <div className="mt-2 grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 text-sm text-[#667085]">
                      <span>Mon - Fri</span>
                      <span>09:00 AM - 06:00 PM</span>
                      <span>Saturday</span>
                      <span>10:00 AM - 02:00 PM</span>
                      <span>Sunday</span>
                      <span className="font-bold text-[#8f0024]">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT TEAM */}
      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <h2 className="text-center text-xl font-black text-[#101828]">
            Reach The Right Team
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((team) => (
              <div
                key={team.title}
                className="rounded-xl border border-[#eadada] bg-white p-5 shadow-sm"
              >
                <h3 className="text-sm font-black text-[#101828]">
                  {team.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-xs leading-6 text-[#667085]">
                  {team.desc}
                </p>

                <button className="mt-4 rounded-md border border-[#8f0024] px-4 py-2 text-xs font-bold text-[#8f0024] transition hover:bg-[#8f0024] hover:text-white">
                  {team.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section className="bg-[#ece7e7] px-5 py-12 text-center sm:px-8 lg:px-10">
        <h2 className="text-lg font-black text-[#101828]">Stay Connected</h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
          Join our community of 25K+ educators and learners.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          {socialLinks.map((item) => (
            <Link
              key={item}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8f0024] text-xs font-black text-white transition hover:bg-[#70001c]"
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ STRIP */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1220px] flex-col items-start justify-between gap-5 rounded-xl border border-[#eadada] bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-black text-[#101828]">
              Have a Quick Question?
            </h2>

            <p className="mt-2 text-sm text-[#667085]">
              Browse our frequently asked questions for immediate answers.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/support"
              className="rounded-md border border-[#8f0024] px-5 py-2.5 text-xs font-bold text-[#8f0024] transition hover:bg-[#fff4f7]"
            >
              View FAQs
            </Link>

            <Link
              href="/support"
              className="rounded-md bg-[#8f0024] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#70001c]"
            >
              Visit Support Center
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#8f0024] px-5 py-16 text-center text-white sm:px-8 lg:px-10">
        <h2 className="text-3xl font-black tracking-tight">
          Let&apos;s Start the Conversation
        </h2>

        <div className="mt-7 flex justify-center gap-4">
          <Link
            href="#"
            className="rounded-md bg-white px-6 py-3 text-sm font-bold text-[#8f0024] transition hover:bg-[#fff4f7]"
          >
            Send a Message
          </Link>

          <Link
            href="tel:+919999900000"
            className="rounded-md border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Call Us Now
          </Link>
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
