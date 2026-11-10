import React, { useState } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  UserCheck,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const settings = JamiaStore.getSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Admissions Inquiry',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'Admissions Inquiry',
        subject: '',
        message: '',
      });
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdfaf2] border border-[#D6B66C] text-[#b89344] text-xs font-bold uppercase tracking-wider">
          <Building className="w-3.5 h-3.5" />
          <span>General Secretariat & Admissions Directorate</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
          Contact Jamia Salahuddin Ayubi
        </h1>
        <h2 className="font-arabic text-xl sm:text-2xl text-[#b89344] font-bold">
          رابطہ جامعہ صلاح الدین ایوبی الإسلامية
        </h2>
        <p className="text-sm text-slate-600">
          Director & Management: <strong className="text-slate-900">{settings.directorName}</strong>. We welcome all inquiries regarding admissions, student affairs, and campus visitations.
        </p>
      </div>

      {/* Main Grid: Contact Cards & Direct Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Campus Info & Desk Contacts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-md space-y-5">
            <h3 className="font-serif-heading font-bold text-lg text-[#176B4D] pb-3 border-b border-slate-100">
              Campus Contact Details
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8]">
                <MapPin className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 text-sm font-semibold">Campus Address:</strong>
                  <span className="text-slate-600 mt-0.5 block">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8]">
                <Phone className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 text-sm font-semibold">Admissions Helpline:</strong>
                  <span className="text-slate-600 mt-0.5 block font-mono">{settings.contactPhone}</span>
                  <span className="text-[11px] text-[#176B4D] font-medium block mt-1">Available 08:00 AM – 04:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8]">
                <Mail className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 text-sm font-semibold">Official Email:</strong>
                  <span className="text-slate-600 mt-0.5 block font-mono">{settings.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8]">
                <Clock className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 text-sm font-semibold">Academic Visiting Hours:</strong>
                  <span className="text-slate-600 mt-0.5 block">Monday through Saturday</span>
                  <span className="text-[11px] text-slate-500 block">Morning: 08:30 AM – 01:00 PM | Afternoon: 02:00 PM – 04:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Directory */}
          <div className="bg-[#f2f8f5] rounded-3xl p-6 border border-[#176B4D]/20 space-y-3">
            <h4 className="font-serif-heading font-bold text-sm text-[#176B4D] uppercase tracking-wide">
              Direct Desk Directory
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                <span className="font-medium text-slate-800">Admissions Office:</span>
                <span className="font-mono text-[#176B4D] font-bold">Ext. 101</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                <span className="font-medium text-slate-800">Examination & ID Cards:</span>
                <span className="font-mono text-[#176B4D] font-bold">Ext. 104</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                <span className="font-medium text-slate-800">Accounts & Fee Voucher Desk:</span>
                <span className="font-mono text-[#176B4D] font-bold">Ext. 107</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                <span className="font-medium text-slate-800">Director Secretariat (Muneeb ur Rehman):</span>
                <span className="font-mono text-[#176B4D] font-bold">Ext. 110</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#e5ece8] shadow-md space-y-6">
          <div>
            <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
              Online Communication Desk
            </span>
            <h3 className="font-serif-heading text-2xl font-extrabold text-[#176B4D] mt-1">
              Send Official Inquiry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please provide complete details. Our academic registrar will respond via phone or WhatsApp within 24 working hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif-heading font-bold text-emerald-950 text-lg">
                Inquiry Successfully Logged!
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                JazakAllah Khair. Your official communication has been routed to the relevant department under the executive review of Director <strong>{settings.directorName}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Qari Abdul Qayyum"
                    className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Department Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none font-medium"
                  >
                    <option value="Admissions Inquiry">Admissions & Eligibility Inquiry</option>
                    <option value="Student ID Verification">Student ID Card Verification</option>
                    <option value="Scholarship & Zakat Fund">Scholarship & Fee Concession</option>
                    <option value="Hostel & Boarding">Hostel Accommodation & Facilities</option>
                    <option value="Faculty & Academic Guidance">Faculty & Curriculum Inquiry</option>
                    <option value="General Secretariat">General Secretariat / Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Admission in Dars-e-Nizami Al-Ula with hostel facility"
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please write your detailed inquiry or question here..."
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#D6B66C]" />
                <span>Submit Official Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
