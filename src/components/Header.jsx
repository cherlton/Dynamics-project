import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import SystemLogo from './SystemLogo'

export default function Header() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="gaspar-header text-white sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo on Left */}
          <Link to="/" className="flex items-center group">
            <SystemLogo light={true} />
          </Link>

          {/* Central Navigation Links related to Recruitment Portal Requirements */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-wider uppercase font-medium text-slate-300">
            <Link
              to="/apply/account?src=linkedin&jobId=job-001"
              className="hover:text-white transition-colors"
            >
              Open Roles
            </Link>

            <Link
              to="/portal"
              className="hover:text-white transition-colors"
            >
              Candidate Portal
            </Link>

            <Link
              to="/admin"
              className="hover:text-white transition-colors"
            >
              Talent Manager Desk
            </Link>

            <Link
              to="/legal/privacy"
              className="hover:text-white transition-colors"
            >
              POPIA Compliance
            </Link>

            <Link
              to="/dev/emails"
              className="hover:text-white text-slate-400 transition-colors text-[11px]"
              title="Inspect generated simulation emails"
            >
              Mock Emails
            </Link>
          </nav>

          {/* Right Header Utilities & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              /* User Session Pill & Sign Out */
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                    {user.name || user.email}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {user.role === 'admin' ? 'Talent Manager' : 'Candidate'}
                  </span>
                </div>

                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/portal"
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    My Status
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white text-[#0f1b29] hover:bg-slate-100 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 rounded-none shadow-sm"
                  style={{ borderRadius: 0 }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Public / Guest Actions: Sign In & Apply Now */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs tracking-wider uppercase font-medium text-slate-300 hover:text-white transition-colors hidden sm:inline-block"
                >
                  Sign In
                </Link>

                <Link
                  to="/apply/account?src=linkedin&jobId=job-001"
                  className="bg-white text-[#0f1b29] hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 rounded-none shadow-sm"
                  style={{ borderRadius: 0 }}
                >
                  Apply Now
                </Link>
              </div>
            )}

            {/* Quick Portal Switcher Icon */}
            <Link
              to="/portal"
              aria-label="Candidate Portal"
              title="Candidate Application Portal"
              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500 rounded-none transition-colors"
              style={{ borderRadius: 0 }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
