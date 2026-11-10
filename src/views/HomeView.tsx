import React, { useState } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  BookOpen,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  Download,
  Building,
  Computer,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  Send,
  Check,
  ChevronRight,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenVerify: () => void;
  onOpenAI: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenVerify, onOpenAI }) => {
  const settings = JamiaStore.getSettings();
  const notices = JamiaStore.getNotices();
  const courses = JamiaStore.getCourses();

  // Contact Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    program: 'Dars-e-Nizami (Alimiyyah)',
    message: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryForm({ name: '', phone: '', email: '', program: 'Dars-e-Nizami (Alimiyyah)', message: '' });
      setInquirySubmitted(false);
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION
          - Beautiful Madinah Munawwarah image (sacred inspiration, respectful caption)
          - High-quality image of male madrasa students studying Holy Quran & Dars
          - Exact heading: "Welcome to Jamia Salahuddin Ayubi"
          - Islamic education focused introduction
          - "Explore Courses" and "Online Admission" primary buttons
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f8f5] via-white to-[#f8faf9] pt-8 sm:pt-12 pb-16 sm:pb-24 border-b border-[#e5ece8]">
        {/* Subtle Islamic Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#176B4D_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
          {/* Top Inspiration Banner: Beautiful Madinah Munawwarah */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#D6B66C]/50 group">
            <div className="h-48 sm:h-72 md:h-84 w-full relative">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&auto=format&fit=crop&q=85"
                alt="Al-Madinah Al-Munawwarah - The Prophet's City"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              {/* Gradient Overlay for Text Legibility & Emerald Atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f4a35] via-[#176B4D]/60 to-transparent" />

              {/* Spiritual Banner Caption */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6B66C]/90 text-[#0f4a35] text-[11px] font-extrabold uppercase tracking-wider mb-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spiritual Heritage & Prophetic Tradition</span>
                  </div>
                  <h3 className="font-serif-heading text-lg sm:text-2xl font-bold tracking-wide">
                    Al-Madinah Al-Munawwarah (المدينة المنورة)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                    Drawing eternal inspiration from the pristine teachings of the Prophet Muhammad ﷺ in preserving sacred Islamic scholarship.
                  </p>
                </div>

                <div className="text-right hidden md:block">
                  <span className="font-arabic text-lg text-[#D6B66C] font-bold block">
                    طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ
                  </span>
                  <span className="text-[11px] text-emerald-200">
                    &ldquo;Seeking sacred knowledge is an obligation upon every Muslim.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Hero Showcase Grid: Content + Male Madrasa Students Studying */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Official Institute Badge with Urdu Name */}
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D6B66C]/80 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#176B4D]" />
                <span className="text-xs font-bold text-[#176B4D] tracking-wider uppercase">
                  Admissions Open 2026-2027
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-arabic text-xs font-bold text-[#b89344]">
                  جامعہ صلاح الدین ایوبی
                </span>
              </div>

              {/* Exact Heading Required */}
              <div className="space-y-2">
                <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#176B4D] tracking-tight leading-[1.15]">
                  Welcome to Jamia Salahuddin Ayubi
                </h1>
                <h2 className="font-arabic text-2xl sm:text-3xl text-[#b89344] font-bold">
                  جامعہ صلاح الدین ایوبی الإسلامية
                </h2>
              </div>

              {/* Islamic Education Focused Introduction */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                An esteemed sanctuary of sacred learning committed to cultivating authentic Islamic scholars, Hafiz-ul-Quran, and legal jurists grounded in Quran and Sunnah. Under the visionary management of{' '}
                <strong className="text-[#176B4D] font-bold">{settings.directorName}</strong>, we seamlessly unite classical Islamic sciences (Dars-e-Nizami & Ifta) with contemporary intellectual, digital, and linguistic proficiencies.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('courses-section')}
                  className="px-6 py-3.5 bg-white hover:bg-[#f8faf9] text-[#176B4D] font-bold text-sm rounded-xl border-2 border-[#176B4D] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#176B4D]" />
                  <span>Explore Courses</span>
                  <ChevronRight className="w-4 h-4 text-[#D6B66C]" />
                </button>

                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-7 py-3.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
                  <span>Online Admission</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onOpenVerify}
                  className="px-4 py-3.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#b89344]" />
                  <span>Verify Student ID</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">8 Years</span>
                  <span className="block text-xs text-slate-500 font-medium">Classical Alimiyyah Degree</span>
                </div>
                <div>
                  <span className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">Certified</span>
                  <span className="block text-xs text-slate-500 font-medium">Sanad with Direct Chains</span>
                </div>
                <div>
                  <span className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">100%</span>
                  <span className="block text-xs text-slate-500 font-medium">Full Orphan & Hafiz Aid</span>
                </div>
              </div>
            </div>

            {/* Right: High-Quality Image of Male Madrasa Students Studying (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-[#D6B66C]/60 space-y-4">
                {/* Image of Male Madrasa Students Studying */}
                <div className="relative rounded-2xl overflow-hidden border border-[#176B4D]/30 h-72 sm:h-80 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80"
                    alt="Male madrasa students studying the Holy Quran and Islamic texts"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#D6B66C] block">
                      Sacred Student Life (طَلَبُ الْعِلْمِ)
                    </span>
                    <p className="text-xs font-semibold leading-tight text-emerald-100">
                      Students engrossed in daily recitation, memorization, and classical Fiqh Halaqah.
                    </p>
                  </div>
                </div>

                {/* Institute Seal Summary Card */}
                <div className="p-3.5 bg-[#f2f8f5] rounded-2xl border border-[#176B4D]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <JamiaLogo size={42} showText={false} />
                    <div>
                      <h4 className="font-serif-heading font-extrabold text-xs text-[#176B4D]">
                        Jamia Salahuddin Ayubi
                      </h4>
                      <span className="font-arabic text-xs text-[#b89344] font-bold block">
                        جامعہ صلاح الدین ایوبی
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Director:</span>
                    <strong className="text-xs text-slate-900">{settings.directorName}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTE INTRODUCTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece8] shadow-md space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              About Our Foundation & Educational Philosophy
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
              Preserving Sacred Heritage, Inspiring Modern Minds
            </h2>
            <div className="w-20 h-1 bg-[#D6B66C] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Jamia Salahuddin Ayubi</strong> was established to provide an unyielding standard of classical Islamic education while addressing the challenges and intellectual demands of the 21st century. Named after the heroic Sultan Salahuddin Ayubi—a model of spiritual piety, profound scholarship, and moral fortitude—our institute molds graduates who embody deep adherence to the Sunnah and civic leadership.
              </p>
              <p>
                Our rigorous pedagogical methodology revolves around uninterrupted teacher-student transmission (*Isnad*), daily immersion in Quranic recitation, classical Arabic linguistics, Usul al-Fiqh, and comprehensive study of the canonical Hadith anthologies (*Sihah Sitta*).
              </p>
            </div>

            <div className="space-y-4">
              <p>
                In addition to sacred studies, Jamia Salahuddin Ayubi integrates essential modern educational competencies into the curriculum. Every enrolled student attends specialized coursework in digital literacy, academic English composition, contemporary world history, and research tools such as digital manuscript archives and Maktaba Shamila.
              </p>
              <div className="p-4 bg-[#f8faf9] rounded-2xl border border-[#D6B66C]/40 space-y-2">
                <h4 className="font-serif-heading font-bold text-xs text-[#176B4D] uppercase tracking-wide">
                  Core Foundational Values
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ikhlas (Sincerity)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adab (Moral Etiquette)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Itqan (Mastery & Rigor)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Khidmah (Selfless Service)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED COURSES
         ========================================================================= */}
      <section id="courses-section" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
            Academic Programs & Syllabi
          </span>
          <h2 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
            Featured Academic Courses
          </h2>
          <p className="text-sm text-slate-600">
            Comprehensive traditional programs leading to recognized Islamic scholarship and specialized degrees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 border border-[#e5ece8] hover:border-[#176B4D] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2.5 py-1 rounded-md">
                    {course.code}
                  </span>
                  <span className="text-xs text-[#b89344] font-semibold">{course.creditHours} Credits / Wk</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {course.title}
                  </h3>
                  <span className="font-arabic text-sm text-[#176B4D] font-bold block mt-0.5">
                    {course.arabicTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                {/* Prescribed Texts */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Key Core Books:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.books.map((b, i) => (
                      <span key={i} className="text-[10px] bg-[#f8faf9] text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Instructor: <strong className="text-slate-800">{course.instructor}</strong></span>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-3 py-1.5 bg-[#176B4D] text-white font-bold rounded-lg hover:bg-[#0f4a35] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3 text-[#D6B66C]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. EDUCATIONAL FACILITIES
         ========================================================================= */}
      <section className="bg-[#f2f8f5] py-16 border-y border-[#e5ece8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Learning Infrastructure
            </span>
            <h2 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
              Educational & Research Facilities
            </h2>
            <p className="text-sm text-slate-600">
              State-of-the-art academic resources established to foster deep scholarly focus and research excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Grand Maktaba Library</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Houses over 25,000 physical classical manuscripts, comprehensive Fiqh encyclopedias, Hadith commentaries, and digital research terminals with Maktaba Shamila.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fdfaf2] text-[#b89344] flex items-center justify-center">
                <Computer className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Modern IT Lab</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated high-speed computer terminals training students in academic typing, digital publishing, web technologies, and translation software.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Halaqah Lecture Halls</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spacious, air-cooled lecture spaces arranged in classical circular Halaqah formations equipped with handcrafted wooden study Rehals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fdfaf2] text-[#b89344] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Qirat Audio Studio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acoustically treated Quranic recitation studio where students record and evaluate their Tajweed and phonetic accuracy according to Qirat-e-Saba.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ADMISSION INFORMATION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#176B4D]/30 shadow-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
                Session 2026-2027 Guidelines
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
                Admission Criteria & Application Roadmap
              </h2>
            </div>

            <button
              onClick={() => onNavigate('admissions')}
              className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
              <span>Start Online Application</span>
            </button>
          </div>

          {/* 4 Step Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-2">
              <span className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">01.</span>
              <h4 className="font-bold text-slate-900 text-sm">Online Registration</h4>
              <p className="text-xs text-slate-600">
                Submit student credentials, guardian information, program of choice, and resident preferences via our digital portal.
              </p>
            </div>

            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-2">
              <span className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">02.</span>
              <h4 className="font-bold text-slate-900 text-sm">Document Verification</h4>
              <p className="text-xs text-slate-600">
                Provide copies of B-Form / CNIC, guardian contact, 4 passport photos, and previous madrasa or academic school reports.
              </p>
            </div>

            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-2">
              <span className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">03.</span>
              <h4 className="font-bold text-slate-900 text-sm">Oral & Written Assessment</h4>
              <p className="text-xs text-slate-600">
                Candidates undergo a cordial assessment assessing Nazra Quran fluency, basic Urdu/Arabic understanding, and student motivation.
              </p>
            </div>

            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-2">
              <span className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">04.</span>
              <h4 className="font-bold text-slate-900 text-sm">Roll No & ID Card Issuance</h4>
              <p className="text-xs text-slate-600">
                Approved students are assigned an official Roll Number and issued their digital verified CR80 smart Student ID Card.
              </p>
            </div>
          </div>

          {/* Scholarship Guarantee Banner */}
          <div className="p-4 bg-[#fdfaf2] rounded-2xl border border-[#D6B66C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  100% Scholarships for Huffaz, Orphans & Deserving Students
                </h4>
                <p className="text-xs text-slate-600">
                  Under the endowment directives of Muneeb ur Rehman, full tuition waivers and subsidized boarding are unconditionally granted to eligible applicants.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('admissions')}
              className="px-4 py-2 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Apply for Concession
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MANAGEMENT INTRODUCTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece8] shadow-md space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Director Portrait */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-44 h-44 rounded-3xl overflow-hidden border-4 border-[#D6B66C] shadow-lg p-1 bg-white">
                {settings.directorPhotoUrl ? (
                  <img
                    src={settings.directorPhotoUrl}
                    alt="Director Muneeb ur Rehman"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#f2f8f5] flex flex-col items-center justify-center p-3 text-center">
                    <JamiaLogo size={56} showText={false} />
                    <span className="text-[10px] font-bold text-[#176B4D] uppercase mt-2">Muneeb ur Rehman</span>
                    <span className="font-arabic text-[11px] text-[#b89344] font-bold">بانی ومدیر اعلیٰ</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                  {settings.directorName}
                </h3>
                <span className="text-xs font-semibold text-[#b89344] block">
                  {settings.directorTitle}
                </span>
                <span className="font-arabic text-xs text-slate-500 font-semibold block mt-0.5">
                  بانی ومدیر اعلیٰ: منیب الرحمن
                </span>
              </div>
            </div>

            {/* Director Message & Leadership Philosophy */}
            <div className="md:col-span-8 space-y-4 text-left">
              <div className="inline-block px-3 py-1 bg-[#f2f8f5] text-[#176B4D] rounded-lg text-xs font-bold uppercase tracking-wider">
                Leadership Vision & Message
              </div>
              <h2 className="font-serif-heading text-2xl font-bold text-slate-900 leading-snug">
                &ldquo;Cultivating Scholars Grounded in Revelation, Equipped for the Modern World.&rdquo;
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  Assalamu Alaikum wa Rahmatullahi wa Barakatuh.
                </p>
                <p>
                  At Jamia Salahuddin Ayubi, our primary mandate is to protect the sacred purity of Islamic education while nurturing graduates who possess the intellectual tools to engage constructively with contemporary reality.
                </p>
                <p>
                  Our faculty and administration uphold the highest standards of spiritual mentorship (*Tarbiyah*), intellectual discipline, and academic integrity. We warmly welcome parents, guardians, and aspiring students to become part of this noble educational sanctuary.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-[#176B4D]">
                <span>Muneeb ur Rehman</span>
                <span className="text-slate-300">·</span>
                <span>Director General & Founder</span>
                <span className="text-slate-300">·</span>
                <span>Jamia Salahuddin Ayubi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. STUDENT FACILITIES
         ========================================================================= */}
      <section className="bg-[#f8faf9] py-16 border-y border-[#e5ece8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Life on Campus
            </span>
            <h2 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
              Comprehensive Student Facilities
            </h2>
            <p className="text-sm text-slate-600">
              Providing a safe, moral, and nourishing campus environment where students thrive physically, emotionally, and spiritually
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Residential Hostels</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean, well-ventilated dormitories with personal storage, quiet study corners, and 24/7 security oversight by resident Asatiza.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Hygienic Dining & Halal Mess</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Three wholesome daily meals prepared with high nutritional standards, fresh ingredients, and strict hygiene protocols.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Sports & Physical Fitness Arena</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated recreational grounds for traditional archery, football, table tennis, and structured physical exercise following Asr prayer.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Campus Dispensary & First Aid</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Round-the-clock medical care, essential pharmaceuticals, and emergency transport arrangements for student health security.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Laundry & Tailoring Services</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-campus laundry facility ensuring all students maintain clean, Sunnah-compliant white attire throughout the academic week.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Spiritual Tarbiyah & Adhkar</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Daily congregational Tahajjud, morning Surah Yasin recitations, and personal character mentorship sessions conducted by senior scholars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. LATEST ANNOUNCEMENTS & NOTICES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Circulars & Official Notices
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
              Latest Institute Announcements
            </h2>
          </div>
          <button
            onClick={() => onNavigate('management')}
            className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Academic Software</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                n.isImportant ? 'border-[#D6B66C] ring-1 ring-[#D6B66C]/40' : 'border-[#e5ece8]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[#f2f8f5] text-[#176B4D]">
                    {n.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{n.publishDate}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {n.title}
                </h4>

                {n.urduTitle && (
                  <span className="font-arabic text-sm text-[#176B4D] font-bold block">
                    {n.urduTitle}
                  </span>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.content}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>By: <strong>{n.author}</strong></span>
                {n.isImportant && (
                  <span className="text-[#b89344] font-bold uppercase tracking-wider">
                    Important Circular
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. CONTACT INFORMATION & DIRECT INQUIRY
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece8] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
                  Secretariat & Information Desk
                </span>
                <h2 className="font-serif-heading text-2xl font-extrabold text-[#176B4D] mt-1">
                  Contact Jamia Salahuddin Ayubi
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We are delighted to assist prospective students, parents, and visitors.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl border border-[#e5ece8]">
                  <MapPin className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Campus Address:</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl border border-[#e5ece8]">
                  <Phone className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Phone / Admissions Helpline:</strong>
                    <span>{settings.contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl border border-[#e5ece8]">
                  <Mail className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Official Email:</strong>
                    <span>{settings.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl border border-[#e5ece8]">
                  <Clock className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Visiting Hours:</strong>
                    <span>Monday – Saturday: 08:00 AM to 04:00 PM (Friday Closed after Zuhr)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="lg:col-span-7 bg-[#f8faf9] p-6 sm:p-8 rounded-2xl border border-[#D6B66C]/40 space-y-4">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-slate-900">
                  Send Direct Admission Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Our admissions office will contact you via WhatsApp / phone within 24 hours.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    JazakAllah Khair. The admissions office under Muneeb ur Rehman will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="e.g. Muhammad Ibrahim"
                        className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">WhatsApp / Phone *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Email Address (optional)</label>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Program of Interest</label>
                      <select
                        value={inquiryForm.program}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none font-medium"
                      >
                        <option value="Dars-e-Nizami (Alimiyyah)">Dars-e-Nizami (Alimiyyah)</option>
                        <option value="Hifz-ul-Quran with Tajweed">Hifz-ul-Quran with Tajweed</option>
                        <option value="Tajweed & Qirat-e-Saba">Tajweed & Qirat-e-Saba</option>
                        <option value="Takhassus fi al-Fiqh wal-Ifta">Takhassus fi al-Fiqh wal-Ifta</option>
                        <option value="Modern IT & Computer Science">Modern IT & Computer Science</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Your Question or Message</label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Ask about hostel boarding, syllabus, or fee concession..."
                      className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#D6B66C]" />
                      <span>Submit Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
