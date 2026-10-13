import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard, Users, Kanban, UserCheck, Briefcase, Shield,
  LogOut, Bell, Search, ExternalLink, Menu, X, ChevronRight, Mail
} from 'lucide-react'

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
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Deep Blue Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0F2A6B] text-white flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-blue-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              RP
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">Talent Portal</span>
              <span className="text-[10px] text-blue-300">Recruiter Admin v1.0</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-blue-300 hover:text-white"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-blue-200 hover:bg-blue-900/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Recruiter Profile & Logout */}
        <div className="p-4 border-t border-blue-900/60 bg-blue-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white block truncate">Sarah Johnson</span>
              <span className="text-[10px] text-blue-300 block truncate">Talent Manager (Admin)</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-blue-200 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-gray-700">Talent Manager</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="capitalize">{location.pathname.split('/')[2] || 'Overview'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Candidate View for Testing */}
            <Link
              to="/portal"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors border border-blue-200"
            >
              <span>View Candidate Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notification Bell */}
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
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
