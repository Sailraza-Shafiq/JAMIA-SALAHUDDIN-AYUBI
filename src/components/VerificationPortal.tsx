import React, { useState, useEffect } from 'react';
import { JamiaStore } from '../lib/storage';
import { Student } from '../types';
import { JamiaLogo } from './JamiaLogo';
import { ShieldCheck, Search, CheckCircle2, XCircle, User, Calendar, MapPin, Award, BookOpen, AlertTriangle } from 'lucide-react';

interface VerificationPortalProps {
  initialRollNo?: string;
  onClose?: () => void;
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({ initialRollNo = '', onClose }) => {
  const [query, setQuery] = useState(initialRollNo);
  const [searchedStudent, setSearchedStudent] = useState<Student | null | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const settings = JamiaStore.getSettings();

  useEffect(() => {
    if (initialRollNo) {
      handleSearch(initialRollNo);
    }
  }, [initialRollNo]);

  const handleSearch = (roll: string) => {
    if (!roll.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const found = JamiaStore.getStudentByRoll(roll.trim());
      setSearchedStudent(found || null);
      setIsSearching(false);
    }, 250);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#e5ece8] p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f2f8f5] border border-[#176B4D]/20 flex items-center justify-center text-[#176B4D]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
              Student & Credential Verification Portal
            </h3>
            <p className="text-xs text-slate-500">
              Official instant verification for Jamia Salahuddin Ayubi students & graduates
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="mt-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Enter Student Roll Number or Admission Reference
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="e.g. JSA-2026-101 or ADM-2026-081"
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-sm font-medium transition-all"
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={isSearching}
            className="px-5 py-2.5 bg-[#176B4D] text-white font-semibold text-sm rounded-xl hover:bg-[#0f4a35] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isSearching ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <span>Quick Try:</span>
          {['JSA-2026-101', 'JSA-2026-102', 'JSA-2026-103', 'JSA-2026-104'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setQuery(sample);
                handleSearch(sample);
              }}
              className="text-[#176B4D] hover:underline font-mono text-[11px] bg-[#f2f8f5] px-2 py-0.5 rounded cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {searchedStudent !== undefined && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          {searchedStudent ? (
            <div className="bg-gradient-to-br from-[#f2f8f5] to-white rounded-xl p-5 border-2 border-[#176B4D]/30 relative overflow-hidden">
              {/* Authenticity Watermark Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-[#176B4D]/15">
                <div className="flex items-center gap-2 text-[#176B4D]">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 block">
                      OFFICIALLY VERIFIED RECORD
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Authentic student of Jamia Salahuddin Ayubi
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                  Active Enrollment
                </div>
              </div>

              {/* Student Card Summary */}
              <div className="mt-4 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#D6B66C] shadow-sm shrink-0">
                  <img
                    src={searchedStudent.photoUrl}
                    alt={searchedStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Student Name</span>
                    <strong className="text-slate-900 text-sm block">{searchedStudent.fullName}</strong>
                    {searchedStudent.urduName && (
                      <span className="font-arabic text-[#176B4D] text-sm font-bold">
                        {searchedStudent.urduName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Official Roll Number</span>
                    <strong className="font-mono text-[#176B4D] text-sm block">
                      {searchedStudent.rollNumber}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Father Name</span>
                    <span className="text-slate-800 font-medium block">{searchedStudent.fatherName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Department / Program</span>
                    <span className="text-[#176B4D] font-semibold block">{searchedStudent.department}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Academic Level / Year</span>
                    <span className="text-slate-800 font-medium block">{searchedStudent.currentYear}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Resident Category</span>
                    <span className="text-slate-800 font-medium capitalize block">
                      {searchedStudent.boardingStatus === 'boarder' ? 'Hostel Boarding' : 'Day Scholar'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Admission Date</span>
                    <span className="text-slate-800 font-medium block">{searchedStudent.admissionDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Blood Group</span>
                    <span className="text-slate-800 font-bold block">{searchedStudent.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Endorsement footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D6B66C]" />
                  <span>Authorized by: <strong>{settings.directorName}</strong> ({settings.directorTitle})</span>
                </div>
                <span className="font-mono text-[10px]">VERIFIED_SECURE_TOKEN_OK</span>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 rounded-xl p-5 border border-rose-200 text-center">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <h4 className="font-bold text-rose-900 text-sm">No Student Record Found</h4>
              <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
                No active student or graduate record matched roll number &quot;{query}&quot;. Please verify spelling or contact the Jamia Salahuddin Ayubi registrar office.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
