"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PlacementHeroAnimation from "./placement-hero-animation";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Cloud,
  Code2,
  FlaskConical,
  Landmark,
  MapPin,
  Megaphone,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

type CategoryId =
  | "data"
  | "marketing"
  | "ai"
  | "fullstack"
  | "cyber"
  | "cloud"
  | "science"
  | "uiux"
  | "banking"
  | "entrepreneur";

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
  description: string;
  roles: string[];
  skills: string[];
  images: string[];
};

// ============================================================
// STUDENT IMAGE DATA
// Exact filenames from public/students
// ============================================================

const studentImages: Record<CategoryId, string[]> = {
  data: [
    "001-kashish-kadam.webp",
    "002-sara-saxena.webp",
    "003-mira-kapoor.webp",
    "004-shivani-chaudhary.webp",
    "005-akash-singh.webp",
    "006-tanvi-kadam.webp",
    "007-sarthak-menon.webp",
    "008-kiran-kadam.webp",
    "009-omkar-saxena.webp",
    "010-neha-saxena.webp",
  ],

  marketing: [
    "011-urvi-mishra.webp",
    "012-sameer-menon.webp",
    "013-sonia-singh.webp",
    "014-muskan-singh.webp",
    "015-priya-yadav.webp",
    "016-mahi-batra.webp",
    "017-tejas-shah.webp",
    "018-raghav-joshi.webp",
    "019-jatin-gokhale.webp",
    "020-sourav-chavan.webp",
  ],

  ai: [
    "021-sakshi-menon.webp",
    "022-nandini-singh.webp",
    "023-ananya-pawar.webp",
    "024-chaitanya-verma.webp",
    "025-mohit-kulkarni.webp",
    "026-anjali-patil.webp",
    "027-ria-sethi.webp",
    "028-arjun-mishra.webp",
    "029-ira-mishra.webp",
    "030-shreya-mishra.webp",
  ],

  fullstack: [
    "031-diya-patil.webp",
    "032-charvi-more.webp",
    "033-aryan-kulkarni.webp",
    "034-uday-mehta.webp",
    "035-vansh-chavan.webp",
    "036-aditya-more.webp",
    "037-gauri-kapse.webp",
    "038-krish-batra.webp",
    "039-varsha-kulkarni.webp",
    "040-sana-kapse.webp",
  ],

  cyber: [
    "041-vedant-saxena.webp",
    "042-amrita-chavan.webp",
    "043-esha-kapoor.webp",
    "044-arpita-menon.webp",
    "045-rohan-chaudhary.webp",
    "046-yash-deshmukh.webp",
    "047-akshara-kulkarni.webp",
    "048-nisha-mehta.webp",
    "049-tanmay-jadhav.webp",
    "050-zoya-nair.webp",
  ],

  cloud: [
    "051-sahil-mehta.webp",
    "052-naman-jadhav.webp",
    "053-siddharth-batra.webp",
    "054-aditi-mishra.webp",
    "055-kritika-kadam.webp",
    "056-aarav-pawar.webp",
    "057-pallavi-bhosale.webp",
    "058-meera-yadav.webp",
    "059-nikhil-nair.webp",
    "060-kunal-sharma.webp",
  ],

  science: [
    "061-darshan-sharma.webp",
    "062-bhavya-rao.webp",
    "063-srishti-gokhale.webp",
    "064-harshita-chaudhary.webp",
    "065-vihaan-sharma.webp",
    "066-dev-saxena.webp",
    "067-aniket-verma.webp",
    "068-rahul-joshi.webp",
    "069-lakshya-chaudhary.webp",
    "070-ruchika-more.webp",
  ],

  uiux: [
    "071-ansh-gupta.webp",
    "072-sneha-chaudhary.webp",
    "073-rashi-nair.webp",
    "074-pranav-verma.webp",
    "075-avani-verma.webp",
    "076-manav-mehta.webp",
    "077-rishabh-kapoor.webp",
    "078-pooja-singh.webp",
    "079-om-patil.webp",
    "080-vidhi-gokhale.webp",
  ],

  banking: [
    "081-simran-pawar.webp",
    "082-aman-kadam.webp",
    "083-ahana-jadhav.webp",
    "084-vaibhav-more.webp",
    "085-prisha-gokhale.webp",
    "086-vikram-gupta.webp",
    "087-harsh-batra.webp",
    "088-farhan-gokhale.webp",
    "089-parth-gokhale.webp",
    "090-kavya-deshmukh.webp",
  ],

  entrepreneur: [
    "091-trisha-kadam.webp",
    "092-kajal-gokhale.webp",
    "093-soham-naik.webp",
    "094-ishita-naik.webp",
    "095-ritika-sharma.webp",
    "096-ishaan-batra.webp",
    "097-karan-pawar.webp",
    "098-sanjana-gokhale.webp",
    "099-tarun-chaudhary.webp",
    "100-mihir-shah.webp",
  ],
};

// ============================================================
// COURSE CATEGORIES
// ============================================================

const categories: Category[] = [
  {
    id: "data",
    name: "Data Analytics",
    folder: "Data-Analytics",
    description:
      "Explore pathways in analysis, reporting, business intelligence and data visualisation.",
    roles: [
      "Junior Data Analyst",
      "Business Intelligence Analyst",
      "Reporting Analyst",
      "SQL Analyst",
      "Power BI Analyst",
      "Business Data Analyst",
      "Analytics Associate",
      "Data Visualisation Analyst",
      "Junior Business Analyst",
      "Python Data Analyst",
    ],
    skills: [
      "Data Analysis",
      "Business Intelligence",
      "Reporting",
      "SQL",
      "Power BI",
      "Business Analytics",
      "Data Analytics",
      "Data Visualisation",
      "Business Analysis",
      "Python",
    ],
    images: studentImages.data,
  },

  {
    id: "marketing",
    name: "Digital Marketing",
    folder: "Digital-Marketing",
    description:
      "Explore SEO, paid advertising, social media and digital marketing campaigns.",
    roles: [
      "Digital Marketing Associate",
      "SEO Analyst",
      "Social Media Executive",
      "Performance Marketing Associate",
      "Content Marketing Executive",
      "Google Ads Associate",
      "Email Marketing Associate",
      "Campaign Analyst",
      "Social Media Strategist",
      "Marketing Analytics Associate",
    ],
    skills: [
      "Digital Marketing",
      "SEO",
      "Social Media",
      "Performance Marketing",
      "Content Marketing",
      "Google Ads",
      "Email Marketing",
      "Digital Campaigns",
      "Social Media Strategy",
      "Marketing Analytics",
    ],
    images: studentImages.marketing,
  },

  {
    id: "ai",
    name: "AI & Machine Learning",
    folder: "AI-Machine-Learning",
    description:
      "Discover opportunities in artificial intelligence, Python, machine learning, NLP and computer vision.",
    roles: [
      "Junior AI Engineer",
      "Machine Learning Associate",
      "Python AI Developer",
      "NLP Associate",
      "AI Research Assistant",
      "Computer Vision Associate",
      "Machine Learning Analyst",
      "AI Software Developer",
      "Data Science Associate",
      "Deep Learning Associate",
    ],
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Python AI",
      "NLP",
      "AI Research",
      "Computer Vision",
      "ML Analytics",
      "AI Development",
      "Data Science",
      "Deep Learning",
    ],
    images: studentImages.ai,
  },

  {
    id: "fullstack",
    name: "Full-Stack Development",
    folder: "Full-Stack-Development",
    description:
      "Explore frontend, backend, web application and full-stack development career pathways.",
    roles: [
      "React Developer",
      "Junior Full-Stack Developer",
      "Frontend Developer",
      "Node.js Developer",
      "UI Developer",
      "Backend Developer",
      "MERN Developer",
      "Web App Developer",
      "JavaScript Developer",
      "Next.js Developer",
    ],
    skills: [
      "React",
      "Full-Stack",
      "Frontend",
      "Node.js",
      "UI",
      "Backend",
      "MERN",
      "Web Apps",
      "JavaScript",
      "Next.js",
    ],
    images: studentImages.fullstack,
  },

  {
    id: "cyber",
    name: "Cybersecurity",
    folder: "Cybersecurity",
    description:
      "Explore information security, network protection, ethical hacking and security operations.",
    roles: [
      "Cybersecurity Analyst",
      "Junior Security Analyst",
      "SOC Analyst",
      "Network Security Associate",
      "Information Security Analyst",
      "Vulnerability Analyst",
      "Security Operations Associate",
      "Ethical Hacking Associate",
      "IT Security Analyst",
      "Application Security Associate",
    ],
    skills: [
      "Cybersecurity",
      "Security Analysis",
      "SOC",
      "Network Security",
      "Information Security",
      "Vulnerability Assessment",
      "Security Operations",
      "Ethical Hacking",
      "IT Security",
      "Application Security",
    ],
    images: studentImages.cyber,
  },

  {
    id: "cloud",
    name: "Cloud Computing & DevOps",
    folder: "Cloud-Computing-DevOps",
    description:
      "Discover opportunities in cloud infrastructure, AWS, Azure, deployment and DevOps.",
    roles: [
      "Cloud Support Associate",
      "AWS Cloud Associate",
      "Cloud Operations Analyst",
      "Junior DevOps Engineer",
      "Azure Cloud Associate",
      "Cloud Infrastructure Associate",
      "DevOps Automation Associate",
      "Linux Systems Associate",
      "Cloud Deployment Associate",
      "AWS Operations Analyst",
    ],
    skills: [
      "Cloud Support",
      "AWS",
      "Cloud Operations",
      "DevOps",
      "Azure",
      "Cloud Infrastructure",
      "Automation",
      "Linux",
      "Deployment",
      "AWS Operations",
    ],
    images: studentImages.cloud,
  },

  {
    id: "science",
    name: "Data Science",
    folder: "Data-Science",
    description:
      "Explore data modelling, statistics, predictive analytics and Python-driven data science.",
    roles: [
      "Junior Data Scientist",
      "Python Data Associate",
      "Statistical Analyst",
      "Data Science Associate",
      "Predictive Analytics Associate",
      "ML Data Analyst",
      "Research Data Analyst",
      "Data Modelling Associate",
      "Analytics Engineer Trainee",
      "Junior BI Scientist",
    ],
    skills: [
      "Data Science",
      "Python",
      "Statistics",
      "Data Wrangling",
      "Predictive Analytics",
      "Machine Learning",
      "Research Analytics",
      "Data Modelling",
      "Analytics Engineering",
      "Business Intelligence",
    ],
    images: studentImages.science,
  },

  {
    id: "uiux",
    name: "UI/UX Design",
    folder: "UI-UX-Design",
    description:
      "Explore digital product design, user research, wireframing, interaction design and prototyping.",
    roles: [
      "Junior UI Designer",
      "UX Research Assistant",
      "Product Design Associate",
      "Interaction Design Associate",
      "Visual UI Designer",
      "Wireframing Associate",
      "UX Design Associate",
      "Design Systems Associate",
      "Prototyping Designer",
      "User Experience Analyst",
    ],
    skills: [
      "UI Design",
      "UX Research",
      "Product Design",
      "Interaction Design",
      "Visual Design",
      "Wireframing",
      "UX Design",
      "Design Systems",
      "Prototyping",
      "User Experience",
    ],
    images: studentImages.uiux,
  },

  {
    id: "banking",
    name: "Banking & Investment Management",
    folder: "Banking-Investment-Management",
    description:
      "Explore banking operations, financial analysis, investment research and wealth management.",
    roles: [
      "Banking Operations Associate",
      "Junior Finance Analyst",
      "Investment Research Associate",
      "Client Services Associate",
      "Financial Data Analyst",
      "Wealth Management Associate",
      "Credit Operations Analyst",
      "Investment Support Associate",
      "Risk Operations Associate",
      "Junior Portfolio Analyst",
    ],
    skills: [
      "Banking",
      "Financial Analysis",
      "Investment Research",
      "Client Services",
      "Financial Data",
      "Wealth Management",
      "Credit Analysis",
      "Investment Support",
      "Risk Management",
      "Portfolio Analysis",
    ],
    images: studentImages.banking,
  },

  {
    id: "entrepreneur",
    name: "Entrepreneurship",
    folder: "Entrepreneurship",
    description:
      "Explore entrepreneurship, startup operations, business strategy, growth and innovation.",
    roles: [
      "Startup Operations Associate",
      "Business Development Associate",
      "Market Research Associate",
      "Growth Marketing Associate",
      "Founders Office Associate",
      "Business Strategy Associate",
      "Operations Coordinator",
      "Partnerships Associate",
      "Venture Research Associate",
      "Product Operations Associate",
    ],
    skills: [
      "Startup Operations",
      "Business Development",
      "Market Research",
      "Growth",
      "Business Strategy",
      "Strategic Planning",
      "Operations",
      "Partnerships",
      "Venture Research",
      "Product Operations",
    ],
    images: studentImages.entrepreneur,
  },
];

// ============================================================
// COURSE ICONS
// ============================================================

const categoryIcons = {
  data: BarChart3,
  marketing: Megaphone,
  ai: BrainCircuit,
  fullstack: Code2,
  cyber: ShieldCheck,
  cloud: Cloud,
  science: FlaskConical,
  uiux: Palette,
  banking: Landmark,
  entrepreneur: Rocket,
};

// ============================================================
// EXAMPLE COMPANY DATA
// ============================================================

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

  science: [
    "Accenture",
    "Infosys",
    "Wipro",
    "eClerx",
    "Tata Communications",
    "Jio",
    "NeoSOFT Technologies",
    "HDFC Bank",
    "Freecharge",
    "Justdial",
  ],

  uiux: [
    "BookMyShow",
    "Magicbricks",
    "Jio",
    "Justdial",
    "Viacom18",
    "Disney+ Hotstar",
    "Hindustan Times",
    "NeoSOFT Technologies",
    "Freecharge",
    "Kansai Nerolac Paints",
  ],

  banking: [
    "HDFC Bank",
    "Kotak Life Insurance",
    "ICICI Prudential Life Insurance",
    "IDBI Bank",
    "Bank of Baroda",
    "Union Bank of India",
    "eClerx",
    "Accenture",
    "Wipro",
    "Infosys",
  ],

  entrepreneur: [
    "Justdial",
    "Magicbricks",
    "BookMyShow",
    "Freecharge",
    "Jio",
    "Kansai Nerolac Paints",
    "Tata Communications",
    "Viacom18",
    "The Times of India",
    "Hindustan Times",
  ],
};

// ============================================================
// EXAMPLE SALARY DATA
// ============================================================

const salaries: Record<CategoryId, number[]> = {
  data: [3.2, 3.8, 4.1, 3.5, 4.0, 3.6, 3.9, 4.2, 3.4, 3.7],

  marketing: [3.0, 3.2, 2.8, 3.4, 3.1, 3.6, 3.0, 3.5, 3.3, 3.8],

  ai: [3.8, 4.2, 3.6, 4.0, 4.4, 3.9, 4.1, 4.5, 3.7, 4.6],

  fullstack: [3.4, 3.8, 3.2, 4.0, 3.6, 4.2, 3.9, 3.5, 4.1, 4.4],

  cyber: [3.2, 3.5, 3.8, 3.4, 3.6, 4.0, 3.7, 3.3, 4.1, 3.9],

  cloud: [3.6, 4.0, 3.8, 4.2, 3.5, 4.4, 3.9, 4.1, 4.5, 4.0],

  science: [3.6, 4.0, 3.7, 4.2, 3.9, 4.4, 3.8, 4.1, 4.3, 3.5],

  uiux: [3.0, 3.4, 3.2, 3.6, 3.1, 3.8, 3.3, 3.5, 3.7, 3.2],

  banking: [3.1, 3.6, 3.5, 3.2, 3.9, 3.7, 3.4, 4.0, 3.8, 4.2],

  entrepreneur: [3.0, 3.4, 3.1, 3.6, 3.3, 3.8, 3.2, 3.5, 3.7, 3.9],
};

// Maharashtra locations only.
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

// ============================================================
// GENERATE STUDENT CARDS FROM EXACT IMAGE FILENAMES
// ============================================================

function getStudentName(filename: string): string {
  return filename
    .replace(/^\d{3}-/, "")
    .replace(/\.webp$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const studentsByCategory = Object.fromEntries(
  categories.map((category) => [
    category.id,

    category.images.map((filename, index): Student => {
      const name = getStudentName(filename);

      return {
        id: `${category.id}-${index}`,
        name,
        role: category.roles[index],
        skill: category.skills[index],
        company: employers[category.id][index],
        salary: `₹${salaries[category.id][index].toFixed(1)} LPA`,
        location: locations[index],
        image: `/students/${category.folder}/${filename}`,
      };
    }),
  ]),
) as Record<CategoryId, Student[]>;

// ============================================================
// STUDENT CAROUSEL - EXISTING SLIDESHOW LOGIC
// ============================================================

function Carousel({ students }: { students: Student[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    track.scrollLeft = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let last = 0;
    let frame = 0;

    const tick = (time: number) => {
      if (last && !pausedRef.current && track) {
        track.scrollLeft += Math.min(time - last, 64) * 0.024;

        const midpoint = track.scrollWidth / 2;

        if (track.scrollLeft >= midpoint) {
          track.scrollLeft -= midpoint;
        }
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

    if (direction < 0 && track.scrollLeft < width) {
      track.scrollLeft += middle;
    }

    track.scrollBy({
      left: width * direction,
      behavior: "smooth",
    });
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
                alt={`Illustrative portrait for ${student.name}`}
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

// ============================================================
// MAIN PLACEMENTS PAGE
// ============================================================

export default function PlacementsPageContent() {
  const [selectedId, setSelectedId] = useState<CategoryId>("data");

  const selected =
    categories.find((category) => category.id === selectedId) ?? categories[0];

  const students = studentsByCategory[selectedId];

  return (
    <main
      data-placements-page
      className="bg-[#fcfaf8] pt-16 text-[#081a3a] lg:pt-20"
    >
      {/* HERO SECTION */}

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
              Discover career pathways across our ten professional programmes
              and see how industry-focused learning can open new possibilities.
            </p>
          </div>

          <div className="relative flex w-full items-center justify-center lg:pl-4">
            <PlacementHeroAnimation />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pt-14 pb-8 sm:px-8 lg:pt-16 lg:pb-10">
        {/* COURSE SELECTION */}

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
                  className={`flex min-h-[64px] items-center gap-3 rounded-lg border px-5 py-4 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c001d] ${
                    active
                      ? "border-[#7c001d] bg-[#7c001d] text-white"
                      : "border-slate-200 bg-white text-[#081a3a] hover:border-[#7c001d] hover:bg-[#fff7f9]"
                  }`}
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

        {/* SELECTED COURSE STUDENTS */}

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

        {/* MORE CAREER PROFILES */}

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
                    alt={`Illustrative portrait for ${student.name}`}
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

        {/* CLOSING STATEMENT */}

        <div className="mt-10 border-l-4 border-[#7c001d] pl-5">
          <p className="text-xl font-bold tracking-tight sm:text-2xl lg:text-[28px]">
            Empowering futures through industry-relevant learning.
          </p>
        </div>
      </div>

      {/* CALL TO ACTION */}

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
            Explore Programmes
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* STYLES */}

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
