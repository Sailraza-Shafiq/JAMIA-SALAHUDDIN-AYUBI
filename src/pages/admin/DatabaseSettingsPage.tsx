import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, SupabaseHealthCheck, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { JamiaStore } from '../../lib/storage';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Layers,
  Key,
  FolderLock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const DatabaseSettingsPage: React.FC = () => {
  const [url, setUrl] = useState(() => localStorage.getItem('jamia_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(() => localStorage.getItem('jamia_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [health, setHealth] = useState<SupabaseHealthCheck | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const runCheck = async (targetUrl = url, targetKey = anonKey) => {
    setIsChecking(true);
    setSyncFeedback(null);
    const result = await testSupabaseConnection(targetUrl, targetKey);
    setHealth(result);
    setIsChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleSaveAndTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && anonKey) {
      localStorage.setItem('jamia_supabase_url', url);
      localStorage.setItem('jamia_supabase_anon_key', anonKey);
    }
    runCheck(url, anonKey);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleSyncRemoteData = async () => {
    setSyncFeedback('Querying live tables in Supabase...');
    const res = await JamiaStore.syncWithSupabase();
    setSyncFeedback(res.message);
  };

  const tableList = health?.tables ? Object.values(health.tables) : [];
  const existingCount = tableList.filter((t) => t.exists).length;
  const totalTables = 16;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f8f5] text-[#176B4D] border border-[#176B4D]/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Supabase Cloud Integration & Database Security Engine</span>
          </div>
          <h1 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-[#176B4D]">
            Database Architecture & Inspection Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional Enterprise Database · Jamia Salahuddin Ayubi (Director General: Muneeb ur Rehman)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runCheck()}
            disabled={isChecking}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Inspecting...' : 'Re-check Connection'}</span>
          </button>
          <button
            onClick={handleSyncRemoteData}
            className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Sync Live Records</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium flex items-center justify-between">
          <span>{syncFeedback}</span>
          <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase">Synchronized</span>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credentials Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-4 h-4 text-[#176B4D]" />
            <h2 className="font-bold text-slate-900 text-sm">Supabase Credentials</h2>
          </div>

          <form onSubmit={handleSaveAndTest} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 bg-[#f8faf9] border border-slate-200 rounded-xl font-mono text-[11px] focus:border-[#176B4D] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <textarea
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 bg-[#f8faf9] border border-slate-200 rounded-xl font-mono text-[10px] focus:border-[#176B4D] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="w-full py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D6B66C]" />
              <span>Save & Verify Connection</span>
            </button>
          </form>

          {/* Quick Connection Diagnosis */}
          <div className="pt-3 border-t border-slate-100 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span>Status:</span>
              <span className={`font-bold flex items-center gap-1 ${health?.connected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {health?.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {health?.connected ? 'Online' : 'Pending Verification'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Tables Provisioned:</span>
              <span className="font-mono font-bold text-slate-800">
                {existingCount} / {totalTables}
              </span>
            </div>
            <div className="text-slate-400 text-[10px] leading-relaxed">
              {health?.message || 'Awaiting initial ping...'}
            </div>
          </div>
        </div>

        {/* 16 Modules Table Inspection Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#176B4D]" />
              <h2 className="font-bold text-slate-900 text-sm">
                16 Database Tables & Schema Health
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#176B4D] bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/20">
              {existingCount} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {tableList.map((tbl) => (
              <div
                key={tbl.name}
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                  tbl.exists
                    ? 'bg-[#f2f8f5]/60 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tbl.exists ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-bold text-slate-800 text-[11px] block">
                      {tbl.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {tbl.exists ? `${tbl.count} records stored` : 'Not provisioned yet'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    tbl.exists ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tbl.exists ? 'RLS Active' : 'Pending SQL'}
                </span>
              </div>
            ))}

            {tableList.length === 0 && (
              <div className="col-span-2 py-10 text-center text-slate-400 text-xs">
                Enter Supabase credentials above to inspect live tables.
              </div>
            )}
          </div>

          {/* 4 Storage Buckets Inspection */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider block">
              Storage Buckets (RLS & Access Rules)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'student-photos', type: 'Public Read' },
                { name: 'staff-photos', type: 'Public Read' },
                { name: 'admission-documents', type: 'Private Auth' },
                { name: 'promotional-media', type: 'Public Read' },
              ].map((b) => (
                <div key={b.name} className="p-2 bg-[#f8faf9] rounded-xl border border-slate-200 text-left">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <FolderLock className="w-3.5 h-3.5 text-[#176B4D]" />
                    <span className="font-mono text-[10px] font-bold truncate">{b.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{b.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Production SQL Schema Copy Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">
              Complete Production SQL Schema (All 16 Tables + RLS Policies + Storage DDL)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy this schema directly into the Supabase SQL Editor to provision all tables and security policies with zero errors.
            </p>
          </div>

          <button
            onClick={handleCopySchema}
            className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-[#D6B66C]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSchema ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
          {SUPABASE_SQL_SCHEMA}
        </pre>
      </div>
    </div>
  );
};
