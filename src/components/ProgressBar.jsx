const STEPS = ['CV Upload', 'Details', 'Documents', 'Screening', 'Summary']

export default function ProgressBar({ currentStep = 0 }) {
  const percentage = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="mb-6 pb-4 border-b border-slate-200 select-none" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      {/* Mobile step display */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-[#0f1b29]">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]}
          </span>
          <span className="font-mono text-slate-500 font-medium">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-200 rounded-none overflow-hidden">
          <div
            className="h-full bg-[#0f1b29] rounded-none transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop formal step progression */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <div key={step} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center gap-2 relative">
                  {/* Step Square Indicator (Zero rounded edges) */}
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold tracking-tight border transition-all duration-300 rounded-none ${
                      isCurrent
                        ? 'bg-[#0f1b29] text-white border-[#0f1b29]'
                        : isCompleted
                        ? 'bg-slate-200 text-[#0f1b29] border-slate-300'
                        : 'bg-white text-slate-400 border-slate-300'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {isCompleted ? (
                      /* Clean formal checkmark without rounded bubble */
                      <span className="font-bold">✓</span>
                    ) : (
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ${
                      isCurrent
                        ? 'text-[#0f1b29]'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {/* Connecting hairline rule */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-3">
                    <div className="h-[2px] bg-slate-200 rounded-none overflow-hidden">
                      <div
                        className={`h-full bg-[#0f1b29] rounded-none transition-all duration-500 ease-out ${
                          index < currentStep ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
