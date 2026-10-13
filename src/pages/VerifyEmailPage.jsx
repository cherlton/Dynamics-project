import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || 'candidate@example.co.za'
  const emails = useEmailStore(s => s.emails)
  const sendEmail = useEmailStore(s => s.sendEmail)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [cooldown, setCooldown] = useState(60)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const latestVerificationEmail = emails.find(
    e => e.to.toLowerCase() === email.toLowerCase() && e.type === 'verification'
  )

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const maskEmail = (str) => {
    if (!str.includes('@')) return str
    const [user, domain] = str.split('@')
    return `${user[0]}***@${domain}`
  }

  const handleResend = () => {
    if (cooldown > 0 || resending) return
    setResending(true)

    const verifyToken = 'tok-' + Math.random().toString(36).substring(2, 9)
    sendEmail({
      to: email,
      subject: 'Verify your email for Gaspar Portal (Resent)',
      type: 'verification',
      body: `Hello,\n\nHere is your new verification link.\n\nClick the link below or enter this code: ${verifyToken}`,
      link: `/apply/verify-email/confirm?token=${verifyToken}&email=${encodeURIComponent(email)}`,
    })

    setTimeout(() => {
      setResending(false)
      setResendSuccess(true)
      setCooldown(60)
    }, 400)
  }

  return (
    <PortalLayout
      category="ACCOUNT VERIFICATION"
      title="Verify your candidate email address"
      subtitle="Confirm your identity to ensure authorized submission, prevent account fraud, and activate your recruitment profile."
      showProgressBar={false}
    >
      <div>
        <div className="mb-6 pb-4 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Step 2 of 2 — Verification
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Check your inbox
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            We have dispatched an encrypted verification dispatch to{' '}
            <strong className="text-slate-800">{maskEmail(email)}</strong>.
          </p>
        </div>

        {/* Development simulation block */}
        {latestVerificationEmail && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-300 text-left rounded-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Dev Simulation — Incoming Email
              </span>
              <span className="text-[10px] text-slate-400">Received just now</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mb-1">{latestVerificationEmail.subject}</p>
            <p className="text-xs text-slate-600 mb-3 whitespace-pre-line line-clamp-2">
              {latestVerificationEmail.body}
            </p>
            <button
              type="button"
              onClick={() => shuffleNavigate(navigate, latestVerificationEmail.link, 'forward')}
              className="w-full bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-2.5 px-4 font-semibold text-xs uppercase tracking-wider rounded-none transition-colors"
              style={{ borderRadius: 0 }}
            >
              Verify My Email & Continue
            </button>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 rounded-none">
            A new verification email has been dispatched.
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-4 font-medium text-xs uppercase tracking-wider rounded-none disabled:opacity-40"
            style={{ borderRadius: 0 }}
          >
            {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
          </button>

          <button
            type="button"
            onClick={() => shuffleNavigate(navigate, `/apply/account?email=${encodeURIComponent(email)}`, 'backward')}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline pt-1"
          >
            Wrong email address? Return to account creation
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center pt-6 border-t border-slate-100 mt-6">
          This secure link remains valid for 24 hours under our automated security policies.
        </p>
      </div>
    </PortalLayout>
  )
}
