import React, { useState } from 'react';
import { JamiaStore } from '../lib/storage';
import { Student } from '../types';
import { StudentIdCard } from '../components/StudentIdCard';
import { JamiaLogo } from '../components/JamiaLogo';
import {
  CreditCard,
  Search,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface IdCardViewProps {
  initialRollNo?: string;
  onOpenVerify: (rollNo: string) => void;
}

export const IdCardView: React.FC<IdCardViewProps> = ({ initialRollNo, onOpenVerify }) => {
  const students = JamiaStore.getStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (initialRollNo) {
      const match = JamiaStore.getStudentByRoll(initialRollNo);
      if (match) return match.id;
    }
    return students[0]?.id || '';
  });

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || s.department.toLowerCase().includes(filterDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
            Jamia Salahuddin Ayubi · Security & Registrar Office
          </span>
          <h1 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
            Digital Student ID Card System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official verifiable CR80 PVC identity cards with live QR verification and student barcode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D6B66C]" />
            <span>Print Active Card</span>
          </button>

          {selectedStudent && (
            <button
              onClick={() => onOpenVerify(selectedStudent.rollNumber)}
              className="px-4 py-2 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#b89344]" />
              <span>Test Live Verification</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: Student Selector + Interactive Card Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Directory List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#176B4D]" />
              <span>Select Enrolled Student ({filteredStudents.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Session 2026-27</span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, roll no..."
                className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium focus:border-[#176B4D] outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['all', 'Dars-e-Nizami', 'Hifz-ul-Quran', 'Ifta', 'IT'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    filterDept === dept
                      ? 'bg-[#176B4D] text-white'
                      : 'bg-[#f2f8f5] text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredStudents.map((s) => {
              const isSelected = s.id === selectedStudent?.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#f2f8f5] border-[#176B4D] ring-2 ring-[#176B4D]/30 shadow-xs'
                      : 'bg-white border-[#e5ece8] hover:border-slate-300'
                  }`}
                >
                  <img
                    src={s.photoUrl}
                    alt={s.fullName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#D6B66C]/60 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {s.fullName}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-[#176B4D] bg-white px-1.5 py-0.5 rounded border border-[#176B4D]/20">
                        {s.rollNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                      <span>{s.department}</span>
                      <span>·</span>
                      <span>{s.currentYear}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No enrolled students found matching search.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive ID Card Display (7 cols) */}
        <div className="lg:col-span-7 bg-[#f8faf9] rounded-3xl p-6 sm:p-8 border border-[#e5ece8] flex flex-col items-center justify-center min-h-[540px]">
          {selectedStudent ? (
            <div className="w-full flex flex-col items-center space-y-6">
              {/* Card Title Banner */}
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#176B4D] bg-white px-3 py-1 rounded-full border border-[#176B4D]/20 shadow-xs">
                  Official Smart PVC Identity Card Preview
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Cardholder: <strong>{selectedStudent.fullName}</strong> ({selectedStudent.rollNumber})
                </p>
              </div>

              {/* ID Card Component */}
              <StudentIdCard
                student={selectedStudent}
                onVerify={(roll) => onOpenVerify(roll)}
              />

              {/* Quick Info Box */}
              <div className="w-full max-w-md bg-white rounded-2xl p-4 border border-[#e5ece8] text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>Card Security Features:</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Encrypted High-Density QR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Scanning this card’s QR code with any mobile device or airport/gate scanner immediately validates student authenticity against the Jamia Salahuddin Ayubi registry.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-sm">
              Please select a student from the left panel to inspect their ID card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
