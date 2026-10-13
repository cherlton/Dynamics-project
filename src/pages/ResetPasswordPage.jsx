import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Shield, CheckCircle2 } from 'lucide-react'
import Footer from '../components/Footer'

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
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card-form w-full text-center animate-fade-in shadow-xl">
          <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="text-page-title text-gray-900">Set New Password</h1>
          <div className="gray-dash mx-auto mt-2 mb-4" />

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="input-label" htmlFor="new-pw">New Password</label>
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
                <label className="input-label" htmlFor="confirm-new-pw">Confirm New Password</label>
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

              <button type="submit" className="btn-primary w-full">
                Update Password
              </button>
            </form>
          ) : (
            <div className="space-y-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <p className="text-sm font-semibold text-gray-900">Password successfully updated!</p>
              <p className="text-xs text-gray-500">Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
