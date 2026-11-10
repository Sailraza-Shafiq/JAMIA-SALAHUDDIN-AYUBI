import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { Course, StaffMember } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  RefreshCw,
  Award,
  Layers,
  FileText,
  Users,
  Check,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';

const COURSE_CATEGORIES = [
  'Hifz-ul-Quran',
  'Nazra Quran',
  'Tajweed-ul-Quran',
  'Shariyat Course',
  'Dars-e-Nizami',
  'Islamic Studies',
  'Arabic Language',
  'Quran Translation and Tafseer',
];

export const CoursesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>(JamiaStore.getCourses());
  const [staffList, setStaffList] = useState<StaffMember[]>(JamiaStore.getStaff());

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'admin_table'>('cards');

  // Modals state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'basic' | 'terms' | 'faculty' | 'gender' | 'syllabus'>('basic');

  // Supabase sync feedback
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Course Form State
  const initialNewCourseState: Omit<Course, 'id'> = {
    code: '',
    title: '',
    arabicTitle: '',
    category: 'Hifz-ul-Quran',
    department: 'Department of Quranic Sciences',
    instructor: 'Senior Asatiza',
    creditHours: 20,
    description: '',
    objectives: [],
    eligibility: 'Configurable by Management (Open for admission upon evaluation)',
    duration: 'Configurable by Management (1 to 2 Years Modular)',
    fees: 'Configurable by Management (Endowment Subsidized / Free Scholarship)',
    certification: 'Configurable by Management (Official Jamia Sanad)',
    admissionInfo: 'Admissions open for current Islamic academic session. Inquiries handled by Director Muneeb ur Rehman.',
    books: [],
    isConfiguredByManagement: true,
    assignedTeachers: [],
    assignedClasses: ['Section A'],
    genderArrangement: {
      hasSeparateWings: true,
      maleClasses: ['Boys Campus Section A'],
      femaleClasses: ['Sayyidah Aisha Bannat Wing Section A'],
      maleTimings: '08:00 AM - 01:30 PM',
      femaleTimings: '02:00 PM - 06:00 PM',
    },
    status: 'active',
  };

  const [newCourseForm, setNewCourseForm] = useState<Omit<Course, 'id'>>(initialNewCourseState);
  const [newObjInput, setNewObjInput] = useState('');
  const [newBookInput, setNewBookInput] = useState('');

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setCourses(JamiaStore.getCourses());
      setStaffList(JamiaStore.getStaff());
    });
    return unsubscribe;
  }, []);

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.arabicTitle.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' || (course.status || 'active') === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Admin stats
  const totalCourses = courses.length;
  const activeCount = courses.filter((c) => (c.status || 'active') === 'active').length;
  const inactiveCount = courses.filter((c) => c.status === 'inactive').length;
  const separateWingsCount = courses.filter((c) => c.genderArrangement?.hasSeparateWings).length;

  // Supabase sync handler
  const handleSupabaseSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to Supabase...');
    const result = await JamiaStore.syncCoursesWithSupabase();
    setSyncStatus(result.message);
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Toggle active/inactive
  const handleToggleStatus = (course: Course) => {
    const nextStatus = (course.status || 'active') === 'active' ? 'inactive' : 'active';
    JamiaStore.updateCourse({
      ...course,
      status: nextStatus,
    });
  };

  // Add course submit
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseForm.title.trim() || !newCourseForm.code.trim()) return;

    JamiaStore.addCourse(newCourseForm);
    setIsAddModalOpen(false);
    setNewCourseForm(initialNewCourseState);
  };

  // Save edited course
  const handleSaveEditedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    JamiaStore.updateCourse(editingCourse);
    setEditingCourse(null);
  };

  // Delete course
  const handleDeleteCourse = (id: string) => {
    JamiaStore.deleteCourse(id);
    setDeleteConfirmId(null);
  };

  // Helper to toggle teacher assignment
  const toggleTeacherAssignment = (
    teacherName: string,
    currentTeachers: string[] | undefined,
    onUpdate: (updated: string[]) => void
  ) => {
    const current = currentTeachers || [];
    if (current.includes(teacherName)) {
      onUpdate(current.filter((t) => t !== teacherName));
    } else {
      onUpdate([...current, teacherName]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Curriculum & Faculties · Jamia Salahuddin Ayubi</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Academic Courses & Programs
        </h1>
        <h2 className="font-arabic text-xl sm:text-2xl text-[#b89344] font-bold">
          المناهج والبرامج العلمية المعتمدة
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive sacred curricula across classical Quranic sciences, Dars-e-Nizami, Shariyat, Arabic linguistics, and contemporary Islamic studies under the guidance of Director <strong>Muneeb ur Rehman</strong>.
        </p>
      </div>

      {/* Official Management Directive Banner */}
      <div className="bg-[#fdfaf2] rounded-2xl p-4 sm:p-5 border border-[#D6B66C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 font-semibold mb-0.5">
              Verified Academic Integrity & Segregated Education Policy
            </strong>
            <span>
              All course durations, fee structures, eligibility criteria, and sanad certifications are strictly maintained and configured by authorized Jamia management under Director <strong>Muneeb ur Rehman</strong>. Dedicated separate arrangements are provided for Male and Female (Bannat) campuses.
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
              <span>Admin: Muneeb ur Rehman</span>
            </span>
          </div>
        )}
      </div>

      {/* Admin Management Toolbar (When Admin logged in) */}
      {isAdmin && (
        <div className="bg-white rounded-3xl p-5 border-2 border-[#176B4D]/30 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-[#b89344] uppercase tracking-wider block">
                Administrative Control Panel
              </span>
              <h2 className="font-serif-heading text-lg font-extrabold text-[#176B4D]">
                Course Management & Academic Governance
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switcher */}
              <div className="bg-[#f8faf9] p-1 rounded-xl border border-slate-200 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cards Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('admin_table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'admin_table'
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Management Table
                </button>
              </div>

              {/* Supabase Sync Button */}
              <button
                type="button"
                onClick={handleSupabaseSync}
                disabled={isSyncing}
                className="px-3.5 py-2 bg-white hover:bg-[#f2f8f5] text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Synchronize with Supabase Cloud Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D6B66C] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync with Supabase'}</span>
              </button>

              {/* Add New Course Button */}
              <button
                type="button"
                onClick={() => {
                  setNewCourseForm(initialNewCourseState);
                  setActiveModalTab('basic');
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D6B66C]" />
                <span>Add New Course</span>
              </button>
            </div>
          </div>

          {/* KPI Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#f8faf9] rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Courses</span>
              <span className="text-xl font-extrabold text-[#176B4D]">{totalCourses}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Active Programs</span>
              <span className="text-xl font-extrabold text-emerald-800">{activeCount}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Inactive / Closed</span>
              <span className="text-xl font-extrabold text-slate-700">{inactiveCount}</span>
            </div>
            <div className="p-3 bg-[#fdfaf2] rounded-2xl border border-[#D6B66C]">
              <span className="text-[10px] uppercase font-bold text-[#b89344] block">Separate Wings</span>
              <span className="text-xl font-extrabold text-[#176B4D]">{separateWingsCount}</span>
            </div>
          </div>

          {syncStatus && (
            <div className="p-3 bg-[#f2f8f5] rounded-xl border border-[#176B4D]/30 text-xs font-semibold text-[#176B4D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Search & Interactive Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course name, Arabic title, code, book, asatiza..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl text-xs font-medium outline-none"
            />
          </div>

          {/* Status Quick Filter (Admin / Staff) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#f8faf9] border border-[#e5ece8] rounded-lg text-xs font-medium text-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of{' '}
              <strong className="text-slate-900">{courses.length}</strong> courses
            </div>
          </div>
        </div>

        {/* 8 Course Category Filter Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#176B4D] text-white shadow-xs'
                : 'bg-[#f8faf9] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            All Categories
          </button>
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'bg-[#f8faf9] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: MANAGEMENT ADMIN TABLE VIEW */}
      {isAdmin && viewMode === 'admin_table' ? (
        <div className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs overflow-hidden">
          <div className="p-5 bg-[#f8faf9] border-b border-[#e5ece8] flex items-center justify-between">
            <h3 className="font-serif-heading font-extrabold text-base text-[#176B4D]">
              Course Management Roster & Arrangements
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {filteredCourses.length} programs loaded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f8f5] text-[#176B4D] uppercase font-bold text-[10px] tracking-wider border-b border-[#e5ece8]">
                <tr>
                  <th className="py-3 px-4">Code & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Lead Asatiza / Staff</th>
                  <th className="py-3 px-4">Gender Arrangement</th>
                  <th className="py-3 px-4">Duration & Fees</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => {
                  const isActive = (c.status || 'active') === 'active';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          <Link to={`/courses/${c.id}`} className="hover:text-[#176B4D] underline decoration-slate-300">
                            {c.title}
                          </Link>
                        </div>
                        <div className="font-arabic text-[#b89344] font-semibold text-[11px] mt-0.5">
                          {c.arabicTitle}
                        </div>
                        <span className="font-mono text-[10px] text-[#176B4D] bg-[#f2f8f5] px-1.5 py-0.5 rounded border border-[#176B4D]/20 mt-1 inline-block">
                          {c.code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {c.category}
                        <div className="text-[10px] text-slate-400">{c.department}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.instructor}</div>
                        {c.assignedTeachers && c.assignedTeachers.length > 0 && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            +{c.assignedTeachers.length} assigned asatiza
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {c.genderArrangement?.hasSeparateWings ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Users className="w-3 h-3 text-emerald-600" />
                            <span>Separate Wings</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Standard Intake</span>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Boys: {c.genderArrangement?.maleTimings || '08:00 AM'} | Girls: {c.genderArrangement?.femaleTimings || '02:00 PM'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-semibold text-slate-800">{c.duration}</div>
                        <div className="text-[10px] text-slate-500">{c.fees}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          title="Click to toggle active/inactive status"
                        >
                          {isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCourse(c);
                              setActiveModalTab('basic');
                            }}
                            className="p-1.5 text-[#176B4D] hover:bg-[#f2f8f5] rounded-lg border border-[#176B4D]/20 transition-all cursor-pointer"
                            title="Edit course & arrangements"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/courses/${c.id}`}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all cursor-pointer"
                            title="View public details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(c.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-all cursor-pointer"
                            title="Delete course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      ) : (
        /* VIEW 2: COURSE CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => {
            const isActive = (course.status || 'active') === 'active';
            return (
              <div
                key={course.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between space-y-6 ${
                  isActive
                    ? 'border-[#e5ece8] hover:border-[#176B4D]/50 shadow-xs hover:shadow-xl'
                    : 'border-slate-200 bg-slate-50/50 opacity-90'
                }`}
              >
                {/* Top Info Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2.5 py-1 rounded-md border border-[#176B4D]/20">
                        {course.code}
                      </span>
                      <span className="text-slate-500 text-[11px] font-semibold">
                        {course.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {course.genderArrangement?.hasSeparateWings && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-600" />
                          <span>Separate Wings</span>
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="font-serif-heading font-extrabold text-xl sm:text-2xl text-slate-900 hover:text-[#176B4D] transition-colors leading-tight block"
                    >
                      {course.title}
                    </Link>
                    <span className="font-arabic text-base text-[#176B4D] font-bold block mt-1">
                      {course.arabicTitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Male / Female Timings & Wing Arrangement */}
                  {course.genderArrangement && (
                    <div className="p-3 bg-[#f8faf9] rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        <span>Class Schedules & Campus Wings:</span>
                        <span className="text-[#b89344] font-medium">Segregated Policy</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="font-bold text-[#176B4D] block">Boys Campus:</span>
                          <span className="text-slate-600">{course.genderArrangement.maleTimings || '08:00 AM - 01:30 PM'}</span>
                          {course.genderArrangement.maleClasses && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {course.genderArrangement.maleClasses.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="font-bold text-[#b89344] block">Girls Bannat Wing:</span>
                          <span className="text-slate-600">{course.genderArrangement.femaleTimings || '02:00 PM - 06:00 PM'}</span>
                          {course.genderArrangement.femaleClasses && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {course.genderArrangement.femaleClasses.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assigned Asatiza Preview */}
                  {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />
                      <span className="font-medium">
                        Assigned Asatiza:{' '}
                        <strong className="text-slate-900">{course.assignedTeachers.join(', ')}</strong>
                      </span>
                    </div>
                  )}

                  {/* Course Objectives Preview */}
                  {course.objectives && course.objectives.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                        Core Program Objectives:
                      </span>
                      <ul className="space-y-1">
                        {course.objectives.slice(0, 3).map((obj, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Configurable Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Duration
                      </span>
                      <span className="text-slate-800 font-semibold leading-tight block">
                        {course.duration}
                      </span>
                    </div>

                    <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Eligibility
                      </span>
                      <span className="text-slate-800 font-semibold leading-tight block">
                        {course.eligibility}
                      </span>
                    </div>

                    <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Tuition / Fee Policy
                      </span>
                      <span className="text-slate-800 font-semibold leading-tight block">
                        {course.fees}
                      </span>
                    </div>

                    <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Certification
                      </span>
                      <span className="text-slate-800 font-semibold leading-tight block">
                        {course.certification}
                      </span>
                    </div>
                  </div>

                  {/* Core Prescribed Books */}
                  {course.books && course.books.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Prescribed Classical Texts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.books.map((b, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-[#f2f8f5] text-[#176B4D] px-2.5 py-0.5 rounded-lg border border-[#176B4D]/20 font-medium"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Lead Faculty: <strong className="text-slate-800">{course.instructor}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourse(course);
                          setActiveModalTab('basic');
                        }}
                        className="p-2 text-xs font-semibold text-[#176B4D] bg-[#f2f8f5] hover:bg-[#e5ece8] rounded-xl border border-[#176B4D]/20 transition-all cursor-pointer"
                        title="Configure details as Management"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Link
                      to={`/courses/${course.id}`}
                      className="px-4 py-2 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Course Details</span>
                      <ArrowRight className="w-3 h-3 text-[#D6B66C]" />
                    </Link>

                    {isActive ? (
                      <Link
                        to={`/admissions/apply?course=${encodeURIComponent(course.title)}`}
                        className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-[#D6B66C]" />
                        <span>Apply Now</span>
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed">
                        Intake Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD NEW COURSE (Authorized Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                  Curriculum Division · Jamia Salahuddin Ayubi
                </span>
                <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                  Add New Academic Course
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'terms', label: '2. Duration & Terms' },
                { id: 'faculty', label: '3. Teachers & Classes' },
                { id: 'gender', label: '4. Male/Female Wings' },
                { id: 'syllabus', label: '5. Texts & Objectives' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeModalTab === tab.id
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              {/* TAB 1: BASIC INFO */}
              {activeModalTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Course Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCourseForm.code}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. ARB-201, DN-500, HZ-101"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Course Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCourseForm.title}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. Advanced Arabic Grammar & Rhetoric"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Arabic Title (العنوان بالعربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={newCourseForm.arabicTitle}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, arabicTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none font-arabic"
                        placeholder="مثال: البلاغة العربية والنحو الواضح"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Category *
                      </label>
                      <select
                        value={newCourseForm.category}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, category: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      >
                        {COURSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.department}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, department: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. Faculty of Arabic Linguistics"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Lead Instructor / Supervisor
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.instructor}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, instructor: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. Maulana Abdul Qayyum"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Course Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newCourseForm.description}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="Comprehensive overview of learning objectives, methodology, and scope..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Course Status
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="newStatus"
                          checked={newCourseForm.status === 'active'}
                          onChange={() => setNewCourseForm({ ...newCourseForm, status: 'active' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-emerald-800">Active (Accepting Admissions)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="newStatus"
                          checked={newCourseForm.status === 'inactive'}
                          onChange={() => setNewCourseForm({ ...newCourseForm, status: 'inactive' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-slate-600">Inactive / Closed</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TERMS (Configurable by Management) */}
              {activeModalTab === 'terms' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#fdfaf2] rounded-xl border border-[#D6B66C] text-slate-700">
                    <strong>Institutional Guidance:</strong> Duration, fees, eligibility, and sanad policies are officially set by Director <strong>Muneeb ur Rehman</strong>.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Duration Specification
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.duration}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. 2 Years Full-Time / 1 Year Modular"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Tuition & Fee Policy
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.fees}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, fees: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. 100% Free Scholarship / Subsidized"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Eligibility Requirements
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.eligibility}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, eligibility: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. Matric / Middle with basic Arabic familiarity"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Official Certification / Sanad
                      </label>
                      <input
                        type="text"
                        value={newCourseForm.certification}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, certification: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                        placeholder="e.g. Jamia Sanad-ul-Lughah al-Arabiyyah"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Admission Information & Process
                    </label>
                    <textarea
                      rows={3}
                      value={newCourseForm.admissionInfo}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, admissionInfo: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="Admission details, screening interview dates, boarding intake..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FACULTY & CLASSES */}
              {activeModalTab === 'faculty' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Assign Faculty / Teachers from Staff Roster
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Select instructors registered in Jamia staff system to supervise this course:
                    </p>

                    {staffList.length === 0 ? (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                        No faculty members currently listed. You can add teachers in the Staff module or specify the lead instructor manually.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#f8faf9] rounded-2xl border border-slate-200">
                        {staffList.map((st) => {
                          const isAssigned = (newCourseForm.assignedTeachers || []).includes(st.fullName);
                          return (
                            <label
                              key={st.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isAssigned
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="text-xs">{st.fullName}</div>
                                <div className="text-[10px] text-slate-400">{st.designation} ({st.assignedDepartment})</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() =>
                                  toggleTeacherAssignment(
                                    st.fullName,
                                    newCourseForm.assignedTeachers,
                                    (updated) => setNewCourseForm({ ...newCourseForm, assignedTeachers: updated })
                                  )
                                }
                                className="accent-[#176B4D]"
                              />
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Assigned General Classes / Sections (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(newCourseForm.assignedClasses || []).join(', ')}
                      onChange={(e) =>
                        setNewCourseForm({
                          ...newCourseForm,
                          assignedClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="e.g. Section A, Section B, Evening Batch"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MALE / FEMALE WINGS */}
              {activeModalTab === 'gender' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#f2f8f5] rounded-xl border border-[#176B4D]/30 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        Separate Male & Female Campus Arrangements
                      </strong>
                      <span className="text-slate-600 text-[11px]">
                        Jamia Salahuddin Ayubi enforces completely segregated education environments.
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#176B4D]">
                      <input
                        type="checkbox"
                        checked={newCourseForm.genderArrangement?.hasSeparateWings ?? true}
                        onChange={(e) =>
                          setNewCourseForm({
                            ...newCourseForm,
                            genderArrangement: {
                              ...newCourseForm.genderArrangement,
                              hasSeparateWings: e.target.checked,
                            },
                          })
                        }
                        className="accent-[#176B4D] w-4 h-4"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Male Campus */}
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-[#176B4D]">
                        <Users className="w-4 h-4" />
                        <span>Boys Campus Arrangements</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Male Timings</label>
                        <input
                          type="text"
                          value={newCourseForm.genderArrangement?.maleTimings || ''}
                          onChange={(e) =>
                            setNewCourseForm({
                              ...newCourseForm,
                              genderArrangement: {
                                ...newCourseForm.genderArrangement,
                                maleTimings: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          placeholder="e.g. 08:00 AM - 01:30 PM"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Male Sections (comma-separated)</label>
                        <input
                          type="text"
                          value={(newCourseForm.genderArrangement?.maleClasses || []).join(', ')}
                          onChange={(e) =>
                            setNewCourseForm({
                              ...newCourseForm,
                              genderArrangement: {
                                ...newCourseForm.genderArrangement,
                                maleClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          placeholder="Boys Section A, Boys Section B"
                        />
                      </div>
                    </div>

                    {/* Female Bannat Wing */}
                    <div className="p-4 bg-amber-50/40 rounded-2xl border border-[#D6B66C] space-y-3">
                      <div className="flex items-center gap-2 font-bold text-[#b89344]">
                        <Users className="w-4 h-4" />
                        <span>Girls Bannat Wing Arrangements</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Female Timings</label>
                        <input
                          type="text"
                          value={newCourseForm.genderArrangement?.femaleTimings || ''}
                          onChange={(e) =>
                            setNewCourseForm({
                              ...newCourseForm,
                              genderArrangement: {
                                ...newCourseForm.genderArrangement,
                                femaleTimings: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          placeholder="e.g. 02:00 PM - 06:00 PM"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Female Sections (comma-separated)</label>
                        <input
                          type="text"
                          value={(newCourseForm.genderArrangement?.femaleClasses || []).join(', ')}
                          onChange={(e) =>
                            setNewCourseForm({
                              ...newCourseForm,
                              genderArrangement: {
                                ...newCourseForm.genderArrangement,
                                femaleClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          placeholder="Sayyidah Aisha Wing Section A"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYLLABUS & BOOKS */}
              {activeModalTab === 'syllabus' && (
                <div className="space-y-4">
                  {/* Objectives */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Course Objectives (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(newCourseForm.objectives || []).join('\n')}
                      onChange={(e) =>
                        setNewCourseForm({
                          ...newCourseForm,
                          objectives: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="Fluency in classical grammar&#10;Mastery of Quranic phonetics&#10;Isnad development"
                    />
                  </div>

                  {/* Books */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Prescribed Classical Texts (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(newCourseForm.books || []).join(', ')}
                      onChange={(e) =>
                        setNewCourseForm({
                          ...newCourseForm,
                          books: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="e.g. Nur al-Idah, Mukhtasar al-Quduri, Al-Jazariyyah"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="text-[11px] text-slate-400">
                  Tab {activeModalTab.toUpperCase()} active
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#D6B66C]" />
                    <span>Publish New Course</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT COURSE & FULL ARRANGEMENTS */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                  Authorized Management Configuration · Muneeb ur Rehman
                </span>
                <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                  Edit Course: {editingCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
              {[
                { id: 'basic', label: '1. Curriculum Details' },
                { id: 'terms', label: '2. Duration & Terms' },
                { id: 'faculty', label: '3. Teachers & Classes' },
                { id: 'gender', label: '4. Male/Female Wings' },
                { id: 'syllabus', label: '5. Texts & Objectives' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeModalTab === tab.id
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveEditedCourse} className="space-y-4 text-xs">
              {/* TAB 1: BASIC INFO */}
              {activeModalTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Course Code</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.code}
                        onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Arabic Title (العنوان بالعربية)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editingCourse.arabicTitle}
                        onChange={(e) => setEditingCourse({ ...editingCourse, arabicTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                      <select
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      >
                        {COURSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                      <input
                        type="text"
                        value={editingCourse.department}
                        onChange={(e) => setEditingCourse({ ...editingCourse, department: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Lead Instructor / Supervisor</label>
                      <input
                        type="text"
                        value={editingCourse.instructor}
                        onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="editStatus"
                          checked={(editingCourse.status || 'active') === 'active'}
                          onChange={() => setEditingCourse({ ...editingCourse, status: 'active' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-emerald-800">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="editStatus"
                          checked={editingCourse.status === 'inactive'}
                          onChange={() => setEditingCourse({ ...editingCourse, status: 'inactive' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-slate-600">Inactive / Closed</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TERMS */}
              {activeModalTab === 'terms' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Duration Specification</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Fee & Concession Policy</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.fees}
                        onChange={(e) => setEditingCourse({ ...editingCourse, fees: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Eligibility Criteria</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.eligibility}
                        onChange={(e) => setEditingCourse({ ...editingCourse, eligibility: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Certification & Sanad</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.certification}
                        onChange={(e) => setEditingCourse({ ...editingCourse, certification: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Admission Information</label>
                    <textarea
                      rows={3}
                      value={editingCourse.admissionInfo}
                      onChange={(e) => setEditingCourse({ ...editingCourse, admissionInfo: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FACULTY & CLASSES */}
              {activeModalTab === 'faculty' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Assigned Faculty from Staff Roster
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Assign verified teachers and Asatiza:
                    </p>

                    {staffList.length === 0 ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                        No faculty members available in staff directory.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#f8faf9] rounded-2xl border border-slate-200">
                        {staffList.map((st) => {
                          const isAssigned = (editingCourse.assignedTeachers || []).includes(st.fullName);
                          return (
                            <label
                              key={st.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isAssigned
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="text-xs">{st.fullName}</div>
                                <div className="text-[10px] text-slate-400">{st.designation}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() =>
                                  toggleTeacherAssignment(
                                    st.fullName,
                                    editingCourse.assignedTeachers,
                                    (updated) => setEditingCourse({ ...editingCourse, assignedTeachers: updated })
                                  )
                                }
                                className="accent-[#176B4D]"
                              />
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Assigned Classes / Sections (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingCourse.assignedClasses || []).join(', ')}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          assignedClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      placeholder="e.g. Section A, Section B, Tahfeez Morning"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MALE / FEMALE WINGS */}
              {activeModalTab === 'gender' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#f2f8f5] rounded-xl border border-[#176B4D]/30 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        Separate Male & Female Campus Arrangements
                      </strong>
                      <span className="text-slate-600 text-[11px]">
                        Maintain strict segregation between Male Campus and Girls Bannat Wing.
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#176B4D]">
                      <input
                        type="checkbox"
                        checked={editingCourse.genderArrangement?.hasSeparateWings ?? true}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            genderArrangement: {
                              ...editingCourse.genderArrangement,
                              hasSeparateWings: e.target.checked,
                            },
                          })
                        }
                        className="accent-[#176B4D] w-4 h-4"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Male Campus */}
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-[#176B4D]">
                        <Users className="w-4 h-4" />
                        <span>Boys Campus Arrangements</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Male Timings</label>
                        <input
                          type="text"
                          value={editingCourse.genderArrangement?.maleTimings || ''}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              genderArrangement: {
                                ...editingCourse.genderArrangement,
                                maleTimings: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Male Sections (comma-separated)</label>
                        <input
                          type="text"
                          value={(editingCourse.genderArrangement?.maleClasses || []).join(', ')}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              genderArrangement: {
                                ...editingCourse.genderArrangement,
                                maleClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Female Bannat Wing */}
                    <div className="p-4 bg-amber-50/40 rounded-2xl border border-[#D6B66C] space-y-3">
                      <div className="flex items-center gap-2 font-bold text-[#b89344]">
                        <Users className="w-4 h-4" />
                        <span>Girls Bannat Wing Arrangements</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Female Timings</label>
                        <input
                          type="text"
                          value={editingCourse.genderArrangement?.femaleTimings || ''}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              genderArrangement: {
                                ...editingCourse.genderArrangement,
                                femaleTimings: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Female Sections (comma-separated)</label>
                        <input
                          type="text"
                          value={(editingCourse.genderArrangement?.femaleClasses || []).join(', ')}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              genderArrangement: {
                                ...editingCourse.genderArrangement,
                                femaleClasses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              },
                            })
                          }
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYLLABUS & BOOKS */}
              {activeModalTab === 'syllabus' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Course Objectives (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(editingCourse.objectives || []).join('\n')}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          objectives: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Prescribed Classical Texts (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingCourse.books || []).join(', ')}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          books: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(editingCourse.id)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Course</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                    <span>Save Course Configuration</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-rose-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif-heading font-extrabold text-lg text-slate-900">
                Confirm Course Deletion
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this course from the Jamia catalog? This will remove all associated class assignments and synchronize the deletion with Supabase.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteCourse(deleteConfirmId);
                  setEditingCourse(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
