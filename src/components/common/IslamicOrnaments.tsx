import React from 'react';

// Elegant SVG Rehal with Open Quran on decorative stand
export const RehalQuranIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 160 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft celestial glow */}
    <ellipse cx="80" cy="70" rx="60" ry="45" fill="url(#rehalGlow)" opacity="0.6" />
    
    {/* Wooden Rehal base */}
    <path
      d="M32 104L72 74L80 80L40 110L32 104Z"
      fill="#8D5B28"
    />
    <path
      d="M128 104L88 74L80 80L120 110L128 104Z"
      fill="#704318"
    />
    <path
      d="M40 110L80 80L88 86L48 116L40 110Z"
      fill="#A46E37"
    />
    <path
      d="M120 110L80 80L72 86L112 116L120 110Z"
      fill="#593412"
    />

    {/* Quran Book Pages */}
    {/* Left Page */}
    <path
      d="M80 72C65 62 44 60 22 66C20 67 18 69 18 72V96C18 99 21 101 24 100C45 95 65 97 80 106V72Z"
      fill="#FEFEFE"
      stroke="#DDF3FF"
      strokeWidth="1.5"
    />
    {/* Right Page */}
    <path
      d="M80 72C95 62 116 60 138 66C140 67 142 69 142 72V96C142 99 139 101 136 100C115 95 95 97 80 106V72Z"
      fill="#F8FCFF"
      stroke="#DDF3FF"
      strokeWidth="1.5"
    />

    {/* Center Binding Line */}
    <path d="M80 72V106" stroke="#43B433" strokeWidth="2.5" strokeLinecap="round" />

    {/* Quran Text Lines Simulation */}
    <path d="M30 75C42 72 58 73 70 79" stroke="#0EAAFC" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M28 82C40 79 56 80 70 86" stroke="#0877B9" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M28 89C40 86 56 87 70 93" stroke="#43B433" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    <path d="M130 75C118 72 102 73 90 79" stroke="#0EAAFC" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M132 82C120 79 104 80 90 86" stroke="#0877B9" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M132 89C120 86 104 87 90 93" stroke="#43B433" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Bookmark Ribbon */}
    <path
      d="M80 106L85 124L80 120L75 124L80 106Z"
      fill="#43B433"
    />

    <defs>
      <radialGradient id="rehalGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 70) rotate(90) scale(45 60)">
        <stop stopColor="#BFE8FF" stopOpacity="0.8" />
        <stop offset="0.6" stopColor="#DDF5E5" stopOpacity="0.4" />
        <stop offset="1" stopColor="#D8F7F1" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Subtle Islamic Mosque Silhouette for headers and cards
export const MosqueSilhouette: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-32 h-20',
  opacity = 0.15,
}) => (
  <svg
    viewBox="0 0 200 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    {/* Left Minaret */}
    <rect x="18" y="25" width="8" height="75" rx="2" />
    <polygon points="22,10 16,25 28,25" />
    <circle cx="22" cy="8" r="2" />

    {/* Right Minaret */}
    <rect x="174" y="25" width="8" height="75" rx="2" />
    <polygon points="178,10 172,25 184,25" />
    <circle cx="178" cy="8" r="2" />

    {/* Center Grand Dome */}
    <path d="M70 100V55C70 38 84 25 100 20C116 25 130 38 130 55V100H70Z" />
    {/* Crescent on top of dome */}
    <path d="M100 10A5 5 0 1 1 103 18A4 4 0 1 0 100 10Z" />

    {/* Side Small Domes */}
    <path d="M38 100V65C38 52 48 44 60 40C72 44 76 52 76 65V100H38Z" />
    <path d="M124 100V65C124 52 128 44 140 40C152 44 162 52 162 65V100H124Z" />

    {/* Arches */}
    <path d="M90 100V75C90 68 95 64 100 64C105 64 110 68 110 75V100H90Z" fill="var(--bg-card, #ffffff)" />
  </svg>
);

// Delicate Arabesque Geometric Corner Motif
export const IslamicCornerMotif: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-24 h-24',
  opacity = 0.12,
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <path
      d="M10 0C10 45 45 80 90 80"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="3 3"
    />
    <path
      d="M0 10C45 10 80 45 80 90"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 30V70M30 50H70" stroke="currentColor" strokeWidth="1.5" />
    <polygon points="50,38 59,50 50,62 41,50" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

// Circular Tilawah Progress Gauge (exactly matching Reference Screen 1)
export const TilawahProgressGauge: React.FC<{
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}> = ({ current, target, size = 110, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTarget = Math.max(1, target);
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-subtle, #E5E7EB)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active Gradient Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#tilawahGaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="tilawahGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EAAFC" />
            <stop offset="100%" stopColor="#43B433" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none">
          {current}
        </span>
        <span className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">
          / {target} ayat
        </span>
      </div>
    </div>
  );
};
