import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useAuthStore } from '../store/authStore'
import { useEmailStore } from '../store/emailStore'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import {
  CheckCircle2, Edit3, ArrowLeft, Send, ShieldCheck, FileText,
  User, GraduationCap, Briefcase, HelpCircle, AlertCircle
} from 'lucide-react'

export default function SummaryPage() {
  const navigate = useNavigate()
  const { application, updateConsents, submitApplication, setStep } = useApplicationStore()
  const user = useAuthStore(s => s.user)
  const sendEmail = useEmailStore(s => s.sendEmail)

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

      // Generate confirmation email in dev emails
      sendEmail({
        to: details.email || user?.email || 'candidate@demo.co.za',
        subject: `We received your application – ${application.jobTitle}`,
        type: 'received',
        body: `Dear ${details.firstName || 'Candidate'},\n\nThank you for submitting your application for the ${application.jobTitle} position.\n\nYour application reference number is: ${refNum}\n\nOur hiring team will review your application. You can view your status anytime at /portal.`,
        link: '/login?returnTo=/portal',
      })

      setSubmitting(false)
      navigate('/apply/success')
    }, 1200)
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-8">
        <div className="bg-white rounded-card shadow-xl p-6 md:p-8 animate-fade-in">
          <ProgressBar currentStep={4} />

          <div className="mb-6">
            <h1 className="text-page-title text-gray-900">Review & Submit Application</h1>
            <div className="gray-dash mt-2 mb-2" />
            <p className="text-gray-600 text-sm">
              Please do a final check of your submission. You can click <strong>Edit</strong> on any section to make corrections.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* 1. Personal Details Summary */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Personal Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); navigate('/apply/details') }}
                  className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Full Name</span>
                  <span className="font-semibold text-gray-800">{details.firstName} {details.surname}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Email</span>
                  <span className="font-semibold text-gray-800">{details.email || 'thabo.mokoena@email.co.za'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Phone</span>
                  <span className="font-semibold text-gray-800">{details.mobile || '+27 82 555 0123'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Location</span>
                  <span className="font-semibold text-gray-800">{details.city}, {details.province}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Nationality</span>
                  <span className="font-semibold text-gray-800">{details.nationality || 'South African'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">ID / Passport</span>
                  <span className="font-semibold text-gray-800">
                    {details.idNumber ? `********${details.idNumber.slice(-4)}` : 'Verified via upload'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Education Summary */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Education & Qualifications ({details.education?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); navigate('/apply/details') }}
                  className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {(details.education || []).map((edu, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <div>
                      <span className="font-semibold text-gray-800">{edu.qualification}</span>
                      <span className="text-gray-500 ml-2">• {edu.institution}</span>
                    </div>
                    <span className="text-gray-400">{edu.yearCompleted || 'Completed'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Experience Summary */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                  <Briefcase className="w-4 h-4 text-blue-700" />
                  <span>Work History ({details.experience?.length || 0} positions)</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); navigate('/apply/details') }}
                  className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {(details.experience || []).map((exp, i) => (
                  <div key={i} className="py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{exp.jobTitle}</span>
                      <span className="text-gray-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <span className="text-gray-500">{exp.company}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Documents Summary */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Uploaded Documents</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(2); navigate('/apply/documents') }}
                  className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Certified ID Copy: <strong>{documents.certifiedId?.name || 'ID_Document.pdf'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>CV Document: <strong>{application.cv?.name || 'Resume_Thabo_Mokoena.pdf'}</strong></span>
                </div>
              </div>
            </div>

            {/* 5. Screening Answers Summary */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Screening Responses</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(3); navigate('/apply/screening') }}
                  className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Work Entitlement</span>
                  <span className="font-semibold text-gray-800">{screening.legallyEntitled === 'yes' ? 'Eligible (Citizen/Permit)' : 'Requires Visa'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Notice Period</span>
                  <span className="font-semibold text-gray-800">{screening.noticePeriod || '1 Month'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Salary Expectation</span>
                  <span className="font-semibold text-gray-800">{screening.salaryExpectation ? `R ${screening.salaryExpectation}` : 'Negotiable'}</span>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => {
                    setDeclaration(e.target.checked)
                    updateConsents('declaration', e.target.checked)
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  <strong>Declaration of Truthfulness:</strong> I hereby certify that the information contained in this application and in any accompanying documents is true, correct, and complete to the best of my knowledge. I understand that misrepresentation may lead to disqualification or dismissal.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep(3); navigate('/apply/screening') }}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                disabled={!declaration || submitting}
                className="btn-primary flex items-center gap-2 min-w-[180px] justify-center"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Application Submission"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to submit your application for <strong>{application.jobTitle}</strong>?
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <strong>Please note:</strong> Once submitted, your profile will be locked for review and cannot be edited. You can track progress in the Candidate Portal.
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="btn-primary text-xs"
            >
              Yes, Submit Application
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
