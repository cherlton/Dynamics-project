import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ProgressBar from './ProgressBar'
import { useUiStore } from '../store/uiStore'

export default function PortalLayout({
  category = 'EXECUTIVE RECRUITMENT & PLACEMENT',
  title = 'Accelerate your career with Dynamics & Gaspar Executive Placement',
  subtitle = 'Complete your guided POPIA-compliant application, parse your CV credentials, and monitor interview schedules in real time.',
  currentStep = null,
  showProgressBar = true,
  children,
}) {
  const location = useLocation()
  const isPopUp = useUiStore((s) => s.isPopUp)
  const setIsPopUp = useUiStore((s) => s.setIsPopUp)
  const shufflePhase = useUiStore((s) => s.shufflePhase)

  const [localShuffle, setLocalShuffle] = useState('in-right')

  // Whenever route or step changes, trigger smooth in-right card entrance
  useEffect(() => {
    if (shufflePhase === 'idle') {
      setLocalShuffle('in-right')
      const timer = setTimeout(() => {
        setLocalShuffle('idle')
      }, 480)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, currentStep])

  // Determine active shuffle animation class
  let animationClass = ''
  if (shufflePhase === 'out-left') {
    animationClass = 'animate-shuffle-out-left'
  } else if (shufflePhase === 'out-right') {
    animationClass = 'animate-shuffle-out-right'
  } else if (shufflePhase === 'in-right' || (shufflePhase === 'idle' && localShuffle === 'in-right')) {
    animationClass = 'animate-shuffle-in-right'
  } else if (shufflePhase === 'in-left') {
    animationClass = 'animate-shuffle-in-left'
  }

  // Handle tap on docked container to immediately stretch into pop-up modal
  const handleDockedContainerClick = () => {
    if (!isPopUp) {
      setIsPopUp(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-800 selection:text-white relative">
      {/* Blurry Backdrop Overlay when in Pop-Up Mode */}
      {isPopUp && (
        <div
          onClick={() => setIsPopUp(false)}
          className="fixed inset-0 z-40 bg-[#0f1b29]/70 backdrop-blur-md transition-all duration-300 ease-out cursor-pointer"
          title="Click blurry background to dock back into page"
        />
      )}

      {/* Top Header bar with recruitment navigation */}
      <Header />

      {/* Main Split Canvas */}
      <div className="relative flex-1">
        {/* Dark Hero Section with Signature Architectural Lower-Left Curve */}
        <div className="gaspar-hero-bg text-white pt-10 pb-20 md:pb-32 lg:pb-40 rounded-bl-[40px] md:rounded-bl-[64px] lg:rounded-bl-[80px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Hero Column */}
              <div className="lg:col-span-5 lg:pr-4 pt-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-300 block mb-3">
                  {category}
                </span>

                <h1 className="formal-heading text-3xl sm:text-4xl lg:text-[42px] leading-[1.18] mb-4 text-white">
                  {title}
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md font-normal">
                  {subtitle}
                </p>

                {/* Left Action Buttons matching recruitment workflow */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                  <Link
                    to="/apply/account?src=linkedin&jobId=job-001"
                    className="bg-white text-[#0f1b29] hover:bg-slate-100 px-5 py-3 transition-colors duration-150 rounded-none shadow-sm"
                    style={{ borderRadius: 0 }}
                  >
                    Open Roles
                  </Link>

                  <a
                    href="tel:+27113023060"
                    className="text-white hover:text-slate-300 transition-colors flex items-center gap-2 underline underline-offset-4 decoration-slate-500"
                  >
                    <span>+27 (0)11 302 3060</span>
                    <span className="text-xs">✆</span>
                  </a>
                </div>
              </div>

              {/* Right column placeholder in dark hero */}
              <div className="hidden lg:block lg:col-span-7" />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Lower Left Editorial Columns (Exclusively on White Canvas with crisp dark text) */}
            <div className="lg:col-span-5 pt-8 lg:pt-10 space-y-7 text-xs text-slate-700 order-2 lg:order-1">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5">
                  Candidate Support & Help Desk
                </h4>
                <p className="leading-relaxed text-slate-600">
                  Questions regarding your application progress, document upload, or interview scheduling? Contact our Talent Acquisition team at{' '}
                  <a
                    href="mailto:talent@dynamics.co.za"
                    className="text-slate-900 underline font-medium hover:text-slate-700"
                  >
                    talent@dynamics.co.za
                  </a>
                  <br />
                  and our candidate support desk will assist promptly.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5">
                  POPIA Information Officer
                </h4>
                <p className="leading-relaxed text-slate-600">
                  In compliance with the Protection of Personal Information Act (POPIA Act 4 of 2013), submit data subject requests (access, correction, deletion) to{' '}
                  <a
                    href="mailto:popia@dynamics.co.za"
                    className="text-slate-900 underline font-medium hover:text-slate-700"
                  >
                    popia@dynamics.co.za
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5">
                  Human-Centered Evaluation (POPIA S71)
                </h4>
                <p className="leading-relaxed text-slate-600">
                  Automated CV parsing is solely an assistive tool. Every candidate application is individually evaluated by an accredited Talent Manager before shortlisting.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider mr-4">
                  Sandton Executive Placement Desk
                </span>
                <span className="space-x-3 text-slate-700 font-medium">
                  <span>Johannesburg</span>
                  <span>•</span>
                  <span>Cape Town</span>
                  <span>•</span>
                  <span>Durban</span>
                </span>
              </div>
            </div>

            {/* Right Column: Docked Position / Card Slot */}
            <div className="lg:col-span-7 order-1 lg:order-2 -mt-16 md:-mt-24 lg:-mt-36">
              {isPopUp ? (
                /* Ghost Placeholder in Page Flow while Form is Popped Up */
                <div
                  onClick={() => setIsPopUp(true)}
                  className="border-2 border-dashed border-slate-300 bg-white/70 backdrop-blur-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm select-none cursor-pointer hover:bg-white/90 transition-all rounded-none"
                  style={{ borderRadius: 0 }}
                  title="Form is currently active in centered pop-up view"
                >
                  <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-3 text-slate-700 font-bold text-lg border border-slate-200">
                    ⤢
                  </div>
                  <span className="font-bold uppercase tracking-wider text-xs text-slate-900 mb-1.5">
                    Form Active in Pop-Up Mode
                  </span>
                  <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
                    Your form is currently expanded in focused pop-up mode with a blurred backdrop. It stays open as you move through all steps.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPopUp(false)
                    }}
                    className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-slate-900 border border-slate-300 px-4 py-2 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                    style={{ borderRadius: 0 }}
                  >
                    ✕ Dock back into page
                  </button>
                </div>
              ) : (
                /* Docked Form Container (Tapping anywhere expands it into pop-up) */
                <div
                  onClick={handleDockedContainerClick}
                  className={`bg-white border border-slate-200/90 hover:border-slate-400 shadow-2xl p-6 sm:p-8 md:p-10 rounded-none transition-all duration-200 cursor-pointer group ${animationClass}`}
                  style={{ borderRadius: 0 }}
                  title="Tap or click anywhere to expand into pop-up"
                >
                  {/* Header Hint Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 select-none">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 bg-slate-100 group-hover:bg-slate-200 px-2.5 py-1 border border-slate-200 transition-colors">
                      <span>⤢</span> Tap container to pop up
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 group-hover:text-slate-900 font-semibold underline">
                      Expand View ↗
                    </span>
                  </div>

                  {/* Progress bar maintained cleanly at the top of the form */}
                  {showProgressBar && currentStep !== null && (
                    <ProgressBar currentStep={currentStep} />
                  )}

                  {/* Main Form Fields Content */}
                  <div className="form-content">
                    {children}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Centered Stretched Pop-Up Modal when isPopUp is true */}
      {isPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 pointer-events-none overflow-hidden">
          <div
            className={`pointer-events-auto w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white border border-slate-300 shadow-2xl p-6 sm:p-8 md:p-10 rounded-none animate-popup-stretch ${animationClass}`}
            style={{ borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pop-Up Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 select-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1">
                  ● Pop-Up Mode Active
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  (Persists across form steps)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPopUp(false)}
                className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-slate-900 border border-slate-300 px-3 py-1 bg-white hover:bg-slate-50 transition-colors"
                style={{ borderRadius: 0 }}
                title="Dock back into page"
              >
                ✕ Dock into page
              </button>
            </div>

            {/* Progress bar maintained cleanly inside the pop-up */}
            {showProgressBar && currentStep !== null && (
              <ProgressBar currentStep={currentStep} />
            )}

            {/* Main Form Fields Content */}
            <div className="form-content">
              {children}
            </div>
          </div>
        </div>
      )}

      {/* Formal Comprehensive Footer relating directly to recruitment requirements */}
      <Footer />
    </div>
  )
}
