import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { JamiaLogo } from '../../components/JamiaLogo';
import { Lock, ShieldCheck, User, Key, Home, AlertCircle, Sparkles, UserPlus } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [tab, setTab] = useState<'signin' | 'setup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Muneeb ur Rehman');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signInWithSupabase, signUpDirectorGeneral, login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both administrative email and password.');
      return;
    }

    setLoading(true);
    const res = await signInWithSupabase(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin/students');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDirectorSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password || !fullName.trim()) {
      setErrorMsg('All fields are required to register the Director General administrative account.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    const res = await signUpDirectorGeneral(email, password, fullName);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting to Management Dashboard...');
      setTimeout(() => {
        navigate('/admin/students');
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const handleFacultyQuickAccess = () => {
    login('teacher');
    navigate('/admin/attendance');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#f2f8f5] via-white to-[#f8faf9]">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border-2 border-[#D6B66C] shadow-2xl space-y-6 text-center">
        {/* Emblem & Brand Header */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <JamiaLogo size={64} showText={false} />
          </div>
          <div>
            <span className="font-arabic text-[#D6B66C] font-bold text-sm block">
              جامعة صلاح الدین الأيوبي الإسلامية
            </span>
            <h1 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
              Educational Management Software
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
              Secure Administration Access Portal
            </span>
          </div>
        </div>

        {/* Executive Director Identification */}
        <div className="p-3.5 bg-[#f8faf9] rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Governance Tier:</span>
            <span className="text-[10px] font-mono font-bold bg-[#f2f8f5] text-[#176B4D] px-2 py-0.5 rounded border border-[#176B4D]/20">
              ROLE_DIRECTOR_GENERAL
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-700 font-semibold">
            <span>Founder & Director General:</span>
            <strong className="text-[#176B4D]">Muneeb ur Rehman</strong>
          </div>
        </div>

        {/* Tabs: Sign In vs Initial Setup */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              tab === 'signin' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Management Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('setup'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              tab === 'setup' ? 'bg-[#176B4D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Initial Director Setup
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form: Sign In */}
        {tab === 'signin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Administrator Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@jamiasalahuddin.edu.pk"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Password / Security Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your administrative password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-[#D6B66C]" />
              <span>{loading ? 'Authenticating with Supabase...' : 'Sign in as Muneeb ur Rehman'}</span>
            </button>
          </form>
        )}

        {/* Form: Initial Setup */}
        {tab === 'setup' && (
          <form onSubmit={handleDirectorSetup} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Director Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Director Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@jamiasalahuddin.edu.pk"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Choose Secure Password (Min 6 Characters)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your private secure password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8faf9] border border-[#e5ece8] rounded-xl font-medium focus:border-[#176B4D] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4 text-[#D6B66C]" />
              <span>{loading ? 'Creating Director Account...' : 'Register Director General Account'}</span>
            </button>
          </form>
        )}

        {/* Alternative Roles & Return Link */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 text-xs">
          <button
            type="button"
            onClick={handleFacultyQuickAccess}
            className="text-xs font-semibold text-[#176B4D] hover:underline cursor-pointer"
          >
            Sign in as Faculty / Asatiza Member
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Institute Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
