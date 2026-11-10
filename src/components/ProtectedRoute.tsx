import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JamiaLogo } from './JamiaLogo';
import { Lock, ShieldAlert, CheckCircle2, User, Key, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'teacher')[];
  title?: string;
  description?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['admin'],
  title = 'Administrative Management Access Required',
  description = 'This section contains private administrative records for Jamia Salahuddin Ayubi. Please sign in with authorized administrator credentials.',
}) => {
  const { currentRole, login, isAdmin, isStaff } = useAuth();
  const [email, setEmail] = useState('director@jamiasalahuddin.edu.pk');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');

  const isAuthorized =
    (allowedRoles.includes('admin') && isAdmin) ||
    (allowedRoles.includes('teacher') && isStaff);

  if (isAuthorized) {
    return <>{children}</>;
  }

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login('admin');
  };

  const handleFacultySignIn = () => {
    login('teacher');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border-2 border-[#176B4D]/30 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#f2f8f5] text-[#176B4D] border border-[#176B4D]/20 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-[#176B4D]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
            {title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="p-4 bg-[#f8faf9] rounded-2xl border border-[#D6B66C]/40 text-left text-xs space-y-2">
          <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
            Authorized Institute Personnel
          </span>
          <div className="flex justify-between items-center text-slate-700">
            <span>Director General:</span>
            <strong className="text-[#176B4D]">Muneeb ur Rehman</strong>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span>Access Tier:</span>
            <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              ROLE_ADMINISTRATOR
            </span>
          </div>
        </div>

        <form onSubmit={handleAdminSignIn} className="space-y-3.5 text-left text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Admin Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Security Key / Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
            <span>Sign in as Admin (Muneeb ur Rehman)</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          {allowedRoles.includes('teacher') && (
            <button
              onClick={handleFacultySignIn}
              className="text-xs font-semibold text-[#176B4D] hover:underline cursor-pointer"
            >
              Sign in as Faculty / Asatiza Member
            </button>
          )}

          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Public Institute Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
