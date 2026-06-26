import React from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Code,
  Laptop,
  Smartphone,
  Gamepad2,
  BrainCircuit,
  Database,
  Network,
  MessageSquare,
  Megaphone,
  Share2,
  LineChart,
  PenTool,
  Palette,
  Box,
  Video,
  Briefcase,
  Lightbulb,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Shield,
  Home,
  CheckCircle2,
  ChevronDown,
  Globe,
} from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="min-h-screen font-sans bg-white text-[#1C1B1B] overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center pt-20 pb-20 px-6 md:px-20 bg-[#F6F3F2]">
        <div className="max-w-4xl flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-[48px] leading-[1.1] font-bold text-[#1A1A1A] text-center tracking-tight">
            Launch Your Digital Career With Industry-Led Programs
          </h1>
          <p className="text-lg leading-[1.6] text-[#5D5F5F] text-center max-w-2xl">
            Master the skills of tomorrow, today. From AI to UI/UX Design, get hands-on experience and build a portfolio
            that stands out.
          </p>

          <div className="relative mt-6 w-full max-w-[576px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5C021A]" />
            <input
              type="text"
              placeholder="Search for programs (e.g., Python, UI Design...)"
              className="w-full h-[57px] pl-14 pr-6 rounded-full border border-[#DCC0C1] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C021A] text-[#6B7280]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button className="px-6 py-2 rounded-full bg-[#5C021A] text-white text-sm font-medium tracking-wide">
              All Programs
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              Web Dev
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              UI/UX Design
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              Data Science
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              AI/ML
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              Marketing
            </button>
            <button className="px-6 py-2 rounded-full bg-white border border-[#5C021A] text-[#5C021A] text-sm font-medium tracking-wide">
              Cybersecurity
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#7B1C2E] py-12 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">10k+</h3>
            <p className="text-[#FF8A96] text-base mt-1">Active Students</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">95%</h3>
            <p className="text-[#FF8A96] text-base mt-1">Placement Rate</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">50+</h3>
            <p className="text-[#FF8A96] text-base mt-1">Expert Instructors</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">120+</h3>
            <p className="text-[#FF8A96] text-base mt-1">Global Partners</p>
          </div>
        </div>
      </section>

      {/* Featured Programs Grid */}
      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[32px] font-semibold text-[#1A1A1A] leading-tight">Featured Programs</h2>
            <a href="#" className="text-base font-bold text-[#5C021A] hidden sm:block">
              View All Programs &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {programs.map((prog, i) => (
              <div
                key={i}
                className="bg-white border border-[#DCC0C1] rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="h-[192px] w-full bg-gradient-to-br from-[#5C021A]/10 to-[#5C021A]/20 relative flex items-center justify-center">
                  <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#EAB308] fill-[#EAB308]" />
                    <span className="text-sm font-bold text-[#1C1B1B]">4.9</span>
                  </div>
                  {prog.icon}
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-[24px] font-semibold text-[#1C1B1B] leading-[1.4] mb-2">{prog.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#5D5F5F] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> {prog.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> {prog.duration}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prog.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#5C021A]/5 rounded-full text-xs font-semibold text-[#5C021A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-base text-[#5D5F5F] leading-[1.6] mb-6 line-clamp-2">{prog.desc}</p>
                  <button className="w-full py-3 border border-[#5C021A] rounded-lg text-base font-bold text-[#5C021A] hover:bg-[#5C021A] hover:text-white transition-colors mt-auto">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-16">Explore Structured Learning Paths</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Tech Column */}
            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <Code className="text-white w-5 h-5" />
                <span className="text-white text-base font-medium">Software Engineering</span>
              </div>
              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0"></div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">HTML & CSS</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">JavaScript Base</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">React & Next.js</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Backend APIs</span>
                </div>
              </div>
            </div>

            {/* Design Column */}
            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <PenTool className="text-white w-5 h-5" />
                <span className="text-white text-base font-medium">Product Design</span>
              </div>
              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0"></div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">UI Fundamentals</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">UX Research</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Wireframing</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Prototyping</span>
                </div>
              </div>
            </div>

            {/* Entrepreneur Column */}
            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-[340px] bg-[#5C021A] rounded-xl py-4 px-6 flex justify-center items-center gap-2 mb-12 shadow-md">
                <Lightbulb className="text-white w-5 h-5" />
                <span className="text-white text-base font-medium">Tech Entrepreneurship</span>
              </div>
              <div className="flex flex-col gap-12 relative w-[200px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B1C2E] to-transparent z-0"></div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Ideation Phase</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Market Analysis</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">MVP Building</span>
                </div>
                <div className="bg-white border-2 border-[#5C021A] rounded-full py-3 px-6 shadow-sm z-10 text-center">
                  <span className="font-bold text-[#1C1B1B]">Pitching</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] mb-12">Browse by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4">
              <Code className="text-[#5C021A] w-8 h-8" />
              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">Coding</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Python Basics</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Web Development</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Mobile Apps</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Game Design</li>
              </ul>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4">
              <Database className="text-[#5C021A] w-8 h-8" />
              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">AI & Data</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Machine Learning</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Data Science</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Neural Networks</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Prompt Engineering</li>
              </ul>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4">
              <Megaphone className="text-[#5C021A] w-8 h-8" />
              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">Marketing</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Social Media</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">SEO Basics</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Ad Campaigns</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Copywriting</li>
              </ul>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-8 flex flex-col gap-4">
              <Palette className="text-[#5C021A] w-8 h-8" />
              <h4 className="text-lg font-medium text-[#1C1B1B] mt-2">Design</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Graphic Design</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">3D Modeling</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">UI/UX Design</li>
                <li className="text-sm text-[#5D5F5F] hover:text-[#5C021A] cursor-pointer">Motion Graphics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center">Projects Showcase</h2>
            <p className="text-base text-[#5D5F5F] text-center max-w-2xl mt-2">
              Get inspired by real-world applications and projects built by our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Smartphone className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Smart Home Hub</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Control lights and temperature via a mobile app built with React Native.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Network className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Community Website</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Develop a localized marketplace platform using HTML/CSS and JavaScript.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <MessageSquare className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">AI Chatbot</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Train a custom AI model to handle school administrative queries.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Box className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">NFT Marketplace</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Create a simple platform for trading digital student artwork safely.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <Shield className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Vulnerability Scanner</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Build a tool to identify basic security risks in local networks.
              </p>
            </div>

            <div className="bg-[#F0EDED] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform">
              <LineChart className="text-[#5C021A] w-6 h-6 mb-4" />
              <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Stock Market Sim</h4>
              <p className="text-sm text-[#5D5F5F] leading-[1.4]">
                Design a dashboard to visualize financial trends and portfolio growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <h2 className="text-[32px] font-semibold text-[#1C1B1B] leading-tight">Get Certified for Your Skills</h2>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">Industry-Recognized</h4>
                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Our certificates are recognized by top tech companies globally, adding immediate value to your resume.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">Portfolio Verified</h4>
                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Every certification mandates a completed capstone project, proving you have practical experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="text-[#5C021A] w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-[#1C1B1B] mb-1">Blockchain Secured</h4>
                  <p className="text-base text-[#5D5F5F] leading-[1.5]">
                    Instantly verify your credentials online with our secure digital credentialing network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative flex justify-center py-10">
            <div className="absolute inset-0 bg-[#5C021A]/5 rounded-xl -rotate-2 transform scale-95"></div>
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-10 w-full max-w-[500px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rotate-2 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#5C021A]">Prime Digital School</h2>
                <span className="text-sm text-[#5D5F5F]">ID: PDS-2026-X98</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl text-[#1C1B1B] mb-2">Certificate of Completion</h3>
                <p className="text-base text-[#5D5F5F] italic mb-4">This acknowledges that</p>
                <div className="border-b border-[#5C021A]/20 pb-2 mb-6">
                  <span className="text-3xl text-[#1C1B1B] font-serif">Ankit Mali</span>
                </div>
                <p className="text-base text-[#1C1B1B] mb-2">has successfully completed the</p>
                <p className="text-base font-bold text-[#1C1B1B]">AI & Machine Learning Explorer Program</p>
              </div>
              <div className="border-t border-[#5C021A]/10 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-[#1C1B1B] mb-1">June 26, 2026</p>
                  <p className="text-sm text-[#5D5F5F]">Date of Issue</p>
                </div>
                <div className="opacity-30">
                  <AwardIcon className="w-12 h-12 text-[#5C021A]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where skills take you */}
      <section className="bg-[#F6F3F2] py-16 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-12">Where These Skills Take You</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-[#5C021A]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Tech Startups & Agencies</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Frontend</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">UI/UX</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Agile</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <LineChart className="w-6 h-6 text-[#5C021A]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Finance & Analytics</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Python</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Data Viz</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">SQL</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <MonitorPlay className="w-6 h-6 text-[#5C021A]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Media & Entertainment</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Animation</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">3D Mod</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5C021A]/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#5C021A]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1B] mb-2">Corporate IT & Security</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Networks</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">PenTest</span>
                  <span className="px-2 py-1 bg-[#5C021A]/5 rounded text-xs text-[#5C021A]">Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FCF9F8] py-16 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-12">Frequently Asked Questions</h2>
          <div className="w-full flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="w-full border border-[#DCC0C1] rounded-xl hover:bg-[#F6F3F2] cursor-pointer transition-colors"
              >
                <div className="w-full px-5 py-5 flex justify-between items-center">
                  <span className="text-base font-bold text-[#1C1B1B]">{faq}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#5C021A] flex items-center justify-center shrink-0">
                    <ChevronDown className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#5C021A] py-24 px-6 md:px-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-[800px] flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
            Ready to shape the future?
          </h2>
          <p className="text-lg text-white/90 leading-[1.6]">
            Join over 10,000+ students globally and kickstart your journey into tech, design, and business.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <button className="px-10 py-4 bg-white text-[#5C021A] text-base font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Enroll Now
            </button>
            <button className="px-10 py-4 bg-[#7B1C2E] text-white border border-white/20 text-base font-bold rounded-xl hover:bg-[#8A2134] transition-colors">
              View Syllabus
            </button>
            <button className="px-10 py-4 border border-white/40 text-white text-base font-bold rounded-xl hover:bg-white/10 transition-colors">
              Talk to Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

// Data

const programs = [
  {
    title: "AI & Robotics Explorer",
    level: "Beginner",
    duration: "12 Weeks",
    tags: ["Python", "TensorFlow"],
    desc: "Dive into the fundamentals of artificial intelligence and build your first functioning robotic simulation.",
    icon: <BrainCircuit className="w-14 h-14 text-[#5C021A]/20" />,
  },
  {
    title: "Web Development Pro",
    level: "Intermediate",
    duration: "16 Weeks",
    tags: ["React", "Node.js"],
    desc: "Master modern full-stack web development. Build scalable applications and responsive interfaces from scratch.",
    icon: <Laptop className="w-14 h-14 text-[#5C021A]/20" />,
  },
  {
    title: "UX/UI Design Mastery",
    level: "All Levels",
    duration: "10 Weeks",
    tags: ["Figma", "Research"],
    desc: "Learn to design intuitive digital products. From wireframing to high-fidelity interactive prototypes.",
    icon: <PenTool className="w-14 h-14 text-[#5C021A]/20" />,
  },
  {
    title: "Teen Entrepreneurship",
    level: "Beginner",
    duration: "8 Weeks",
    tags: ["Business", "Pitching"],
    desc: "Turn your ideas into reality. Learn the basics of lean startup methodology, marketing, and pitching to investors.",
    icon: <Briefcase className="w-14 h-14 text-[#5C021A]/20" />,
  },
  {
    title: "Cyber Defense Junior",
    level: "Intermediate",
    duration: "14 Weeks",
    tags: ["Networks", "Ethical Hacking"],
    desc: "Protect digital infrastructure. Understand network vulnerabilities and how to defend against modern cyber threats.",
    icon: <Shield className="w-14 h-14 text-[#5C021A]/20" />,
  },
  {
    title: "Digital Content Creation",
    level: "Beginner",
    duration: "8 Weeks",
    tags: ["Video", "SEO"],
    desc: "Create compelling digital content. Master video editing, social media strategy, and basic SEO principles.",
    icon: <Video className="w-14 h-14 text-[#5C021A]/20" />,
  },
];

const faqs = [
  "Do I need prior coding experience to join?",
  "What hardware or software requirements are there?",
  "Is job placement guaranteed after graduation?",
  "Can I switch my learning path mid-program?",
  "Are there any scholarship opportunities available?",
];

// Custom SVG icons

function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function MonitorPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
      <polygon points="10 8 15 10 10 12 10 8" />
    </svg>
  );
}
