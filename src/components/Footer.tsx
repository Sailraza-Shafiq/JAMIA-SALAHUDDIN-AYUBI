import React from 'react';
import { Link } from 'react-router-dom';
import { JamiaLogo } from './JamiaLogo';
import { JamiaStore } from '../lib/storage';
import { ShieldCheck, Mail, Phone, MapPin, Award, BookOpen, GraduationCap, CreditCard, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  onOpenVerify: () => void;
  onOpenAI: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVerify, onOpenAI }) => {
  const settings = JamiaStore.getSettings();

  return (
    <footer className="bg-[#176B4D] text-white pt-16 pb-10 border-t-4 border-[#D6B66C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/80">
          {/* Col 1: Institute Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <JamiaLogo size="lg" variant="monochrome" showText={true} />
            </Link>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Jamia Salahuddin Ayubi is a premier Islamic educational institute synthesizing classical Islamic sciences (Dars-e-Nizami, Hifz, Qirat, Ifta) with contemporary intellectual, digital and linguistic competencies.
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-[#D6B66C] font-semibold block uppercase tracking-wider">
                Founder & Director General
              </span>
              <strong className="text-sm text-white font-serif-heading">
                {settings.directorName}
              </strong>
            </div>
          </div>

          {/* Col 2: Academic Faculties */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-sm text-[#D6B66C] uppercase tracking-wider">
              Academic Pages
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors block">
                  About Jamia & Foundation History
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white hover:underline transition-colors block">
                  Courses & Syllabi (Alimiyyah & Hifz)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-white hover:underline transition-colors block">
                  Educational & Campus Facilities
                </Link>
              </li>
              <li>
                <Link to="/management" className="hover:text-white hover:underline transition-colors block">
                  Management & Executive Leadership
                </Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-white hover:underline transition-colors block">
                  Staff & Senior Asatiza Directory
                </Link>
              </li>
              <li>
                <Link to="/advertisements" className="hover:text-white hover:underline transition-colors block">
                  Promotional Media & Prospectus
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors block">
                  Contact & Campus Visiting Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Digital Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-sm text-[#D6B66C] uppercase tracking-wider">
              Admissions & ID System
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link to="/admissions" className="hover:text-white hover:underline transition-colors block">
                  Admissions Criteria & Roadmap
                </Link>
              </li>
              <li>
                <Link to="/admissions/apply" className="hover:text-white hover:underline transition-colors block font-semibold text-[#D6B66C]">
                  Online Admission Application Form
                </Link>
              </li>
              <li>
                <Link to="/id-cards" className="hover:text-white hover:underline transition-colors block">
                  Student ID Card Generator (CR80)
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenVerify}
                  className="text-[#D6B66C] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Credential Verification Portal</span>
                </button>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6B66C]" />
                  <span>AI Academic Student Assistant</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-emerald-800">
                <Link to="/admin/login" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 text-emerald-300">
                  <Lock className="w-3 h-3 text-[#D6B66C]" />
                  <span>Management Software Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Information */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-sm text-[#D6B66C] uppercase tracking-wider">
              Campus & Secretariat
            </h4>
            <div className="space-y-2 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6B66C] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D6B66C] shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6B66C] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="pt-2 text-[11px] text-emerald-200">
                <span>Academic Office Hours: 08:00 AM – 04:00 PM (Mon–Sat)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Jamia Salahuddin Ayubi (<span className="font-arabic font-semibold text-[#D6B66C]">جامعہ صلاح الدین ایوبی</span>). All Rights Reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Director & Management: <strong>{settings.directorName}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-300">Deep Green #176B4D</span>
            <span className="text-[#D6B66C]">Soft Gold #D6B66C</span>
            <span className="text-white">White #FFFFFF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
