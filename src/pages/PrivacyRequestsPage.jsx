import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import {
  ShieldCheck, Download, Trash2, Edit3, ArrowLeft, CheckCircle2,
  AlertTriangle, Lock, FileText, Check
} from 'lucide-react'

export default function PrivacyRequestsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const application = useApplicationStore(s => s.application)
  const updateConsents = useApplicationStore(s => s.updateConsents)

  const [talentPool, setTalentPool] = useState(application.consents.talentPool || true)
  const [marketing, setMarketing] = useState(application.consents.marketing || false)
  const [successMsg, setSuccessMsg] = useState('')
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [correctModal, setCorrectModal] = useState(false)
  const [correctionText, setCorrectionText] = useState('')

  const handleExportData = () => {
    const dataToExport = {
      subject: user?.email || 'thabo.mokoena@email.co.za',
      exportDate: new Date().toISOString(),
      popiaCompliance: 'Act 4 of 2013 - Section 23',
      profile: application.details,
      screeningResponses: application.screening,
      consents: {
        termsAccepted: application.consents.termsAccepted,
        privacyAccepted: application.consents.privacyAccepted,
        talentPoolConsent: talentPool,
        marketingConsent: marketing,
        consentTimestamp: application.submittedAt || new Date().toISOString(),
      },
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidate_data_export_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    setSuccessMsg('Your personal data archive has been generated and downloaded.')
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const handleToggleTalentPool = (checked) => {
    setTalentPool(checked)
    updateConsents('talentPool', checked)
    setSuccessMsg(checked ? 'Talent pool consent granted (12 months).' : 'Talent pool consent revoked.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleToggleMarketing = (checked) => {
    setMarketing(checked)
    updateConsents('marketing', checked)
    setSuccessMsg(checked ? 'Vacancy updates subscribed.' : 'Vacancy alerts unsubscribed.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleSubmitCorrection = () => {
    setCorrectModal(false)
    setCorrectionText('')
    setSuccessMsg('Correction request forwarded to the Information Officer (Ticket #POPIA-CORR-882).')
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const handleConfirmWithdraw = () => {
    setWithdrawModal(false)
    setSuccessMsg('Application successfully withdrawn and flagged for deletion under POPIA.')
    setTimeout(() => {
      navigate('/portal')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/portal" className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidate Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span className="font-bold text-sm text-gray-900">POPIA Privacy Rights Hub</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Data Privacy & Rights</h1>
          <p className="text-xs text-gray-500 mt-1">
            Governed by South Africa's Protection of Personal Information Act 4 of 2013 (POPIA).
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2 animate-slide-up">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Consent Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Consent Management
          </h2>
          <p className="text-xs text-gray-500">
            You may adjust your optional consents at any time without impacting your ongoing application.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <span className="font-semibold text-gray-900 text-xs block">Talent Pool Retention (12 Months)</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  Allows our recruitment team to match your profile to future vacancies over the next 12 months.
                </span>
              </div>
              <input
                type="checkbox"
                checked={talentPool}
                onChange={e => handleToggleTalentPool(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <span className="font-semibold text-gray-900 text-xs block">Vacancy Notifications & Direct Communication</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  Receive alerts when roles aligned to your skills become available.
                </span>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={e => handleToggleMarketing(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. Data Subject Rights (Section 23, 24, 25) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. POPIA Statutory Rights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Download Data */}
            <div className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between space-y-3 bg-gray-50/50">
              <div>
                <Download className="w-5 h-5 text-blue-700 mb-2" />
                <h3 className="text-xs font-bold text-gray-900">Right of Access (Section 23)</h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Obtain a complete portable copy of all data and documents we hold about you.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="btn-secondary text-xs py-2 w-full"
              >
                Export JSON Archive
              </button>
            </div>

            {/* Request Correction */}
            <div className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between space-y-3 bg-gray-50/50">
              <div>
                <Edit3 className="w-5 h-5 text-blue-700 mb-2" />
                <h3 className="text-xs font-bold text-gray-900">Correction (Section 24)</h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Request updates or rectifications to any inaccurate, outdated, or incomplete data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCorrectModal(true)}
                className="btn-secondary text-xs py-2 w-full"
              >
                Submit Correction
              </button>
            </div>

            {/* Withdraw & Deletion */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex flex-col justify-between space-y-3">
              <div>
                <Trash2 className="w-5 h-5 text-red-600 mb-2" />
                <h3 className="text-xs font-bold text-red-900">Withdraw / Erasure</h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Withdraw this application and request complete deletion or anonymization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawModal(true)}
                className="btn-danger text-xs py-2 w-full"
              >
                Withdraw Application
              </button>
            </div>
          </div>
        </div>

        {/* 3. Consent Audit Trail Record */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              3. Audit Trail & Consent Ledger
            </h2>
            <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              Legally Binding Log
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Consent Instrument</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Recorded Timestamp</th>
                  <th className="py-2.5 px-3">IP Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Terms of Use</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-green-700 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-gray-500">12 Feb 2026, 09:14 SAST</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">196.25.1.***</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">POPIA Privacy Notice</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-green-700 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-gray-500">12 Feb 2026, 09:14 SAST</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">196.25.1.***</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">ID Storage Consent</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-green-700 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-gray-500">12 Feb 2026, 09:18 SAST</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">196.25.1.***</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Correction Request Modal */}
      <Modal
        isOpen={correctModal}
        onClose={() => setCorrectModal(false)}
        title="Request Record Correction"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Please describe the personal details you would like updated or corrected:
          </p>
          <textarea
            rows={4}
            value={correctionText}
            onChange={(e) => setCorrectionText(e.target.value)}
            placeholder="e.g. My new residential address is... or please update my phone number to..."
            className="input-field text-xs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setCorrectModal(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleSubmitCorrection} className="btn-primary text-xs">Submit Request</button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={withdrawModal}
        onClose={() => setWithdrawModal(false)}
        title="Confirm Application Withdrawal"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <div>
              <strong>Irreversible Action:</strong> Withdrawing your application will immediately remove you from consideration for Senior Business Analyst. In accordance with POPIA Section 14, your records will be scheduled for permanent destruction.
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setWithdrawModal(false)} className="btn-secondary text-xs">Keep Application</button>
            <button onClick={handleConfirmWithdraw} className="btn-danger text-xs">Confirm Withdrawal</button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
