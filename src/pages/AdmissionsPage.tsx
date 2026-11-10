import React from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Heart,
  Clock,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdmissionsPage: React.FC = () => {
  const settings = JamiaStore.getSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Academic Session 2026-2027 · Jamia Salahuddin Ayubi</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Admissions & Enrollment Portal
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive enrollment guidelines, eligibility requirements, entrance schedules, and scholarship policies overseen by <strong>{settings.directorName}</strong>.
        </p>

        <div className="pt-2">
          <Link
            to="/admissions/apply"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
          >
            <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
            <span>Open Online Admission Form</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* 4 Steps Roadmap */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
            Admissions Process & Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simple 4-stage process to secure your enrollment at Jamia Salahuddin Ayubi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-3 relative">
            <span className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">01.</span>
            <h3 className="font-bold text-slate-900 text-base">Online Registration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete the online registration form with student identity details, guardian contacts, previous education, and program selection.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-3 relative">
            <span className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">02.</span>
            <h3 className="font-bold text-slate-900 text-base">Document Submission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit copies of B-Form / CNIC, guardian contact info, four passport photographs, and previous academic or Nazra certificates.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-3 relative">
            <span className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">03.</span>
            <h3 className="font-bold text-slate-900 text-base">Entrance Interview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attend a cordial oral recitation and aptitude assessment with faculty scholars assessing reading fluency and dedication.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-3 relative">
            <span className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">04.</span>
            <h3 className="font-bold text-slate-900 text-base">Roll No & ID Card</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved candidates receive their unique Roll Number (`JSA-2026-XXX`), hostel room allocation, and digital verified smart ID Card.
            </p>
          </div>
        </div>
      </div>

      {/* Program Eligibility Matrix */}
      <div className="bg-white rounded-3xl p-8 border border-[#e5ece8] shadow-md space-y-6">
        <h2 className="font-serif-heading text-xl font-bold text-slate-900">
          Faculty Eligibility Criteria
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                <th className="py-3 px-4">Faculty / Program</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Prerequisite Qualification</th>
                <th className="py-3 px-4">Resident Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-[#f2f8f5]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-[#176B4D]">Dars-e-Nizami (Al-Alimiyyah)</td>
                <td className="py-4 px-4 text-slate-700">8 Years (Year 1 to 8)</td>
                <td className="py-4 px-4 text-slate-600">Middle / Matriculation + Nazra Quran</td>
                <td className="py-4 px-4 text-slate-600">Hostel Boarder / Day Scholar</td>
                <td className="py-4 px-4 text-center">
                  <Link to="/admissions/apply" className="text-xs font-bold text-[#176B4D] hover:underline">Apply</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#f2f8f5]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-[#176B4D]">Hifz-ul-Quran with Tajweed</td>
                <td className="py-4 px-4 text-slate-700">2 – 3 Years</td>
                <td className="py-4 px-4 text-slate-600">Age 9–14 + Fluent Nazra Quran</td>
                <td className="py-4 px-4 text-slate-600">Full-Time Boarder Recommended</td>
                <td className="py-4 px-4 text-center">
                  <Link to="/admissions/apply" className="text-xs font-bold text-[#176B4D] hover:underline">Apply</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#f2f8f5]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-[#176B4D]">Tajweed & Qirat-e-Saba</td>
                <td className="py-4 px-4 text-slate-700">2 Years</td>
                <td className="py-4 px-4 text-slate-600">Hafiz-ul-Quran or Alim</td>
                <td className="py-4 px-4 text-slate-600">Boarder / Day Scholar</td>
                <td className="py-4 px-4 text-center">
                  <Link to="/admissions/apply" className="text-xs font-bold text-[#176B4D] hover:underline">Apply</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#f2f8f5]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-[#176B4D]">Takhassus fi al-Fiqh (Ifta)</td>
                <td className="py-4 px-4 text-slate-700">2 Years (Post-Graduate)</td>
                <td className="py-4 px-4 text-slate-600">Shahadat-ul-Alimiyyah (Fazil) with High Standing</td>
                <td className="py-4 px-4 text-slate-600">Resident Research Scholar</td>
                <td className="py-4 px-4 text-center">
                  <Link to="/admissions/apply" className="text-xs font-bold text-[#176B4D] hover:underline">Apply</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#f2f8f5]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-[#176B4D]">Modern IT & Computer Sciences</td>
                <td className="py-4 px-4 text-slate-700">1 Year (Diploma)</td>
                <td className="py-4 px-4 text-slate-600">Open to all Jamia students</td>
                <td className="py-4 px-4 text-slate-600">Integrated Course</td>
                <td className="py-4 px-4 text-center">
                  <Link to="/admissions/apply" className="text-xs font-bold text-[#176B4D] hover:underline">Apply</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scholarship & Concession Guarantee */}
      <div className="bg-[#fdfaf2] rounded-3xl p-8 sm:p-10 border-2 border-[#D6B66C] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#b89344] font-bold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Merit & Orphan Endowment Fund</span>
          </div>
          <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
            Guaranteed 100% Scholarships
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Under the directives of <strong>Director Muneeb ur Rehman</strong>, no deserving student is denied sacred education due to financial hardship. Full tuition, boarding, books, and meals are supported by our endowment.
          </p>
        </div>

        <Link
          to="/admissions/apply"
          className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
        >
          Submit Admission Form Now
        </Link>
      </div>
    </div>
  );
};
