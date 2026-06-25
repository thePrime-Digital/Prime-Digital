import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const socialLinks = [
  { label: "IG", href: "#", aria: "Instagram" },
  { label: "FB", href: "#", aria: "Facebook" },
  { label: "YT", href: "#", aria: "YouTube" },
  { label: "IN", href: "#", aria: "LinkedIn" },
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Admissions", href: "/admissions" },
  { label: "Careers", href: "/careers" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Login", href: "/login" },
  { label: "Apply Now", href: "/apply" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-[70px] max-[720px]:mt-10 relative overflow-hidden rounded-none bg-gradient-to-br from-[#1a0006] via-[#2d000b] to-[#3d0010] text-white shadow-[0_28px_70px_rgba(93,0,20,0.24)]">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.28) 1.2px, transparent 1.2px), linear-gradient(135deg, rgba(255,255,255,0.06), transparent 45%)`,
          backgroundSize: "18px 18px, 100% 100%",
          maskImage: "linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,238,210,0.95), rgba(255,255,255,0.55), rgba(255,255,255,0))",
          height: "4px",
          top: 0,
        }}
      />

      <div className="w-[min(1320px,calc(100%-96px))] max-[1180px]:w-[min(100%-48px,1320px)] max-[720px]:w-[min(100%-28px,1320px)] mx-auto relative z-[3] grid grid-cols-[1.15fr_0.42fr_0.42fr_1.1fr_0.7fr] max-[1180px]:grid-cols-2 max-[720px]:grid-cols-1 gap-[38px] max-[1180px]:gap-[34px] max-[720px]:gap-[30px] items-start pt-[48px] px-0 max-[1180px]:pt-[42px] max-[720px]:pt-[30px]">
        <div className="max-w-[390px] max-[1180px]:max-w-full max-[1180px]:col-span-2 max-[720px]:col-span-1">
          <div className="w-[min(360px,100%)] max-[1180px]:w-[330px] max-[720px]:w-full min-h-[250px] max-[1180px]:min-h-[220px] max-[720px]:min-h-[190px] p-4 flex items-center justify-center rounded-[22px] bg-[rgba(255,255,255,0.96)] border border-[rgba(255,255,255,0.75)] shadow-[0_22px_42px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <Image
              src="/pds-assets/pds-logo.jpeg"
              alt="Prime Digital School"
              width={360}
              height={120}
              className="w-full h-auto object-contain object-center block bg-transparent"
            />
          </div>

          <p className="mt-[26px] m-0 max-w-[390px] text-[16px] max-[720px]:text-[15px] leading-[1.55] text-[rgba(255,255,255,0.92)]">
            Empowering students with future-ready skills through innovation,
            creativity and digital education.
          </p>

          <div className="mt-7 flex items-center gap-3">
            {socialLinks.map(({ label, href, aria }) => (
              <a
                key={aria}
                href={href}
                aria-label={aria}
                className="w-[42px] h-[42px] inline-flex items-center justify-center rounded-full text-white text-[13px] font-black tracking-[0.04em] no-underline border border-[rgba(255,255,255,0.34)] bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] transition-all duration-250 hover:-translate-y-[3px] hover:bg-[rgba(255,255,255,0.18)] hover:border-[rgba(255,255,255,0.7)]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-[1180px]:col-span-1">
          <h4 className="m-0 mb-5 max-[720px]:mb-[15px] text-[18px] leading-none font-black text-white">Quick Links</h4>
          {quickLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="w-fit block m-0 mb-[13px] text-[rgba(255,255,255,0.9)] text-[15.5px] leading-[1.3] no-underline transition-all duration-250 hover:text-white hover:translate-x-[5px]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="max-[1180px]:col-span-1">
          <h4 className="m-0 mb-5 max-[720px]:mb-[15px] text-[18px] leading-none font-black text-white">Support</h4>
          {supportLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="w-fit block m-0 mb-[13px] text-[rgba(255,255,255,0.9)] text-[15.5px] leading-[1.3] no-underline transition-all duration-250 hover:text-white hover:translate-x-[5px]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="min-w-0 max-[1180px]:col-span-2 max-[720px]:col-span-1">
          <h4 className="m-0 mb-5 max-[720px]:mb-[15px] text-[18px] leading-none font-black text-white">Contact Us</h4>

          <div className="mb-4 grid grid-cols-[26px_1fr] gap-[14px] items-start text-[rgba(255,255,255,0.92)] text-[15.5px] leading-[1.55]">
            <MapPin size={18} className="mt-[3px] text-white stroke-[2.4]" />
            <span>Vashi, sector 17, Navi Mumbai</span>
          </div>

          <div className="mb-4 grid grid-cols-[26px_1fr] gap-[14px] items-start text-[rgba(255,255,255,0.92)] text-[15.5px] leading-[1.55]">
            <Phone size={18} className="mt-[3px] text-white stroke-[2.4]" />
            <span>+91 98765 43210</span>
          </div>

          <div className="mb-4 grid grid-cols-[26px_1fr] gap-[14px] items-start text-[rgba(255,255,255,0.92)] text-[15.5px] leading-[1.55]">
            <Mail size={18} className="mt-[3px] text-white stroke-[2.4]" />
            <span>info@primedigitalschool.com</span>
          </div>
        </div>

        <div className="w-full h-[250px] max-[1180px]:h-[280px] max-[720px]:h-[230px] min-w-0 overflow-hidden rounded-[24px] relative z-[3] bg-[rgba(255,255,255,0.92)] border border-[rgba(255,255,255,0.24)] shadow-[0_22px_48px_rgba(0,0,0,0.18)] max-[1180px]:col-span-2 max-[720px]:col-span-1">
          <iframe
            title="Prime Digital School Location"
            src="https://maps.google.com/maps?q=Sector%2017%2C%20Vashi%2C%20Navi%20Mumbai%2C%20Maharashtra%20400703&z=15&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full block border-0"
            style={{ filter: "grayscale(15%) contrast(1.05)" }}
          />
        </div>
      </div>

      <div className="relative z-[3] w-[min(1320px,calc(100%-96px))] max-[1180px]:w-[min(100%-48px,1320px)] max-[720px]:w-[min(100%-28px,1320px)] mx-auto mt-[46px] max-[720px]:mt-[30px] py-[22px] max-[720px]:py-5 flex items-center justify-between gap-6 max-[720px]:flex-col max-[720px]:items-start border-t border-[rgba(255,255,255,0.18)]">
        <p className="m-0 max-w-none text-[rgba(255,255,255,0.9)] text-[15px] max-[720px]:text-[13.5px] max-[720px]:whitespace-normal leading-[1.4]">
          &copy; 2026 Prime Digital School. All rights reserved.
        </p>

        <div className="flex items-center justify-end gap-7 max-[720px]:gap-4 max-[720px]:flex-wrap shrink-0">
          <Link href="/privacy" className="m-0 text-[rgba(255,255,255,0.9)] text-[15px] max-[720px]:text-[13.5px] leading-[1.4] no-underline whitespace-nowrap transition-colors duration-250 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="m-0 text-[rgba(255,255,255,0.9)] text-[15px] max-[720px]:text-[13.5px] leading-[1.4] no-underline whitespace-nowrap transition-colors duration-250 hover:text-white">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
