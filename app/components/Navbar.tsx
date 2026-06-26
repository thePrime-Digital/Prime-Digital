"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  hideAt?: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/careers", label: "Careers" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

const linkBaseClass =
  "text-sm max-[1180px]:text-[12px] max-[900px]:text-[11px] font-bold no-underline transition-all duration-300 ease-in-out relative";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full absolute top-0 z-50 bg-transparent">
      <div className="max-w-full mx-auto flex items-center justify-end gap-5 py-2 px-6">
        <div className="flex items-center w-2/3  justify-end gap-5 backdrop-blur-sm rounded-xl max-[1180px]:gap-3 max-[720px]:hidden">
          <nav className="flex items-center gap-7 max-[1180px]:gap-4 max-[900px]:gap-2" aria-label="Main Navigation">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${linkBaseClass} ${isActive ? "text-[var(--gold)]" : "text-black hover:text-[var(--gold)]"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link href="/signup" className="min-h-[46px] max-[1180px]:min-h-[38px] max-[900px]:min-h-[32px] inline-flex items-center justify-center gap-2 px-[22px] max-[1180px]:px-[16px] max-[900px]:px-[12px] rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white text-sm max-[1180px]:text-[12px] max-[900px]:text-[11px] font-extrabold no-underline shadow-[0_12px_24px_rgba(122,0,25,0.22)] hover:-translate-y-1 transition-all duration-300 ease-in-out">
            Apply Now <ArrowRight size={18} />
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden max-[720px]:flex items-center justify-center w-[40px] h-[40px] rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[0_12px_24px_rgba(122,0,25,0.22)]"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="hidden max-[720px]:block absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200">
          <nav className="flex flex-col gap-0" aria-label="Mobile Navigation">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-4 text-sm font-bold no-underline border-b border-gray-100 transition-all ${isActive ? "text-[var(--gold)] bg-gray-50" : "text-[#18181b] hover:text-[var(--primary)] hover:bg-gray-50"}`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="px-6 py-4 text-sm font-bold text-white no-underline bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:opacity-90 transition-all text-center"
            >
              Apply Now <ArrowRight size={16} className="inline" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
