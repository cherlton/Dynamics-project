import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'

export default function VerifyConfirmPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const verifyEmail = useAuthStore(s => s.verifyEmail)
  const setStep = useApplicationStore(s => s.setStep)

  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const timer = setTimeout(() => {
      // Mark verified in auth store
      verifyEmail(email || 'candidate@demo.co.za')
      setStep(0)
      setStatus('success')

      setTimeout(() => {
        navigate('/apply/cv')
      }, 1500)
    }, 1000)

    return () => clearTimeout(timer)
  }, [token, email, navigate, verifyEmail, setStep])

  return (
    <div className="bg-gradient-portal flex items-center justify-center min-h-screen p-4">
      <div className="card-form text-center animate-fade-in shadow-2xl py-12">
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
            <p className="text-sm text-gray-500">Please hold on while we confirm your account security.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-slide-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-10 h-10 animate-check" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-sm text-gray-600">
              Your account is active. Redirecting you to upload your CV...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Invalid Verification Link</h2>
            <p className="text-sm text-gray-500">This token may have expired or is invalid.</p>
            <button
              onClick={() => navigate('/apply/verify-email')}
              className="btn-primary mt-4"
            >
              Request a New Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
