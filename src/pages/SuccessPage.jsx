import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'
import Modal from '../components/Modal'

export default function SuccessPage() {
  const navigate = useNavigate()
  const application = useApplicationStore(s => s.application)
  const login = useAuthStore(s => s.login)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [copied, setCopied] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const refNumber = application.referenceNumber || 'APP-2026-00123'
  const candidateEmail = application.details?.email || 'thabo.mokoena@email.co.za'

  const copyRef = () => {
    navigator.clipboard?.writeText(refNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoToPortal = () => {
    login('candidate@demo.co.za', 'Candidate#12345')
    shuffleNavigate(navigate, '/portal', 'forward')
  }

  return (
    <PortalLayout
      category="APPLICATION SUBMITTED"
      title="Your executive application has been registered"
      subtitle="Your candidate dossier is now logged in our selection pipeline. Our Talent Manager will evaluate your credentials."
      showProgressBar={false}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 inline-block mb-2">
            Application Received Successfully
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Thank you for applying
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your candidate submission for <strong className="text-slate-800">{application.jobTitle}</strong> is now officially registered.
          </p>
        </div>

        {/* Reference Number Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-300 flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Application Reference Number
            </span>
            <span className="text-base font-mono font-bold text-slate-900 tracking-wider">
              {refNumber}
            </span>
          </div>
          <button
            onClick={copyRef}
            className="border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-800"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* Evaluation Milestones */}
        <div className="border border-slate-200 p-4 bg-white mb-6 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            Next Evaluation Milestones
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-[#0f1b29] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                1
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Application Ingestion</h4>
                <p className="text-slate-500 text-[11px]">Confirmation dispatch transmitted to your verified address.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 border border-slate-400 text-slate-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                2
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Talent Partner Evaluation</h4>
                <p className="text-slate-500 text-[11px]">A certified human talent manager reviews your dossier and qualifications.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                3
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Interview Scheduling</h4>
                <p className="text-slate-500 text-[11px]">Shortlisted candidates will receive direct calendar booking slots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleGoToPortal}
            className="w-full sm:w-auto bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-6 font-semibold text-xs uppercase tracking-wider rounded-none"
            style={{ borderRadius: 0 }}
          >
            Go to Candidate Portal →
          </button>

          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-3 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
            style={{ borderRadius: 0 }}
          >
            Preview Confirmation Notice
          </button>
        </div>
      </div>

      {/* Confirmation Notice Modal */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Application Confirmation Dispatch"
        size="lg"
      >
        <div className="border border-slate-300 text-xs text-slate-700">
          <div className="bg-[#0f1b29] text-white p-4 flex items-center justify-between">
            <span className="font-serif text-sm font-semibold lowercase">gaspar talent</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-300">Confirmation Dispatch</span>
          </div>

          <div className="p-5 space-y-3 bg-white">
            <p><strong>To:</strong> {candidateEmail}</p>
            <p><strong>Subject:</strong> We received your application – {application.jobTitle}</p>
            <hr className="border-slate-200" />
            <p>Dear {application.details?.firstName || 'Candidate'},</p>
            <p>Thank you for submitting your application for the <strong>{application.jobTitle}</strong> position.</p>
            <div className="p-3 bg-slate-50 border border-slate-200 font-mono text-xs">
              Reference Number: <strong>{refNumber}</strong>
            </div>
            <p>Our hiring team reviews every submission thoroughly. You can monitor progress in the Candidate Portal.</p>
          </div>
        </div>
      </Modal>
    </PortalLayout>
  )
}
