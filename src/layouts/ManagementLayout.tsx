import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { JamiaLogo } from '../components/JamiaLogo';
import { useAuth } from '../context/AuthContext';
import { JamiaStore } from '../lib/storage';
import {
  Users,
  GraduationCap,
  CreditCard,
  QrCode,
  UserCheck,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Megaphone,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Database,
  Building,
  Home,
  LayoutDashboard,
} from 'lucide-react';

interface ManagementLayoutProps {
  children: React.ReactNode;
  activeModuleTitle?: string;
  activeModuleSubtitle?: string;
}

export const ManagementLayout: React.FC<ManagementLayoutProps> = ({
  children,
  activeModuleTitle,
  activeModuleSubtitle,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser, logout, currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const settings = JamiaStore.getSettings();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 11 Core Management Software Subsystems
  const softwareNavItems = [
    {
      group: 'Core Management',
      items: [
        { to: '/admin/students', label: 'Students & Dashboard', icon: Users, badge: 'Roster' },
        { to: '/admin/admissions', label: 'Admissions Desk', icon: GraduationCap, badge: 'Intake' },
        { to: '/id-cards', label: 'Student ID Cards', icon: CreditCard },
        { to: '/admin/scanner', label: 'Gate QR Scanner', icon: QrCode, highlight: true },
      ],
    },
    {
      group: 'Academics & Faculty',
      items: [
        { to: '/admin/courses', label: 'Courses & Classes', icon: BookOpen },
        { to: '/admin/staff', label: 'Staff & Asatiza', icon: UserCheck },
        { to: '/admin/attendance', label: 'Daily Attendance', icon: Calendar },
      ],
    },
    {
      group: 'Finance & Analytics',
      items: [
        { to: '/admin/fees', label: 'Fee Management', icon: DollarSign },
        { to: '/admin/reports', label: 'Reports & Exports', icon: FileText },
      ],
    },
    {
      group: 'Digital Media & AI',
      items: [
        { to: '/admin/media', label: 'Media & Campaigns', icon: Megaphone },
        { to: '/ai-assistant', label: 'AI Student Advisor', icon: Sparkles },
      ],
    },
    {
      group: 'System & Security',
      items: [
        { to: '/admin/database', label: 'Database & Supabase', icon: Database, badge: 'Live' },
      ],
    },
  ];

  const getPageTitle = () => {
    if (activeModuleTitle) return activeModuleTitle;
    const path = location.pathname;
    if (path.includes('students')) return 'Student Management & Records';
    if (path.includes('admissions')) return 'Admissions Applications Desk';
    if (path.includes('id-cards') || path.includes('cards')) return 'Student ID Card Generator';
    if (path.includes('scanner')) return 'Gate QR Verification & Scanner';
    if (path.includes('staff')) return 'Staff & Asatiza Management';
    if (path.includes('courses')) return 'Course & Class Curriculum';
    if (path.includes('attendance')) return 'Daily Attendance & Biometrics';
    if (path.includes('fees')) return 'Finance & Fee Management';
    if (path.includes('reports')) return 'Reports & Academic Analytics';
    if (path.includes('media') || path.includes('advertisements')) return 'Promotional Media Management';
    if (path.includes('database') || path.includes('settings')) return 'Database Architecture & Supabase Console';
    if (path.includes('ai-assistant')) return 'AI Student Support Assistant';
    return 'Educational Management Software';
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col text-slate-800 antialiased">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs h-14 flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Institute Brand & Software Indicator */}
          <Link to="/admin/students" className="flex items-center gap-2.5 focus:outline-none">
            <JamiaLogo size={32} showText={false} />
            <div className="flex flex-col">
              <span className="font-serif-heading font-extrabold text-xs sm:text-sm text-[#176B4D] leading-none">
                Jamia Salahuddin Ayubi
              </span>
              <span className="text-[10px] text-[#b89344] font-semibold tracking-wide">
                Educational Management Software · EMS v2.6
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right: Session info, Supabase status & Executive profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
          {/* Active Academic Session Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#f2f8f5] text-[#176B4D] font-bold rounded-md border border-[#176B4D]/20 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Session: 2026–2027</span>
          </div>

          {/* Supabase Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200/60 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3 h-3 text-emerald-600" />
            <span className="font-mono text-[10px]">Supabase Synced</span>
          </div>

          {/* Return to Public Website */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-[#176B4D] hover:bg-slate-100 rounded-md transition-colors text-xs font-semibold"
            title="Switch to Public Website Mode"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          {/* Director / Administrator Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#176B4D] text-[#D6B66C] flex items-center justify-center font-bold text-xs ring-1 ring-[#D6B66C]/40">
              MR
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="font-bold text-slate-800 text-xs">
                Muneeb ur Rehman
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Founder & Director General
              </span>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Sign Out / Lock Session"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Software Canvas: Sidebar + Active Module Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 select-none ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Sidebar Modules List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
            {softwareNavItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <span className="block px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.group}
                  </span>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-[#176B4D] text-white shadow-2xs font-bold'
                            : item.highlight
                            ? 'bg-[#fdfaf2] text-[#b89344] hover:bg-[#faeecf] border border-[#D6B66C]/30'
                            : 'text-slate-600 hover:bg-[#f2f8f5] hover:text-[#176B4D]'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D6B66C]' : 'text-slate-500 group-hover:text-[#176B4D]'}`} />
                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between truncate">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Collapse Toggle & Bottom Metadata */}
          <div className="p-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            {!collapsed && (
              <span className="text-[10px] truncate pl-1 font-medium">
                Admin: Muneeb ur Rehman
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-slate-500 hover:text-[#176B4D] hover:bg-slate-100 rounded-md transition-colors cursor-pointer ml-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex">
            <div className="w-72 bg-white h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <JamiaLogo size={28} showText={false} />
                  <div>
                    <h3 className="font-serif-heading font-extrabold text-xs text-[#176B4D]">
                      Jamia Salahuddin Ayubi
                    </h3>
                    <span className="text-[10px] text-slate-400 block">Management Software</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-4">
                {softwareNavItems.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span className="block px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {group.group}
                    </span>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                              isActive
                                ? 'bg-[#176B4D] text-white shadow-xs font-bold'
                                : 'text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D6B66C]' : 'text-slate-500'}`} />
                            <span className="flex-1 truncate">{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Return to Public Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-center text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Sign Out Administrator
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Content Viewport with Breadcrumb Strip */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Subsystem Action Bar / Breadcrumbs */}
          <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">EMS</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-[#176B4D]">{getPageTitle()}</span>
              {activeModuleSubtitle && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-normal hidden sm:inline">{activeModuleSubtitle}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="hidden lg:inline text-[11px]">
                Authorized Administrator: <strong className="text-slate-700">Muneeb ur Rehman</strong>
              </span>
              <span className="font-mono text-[11px] text-[#176B4D] font-bold bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/20">
                Jamia Salahuddin Ayubi
              </span>
            </div>
          </div>

          {/* Module Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
