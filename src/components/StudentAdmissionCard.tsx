import React, { useState, useEffect } from 'react';
import { CardData } from './StudentIdCard';
import { JamiaLogo } from './JamiaLogo';
import QRCode from 'qrcode';
import { ShieldCheck, CheckCircle2, User, Award, FileText, Calendar } from 'lucide-react';

interface StudentAdmissionCardProps {
  data: CardData;
  onVerify?: (ref: string) => void;
  className?: string;
}

export const StudentAdmissionCard: React.FC<StudentAdmissionCardProps> = ({
  data,
  onVerify,
  className = '',
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const secureRef = `JSA-ADM-${btoa(data.studentId || 'ADMISSION-PERMIT').replace(/=/g, '').slice(0, 12).toUpperCase()}`;
    const verificationUrl = `https://jsa.edu.pk/verify?admission=${secureRef}`;

    QRCode.toDataURL(verificationUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#176B4D',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('Admission QR note:', err));
  }, [data.studentId]);

  const secureReference = `JSA-ADM-${btoa(data.studentId || 'ADMISSION-PERMIT').replace(/=/g, '').slice(0, 10).toUpperCase()}`;

  return (
    <div
      className={`w-full max-w-[620px] bg-white rounded-3xl border-2 border-[#D6B66C] shadow-xl overflow-hidden text-slate-800 select-none relative ${className}`}
      style={{
        boxShadow: '0 12px 36px -6px rgba(23, 107, 77, 0.15), 0 4px 16px -2px rgba(214, 182, 108, 0.2)',
      }}
    >
      {/* Decorative Gold & Green Corner Ribbons */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D]" />

      {/* Islamic Top Header */}
      <div className="pt-6 pb-4 px-6 sm:px-8 border-b-2 border-[#D6B66C]/40 bg-gradient-to-b from-[#f2f8f5] to-white text-center">
        <div className="font-arabic text-base sm:text-lg text-[#176B4D] font-bold tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <JamiaLogo size={52} showText={false} />
          <div className="text-center sm:text-left">
            <h2 className="font-serif-heading text-lg sm:text-xl font-extrabold text-[#176B4D] tracking-wider leading-tight">
              {data.instituteName || 'JAMIA SALAHUDDIN AYUBI'}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <span className="font-arabic text-sm text-[#b89344] font-bold">
                جامعة صلاح الدين الأيوبي
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-600 font-medium">Session {data.academicSession || '2026-2027'}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#176B4D] text-[#D6B66C] text-xs font-bold uppercase tracking-widest shadow-xs">
          <Award className="w-3.5 h-3.5" />
          <span>Official Admission & Entry Card · بطاقة القبول والدخول</span>
        </div>
      </div>

      {/* Card Content Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Top Info Banner with Photograph and QR */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#e5ece8]">
          {/* Photograph with Official Admitted Stamp */}
          <div className="relative shrink-0">
            <div className="w-[110px] h-[135px] rounded-2xl overflow-hidden border-2 border-[#176B4D] p-1 bg-white shadow-md relative">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.studentName || 'Student'}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-[#f8faf9] flex flex-col items-center justify-center text-slate-400 rounded-xl border border-dashed border-[#176B4D]/30">
                  <User className="w-10 h-10 text-[#176B4D]/40" />
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Photo</span>
                </div>
              )}

              {/* Gold Circular Admitted Watermark Stamp */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#D6B66C] to-[#b89344] text-[#176B4D] font-extrabold text-[8px] px-2 py-0.5 rounded-full border border-white shadow-md uppercase tracking-wider">
                ✓ Admitted
              </div>
            </div>

            {/* Candidate Signature Box */}
            <div className="mt-2.5 w-[110px] text-center border-t border-slate-300 pt-1">
              <span className="text-[9px] text-slate-500 font-medium block">
                Candidate Sign
              </span>
              <span className="font-arabic text-[10px] text-slate-400">
                دستخط امیدوار
              </span>
            </div>
          </div>

          {/* Student Dossier Table */}
          <div className="flex-1 w-full space-y-3">
            {/* Admission Number Gold Pill */}
            <div className="flex items-center justify-between bg-[#fdfaf2] p-2.5 rounded-xl border border-[#D6B66C]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Admission / Roll Number:
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#176B4D]">
                  {data.studentId || <span className="text-slate-300">JSA-2026-XXXX</span>}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#176B4D] text-[#D6B66C] text-[10px] font-bold uppercase tracking-wider">
                {data.gender === 'female' ? 'Bannat Wing' : 'Boys Campus'}
              </span>
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Student Full Name:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {data.studentName || <span className="text-slate-300 italic">Full Name</span>}
                </span>
                {data.urduName && (
                  <span className="font-arabic text-xs font-bold text-[#176B4D] block mt-0.5">
                    {data.urduName}
                  </span>
                )}
              </div>

              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Father&apos;s Name:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {data.fatherName || <span className="text-slate-300 italic">—</span>}
                </span>
              </div>

              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Course / Program:</span>
                <span className="font-bold text-[#176B4D]">
                  {data.course || <span className="text-slate-300 italic">Dars-e-Nizami</span>}
                </span>
              </div>

              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Class / Section:</span>
                <span className="font-bold text-slate-900">
                  {data.classSection || <span className="text-slate-300 italic">—</span>}
                </span>
              </div>

              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Date of Admission:</span>
                <span className="font-medium text-slate-800">
                  {data.admissionDate || '2026-03-01'}
                </span>
              </div>

              <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e5ece8]">
                <span className="text-[10px] text-slate-500 block">Emergency / Contact:</span>
                <span className="font-medium text-slate-800">
                  {data.contactNumber || 'Optional / Unspecified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Admission Instructions & Entry Rules */}
        <div className="bg-[#f2f8f5] p-3.5 rounded-2xl border border-[#176B4D]/30 space-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-[#176B4D]">
            <FileText className="w-4 h-4 text-[#D6B66C]" />
            <span>Instructions for the Admitted Student:</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-600 pl-1 leading-relaxed text-[10.5px]">
            <li>This official admission card must be carried for entry into classes, madrasa premises, and examinations.</li>
            <li>80% mandatory attendance is required in Quran recitation, memorization, and classical Islamic texts.</li>
            <li>Students must strictly observe Islamic etiquette and the prescribed madrasa attire.</li>
          </ol>
        </div>

        {/* Verification QR & Signatures Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* Encrypted QR Verification Box */}
          <div
            className="flex items-center gap-3 p-2 bg-[#fdfaf2] rounded-2xl border border-[#D6B66C] cursor-pointer hover:border-[#176B4D] transition-colors"
            onClick={() => onVerify && onVerify(data.studentId || 'DEMO')}
            title="Scan to verify admission authenticity"
          >
            {qrUrl ? (
              <img src={qrUrl} alt="Admission QR Code" className="w-[68px] h-[68px] rounded-lg bg-white p-1" />
            ) : (
              <div className="w-[68px] h-[68px] bg-white rounded-lg flex items-center justify-center text-[9px] text-slate-400">
                Loading
              </div>
            )}
            <div className="text-left">
              <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Security Verification:</span>
              <span className="font-mono text-[10px] font-bold text-[#176B4D] block">{secureReference}</span>
              <span className="text-[8.5px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#176B4D]" />
                Jamia Verified
              </span>
            </div>
          </div>

          {/* Dual Attestation Signatures */}
          <div className="flex items-end gap-6 text-center">
            {/* Registrar Office Signature */}
            <div className="flex flex-col items-center">
              <div className="h-9 w-24 border-b-2 border-slate-400 flex items-end justify-center pb-1">
                <span className="font-arabic text-xs text-slate-500">دفترِ داخلہ</span>
              </div>
              <span className="text-[9.5px] font-bold text-slate-700 mt-1 uppercase">
                Registrar Office
              </span>
              <span className="text-[8px] text-slate-500">Admissions Desk</span>
            </div>

            {/* Director Official Stamp & Signature */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="font-arabic text-sm font-bold text-[#176B4D] italic leading-tight">
                  منیب الرحمن
                </div>
                <div className="h-0.5 w-28 bg-[#176B4D] my-0.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                Muneeb ur Rehman
              </span>
              <span className="text-[8.5px] text-[#b89344] font-semibold leading-none">
                Director, Jamia Salahuddin Ayubi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D]" />
    </div>
  );
};
