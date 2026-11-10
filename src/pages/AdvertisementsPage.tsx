import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore, subscribeToStore } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { PromotionalMediaItem, AdvertisementPlan, MediaItemType } from '../types';
import {
  Megaphone,
  Video,
  Play,
  Upload,
  Plus,
  Edit,
  Trash2,
  Film,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  Download,
  Filter,
  Eye,
  Clock,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  X,
  Volume2,
  Languages,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Info,
} from 'lucide-react';

export const AdvertisementsPage: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const settings = JamiaStore.getSettings();

  const [activeTab, setActiveTab] = useState<'gallery' | 'planning' | 'campaigns'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mediaItems, setMediaItems] = useState<PromotionalMediaItem[]>([]);
  const [adPlans, setAdPlans] = useState<AdvertisementPlan[]>([]);
  const [courses, setCourses] = useState(JamiaStore.getCourses());

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState<PromotionalMediaItem | null>(null);

  // Upload Media Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<PromotionalMediaItem | null>(null);
  const [mediaFormData, setMediaFormData] = useState({
    title: '',
    urduTitle: '',
    type: 'video' as MediaItemType,
    category: 'course_promo' as PromotionalMediaItem['category'],
    url: '',
    thumbnailUrl: '',
    duration: '01:30',
    description: '',
    courseName: '',
    tags: 'Admissions, Jamia, Promo',
    consentObtained: true,
    aspectRatio: '16:9' as '16:9' | '9:16' | '1:1',
  });

  // Advertisement Plan Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdvertisementPlan | null>(null);
  const [planFormData, setPlanFormData] = useState({
    title: '',
    coursePromoted: 'Hifz-ul-Quran',
    targetAudience: 'Parents & Students',
    videoDescription: '',
    scriptUrdu: '',
    scriptEnglish: '',
    voiceoverText: '',
    captionText: '',
    thumbnailUrl: '',
    videoUrl: '',
    status: 'draft' as AdvertisementPlan['status'],
  });

  // UI helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Subscribe to storage
  useEffect(() => {
    const refreshData = () => {
      setMediaItems(JamiaStore.getPromotionalMedia());
      setAdPlans(JamiaStore.getAdvertisementPlans());
      setCourses(JamiaStore.getCourses());
    };
    refreshData();
    const unsubscribe = subscribeToStore(refreshData);
    return unsubscribe;
  }, []);

  // Filtered media
  const filteredMedia = mediaItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'video') return item.type === 'video' || item.type === 'footage';
    if (selectedCategory === 'footage') return item.type === 'footage';
    if (selectedCategory === 'course_promo') return item.category === 'course_promo';
    if (selectedCategory === 'logo_banner') return item.type === 'logo' || item.type === 'banner';
    return item.category === selectedCategory;
  });

  // Handle safe file upload validation
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'url' | 'thumbnailUrl' | 'videoUrl',
    allowedTypes: 'video' | 'image'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate size (max 40MB for video, 5MB for image)
    const maxBytes = allowedTypes === 'video' ? 40 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File is too large. Maximum size for ${allowedTypes} is ${allowedTypes === 'video' ? '40MB' : '5MB'}.`);
      return;
    }

    // Validate MIME types
    const validVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const validImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const validMimes = allowedTypes === 'video' ? validVideoMimes : validImageMimes;

    if (!validMimes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|jpg|jpeg|png|webp|svg)$/i)) {
      setUploadError(`Invalid file format. Please upload valid ${allowedTypes} file (${validMimes.join(', ')}).`);
      return;
    }

    // Convert file to local object URL or Base64 for safe client-side preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (showUploadModal) {
        setMediaFormData((prev) => ({ ...prev, [targetField]: result }));
      } else if (showPlanModal) {
        setPlanFormData((prev) => ({ ...prev, [targetField]: result }));
      }
      setUploadSuccess(`Uploaded ${file.name} successfully.`);
      setTimeout(() => setUploadSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Submit Media Item
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFormData.title.trim() || !mediaFormData.url.trim()) {
      setUploadError('Title and Media URL/File are required.');
      return;
    }

    const tagsArray = mediaFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingMedia) {
      JamiaStore.updatePromotionalMedia(editingMedia.id, {
        title: mediaFormData.title,
        urduTitle: mediaFormData.urduTitle,
        type: mediaFormData.type,
        category: mediaFormData.category,
        url: mediaFormData.url,
        thumbnailUrl: mediaFormData.thumbnailUrl || mediaFormData.url,
        duration: mediaFormData.duration,
        description: mediaFormData.description,
        courseName: mediaFormData.courseName,
        tags: tagsArray,
        consentObtained: mediaFormData.consentObtained,
        aspectRatio: mediaFormData.aspectRatio,
      });
    } else {
      JamiaStore.addPromotionalMedia({
        title: mediaFormData.title,
        urduTitle: mediaFormData.urduTitle,
        type: mediaFormData.type,
        category: mediaFormData.category,
        url: mediaFormData.url,
        thumbnailUrl: mediaFormData.thumbnailUrl || mediaFormData.url,
        duration: mediaFormData.duration,
        description: mediaFormData.description,
        courseName: mediaFormData.courseName,
        author: currentUser?.name || 'Muneeb ur Rehman (Director)',
        tags: tagsArray,
        consentObtained: mediaFormData.consentObtained,
        aspectRatio: mediaFormData.aspectRatio,
      });
    }

    setShowUploadModal(false);
    setEditingMedia(null);
    setMediaFormData({
      title: '',
      urduTitle: '',
      type: 'video',
      category: 'course_promo',
      url: '',
      thumbnailUrl: '',
      duration: '01:30',
      description: '',
      courseName: '',
      tags: 'Admissions, Jamia, Promo',
      consentObtained: true,
      aspectRatio: '16:9',
    });
  };

  // Submit Advertisement Plan
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormData.title.trim()) {
      setUploadError('Advertisement Title is required.');
      return;
    }

    if (editingPlan) {
      JamiaStore.updateAdvertisementPlan(editingPlan.id, {
        title: planFormData.title,
        coursePromoted: planFormData.coursePromoted,
        targetAudience: planFormData.targetAudience,
        videoDescription: planFormData.videoDescription,
        scriptUrdu: planFormData.scriptUrdu,
        scriptEnglish: planFormData.scriptEnglish,
        voiceoverText: planFormData.voiceoverText,
        captionText: planFormData.captionText,
        thumbnailUrl: planFormData.thumbnailUrl,
        videoUrl: planFormData.videoUrl,
        status: planFormData.status,
      });
    } else {
      JamiaStore.addAdvertisementPlan({
        title: planFormData.title,
        coursePromoted: planFormData.coursePromoted,
        targetAudience: planFormData.targetAudience,
        videoDescription: planFormData.videoDescription,
        scriptUrdu: planFormData.scriptUrdu,
        scriptEnglish: planFormData.scriptEnglish,
        voiceoverText: planFormData.voiceoverText,
        captionText: planFormData.captionText,
        thumbnailUrl: planFormData.thumbnailUrl,
        videoUrl: planFormData.videoUrl,
        status: planFormData.status,
        createdBy: currentUser?.name || 'Muneeb ur Rehman (Director)',
      });
    }

    setShowPlanModal(false);
    setEditingPlan(null);
    setPlanFormData({
      title: '',
      coursePromoted: 'Hifz-ul-Quran',
      targetAudience: 'Parents & Students',
      videoDescription: '',
      scriptUrdu: '',
      scriptEnglish: '',
      voiceoverText: '',
      captionText: '',
      thumbnailUrl: '',
      videoUrl: '',
      status: 'draft',
    });
  };

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Top Header with Visual Heritage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdfaf2] border border-[#D6B66C] text-[#b89344] text-xs font-bold uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Jamia Salahuddin Ayubi · Media, Broadcasting & Advertisements</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            Promotional Media & Advertisements
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Authorized repository of official video documentaries, student learning footage, course promos, and advertisement production plans under Director General <strong className="text-slate-900">{settings.directorName}</strong>.
          </p>
        </div>

        {/* Action Controls for Admin */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => {
                  setEditingMedia(null);
                  setMediaFormData({
                    title: '',
                    urduTitle: '',
                    type: 'video',
                    category: 'course_promo',
                    url: '',
                    thumbnailUrl: '',
                    duration: '01:30',
                    description: '',
                    courseName: '',
                    tags: 'Admissions, Jamia, Promo',
                    consentObtained: true,
                    aspectRatio: '16:9',
                  });
                  setShowUploadModal(true);
                }}
                className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#D6B66C]" />
                <span>Upload Media Asset</span>
              </button>

              <button
                onClick={() => {
                  setEditingPlan(null);
                  setPlanFormData({
                    title: '',
                    coursePromoted: 'Hifz-ul-Quran',
                    targetAudience: 'Parents & Students',
                    videoDescription: '',
                    scriptUrdu: '',
                    scriptEnglish: '',
                    voiceoverText: '',
                    captionText: '',
                    thumbnailUrl: '',
                    videoUrl: '',
                    status: 'draft',
                  });
                  setShowPlanModal(true);
                }}
                className="px-4 py-2.5 bg-[#fdfaf2] hover:bg-[#f6ebd1] text-[#b89344] font-bold text-xs rounded-xl border border-[#D6B66C] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Plan Advertisement</span>
              </button>
            </>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Public Gallery</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-[#e5ece8] gap-4">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Video & Media Gallery ({mediaItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('planning')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'planning'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Advertisement Planning Studio ({adPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Featured Campaigns</span>
        </button>
      </div>

      {/* TAB 1: MEDIA & VIDEO GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Sub-Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'video', label: 'Videos & Documentaries' },
                { id: 'footage', label: 'Student Learning Footage' },
                { id: 'course_promo', label: 'Course Promos' },
                { id: 'logo_banner', label: 'Logos & Banners' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D6B66C]" />
              <span>Click any video thumbnail to play with full audio & controls</span>
            </div>
          </div>

          {/* Media Grid */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Film className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-serif-heading font-bold text-lg text-slate-700">No media assets in this category</h3>
              <p className="text-xs text-slate-500">Authorized administrators can upload media videos, logos, and promotional footage.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#e5ece8] shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail / Video Preview Box */}
                  <div
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                    onClick={() => {
                      if (item.type === 'video' || item.type === 'footage') {
                        setActiveVideo(item);
                      }
                    }}
                  >
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Play Overlay for Video */}
                    {(item.type === 'video' || item.type === 'footage') && (
                      <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#176B4D]/90 text-[#D6B66C] border-2 border-[#D6B66C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Badges on Top */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                        {item.type}
                      </span>
                      {item.consentObtained && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Consent Verified</span>
                        </span>
                      )}
                    </div>

                    {/* Duration / Format Badge */}
                    {item.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D6B66C]" />
                        <span>{item.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif-heading font-bold text-base text-slate-900 group-hover:text-[#176B4D] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {item.urduTitle && (
                        <span className="font-arabic text-xs text-[#b89344] font-semibold block leading-relaxed">
                          {item.urduTitle}
                        </span>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Tags and Meta */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{item.publishedDate}</span>
                        {item.courseName && (
                          <span className="text-[#176B4D] font-semibold">{item.courseName}</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2">
                        {(item.type === 'video' || item.type === 'footage') ? (
                          <button
                            onClick={() => setActiveVideo(item)}
                            className="text-xs font-bold text-[#176B4D] hover:text-[#0f4a35] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Video</span>
                          </button>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-[#176B4D] hover:text-[#0f4a35] flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Image</span>
                          </a>
                        )}

                        {/* Admin Edit/Delete */}
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingMedia(item);
                                setMediaFormData({
                                  title: item.title,
                                  urduTitle: item.urduTitle || '',
                                  type: item.type,
                                  category: item.category,
                                  url: item.url,
                                  thumbnailUrl: item.thumbnailUrl || '',
                                  duration: item.duration || '01:30',
                                  description: item.description,
                                  courseName: item.courseName || '',
                                  tags: item.tags ? item.tags.join(', ') : '',
                                  consentObtained: item.consentObtained ?? true,
                                  aspectRatio: item.aspectRatio || '16:9',
                                });
                                setShowUploadModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Asset"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete media asset "${item.title}"?`)) {
                                  JamiaStore.deletePromotionalMedia(item.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADVERTISEMENT PLANNING STUDIO */}
      {activeTab === 'planning' && (
        <div className="space-y-8">
          <div className="bg-[#fdfaf2] rounded-3xl p-6 sm:p-8 border-2 border-[#D6B66C] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
                Production & Copywriting Workspace
              </span>
              <h2 className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                Advertisement Planning & Scripting Studio
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formulate promotional advertising campaigns for accredited programs. Contains dual-language (Urdu/English) scriptwriting, voiceover directives, subtitle text, and final video asset archiving.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setPlanFormData({
                    title: '',
                    coursePromoted: 'Hifz-ul-Quran',
                    targetAudience: 'Parents & Students',
                    videoDescription: '',
                    scriptUrdu: '',
                    scriptEnglish: '',
                    voiceoverText: '',
                    captionText: '',
                    thumbnailUrl: '',
                    videoUrl: '',
                    status: 'draft',
                  });
                  setShowPlanModal(true);
                }}
                className="px-5 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#D6B66C]" />
                <span>Create New Ad Plan</span>
              </button>
            )}
          </div>

          {/* Ad Plans Feed */}
          <div className="space-y-6">
            {adPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-[#e5ece8] shadow-sm hover:shadow-md transition-all p-6 sm:p-8 space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          plan.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : plan.status === 'in_production'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : plan.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {plan.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-[#176B4D]">
                        Promoted Course: {plan.coursePromoted}
                      </span>
                    </div>

                    <h3 className="font-serif-heading text-xl font-bold text-slate-900">
                      {plan.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Target: {plan.targetAudience}</span>
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setPlanFormData({
                              title: plan.title,
                              coursePromoted: plan.coursePromoted,
                              targetAudience: plan.targetAudience,
                              videoDescription: plan.videoDescription,
                              scriptUrdu: plan.scriptUrdu,
                              scriptEnglish: plan.scriptEnglish,
                              voiceoverText: plan.voiceoverText,
                              captionText: plan.captionText,
                              thumbnailUrl: plan.thumbnailUrl,
                              videoUrl: plan.videoUrl || '',
                              status: plan.status,
                            });
                            setShowPlanModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-[#176B4D] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Ad Plan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete advertisement plan "${plan.title}"?`)) {
                              JamiaStore.deleteAdvertisementPlan(plan.id);
                            }
                          }}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Ad Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Script & Audio Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Urdu & English Scripts */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Urdu Script Box */}
                    <div className="p-4 bg-[#fbfdfc] rounded-2xl border border-[#e5ece8] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#b89344] uppercase tracking-wider flex items-center gap-1.5">
                          <Languages className="w-3.5 h-3.5" />
                          <span>Urdu Commercial Script (اسکرپٹ برائے اشتہار)</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(plan.scriptUrdu, plan.id + '-urdu')}
                          className="text-xs text-slate-400 hover:text-[#176B4D] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === plan.id + '-urdu' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                      <p className="font-arabic text-sm text-slate-800 leading-relaxed text-right dir-rtl whitespace-pre-line">
                        {plan.scriptUrdu || 'اردو اسکرپٹ ابھی درج نہیں کیا گیا۔'}
                      </p>
                    </div>

                    {/* English Script Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#176B4D]" />
                          <span>English Voiceover & Narration Script</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(plan.scriptEnglish, plan.id + '-eng')}
                          className="text-xs text-slate-400 hover:text-[#176B4D] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === plan.id + '-eng' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {plan.scriptEnglish || 'English script not populated.'}
                      </p>
                    </div>

                    {/* Voiceover Instructions & Subtitles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#176B4D]" />
                          <span>Voiceover Text & Direction</span>
                        </strong>
                        <p className="text-xs text-slate-600 italic">
                          &ldquo;{plan.voiceoverText || 'Calm, reverent, dignified Islamic tone.'}&rdquo;
                        </p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B66C]" />
                          <span>Social Media Caption / Headline</span>
                        </strong>
                        <p className="text-xs text-slate-600">
                          {plan.captionText || 'Admissions open for new academic session.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Asset Preview & Final Video Upload */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Thumbnail Box */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                      <div className="aspect-video bg-slate-900 relative">
                        {plan.thumbnailUrl ? (
                          <img
                            src={plan.thumbnailUrl}
                            alt={plan.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            No Thumbnail Uploaded
                          </div>
                        )}

                        {plan.videoUrl && (
                          <button
                            onClick={() =>
                              setActiveVideo({
                                id: plan.id,
                                title: plan.title,
                                type: 'video',
                                category: 'course_promo',
                                url: plan.videoUrl!,
                                description: plan.videoDescription,
                                publishedDate: plan.createdAt.split('T')[0],
                                author: plan.createdBy,
                              })
                            }
                            className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#176B4D] text-[#D6B66C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </button>
                        )}
                      </div>

                      <div className="p-3 text-[11px] text-slate-500 bg-white flex items-center justify-between">
                        <span>Created: {plan.createdAt.split('T')[0]}</span>
                        <span className="font-semibold text-slate-700">{plan.createdBy}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#f2f8f5] border border-[#176B4D]/20 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#176B4D] block tracking-wider">
                        Production Status
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {plan.videoUrl
                          ? 'Final video uploaded and ready for broadcast across official channels.'
                          : 'Script approved; video rendering or final recording in progress.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-8">
          {/* Main Campaign Hero */}
          <section className="bg-gradient-to-r from-[#176B4D] via-[#1B7A58] to-[#0f4a35] rounded-3xl text-white p-8 sm:p-12 border-2 border-[#D6B66C] shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B66C] text-[#0f4a35] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Annual Admissions Drive 2026-2027</span>
                </div>

                <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold leading-tight">
                  Empower Your Child with Revelation and Modern Competence
                </h2>

                <p className="font-arabic text-xl text-[#D6B66C] font-bold">
                  باب القبول والتسجيل مفتوح للعام الدراسي الجديد
                </p>

                <p className="text-sm text-emerald-100 leading-relaxed max-w-2xl">
                  Jamia Salahuddin Ayubi invites applications for its celebrated 8-year Dars-e-Nizami Alimiyyah program, Full-time Hifz-ul-Quran with Tajweed, and Post-Graduate Islamic Jurisprudence (Ifta) integrated with Computer Sciences and English. Directed by <strong className="text-white">{settings.directorName}</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                    <strong className="block text-[#D6B66C] font-serif-heading text-sm">Full Boarding</strong>
                    <span className="text-emerald-100 text-[11px]">Hygienic mess & 24/7 mentoring</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                    <strong className="block text-[#D6B66C] font-serif-heading text-sm">100% Scholarships</strong>
                    <span className="text-emerald-100 text-[11px]">For Huffaz, orphans & deserving</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
                    <strong className="block text-[#D6B66C] font-serif-heading text-sm">Digital ID Cards</strong>
                    <span className="text-emerald-100 text-[11px]">Smart QR-verified identity</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to="/admissions/apply"
                    className="px-6 py-3 bg-[#D6B66C] hover:bg-[#b89344] text-[#0f4a35] font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Apply Online Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/courses"
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                  >
                    <span>View Academic Syllabi</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-64 h-64 rounded-full bg-white/10 border-4 border-[#D6B66C]/60 flex items-center justify-center p-4 backdrop-blur-xs shadow-inner">
                  <JamiaLogo size="2xl" showText={false} variant="monochrome" />
                </div>
              </div>
            </div>
          </section>

          {/* Dastar-e-Fazeelat Convocation Card */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5ece8] shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#b89344] uppercase tracking-wider">
                  Graduation & Spiritual Milestone
                </span>
                <h3 className="font-serif-heading text-2xl font-extrabold text-[#176B4D]">
                  Annual Khatm-e-Bukhari & Dastar-e-Fazeelat Convocation
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f2f8f5] text-[#176B4D]">
                Annual Grand Event
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 rounded-2xl overflow-hidden border-2 border-[#D6B66C] shadow-xs h-60">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
                  alt="Convocation Ceremony"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-4 text-xs text-slate-700 leading-relaxed">
                <p className="text-sm font-semibold text-slate-900">
                  Honoring the graduates of the Dourat-ul-Hadith Sharif (Al-Alimiyyah Fazil Degree) and certified Huffaz of the Holy Quran.
                </p>
                <p>
                  Under the presiding guidance of <strong>Director General Muneeb ur Rehman</strong> and eminent scholars, each graduate is bestowed the traditional Dastar-e-Fazeelat (Honorary Turban) and awarded formal Sanad chains with continuous transmission back to Prophet Muhammad ﷺ.
                </p>
                <div className="p-3.5 bg-[#f8faf9] rounded-xl border border-[#e5ece8] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Venue:</span>
                    <span>Grand Central Auditorium, Jamia Salahuddin Ayubi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Presiding Officer:</span>
                    <span>Muneeb ur Rehman & Council of Leading Muhadditheen</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden border-2 border-[#D6B66C] shadow-2xl flex flex-col max-h-[90vh]">
            {/* Player Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#176B4D] text-[#D6B66C] flex items-center justify-center font-bold">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-sm text-white line-clamp-1">
                    {activeVideo.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Jamia Salahuddin Ayubi · Media Broadcasting
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas */}
            <div className="bg-black aspect-video flex items-center justify-center">
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>

            {/* Player Details Footer */}
            <div className="p-5 bg-slate-900 text-white space-y-2 border-t border-slate-800">
              {activeVideo.urduTitle && (
                <p className="font-arabic text-sm text-[#D6B66C] text-right dir-rtl">
                  {activeVideo.urduTitle}
                </p>
              )}
              <p className="text-xs text-slate-300 leading-relaxed">{activeVideo.description}</p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <span>Published: {activeVideo.publishedDate}</span>
                <span>Author: {activeVideo.author}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEDIA MODAL (ADMIN ONLY) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#176B4D] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider">
                  Admin Broadcast Desk
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#176B4D]">
                  {editingMedia ? 'Edit Media Asset' : 'Upload Promotional Media Asset'}
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Asset Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={mediaFormData.title}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                    placeholder="e.g. Hifz-ul-Quran Tajweed Session"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Urdu Title (Optional)</label>
                  <input
                    type="text"
                    value={mediaFormData.urduTitle}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, urduTitle: e.target.value })}
                    placeholder="عنوان برائے ویڈیو / اشتہار"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none text-right dir-rtl font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Media Type *</label>
                  <select
                    value={mediaFormData.type}
                    onChange={(e) =>
                      setMediaFormData({ ...mediaFormData, type: e.target.value as MediaItemType })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  >
                    <option value="video">Original Institute Video</option>
                    <option value="footage">Student Learning Footage</option>
                    <option value="logo">Institute Logo</option>
                    <option value="banner">Promotional Banner</option>
                    <option value="image">Still Photography</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={mediaFormData.category}
                    onChange={(e) =>
                      setMediaFormData({
                        ...mediaFormData,
                        category: e.target.value as PromotionalMediaItem['category'],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  >
                    <option value="course_promo">Course Promo</option>
                    <option value="institute_intro">Institute Intro</option>
                    <option value="student_footage">Student Footage</option>
                    <option value="admission_ad">Admission Ad</option>
                    <option value="event_highlight">Event Highlight</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Duration (e.g. 02:45)</label>
                  <input
                    type="text"
                    value={mediaFormData.duration}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, duration: e.target.value })}
                    placeholder="02:30"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>
              </div>

              {/* Media URL / File Upload */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Media Source (Video/Image) *</label>
                  <span className="text-[10px] text-slate-500">Provide direct URL or upload file</span>
                </div>

                <input
                  type="text"
                  required
                  value={mediaFormData.url}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, url: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/... or data URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] bg-white outline-none"
                />

                <div className="pt-2 flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#176B4D] font-bold rounded-xl border border-[#176B4D]/30 transition-all cursor-pointer flex items-center gap-2 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      className="hidden"
                      accept={mediaFormData.type === 'video' || mediaFormData.type === 'footage' ? 'video/mp4,video/webm' : 'image/*'}
                      onChange={(e) => handleFileUpload(e, 'url', mediaFormData.type === 'video' || mediaFormData.type === 'footage' ? 'video' : 'image')}
                    />
                  </label>
                  <span className="text-[10px] text-slate-400">MP4, WebM, PNG, JPG (Safe validation enforced)</span>
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={mediaFormData.thumbnailUrl}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload image"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Asset Description & Context</label>
                <textarea
                  rows={3}
                  value={mediaFormData.description}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, description: e.target.value })}
                  placeholder="Provide background, syllabus details, or event information..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                />
              </div>

              {/* Student Consent Checkbox */}
              {mediaFormData.type === 'footage' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={mediaFormData.consentObtained}
                    onChange={(e) =>
                      setMediaFormData({ ...mediaFormData, consentObtained: e.target.checked })
                    }
                    className="w-4 h-4 text-[#176B4D] rounded-sm focus:ring-[#176B4D]"
                  />
                  <label htmlFor="consent" className="text-xs text-emerald-900 font-semibold cursor-pointer">
                    Formal consent obtained for student learning footage in accordance with Jamia privacy policy.
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                  <span>{editingMedia ? 'Update Media Asset' : 'Publish Media Asset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADVERTISEMENT PLAN MODAL (ADMIN ONLY) */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#176B4D] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#b89344] uppercase tracking-wider">
                  Campaign Studio
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#176B4D]">
                  {editingPlan ? 'Edit Advertisement Plan' : 'New Advertisement Plan & Script'}
                </h3>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Advertisement Title *</label>
                  <input
                    type="text"
                    required
                    value={planFormData.title}
                    onChange={(e) => setPlanFormData({ ...planFormData, title: e.target.value })}
                    placeholder="e.g. Hifz-ul-Quran 2026 Admissions Ad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Course Being Promoted *</label>
                  <select
                    value={planFormData.coursePromoted}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, coursePromoted: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    <option value="General Admissions">General Admissions 2026</option>
                    <option value="Girls Bannat Wing">Girls (Bannat) Wing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Audience</label>
                  <input
                    type="text"
                    value={planFormData.targetAudience}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, targetAudience: e.target.value })
                    }
                    placeholder="e.g. Parents of school children, University students"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Production Status</label>
                  <select
                    value={planFormData.status}
                    onChange={(e) =>
                      setPlanFormData({
                        ...planFormData,
                        status: e.target.value as AdvertisementPlan['status'],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  >
                    <option value="draft">Draft Planning</option>
                    <option value="in_production">In Production</option>
                    <option value="reviewed">Reviewed by Management</option>
                    <option value="published">Published & Active</option>
                  </select>
                </div>
              </div>

              {/* Video Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Video Description & Concept</label>
                <textarea
                  rows={2}
                  value={planFormData.videoDescription}
                  onChange={(e) =>
                    setPlanFormData({ ...planFormData, videoDescription: e.target.value })
                  }
                  placeholder="Outline the visual pacing, student Halaqah shots, and campus imagery..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                />
              </div>

              {/* Dual Scripts: Urdu & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Urdu Commercial Script (اردو اسکرپٹ)</label>
                  <textarea
                    rows={4}
                    value={planFormData.scriptUrdu}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, scriptUrdu: e.target.value })
                    }
                    placeholder="اشتہار کے لیے اردو اسکرپٹ یہاں درج فرمائیں..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none text-right dir-rtl font-arabic leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">English Narration Script</label>
                  <textarea
                    rows={4}
                    value={planFormData.scriptEnglish}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, scriptEnglish: e.target.value })
                    }
                    placeholder="Enter English narration or subtitle dialogue..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Voiceover and Caption Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Voiceover Text & Direction</label>
                  <input
                    type="text"
                    value={planFormData.voiceoverText}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, voiceoverText: e.target.value })
                    }
                    placeholder="Tone: Dignified, welcoming, clear Islamic diction..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Caption / Subtitle Text</label>
                  <input
                    type="text"
                    value={planFormData.captionText}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, captionText: e.target.value })
                    }
                    placeholder="Admissions Open 2026 | Jamia Salahuddin Ayubi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                  />
                </div>
              </div>

              {/* Thumbnail & Video Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thumbnail URL or Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={planFormData.thumbnailUrl}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, thumbnailUrl: e.target.value })
                      }
                      placeholder="Image URL..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                    />
                    <label className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'thumbnailUrl', 'image')}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Final Video File or URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={planFormData.videoUrl}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, videoUrl: e.target.value })
                      }
                      placeholder="Video URL..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#176B4D] outline-none"
                    />
                    <label className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleFileUpload(e, 'videoUrl', 'video')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2.5 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
                  <span>{editingPlan ? 'Update Plan' : 'Save Advertisement Plan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
