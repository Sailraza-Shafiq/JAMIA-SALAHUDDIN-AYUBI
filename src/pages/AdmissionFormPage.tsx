import React, { useState, useRef } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import { AdmissionApplication, BloodGroup } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  MapPin,
  Heart,
  Upload,
  FileText,
  AlertCircle,
  Eye,
  Edit3,
  Check,
  X,
  Filter,
  Users,
  Image as ImageIcon,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const AdmissionFormPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedCourse = searchParams.get('course') || searchParams.get('program') || '';
  const { isAdmin } = useAuth();

  const [activeView, setActiveView] = useState<'form' | 'track' | 'admin'>('form');

  // Available Course Categories
  const coursesList = [
    'Hifz-ul-Quran',
    'Nazra Quran',
    'Tajweed-ul-Quran',
    'Shariyat Course',
    'Dars-e-Nizami',
    'Islamic Studies',
    'Arabic Language',
    'Quran Translation and Tafseer',
  ];

  // Gender-segregated class/section arrangements
  const MALE_SECTIONS = [
    'Boys Section A (Imam Bukhari Block)',
    'Boys Section B (Salahuddin Block)',
    'Boys Hifz Halaqah 1 (Morning Session)',
    'Boys Hifz Halaqah 2 (Afternoon Session)',
    'Boys Dars-e-Nizami Al-Ula Section',
    'Boys Post-Graduate Research Wing',
  ];

  const FEMALE_SECTIONS = [
    'Girls Bannat Section Sayyidah Aisha (R.A)',
    'Girls Bannat Section Sayyidah Fatima (R.A)',
    'Girls Bannat Section Sayyidah Khadija (R.A)',
    'Girls Bannat Hifz-ul-Quran Circle',
    'Girls Bannat Alimiyyah Al-Ula Section',
    'Girls Bannat Arabic & Shariyat Diploma Unit',
  ];

  const PROVINCES = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Gilgit-Baltistan',
    'Azad Jammu & Kashmir',
  ];

  const RELATIONSHIPS = [
    'Father',
    'Mother',
    'Brother',
    'Paternal Uncle',
    'Maternal Uncle',
    'Grandfather',
    'Legal Guardian',
  ];

  // =========================================================================
  // FORM STATE: ALL PERSONAL FIELDS INITIALLY BLANK AS REQUESTED
  // =========================================================================
  const [formData, setFormData] = useState({
    // Section 1: Admission Category
    admissionCategory: 'male' as 'male' | 'female',

    // Section 2: Personal Information
    applicantName: '',
    fatherName: '',
    dob: '',
    gender: 'male' as 'male' | 'female',
    photoUrl: '',
    bFormCnic: '',
    contactNumber: '',
    whatsappNumber: '',
    email: '',

    // Section 3: Address
    address: '',
    city: '',
    province: 'Punjab',

    // Section 4: Educational Information
    previousSchool: '',
    previousEducation: '',
    program: requestedCourse || '',
    preferredSection: '',

    // Section 5: Guardian Information
    guardianName: '',
    guardianContact: '',
    relationship: 'Father',

    // Section 6: Additional Information
    medicalNotes: '',
    documentUrl: '',
    documentName: '',
  });

  const [sameWhatsapp, setSameWhatsapp] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Status Search State
  const [statusQuery, setStatusQuery] = useState('');
  const [foundStatusApp, setFoundStatusApp] = useState<AdmissionApplication | null | undefined>(undefined);

  // Admin Management State
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | 'male' | 'female'>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'interview_scheduled'>('all');
  const [inspectingApp, setInspectingApp] = useState<AdmissionApplication | null>(null);
  const [editingAdminApp, setEditingAdminApp] = useState<AdmissionApplication | null>(null);

  // Handle Admission Category Switch (Auto-locks gender & updates class sections)
  const handleCategoryChange = (category: 'male' | 'female') => {
    setFormData((prev) => ({
      ...prev,
      admissionCategory: category,
      gender: category,
      preferredSection: '', // Reset to force selecting a section from the respective wing
    }));
  };

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'contactNumber' && sameWhatsapp) {
        next.whatsappNumber = value;
      }
      return next;
    });

    // Clear error for field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, photoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Document Upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        documentUrl: base64,
        documentName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.applicantName.trim()) errors.applicantName = 'Student full name is required';
    if (!formData.fatherName.trim()) errors.fatherName = "Father's name is required";
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (!formData.whatsappNumber.trim()) errors.whatsappNumber = 'WhatsApp number is required';
    if (!formData.address.trim()) errors.address = 'Complete residential address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.province.trim()) errors.province = 'Province is required';
    if (!formData.previousSchool.trim()) errors.previousSchool = 'Previous school or madrasa is required';
    if (!formData.previousEducation.trim()) errors.previousEducation = 'Previous education status is required';
    if (!formData.program) errors.program = 'Please select the applying course';
    if (!formData.preferredSection) errors.preferredSection = 'Please select a preferred class / section';
    if (!formData.guardianName.trim()) errors.guardianName = 'Guardian name is required';
    if (!formData.guardianContact.trim()) errors.guardianContact = 'Guardian contact number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submit Application
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    const newApplication = JamiaStore.submitAdmission({
      admissionCategory: formData.admissionCategory,
      applicantName: formData.applicantName.trim(),
      fatherName: formData.fatherName.trim(),
      dob: formData.dob,
      gender: formData.gender,
      photoUrl: formData.photoUrl || undefined,
      bFormCnic: formData.bFormCnic.trim() || undefined,
      contactNumber: formData.contactNumber.trim(),
      whatsappNumber: formData.whatsappNumber.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      province: formData.province,
      previousSchool: formData.previousSchool.trim(),
      previousEducation: formData.previousEducation.trim(),
      program: formData.program,
      preferredSection: formData.preferredSection,
      guardianName: formData.guardianName.trim(),
      guardianContact: formData.guardianContact.trim(),
      relationship: formData.relationship,
      medicalNotes: formData.medicalNotes.trim() || undefined,
      documentUrl: formData.documentUrl || undefined,
      documentName: formData.documentName || undefined,
    });

    setSubmittedApp(newApplication);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to a completely blank new application
  const handleStartNewApplication = () => {
    setSubmittedApp(null);
    setFormData({
      admissionCategory: 'male',
      applicantName: '',
      fatherName: '',
      dob: '',
      gender: 'male',
      photoUrl: '',
      bFormCnic: '',
      contactNumber: '',
      whatsappNumber: '',
      email: '',
      address: '',
      city: '',
      province: 'Punjab',
      previousSchool: '',
      previousEducation: '',
      program: '',
      preferredSection: '',
      guardianName: '',
      guardianContact: '',
      relationship: 'Father',
      medicalNotes: '',
      documentUrl: '',
      documentName: '',
    });
    setFormErrors({});
  };

  // Search Application Status
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusQuery.trim()) return;

    const allApps = JamiaStore.getAdmissions();
    const query = statusQuery.trim().toLowerCase();
    const found = allApps.find(
      (a) =>
        a.applicationNumber.toLowerCase() === query ||
        (a.bFormCnic && a.bFormCnic.toLowerCase() === query) ||
        (a.contactNumber && a.contactNumber.toLowerCase() === query) ||
        (a.phone && a.phone.toLowerCase() === query)
    );

    setFoundStatusApp(found || null);
  };

  // Admin Actions
  const allAdminApps = JamiaStore.getAdmissions();
  const filteredAdminApps = allAdminApps.filter((a) => {
    const isMale = (a.admissionCategory || a.gender) === 'male';
    const matchesCategory =
      adminCategoryFilter === 'all' ||
      (adminCategoryFilter === 'male' && isMale) ||
      (adminCategoryFilter === 'female' && !isMale);
    const matchesStatus = adminStatusFilter === 'all' || a.status === adminStatusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleAdminApprove = (app: AdmissionApplication) => {
    const isMale = (app.admissionCategory || app.gender) === 'male';
    const assignedSection = app.preferredSection || (isMale ? 'Boys Section A' : 'Girls Bannat Section Sayyidah Aisha (R.A)');
    const rollNo = isMale
      ? `JSA-2026-M${Math.floor(100 + Math.random() * 900)}`
      : `JSA-2026-F${Math.floor(100 + Math.random() * 900)}`;

    JamiaStore.updateAdmissionStatus(app.id, 'approved', {
      assignedRollNumber: rollNo,
      assignedSection,
      adminNotes: `Approved for ${isMale ? 'Male Campus' : 'Bannat Female Campus'} under Director Muneeb ur Rehman.`,
    });
    setInspectingApp(null);
  };

  const handleAdminReject = (app: AdmissionApplication) => {
    JamiaStore.updateAdmissionStatus(app.id, 'rejected', {
      adminNotes: 'Application does not meet current eligibility criteria.',
    });
    setInspectingApp(null);
  };

  const handleAdminSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminApp) return;
    JamiaStore.editAdmissionApplication(editingAdminApp);
    setEditingAdminApp(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Session 2026-2027 · Jamia Salahuddin Ayubi</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Online Student Admission Form
        </h1>
        <h2 className="font-arabic text-xl sm:text-2xl text-[#b89344] font-bold">
          استمارة تسجيل وقبول الطالب الجديدة
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Please enter candidate details accurately. All personal records are independently processed with strict gender separation for Male and Female campus wings under Director <strong>Muneeb ur Rehman</strong>.
        </p>
      </div>

      {/* Navigation Switcher: Form / Track Application / Management Portal */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl border border-[#e5ece8] shadow-xs max-w-xl mx-auto">
        <button
          onClick={() => setActiveView('form')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeView === 'form'
              ? 'bg-[#176B4D] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          New Admission Form
        </button>

        <button
          onClick={() => setActiveView('track')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeView === 'track'
              ? 'bg-[#176B4D] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Track Application Status
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveView('admin')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              activeView === 'admin'
                ? 'bg-[#b89344] text-white shadow-xs'
                : 'text-[#176B4D] hover:bg-emerald-50'
            }`}
          >
            Admin Applications Desk
          </button>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: SUBMISSION CONFIRMATION SLIP (WHEN SUBMITTED)
         ========================================================================= */}
      {activeView === 'form' && submittedApp && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#176B4D] shadow-2xl space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-[#D6B66C]">
            <JamiaLogo size="lg" />
            <div className="text-center sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Application Received Successfully
              </span>
              <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D] mt-2">
                Official Admission Confirmation
              </h3>
              <span className="text-xs text-slate-500 font-mono block">
                Submitted: {new Date(submittedApp.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Success Notification */}
          <div className="p-5 bg-[#f2f8f5] rounded-2xl border border-[#176B4D]/30 flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-700">
              <strong className="text-sm font-bold text-slate-900 block">
                JazakAllah Khair! Your admission application has been registered.
              </strong>
              <p>
                Your application has been logged into the Jamia educational registry and queued for review by the academic board under Director <strong>Muneeb ur Rehman</strong>.
              </p>
              <p className="font-semibold text-[#176B4D]">
                Please save or print your Application Number for test dates and interview scheduling.
              </p>
            </div>
          </div>

          {/* Key Details Card */}
          <div className="p-6 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Official Application Number
              </span>
              <strong className="text-base font-mono font-extrabold text-[#176B4D]">
                {submittedApp.applicationNumber}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Admission Category
              </span>
              <strong className="text-sm font-bold text-slate-900">
                {submittedApp.admissionCategory === 'female'
                  ? 'Female (بنات - Dedicated Girls Campus)'
                  : 'Male (بنین - Boys Campus)'}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Student Full Name
              </span>
              <strong className="text-sm font-bold text-slate-900">
                {submittedApp.applicantName}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Father&apos;s Name
              </span>
              <span className="text-sm text-slate-800 font-semibold">
                {submittedApp.fatherName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Applying Course
              </span>
              <span className="text-sm text-slate-800 font-semibold">
                {submittedApp.program}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Assigned Preferred Section
              </span>
              <span className="text-sm text-slate-800 font-semibold">
                {submittedApp.preferredSection}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Contact & WhatsApp
              </span>
              <span className="text-xs text-slate-800 font-mono">
                {submittedApp.contactNumber} / {submittedApp.whatsappNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Current Status
              </span>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs">
                Under Administrative Review
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Guardian
              </span>
              <span className="text-xs text-slate-800">
                {submittedApp.guardianName} ({submittedApp.relationship})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D6B66C]" />
              <span>Print Official Application Slip</span>
            </button>

            <button
              onClick={handleStartNewApplication}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D] transition-all cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: THE ONLINE ADMISSION FORM
         ========================================================================= */}
      {activeView === 'form' && !submittedApp && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* -------------------------------------------------------------------
              SECTION 1: ADMISSION CATEGORY (MALE / FEMALE)
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                1
              </span>
              <span>Section 1: Admission Category & Campus Wing</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Select Campus Wing
              </h3>
              <p className="text-xs text-slate-500">
                Jamia Salahuddin Ayubi maintains fully independent, segregated faculties, hostels, and academic halls for male and female students.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('male')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  formData.admissionCategory === 'male'
                    ? 'border-[#176B4D] bg-[#f2f8f5] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    formData.admissionCategory === 'male'
                      ? 'border-[#176B4D] bg-[#176B4D] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {formData.admissionCategory === 'male' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900">Male Admission (بنین)</strong>
                    <span className="text-[11px] font-semibold text-[#176B4D] bg-white px-2 py-0.5 rounded border border-[#176B4D]/20">
                      Boys Campus
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Main institute campus for male scholars, Hifz halaqahs, Dars-e-Nizami, and residential hostels.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('female')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  formData.admissionCategory === 'female'
                    ? 'border-[#176B4D] bg-[#f2f8f5] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    formData.admissionCategory === 'female'
                      ? 'border-[#176B4D] bg-[#176B4D] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {formData.admissionCategory === 'female' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900">Female Admission (بنات)</strong>
                    <span className="text-[11px] font-semibold text-[#b89344] bg-[#fdfaf2] px-2 py-0.5 rounded border border-[#D6B66C]/40">
                      Bannat Girls Wing
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated, secure female campus with female scholars (*Alimat*), private classes, and separate administration.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 2: PERSONAL INFORMATION
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                2
              </span>
              <span>Section 2: Personal Information</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Student Identity & Contact
              </h3>
              <p className="text-xs text-slate-500">
                Please enter the student’s legal name exactly as shown on official documents.
              </p>
            </div>

            {/* Student Photo Upload */}
            <div className="p-4 bg-[#f8faf9] rounded-2xl border border-dashed border-[#176B4D]/30 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-28 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400 space-y-1">
                    <ImageIcon className="w-6 h-6 mx-auto text-slate-300" />
                    <span className="text-[10px] block">Passport Photo</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Student Photograph Upload (Optional at this step)
                </span>
                <p className="text-[11px] text-slate-500">
                  Recent passport-size photo with white or blue background for the smart student ID card.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Upload Photograph</span>
                  </button>

                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photoUrl: '' }))}
                      className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  placeholder="e.g. Muhammad Abdullah"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.applicantName
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.applicantName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.applicantName}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Father&apos;s Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="e.g. Muhammad Tariq Khan"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.fatherName
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.fatherName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.fatherName}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.dob
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.dob && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.dob}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.gender === 'male' ? 'Male (بنین)' : 'Female (بنات)'}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  B-Form / CNIC Number (Optional)
                </label>
                <input
                  type="text"
                  name="bFormCnic"
                  value={formData.bFormCnic}
                  onChange={handleInputChange}
                  placeholder="37405-1234567-1 (if applicable)"
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl font-medium outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.contactNumber
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.contactNumber && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.contactNumber}</span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-[#176B4D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameWhatsapp}
                      onChange={(e) => {
                        setSameWhatsapp(e.target.checked);
                        if (e.target.checked) {
                          setFormData((prev) => ({ ...prev, whatsappNumber: prev.contactNumber }));
                        }
                      }}
                      className="rounded text-[#176B4D]"
                    />
                    <span>Same as contact</span>
                  </label>
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.whatsappNumber
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.whatsappNumber && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.whatsappNumber}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@example.com"
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 3: ADDRESS
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                3
              </span>
              <span>Section 3: Residential Address</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Permanent & Postal Address
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Complete Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House / Mohallah / Street / Sector address"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.address
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.address && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.address}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Lahore / Rawalpindi / Multan"
                    className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                      formErrors.city
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#e5ece8] focus:border-[#176B4D]'
                    }`}
                  />
                  {formErrors.city && (
                    <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Province <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl font-medium outline-none cursor-pointer"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 4: EDUCATIONAL INFORMATION & COURSE SELECTION
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                4
              </span>
              <span>Section 4: Educational History & Applying Course</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Academic Enrollment & Preferred Section
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Previous School / Madrasa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  placeholder="e.g. Govt High School / Madrasa Anwar-ul-Quran"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.previousSchool
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.previousSchool && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.previousSchool}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Previous Education Level <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="previousEducation"
                  value={formData.previousEducation}
                  onChange={handleInputChange}
                  placeholder="e.g. Primary, Middle Pass, Matric (Science), Nazra Quran"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.previousEducation
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.previousEducation && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.previousEducation}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Applying Course <span className="text-rose-500">*</span>
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none cursor-pointer ${
                    formErrors.program
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                >
                  <option value="">-- Select One of 8 Official Courses --</option>
                  {coursesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {formErrors.program && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.program}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Preferred Class / Section <span className="text-rose-500">*</span>
                </label>
                <select
                  name="preferredSection"
                  value={formData.preferredSection}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none cursor-pointer ${
                    formErrors.preferredSection
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                >
                  <option value="">-- Select Tailored Section for {formData.admissionCategory === 'male' ? 'Boys Campus' : 'Bannat Campus'} --</option>
                  {(formData.admissionCategory === 'male' ? MALE_SECTIONS : FEMALE_SECTIONS).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {formErrors.preferredSection && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.preferredSection}</span>
                )}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 5: GUARDIAN INFORMATION
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                5
              </span>
              <span>Section 5: Guardian Information</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Parent / Legal Guardian Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Guardian Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  placeholder="e.g. Muhammad Tariq Khan"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.guardianName
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.guardianName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.guardianName}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Guardian Contact <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="guardianContact"
                  value={formData.guardianContact}
                  onChange={handleInputChange}
                  placeholder="+92 300 9876543"
                  className={`w-full p-3 bg-[#f8faf9] border rounded-xl font-medium outline-none transition-all ${
                    formErrors.guardianContact
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#e5ece8] focus:border-[#176B4D]'
                  }`}
                />
                {formErrors.guardianContact && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.guardianContact}</span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Relationship with Student <span className="text-rose-500">*</span>
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl font-medium outline-none cursor-pointer"
                >
                  {RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 6: ADDITIONAL INFORMATION & DOCUMENT UPLOAD
             ------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece8] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b89344] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-[#fdfaf2] border border-[#D6B66C] flex items-center justify-center text-[#b89344]">
                6
              </span>
              <span>Section 6: Additional Information & Documents</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                Medical Notes & Previous Credentials
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Medical or Other Important Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleInputChange}
                  placeholder="Mention any allergies, chronic conditions, special accommodations, or dietary requirements..."
                  className="w-full p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl font-medium outline-none"
                />
              </div>

              {/* Previous Educational Documents Upload */}
              <div className="p-4 bg-[#f8faf9] rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[11px] block">
                  Previous Educational Documents (Optional)
                </span>
                <p className="text-[11px] text-slate-500">
                  Upload previous school report card, Nazra certificate, or B-Form copy (PDF, JPG, PNG).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <input
                    type="file"
                    ref={docInputRef}
                    accept=".pdf,image/*"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-xl border border-[#176B4D]/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D6B66C]" />
                    <span>Choose Educational Document</span>
                  </button>

                  {formData.documentName && (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium truncate max-w-xs">{formData.documentName}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, documentUrl: '', documentName: '' }))}
                        className="text-rose-500 hover:text-rose-700 ml-1 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Declaration and Submit Button */}
          <div className="p-6 bg-[#fdfaf2] rounded-3xl border border-[#D6B66C] space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#176B4D] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-slate-700">
                <strong className="block text-slate-900 font-bold">
                  Applicant & Guardian Solemn Affirmation
                </strong>
                <p className="leading-relaxed">
                  I solemnly affirm that the information provided above is authentic and complete. I agree to abide by the Islamic code of conduct, moral etiquette (Adab), and institutional discipline established by Jamia Salahuddin Ayubi under Director <strong>Muneeb ur Rehman</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D6B66C]/40">
              <span className="text-[11px] text-slate-500">
                All data is encrypted and stored into institutional database.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                <span>Submit Admission Application</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          VIEW 3: TRACK APPLICATION STATUS
         ========================================================================= */}
      {activeView === 'track' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece8] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Track Your Admission Application
            </h3>
            <p className="text-xs text-slate-500">
              Enter your Application Number (e.g. APP-M-2026-8402 or APP-F-2026-8403) or Contact Number
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={statusQuery}
              onChange={(e) => setStatusQuery(e.target.value)}
              placeholder="Enter Application Number (APP-M-2026-xxxx) or phone"
              className="flex-1 p-3 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl text-xs font-mono outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Search className="w-4 h-4 text-[#D6B66C]" />
              <span>Track</span>
            </button>
          </form>

          {foundStatusApp !== undefined && (
            <div className="pt-4 border-t border-slate-100">
              {foundStatusApp ? (
                <div className="p-6 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Application No.</span>
                      <strong className="text-sm font-mono text-[#176B4D]">{foundStatusApp.applicationNumber}</strong>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        foundStatusApp.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : foundStatusApp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : foundStatusApp.status === 'interview_scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {foundStatusApp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Applicant</span>
                      <strong className="text-slate-900">{foundStatusApp.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Wing</span>
                      <strong className="text-slate-900">
                        {foundStatusApp.admissionCategory === 'female' ? 'Female Bannat Wing' : 'Male Boys Campus'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Course</span>
                      <strong className="text-slate-900">{foundStatusApp.program}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Section</span>
                      <strong className="text-slate-900">{foundStatusApp.preferredSection}</strong>
                    </div>
                  </div>

                  {foundStatusApp.assignedRollNumber && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">Assigned Roll Number</span>
                      <strong className="text-sm font-mono text-emerald-900 font-bold">{foundStatusApp.assignedRollNumber}</strong>
                    </div>
                  )}

                  {foundStatusApp.interviewDate && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-[10px] text-blue-800 uppercase font-bold block">Interview Schedule</span>
                      <span className="text-xs text-blue-900 font-semibold">{new Date(foundStatusApp.interviewDate).toLocaleString()}</span>
                    </div>
                  )}

                  {foundStatusApp.adminNotes && (
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Management Notes</span>
                      <p className="text-slate-700 mt-0.5">{foundStatusApp.adminNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No admission record found matching &quot;{statusQuery}&quot;. Please verify the application number.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: ADMIN MANAGEMENT APPLICATIONS DESK (AUTHORIZED)
         ========================================================================= */}
      {activeView === 'admin' && isAdmin && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#b89344]/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#b89344] tracking-wider block">
                Executive Admissions Directorate · Muneeb ur Rehman
              </span>
              <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                Applications Review & Approval Desk
              </h3>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Total Inbound: {allAdminApps.length} Applications
            </span>
          </div>

          {/* Gender & Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Gender Category Filter */}
            <div className="flex items-center gap-1.5 bg-[#f8faf9] p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Wing:</span>
              <button
                onClick={() => setAdminCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  adminCategoryFilter === 'all'
                    ? 'bg-[#176B4D] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Wings
              </button>
              <button
                onClick={() => setAdminCategoryFilter('male')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  adminCategoryFilter === 'male'
                    ? 'bg-[#176B4D] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Boys Campus (بنین)
              </button>
              <button
                onClick={() => setAdminCategoryFilter('female')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  adminCategoryFilter === 'female'
                    ? 'bg-[#176B4D] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Girls Campus (بنات)
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value as any)}
                className="p-1.5 bg-[#f8faf9] border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table of Applications */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf9] text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">App No</th>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Wing</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Preferred Section</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdminApps.map((app) => {
                  const isMale = (app.admissionCategory || app.gender) === 'male';
                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#176B4D]">
                        {app.applicationNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {app.applicantName}
                        <span className="block text-[11px] text-slate-400 font-normal">S/O {app.fatherName}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isMale ? 'bg-emerald-50 text-[#176B4D]' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isMale ? 'Boys' : 'Girls Bannat'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        {app.program}
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {app.preferredSection}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-600">
                        {app.contactNumber || app.phone}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : app.status === 'interview_scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setInspectingApp(app)}
                          className="px-2.5 py-1 bg-[#176B4D] text-white font-bold rounded-lg hover:bg-[#0f4a35] transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => setEditingAdminApp(app)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredAdminApps.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No applications found for the selected category and status filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Application Inspect & Approve/Reject Modal */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#b89344] tracking-wider block">
                  Admission Review: {inspectingApp.applicationNumber}
                </span>
                <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                  {inspectingApp.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setInspectingApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Father&apos;s Name</span>
                <strong className="text-slate-900">{inspectingApp.fatherName}</strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                <strong className="text-slate-900">{inspectingApp.dob}</strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Wing / Campus</span>
                <strong className="text-slate-900">
                  {inspectingApp.admissionCategory === 'female' ? 'Female Bannat Wing' : 'Male Boys Campus'}
                </strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Applying Course</span>
                <strong className="text-slate-900">{inspectingApp.program}</strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Section</span>
                <strong className="text-slate-900">{inspectingApp.preferredSection}</strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact / WhatsApp</span>
                <strong className="text-slate-900 font-mono">{inspectingApp.contactNumber} / {inspectingApp.whatsappNumber}</strong>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Address</span>
                <span className="text-slate-800">{inspectingApp.address}, {inspectingApp.city}, {inspectingApp.province}</span>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Previous Education & School</span>
                <span className="text-slate-800">{inspectingApp.previousEducation} at {inspectingApp.previousSchool}</span>
              </div>
              {inspectingApp.medicalNotes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 col-span-2">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Medical / Important Notes</span>
                  <span className="text-amber-900">{inspectingApp.medicalNotes}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Current Status: <strong className="uppercase font-bold text-slate-900">{inspectingApp.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                {inspectingApp.status !== 'approved' && (
                  <button
                    onClick={() => handleAdminApprove(inspectingApp)}
                    className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                    <span>Approve & Enroll Student</span>
                  </button>
                )}

                {inspectingApp.status !== 'rejected' && (
                  <button
                    onClick={() => handleAdminReject(inspectingApp)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Reject Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingAdminApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-extrabold text-lg text-[#176B4D]">
                Edit Application: {editingAdminApp.applicationNumber}
              </h3>
              <button
                onClick={() => setEditingAdminApp(null)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Student Name</label>
                <input
                  type="text"
                  value={editingAdminApp.applicantName}
                  onChange={(e) => setEditingAdminApp({ ...editingAdminApp, applicantName: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course</label>
                <select
                  value={editingAdminApp.program}
                  onChange={(e) => setEditingAdminApp({ ...editingAdminApp, program: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none font-medium"
                >
                  {coursesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned / Preferred Section</label>
                <input
                  type="text"
                  value={editingAdminApp.preferredSection}
                  onChange={(e) => setEditingAdminApp({ ...editingAdminApp, preferredSection: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Management Notes</label>
                <textarea
                  rows={2}
                  value={editingAdminApp.adminNotes || ''}
                  onChange={(e) => setEditingAdminApp({ ...editingAdminApp, adminNotes: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAdminApp(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
