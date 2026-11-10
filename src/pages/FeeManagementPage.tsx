import React, { useState, useEffect } from 'react';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { FeeVoucher, FeeStructure, Student, FeePaymentEntry } from '../types';
import { JamiaLogo } from '../components/JamiaLogo';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  Receipt,
  Plus,
  Printer,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Edit3,
  Trash2,
  FileText,
  User,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  Layers,
  History,
  TrendingUp,
} from 'lucide-react';

export const FeeManagementPage: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();

  // Core Data
  const [fees, setFees] = useState<FeeVoucher[]>(() => JamiaStore.getFees());
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => JamiaStore.getFeeStructures());
  const [students, setStudents] = useState<Student[]>(() => JamiaStore.getStudents());
  const settings = JamiaStore.getSettings();

  // Active Tab: 'vouchers' | 'dashboard' | 'structures'
  const [activeTab, setActiveTab] = useState<'vouchers' | 'dashboard' | 'structures'>('vouchers');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Modals
  const [showNewVoucherModal, setShowNewVoucherModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [selectedFeeVoucher, setSelectedFeeVoucher] = useState<FeeVoucher | null>(null);
  const [recordPaymentVoucher, setRecordPaymentVoucher] = useState<FeeVoucher | null>(null);
  const [studentHistoryDrawer, setStudentHistoryDrawer] = useState<Student | null>(null);

  // New Voucher Form
  const [voucherForm, setVoucherForm] = useState({
    studentId: students[0]?.id || '',
    monthYear: 'March 2026',
    feeType: 'monthly' as 'monthly' | 'annual' | 'admission' | 'exam',
    tuitionFee: 3500,
    boardingFee: 0,
    examFee: 0,
    otherDues: 0,
    discount: 0,
    amountPaid: 0,
    dueDate: '2026-03-15',
    remarks: '',
  });

  // Record Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'Cash',
    receiptNumber: '',
    notes: 'Payment received at institute treasury counter',
    receivedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
  });

  // Structure Form
  const [structureForm, setStructureForm] = useState<Omit<FeeStructure, 'id'>>({
    courseId: 'custom-course',
    courseName: '',
    department: 'Classical Islamic Sciences',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 3000,
    boardingFee: 5000,
    admissionFee: 1500,
    examFee: 500,
    otherDues: 0,
    isScholarshipApplicable: true,
    notes: '',
  });

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Subscribe to storage
  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setFees(JamiaStore.getFees());
      setFeeStructures(JamiaStore.getFeeStructures());
      setStudents(JamiaStore.getStudents());
    });
    return unsub;
  }, []);

  // Update voucherForm when student changes (auto-fill defaults from student department)
  useEffect(() => {
    const st = students.find((s) => s.id === voucherForm.studentId);
    if (st) {
      // Find matching fee structure
      const matchingStruct = feeStructures.find(
        (f) =>
          st.department.toLowerCase().includes(f.courseName.toLowerCase()) ||
          f.courseName.toLowerCase().includes(st.department.toLowerCase())
      );
      if (matchingStruct) {
        setVoucherForm((prev) => ({
          ...prev,
          tuitionFee: matchingStruct.tuitionFee,
          boardingFee: st.boardingStatus === 'boarder' ? matchingStruct.boardingFee : 0,
          examFee: matchingStruct.examFee,
        }));
      }
    }
  }, [voucherForm.studentId, students, feeStructures]);

  // Filtered Vouchers
  const filteredFees = fees.filter((vch) => {
    const st = students.find((s) => s.id === vch.studentId || s.rollNumber === vch.rollNumber);
    const gender = vch.gender || st?.gender || 'male';

    const matchesGender = selectedGender === 'all' || gender === selectedGender;
    const matchesStatus = selectedStatus === 'all' || vch.status === selectedStatus;
    const matchesMonth = selectedMonth === 'all' || vch.monthYear === selectedMonth;
    const matchesCourse =
      selectedCourse === 'all' ||
      vch.department.toLowerCase().includes(selectedCourse.toLowerCase()) ||
      (vch.course && vch.course.toLowerCase().includes(selectedCourse.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      vch.studentName.toLowerCase().includes(query) ||
      vch.rollNumber.toLowerCase().includes(query) ||
      vch.voucherNumber.toLowerCase().includes(query) ||
      (vch.receiptNumber && vch.receiptNumber.toLowerCase().includes(query));

    return matchesGender && matchesStatus && matchesMonth && matchesCourse && matchesSearch;
  });

  // Financial Dashboard Calculations
  const totalBilled = fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
  const totalCollected = fees.reduce((sum, f) => sum + (f.amountPaid !== undefined ? f.amountPaid : f.status === 'paid' ? f.totalAmount : 0), 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const totalConcessions = fees.reduce((sum, f) => sum + (f.discount || 0), 0);

  // Course-Wise Collections
  const courseCollections = fees.reduce((acc, f) => {
    const courseKey = f.course || f.department || 'General';
    const collected = f.amountPaid !== undefined ? f.amountPaid : f.status === 'paid' ? f.totalAmount : 0;
    acc[courseKey] = (acc[courseKey] || 0) + collected;
    return acc;
  }, {} as Record<string, number>);

  // Monthly Collections
  const monthlyCollections = fees.reduce((acc, f) => {
    const monthKey = f.monthYear || 'Other';
    const collected = f.amountPaid !== undefined ? f.amountPaid : f.status === 'paid' ? f.totalAmount : 0;
    acc[monthKey] = (acc[monthKey] || 0) + collected;
    return acc;
  }, {} as Record<string, number>);

  // Handler: Create Voucher
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

    const amountPaid = Number(voucherForm.amountPaid) || 0;
    const remainingDues = Math.max(0, total - amountPaid);

    let status: FeeVoucher['status'] = 'unpaid';
    if (total === 0 || amountPaid >= total) status = 'paid';
    else if (amountPaid > 0) status = 'partial';

    const receiptNumber = amountPaid > 0 ? `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const paymentHistory: FeePaymentEntry[] = [];
    if (amountPaid > 0 && receiptNumber) {
      paymentHistory.push({
        id: 'pay-' + Date.now(),
        receiptNumber,
        amount: amountPaid,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        receivedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
        notes: 'Initial deposit upon voucher generation',
      });
    }

    JamiaStore.addFeeVoucher({
      studentId: st.id,
      studentName: st.fullName,
      rollNumber: st.rollNumber,
      gender: st.gender,
      department: st.department,
      course: st.department,
      monthYear: voucherForm.monthYear,
      feeType: voucherForm.feeType,
      tuitionFee: Number(voucherForm.tuitionFee),
      boardingFee: Number(voucherForm.boardingFee),
      examFee: Number(voucherForm.examFee),
      otherDues: Number(voucherForm.otherDues),
      discount: Number(voucherForm.discount),
      totalAmount: Math.max(0, total),
      amountPaid,
      remainingDues,
      dueDate: voucherForm.dueDate,
      status,
      receiptNumber,
      paidDate: amountPaid > 0 ? new Date().toISOString() : undefined,
      paymentMethod: amountPaid > 0 ? 'Cash' : undefined,
      collectedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
      remarks: voucherForm.remarks,
      paymentHistory,
    });

    setShowNewVoucherModal(false);
    setToastMessage(`✓ Fee voucher issued for ${st.fullName} (${st.rollNumber})!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: Record Payment (Full or Partial)
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordPaymentVoucher) return;

    const amount = Number(paymentForm.amount);
    if (amount <= 0) return;

    JamiaStore.recordFeePayment(recordPaymentVoucher.id, {
      amount,
      paymentMethod: paymentForm.paymentMethod,
      receiptNumber: paymentForm.receiptNumber || undefined,
      notes: paymentForm.notes,
      receivedBy: paymentForm.receivedBy,
    });

    setRecordPaymentVoucher(null);
    setToastMessage(`✓ Payment of PKR ${amount.toLocaleString()} successfully credited!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: Add Fee Structure
  const handleAddStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!structureForm.courseName.trim()) return;

    JamiaStore.addFeeStructure(structureForm);
    setShowStructureModal(false);
    setToastMessage(`✓ Fee structure configured for ${structureForm.courseName}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Supabase Sync
  const handleSupabaseSync = async () => {
    setIsSyncing(true);
    const res = await JamiaStore.syncFeesWithSupabase();
    setToastMessage(res.message);
    setIsSyncing(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export CSV
  const exportFeesCSV = () => {
    const headers = [
      'Voucher Number',
      'Receipt Number',
      'Student Name',
      'Roll Number',
      'Gender',
      'Course',
      'Billing Month',
      'Tuition Fee',
      'Boarding Fee',
      'Exam Fee',
      'Scholarship Discount',
      'Total Net Dues',
      'Amount Paid',
      'Remaining Dues',
      'Status',
      'Payment Method',
      'Payment Date',
      'Collector',
    ];

    const rows = filteredFees.map((f) => [
      f.voucherNumber,
      f.receiptNumber || '—',
      `"${f.studentName}"`,
      f.rollNumber,
      f.gender === 'female' ? 'Female (Bannat Wing)' : 'Male (Boys Campus)',
      `"${f.department}"`,
      `"${f.monthYear}"`,
      f.tuitionFee,
      f.boardingFee,
      f.examFee,
      f.discount,
      f.totalAmount,
      f.amountPaid || 0,
      f.remainingDues || 0,
      f.status.toUpperCase(),
      f.paymentMethod || '—',
      f.paidDate ? f.paidDate.split('T')[0] : '—',
      `"${f.collectedBy || 'Muneeb ur Rehman'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jamia_Fee_Ledger_${selectedMonth}_${selectedGender}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Printable PDF Receipt / Slip via jsPDF
  const exportPDFReceipt = (vch: FeeVoucher) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5', // A5 standard receipt format
    });

    // Deep Green #176B4D Header
    doc.setFillColor(23, 107, 77);
    doc.rect(0, 0, 148, 22, 'F');

    // Soft Gold #D6B66C Accent
    doc.setFillColor(214, 182, 108);
    doc.rect(0, 22, 148, 1.5, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('JAMIA SALAHUDDIN AYUBI', 74, 9, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL TREASURY FEE RECEIPT & BANK DEPOSIT VOUCHER', 74, 14, { align: 'center' });

    doc.setTextColor(214, 182, 108);
    doc.setFontSize(6.5);
    doc.text('DIRECTOR GENERAL: MUNEEB UR REHMAN', 74, 19, { align: 'center' });

    // Receipt Meta Badge
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(229, 236, 232);
    doc.roundedRect(8, 26, 132, 16, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`VOUCHER NO: ${vch.voucherNumber}`, 12, 32);
    doc.text(`RECEIPT REF: ${vch.receiptNumber || 'PENDING DEPOSIT'}`, 12, 38);

    doc.text(`DATE ISSUED: ${vch.paidDate ? vch.paidDate.split('T')[0] : new Date().toISOString().split('T')[0]}`, 80, 32);
    doc.text(`BILLING CYCLE: ${vch.monthYear}`, 80, 38);

    // Student Particulars
    doc.setFillColor(242, 248, 245);
    doc.setDrawColor(23, 107, 77);
    doc.setLineWidth(0.3);
    doc.roundedRect(8, 45, 132, 20, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(23, 107, 77);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT PARTICULARS', 12, 50);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(`Student Name: ${vch.studentName}`, 12, 55);
    doc.text(`Roll Number: ${vch.rollNumber}`, 80, 55);
    doc.text(`Course / Department: ${vch.department}`, 12, 61);
    doc.text(`Campus Wing: ${vch.gender === 'female' ? 'Girls Bannat Wing' : 'Boys Campus'}`, 80, 61);

    // Fee Itemization Table
    let tableY = 69;
    doc.setFillColor(23, 107, 77);
    doc.rect(8, tableY, 132, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION OF DUES & HEADS', 12, tableY + 4);
    doc.text('AMOUNT (PKR)', 115, tableY + 4);

    const items = [
      { name: 'Monthly Instructional Tuition Fee', amount: vch.tuitionFee },
      { name: 'Boarding, Residency & Mess Dues', amount: vch.boardingFee },
      { name: 'Examination & Curriculum Materials', amount: vch.examFee },
      { name: 'Other Institutional Dues', amount: vch.otherDues },
      { name: 'Merit Scholarship & Financial Aid Concession', amount: -vch.discount },
    ];

    let rowY = tableY + 6;
    doc.setFont('helvetica', 'normal');
    items.forEach((it, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250);
      doc.rect(8, rowY, 132, 5, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.line(8, rowY + 5, 140, rowY + 5);

      doc.setTextColor(it.amount < 0 ? 180 : 40, it.amount < 0 ? 30 : 40, it.amount < 0 ? 30 : 40);
      doc.text(it.name, 12, rowY + 3.5);
      doc.text(
        it.amount < 0 ? `-PKR ${Math.abs(it.amount).toLocaleString()}` : `PKR ${it.amount.toLocaleString()}`,
        115,
        rowY + 3.5
      );
      rowY += 5;
    });

    // Net Totals Box
    doc.setFillColor(253, 250, 242);
    doc.setDrawColor(214, 182, 108);
    doc.roundedRect(8, rowY + 2, 132, 16, 1.5, 1.5, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 107, 77);
    doc.text(`TOTAL NET PAYABLE: PKR ${vch.totalAmount.toLocaleString()}`, 12, rowY + 7);
    doc.text(`AMOUNT PAID: PKR ${(vch.amountPaid || (vch.status === 'paid' ? vch.totalAmount : 0)).toLocaleString()}`, 12, rowY + 14);

    doc.setTextColor(vch.remainingDues && vch.remainingDues > 0 ? 190 : 23, vch.remainingDues && vch.remainingDues > 0 ? 30 : 107, vch.remainingDues && vch.remainingDues > 0 ? 30 : 77);
    doc.text(`OUTSTANDING DUES: PKR ${(vch.remainingDues || 0).toLocaleString()}`, 75, rowY + 7);
    doc.text(`STATUS: ${vch.status.toUpperCase()}`, 75, rowY + 14);

    // Bank Account Info
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Payable via official Jamia account at Meezan Bank Limited (MBL) or counter cash desk.', 8, rowY + 23);
    doc.text(`Authorized Officer: ${vch.collectedBy || 'Muneeb ur Rehman (Director General)'}`, 8, rowY + 27);

    // Signatures
    const sigY = rowY + 36;
    doc.setDrawColor(180, 180, 180);
    doc.line(12, sigY, 52, sigY);
    doc.line(95, sigY, 135, sigY);

    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text('Accountant / Cashier Stamp', 15, sigY + 3.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 107, 77);
    doc.text('Director: Muneeb ur Rehman', 97, sigY + 3.5);

    doc.save(`Jamia_Receipt_${vch.voucherNumber}_${vch.rollNumber}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
            <span>Accounts & Treasury · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Finance & Fee Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Course fee structures, student ledger vouchers, partial payment recording, and official printable receipts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Issue New Voucher Button */}
          <button
            type="button"
            onClick={() => setShowNewVoucherModal(true)}
            className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B66C]" />
            <span>Issue Fee Voucher</span>
          </button>

          {/* New Fee Structure Button */}
          <button
            type="button"
            onClick={() => setShowStructureModal(true)}
            className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#b89344]" />
            <span>Set Course Fee Structure</span>
          </button>

          {/* Export CSV Ledger */}
          <button
            type="button"
            onClick={exportFeesCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#D6B66C]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Official Management Directive Banner */}
      <div className="bg-[#fdfaf2] rounded-2xl p-4 sm:p-5 border border-[#D6B66C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 font-semibold mb-0.5">
              Authorized Manual Financial Governance Guarantee
            </strong>
            <span>
              All transactions, fee vouchers, partial payments, and scholarship concessions are strictly authenticated by Director <strong>Muneeb ur Rehman</strong> and authorized treasury officers. No automated external payment gateways or third-party auto-debits are utilized.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleSupabaseSync}
            disabled={isSyncing}
            className="text-[11px] font-bold text-[#176B4D] bg-white border border-[#176B4D]/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#f2f8f5] cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 text-[#D6B66C] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
            Treasury: Muneeb ur Rehman
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tabs (Vouchers Ledger vs Finance Dashboard vs Fee Structures) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'vouchers'
                ? 'border-[#176B4D] text-[#176B4D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Student Fee Vouchers & Receipts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-[#176B4D] text-[#176B4D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Finance Dashboard & Collections</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structures')}
            className={`pb-3 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'structures'
                ? 'border-[#176B4D] text-[#176B4D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Course Fee Structures</span>
          </button>
        </div>
      </div>

      {/* Campus Gender Selector (Segregated Male vs Female Classes) */}
      <div className="bg-white rounded-2xl p-2 border border-[#e5ece8] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8faf9] rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedGender('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedGender === 'all'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Campuses
          </button>
          <button
            type="button"
            onClick={() => setSelectedGender('male')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedGender === 'male'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Boys Campus (Male)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedGender('female')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedGender === 'female'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Girls Bannat Wing (Female)</span>
          </button>
        </div>

        {/* Status Quick Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Payment Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#176B4D]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Fully Paid</option>
            <option value="partial">Partial Payment</option>
            <option value="unpaid">Unpaid / Pending</option>
          </select>
        </div>
      </div>

      {/* TAB 1: STUDENT FEE VOUCHERS & RECEIPTS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          {/* KPI Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Billed
              </span>
              <div className="font-serif-heading text-2xl font-extrabold text-slate-900">
                PKR {totalBilled.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">{fees.length} vouchers issued</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Total Collected
              </span>
              <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">
                PKR {totalCollected.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Credited to treasury</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Outstanding Dues
              </span>
              <div className="font-serif-heading text-2xl font-extrabold text-rose-700">
                PKR {totalOutstanding.toLocaleString()}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">Pending recovery</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">
                Scholarship Concessions
              </span>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                PKR {totalConcessions.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#b89344] font-semibold">Endowment waivers</span>
            </div>
          </div>

          {/* Search & Month Filter */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, roll number, voucher or receipt..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium outline-none focus:border-[#176B4D]"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase text-[10px]">Billing Cycle:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="all">All Months / Cycles</option>
                <option value="March 2026">March 2026</option>
                <option value="February 2026">February 2026</option>
                <option value="Annual 2026-2027">Annual 2026-2027</option>
              </select>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Voucher & Receipt</th>
                    <th className="py-3 px-4">Student & Campus</th>
                    <th className="py-3 px-4">Billing Cycle</th>
                    <th className="py-3 px-4 text-right">Net Payable</th>
                    <th className="py-3 px-4 text-right">Paid Amount</th>
                    <th className="py-3 px-4 text-right">Remaining Dues</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                        No fee vouchers match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredFees.map((vch) => {
                      const amountPaid = vch.amountPaid !== undefined ? vch.amountPaid : vch.status === 'paid' ? vch.totalAmount : 0;
                      const remaining = vch.remainingDues !== undefined ? vch.remainingDues : Math.max(0, vch.totalAmount - amountPaid);

                      return (
                        <tr key={vch.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-[#176B4D]">{vch.voucherNumber}</div>
                            {vch.receiptNumber ? (
                              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 inline-block">
                                {vch.receiptNumber}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Unreceipted</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <button
                              type="button"
                              onClick={() => {
                                const st = students.find((s) => s.id === vch.studentId || s.rollNumber === vch.rollNumber);
                                if (st) setStudentHistoryDrawer(st);
                              }}
                              className="hover:text-[#176B4D] hover:underline text-left block cursor-pointer"
                            >
                              {vch.studentName}
                            </button>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-500">{vch.rollNumber}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[10px] text-[#b89344] font-medium">
                                {vch.gender === 'female' ? 'Bannat Wing' : 'Boys Campus'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700">
                            <span className="font-medium">{vch.monthYear}</span>
                            <span className="block text-[10px] text-slate-400">Due: {vch.dueDate}</span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            PKR {vch.totalAmount.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                            PKR {amountPaid.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-700">
                            PKR {remaining.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {vch.status === 'paid' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Paid
                              </span>
                            )}
                            {vch.status === 'partial' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Partial Paid
                              </span>
                            )}
                            {vch.status === 'unpaid' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                Unpaid
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {vch.status !== 'paid' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRecordPaymentVoucher(vch);
                                    setPaymentForm({
                                      amount: remaining,
                                      paymentMethod: 'Cash',
                                      receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                                      notes: 'Payment confirmed by treasury officer',
                                      receivedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
                                    });
                                  }}
                                  className="px-2.5 py-1 text-xs font-bold text-[#176B4D] bg-[#f2f8f5] hover:bg-[#e5ece8] rounded-lg border border-[#176B4D]/30 transition-all cursor-pointer"
                                  title="Record Payment Installment"
                                >
                                  + Record Payment
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedFeeVoucher(vch)}
                                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-all cursor-pointer"
                                title="View Slip"
                              >
                                View Slip
                              </button>

                              <button
                                type="button"
                                onClick={() => exportPDFReceipt(vch)}
                                className="p-1 text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-slate-200 cursor-pointer"
                                title="Download PDF Receipt"
                              >
                                <Download className="w-3.5 h-3.5 text-[#D6B66C]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCE DASHBOARD & COLLECTIONS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course-Wise Fee Collection Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-serif-heading font-extrabold text-base text-[#176B4D]">
                  <Layers className="w-4 h-4 text-[#D6B66C]" />
                  <span>Course-Wise Fee Collection</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Realized to date</span>
              </div>

              <div className="space-y-3">
                {Object.entries(courseCollections).map(([courseName, amount]) => {
                  const pct = totalCollected > 0 ? ((amount / totalCollected) * 100).toFixed(1) : '0';
                  return (
                    <div key={courseName} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{courseName}</span>
                        <span className="font-mono text-[#176B4D] font-bold">
                          PKR {amount.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#176B4D] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Collection Ledger */}
            <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-serif-heading font-extrabold text-base text-[#176B4D]">
                  <Calendar className="w-4 h-4 text-[#D6B66C]" />
                  <span>Monthly Collection Breakdown</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Treasury recovery</span>
              </div>

              <div className="space-y-3">
                {Object.entries(monthlyCollections).map(([month, amount]) => (
                  <div
                    key={month}
                    className="p-3.5 bg-[#f8faf9] rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-900 block">{month}</strong>
                      <span className="text-[10px] text-slate-400">Monthly billing ledger</span>
                    </div>
                    <span className="font-mono font-extrabold text-sm text-emerald-800">
                      PKR {amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment History Audit Log */}
          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-serif-heading font-extrabold text-base text-[#176B4D]">
                <History className="w-4 h-4 text-[#D6B66C]" />
                <span>Confirmed Payment Transaction Log</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Manual authentication verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Student & Roll No</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Received By</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fees
                    .flatMap((f) =>
                      (f.paymentHistory || []).map((p) => ({
                        ...p,
                        studentName: f.studentName,
                        rollNumber: f.rollNumber,
                      }))
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#176B4D]">{item.receiptNumber}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {item.studentName} ({item.rollNumber})
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {item.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                          PKR {item.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{item.receivedBy}</td>
                        <td className="py-2.5 px-3 text-slate-400 italic text-[11px]">{item.notes || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE FEE STRUCTURES */}
      {activeTab === 'structures' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-heading font-extrabold text-lg text-[#176B4D]">
                Approved Course Fee Tariffs & Concessions
              </h3>
              <p className="text-xs text-slate-500">
                Official billing frameworks configured and verified by Director Muneeb ur Rehman
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowStructureModal(true)}
              className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D6B66C]" />
              <span>Configure New Tariff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeStructures.map((fs) => (
              <div
                key={fs.id}
                className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#176B4D]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#b89344] uppercase tracking-wider text-[10px]">
                      {fs.academicYear} · {fs.billingFrequency.toUpperCase()}
                    </span>
                    {fs.isScholarshipApplicable && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Scholarships Allowed
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-serif-heading font-extrabold text-lg text-slate-900 leading-tight">
                      {fs.courseName}
                    </h4>
                    <span className="text-xs text-slate-500">{fs.department}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Instructional Tuition:</span>
                      <strong className="font-mono text-slate-900">PKR {fs.tuitionFee.toLocaleString()} / mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Boarding & Mess (Hostel):</span>
                      <strong className="font-mono text-slate-900">PKR {fs.boardingFee.toLocaleString()} / mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Admission / Sanad Fee:</span>
                      <strong className="font-mono text-slate-900">PKR {fs.admissionFee.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Term Examination Fee:</span>
                      <strong className="font-mono text-slate-900">PKR {fs.examFee.toLocaleString()}</strong>
                    </div>
                  </div>

                  {fs.notes && (
                    <div className="p-2.5 bg-[#fdfaf2] rounded-xl border border-[#D6B66C]/40 text-[11px] text-slate-700">
                      <strong>Policy: </strong> {fs.notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Authorized by Muneeb ur Rehman</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete fee structure for ${fs.courseName}?`)) {
                        JamiaStore.deleteFeeStructure(fs.id);
                        setToastMessage('Fee structure removed.');
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Delete Structure"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: RECORD PAYMENT / INSTALLMENT */}
      {recordPaymentVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#176B4D] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                  Treasury Receipt Counter
                </span>
                <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                  Record Fee Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRecordPaymentVoucher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#f8faf9] rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <strong className="text-slate-900">{recordPaymentVoucher.studentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number:</span>
                <strong className="font-mono text-[#176B4D]">{recordPaymentVoucher.rollNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voucher / Month:</span>
                <span>{recordPaymentVoucher.voucherNumber} · {recordPaymentVoucher.monthYear}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Outstanding Remaining Dues:</span>
                <strong className="font-mono text-rose-700 font-extrabold text-sm">
                  PKR {(recordPaymentVoucher.remainingDues || recordPaymentVoucher.totalAmount).toLocaleString()}
                </strong>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Payment Amount Received (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={recordPaymentVoucher.remainingDues || recordPaymentVoucher.totalAmount}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold text-base focus:border-[#176B4D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                  >
                    <option value="Cash">Cash (Counter Deposit)</option>
                    <option value="Bank Deposit (Meezan Bank)">Bank Deposit (Meezan Bank)</option>
                    <option value="Bank Transfer">Online Bank Transfer / Raast</option>
                    <option value="Cheque">Bank Cheque / Pay Order</option>
                    <option value="Jamia Merit Endowment Fund">Jamia Merit Endowment Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={paymentForm.receiptNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiptNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold focus:border-[#176B4D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notes / Transaction Remarks</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRecordPaymentVoucher(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                  <span>Confirm Payment & Issue Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE SLIP PREVIEW */}
      {selectedFeeVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <JamiaLogo size={34} />
              <button
                type="button"
                onClick={() => setSelectedFeeVoucher(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              <h3 className="font-serif-heading font-extrabold text-lg text-[#176B4D]">
                Official Fee Deposit Slip & Voucher
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
                <span className="text-slate-500">Department / Course:</span>
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
                <span className="font-mono">PKR {selectedFeeVoucher.tuitionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Boarding & Mess Fee:</span>
                <span className="font-mono">PKR {selectedFeeVoucher.boardingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Exam / Library Fee:</span>
                <span className="font-mono">PKR {selectedFeeVoucher.examFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                <span>Merit Scholarship Discount:</span>
                <span className="font-mono">-PKR {selectedFeeVoucher.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-[#176B4D] bg-[#f2f8f5] px-2 rounded-lg">
                <span>Net Amount Payable:</span>
                <span className="font-mono">PKR {selectedFeeVoucher.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-xs font-semibold text-emerald-800 px-2">
                <span>Amount Already Paid:</span>
                <span className="font-mono">PKR {(selectedFeeVoucher.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-xs font-semibold text-rose-800 px-2">
                <span>Remaining Outstanding Dues:</span>
                <span className="font-mono">PKR {(selectedFeeVoucher.remainingDues || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p><strong>Bank Account:</strong> Meezan Bank Ltd (Islamic Banking)</p>
              <p><strong>Account Title:</strong> Jamia Salahuddin Ayubi (Director: Muneeb ur Rehman)</p>
              <p><strong>Status:</strong> {selectedFeeVoucher.status.toUpperCase()}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => exportPDFReceipt(selectedFeeVoucher)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#176B4D] border border-[#176B4D]/30 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Save PDF Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ISSUE NEW FEE VOUCHER */}
      {showNewVoucherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Issue Student Fee Voucher
              </h3>
              <button
                type="button"
                onClick={() => setShowNewVoucherModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Student *</label>
                <select
                  value={voucherForm.studentId}
                  onChange={(e) => setVoucherForm({ ...voucherForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.rollNumber}) — {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Billing Month / Cycle</label>
                  <input
                    type="text"
                    value={voucherForm.monthYear}
                    onChange={(e) => setVoucherForm({ ...voucherForm, monthYear: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                    placeholder="e.g. March 2026 or Annual 2026-27"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={voucherForm.dueDate}
                    onChange={(e) => setVoucherForm({ ...voucherForm, dueDate: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Instructional Tuition (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={voucherForm.tuitionFee}
                    onChange={(e) => setVoucherForm({ ...voucherForm, tuitionFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Boarding & Mess (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={voucherForm.boardingFee}
                    onChange={(e) => setVoucherForm({ ...voucherForm, boardingFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Exam / Misc (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={voucherForm.examFee}
                    onChange={(e) => setVoucherForm({ ...voucherForm, examFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Scholarship Discount (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={voucherForm.discount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discount: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Initial Deposit (Optional)</label>
                <input
                  type="number"
                  min="0"
                  value={voucherForm.amountPaid}
                  onChange={(e) => setVoucherForm({ ...voucherForm, amountPaid: Number(e.target.value) })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold text-emerald-700"
                  placeholder="Enter 0 if unpaid"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notes / Scholarship Approval</label>
                <input
                  type="text"
                  value={voucherForm.remarks}
                  onChange={(e) => setVoucherForm({ ...voucherForm, remarks: e.target.value })}
                  placeholder="e.g. Merit concession approved by Director Muneeb ur Rehman"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewVoucherModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Generate & Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE FEE STRUCTURE */}
      {showStructureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Configure Course Fee Structure
              </h3>
              <button
                type="button"
                onClick={() => setShowStructureModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStructure} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course / Program Name *</label>
                <input
                  type="text"
                  required
                  value={structureForm.courseName}
                  onChange={(e) => setStructureForm({ ...structureForm, courseName: e.target.value })}
                  placeholder="e.g. Tajweed-ul-Quran Specialization"
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={structureForm.department}
                    onChange={(e) => setStructureForm({ ...structureForm, department: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Billing Frequency</label>
                  <select
                    value={structureForm.billingFrequency}
                    onChange={(e) => setStructureForm({ ...structureForm, billingFrequency: e.target.value as any })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="one_time">One-Time Modular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tuition Fee (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={structureForm.tuitionFee}
                    onChange={(e) => setStructureForm({ ...structureForm, tuitionFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Boarding Fee (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={structureForm.boardingFee}
                    onChange={(e) => setStructureForm({ ...structureForm, boardingFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Admission Fee (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={structureForm.admissionFee}
                    onChange={(e) => setStructureForm({ ...structureForm, admissionFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Exam Fee (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={structureForm.examFee}
                    onChange={(e) => setStructureForm({ ...structureForm, examFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Policy & Scholarship Guidelines</label>
                <textarea
                  rows={2}
                  value={structureForm.notes}
                  onChange={(e) => setStructureForm({ ...structureForm, notes: e.target.value })}
                  placeholder="Detail financial concessions, Huffaz waivers, or endowment terms..."
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStructureModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT FEE HISTORY DRAWER */}
      {studentHistoryDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={studentHistoryDrawer.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                  alt={studentHistoryDrawer.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D6B66C]"
                />
                <div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-slate-900">
                    {studentHistoryDrawer.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll: <strong className="text-[#176B4D]">{studentHistoryDrawer.rollNumber}</strong> · {studentHistoryDrawer.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStudentHistoryDrawer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Student Ledger Vouchers */}
            <div className="space-y-3">
              <h4 className="font-serif-heading font-extrabold text-sm text-[#176B4D]">
                Complete Student Billing History
              </h4>
              {JamiaStore.getFeeVouchersForStudent(studentHistoryDrawer.id).map((vch) => (
                <div key={vch.id} className="p-4 bg-[#f8faf9] rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#176B4D]">{vch.voucherNumber} ({vch.monthYear})</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vch.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : vch.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {vch.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>Billed: <strong>PKR {vch.totalAmount.toLocaleString()}</strong></div>
                    <div>Paid: <strong className="text-emerald-700">PKR {(vch.amountPaid || 0).toLocaleString()}</strong></div>
                    <div>Remaining: <strong className="text-rose-700">PKR {(vch.remainingDues || 0).toLocaleString()}</strong></div>
                  </div>
                  {vch.paymentHistory && vch.paymentHistory.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                      <span className="font-bold text-slate-700 block">Payments:</span>
                      {vch.paymentHistory.map((p) => (
                        <div key={p.id} className="flex justify-between">
                          <span>{p.date} · {p.receiptNumber} ({p.paymentMethod})</span>
                          <span className="font-mono font-bold text-emerald-800">PKR {p.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStudentHistoryDrawer(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
