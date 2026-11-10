import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Bot,
  User,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, initialMessage }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh!\n\nWelcome to Jamia Salahuddin Ayubi's AI Student Support Assistant, founded and directed by Muneeb ur Rehman.\n\nI can assist you with:\n• Institute Introduction & Mission\n• Hifz-ul-Quran & Nazra Quran Courses\n• Shariyat Course & Dars-e-Nizami\n• Online Admission Procedure & Tracking\n• Required Admission Documents\n• Campus Facilities (Hostels, Wudu, Classrooms)\n• Contact & Management Information\n• General Student Guidance & Islamic Adab\n\nHow can I help you today? (You may ask in English, Urdu اردو, or Roman Urdu).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    { label: 'Institute Intro', q: 'Tell me about Jamia Salahuddin Ayubi and its mission.' },
    { label: 'Hifz & Nazra', q: 'What is the structure of Hifz-ul-Quran and Nazra Quran courses?' },
    { label: 'Shariyat Course', q: 'What topics are covered in the Shariyat Course?' },
    { label: 'Admission Steps', q: 'What is the step-by-step admission procedure?' },
    { label: 'Required Documents', q: 'Which documents are required for admission application?' },
    { label: 'Hostel & Facilities', q: 'What facilities are provided for boarding students?' },
    { label: 'Contact Desk', q: 'How can I contact the institute management or Admissions Office?' },
    { label: 'اردو میں رہنمائی', q: 'جامعہ صلاح الدین ایوبی میں داخلے کا طریقہ کار کیا ہے؟' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();
      const botReply =
        data.reply ||
        'Assalamu Alaikum wa Rahmatullahi wa Barakatuh. How else may I assist your inquiries about Jamia Salahuddin Ayubi?';

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
          text: 'Assalamu Alaikum. I am temporarily unable to connect to the knowledge server. For immediate assistance, please contact the Admissions Office (+92 51 5566778) or reach out to Director Muneeb ur Rehman.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-22 right-4 sm:right-6 z-50 flex flex-col items-end print:hidden">
      {/* Floating Chat Window */}
      <div
        className={`bg-white rounded-3xl shadow-2xl border-2 border-[#176B4D] transition-all duration-300 overflow-hidden flex flex-col ${
          isMinimized ? 'h-14 w-80' : 'w-[94vw] sm:w-[440px] h-[610px] max-h-[85vh]'
        }`}
      >
        {/* Header with Deep Green & Soft Gold Theme */}
        <div className="bg-[#176B4D] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#D6B66C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D6B66C] flex items-center justify-center text-[#176B4D] font-bold shadow-xs">
              <Bot className="w-5 h-5 text-[#176B4D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-heading font-bold text-sm tracking-wide">
                  Student Support AI
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-emerald-100 font-arabic block leading-tight">
                جامعة صلاح الدين الأيوبي · إرشاد أكاديمي
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-emerald-100">
            {/* Open Full Page button */}
            <button
              onClick={() => {
                onClose();
                navigate('/ai-assistant');
              }}
              className="p-1.5 hover:text-[#D6B66C] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Open Dedicated Full Page"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isMinimized && (
          <>
            {/* Operational notice banner */}
            <div className="bg-[#fdfaf2] border-b border-[#D6B66C]/30 px-3.5 py-1.5 flex items-center justify-between text-[10px] text-slate-700">
              <span className="flex items-center gap-1.5 text-[#b89344] font-semibold">
                <Sparkles className="w-3 h-3 text-[#b89344]" />
                <span>Verified Jamia Information Only</span>
              </span>
              <span className="text-slate-500">Muneeb ur Rehman, Director</span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8faf9]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#176B4D] text-white'
                        : 'bg-[#D6B66C] text-[#176B4D]'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#176B4D] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-[#e5ece8] rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-600 text-xs py-2 bg-white px-3.5 rounded-xl border border-slate-200 w-fit shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#176B4D]" />
                  <span>Assistant is consulting verified institute curricula...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips */}
            <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
              {QUICK_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#f2f8f5] text-[#176B4D] hover:bg-[#176B4D] hover:text-white border border-[#176B4D]/20 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about admissions, Hifz, Shariyat, facilities..."
                className="flex-1 px-3.5 py-2 text-xs bg-[#f8faf9] border border-[#e5ece8] focus:border-[#176B4D] focus:ring-2 focus:ring-[#176B4D]/20 rounded-xl outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-[#176B4D] hover:bg-[#0f4a35] text-[#D6B66C] hover:text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
