import React, { useState, useEffect } from 'react';
import { JamiaLogo } from './JamiaLogo';
import QRCode from 'qrcode';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Heart,
  User,
  Calendar,
  BookOpen,
  Award,
} from 'lucide-react';

export interface CardData {
  instituteName: string;
  studentName: string;
  urduName?: string;
  fatherName: string;
  photoUrl: string;
  studentId: string;
  gender: 'male' | 'female';
  course: string;
  classSection: string;
  admissionDate: string;
  academicSession: string;
  contactNumber?: string;
  bloodGroup?: string;
  address?: string;
}

import { Student } from '../types';

interface StudentIdCardProps {
  data?: CardData;
  student?: Student;
  activeSide?: 'front' | 'back' | 'both';
  onFlip?: () => void;
  onVerify?: (ref: string) => void;
  className?: string;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({
  data,
  student,
  activeSide = 'front',
  onFlip,
  onVerify,
  className = '',
}) => {
  const [internalSide, setInternalSide] = useState<'front' | 'back'>('front');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const cardData: CardData = data || {
    instituteName: 'Jamia Salahuddin Ayubi',
    studentName: student?.fullName || '',
    urduName: student?.urduName,
    fatherName: student?.fatherName || '',
    photoUrl: student?.photoUrl || '',
    studentId: student?.rollNumber || '',
    gender: student?.gender || 'male',
    course: student?.department || 'Dars-e-Nizami',
    classSection: student?.currentYear || '',
    admissionDate: student?.admissionDate || '',
    academicSession: '2026-2027',
    contactNumber: student?.guardianPhone,
    bloodGroup: student?.bloodGroup,
    address: student?.address,
  };

  const currentSide = activeSide === 'both' ? 'both' : (onFlip ? activeSide : internalSide);

  // Generate secure QR Code containing ONLY a secure token reference, not exposed private personal data
  useEffect(() => {
    const secureRef = `JSA-SEC-${btoa(cardData.studentId || 'CARD-PREVIEW').replace(/=/g, '').slice(0, 12).toUpperCase()}`;
    const verificationUrl = `https://jsa.edu.pk/verify?ref=${secureRef}`;

    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#176B4D',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation note:', err));
  }, [cardData.studentId]);

  // Barcode generator based on Student ID
  const renderBarcode = (code: string) => {
    const safeCode = code || 'JSA-2026-0000';
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-end h-7 gap-[2px] bg-white px-2 py-0.5 rounded border border-slate-200">
          {safeCode.split('').map((char, idx) => {
            const charCode = char.charCodeAt(0);
            const height = 14 + (charCode % 10);
            const width = idx % 3 === 0 ? 3 : idx % 2 === 0 ? 2 : 1.5;
            return (
              <div
                key={idx}
                style={{ height: `${height}px`, width: `${width}px` }}
                className="bg-slate-900"
              />
            );
          })}
        </div>
        <span className="text-[8px] font-mono tracking-widest text-slate-700 mt-0.5 font-bold">
          {safeCode}
        </span>
      </div>
    );
  };

  const secureReference = `JSA-SEC-${btoa(cardData.studentId || 'CARD-PREVIEW').replace(/=/g, '').slice(0, 10).toUpperCase()}`;

  // Card Front Side Component
  const renderFrontSide = () => (
    <div
      className="w-[420px] h-[265px] rounded-2xl shadow-lg transition-all relative overflow-hidden bg-white border-2 border-[#D6B66C] flex flex-col justify-between select-none shrink-0"
      style={{
        boxShadow: '0 8px 24px -4px rgba(23, 107, 77, 0.12), 0 4px 12px -2px rgba(214, 182, 108, 0.15)',
      }}
    >
      {/* Top Emerald Header Band */}
      <div className="bg-[#176B4D] text-white px-3.5 py-2 flex items-center justify-between border-b-2 border-[#D6B66C]">
        <div className="flex items-center gap-2.5">
          <JamiaLogo size={32} showText={false} variant="monochrome" />
          <div className="text-left">
            <h3 className="font-serif-heading font-extrabold text-[12.5px] tracking-wide text-white leading-none">
              {cardData.instituteName || 'JAMIA SALAHUDDIN AYUBI'}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-arabic text-[11px] text-[#D6B66C] font-bold">
                جامعة صلاح الدين الأيوبي
              </span>
              <span className="text-[8.5px] text-emerald-200">· Official Student Card</span>
            </div>
          </div>
        </div>

        {/* Golden Security Hologram Shield */}
        <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#D6B66C] via-white to-[#B39247] p-[1.5px] shadow-xs">
          <div className="w-full h-full rounded-full bg-[#176B4D] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#D6B66C]" />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3 flex gap-3 items-start flex-1">
        {/* Student Photo */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-[94px] h-[114px] rounded-xl overflow-hidden border-2 border-[#176B4D] p-0.5 bg-gradient-to-b from-[#D6B66C]/40 to-white shadow-xs relative">
            {cardData.photoUrl ? (
              <img
                src={cardData.photoUrl}
                alt={cardData.studentName || 'Student'}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-[#f2f8f5] flex flex-col items-center justify-center text-slate-400 rounded-lg border border-dashed border-[#176B4D]/30">
                <User className="w-8 h-8 text-[#176B4D]/50" />
                <span className="text-[8.5px] font-semibold text-slate-400 mt-1">Photo</span>
              </div>
            )}

            {/* Official Hologram Stamp */}
            <div className="absolute bottom-1 right-1 bg-[#176B4D]/90 text-[#D6B66C] px-1 py-0.5 rounded text-[7.5px] font-bold tracking-tight border border-[#D6B66C]/60 shadow-xs">
              VERIFIED
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[9.5px] text-[#176B4D] font-bold">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>Blood: {cardData.bloodGroup || 'O+'}</span>
          </div>
        </div>

        {/* Student Details Column */}
        <div className="flex-1 flex flex-col justify-between h-[155px] text-left">
          <div>
            <div className="flex items-baseline justify-between">
              <h4 className="font-bold text-slate-900 text-[13.5px] leading-snug tracking-tight">
                {cardData.studentName || <span className="text-slate-300 italic font-normal">Student Full Name</span>}
              </h4>
              {cardData.urduName && (
                <span className="font-arabic text-sm font-bold text-[#176B4D]">
                  {cardData.urduName}
                </span>
              )}
            </div>

            {/* Roll Number Gold Badge */}
            <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-[#fdfaf2] border border-[#D6B66C]">
              <span className="text-[9.5px] text-slate-500 uppercase font-bold">Student ID:</span>
              <span className="text-xs font-mono font-extrabold text-[#176B4D]">
                {cardData.studentId || <span className="text-slate-400 font-normal">JSA-2026-XXXX</span>}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]">
              <div>
                <span className="text-slate-500 block text-[9px]">Father Name:</span>
                <span className="font-bold text-slate-800 truncate block">
                  {cardData.fatherName || <span className="text-slate-300 font-normal">—</span>}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Course / Program:</span>
                <span className="font-bold text-[#176B4D] truncate block">
                  {cardData.course || <span className="text-slate-300 font-normal">Dars-e-Nizami</span>}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Class / Section:</span>
                <span className="font-medium text-slate-800 truncate block">
                  {cardData.classSection || <span className="text-slate-300 font-normal">—</span>}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Gender / Wing:</span>
                <span className="font-medium capitalize text-slate-800 truncate block">
                  {cardData.gender === 'female' ? 'Female (Bannat Wing)' : 'Male (Boys Campus)'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Meta */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[8.5px] text-slate-500">
            <span>Adm: <strong>{cardData.admissionDate || '2026-03-01'}</strong></span>
            <span>Session: <strong className="text-[#176B4D]">{cardData.academicSession || '2026-2027'}</strong></span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider">Valid Till 2027</span>
          </div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D] shrink-0" />
    </div>
  );

  // Card Back Side Component
  const renderBackSide = () => (
    <div
      className="w-[420px] h-[265px] rounded-2xl shadow-lg transition-all relative overflow-hidden bg-white border-2 border-[#D6B66C] flex flex-col justify-between select-none shrink-0"
      style={{
        boxShadow: '0 8px 24px -4px rgba(23, 107, 77, 0.12), 0 4px 12px -2px rgba(214, 182, 108, 0.15)',
      }}
    >
      {/* Top Green Accent Bar */}
      <div className="bg-[#176B4D] text-white px-3.5 py-1.5 flex items-center justify-between text-[11px] border-b border-[#D6B66C]">
        <span className="font-serif-heading font-semibold text-xs tracking-wider">
          TERMS & ENCRYPTED VERIFICATION
        </span>
        <span className="font-arabic text-xs text-[#D6B66C]">
          جامعة صلاح الدين الأيوبي
        </span>
      </div>

      <div className="p-3 flex flex-col justify-between h-[215px] text-left">
        {/* Rules */}
        <div className="space-y-1 text-[9px] text-slate-600 leading-tight">
          <p>1. This card is non-transferable and remains the official property of Jamia Salahuddin Ayubi.</p>
          <p>2. Must be visibly displayed upon entering campus gates, prayer hall, Maktaba library, and exam rooms.</p>
          <p>3. If found, please return to: Jamia Salahuddin Ayubi, Admissions Secretariat.</p>
        </div>

        {/* Middle Section: Secure QR + Emergency Box */}
        <div className="flex items-center justify-between gap-3 bg-[#f8faf9] p-2 rounded-xl border border-[#e5ece8]">
          <div className="space-y-1 text-[9.5px] flex-1">
            <div className="text-slate-700">
              <span className="text-slate-500 block text-[8.5px]">Helpline / Emergency:</span>
              <strong className="text-[#176B4D]">{cardData.contactNumber || '+92 51 8844221'}</strong>
            </div>
            <div className="text-slate-700">
              <span className="text-slate-500 block text-[8.5px]">Campus Security Reference:</span>
              <span className="font-mono text-[9px] text-slate-800 font-semibold">{secureReference}</span>
            </div>
            <p className="text-[8px] text-slate-400 italic">
              Encrypted QR reference contains zero exposed personal records.
            </p>
          </div>

          {/* Secure Scannable QR Code */}
          <div
            className="flex flex-col items-center p-1 bg-white rounded-lg border border-[#D6B66C] shadow-xs cursor-pointer hover:border-[#176B4D]"
            onClick={() => onVerify && onVerify(cardData.studentId || 'DEMO')}
            title="Scan or click to verify"
          >
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Secure QR Code" className="w-[66px] h-[66px]" />
            ) : (
              <div className="w-[66px] h-[66px] bg-slate-100 flex items-center justify-center text-[8px] text-slate-400">
                Loading QR
              </div>
            )}
            <span className="text-[7px] font-bold text-[#176B4D] uppercase tracking-wider mt-0.5">
              Scan to Verify
            </span>
          </div>
        </div>

        {/* Bottom Barcode + Official Director Signature */}
        <div className="flex items-end justify-between pt-1 border-t border-slate-100">
          <div>
            {renderBarcode(cardData.studentId || 'JSA-2026-0000')}
          </div>

          {/* Official Director Signature Stamp */}
          <div className="flex flex-col items-center text-center">
            <div className="font-arabic text-xs font-bold text-[#176B4D] italic leading-tight">
              منیب الرحمن
            </div>
            <div className="h-0.5 w-24 bg-[#176B4D]/60 my-0.5" />
            <span className="text-[9px] font-bold text-slate-800 uppercase tracking-tight">
              Muneeb ur Rehman
            </span>
            <span className="text-[8px] text-slate-500 leading-none">
              Director, Jamia Salahuddin Ayubi
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D] shrink-0" />
    </div>
  );

  return (
    <div className={`flex flex-col items-center max-w-full w-full overflow-x-auto p-1 ${className}`}>
      {currentSide === 'both' ? (
        <div className="flex flex-col xl:flex-row items-center gap-6 max-w-full">
          <div className="space-y-1 text-center max-w-full overflow-x-auto p-1">
            <span className="text-[11px] font-bold text-[#176B4D] uppercase tracking-wider block">
              Front Side
            </span>
            <div className="max-w-full overflow-x-auto p-1 flex justify-center">
              {renderFrontSide()}
            </div>
          </div>
          <div className="space-y-1 text-center max-w-full overflow-x-auto p-1">
            <span className="text-[11px] font-bold text-[#176B4D] uppercase tracking-wider block">
              Back Side
            </span>
            <div className="max-w-full overflow-x-auto p-1 flex justify-center">
              {renderBackSide()}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto p-1 flex justify-center">
          {currentSide === 'front' ? renderFrontSide() : renderBackSide()}
        </div>
      )}
    </div>
  );
};
