import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard, Users, Kanban, UserCheck, Briefcase, Shield,
  LogOut, Bell, ExternalLink, Menu, X, ChevronRight, Mail
} from 'lucide-react'
import SystemLogo from '../components/SystemLogo'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Applications', path: '/admin/applications', icon: Users },
    { label: 'Pipeline Board', path: '/admin/pipeline', icon: Kanban },
    { label: 'Shortlisted', path: '/admin/shortlist', icon: UserCheck },
    { label: 'Jobs & LinkedIn Links', path: '/admin/jobs', icon: Briefcase },
    { label: 'POPIA Compliance', path: '/admin/popia', icon: Shield },
    { label: 'Mock Emails', path: '/dev/emails', icon: Mail },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f1b29]/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Deep Navy Left Sidebar (Zero Rounded Corners) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0f1b29] text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center">
            <SystemLogo light={true} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all rounded-none ${
                  isActive
                    ? 'bg-white text-[#0f1b29] font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                style={{ borderRadius: 0 }}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0f1b29]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Recruiter Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#080f17]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 border border-slate-700 bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white block truncate">Sarah Johnson</span>
              <span className="text-[10px] text-slate-400 block truncate">Talent Partner (Admin)</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-colors rounded-none border border-slate-800"
            style={{ borderRadius: 0 }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900 uppercase tracking-wider">Talent Administration</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{location.pathname.split('/')[2] || 'Overview'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Candidate View */}
            <Link
              to="/portal"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 font-semibold uppercase tracking-wider transition-colors border border-slate-300 rounded-none"
              style={{ borderRadius: 0 }}
            >
              <span>Candidate View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 relative rounded-none">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0f1b29]" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
