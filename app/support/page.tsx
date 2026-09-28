"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Headphones,
  LifeBuoy,
  Mail,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  Send,
  Users,
} from "lucide-react";

const faqData = [
  {
    category: "Admissions",
    question: "How do I apply to Prime Digital School?",
    answer:
      "Explore the available programs, review the eligibility requirements, and use the Apply Now option to begin your application.",
  },
  {
    category: "Admissions",
    question: "Where can I find admission dates and eligibility details?",
    answer:
      "Current admission information, eligibility, required documents, fees, and important dates are available in the Admissions section of the Programs page.",
  },
  {
    category: "Fees",
    question: "Where can I find program fee information?",
    answer:
      "Fee information varies by program and learning pathway. Please review the Programs page or contact the admissions team for the latest details.",
  },
  {
    category: "Technical",
    question: "What should I do if I cannot access my account?",
    answer:
      "First confirm your login details and internet connection. If the issue continues, submit a Technical Support request below with details of the problem.",
  },
  {
    category: "Technical",
    question: "Which browser should I use?",
    answer:
      "For the best experience, use a current version of a modern browser such as Chrome, Edge, Firefox, or Safari.",
  },
  {
    category: "Student Support",
    question: "How can an enrolled student request help?",
    answer:
      "Students can use the support form below and select Student Support so the request reaches the appropriate team.",
  },
];

const faqTabs = [
  "All",
  "Admissions",
  "Fees",
  "Technical",
  "Student Support",
];

const helpCategories = [
  {
    icon: BookOpen,
    title: "Admissions Help",
    description:
      "Get help with programs, eligibility, applications, fees, documents, and admission-related questions.",
  },
  {
    icon: Users,
    title: "Student Support",
    description:
      "For enrolled students who need help with learning, course access, general queries, or academic support.",
  },
  {
    icon: Monitor,
    title: "Technical Support",
    description:
      "Get assistance with login issues, portal access, browser problems, account access, or other technical concerns.",
  },
];

export default function SupportPage() {
  const [activeFaqTab, setActiveFaqTab] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      activeFaqTab === "All" || faq.category === activeFaqTab;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const category = String(formData.get("category") || "");
    const subject = String(formData.get("subject") || "");

    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: category
            ? `${category}: ${subject}`
            : subject,
          message: formData.get("message"),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your support request.",
        );
      }

      setFormSuccess(
        data.message ||
          "Your support request has been submitted successfully.",
      );

      form.reset();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to submit your support request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pt-[125px] text-[#101828]">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#f8f4f5] px-5 pb-16 pt-14 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#8f0024]/5 blur-[100px]" />

        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#d8b04c]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[900px] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8f0024]/10 text-[#8f0024]">
            <LifeBuoy size={27} />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8f0024]">
            Prime Digital School Support
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-1px] text-[#101828] sm:text-5xl">
            How Can We Help?
          </h1>

          <p className="mx-auto mt-5 max-w-[650px] text-sm leading-7 text-[#667085] sm:text-base">
            Find answers, contact our team, or submit a support request for
            admissions, student assistance, or technical help.
          </p>

          {/* FAQ SEARCH */}

          <div className="relative mx-auto mt-8 max-w-[650px]">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8f0024]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search support questions..."
              className="h-14 w-full rounded-full border border-[#dec8cc] bg-white pl-12 pr-5 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* QUICK CONTACT */}
      {/* ===================================================== */}

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Quick Contact
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Reach us directly.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">

            {/* PHONE */}

            <a
              href="tel:+918693093542"
              className="group rounded-[20px] border border-[#eadada] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8f0024]/25 hover:shadow-[0_18px_40px_rgba(143,0,36,0.10)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024] transition group-hover:bg-[#8f0024] group-hover:text-white">
                <Phone size={22} />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.13em] text-[#8f0024]">
                Phone
              </p>

              <h3 className="mt-1 text-lg font-black text-[#101828]">
                +91 8693093542
              </h3>

              <p className="mt-2 text-sm text-[#667085]">
                Call our support team directly.
              </p>
            </a>

            {/* WHATSAPP */}

            <a
              href="https://wa.me/918693093542"
              target="_blank"
              rel="noreferrer"
              className="group rounded-[20px] border border-[#eadada] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8f0024]/25 hover:shadow-[0_18px_40px_rgba(143,0,36,0.10)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024] transition group-hover:bg-[#8f0024] group-hover:text-white">
                <MessageCircle size={22} />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.13em] text-[#8f0024]">
                WhatsApp
              </p>

              <h3 className="mt-1 text-lg font-black text-[#101828]">
                Chat With Us
              </h3>

              <p className="mt-2 text-sm text-[#667085]">
                Send us a WhatsApp message for quick assistance.
              </p>
            </a>

            {/* EMAIL */}

            <a
              href="mailto:team@primedigital.school"
              className="group rounded-[20px] border border-[#eadada] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8f0024]/25 hover:shadow-[0_18px_40px_rgba(143,0,36,0.10)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024] transition group-hover:bg-[#8f0024] group-hover:text-white">
                <Mail size={22} />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.13em] text-[#8f0024]">
                Email
              </p>

              <h3 className="mt-1 break-all text-lg font-black text-[#101828]">
                team@primedigital.school
              </h3>

              <p className="mt-2 text-sm text-[#667085]">
                Email us for detailed questions or assistance.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW CAN WE HELP */}
      {/* ===================================================== */}

      <section className="bg-[#f8f4f5] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Support Categories
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Choose the right kind of help.
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[#667085]">
              Select the category that best matches your question so our team
              can assist you efficiently.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {helpCategories.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-[#eadada] bg-white p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8f0024]/10 text-[#8f0024]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#101828]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667085]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTACT / SUPPORT FORM */}
      {/* ===================================================== */}

      <section
        id="contact-support"
        className="scroll-mt-28 bg-white px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-[1220px] gap-10 lg:grid-cols-[1.15fr_0.85fr]">

          {/* FORM */}

          <div className="rounded-[24px] border border-[#eadada] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Contact & Support
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Send us a message.
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#667085]">
              Tell us what you need help with and our team will review your
              request.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Full Name *
                  </label>

                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="h-12 w-full rounded-xl border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Email Address *
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="h-12 w-full rounded-xl border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91"
                    className="h-12 w-full rounded-xl border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#101828]">
                    Support Category *
                  </label>

                  <select
                    name="category"
                    required
                    defaultValue=""
                    className="h-12 w-full rounded-xl border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    <option value="Admissions Help">
                      Admissions Help
                    </option>

                    <option value="Student Support">
                      Student Support
                    </option>

                    <option value="Technical Support">
                      Technical Support
                    </option>

                    <option value="Fees & Payments">
                      Fees & Payments
                    </option>

                    <option value="General Inquiry">
                      General Inquiry
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#101828]">
                  Subject *
                </label>

                <input
                  name="subject"
                  type="text"
                  required
                  placeholder="Briefly describe your query"
                  className="h-12 w-full rounded-xl border border-[#d8c4c6] bg-white px-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#101828]">
                  Message *
                </label>

                <textarea
                  name="message"
                  required
                  placeholder="Tell us how we can help..."
                  className="h-36 w-full resize-none rounded-xl border border-[#d8c4c6] bg-white p-4 text-sm outline-none transition focus:border-[#8f0024] focus:ring-4 focus:ring-[#8f0024]/10"
                />
              </div>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {formSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8f0024] px-7 text-sm font-black text-white shadow-[0_12px_26px_rgba(143,0,36,0.20)] transition hover:bg-[#70001c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Request
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT INFO */}

          <div className="flex flex-col gap-5">

            <div className="rounded-[24px] bg-gradient-to-br from-[#70001c] to-[#9f1735] p-7 text-white shadow-[0_18px_45px_rgba(143,0,36,0.18)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Headphones size={23} />
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Need admissions help?
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/75">
                Explore program eligibility, fees, documents, important dates,
                and the admission process from the Programs page.
              </p>

              <Link
                href="/programs"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#8f0024]"
              >
                View Programs & Admissions
              </Link>
            </div>

            <div className="rounded-[24px] border border-[#eadada] bg-[#fffafb] p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                Contact Details
              </p>

              <div className="mt-5 space-y-5">
                <div className="flex items-center gap-3">
                  <Phone
                    size={18}
                    className="text-[#8f0024]"
                  />

                  <div>
                    <p className="text-xs font-bold text-[#667085]">
                      Phone
                    </p>

                    <a
                      href="tel:+918693093542"
                      className="text-sm font-black text-[#101828]"
                    >
                      +91 8693093542
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle
                    size={18}
                    className="text-[#8f0024]"
                  />

                  <div>
                    <p className="text-xs font-bold text-[#667085]">
                      WhatsApp
                    </p>

                    <a
                      href="https://wa.me/918693093542"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-black text-[#101828]"
                    >
                      Message Us
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail
                    size={18}
                    className="text-[#8f0024]"
                  />

                  <div>
                    <p className="text-xs font-bold text-[#667085]">
                      Email
                    </p>

                    <a
                      href="mailto:team@primedigital.school"
                      className="break-all text-sm font-black text-[#101828]"
                    >
                      team@primedigital.school
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAQ */}
      {/* ===================================================== */}

      <section className="bg-[#f8f4f5] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828]">
              Quick answers when you need them.
            </h2>
          </div>

          {/* FILTERS */}

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {faqTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFaqTab(tab)}
                className={[
                  "rounded-full border px-4 py-2 text-xs font-bold transition",
                  activeFaqTab === tab
                    ? "border-[#8f0024] bg-[#8f0024] text-white"
                    : "border-[#dec8cc] bg-white text-[#667085] hover:border-[#8f0024]/30 hover:text-[#8f0024]",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FAQ ITEMS */}

          <div className="mt-8 space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const open = openFaqIndex === index;

                return (
                  <div
                    key={`${faq.category}-${faq.question}`}
                    className="overflow-hidden rounded-2xl border border-[#eadada] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(open ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.13em] text-[#8f0024]">
                          {faq.category}
                        </span>

                        <p className="mt-1 text-sm font-black text-[#101828] sm:text-base">
                          {faq.question}
                        </p>
                      </div>

                      <ChevronDown
                        size={18}
                        className={[
                          "shrink-0 text-[#8f0024] transition-transform duration-300",
                          open ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {open && (
                      <div className="border-t border-[#f0e5e7] px-5 py-5">
                        <p className="text-sm leading-7 text-[#667085]">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[#eadada] bg-white p-8 text-center">
                <p className="text-sm font-bold text-[#667085]">
                  No matching support questions found.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL SUPPORT CTA */}
      {/* ===================================================== */}

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px] overflow-hidden rounded-[26px] bg-[#8f0024] px-6 py-12 text-center text-white shadow-[0_22px_55px_rgba(143,0,36,0.18)] sm:px-10">
          <CheckCircle2
            size={28}
            className="mx-auto text-[#e2bc48]"
          />

          <h2 className="mt-4 text-3xl font-black">
            Still need help?
          </h2>

          <p className="mx-auto mt-3 max-w-[580px] text-sm leading-7 text-white/75">
            Send us a support request or contact our team directly and we will
            help point you in the right direction.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#contact-support"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-black text-[#8f0024]"
            >
              Submit a Request
            </a>

            <a
              href="https://wa.me/918693093542"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-black text-white transition hover:bg-white/10"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}