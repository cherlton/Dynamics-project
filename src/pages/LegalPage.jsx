import { useParams, Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'

export default function LegalPage() {
  const { slug } = useParams()

  const contentMap = {
    terms: {
      title: 'Terms and Conditions of Use',
      subtitle: 'Version 1.0 • Last updated February 2026',
      content: (
        <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to the Recruitment Application Portal. By submitting your personal data, credentials, and curriculum vitae through this portal, you agree to these Terms and Conditions.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">1. Application Accuracy & Declarations</h3>
          <p>
            You agree to provide true, current, and complete information. Providing fraudulent, deceptive, or misleading information regarding your identity, employment history, or qualifications is grounds for disqualification or immediate dismissal.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">2. Communication & Electronic Consent</h3>
          <p>
            By registering, you consent to receive electronic correspondence concerning the status of your application, interview invitations, and notifications via email.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">3. Intellectual Property & Portal Security</h3>
          <p>
            All interface designs, workflows, text, and graphics remain the exclusive intellectual property of the organization.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Notice (POPIA Compliance)',
      subtitle: 'In terms of the Protection of Personal Information Act 4 of 2013 • Version 1.0',
      content: (
        <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            This Privacy Notice informs job applicants of how we collect, process, store, and protect their personal information in strict compliance with South Africa’s Protection of Personal Information Act (POPIA).
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">1. Responsible Party & Information Officer</h3>
          <p>
            The responsible party is the hiring organization. For queries or to exercise statutory privacy rights, contact our appointed Information Officer at: <a href="mailto:info.officer@company.co.za" className="text-blue-700 font-semibold underline">info.officer@company.co.za</a>.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">2. Personal Information Collected</h3>
          <p>
            We collect contact information, educational credentials, work history, certified identity documents (for right-to-work verification), and screening responses. We do not collect unnecessary special personal information.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">3. Automated Processing & Human Decision-Making (Section 71)</h3>
          <p>
            We utilize automated software solely to extract structured data from uploaded CVs to reduce applicant entry time. No automated rejection occurs; all candidates are reviewed by a human Talent Manager.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">4. Retention Period (Section 14)</h3>
          <p>
            Candidate records are retained for a maximum of 12 months following application submission (or 12 months in the talent pool if opted in). After this window, records are permanently deleted or anonymized.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">5. Data Subject Rights & Information Regulator</h3>
          <p>
            You have the right to request access to your records (Section 23), request correction (Section 24), or request deletion/withdrawal of consent (Section 25). You also have the right to lodge a complaint with the South African Information Regulator (inforeg@justice.gov.za).
          </p>
        </div>
      ),
    },
    cookies: {
      title: 'Cookie & Tracking Notice',
      subtitle: 'Cookie Settings & Consent Preferences • Version 1.0',
      content: (
        <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            We use essential cookies to maintain secure authentication tokens and persist your multi-step application draft in your browser session.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">Essential Session Cookies</h3>
          <p>
            Required for form persistence, role-based route protection, and token validation. These cannot be switched off as the portal cannot function without them.
          </p>
          <h3 className="font-bold text-gray-900 text-base pt-2">Analytics & Campaign Parameters</h3>
          <p>
            We monitor the <code className="font-mono text-blue-700 bg-gray-100 px-1 py-0.5 rounded">src=linkedin</code> referral parameter solely to analyze candidate channel acquisition performance.
          </p>
        </div>
      ),
    },
  }

  const page = contentMap[slug] || contentMap.privacy

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-700" />
            <span className="font-bold text-sm text-gray-900">Legal Compliance</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Governance Documentation</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{page.title}</h1>
            <p className="text-xs text-gray-400 mt-1">{page.subtitle}</p>
            <div className="gray-dash mt-3 mb-6" />
          </div>

          {page.content}
        </div>
      </main>

      <Footer />
    </div>
  )
}
