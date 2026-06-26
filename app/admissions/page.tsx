import {
  ArrowRight,
  Code,
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  Star,
  UserCircle,
  GraduationCap,
  ClipboardList,
  ChevronDown,
  MessageCircle,
  Clock,
  BookOpen,
} from "lucide-react";

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#F3F3F3] text-[#1A1C1C] overflow-x-hidden pt-14">
      {/* Hero */}
      <section className="bg-[#F3F3F3] py-16 md:py-20 px-6 md:px-12 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1280px] flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          <div className="w-full lg:w-[604px] flex flex-col gap-5 relative z-10">
            <div className="bg-[#FFDADB] text-[#5C021A] px-4 py-1.5 rounded-full w-fit text-sm font-medium tracking-[0.8px]">
              FALL 2026 ADMISSIONS OPEN
            </div>
            <h1 className="text-3xl md:text-[48px] font-bold text-[#1A1C1C] leading-[1.25] tracking-[-0.96px]">
              Shape Your Future at Prime Digital Excellence
            </h1>
            <p className="text-base md:text-lg text-[#5F5E5E] leading-[1.56] max-w-[576px]">
              Join a vibrant community of innovators. Follow our streamlined admission process and take the first step
              towards a transformative educational experience.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button className="bg-[#5C021A] text-white px-8 py-4 rounded-lg text-base font-medium hover:bg-[#7B1C2E] transition-colors">
                Start Application
              </button>
              <button className="border border-[#5C021A] text-[#5C021A] bg-transparent px-8 py-4 rounded-lg text-base font-medium hover:bg-[#5C021A]/5 transition-colors">
                Download Prospectus
              </button>
            </div>
          </div>
          <div className="w-full lg:flex-1 relative min-h-[350px] md:min-h-[508px] flex justify-center lg:justify-end">
            <div className="absolute right-[-40px] top-[-40px] w-[256px] h-[256px] bg-[#5C021A]/10 blur-[32px] rounded-full z-0"></div>
            <div className="relative w-full max-w-[596px] h-[350px] md:h-[500px] bg-white/40 border-4 border-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] rounded-2xl z-10 overflow-hidden flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[#5C021A]/10 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Journey */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              The Admission Journey
            </h2>
            <div className="w-20 h-1 bg-[#5C021A] rounded-full"></div>
          </div>

          <div className="relative w-full max-w-[1232px] mt-4">
            <div className="hidden md:block absolute top-[32px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#5C021A] via-[#5C021A]/20 to-transparent z-0"></div>
            <div className="md:hidden absolute left-[32px] top-0 bottom-0 w-[2px] bg-[#5C021A]/20 z-0"></div>

            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
              <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-[220px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5C021A] shadow-md flex items-center justify-center shrink-0">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-normal text-[#5C021A] leading-[28px] mb-1">Step 1</h3>
                  <p className="text-sm text-[#5F5E5E] leading-[20px]">Submit your online application & documents.</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-[220px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5C021A] shadow-md flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-normal text-[#5C021A] leading-[28px] mb-1">Step 2</h3>
                  <p className="text-sm text-[#5F5E5E] leading-[20px]">Initial review & academic screening.</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-[220px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5C021A] shadow-md flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-normal text-[#5C021A] leading-[28px] mb-1">Step 3</h3>
                  <p className="text-sm text-[#5F5E5E] leading-[20px]">Personal interview with faculty members.</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-[220px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5C021A] shadow-md flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-normal text-[#5C021A] leading-[28px] mb-1">Step 4</h3>
                  <p className="text-sm text-[#5F5E5E] leading-[20px]">Offer of admission extended.</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-[220px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5C021A] shadow-md flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-normal text-[#5C021A] leading-[28px] mb-1">Step 5</h3>
                  <p className="text-sm text-[#5F5E5E] leading-[20px]">Enrollment & campus orientation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-[#F3F3F3] py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Eligibility Criteria
            </h2>
            <p className="text-sm md:text-base text-[#5F5E5E] max-w-2xl leading-[24px]">
              Review the basic prerequisites needed before beginning your application process.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white border border-[#DCC0C1] rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-[#5C021A]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] font-serif">Age & Grade</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                Students must be aged between 5-18 years depending on the grade applying for (Grades 1 through 12).
              </p>
            </div>
            <div className="bg-white border border-[#DCC0C1] rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-[#5C021A]/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] font-serif">Academic Background</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                Minimum 60% aggregate in the previous year&apos;s final examinations or equivalent grade certificate.
              </p>
            </div>
            <div className="bg-white border border-[#DCC0C1] rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 transition-transform sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#5C021A]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] font-serif">Documents Required</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                Valid birth certificate, transfer certificate, and academic transcripts from the last institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Fee Structure
            </h2>
            <p className="text-sm md:text-base text-[#5F5E5E] max-w-xl leading-[24px]">
              Transparent pricing with no hidden costs. Explore our tuition packages across different grade levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            <div className="bg-white border border-[#DCC0C1] shadow-sm rounded-xl p-6 md:p-8 flex flex-col">
              <h3 className="text-base font-normal text-[#1A1C1C] leading-[24px] font-serif">Foundation</h3>
              <p className="text-sm text-[#5F5E5E] leading-[20px] mb-4">Grades 1 to 5</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-[36px] font-bold text-[#5C021A] leading-[40px]">TBD</span>
                <span className="text-sm md:text-base text-[#5F5E5E]">/ term</span>
              </div>
              <ul className="flex flex-col gap-4 mt-2 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Basic computing tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Digital literacy workshops</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Core academic subjects</span>
                </li>
              </ul>
              <button className="w-full border border-[#5C021A] text-[#5C021A] py-3 rounded-lg text-base font-medium hover:bg-[#5C021A]/5 transition-colors">
                Enquire Now
              </button>
            </div>

            <div className="bg-white border-2 border-[#5C021A] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] rounded-xl p-6 md:p-10 flex flex-col relative">
              <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-[#5C021A] text-white px-4 py-1 rounded-full text-xs font-bold tracking-[0.7px] uppercase whitespace-nowrap">
                Featured
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] leading-[24px] font-serif">Intermediate</h3>
              <p className="text-sm text-[#5F5E5E] leading-[20px] mb-4">Grades 6 to 10</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-[36px] font-bold text-[#5C021A] leading-[40px]">TBD</span>
                <span className="text-sm md:text-base text-[#5F5E5E]">/ term</span>
              </div>
              <ul className="flex flex-col gap-4 mt-2 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Advanced coding fundamentals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Robotics lab access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">1-on-1 mentorship sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Career path exploration</span>
                </li>
              </ul>
              <button className="w-full bg-[#5C021A] text-white py-3 rounded-lg text-base font-medium hover:bg-[#7B1C2E] transition-colors">
                Enquire Now
              </button>
            </div>

            <div className="bg-white border border-[#DCC0C1] shadow-sm rounded-xl p-6 md:p-8 flex flex-col">
              <h3 className="text-base font-normal text-[#1A1C1C] leading-[24px] font-serif">Advanced</h3>
              <p className="text-sm text-[#5F5E5E] leading-[20px] mb-4">Grades 11 & 12</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-[36px] font-bold text-[#5C021A] leading-[40px]">TBD</span>
                <span className="text-sm md:text-base text-[#5F5E5E]">/ term</span>
              </div>
              <ul className="flex flex-col gap-4 mt-2 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Specialized tech electives</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">Capstone project funding</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5C021A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1A1C1C] leading-[20px]">University placement guarantee</span>
                </li>
              </ul>
              <button className="w-full border border-[#5C021A] text-[#5C021A] py-3 rounded-lg text-base font-medium hover:bg-[#5C021A]/5 transition-colors">
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Checklist */}
      <section className="bg-[#E2E2E2] py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col lg:flex-row gap-10 md:gap-16 items-center">
          <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Submission Checklist
            </h2>
            <p className="text-base md:text-lg text-[#5F5E5E] leading-[28px]">
              Ensure you have all relevant documents ready for a smooth application process. Upload these securely
              through our portal.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-3 md:gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#5C021A] shrink-0" />
              <span className="text-sm md:text-base font-medium text-[#1A1C1C]">Student&apos;s Birth Certificate or Passport</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#5C021A] shrink-0" />
              <span className="text-sm md:text-base font-medium text-[#1A1C1C]">Previous Academic Transcripts</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#5C021A] shrink-0" />
              <span className="text-sm md:text-base font-medium text-[#1A1C1C]">Transfer Certificate (if applicable)</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#5C021A] shrink-0" />
              <span className="text-sm md:text-base font-medium text-[#1A1C1C]">2 Recent Passport-sized Photographs</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#5C021A] shrink-0" />
              <span className="text-sm md:text-base font-medium text-[#1A1C1C]">Proof of Address / Residency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Important Dates
            </h2>
            <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
              Mark your calendars. Don&apos;t miss these critical deadlines for the upcoming semester.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-[#EEEEEE] rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-2 hover:bg-[#E2E2E2] transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-[#5C021A] mb-1">Aug 15</h3>
              <h4 className="text-base md:text-lg font-normal text-[#1A1C1C] font-serif">Applications Open</h4>
              <p className="text-xs md:text-sm text-[#5F5E5E]">Portal live for Fall 2026</p>
            </div>
            <div className="bg-[#EEEEEE] rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-2 hover:bg-[#E2E2E2] transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-[#5C021A] mb-1">Oct 30</h3>
              <h4 className="text-base md:text-lg font-normal text-[#1A1C1C] font-serif">Early Bird Deadline</h4>
              <p className="text-xs md:text-sm text-[#5F5E5E]">Priority review phase ends</p>
            </div>
            <div className="bg-[#EEEEEE] rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-2 hover:bg-[#E2E2E2] transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-[#5C021A] mb-1">Nov 20</h3>
              <h4 className="text-base md:text-lg font-normal text-[#1A1C1C] font-serif">Interviews Begin</h4>
              <p className="text-xs md:text-sm text-[#5F5E5E]">Shortlisted candidates notified</p>
            </div>
            <div className="bg-[#EEEEEE] rounded-xl p-6 md:p-8 flex flex-col items-center text-center gap-2 hover:bg-[#E2E2E2] transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-[#5C021A] mb-1">Jan 10</h3>
              <h4 className="text-base md:text-lg font-normal text-[#1A1C1C] font-serif">Final Decisions</h4>
              <p className="text-xs md:text-sm text-[#5F5E5E]">Offer letters dispatched</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="bg-[#F3F3F3] py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-[472px] flex flex-col gap-4">
              <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
                Scholarship Opportunities
              </h2>
              <p className="text-base md:text-lg text-[#5F5E5E] leading-[28px]">
                We believe in making quality education accessible. Explore our financial aid programs.
              </p>
            </div>
            <button className="font-bold text-sm md:text-base text-[#5C021A] hover:underline whitespace-nowrap">
              View All Scholarships &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white border border-[#DCC0C1] shadow-sm rounded-xl p-6 md:p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#5C021A]/5 rounded-full flex items-center justify-center mb-6">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] mb-3 font-serif">Merit-Based Scholarship</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                Awarded to students exhibiting exceptional academic excellence in previous grades.
              </p>
            </div>
            <div className="bg-white border border-[#DCC0C1] shadow-sm rounded-xl p-6 md:p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#5C021A]/5 rounded-full flex items-center justify-center mb-6">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] mb-3 font-serif">Tech Innovator Award</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                For students who demonstrate a strong portfolio or projects in coding and technology.
              </p>
            </div>
            <div className="bg-white border border-[#DCC0C1] shadow-sm rounded-xl p-6 md:p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#5C021A]/5 rounded-full flex items-center justify-center mb-6">
                <HeartIcon className="w-6 h-6 md:w-8 md:h-8 text-[#5C021A]" />
              </div>
              <h3 className="text-base font-normal text-[#1A1C1C] mb-3 font-serif">Financial Aid Grant</h3>
              <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">
                The transparency in fees and the scholarship opportunities made it possible for our diverse community to
                thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form & Help */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col lg:flex-row gap-10 md:gap-12">
          <div className="w-full lg:w-[65%] flex flex-col gap-6 md:gap-8">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Ready to Apply?
            </h2>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Student Name</label>
                  <input
                    type="text"
                    placeholder="Full name as per records"
                    className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Parent/Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Email Address</label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Grade Seeking Admission</label>
                  <select className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white text-[#1A1C1C] focus:outline-none focus:border-[#5C021A] appearance-none">
                    <option value="" disabled selected>
                      Select Grade
                    </option>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Current School</label>
                  <input
                    type="text"
                    placeholder="Name of previous school"
                    className="h-[49px] px-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1A1C1C] tracking-[0.7px]">Additional Message</label>
                <textarea
                  placeholder="Any specific queries or requirements..."
                  className="h-[122px] p-4 rounded-lg border border-[#897172] bg-white focus:outline-none focus:border-[#5C021A] resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#5C021A] text-white py-4 rounded-lg text-base font-normal hover:bg-[#7B1C2E] transition-colors w-full mt-2"
              >
                Submit Application
              </button>
            </form>
          </div>

          <div className="w-full lg:w-[35%] bg-[#7B1C2E] rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
            <div className="flex flex-col gap-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white">Need Help?</h3>
              <p className="text-sm md:text-base text-white/90 leading-[24px]">
                Our admissions officers are available to assist you with the application process or campus tours.
              </p>
            </div>
            <div className="flex flex-col gap-6 mt-12 md:mt-16">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#FF8A96] shrink-0 mt-1" />
                <div>
                  <span className="text-base md:text-lg font-bold text-white leading-[28px]">+1 (800) 555-1234</span>
                  <p className="text-sm text-white/80 leading-[20px]">Mon-Fri, 9am - 5pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#FF8A96] shrink-0 mt-1" />
                <div>
                  <span className="text-base md:text-lg font-bold text-white leading-[28px]">admissions@pds.edu</span>
                  <p className="text-sm text-white/80 leading-[20px]">We reply within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F3F3F3] py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-12">
          <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px] text-center">
            What Parents Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
              <div>
                <svg className="w-6 h-6 text-[#5C021A]/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-sm md:text-base text-[#5F5E5E] italic leading-[24px]">
                  &ldquo;The admissions process was incredibly smooth. From the first inquiry to enrollment, the staff was
                  professional and supportive.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')] bg-cover bg-center shrink-0"></div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-[#1A1C1C]">Eleanor Rigby</h4>
                  <p className="text-xs text-[#5F5E5E]">Parent of Grade 9 Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
              <div>
                <svg className="w-6 h-6 text-[#5C021A]/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-sm md:text-base text-[#5F5E5E] italic leading-[24px]">
                  &ldquo;We were looking for a school that values both academics and character development. Prime Digital has
                  exceeded our expectations.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')] bg-cover bg-center shrink-0"></div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-[#1A1C1C]">Michael Chang</h4>
                  <p className="text-xs text-[#5F5E5E]">Parent of Grade 11 Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#DCC0C1] rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
              <div>
                <svg className="w-6 h-6 text-[#5C021A]/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-sm md:text-base text-[#5F5E5E] italic leading-[24px]">
                  &ldquo;The transparency in fees and the diverse community made us confident in our decision. Truly an
                  amazing institution for future leaders.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')] bg-cover bg-center shrink-0"></div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-[#1A1C1C]">Sarah & Tom</h4>
                  <p className="text-xs text-[#5F5E5E]">Parents of Grade 6 Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1232px] flex flex-col items-center gap-10 md:gap-16">
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#1A1C1C] leading-[40px] tracking-[-0.32px]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-[#5F5E5E] leading-[24px]">Find quick answers to common admission queries.</p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="border border-[#DCC0C1] rounded-xl px-4 md:px-6 py-5 md:py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm md:text-base font-bold text-[#1A1C1C]">When is the latest I can apply for Fall 2026?</span>
              <ChevronDown className="w-5 h-5 text-[#1A1C1C] shrink-0" />
            </div>
            <div className="border border-[#DCC0C1] rounded-xl px-4 md:px-6 py-5 md:py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm md:text-base font-bold text-[#1A1C1C]">Is the entrance exam mandatory for all grades?</span>
              <ChevronDown className="w-5 h-5 text-[#1A1C1C] shrink-0" />
            </div>
            <div className="border border-[#DCC0C1] rounded-xl px-4 md:px-6 py-5 md:py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm md:text-base font-bold text-[#1A1C1C]">Do you offer boarding facilities for international students?</span>
              <ChevronDown className="w-5 h-5 text-[#1A1C1C] shrink-0" />
            </div>
            <div className="border border-[#DCC0C1] rounded-xl px-4 md:px-6 py-5 md:py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm md:text-base font-bold text-[#1A1C1C]">How do I apply for a scholarship during admission?</span>
              <ChevronDown className="w-5 h-5 text-[#1A1C1C] shrink-0" />
            </div>
            <div className="border border-[#DCC0C1] rounded-xl px-4 md:px-6 py-5 md:py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm md:text-base font-bold text-[#1A1C1C]">What is the student-to-teacher ratio?</span>
              <ChevronDown className="w-5 h-5 text-[#1A1C1C] shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-16 md:pb-20 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1232px] bg-[#5C021A] rounded-[24px] px-6 md:px-8 py-16 md:py-20 flex flex-col items-center relative overflow-hidden text-center">
          <div className="absolute top-[-128px] right-[-128px] w-[256px] h-[256px] rounded-full bg-white/5 z-0"></div>
          <div className="absolute bottom-[-128px] left-[-128px] w-[256px] h-[256px] rounded-full bg-white/5 z-0"></div>
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-[672px]">
            <h2 className="text-3xl md:text-[48px] font-bold text-white leading-[1.17] tracking-[-0.96px]">
              Ready to Join Prime Digital School?
            </h2>
            <p className="text-base md:text-lg text-white/90 leading-[1.56]">
              Take the leap and become part of a community that fosters innovation, leadership, and digital mastery.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 w-full">
              <button className="bg-white text-[#5C021A] px-8 md:px-10 py-4 rounded-lg text-sm md:text-base font-bold hover:bg-gray-100 transition-colors">
                Start Application
              </button>
              <button className="bg-white/10 border border-white/30 text-white px-8 md:px-10 py-4 rounded-lg text-sm md:text-base font-bold hover:bg-white/20 transition-colors">
                Contact Admissions
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
