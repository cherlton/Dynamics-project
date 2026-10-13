import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

export default function VerifyConfirmPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const verifyEmail = useAuthStore(s => s.verifyEmail)
  const setStep = useApplicationStore(s => s.setStep)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const timer = setTimeout(() => {
      verifyEmail(email || 'candidate@demo.co.za')
      setStep(0)
      setStatus('success')

      setTimeout(() => {
        shuffleNavigate(navigate, '/apply/cv', 'forward')
      }, 1000)
    }, 800)

    return () => clearTimeout(timer)
  }, [token, email, navigate, verifyEmail, setStep, shuffleNavigate])

  return (
    <PortalLayout
      category="VERIFICATION STATUS"
      title="Validating candidate security token"
      subtitle="Ensuring verified, authenticated access to your executive recruitment dossier under POPIA."
      showProgressBar={false}
    >
      <div className="text-center py-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent animate-spin mx-auto" />
            <h2 className="formal-heading-dark text-2xl font-semibold">Verifying your credentials...</h2>
            <p className="text-xs text-slate-500">Please hold on while we validate your access token.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h2 className="formal-heading-dark text-2xl font-semibold">Email Verified Successfully</h2>
            <p className="text-xs text-slate-600">
              Your profile is verified. Redirecting to CV submission...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-800 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="formal-heading-dark text-2xl font-semibold">Verification Link Expired</h2>
            <p className="text-xs text-slate-500">The verification token could not be verified.</p>
            <button
              onClick={() => shuffleNavigate(navigate, '/apply/verify-email', 'backward')}
              className="bg-[#0f1b29] text-white py-2.5 px-5 text-xs font-semibold uppercase tracking-wider rounded-none mt-2"
              style={{ borderRadius: 0 }}
            >
              Request New Token
            </button>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
