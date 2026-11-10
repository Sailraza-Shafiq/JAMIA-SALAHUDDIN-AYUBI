import React, { useState } from 'react';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import { Facility } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Building,
  BookOpen,
  Computer,
  Award,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Sparkles,
  Search,
  Filter,
  Edit3,
  MapPin,
  Users,
  Image,
  Check,
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const settings = JamiaStore.getSettings();
  const allFacilities = JamiaStore.getFacilities();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All 9 Facilities' },
    { id: 'quran', label: 'Quran & Worship' },
    { id: 'academic', label: 'Academic & Library' },
    { id: 'student_life', label: 'Living & Dining' },
  ];

  const filteredFacilities = allFacilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.arabicName.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());

    let matchesTab = true;
    if (selectedFilter === 'quran') {
      matchesTab = ['Quran learning environment', 'Prayer facilities', 'Wudu facilities'].includes(f.name);
    } else if (selectedFilter === 'academic') {
      matchesTab = ['Classrooms', 'Library', 'Study environment', 'Educational resources'].includes(f.name);
    } else if (selectedFilter === 'student_life') {
      matchesTab = ['Student accommodation', 'Dining facilities'].includes(f.name);
    }

    return matchesSearch && matchesTab;
  });

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacility) return;
    JamiaStore.updateFacility(editingFacility);
    setSaveSuccess(true);
    setEditingFacility(null);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8f5] border border-[#176B4D]/30 text-xs font-bold text-[#176B4D] uppercase tracking-wider">
          <Building className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Campus Infrastructure · Jamia Salahuddin Ayubi</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#176B4D]">
          Educational & Campus Facilities
        </h1>
        <h2 className="font-arabic text-xl sm:text-2xl text-[#b89344] font-bold">
          المرافق التعليمية والخدمية المعتمدة
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore our fully operational educational, spiritual, and residential facilities verified under the leadership of Director <strong>{settings.directorName}</strong>.
        </p>
      </div>

      {/* Official Management Verification Directive */}
      <div className="bg-[#fdfaf2] rounded-3xl p-6 sm:p-7 border border-[#D6B66C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-[#176B4D] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
            <h3 className="font-serif-heading font-bold text-sm sm:text-base text-slate-900">
              Verified Physical Infrastructure Guarantee
            </h3>
            <p>
              Jamia Salahuddin Ayubi holds an unyielding commitment to truthfulness (*Sidq*). Every facility showcased on this page represents active, verified physical infrastructure on campus. Authorized management maintains full authority to update photographic records, capacity figures, and publish newly commissioned facilities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="text-right hidden sm:block text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Inspected & Verified By</span>
            <strong className="text-[#176B4D]">{settings.directorName}</strong>
          </div>

          <Link
            to="/contact"
            className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Schedule Campus Tour</span>
          </Link>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Facility details and verified status successfully updated in management registry.</span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facilities by name, location, equipment..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] rounded-xl text-xs font-medium outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'bg-[#f8faf9] text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Cards Grid for All 9 Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#e5ece8] hover:border-[#176B4D]/50 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Container with Fallback */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  onError={(e) => {
                    // Graceful fallback if any local path fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Fallback pattern underneath in case of failure */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#176B4D]/20 to-[#f2f8f5] flex items-center justify-center p-4">
                  <Building className="w-12 h-12 text-[#176B4D]/40" />
                </div>

                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#176B4D]/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {fac.category}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4a35] bg-[#D6B66C] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#0f4a35]" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Location / Capacity Bar on bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                  {fac.location && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-100">
                      <MapPin className="w-3.5 h-3.5 text-[#D6B66C]" />
                      <span className="truncate max-w-[180px]">{fac.location}</span>
                    </div>
                  )}
                  {fac.capacity && (
                    <div className="text-[11px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {fac.capacity}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-slate-900 leading-snug group-hover:text-[#176B4D] transition-colors">
                    {fac.name}
                  </h3>
                  <span className="font-arabic text-sm text-[#176B4D] font-bold block mt-0.5">
                    {fac.arabicName}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {fac.description}
                </p>

                {/* Specifications & Equipment */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Verified Infrastructure Highlights:
                  </span>
                  <ul className="space-y-1.5">
                    {fac.detailedSpecs.slice(0, 3).map((spec, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Status: <strong className="text-emerald-700 font-bold uppercase">Operational</strong>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setEditingFacility(fac)}
                      className="p-2 text-xs font-semibold text-[#176B4D] bg-[#f2f8f5] hover:bg-[#e5ece8] rounded-xl border border-[#176B4D]/20 transition-all cursor-pointer"
                      title="Edit facility details as Management"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <Link
                    to="/contact"
                    className="px-3.5 py-1.5 bg-[#f2f8f5] hover:bg-[#176B4D] text-[#176B4D] hover:text-white font-bold text-xs rounded-xl border border-[#176B4D]/20 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3 text-[#D6B66C]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Facility Edit Modal */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#176B4D] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider block">
                  Management Facility Verification
                </span>
                <h3 className="font-serif-heading font-extrabold text-xl text-[#176B4D]">
                  Update Facility: {editingFacility.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingFacility(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Facility Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFacility.name}
                    onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Arabic / Urdu Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFacility.arabicName}
                    onChange={(e) => setEditingFacility({ ...editingFacility, arabicName: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none font-arabic"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Image Path / Replaceable Photo URL
                </label>
                <input
                  type="text"
                  required
                  value={editingFacility.imageUrl}
                  onChange={(e) => setEditingFacility({ ...editingFacility, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-mono text-[11px] focus:border-[#176B4D] outline-none"
                  placeholder="/src/assets/images/... or custom verified image URL"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Campus Location / Block
                  </label>
                  <input
                    type="text"
                    value={editingFacility.location || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, location: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    placeholder="e.g. Ground Floor, Central Academic Wing"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Verified Capacity / Workstations
                  </label>
                  <input
                    type="text"
                    value={editingFacility.capacity || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, capacity: e.target.value })}
                    className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                    placeholder="e.g. 200+ Hifz Students / 45 Stations"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Detailed Operational Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingFacility.description}
                  onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                  className="w-full p-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                  <span>Publish Verified Facility</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
