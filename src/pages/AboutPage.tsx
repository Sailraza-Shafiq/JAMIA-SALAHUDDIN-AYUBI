import React from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const settings = JamiaStore.getSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>About Jamia Salahuddin Ayubi · جامعہ صلاح الدین ایوبی</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Sacred Tradition & Classical Excellence
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded under the direct leadership of <strong>{settings.directorName}</strong>, Jamia Salahuddin Ayubi represents an uncompromising revival of classical Islamic scholarship paired with modern intellectual competency.
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
            A Legacy of Faith, Rigor, and Service
          </h2>
          <p>
            Established in {settings.establishedYear}, <strong>Jamia Salahuddin Ayubi</strong> stands as a premier Islamic educational institution. Inspired by Sultan Salahuddin Ayubi—whose character synthesized profound devotion, classical scholarship, and moral fortitude—our mission is to cultivate scholars who embody piety and leadership.
          </p>
          <p>
            Our core methodology is rooted in authentic Sanad transmission with continuous chains of narration reaching the Holy Prophet Muhammad ﷺ, daily immersion in the Noble Quran with pristine Tajweed, and comprehensive study of classical Fiqh, Usul, and Hadith.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="px-5 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0f4a35] transition-all flex items-center gap-2"
            >
              <span>Explore Academic Courses</span>
              <ArrowRight className="w-4 h-4 text-[#D6B66C]" />
            </Link>
            <Link
              to="/admissions"
              className="px-5 py-2.5 bg-[#fdfaf2] text-[#176B4D] border border-[#D6B66C] font-bold text-xs rounded-xl hover:bg-[#faeecf] transition-all"
            >
              Admission Guidelines
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#D6B66C] shadow-xl h-80 sm:h-96">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
              alt="Jamia Salahuddin Ayubi Scholars"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f4a35]/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="font-arabic text-lg text-[#D6B66C] font-bold block">
                جامعة صلاح الدين الأيوبي الإسلامية
              </span>
              <p className="text-xs text-emerald-100">
                Main Academic Campus · Directed by Muneeb ur Rehman
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif-heading font-bold text-base text-slate-900">Authentic Isnad</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous traditional transmission of prophetic Hadith (*Sihah Sitta*) and legal jurisprudence through certified Asatiza.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#fdfaf2] text-[#b89344] flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif-heading font-bold text-base text-slate-900">Spiritual Tarbiyah</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Holistic character refinement, congregational Tahajjud, and moral etiquette (*Adab*) guiding daily student behavior.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif-heading font-bold text-base text-slate-900">Modern Competence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integrated computer sciences, web development, research methodologies, and scholarly English communication.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#fdfaf2] text-[#b89344] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif-heading font-bold text-base text-slate-900">Bannat Wing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fully segregated, dedicated female campus offering complete Dars-e-Nizami under qualified female Islamic scholars.
          </p>
        </div>
      </div>

      {/* Leadership Statement Banner */}
      <div className="bg-[#176B4D] rounded-3xl p-8 sm:p-12 text-white border-2 border-[#D6B66C] shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#D6B66C] font-bold">
            Official Management Statement
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold leading-snug">
            &ldquo;We do not merely teach books; we cultivate the prophetic legacy in the hearts of students.&rdquo;
          </h2>
          <p className="text-sm text-emerald-100 leading-relaxed">
            Under the administration of <strong>{settings.directorName}</strong>, Jamia Salahuddin Ayubi ensures that tuition is never an obstacle to seeking sacred knowledge through generous endowment scholarships.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#D6B66C]">
            <span>{settings.directorName}</span>
            <span className="text-emerald-300">·</span>
            <span>{settings.directorTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
