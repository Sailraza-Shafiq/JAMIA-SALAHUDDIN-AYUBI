import React from 'react';
import { JamiaStore } from '../lib/storage';

interface JamiaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'gold' | 'monochrome';
  className?: string;
  subtext?: string;
}

export const JamiaLogo: React.FC<JamiaLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'light',
  className = '',
  subtext = 'جامعہ صلاح الدین ایوبی',
}) => {
  const settings = JamiaStore.getSettings();
  const customLogo = settings.customLogoUrl;

  const sizeMap: Record<string, number> = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 104,
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 48;

  // Custom uploaded image if provided by user in settings
  if (customLogo) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogo}
          alt="Jamia Salahuddin Ayubi Official Logo"
          style={{ width: pixelSize, height: pixelSize }}
          className="rounded-full object-cover shadow-sm ring-2 ring-[#D6B66C]/60"
        />
        {showText && (
          <div className="flex flex-col">
            <span className="font-serif-heading font-bold tracking-tight text-[#176B4D] leading-none" style={{ fontSize: Math.max(14, pixelSize * 0.32) }}>
              Jamia Salahuddin Ayubi
            </span>
            <span className="font-arabic text-[#D6B66C] font-semibold text-xs mt-0.5 tracking-wide">
              {subtext}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Official Vector Seal of Jamia Salahuddin Ayubi
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        role="img"
        aria-label="Jamia Salahuddin Ayubi Official Emblem"
      >
        <defs>
          {/* Gradients tailored to #176B4D and #D6B66C */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B7A58" />
            <stop offset="100%" stopColor="#176B4D" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E4B0" />
            <stop offset="50%" stopColor="#D6B66C" />
            <stop offset="100%" stopColor="#B39247" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F4733" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Golden Geometric Star Rings */}
        <circle cx="80" cy="80" r="77" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" opacity="0.9" />
        <circle cx="80" cy="80" r="73" stroke="#D6B66C" strokeWidth="1" strokeDasharray="3 3" fill="none" />

        {/* Emerald Medallion Body */}
        <circle cx="80" cy="80" r="70" fill="url(#emeraldGrad)" filter="url(#softShadow)" />

        {/* Inner Golden Border */}
        <circle cx="80" cy="80" r="64" stroke="url(#goldGrad)" strokeWidth="1.5" fill="none" />

        {/* Islamic Arch & Dome Silhouette */}
        <path
          d="M80 24 C72 32, 60 48, 60 68 L100 68 C100 48, 88 32, 80 24 Z"
          fill="#D6B66C"
          opacity="0.2"
        />

        {/* Golden Minaret & Dome Finial */}
        <path
          d="M80 26 L82 32 L85 34 L82 36 L80 42 L78 36 L75 34 L78 32 Z"
          fill="#FFFFFF"
        />
        <circle cx="80" cy="22" r="2.5" fill="url(#goldGrad)" />

        {/* Golden Crescent & Star */}
        <path
          d="M80 43 C87 43 92 48 92 55 C92 62 86 67 79 67 C75 67 72 65 70 63 C75 64 80 61 80 55 C80 49 76 45 71 45 C73 44 77 43 80 43 Z"
          fill="url(#goldGrad)"
        />
        {/* Star */}
        <polygon
          points="83,50 84.5,53.5 88,54 85.5,56 86,59.5 83,57.5 80,59.5 80.5,56 78,54 81.5,53.5"
          fill="#FFFFFF"
        />

        {/* Open Holy Quran (المصحف الشریف) */}
        <g transform="translate(80, 84)">
          {/* Left Book Page */}
          <path
            d="M-28 -4 C-15 -10, -5 -6, 0 2 L0 18 C-5 11, -15 7, -28 13 Z"
            fill="#FFFFFF"
            stroke="#D6B66C"
            strokeWidth="1.2"
          />
          {/* Right Book Page */}
          <path
            d="M28 -4 C15 -10, 5 -6, 0 2 L0 18 C5 11, 15 7, 28 13 Z"
            fill="#FFFFFF"
            stroke="#D6B66C"
            strokeWidth="1.2"
          />
          {/* Quranic Text lines indicator */}
          <line x1="-22" y1="2" x2="-6" y2="-2" stroke="#176B4D" strokeWidth="1" strokeLinecap="round" />
          <line x1="-22" y1="6" x2="-6" y2="2" stroke="#176B4D" strokeWidth="1" strokeLinecap="round" />
          <line x1="6" y1="-2" x2="22" y2="2" stroke="#176B4D" strokeWidth="1" strokeLinecap="round" />
          <line x1="6" y1="2" x2="22" y2="6" stroke="#176B4D" strokeWidth="1" strokeLinecap="round" />

          {/* Wooden Rehal / Book Stand */}
          <path
            d="M-14 16 L-24 28 M14 16 L24 28 M-10 18 L10 26 M10 18 L-10 26"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Foundation Year Banner */}
        <rect x="52" y="122" width="56" height="15" rx="3" fill="#0F4733" stroke="url(#goldGrad)" strokeWidth="1" />
        <text
          x="80"
          y="133"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="0.8"
          fontFamily="sans-serif"
        >
          EST. 2018
        </text>

        {/* Arc Text: Jamia Salahuddin Ayubi (English Top Arc) */}
        <path id="topArc" d="M 26 80 A 54 54 0 0 1 134 80" fill="none" />
        <text fill="#FFFFFF" fontSize="8" fontWeight="700" letterSpacing="1.2" fontFamily="sans-serif">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            JAMIA SALAHUDDIN AYUBI
          </textPath>
        </text>

        {/* Arc Text: Arabic Calligraphy (Bottom Arc) */}
        <path id="bottomArc" d="M 134 80 A 54 54 0 0 1 26 80" fill="none" />
        <text fill="#D6B66C" fontSize="10" fontWeight="bold" fontFamily="serif">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            جامعة صلاح الدين الأيوبي
          </textPath>
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-serif-heading font-extrabold tracking-tight leading-tight ${
              variant === 'monochrome' ? 'text-white' : 'text-[#176B4D]'
            }`}
            style={{ fontSize: Math.max(15, pixelSize * 0.32) }}
          >
            Jamia Salahuddin Ayubi
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`font-arabic text-xs font-semibold ${
                variant === 'monochrome' ? 'text-emerald-100' : 'text-[#D6B66C]'
              }`}
            >
              {subtext}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">·</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Edu Ecosystem
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
