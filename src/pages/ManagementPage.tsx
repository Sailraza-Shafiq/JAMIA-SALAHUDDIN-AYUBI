import React, { useState, useEffect } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { InstituteSettings, LeadershipMember } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Clock,
  MapPin,
  Edit3,
  Plus,
  Trash2,
  Award,
  Sparkles,
  Save,
  Lock,
  User,
  Upload,
} from 'lucide-react';

export const ManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<InstituteSettings>(() => JamiaStore.getSettings());

  // Edit Management Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    directorName: settings.directorName,
    directorTitle: settings.directorTitle,
    directorBio: settings.directorBio || 'Visionary educationist and founder dedicated to cultivating holistic Islamic scholarship, Quranic memorization, and modern educational proficiencies under the direct auspices of Jamia Salahuddin Ayubi.',
    directorVision: settings.directorVision || 'To establish an exemplary Islamic education ecosystem combining classical scholarly traditions with modern digital excellence, empowering righteous leaders for the Ummah.',
    directorPhone: settings.directorPhone || settings.contactPhone,
    directorEmail: settings.directorEmail || settings.contactEmail,
    officeHours: settings.officeHours || 'Monday – Saturday: 9:00 AM – 2:00 PM',
    directorPhotoUrl: settings.directorPhotoUrl || '',
    address: settings.address,
  });

  // Additional Leadership Members (Admin Configurable)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<Omit<LeadershipMember, 'id'>>({
    name: '',
    urduName: '',
    title: '',
    role: '',
    contact: '',
    bio: '',
    photoUrl: '',
  });

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setSettings(JamiaStore.getSettings());
    });
    return unsub;
  }, []);

  const handleSaveManagement = (e: React.FormEvent) => {
    e.preventDefault();
    JamiaStore.updateSettings({
      directorName: editForm.directorName,
      directorTitle: editForm.directorTitle,
      directorBio: editForm.directorBio,
      directorVision: editForm.directorVision,
      directorPhone: editForm.directorPhone,
      directorEmail: editForm.directorEmail,
      officeHours: editForm.officeHours,
      directorPhotoUrl: editForm.directorPhotoUrl,
      address: editForm.address,
    });
    setShowEditModal(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.title.trim()) return;

    const currentMembers = settings.leadershipMembers || [];
    const newMember: LeadershipMember = {
      ...newMemberForm,
      id: 'ldr-' + Date.now(),
    };

    JamiaStore.updateSettings({
      leadershipMembers: [...currentMembers, newMember],
    });

    setNewMemberForm({
      name: '',
      urduName: '',
      title: '',
      role: '',
      contact: '',
      bio: '',
      photoUrl: '',
    });

    setShowAddMemberModal(false);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this verified leadership member?')) {
      const currentMembers = settings.leadershipMembers || [];
      JamiaStore.updateSettings({
        leadershipMembers: currentMembers.filter((m) => m.id !== id),
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Institutional Governance & Leadership · Jamia Salahuddin Ayubi</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Institute Management
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Official management and institutional oversight under the leadership of{' '}
          <strong className="text-slate-900">{settings.directorName}</strong>.
        </p>
      </div>

      {/* Primary Executive Management Card: Muneeb ur Rehman */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-[#176B4D] shadow-xl relative overflow-hidden">
        {/* Top Gold Corner Accents */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#176B4D] via-[#D6B66C] to-[#176B4D]" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
          {/* Executive Insignia & Photo Column */}
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-48 h-56 rounded-3xl overflow-hidden border-4 border-[#D6B66C] shadow-lg p-1 bg-white relative group">
              {settings.directorPhotoUrl ? (
                <img
                  src={settings.directorPhotoUrl}
                  alt={settings.directorName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#f2f8f5] to-white flex flex-col items-center justify-center p-4 border border-[#176B4D]/20 text-center">
                  <JamiaLogo size={70} showText={false} />
                  <span className="font-serif-heading text-[11px] font-extrabold text-[#176B4D] uppercase tracking-wider mt-2.5">
                    Muneeb ur Rehman
                  </span>
                  <span className="font-arabic text-xs text-[#b89344] font-bold mt-0.5">
                    بانی ومدیر اعلیٰ
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Official Seal</span>
                </div>
              )}

              <div className="absolute bottom-2.5 right-2.5 bg-[#176B4D] text-[#D6B66C] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#D6B66C] shadow-xs">
                Official Profile
              </div>
            </div>

            {/* Quick Upload Action for Muneeb ur Rehman Photo */}
            <label className="text-[11px] font-semibold text-[#176B4D] hover:underline cursor-pointer flex items-center gap-1.5 bg-[#f2f8f5] px-3 py-1.5 rounded-lg border border-[#176B4D]/20">
              <Upload className="w-3.5 h-3.5 text-[#b89344]" />
              <span>Upload Original Photograph</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    JamiaStore.updateSettings({ directorPhotoUrl: result });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>

            <div>
              <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
                Muneeb ur Rehman
              </h2>
              <span className="text-xs font-bold text-[#b89344] block mt-0.5 uppercase tracking-wide">
                Founder & Director General
              </span>
              <span className="font-arabic text-sm text-slate-500 font-bold block mt-1">
                بانی ومدیر اعلیٰ: منیب الرحمن
              </span>
            </div>

            {/* Quick Contact Box */}
            <div className="w-full bg-[#f8faf9] p-3.5 rounded-2xl border border-[#e5ece8] text-xs space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />
                <span className="truncate">{settings.directorEmail || settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />
                <span>{settings.directorPhone || settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />
                <span className="text-[11px]">{settings.officeHours || 'Mon – Sat: 9 AM – 2 PM'}</span>
              </div>
            </div>

            {/* Admin Edit Trigger */}
            <button
              onClick={() => {
                setEditForm({
                  directorName: settings.directorName,
                  directorTitle: settings.directorTitle,
                  directorBio: settings.directorBio || '',
                  directorVision: settings.directorVision || '',
                  directorPhone: settings.directorPhone || settings.contactPhone,
                  directorEmail: settings.directorEmail || settings.contactEmail,
                  officeHours: settings.officeHours || 'Monday – Saturday: 9:00 AM – 2:00 PM',
                  directorPhotoUrl: settings.directorPhotoUrl || '',
                  address: settings.address,
                });
                setShowEditModal(true);
              }}
              className="w-full py-2 px-4 bg-[#fdfaf2] hover:bg-[#faeecf] text-[#176B4D] font-bold text-xs rounded-xl border border-[#D6B66C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b89344]" />
              <span>Edit Leadership Profile</span>
            </button>
          </div>

          {/* Vision & Executive Mandate Details */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                Executive Leadership & Institutional Mandate
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-slate-900 leading-tight">
                Direction, Stewardship & Academic Philosophy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {settings.directorBio ||
                  'Visionary educationist and founder dedicated to cultivating holistic Islamic scholarship, Quranic memorization, and modern educational proficiencies under the direct auspices of Jamia Salahuddin Ayubi.'}
              </p>
            </div>

            {/* Core Mission & Vision */}
            <div className="bg-[#f2f8f5] p-5 sm:p-6 rounded-2xl border border-[#176B4D]/30 space-y-3">
              <div className="flex items-center gap-2 font-bold text-[#176B4D] text-sm">
                <Award className="w-4 h-4 text-[#D6B66C]" />
                <span>Foundational Educational Vision</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;{settings.directorVision ||
                  'To establish an exemplary Islamic education ecosystem combining classical scholarly traditions with modern digital excellence, empowering righteous leaders for the Ummah.'}&rdquo;
              </p>
            </div>

            {/* Administrative Governance Areas */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Key Governance & Management Responsibilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#e5ece8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#176B4D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
                    <span>Curricular Oversight</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Direct supervision of Dars-e-Nizami, Hifz-ul-Quran, and Tajweed syllabi compliance.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e5ece8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#176B4D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
                    <span>Student Admissions & Welfare</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Ensuring equitable admissions, hostel facilities, and separate male/female wings.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e5ece8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#176B4D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
                    <span>Faculty Appointments</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Recruitment of certified Asatiza, Huffaz, and modern IT faculty members.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e5ece8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#176B4D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
                    <span>Institutional Verification</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Official signature and digital seal authorization on all diplomas, Sanads, and ID cards.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>{settings.address}</span>
              </span>
              <span className="font-semibold text-[#176B4D]">Jamia Secretariat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Leadership / Council Section (Configurable by Admin, Zero Invented Data) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#176B4D]">
              Institutional Leadership & Appointments
            </h3>
            <p className="text-xs text-slate-500">
              Verified council appointments authorized under Director Muneeb ur Rehman.
            </p>
          </div>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#D6B66C]" />
            <span>Add Verified Leadership Member</span>
          </button>
        </div>

        {/* Members Grid */}
        {settings.leadershipMembers && settings.leadershipMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.leadershipMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs hover:border-[#176B4D] transition-all space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#D6B66C]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#f2f8f5] border border-[#176B4D]/30 flex items-center justify-center text-[#176B4D] font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                      {member.urduName && (
                        <span className="font-arabic text-xs font-bold text-[#176B4D] block">
                          {member.urduName}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#b89344] block">{member.title}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500 text-[10.5px]">Administrative Role:</div>
                  <strong className="text-slate-800 block">{member.role}</strong>
                  {member.bio && (
                    <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">{member.bio}</p>
                  )}
                  {member.contact && (
                    <div className="text-[10px] text-[#176B4D] pt-1 font-semibold">{member.contact}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-[#e5ece8] text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Executive Management Structure</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Jamia Salahuddin Ayubi operates under the executive directorship of <strong>{settings.directorName}</strong>. Additional faculty members, department heads, and academic council appointments can be configured dynamically by authorized management.
            </p>
          </div>
        )}
      </div>

      {/* EDIT MANAGEMENT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-bold text-lg text-[#176B4D]">
                Edit Management & Leadership Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManagement} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Director / Management Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.directorName}
                  onChange={(e) => setEditForm({ ...editForm, directorName: e.target.value })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Leadership Title</label>
                <input
                  type="text"
                  value={editForm.directorTitle}
                  onChange={(e) => setEditForm({ ...editForm, directorTitle: e.target.value })}
                  placeholder="Founder & Director General"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Photograph URL (Optional)</label>
                <input
                  type="url"
                  value={editForm.directorPhotoUrl}
                  onChange={(e) => setEditForm({ ...editForm, directorPhotoUrl: e.target.value })}
                  placeholder="https://... or leave blank for official Jamia emblem"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Biography</label>
                <textarea
                  rows={3}
                  value={editForm.directorBio}
                  onChange={(e) => setEditForm({ ...editForm, directorBio: e.target.value })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Educational Vision</label>
                <textarea
                  rows={2}
                  value={editForm.directorVision}
                  onChange={(e) => setEditForm({ ...editForm, directorVision: e.target.value })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editForm.directorEmail}
                    onChange={(e) => setEditForm({ ...editForm, directorEmail: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.directorPhone}
                    onChange={(e) => setEditForm({ ...editForm, directorPhone: e.target.value })}
                    className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Office Hours</label>
                <input
                  type="text"
                  value={editForm.officeHours}
                  onChange={(e) => setEditForm({ ...editForm, officeHours: e.target.value })}
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Leadership Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LEADERSHIP MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-[#176B4D] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-heading font-bold text-base text-[#176B4D]">
                Add Verified Leadership Member
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="e.g. Maulana Abdul Qayyum"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Urdu Name</label>
                <input
                  type="text"
                  dir="rtl"
                  value={newMemberForm.urduName}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, urduName: e.target.value })}
                  placeholder="اردو نام"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-arabic text-sm outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Title *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.title}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, title: e.target.value })}
                  placeholder="e.g. Dean of Hadith / Head of Dar-ul-Ifta"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Role *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.role}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                  placeholder="e.g. Academic Council Member & Faculty Oversight"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact / Details (Optional)</label>
                <input
                  type="text"
                  value={newMemberForm.contact}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, contact: e.target.value })}
                  placeholder="Phone, email or office"
                  className="w-full p-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B4D] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
