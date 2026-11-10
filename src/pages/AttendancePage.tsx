import React, { useState, useEffect, useRef } from 'react';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { Student, AttendanceRecord, StudentAttendanceEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import jsQR from 'jsqr';
import { jsPDF } from 'jspdf';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Filter,
  Users,
  Search,
  QrCode,
  Camera,
  FileText,
  Download,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Edit3,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
  Upload,
  History,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { isAdmin, isStaff, currentUser } = useAuth();

  // Core Data
  const [students, setStudents] = useState<Student[]>(() => JamiaStore.getStudents());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => JamiaStore.getAttendance());

  // Views & Tabs
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily Marking State
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: 'present' | 'absent' | 'leave'; notes?: string }>>({});
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [editPermissionUnlocked, setEditPermissionUnlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // QR Scanning & Student Verification Modal State
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [manualIdInput, setManualIdInput] = useState<string>('');
  const [scannedStatus, setScannedStatus] = useState<'present' | 'absent' | 'leave'>('present');
  const [scannedNotes, setScannedNotes] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isConfirmingScan, setIsConfirmingScan] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Individual Student History Drawer
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);

  // Video / Canvas refs for QR Scanning
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Supabase sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setStudents(JamiaStore.getStudents());
      setAttendanceRecords(JamiaStore.getAttendance());
    });
    return unsub;
  }, []);

  // Update daily attendanceMap whenever selectedDate, selectedCourse, or attendanceRecords change
  useEffect(() => {
    const dateRecord = attendanceRecords.find(
      (a) => a.date === selectedDate && (selectedCourse === 'all' || a.classId.toLowerCase().includes(selectedCourse.toLowerCase()))
    );

    const map: Record<string, { status: 'present' | 'absent' | 'leave'; notes?: string }> = {};

    if (dateRecord) {
      dateRecord.records.forEach((r) => {
        map[r.studentId] = { status: r.status, notes: r.notes };
      });
      setIsEditingExisting(true);
    } else {
      setIsEditingExisting(false);
    }

    // Fill in default present for students not explicitly marked
    students.forEach((s) => {
      if (!map[s.id]) {
        map[s.id] = { status: 'present' };
      }
    });

    setAttendanceMap(map);
  }, [selectedDate, selectedCourse, attendanceRecords, students]);

  // Filter students for Daily Sheet
  const filteredStudents = students.filter((s) => {
    const matchesGender = selectedGender === 'all' || s.gender === selectedGender;
    const matchesCourse =
      selectedCourse === 'all' || s.department.toLowerCase().includes(selectedCourse.toLowerCase());
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      s.fullName.toLowerCase().includes(query) ||
      (s.urduName && s.urduName.includes(query)) ||
      s.rollNumber.toLowerCase().includes(query) ||
      s.admissionNumber.toLowerCase().includes(query) ||
      s.fatherName.toLowerCase().includes(query);

    return matchesGender && matchesCourse && matchesSearch;
  });

  // Calculate Daily Stats
  const presentCount = filteredStudents.filter((s) => attendanceMap[s.id]?.status === 'present').length;
  const absentCount = filteredStudents.filter((s) => attendanceMap[s.id]?.status === 'absent').length;
  const leaveCount = filteredStudents.filter((s) => attendanceMap[s.id]?.status === 'leave').length;
  const attendanceRate =
    filteredStudents.length > 0 ? ((presentCount / filteredStudents.length) * 100).toFixed(1) : '100.0';

  // Quick Date Navigation
  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Status Toggles
  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'leave', notes?: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: { status, notes: notes !== undefined ? notes : prev[studentId]?.notes },
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'leave') => {
    const updated = { ...attendanceMap };
    filteredStudents.forEach((s) => {
      updated[s.id] = { status };
    });
    setAttendanceMap(updated);
  };

  // Save Daily Attendance
  const handleSaveAttendance = () => {
    const records: StudentAttendanceEntry[] = filteredStudents.map((s) => ({
      studentId: s.id,
      rollNumber: s.rollNumber,
      studentName: s.fullName,
      gender: s.gender,
      course: s.department,
      status: attendanceMap[s.id]?.status || 'present',
      notes: attendanceMap[s.id]?.notes,
      timestamp: new Date().toISOString(),
      markedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
      method: 'manual',
    }));

    const classLabel = selectedCourse === 'all' ? 'General Jamia Assembly' : selectedCourse;

    JamiaStore.saveAttendance({
      date: selectedDate,
      classId: classLabel,
      course: selectedCourse === 'all' ? undefined : selectedCourse,
      genderCategory: selectedGender,
      records,
      updatedBy: currentUser?.name || 'Muneeb ur Rehman',
    });

    setToastMessage({
      text: `✓ Attendance record for ${classLabel} on ${selectedDate} successfully saved & synced!`,
      type: 'success',
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Supabase Manual Sync
  const handleSupabaseSync = async () => {
    setIsSyncing(true);
    const res = await JamiaStore.syncAttendanceWithSupabase();
    setToastMessage({
      text: res.message,
      type: res.success ? 'success' : 'warning',
    });
    setIsSyncing(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Camera Management for QR Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start scanning loop
      scanIntervalRef.current = window.setInterval(processVideoFrame, 250);
    } catch (err: any) {
      setHasCameraPermission(false);
      setCameraError(
        'Camera permission was not granted or camera is not available on this device. You can manually enter the Student ID or upload a photo of the card below.'
      );
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const processVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      handleDecodedCode(code.data);
    }
  };

  // Handle uploaded QR image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code && code.data) {
          handleDecodedCode(code.data);
        } else {
          setCameraError('No valid QR code could be detected in the uploaded image. Please try another image or enter ID manually.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Decode code string into a student record
  const handleDecodedCode = (dataString: string) => {
    stopCamera();

    // Clean data string and search
    let target = dataString.trim();
    if (target.includes('verify?ref=')) {
      target = target.split('verify?ref=')[1] || '';
    } else if (target.includes('verify?admission=')) {
      target = target.split('verify?admission=')[1] || '';
    }

    // Try finding student
    const student =
      JamiaStore.getStudentByRoll(target) ||
      students.find((s) => {
        const cleanRoll = s.rollNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const cleanQuery = target.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return (
          cleanRoll === cleanQuery ||
          s.id.toLowerCase() === target.toLowerCase() ||
          s.admissionNumber.toLowerCase() === target.toLowerCase() ||
          target.toLowerCase().includes(cleanRoll)
        );
      });

    if (student) {
      setScannedStudent(student);
      setCameraError(null);

      // Check Duplicate Attendance for today!
      const studentHistory = JamiaStore.getAttendanceForStudent(student.id);
      const existingToday = studentHistory.find((h) => h.date === selectedDate);

      if (existingToday) {
        setDuplicateWarning(
          `Notice: Student was already recorded as ${existingToday.status.toUpperCase()} on ${selectedDate}${
            existingToday.timestamp ? ` at ${new Date(existingToday.timestamp).toLocaleTimeString()}` : ''
          }. You may update the record after confirmation.`
        );
        setScannedStatus(existingToday.status);
      } else {
        setDuplicateWarning(null);
        setScannedStatus('present');
      }
    } else {
      setCameraError(`No student record matches code: "${target}". Please check the ID or search manually.`);
    }
  };

  // Confirm Scanned Attendance
  const handleConfirmScannedAttendance = () => {
    if (!scannedStudent) return;
    setIsConfirmingScan(true);

    const classLabel = selectedCourse === 'all' ? scannedStudent.department : selectedCourse;

    const result = JamiaStore.markSingleStudentAttendance({
      studentId: scannedStudent.id,
      rollNumber: scannedStudent.rollNumber,
      studentName: scannedStudent.fullName,
      gender: scannedStudent.gender,
      course: scannedStudent.department,
      date: selectedDate,
      classId: classLabel,
      status: scannedStatus,
      method: 'qr_scan',
      notes: scannedNotes || undefined,
      markedBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
    });

    setScanSuccessMessage(
      `✓ Attendance for ${scannedStudent.fullName} (${scannedStudent.rollNumber}) confirmed as ${scannedStatus.toUpperCase()}!`
    );

    // Update local map as well
    setAttendanceMap((prev) => ({
      ...prev,
      [scannedStudent.id]: { status: scannedStatus, notes: scannedNotes },
    }));

    setTimeout(() => {
      setIsConfirmingScan(false);
      setScannedStudent(null);
      setScanSuccessMessage(null);
      setDuplicateWarning(null);
      setScannedNotes('');
      setManualIdInput('');
    }, 2000);
  };

  // Close QR modal cleanup
  const handleCloseQRModal = () => {
    stopCamera();
    setIsQRScannerOpen(false);
    setScannedStudent(null);
    setCameraError(null);
    setDuplicateWarning(null);
    setScanSuccessMessage(null);
    setManualIdInput('');
  };

  // Monthly Report Calculations
  const getMonthlyStudentReport = () => {
    // Collect all unique dates in the selected month
    const monthPrefix = selectedMonth; // "YYYY-MM"
    const monthRecords = attendanceRecords.filter((a) => a.date.startsWith(monthPrefix));

    // Unique dates recorded
    const uniqueDates = Array.from(new Set(monthRecords.map((a) => a.date))).sort();
    const totalWorkingDays = uniqueDates.length || 1; // avoid division by zero

    return filteredStudents.map((st) => {
      let present = 0;
      let absent = 0;
      let leave = 0;

      uniqueDates.forEach((date) => {
        const dayRecord = monthRecords.find((r) => r.date === date);
        const studentEntry = dayRecord?.records.find((rec) => rec.studentId === st.id || rec.rollNumber === st.rollNumber);
        if (studentEntry) {
          if (studentEntry.status === 'present') present++;
          else if (studentEntry.status === 'absent') absent++;
          else if (studentEntry.status === 'leave') leave++;
        }
      });

      const totalRecorded = present + absent + leave;
      const rate = totalWorkingDays > 0 ? ((present / totalWorkingDays) * 100).toFixed(1) : '100.0';
      const isEligible = parseFloat(rate) >= 80.0;

      return {
        student: st,
        totalWorkingDays,
        present,
        absent,
        leave,
        rate,
        isEligible,
      };
    });
  };

  const monthlyReportData = getMonthlyStudentReport();

  // PDF Export Engine using jsPDF
  const exportAttendancePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const isDaily = activeTab === 'daily';

    // Header Band - Deep Green #176B4D
    doc.setFillColor(23, 107, 77);
    doc.rect(0, 0, 210, 28, 'F');

    // Soft Gold #D6B66C accent bar
    doc.setFillColor(214, 182, 108);
    doc.rect(0, 28, 210, 2, 'F');

    // Title & Subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('JAMIA SALAHUDDIN AYUBI', 105, 12, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL ACADEMIC ATTENDANCE & ATTENDANCE COMPLIANCE LEDGER', 105, 18, { align: 'center' });

    doc.setTextColor(214, 182, 108);
    doc.setFontSize(7.5);
    doc.text('INSTITUTE DIRECTOR GENERAL: MUNEEB UR REHMAN', 105, 24, { align: 'center' });

    // Report Meta Box
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(229, 236, 232);
    doc.roundedRect(12, 34, 186, 20, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(`Report Type: ${isDaily ? 'Daily Roll Call Register' : `Monthly Attendance Compliance (${selectedMonth})`}`, 16, 41);
    doc.text(`Reference Date: ${isDaily ? selectedDate : selectedMonth}`, 16, 48);

    doc.text(`Campus Division: ${selectedGender === 'all' ? 'All Campuses (Integrated)' : selectedGender === 'male' ? 'Boys Campus (Male)' : 'Girls Bannat Wing (Female)'}`, 115, 41);
    doc.text(`Course/Department: ${selectedCourse === 'all' ? 'All Academic Programs' : selectedCourse}`, 115, 48);

    // Summary Box
    doc.setFillColor(242, 248, 245);
    doc.setDrawColor(23, 107, 77);
    doc.setLineWidth(0.3);
    doc.roundedRect(12, 57, 186, 14, 1.5, 1.5, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(23, 107, 77);
    doc.setFont('helvetica', 'bold');

    if (isDaily) {
      doc.text(`Total Roster: ${filteredStudents.length} Students`, 18, 65);
      doc.text(`Present: ${presentCount}`, 70, 65);
      doc.text(`Absent: ${absentCount}`, 110, 65);
      doc.text(`Leave: ${leaveCount}`, 145, 65);
      doc.text(`Rate: ${attendanceRate}%`, 175, 65);
    } else {
      const avgRate = (
        monthlyReportData.reduce((acc, curr) => acc + parseFloat(curr.rate), 0) / (monthlyReportData.length || 1)
      ).toFixed(1);
      doc.text(`Total Students: ${monthlyReportData.length}`, 18, 65);
      doc.text(`Working Days: ${monthlyReportData[0]?.totalWorkingDays || 0}`, 70, 65);
      doc.text(`Overall Attendance Rate: ${avgRate}%`, 125, 65);
    }

    // Table Header
    let startY = 77;
    doc.setFillColor(23, 107, 77);
    doc.rect(12, startY, 186, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');

    if (isDaily) {
      doc.text('SR', 15, startY + 5);
      doc.text('ROLL NO', 26, startY + 5);
      doc.text('STUDENT NAME', 58, startY + 5);
      doc.text('DEPARTMENT / CLASS', 115, startY + 5);
      doc.text('STATUS', 170, startY + 5);
    } else {
      doc.text('SR', 15, startY + 5);
      doc.text('ROLL NO', 26, startY + 5);
      doc.text('STUDENT NAME', 56, startY + 5);
      doc.text('DAYS', 110, startY + 5);
      doc.text('P', 125, startY + 5);
      doc.text('A', 137, startY + 5);
      doc.text('L', 149, startY + 5);
      doc.text('% RATE', 162, startY + 5);
      doc.text('ELIGIBILITY', 178, startY + 5);
    }

    // Table Rows
    let currentY = startY + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    if (isDaily) {
      filteredStudents.forEach((st, idx) => {
        const status = attendanceMap[st.id]?.status || 'present';
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, currentY, 186, 6.5, 'F');
        doc.setDrawColor(230, 230, 230);
        doc.line(12, currentY + 6.5, 198, currentY + 6.5);

        doc.setTextColor(50, 50, 50);
        doc.text(String(idx + 1), 15, currentY + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(23, 107, 77);
        doc.text(st.rollNumber, 26, currentY + 4.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(st.fullName, 58, currentY + 4.5);
        doc.text(`${st.department} · ${st.currentYear}`, 115, currentY + 4.5);

        if (status === 'present') {
          doc.setTextColor(23, 107, 77);
          doc.text('PRESENT', 170, currentY + 4.5);
        } else if (status === 'absent') {
          doc.setTextColor(200, 30, 30);
          doc.text('ABSENT', 170, currentY + 4.5);
        } else {
          doc.setTextColor(180, 120, 20);
          doc.text('LEAVE', 170, currentY + 4.5);
        }

        currentY += 6.5;
        if (currentY > 265) {
          doc.addPage();
          currentY = 20;
        }
      });
    } else {
      monthlyReportData.forEach((row, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 249);
        doc.rect(12, currentY, 186, 6.5, 'F');
        doc.setDrawColor(230, 230, 230);
        doc.line(12, currentY + 6.5, 198, currentY + 6.5);

        doc.setTextColor(50, 50, 50);
        doc.text(String(idx + 1), 15, currentY + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(23, 107, 77);
        doc.text(row.student.rollNumber, 26, currentY + 4.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(row.student.fullName, 56, currentY + 4.5);
        doc.text(String(row.totalWorkingDays), 110, currentY + 4.5);
        doc.text(String(row.present), 125, currentY + 4.5);
        doc.text(String(row.absent), 137, currentY + 4.5);
        doc.text(String(row.leave), 149, currentY + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.text(`${row.rate}%`, 162, currentY + 4.5);

        if (row.isEligible) {
          doc.setTextColor(23, 107, 77);
          doc.text('Eligible', 178, currentY + 4.5);
        } else {
          doc.setTextColor(200, 30, 30);
          doc.text('Shortage', 178, currentY + 4.5);
        }

        currentY += 6.5;
        if (currentY > 265) {
          doc.addPage();
          currentY = 20;
        }
      });
    }

    // Signatures footer
    const sigY = Math.max(currentY + 12, 260);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(20, sigY, 70, sigY);
    doc.line(140, sigY, 190, sigY);

    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature of Faculty Proctor / Attendance Officer', 20, sigY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 107, 77);
    doc.text('Muneeb ur Rehman (Director General)', 140, sigY + 4);

    const filename = `Jamia_Attendance_${isDaily ? selectedDate : selectedMonth}_${selectedGender}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Academic Registry · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Student Attendance Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time daily roll call, camera QR code scanning, segregated campus registers, and monthly compliance reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* QR Code Scanner Button */}
          <button
            type="button"
            onClick={() => {
              setIsQRScannerOpen(true);
              setHasCameraPermission(null);
            }}
            className="px-4 py-2.5 bg-[#D6B66C] hover:bg-[#b89344] text-[#0f4a35] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Student QR Card</span>
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={exportAttendancePDF}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/30 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#D6B66C]" />
            <span>Export PDF Report</span>
          </button>

          {/* Save Daily Attendance (when in daily tab) */}
          {activeTab === 'daily' && (
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D6B66C]" />
              <span>Save Attendance Record</span>
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
              Strict 80% Attendance Requirement & Segregated Policy
            </strong>
            <span>
              Under the supervision of Director <strong>Muneeb ur Rehman</strong>, a minimum of 80% attendance is strictly enforced for semester and Wifaq-ul-Madaris exam eligibility. Separate male and female registers ensure absolute academic segregation.
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
            Muneeb ur Rehman Mode
          </span>
        </div>
      </div>

      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Mode Navigation Tabs (Daily Roll Call vs Monthly Report) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`pb-3 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'daily'
                ? 'border-[#176B4D] text-[#176B4D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Daily Attendance Register</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`pb-3 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'monthly'
                ? 'border-[#176B4D] text-[#176B4D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Monthly Attendance Reports</span>
          </button>
        </div>

        {isEditingExisting && activeTab === 'daily' && (
          <div className="flex items-center gap-2 pb-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Record already saved for this date</span>
            </span>
          </div>
        )}
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

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Course / Department:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#176B4D]"
          >
            <option value="all">All Departments</option>
            <option value="Dars-e-Nizami">Dars-e-Nizami</option>
            <option value="Hifz-ul-Quran">Hifz-ul-Quran</option>
            <option value="Nazra Quran">Nazra Quran</option>
            <option value="Tajweed-ul-Quran">Tajweed-ul-Quran</option>
            <option value="Shariyat Course">Shariyat Course</option>
            <option value="Islamic Jurisprudence">Islamic Jurisprudence (Ifta)</option>
            <option value="Modern Education">Modern IT & Computer</option>
          </select>
        </div>
      </div>

      {/* TAB 1: DAILY ATTENDANCE REGISTER */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* KPI Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e5ece8] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total in Roster
              </span>
              <div className="font-serif-heading text-3xl font-extrabold text-slate-900">
                {filteredStudents.length}
              </div>
              <span className="text-[11px] text-slate-500">Active registered students</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Present Today
              </span>
              <div className="font-serif-heading text-3xl font-extrabold text-emerald-700">
                {presentCount}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">In morning roll call</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Absent Count
              </span>
              <div className="font-serif-heading text-3xl font-extrabold text-rose-700">
                {absentCount}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">Unexcused absence</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D6B66C] bg-[#fdfaf2] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider block">
                Attendance Compliance %
              </span>
              <div className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
                {attendanceRate}%
              </div>
              <span className="text-[11px] text-[#b89344] font-semibold">{leaveCount} on approved leave</span>
            </div>
          </div>

          {/* Date Selector, Search & Bulk Actions Bar */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 bg-[#f8faf9] px-3.5 py-1.5 rounded-xl border border-slate-200">
                  <Calendar className="w-4 h-4 text-[#176B4D]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-2.5 py-1.5 text-xs font-bold text-[#176B4D] hover:bg-emerald-50 rounded-lg cursor-pointer"
                >
                  Today
                </button>
              </div>

              {/* Student Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, roll number, father..."
                  className="w-full pl-10 pr-4 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium outline-none focus:border-[#176B4D]"
                />
              </div>

              {/* Bulk Attendance Mark */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold text-[11px]">Quick Action:</span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg cursor-pointer transition-all"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg cursor-pointer transition-all"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Daily Attendance Table */}
          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Student Name & Photo</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Course & Class</th>
                    <th className="py-3 px-4">Campus Wing</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4 text-center">Mark Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                        No students match the selected campus or course filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const entry = attendanceMap[st.id] || { status: 'present' };
                      const currentStatus = entry.status;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={st.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                                alt={st.fullName}
                                className="w-9 h-9 rounded-full object-cover border-2 border-[#D6B66C] shrink-0"
                              />
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setHistoryStudent(st)}
                                  className="font-bold text-slate-900 hover:text-[#176B4D] hover:underline text-left block leading-tight cursor-pointer"
                                >
                                  {st.fullName}
                                </button>
                                {st.urduName && (
                                  <span className="font-arabic text-[#b89344] font-medium text-[11px] block">
                                    {st.urduName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/20">
                              {st.rollNumber}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800">{st.department}</span>
                            <span className="block text-[10px] text-slate-500">{st.currentYear}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                st.gender === 'male'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-900 border border-[#D6B66C]/40'
                              }`}
                            >
                              <Building2 className="w-3 h-3 text-[#176B4D]" />
                              <span>{st.gender === 'male' ? 'Boys Campus' : 'Bannat Wing'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {currentStatus === 'present' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Present</span>
                              </span>
                            )}
                            {currentStatus === 'absent' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                <X className="w-3 h-3 text-rose-700" />
                                <span>Absent</span>
                              </span>
                            )}
                            {currentStatus === 'leave' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Leave</span>
                              </span>
                            )}
                            {entry.notes && (
                              <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-xs truncate">
                                Note: {entry.notes}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(st.id, 'present')}
                                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'present'
                                    ? 'bg-[#176B4D] text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                                title="Mark Present"
                              >
                                P
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(st.id, 'absent')}
                                className={`px-3 py-1.5 text-xs font-bold border-l border-r border-slate-200 transition-all cursor-pointer ${
                                  currentStatus === 'absent'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                                title="Mark Absent"
                              >
                                A
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt('Enter authorized leave reason / note:', entry.notes || 'Medical or family leave');
                                  handleMarkStatus(st.id, 'leave', reason || undefined);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'leave'
                                    ? 'bg-[#b89344] text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                                title="Mark Leave"
                              >
                                L
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setHistoryStudent(st)}
                              className="px-2.5 py-1 text-slate-600 hover:text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-slate-200 text-[11px] font-semibold cursor-pointer transition-all"
                            >
                              History
                            </button>
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

      {/* TAB 2: MONTHLY ATTENDANCE REPORTS */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Monthly Controls Bar */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Month:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#f8faf9] border border-[#e5ece8] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#176B4D] cursor-pointer"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing monthly records for <strong className="text-slate-900">{monthlyReportData.length}</strong> students across{' '}
              <strong className="text-slate-900">{monthlyReportData[0]?.totalWorkingDays || 0}</strong> recorded sessions.
            </div>

            <button
              type="button"
              onClick={exportAttendancePDF}
              className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-[#D6B66C]" />
              <span>Download Monthly PDF Ledger</span>
            </button>
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f8f5] text-[#176B4D] font-bold text-[10px] uppercase tracking-wider border-b border-[#e5ece8]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center">Working Days</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-center">Leave</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-center">Exam Eligibility</th>
                    <th className="py-3 px-4 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyReportData.map((row) => (
                    <tr key={row.student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={row.student.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                          alt={row.student.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-[#D6B66C]"
                        />
                        <span>{row.student.fullName}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#176B4D]">
                        {row.student.rollNumber}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {row.student.department}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {row.totalWorkingDays}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                        {row.present}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-rose-700">
                        {row.absent}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-[#b89344]">
                        {row.leave}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sm text-[#176B4D]">
                        {row.rate}%
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {row.isEligible ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Eligible (&ge;80%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Shortage (&lt;80%)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setHistoryStudent(row.student)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-[#176B4D]/20 cursor-pointer"
                        >
                          View Log
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

      {/* QR SCANNER & STUDENT ID CARD MODAL */}
      {isQRScannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f2f8f5] border border-[#176B4D]/30 flex items-center justify-center text-[#176B4D]">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                    Student ID Card QR Scanner
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proctor Roll Call & Gate Attendance Verification
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseQRModal}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Camera Permission Prompt or Video Feed */}
            {hasCameraPermission === null ? (
              <div className="p-6 bg-[#f8faf9] rounded-2xl border-2 border-dashed border-[#176B4D]/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#176B4D] flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">
                    Camera Access Required for Smart QR Scanning
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Jamia Salahuddin Ayubi proctor system scans the encrypted QR code on student ID cards in real time. Please grant camera access.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#D6B66C]" />
                    <span>Request Camera Permission & Start</span>
                  </button>
                </div>
              </div>
            ) : hasCameraPermission && !scannedStudent ? (
              <div className="space-y-4 text-center">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#176B4D]">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Optical Scanner Reticle Overlay */}
                  <div className="absolute inset-0 border-2 border-emerald-400/70 pointer-events-none flex items-center justify-center m-8 rounded-xl">
                    <div className="w-48 h-48 border-2 border-dashed border-[#D6B66C] rounded-lg animate-pulse" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Point camera at the QR code on the student's physical card or digital pass.
                </p>
              </div>
            ) : null}

            {/* Camera Error / Fallback Options */}
            {cameraError && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Camera Notice:</span>
                </div>
                <p>{cameraError}</p>
              </div>
            )}

            {/* Manual Roll Number / ID Search Fallback */}
            {!scannedStudent && (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase">
                    Manual Student Lookup or Image Scan:
                  </span>
                  <label className="text-[#176B4D] hover:underline font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualIdInput}
                    onChange={(e) => setManualIdInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDecodedCode(manualIdInput)}
                    placeholder="e.g. JSA-2026-101 or student name..."
                    className="flex-1 p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium outline-none focus:border-[#176B4D]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDecodedCode(manualIdInput)}
                    className="px-4 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#0f4a35]"
                  >
                    Lookup
                  </button>
                </div>
              </div>
            )}

            {/* RETRIEVED STUDENT CONFIRMATION DOSSIER */}
            {scannedStudent && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#f2f8f5] rounded-2xl border-2 border-[#176B4D]/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={scannedStudent.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                      alt={scannedStudent.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D6B66C] shadow-xs"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#176B4D] bg-white px-2 py-0.5 rounded border border-[#176B4D]/20">
                          {scannedStudent.rollNumber}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Adm: {scannedStudent.admissionNumber}
                        </span>
                      </div>
                      <h4 className="font-serif-heading font-extrabold text-lg text-slate-900 leading-tight">
                        {scannedStudent.fullName}
                      </h4>
                      {scannedStudent.urduName && (
                        <span className="font-arabic text-[#b89344] font-bold text-sm block">
                          {scannedStudent.urduName}
                        </span>
                      )}
                      <p className="text-xs text-slate-600">
                        {scannedStudent.department} · {scannedStudent.currentYear}
                      </p>
                    </div>
                  </div>

                  {/* Duplicate Check Alert */}
                  {duplicateWarning && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{duplicateWarning}</span>
                    </div>
                  )}

                  {/* Attendance Marking Controls */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Mark Attendance for Today ({selectedDate}):</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setScannedStatus('present')}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                          scannedStatus === 'present'
                            ? 'bg-[#176B4D] text-white border-[#176B4D] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Present (حاضر)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScannedStatus('absent')}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                          scannedStatus === 'absent'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Absent (غائب)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScannedStatus('leave')}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                          scannedStatus === 'leave'
                            ? 'bg-[#b89344] text-white border-[#b89344] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Leave (رخصت)
                      </button>
                    </div>

                    {scannedStatus === 'leave' && (
                      <input
                        type="text"
                        value={scannedNotes}
                        onChange={(e) => setScannedNotes(e.target.value)}
                        placeholder="Authorized leave reason (medical, family, etc.)..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    )}
                  </div>
                </div>

                {scanSuccessMessage && (
                  <div className="p-3 bg-emerald-100 rounded-xl text-emerald-900 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{scanSuccessMessage}</span>
                  </div>
                )}

                {/* Confirm Action Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScannedStudent(null);
                      setDuplicateWarning(null);
                    }}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Scan Another Student
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmScannedAttendance}
                    disabled={isConfirmingScan}
                    className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#D6B66C]" />
                    <span>Confirm & Mark Attendance</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INDIVIDUAL STUDENT ATTENDANCE HISTORY DRAWER / MODAL */}
      {historyStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={historyStudent.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                  alt={historyStudent.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D6B66C]"
                />
                <div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-slate-900">
                    {historyStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll: <strong className="text-[#176B4D]">{historyStudent.rollNumber}</strong> · {historyStudent.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Historical Summary KPIs */}
            {(() => {
              const records = JamiaStore.getAttendanceForStudent(historyStudent.id);
              const total = records.length || 1;
              const present = records.filter((r) => r.status === 'present').length;
              const absent = records.filter((r) => r.status === 'absent').length;
              const leave = records.filter((r) => r.status === 'leave').length;
              const rate = ((present / total) * 100).toFixed(1);

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-3 bg-[#f8faf9] rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Recorded</span>
                      <strong className="text-base text-slate-900 font-extrabold">{records.length}</strong>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 font-bold block uppercase">Present</span>
                      <strong className="text-base text-emerald-700 font-extrabold">{present}</strong>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                      <span className="text-[10px] text-rose-700 font-bold block uppercase">Absent</span>
                      <strong className="text-base text-rose-700 font-extrabold">{absent}</strong>
                    </div>
                    <div className="p-3 bg-[#fdfaf2] rounded-2xl border border-[#D6B66C]">
                      <span className="text-[10px] text-[#b89344] font-bold block uppercase">Rate</span>
                      <strong className="text-base text-[#176B4D] font-extrabold">{rate}%</strong>
                    </div>
                  </div>

                  {/* History Timeline Table */}
                  <div className="space-y-2">
                    <h4 className="font-serif-heading font-extrabold text-sm text-[#176B4D]">
                      Chronological Roll Call Log
                    </h4>

                    {records.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No attendance recorded yet for this student.</p>
                    ) : (
                      <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                        {records.map((rec, i) => (
                          <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50">
                            <div>
                              <strong className="text-slate-900 block">{rec.date}</strong>
                              <span className="text-[10px] text-slate-400">
                                {rec.classId} {rec.method ? `· via ${rec.method.toUpperCase()}` : ''}
                              </span>
                              {rec.notes && <span className="text-[10px] text-amber-700 block italic">{rec.notes}</span>}
                            </div>
                            <div>
                              {rec.status === 'present' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Present
                                </span>
                              )}
                              {rec.status === 'absent' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                  Absent
                                </span>
                              )}
                              {rec.status === 'leave' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  Leave
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryStudent(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
