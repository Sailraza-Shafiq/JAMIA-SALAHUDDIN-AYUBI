import React, { useState } from 'react';
import { JamiaStore } from '../lib/storage';
import { Student, AdmissionApplication, BloodGroup } from '../types';
import { JamiaLogo } from '../components/JamiaLogo';
import { testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Database,
  Image,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
  Save,
  RotateCcw,
} from 'lucide-react';

interface AdminViewProps {
  onNavigateToIdCard?: (rollNo: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigateToIdCard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'students' | 'branding' | 'database'>('overview');

  const [students, setStudents] = useState<Student[]>(() => JamiaStore.getStudents());
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => JamiaStore.getAdmissions());
  const [fees, setFees] = useState(() => JamiaStore.getFees());
  const [settings, setSettings] = useState(() => JamiaStore.getSettings());

  // Reload data helper
  const reloadData = () => {
    setStudents(JamiaStore.getStudents());
    setAdmissions(JamiaStore.getAdmissions());
    setFees(JamiaStore.getFees());
    setSettings(JamiaStore.getSettings());
  };

  // KPI Calculations
  const totalStudents = students.length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'pending').length;
  const totalFeeCollected = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  // ADMISSION ACTIONS
  const handleApproveAdmission = (app: AdmissionApplication) => {
    // Generate next roll number: JSA-2026-XXX
    const nextNum = 100 + students.length + 1;
    const assignedRollNumber = `JSA-2026-${nextNum}`;

    JamiaStore.updateAdmissionStatus(app.id, 'approved', {
      assignedRollNumber,
      adminNotes: `Approved by Director Muneeb ur Rehman. Roll number ${assignedRollNumber} issued.`,
    });

    reloadData();
    alert(`Application for ${app.applicantName} approved! Assigned Roll No: ${assignedRollNumber}.`);
  };

  const handleScheduleInterview = (app: AdmissionApplication) => {
    const interviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    JamiaStore.updateAdmissionStatus(app.id, 'interview_scheduled', {
      interviewDate,
      adminNotes: 'Interview scheduled for oral assessment & recitation check.',
    });
    reloadData();
  };

  const handleRejectAdmission = (id: string) => {
    if (confirm('Are you sure you want to decline this application?')) {
      JamiaStore.updateAdmissionStatus(id, 'rejected', {
        adminNotes: 'Candidate did not meet current eligibility requirements.',
      });
      reloadData();
    }
  };

  // STUDENT MANAGEMENT
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    fullName: '',
    urduName: '',
    fatherName: '',
    guardianPhone: '+92 300 0000000',
    cnicOrBForm: '37405-0000000-1',
    dob: '2006-05-15',
    gender: 'male' as 'male' | 'female',
    bloodGroup: 'B+' as BloodGroup,
    department: 'Dars-e-Nizami',
    currentYear: 'Year 1 (Al-Ula)',
    boardingStatus: 'boarder' as 'boarder' | 'day_scholar',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    address: 'Campus Hostel, Jamia Salahuddin Ayubi',
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.fullName || !newStudentForm.fatherName) return;

    const nextRoll = `JSA-2026-${100 + students.length + 1}`;
    JamiaStore.addStudent({
      rollNumber: nextRoll,
      admissionNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: newStudentForm.fullName,
      urduName: newStudentForm.urduName,
      fatherName: newStudentForm.fatherName,
      guardianPhone: newStudentForm.guardianPhone,
      cnicOrBForm: newStudentForm.cnicOrBForm,
      dob: newStudentForm.dob,
      gender: newStudentForm.gender,
      bloodGroup: newStudentForm.bloodGroup,
      department: newStudentForm.department,
      currentYear: newStudentForm.currentYear,
      boardingStatus: newStudentForm.boardingStatus,
      photoUrl: newStudentForm.photoUrl,
      address: newStudentForm.address,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      emergencyContact: `${newStudentForm.guardianPhone} (Guardian)`,
    });

    reloadData();
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove student record: ${name}?`)) {
      JamiaStore.deleteStudent(id);
      reloadData();
    }
  };

  // BRANDING & LOGO
  const [brandingForm, setBrandingForm] = useState({
    instituteName: settings.instituteName,
    directorName: settings.directorName,
    directorTitle: settings.directorTitle,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address,
    customLogoUrl: settings.customLogoUrl || '',
  });

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    JamiaStore.updateSettings({
      instituteName: brandingForm.instituteName,
      directorName: brandingForm.directorName,
      directorTitle: brandingForm.directorTitle,
      contactEmail: brandingForm.contactEmail,
      contactPhone: brandingForm.contactPhone,
      address: brandingForm.address,
      customLogoUrl: brandingForm.customLogoUrl.trim() || null,
    });
    reloadData();
    alert('Institute settings and logo updated successfully!');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBrandingForm((prev) => ({ ...prev, customLogoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // SUPABASE CONFIG
  const [supabaseUrl, setSupabaseUrl] = useState(
    () => localStorage.getItem('jamia_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    () => localStorage.getItem('jamia_supabase_anon_key') || ''
  );
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestSupabase = async () => {
    setIsTestingConn(true);
    setConnectionStatus(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setIsTestingConn(false);
    setConnectionStatus(res.message);
    if (res.connected) {
      localStorage.setItem('jamia_supabase_url', supabaseUrl);
      localStorage.setItem('jamia_supabase_anon_key', supabaseKey);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
            Jamia Salahuddin Ayubi · Executive Administration
          </span>
          <h1 className="font-serif-heading text-3xl font-extrabold text-[#176B4D]">
            Admin Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Director & Secretariat: <strong>{settings.directorName}</strong> · Real-time operational control
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap p-1 bg-white border border-[#e5ece8] rounded-xl shadow-xs">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'admissions', label: `Admissions (${pendingAdmissions})`, icon: GraduationCap },
            { id: 'students', label: `Students (${totalStudents})`, icon: Users },
            { id: 'branding', label: 'Logo & Identity', icon: Image },
            { id: 'database', label: 'Supabase SQL', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
                <div className="w-8 h-8 rounded-lg bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif-heading text-3xl font-extrabold text-slate-900">
                {totalStudents}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Active students across all faculties
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Admissions</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif-heading text-3xl font-extrabold text-amber-900">
                {pendingAdmissions}
              </div>
              <span className="text-[11px] text-amber-800 font-semibold block">
                Requires review & interview
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Fee Collection</span>
                <div className="w-8 h-8 rounded-lg bg-[#fdfaf2] text-[#b89344] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                PKR {totalFeeCollected.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold block">
                Verified deposits for current cycle
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e5ece8] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Average Attendance</span>
                <div className="w-8 h-8 rounded-lg bg-[#f2f8f5] text-[#176B4D] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif-heading text-3xl font-extrabold text-slate-900">
                94.8%
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                High discipline rate in morning sessions
              </span>
            </div>
          </div>

          {/* Quick Shortcuts & Review Alert */}
          {pendingAdmissions > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs">
                    {pendingAdmissions} Online Admission Application(s) Awaiting Review
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Review applicant records, approve admission, and generate official smart ID cards.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('admissions')}
                className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl hover:bg-[#0f4a35] transition-all cursor-pointer whitespace-nowrap"
              >
                Go to Review Queue
              </button>
            </div>
          )}

          {/* Executive Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif-heading font-bold text-base text-[#176B4D]">
                  Director General Overview
                </h3>
                <span className="text-xs text-slate-500 font-medium">Session 2026-27</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700">
                <p>
                  <strong>Jamia Salahuddin Ayubi</strong> operates under the direct supervision of{' '}
                  <strong className="text-[#176B4D]">{settings.directorName}</strong>.
                </p>
                <p>
                  All functional modules — from online admissions, real-time fee registers, digital CR80 smart ID card generation, and Gemini-powered student AI support — are active and synchronized.
                </p>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div><strong>Official Name:</strong> {settings.instituteName}</div>
                  <div><strong>Arabic Title:</strong> {settings.arabicName}</div>
                  <div><strong>Headquarters:</strong> {settings.address}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif-heading font-bold text-base text-[#176B4D]">
                  Database & System Health
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                  Operational
                </span>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Student Storage:</span>
                  <span className="font-mono text-emerald-700 font-bold">Synchronized</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Fee Ledger:</span>
                  <span className="font-mono text-emerald-700 font-bold">Active (PKR)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Smart ID Card Verification Engine:</span>
                  <span className="font-mono text-emerald-700 font-bold">Online (QR Verified)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>AI Academic Support (Gemini):</span>
                  <span className="font-mono text-emerald-700 font-bold">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMISSIONS QUEUE TAB */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Admissions Applications Review Queue
              </h3>
              <p className="text-xs text-slate-500">
                Inspect submissions, schedule tests, approve and issue official Roll Numbers
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Applicant & Father</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Hostel / Boarding</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#176B4D]">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{app.applicantName}</div>
                      <span className="text-[11px] text-slate-500 font-normal">S/O {app.fatherName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{app.program}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {app.boardingRequired ? 'Hostel Boarder' : 'Day Scholar'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {app.guardianPhone}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Approved ({app.assignedRollNumber})
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Pending Review
                        </span>
                      )}
                      {app.status === 'interview_scheduled' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Interview Scheduled
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveAdmission(app)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                            title="Approve and issue Roll Number"
                          >
                            Approve
                          </button>
                        )}
                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleScheduleInterview(app)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Interview
                          </button>
                        )}
                        {app.status === 'approved' && onNavigateToIdCard && (
                          <button
                            onClick={() => onNavigateToIdCard(app.assignedRollNumber!)}
                            className="px-2.5 py-1 bg-[#fdfaf2] text-[#176B4D] border border-[#D6B66C] font-bold text-[11px] rounded-lg cursor-pointer"
                          >
                            View ID Card
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectAdmission(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Decline"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. STUDENTS DIRECTORY TAB */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Enrolled Students Registry
              </h3>
              <p className="text-xs text-slate-500">
                Complete directory of registered students with ID card generation & management
              </p>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#D6B66C]" />
              <span>Enroll New Student</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Hostel / Status</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={st.photoUrl}
                        alt={st.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#D6B66C]"
                      />
                      <div>
                        <div>{st.fullName}</div>
                        {st.urduName && <span className="font-arabic text-[#176B4D] text-[11px]">{st.urduName}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#176B4D]">
                      {st.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{st.fatherName}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{st.department}</div>
                      <span className="text-[10px] text-slate-400">{st.currentYear}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 capitalize">
                      {st.boardingStatus === 'boarder' ? 'Hostel Boarder' : 'Day Scholar'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{st.bloodGroup}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onNavigateToIdCard && (
                          <button
                            onClick={() => onNavigateToIdCard(st.rollNumber)}
                            className="px-2.5 py-1 bg-[#fdfaf2] text-[#176B4D] border border-[#D6B66C] hover:bg-[#faeecf] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            ID Card
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStudent(st.id, st.fullName)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Student Modal */}
          {showAddStudentModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#176B4D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                    Enroll New Student
                  </h3>
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.fullName}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Urdu Name</label>
                      <input
                        type="text"
                        value={newStudentForm.urduName}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, urduName: e.target.value })}
                        dir="rtl"
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Father Name *</label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.fatherName}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, fatherName: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Guardian Phone *</label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.guardianPhone}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianPhone: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                      <select
                        value={newStudentForm.department}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, department: e.target.value })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      >
                        <option value="Dars-e-Nizami">Dars-e-Nizami</option>
                        <option value="Hifz-ul-Quran">Hifz-ul-Quran</option>
                        <option value="Tajweed & Qirat">Tajweed & Qirat</option>
                        <option value="Islamic Jurisprudence (Ifta)">Islamic Jurisprudence (Ifta)</option>
                        <option value="Modern Education & IT">Modern Education & IT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                      <select
                        value={newStudentForm.bloodGroup}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, bloodGroup: e.target.value as BloodGroup })}
                        className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Photo URL</label>
                    <input
                      type="text"
                      value={newStudentForm.photoUrl}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, photoUrl: e.target.value })}
                      className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#176B4D] text-white font-bold rounded-xl shadow-xs"
                    >
                      Register Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. BRANDING & LOGO SETTINGS */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
              Institute Identity & Official Jamia Logo
            </h3>
            <p className="text-xs text-slate-500">
              Preserve official institute name &ldquo;Jamia Salahuddin Ayubi&rdquo; and management &ldquo;Muneeb ur Rehman&rdquo;
            </p>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-6 max-w-2xl text-xs">
            {/* Logo Preview & Custom Upload */}
            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#D6B66C]/40 space-y-4">
              <div className="flex items-center gap-4">
                <JamiaLogo size="xl" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Active Institute Logo</h4>
                  <p className="text-[11px] text-slate-500">
                    Displayed on official website headers, footers, printable student ID cards, vouchers, and transcripts.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Upload Custom Logo File (PNG/JPG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#176B4D] file:text-white hover:file:bg-[#0f4a35] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Or Paste External Logo Image URL
                </label>
                <input
                  type="text"
                  value={brandingForm.customLogoUrl}
                  onChange={(e) => setBrandingForm({ ...brandingForm, customLogoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full p-2.5 bg-white border border-[#e5ece8] rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Institute Official Name</label>
                <input
                  type="text"
                  required
                  value={brandingForm.instituteName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, instituteName: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Owner / Director Name</label>
                <input
                  type="text"
                  required
                  value={brandingForm.directorName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, directorName: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-semibold text-[#176B4D]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Director Title</label>
                <input
                  type="text"
                  value={brandingForm.directorTitle}
                  onChange={(e) => setBrandingForm({ ...brandingForm, directorTitle: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={brandingForm.contactPhone}
                  onChange={(e) => setBrandingForm({ ...brandingForm, contactPhone: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Campus Address</label>
              <input
                type="text"
                value={brandingForm.address}
                onChange={(e) => setBrandingForm({ ...brandingForm, address: e.target.value })}
                className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 hover:bg-[#0f4a35] transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#D6B66C]" />
                <span>Save Institute Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SUPABASE DATABASE & SQL TAB */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Supabase Database & Authentication Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Connect external Supabase project for persistent cloud records and copy complete SQL migration
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset demo state to initial seed records?')) {
                  JamiaStore.resetAll();
                  reloadData();
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>
          </div>

          {/* Connection inputs */}
          <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-4 max-w-2xl text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">
              Connect Your Supabase Project
            </h4>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full p-2.5 bg-white border border-[#e5ece8] rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-2.5 bg-white border border-[#e5ece8] rounded-xl font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTestingConn}
                className="px-5 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Database className="w-4 h-4 text-[#D6B66C]" />
                <span>{isTestingConn ? 'Testing Connection...' : 'Test & Save Supabase'}</span>
              </button>
            </div>

            {connectionStatus && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-medium text-slate-800">
                {connectionStatus}
              </div>
            )}
          </div>

          {/* SQL Schema Copy Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  Complete Production SQL Schema for Supabase
                </h4>
                <p className="text-[11px] text-slate-500">
                  Execute this in the Supabase SQL Editor to provision students, admissions, fee vouchers, and security rules.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-[#fdfaf2] text-[#176B4D] border border-[#D6B66C] hover:bg-[#faeecf] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5 text-[#b89344]" />
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-80 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
