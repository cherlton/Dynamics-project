import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import PortalLayout from '../components/PortalLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const sendEmail = useEmailStore(s => s.sendEmail)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return

    sendEmail({
      to: email,
      subject: 'Password Reset Request',
      type: 'reset',
      body: `Hello,\n\nWe received a request to reset your password.\n\nClick the link below to choose a new password. If you didn't request this, you can safely ignore this email.`,
      link: `/reset-password?email=${encodeURIComponent(email)}`,
    })

    setSubmitted(true)
  }

  return (
    <PortalLayout
      category="PASSWORD RECOVERY"
      title="Safeguard your candidate portal credentials"
      subtitle="Provide your registered email address to receive a secure recovery link in compliance with POPIA security safeguards."
      showProgressBar={false}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Account Recovery
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Reset your password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Provide your registered email address and we will dispatch a secure recovery token.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label" htmlFor="forgot-email">Email Address *</label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.co.za"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3.5 px-6 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Recovery Dispatch Dispatched
            </h4>
            <p>
              If a candidate account matches <strong>{email}</strong>, a recovery link has been delivered.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <Link to="/login" className="text-xs text-slate-700 hover:text-slate-900 underline font-medium">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </PortalLayout>
  )
}
