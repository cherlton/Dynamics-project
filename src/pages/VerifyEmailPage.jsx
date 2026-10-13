import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Mail, CheckCircle2, RotateCw, ArrowLeft, ExternalLink } from 'lucide-react'
import { useEmailStore } from '../store/emailStore'
import Footer from '../components/Footer'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || 'candidate@example.co.za'
  const emails = useEmailStore(s => s.emails)
  const sendEmail = useEmailStore(s => s.sendEmail)

  const [cooldown, setCooldown] = useState(60)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Find the verification email generated for this email
  const latestVerificationEmail = emails.find(e => e.to.toLowerCase() === email.toLowerCase() && e.type === 'verification')

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
      subject: 'Verify your email for Recruitment Portal (Resent)',
      type: 'verification',
      body: `Hello,\n\nHere is your new verification link.\n\nClick the link below or enter this code: ${verifyToken}`,
      link: `/apply/verify-email/confirm?token=${verifyToken}&email=${encodeURIComponent(email)}`,
    })

    setTimeout(() => {
      setResending(false)
      setResendSuccess(true)
      setCooldown(60)
    }, 600)
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card-form w-full text-center animate-fade-in shadow-xl">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Mail className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Step 2 of 2: Verification</span>
          <h1 className="text-page-title text-gray-900 mt-1">Check your Inbox</h1>
          <div className="gray-dash mx-auto mt-3 mb-4" />

          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
            We’ve sent a verification link to <strong className="text-gray-900">{maskEmail(email)}</strong>. Click the link inside to verify your address and continue your application.
          </p>

          {/* Quick Mock Inbox Dev Preview Box */}
          {latestVerificationEmail && (
            <div className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Dev Simulation: Incoming Email
                </span>
                <span className="text-[10px] text-gray-400">Received just now</span>
              </div>
              <p className="text-xs font-semibold text-gray-800 mb-1">{latestVerificationEmail.subject}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-3 whitespace-pre-line">{latestVerificationEmail.body}</p>
              
              <button
                type="button"
                onClick={() => navigate(latestVerificationEmail.link)}
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <span>Verify My Email (Simulate Click)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {resendSuccess && (
            <div className="my-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>A new verification email has been dispatched.</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/apply/account?email=${encodeURIComponent(email)}`)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Wrong email? Change email address</span>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400">
            Link expires in 24 hours. Can't find it? Check your spam/junk folder.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
