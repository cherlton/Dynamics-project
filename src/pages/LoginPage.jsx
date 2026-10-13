import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, Shield, AlertCircle, Info } from 'lucide-react'
import Footer from '../components/Footer'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  
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
    
    await new Promise(r => setTimeout(r, 800))
    
    const result = login(email, password)
    setLoading(false)
    
    if (result.success) {
      if (result.role === 'admin') {
        navigate(returnTo || '/admin')
      } else {
        navigate(returnTo || '/portal')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card-form w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-page-title text-gray-900">Welcome Back</h1>
            <div className="gray-dash mx-auto mt-3 mb-3"></div>
            <p className="text-gray-500">Sign in to your account</p>
          </div>
          
          {prefillEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-slide-up">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">Log in to view your shortlist update</p>
            </div>
          )}
          
          {reason === 'expired' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">Your session has expired. Please sign in again.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="your@email.co.za"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="input-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New here?{' '}
              <Link to="/apply/account" className="text-blue-600 hover:text-blue-700 font-semibold">
                Start your application
              </Link>
            </p>
          </div>
          
          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100">
                <div>
                  <span className="font-medium text-gray-700">Admin:</span>
                  <span className="text-gray-500 ml-1">admin@demo.co.za</span>
                </div>
                <span className="text-gray-400">Admin#12345</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100">
                <div>
                  <span className="font-medium text-gray-700">Candidate:</span>
                  <span className="text-gray-500 ml-1">candidate@demo.co.za</span>
                </div>
                <span className="text-gray-400">Candidate#12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
