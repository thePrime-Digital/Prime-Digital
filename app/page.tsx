import Image from "next/image";
import Link from "next/link";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-x-hidden w-full">
      <Navbar/>
      
      <section className="w-full h-[100dvh] mt-1 lg:mt-0 mx-auto relative flex items-center overflow-hidden ml-2 lg:ml-4 lg:pl-4  max-[600px]:flex-col max-[600px]:items-stretch max-[600px]:overflow-visible max-[600px]:pt-2">
        
        
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
            sizes="100vw"
            className="object-cover object-[80%_center]"
          />
        </div>
      </section>

      <section className="w-10/11 max-[1180px]:w-[min(100%-48px,1320px)] max-[720px]:w-[min(100%-28px,1320px)] relative z-12 grid grid-cols-[repeat(4,1fr)_1.45fr] max-[1180px]:grid-cols-[repeat(2,1fr)] max-[720px]:grid-cols-1 items-center gap-0 mx-auto mt-[-50px] max-[1180px]:mt-6 p-[26px] px-[42px] max-[1180px]:p-[26px_28px] max-[720px]:p-6 max-[720px]:rounded-[20px] rounded-[18px] bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] text-white shadow-[0_24px_60px_rgba(90,0,18,0.28)] overflow-hidden">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div key={label} className={`min-h-[86px] flex items-center gap-4 px-[30px] max-[720px]:px-0 max-[720px]:py-[18px] ${i === 0 ? 'pl-0 max-[720px]:pt-0' : ''} max-[720px]:border-b max-[720px]:border-[rgba(255,255,255,0.16)] border-r max-[1180px]:border-r-0 last:border-r-0 border-[rgba(255,255,255,0.16)]`}>
            <Icon size={44} className="w-11 h-11 shrink-0 stroke-[1.8] max-[720px]:w-8 max-[720px]:h-8" />
            <div>
              <strong className="block text-[34px] max-[720px]:text-[22px] leading-none font-black">{value}</strong>
              <span className="block mt-[6px] text-[15px] max-[720px]:text-[13px] leading-[1.35] text-[rgba(255,255,255,0.82)]">{label}</span>
            </div>
          </div>
        ))}

        <div className="min-h-[92px] pl-[38px] max-[1180px]:pl-0 max-[1180px]:pt-[22px] max-[1180px]:border-t max-[1180px]:border-[rgba(255,255,255,0.18)] max-[1180px]:col-span-2 max-[720px]:col-span-1 flex flex-col justify-center">
          <h3 className="max-w-[360px] m-0 mb-3 text-[28px] max-[720px]:text-[25px] leading-[1.08] font-black">
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

        <article className="pds-excellence-card">
          <div className="pds-award-icon">★</div>

          <h2>Excellence in Education</h2>

          <p>
            Empowering students with skills, knowledge, and confidence to
            succeed in a global world.
          </p>
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

        <div className="pds-testimonial-card">
          <div className="pds-quote">“</div>

          <p>
            Prime Digital School helped me build real-world skills and
            confidence in technology.
          </p>

          <div className="pds-student-review">
            <div className="pds-avatar">A</div>

            <div>
              <strong>Aranya Patil</strong>
              <span>Class 11 Student</span>
              <small>★★★★★</small>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
