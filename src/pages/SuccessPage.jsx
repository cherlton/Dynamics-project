import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useEmailStore } from '../store/emailStore'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import {
  CheckCircle2, ArrowRight, Clock, FileSearch, UserCheck,
  Mail, ExternalLink, ShieldCheck, Copy, Check
} from 'lucide-react'

export default function SuccessPage() {
  const navigate = useNavigate()
  const application = useApplicationStore(s => s.application)
  const login = useAuthStore(s => s.login)
  const emails = useEmailStore(s => s.emails)

  const [copied, setCopied] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const refNumber = application.referenceNumber || 'APP-2026-00123'
  const candidateEmail = application.details?.email || 'thabo.mokoena@email.co.za'

  // Latest received email
  const latestEmail = emails.find(e => e.type === 'received')

  const copyRef = () => {
    navigator.clipboard?.writeText(refNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoToPortal = () => {
    // Ensure logged in as candidate
    login('candidate@demo.co.za', 'Candidate#12345')
    navigate('/portal')
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-card w-full mx-auto p-4 md:py-10">
        <div className="card-form shadow-2xl text-center animate-fade-in">
          {/* Animated checkmark icon */}
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100 animate-check">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs font-semibold text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-200">
            Application Submitted
          </span>

          <h1 className="text-page-title text-gray-900 mt-3">Thank You for Applying!</h1>
          <div className="gray-dash mx-auto mt-2 mb-4" />

          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
            Your application for <strong>{application.jobTitle}</strong> has been received by our Talent Acquisition team.
          </p>

          {/* Reference badge */}
          <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-flex items-center gap-3">
            <div className="text-left">
              <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Reference Number</span>
              <span className="text-lg font-mono font-bold text-gray-900">{refNumber}</span>
            </div>
            <button
              onClick={copyRef}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              title="Copy reference number"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* What happens next timeline */}
          <div className="my-8 text-left border border-gray-200 rounded-2xl p-6 bg-white">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">1. Application Received</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Confirmation email dispatched with your tracking reference.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">2. Review by Talent Manager</h4>
                  <p className="text-xs text-gray-500 mt-0.5">A human recruiter reviews your CV, background, and screening answers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">3. Shortlist & Interview Scheduling</h4>
                  <p className="text-xs text-gray-500 mt-0.5">If shortlisted, you will receive an invitation email to select an interview slot in your portal.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleGoToPortal}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>Go to Candidate Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Preview Confirmation Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Email Preview Modal */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Mock Email Preview: Application Received"
        size="lg"
      >
        <div className="border border-gray-200 rounded-xl overflow-hidden font-sans text-xs">
          {/* Email Blue Header Band */}
          <div className="bg-blue-700 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-200" />
              <span className="font-bold text-base tracking-tight">Recruitment Portal</span>
            </div>
            <span className="text-[11px] text-blue-200">Confirmation Notice</span>
          </div>

          {/* Email Body */}
          <div className="p-6 bg-white space-y-4 text-gray-700 leading-relaxed text-sm">
            <p><strong>To:</strong> {candidateEmail}</p>
            <p><strong>Subject:</strong> We received your application – {application.jobTitle}</p>
            <hr className="border-gray-100" />
            <p>Dear {application.details?.firstName || 'Candidate'},</p>
            <p>Thank you for submitting your application for the <strong>{application.jobTitle}</strong> position.</p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-mono font-bold text-blue-700">Reference: {refNumber}</p>
              <p className="text-xs text-gray-500 mt-1">Submitted on: {new Date().toLocaleDateString('en-ZA')}</p>
            </div>
            <p>Our hiring team reviews every application thoroughly. If you are shortlisted, you will receive an invitation to schedule an interview.</p>
            <div className="pt-2">
              <button
                onClick={() => { setEmailModalOpen(false); handleGoToPortal() }}
                className="btn-primary text-xs py-2 px-4"
              >
                Track in Candidate Portal
              </button>
            </div>
          </div>

          {/* Email Gray Footer */}
          <div className="p-4 bg-gray-100 border-t border-gray-200 text-gray-500 text-[11px] space-y-1">
            <p>Recruitment Team • POPIA compliant processing • Inquiries: info.officer@company.co.za</p>
            <p>To withdraw your application or exercise data privacy rights, visit your portal profile.</p>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
