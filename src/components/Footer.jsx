import { Link } from 'react-router-dom'
import SystemLogo from './SystemLogo'

export default function Footer() {
  return (
    <footer className="bg-[#0f1b29] text-slate-400 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: System Brand & Statutory Mandate */}
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <SystemLogo light={true} />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Dynamics Talent & Gaspar Executive Placement provides a secure, POPIA-compliant recruitment gateway for executive and leadership appointments across South Africa.
            </p>
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-0.5">
                Statutory Regulatory Status
              </span>
              <p className="text-[11px] text-slate-500">
                Registered under the Protection of Personal Information Act (POPIA Act 4 of 2013).
              </p>
            </div>
          </div>

          {/* Col 2: Candidate Workflow */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Candidate Workflow
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/apply/account" className="hover:text-white transition-colors">
                  Start New Application
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Application Status Tracker
                </Link>
              </li>
              <li>
                <Link to="/portal/privacy" className="hover:text-white transition-colors">
                  My Data & POPIA Requests
                </Link>
              </li>
              <li>
                <Link to="/apply/cv" className="hover:text-white transition-colors">
                  Automated CV Parser
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Returning Applicant Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Talent Management Desk */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Talent Management
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Talent Manager Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/applications" className="hover:text-white transition-colors">
                  Candidates Pipeline & Review
                </Link>
              </li>
              <li>
                <Link to="/admin/shortlist" className="hover:text-white transition-colors">
                  Shortlist & Interview Schedule
                </Link>
              </li>
              <li>
                <Link to="/admin/jobs" className="hover:text-white transition-colors">
                  Job Management & Tracking
                </Link>
              </li>
              <li>
                <Link to="/dev/emails" className="hover:text-white transition-colors text-slate-400">
                  Mock Dispatch Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Responsible Party & Information Officer Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Information Officer & Legal
            </h4>
            <div className="text-slate-300 text-xs space-y-1.5">
              <p>
                <strong className="text-white">Responsible Party:</strong><br />
                Dynamics Recruitment (Pty) Ltd
              </p>
              <p>
                <strong className="text-white">Information Officer:</strong><br />
                <a href="mailto:popia@dynamics.co.za" className="underline hover:text-white">
                  popia@dynamics.co.za
                </a>
              </p>
              <p>
                <strong className="text-white">Inquiries & Desk:</strong><br />
                <a href="tel:+27113023060" className="underline hover:text-white">
                  +27 (0)11 302 3060
                </a>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Sandton City Office Tower, 5th Floor, Sandton, Johannesburg, South Africa
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Dynamics Talent & Gaspar Placement. All rights reserved. Automated CV extraction is assistive; hiring decisions are made by human talent managers in accordance with POPIA Section 71.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link to="/legal/terms" className="hover:text-white underline">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/legal/privacy" className="hover:text-white underline">
              Privacy Notice (POPIA)
            </Link>
            <span>•</span>
            <Link to="/legal/cookies" className="hover:text-white underline">
              Cookie Settings
            </Link>
            <span>•</span>
            <Link to="/portal/privacy" className="hover:text-white underline">
              Data Subject Rights
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
