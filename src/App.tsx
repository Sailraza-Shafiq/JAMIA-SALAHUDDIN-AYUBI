/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatModal } from './components/AIChatModal';
import { FloatingChatButton } from './components/FloatingChatButton';
import { VerificationPortal } from './components/VerificationPortal';
import { subscribeToStore } from './lib/storage';

// 12 Functional Modules Page Components
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { AdmissionFormPage } from './pages/AdmissionFormPage';
import { IdCardGeneratorPage } from './pages/IdCardGeneratorPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ManagementPage } from './pages/ManagementPage';
import { StaffPage } from './pages/StaffPage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { FeeManagementPage } from './pages/FeeManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AdvertisementsPage } from './pages/AdvertisementsPage';
import { ContactPage } from './pages/ContactPage';

// Software Subsystems & Layout
import { ManagementLayout } from './layouts/ManagementLayout';
import { QRScannerPage } from './pages/admin/QRScannerPage';
import { AdmissionsAdminPage } from './pages/admin/AdmissionsAdminPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DatabaseSettingsPage } from './pages/admin/DatabaseSettingsPage';

import { Sparkles, ShieldCheck } from 'lucide-react';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [targetVerifyRoll, setTargetVerifyRoll] = useState<string>('');
  const [, setRenderTrigger] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Re-render when local storage store updates
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setRenderTrigger((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const handleOpenVerify = (rollNo = '') => {
    setTargetVerifyRoll(rollNo);
    setIsVerifyOpen(true);
  };

  // Determine if viewing authenticated Educational Management Software mode
  const isManagementRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/software');
  const isLoginRoute =
    location.pathname === '/admin/login' ||
    location.pathname === '/software/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-[#15241e] w-full max-w-full overflow-x-hidden">
      <ScrollToTop />

      {/* Render Public Navbar on Public Website pages only (Public Admin Portal button remains removed) */}
      {!isManagementRoute && !isLoginRoute && (
        <Navbar onOpenVerify={() => handleOpenVerify()} />
      )}

      {/* Main Multi-Page Route Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Routes>
          {/* =========================================================================
              MODULE 1: PUBLIC WEBSITE
             ========================================================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* =========================================================================
              MODULE 3 & 7: PUBLIC COURSES & ADMISSIONS
             ========================================================================= */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/admissions/apply" element={<AdmissionFormPage />} />

          {/* =========================================================================
              MODULE 4: STUDENT ID CARD GENERATOR
             ========================================================================= */}
          <Route path="/id-cards" element={<IdCardGeneratorPage onOpenVerify={handleOpenVerify} />} />
          <Route path="/cards" element={<IdCardGeneratorPage onOpenVerify={handleOpenVerify} />} />
          <Route path="/id-card" element={<IdCardGeneratorPage onOpenVerify={handleOpenVerify} />} />
          <Route path="/admission-card" element={<IdCardGeneratorPage onOpenVerify={handleOpenVerify} />} />

          {/* =========================================================================
              MODULE 6: STAFF DIRECTORY (PUBLIC FACULTY PAGE)
             ========================================================================= */}
          <Route path="/staff" element={<StaffPage />} />

          {/* =========================================================================
              MODULE 11: AI STUDENT ASSISTANT
             ========================================================================= */}
          <Route path="/ai-assistant" element={<AIAssistantPage />} />

          {/* =========================================================================
              MODULE 12: ADVERTISEMENT & PROMOTIONAL MEDIA
             ========================================================================= */}
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/media" element={<AdvertisementsPage />} />

          {/* =========================================================================
              PRIVATE MANAGEMENT ACCESS LOGIN PORTAL
             ========================================================================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/software/login" element={<AdminLoginPage />} />

          {/* =========================================================================
              EDUCATIONAL MANAGEMENT SOFTWARE (EMS) INTERNAL PROTECTED WORKSPACE
             ========================================================================= */}
          {/* Module 2: Student Management & Executive Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Management Console Access">
                <ManagementLayout activeModuleTitle="Executive Dashboard & Student Roster">
                  <StudentsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Management Dashboard">
                <ManagementLayout activeModuleTitle="Executive Dashboard">
                  <StudentsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Student Management Directory">
                <ManagementLayout activeModuleTitle="Student Management & Profiles">
                  <StudentsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:studentId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Student Profile Dossier">
                <ManagementLayout activeModuleTitle="Student Dossier">
                  <StudentsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 3: Admissions Processing Subsystem */}
          <Route
            path="/admin/admissions"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Admissions Processing Desk">
                <ManagementLayout activeModuleTitle="Admissions Applications Desk">
                  <AdmissionsAdminPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 4: ID Card Generator Inside EMS */}
          <Route
            path="/admin/id-cards"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Student ID Cards Management">
                <ManagementLayout activeModuleTitle="CR80 PVC Student ID Card Generator">
                  <IdCardGeneratorPage onOpenVerify={handleOpenVerify} />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 5: QR Code Scanning & Gate Verification */}
          <Route
            path="/admin/scanner"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Gate QR Verification Terminal">
                <ManagementLayout activeModuleTitle="Gate QR Code Verification & Access Terminal">
                  <QRScannerPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 6: Staff & Asatiza Management */}
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Faculty & Staff Administration">
                <ManagementLayout activeModuleTitle="Staff & Asatiza Personnel Directory">
                  <StaffPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 7: Course & Class Management */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Course Curriculum & Classes">
                <ManagementLayout activeModuleTitle="Curriculum & Class Sections Management">
                  <CoursesPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 8: Daily Attendance & Biometric Ledger */}
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Daily Attendance Ledger">
                <ManagementLayout activeModuleTitle="Student Attendance Ledger & QR Sync">
                  <AttendancePage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={<Navigate to="/admin/attendance" replace />}
          />

          {/* Module 9: Finance & Fee Management */}
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute allowedRoles={['admin']} title="Treasury & Fee Management">
                <ManagementLayout activeModuleTitle="Finance, Fee Structures & Dues Ledger">
                  <FeeManagementPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fees"
            element={<Navigate to="/admin/fees" replace />}
          />

          {/* Module 10: Reports & Academic Analytics */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Academic Results & Analytics">
                <ManagementLayout activeModuleTitle="Institutional Reports & PDF/CSV Exports">
                  <ReportsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={<Navigate to="/admin/reports" replace />}
          />

          {/* Module 12: Advertisement Campaign Management */}
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']} title="Digital Media Management">
                <ManagementLayout activeModuleTitle="Promotional Media & Video Campaigns">
                  <AdvertisementsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />

          {/* Module 13: Database Architecture & Supabase Console */}
          <Route
            path="/admin/database"
            element={
              <ProtectedRoute allowedRoles={['admin']} title="Database Architecture Console">
                <ManagementLayout activeModuleTitle="Database Architecture & Supabase Inspection">
                  <DatabaseSettingsPage />
                </ManagementLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={<Navigate to="/admin/database" replace />}
          />

          {/* Mirror /software/* aliases */}
          <Route path="/software" element={<Navigate to="/admin" replace />} />
          <Route path="/software/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/software/students" element={<Navigate to="/admin/students" replace />} />
          <Route path="/software/admissions" element={<Navigate to="/admin/admissions" replace />} />
          <Route path="/software/scanner" element={<Navigate to="/admin/scanner" replace />} />
          <Route path="/software/staff" element={<Navigate to="/admin/staff" replace />} />
          <Route path="/software/courses" element={<Navigate to="/admin/courses" replace />} />
          <Route path="/software/attendance" element={<Navigate to="/admin/attendance" replace />} />
          <Route path="/software/fees" element={<Navigate to="/admin/fees" replace />} />
          <Route path="/software/reports" element={<Navigate to="/admin/reports" replace />} />
          <Route path="/software/media" element={<Navigate to="/admin/media" replace />} />
          <Route path="/software/database" element={<Navigate to="/admin/database" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Floating Quick Action Widget on Public Pages */}
      {!isManagementRoute && !isLoginRoute && (
        <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2 print:hidden">
          <button
            onClick={() => handleOpenVerify('')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-[#176B4D] font-bold text-xs rounded-full shadow-lg border border-[#176B4D]/30 transition-all cursor-pointer hover:scale-105"
            title="Verify Any Student ID Card"
          >
            <ShieldCheck className="w-4 h-4 text-[#176B4D]" />
            <span className="hidden sm:inline">Verify Student ID</span>
          </button>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-full shadow-lg border border-[#D6B66C] transition-all cursor-pointer hover:scale-105"
            title="Ask Student Advisor AI"
          >
            <Sparkles className="w-4 h-4 text-[#D6B66C]" />
            <span>Ask Advisor AI</span>
          </button>
        </div>
      )}

      {/* Small Floating Chat Button on Public Pages */}
      {!isManagementRoute && !isLoginRoute && (
        <FloatingChatButton
          isOpen={isAIOpen}
          onToggle={() => setIsAIOpen((prev) => !prev)}
        />
      )}

      {/* Global AI Student Support Chatbot Modal */}
      <AIChatModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Global Online Student Verification Modal */}
      {isVerifyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <VerificationPortal
              initialRollNo={targetVerifyRoll}
              onClose={() => setIsVerifyOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Public Footer on Public Pages */}
      {!isManagementRoute && !isLoginRoute && (
        <Footer
          onOpenVerify={() => handleOpenVerify('JSA-2026-101')}
          onOpenAI={() => setIsAIOpen(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
