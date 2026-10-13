import { Check } from 'lucide-react'

const STEPS = ['CV Upload', 'Details', 'Documents', 'Screening', 'Summary']

export default function ProgressBar({ currentStep }) {
  const percentage = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="mb-8" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-700">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </span>
          <span className="text-sm font-medium text-gray-500">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-1">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className="flex items-center flex-1 last:flex-initial"
            >
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : index === currentStep
                        ? 'bg-blue-700 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                  aria-current={index === currentStep ? 'step' : undefined}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium mt-1.5 whitespace-nowrap ${
                    index <= currentStep ? 'text-blue-700' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-3 mt-[-18px]">
                  <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-blue-500 rounded-full transition-all duration-500 ease-out ${
                        index < currentStep ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
