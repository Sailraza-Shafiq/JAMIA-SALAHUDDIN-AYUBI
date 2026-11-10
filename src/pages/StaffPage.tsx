import React, { useState, useEffect, useRef, useMemo } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { StaffMember } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Filter,
  UserCheck,
  Building,
  DollarSign,
  Calendar,
  Phone,
  MapPin,
  Upload,
  Database,
  Eye,
  Check,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const DEPARTMENTS_LIST = [
  'Dars-e-Nizami',
  'Hifz-ul-Quran',
  'Nazra Quran',
  'Tajweed-ul-Quran',
  'Shariyat Course',
  'Islamic Jurisprudence (Dar-ul-Ifta)',
  'Administration & Registrar',
  'Treasury & Accounts',
  'Campus Operations & Security',
];

const DESIGNATIONS_LIST = [
  'Senior Lecturer (Ustadh)',
  'Lecturer (Mudarris)',
  'Chief Qari & Head of Hifz',
  'Qari & Tajweed Instructor',
  'Mufti & Jurist',
  'Registrar & Admissions Officer',
  'Accounts & Finance Officer',
  'Hostel Warden & Superintendent',
  'Administrative Support Staff',
];

export const StaffPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>(() => JamiaStore.getStaff());

  // Search & Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'employee'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Supabase feedback
  const [syncStatus, setSyncStatus] = useState<{ isSyncing: boolean; message: string | null; success?: boolean }>({
    isSyncing: false,
    message: null,
  });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmationStaff, setDeleteConfirmationStaff] = useState<StaffMember | null>(null);

  // Add Form State (Strictly blank initially)
  const [newStaffForm, setNewStaffForm] = useState({
    fullName: '',
    urduName: '',
    fatherName: '',
    contact: '',
    address: '',
    designation: DESIGNATIONS_LIST[0],
    joiningDate: new Date().toISOString().split('T')[0],
    assignedDepartment: DEPARTMENTS_LIST[0],
    salary: 35000,
    salaryStatus: 'pending' as 'paid' | 'pending',
    status: 'active' as 'active' | 'inactive',
    roleType: 'teacher' as 'teacher' | 'employee',
    photoUrl: '',
    qualification: '',
    experience: '',
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setStaffList(JamiaStore.getStaff());
    });
    return unsub;
  }, []);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q) ||
        s.contact.includes(q) ||
        (s.urduName && s.urduName.includes(q));

      const matchesDept = deptFilter === 'all' || s.assignedDepartment.toLowerCase().includes(deptFilter.toLowerCase());
      const matchesRole = roleFilter === 'all' || s.roleType === roleFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });
  }, [staffList, search, deptFilter, roleFilter, statusFilter]);

  // KPIs
  const totalStaff = staffList.length;
  const teachersCount = staffList.filter((s) => s.roleType === 'teacher').length;
  const employeesCount = staffList.filter((s) => s.roleType === 'employee').length;
  const activeCount = staffList.filter((s) => s.status === 'active').length;

  // Sync Supabase
  const handleSyncSupabase = async () => {
    setSyncStatus({ isSyncing: true, message: 'Synchronizing staff records with Supabase...' });
    const res = await JamiaStore.syncStaffWithSupabase();
    setSyncStatus({ isSyncing: false, message: res.message, success: res.success });
    setTimeout(() => {
      setSyncStatus((prev) => ({ ...prev, message: null }));
    }, 4000);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Photograph must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (isEdit && editingStaff) {
          setEditingStaff({ ...editingStaff, photoUrl: base64 });
        } else {
          setNewStaffForm((prev) => ({ ...prev, photoUrl: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.fullName.trim() || !newStaffForm.fatherName.trim() || !newStaffForm.contact.trim()) {
      alert('Full Name, Father Name, and Contact are required.');
      return;
    }

    JamiaStore.addStaff({
      fullName: newStaffForm.fullName.trim(),
      urduName: newStaffForm.urduName.trim() || undefined,
      fatherName: newStaffForm.fatherName.trim(),
      contact: newStaffForm.contact.trim(),
      address: newStaffForm.address.trim(),
      designation: newStaffForm.designation,
      joiningDate: newStaffForm.joiningDate,
      assignedDepartment: newStaffForm.assignedDepartment,
      salary: Number(newStaffForm.salary) || 0,
      salaryStatus: newStaffForm.salaryStatus,
      status: newStaffForm.status,
      roleType: newStaffForm.roleType,
      photoUrl: newStaffForm.photoUrl,
      qualification: newStaffForm.qualification.trim() || undefined,
      experience: newStaffForm.experience.trim() || undefined,
      assignedCourses: [newStaffForm.assignedDepartment],
      assignedClasses: ['General Wing'],
    });

    setNewStaffForm({
      fullName: '',
      urduName: '',
      fatherName: '',
      contact: '',
      address: '',
      designation: DESIGNATIONS_LIST[0],
      joiningDate: new Date().toISOString().split('T')[0],
      assignedDepartment: DEPARTMENTS_LIST[0],
      salary: 35000,
      salaryStatus: 'pending',
      status: 'active',
      roleType: 'teacher',
      photoUrl: '',
      qualification: '',
      experience: '',
    });

    setShowAddModal(false);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    JamiaStore.updateStaff(editingStaff.id, {
      fullName: editingStaff.fullName,
      urduName: editingStaff.urduName,
      fatherName: editingStaff.fatherName,
      contact: editingStaff.contact,
      address: editingStaff.address,
      designation: editingStaff.designation,
      joiningDate: editingStaff.joiningDate,
      assignedDepartment: editingStaff.assignedDepartment,
      salary: Number(editingStaff.salary) || 0,
      status: editingStaff.status,
      roleType: editingStaff.roleType,
      photoUrl: editingStaff.photoUrl,
      qualification: editingStaff.qualification,
      experience: editingStaff.experience,
    });

    if (selectedStaff && selectedStaff.id === editingStaff.id) {
      setSelectedStaff({ ...editingStaff });
    }

    setEditingStaff(null);
  };

  // Delete
  const handleDeleteConfirm = () => {
    if (!deleteConfirmationStaff) return;
    JamiaStore.deleteStaff(deleteConfirmationStaff.id);
    if (selectedStaff && selectedStaff.id === deleteConfirmationStaff.id) {
      setSelectedStaff(null);
    }
    setDeleteConfirmationStaff(null);
  };

  // Toggle Status
  const handleToggleStatus = (staff: StaffMember) => {
    const updatedStatus = staff.status === 'active' ? 'inactive' : 'active';
    JamiaStore.updateStaff(staff.id, { status: updatedStatus });
    if (selectedStaff && selectedStaff.id === staff.id) {
      setSelectedStaff({ ...selectedStaff, status: updatedStatus });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Academic Faculty & Staff Secretariat · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Staff & Faculty Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Director / Management: <strong>Muneeb ur Rehman</strong> · Comprehensive faculty records, department assignments, and salary payroll
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncSupabase}
            disabled={syncStatus.isSyncing}
            className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Database className={`w-4 h-4 text-[#b89344] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? 'Syncing...' : 'Sync Supabase Staff'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6B66C]" />
            <span>Add Teacher / Employee</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus.message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            syncStatus.success
              ? 'bg-[#f2f8f5] text-emerald-900 border-[#176B4D]/30'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#176B4D] shrink-0" />
            <span>{syncStatus.message}</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#176B4D]">
            Supabase Staff
          </span>
        </div>
      )}

      {/* Staff KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] uppercase font-bold text-slate-500">Total Staff</span>
            <Users className="w-4 h-4 text-[#176B4D]" />
          </div>
          <div className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">{totalStaff}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Faculty & Administration</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] uppercase font-bold text-slate-500">Teaching Faculty</span>
            <GraduationCap className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{teachersCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Asatiza & Huffaz</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] uppercase font-bold text-slate-500">Employees</span>
            <Briefcase className="w-4 h-4 text-[#b89344]" />
          </div>
          <div className="font-serif-heading text-2xl font-extrabold text-slate-900">{employeesCount}</div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Admin & Support Staff</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] uppercase font-bold text-slate-500">Active Staff</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif-heading text-2xl font-extrabold text-emerald-700">{activeCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">On Active Duty</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs space-y-4">
        {/* Role & Status Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-[#f8faf9] rounded-2xl border border-slate-200">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === 'all' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Staff ({totalStaff})
            </button>
            <button
              onClick={() => setRoleFilter('teacher')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                roleFilter === 'teacher' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Teachers / Asatiza ({teachersCount})</span>
            </button>
            <button
              onClick={() => setRoleFilter('employee')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                roleFilter === 'employee' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employees ({employeesCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10.5px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Search & Department Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by full name, father's name, designation (e.g. Ustadh, Qari, Registrar)..."
              className="w-full pl-10 pr-4 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium outline-none focus:border-[#176B4D]"
            />
          </div>

          <div className="md:col-span-5">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#176B4D]"
            >
              <option value="all">All Assigned Departments</option>
              {DEPARTMENTS_LIST.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5ece8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#176B4D]" />
            <h3 className="font-bold text-slate-900 text-sm">
              Staff Directory ({filteredStaff.length} records found)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Official Appointments · Authenticated by Director Muneeb ur Rehman
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8faf9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#e5ece8]">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Father&apos;s Name</th>
                <th className="py-3.5 px-4">Designation & Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Monthly Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#f2f8f5]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {staff.photoUrl ? (
                        <img
                          src={staff.photoUrl}
                          alt={staff.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-[#D6B66C]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#f2f8f5] border border-[#176B4D]/30 flex items-center justify-center text-[#176B4D] font-bold text-xs shrink-0">
                          {staff.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="font-bold text-slate-900 text-sm hover:text-[#176B4D] text-left block cursor-pointer"
                        >
                          {staff.fullName}
                        </button>
                        {staff.urduName && (
                          <span className="font-arabic text-[#176B4D] text-xs font-semibold block">
                            {staff.urduName}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {staff.fatherName}
                  </td>

                  <td className="py-3.5 px-4">
                    <strong className="text-slate-800 block">{staff.designation}</strong>
                    <span className="text-[10px] text-[#b89344] font-semibold uppercase block">
                      {staff.roleType === 'teacher' ? 'Faculty' : 'Employee'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-medium text-[#176B4D]">{staff.assignedDepartment}</span>
                    <span className="text-[10px] text-slate-400 block">Joined: {staff.joiningDate}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {staff.contact}
                  </td>

                  <td className="py-3.5 px-4">
                    <strong className="text-slate-900 font-mono">
                      PKR {staff.salary.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Monthly Payroll</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(staff)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold cursor-pointer transition-colors ${
                        staff.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                      }`}
                      title="Click to toggle status"
                    >
                      <span className="capitalize">{staff.status}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedStaff(staff)}
                        className="px-2.5 py-1 bg-[#176B4D] text-white hover:bg-[#0f4a35] text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="View Individual Staff Profile"
                      >
                        <Eye className="w-3 h-3 text-[#D6B66C]" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => setEditingStaff({ ...staff })}
                        className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Edit Staff Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmationStaff(staff)}
                        className="p-1.5 bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>No staff records found matching your filters. Click &quot;Add Teacher / Employee&quot; to enroll faculty.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INDIVIDUAL STAFF PROFILE DRAWER / MODAL */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#176B4D] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {selectedStaff.photoUrl ? (
                  <img
                    src={selectedStaff.photoUrl}
                    alt={selectedStaff.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D6B66C]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#f2f8f5] border-2 border-[#176B4D] flex items-center justify-center text-xl font-bold text-[#176B4D]">
                    {selectedStaff.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                    {selectedStaff.fullName}
                  </h3>
                  {selectedStaff.urduName && (
                    <span className="font-arabic text-sm text-[#D6B66C] font-bold block">
                      {selectedStaff.urduName}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">
                    {selectedStaff.designation} · {selectedStaff.assignedDepartment}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaff(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Dossier Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b89344] block">Personal Information</span>
                <div>
                  <span className="text-[10px] text-slate-400 block">Father&apos;s Name:</span>
                  <strong className="text-slate-800 text-xs">{selectedStaff.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contact Telephone / WhatsApp:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedStaff.contact}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Residential Address:</span>
                  <span className="text-slate-700 leading-relaxed block">{selectedStaff.address || 'Islamabad, Pakistan'}</span>
                </div>
              </div>

              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b89344] block">Institutional Appointment</span>
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Department:</span>
                  <strong className="text-[#176B4D] text-xs">{selectedStaff.assignedDepartment}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Designation:</span>
                  <span className="font-bold text-slate-800">{selectedStaff.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Joining Date:</span>
                  <span className="font-medium text-slate-700">{selectedStaff.joiningDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status:</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      selectedStaff.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {selectedStaff.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Compensation & Salary Section */}
            <div className="bg-[#f2f8f5] p-4 rounded-2xl border border-[#176B4D]/30 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] uppercase font-bold text-slate-500 block">
                  Monthly Salary Information
                </span>
                <span className="font-serif-heading text-xl font-extrabold text-[#176B4D]">
                  PKR {selectedStaff.salary.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Approved under Director Muneeb ur Rehman</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedStaff)}
                  className="px-3.5 py-1.5 bg-white border border-[#176B4D]/30 text-[#176B4D] font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Toggle {selectedStaff.status === 'active' ? 'Inactive' : 'Active'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingStaff({ ...selectedStaff })}
                className="px-4 py-2 bg-[#176B4D] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Edit Staff Member</span>
              </button>
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEACHER OR EMPLOYEE MODAL (All fields blank initially) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                  Enroll New Teacher or Employee
                </h3>
                <p className="text-[11px] text-slate-500">
                  Fill staff details. Synchronizes directly to Supabase.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              {/* Photo Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Staff Photograph</label>
                <div className="flex items-center gap-3">
                  {newStaffForm.photoUrl ? (
                    <img
                      src={newStaffForm.photoUrl}
                      alt="Preview"
                      className="w-12 h-14 rounded-xl object-cover border-2 border-[#176B4D]"
                    />
                  ) : (
                    <div className="w-12 h-14 rounded-xl bg-[#f2f8f5] border border-dashed border-[#176B4D]/40 flex items-center justify-center text-slate-400">
                      <Upload className="w-4 h-4 text-[#176B4D]/50" />
                    </div>
                  )}
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="hidden"
                      id="staff-photo-input"
                    />
                    <label
                      htmlFor="staff-photo-input"
                      className="px-3 py-1.5 bg-[#f2f8f5] text-[#176B4D] font-bold rounded-xl border border-[#176B4D]/30 cursor-pointer inline-block"
                    >
                      Upload Photograph
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name & Urdu Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.fullName}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, fullName: e.target.value })}
                    placeholder="e.g. Maulana Muhammad Tariq"
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urdu Name</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newStaffForm.urduName}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, urduName: e.target.value })}
                    placeholder="اردو نام"
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-arabic text-sm outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              {/* Father Name & Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Father&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.fatherName}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, fatherName: e.target.value })}
                    placeholder="Father's full name"
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.contact}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, contact: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              {/* Role Type & Designation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Type *</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, roleType: 'teacher' })}
                      className={`p-2 rounded-xl font-bold text-xs border cursor-pointer ${
                        newStaffForm.roleType === 'teacher'
                          ? 'bg-[#176B4D] text-white border-[#176B4D]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, roleType: 'employee' })}
                      className={`p-2 rounded-xl font-bold text-xs border cursor-pointer ${
                        newStaffForm.roleType === 'employee'
                          ? 'bg-[#176B4D] text-white border-[#176B4D]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Employee
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation *</label>
                  <select
                    value={newStaffForm.designation}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, designation: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  >
                    {DESIGNATIONS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned Department & Monthly Salary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Department *</label>
                  <select
                    value={newStaffForm.assignedDepartment}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, assignedDepartment: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  >
                    {DEPARTMENTS_LIST.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Salary (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={newStaffForm.salary}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, salary: Number(e.target.value) })}
                    placeholder="35000"
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D] font-mono font-bold"
                  />
                </div>
              </div>

              {/* Joining Date & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newStaffForm.joiningDate}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, joiningDate: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={newStaffForm.status}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, status: e.target.value as any })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Residential Address *</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.address}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, address: e.target.value })}
                  placeholder="Street, City, Province"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm & Enroll Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Edit Staff Member Details
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.fullName}
                    onChange={(e) => setEditingStaff({ ...editingStaff, fullName: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Father&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.fatherName}
                    onChange={(e) => setEditingStaff({ ...editingStaff, fatherName: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.contact}
                    onChange={(e) => setEditingStaff({ ...editingStaff, contact: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Salary (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingStaff.salary}
                    onChange={(e) => setEditingStaff({ ...editingStaff, salary: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation</label>
                  <select
                    value={editingStaff.designation}
                    onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                  >
                    {DESIGNATIONS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Department</label>
                  <select
                    value={editingStaff.assignedDepartment}
                    onChange={(e) => setEditingStaff({ ...editingStaff, assignedDepartment: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl"
                  >
                    {DEPARTMENTS_LIST.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Type</label>
                  <select
                    value={editingStaff.roleType}
                    onChange={(e) => setEditingStaff({ ...editingStaff, roleType: e.target.value as any })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-bold"
                  >
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="employee">Administrative Employee</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editingStaff.address}
                  onChange={(e) => setEditingStaff({ ...editingStaff, address: e.target.value })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Staff Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmationStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-rose-500 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-serif-heading font-bold text-base text-slate-900">
                Confirm Staff Record Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove staff record for <strong>{deleteConfirmationStaff.fullName}</strong> ({deleteConfirmationStaff.designation})?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmationStaff(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Yes, Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
