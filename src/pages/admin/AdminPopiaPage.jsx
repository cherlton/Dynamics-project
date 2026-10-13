import { useState } from 'react'
import { Shield, Clock, AlertTriangle, CheckCircle2, User, FileText, Trash2, Check } from 'lucide-react'
import Toast from '../../components/Toast'

export default function AdminPopiaPage() {
  const [toast, setToast] = useState(null)

  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      candidateName: 'Zanele Khumalo',
      email: 'zanele.khumalo@email.co.za',
      type: 'Right of Access (Download)',
      requestedDate: '07 Oct 2026',
      dueDate: '21 Oct 2026',
      status: 'pending',
    },
    {
      id: 'REQ-002',
      candidateName: 'Sipho Ndlovu',
      email: 'sipho.ndlovu@email.co.za',
      type: 'Correction of Details',
      requestedDate: '05 Oct 2026',
      dueDate: '19 Oct 2026',
      status: 'pending',
    },
    {
      id: 'REQ-003',
      candidateName: 'Lindiwe Zulu',
      email: 'lindiwe.zulu@email.co.za',
      type: 'Withdrawal & Deletion',
      requestedDate: '01 Oct 2026',
      dueDate: '15 Oct 2026',
      status: 'completed',
    },
  ])

  const handleResolve = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r))
    setToast({ message: `Request ${id} marked as resolved and logged into compliance audit.`, type: 'success' })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">POPIA Compliance & Retention Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Supervise data subject requests, statutory retention windows, and privacy audit logs (Act 4 of 2013).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-green-800 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Information Officer Compliance Queue Active</span>
        </div>
      </div>

      {/* Retention Alert Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <h3 className="font-bold text-sm">Automated 12-Month Retention Monitoring</h3>
          <p>
            Candidates who did not opt into the talent pool or whose applications have been inactive for over 12 months are scheduled for automatic anonymization.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="font-semibold text-amber-950">Next scheduled cleanup: <strong>01 Nov 2026</strong> (4 expired records)</span>
            <button
              onClick={() => setToast({ message: '4 expired records anonymized successfully.', type: 'info' })}
              className="text-amber-900 underline hover:text-amber-950 font-bold"
            >
              Run Audit Now
            </button>
          </div>
        </div>
      </div>

      {/* Data Subject Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Candidate Data Requests Queue</h2>
            <p className="text-xs text-gray-500">Statutory responses must be fulfilled within 14 working days</p>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
            {requests.filter(r => r.status === 'pending').length} Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Request Type</th>
                <th className="py-3 px-4">Date Received</th>
                <th className="py-3 px-4">Statutory Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900">{req.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{req.candidateName}</div>
                    <div className="text-[11px] text-gray-400">{req.email}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{req.type}</td>
                  <td className="py-3 px-4 text-gray-500">{req.requestedDate}</td>
                  <td className="py-3 px-4 font-medium text-amber-700">{req.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`status-pill ${req.status === 'completed' ? 'status-pill-success' : 'status-pill-warning'}`}>
                      {req.status === 'completed' ? 'Resolved' : 'Pending Action'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleResolve(req.id)}
                        className="btn-primary py-1 px-3 text-[11px]"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px] italic">Logged</span>
                    )}
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
