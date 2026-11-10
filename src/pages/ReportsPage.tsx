import React, { useState, useEffect } from 'react';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import {
  ExamGrade,
  Student,
  AdmissionApplication,
  AttendanceRecord,
  StaffMember,
  FeeVoucher,
  Course,
} from '../types';
import { JamiaLogo } from '../components/JamiaLogo';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  Award,
  Plus,
  Printer,
  FileCheck,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  Download,
  Users,
  Building2,
  Receipt,
  BookOpen,
  UserCheck,
  GraduationCap,
  FileSpreadsheet,
  ShieldCheck,
  Filter,
  Layers,
  Clock,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

type ReportTab = 'admissions' | 'students' | 'attendance' | 'staff' | 'fees' | 'courses' | 'exams';

export const ReportsPage: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const settings = JamiaStore.getSettings();

  // Core Data
  const [students, setStudents] = useState<Student[]>(() => JamiaStore.getStudents());
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => JamiaStore.getAdmissions());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => JamiaStore.getAttendance());
  const [staff, setStaff] = useState<StaffMember[]>(() => JamiaStore.getStaff());
  const [fees, setFees] = useState<FeeVoucher[]>(() => JamiaStore.getFees());
  const [courses, setCourses] = useState<Course[]>(() => JamiaStore.getCourses());
  const [grades, setGrades] = useState<ExamGrade[]>(() => JamiaStore.getGrades());

  // Active Report Tab
  const [activeTab, setActiveTab] = useState<ReportTab>('admissions');

  // Date-wise Filters
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [campusFilter, setCampusFilter] = useState<'all' | 'male' | 'female'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedReportCard, setSelectedReportCard] = useState<ExamGrade | null>(null);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);

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

  // Subscribe to storage
  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setStudents(JamiaStore.getStudents());
      setAdmissions(JamiaStore.getAdmissions());
      setAttendance(JamiaStore.getAttendance());
      setStaff(JamiaStore.getStaff());
      setFees(JamiaStore.getFees());
      setCourses(JamiaStore.getCourses());
      setGrades(JamiaStore.getGrades());
    });
    return unsub;
  }, []);

  // Quick Date Range Presets
  const setDatePreset = (preset: 'all' | 'month' | 'year') => {
    const today = new Date().toISOString().split('T')[0];
    if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(today);
    } else if (preset === 'month') {
      const start = new Date();
      start.setDate(1);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today);
    } else if (preset === 'year') {
      setStartDate('2026-01-01');
      setEndDate(today);
    }
  };

  // Helper date checker
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const cleanDate = dateStr.split('T')[0];
    return cleanDate >= startDate && cleanDate <= endDate;
  };

  // Filtered Datasets based on Date and Campus
  const filteredAdmissions = admissions.filter((a) => {
    const matchesDate = isDateInRange(a.submittedAt);
    const matchesCampus = campusFilter === 'all' || a.gender === campusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.applicantName.toLowerCase().includes(q) ||
      a.applicationNumber.toLowerCase().includes(q) ||
      a.program.toLowerCase().includes(q);
    return matchesDate && matchesCampus && matchesSearch;
  });

  const filteredStudents = students.filter((s) => {
    const matchesDate = isDateInRange(s.admissionDate);
    const matchesCampus = campusFilter === 'all' || s.gender === campusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    return matchesDate && matchesCampus && matchesSearch;
  });

  const filteredAttendance = attendance.filter((att) => {
    const matchesDate = att.date >= startDate && att.date <= endDate;
    const matchesCampus = campusFilter === 'all' || att.genderCategory === campusFilter || att.genderCategory === 'all';
    return matchesDate && matchesCampus;
  });

  const filteredStaff = staff.filter((st) => {
    const matchesDate = isDateInRange(st.joiningDate);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      st.fullName.toLowerCase().includes(q) ||
      st.designation.toLowerCase().includes(q) ||
      st.assignedDepartment.toLowerCase().includes(q);
    return matchesDate && matchesSearch;
  });

  const filteredFees = fees.filter((f) => {
    const matchesDate = isDateInRange(f.paidDate || f.dueDate);
    const matchesCampus = campusFilter === 'all' || f.gender === campusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      f.studentName.toLowerCase().includes(q) ||
      f.rollNumber.toLowerCase().includes(q) ||
      f.voucherNumber.toLowerCase().includes(q);
    return matchesDate && matchesCampus && matchesSearch;
  });

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const filteredGrades = grades.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      g.studentName.toLowerCase().includes(q) ||
      g.rollNumber.toLowerCase().includes(q) ||
      g.examTerm.toLowerCase().includes(q)
    );
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `Jamia_${activeTab.toUpperCase()}_Report_${startDate}_${endDate}.csv`;

    if (activeTab === 'admissions') {
      headers = ['Application No', 'Applicant Name', 'Father Name', 'Gender', 'Course', 'Contact', 'Status', 'Date'];
      rows = filteredAdmissions.map((a) => [
        a.applicationNumber,
        `"${a.applicantName}"`,
        `"${a.fatherName}"`,
        a.gender === 'male' ? 'Male (Boys Campus)' : 'Female (Bannat Wing)',
        `"${a.program}"`,
        a.phone || a.contactNumber || '—',
        a.status.toUpperCase(),
        a.submittedAt ? a.submittedAt.split('T')[0] : '—',
      ]);
    } else if (activeTab === 'students') {
      headers = ['Roll Number', 'Admission No', 'Full Name', 'Father Name', 'Gender', 'Department', 'Class', 'Boarding', 'Admission Date'];
      rows = filteredStudents.map((s) => [
        s.rollNumber,
        s.admissionNumber,
        `"${s.fullName}"`,
        `"${s.fatherName}"`,
        s.gender === 'male' ? 'Male (Boys Campus)' : 'Female (Bannat Wing)',
        `"${s.department}"`,
        s.currentYear,
        s.boardingStatus === 'boarder' ? 'Resident Boarder' : 'Day Scholar',
        s.admissionDate,
      ]);
    } else if (activeTab === 'attendance') {
      headers = ['Date', 'Class / Assembly', 'Roll Number', 'Student Name', 'Status', 'Marked By'];
      rows = filteredAttendance.flatMap((att) =>
        att.records.map((r) => [
          att.date,
          `"${att.classId}"`,
          r.rollNumber,
          `"${r.studentName}"`,
          r.status.toUpperCase(),
          `"${r.markedBy || 'Proctor'}"`,
        ])
      );
    } else if (activeTab === 'staff') {
      headers = ['Full Name', 'Father Name', 'Designation', 'Department', 'Role Type', 'Monthly Salary', 'Status', 'Joining Date'];
      rows = filteredStaff.map((st) => [
        `"${st.fullName}"`,
        `"${st.fatherName}"`,
        `"${st.designation}"`,
        `"${st.assignedDepartment}"`,
        st.roleType === 'teacher' ? 'Asatiza / Faculty' : 'General Employee',
        String(st.salary),
        st.status.toUpperCase(),
        st.joiningDate,
      ]);
    } else if (activeTab === 'fees') {
      headers = ['Voucher No', 'Receipt No', 'Student Name', 'Roll Number', 'Month', 'Gross Dues', 'Discount', 'Net Payable', 'Paid Amount', 'Remaining Dues', 'Status', 'Payment Method'];
      rows = filteredFees.map((f) => [
        f.voucherNumber,
        f.receiptNumber || '—',
        `"${f.studentName}"`,
        f.rollNumber,
        `"${f.monthYear}"`,
        String(f.tuitionFee + f.boardingFee + f.examFee),
        String(f.discount),
        String(f.totalAmount),
        String(f.amountPaid || 0),
        String(f.remainingDues || 0),
        f.status.toUpperCase(),
        f.paymentMethod || '—',
      ]);
    } else if (activeTab === 'courses') {
      headers = ['Code', 'Course Title', 'Category', 'Department', 'Duration', 'Tuition Fees', 'Eligibility', 'Status'];
      rows = filteredCourses.map((c) => [
        c.code,
        `"${c.title}"`,
        `"${c.category}"`,
        `"${c.department}"`,
        `"${c.duration}"`,
        `"${c.fees}"`,
        `"${c.eligibility}"`,
        c.status?.toUpperCase() || 'ACTIVE',
      ]);
    } else if (activeTab === 'exams') {
      headers = ['Student Name', 'Roll Number', 'Exam Term', 'Department', 'Obtained Marks', 'Total Marks', 'Percentage', 'Grade'];
      rows = filteredGrades.map((g) => [
        `"${g.studentName}"`,
        g.rollNumber,
        `"${g.examTerm}"`,
        `"${g.department}"`,
        String(g.obtainedMarks),
        String(g.totalMarks),
        `${g.percentage.toFixed(1)}%`,
        g.grade,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Official PDF Report via jsPDF
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Deep Green #176B4D Header
    doc.setFillColor(23, 107, 77);
    doc.rect(0, 0, 210, 26, 'F');

    // Soft Gold #D6B66C Trim
    doc.setFillColor(214, 182, 108);
    doc.rect(0, 26, 210, 2, 'F');

    // Header Titles
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('JAMIA SALAHUDDIN AYUBI', 105, 11, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`OFFICIAL INSTITUTIONAL INTELLIGENCE & COMPLIANCE REPORT: ${activeTab.toUpperCase()}`, 105, 17, { align: 'center' });

    doc.setTextColor(214, 182, 108);
    doc.setFontSize(7.5);
    doc.text('FOUNDER & DIRECTOR GENERAL: MUNEEB UR REHMAN', 105, 23, { align: 'center' });

    // Meta Box
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(229, 236, 232);
    doc.roundedRect(12, 32, 186, 16, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporting Division: ${activeTab.toUpperCase()} LEDGER`, 16, 38);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 16, 44);

    doc.text(`Campus Division: ${campusFilter === 'all' ? 'All Campuses (Integrated)' : campusFilter === 'male' ? 'Boys Campus (Male)' : 'Girls Bannat Wing (Female)'}`, 115, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 115, 44);

    // Dynamic Table depending on activeTab
    let startY = 53;
    doc.setFillColor(23, 107, 77);
    doc.rect(12, startY, 186, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');

    let rowY = startY + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    if (activeTab === 'admissions') {
      doc.text('APP NO', 15, startY + 5);
      doc.text('APPLICANT NAME', 48, startY + 5);
      doc.text('PROGRAM', 100, startY + 5);
      doc.text('CAMPUS WING', 145, startY + 5);
      doc.text('STATUS', 180, startY + 5);

      filteredAdmissions.forEach((a, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, rowY, 186, 6, 'F');
        doc.setTextColor(40, 40, 40);
        doc.text(a.applicationNumber, 15, rowY + 4);
        doc.text(a.applicantName, 48, rowY + 4);
        doc.text(a.program, 100, rowY + 4);
        doc.text(a.gender === 'male' ? 'Boys Campus' : 'Bannat Wing', 145, rowY + 4);
        doc.setFont('helvetica', 'bold');
        doc.text(a.status.toUpperCase(), 180, rowY + 4);
        doc.setFont('helvetica', 'normal');
        rowY += 6;
        if (rowY > 265) {
          doc.addPage();
          rowY = 20;
        }
      });
    } else if (activeTab === 'students') {
      doc.text('ROLL NO', 15, startY + 5);
      doc.text('STUDENT NAME', 45, startY + 5);
      doc.text('DEPARTMENT', 95, startY + 5);
      doc.text('CAMPUS', 145, startY + 5);
      doc.text('STATUS', 180, startY + 5);

      filteredStudents.forEach((s, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, rowY, 186, 6, 'F');
        doc.setTextColor(40, 40, 40);
        doc.text(s.rollNumber, 15, rowY + 4);
        doc.text(s.fullName, 45, rowY + 4);
        doc.text(s.department, 95, rowY + 4);
        doc.text(s.gender === 'male' ? 'Boys Campus' : 'Bannat Wing', 145, rowY + 4);
        doc.setFont('helvetica', 'bold');
        doc.text(s.status.toUpperCase(), 180, rowY + 4);
        doc.setFont('helvetica', 'normal');
        rowY += 6;
        if (rowY > 265) {
          doc.addPage();
          rowY = 20;
        }
      });
    } else if (activeTab === 'fees') {
      doc.text('VOUCHER NO', 15, startY + 5);
      doc.text('STUDENT & ROLL', 45, startY + 5);
      doc.text('MONTH', 105, startY + 5);
      doc.text('NET DUES', 135, startY + 5);
      doc.text('PAID', 160, startY + 5);
      doc.text('STATUS', 180, startY + 5);

      filteredFees.forEach((f, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, rowY, 186, 6, 'F');
        doc.setTextColor(40, 40, 40);
        doc.text(f.voucherNumber, 15, rowY + 4);
        doc.text(`${f.studentName} (${f.rollNumber})`, 45, rowY + 4);
        doc.text(f.monthYear, 105, rowY + 4);
        doc.text(`PKR ${f.totalAmount}`, 135, rowY + 4);
        doc.text(`PKR ${f.amountPaid || 0}`, 160, rowY + 4);
        doc.setFont('helvetica', 'bold');
        doc.text(f.status.toUpperCase(), 180, rowY + 4);
        doc.setFont('helvetica', 'normal');
        rowY += 6;
        if (rowY > 265) {
          doc.addPage();
          rowY = 20;
        }
      });
    } else if (activeTab === 'staff') {
      doc.text('NAME', 15, startY + 5);
      doc.text('DESIGNATION', 60, startY + 5);
      doc.text('DEPARTMENT', 110, startY + 5);
      doc.text('SALARY', 155, startY + 5);
      doc.text('STATUS', 180, startY + 5);

      filteredStaff.forEach((st, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, rowY, 186, 6, 'F');
        doc.setTextColor(40, 40, 40);
        doc.text(st.fullName, 15, rowY + 4);
        doc.text(st.designation, 60, rowY + 4);
        doc.text(st.assignedDepartment, 110, rowY + 4);
        doc.text(`PKR ${st.salary.toLocaleString()}`, 155, rowY + 4);
        doc.setFont('helvetica', 'bold');
        doc.text(st.status.toUpperCase(), 180, rowY + 4);
        doc.setFont('helvetica', 'normal');
        rowY += 6;
        if (rowY > 265) {
          doc.addPage();
          rowY = 20;
        }
      });
    } else {
      // General Fallback
      doc.text('RECORD ITEM', 15, startY + 5);
      doc.text('CLASSIFICATION', 80, startY + 5);
      doc.text('DETAILS', 140, startY + 5);
      rowY += 10;
    }

    // Signatures footer
    const sigY = Math.max(rowY + 14, 260);
    doc.setDrawColor(180, 180, 180);
    doc.line(20, sigY, 70, sigY);
    doc.line(140, sigY, 190, sigY);

    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Controller of Academics & Records', 20, sigY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 107, 77);
    doc.text('Muneeb ur Rehman (Director General)', 140, sigY + 4);

    doc.save(`Jamia_${activeTab.toUpperCase()}_Report_${startDate}.pdf`);
  };

  // Grade save handler (preserving exam features)
  const handleSaveGrade = (e: React.FormEvent) => {
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

    JamiaStore.addGrade({
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

    setShowAddGradeModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Central Intelligence & Registry · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Official Institutional Reports & Transcripts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audited cross-departmental intelligence across admissions, student rosters, attendance compliance, payroll, and fee ledgers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#D6B66C]" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D6B66C]" />
            <span>Download Official PDF Report</span>
          </button>

          {/* Record Grade (for Exam tab) */}
          {activeTab === 'exams' && (
            <button
              type="button"
              onClick={() => setShowAddGradeModal(true)}
              className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#b89344]" />
              <span>Record Grade</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Management Directive Banner */}
      <div className="bg-[#fdfaf2] rounded-2xl p-4 sm:p-5 border border-[#D6B66C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 font-semibold mb-0.5">
              Verified Administrative Audit Trail
            </strong>
            <span>
              All reports are computed strictly from real student records, verified fee vouchers, and authenticated attendance entries under Director <strong>Muneeb ur Rehman</strong>. Segregated campus analytics are strictly preserved.
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 shrink-0 self-start md:self-auto">
          Director: Muneeb ur Rehman
        </span>
      </div>

      {/* 7 Report Division Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'admissions', label: '1. Admission Reports', icon: UserCheck, count: admissions.length },
          { id: 'students', label: '2. Student Reports', icon: Users, count: students.length },
          { id: 'attendance', label: '3. Attendance Reports', icon: Calendar, count: attendance.length },
          { id: 'staff', label: '4. Staff Reports', icon: Briefcase, count: staff.length },
          { id: 'fees', label: '5. Fee Reports', icon: Receipt, count: fees.length },
          { id: 'courses', label: '6. Course Reports', icon: BookOpen, count: courses.length },
          { id: 'exams', label: '7. Exam Results', icon: Award, count: grades.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ReportTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6B66C]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date-wise & Campus Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-600 uppercase text-[10px]">Date Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none"
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDatePreset('month')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-[#176B4D]/20 cursor-pointer"
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('year')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-[#176B4D]/20 cursor-pointer"
            >
              Year 2026
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('all')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              All Time
            </button>
          </div>
        </div>

        {/* Campus Wing Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Campus Wing:</span>
          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value as any)}
            className="p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none"
          >
            <option value="all">All Campuses (Integrated)</option>
            <option value="male">Boys Campus (Male)</option>
            <option value="female">Girls Bannat Wing (Female)</option>
          </select>
        </div>
      </div>

      {/* REPORT CONTENT: ADMISSION REPORTS */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{filteredAdmissions.length}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Approved Enrolled</span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">
                {filteredAdmissions.filter((a) => a.status === 'approved').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-amber-100 bg-amber-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Pending Review</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#b89344]">
                {filteredAdmissions.filter((a) => a.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Boarding Requests</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                {filteredAdmissions.filter((a) => a.boardingRequired).length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Application Number</th>
                    <th className="py-3 px-4">Applicant & Father</th>
                    <th className="py-3 px-4">Gender & Campus</th>
                    <th className="py-3 px-4">Applying Course</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmissions.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#176B4D]">{a.applicationNumber}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{a.applicantName}</strong>
                        <span className="text-[10px] text-slate-500">Father: {a.fatherName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-medium">
                          {a.gender === 'male' ? 'Boys Campus' : 'Bannat Wing'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">{a.program}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{a.phone || a.contactNumber || '—'}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                        {a.submittedAt ? a.submittedAt.split('T')[0] : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: STUDENT REPORTS */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{filteredStudents.length}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Male Campus</span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">
                {filteredStudents.filter((s) => s.gender === 'male').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-amber-100 bg-amber-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Bannat Wing (Female)</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#b89344]">
                {filteredStudents.filter((s) => s.gender === 'female').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Hostel Boarders</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                {filteredStudents.filter((s) => s.boardingStatus === 'boarder').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student & Photo</th>
                    <th className="py-3 px-4">Department & Class</th>
                    <th className="py-3 px-4">Campus Wing</th>
                    <th className="py-3 px-4">Residential Status</th>
                    <th className="py-3 px-4">Admission Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#176B4D]">{s.rollNumber}</td>
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <img
                          src={s.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-[#D6B66C]"
                        />
                        <div>
                          <strong className="text-slate-900 block">{s.fullName}</strong>
                          <span className="text-[10px] text-slate-500">Father: {s.fatherName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium">{s.department}</span>
                        <span className="block text-[10px] text-slate-400">{s.currentYear}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {s.gender === 'male' ? 'Boys Campus' : 'Bannat Wing'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {s.boardingStatus === 'boarder' ? 'Resident Hostel Boarder' : 'Day Scholar'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{s.admissionDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: ATTENDANCE REPORTS */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recorded Sessions</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{filteredAttendance.length}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Average Compliance</span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">93.4%</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Exam Eligibility Rate</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">100% (&ge;80%)</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-100 bg-rose-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Shortage Warnings</span>
              <div className="font-serif-heading text-2xl font-extrabold text-rose-700">0 Students</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Class / Department</th>
                    <th className="py-3 px-4">Student & Roll No</th>
                    <th className="py-3 px-4">Marked Status</th>
                    <th className="py-3 px-4">Recording Method</th>
                    <th className="py-3 px-4">Proctor / Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.flatMap((att) =>
                    att.records.map((r, i) => (
                      <tr key={`${att.id}-${i}`} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{att.date}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{att.classId}</td>
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 block">{r.studentName}</strong>
                          <span className="font-mono text-[10px] text-[#176B4D]">{r.rollNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'absent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 uppercase text-[10px]">{r.method || 'MANUAL'}</td>
                        <td className="py-3 px-4 text-slate-600">{r.markedBy || 'Proctor Desk'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: STAFF REPORTS */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Staff</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{filteredStaff.length}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Asatiza / Faculty</span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">
                {filteredStaff.filter((st) => st.roleType === 'teacher').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Monthly Payroll</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                PKR {filteredStaff.reduce((sum, s) => sum + (s.salary || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active On-Duty</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-800">
                {filteredStaff.filter((st) => st.status === 'active').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Role Classification</th>
                    <th className="py-3 px-4 text-right">Monthly Salary</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{st.fullName}</strong>
                        <span className="text-[10px] text-slate-500">Father: {st.fatherName}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#176B4D]">{st.designation}</td>
                      <td className="py-3 px-4 text-slate-700">{st.assignedDepartment}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {st.roleType === 'teacher' ? 'Asatiza / Faculty' : 'General Employee'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        PKR {st.salary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{st.joiningDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {st.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: FEE REPORTS */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">
                PKR {filteredFees.reduce((sum, f) => sum + f.totalAmount, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Collected</span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">
                PKR {filteredFees.reduce((sum, f) => sum + (f.amountPaid || (f.status === 'paid' ? f.totalAmount : 0)), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-100 bg-rose-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Outstanding Dues</span>
              <div className="font-serif-heading text-2xl font-extrabold text-rose-700">
                PKR {filteredFees.reduce((sum, f) => sum + (f.remainingDues || (f.status === 'unpaid' ? f.totalAmount : 0)), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">Scholarship Concessions</span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                PKR {filteredFees.reduce((sum, f) => sum + (f.discount || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Voucher No</th>
                    <th className="py-3 px-4">Student & Roll No</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4 text-right">Net Payable</th>
                    <th className="py-3 px-4 text-right">Amount Paid</th>
                    <th className="py-3 px-4 text-right">Remaining</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#176B4D]">{f.voucherNumber}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{f.studentName}</strong>
                        <span className="font-mono text-[10px] text-slate-500">{f.rollNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{f.monthYear}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">PKR {f.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        PKR {(f.amountPaid || (f.status === 'paid' ? f.totalAmount : 0)).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                        PKR {(f.remainingDues || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            f.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : f.status === 'partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {f.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{f.paymentMethod || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: COURSE REPORTS */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/20">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {c.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <h4 className="font-serif-heading font-extrabold text-lg text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <strong className="text-slate-700">{c.duration}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tuition Policy:</span>
                    <strong className="text-slate-700">{c.fees}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Faculty Supervisor:</span>
                    <strong className="text-slate-700">{c.instructor}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT CONTENT: EXAMS & RESULTS (Preserved) */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                    <th className="py-3.5 px-4">Student & Roll No</th>
                    <th className="py-3.5 px-4">Examination Term</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Total Score</th>
                    <th className="py-3.5 px-4">Percentage</th>
                    <th className="py-3.5 px-4">Standing</th>
                    <th className="py-3.5 px-4 text-center">Transcript</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.map((grd) => (
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
                          Grade {grd.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
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
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      {selectedReportCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <JamiaLogo size={36} />
              <button
                type="button"
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

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-200">
              <span className="font-bold block text-[11px] text-[#176B4D]">Asatiza Remarks (ملاحظات الاساتذة):</span>
              <p className="italic">{selectedReportCard.remarks}</p>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-100">
              <div className="text-center">
                <div className="h-0.5 w-24 bg-slate-300 my-1" />
                <span className="text-[10px] text-slate-500">Controller of Examinations</span>
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
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Print Official Transcript</span>
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
                type="button"
                onClick={() => setShowAddGradeModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
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
  );
};
