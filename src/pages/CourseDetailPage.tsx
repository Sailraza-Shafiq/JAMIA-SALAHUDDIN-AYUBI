import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { Course, StaffMember } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Award,
  FileText,
  Edit3,
  Users,
  Phone,
  Heart,
  Check,
  X,
  Building2,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [courses, setCourses] = useState<Course[]>(JamiaStore.getCourses());
  const [staffList, setStaffList] = useState<StaffMember[]>(JamiaStore.getStaff());

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setCourses(JamiaStore.getCourses());
      setStaffList(JamiaStore.getStaff());
    });
    return unsub;
  }, []);

  const course = courses.find(
    (c) => c.id === courseId || c.code.toLowerCase() === courseId?.toLowerCase()
  );

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [formData, setFormData] = useState<Course | null>(course || null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'terms' | 'faculty' | 'gender' | 'syllabus'>('terms');

  // Keep formData in sync if course updates
  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#b89344] flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="font-serif-heading font-extrabold text-2xl text-slate-900">
          Course Not Found
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The requested course record does not exist or may have been reorganized in the Jamia Salahuddin Ayubi curriculum catalog.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    JamiaStore.updateCourse(formData);
    setSaveSuccess(true);
    setIsConfiguring(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleTeacher = (teacherName: string) => {
    if (!formData) return;
    const current = formData.assignedTeachers || [];
    const updated = current.includes(teacherName)
      ? current.filter((t) => t !== teacherName)
      : [...current, teacherName];
    setFormData({ ...formData, assignedTeachers: updated });
  };

  const isActive = (course.status || 'active') === 'active';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Back Link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#176B4D] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setFormData(course);
              setIsConfiguring(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#176B4D] bg-[#f2f8f5] hover:bg-[#e5ece8] rounded-xl border border-[#176B4D]/30 transition-all cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage Course & Arrangements (Muneeb ur Rehman Mode)</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Course specifications and class arrangements successfully updated and synced with Jamia registry!</span>
        </div>
      )}

      {/* Hero Banner for Course */}
      <div className="bg-gradient-to-r from-[#176B4D] via-[#1B7A58] to-[#0f4a35] rounded-3xl p-8 sm:p-12 text-white border-2 border-[#D6B66C] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold bg-[#D6B66C] text-[#0f4a35] px-3 py-1 rounded-full uppercase tracking-wider">
              {course.code}
            </span>
            <span className="text-emerald-200 text-xs font-semibold">
              Category: {course.category}
            </span>
            <span className="text-emerald-300/40">·</span>
            <span className="text-emerald-100 text-xs font-semibold">
              Department: {course.department}
            </span>
            <span className="text-emerald-300/40">·</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isActive ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-300 text-slate-800'
              }`}
            >
              {isActive ? 'Active Intake' : 'Admissions Closed'}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>
            <span className="font-arabic text-2xl sm:text-3xl text-[#D6B66C] font-bold block">
              {course.arabicTitle}
            </span>
          </div>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-3xl">
            {course.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            {isActive ? (
              <Link
                to={`/admissions/apply?course=${encodeURIComponent(course.title)}`}
                className="px-7 py-3.5 bg-[#D6B66C] hover:bg-[#b89344] text-[#0f4a35] font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apply Now for {course.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-6 py-3.5 bg-white/20 text-white font-bold text-sm rounded-xl cursor-not-allowed">
                Admissions Currently Closed
              </span>
            )}

            <Link
              to="/admissions"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Admissions Roadmap & Criteria</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Admission Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Male & Female Separate Wings & Timings Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#D6B66C]" />
                <span>Campus Arrangements & Timings</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                100% Segregated Wings
              </span>
            </div>

            <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Male & Female Academic Schedules
            </h2>
            <div className="w-16 h-1 bg-[#D6B66C] rounded-full" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Male Campus */}
              <div className="p-5 bg-[#f2f8f5] rounded-2xl border border-[#176B4D]/20 space-y-2">
                <div className="flex items-center gap-2 text-[#176B4D] font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>Boys Campus</span>
                </div>
                <div className="text-xs text-slate-700">
                  <strong>Daily Timings: </strong>
                  <span>{course.genderArrangement?.maleTimings || '08:00 AM - 01:30 PM (Morning)'}</span>
                </div>
                {course.genderArrangement?.maleClasses && course.genderArrangement.maleClasses.length > 0 && (
                  <div className="text-xs text-slate-600 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Sections:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.genderArrangement.maleClasses.map((cls, idx) => (
                        <span key={idx} className="bg-white text-[#176B4D] px-2 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Female Bannat Wing */}
              <div className="p-5 bg-[#fdfaf2] rounded-2xl border border-[#D6B66C] space-y-2">
                <div className="flex items-center gap-2 text-[#b89344] font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>Girls Bannat Wing</span>
                </div>
                <div className="text-xs text-slate-700">
                  <strong>Daily Timings: </strong>
                  <span>{course.genderArrangement?.femaleTimings || '02:00 PM - 06:00 PM (Afternoon)'}</span>
                </div>
                {course.genderArrangement?.femaleClasses && course.genderArrangement.femaleClasses.length > 0 && (
                  <div className="text-xs text-slate-600 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Sections:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.genderArrangement.femaleClasses.map((cls, idx) => (
                        <span key={idx} className="bg-white text-[#b89344] px-2 py-0.5 rounded-md text-[11px] font-semibold border border-[#D6B66C]/40">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Course Objectives */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#D6B66C]" />
              <span>Curriculum Outcomes</span>
            </div>
            <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Course Objectives & Scholarly Goals
            </h2>
            <div className="w-16 h-1 bg-[#D6B66C] rounded-full" />

            <div className="space-y-3 pt-2">
              {course.objectives && course.objectives.length > 0 ? (
                course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {obj}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Course objectives are configured and maintained by the academic board.</p>
              )}
            </div>
          </div>

          {/* Core Prescribed Classical Texts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#D6B66C]" />
              <span>Core Reading Materials</span>
            </div>
            <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Prescribed Classical Texts & Mutoon
            </h2>
            <p className="text-xs text-slate-600">
              Students receive authentic Isnad instruction directly based upon canonical and traditional texts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {course.books && course.books.map((book, idx) => (
                <div key={idx} className="p-3.5 bg-[#f2f8f5] rounded-2xl border border-[#176B4D]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#176B4D] flex items-center justify-center font-bold text-xs shadow-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{book}</strong>
                    <span className="text-[10px] text-[#176B4D] font-medium">Core Reading Curriculum</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Information Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
              <span>Enrollment Process</span>
            </div>
            <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Admission Information & Instructions
            </h2>
            <div className="p-4 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <p>{course.admissionInfo}</p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                Official intake governed by Director <strong>Muneeb ur Rehman</strong>. For questions on entrance test requirements or boarding availability, please submit an online application.
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {isActive && (
                <Link
                  to={`/admissions/apply?course=${encodeURIComponent(course.title)}`}
                  className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
                  <span>Submit Online Admission Application</span>
                </Link>
              )}
              <Link
                to="/contact"
                className="px-4 py-3 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-[#b89344]" />
                <span>Contact Admissions Office</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Configurable Specifications & Management (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Terms Summary Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#176B4D]/20 shadow-md space-y-5">
            <h3 className="font-serif-heading font-bold text-lg text-[#176B4D] pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Program Specifications</span>
              <ShieldCheck className="w-4 h-4 text-[#D6B66C]" />
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Course Duration
                </span>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 font-semibold text-slate-900">
                  {course.duration}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Eligibility Criteria
                </span>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 font-semibold text-slate-900">
                  {course.eligibility}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Tuition & Concessions
                </span>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 font-semibold text-slate-900">
                  {course.fees}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Official Certification
                </span>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 font-semibold text-slate-900">
                  {course.certification}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Primary Faculty Supervisor
                </span>
                <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 font-semibold text-slate-900">
                  {course.instructor}
                </div>
              </div>

              {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Assigned Teaching Staff
                  </span>
                  <div className="p-3 bg-[#f2f8f5] rounded-xl border border-[#176B4D]/20 text-slate-800">
                    <ul className="space-y-1">
                      {course.assignedTeachers.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3 h-3 text-[#176B4D]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {isActive && (
              <div className="pt-2">
                <Link
                  to={`/admissions/apply?course=${encodeURIComponent(course.title)}`}
                  className="w-full py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#D6B66C]" />
                  <span>Apply for this Course</span>
                </Link>
              </div>
            )}
          </div>

          {/* Endowment & Scholarship Note */}
          <div className="bg-[#fdfaf2] rounded-3xl p-6 border border-[#D6B66C] space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#b89344] font-bold">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Full Financial Aid Guarantee</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Under the directives of Director <strong>Muneeb ur Rehman</strong>, full tuition waivers and hostel subsidies are unconditionally granted to Huffaz, orphans, and deserving candidates.
            </p>
          </div>
        </div>
      </div>

      {/* Management Configuration Modal (Admin Mode) */}
      {isConfiguring && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                  Authorized Management Configuration · Muneeb ur Rehman
                </span>
                <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                  Configure Course: {course.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-3">
              {[
                { id: 'terms', label: '1. Duration & Terms' },
                { id: 'faculty', label: '2. Teachers & Staff' },
                { id: 'gender', label: '3. Male/Female Wings' },
                { id: 'syllabus', label: '4. Objectives' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Duration Specification
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Tuition Fees / Concessions
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fees}
                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
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
                        required
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Certification & Sanad Form
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.certification}
                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                        className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Admission Information & Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={formData.admissionInfo}
                      onChange={(e) => setFormData({ ...formData, admissionInfo: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Lead Instructor
                    </label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="courseStatus"
                          checked={(formData.status || 'active') === 'active'}
                          onChange={() => setFormData({ ...formData, status: 'active' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-emerald-800">Active (Accepting Applications)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="courseStatus"
                          checked={formData.status === 'inactive'}
                          onChange={() => setFormData({ ...formData, status: 'inactive' })}
                          className="accent-[#176B4D]"
                        />
                        <span className="font-semibold text-slate-600">Inactive / Closed</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faculty' && (
                <div className="space-y-4">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Assign Faculty from Staff Directory
                  </label>
                  {staffList.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-xs">
                      No staff members found in staff roster.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#f8faf9] rounded-2xl border border-slate-200">
                      {staffList.map((st) => {
                        const isAssigned = (formData.assignedTeachers || []).includes(st.fullName);
                        return (
                          <label
                            key={st.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                              isAssigned
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs">{st.fullName}</div>
                              <div className="text-[10px] text-slate-400">{st.designation}</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => toggleTeacher(st.fullName)}
                              className="accent-[#176B4D]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gender' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#f2f8f5] rounded-xl border border-[#176B4D]/30 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        Separate Wings Policy
                      </strong>
                      <span className="text-slate-600 text-[11px]">
                        Segregated campuses for Male and Female students.
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#176B4D]">
                      <input
                        type="checkbox"
                        checked={formData.genderArrangement?.hasSeparateWings ?? true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            genderArrangement: {
                              ...formData.genderArrangement,
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
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                      <label className="block font-semibold text-slate-700">Male Timings</label>
                      <input
                        type="text"
                        value={formData.genderArrangement?.maleTimings || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            genderArrangement: {
                              ...formData.genderArrangement,
                              maleTimings: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="p-3 bg-amber-50/40 rounded-xl border border-[#D6B66C] space-y-2">
                      <label className="block font-semibold text-slate-700">Female Timings</label>
                      <input
                        type="text"
                        value={formData.genderArrangement?.femaleTimings || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            genderArrangement: {
                              ...formData.genderArrangement,
                              femaleTimings: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Objectives (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.objectives || []).join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          objectives: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Prescribed Texts (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(formData.books || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          books: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfiguring(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
