import React, { useState } from 'react';
import { JamiaStore } from '../lib/storage';
import { Student, FeeVoucher, ExamGrade } from '../types';
import { JamiaLogo } from '../components/JamiaLogo';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Printer,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const ManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'exams' | 'fees' | 'timetable'>('attendance');
  const students = JamiaStore.getStudents();
  const settings = JamiaStore.getSettings();

  // ATTENDANCE STATE
  const [selectedClass, setSelectedClass] = useState('Dars-e-Nizami');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'leave'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'leave'> = {};
    students.forEach((s) => {
      map[s.id] = 'present';
    });
    return map;
  });
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  const filteredClassStudents = students.filter(
    (s) => selectedClass === 'all' || s.department.toLowerCase().includes(selectedClass.toLowerCase())
  );

  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records = filteredClassStudents.map((s) => ({
      studentId: s.id,
      rollNumber: s.rollNumber,
      studentName: s.fullName,
      status: attendanceMap[s.id] || 'present',
    }));

    JamiaStore.saveAttendance({
      date: selectedDate,
      classId: selectedClass,
      records,
    });

    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3000);
  };

  // EXAMS & RESULTS STATE
  const [grades, setGrades] = useState<ExamGrade[]>(() => JamiaStore.getGrades());
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [selectedReportCard, setSelectedReportCard] = useState<ExamGrade | null>(null);

  // New Grade Form
  const [gradeForm, setGradeForm] = useState({
    studentId: students[0]?.id || '',
    examTerm: 'Mid-Term 2026' as ExamGrade['examTerm'],
    sub1Name: 'Classical Fiqh (Hidayah)',
    sub1Marks: 90,
    sub2Name: 'Usul al-Fiqh',
    sub2Marks: 85,
    sub3Name: 'Hadith Studies',
    sub3Marks: 88,
    sub4Name: 'Arabic Grammar & Balaghah',
    sub4Marks: 92,
    sub5Name: 'IT & Digital Literacy',
    sub5Marks: 95,
    remarks: 'Demonstrated deep comprehension of classical Islamic jurisprudence and analytical ability.',
  });

  const handleSaveNewGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === gradeForm.studentId);
    if (!st) return;

    const subjects = [
      { subjectName: gradeForm.sub1Name, totalMarks: 100, obtainedMarks: Number(gradeForm.sub1Marks) },
      { subjectName: gradeForm.sub2Name, totalMarks: 100, obtainedMarks: Number(gradeForm.sub2Marks) },
      { subjectName: gradeForm.sub3Name, totalMarks: 100, obtainedMarks: Number(gradeForm.sub3Marks) },
      { subjectName: gradeForm.sub4Name, totalMarks: 100, obtainedMarks: Number(gradeForm.sub4Marks) },
      { subjectName: gradeForm.sub5Name, totalMarks: 100, obtainedMarks: Number(gradeForm.sub5Marks) },
    ];

    const totalMarks = 500;
    const obtainedMarks = subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
    const percentage = (obtainedMarks / totalMarks) * 100;
    let grade: ExamGrade['grade'] = 'A+';
    if (percentage < 50) grade = 'F';
    else if (percentage < 60) grade = 'D';
    else if (percentage < 70) grade = 'C';
    else if (percentage < 80) grade = 'B';
    else if (percentage < 90) grade = 'A';

    const newGrade = JamiaStore.addGrade({
      studentId: st.id,
      studentName: st.fullName,
      rollNumber: st.rollNumber,
      examTerm: gradeForm.examTerm,
      department: st.department,
      subjects,
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      remarks: gradeForm.remarks,
    });

    setGrades(JamiaStore.getGrades());
    setShowAddGradeModal(false);
  };

  // FEES STATE
  const [fees, setFees] = useState<FeeVoucher[]>(() => JamiaStore.getFees());
  const [showNewVoucherModal, setShowNewVoucherModal] = useState(false);
  const [selectedFeeVoucher, setSelectedFeeVoucher] = useState<FeeVoucher | null>(null);

  // New Voucher Form
  const [voucherForm, setVoucherForm] = useState({
    studentId: students[0]?.id || '',
    monthYear: 'April 2026',
    tuitionFee: 3500,
    boardingFee: 5000,
    examFee: 500,
    otherDues: 0,
    discount: 500,
    dueDate: '2026-04-10',
  });

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === voucherForm.studentId);
    if (!st) return;

    const total =
      Number(voucherForm.tuitionFee) +
      Number(voucherForm.boardingFee) +
      Number(voucherForm.examFee) +
      Number(voucherForm.otherDues) -
      Number(voucherForm.discount);

    JamiaStore.addFeeVoucher({
      studentId: st.id,
      studentName: st.fullName,
      rollNumber: st.rollNumber,
      department: st.department,
      monthYear: voucherForm.monthYear,
      tuitionFee: Number(voucherForm.tuitionFee),
      boardingFee: Number(voucherForm.boardingFee),
      examFee: Number(voucherForm.examFee),
      otherDues: Number(voucherForm.otherDues),
      discount: Number(voucherForm.discount),
      totalAmount: Math.max(0, total),
      dueDate: voucherForm.dueDate,
      status: 'unpaid',
    });

    setFees(JamiaStore.getFees());
    setShowNewVoucherModal(false);
  };

  const handleMarkVoucherPaid = (voucherId: string) => {
    JamiaStore.markFeePaid(voucherId, 'Direct Bank Deposit (Meezan Bank)');
    setFees(JamiaStore.getFees());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
            Jamia Salahuddin Ayubi · Academic ERP & Software
          </span>
          <h1 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
            Educational Management Software
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily attendance register, examination results & report cards, fee ledger vouchers
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex p-1 bg-white border border-[#e5ece8] rounded-xl shadow-xs">
          {[
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'exams', label: 'Exams & Grades', icon: Award },
            { id: 'fees', label: 'Fee Ledger', icon: Receipt },
            { id: 'timetable', label: 'Timetable', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#176B4D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ATTENDANCE MODULE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Daily Attendance Register
              </h3>
              <p className="text-xs text-slate-500">
                Mark morning and evening session attendance for active students
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-[#f8faf9] border border-[#e5ece8] rounded-lg px-2.5 py-1.5 text-xs font-medium focus:border-[#176B4D] outline-none"
                >
                  <option value="all">All Classes</option>
                  <option value="Dars-e-Nizami">Dars-e-Nizami (Alimiyyah)</option>
                  <option value="Hifz-ul-Quran">Hifz-ul-Quran</option>
                  <option value="Islamic Jurisprudence">Islamic Jurisprudence (Ifta)</option>
                  <option value="Modern Education">Modern IT & Computer</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#f8faf9] border border-[#e5ece8] rounded-lg px-2.5 py-1.5 text-xs font-medium focus:border-[#176B4D] outline-none"
                >
                </input>
              </div>

              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Save Register</span>
              </button>
            </div>
          </div>

          {attendanceSavedToast && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attendance for {selectedDate} saved successfully to Jamia database!</span>
            </div>
          )}

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department & Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClassStudents.map((st) => {
                  const currentStatus = attendanceMap[st.id] || 'present';
                  return (
                    <tr key={st.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={st.photoUrl}
                          alt={st.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-[#D6B66C]"
                        />
                        <span>{st.fullName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#176B4D]">
                        {st.rollNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {st.department} <span className="text-slate-400">({st.currentYear})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {currentStatus === 'present' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Present
                          </span>
                        )}
                        {currentStatus === 'absent' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            Absent
                          </span>
                        )}
                        {currentStatus === 'leave' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Leave
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(st.id, 'present')}
                            className={`px-3 py-1 text-xs font-semibold cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(st.id, 'absent')}
                            className={`px-3 py-1 text-xs font-semibold border-l border-r border-slate-200 cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(st.id, 'leave')}
                            className={`px-3 py-1 text-xs font-semibold cursor-pointer ${
                              currentStatus === 'leave'
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            L
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. EXAMS & REPORT CARDS MODULE */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Examination Results & Academic Report Cards
              </h3>
              <p className="text-xs text-slate-500">
                Official marks entry, GPA calculations, and printable grade transcripts
              </p>
            </div>

            <button
              onClick={() => setShowAddGradeModal(true)}
              className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#D6B66C]" />
              <span>Record Student Result</span>
            </button>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                  <th className="py-3 px-4">Student & Roll No</th>
                  <th className="py-3 px-4">Exam Term</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Total Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-center">Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{grd.studentName}</div>
                      <span className="font-mono text-[11px] text-[#176B4D] font-bold">{grd.rollNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{grd.examTerm}</td>
                    <td className="py-3.5 px-4 text-slate-600">{grd.department}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {grd.obtainedMarks} / {grd.totalMarks}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{grd.percentage.toFixed(1)}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800">
                        {grd.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedReportCard(grd)}
                        className="px-3 py-1 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-lg border border-[#D6B66C] transition-all cursor-pointer shadow-2xs"
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal / Report Card Viewer */}
          {selectedReportCard && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <JamiaLogo size={36} />
                  <button
                    onClick={() => setSelectedReportCard(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                    Official Academic Grade Transcript
                  </h3>
                  <p className="text-xs text-slate-500">{selectedReportCard.examTerm} · Jamia Salahuddin Ayubi</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f8faf9] rounded-xl text-xs border border-[#e5ece8]">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Student Name:</span>
                    <strong className="text-slate-900">{selectedReportCard.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Roll Number:</span>
                    <strong className="font-mono text-[#176B4D]">{selectedReportCard.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Department:</span>
                    <span className="text-slate-800 font-medium">{selectedReportCard.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Final Standing:</span>
                    <span className="text-emerald-700 font-bold">
                      Grade {selectedReportCard.grade} ({selectedReportCard.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Subject Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Subject Wise Marks
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {selectedReportCard.subjects.map((sub, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-white">
                        <span className="font-medium text-slate-700">{sub.subjectName}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {sub.obtainedMarks} / {sub.totalMarks}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-200">
                  <span className="font-bold block text-[11px] text-[#176B4D]">Asatiza Remarks (ملاحظات الاساتذة):</span>
                  <p className="italic">{selectedReportCard.remarks}</p>
                </div>

                {/* Signatures */}
                <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-100">
                  <div className="text-center">
                    <div className="h-0.5 w-24 bg-slate-300 my-1" />
                    <span className="text-[10px] text-slate-500">Controller of Exams</span>
                  </div>
                  <div className="text-center">
                    <div className="h-0.5 w-28 bg-[#176B4D] my-1" />
                    <span className="text-[10px] font-bold text-[#176B4D]">
                      {settings.directorName}
                    </span>
                    <span className="block text-[8px] text-slate-400">Director General</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Print Transcript</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Grade Modal */}
          {showAddGradeModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                    Record Student Exam Result
                  </h3>
                  <button
                    onClick={() => setShowAddGradeModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveNewGrade} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Select Student</label>
                    <select
                      value={gradeForm.studentId}
                      onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.rollNumber}) - {s.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 uppercase">Subject Marks (Max 100 Each)</label>
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const nameKey = `sub${idx}Name` as keyof typeof gradeForm;
                      const marksKey = `sub${idx}Marks` as keyof typeof gradeForm;
                      return (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={gradeForm[nameKey] as string}
                            onChange={(e) => setGradeForm({ ...gradeForm, [nameKey]: e.target.value })}
                            className="flex-1 p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradeForm[marksKey] as number}
                            onChange={(e) => setGradeForm({ ...gradeForm, [marksKey]: e.target.value })}
                            className="w-20 p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg text-center font-mono font-bold"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Scholarly Remarks</label>
                    <textarea
                      rows={2}
                      value={gradeForm.remarks}
                      onChange={(e) => setGradeForm({ ...gradeForm, remarks: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGradeModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#176B4D] text-white font-bold rounded-xl shadow-xs"
                    >
                      Save Result
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. FEE LEDGER & VOUCHERS */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Fee Ledger & Voucher Management
              </h3>
              <p className="text-xs text-slate-500">
                Tuition, boarding dues, scholarship concessions and verified payment receipts
              </p>
            </div>

            <button
              onClick={() => setShowNewVoucherModal(true)}
              className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#D6B66C]" />
              <span>Generate Fee Voucher</span>
            </button>
          </div>

          {/* Vouchers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                  <th className="py-3 px-4">Voucher No</th>
                  <th className="py-3 px-4">Student & Roll</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Tuition + Hostel</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((vch) => (
                  <tr key={vch.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#176B4D]">{vch.voucherNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{vch.studentName}</div>
                      <span className="font-mono text-[11px] text-slate-500">{vch.rollNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{vch.monthYear}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      PKR {vch.tuitionFee + vch.boardingFee}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-medium">
                      {vch.discount > 0 ? `-PKR ${vch.discount}` : '0'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      PKR {vch.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {vch.status === 'paid' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkVoucherPaid(vch.id)}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                          title="Click to mark as paid"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedFeeVoucher(vch)}
                        className="px-3 py-1 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-lg border border-[#D6B66C] transition-all cursor-pointer shadow-2xs"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Printable Fee Challan Modal */}
          {selectedFeeVoucher && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <JamiaLogo size={34} />
                  <button
                    onClick={() => setSelectedFeeVoucher(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center">
                  <h3 className="font-serif-heading font-extrabold text-lg text-[#176B4D]">
                    Official Fee Deposit Voucher
                  </h3>
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {selectedFeeVoucher.voucherNumber} · {selectedFeeVoucher.monthYear}
                  </span>
                </div>

                <div className="p-4 bg-[#f8faf9] rounded-xl border border-[#e5ece8] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <strong className="text-slate-900">{selectedFeeVoucher.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll Number:</span>
                    <strong className="font-mono text-[#176B4D]">{selectedFeeVoucher.rollNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="text-slate-800">{selectedFeeVoucher.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Due Date:</span>
                    <span className="text-slate-800 font-medium">{selectedFeeVoucher.dueDate}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Tuition Fee:</span>
                    <span className="font-mono">PKR {selectedFeeVoucher.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Boarding & Mess Fee:</span>
                    <span className="font-mono">PKR {selectedFeeVoucher.boardingFee}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Exam / Library Fee:</span>
                    <span className="font-mono">PKR {selectedFeeVoucher.examFee}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                    <span>Merit Scholarship Discount:</span>
                    <span className="font-mono">-PKR {selectedFeeVoucher.discount}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-bold text-[#176B4D] bg-[#f2f8f5] px-2 rounded-lg">
                    <span>Net Amount Payable:</span>
                    <span className="font-mono">PKR {selectedFeeVoucher.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                  <p><strong>Bank Account:</strong> Meezan Bank Ltd (Islamic Banking)</p>
                  <p><strong>Account Title:</strong> Jamia Salahuddin Ayubi (Director: Muneeb ur Rehman)</p>
                  <p><strong>Status:</strong> {selectedFeeVoucher.status.toUpperCase()}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Print Challan Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Voucher Modal */}
          {showNewVoucherModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#176B4D] shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                    Generate Fee Challan
                  </h3>
                  <button
                    onClick={() => setShowNewVoucherModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Student</label>
                    <select
                      value={voucherForm.studentId}
                      onChange={(e) => setVoucherForm({ ...voucherForm, studentId: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Billing Month</label>
                      <input
                        type="text"
                        value={voucherForm.monthYear}
                        onChange={(e) => setVoucherForm({ ...voucherForm, monthYear: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Due Date</label>
                      <input
                        type="date"
                        value={voucherForm.dueDate}
                        onChange={(e) => setVoucherForm({ ...voucherForm, dueDate: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Tuition Fee</label>
                      <input
                        type="number"
                        value={voucherForm.tuitionFee}
                        onChange={(e) => setVoucherForm({ ...voucherForm, tuitionFee: Number(e.target.value) })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Boarding Fee</label>
                      <input
                        type="number"
                        value={voucherForm.boardingFee}
                        onChange={(e) => setVoucherForm({ ...voucherForm, boardingFee: Number(e.target.value) })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Exam / Misc</label>
                      <input
                        type="number"
                        value={voucherForm.examFee}
                        onChange={(e) => setVoucherForm({ ...voucherForm, examFee: Number(e.target.value) })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Discount (PKR)</label>
                      <input
                        type="number"
                        value={voucherForm.discount}
                        onChange={(e) => setVoucherForm({ ...voucherForm, discount: Number(e.target.value) })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg font-mono text-rose-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewVoucherModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#176B4D] text-white font-bold rounded-xl shadow-xs"
                    >
                      Issue Voucher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. DAILY ACADEMIC TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
              Master Academic & Prayer Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Balanced daily routine integrating sacred studies, Hifz revision, modern IT classes, and moral refinement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { time: '04:45 AM – 05:30 AM', title: 'Tahajjud & Fajr Prayer in Congregation', desc: 'Spiritual awakening, Adhkar & collective Quranic recitation.' },
              { time: '05:30 AM – 07:30 AM', title: 'Hifz Sabaq & Manzil Intensive Session', desc: 'Daily new memorization and revision under certified Qaris.' },
              { time: '07:30 AM – 08:30 AM', title: 'Breakfast & Personal Preparation', desc: 'Nutritious breakfast in the campus mess.' },
              { time: '08:30 AM – 11:30 AM', title: 'Dars-e-Nizami Core Lectures (Period 1-3)', desc: 'Arabic syntax (Nahw), morphology (Sarf), and classical Fiqh texts.' },
              { time: '11:30 AM – 01:00 PM', title: 'Modern IT, Computer Lab & English Class', desc: 'Digital literacy, academic composition, and software training.' },
              { time: '01:00 PM – 02:30 PM', title: 'Zuhr Prayer & Qaylulah (Midday Rest)', desc: 'Congregational prayer, lunch, and Sunnah rest.' },
              { time: '02:30 PM – 04:30 PM', title: 'Hadith Studies & Tafseer Seminars', desc: 'Direct transmission and Sanad verification of prophetic traditions.' },
              { time: '04:30 PM – 05:45 PM', title: 'Asr Prayer, Sports & Physical Fitness', desc: 'Archery, football, running, and physical wellness.' },
              { time: '06:00 PM – 07:30 PM', title: 'Maghrib Prayer & Hifz Evening Muraja\'ah', desc: 'Recitation review and Tajweed perfection.' },
              { time: '08:00 PM – 10:00 PM', title: 'Isha Prayer, Dinner & Maktaba Research', desc: 'Library study, homework preparation, and lights-out by 10:30 PM.' },
            ].map((slot, idx) => (
              <div key={idx} className="p-4 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#176B4D]">{slot.title}</span>
                  <span className="font-mono text-[#b89344] text-[11px] bg-white px-2 py-0.5 rounded border border-[#D6B66C]/40">
                    {slot.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{slot.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
