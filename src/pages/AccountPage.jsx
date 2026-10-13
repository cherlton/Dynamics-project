import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useEmailStore } from '../store/emailStore'
import { Briefcase, Eye, EyeOff, CheckCircle2, Circle, ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import Footer from '../components/Footer'

const COMMON_PASSWORDS = ['Password123!', 'Welcome123!', 'Admin12345!', 'P@ssword123', 'Password10!']

export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { application, updateApplication, updateDetails, updateConsents } = useApplicationStore()
  const register = useAuthStore(s => s.register)
  const sendEmail = useEmailStore(s => s.sendEmail)

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

  // Password strength calculation
  const strengthScore = useMemo(() => {
    let score = 0
    if (rules.length) score += 20
    if (rules.casing) score += 20
    if (rules.number) score += 20
    if (rules.special) score += 20
    if (password.length >= 14) score += 20
    return score
  }, [rules, password])

  const strengthLabel = strengthScore < 40 ? 'Weak' : strengthScore < 80 ? 'Good' : 'Strong'
  const strengthColor = strengthScore < 40 ? 'bg-red-500' : strengthScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canProceed) return
    setError('')
    setLoading(true)

    // Save into application store
    updateApplication({ source: src, jobId })
    updateDetails('email', email)
    updateConsents('termsAccepted', termsAccepted)
    updateConsents('privacyAccepted', privacyAccepted)
    updateConsents('talentPool', talentPool)
    updateConsents('marketing', marketing)

    // Register user in mock auth
    const regRes = register(email, password, email.split('@')[0])
    if (!regRes.success && regRes.error !== 'An account with this email already exists.') {
      setError(regRes.error)
      setLoading(false)
      return
    }

    // Generate mock verification email
    const verifyToken = 'tok-' + Math.random().toString(36).substring(2, 9)
    sendEmail({
      to: email,
      subject: 'Verify your email for Recruitment Portal',
      type: 'verification',
      body: `Hello,\n\nPlease verify your email address to continue your application for ${application.jobTitle}.\n\nClick the link below or enter this code: ${verifyToken}`,
      link: `/apply/verify-email/confirm?token=${verifyToken}&email=${encodeURIComponent(email)}`,
    })

    setTimeout(() => {
      setLoading(false)
      navigate(`/apply/verify-email?email=${encodeURIComponent(email)}`)
    }, 600)
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-card w-full mx-auto p-4 md:py-10">
        {/* Job source badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-sm border border-blue-100 text-blue-900 text-xs font-medium">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Applying for: <strong>{application.jobTitle}</strong></span>
          {src === 'linkedin' && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">via LinkedIn</span>
          )}
        </div>

        {/* Card */}
        <div className="card-form animate-fade-in shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-semibold text-blue-700 tracking-wider uppercase">Step 1 of 2: Registration</span>
            <h1 className="text-page-title text-gray-900 mt-1">Create your Account</h1>
            <div className="gray-dash mt-3 mb-2" />
            <p className="text-gray-500 text-sm">
              Set up your profile to begin the guided application. You can pause and resume anytime.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="email">
                  Email Address <span className="text-danger">*</span>
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
                  <p className="text-xs text-danger mt-1">Please enter a valid email address.</p>
                )}
              </div>

              <div>
                <label className="input-label" htmlFor="confirmEmail">
                  Confirm Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="confirmEmail"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, confirmEmail: true }))}
                  placeholder="name@example.co.za"
                  className={`input-field ${touched.confirmEmail && !emailsMatch ? 'error' : ''}`}
                  required
                />
                {touched.confirmEmail && !emailsMatch && (
                  <p className="text-xs text-danger mt-1">Email addresses do not match.</p>
                )}
              </div>
            </div>

            {/* Password field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                    placeholder="Create a strong password"
                    className="input-field pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Password strength: <strong>{strengthLabel}</strong></span>
                      <span>{strengthScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${strengthScore}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="input-label" htmlFor="confirmPassword">
                  Confirm Password <span className="text-danger">*</span>
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
                  <p className="text-xs text-danger mt-1">Passwords do not match.</p>
                )}
              </div>
            </div>

            {/* Live Password Checklist */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-semibold text-gray-700 block mb-2">Password Requirements:</span>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className={`flex items-center gap-2 ${rules.length ? 'text-green-700 font-medium' : ''}`}>
                  {rules.length ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  <span>At least 10 characters</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.casing ? 'text-green-700 font-medium' : ''}`}>
                  {rules.casing ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  <span>One uppercase letter and one lowercase letter</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.number ? 'text-green-700 font-medium' : ''}`}>
                  {rules.number ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  <span>At least one number</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.special ? 'text-green-700 font-medium' : ''}`}>
                  {rules.special ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  <span>At least one special character (!@#$% etc.)</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.notEmail ? 'text-green-700 font-medium' : ''}`}>
                  {rules.notEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  <span>Does not contain your email address</span>
                </li>
              </ul>
            </div>

            {/* POPIA & Consents Section */}
            <div className="pt-2 border-t border-gray-100 space-y-3.5">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Legal & POPIA Consents (Protection of Personal Information Act)
              </span>

              {/* Required Consent 1 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700 leading-snug">
                  I have read and accept the{' '}
                  <Link to="/legal/terms" target="_blank" className="text-blue-600 underline font-medium hover:text-blue-800">
                    Terms and Conditions
                  </Link>
                  . <span className="text-danger font-semibold">*</span>
                </span>
              </label>

              {/* Required Consent 2 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700 leading-snug">
                  I have read the{' '}
                  <Link to="/legal/privacy" target="_blank" className="text-blue-600 underline font-medium hover:text-blue-800">
                    Privacy Notice
                  </Link>{' '}
                  and consent to the processing of my personal information for recruitment purposes under POPIA. <span className="text-danger font-semibold">*</span>
                </span>
              </label>

              {/* Optional Consents */}
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-2 mt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={talentPool}
                    onChange={(e) => setTalentPool(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    <strong>Talent Pool (Optional):</strong> Keep my details in the talent pool for 12 months for future job opportunities.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    <strong>Vacancies (Optional):</strong> Contact me when new relevant positions open up.
                  </span>
                </label>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Your information is encrypted & compliant with POPIA</span>
              </div>

              <button
                type="submit"
                disabled={!canProceed || loading}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 min-w-[160px]"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Next: Verify Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
