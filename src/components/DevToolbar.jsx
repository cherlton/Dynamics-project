import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useApplicationStore } from '../store/applicationStore'
import { useEmailStore } from '../store/emailStore'
import { Wrench, UserCheck, Shield, RotateCcw, Mail, ChevronUp, ChevronDown } from 'lucide-react'

export default function DevToolbar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, login, logout } = useAuthStore()
  const { application, setStep, resetApplication } = useApplicationStore()
  const emails = useEmailStore(s => s.emails)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSwitchPersona = (role) => {
    if (role === 'admin') {
      login('admin@demo.co.za', 'Admin#12345')
      navigate('/admin')
    } else if (role === 'candidate') {
      login('candidate@demo.co.za', 'Candidate#12345')
      navigate('/portal')
    } else {
      logout()
      navigate('/apply/account')
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-xs">
      <div className="bg-[#0f1b29] text-white shadow-2xl border border-slate-700 overflow-hidden transition-all duration-200 rounded-none" style={{ borderRadius: 0 }}>
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 cursor-pointer select-none"
             onClick={() => setCollapsed(!collapsed)}>
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Dev Controls</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[10px]">
              {user ? `${user.role.toUpperCase()}: ${user.email}` : 'GUEST'}
            </span>
          </div>
          <button className="text-gray-400 hover:text-white p-0.5">
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="p-3 space-y-2.5 max-w-sm">
            {/* Quick Personas */}
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Switch Persona</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchPersona('admin')}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
                    user?.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Shield className="w-3 h-3 text-amber-400" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchPersona('candidate')}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
                    user?.role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <UserCheck className="w-3 h-3 text-emerald-400" /> Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchPersona('guest')}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
                    !user ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Applicant
                </button>
              </div>
            </div>

            {/* Jump to Application Steps */}
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Jump to Step</span>
              <div className="grid grid-cols-5 gap-1 text-center font-mono">
                {[
                  { label: 'CV', path: '/apply/cv', step: 0 },
                  { label: 'Details', path: '/apply/details', step: 1 },
                  { label: 'Docs', path: '/apply/documents', step: 2 },
                  { label: 'Screen', path: '/apply/screening', step: 3 },
                  { label: 'Summary', path: '/apply/summary', step: 4 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setStep(s.step)
                      navigate(s.path)
                    }}
                    className={`px-1 py-1 rounded text-[10px] ${
                      location.pathname === s.path ? 'bg-blue-500 text-white font-bold' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions & Links */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-800">
              <Link
                to="/dev/emails"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>Mock Emails ({emails.length})</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  resetApplication()
                  navigate('/apply/account')
                }}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Clear draft in sessionStorage"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Draft</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
