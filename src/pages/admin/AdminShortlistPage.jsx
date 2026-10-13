import { useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { useEmailStore } from '../../store/emailStore'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import { Calendar, Video, Clock, UserCheck, Send, CheckCircle2, ChevronRight, MapPin } from 'lucide-react'

export default function AdminShortlistPage() {
  const { candidates, moveToStage } = useAdminStore()
  const sendEmail = useEmailStore(s => s.sendEmail)

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [interviewDate, setInterviewDate] = useState('2026-10-15')
  const [interviewTime, setInterviewTime] = useState('14:00')
  const [interviewFormat, setInterviewFormat] = useState('Microsoft Teams Video')
  const [toast, setToast] = useState(null)

  const shortlisted = candidates.filter(c => c.status === 'shortlisted' || c.status === 'interview')

  const handleOpenSchedule = (c) => {
    setSelectedCandidate(c)
    setScheduleModalOpen(true)
  }

  const handleConfirmSchedule = () => {
    if (!selectedCandidate) return
    moveToStage(selectedCandidate.id, 'interview')

    // Generate Interview Invitation Email
    sendEmail({
      to: selectedCandidate.email,
      subject: `Interview Invitation – ${selectedCandidate.job.title}`,
      type: 'interview',
      body: `Dear ${selectedCandidate.firstName},\n\nYou are invited to attend an interview for ${selectedCandidate.job.title}.\n\nDate: ${interviewDate}\nTime: ${interviewTime} SAST\nFormat: ${interviewFormat}\n\nPlease log in to your candidate portal to accept this slot.`,
      link: `/login?returnTo=/portal&email=${encodeURIComponent(selectedCandidate.email)}`,
    })

    setScheduleModalOpen(false)
    setToast({ message: `Interview invitation scheduled and dispatched to ${selectedCandidate.name}!`, type: 'success' })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shortlisted Candidates</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review candidates approved for progression and coordinate interview schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortlisted.map((cand) => (
          <div key={cand.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{cand.name}</h3>
                <span className="text-xs text-gray-500">{cand.job.title}</span>
              </div>
              <span className={`status-pill ${cand.status === 'interview' ? 'status-pill-info' : 'status-pill-success'}`}>
                {cand.status === 'interview' ? 'Interview Scheduled' : 'Shortlisted'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
              <div>
                <span className="text-gray-400 block text-[10px]">Fit Score</span>
                <span className="font-mono font-bold text-green-700">{cand.score}%</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Experience</span>
                <span className="font-semibold text-gray-800">{cand.yearsExperience} years</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Notice Period</span>
                <span className="font-semibold text-gray-800">{cand.screening?.noticePeriod || '1 Month'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Location</span>
                <span className="font-semibold text-gray-800">{cand.province || 'Gauteng'}</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenSchedule(cand)}
              className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{cand.status === 'interview' ? 'Update Interview Slot' : 'Schedule Interview'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule Interview: ${selectedCandidate?.name}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="input-label text-xs">Interview Date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={e => setInterviewDate(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="input-label text-xs">Start Time (SAST)</label>
            <input
              type="time"
              value={interviewTime}
              onChange={e => setInterviewTime(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="input-label text-xs">Meeting Format</label>
            <select
              value={interviewFormat}
              onChange={e => setInterviewFormat(e.target.value)}
              className="input-field text-xs bg-white"
            >
              <option value="Microsoft Teams Video">Microsoft Teams Video</option>
              <option value="Zoom Meeting">Zoom Meeting</option>
              <option value="In-person (Johannesburg Office)">In-person (Johannesburg Office)</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800">
            Clicking send will update the candidate's status to <strong>Interview</strong> and dispatch a calendar invitation email.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setScheduleModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleConfirmSchedule} className="btn-primary text-xs flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Interview Invite</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
