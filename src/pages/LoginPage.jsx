import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

export default function LoginPage() {
  const searchParams = useSearchParams()[0]
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const returnTo = searchParams.get('returnTo')
  const reason = searchParams.get('reason')
  const prefillEmail = searchParams.get('email')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 600))

    const result = login(email, password)
    setLoading(false)

    if (result.success) {
      const destination = result.role === 'admin' ? (returnTo || '/admin') : (returnTo || '/portal')
      shuffleNavigate(navigate, destination, 'forward')
    } else {
      setError(result.error)
    }
  }

  return (
    <PortalLayout
      category="PORTAL AUTHENTICATION"
      title="Sign in to your candidate or talent portal"
      subtitle="Access your secure portal to track candidate progress, view interview schedules, or review candidate pipelines."
      showProgressBar={false}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Secure Authentication
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Sign In to your account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your registered email address and password to access the portal.
          </p>
        </div>

        {prefillEmail && (
          <div className="bg-slate-50 border border-slate-300 p-3 mb-4 text-xs text-slate-800">
            Sign in to view your application status update.
          </div>
        )}

        {reason === 'expired' && (
          <div className="bg-amber-50 border border-amber-300 p-3 mb-4 text-xs text-amber-900">
            Your session has expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 p-3 mb-4 text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="input-label">Email Address *</label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="name@example.co.za"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="login-password" className="input-label mb-0">Password *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] uppercase font-semibold text-slate-500 hover:text-slate-800 tracking-wider"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1.5">
              <Link to="/forgot-password" className="text-[11px] text-slate-600 hover:text-slate-900 underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3.5 px-6 font-semibold text-xs uppercase tracking-wider rounded-none transition-all disabled:opacity-40"
            style={{ borderRadius: 0 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          New candidate?{' '}
          <button
            type="button"
            onClick={() => shuffleNavigate(navigate, '/apply/account', 'forward')}
            className="text-[#0f1b29] font-semibold underline hover:text-slate-700"
          >
            Start your application
          </button>
        </div>

        {/* Demo Credentials in crisp formal box */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-700 block mb-2 text-[10px]">
            Demo System Accounts
          </span>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center p-1.5 bg-white border border-slate-200">
              <span>Admin Manager: <strong className="font-mono text-slate-800">admin@demo.co.za</strong></span>
              <span className="font-mono text-slate-500">Admin#12345</span>
            </div>
            <div className="flex justify-between items-center p-1.5 bg-white border border-slate-200">
              <span>Candidate: <strong className="font-mono text-slate-800">candidate@demo.co.za</strong></span>
              <span className="font-mono text-slate-500">Candidate#12345</span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
