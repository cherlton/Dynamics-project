import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/Modal'

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <Link to="/portal" className="font-semibold text-slate-700 hover:text-slate-900 underline">
            ← Back to Candidate Portal
          </Link>
          <span className="font-bold uppercase tracking-wider text-slate-900">
            POPIA Statutory Rights Hub (Act 4 of 2013)
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Data Subject Governance
          </span>
          <h1 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Your Personal Data Privacy & Statutory Rights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Governed by South Africa's Protection of Personal Information Act (POPIA). You hold full sovereignty over your candidate dossier.
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium">
            {successMsg}
          </div>
        )}

        {/* 1. Consent Preferences */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. Consent Management
          </h2>
          <p className="text-xs text-slate-500">
            You may adjust your optional consents at any time without impacting your ongoing application.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 text-xs block">Talent Pool Retention (12 Months)</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Allows our recruitment team to match your profile to future vacancies over the next 12 months.
                </span>
              </div>
              <input
                type="checkbox"
                checked={talentPool}
                onChange={e => handleToggleTalentPool(e.target.checked)}
                className="mt-1 h-4 w-4 border-slate-300 text-[#0f1b29] focus:ring-0 cursor-pointer"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 text-xs block">Vacancy Notifications & Direct Communication</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Receive alerts when roles aligned to your skills become available.
                </span>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={e => handleToggleMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 border-slate-300 text-[#0f1b29] focus:ring-0 cursor-pointer"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        </div>

        {/* 2. Data Subject Rights (Section 23, 24, 25) */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            2. POPIA Statutory Rights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Download Data */}
            <div className="p-4 border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Section 23</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Right of Access</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Obtain a complete portable copy of all data and documents we hold about you.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider py-2.5 w-full"
                style={{ borderRadius: 0 }}
              >
                Export JSON Archive
              </button>
            </div>

            {/* Request Correction */}
            <div className="p-4 border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Section 24</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Data Rectification</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Request updates or rectifications to any inaccurate, outdated, or incomplete data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCorrectModal(true)}
                className="border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider py-2.5 w-full"
                style={{ borderRadius: 0 }}
              >
                Submit Correction
              </button>
            </div>

            {/* Withdraw & Deletion */}
            <div className="p-4 border border-red-200 bg-red-50/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 block mb-1">Section 14</span>
                <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Withdraw / Erasure</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Withdraw this application and request complete deletion or anonymization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawModal(true)}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider py-2.5 w-full"
                style={{ borderRadius: 0 }}
              >
                Withdraw Application
              </button>
            </div>
          </div>
        </div>

        {/* 3. Consent Audit Trail Record */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Audit Trail & Consent Ledger
            </h2>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-200 uppercase font-bold tracking-wider">
              Legally Binding Log
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">Consent Instrument</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">Version</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">Recorded Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">IP Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Terms of Use</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-slate-500">12 Feb 2026, 09:14 SAST</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">196.25.1.***</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">POPIA Privacy Notice</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-slate-500">12 Feb 2026, 09:14 SAST</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">196.25.1.***</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">ID Storage Consent</td>
                  <td className="py-2.5 px-3">v1.0 (2026)</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">Active</td>
                  <td className="py-2.5 px-3 text-slate-500">12 Feb 2026, 09:18 SAST</td>
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
        <div className="space-y-3 text-xs text-slate-600">
          <p>
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
            <button
              onClick={() => setCorrectModal(false)}
              className="border border-slate-300 px-4 py-2 font-semibold text-xs uppercase tracking-wider text-slate-800"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCorrection}
              className="bg-[#0f1b29] text-white px-4 py-2 font-semibold text-xs uppercase tracking-wider"
              style={{ borderRadius: 0 }}
            >
              Submit Request
            </button>
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
          <div className="p-3 bg-red-50 border border-red-300 text-red-900 leading-relaxed">
            <strong>Irreversible Action:</strong> Withdrawing your application will immediately remove you from consideration for Senior Business Analyst. In accordance with POPIA Section 14, your records will be scheduled for permanent destruction.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setWithdrawModal(false)}
              className="border border-slate-300 px-4 py-2 font-semibold text-xs uppercase tracking-wider text-slate-800"
              style={{ borderRadius: 0 }}
            >
              Keep Application
            </button>
            <button
              onClick={handleConfirmWithdraw}
              className="bg-red-700 text-white px-4 py-2 font-semibold text-xs uppercase tracking-wider"
              style={{ borderRadius: 0 }}
            >
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
