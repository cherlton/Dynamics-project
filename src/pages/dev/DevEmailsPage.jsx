import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEmailStore } from '../../store/emailStore'
import { Mail, ExternalLink, Trash2, ArrowLeft, Shield } from 'lucide-react'

export default function DevEmailsPage() {
  const { emails, clearEmails } = useEmailStore()
  const [selectedEmailId, setSelectedEmailId] = useState(emails[0]?.id)

  const activeEmail = emails.find(e => e.id === selectedEmailId) || emails[0]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-gray-500 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-gray-900">Visual Email Sandbox & Inspector</h1>
              <span className="text-xs text-gray-400">Section 12: Visual Email Templates & Generated Logs</span>
            </div>
          </div>
          <button
            onClick={clearEmails}
            className="btn-secondary text-xs py-1.5 px-3 text-red-600 hover:bg-red-50"
          >
            Clear Log
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Email List (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Generated Outbox ({emails.length})
          </span>

          {emails.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs italic">
              No emails generated yet. Submitting applications or shortlisting candidates will populate emails here.
            </div>
          ) : (
            emails.map(em => (
              <div
                key={em.id}
                onClick={() => setSelectedEmailId(em.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1 ${
                  activeEmail?.id === em.id
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">{em.to}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-gray-700 font-medium truncate">{em.subject}</div>
                <span className="inline-block text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                  {em.type}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Visual Rendered Template (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {activeEmail ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Blue Header Band with Logo Placeholder */}
              <div className="bg-[#1D4ED8] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                    RP
                  </div>
                  <div>
                    <h2 className="font-bold text-base tracking-tight">Recruitment Portal</h2>
                    <span className="text-xs text-blue-200">Talent Acquisition Notification</span>
                  </div>
                </div>
                <span className="text-xs text-blue-200 font-mono">Template: {activeEmail.type}</span>
              </div>

              {/* White Body */}
              <div className="p-6 md:p-8 space-y-5 text-gray-800 text-sm leading-relaxed">
                <div className="border-b border-gray-100 pb-3 text-xs text-gray-500 space-y-1">
                  <div><strong>To:</strong> {activeEmail.to}</div>
                  <div><strong>Subject:</strong> {activeEmail.subject}</div>
                </div>

                <div className="whitespace-pre-line text-gray-700">
                  {activeEmail.body}
                </div>

                {activeEmail.link && (
                  <div className="pt-4">
                    <Link
                      to={activeEmail.link}
                      className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-semibold text-xs hover:bg-blue-600 shadow-md shadow-blue-200 transition-colors"
                    >
                      <span>
                        {activeEmail.type === 'shortlist'
                          ? 'View Interview Slots & Confirm'
                          : activeEmail.type === 'verification'
                            ? 'Verify My Email Address'
                            : 'Access Candidate Portal'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Gray Footer with Privacy Link */}
              <div className="bg-gray-100 p-5 border-t border-gray-200 text-gray-500 text-xs space-y-1.5">
                <p>
                  This notification was sent regarding your application on the Recruitment Portal.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-600">
                  <Link to="/legal/privacy" className="hover:text-blue-700 underline">Privacy Notice</Link>
                  <span>•</span>
                  <Link to="/legal/terms" className="hover:text-blue-700 underline">Terms of Use</Link>
                  <span>•</span>
                  <span>Contact Information Officer: info.officer@company.co.za</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs">
              Select an email from the left outbox to inspect the rendered visual template.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
