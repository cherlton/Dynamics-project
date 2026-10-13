export default function SystemLogo({ light = true, className = '' }) {
  const textColor = light ? 'text-white' : 'text-[#0f1b29]'
  const subColor = light ? 'text-slate-400' : 'text-slate-500'
  const iconFill = light ? '#ffffff' : '#0f1b29'

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Canopy / Arch Crest inspired by the Gaspar motif */}
      <svg
        className="w-7 h-7 flex-shrink-0"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Gaspar System Emblem"
      >
        {/* Canopy / Dome */}
        <path
          d="M16 4C8.82 4 3 9.82 3 17C3 17.55 3.45 18 4 18H28C28.55 18 29 17.55 29 17C29 9.82 23.18 4 16 4Z"
          fill={iconFill}
        />
        {/* Center stem / pillar */}
        <path
          d="M15 18H17V26C17 27.1 16.1 28 15 28C13.9 28 13 27.1 13 26H15V18Z"
          fill={iconFill}
        />
        {/* Subtle geometric dot accent */}
        <circle cx="16" cy="12" r="1.5" fill={light ? '#0f1b29' : '#ffffff'} />
      </svg>

      <div className="flex flex-col leading-none">
        <span className={`font-serif tracking-tight text-xl font-semibold lowercase ${textColor}`} style={{ letterSpacing: '-0.03em' }}>
          gaspar
        </span>
        <span className={`text-[8.5px] font-sans uppercase tracking-[0.2em] font-medium mt-0.5 ${subColor}`}>
          dynamics talent
        </span>
      </div>
    </div>
  )
}
