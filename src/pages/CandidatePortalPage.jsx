import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import {
  CheckCircle2, Clock, Calendar, Video, MapPin, FileText,
  Shield, AlertCircle, LogOut, Download, MessageSquare, ChevronRight,
  ExternalLink, User, Lock
} from 'lucide-react'

export default function CandidatePortalPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const application = useApplicationStore(s => s.application)

  const [interviewStatus, setInterviewStatus] = useState('pending') // 'pending' | 'accepted' | 'reschedule-requested'
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [rescheduleNote, setRescheduleNote] = useState('')
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'documents' | 'history'

  // Application stage tracking
  const currentStage = 'shortlisted' // in demo, this candidate is shortlisted!

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Candidate Portal</span>
              <span className="text-[11px] text-gray-400">Application Reference: APP-2026-00123</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>{user?.name || 'Thabo Mokoena'} ({user?.email})</span>
            </div>

            <Link
              to="/portal/privacy"
              className="text-xs text-blue-700 hover:text-blue-900 font-medium hidden md:inline"
            >
              Privacy & Data Rights
            </Link>

            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 py-1.5 px-3"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Shortlist Banner Highlight */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/50 text-blue-100 text-xs font-semibold mb-2">
              Status Update: Shortlisted
            </span>
            <h1 className="text-2xl font-bold">Congratulations! You've Been Shortlisted</h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Your profile for <strong>Senior Business Analyst</strong> has progressed to the interview stage. Please review the proposed interview slot below.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('interview-card')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-blue-50 transition-colors self-start md:self-auto shadow-sm"
          >
            Review Interview Details
          </button>
        </div>

        {/* Application Stage Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
            Application Status Tracker
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stages.map((st, idx) => (
              <div key={st.key} className="relative">
                <div className={`p-4 rounded-xl border transition-all ${
                  st.current
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                    : st.done
                      ? 'border-green-200 bg-green-50/40'
                      : 'border-gray-200 bg-gray-50/50 text-gray-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">0{idx + 1}</span>
                    {st.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <h3 className={`text-sm font-semibold ${st.current ? 'text-blue-900' : st.done ? 'text-gray-900' : 'text-gray-400'}`}>
                    {st.label}
                  </h3>
                  <span className="text-[11px] text-gray-500 block mt-1">{st.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Slot Card */}
        <div id="interview-card" className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Round 1: Competency & Experience Interview</h2>
                <span className="text-xs text-gray-500">Proposed by Talent Acquisition Team</span>
              </div>
            </div>

            <span className={`status-pill ${
              interviewStatus === 'accepted'
                ? 'status-pill-success'
                : interviewStatus === 'reschedule-requested'
                  ? 'status-pill-warning'
                  : 'status-pill-info'
            }`}>
              {interviewStatus === 'accepted' ? 'Confirmed by Candidate' : interviewStatus === 'reschedule-requested' ? 'Reschedule Requested' : 'Awaiting Confirmation'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-400 block font-medium">Date & Time</span>
              <span className="text-sm font-bold text-gray-900">Thursday, 15 Oct 2026</span>
              <span className="text-xs text-blue-600 block mt-0.5">14:00 – 14:45 SAST</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-400 block font-medium">Format</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mt-0.5">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Microsoft Teams Video</span>
              </div>
              <span className="text-xs text-gray-500 block mt-0.5">Link provided upon confirmation</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-400 block font-medium">Interview Panel</span>
              <span className="text-sm font-bold text-gray-900">Sarah Johnson</span>
              <span className="text-xs text-gray-500 block mt-0.5">Lead Talent Manager</span>
            </div>
          </div>

          {interviewStatus === 'pending' && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAcceptInterview}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Interview Slot</span>
              </button>

              <button
                type="button"
                onClick={() => setRescheduleModal(true)}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Request Another Time
              </button>

              <button
                type="button"
                onClick={() => alert('Calendar invite (.ics) downloaded')}
                className="btn-ghost text-xs py-2 px-3 text-gray-600"
              >
                Add to Calendar
              </button>
            </div>
          )}

          {interviewStatus === 'accepted' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>You have accepted this slot. Calendar invitation sent to your email.</span>
              </div>
              <button
                onClick={() => setRescheduleModal(true)}
                className="text-green-800 underline hover:text-green-950 font-medium"
              >
                Need to reschedule?
              </button>
            </div>
          )}

          {interviewStatus === 'reschedule-requested' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              Your request for an alternate time has been sent to Sarah Johnson. You will receive an updated invitation shortly.
            </div>
          )}
        </div>

        {/* Two-column layout for Documents & Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Documents Card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">My Uploaded Documents</h3>
              <span className="text-xs text-gray-400">Locked after submission</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Thabo_Mokoena_CV.pdf</span>
                    <span className="text-gray-400">CV / Resume • 2.4 MB</span>
                  </div>
                </div>
                <button className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Certified_ID_Copy.pdf</span>
                    <span className="text-gray-400">South African ID • Encrypted</span>
                  </div>
                </div>
                <span className="text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* POPIA & Privacy Actions Quick Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Lock className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-gray-900 text-sm">Data & POPIA Rights</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Under POPIA, you retain full rights over your personal recruitment records.
            </p>

            <div className="space-y-2">
              <Link
                to="/portal/privacy"
                className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-xs text-gray-700 transition-colors"
              >
                <span>Download My Data (Section 23)</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                to="/portal/privacy"
                className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-xs text-gray-700 transition-colors"
              >
                <span>Request Correction (Section 24)</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                to="/portal/privacy"
                className="w-full text-left p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-between text-xs text-red-700 transition-colors"
              >
                <span>Withdraw Application / Erasure</span>
                <ChevronRight className="w-3.5 h-3.5 text-red-400" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModal}
        onClose={() => setRescheduleModal(false)}
        title="Request Alternate Interview Slot"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Please let our talent coordinator know what dates and times work best for your schedule:
          </p>
          <textarea
            rows={3}
            value={rescheduleNote}
            onChange={(e) => setRescheduleNote(e.target.value)}
            placeholder="e.g. I am available any day next week after 15:00 SAST..."
            className="input-field text-xs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRescheduleModal(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestReschedule}
              className="btn-primary text-xs"
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
