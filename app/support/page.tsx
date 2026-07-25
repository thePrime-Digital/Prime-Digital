"use client";

import React, { useState } from "react";
import {
  Search,
  Code,
  CreditCard,
  Monitor,
  BookOpen,
  Award,
  Users,
  Phone,
  MessageCircle,
  Send,
  Mail,
  Paperclip,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  PlayCircle,
  LifeBuoy,
  Clock,
  Smartphone,
} from "lucide-react";

const faqData = [
  { category: "Admissions", question: "What is the last date for 2024 admissions?", answer: "The final deadline for 2024 Fall admissions is August 15th, 2024. Late applications may be considered on a case-by-case basis." },
  { category: "Fees", question: "Can I pay the tuition fees in installments?", answer: "Yes, we offer flexible payment plans allowing you to pay tuition over 3, 6, or 9 monthly installments." },
  { category: "Technical", question: "Which browsers are supported for live classes?", answer: "We highly recommend using the latest versions of Google Chrome, Mozilla Firefox, or Safari for the best live class experience." },
  { category: "Certificates", question: "When will I receive my course completion certificate?", answer: "Certificates are automatically generated and available for download in your Student Portal within 48 hours of completing all course requirements." },
  { category: "Admissions", question: "Are there any scholarships for international students?", answer: "Yes, we offer a global diversity scholarship covering up to 30% of tuition. Check the Admissions page for the application form." },
  { category: "Technical", question: "Is there a mobile app for the portal?", answer: "Yes! The Prime Digital School app is available on both the Apple App Store and Google Play Store." },
];

export default function SupportPage() {
  const [activeFaqTab, setActiveFaqTab] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = activeFaqTab === "All" || faq.category === activeFaqTab;
    const matchesSearch = searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen font-sans bg-white text-[#1C1B1B] overflow-x-hidden">
      {/* Hero Search Section */}
      <section className="flex flex-col items-center pt-32 pb-20 px-6 md:px-20 bg-[#F6F3F2]">
        <div className="max-w-3xl flex flex-col items-center gap-6 w-full">
          <div className="w-16 h-16 bg-[#5C021A]/10 rounded-full flex items-center justify-center mb-2">
            <LifeBuoy className="w-8 h-8 text-[#5C021A]" />
          </div>
          <h1 className="text-4xl md:text-[48px] leading-[1.1] font-bold text-[#1A1A1A] text-center tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-lg leading-[1.6] text-[#5D5F5F] text-center max-w-2xl">
            Find quick answers to common questions, search our knowledge base, or connect with our dedicated support team for personalized assistance.
          </p>

          <div className="relative mt-6 w-full max-w-[640px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C021A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full h-[64px] pl-14 pr-32 rounded-full border border-[#DCC0C1] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C021A] text-[#1C1B1B] text-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#5C021A] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#7B1C2E] transition-colors">
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <span className="text-sm font-bold text-[#1C1B1B] mr-2">POPULAR:</span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#DCC0C1] text-[#5D5F5F] hover:border-[#5C021A] hover:text-[#5C021A] text-sm font-medium cursor-pointer transition-colors"
              onClick={() => { setSearchQuery(""); setActiveFaqTab("Admissions"); }}
            >Admissions</span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#DCC0C1] text-[#5D5F5F] hover:border-[#5C021A] hover:text-[#5C021A] text-sm font-medium cursor-pointer transition-colors"
              onClick={() => { setSearchQuery(""); setActiveFaqTab("Fees"); }}
            >Fees & Payment</span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#DCC0C1] text-[#5D5F5F] hover:border-[#5C021A] hover:text-[#5C021A] text-sm font-medium cursor-pointer transition-colors"
              onClick={() => { setSearchQuery(""); setActiveFaqTab("Technical"); }}
            >Course Access</span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#DCC0C1] text-[#5D5F5F] hover:border-[#5C021A] hover:text-[#5C021A] text-sm font-medium cursor-pointer transition-colors"
              onClick={() => { setSearchQuery(""); setActiveFaqTab("Certificates"); }}
            >Certificates</span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#DCC0C1] text-[#5D5F5F] hover:border-[#5C021A] hover:text-[#5C021A] text-sm font-medium cursor-pointer transition-colors"
              onClick={() => { setSearchQuery(""); setActiveFaqTab("Technical"); }}
            >Technical Issues</span>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="bg-white py-20 px-6 md:px-20 border-b border-[#DCC0C1]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <BookOpen className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Admissions</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">Information on enrollment process, documents needed, and eligibility criteria.</p>
          </div>

          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <CreditCard className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Fees & Payments</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">Pay fees online, check scholarship status, and billing history details.</p>
          </div>

          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <Monitor className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Technical Support</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">Help with app installation, login issues, and browser compatibility.</p>
          </div>

          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <Code className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Course Management</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">How to access lectures, submit assignments, and view course materials.</p>
          </div>

          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <Award className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Certificates</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">Download course completion certificates and academic transcripts.</p>
          </div>

          <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
            <Users className="text-[#5C021A] w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-[#1C1B1B] mb-3 group-hover:text-[#5C021A] transition-colors">Parents Portal</h3>
            <p className="text-base text-[#5D5F5F] leading-[1.6]">Track student progress, attendance reports, and teacher communications.</p>
          </div>
        </div>
      </section>

      {/* Contact Split Layout */}
      <section className="bg-[#F6F3F2] py-20 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Support Form */}
          <div className="lg:col-span-3 bg-white border border-[#DCC0C1] rounded-2xl p-8 md:p-10 shadow-sm">
            <h2 className="text-[28px] font-bold text-[#1C1B1B] mb-2">Submit a Support Request</h2>
            <p className="text-base text-[#5D5F5F] mb-8">Fill out the form below and our team will get back to you shortly.</p>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Full Name *</label>
                  <input type="text" className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white" placeholder="John Doe" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Email Address *</label>
                  <input type="email" className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Phone Number</label>
                  <input type="tel" className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Student Grade</label>
                  <select className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white text-[#1C1B1B]">
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Category *</label>
                  <select className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white text-[#1C1B1B]" required>
                    <option>Technical Issue</option>
                    <option>Billing & Fees</option>
                    <option>Admissions</option>
                    <option>Course Content</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1C1B1B]">Subject *</label>
                  <input type="text" className="h-12 px-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white" placeholder="Brief description of the issue" required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1C1B1B]">Message *</label>
                <textarea className="h-32 p-4 rounded-lg border border-[#DCC0C1] focus:outline-none focus:ring-2 focus:ring-[#5C021A] bg-white resize-none" placeholder="Provide detailed information about your inquiry..." required></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1C1B1B]">Attachment (Max 5MB)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center bg-[#F0EDED] hover:bg-[#E5E2E1] border border-[#DCC0C1] text-[#1C1B1B] text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Choose File
                    <input type="file" className="hidden" />
                  </label>
                  <span className="text-sm text-[#5D5F5F]">No file chosen</span>
                </div>
              </div>

              <button type="submit" className="mt-2 w-full md:w-auto self-start bg-[#5C021A] text-white px-8 py-3 rounded-lg text-base font-bold hover:bg-[#7B1C2E] transition-colors shadow-sm">
                Submit Request
              </button>
            </form>
          </div>

          {/* Right: Quick Links & Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Quick Answers */}
            <div className="bg-white border border-[#DCC0C1] rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1C1B1B] mb-6">Quick Links</h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-base text-[#5C021A] font-medium group-hover:underline">How do I reset my account password?</span>
                  <ChevronRight className="w-4 h-4 text-[#5D5F5F] group-hover:text-[#5C021A]" />
                </a>
                <div className="w-full h-px bg-[#DCC0C1]/50"></div>
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-base text-[#5C021A] font-medium group-hover:underline">How do I track my child's daily progress?</span>
                  <ChevronRight className="w-4 h-4 text-[#5D5F5F] group-hover:text-[#5C021A]" />
                </a>
                <div className="w-full h-px bg-[#DCC0C1]/50"></div>
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-base text-[#5C021A] font-medium group-hover:underline">Where can I download my fee receipts?</span>
                  <ChevronRight className="w-4 h-4 text-[#5D5F5F] group-hover:text-[#5C021A]" />
                </a>
                <div className="w-full h-px bg-[#DCC0C1]/50"></div>
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-base text-[#5C021A] font-medium group-hover:underline">Device requirements for live classes</span>
                  <ChevronRight className="w-4 h-4 text-[#5D5F5F] group-hover:text-[#5C021A]" />
                </a>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#7B1C2E] rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                <Phone className="w-6 h-6 text-[#FF8A96]" />
                <div>
                  <h4 className="text-xs font-bold text-[#FF8A96] mb-1">CALL US</h4>
                  <p className="text-sm font-bold text-white">+1 (800) 555-1234</p>
                </div>
              </div>

              <div className="bg-[#7B1C2E] rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                <MessageCircle className="w-6 h-6 text-[#FF8A96]" />
                <div>
                  <h4 className="text-xs font-bold text-[#FF8A96] mb-1">LIVE CHAT</h4>
                  <p className="text-sm font-bold text-white">Start Chat</p>
                </div>
              </div>

              <div className="bg-[#7B1C2E] rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                <Send className="w-6 h-6 text-[#FF8A96]" />
                <div>
                  <h4 className="text-xs font-bold text-[#FF8A96] mb-1">WHATSAPP</h4>
                  <p className="text-sm font-bold text-white">Message on WhatsApp</p>
                </div>
              </div>

              <div className="bg-[#7B1C2E] rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                <Mail className="w-6 h-6 text-[#FF8A96]" />
                <div>
                  <h4 className="text-xs font-bold text-[#FF8A96] mb-1">EMAIL US</h4>
                  <p className="text-sm font-bold text-white line-clamp-1 break-all">support@pds.edu</p>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white border border-[#DCC0C1] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#5C021A]" />
                <h3 className="text-lg font-bold text-[#1C1B1B]">Response Times</h3>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FCF9F8] rounded-lg">
                <span className="text-sm font-bold text-[#1C1B1B]">URGENT REQUESTS</span>
                <div className="text-right">
                  <span className="block text-lg font-bold text-[#5C021A]">1</span>
                  <span className="text-xs text-[#5D5F5F]">Hour</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FCF9F8] rounded-lg">
                <span className="text-sm font-bold text-[#1C1B1B]">REGULAR INQUIRIES</span>
                <div className="text-right">
                  <span className="block text-lg font-bold text-[#5C021A]">3</span>
                  <span className="text-xs text-[#5D5F5F]">Hours</span>
                </div>
              </div>

              <p className="text-xs text-[#5D5F5F] leading-[1.5] mt-2 italic">
                Our team of academic counselors and technical experts are working diligently to resolve your queries as fast as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Troubleshooting Component */}
      <section className="bg-white py-20 px-6 md:px-20 border-b border-[#DCC0C1]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center">Technical Troubleshooting</h2>
            <p className="text-base text-[#5D5F5F] text-center max-w-2xl mt-2">Quick fixes for the most common digital classroom hurdles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 bg-[#5C021A]/10 rounded-lg flex items-center justify-center mb-2">
                <Monitor className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h4 className="text-lg font-bold text-[#1C1B1B] border-b border-[#DCC0C1] pb-3 mb-2">Live Class Error</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Refresh browser tab</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Clear browser cache</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Logout and Log back in</li>
              </ul>
            </div>

            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 bg-[#5C021A]/10 rounded-lg flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h4 className="text-lg font-bold text-[#1C1B1B] border-b border-[#DCC0C1] pb-3 mb-2">Audio/Video Lag</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Check output device</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Check internet speed</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Update Chrome/Safari</li>
              </ul>
            </div>

            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 bg-[#5C021A]/10 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h4 className="text-lg font-bold text-[#1C1B1B] border-b border-[#DCC0C1] pb-3 mb-2">Login Issues</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Reset Password link</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Check registered email</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Verify 2FA code</li>
              </ul>
            </div>

            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 bg-[#5C021A]/10 rounded-lg flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h4 className="text-lg font-bold text-[#1C1B1B] border-b border-[#DCC0C1] pb-3 mb-2">App Crashing</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Update to latest version</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Re-install the application</li>
                <li className="flex gap-2.5 text-sm text-[#5D5F5F]"><CheckCircle2 className="w-4 h-4 text-[#5C021A] shrink-0 mt-0.5" /> Close background apps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Tabs */}
      <section className="bg-[#F6F3F2] py-20 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-10">Frequently Asked Questions</h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-xl shadow-sm border border-[#DCC0C1]">
            {["All", "Admissions", "Fees", "Technical", "Certificates"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFaqTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeFaqTab === tab
                    ? "bg-[#5C021A] text-white"
                    : "bg-transparent text-[#5D5F5F] hover:bg-[#F0EDED] hover:text-[#1C1B1B]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="w-full flex flex-col gap-4">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className={`w-full border border-[#DCC0C1] rounded-xl overflow-hidden transition-colors ${openFaqIndex === i ? "bg-white shadow-sm" : "bg-white hover:bg-[#FCF9F8]"}`}
              >
                <div
                  className="w-full px-6 py-5 flex justify-between items-center cursor-pointer"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <span className="text-base font-bold text-[#1C1B1B] pr-4">{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${openFaqIndex === i ? "bg-[#5C021A] rotate-180" : "bg-[#F0EDED]"}`}>
                    <ChevronDown className={`w-4 h-4 ${openFaqIndex === i ? "text-white" : "text-[#5C021A]"}`} />
                  </div>
                </div>
                {openFaqIndex === i && (
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-base text-[#5D5F5F] leading-[1.6] border-t border-[#DCC0C1]/40 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-[#5D5F5F]">No FAQs found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-white py-20 px-6 md:px-20 border-b border-[#DCC0C1]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-12">Additional Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-2xl p-8 flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#5C021A]/10 rounded-full flex items-center justify-center mb-6">
                <Download className="w-8 h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1B1B] mb-3">Student User Guide</h3>
              <p className="text-base text-[#5D5F5F] mb-8 leading-[1.5]">Download the comprehensive PDF guide for students.</p>
              <button className="mt-auto px-6 py-2.5 rounded-full border border-[#5C021A] text-[#5C021A] text-sm font-bold group-hover:bg-[#5C021A] group-hover:text-white transition-colors w-full">
                Download PDF
              </button>
            </div>

            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-2xl p-8 flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#5C021A]/10 rounded-full flex items-center justify-center mb-6">
                <PlayCircle className="w-8 h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1B1B] mb-3">Video Tutorials</h3>
              <p className="text-base text-[#5D5F5F] mb-8 leading-[1.5]">Watch step-by-step videos on using the portal features.</p>
              <button className="mt-auto px-6 py-2.5 rounded-full border border-[#5C021A] text-[#5C021A] text-sm font-bold group-hover:bg-[#5C021A] group-hover:text-white transition-colors w-full">
                Watch Playlist
              </button>
            </div>

            <div className="bg-[#FCF9F8] border border-[#DCC0C1] rounded-2xl p-8 flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#5C021A]/10 rounded-full flex items-center justify-center mb-6">
                <PlayCircle className="w-8 h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1B1B] mb-3">Parent Community</h3>
              <p className="text-base text-[#5D5F5F] mb-8 leading-[1.5]">Join our private Facebook group for PDS parents.</p>
              <button className="mt-auto px-6 py-2.5 rounded-full border border-[#5C021A] text-[#5C021A] text-sm font-bold group-hover:bg-[#5C021A] group-hover:text-white transition-colors w-full">
                Join Group
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5C021A] py-24 px-6 md:px-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-[800px] flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-[48px] font-bold text-white tracking-tight leading-tight">
            We're Always Here to Help
          </h2>
          <p className="text-lg text-white/90 leading-[1.6]">
            Your education and comfort are our top priorities. Let's build your future together.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <button className="px-10 py-4 bg-white text-[#5C021A] text-base font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Chat With Us
            </button>
            <button className="px-10 py-4 border border-white/40 text-white text-base font-bold rounded-xl hover:bg-white/10 transition-colors">
              Visit Help Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
