"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Megaphone,
  BrainCircuit,
  Code2,
  ShieldCheck,
  Cloud,
} from "lucide-react";

type ProgrammeId =
  | "data-analytics"
  | "digital-marketing"
  | "ai-ml"
  | "full-stack"
  | "cybersecurity"
  | "cloud-devops";

type StudentProfile = {
  id: number;
  name: string;
  role: string;
  skill: string;
  location: string;
  company: string;
  package: string;
  image: string;
};

type StudentEntry = [name: string, role: string, skill: string];

type Programme = {
  id: ProgrammeId;
  label: string;
  heading: string;
  description: string;
  students: StudentProfile[];
};

// All locations are in Mumbai or the surrounding
// Maharashtra metropolitan region.
const LOCATIONS = [
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

// Companies are selected only from the reference image.
// They are illustrative examples, not verified placements.
const COMPANIES: Record<ProgrammeId, string[]> = {
  "data-analytics": [
    "Accenture",
    "Wipro",
    "Infosys",
    "eClerx",
    "HDFC Bank",
    "Kotak Life Insurance",
    "Tata Communications",
    "ICICI Prudential Life Insurance",
    "IDBI Bank",
    "Bank of Baroda",
  ],
  "digital-marketing": [
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
  "ai-ml": [
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
  "full-stack": [
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
  cybersecurity: [
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
  "cloud-devops": [
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

// Modest, illustrative annual salary packages.
const PACKAGES: Record<ProgrammeId, string[]> = {
  "data-analytics": [
    "₹3.2 LPA",
    "₹3.6 LPA",
    "₹3.8 LPA",
    "₹3.4 LPA",
    "₹4.0 LPA",
    "₹3.5 LPA",
    "₹4.2 LPA",
    "₹3.7 LPA",
    "₹3.6 LPA",
    "₹4.1 LPA",
  ],
  "digital-marketing": [
    "₹3.0 LPA",
    "₹3.2 LPA",
    "₹2.8 LPA",
    "₹3.4 LPA",
    "₹3.1 LPA",
    "₹3.6 LPA",
    "₹3.0 LPA",
    "₹3.5 LPA",
    "₹3.3 LPA",
    "₹3.8 LPA",
  ],
  "ai-ml": [
    "₹3.8 LPA",
    "₹4.2 LPA",
    "₹3.6 LPA",
    "₹4.0 LPA",
    "₹4.4 LPA",
    "₹3.9 LPA",
    "₹4.1 LPA",
    "₹4.5 LPA",
    "₹3.7 LPA",
    "₹4.6 LPA",
  ],
  "full-stack": [
    "₹3.4 LPA",
    "₹3.8 LPA",
    "₹3.2 LPA",
    "₹4.0 LPA",
    "₹3.6 LPA",
    "₹4.2 LPA",
    "₹3.9 LPA",
    "₹3.5 LPA",
    "₹4.1 LPA",
    "₹4.4 LPA",
  ],
  cybersecurity: [
    "₹3.2 LPA",
    "₹3.5 LPA",
    "₹3.8 LPA",
    "₹3.4 LPA",
    "₹3.6 LPA",
    "₹4.0 LPA",
    "₹3.7 LPA",
    "₹3.3 LPA",
    "₹4.1 LPA",
    "₹3.9 LPA",
  ],
  "cloud-devops": [
    "₹3.6 LPA",
    "₹4.0 LPA",
    "₹3.8 LPA",
    "₹4.2 LPA",
    "₹3.5 LPA",
    "₹4.4 LPA",
    "₹3.9 LPA",
    "₹4.1 LPA",
    "₹4.5 LPA",
    "₹4.0 LPA",
  ],
};

function createStudents(
  programmeId: ProgrammeId,
  folder: string,
  imagePrefix: string,
  startId: number,
  entries: StudentEntry[],
): StudentProfile[] {
  return entries.map(([name, role, skill], index) => {
    const fileName = name.toLowerCase().replace(/\s+/g, "-");

    return {
      id: startId + index,
      name,
      role,
      skill,
      location: LOCATIONS[index],
      company: COMPANIES[programmeId][index],
      package: PACKAGES[programmeId][index],
      image: `/students/${folder}/${imagePrefix}-${fileName}.webp`,
    };
  });
}

const PROGRAMMES: Programme[] = [
  {
    id: "data-analytics",
    label: "Data Analytics",
    heading: "Explore Careers in Data Analytics",
    description:
      "Discover career pathways in data analysis, business intelligence, reporting, SQL and data visualisation.",
    students: createStudents(
      "data-analytics",
      "Data-Analytics",
      "data-analytics",
      1,
      [
        ["Aditi Kulkarni", "Junior Data Analyst", "Data Analysis"],
        [
          "Rohan Jadhav",
          "Business Intelligence Analyst",
          "Business Intelligence",
        ],
        ["Sneha Patil", "Data Reporting Analyst", "Data Reporting"],
        ["Aryan Deshmukh", "SQL Analyst", "SQL"],
        ["Kavya Joshi", "Power BI Analyst", "Power BI"],
        ["Siddharth More", "Business Data Analyst", "Business Analytics"],
        ["Anushka Shah", "Analytics Associate", "Data Analytics"],
        ["Kunal Mehta", "Data Visualisation Analyst", "Data Visualisation"],
        ["Isha Nair", "Junior Business Analyst", "Business Analysis"],
        ["Yash Bhosale", "Python Data Analyst", "Python"],
      ],
    ),
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    heading: "Explore Careers in Digital Marketing",
    description:
      "Discover career pathways in SEO, social media, content marketing, paid advertising and digital campaigns.",
    students: createStudents(
      "digital-marketing",
      "Digital-Marketing",
      "digital-marketing",
      11,
      [
        ["Priya Deshpande", "Digital Marketing Executive", "Digital Marketing"],
        ["Aditya Pawar", "SEO Analyst", "SEO"],
        ["Neha Kulkarni", "Social Media Executive", "Social Media"],
        [
          "Omkar Patil",
          "Performance Marketing Associate",
          "Performance Marketing",
        ],
        ["Riya Jadhav", "Content Marketing Executive", "Content Marketing"],
        ["Harsh Shah", "Google Ads Specialist", "Google Ads"],
        ["Sakshi More", "Email Marketing Associate", "Email Marketing"],
        ["Nikhil Joshi", "Digital Campaign Analyst", "Digital Campaigns"],
        ["Pooja Chavan", "Social Media Strategist", "Social Media Strategy"],
        [
          "Atharva Shinde",
          "Marketing Analytics Associate",
          "Marketing Analytics",
        ],
      ],
    ),
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    heading: "Explore Careers in AI & Machine Learning",
    description:
      "Explore opportunities in artificial intelligence, machine learning, Python, NLP and computer vision.",
    students: createStudents("ai-ml", "AI-Machine-Learning", "ai-ml", 21, [
      ["Meera Sharma", "Junior AI Engineer", "Artificial Intelligence"],
      ["Arjun Verma", "Machine Learning Associate", "Machine Learning"],
      ["Simran Kapoor", "Python AI Developer", "Python AI"],
      ["Rahul Sinha", "NLP Developer", "NLP"],
      ["Tanvi Malhotra", "AI Research Associate", "AI Research"],
      ["Dev Khanna", "Computer Vision Associate", "Computer Vision"],
      ["Nandini Gupta", "Machine Learning Analyst", "Machine Learning"],
      ["Rishabh Batra", "AI Software Developer", "AI Development"],
      ["Ananya Arora", "Data Science Associate", "Data Science"],
      ["Karan Mehta", "Deep Learning Associate", "Deep Learning"],
    ]),
  },
  {
    id: "full-stack",
    label: "Full-Stack Development",
    heading: "Explore Careers in Full-Stack Development",
    description:
      "Discover frontend, backend and full-stack development roles using modern web technologies.",
    students: createStudents(
      "full-stack",
      "Full-Stack-Development",
      "full-stack",
      31,
      [
        ["Avni Deshmukh", "React Developer", "React"],
        [
          "Pranav Kulkarni",
          "Junior Full-Stack Developer",
          "Full-Stack Development",
        ],
        ["Shruti Patil", "Frontend Developer", "Frontend Development"],
        ["Saurabh Jadhav", "Node.js Developer", "Node.js"],
        ["Kritika Sharma", "UI Developer", "UI Development"],
        ["Mohit Verma", "Backend Developer", "Backend Development"],
        ["Akash Bansal", "MERN Stack Developer", "MERN Stack"],
        ["Ishita Rao", "Web Application Developer", "Web Applications"],
        ["Varun Yadav", "JavaScript Developer", "JavaScript"],
        ["Diya Sethi", "Next.js Developer", "Next.js"],
      ],
    ),
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    heading: "Explore Careers in Cybersecurity",
    description:
      "Learn about careers in security operations, network protection, vulnerability assessment and information security.",
    students: createStudents(
      "cybersecurity",
      "Cybersecurity",
      "cybersecurity",
      41,
      [
        ["Radhika Menon", "Cybersecurity Analyst", "Cybersecurity"],
        ["Aayush Saxena", "Junior Security Analyst", "Security Analysis"],
        ["Shreya Anand", "SOC Analyst", "SOC Operations"],
        ["Kabir Ahuja", "Network Security Associate", "Network Security"],
        ["Nisha Yadav", "Information Security Analyst", "Information Security"],
        [
          "Manav Dutta",
          "Vulnerability Assessment Analyst",
          "Vulnerability Assessment",
        ],
        [
          "Sanya Bhatia",
          "Security Operations Associate",
          "Security Operations",
        ],
        ["Dhruv Chawla", "Ethical Hacking Associate", "Ethical Hacking"],
        ["Aisha Khan", "IT Security Analyst", "IT Security"],
        [
          "Rohit Tiwari",
          "Application Security Associate",
          "Application Security",
        ],
      ],
    ),
  },
  {
    id: "cloud-devops",
    label: "Cloud Computing & DevOps",
    heading: "Explore Careers in Cloud Computing & DevOps",
    description:
      "Explore cloud infrastructure, AWS, Azure, deployment automation, Linux and DevOps career pathways.",
    students: createStudents(
      "cloud-devops",
      "Cloud-Computing-DevOps",
      "cloud-devops",
      51,
      [
        ["Vaishnavi Gokhale", "Cloud Support Associate", "Cloud Support"],
        ["Sameer Joshi", "AWS Cloud Associate", "AWS"],
        ["Pallavi Bhosale", "Cloud Operations Analyst", "Cloud Operations"],
        ["Tejas Kulkarni", "Junior DevOps Engineer", "DevOps"],
        ["Aastha Singh", "Azure Cloud Associate", "Azure"],
        [
          "Naman Oberoi",
          "Cloud Infrastructure Associate",
          "Cloud Infrastructure",
        ],
        ["Mrunal Patil", "DevOps Automation Associate", "DevOps Automation"],
        ["Om Deshpande", "Linux Systems Associate", "Linux"],
        ["Vivek Mishra", "Cloud Deployment Associate", "Cloud Deployment"],
        ["Priyanka Sinha", "AWS Operations Analyst", "AWS Operations"],
      ],
    ),
  },
];

const PROGRAMME_ICONS = {
  "data-analytics": BarChart3,
  "digital-marketing": Megaphone,
  "ai-ml": BrainCircuit,
  "full-stack": Code2,
  cybersecurity: ShieldCheck,
  "cloud-devops": Cloud,
};

function PlacementCardItem({
  item,
  programme,
}: {
  item: StudentProfile;
  programme: string;
}) {
  return (
    <article className="group flex h-[660px] w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[#7c001d]/10 bg-white shadow-[0_18px_50px_rgba(30,10,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(124,0,29,0.14)] sm:w-[320px]">
      {/* Student portrait */}
      <div className="relative aspect-[4/4.5] w-full shrink-0 overflow-hidden bg-[#f8f4f6]">
        <Image
          src={item.image}
          alt={`Illustrative student profile: ${item.name}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 80vw, 320px"
        />

        <div className="absolute left-4 top-4 max-w-[75%] truncate rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c001d] backdrop-blur">
          {programme}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e0a12]/85 via-[#1e0a12]/35 to-transparent px-5 pb-5 pt-16 text-white">
          <p className="text-xl font-black leading-tight">{item.name}</p>
          <p className="mt-1 text-sm font-medium text-white/85">{item.role}</p>
        </div>
      </div>

      {/* Equal-height card details */}
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
            Example Employer
          </span>

          <span className="shrink-0 rounded-full bg-[#fff2f6] px-3 py-1 text-[11px] font-bold text-[#7c001d]">
            {item.location}
          </span>
        </div>

        <h3 className="mt-2 min-h-[48px] text-lg font-black leading-snug text-[#22141a]">
          {item.company}
        </h3>

        <div className="mt-auto rounded-[22px] border border-[#7c001d]/10 bg-[#fff8fa] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7c001d]">
            Illustrative Package
          </p>

          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-black leading-none text-[#7c001d]">
              {item.package}
            </p>

            <span className="shrink-0 text-[11px] font-semibold text-slate-500">
              Annual CTC
            </span>
          </div>

          <div className="mt-3 border-t border-[#7c001d]/10 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Skill Focus
            </p>
            <p className="mt-1 truncate text-sm font-bold text-[#7c001d]">
              {item.skill}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PlacementMarquee() {
  const [activeProgrammeId, setActiveProgrammeId] =
    useState<ProgrammeId>("data-analytics");

  const activeProgramme =
    PROGRAMMES.find((programme) => programme.id === activeProgrammeId) ??
    PROGRAMMES[0];

  // Duplicate the cards to preserve continuous scrolling.
  const marqueeItems = [
    ...activeProgramme.students,
    ...activeProgramme.students,
  ];

  return (
    <section className="relative overflow-hidden bg-[#fcfaf8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#fff2f6] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#7c001d]">
              Professional Career Pathways
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-[#081a3a] sm:text-5xl">
              {activeProgramme.heading}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {activeProgramme.description}
            </p>
          </div>
        </div>

        {/* Six selectable categories */}
        <div
          className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          role="group"
          aria-label="Select a professional programme"
        >
          {PROGRAMMES.map((programme) => {
            const selected = activeProgrammeId === programme.id;

            const Icon = PROGRAMME_ICONS[programme.id];

            return (
              <button
                key={programme.id}
                type="button"
                onClick={() => setActiveProgrammeId(programme.id)}
                aria-pressed={selected}
                className={`flex min-h-[86px] items-center gap-4 rounded-[22px] border px-6 py-5 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c001d] ${
                  selected
                    ? "border-[#7c001d] bg-[#7c001d] text-white shadow-[0_12px_30px_rgba(124,0,29,0.16)]"
                    : "border-[#7c001d]/10 bg-white text-[#081a3a] hover:border-[#7c001d]/40 hover:bg-[#fff8fa]"
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={`shrink-0 ${
                    selected ? "text-white" : "text-[#7c001d]"
                  }`}
                />

                <span className="text-sm font-bold sm:text-base">
                  {programme.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Original continuously scrolling slideshow */}
      <div
        className="relative"
        aria-label={`${activeProgramme.label} student profile slideshow`}
      >
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#fcfaf8] to-transparent sm:w-24" />

        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#fcfaf8] to-transparent sm:w-24" />

        <div className="marquee-wrapper">
          <div className="marquee-track" key={activeProgrammeId}>
            {marqueeItems.map((item, index) => (
              <PlacementCardItem
                key={`${item.id}-${index}`}
                item={item}
                programme={activeProgramme.label}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          gap: 24px;
          animation: marquee-left 45s linear infinite;
          padding: 8px 16px;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .marquee-track {
            gap: 18px;
            animation-duration: 34s;
            padding: 8px 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
