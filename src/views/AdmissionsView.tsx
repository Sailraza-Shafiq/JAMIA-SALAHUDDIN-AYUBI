import React, { useState } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import { AdmissionApplication, BloodGroup } from '../types';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  AlertCircle,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AdmissionsViewProps {
  onNavigateToIdCard?: (rollNo: string) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({ onNavigateToIdCard }) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'status'>('apply');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    urduName: '',
    fatherName: '',
    fatherCnic: '',
    applicantCnicOrBForm: '',
    dob: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    guardianPhone: '',
    email: '',
    address: '',
    city: '',
    program: 'Dars-e-Nizami',
    boardingRequired: true,
    previousEducation: '',
    previousInstitute: '',
    hafiz: false,
    bloodGroup: 'B+' as BloodGroup,
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  });

  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  // Status Search State
  const [statusQuery, setStatusQuery] = useState('');
  const [foundStatusApp, setFoundStatusApp] = useState<AdmissionApplication | null | undefined>(undefined);

  const programsList = [
    'Dars-e-Nizami (Alimiyyah 8 Years)',
    'Hifz-ul-Quran with Tajweed',
    'Tajweed & Qirat-e-Saba (Classical Recitation)',
    'Takhassus fi al-Fiqh wal-Ifta (Post-Graduate)',
    'Modern IT, Computer & English Diploma',
    'Dars-e-Nizami (Dedicated Bannat Wing)',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.fatherName || !formData.guardianPhone) {
      alert('Please fill in required fields (Name, Father Name, Phone).');
      return;
    }

    const application = JamiaStore.submitAdmission({
      applicantName: formData.applicantName,
      urduName: formData.urduName,
      fatherName: formData.fatherName,
      fatherCnic: formData.fatherCnic || '37405-XXXXXXX-X',
      applicantCnicOrBForm: formData.applicantCnicOrBForm || '37405-XXXXXXX-X',
      dob: formData.dob || '2006-01-01',
      gender: formData.gender,
      phone: formData.phone || formData.guardianPhone,
      guardianPhone: formData.guardianPhone,
      email: formData.email || `${formData.applicantName.toLowerCase().replace(/\s+/g, '')}@student.jsa`,
      address: formData.address || 'Academic Street, Islamabad',
      city: formData.city || 'Islamabad',
      program: formData.program,
      boardingRequired: formData.boardingRequired,
      previousEducation: formData.previousEducation || 'Middle / Matriculation',
      previousInstitute: formData.previousInstitute,
      hafiz: formData.hafiz,
      bloodGroup: formData.bloodGroup,
      photoUrl: formData.photoUrl,
    });

    setSubmittedApp(application);
  };

  const handleSearchStatus = () => {
    if (!statusQuery.trim()) return;
    const all = JamiaStore.getAdmissions();
    const query = statusQuery.trim().toUpperCase();
    const found = all.find(
      (a) =>
        a.applicationNumber.toUpperCase() === query ||
        (a.applicantCnicOrBForm && a.applicantCnicOrBForm.toUpperCase() === query) ||
        (a.bFormCnic && a.bFormCnic.toUpperCase() === query) ||
        a.applicantName.toUpperCase().includes(query)
    );
    setFoundStatusApp(found || null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
          Jamia Salahuddin Ayubi · Admissions Secretariat
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
          Student Admission Portal 2026-2027
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Online registration for Dars-e-Nizami, Hifz-ul-Quran, Qirat, and specialized faculties
        </p>

        {/* Tab Toggle */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex p-1 bg-white border border-[#e5ece8] rounded-xl shadow-xs">
            <button
              onClick={() => {
                setActiveTab('apply');
                setSubmittedApp(null);
              }}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'apply'
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Apply for Admission
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Application Status
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: APPLY FOR ADMISSION */}
      {activeTab === 'apply' && (
        <>
          {submittedApp ? (
            /* SUCCESS SUBMISSION & PRINTABLE SLIP */
            <div className="bg-white rounded-3xl p-8 border-2 border-[#176B4D] shadow-xl max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  Your admission file has been registered in the Jamia Salahuddin Ayubi admissions queue.
                </p>
              </div>

              {/* Printable Application Slip */}
              <div className="p-6 bg-[#f8faf9] rounded-2xl border border-[#D6B66C]/60 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <JamiaLogo size={36} />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Application Ref:</span>
                    <strong className="text-sm font-mono text-[#176B4D]">{submittedApp.applicationNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Applicant Name:</span>
                    <strong className="text-slate-900">{submittedApp.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Father Name:</span>
                    <strong className="text-slate-900">{submittedApp.fatherName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Program Selected:</span>
                    <strong className="text-[#176B4D]">{submittedApp.program}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Boarding Status:</span>
                    <strong className="text-slate-900">
                      {submittedApp.boardingRequired ? 'Hostel Boarder' : 'Day Scholar'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Guardian Phone:</span>
                    <span className="text-slate-900">{submittedApp.guardianPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Date Submitted:</span>
                    <span className="text-slate-900">{new Date(submittedApp.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <strong>Important Next Steps:</strong>
                  <p>1. Please print this receipt and bring it on the entrance assessment date.</p>
                  <p>2. Keep your application reference <strong>{submittedApp.applicationNumber}</strong> saved to track your admission review.</p>
                  <p>3. Upon approval by Director Muneeb ur Rehman, your official Digital Student ID Card will be automatically issued.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-[#D6B66C]" />
                  <span>Print Admission Slip</span>
                </button>

                <button
                  onClick={() => {
                    setSubmittedApp(null);
                    setStep(1);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* MULTI-STEP ADMISSION FORM */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece8] shadow-md">
              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[
                  { num: 1, label: 'Applicant Details' },
                  { num: 2, label: 'Program & Academics' },
                  { num: 3, label: 'Review & Submit' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(s.num as any)}
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        step === s.num
                          ? 'bg-[#176B4D] text-white ring-4 ring-[#176B4D]/20'
                          : step > s.num
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {s.num}
                    </button>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700">
                      {s.label}
                    </span>
                    {s.num < 3 && <div className="w-8 h-[2px] bg-slate-200 hidden sm:block" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* STEP 1: PERSONAL DETAILS */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h3 className="font-serif-heading font-bold text-lg text-[#176B4D] pb-2 border-b border-slate-100">
                      Step 1: Personal & Guardian Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Full Name (English) *
                        </label>
                        <input
                          type="text"
                          name="applicantName"
                          required
                          value={formData.applicantName}
                          onChange={handleInputChange}
                          placeholder="e.g. Muhammad Bilal"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Full Name in Urdu (optional)
                        </label>
                        <input
                          type="text"
                          name="urduName"
                          value={formData.urduName}
                          onChange={handleInputChange}
                          placeholder="مثلاً: محمد بلال"
                          dir="rtl"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-arabic font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Father / Guardian Name *
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          required
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder="e.g. Abdul Ghaffar"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Applicant B-Form / CNIC
                        </label>
                        <input
                          type="text"
                          name="applicantCnicOrBForm"
                          value={formData.applicantCnicOrBForm}
                          onChange={handleInputChange}
                          placeholder="37405-XXXXXXX-X"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Gender & Wing
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        >
                          <option value="male">Male (Boys Main Campus)</option>
                          <option value="female">Female (Dedicated Bannat Wing)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Guardian WhatsApp / Mobile *
                        </label>
                        <input
                          type="text"
                          name="guardianPhone"
                          required
                          value={formData.guardianPhone}
                          onChange={handleInputChange}
                          placeholder="+92 300 1234567"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          City of Residence
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Islamabad / Rawalpindi / Lahore etc."
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Permanent Postal Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House, Street, Area"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.applicantName || !formData.fatherName || !formData.guardianPhone) {
                            alert('Please fill the required fields before continuing.');
                            return;
                          }
                          setStep(2);
                        }}
                        className="px-6 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
                      >
                        <span>Next: Academic Selection</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PROGRAM & ACADEMICS */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="font-serif-heading font-bold text-lg text-[#176B4D] pb-2 border-b border-slate-100">
                      Step 2: Program & Educational Background
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Choose Desired Program *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {programsList.map((prog) => (
                          <label
                            key={prog}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              formData.program === prog
                                ? 'bg-[#f2f8f5] border-[#176B4D] text-[#176B4D] ring-1 ring-[#176B4D]'
                                : 'bg-[#f8faf9] border-[#e5ece8] text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="program"
                              value={prog}
                              checked={formData.program === prog}
                              onChange={handleInputChange}
                              className="accent-[#176B4D]"
                            />
                            <span className="text-xs font-semibold">{prog}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Previous Academic Qualification
                        </label>
                        <input
                          type="text"
                          name="previousEducation"
                          value={formData.previousEducation}
                          onChange={handleInputChange}
                          placeholder="e.g. Middle / Matric / F.Sc / Nazra Quran"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Previous Institute / Madrassa Name
                        </label>
                        <input
                          type="text"
                          name="previousInstitute"
                          value={formData.previousInstitute}
                          onChange={handleInputChange}
                          placeholder="Name of school or madrassa"
                          className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Checkboxes: Boarding & Hifz */}
                    <div className="p-4 bg-[#f8faf9] rounded-xl border border-[#e5ece8] space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="boardingRequired"
                          checked={formData.boardingRequired}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#176B4D] rounded"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">
                            Hostel Boarding & Food Mess Required
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            Furnished student rooms with study desks and nutritious daily meals.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hafiz"
                          checked={formData.hafiz}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#176B4D] rounded"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">
                            Candidate is already a Hafiz-ul-Quran (حفظ قرآن)
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            Qualifies candidate for special scholarship consideration in Dars-e-Nizami.
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
                      >
                        <span>Next: Review & Confirm</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW & CONFIRM */}
                {step === 3 && (
                  <div className="space-y-5">
                    <h3 className="font-serif-heading font-bold text-lg text-[#176B4D] pb-2 border-b border-slate-100">
                      Step 3: Review Application & Declaration
                    </h3>

                    {/* Summary Card */}
                    <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Applicant Name:</span>
                          <strong className="text-slate-900 text-sm">{formData.applicantName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Father Name:</span>
                          <strong className="text-slate-900 text-sm">{formData.fatherName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Program:</span>
                          <strong className="text-[#176B4D]">{formData.program}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Hostel Boarding:</span>
                          <span className="text-slate-800 font-semibold">
                            {formData.boardingRequired ? 'Requested' : 'Day Scholar'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Guardian Contact:</span>
                          <span className="text-slate-800 font-semibold">{formData.guardianPhone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Blood Group:</span>
                          <span className="text-slate-800 font-semibold">{formData.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <h4 className="font-bold flex items-center gap-1.5 text-[#176B4D]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Applicant & Guardian Declaration</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed">
                        I hereby affirm that all information provided in this admission application is accurate. I agree to abide by the disciplinary rules, Islamic code of conduct, and academic guidelines established by Jamia Salahuddin Ayubi under the management of Muneeb ur Rehman.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                        <span>Confirm & Submit Application</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </>
      )}

      {/* TAB 2: TRACK APPLICATION STATUS */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece8] shadow-md max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif-heading font-bold text-xl text-[#176B4D]">
              Track Your Admission Application
            </h3>
            <p className="text-xs text-slate-500">
              Enter your Application Number (e.g. APP-2026-8401) or Applicant Name
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={statusQuery}
                onChange={(e) => setStatusQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchStatus()}
                placeholder="e.g. APP-2026-8401 or APP-2026-8402"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl text-xs font-medium"
              />
            </div>
            <button
              onClick={handleSearchStatus}
              className="px-5 py-2.5 bg-[#176B4D] text-white font-bold text-xs rounded-xl hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
            >
              Track Now
            </button>
          </div>

          {/* Quick status samples */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Try Sample:</span>
            {['APP-2026-8401', 'APP-2026-8402', 'APP-2026-8403'].map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setStatusQuery(sample);
                  setTimeout(() => {
                    const all = JamiaStore.getAdmissions();
                    const found = all.find((a) => a.applicationNumber === sample);
                    setFoundStatusApp(found || null);
                  }, 50);
                }}
                className="text-[#176B4D] hover:underline font-mono text-[11px] bg-[#f2f8f5] px-2 py-0.5 rounded cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Result view */}
          {foundStatusApp !== undefined && (
            <div className="pt-4 border-t border-slate-100">
              {foundStatusApp ? (
                <div className="p-5 bg-[#f8faf9] rounded-2xl border border-[#e5ece8] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Application Ref</span>
                      <strong className="text-sm font-mono text-[#176B4D]">{foundStatusApp.applicationNumber}</strong>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {foundStatusApp.status === 'approved' && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Approved & Enrolled</span>
                        </span>
                      )}
                      {foundStatusApp.status === 'pending' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {foundStatusApp.status === 'interview_scheduled' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>Interview Scheduled</span>
                        </span>
                      )}
                      {foundStatusApp.status === 'rejected' && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                          Not Admitted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Applicant Name:</span>
                      <strong className="text-slate-900">{foundStatusApp.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Father Name:</span>
                      <strong className="text-slate-900">{foundStatusApp.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Program:</span>
                      <strong className="text-[#176B4D]">{foundStatusApp.program}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">City:</span>
                      <span className="text-slate-800">{foundStatusApp.city}</span>
                    </div>
                  </div>

                  {foundStatusApp.assignedRollNumber && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-800 font-semibold block">Official Assigned Roll No:</span>
                        <strong className="text-sm font-mono text-[#176B4D]">{foundStatusApp.assignedRollNumber}</strong>
                      </div>
                      {onNavigateToIdCard && (
                        <button
                          onClick={() => onNavigateToIdCard(foundStatusApp.assignedRollNumber!)}
                          className="px-3.5 py-1.5 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#0f4a35] transition-all cursor-pointer shadow-xs"
                        >
                          View ID Card
                        </button>
                      )}
                    </div>
                  )}

                  {foundStatusApp.adminNotes && (
                    <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
                      <span className="font-semibold block text-[11px] text-slate-500">Admissions Office Notes:</span>
                      <p>{foundStatusApp.adminNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center text-xs text-rose-800">
                  No application found matching &quot;{statusQuery}&quot;. Please verify the reference number.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
