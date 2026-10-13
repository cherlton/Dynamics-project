import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import DevToolbar from './components/DevToolbar'

// Auth & Landing
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Multi-step Application Flow
import AccountPage from './pages/AccountPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import VerifyConfirmPage from './pages/VerifyConfirmPage'
import CvUploadPage from './pages/CvUploadPage'
import DetailsPage from './pages/DetailsPage'
import DocumentsPage from './pages/DocumentsPage'
import ScreeningPage from './pages/ScreeningPage'
import SummaryPage from './pages/SummaryPage'
import SuccessPage from './pages/SuccessPage'

// Candidate Portal
import CandidatePortalPage from './pages/CandidatePortalPage'
import PrivacyRequestsPage from './pages/PrivacyRequestsPage'

// Admin Talent Manager Dashboard
import AdminLayout from './layouts/AdminLayout'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage'
import AdminPipelinePage from './pages/admin/AdminPipelinePage'
import AdminShortlistPage from './pages/admin/AdminShortlistPage'
import AdminJobsPage from './pages/admin/AdminJobsPage'
import AdminPopiaPage from './pages/admin/AdminPopiaPage'

// Shared & Dev
import LegalPage from './pages/LegalPage'
import DevEmailsPage from './pages/dev/DevEmailsPage'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Default redirect to LinkedIn application landing */}
        <Route path="/" element={<Navigate to="/apply/account?src=linkedin" replace />} />
        <Route path="/apply" element={<Navigate to="/apply/account?src=linkedin" replace />} />

        {/* Candidate Application Multi-Step Flow */}
        <Route path="/apply/account" element={<AccountPage />} />
        <Route path="/apply/verify-email" element={<VerifyEmailPage />} />
        <Route path="/apply/verify-email/confirm" element={<VerifyConfirmPage />} />
        <Route path="/apply/cv" element={<CvUploadPage />} />
        <Route path="/apply/details" element={<DetailsPage />} />
        <Route path="/apply/documents" element={<DocumentsPage />} />
        <Route path="/apply/screening" element={<ScreeningPage />} />
        <Route path="/apply/summary" element={<SummaryPage />} />
        <Route path="/apply/success" element={<SuccessPage />} />

        {/* Shared Login & Password Recovery */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Candidate Portal (Role Protected) */}
        <Route
          path="/portal"
          element={
            <RequireAuth role="candidate">
              <CandidatePortalPage />
            </RequireAuth>
          }
        />
        <Route
          path="/portal/privacy"
          element={
            <RequireAuth role="candidate">
              <PrivacyRequestsPage />
            </RequireAuth>
          }
        />

        {/* Admin Talent Manager Area (Role Protected) */}
        <Route
          path="/admin"
          element={
            <RequireAuth role="admin">
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="pipeline" element={<AdminPipelinePage />} />
          <Route path="shortlist" element={<AdminShortlistPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="popia" element={<AdminPopiaPage />} />
        </Route>

        {/* Legal Pages */}
        <Route path="/legal/:slug" element={<LegalPage />} />

        {/* Dev Mock Emails Inspector */}
        <Route path="/dev/emails" element={<DevEmailsPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Floating Dev Toolbar for Persona & Step Switching */}
      <DevToolbar />
    </Router>
  )
}
