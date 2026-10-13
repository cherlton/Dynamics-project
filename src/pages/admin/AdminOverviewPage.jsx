import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import {
  Users, UserCheck, Calendar, TrendingUp, Briefcase, Award,
  ArrowRight, Clock, CheckCircle2, ChevronRight
} from 'lucide-react'

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const { candidates, getStats, setSelectedCandidate } = useAdminStore()
  const stats = getStats()

  const recentCandidates = candidates.filter(c => c.status !== 'incomplete').slice(0, 6)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Acquisition Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time pipeline metrics and applicant inflow across all open positions.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/applications')}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View All Applications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* New 7 Days */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">New (7 Days)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.newApplications}</div>
          <span className="text-[11px] text-green-600 font-medium">↑ +14% vs previous week</span>
        </div>

        {/* Total Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</div>
          <span className="text-[11px] text-gray-400">{stats.incomplete} incomplete registrants</span>
        </div>

        {/* Shortlisted */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shortlisted</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.shortlisted}</div>
          <span className="text-[11px] text-amber-600 font-medium">Ready for interview</span>
        </div>

        {/* Interviews */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Interviews</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.interviews}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Scheduled round 1 & 2</span>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Avg Fit Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgScore}%</div>
          <span className="text-[11px] text-gray-400">Automated screening fit</span>
        </div>
      </div>

      {/* Funnel & Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Recruitment Funnel Progress
          </h2>
          <div className="space-y-3.5">
            {[
              { label: 'Submitted Applications', count: stats.totalCandidates, color: 'bg-blue-600', pct: 100 },
              { label: 'Under Active Review', count: stats.underReview + stats.shortlisted + stats.interviews, color: 'bg-indigo-600', pct: 75 },
              { label: 'Shortlisted for Interview', count: stats.shortlisted + stats.interviews, color: 'bg-amber-500', pct: 40 },
              { label: 'Interviews Scheduled', count: stats.interviews, color: 'bg-emerald-600', pct: 22 },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-800">{step.label}</span>
                  <span className="font-mono text-gray-600 font-bold">{step.count} candidates</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Applications by Source
            </h2>
            <div className="space-y-3">
              {[
                { label: 'LinkedIn Tracked (?src=linkedin)', count: stats.bySource.linkedin, color: 'bg-[#0077b5]' },
                { label: 'Direct Portal Applications', count: stats.bySource.direct, color: 'bg-blue-600' },
                { label: 'Employee Referrals', count: stats.bySource.referral, color: 'bg-emerald-600' },
                { label: 'Career Site / Search', count: stats.bySource['career-site'], color: 'bg-purple-600' },
              ].map(src => {
                const total = stats.totalCandidates || 1
                const pct = Math.round((src.count / total) * 100)
                return (
                  <div key={src.label} className="text-xs">
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span className="font-medium truncate pr-2">{src.label}</span>
                      <span className="font-mono font-bold">{pct}% ({src.count})</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${src.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate('/admin/jobs')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Generate Tracked Job Links →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Applications</h2>
            <p className="text-xs text-gray-500">Latest submissions awaiting initial triage</p>
          </div>
          <button
            onClick={() => navigate('/admin/applications')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Fit Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-[11px] text-gray-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{c.job.title}</td>
                  <td className="py-3 px-4 text-gray-500">{c.appliedDateFormatted}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                      {c.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono font-bold ${c.score >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                      {c.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`status-pill ${
                      c.status === 'shortlisted' ? 'status-pill-success' :
                      c.status === 'interview' ? 'status-pill-info' :
                      c.status === 'under-review' ? 'status-pill-warning' :
                      'status-pill-neutral'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCandidate(c.id)
                        navigate('/admin/applications')
                      }}
                      className="text-blue-700 font-semibold hover:text-blue-900"
                    >
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
