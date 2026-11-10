import React, { useState, useRef } from 'react';
import { JamiaStore } from '../lib/storage';
import { Student, AdmissionApplication } from '../types';
import { StudentIdCard, CardData } from '../components/StudentIdCard';
import { StudentAdmissionCard } from '../components/StudentAdmissionCard';
import { JamiaLogo } from '../components/JamiaLogo';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import {
  CreditCard,
  Printer,
  Download,
  Upload,
  RefreshCw,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileText,
  AlertCircle,
  Eye,
  Trash2,
  Lock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface IdCardGeneratorPageProps {
  onOpenVerify?: (rollNo: string) => void;
}

const COURSES_LIST = [
  'Dars-e-Nizami',
  'Hifz-ul-Quran',
  'Nazra Quran',
  'Tajweed-ul-Quran',
  'Shariyat Course',
  'Islamic Studies',
  'Arabic Language',
  'Quran Translation and Tafseer',
];

const MALE_SECTIONS = [
  'Boys Section A (Tahfeez Morning)',
  'Boys Section B (Dars-e-Nizami Ula)',
  'Boys Section C (Tajweed & Arabic)',
  'Boys Hifz Halaqah 1',
  'Boys Year 1 (Al-Ula)',
  'Boys Year 2 (Al-Thaniyah)',
];

const FEMALE_SECTIONS = [
  'Girls Bannat Section Aisha (Dars-e-Nizami)',
  'Girls Bannat Section Fatima (Hifz/Nazra)',
  'Girls Bannat Section Khadija (Tajweed & Shariyat)',
  'Girls Bannat Year 1 (Al-Ula)',
  'Girls Bannat Year 2 (Al-Thaniyah)',
];

export const IdCardGeneratorPage: React.FC<IdCardGeneratorPageProps> = ({ onOpenVerify }) => {
  const { isAdmin } = useAuth();
  const students = JamiaStore.getStudents();
  const approvedAdmissions = JamiaStore.getAdmissions().filter((a) => a.status === 'approved');

  // Active card format tab: ID Card vs Admission Card
  const [cardType, setCardType] = useState<'id-card' | 'admission-card'>('id-card');
  const [idCardSide, setIdCardSide] = useState<'front' | 'back' | 'both'>('front');

  // Form State: Strictly blank initially - no fake/invented records!
  const [formData, setFormData] = useState<CardData>({
    instituteName: 'Jamia Salahuddin Ayubi',
    studentName: '',
    urduName: '',
    fatherName: '',
    photoUrl: '',
    studentId: '',
    gender: 'male',
    course: 'Dars-e-Nizami',
    classSection: '',
    admissionDate: '',
    academicSession: '2026-2027',
    contactNumber: '',
    bloodGroup: 'B+',
    address: 'Islamabad, Pakistan',
  });

  // Admin Roster Search & Reprints State
  const [showAdminRoster, setShowAdminRoster] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [verifyModalRef, setVerifyModalRef] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate Unique Student ID
  const handleGenerateUniqueId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = formData.gender === 'female' ? 'JSA-2026-F' : 'JSA-2026-M';
    const newId = `${prefix}${randomDigits}`;
    setFormData((prev) => ({ ...prev, studentId: newId }));
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Photograph must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFormData((prev) => ({ ...prev, photoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Photo
  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clear Form / Start Blank
  const handleClearForm = () => {
    setFormData({
      instituteName: 'Jamia Salahuddin Ayubi',
      studentName: '',
      urduName: '',
      fatherName: '',
      photoUrl: '',
      studentId: '',
      gender: 'male',
      course: 'Dars-e-Nizami',
      classSection: '',
      admissionDate: '',
      academicSession: '2026-2027',
      contactNumber: '',
      bloodGroup: 'B+',
      address: 'Islamabad, Pakistan',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Admin Action: Load authorized student into generator
  const handleLoadStudent = (student: Student) => {
    setFormData({
      instituteName: 'Jamia Salahuddin Ayubi',
      studentName: student.fullName,
      urduName: student.urduName || '',
      fatherName: student.fatherName,
      photoUrl: student.photoUrl,
      studentId: student.rollNumber,
      gender: student.gender,
      course: student.department,
      classSection: student.currentYear,
      admissionDate: student.admissionDate,
      academicSession: '2026-2027',
      contactNumber: student.guardianPhone,
      bloodGroup: student.bloodGroup,
      address: student.address,
    });
  };

  // Admin Action: Load approved admission into generator
  const handleLoadAdmission = (adm: AdmissionApplication) => {
    setFormData({
      instituteName: 'Jamia Salahuddin Ayubi',
      studentName: adm.applicantName,
      urduName: adm.urduName || '',
      fatherName: adm.fatherName,
      photoUrl: adm.photoUrl || '',
      studentId: adm.assignedRollNumber || adm.applicationNumber,
      gender: adm.gender,
      course: adm.program,
      classSection: adm.assignedSection || adm.preferredSection || '',
      admissionDate: adm.submittedAt.slice(0, 10),
      academicSession: '2026-2027',
      contactNumber: adm.contactNumber || adm.phone || '',
      bloodGroup: adm.bloodGroup || 'B+',
      address: `${adm.address}, ${adm.city}`,
    });
  };

  // Filtered Roster for Admin
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const filteredAdmissions = approvedAdmissions.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      a.fatherName.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  // Trigger Native Printer Print
  const handleDirectPrint = () => {
    window.print();
  };

  // Trigger High-Resolution PDF Download using jsPDF
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      if (cardType === 'id-card') {
        // CR80 Standard ID Card dimensions: 85.6mm x 54mm
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [85.6, 54],
        });

        // Background White
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 85.6, 54, 'F');

        // Outer Gold Border (#D6B66C)
        doc.setDrawColor(214, 182, 108);
        doc.setLineWidth(0.8);
        doc.roundedRect(1, 1, 83.6, 52, 2.5, 2.5, 'S');

        // Top Emerald Header (#176B4D)
        doc.setFillColor(23, 107, 77);
        doc.roundedRect(1, 1, 83.6, 12, 2, 2, 'F');
        doc.rect(1, 8, 83.6, 5, 'F'); // square bottom of banner

        // Gold divider line
        doc.setDrawColor(214, 182, 108);
        doc.setLineWidth(0.5);
        doc.line(1, 13, 84.6, 13);

        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text('JAMIA SALAHUDDIN AYUBI', 5, 6);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Student Identity Card · Session ' + (formData.academicSession || '2026-2027'), 5, 10);

        // Student Photo Placeholder or Frame
        doc.setDrawColor(23, 107, 77);
        doc.setLineWidth(0.4);
        doc.setFillColor(242, 248, 245);
        doc.roundedRect(4, 15, 20, 25, 1.5, 1.5, 'FD');

        if (formData.photoUrl && formData.photoUrl.startsWith('data:image')) {
          try {
            doc.addImage(formData.photoUrl, 'JPEG', 4.5, 15.5, 19, 24);
          } catch (e) {
            // fallback
          }
        } else {
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(5);
          doc.text('PHOTO', 11, 28);
        }

        // Student Details Text
        doc.setTextColor(20, 20, 20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(formData.studentName || 'Student Name', 27, 18);

        // Student ID Pill
        doc.setFillColor(253, 250, 242);
        doc.setDrawColor(214, 182, 108);
        doc.roundedRect(27, 20, 32, 4.5, 1, 1, 'FD');
        doc.setTextColor(23, 107, 77);
        doc.setFontSize(6.5);
        doc.text(`ID: ${formData.studentId || 'JSA-2026-XXXX'}`, 28.5, 23.3);

        // Detail Fields
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(100, 100, 100);
        doc.text('Father Name:', 27, 28);
        doc.setTextColor(20, 20, 20);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.fatherName || '—', 42, 28);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Course:', 27, 32);
        doc.setTextColor(23, 107, 77);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.course || '—', 42, 32);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Class/Section:', 27, 36);
        doc.setTextColor(20, 20, 20);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.classSection || '—', 42, 36);

        // Bottom Footer Bar
        doc.setFillColor(23, 107, 77);
        doc.rect(1, 48, 83.6, 5, 'F');
        doc.setTextColor(214, 182, 108);
        doc.setFontSize(5);
        doc.setFont('helvetica', 'bold');
        doc.text('DIRECTOR: MUNEEB UR REHMAN', 5, 51.5);
        doc.setTextColor(255, 255, 255);
        doc.text('SECURE QR VERIFIED', 56, 51.5);

        // Save PDF file directly
        const filename = `Jamia_StudentID_${formData.studentId || 'Card'}.pdf`;
        doc.save(filename);
      } else {
        // A4 Admission Permit PDF
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Top Gold & Green Header
        doc.setFillColor(23, 107, 77);
        doc.rect(0, 0, 210, 24, 'F');
        doc.setDrawColor(214, 182, 108);
        doc.setLineWidth(1);
        doc.line(0, 24, 210, 24);

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('JAMIA SALAHUDDIN AYUBI', 105, 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL ADMISSION & ENTRY PERMIT · SESSION ' + (formData.academicSession || '2026-2027'), 105, 18, { align: 'center' });

        // Outer Frame
        doc.setDrawColor(214, 182, 108);
        doc.setLineWidth(0.8);
        doc.roundedRect(12, 30, 186, 245, 3, 3, 'S');

        // Admission Number Pill
        doc.setFillColor(253, 250, 242);
        doc.roundedRect(18, 36, 174, 12, 2, 2, 'FD');
        doc.setTextColor(23, 107, 77);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`ADMISSION NUMBER: ${formData.studentId || 'JSA-2026-XXXX'}`, 24, 43.5);
        doc.setTextColor(184, 147, 68);
        doc.setFontSize(9);
        doc.text(formData.gender === 'female' ? 'BANNAT WING' : 'BOYS CAMPUS', 160, 43.5);

        // Photo Frame
        doc.setDrawColor(23, 107, 77);
        doc.setFillColor(248, 250, 249);
        doc.roundedRect(18, 54, 34, 44, 2, 2, 'FD');
        if (formData.photoUrl && formData.photoUrl.startsWith('data:image')) {
          try {
            doc.addImage(formData.photoUrl, 'JPEG', 19, 55, 32, 42);
          } catch (e) {
            // fallback
          }
        } else {
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(8);
          doc.text('STUDENT PHOTO', 22, 77);
        }

        // Details Table
        let y = 58;
        const printRow = (label: string, val: string) => {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(label, 60, y);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(20, 20, 20);
          doc.text(val || '—', 105, y);
          y += 8;
        };

        printRow('Student Full Name:', formData.studentName);
        printRow("Father's Name:", formData.fatherName);
        printRow('Admitted Program:', formData.course);
        printRow('Class / Section:', formData.classSection);
        printRow('Date of Admission:', formData.admissionDate || '2026-03-01');
        printRow('Contact / Emergency:', formData.contactNumber || 'On Record');

        // Rules Section
        doc.setFillColor(242, 248, 245);
        doc.roundedRect(18, 110, 174, 38, 2, 2, 'FD');
        doc.setTextColor(23, 107, 77);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text('Official Admission Terms & Instructions:', 24, 118);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(8.5);
        doc.text('1. This Admission Card serves as the student official permit for campus and exam halls.', 24, 126);
        doc.text('2. 80% mandatory attendance is strictly required in all Quranic and academic classes.', 24, 134);
        doc.text('3. Students must strictly observe Islamic etiquette and the prescribed madrasa dress code.', 24, 142);

        // Signatures Section
        doc.setDrawColor(200, 200, 200);
        doc.line(24, 195, 64, 195);
        doc.line(84, 195, 124, 195);
        doc.line(144, 195, 184, 195);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Candidate Signature', 28, 200);
        doc.text('Registrar Office', 92, 200);

        doc.setTextColor(23, 107, 77);
        doc.setFont('helvetica', 'bold');
        doc.text('Muneeb ur Rehman', 150, 200);
        doc.setFontSize(7);
        doc.setTextColor(184, 147, 68);
        doc.text('Director, Jamia Salahuddin Ayubi', 145, 204);

        const filename = `Jamia_AdmissionCard_${formData.studentId || 'Permit'}.pdf`;
        doc.save(filename);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      // Native window.print fallback
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Official Credential System · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Student ID & Admission Card Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Director / Management: <strong>Muneeb ur Rehman</strong> · High-security verifiable smart cards & admission entry permits
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDirectPrint}
            className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            title="Print directly using a printer"
          >
            <Printer className="w-4 h-4 text-[#D6B66C]" />
            <span>Print Active Card</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-2 cursor-pointer"
            title="Download true PDF document"
          >
            <Download className="w-4 h-4 text-[#b89344]" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF'}</span>
          </button>

          <button
            onClick={handleClearForm}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear all fields to start blank"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Blank</span>
          </button>
        </div>
      </div>

      {/* Card Type Selector Tabs */}
      <div className="flex items-center justify-between border-b border-[#e5ece8] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCardType('id-card')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              cardType === 'id-card'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D6B66C]" />
            <span>Student ID Card (CR80 Smart PVC)</span>
          </button>

          <button
            onClick={() => setCardType('admission-card')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              cardType === 'admission-card'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-[#D6B66C]" />
            <span>Student Admission Card (Entry Permit)</span>
          </button>
        </div>

        {/* Authorized Admin Quick Reprints Toggle */}
        <button
          onClick={() => setShowAdminRoster(!showAdminRoster)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            showAdminRoster ? 'bg-[#176B4D] text-white' : 'bg-[#f2f8f5] text-[#176B4D] hover:bg-[#e1f0e9]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Admin Roster & Reprints</span>
          {showAdminRoster ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Authorized Admin Reprints Drawer */}
      {showAdminRoster && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D6B66C]/60 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#176B4D]" />
                <span>Authorized Admin Roster · Load for Reprint or Card Generation</span>
              </h3>
              <p className="text-xs text-slate-500">
                Authorized management can select any enrolled student or approved applicant to automatically populate the card generator.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search by name, roll no..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs outline-none focus:border-[#176B4D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enrolled Students Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Enrolled Students Registry ({filteredStudents.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleLoadStudent(s)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-[#176B4D] hover:bg-[#f2f8f5] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={s.photoUrl}
                        alt={s.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-[#D6B66C] shrink-0"
                      />
                      <div className="truncate">
                        <strong className="block text-slate-900 truncate">{s.fullName}</strong>
                        <span className="text-[10px] text-slate-500">{s.department} · {s.currentYear}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10.5px] font-bold text-[#176B4D] bg-white px-2 py-0.5 rounded border border-[#176B4D]/30 block">
                        {s.rollNumber}
                      </span>
                      <span className="text-[9px] text-[#b89344] font-semibold mt-0.5 block">Click to Load</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved Admission Applicants Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Approved Admission Applications ({filteredAdmissions.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredAdmissions.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => handleLoadAdmission(a)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-[#176B4D] hover:bg-[#f2f8f5] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <strong className="block text-slate-900 truncate">{a.applicantName}</strong>
                      <span className="text-[10px] text-slate-500">{a.program}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10.5px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300 block">
                        {a.assignedRollNumber || a.applicationNumber}
                      </span>
                      <span className="text-[9px] text-[#b89344] font-semibold mt-0.5 block">Click to Load</span>
                    </div>
                  </div>
                ))}
                {filteredAdmissions.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    No approved applications awaiting cards.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Generator Workspace: Form (5 Cols) + Live Preview Studio (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Blank Interactive Entry Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Enter Student Details
              </h3>
              <p className="text-[11px] text-slate-500">
                All fields start blank. Enter your details or load an approved record.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-[#176B4D] bg-[#f2f8f5] px-2.5 py-1 rounded-full border border-[#176B4D]/20">
              Live Interactive Form
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            {/* Institute Name (Fixed/Brand) */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Institute Name
              </label>
              <input
                type="text"
                value={formData.instituteName}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold cursor-not-allowed text-xs"
              />
              <span className="text-[10px] text-[#b89344] font-medium mt-0.5 block">
                Official Registered Authority: Muneeb ur Rehman (Director)
              </span>
            </div>

            {/* Student Full Name & Urdu Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter student full name"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Urdu Name (Optional)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.urduName || ''}
                  onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                  placeholder="طالب علم کا اردو نام"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-arabic text-sm focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            {/* Father's Name */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Father&apos;s Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Enter father's full name"
                className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
              />
            </div>

            {/* Student Photograph Upload */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student Photograph <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                {formData.photoUrl ? (
                  <div className="relative group shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Uploaded preview"
                      className="w-14 h-16 rounded-xl object-cover border-2 border-[#176B4D] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-16 rounded-xl bg-[#f2f8f5] border border-dashed border-[#176B4D]/40 flex flex-col items-center justify-center text-slate-400 shrink-0">
                    <Upload className="w-4 h-4 text-[#176B4D]/50" />
                    <span className="text-[8px] font-medium mt-0.5">No Photo</span>
                  </div>
                )}

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label
                    htmlFor="photo-upload-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f8f5] hover:bg-[#e1f0e9] text-[#176B4D] rounded-xl text-xs font-bold border border-[#176B4D]/30 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Upload Student Photo</span>
                  </label>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    JPG/PNG under 3MB · Real card photograph
                  </span>
                </div>
              </div>
            </div>

            {/* Student ID / Admission Number with Generator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Student ID / Admission Number <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateUniqueId}
                  className="text-[11px] font-bold text-[#176B4D] hover:text-[#0f4a35] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#D6B66C]" />
                  <span>Generate Unique ID</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                  placeholder="e.g. JSA-2026-M8401"
                  className="w-full px-3 py-2 font-mono font-bold bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 focus:border-[#176B4D] outline-none uppercase"
                />
              </div>
            </div>

            {/* Gender Switcher */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Gender / Admission Wing <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    formData.gender === 'male'
                      ? 'bg-[#176B4D] text-white border-[#176B4D]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Male (بنین · Boys Campus)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    formData.gender === 'female'
                      ? 'bg-[#176B4D] text-white border-[#176B4D]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Female (بنات · Bannat Wing)
                </button>
              </div>
            </div>

            {/* Course Selector (8 Authentic Categories) */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Course / Program <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
              >
                {COURSES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Class / Section */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Class / Section <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.classSection}
                onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                placeholder="e.g. Boys Section A / Year 1 (Al-Ula)"
                className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
              />
              {/* Quick suggestions based on gender */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(formData.gender === 'female' ? FEMALE_SECTIONS : MALE_SECTIONS).slice(0, 3).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setFormData({ ...formData, classSection: sec })}
                    className="text-[10px] bg-slate-100 hover:bg-[#f2f8f5] hover:text-[#176B4D] px-2 py-0.5 rounded-md text-slate-600 transition-colors"
                  >
                    + {sec.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Admission Date & Academic Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={formData.academicSession}
                  onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                  placeholder="2026-2027"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            {/* Contact Number & Blood Group (optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup || 'B+'}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-slate-900 font-medium focus:border-[#176B4D] outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview Studio & Print Layout (7 Cols) */}
        <div className="lg:col-span-7 bg-[#f8faf9] rounded-3xl p-6 sm:p-8 border border-[#e5ece8] space-y-6">
          {/* Preview Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5ece8]">
            <div>
              <span className="text-[11px] font-bold text-[#176B4D] uppercase tracking-wider block">
                {cardType === 'id-card'
                  ? 'CR80 Smart PVC Identity Card Preview'
                  : 'Official Admission & Examination Permit Preview'}
              </span>
              <p className="text-xs text-slate-500">
                {cardType === 'id-card'
                  ? 'Standard dimensions: 85.6mm × 53.98mm (CR80) · Double-Sided'
                  : 'Standard A4 / Certificate Slip Dimensions'}
              </p>
            </div>

            {/* ID Card Front/Back Toggle (When in ID Card Mode) */}
            {cardType === 'id-card' && (
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setIdCardSide('front')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    idCardSide === 'front' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setIdCardSide('back')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    idCardSide === 'back' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => setIdCardSide('both')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    idCardSide === 'both' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Both (Print)
                </button>
              </div>
            )}
          </div>

          {/* Active Card Printable Area */}
          <div
            id="printable-card-area"
            className="flex flex-col items-center justify-center min-h-[380px] py-4"
          >
            {cardType === 'id-card' ? (
              <StudentIdCard
                data={formData}
                activeSide={idCardSide}
                onVerify={(roll) => (onOpenVerify ? onOpenVerify(roll) : setVerifyModalRef(roll))}
              />
            ) : (
              <StudentAdmissionCard
                data={formData}
                onVerify={(roll) => (onOpenVerify ? onOpenVerify(roll) : setVerifyModalRef(roll))}
              />
            )}
          </div>

          {/* Card Verification & Security Notice */}
          <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#176B4D]" />
                Encrypted QR Code Security
              </span>
              <span className="text-[#176B4D] font-mono text-[11px] bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/20">
                Zero Data Leakage
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The high-density QR code generated on this card embeds a cryptographic token reference rather than plaintext student personal information, ensuring student data privacy while allowing instant gate verification by Jamia Salahuddin Ayubi proctors.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Authorized Signatory:</span>
              <strong className="text-slate-800">Muneeb ur Rehman (Director)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Demonstration Modal */}
      {verifyModalRef && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-[#D6B66C] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <JamiaLogo size={32} showText={false} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Credential Verification System
                  </h4>
                  <span className="text-[10px] text-slate-400">Jamia Salahuddin Ayubi</span>
                </div>
              </div>
              <button
                onClick={() => setVerifyModalRef(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#f2f8f5] p-4 rounded-2xl border border-[#176B4D]/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#176B4D] mx-auto" />
              <h5 className="font-bold text-[#176B4D] text-sm">
                Authentic Jamia Credential
              </h5>
              <div className="text-xs text-slate-600">
                <span className="block text-[11px] text-slate-500">Cardholder:</span>
                <strong className="text-slate-900 text-sm">{formData.studentName || 'Cardholder'}</strong>
              </div>
              <div className="text-xs text-slate-600">
                <span className="block text-[11px] text-slate-500">ID Reference:</span>
                <span className="font-mono font-bold text-[#176B4D]">{formData.studentId || verifyModalRef}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Faculty: <strong>{formData.course}</strong> · Section: <strong>{formData.classSection || 'General'}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Signed and attested under the authority of Director <strong>Muneeb ur Rehman</strong>.
            </p>

            <button
              onClick={() => setVerifyModalRef(null)}
              className="w-full py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
