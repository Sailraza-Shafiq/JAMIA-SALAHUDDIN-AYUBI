import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, X, Bot } from 'lucide-react';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the floating button on the dedicated full-page AI assistant
  if (location.pathname === '/ai-assistant') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden flex flex-col items-end gap-2 group">
      {/* Tooltip on hover */}
      {!isOpen && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#176B4D] text-white text-xs font-semibold rounded-xl shadow-lg border border-[#D6B66C]/40 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-y-1 group-hover:translate-y-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D6B66C]" />
          <span>Ask Student Support AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}

      {/* Main Circular Floating Button */}
      <button
        onClick={onToggle}
        className={`relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
          isOpen
            ? 'w-12 h-12 bg-white text-[#176B4D] border-2 border-[#176B4D] hover:bg-[#f2f8f5]'
            : 'w-14 h-14 bg-[#176B4D] hover:bg-[#0f4a35] text-[#D6B66C] hover:text-white border-2 border-[#D6B66C] hover:scale-105 active:scale-95'
        }`}
        aria-label="Toggle AI Student Assistant"
        title="Jamia Salahuddin Ayubi AI Student Support"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#176B4D]" />
        ) : (
          <>
            <Bot className="w-7 h-7" />
            {/* Live Indicator Pulse */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6B66C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D6B66C] border-2 border-white items-center justify-center text-[9px] font-bold text-[#176B4D]">
                AI
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
