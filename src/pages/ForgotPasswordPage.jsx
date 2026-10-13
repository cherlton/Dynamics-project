import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { Shield, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import Footer from '../components/Footer'

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
      body: `Hello,\n\nWe received a request to reset your password.\n\nClick the button below to choose a new password. If you didn't request this, you can safely ignore this email.`,
      link: `/reset-password?email=${encodeURIComponent(email)}`,
    })

    setSubmitted(true)
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card-form w-full text-center animate-fade-in shadow-xl">
          <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="text-page-title text-gray-900">Forgot Password</h1>
          <div className="gray-dash mx-auto mt-2 mb-4" />

          {!submitted ? (
            <>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Enter your registered email address and we will send you a secure password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="input-label" htmlFor="forgot-email">Email Address</label>
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

                <button type="submit" className="btn-primary w-full">
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-4 py-4 animate-slide-up">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Reset Link Sent</h2>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                If an account exists for <strong>{email}</strong>, a reset link has been dispatched to your inbox (also check <Link to="/dev/emails" className="text-blue-600 underline">Dev Mock Emails</Link>).
              </p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-100">
            <Link to="/login" className="text-xs text-blue-700 font-semibold hover:text-blue-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
