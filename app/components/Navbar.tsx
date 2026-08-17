"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Admissions", href: "/admissions" },
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (
    !mounted ||
    pathname === "/services"
  ) {
    return null;
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.4rem] border border-[#8b0022]/15 bg-white/95 px-5 py-3 shadow-[0_18px_45px_rgba(30,10,18,0.10)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">

          <span className="text-xl font-black tracking-tight text-[#7c001d]">
            Prime Digital School
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative text-sm font-semibold transition",
                  active
                    ? "text-[#7c001d]"
                    : "text-slate-600 hover:text-[#7c001d]",
                ].join(" ")}
              >
                {item.label}

                {active && (
                  <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-[#7c001d]" />
                )}
              </Link>
            );
          })}
        </div>

        <Link
          href="/admissions"
          className="hidden rounded-xl bg-[#7c001d] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(124,0,29,0.20)] transition hover:bg-[#5f0016] lg:inline-flex"
        >
          Apply Now
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#7c001d]/15 text-[#7c001d] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-[1.4rem] border border-[#8b0022]/15 bg-white p-4 shadow-[0_18px_45px_rgba(30,10,18,0.12)] backdrop-blur-xl lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-bold transition",
                    active
                      ? "bg-[#7c001d] text-white"
                      : "text-slate-700 hover:bg-[#fff4f7] hover:text-[#7c001d]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-[#7c001d] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}