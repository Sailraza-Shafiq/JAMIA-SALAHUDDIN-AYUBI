import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Building,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  CreditCard,
  Check,
  Send,
  CheckCircle2,
  Upload,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const settings = JamiaStore.getSettings();
  const courses = JamiaStore.getCourses();

  // Quick Admission Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    program: 'Dars-e-Nizami (Alimiyyah)',
    message: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Quick photo upload trigger for Director Muneeb ur Rehman's frame
  const handleDirectorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      JamiaStore.updateSettings({ directorPhotoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryForm({ name: '', phone: '', program: 'Dars-e-Nizami (Alimiyyah)', message: '' });
      setInquirySubmitted(false);
    }, 4000);
  };

  // 6 Primary Courses for Clean Preview
  const previewCourses = courses.slice(0, 6);

  // 4 Core Verified Facilities
  const previewFacilities = [
    {
      name: 'Quran Learning Environment',
      arabicName: 'حلقات تحفيظ القرآن الكريم',
      desc: 'Serene, peaceful circular Halaqah formations dedicated to memorization with traditional wooden study Rehals.',
      image: '/src/assets/images/facility_quran_environment_1793985364020.jpg',
    },
    {
      name: 'Grand Maktaba Library',
      arabicName: 'المكتبة المركزية والبحث العلمي',
      desc: 'Rare Islamic manuscripts, comprehensive Fiqh encyclopedias, Hadith commentaries, and digital research archives.',
      image: '/src/assets/images/facility_library_maktaba_1793985364590.jpg',
    },
    {
      name: 'Spacious Prayer Hall (Masjid)',
      arabicName: 'المسجد الجامع للصلاة والاعتكاف',
      desc: 'Dignified prayer halls hosting five daily congregational prayers, Friday sermon, and Tahajjud assemblies.',
      image: '/src/assets/images/facility_prayer_hall_1793985365140.jpg',
    },
    {
      name: 'Academic Classrooms',
      arabicName: 'القاعات الدراسية النموذجية',
      desc: 'Well-ventilated, quiet lecture halls designed for disciplined transmission of Dars-e-Nizami and Shariyat curricula.',
      image: '/src/assets/images/facility_classrooms_1793985367194.jpg',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#f8faf9] text-[#15241e]">
      {/* =========================================================================
          1. SACRED ISLAMIC HERO SECTION
          - Spiritual Bismillah Calligraphy
          - Reverent Madinah Imagery (Prophetic inspiration)
          - Male Madrasa Students Studying Holy Quran & Dars on wooden Rehals
          - Exact Institute Name: Jamia Salahuddin Ayubi
          - Clean Primary Action Buttons
         ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-[#f2f8f5] via-white to-[#f8faf9] border-b border-[#e5ece8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          {/* Spiritual Bismillah Header */}
          <div className="text-center space-y-2">
            <p className="font-arabic text-2xl sm:text-3xl text-[#176B4D] font-bold tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-[#b89344] font-semibold">
              <span className="w-8 h-[1px] bg-[#D6B66C]" />
              <span className="uppercase tracking-wider">جامعة صلاح الدين الأيوبي الإسلامية</span>
              <span className="w-8 h-[1px] bg-[#D6B66C]" />
            </div>
          </div>

          {/* Reverent Spiritual Visual Banner: Al-Madinah Al-Munawwarah */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#D6B66C]/60 group">
            <div className="h-56 sm:h-72 md:h-80 w-full relative">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&auto=format&fit=crop&q=85"
                alt="Al-Madinah Al-Munawwarah - The Prophet's City"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              {/* Emerald & Gold Atmosphere Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f4a35] via-[#176B4D]/50 to-transparent" />

              {/* Spiritual Banner Caption */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6B66C] text-[#0f4a35] text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Prophetic Inspiration & Spiritual Sanctuary</span>
                  </div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold tracking-wide">
                    Al-Madinah Al-Munawwarah (المدينة المنورة)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                    Drawing eternal inspiration from the pristine sunnah of the Holy Prophet Muhammad ﷺ in preserving sacred Quranic and Hadith scholarship.
                  </p>
                </div>

                <div className="text-right hidden md:block">
                  <span className="font-arabic text-xl text-[#D6B66C] font-bold block">
                    طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ
                  </span>
                  <span className="text-[11px] text-emerald-200">
                    &ldquo;Seeking sacred knowledge is an obligation upon every Muslim.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Hero Grid: Institutional Presentation + Male Students Studying Quran */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Institute Welcome & Overview (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D6B66C] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#176B4D]" />
                <span className="text-xs font-bold text-[#176B4D] tracking-wider uppercase">
                  Admissions Open 2026–2027
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-arabic text-xs font-bold text-[#b89344]">
                  جامعہ صلاح الدین ایوبی
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#176B4D] tracking-tight leading-[1.15]">
                  Welcome to Jamia Salahuddin Ayubi
                </h1>
                <p className="font-arabic text-2xl text-[#b89344] font-bold">
                  جامعہ صلاح الدین ایوبی الإسلامية
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                An esteemed sanctuary of sacred learning committed to cultivating authentic Islamic scholars, Huffaz-ul-Quran, and legal jurists grounded in Quran and Sunnah. Under the guidance of{' '}
                <strong className="text-[#176B4D] font-bold">{settings.directorName}</strong> (Founder & Director General), we seamlessly unite classical Islamic sciences (Dars-e-Nizami, Hifz, Tajweed, Shariyat) with essential modern intellectual, digital, and linguistic proficiencies.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/courses"
                  className="px-6 py-3 bg-white hover:bg-[#f8faf9] text-[#176B4D] font-bold text-xs sm:text-sm rounded-xl border-2 border-[#176B4D] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#176B4D]" />
                  <span>Explore Courses</span>
                  <ChevronRight className="w-4 h-4 text-[#D6B66C]" />
                </Link>

                <Link
                  to="/admissions/apply"
                  className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
                  <span>Online Admission</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/id-cards"
                  className="px-4 py-3 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#b89344]" />
                  <span>Student ID Cards</span>
                </Link>
              </div>

              {/* Core Pillars */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="font-serif-heading text-xl sm:text-2xl font-extrabold text-[#176B4D]">8 Years</span>
                  <span className="block text-xs text-slate-500 font-medium mt-0.5">Dars-e-Nizami Alimiyyah</span>
                </div>
                <div>
                  <span className="font-serif-heading text-xl sm:text-2xl font-extrabold text-[#176B4D]">Certified</span>
                  <span className="block text-xs text-slate-500 font-medium mt-0.5">Sanad Chains & Qaris</span>
                </div>
                <div>
                  <span className="font-serif-heading text-xl sm:text-2xl font-extrabold text-[#176B4D]">100%</span>
                  <span className="block text-xs text-slate-500 font-medium mt-0.5">Huffaz & Orphan Aid</span>
                </div>
              </div>
            </div>

            {/* Right Column: Male Madrasa Students Studying Holy Quran (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-2 border-[#D6B66C]/60 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#176B4D]/30 h-72 sm:h-80 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80"
                    alt="Male madrasa students studying Holy Quran and Dars on study Rehals"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#D6B66C] block">
                      Sacred Student Life (طَلَبُ الْعِلْمِ)
                    </span>
                    <p className="text-xs font-semibold leading-snug text-emerald-100">
                      Students engaged in daily memorization, accurate Tajweed recitation, and classical Fiqh Halaqah.
                    </p>
                  </div>
                </div>

                {/* Institute Seal Summary Card */}
                <div className="p-3.5 bg-[#f2f8f5] rounded-2xl border border-[#176B4D]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <JamiaLogo size={40} showText={false} />
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
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Founder & DG:</span>
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
          - Respectful, scholarly overview of Jamia Salahuddin Ayubi
          - Core foundational values (Ikhlas, Adab, Itqan, Khidmah)
          - Non-mixed gender arrangements (Boys Campus & Girls Bannat Wing)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece8] shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              About Our Foundation & Educational Philosophy
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
              Preserving Sacred Heritage, Inspiring Righteous Minds
            </h2>
            <div className="w-16 h-1 bg-[#D6B66C] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Jamia Salahuddin Ayubi</strong> was established to provide an unyielding standard of classical Islamic education while addressing the challenges and intellectual demands of contemporary times. Named after Sultan Salahuddin Ayubi—a model of spiritual piety, profound scholarship, and moral fortitude—our institute molds graduates who embody deep adherence to the Sunnah and civic leadership.
              </p>
              <p>
                Our pedagogical methodology revolves around uninterrupted teacher-student transmission (*Isnad*), daily immersion in Quranic recitation, classical Arabic linguistics, Usul al-Fiqh, and comprehensive study of the canonical Hadith anthologies (*Sihah Sitta*).
              </p>
            </div>

            <div className="space-y-4">
              <p>
                In strict adherence to Islamic principles of modesty, Jamia Salahuddin Ayubi maintains separate, independent campuses for Male students (Boys Main Campus) and Female students (Girls Bannat Wing), each directed by qualified, dedicated scholars.
              </p>
              <div className="p-4 bg-[#f8faf9] rounded-2xl border border-[#D6B66C]/40 space-y-2">
                <h4 className="font-serif-heading font-bold text-xs text-[#176B4D] uppercase tracking-wide">
                  Core Madrasa Values
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ikhlas (Sincerity in Intent)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adab (Moral Etiquette)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Itqan (Mastery & Scholarly Rigor)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Khidmah (Selfless Ummah Service)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <Link
              to="/about"
              className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1.5"
            >
              <span>Read Full History & Academic Charter</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#b89344]" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. OWNER & DIRECTOR PROFILE: MUNEEB UR REHMAN
          - Official Name: Muneeb ur Rehman
          - Title: Founder & Director General
          - NO female photograph!
          - Elegant, professionally cropped Islamic gold frame
          - Actual photo if provided by user / upload capability, otherwise dignified seal
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#176B4D] shadow-md relative overflow-hidden space-y-8">
          {/* Subtle Islamic Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            {/* Owner Photograph Frame */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-56 rounded-3xl overflow-hidden border-4 border-[#D6B66C] shadow-lg p-1 bg-white relative group">
                {settings.directorPhotoUrl ? (
                  <img
                    src={settings.directorPhotoUrl}
                    alt="Muneeb ur Rehman - Founder & Director General"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#f2f8f5] to-white flex flex-col items-center justify-center p-4 border border-[#176B4D]/20 text-center space-y-2">
                    <JamiaLogo size={68} showText={false} />
                    <div>
                      <span className="font-serif-heading text-xs font-extrabold text-[#176B4D] block uppercase tracking-wide">
                        Muneeb ur Rehman
                      </span>
                      <span className="font-arabic text-xs text-[#b89344] font-bold block mt-0.5">
                        بانی ومدیر اعلیٰ
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Jamia Salahuddin Ayubi
                    </span>
                  </div>
                )}

                {/* Verified Leadership Tag */}
                <div className="absolute bottom-2.5 right-2.5 bg-[#176B4D] text-[#D6B66C] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#D6B66C] shadow-xs">
                  Official Profile
                </div>
              </div>

              {/* Identity Details */}
              <div>
                <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                  Muneeb ur Rehman
                </h3>
                <span className="text-xs font-bold text-[#b89344] block mt-0.5">
                  Founder & Director General
                </span>
                <span className="font-arabic text-sm text-slate-500 font-bold block mt-1">
                  بانی ومدیر اعلیٰ: منیب الرحمن
                </span>
              </div>

              {/* Upload / Replace Photo option for Muneeb ur Rehman */}
              <label className="text-[11px] font-semibold text-[#176B4D] hover:underline cursor-pointer flex items-center gap-1.5 bg-[#f2f8f5] px-3 py-1.5 rounded-lg border border-[#176B4D]/20">
                <Upload className="w-3.5 h-3.5 text-[#b89344]" />
                <span>Upload Original Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDirectorPhotoUpload}
                />
              </label>
            </div>

            {/* Director Message & Institutional Stewardship */}
            <div className="md:col-span-8 space-y-5 text-left">
              <div className="inline-block px-3 py-1 bg-[#f2f8f5] text-[#176B4D] rounded-lg text-xs font-bold uppercase tracking-wider">
                Leadership Message & Stewardship
              </div>

              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                &ldquo;Cultivating Scholars Grounded in Revelation, Equipped with Moral Integrity for the Ummah.&rdquo;
              </h2>

              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  Assalamu Alaikum wa Rahmatullahi wa Barakatuh.
                </p>
                <p>
                  At <strong>Jamia Salahuddin Ayubi</strong>, our foremost sacred duty is to preserve the authentic transmission of classical Islamic sciences while instilling sincere adab (manners), piety, and intellectual rigor in every student who enters our gates.
                </p>
                <p>
                  Under our educational stewardship, we ensure that no deserving seeker of knowledge is turned away due to financial constraints. We warmly invite students and parents to join this blessed educational sanctuary.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/management"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Read Full Management Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6B66C]" />
                </Link>

                <Link
                  to="/staff"
                  className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-1.5"
                >
                  <span>Faculty & Asatiza Directory</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CLEAN COURSES PREVIEW
          - Recognised categories: Hifz, Nazra, Tajweed, Shariyat, Dars-e-Nizami, Arabic
          - Clean cards without visual clutter
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e5ece8]">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Recognized Islamic Disciplines
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
              Academic Programs & Syllabi
            </h2>
          </div>

          <Link
            to="/courses"
            className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ChevronRight className="w-4 h-4 text-[#D6B66C]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 border border-[#e5ece8] hover:border-[#176B4D] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2.5 py-1 rounded-md">
                    {course.code}
                  </span>
                  <span className="text-slate-500 font-medium">{course.department}</span>
                </div>

                <div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="font-bold text-slate-900 hover:text-[#176B4D] transition-colors text-base block leading-snug"
                  >
                    {course.title}
                  </Link>
                  <span className="font-arabic text-sm text-[#b89344] font-bold block mt-0.5">
                    {course.arabicTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Instructor: <strong className="text-slate-800">{course.instructor}</strong>
                </span>
                <Link
                  to={`/courses/${course.id}`}
                  className="px-3 py-1.5 bg-[#f2f8f5] hover:bg-[#176B4D] text-[#176B4D] hover:text-white font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. VERIFIED FACILITIES PREVIEW
          - Authentic photographs of Quran Halaqahs, Library, Masjid, Classrooms
          - No fake claims; real educational resources
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e5ece8]">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Educational Sanctuary
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#176B4D]">
              Verified Campus Facilities
            </h2>
          </div>

          <Link
            to="/facilities"
            className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1"
          >
            <span>Explore All Facilities</span>
            <ChevronRight className="w-4 h-4 text-[#D6B66C]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewFacilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#e5ece8] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                <img
                  src={fac.image}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D6B66C]" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-serif-heading font-bold text-sm text-slate-900 group-hover:text-[#176B4D] transition-colors">
                    {fac.name}
                  </h4>
                  <span className="font-arabic text-xs text-[#b89344] font-bold block mt-0.5">
                    {fac.arabicName}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {fac.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. SIMPLE DIGNIFIED INQUIRY & CONTACT SECTION
          - Clean direct admission contact
          - No generic corporate fluff
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5ece8] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                Admissions & Information Desk
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#176B4D]">
                Connect with Jamia Salahuddin Ayubi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our admissions secretariat is delighted to assist parents and prospective candidates regarding course requirements, boarding arrangements, and admission forms.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#176B4D] shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#176B4D] shrink-0" />
                  <span>{settings.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#176B4D] shrink-0" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#176B4D] shrink-0" />
                  <span>Mon – Sat: 08:00 AM – 04:00 PM</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B4D] hover:underline"
                >
                  <span>Visiting Hours & Campus Map</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#b89344]" />
                </Link>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="lg:col-span-7 bg-[#f8faf9] p-6 rounded-2xl border border-[#D6B66C]/40 space-y-4">
              <div>
                <h4 className="font-serif-heading font-bold text-base text-slate-900">
                  Send Admission Inquiry
                </h4>
                <p className="text-xs text-slate-500">
                  Submit your query directly to the admissions desk under Muneeb ur Rehman.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1.5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <h5 className="font-bold text-emerald-900 text-xs sm:text-sm">Inquiry Received</h5>
                  <p className="text-xs text-emerald-700">
                    JazakAllah Khair. The admissions office will respond via WhatsApp or phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
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
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
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

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Program of Interest</label>
                    <select
                      value={inquiryForm.program}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                    >
                      <option value="Hifz-ul-Quran">Hifz-ul-Quran</option>
                      <option value="Nazra Quran">Nazra Quran</option>
                      <option value="Tajweed-ul-Quran">Tajweed-ul-Quran</option>
                      <option value="Shariyat Course">Shariyat Course</option>
                      <option value="Dars-e-Nizami (Alimiyyah)">Dars-e-Nizami (Alimiyyah)</option>
                      <option value="Arabic Language">Arabic Language</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Question / Note (Optional)</label>
                    <textarea
                      rows={2}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Inquire about boarding, class arrangements, or scholarships..."
                      className="w-full p-2.5 bg-white border border-[#e5ece8] focus:border-[#176B4D] rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Submit Admission Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
