import { useState } from 'react'
import { Briefcase, Copy, Check, ExternalLink, Users, Link as LinkIcon } from 'lucide-react'
import Toast from '../../components/Toast'

export default function AdminJobsPage() {
  const [copiedId, setCopiedId] = useState(null)
  const [toast, setToast] = useState(null)

  const jobs = [
    {
      id: 'job-001',
      title: 'Senior Business Analyst',
      department: 'Technology & Product',
      location: 'Johannesburg (Hybrid)',
      type: 'Full-time',
      applicants: 28,
      postedDate: '01 Feb 2026',
    },
    {
      id: 'job-002',
      title: 'Software Engineer (React / Node)',
      department: 'Engineering',
      location: 'Remote (South Africa)',
      type: 'Full-time',
      applicants: 16,
      postedDate: '05 Feb 2026',
    },
    {
      id: 'job-003',
      title: 'UX / UI Product Designer',
      department: 'Design',
      location: 'Cape Town (Hybrid)',
      type: 'Full-time',
      applicants: 11,
      postedDate: '10 Feb 2026',
    },
  ]

  const copyTrackedLink = (jobId) => {
    const origin = window.location.origin
    const url = `${origin}/apply/account?jobId=${jobId}&src=linkedin`
    navigator.clipboard?.writeText(url)
    setCopiedId(jobId)
    setToast({ message: 'Tracked LinkedIn application link copied to clipboard!', type: 'success' })
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Postings & LinkedIn Campaign Links</h1>
        <p className="text-xs text-gray-500 mt-1">
          Generate campaign URLs with <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-blue-700">?src=linkedin</code> tracking parameters to monitor sourcing channels.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{job.id}</span>
                <h3 className="font-bold text-base text-gray-900">{job.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                <span>{job.department}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-blue-700 font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  {job.applicants} candidates
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyTrackedLink(job.id)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                {copiedId === job.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === job.id ? 'Copied Link!' : 'Copy LinkedIn Link'}</span>
              </button>

              <a
                href={`/apply/account?jobId=${job.id}&src=linkedin`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 text-gray-600"
                title="Test Applicant Flow"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Flow</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
