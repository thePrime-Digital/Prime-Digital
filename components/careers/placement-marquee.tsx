"use client";

import Image from "next/image";
import Link from "next/link";

type PlacementCard = {
  id: number;
  name: string;
  role: string;
  company: string;
  package: string;
  location: string;
  batch: string;
  image: string;
};

const placements: PlacementCard[] = [
  {
    id: 1,
    name: "Aditya Agarwal",
    role: "Data Analyst",
    company: "Tata Consultancy Services",
    package: "₹4.5 LPA",
    location: "Mumbai",
    batch: "2024",
    image: "/students/aditya-agarwal.webp",
  },
  {
    id: 2,
    name: "Aditya Verma",
    role: "Business Intelligence Analyst",
    company: "Infosys",
    package: "₹6.0 LPA",
    location: "Pune",
    batch: "2024",
    image: "/students/aditya-verma.webp",
  },
  {
    id: 3,
    name: "Akash",
    role: "Power BI Developer",
    company: "Deloitte",
    package: "₹5.2 LPA",
    location: "Hyderabad",
    batch: "2025",
    image: "/students/akash.webp",
  },
  {
    id: 4,
    name: "Akshay Patil",
    role: "Reporting Analyst",
    company: "Accenture",
    package: "₹4.8 LPA",
    location: "Navi Mumbai",
    batch: "2025",
    image: "/students/akshay-patil.webp",
  },
  {
    id: 5,
    name: "Alok Singh",
    role: "Analytics Associate",
    company: "Capgemini",
    package: "₹5.5 LPA",
    location: "Bengaluru",
    batch: "2025",
    image: "/students/alok-singh.webp",
  },
  {
    id: 6,
    name: "Aman",
    role: "Junior Data Analyst",
    company: "Genpact",
    package: "₹3.8 LPA",
    location: "Delhi NCR",
    batch: "2026",
    image: "/students/aman.webp",
  },
  {
    id: 7,
    name: "Ananya Joshi",
    role: "MIS Analyst",
    company: "Tech Mahindra",
    package: "₹4.6 LPA",
    location: "Mumbai",
    batch: "2026",
    image: "/students/ananya-joshi.webp",
  },
  {
    id: 8,
    name: "Arpit Gupta",
    role: "Data Operations Associate",
    company: "Wipro",
    package: "₹4.9 LPA",
    location: "Pune",
    batch: "2026",
    image: "/students/arpit-gupta.webp",
  },
  {
    id: 9,
    name: "Darshit",
    role: "Data Analyst",
    company: "Cognizant",
    package: "₹5.4 LPA",
    location: "Mumbai",
    batch: "2026",
    image: "/students/darshit.webp",
  },
  {
    id: 10,
    name: "Harshita More",
    role: "Business Analyst",
    company: "LTIMindtree",
    package: "₹5.1 LPA",
    location: "Mumbai",
    batch: "2024",
    image: "/students/harshita-more.webp",
  },
  {
    id: 11,
    name: "Kanade",
    role: "SQL Data Analyst",
    company: "Persistent Systems",
    package: "₹4.7 LPA",
    location: "Pune",
    batch: "2024",
    image: "/students/kanade.webp",
  },
  {
    id: 12,
    name: "Karan Deshmukh",
    role: "Power BI Analyst",
    company: "HCLTech",
    package: "₹5.6 LPA",
    location: "Noida",
    batch: "2025",
    image: "/students/karan-deshmukh.webp",
  },
  {
    id: 13,
    name: "Neha Singh",
    role: "Data Analytics Associate",
    company: "IBM",
    package: "₹6.2 LPA",
    location: "Bengaluru",
    batch: "2025",
    image: "/students/neha-singh.webp",
  },
  {
    id: 14,
    name: "Omkar Paturkar",
    role: "MIS Executive",
    company: "WNS Global Services",
    package: "₹4.2 LPA",
    location: "Mumbai",
    batch: "2025",
    image: "/students/omkar-paturkar.webp",
  },
  {
    id: 15,
    name: "Priyanka",
    role: "Reporting & Insights Analyst",
    company: "EY",
    package: "₹5.8 LPA",
    location: "Hyderabad",
    batch: "2025",
    image: "/students/priyanka.webp",
  },
  {
    id: 16,
    name: "Ranjeet",
    role: "Operations Data Analyst",
    company: "EXL",
    package: "₹4.6 LPA",
    location: "Gurugram",
    batch: "2026",
    image: "/students/ranjeet.webp",
  },
  {
    id: 17,
    name: "Ritamvara",
    role: "Business Intelligence Developer",
    company: "KPMG",
    package: "₹6.4 LPA",
    location: "Bengaluru",
    batch: "2026",
    image: "/students/ritamvara.webp",
  },
  {
    id: 18,
    name: "Vaibhava",
    role: "Junior Business Analyst",
    company: "Infosys",
    package: "₹4.8 LPA",
    location: "Pune",
    batch: "2026",
    image: "/students/vaibhava.webp",
  },
];

const marqueeItems = [...placements, ...placements];

function PlacementCardItem({ item }: { item: PlacementCard }) {
  return (
    <article className="group flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[#7c001d]/10 bg-white shadow-[0_18px_50px_rgba(30,10,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(124,0,29,0.14)] sm:w-[320px]">
      <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#f8f4f6]">
        <Image
          src={item.image}
          alt={`Sample student profile: ${item.name}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 80vw, 320px"
        />

        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c001d] backdrop-blur">
          Data Analytics
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-[#7c001d] px-3 py-1 text-xs font-bold text-white shadow-md">
          {item.batch}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e0a12]/85 via-[#1e0a12]/35 to-transparent px-5 pb-5 pt-16 text-white">
          <p className="text-xl font-black leading-tight">{item.name}</p>
          <p className="mt-1 text-sm font-medium text-white/85">{item.role}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Placed at
            </span>
            <span className="rounded-full bg-[#fff2f6] px-3 py-1 text-[11px] font-bold text-[#7c001d]">
              {item.location}
            </span>
          </div>

          <h3 className="text-lg font-black text-[#22141a]">{item.company}</h3>
        </div>

        <div className="mt-auto rounded-[22px] border border-[#7c001d]/10 bg-[#fff8fa] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c001d]">
            Package
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-black leading-none text-[#7c001d]">
              {item.package}
            </p>
            <span className="text-xs font-semibold text-slate-500">
              Annual CTC
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PlacementMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#fcfaf8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#fff2f6] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#7c001d]">
              Student Career Outcomes
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-[#081a3a] sm:text-5xl">
              From Data Analytics Skills to Real Placement Opportunities
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Our learners build practical analytics skills and move into real
              job roles across reporting, business intelligence, MIS and data
              analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#fcfaf8] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#fcfaf8] to-transparent sm:w-24" />

        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeItems.map((item, index) => (
              <PlacementCardItem key={`${item.id}-${index}`} item={item} />
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
