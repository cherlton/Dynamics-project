import { create } from 'zustand'

const INITIAL_EMAILS = [
  {
    id: 'em-001',
    to: 'thabo.mokoena@email.co.za',
    subject: 'Good news – you’ve been shortlisted for Senior Business Analyst',
    type: 'shortlist',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    link: '/login?returnTo=/portal&email=thabo.mokoena@email.co.za',
    body: `Dear Thabo,

We are pleased to inform you that your application for the Senior Business Analyst position has been shortlisted for an interview!

Our talent team was impressed with your qualifications and experience. Please log in to your candidate portal to view available interview slots and confirm your availability.

Reference: APP-2026-00123`,
  },
  {
    id: 'em-002',
    to: 'thabo.mokoena@email.co.za',
    subject: 'We received your application – Senior Business Analyst',
    type: 'received',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    link: '/login?returnTo=/portal',
    body: `Dear Thabo,

Thank you for applying for Senior Business Analyst.

Your application reference is APP-2026-00123.
Our hiring team is currently reviewing your profile against our role requirements. You can track the progress of your application at any time in the portal.`,
  }
]

export const useEmailStore = create((set, get) => ({
  emails: JSON.parse(sessionStorage.getItem('mock_emails')) || INITIAL_EMAILS,
  
  sendEmail: ({ to, subject, type, body, link }) => {
    const newEmail = {
      id: 'em-' + Date.now(),
      to,
      subject,
      type,
      body,
      link,
      sentAt: new Date().toISOString(),
    }
    const updated = [newEmail, ...get().emails]
    sessionStorage.setItem('mock_emails', JSON.stringify(updated))
    set({ emails: updated })
    return newEmail
  },

  clearEmails: () => {
    sessionStorage.removeItem('mock_emails')
    set({ emails: [] })
  }
}))
