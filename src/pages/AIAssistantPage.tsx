import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JamiaLogo } from '../components/JamiaLogo';
import { JamiaStore } from '../lib/storage';
import {
  Sparkles,
  Bot,
  User,
  Send,
  RefreshCw,
  BookOpen,
  GraduationCap,
  CreditCard,
  Building,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  FileText,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const settings = JamiaStore.getSettings();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh!\n\nWelcome to the official AI Student Support Assistant for Jamia Salahuddin Ayubi (جامعة صلاح الدين الأيوبي), established and directed under the leadership of Muneeb ur Rehman.\n\nI am equipped with verified institutional information and can help you with:\n1. 🏛️ Institute Introduction & Mission\n2. 📖 Courses: Hifz-ul-Quran & Nazra Quran\n3. ⚖️ Shariyat Course & Practical Islamic Jurisprudence\n4. 📝 Admission Procedure & Application Tracking\n5. 📄 Required Admission Documents\n6. 🏫 Campus Facilities (Hostels, Quran Halqas, Library, Masjid, Wudu, Dining)\n7. 📞 Contact Information & Administration\n8. 🎓 General Student Guidance & Islamic Adab\n\nYou are welcome to ask questions in English, Urdu (اردو), or Roman Urdu. How may I assist your educational journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Categorized authentic prompts matching all required topics
  const PROMPT_CATEGORIES = [
    { id: 'all', label: 'All Topics' },
    { id: 'intro', label: 'Institute Intro' },
    { id: 'courses', label: 'Hifz & Nazra' },
    { id: 'shariyat', label: 'Shariyat Course' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'contact', label: 'Contact & Leadership' },
    { id: 'guidance', label: 'Student Guidance' },
    { id: 'urdu', label: 'اردو رہنمائی' },
  ];

  const QUICK_PROMPTS = [
    {
      cat: 'intro',
      title: 'Institute Introduction',
      query: 'What is Jamia Salahuddin Ayubi and what is its founding educational vision?',
    },
    {
      cat: 'courses',
      title: 'Hifz & Nazra Structure',
      query: 'Explain the Hifz-ul-Quran and Nazra Quran programs, including Tajweed and daily Sabaq/Sabqi.',
    },
    {
      cat: 'shariyat',
      title: 'Shariyat Course Syllabus',
      query: 'What topics and rulings are taught in the specialized Shariyat Course?',
    },
    {
      cat: 'admissions',
      title: 'Admission Procedure',
      query: 'What is the complete online and on-campus admission procedure for new students?',
    },
    {
      cat: 'documents',
      title: 'Required Documents',
      query: 'Which personal and educational documents must be submitted with the admission form?',
    },
    {
      cat: 'facilities',
      title: 'Hostel & Campus Facilities',
      query: 'What facilities are available for students regarding boarding, Quran learning halaqahs, and library?',
    },
    {
      cat: 'contact',
      title: 'Official Contact Desk',
      query: 'What are the official contact numbers, email, and campus address for Jamia Salahuddin Ayubi?',
    },
    {
      cat: 'guidance',
      title: 'Student Adab & Routine',
      query: 'What general advice and daily routine guidance is recommended for madrasa students?',
    },
    {
      cat: 'urdu',
      title: 'داخلہ کی شرائط (اردو)',
      query: 'جامعہ صلاح الدین ایوبی میں داخلے کے لیے کیا دستاویزات اور طریقہ کار درکار ہے؟',
    },
    {
      cat: 'urdu',
      title: 'شریعت کورس اور حفظ (Roman Urdu)',
      query: 'Jamia Salahuddin Ayubi mein Hifz aur Shariyat course ki kya tafseelat hain?',
    },
  ];

  const filteredPrompts =
    activeCategory === 'all'
      ? QUICK_PROMPTS
      : QUICK_PROMPTS.filter((p) => p.cat === activeCategory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your current conversation history?')) {
      setMessages([
        {
          id: 'm-welcome-' + Date.now(),
          sender: 'bot',
          text: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh!\n\nConversation reset. How may I assist your inquiries regarding Jamia Salahuddin Ayubi today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();
      const botReply =
        data.reply ||
        'Assalamu Alaikum wa Rahmatullahi wa Barakatuh. How else may I assist your studies at Jamia Salahuddin Ayubi?';

      setMessages((prev) => [
        ...prev,
        {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: 'Assalamu Alaikum. I am temporarily unable to reach the academic knowledge server. You may consult the Admissions Office directly (+92 51 5566778) or reach out to Director Muneeb ur Rehman.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5ece8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfaf2] border border-[#D6B66C] text-[#b89344] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#b89344]" />
            <span>AI Student Support Assistant · Jamia Salahuddin Ayubi</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#176B4D]">
            AI Student Support Assistant
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
            Interactive, verified academic counselor answering inquiries about admissions, Hifz, Nazra, Shariyat, facilities, and student life in English, Urdu, and Roman Urdu.
          </p>
        </div>

        {/* Leadership & Model Info Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-3 bg-white rounded-2xl border border-[#e5ece8] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#176B4D] text-[#D6B66C] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-[#D6B66C]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Management Verified
              </span>
              <span className="text-xs font-bold text-[#176B4D] block">
                Director: {settings.directorName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chatbot Console (8 Cols) + Verified Knowledge Portal (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Chat Console */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-[#176B4D]/30 shadow-xl overflow-hidden flex flex-col h-[740px]">
          {/* Chat Window Header */}
          <div className="bg-[#176B4D] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#D6B66C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6B66C] text-[#176B4D] flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-6 h-6 text-[#176B4D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-heading font-bold text-base">
                    Jamia Salahuddin Ayubi Assistant
                  </h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="font-arabic text-xs text-emerald-100 block">
                  جامعة صلاح الدين الأيوبي · المساعد الطلابي الذكي
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Prompt Category Filter Bar */}
          <div className="bg-[#f8faf9] px-4 py-2 border-b border-[#e5ece8] flex gap-1.5 overflow-x-auto scrollbar-thin">
            {PROMPT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#176B4D] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-[#176B4D] hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-white px-4 py-2 border-b border-[#e5ece8] flex gap-2 overflow-x-auto scrollbar-thin">
            {filteredPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium bg-[#fdfaf2] text-[#176B4D] hover:bg-[#176B4D] hover:text-white border border-[#D6B66C]/40 rounded-xl transition-all shrink-0 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <span className="font-bold text-[#b89344] mr-1.5">[{p.title}]</span>
                <span>{p.query.slice(0, 38)}...</span>
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fbfdfc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#176B4D] text-white'
                      : 'bg-[#D6B66C] text-[#176B4D]'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#176B4D] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-[#e5ece8] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/30">
                    <span
                      className={`text-[10px] ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="text-slate-400 hover:text-[#176B4D] transition-colors p-1 rounded-md cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-600 text-xs py-2.5 px-4 bg-white rounded-2xl border border-slate-200 w-fit shadow-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-[#176B4D]" />
                <span>Consulting verified Jamia Salahuddin Ayubi syllabus and records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Operational Notice */}
          <div className="bg-[#fdfaf2] px-4 py-1.5 border-t border-[#D6B66C]/30 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5 text-[#b89344] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b89344]" />
              <span>Verified Data Only · No Fabricated Dues · Directed by Muneeb ur Rehman</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">English · اردو · Roman Urdu</span>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-white border-t border-[#e5ece8] flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, Hifz, Shariyat course, documents, facilities..."
              className="flex-1 px-4 py-3 text-sm bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-[#176B4D] hover:bg-[#0f4a35] text-[#D6B66C] hover:text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
              title="Send Message"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Verified Knowledge Base & Navigation Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Direct Navigation Links */}
          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
            <h3 className="font-serif-heading font-bold text-base text-[#176B4D] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D6B66C]" />
              <span>Official Institutional Links</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/admissions/apply"
                className="flex items-center justify-between p-3 rounded-xl bg-[#f2f8f5] hover:bg-[#e5ece8] text-[#176B4D] font-bold text-xs transition-all border border-[#176B4D]/20"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#176B4D]" />
                  <span>Online Admission Form</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  Open
                </span>
              </Link>

              <Link
                to="/courses"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#176B4D]" />
                  <span>View All 8 Courses</span>
                </div>
                <span className="text-[10px] text-slate-500">Syllabi</span>
              </Link>

              <Link
                to="/facilities"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-[#176B4D]" />
                  <span>Campus Facilities</span>
                </div>
                <span className="text-[10px] text-slate-500">Hostel & Labs</span>
              </Link>

              <Link
                to="/id-cards"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#176B4D]" />
                  <span>Student ID Card Generator</span>
                </div>
                <span className="text-[10px] text-slate-500">QR Verified</span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#176B4D]" />
                  <span>Contact Management Office</span>
                </div>
                <span className="text-[10px] text-slate-500">Desk</span>
              </Link>
            </div>
          </div>

          {/* Verified Topics Covered Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#e5ece8] shadow-xs space-y-4">
            <h3 className="font-serif-heading font-bold text-base text-[#176B4D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D6B66C]" />
              <span>Verified Inquiries Answered</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 space-y-1">
                <strong className="text-slate-900 block font-semibold">1. Hifz & Nazra Quran</strong>
                <p>Systematic memorization (Sabaq, Sabqi, Manzil), certified Qaris, and recitation rules.</p>
              </div>

              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 space-y-1">
                <strong className="text-slate-900 block font-semibold">2. Shariyat Course</strong>
                <p>Daily Fiqh, Taharah, Salah, Zakat, Sawm, and foundational Islamic jurisprudence.</p>
              </div>

              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 space-y-1">
                <strong className="text-slate-900 block font-semibold">3. Admissions & Documents</strong>
                <p>Online application procedure, tracking numbers, photographs, and CNIC/B-Form requirements.</p>
              </div>

              <div className="p-3 bg-[#f8faf9] rounded-xl border border-slate-100 space-y-1">
                <strong className="text-slate-900 block font-semibold">4. Boarding & Facilities</strong>
                <p>Clean Wudu areas, spacious Masjid, residential hostels, dining, and IT facilities.</p>
              </div>
            </div>
          </div>

          {/* Strict Policy & Management Card */}
          <div className="bg-gradient-to-br from-[#176B4D] to-[#0f4a35] text-white rounded-3xl p-6 border-2 border-[#D6B66C] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D6B66C] uppercase tracking-wider">
                Management Notice
              </span>
              <AlertCircle className="w-4 h-4 text-[#D6B66C]" />
            </div>

            <h4 className="font-serif-heading font-bold text-base leading-snug">
              Official Institutional Policy
            </h4>

            <p className="text-xs text-emerald-100 leading-relaxed">
              This assistant adheres strictly to verified facts. Exact fee schedules, scholarship awards, and calendar cut-offs are configured directly by authorized management under Director General Muneeb ur Rehman.
            </p>

            <div className="pt-2 border-t border-emerald-800 text-[11px] text-emerald-200">
              <span>Main Campus Office: +92 51 5566778</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
