import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Recruitment Portal</span>
          </div>
          
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/legal/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Notice
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/legal/cookies" className="hover:text-white transition-colors">
              Cookie Settings
            </Link>
            <span className="text-gray-700">|</span>
            <a href="mailto:info.officer@company.co.za" className="hover:text-white transition-colors">
              Information Officer
            </a>
          </nav>
          
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
