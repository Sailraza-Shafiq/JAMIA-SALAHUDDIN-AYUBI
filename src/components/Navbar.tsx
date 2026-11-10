import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { JamiaLogo } from './JamiaLogo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenVerify?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);

  const admissionsRef = useRef<HTMLDivElement>(null);
  const managementRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { currentRole, login } = useAuth();

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAdmissionsOpen(false);
    setManagementOpen(false);
  }, [location.pathname]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (admissionsRef.current && !admissionsRef.current.contains(e.target as Node)) {
        setAdmissionsOpen(false);
      }
      if (managementRef.current && !managementRef.current.contains(e.target as Node)) {
        setManagementOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmissionsActive =
    location.pathname === '/admissions' ||
    location.pathname === '/admissions/apply' ||
    location.pathname === '/id-cards';

  const isManagementActive =
    location.pathname === '/management' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/staff';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* 1. Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none">
          <JamiaLogo size={38} showText={true} />
        </Link>

        {/* 2. Center/Right: Simple Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13.5px] font-medium text-slate-700">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            Home
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            About
          </NavLink>

          {/* Courses */}
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            Courses
          </NavLink>

          {/* Admissions Dropdown */}
          <div
            ref={admissionsRef}
            className="relative"
            onMouseEnter={() => setAdmissionsOpen(true)}
            onMouseLeave={() => setAdmissionsOpen(false)}
          >
            <button
              onClick={() => setAdmissionsOpen(!admissionsOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                isAdmissionsActive || admissionsOpen
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`}
            >
              <span>Admissions</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {admissionsOpen && (
              <div className="absolute left-0 top-full pt-1 w-52 z-50">
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 animate-in fade-in duration-100">
                  <NavLink
                    to="/admissions"
                    end
                    onClick={() => setAdmissionsOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Admission Information
                  </NavLink>
                  <NavLink
                    to="/admissions/apply"
                    onClick={() => setAdmissionsOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-[#176B4D] hover:bg-[#f2f8f5]"
                  >
                    Admission Form
                  </NavLink>
                  <NavLink
                    to="/id-cards"
                    onClick={() => setAdmissionsOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    ID Card Generator
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Management Dropdown */}
          <div
            ref={managementRef}
            className="relative"
            onMouseEnter={() => setManagementOpen(true)}
            onMouseLeave={() => setManagementOpen(false)}
          >
            <button
              onClick={() => setManagementOpen(!managementOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                isManagementActive || managementOpen
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`}
            >
              <span>Management</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {managementOpen && (
              <div className="absolute left-0 top-full pt-1 w-48 z-50">
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 animate-in fade-in duration-100">
                  <NavLink
                    to="/management"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Dashboard & Leadership
                  </NavLink>
                  <NavLink
                    to="/admin/students"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Students
                  </NavLink>
                  <NavLink
                    to="/staff"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Staff
                  </NavLink>
                  <NavLink
                    to="/admin/attendance"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Attendance
                  </NavLink>
                  <NavLink
                    to="/admin/fees"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Fee Management
                  </NavLink>
                  <NavLink
                    to="/admin/reports"
                    onClick={() => setManagementOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-[#f2f8f5] hover:text-[#176B4D]"
                  >
                    Reports
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Facilities */}
          <NavLink
            to="/facilities"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            Facilities
          </NavLink>


          {/* Media / Advertisements */}
          <NavLink
            to="/advertisements"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            Media
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-[#176B4D] font-bold bg-[#f2f8f5]'
                  : 'hover:text-[#176B4D] hover:bg-slate-50'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* 3. Right: Simple Apply Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            to="/admissions/apply"
            className="hidden sm:inline-block px-4 py-2 text-xs font-semibold text-white bg-[#176B4D] hover:bg-[#0f4a35] rounded-md transition-colors"
          >
            Apply Online
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#176B4D] hover:bg-slate-100 rounded-md cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Simple Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            About
          </NavLink>

          <NavLink
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            Courses
          </NavLink>

          {/* Admissions Section */}
          <div className="py-1">
            <span className="block px-3 py-1 text-[11px] font-bold uppercase text-slate-400">
              Admissions
            </span>
            <div className="pl-2 space-y-0.5">
              <NavLink
                to="/admissions"
                end
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Admission Information
              </NavLink>
              <NavLink
                to="/admissions/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs font-semibold text-[#176B4D] hover:bg-[#f2f8f5] rounded-md"
              >
                Admission Form
              </NavLink>
              <NavLink
                to="/id-cards"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                ID Card Generator
              </NavLink>
            </div>
          </div>

          {/* Management Section */}
          <div className="py-1">
            <span className="block px-3 py-1 text-[11px] font-bold uppercase text-slate-400">
              Management
            </span>
            <div className="pl-2 space-y-0.5">
              <NavLink
                to="/management"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Students
              </NavLink>
              <NavLink
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Staff
              </NavLink>
              <NavLink
                to="/admin/attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Attendance
              </NavLink>
              <NavLink
                to="/admin/fees"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Fee Management
              </NavLink>
              <NavLink
                to="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f2f8f5] rounded-md"
              >
                Reports
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            Facilities
          </NavLink>


          <NavLink
            to="/advertisements"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            Advertisements & Media
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-800 hover:bg-[#f2f8f5] hover:text-[#176B4D] rounded-md"
          >
            Contact
          </NavLink>

          {/* Quick Apply Button on Mobile */}
          <div className="pt-3 pb-1">
            <Link
              to="/admissions/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-semibold text-white bg-[#176B4D] hover:bg-[#0f4a35] rounded-md"
            >
              Apply Online
            </Link>
          </div>

          {/* Discreet Role Switcher */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>Access Role:</span>
            <select
              value={currentRole}
              onChange={(e) => login(e.target.value as UserRole)}
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5"
            >
              <option value="public">Public</option>
              <option value="student">Student</option>
              <option value="teacher">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
