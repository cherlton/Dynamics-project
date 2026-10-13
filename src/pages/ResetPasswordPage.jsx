import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import PortalLayout from '../components/PortalLayout'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || 'candidate@demo.co.za'

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password && password === confirmPassword) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    }
  }

  return (
    <PortalLayout
      category="PASSWORD RECOVERY"
      title="Establish secure candidate credentials"
      subtitle="Set a resilient password compliant with candidate data security standards before signing in."
      showProgressBar={false}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Account Security
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Set New Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Setting new security password for <strong className="text-slate-800">{email}</strong>.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label" htmlFor="new-pw">New Password *</label>
              <input
                id="new-pw"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter at least 10 characters"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="confirm-new-pw">Confirm New Password *</label>
              <input
                id="confirm-new-pw"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3.5 px-6 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Update Password
            </button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1">
            <h4 className="font-semibold uppercase tracking-wider">Password Successfully Updated</h4>
            <p>Redirecting to sign in...</p>
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
