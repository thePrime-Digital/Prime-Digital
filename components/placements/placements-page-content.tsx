"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Cloud,
  Code2,
  MapPin,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

type CategoryId = "data" | "marketing" | "ai" | "fullstack" | "cyber" | "cloud";
type Student = {
  id: string;
  name: string;
  role: string;
  skill: string;
  company: string;
  salary: string;
  location: string;
  image: string;
};
type Category = {
  id: CategoryId;
  name: string;
  folder: string;
  prefix: string;
  description: string;
  roster: string;
};

// Name | Job role | Skill focus. All image filenames match /public/students.
const categories: Category[] = [
  {
    id: "data",
    name: "Data Analytics",
    folder: "Data-Analytics",
    prefix: "data-analytics",
    description:
      "Explore pathways in analysis, reporting, business intelligence and data visualisation.",
    roster: `Aditi Kulkarni|Junior Data Analyst|Data Analysis
Rohan Jadhav|Business Intelligence Analyst|Business Intelligence
Sneha Patil|Data Reporting Analyst|Data Reporting
Aryan Deshmukh|SQL Analyst|SQL
Kavya Joshi|Power BI Analyst|Power BI
Siddharth More|Business Data Analyst|Business Analytics
Anushka Shah|Analytics Associate|Data Analytics
Kunal Mehta|Data Visualisation Analyst|Data Visualisation
Isha Nair|Junior Business Analyst|Business Analysis
Yash Bhosale|Python Data Analyst|Python`,
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    folder: "Digital-Marketing",
    prefix: "digital-marketing",
    description:
      "Explore pathways in SEO, paid advertising, social media and digital campaigns.",
    roster: `Priya Deshpande|Digital Marketing Executive|Digital Marketing
Aditya Pawar|SEO Analyst|SEO
Neha Kulkarni|Social Media Executive|Social Media
Omkar Patil|Performance Marketing Associate|Performance Marketing
Riya Jadhav|Content Marketing Executive|Content Marketing
Harsh Shah|Google Ads Specialist|Google Ads
Sakshi More|Email Marketing Associate|Email Marketing
Nikhil Joshi|Digital Campaign Analyst|Digital Campaigns
Pooja Chavan|Social Media Strategist|Social Media Strategy
Atharva Shinde|Marketing Analytics Associate|Marketing Analytics`,
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    folder: "AI-Machine-Learning",
    prefix: "ai-ml",
    description:
      "Discover opportunities in Python, machine learning, NLP and computer vision.",
    roster: `Meera Sharma|Junior AI Engineer|Artificial Intelligence
Arjun Verma|Machine Learning Associate|Machine Learning
Simran Kapoor|Python AI Developer|Python AI
Rahul Sinha|NLP Developer|NLP
Tanvi Malhotra|AI Research Associate|AI Research
Dev Khanna|Computer Vision Associate|Computer Vision
Nandini Gupta|Machine Learning Analyst|Machine Learning
Rishabh Batra|AI Software Developer|AI Development
Ananya Arora|Data Science Associate|Data Science
Karan Mehta|Deep Learning Associate|Deep Learning`,
  },
  {
    id: "fullstack",
    name: "Full-Stack Development",
    folder: "Full-Stack-Development",
    prefix: "full-stack",
    description:
      "Explore frontend, backend and full-stack engineering career pathways.",
    roster: `Avni Deshmukh|React Developer|React
Pranav Kulkarni|Junior Full-Stack Developer|Full-Stack Development
Shruti Patil|Frontend Developer|Frontend Development
Saurabh Jadhav|Node.js Developer|Node.js
Kritika Sharma|UI Developer|UI Development
Mohit Verma|Backend Developer|Backend Development
Akash Bansal|MERN Stack Developer|MERN Stack
Ishita Rao|Web Application Developer|Web Applications
Varun Yadav|JavaScript Developer|JavaScript
Diya Sethi|Next.js Developer|Next.js`,
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    folder: "Cybersecurity",
    prefix: "cybersecurity",
    description:
      "Explore security analysis, network protection and security operations pathways.",
    roster: `Radhika Menon|Cybersecurity Analyst|Cybersecurity
Aayush Saxena|Junior Security Analyst|Security Analysis
Shreya Anand|SOC Analyst|SOC Operations
Kabir Ahuja|Network Security Associate|Network Security
Nisha Yadav|Information Security Analyst|Information Security
Manav Dutta|Vulnerability Assessment Analyst|Vulnerability Assessment
Sanya Bhatia|Security Operations Associate|Security Operations
Dhruv Chawla|Ethical Hacking Associate|Ethical Hacking
Aisha Khan|IT Security Analyst|IT Security
Rohit Tiwari|Application Security Associate|Application Security`,
  },
  {
    id: "cloud",
    name: "Cloud Computing & DevOps",
    folder: "Cloud-Computing-DevOps",
    prefix: "cloud-devops",
    description:
      "Discover cloud infrastructure, deployment, AWS, Azure and DevOps pathways.",
    roster: `Vaishnavi Gokhale|Cloud Support Associate|Cloud Support
Sameer Joshi|AWS Cloud Associate|AWS
Pallavi Bhosale|Cloud Operations Analyst|Cloud Operations
Tejas Kulkarni|Junior DevOps Engineer|DevOps
Aastha Singh|Azure Cloud Associate|Azure
Naman Oberoi|Cloud Infrastructure Associate|Cloud Infrastructure
Mrunal Patil|DevOps Automation Associate|DevOps Automation
Om Deshpande|Linux Systems Associate|Linux
Vivek Mishra|Cloud Deployment Associate|Cloud Deployment
Priyanka Sinha|AWS Operations Analyst|AWS Operations`,
  },
];

const categoryIcons = {
  data: BarChart3,
  marketing: Megaphone,
  ai: BrainCircuit,
  fullstack: Code2,
  cyber: ShieldCheck,
  cloud: Cloud,
};

// Only employers visible in the supplied corporate-logo reference.
const employers: Record<CategoryId, string[]> = {
  data: [
    "Accenture",
    "Infosys",
    "Wipro",
    "eClerx",
    "HDFC Bank",
    "Kotak Life Insurance",
    "Tata Communications",
    "ICICI Prudential Life Insurance",
    "IDBI Bank",
    "Bank of Baroda",
  ],
  marketing: [
    "Justdial",
    "Magicbricks",
    "BookMyShow",
    "Hindustan Times",
    "The Times of India",
    "Viacom18",
    "Disney+ Hotstar",
    "Jio",
    "Kansai Nerolac Paints",
    "Freecharge",
  ],
  ai: [
    "Infosys",
    "Accenture",
    "Wipro",
    "NeoSOFT Technologies",
    "Tata Communications",
    "Jio",
    "eClerx",
    "Freecharge",
    "HDFC Bank",
    "Magicbricks",
  ],
  fullstack: [
    "NeoSOFT Technologies",
    "Infosys",
    "Wipro",
    "Accenture",
    "Jio",
    "BookMyShow",
    "Magicbricks",
    "Justdial",
    "Freecharge",
    "Tata Communications",
  ],
  cyber: [
    "HDFC Bank",
    "ICICI Prudential Life Insurance",
    "Kotak Life Insurance",
    "IDBI Bank",
    "Bank of Baroda",
    "Union Bank of India",
    "Infosys",
    "Accenture",
    "Jio",
    "Wipro",
  ],
  cloud: [
    "Tata Communications",
    "Jio",
    "Infosys",
    "Wipro",
    "Accenture",
    "NeoSOFT Technologies",
    "HDFC Bank",
    "BookMyShow",
    "Freecharge",
    "eClerx",
  ],
};
const salaries: Record<CategoryId, number[]> = {
  data: [3.2, 3.8, 4.1, 3.5, 4.0, 3.6, 3.9, 4.2, 3.4, 3.7],
  marketing: [3.0, 3.2, 2.8, 3.4, 3.1, 3.6, 3.0, 3.5, 3.3, 3.8],
  ai: [3.8, 4.2, 3.6, 4.0, 4.4, 3.9, 4.1, 4.5, 3.7, 4.6],
  fullstack: [3.4, 3.8, 3.2, 4.0, 3.6, 4.2, 3.9, 3.5, 4.1, 4.4],
  cyber: [3.2, 3.5, 3.8, 3.4, 3.6, 4.0, 3.7, 3.3, 4.1, 3.9],
  cloud: [3.6, 4.0, 3.8, 4.2, 3.5, 4.4, 3.9, 4.1, 4.5, 4.0],
};
const locations = [
  "Mumbai",
  "Navi Mumbai",
  "Panvel",
  "Thane",
  "Kalyan",
  "Dombivli",
  "Airoli",
  "Vashi",
  "Ulwe",
  "Nerul",
];

const studentsByCategory = Object.fromEntries(
  categories.map((category) => [
    category.id,
    category.roster
      .trim()
      .split("\n")
      .map((line, index): Student => {
        const [name, role, skill] = line.split("|");
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        return {
          id: `${category.id}-${index}`,
          name,
          role,
          skill,
          company: employers[category.id][index],
          salary: `\u20B9${salaries[category.id][index].toFixed(1)} LPA`,
          location: locations[index],
          image: `/students/${category.folder}/${category.prefix}-${slug}.webp`,
        };
      }),
  ]),
) as Record<CategoryId, Student[]>;

function Carousel({ students }: { students: Student[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    let frame = 0;
    const tick = (time: number) => {
      if (last && !pausedRef.current && track) {
        track.scrollLeft += Math.min(time - last, 64) * 0.024;
        const midpoint = track.scrollWidth / 2;
        if (track.scrollLeft >= midpoint) track.scrollLeft -= midpoint;
      }
      last = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [students]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector<HTMLElement>("article");
    const width = first ? first.getBoundingClientRect().width + 16 : 300;
    const middle = track.scrollWidth / 2;
    if (direction < 0 && track.scrollLeft < width) track.scrollLeft += middle;
    track.scrollBy({ left: width * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous student"
        className="absolute -left-2 top-[42%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-[#081a3a] shadow-md hover:text-[#7c001d] sm:-left-5"
      >
        <ArrowLeft size={18} />
      </button>
      <div
        ref={trackRef}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onFocusCapture={() => {
          pausedRef.current = true;
        }}
        onBlurCapture={() => {
          pausedRef.current = false;
        }}
        className="placements-track flex gap-4 overflow-x-auto py-2"
        aria-label="Student career profiles"
      >
        {[...students, ...students].map((student, index) => (
          <article
            key={`${student.id}-${index}`}
            className="flex h-[436px] w-[245px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white sm:w-[260px] lg:w-[calc((100%-48px)/4)]"
          >
            <div className="relative h-[238px] shrink-0 bg-[#eee8ed]">
              <Image
                src={student.image}
                alt={`Illustrative portrait of ${student.name}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 245px, (max-width: 1024px) 260px, 25vw"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <h3 className="text-base font-bold leading-tight text-[#081a3a]">
                {student.name}
              </h3>
              <p className="mt-1 min-h-[32px] text-xs leading-4 text-slate-600">
                {student.role}
              </p>
              <div className="mt-3 border-t border-slate-200 pt-3">
                <p
                  className="line-clamp-1 text-sm font-semibold text-[#081a3a]"
                  title={student.company}
                >
                  {student.company}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={12} />
                  {student.location}
                </p>
              </div>
              <p className="mt-auto pt-2 text-lg font-extrabold text-[#7c001d]">
                {student.salary}
              </p>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next student"
        className="absolute -right-2 top-[42%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-[#081a3a] shadow-md hover:text-[#7c001d] sm:-right-5"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default function PlacementsPageContent() {
  const [selectedId, setSelectedId] = useState<CategoryId>("data");
  const selected =
    categories.find((category) => category.id === selectedId) ?? categories[0];
  const students = studentsByCategory[selectedId];
  return (
    <main data-placements-page className="bg-[#fcfaf8] pt-16 text-[#081a3a] lg:pt-20">
      {/* Existing global site header/footer should be supplied by app/layout.tsx. */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:py-12">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#7c001d]">
              Student Career Outcomes
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[64px]">
              Real Skills.
              <br />
              <span className="text-[#7c001d]">New Career Horizons.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 lg:text-lg">
              Discover career pathways across our six professional programmes
              and see how industry-focused learning can open new possibilities.
            </p>
          </div>
          <div className="grid aspect-[1.65] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
            {[
              studentsByCategory.data[0],
              studentsByCategory.marketing[0],
              studentsByCategory.ai[1],
              studentsByCategory.cyber[0],
            ].map((student) => (
              <div className="relative min-h-0" key={student.id}>
                <Image
                  src={student.image}
                  alt="Student portrait illustration"
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="mx-auto max-w-7xl px-5 pt-14 pb-8 sm:px-8 lg:pt-16 lg:pb-10">
        <section aria-labelledby="programmes-title">
          <h2
            id="programmes-title"
            className="text-3xl font-black tracking-tight sm:text-4xl"
          >
            Explore Student Career Pathways
          </h2>
          <div
            role="group"
            aria-label="Choose a programme"
            className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => {
              const Icon = categoryIcons[category.id];
              const active = category.id === selectedId;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(category.id)}
                  className={`flex min-h-[64px] items-center gap-3 rounded-lg border px-5 py-4 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c001d] ${active ? "border-[#7c001d] bg-[#7c001d] text-white" : "border-slate-200 bg-white text-[#081a3a] hover:border-[#7c001d] hover:bg-[#fff7f9]"}`}
                >
                  <Icon
                    size={21}
                    className={active ? "text-white" : "text-[#7c001d]"}
                    aria-hidden="true"
                  />
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="selected-title">
          <h2
            id="selected-title"
            className="text-3xl font-black tracking-tight sm:text-4xl"
          >
            {selected.name}
          </h2>
          <p className="mb-6 mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {selected.description}
          </p>
          <Carousel key={selectedId} students={students} />
        </section>

        <section className="mt-16" aria-labelledby="more-title">
          <h2
            id="more-title"
            className="text-3xl font-black tracking-tight sm:text-4xl"
          >
            More Career Profiles
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {students.slice(4).map((student) => (
              <article
                key={student.id}
                className="flex h-[116px] items-center gap-4 rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="relative h-[88px] w-[78px] shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={student.image}
                    alt={`Illustrative portrait of ${student.name}`}
                    fill
                    className="object-cover object-top"
                    sizes="78px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold">{student.name}</h3>
                  <p
                    className="mt-1 truncate text-xs text-slate-600"
                    title={student.role}
                  >
                    {student.role}
                  </p>
                  <p className="mt-2 flex min-w-0 items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0" />
                    <span className="shrink-0">{student.location}</span>
                    <span className="mx-1">&#183;</span>
                    <span className="truncate" title={student.company}>
                      {student.company}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 border-l-4 border-[#7c001d] pl-5">
          <p className="text-xl font-bold tracking-tight sm:text-2xl lg:text-[28px]">
            Empowering futures through industry-relevant learning.
          </p>
        </div>
      </div>

      <section className="bg-[#7c001d]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Build the skills for your next opportunity.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Find the professional programme that fits your goals.
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-md bg-white px-6 py-3 text-sm font-bold text-[#7c001d] transition hover:bg-[#fff1f5]"
          >
            Explore Programmes <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        body:has([data-placements-page]) footer {
          margin-top: 0 !important;
        }

        body:has([data-placements-page]) [data-placements-page] {
          margin-bottom: 0 !important;
        }
        .placements-track {
          scrollbar-width: none;
          scroll-behavior: auto;
        }
        .placements-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}



