import { useState, useMemo } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { useEmailStore } from '../../store/emailStore'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import {
  Search, Filter, X, ChevronDown, Check, UserCheck, XCircle,
  FileText, Lock, Eye, EyeOff, Send, MessageSquare, Tag,
  Clock, ShieldAlert, Download, AlertTriangle, ArrowUpDown
} from 'lucide-react'

export default function AdminApplicationsPage() {
  const {
    candidates, filters, updateFilters, clearFilters,
    selectedCandidateId, setSelectedCandidate,
    getFilteredCandidates, shortlistCandidate, rejectCandidate,
    moveToStage, addNote, addTag, removeTag, sortBy, sortOrder, setSorting
  } = useAdminStore()

  const sendEmail = useEmailStore(s => s.sendEmail)

  const [page, setPage] = useState(1)
  const pageSize = 10

  // Modals state
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('Qualifications do not match minimum requirements')
  const [shortlistMessage, setShortlistMessage] = useState('We are pleased to invite you for an initial interview round.')
  const [idRevealed, setIdRevealed] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [newTagInput, setNewTagInput] = useState('')
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'documents' | 'screening' | 'notes' | 'activity'

  const filtered = getFilteredCandidates()
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || paginated[0]

  const handleShortlistConfirm = () => {
    if (!activeCandidate) return
    shortlistCandidate(activeCandidate.id)

    // Generate Shortlist Notification Email
    sendEmail({
      to: activeCandidate.email,
      subject: `Good news – you’ve been shortlisted for ${activeCandidate.job.title}`,
      type: 'shortlist',
      body: `Dear ${activeCandidate.firstName},\n\nWe are pleased to inform you that you have been shortlisted for the ${activeCandidate.job.title} role!\n\n${shortlistMessage}\n\nPlease click below to review interview slots.`,
      link: `/login?returnTo=/portal&email=${encodeURIComponent(activeCandidate.email)}`,
    })

    setShortlistModalOpen(false)
    setToast({ message: `Candidate shortlisted! Shortlist invitation email queued.`, type: 'success' })
  }

  const handleRejectConfirm = () => {
    if (!activeCandidate) return
    rejectCandidate(activeCandidate.id, rejectionReason)

    // Generate Rejection Email
    sendEmail({
      to: activeCandidate.email,
      subject: `Application update – ${activeCandidate.job.title}`,
      type: 'rejection',
      body: `Dear ${activeCandidate.firstName},\n\nThank you for taking the time to apply for ${activeCandidate.job.title}. After careful consideration, we will not be moving forward with your application at this time.\n\nReason: ${rejectionReason}`,
      link: '/login',
    })

    setRejectModalOpen(false)
    setToast({ message: `Candidate rejected. Outcome logged.`, type: 'info' })
  }

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!newNote.trim() || !activeCandidate) return
    addNote(activeCandidate.id, newNote.trim())
    setNewNote('')
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (!newTagInput.trim() || !activeCandidate) return
    addTag(activeCandidate.id, newTagInput.trim())
    setNewTagInput('')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Applications</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review applicant profiles, evaluate CV parsing results, and trigger shortlisting workflows.
          </p>
        </div>
        <div className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">
          Showing <strong>{filtered.length}</strong> candidates
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name or email..."
              value={filters.search}
              onChange={e => updateFilters('search', e.target.value)}
              className="input-field pl-9 py-2 text-xs"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filters.job}
            onChange={e => updateFilters('job', e.target.value)}
            className="input-field py-2 text-xs md:w-48 bg-white"
          >
            <option value="">All Job Roles</option>
            <option value="job-001">Senior Business Analyst</option>
            <option value="job-002">Software Engineer</option>
            <option value="job-003">UX Designer</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={e => updateFilters('status', e.target.value)}
            className="input-field py-2 text-xs md:w-40 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="incomplete">Incomplete</option>
          </select>

          {/* Source Filter */}
          <select
            value={filters.source}
            onChange={e => updateFilters('source', e.target.value)}
            className="input-field py-2 text-xs md:w-36 bg-white"
          >
            <option value="">All Sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="direct">Direct</option>
            <option value="referral">Referral</option>
            <option value="career-site">Career Site</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={clearFilters}
            className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Split View: Table on Left / Selected Candidate Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (7 cols on Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold select-none">
                <tr>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-blue-700"
                    onClick={() => setSorting('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Candidate</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Role</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-blue-700"
                    onClick={() => setSorting('score')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Score</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {paginated.map((cand) => {
                  const isSelected = activeCandidate?.id === cand.id
                  return (
                    <tr
                      key={cand.id}
                      onClick={() => { setSelectedCandidate(cand.id); setIdRevealed(false) }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <span>{cand.name}</span>
                          {cand.hasKnockout && (
                            <span title="Knock-out flag present" className="text-amber-500">
                              <AlertTriangle className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">{cand.province || 'SA Resident'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-gray-800 text-[11px] truncate block max-w-[130px]">
                          {cand.job.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{cand.appliedDateFormatted}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${cand.score >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                          {cand.score}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`status-pill ${
                          cand.status === 'shortlisted' ? 'status-pill-success' :
                          cand.status === 'interview' ? 'status-pill-info' :
                          cand.status === 'under-review' ? 'status-pill-warning' :
                          cand.status === 'rejected' ? 'status-pill-danger' :
                          'status-pill-neutral'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          className="text-blue-700 hover:text-blue-900 font-bold text-xs"
                        >
                          →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary py-1 px-2.5 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary py-1 px-2.5 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Candidate Profile Details (5 cols on Desktop) */}
        {activeCandidate ? (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 sticky top-24">
            {/* Header / Avatar */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-mono text-gray-400 block">{activeCandidate.id}</span>
                <h2 className="text-lg font-bold text-gray-900">{activeCandidate.name}</h2>
                <span className="text-xs text-gray-500">{activeCandidate.job.title}</span>
              </div>
              <span className={`status-pill ${
                activeCandidate.status === 'shortlisted' ? 'status-pill-success' :
                activeCandidate.status === 'interview' ? 'status-pill-info' :
                activeCandidate.status === 'under-review' ? 'status-pill-warning' :
                activeCandidate.status === 'rejected' ? 'status-pill-danger' :
                'status-pill-neutral'
              }`}>
                {activeCandidate.status}
              </span>
            </div>

            {/* Main Action Bar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShortlistModalOpen(true)}
                disabled={activeCandidate.status === 'shortlisted'}
                className="btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Shortlist Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                disabled={activeCandidate.status === 'rejected'}
                className="btn-secondary text-xs py-2.5 text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Reject</span>
              </button>
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-gray-200 text-xs font-medium">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'documents', label: 'Documents' },
                { key: 'screening', label: 'Screening' },
                { key: 'notes', label: `Notes (${activeCandidate.notes?.length || 0})` },
                { key: 'activity', label: 'Audit Log' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`py-2 px-3 border-b-2 -mb-px transition-colors ${
                    activeTab === t.key
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Contact info */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Email Address</span>
                    <span className="font-semibold text-gray-800">{activeCandidate.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Mobile</span>
                    <span className="font-semibold text-gray-800">{activeCandidate.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Location</span>
                    <span className="font-semibold text-gray-800">{activeCandidate.province || 'Gauteng'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Qualification</span>
                    <span className="font-semibold text-gray-800">{activeCandidate.qualification}</span>
                  </div>
                </div>

                {/* POPIA Masked ID Number */}
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>SA ID Number (Sensitive POPIA Data)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIdRevealed(!idRevealed)
                        if (!idRevealed) {
                          setToast({ message: 'Audit: ID view recorded by Sarah Johnson', type: 'info' })
                        }
                      }}
                      className="text-blue-700 hover:text-blue-900 font-medium text-[11px] flex items-center gap-1"
                    >
                      {idRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{idRevealed ? 'Hide' : 'Reveal ID (Logged)'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-sm font-semibold text-gray-900">
                    {idRevealed ? activeCandidate.idNumber : `********${activeCandidate.idNumber.slice(-4)}`}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold mb-1.5 uppercase">Candidate Tags</span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(activeCandidate.tags || []).map(t => (
                      <span key={t} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <span>{t}</span>
                        <button onClick={() => removeTag(activeCandidate.id, t)} className="text-gray-400 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <form onSubmit={handleAddTag} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag (e.g. Strong, Callback)..."
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      className="input-field py-1 text-xs"
                    />
                    <button type="submit" className="btn-secondary py-1 px-3 text-xs">Add</button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 2: Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-semibold text-gray-900 block">{activeCandidate.cv?.name || 'CV.pdf'}</span>
                      <span className="text-gray-400 text-[10px]">CV / Resume • Parsed by system</span>
                    </div>
                  </div>
                  <button className="text-blue-700 hover:text-blue-900 font-medium">Download</button>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="font-semibold text-gray-900 block">Certified_ID_Document.pdf</span>
                      <span className="text-gray-400 text-[10px]">Certified Copy • Verification check passed</span>
                    </div>
                  </div>
                  <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Verified
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Screening */}
            {activeTab === 'screening' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Legally Entitled to Work in SA</span>
                  <span className="font-semibold text-gray-900 capitalize">{activeCandidate.screening?.legallyEntitled || 'Yes'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Notice Period</span>
                  <span className="font-semibold text-gray-900">{activeCandidate.screening?.noticePeriod || '1 Month'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Salary Expectation</span>
                  <span className="font-semibold text-gray-900">{activeCandidate.screening?.salaryExpectation || 'R 55,000'}</span>
                </div>
              </div>
            )}

            {/* Tab 4: Internal Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(activeCandidate.notes || []).length === 0 ? (
                    <p className="text-gray-400 italic">No recruiter notes added yet.</p>
                  ) : (
                    activeCandidate.notes.map((n, i) => (
                      <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span className="font-bold text-gray-700">{n.by}</span>
                          <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-800">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-gray-100">
                  <input
                    type="text"
                    placeholder="Add an internal note or @mention..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    className="input-field py-1.5 text-xs"
                  />
                  <button type="submit" className="btn-primary py-1.5 px-3 text-xs">Post</button>
                </form>
              </div>
            )}

            {/* Tab 5: Activity Log */}
            {activeTab === 'activity' && (
              <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                {(activeCandidate.activityLog || []).map((act, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-800 block">{act.action}</span>
                      <span className="text-[10px] text-gray-400">
                        by {act.by} • {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-xs">
            Select a candidate from the table to inspect details.
          </div>
        )}
      </div>

      {/* Shortlist Confirmation Modal with Live Email Preview */}
      <Modal
        isOpen={shortlistModalOpen}
        onClose={() => setShortlistModalOpen(false)}
        title="Confirm Shortlist & Generate Invitation Email"
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Shortlisting <strong>{activeCandidate?.name}</strong> will update their status to <em>Shortlisted</em> and dispatch an interview invitation with portal link.
          </p>

          <div>
            <label className="input-label text-xs">Custom Note for Candidate</label>
            <textarea
              rows={3}
              value={shortlistMessage}
              onChange={e => setShortlistMessage(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          {/* Live Email Preview Box */}
          <div className="border border-blue-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-blue-700 text-white p-3 font-semibold text-xs flex justify-between">
              <span>Shortlist Notification Email Preview</span>
              <span className="text-blue-200">Will be sent to {activeCandidate?.email}</span>
            </div>
            <div className="p-4 space-y-2 bg-gray-50 text-gray-800 text-xs font-mono">
              <p>Subject: Good news – you’ve been shortlisted for {activeCandidate?.job.title}</p>
              <hr className="border-gray-200" />
              <p>Dear {activeCandidate?.firstName},</p>
              <p>{shortlistMessage}</p>
              <div className="pt-2">
                <span className="inline-block bg-blue-600 text-white px-3 py-1.5 rounded font-bold text-[11px]">
                  View Interview Slots & Confirm
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShortlistModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleShortlistConfirm} className="btn-primary text-xs flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Email</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Confirm Application Outcome: Reject"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Please choose the POPIA-compliant reason for not progressing with <strong>{activeCandidate?.name}</strong>:
          </p>
          <select
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            className="input-field text-xs bg-white"
          >
            <option value="Qualifications do not match minimum requirements">Qualifications do not match minimum requirements</option>
            <option value="Lacks specific domain/tooling experience">Lacks specific domain/tooling experience</option>
            <option value="Salary expectation exceeds budgeted band">Salary expectation exceeds budgeted band</option>
            <option value="Role closed / Filled by existing shortlist">Role closed / Filled by existing shortlist</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setRejectModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleRejectConfirm} className="btn-danger text-xs">Confirm Rejection</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
