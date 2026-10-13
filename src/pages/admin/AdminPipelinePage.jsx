import { useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { Kanban, ArrowRight, UserCheck, Clock, Award, MoveRight } from 'lucide-react'

const PIPELINE_COLUMNS = [
  { key: 'submitted', label: 'Submitted', color: 'border-blue-500' },
  { key: 'under-review', label: 'Under Review', color: 'border-indigo-500' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'border-amber-500' },
  { key: 'interview', label: 'Interview', color: 'border-emerald-500' },
  { key: 'offer', label: 'Offer', color: 'border-purple-500' },
  { key: 'hired', label: 'Hired', color: 'border-green-600' },
  { key: 'rejected', label: 'Rejected', color: 'border-red-500' },
]

export default function AdminPipelinePage() {
  const { candidates, moveToStage, setSelectedCandidate } = useAdminStore()
  const [selectedJob, setSelectedJob] = useState('')

  const filtered = candidates.filter(c => {
    if (c.status === 'incomplete') return false
    if (selectedJob && c.job.id !== selectedJob) return false
    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Kanban Board</h1>
          <p className="text-xs text-gray-500 mt-1">
            Visual stage management across recruitment funnel. Move candidates between stages with one click.
          </p>
        </div>

        {/* Filter by Job */}
        <select
          value={selectedJob}
          onChange={e => setSelectedJob(e.target.value)}
          className="input-field py-2 text-xs sm:w-60 bg-white"
        >
          <option value="">All Jobs ({candidates.length})</option>
          <option value="job-001">Senior Business Analyst</option>
          <option value="job-002">Software Engineer</option>
          <option value="job-003">UX Designer</option>
        </select>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {PIPELINE_COLUMNS.map(col => {
          const colCandidates = filtered.filter(c => c.status === col.key)
          return (
            <div
              key={col.key}
              className="w-72 flex-shrink-0 bg-gray-50/70 rounded-2xl border border-gray-200 p-3 flex flex-col max-h-[calc(100vh-220px)]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-3`}>
                <span className="font-bold text-xs text-gray-800">{col.label}</span>
                <span className="font-mono text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-semibold">
                  {colCandidates.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colCandidates.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-xs italic bg-white/50 rounded-xl border border-dashed border-gray-200">
                    No candidates in this stage
                  </div>
                ) : (
                  colCandidates.map(c => (
                    <div
                      key={c.id}
                      className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 group-hover:text-blue-700 transition-colors">
                            {c.name}
                          </h4>
                          <span className="text-[11px] text-gray-400 block">{c.job.title}</span>
                        </div>
                        <span className={`text-[11px] font-mono font-bold ${c.score >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                          {c.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                        <span>{c.province || 'Gauteng'}</span>
                        <span className="capitalize">{c.source}</span>
                      </div>

                      {/* Quick Move Selector */}
                      <div className="pt-1">
                        <select
                          value={c.status}
                          onChange={e => moveToStage(c.id, e.target.value)}
                          className="w-full text-[10px] py-1 px-1.5 border border-gray-200 rounded bg-gray-50 text-gray-600 hover:border-blue-400"
                        >
                          <option value="submitted">Move to: Submitted</option>
                          <option value="under-review">Move to: Under Review</option>
                          <option value="shortlisted">Move to: Shortlisted</option>
                          <option value="interview">Move to: Interview</option>
                          <option value="offer">Move to: Offer</option>
                          <option value="hired">Move to: Hired</option>
                          <option value="rejected">Move to: Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
