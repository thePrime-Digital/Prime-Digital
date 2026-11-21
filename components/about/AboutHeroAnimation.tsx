"use client";

import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    label: "Smart Learning",
    description: "Digital-first education",
    className: "pds-about-float-one",
    iconColor: "text-blue-600",
    iconBackground: "bg-blue-50",
  },
  {
    icon: GraduationCap,
    label: "Expert Mentorship",
    description: "Guidance that matters",
    className: "pds-about-float-two",
    iconColor: "text-purple-600",
    iconBackground: "bg-purple-50",
  },
  {
    icon: BriefcaseBusiness,
    label: "Career Opportunities",
    description: "Future-ready pathways",
    className: "pds-about-float-three",
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
  },
];

export default function AboutHeroAnimation() {
  return (
    <div
      aria-label="Prime Digital School learning ecosystem illustration"
      className="pds-about-animation relative mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center sm:h-[380px] lg:h-[400px]"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pds-about-glow absolute left-[10%] top-[16%] h-[230px] w-[230px] rounded-full bg-[#eebd6a]/10 blur-[65px]" />

        <div className="pds-about-glow-two absolute bottom-[8%] right-[3%] h-[260px] w-[260px] rounded-full bg-[#e55a86]/15 blur-[75px]" />

        <div className="pds-about-orbit absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-[400px] sm:w-[400px]" />

        <div className="absolute left-1/2 top-1/2 h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 sm:h-[300px] sm:w-[300px]" />

        <span className="pds-about-pulse absolute left-[16%] top-[28%] h-2 w-2 rounded-full bg-[#f3c56a]" />

        <span className="pds-about-pulse-two absolute right-[14%] top-[20%] h-2.5 w-2.5 rounded-full bg-[#f3c56a]" />

        <span className="pds-about-pulse absolute bottom-[19%] left-[20%] h-2 w-2 rounded-full bg-white/70" />

        <span className="pds-about-pulse-two absolute bottom-[15%] right-[18%] h-2 w-2 rounded-full bg-white/70" />
      </div>

      {/* Central platform card */}
      <div className="pds-about-core relative z-10 w-[220px] rounded-[24px] border border-white/30 bg-white/95 p-4 text-center shadow-[0_28px_85px_rgba(18,0,8,0.34)] backdrop-blur-xl sm:w-[245px] sm:p-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#790021] text-white shadow-[0_12px_25px_rgba(121,0,33,.2)] sm:h-16 sm:w-16">
          <GraduationCap size={30} strokeWidth={1.8} />
        </div>

        <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.19em] text-[#9a6d27]">
          Learning Ecosystem
        </p>

        <h3 className="mt-2 text-[19px] font-black leading-tight tracking-tight text-[#790021] sm:text-[23px]">
          Prime Digital
          <br />
          School
        </h3>

        <p className="mt-3 text-xs leading-5 text-slate-600">
          Empowering the next generation through education and technology.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 border-t border-slate-100 pt-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0d5] text-[#b37a16]">
            <Sparkles size={15} />
          </span>

          <span className="text-xs font-bold text-[#790021]">
            Learn • Grow • Succeed
          </span>
        </div>
      </div>

      {/* Smart Learning */}
      <div className="pds-about-float-one absolute left-0 top-[13%] z-20 w-[175px] rounded-2xl border border-white/80 bg-white p-3.5 shadow-[0_18px_42px_rgba(20,0,10,.2)] sm:left-[1%] sm:top-[15%] sm:w-[210px] sm:p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
            <BookOpen size={20} />
          </span>

          <div className="min-w-0">
            <p className="text-[12px] font-extrabold leading-4 text-slate-900 sm:text-sm">
              Smart Learning
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
              Digital-first education
            </p>
          </div>
        </div>
      </div>

      {/* Expert Mentorship */}
      <div className="pds-about-float-two absolute right-0 top-[18%] z-20 w-[175px] rounded-2xl border border-white/80 bg-white p-3.5 shadow-[0_18px_42px_rgba(20,0,10,.2)] sm:right-0 sm:top-[15%] sm:w-[210px] sm:p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 sm:h-10 sm:w-10">
            <Users size={20} />
          </span>

          <div className="min-w-0">
            <p className="text-[12px] font-extrabold leading-4 text-slate-900 sm:text-sm">
              Expert Mentorship
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
              Guidance that matters
            </p>
          </div>
        </div>
      </div>

      {/* Career Opportunities */}
      <div className="pds-about-float-three absolute bottom-[12%] left-[2%] z-20 w-[185px] rounded-2xl border border-white/80 bg-white p-3.5 shadow-[0_18px_42px_rgba(20,0,10,.2)] sm:bottom-[13%] sm:left-[5%] sm:w-[220px] sm:p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
            <BriefcaseBusiness size={20} />
          </span>

          <div className="min-w-0">
            <p className="text-[12px] font-extrabold leading-4 text-slate-900 sm:text-sm">
              Career Opportunities
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
              Future-ready pathways
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="pds-about-float-four absolute bottom-[14%] right-[1%] z-20 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-[0_16px_35px_rgba(20,0,10,.2)] sm:bottom-[18%] sm:right-[4%] sm:px-4 sm:py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf8ef] text-emerald-600">
          <TrendingUp size={19} />
        </span>

        <div>
          <p className="text-[11px] font-extrabold text-slate-900 sm:text-xs">
            Future Ready
          </p>

          <p className="text-[10px] text-slate-500">Skills for tomorrow</p>
        </div>

        <ArrowUpRight size={15} className="text-emerald-600" />
      </div>

      <style jsx>{`
        .pds-about-float-one {
          animation: aboutFloatOne 5.5s ease-in-out infinite;
        }

        .pds-about-float-two {
          animation: aboutFloatTwo 6.2s ease-in-out infinite;
        }

        .pds-about-float-three {
          animation: aboutFloatThree 5.8s ease-in-out infinite;
        }

        .pds-about-float-four {
          animation: aboutFloatFour 6.5s ease-in-out infinite;
        }

        .pds-about-core {
          animation: aboutCore 7s ease-in-out infinite;
        }

        .pds-about-orbit {
          animation: aboutOrbit 35s linear infinite;
        }

        .pds-about-pulse {
          animation: aboutPulse 2.8s ease-in-out infinite;
        }

        .pds-about-pulse-two {
          animation: aboutPulse 3.4s ease-in-out infinite;
        }

        .pds-about-glow {
          animation: aboutGlow 8s ease-in-out infinite;
        }

        .pds-about-glow-two {
          animation: aboutGlow 10s ease-in-out infinite reverse;
        }

        @keyframes aboutFloatOne {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-13px);
          }
        }

        @keyframes aboutFloatTwo {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
        }

        @keyframes aboutFloatThree {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes aboutFloatFour {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes aboutCore {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.015);
          }
        }

        @keyframes aboutOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes aboutPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes aboutGlow {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pds-about-animation *,
          .pds-about-animation *::before,
          .pds-about-animation *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

