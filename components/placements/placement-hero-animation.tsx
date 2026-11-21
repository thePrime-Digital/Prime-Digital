"use client";

import { ArrowUpRight } from "lucide-react";

const markers = [
  { label: "Foundation", x: 116, y: 283, delay: "0.9s" },
  { label: "Expertise", x: 346, y: 221, delay: "1.9s" },
  { label: "Opportunity", x: 540, y: 140, delay: "2.9s" },
];

export default function PlacementHeroAnimation() {
  return (
    <div
      className="career-visual relative mx-auto w-full max-w-[690px] overflow-hidden py-4 sm:py-6"
      role="img"
      aria-label="Animated career growth curve: Foundation, Expertise, Opportunity"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_75%,rgba(124,0,29,0.055),transparent_65%)]" />
      <svg
        viewBox="0 0 680 390"
        className="relative block h-auto w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="career-grid"
            width="76"
            height="70"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M76 0H0V70"
              fill="none"
              stroke="#081a3a"
              strokeOpacity=".055"
            />
          </pattern>
          <linearGradient id="career-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c001d" stopOpacity=".10" />
            <stop offset="100%" stopColor="#7c001d" stopOpacity="0" />
          </linearGradient>
          <filter
            id="career-shadow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="8"
              floodColor="#7c001d"
              floodOpacity=".12"
            />
          </filter>
        </defs>
        <rect x="37" y="22" width="610" height="315" fill="url(#career-grid)" />
        <path
          d="M36 303C167 285 262 265 346 221S502 166 540 140S606 74 629 45V338H36Z"
          fill="url(#career-wash)"
        />
        <path
          d="M36 303C167 285 262 265 346 221S502 166 540 140S606 74 629 45"
          fill="none"
          stroke="#7c001d"
          strokeOpacity=".12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          className="career-line"
          d="M36 303C167 285 262 265 346 221S502 166 540 140S606 74 629 45"
          fill="none"
          stroke="#7c001d"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1000"
        />
        {markers.map((marker) => (
          <g
            key={marker.label}
            className="career-marker"
            style={{ animationDelay: marker.delay }}
          >
            <line
              x1={marker.x}
              x2={marker.x}
              y1={marker.y + 8}
              y2="337"
              stroke="#7c001d"
              strokeOpacity=".16"
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r="6.5"
              fill="#fcfaf8"
              stroke="#7c001d"
              strokeWidth="2.5"
            />
            <text
              x={marker.x}
              y="365"
              textAnchor="middle"
              fill="#586171"
              fontSize="17"
              fontWeight="500"
            >
              {marker.label}
            </text>
          </g>
        ))}
        <g className="career-arrow" filter="url(#career-shadow)">
          <circle cx="629" cy="45" r="29" fill="#fff9ee" />
          <path
            d="M618 55L639 34M625 34H639V48"
            fill="none"
            stroke="#7c001d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <p className="career-caption relative mt-1 flex items-center justify-end gap-2 pr-3 text-right text-xs italic tracking-wide text-[#aaa0a5] sm:text-sm">
        Building tomorrow&apos;s professionals
        <ArrowUpRight
          size={15}
          className="text-[#7c001d]/60"
          aria-hidden="true"
        />
      </p>
      <style jsx>{`
        .career-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 6s ease-in-out infinite;
        }
        .career-marker {
          opacity: 0;
          animation: reveal 6s ease-out infinite;
        }
        .career-arrow {
          transform-box: fill-box;
          transform-origin: center;
          animation: arrow-pulse 6s ease-in-out infinite;
        }
        .career-caption {
          animation: caption 6s ease-in-out infinite;
        }
        @keyframes draw {
          0%,
          5% {
            stroke-dashoffset: 1000;
          }
          69%,
          88% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 1000;
          }
        }
        @keyframes reveal {
          0%,
          9% {
            opacity: 0;
            transform: translateY(5px);
          }
          16%,
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          95%,
          100% {
            opacity: 0;
          }
        }
        @keyframes arrow-pulse {
          0%,
          60% {
            opacity: 0.65;
            transform: scale(0.96);
          }
          70%,
          85% {
            opacity: 1;
            transform: scale(1.07);
          }
          100% {
            opacity: 0.65;
            transform: scale(0.96);
          }
        }
        @keyframes caption {
          0%,
          35% {
            opacity: 0.5;
          }
          65%,
          88% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .career-line {
            animation: none;
            stroke-dashoffset: 0;
          }
          .career-marker,
          .career-arrow,
          .career-caption {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
