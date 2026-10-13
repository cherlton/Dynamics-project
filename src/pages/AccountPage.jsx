import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useEmailStore } from '../store/emailStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

const COMMON_PASSWORDS = ['Password123!', 'Welcome123!', 'Admin12345!', 'P@ssword123', 'Password10!']

export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { application, updateApplication, updateDetails, updateConsents } = useApplicationStore()
  const register = useAuthStore(s => s.register)
  const sendEmail = useEmailStore(s => s.sendEmail)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const src = searchParams.get('src') || application.source || 'linkedin'
  const jobId = searchParams.get('jobId') || application.jobId || 'job-001'

  const [email, setEmail] = useState(application.details.email || '')
  const [confirmEmail, setConfirmEmail] = useState(application.details.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(application.consents.termsAccepted || false)
  const [privacyAccepted, setPrivacyAccepted] = useState(application.consents.privacyAccepted || false)
  const [talentPool, setTalentPool] = useState(application.consents.talentPool || false)
  const [marketing, setMarketing] = useState(application.consents.marketing || false)
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password rules validation
  const rules = useMemo(() => {
    return {
      length: password.length >= 10,
      casing: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notEmail: email ? !password.toLowerCase().includes(email.split('@')[0]?.toLowerCase()) : true,
      notCommon: !COMMON_PASSWORDS.includes(password),
    }
  }, [password, email])

  const allRulesPassed = Object.values(rules).every(Boolean)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const emailsMatch = email && confirmEmail && email.toLowerCase() === confirmEmail.toLowerCase()
  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const canProceed = emailValid && emailsMatch && allRulesPassed && passwordsMatch && termsAccepted && privacyAccepted

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canProceed) return
    setError('')
    setLoading(true)

    updateApplication({ source: src, jobId })
    updateDetails('email', email)
    updateConsents('termsAccepted', termsAccepted)
    updateConsents('privacyAccepted', privacyAccepted)
    updateConsents('talentPool', talentPool)
    updateConsents('marketing', marketing)

    const regRes = register(email, password, email.split('@')[0])
    if (!regRes.success && regRes.error !== 'An account with this email already exists.') {
      setError(regRes.error)
      setLoading(false)
      return
    }

    const verifyToken = 'tok-' + Math.random().toString(36).substring(2, 9)
    sendEmail({
      to: email,
      subject: 'Verify your email for Gaspar Portal',
      type: 'verification',
      body: `Hello,\n\nPlease verify your email address to continue your application for ${application.jobTitle}.\n\nClick the link below or enter this code: ${verifyToken}`,
      link: `/apply/verify-email/confirm?token=${verifyToken}&email=${encodeURIComponent(email)}`,
    })

    setLoading(false)
    shuffleNavigate(navigate, `/apply/verify-email?email=${encodeURIComponent(email)}`, 'forward')
  }

  return (
    <PortalLayout
      category="STEP 0 — CANDIDATE ACCOUNT CREATION"
      title="Start your executive placement application"
      subtitle="Create your secure profile with POPIA-compliant consent to submit credentials, upload your CV, and track selection status."
      showProgressBar={false}
    >
      <div>
        {/* Step Header */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Step 1 of 2 — Registration</span>
            <span className="text-[#0f1b29] font-medium">Position: {application.jobTitle}</span>
          </div>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Create your account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please enter your primary email and secure password to start your formal candidate profile.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-300 text-xs text-red-800 rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email inputs (compact small to medium) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="input-label" htmlFor="email">
                First name & Email address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                placeholder="name@example.co.za"
                className={`input-field ${touched.email && !emailValid ? 'error' : ''}`}
                required
              />
              {touched.email && !emailValid && (
                <p className="text-[11px] text-danger mt-1">Please enter a valid email address.</p>
              )}
            </div>

            <div>
              <label className="input-label" htmlFor="confirmEmail">
                Confirm email address *
              </label>
              <input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, confirmEmail: true }))}
                placeholder="Confirm your email"
                className={`input-field ${touched.confirmEmail && !emailsMatch ? 'error' : ''}`}
                required
              />
              {touched.confirmEmail && !emailsMatch && (
                <p className="text-[11px] text-danger mt-1">Email addresses do not match.</p>
              )}
            </div>
          </div>

          {/* Password inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="input-label mb-0" htmlFor="password">
                  Security Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] uppercase font-semibold text-slate-500 hover:text-slate-800 tracking-wider"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                placeholder="Create a strong password"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="input-label" htmlFor="confirmPassword">
                Confirm password *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
                placeholder="Re-enter your password"
                className={`input-field ${touched.confirmPassword && !passwordsMatch ? 'error' : ''}`}
                required
              />
              {touched.confirmPassword && !passwordsMatch && (
                <p className="text-[11px] text-danger mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>

          {/* Password Requirements: Minimal formal list with no AI icons */}
          <div className="p-3 bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-700 block mb-1 text-[11px]">
              Password Requirements
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
              <span className={rules.length ? 'text-[#0f1b29] font-medium' : ''}>
                {rules.length ? '✓' : '—'} At least 10 characters
              </span>
              <span className={rules.casing ? 'text-[#0f1b29] font-medium' : ''}>
                {rules.casing ? '✓' : '—'} Uppercase & lowercase letter
              </span>
              <span className={rules.number ? 'text-[#0f1b29] font-medium' : ''}>
                {rules.number ? '✓' : '—'} At least one number
              </span>
              <span className={rules.special ? 'text-[#0f1b29] font-medium' : ''}>
                {rules.special ? '✓' : '—'} One special character (!@#$)
              </span>
            </div>
          </div>

          {/* POPIA & Consents Section */}
          <div className="pt-2 border-t border-slate-200 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
              POPIA Compliance & Consent
            </span>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded-none border-slate-300 text-[#0f1b29] focus:ring-0"
                style={{ borderRadius: 0 }}
                required
              />
              <span>
                I have read and accept the{' '}
                <Link to="/legal/terms" target="_blank" className="text-slate-900 underline font-medium">
                  Terms and Conditions
                </Link>
                . *
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded-none border-slate-300 text-[#0f1b29] focus:ring-0"
                style={{ borderRadius: 0 }}
                required
              />
              <span>
                I consent to the processing of my personal information under POPIA for recruitment purposes.{' '}
                <Link to="/legal/privacy" target="_blank" className="text-slate-900 underline font-medium">
                  Privacy Notice
                </Link>
                . *
              </span>
            </label>

            <div className="pt-1.5 flex flex-col gap-1.5 text-xs text-slate-600">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={talentPool}
                  onChange={(e) => setTalentPool(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded-none border-slate-300 text-[#0f1b29] focus:ring-0"
                  style={{ borderRadius: 0 }}
                />
                <span className="text-[11px]">
                  <strong>Talent Pool (Optional):</strong> Keep my credentials on file for future executive placements.
                </span>
              </label>
            </div>
          </div>

          {/* Action Button: Rectangular, formal unrounded button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!canProceed || loading}
              className="w-full bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3.5 px-6 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}
            >
              {loading ? 'Creating Candidate Profile...' : 'Create Account & Continue'}
            </button>
          </div>

          {/* Statutory POPIA compliance disclaimer */}
          <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            Dynamics Talent processes the personal information provided strictly in compliance with the Protection of Personal Information Act 4 of 2013 (POPIA) for recruitment and executive placement purposes. For information, review our{' '}
            <Link to="/legal/privacy" className="text-slate-700 underline font-medium">
              Privacy Notice
            </Link>
            .
          </p>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => shuffleNavigate(navigate, '/login', 'backward')}
              className="text-[#0f1b29] font-semibold underline hover:text-slate-700"
            >
              Sign in to your account
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  )
}
