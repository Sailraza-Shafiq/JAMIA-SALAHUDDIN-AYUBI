import React, { useState, useEffect, useRef } from 'react';
import { JamiaStore, subscribeToStore } from '../../lib/storage';
import { Student } from '../../types';
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import jsQR from 'jsqr';

interface ScanLogEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  time: string;
  status: 'verified' | 'flagged';
  notes?: string;
}

export const QRScannerPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => JamiaStore.getStudents());
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanLogs, setScanLogs] = useState<ScanLogEntry[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setStudents(JamiaStore.getStudents());
    });
    return unsub;
  }, []);

  // Web Audio Synthetic Chime
  const playChime = (success: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(220.0, ctx.currentTime);
        osc.frequency.setValueAtTime(196.0, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio autoplay may be constrained
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        startScanningLoop();
      }
    } catch (err: any) {
      setCameraError(err.message || 'Camera permission denied or camera device busy.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Frame processing loop with jsQR
  const startScanningLoop = () => {
    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code && code.data) {
              handleProcessScannedCode(code.data);
              // Delay next scan slightly to prevent frame stutter
              setTimeout(() => {
                if (isCameraActive) {
                  animationFrameRef.current = requestAnimationFrame(tick);
                }
              }, 1200);
              return;
            }
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  // Match scanned token or manual input to student record
  const handleProcessScannedCode = (inputData: string) => {
    const clean = inputData.trim().toUpperCase();

    // Look up by roll number, admission number, or encoded token
    const student = students.find((s) => {
      const matchRoll = s.rollNumber.toUpperCase() === clean;
      const matchAdm = s.admissionNumber.toUpperCase() === clean;
      const secureToken = `JSA-SEC-${btoa(s.rollNumber).replace(/=/g, '').slice(0, 10).toUpperCase()}`;
      const matchToken = clean.includes(secureToken) || clean === secureToken;
      return matchRoll || matchAdm || matchToken;
    });

    if (student) {
      setVerifiedStudent(student);
      playChime(true);
      setVerificationFeedback({
        type: 'success',
        message: `Verified: ${student.fullName} (${student.rollNumber}) · ${student.department}`,
      });

      // Mark daily attendance if today
      const today = new Date().toISOString().slice(0, 10);
      try {
        JamiaStore.markSingleStudentAttendance({
          studentId: student.id,
          rollNumber: student.rollNumber,
          studentName: student.fullName,
          date: today,
          classId: student.currentYear || student.department,
          course: student.department,
          gender: student.gender,
          status: 'present',
          method: 'qr_scan',
          notes: 'QR Gate Scan',
          markedBy: 'Gatekeeper Proctor',
        });
      } catch {
        // ignore
      }

      // Add to Scan Log
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setScanLogs((prev) => [
        {
          id: 'log-' + Date.now(),
          studentId: student.id,
          studentName: student.fullName,
          rollNumber: student.rollNumber,
          department: student.department,
          time: now,
          status: 'verified',
        },
        ...prev.slice(0, 29),
      ]);
    } else {
      playChime(false);
      setVerificationFeedback({
        type: 'error',
        message: `No matching enrolled student found for credential "${clean}".`,
      });
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessScannedCode(manualInput);
    setManualInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Module Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5ece8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f8f5] text-[#176B4D] font-bold text-xs uppercase tracking-wider mb-2 border border-[#176B4D]/20">
            <QrCode className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>Module 5 · Gate Verification Terminal</span>
          </div>
          <h1 className="font-serif-heading font-extrabold text-2xl text-[#176B4D]">
            Student QR Code Scanner & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time optical camera scanner for student CR80 PVC ID cards, admission slips, and instant gate verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              soundEnabled ? 'bg-[#f2f8f5] text-[#176B4D] border-[#176B4D]/30' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title="Toggle Chime Feedback Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#176B4D]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#D6B66C]" />
              <span>Start Camera Scanner</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Scanner Terminal (Left) & Verification Card / Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport & Manual Input (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Camera Box */}
          <div className="bg-black rounded-3xl overflow-hidden relative shadow-md aspect-4/3 flex items-center justify-center border-2 border-[#176B4D]">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target Bounding Box Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                  <div className="w-64 h-64 border-2 border-[#D6B66C] rounded-2xl relative shadow-2xl flex items-center justify-center">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#176B4D] rounded-tl" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#176B4D] rounded-tr" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#176B4D] rounded-bl" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#176B4D] rounded-br" />

                    <div className="w-full h-0.5 bg-[#D6B66C] opacity-80 animate-pulse" />
                    <span className="absolute bottom-3 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                      Align Student ID QR Code Here
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-3 text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#D6B66C]">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heading font-bold text-lg text-white">
                  Camera Feed Inactive
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Click &ldquo;Start Camera Scanner&rdquo; above to request camera permission and initiate live QR code gate scanning.
                </p>
                {cameraError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-xs text-rose-300 max-w-sm mx-auto">
                    {cameraError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manual Input Fallback Strip */}
          <div className="bg-white rounded-2xl p-4 border border-[#e5ece8] shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Manual ID or Roll Number Verification Fallback
            </span>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter Student Roll No (e.g. JSA-2026-101)..."
                  className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] border border-[#e5ece8] rounded-xl text-xs font-mono font-medium focus:border-[#176B4D] outline-none uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#176B4D] hover:bg-[#0f4a35] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                Verify ID
              </button>
            </form>
          </div>

          {/* Status Feedback Banner */}
          {verificationFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
                verificationFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {verificationFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{verificationFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Right Column: Verified Student Dossier & Recent Gate Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Verified Dossier */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#D6B66C] shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span>Gate Authentication Result</span>
              </span>
              {verifiedStudent && (
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  AUTHENTICATED
                </span>
              )}
            </div>

            {verifiedStudent ? (
              <div className="space-y-4 text-xs">
                {/* Student Photo & Identity Lockup */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[#176B4D] bg-slate-100 shrink-0 shadow-sm">
                    {verifiedStudent.photoUrl ? (
                      <img
                        src={verifiedStudent.photoUrl}
                        alt={verifiedStudent.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="font-serif-heading font-extrabold text-base text-slate-900 truncate">
                      {verifiedStudent.fullName}
                    </h3>
                    {verifiedStudent.urduName && (
                      <span className="font-arabic text-sm text-[#176B4D] font-bold block">
                        {verifiedStudent.urduName}
                      </span>
                    )}
                    <div className="text-slate-500 text-[11px]">
                      Father: <strong>{verifiedStudent.fatherName}</strong>
                    </div>
                    <div className="inline-block font-mono text-[11px] font-bold text-[#176B4D] bg-[#f2f8f5] px-2 py-0.5 rounded border border-[#176B4D]/30">
                      {verifiedStudent.rollNumber}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#f8faf9] rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Department / Course:</span>
                    <strong className="text-slate-800">{verifiedStudent.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Class / Year:</span>
                    <strong className="text-slate-800">{verifiedStudent.currentYear}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Campus Wing:</span>
                    <strong className="capitalize text-slate-800">
                      {verifiedStudent.gender === 'female' ? 'Bannat (بنات)' : 'Banin (بنین)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Boarding Status:</span>
                    <strong className="capitalize text-slate-800">
                      {verifiedStudent.boardingStatus.replace('_', ' ')}
                    </strong>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center justify-between font-bold text-xs">
                  <span>Enrolled Student Status:</span>
                  <span className="uppercase text-[11px]">{verifiedStudent.status}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs">No active scan loaded.</p>
                <p className="text-[11px] text-slate-400">
                  Scan a QR code or enter a roll number to view student credentials.
                </p>
              </div>
            )}
          </div>

          {/* Today's Gate Log Stream */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ece8] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>Today&apos;s Gate Log ({scanLogs.length})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Stream</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs">
              {scanLogs.length > 0 ? (
                scanLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-xl bg-[#f8faf9] border border-slate-100 flex items-center justify-between gap-2 text-[11px]"
                  >
                    <div className="min-w-0">
                      <strong className="block text-slate-800 truncate">{log.studentName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{log.rollNumber} · {log.department}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10px] text-slate-500 block">{log.time}</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        ENTRY OK
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[11px] text-slate-400">
                  No gate scans logged yet today.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
