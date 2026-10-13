import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/Modal'

export default function CandidatePortalPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const application = useApplicationStore(s => s.application)

  const [interviewStatus, setInterviewStatus] = useState('pending')
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [rescheduleNote, setRescheduleNote] = useState('')

  const stages = [
    { key: 'submitted', label: 'Submitted', done: true, date: '12 Feb 2026' },
    { key: 'under-review', label: 'Under Review', done: true, date: '15 Feb 2026' },
    { key: 'shortlisted', label: 'Shortlisted', done: true, current: true, date: '18 Feb 2026' },
    { key: 'interview', label: 'Interview', done: false, date: 'Proposed' },
    { key: 'outcome', label: 'Final Outcome', done: false, date: 'Pending' },
  ]

  const handleAcceptInterview = () => {
    setInterviewStatus('accepted')
  }

  const handleRequestReschedule = () => {
    setInterviewStatus('reschedule-requested')
    setRescheduleModal(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Gaspar Header */}
      <Header />

      {/* Sub-bar for Candidate Session */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 uppercase tracking-wider">Candidate Portal</span>
            <span className="text-slate-500 ml-2">Reference: {application.referenceNumber || 'APP-2026-00123'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-600 font-medium">
              {user?.name || 'Thabo Mokoena'} ({user?.email || 'candidate@demo.co.za'})
            </span>
            <Link to="/portal/privacy" className="text-slate-700 hover:text-slate-900 underline font-medium">
              POPIA Data Rights
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs uppercase font-semibold text-red-700 hover:text-red-900 border border-slate-300 px-3 py-1"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Shortlist Banner Highlight (Formal Navy, Zero Rounded Corners) */}
        <div
          className="bg-[#0f1b29] text-white p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-none"
          style={{ borderRadius: 0 }}
        >
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
              Status Update: Candidate Shortlisted
            </span>
            <h1 className="formal-heading text-2xl sm:text-3xl font-medium">
              Congratulations. Your application has been shortlisted.
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-normal leading-relaxed">
              Your profile for <strong>{application.jobTitle || 'Senior Business Analyst'}</strong> has been advanced by the hiring committee. Please review and confirm your proposed interview appointment.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('interview-card')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#0f1b29] hover:bg-slate-100 px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-colors duration-150 self-start md:self-auto rounded-none shadow-sm"
            style={{ borderRadius: 0 }}
          >
            Review Interview Details
          </button>
        </div>

        {/* Application Stage Tracker (Sharp Rectangular Step Grid) */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-none">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Application Evaluation Milestones
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stages.map((st, idx) => (
              <div
                key={st.key}
                className={`p-3.5 border transition-all rounded-none ${
                  st.current
                    ? 'border-[#0f1b29] bg-slate-50 ring-1 ring-[#0f1b29]'
                    : st.done
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-mono text-slate-500 font-bold">0{idx + 1}</span>
                  {st.done ? (
                    <span className="text-emerald-700 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400">⏱</span>
                  )}
                </div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  st.current ? 'text-[#0f1b29]' : st.done ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {st.label}
                </h3>
                <span className="text-[11px] text-slate-500 block mt-0.5">{st.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Slot Card */}
        <div id="interview-card" className="bg-white p-6 border border-slate-300 shadow-sm rounded-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Round 01 Examination
              </span>
              <h2 className="formal-heading-dark text-xl font-semibold mt-0.5">
                Competency & Experience Panel Interview
              </h2>
            </div>

            <span className={`status-pill self-start sm:self-auto ${
              interviewStatus === 'accepted'
                ? 'status-pill-success'
                : interviewStatus === 'reschedule-requested'
                ? 'status-pill-warning'
                : 'status-pill-info'
            }`}>
              {interviewStatus === 'accepted'
                ? 'Confirmed by Candidate'
                : interviewStatus === 'reschedule-requested'
                ? 'Reschedule Requested'
                : 'Awaiting Candidate Confirmation'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Date & Time</span>
              <span className="text-sm font-bold text-slate-900">Thursday, 15 Oct 2026</span>
              <span className="text-xs text-slate-600 block mt-0.5">14:00 – 14:45 SAST</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Format</span>
              <span className="text-sm font-bold text-slate-900">Microsoft Teams Video</span>
              <span className="text-xs text-slate-500 block mt-0.5">Encrypted link supplied upon confirmation</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Interview Panel</span>
              <span className="text-sm font-bold text-slate-900">Sarah Johnson</span>
              <span className="text-xs text-slate-500 block mt-0.5">Senior Talent Partner</span>
            </div>
          </div>

          {interviewStatus === 'pending' && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAcceptInterview}
                className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-2.5 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
                style={{ borderRadius: 0 }}
              >
                Accept Interview Slot
              </button>

              <button
                type="button"
                onClick={() => setRescheduleModal(true)}
                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-4 font-semibold text-xs uppercase tracking-wider rounded-none"
                style={{ borderRadius: 0 }}
              >
                Request Alternate Slot
              </button>
            </div>
          )}

          {interviewStatus === 'accepted' && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between">
              <span>Slot confirmed. Calendar invitation dispatched to your registered email address.</span>
              <button
                onClick={() => setRescheduleModal(true)}
                className="text-emerald-900 underline font-semibold ml-4"
              >
                Need to reschedule?
              </button>
            </div>
          )}

          {interviewStatus === 'reschedule-requested' && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-xs text-amber-900">
              Your reschedule request has been forwarded to Sarah Johnson. An updated invitation will follow shortly.
            </div>
          )}
        </div>

        {/* Lower Two-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
              Submitted Dossier Documents
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">{application.cv?.name || 'Curriculum_Vitae.pdf'}</span>
                  <span className="text-slate-500 text-[11px]">Primary CV • Extracted</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">{application.documents?.certifiedId?.name || 'Certified_ID.pdf'}</span>
                  <span className="text-slate-500 text-[11px]">South African Identity • Encrypted</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
              POPIA Data Rights
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exercise your statutory rights under South African POPIA regulations.
            </p>
            <div className="space-y-2 text-xs">
              <Link
                to="/portal/privacy"
                className="block p-2.5 bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 font-medium"
              >
                Download My Data (Section 23) →
              </Link>
              <Link
                to="/portal/privacy"
                className="block p-2.5 bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 font-medium"
              >
                Request Correction (Section 24) →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={rescheduleModal}
        onClose={() => setRescheduleModal(false)}
        title="Request Alternate Interview Slot"
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>Please advise our talent coordinator of your scheduling availability:</p>
          <textarea
            rows={3}
            value={rescheduleNote}
            onChange={(e) => setRescheduleNote(e.target.value)}
            placeholder="e.g. I am available next Tuesday and Wednesday after 14:00 SAST..."
            className="input-field text-xs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRescheduleModal(false)}
              className="border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestReschedule}
              className="bg-[#0f1b29] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
