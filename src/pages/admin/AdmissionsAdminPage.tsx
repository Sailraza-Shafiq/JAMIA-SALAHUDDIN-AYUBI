import React, { useState, useEffect } from 'react';
import { JamiaStore, subscribeToStore } from '../../lib/storage';
import { AdmissionApplication, AdmissionStatus, Student } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Phone,
  User,
  Eye,
  Check,
  X,
  FileText,
  CreditCard,
  UserCheck,
  Building,
  RefreshCw,
  AlertCircle,
  Download,
} from 'lucide-react';

export const AdmissionsAdminPage: React.FC = () => {
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => JamiaStore.getAdmissions());
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setApplications(JamiaStore.getAdmissions());
    });
    return unsub;
  }, []);

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      app.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      app.program.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      app.gender === categoryFilter ||
      app.admissionCategory === categoryFilter;

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const totalCount = applications.length;
  const maleCount = applications.filter((a) => a.gender === 'male' || a.admissionCategory === 'male').length;
  const femaleCount = applications.filter((a) => a.gender === 'female' || a.admissionCategory === 'female').length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  const handleUpdateStatus = (id: string, newStatus: AdmissionStatus) => {
    JamiaStore.updateAdmissionStatus(id, newStatus);
    setActionSuccess(`Application status updated to "${newStatus.replace('_', ' ')}".`);
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleEnrollStudent = (app: AdmissionApplication) => {
    // Generate Roll Number
    const prefix = app.gender === 'female' ? 'JSA-F-2026-' : 'JSA-M-2026-';
    const num = Math.floor(100 + Math.random() * 900);
    const assignedRoll = prefix + num;

    const newStudentData: Omit<Student, 'id'> = {
      rollNumber: assignedRoll,
      admissionNumber: app.applicationNumber,
      fullName: app.applicantName,
      urduName: app.urduName || '',
      fatherName: app.fatherName,
      guardianPhone: app.guardianContact || app.contactNumber || app.phone || '0300-0000000',
      cnicOrBForm: app.bFormCnic || app.applicantCnicOrBForm || '',
      dob: app.dob,
      gender: app.gender,
      bloodGroup: app.bloodGroup || 'B+',
      department: app.program,
      currentYear: app.assignedSection || app.preferredSection || (app.gender === 'female' ? 'Bannat Year 1' : 'Boys Year 1'),
      boardingStatus: app.boardingRequired ? 'boarder' : 'day_scholar',
      photoUrl: app.photoUrl || '',
      address: `${app.address}, ${app.city}`,
      admissionDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      emergencyContact: app.contactNumber || app.phone || '',
      academicSession: '2026-2027',
      admissionApplicationId: app.id,
    };

    JamiaStore.addStudent(newStudentData);
    JamiaStore.updateAdmissionStatus(app.id, 'approved', { assignedRollNumber: assignedRoll });
    setActionSuccess(`Applicant successfully enrolled with Student ID: ${assignedRoll}!`);
    setTimeout(() => setActionSuccess(null), 4000);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f8f5] text-[#176B4D] font-bold text-xs uppercase tracking-wider mb-2 border border-[#176B4D]/20">
            <GraduationCap className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Module 3 · Admissions Desk</span>
          </div>
          <h1 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
            Admissions Intake & Application Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review inbound admission applications, inspect guardian records, schedule interviews, and enroll candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admissions/apply"
            className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Open Public Form</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] uppercase font-bold text-slate-400 block">Total Applications</span>
          <span className="text-2xl font-bold font-mono text-slate-800">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] uppercase font-bold text-[#176B4D] block">Pending Review</span>
          <span className="text-2xl font-bold font-mono text-amber-600">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] uppercase font-bold text-emerald-700 block">Approved / Enrolled</span>
          <span className="text-2xl font-bold font-mono text-emerald-700">{approvedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] uppercase font-bold text-slate-400 block">Male / Female Wing</span>
          <div className="text-xs font-mono font-bold text-slate-700 pt-1">
            <span className="text-emerald-800">{maleCount} Banin</span> · <span className="text-amber-800">{femaleCount} Bannat</span>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by applicant name, father, app ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium focus:border-[#176B4D] outline-none"
          />
        </div>

        {/* Gender Wing Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#f8faf9] rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'all' ? 'bg-[#176B4D] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Wings
          </button>
          <button
            onClick={() => setCategoryFilter('male')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'male' ? 'bg-[#176B4D] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Boys (بنین)
          </button>
          <button
            onClick={() => setCategoryFilter('female')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'female' ? 'bg-[#176B4D] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Girls (بنات)
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-2xl border border-[#e5ece8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8faf9] border-b border-[#e5ece8] text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant & Father</th>
                <th className="py-3 px-4">Wing</th>
                <th className="py-3 px-4">Program / Course</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f2f8f5]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#176B4D]">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400">Father: {app.fatherName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.gender === 'female' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {app.gender === 'female' ? 'Bannat (Girls)' : 'Banin (Boys)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {app.program}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {app.submittedAt.slice(0, 10)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold capitalize ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : app.status === 'interview_scheduled'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-[#176B4D]/30 transition-colors cursor-pointer"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No applications match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Inspection Modal Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#D6B66C] uppercase tracking-wider block">
                  Official Application Record
                </span>
                <h3 className="font-serif-heading font-extrabold text-lg text-[#176B4D]">
                  {selectedApp.applicantName} ({selectedApp.applicationNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Applicant Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#f8faf9] rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Father Name:</span>
                <strong className="text-slate-800">{selectedApp.fatherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Date of Birth:</span>
                <strong className="text-slate-800">{selectedApp.dob || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Gender / Admission Category:</span>
                <strong className="capitalize text-slate-800">
                  {selectedApp.gender === 'female' ? 'Female (Bannat Wing)' : 'Male (Banin Campus)'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">B-Form / CNIC:</span>
                <strong className="font-mono text-slate-800">{selectedApp.bFormCnic || selectedApp.applicantCnicOrBForm || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Contact:</span>
                <strong className="font-mono text-slate-800">{selectedApp.contactNumber || selectedApp.phone}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Guardian Contact:</span>
                <strong className="font-mono text-slate-800">{selectedApp.guardianContact || selectedApp.guardianPhone || 'Same as primary'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Address & City:</span>
                <strong className="text-slate-800">{selectedApp.address}, {selectedApp.city}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Applying Course:</span>
                <strong className="text-[#176B4D]">{selectedApp.program}</strong>
              </div>
            </div>

            {/* Previous Education & Notes */}
            <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block">Previous Madrasa / School:</span>
                <strong className="text-slate-700">{selectedApp.previousSchool || selectedApp.previousInstitute || 'None'}</strong>
              </div>
              {selectedApp.medicalNotes && (
                <div>
                  <span className="text-slate-400 block">Important / Medical Notes:</span>
                  <p className="text-slate-600 italic">{selectedApp.medicalNotes}</p>
                </div>
              )}
            </div>

            {/* Decision Controls */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedApp.id, 'interview_scheduled')}
                  className="px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-300 font-bold rounded-xl hover:bg-sky-100 cursor-pointer"
                >
                  Schedule Interview
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-300 font-bold rounded-xl hover:bg-rose-100 cursor-pointer"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEnrollStudent(selectedApp)}
                  className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-[#D6B66C]" />
                  <span>Approve & Enroll as Student</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
