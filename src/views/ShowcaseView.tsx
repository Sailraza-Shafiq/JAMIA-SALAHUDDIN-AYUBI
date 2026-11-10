import React, { useState } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  Megaphone,
  GraduationCap,
  Award,
  Sparkles,
  Download,
  Calendar,
  Share2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface ShowcaseViewProps {
  onNavigateToApply: () => void;
  onOpenAI: () => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ onNavigateToApply, onOpenAI }) => {
  const settings = JamiaStore.getSettings();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('admissions');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
          Jamia Salahuddin Ayubi · Media & Public Relations
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
          Promotional Advertisement Showcase
        </h1>
        <p className="text-sm text-slate-600">
          Official campaigns, convocation announcements, scholarship drives, and academic prospectus
        </p>

        {/* Campaign Filter Badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'admissions', label: 'Admissions Campaign 2026' },
            { id: 'convocation', label: 'Dastar-e-Fazeelat Convocation' },
            { id: 'scholarship', label: 'Merit Endowment Fund' },
            { id: 'prospectus', label: 'Academic Prospectus' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCampaign(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCampaign === c.id
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#e5ece8] hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ADMISSIONS 2026 FEATURED CAMPAIGN BANNER */}
      {(selectedCampaign === 'admissions' || selectedCampaign === 'all') && (
        <section className="bg-gradient-to-r from-[#176B4D] via-[#1B7A58] to-[#0f4a35] rounded-3xl text-white p-8 sm:p-12 border-2 border-[#D6B66C] shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B66C] text-[#0f4a35] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Annual Admissions Drive 2026-2027</span>
              </div>

              <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold leading-tight">
                Empower Your Child with Revelation and Modern Competence
              </h2>

              <p className="font-arabic text-xl text-[#D6B66C] font-bold">
                باب القبول والتسجيل مفتوح للعام الدراسي الجديد
              </p>

              <p className="text-sm text-emerald-100 leading-relaxed max-w-2xl">
                Jamia Salahuddin Ayubi invites applications for its celebrated 8-year Dars-e-Nizami Alimiyyah program, Full-time Hifz-ul-Quran with Tajweed, and Post-Graduate Islamic Jurisprudence (Ifta) integrated with Computer Sciences and English. Directed by <strong className="text-white">{settings.directorName}</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                  <strong className="block text-[#D6B66C] font-serif-heading text-sm">Full Boarding</strong>
                  <span className="text-emerald-100 text-[11px]">Hygienic mess & 24/7 mentoring</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                  <strong className="block text-[#D6B66C] font-serif-heading text-sm">100% Scholarships</strong>
                  <span className="text-emerald-100 text-[11px]">For Huffaz, orphans & needy</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                  <strong className="block text-[#D6B66C] font-serif-heading text-sm">Digital ID Cards</strong>
                  <span className="text-emerald-100 text-[11px]">Smart QR-verified identity</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onNavigateToApply}
                  className="px-6 py-3 bg-[#D6B66C] hover:bg-[#b89344] text-[#0f4a35] font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Apply Online Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Campaign'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-64 h-64 rounded-full bg-white/10 border-4 border-[#D6B66C]/60 flex items-center justify-center p-4 backdrop-blur-xs shadow-inner">
                <JamiaLogo size="2xl" showText={false} variant="monochrome" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. DASTAR-E-FAZEELAT CONVOCATION */}
      {(selectedCampaign === 'convocation' || selectedCampaign === 'all') && (
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece8] shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
                Graduation & Spiritual Milestone
              </span>
              <h3 className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                Annual Khatm-e-Bukhari & Dastar-e-Fazeelat Convocation
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar className="w-4 h-4 text-[#176B4D]" />
              <span>Upcoming Grand Ceremony</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 rounded-2xl overflow-hidden border-2 border-[#D6B66C] shadow-sm h-64">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
                alt="Convocation Ceremony"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="text-sm font-semibold text-slate-900">
                Honoring the graduates of the Dourat-ul-Hadith Sharif (Al-Alimiyyah Fazil Degree) and newly certified Huffaz of the Holy Quran.
              </p>
              <p>
                Under the presiding guidance of <strong>Director Muneeb ur Rehman</strong> and eminent guest scholars, each graduate will be crowned with the traditional Dastar-e-Fazeelat (Honorary Turban), awarded formal Sanad chains with continuous transmission back to the Holy Prophet Muhammad ﷺ, and presented their official institutional parchment.
              </p>
              <div className="p-3.5 bg-[#f8faf9] rounded-xl border border-[#e5ece8] space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Venue:</span>
                  <span>Grand Central Auditorium, Jamia Salahuddin Ayubi</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Chief Guest:</span>
                  <span>Muneeb ur Rehman & Council of Leading Muhadditheen</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Live Broadcast:</span>
                  <span className="text-[#176B4D] font-bold">Official Institute Digital Stream</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SCHOLARSHIP DRIVE */}
      {(selectedCampaign === 'scholarship' || selectedCampaign === 'all') && (
        <section className="bg-[#fdfaf2] rounded-3xl p-8 sm:p-12 border-2 border-[#D6B66C] shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Merit & Financial Endowment
            </span>
            <h3 className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
              Salahuddin Ayubi Student Endowment & Scholarship Fund
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              &ldquo;No deserving student shall ever be turned away from the pursuit of sacred Islamic knowledge due to financial limitation.&rdquo; — Founder Muneeb ur Rehman
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">Hafiz-ul-Quran Fellowship</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                100% tuition waiver and subsidized boarding for any student who has memorized the Noble Quran entering Dars-e-Nizami.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">Orphans Support Grant</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Full room, board, clothing, medical care, and text books provided with total dignity and discretion.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">Academic Excellence Award</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Monthly stipends awarded to top 5 rank holders in annual examinations across all academic years.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onNavigateToApply}
              className="px-5 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
            >
              Apply for Scholarship with Admission
            </button>
          </div>
        </section>
      )}

      {/* 4. DOWNLOADABLE PROSPECTUS */}
      {(selectedCampaign === 'prospectus' || selectedCampaign === 'all') && (
        <section className="bg-white rounded-3xl p-8 border border-[#e5ece8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-heading font-bold text-lg text-slate-900">
                Official Jamia Prospectus & Academic Syllabus (PDF)
              </h3>
              <p className="text-xs text-slate-500 max-w-lg">
                Complete guide containing department outlines, booklists for Dars-e-Nizami (Al-Ula to Al-Alimiyyah), hostel rules, and admission criteria.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.print();
            }}
            className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-[#D6B66C]" />
            <span>Download Official Prospectus</span>
          </button>
        </section>
      )}
    </div>
  );
};
