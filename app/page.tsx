import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Code2,
  Globe2,
  GraduationCap,
  Palette,
  Play,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  UserRoundCheck,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

type Program = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

type WhyChoose = {
  icon: LucideIcon;
  title: string;
};

const programs: Program[] = [
  {
    icon: Code2,
    title: "Technology & Coding",
    description: "Build robust coding skills for a digital tomorrow.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business & Digital Marketing",
    description: "Learn strategies to lead in the digital business world.",
  },
  {
    icon: Palette,
    title: "Design & Creative Arts",
    description: "Unleash creativity with modern design and tools.",
  },
  {
    icon: Bot,
    title: "AI, Robotics & Future Tech",
    description: "Explore AI, robotics and emerging technologies.",
  },
  {
    icon: Rocket,
    title: "Entrepreneurship & Innovation",
    description: "Turn ideas into impact through innovation and leadership.",
  },
];

const stats: Stat[] = [
  {
    icon: Users,
    value: "25K+",
    label: "Students",
  },
  {
    icon: BookOpen,
    value: "200+",
    label: "Expert Courses",
  },
  {
    icon: Trophy,
    value: "500+",
    label: "Projects Completed",
  },
  {
    icon: Target,
    value: "95%",
    label: "Placement Rate",
  },
];

const whyChoose: WhyChoose[] = [
  {
    icon: UserRoundCheck,
    title: "Industry Expert Mentors",
  },
  {
    icon: Sparkles,
    title: "Hands-on Projects",
  },
  {
    icon: Trophy,
    title: "Future-Ready Curriculum",
  },
  {
    icon: Users,
    title: "Personalised Learning",
  },
  {
    icon: Globe2,
    title: "Global Opportunities",
  },
];

type Testimonial = {
  name: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  { name: "Aranya Patil", text: "Prime Digital School helped me build real-world skills and confidence in technology.", rating: 5 },
  { name: "Sneha Kapoor", text: "The hands-on projects and expert mentors completely transformed my learning experience.", rating: 5 },
  { name: "Rohan Mehta", text: "Best decision for my career — the curriculum is perfectly aligned with industry needs.", rating: 5 },
  { name: "Priya Sharma", text: "I loved the collaborative environment and real-world projects. Highly recommend!", rating: 5 },
  { name: "Aryan Verma", text: "The faculty and support team are incredible. I feel future-ready!", rating: 5 },
];

export default function Home() {
  return (
    <main className="min-h-[40dvh] overflow-x-hidden w-full">
      <section className="w-full md:h-[40dvh] lg:h-[100dvh] mt-1 lg:mt-0 mx-auto relative flex items-center overflow-hidden ml-2 md:ml-4 md:pl-4  max-[600px]:flex-col max-[600px]:items-stretch max-[600px]:overflow-visible max-[600px]:pt-2">
        
        
        <div className="w-[36%] max-[900px]:w-[45%] max-[600px]:w-full relative z-[5] pb-[92px] max-[900px]:pb-[60px] max-[600px]:pb-5">
           <Link
          href="/"
          className="w-[600px] h-[150px] max-[900px]:w-[200px] max-[900px]:h-[100px] flex items-center justify-start shrink-0 overflow-visible no-underline"
          aria-label="Prime Digital School Home"
        >
          <Image
            src="/pds-assets/pds-logo.jpeg"
            alt="Prime Digital School"
            width={320}
            height={100}
            priority
            className="w-full h-full object-contain object-left block border "
          />
        </Link>
          <div className="w-fit inline-flex items-center gap-2.5 px-[18px] py-[9px] border border-[rgba(122,0,25,0.32)] rounded-full bg-white text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.04em]">
            
            <GraduationCap size={17} />
            Future-Ready Education
          </div>

          <h1 className="max-w-[520px] mt-[18px] mb-4 [font-family:var(--font-playfair),Georgia,serif] text-[clamp(32px,3.5vw,48px)] max-[720px]:text-[28px] leading-none tracking-[-1.7px] max-[720px]:tracking-[-1px] text-[#111111] font-bold">
            Building Future Leaders with <span className="text-[var(--primary)]">Digital Skills</span>
          </h1>

          <p className="max-w-[300px] lg:max-w-[430px] m-0 text-[15px] max-[720px]:text-[13px] leading-[1.5] text-[#3f3f46]">
            Practical. Innovative. Industry-ready. Education for 6th to 12th
            Standard.
          </p>

          <div className="flex items-center gap-[18px] mt-7 max-[720px]:flex-col max-[720px]:items-stretch flex-wrap">
            <Link href="/programs" className="min-h-[44px] inline-flex items-center justify-center gap-[11px] px-5 rounded-[13px] text-[14px]  transition-all duration-300 ease-in-out bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] hover:-translate-y-[3px] max-[720px]:w-full w-full lg:w-1/2 font-extrabold text-white">
              Explore Programs <ArrowRight size={16} />
            </Link>

            <Link href="/about" className="min-h-[44px] inline-flex items-center justify-center gap-[11px] px-5 rounded-[13px] text-[14px] font-black no-underline transition-all duration-300 ease-in-out bg-white text-[var(--primary)] border border-[rgba(122,0,25,0.42)] hover:-translate-y-[3px] max-[720px]:w-full">
              Take a Tour <Play size={18} />
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[82%] max-[900px]:w-[65%] h-full max-[900px]:h-full max-[600px]:relative max-[600px]:w-full max-[600px]:h-[400px] z-1 overflow-hidden before:content-[''] before:absolute before:inset-0 before:z-[2] before:pointer-events-none before:bg-[linear-gradient(90deg,#fff_0%,#fff_9%,rgba(255,255,255,0.92)_18%,rgba(255,255,255,0.5)_31%,rgba(255,255,255,0)_45%)] max-[900px]:before:bg-[linear-gradient(90deg,#fff_0%,#fff_9%,rgba(255,255,255,0.92)_18%,rgba(255,255,255,0.4)_31%,rgba(255,255,255,0)_45%)] max-[600px]:before:hidden">
          <Image
            src="/pds-assets/hero-students.png"
            alt="Prime Digital School students"
            fill
            priority
            sizes="40vw"
            className="object-cover object-[80%_center]"
          />
        </div>
      </section>

      <section className="w-49/50 max-[1180px]:w-[min(100%-48px,1320px)] max-[720px]:w-[min(100%-28px,1320px)] relative z-12 grid grid-cols-[repeat(4,1fr)_1.45fr] max-[1180px]:grid-cols-[repeat(2,1fr)] max-[720px]:grid-cols-2 items-center gap-0 mx-auto md:mt-[-100px] lg:mt-[-50px] max-[1180px]:mt-6 p-[26px] px-[42px] max-[1180px]:p-[26px_28px] max-[720px]:p-6 max-[720px]:rounded-[20px] rounded-[18px] bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] text-white shadow-[0_24px_60px_rgba(90,0,18,0.28)] overflow-hidden">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div key={label} className={`min-h-[86px] flex items-center gap-4 px-[30px] max-[720px]:px-0 max-[720px]:py-[18px] ${i === 0 ? 'pl-0' : ''} max-[720px]:border-b max-[720px]:border-[rgba(255,255,255,0.12)] border-r max-[1180px]:border-r-0 last:border-r-0 border-[rgba(255,255,255,0.16)] max-[720px]:justify-center max-[720px]:text-center ${i >= 2 ? 'max-[720px]:border-b-0' : ''}`}>
            <Icon size={44} className="w-11 h-11 shrink-0 stroke-[1.8] max-[720px]:w-8 max-[720px]:h-8" />
            <div>
              <strong className="block text-[34px] max-[720px]:text-[22px] leading-none font-black">{value}</strong>
              <span className="block mt-[6px] text-[15px] max-[720px]:text-[13px] leading-[1.35] text-[rgba(255,255,255,0.82)]">{label}</span>
            </div>
          </div>
        ))}

        <div className="min-h-[92px] pl-[38px] max-[1180px]:pl-0 max-[1180px]:pt-[22px] max-[1180px]:border-t max-[1180px]:border-[rgba(255,255,255,0.18)] max-[1180px]:col-span-2 max-[720px]:col-span-2 flex flex-col justify-center max-[720px]:items-center max-[720px]:text-center">
          <h3 className="max-w-[360px] m-0 mb-3 text-[22px] leading-[1.08] font-black">
            Learn. Build.
            <br />
            Lead the Future.
          </h3>
          <p className="max-w-[390px] m-0 text-[16px] max-[720px]:text-[15px] leading-[1.45] text-[rgba(255,255,255,0.84)]">
            Hands-on digital education that prepares you for tomorrow&apos;s
            world.
          </p>
        </div>
      </section>

      <section className="pds-programs-section">
        <div className="pds-section-heading">
          <div>
            <h2>Explore Our Future-Ready Programs</h2>
            <span />
          </div>

          <Link href="/programs">
            View All Programs <ArrowRight size={15} />
          </Link>
        </div>

        <div className="pds-program-grid">
          {programs.map(({ icon: Icon, title, description }) => (
            <article className="pds-program-card" key={title}>
              <div className="pds-program-icon">
                <Icon size={46} />
              </div>

              <h3>{title}</h3>
              <p>{description}</p>

              <Link
                href="/programs"
                className="pds-card-arrow"
                aria-label={title}
              >
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="pds-feature-grid">
        <article className="pds-excellence-card">
          <div className="pds-award-icon">★</div>

          <h2>Excellence in Education</h2>

          <p>
            Empowering students with skills, knowledge, and confidence to
            succeed in a global world.
          </p>
        </article>
        <article className="pds-promo-card">
          <div className="pds-promo-content">
            <h2>
              Innovative Learning
              <br />
              for a Digital Future
            </h2>

            <p>
              Industry-focused curriculum with real-world projects and expert
              mentorship.
            </p>

            <Link href="/programs">
              Discover More <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pds-promo-image">
            <Image
              src="/pds-assets/laptop-student.jpg"
              alt="Student using laptop"
              width={700}
              height={500}
            />
          </div>
        </article>

        
      </section>

      <section className="pds-why-testimonial">
        <div className="pds-why-card">
          <div className="pds-small-label">Why Choose</div>

          <h2>Prime Digital School?</h2>

          <div className="pds-why-grid">
            {whyChoose.map(({ icon: Icon, title }) => (
              <div className="pds-why-item" key={title}>
                <Icon size={32} />
                <span>{title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pds-campus-card">
          <Image
            src="/pds-assets/campus-building.jpg"
            alt="Prime Digital School campus"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="pds-campus-image"
          />
        </div>
      </section>

      <section className="pds-testimonials-scroll">
        <div className="pds-testimonials-track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div className="pds-review-card" key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#6B0025] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-[15px] leading-tight text-[#1C1B1B]">{t.name}</div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, ri) => (
                      <svg key={ri} className="w-4 h-4 fill-[#FFB800]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[14px] leading-[1.6] text-[#3f3f46] m-0">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty */}
      <section className="bg-white py-16 md:py-[110px] px-6 md:px-12 flex justify-center border-t border-[#E5E2E1]">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-12">
          <h2 className="text-3xl md:text-[32px] font-bold text-[#6B0025] text-center">
            Learn from the Experts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-4 group cursor-pointer">
              <div className="w-full h-[260px] md:h-[290px] rounded-2xl bg-[#E5E2E1] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B0025]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-semibold text-[#1C1B1B] group-hover:text-[#6B0025] transition-colors">Ravi Rana</h4>
                <p className="text-xs md:text-sm font-semibold text-[#6B0025] tracking-[0.7px]">HEAD OF ARTIFICIAL INTELLIGENCE</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 group cursor-pointer">
              <div className="w-full h-[260px] md:h-[290px] rounded-2xl bg-[#E5E2E1] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B0025]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-semibold text-[#1C1B1B] group-hover:text-[#6B0025] transition-colors">Supriya Khandekar</h4>
                <p className="text-xs md:text-sm font-semibold text-[#6B0025] tracking-[0.7px]">LEAD DESIGN DIRECTOR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery & Contact */}
      <section className="bg-[#FCF9F8] pt-16 md:pt-[110px] pb-24 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col gap-10">
          <h2 className="text-3xl md:text-[32px] font-bold text-[#6B0025]">
            Life at Prime Digital
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="h-[260px] md:h-[394px] rounded-2xl bg-[#DCD9D9] shadow-sm"></div>
            <div className="h-[260px] md:h-[394px] rounded-2xl bg-[#C4C4C4] shadow-sm"></div>
            <div className="h-[260px] md:h-[394px] rounded-2xl bg-[#E5E2E1] shadow-sm"></div>
          </div>

          <div className="w-full max-w-[1232px] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10 mx-auto">
            <div className="w-full md:w-1/2 p-8 md:p-16">
              <h2 className="text-3xl md:text-[32px] font-bold text-[#6B0025] mb-8">
                Get In Touch
              </h2>
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#1C1B1B] tracking-[0.7px]">Full Name</label>
                    <input type="text" className="h-[50px] px-4 rounded-xl border border-[#DDBFC2] bg-[#FCF9F8] focus:outline-none focus:border-[#6B0025]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#1C1B1B] tracking-[0.7px]">Email Address</label>
                    <input type="email" className="h-[50px] px-4 rounded-xl border border-[#DDBFC2] bg-[#FCF9F8] focus:outline-none focus:border-[#6B0025]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1C1B1B] tracking-[0.7px]">Message</label>
                  <textarea className="h-[122px] p-4 rounded-xl border border-[#DDBFC2] bg-[#FCF9F8] focus:outline-none focus:border-[#6B0025] resize-none"></textarea>
                </div>
                <button type="submit" className="bg-[#6B0025] text-white px-8 py-4 rounded-xl text-sm font-semibold tracking-[0.7px] hover:bg-[#8B1C3A] transition-colors w-fit mt-2">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 bg-[#8B1C3A] p-8 md:p-16 flex flex-col justify-between">
              <div className="flex flex-col gap-10">
                <h3 className="text-2xl font-semibold text-white">Contact Information</h3>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-[#755B00] shrink-0" />
                    <span className="text-base text-white leading-[24px]">123 Innovation Drive, Tech District, City 10012</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-[#755B00] shrink-0" />
                    <span className="text-base text-white leading-[24px]">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-[#755B00] shrink-0" />
                    <span className="text-base text-white leading-[24px]">admissions@primedigital.edu</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[180px] md:h-[256px] bg-[#DCD9D9] rounded-2xl flex items-center justify-center mt-10">
                <span className="text-base text-[#574144] italic">Map Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
