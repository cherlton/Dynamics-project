import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useEmailStore } from '../store/emailStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'
import Modal from '../components/Modal'

export default function SummaryPage() {
  const navigate = useNavigate()
  const { application, updateConsents, submitApplication, setStep } = useApplicationStore()
  const user = useAuthStore(s => s.user)
  const sendEmail = useEmailStore(s => s.sendEmail)
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [declaration, setDeclaration] = useState(application.consents.declaration || false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const details = application.details || {}
  const documents = application.documents || {}
  const screening = application.screening || {}

  const handleConfirmSubmit = () => {
    if (!declaration) {
      setError('Please certify the declaration checkbox before submitting.')
      return
    }
    setModalOpen(false)
    setSubmitting(true)

    setTimeout(() => {
      const refNum = submitApplication()

      sendEmail({
        to: details.email || user?.email || 'candidate@demo.co.za',
        subject: `We received your application – ${application.jobTitle}`,
        type: 'received',
        body: `Dear ${details.firstName || 'Candidate'},\n\nThank you for submitting your application for the ${application.jobTitle} position at Gaspar.\n\nYour application reference number is: ${refNum}\n\nOur hiring team will review your application. You can view your status anytime at /portal.`,
        link: '/login?returnTo=/portal',
      })

      setSubmitting(false)
      shuffleNavigate(navigate, '/apply/success', 'forward')
    }, 900)
  }

  return (
    <PortalLayout
      category="STEP 05 OF 05 — APPLICATION REVIEW"
      title="Final review and declaration before submission"
      subtitle="Inspect your complete dossier and certify your declaration before final submission to the Talent Manager."
      currentStep={4}
      showProgressBar={true}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Section 05 of 05 — Final Submission
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Review and Submit Application
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Conduct a final review of your submitted dossier. You may return to any section to make amendments.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-xs text-red-800 rounded-none">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* 1. Personal Details */}
          <div className="border border-slate-200 p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                1. Personal Details
              </span>
              <button
                type="button"
                onClick={() => { setStep(1); navigate('/apply/details') }}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 underline uppercase"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Full Name</span>
                <span className="font-semibold text-slate-900">{details.firstName} {details.surname}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                <span className="font-semibold text-slate-900">{details.email || 'candidate@example.co.za'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                <span className="font-semibold text-slate-900">{details.mobile || '+27 82 555 0123'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Location</span>
                <span className="font-semibold text-slate-900">{details.city || 'Johannesburg'}, {details.province || 'Gauteng'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Nationality</span>
                <span className="font-semibold text-slate-900">{details.nationality || 'South African'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Identity Verification</span>
                <span className="font-semibold text-slate-900">Verified via Document</span>
              </div>
            </div>
          </div>

          {/* 2. Education */}
          <div className="border border-slate-200 p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                2. Qualifications ({details.education?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => { setStep(1); navigate('/apply/details') }}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 underline uppercase"
              >
                Edit
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {(details.education || []).map((edu, i) => (
                <div key={i} className="flex justify-between items-center py-0.5">
                  <div>
                    <span className="font-semibold text-slate-900">{edu.qualification}</span>
                    <span className="text-slate-500 ml-2">• {edu.institution}</span>
                  </div>
                  <span className="text-slate-400">{edu.yearCompleted || 'Completed'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Experience */}
          <div className="border border-slate-200 p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                3. Work History ({details.experience?.length || 0} positions)
              </span>
              <button
                type="button"
                onClick={() => { setStep(1); navigate('/apply/details') }}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 underline uppercase"
              >
                Edit
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {(details.experience || []).map((exp, i) => (
                <div key={i} className="py-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{exp.jobTitle}</span>
                    <span className="text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{exp.company}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Documents & Screening */}
          <div className="border border-slate-200 p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                4. Compliance & Verification
              </span>
              <button
                type="button"
                onClick={() => { setStep(2); navigate('/apply/documents') }}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 underline uppercase"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">ID Record</span>
                <span className="font-semibold text-slate-900">{documents.certifiedId?.name || 'Certified_ID.pdf'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Curriculum Vitae</span>
                <span className="font-semibold text-slate-900">{application.cv?.name || 'Resume_Attached.pdf'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Work Authorization</span>
                <span className="font-semibold text-slate-900">{screening.legallyEntitled === 'yes' ? 'Eligible' : 'Requires Visa'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Notice Period</span>
                <span className="font-semibold text-slate-900">{screening.noticePeriod || '1 Month'}</span>
              </div>
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="p-3.5 border border-slate-300 bg-white">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(e) => {
                  setDeclaration(e.target.checked)
                  updateConsents('declaration', e.target.checked)
                }}
                className="mt-0.5 h-3.5 w-3.5 border-slate-300 text-[#0f1b29] focus:ring-0"
                style={{ borderRadius: 0 }}
                required
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong>Declaration of Authenticity:</strong> I certify that all particulars given in this application and accompanying documents are accurate, true, and complete. I acknowledge that any falsification constitutes sufficient grounds for disqualification under Gaspar recruitment regulations.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep(3); shuffleNavigate(navigate, '/apply/screening', 'backward') }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              ← Back to Screening
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={!declaration || submitting}
              className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-8 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none shadow-sm disabled:opacity-40"
              style={{ borderRadius: 0 }}
            >
              {submitting ? 'Transmitting Dossier...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: zero rounded corners */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Application Submission"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            Are you ready to submit your application for <strong>{application.jobTitle}</strong>?
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700">
            <strong>Important:</strong> Upon submission, your application will be assigned to a talent manager for initial review. You can follow evaluation milestones in the Candidate Portal.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="border border-slate-300 px-4 py-2 font-semibold text-xs uppercase tracking-wider text-slate-800 rounded-none"
              style={{ borderRadius: 0 }}
            >
              Review Again
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="bg-[#0f1b29] text-white px-5 py-2 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Confirm and Submit
            </button>
          </div>
        </div>
      </Modal>
    </PortalLayout>
  )
}
