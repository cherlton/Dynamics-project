import { create } from 'zustand'

const INITIAL_APPLICATION = {
  jobId: 'job-001',
  jobTitle: 'Senior Business Analyst',
  source: 'linkedin',
  currentStep: 0,
  status: 'draft',
  cv: null,
  cvParsed: false,
  parsedData: null,
  details: {
    firstName: '',
    surname: '',
    email: '',
    mobile: '',
    city: '',
    province: '',
    nationality: '',
    idNumber: '',
    education: [],
    experience: [],
    skills: [],
    languages: [],
  },
  documents: {
    certifiedId: null,
    coverLetter: null,
    qualifications: [],
    other: [],
  },
  screening: {
    legallyEntitled: null,
    driversLicence: null,
    noticePeriod: '',
    highestQualification: '',
    yearsExperience: '',
    whyWorkHere: '',
    salaryExpectation: '',
    availabilityDate: '',
    workMode: '',
    relocation: '',
  },
  consents: {
    termsAccepted: false,
    privacyAccepted: false,
    talentPool: false,
    marketing: false,
    declaration: false,
  },
  submittedAt: null,
  referenceNumber: null,
}

// Mock parsed CV data
const MOCK_PARSED_CV = {
  firstName: 'Thabo',
  surname: 'Mokoena',
  email: '',
  mobile: '+27 82 555 0123',
  city: 'Johannesburg',
  province: 'Gauteng',
  nationality: 'South African',
  idNumber: '',
  education: [
    {
      id: 'edu-1',
      qualification: 'Bachelor of Commerce',
      institution: 'University of Pretoria',
      fieldOfStudy: 'Business Management',
      yearCompleted: '2018',
      status: 'completed',
    },
    {
      id: 'edu-2',
      qualification: 'Advanced Diploma',
      institution: 'University of Cape Town',
      fieldOfStudy: 'Business Analysis',
      yearCompleted: '2020',
      status: 'completed',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Business Analyst',
      company: 'Investec Bank',
      startDate: '2021-03',
      endDate: '',
      current: true,
      responsibilities: 'Led requirements gathering for digital banking platform. Facilitated stakeholder workshops. Created business cases and process maps.',
    },
    {
      id: 'exp-2',
      jobTitle: 'Business Analyst',
      company: 'Standard Bank',
      startDate: '2018-07',
      endDate: '2021-02',
      current: false,
      responsibilities: 'Documented business requirements. Performed gap analysis. Supported UAT processes.',
    },
  ],
  skills: ['Business Analysis', 'Requirements Gathering', 'Stakeholder Management', 'SQL', 'JIRA', 'Agile', 'Process Mapping'],
  languages: ['English', 'Zulu', 'Sotho'],
}

export const useApplicationStore = create((set, get) => ({
  application: JSON.parse(sessionStorage.getItem('application_draft')) || { ...INITIAL_APPLICATION },
  
  updateApplication: (updates) => {
    const current = get().application
    const updated = { ...current, ...updates }
    sessionStorage.setItem('application_draft', JSON.stringify(updated))
    set({ application: updated })
  },
  
  updateDetails: (field, value) => {
    const current = get().application
    const updated = {
      ...current,
      details: { ...current.details, [field]: value }
    }
    sessionStorage.setItem('application_draft', JSON.stringify(updated))
    set({ application: updated })
  },
  
  updateScreening: (field, value) => {
    const current = get().application
    const updated = {
      ...current,
      screening: { ...current.screening, [field]: value }
    }
    sessionStorage.setItem('application_draft', JSON.stringify(updated))
    set({ application: updated })
  },
  
  updateDocuments: (field, value) => {
    const current = get().application
    const updated = {
      ...current,
      documents: { ...current.documents, [field]: value }
    }
    sessionStorage.setItem('application_draft', JSON.stringify(updated))
    set({ application: updated })
  },
  
  updateConsents: (field, value) => {
    const current = get().application
    const updated = {
      ...current,
      consents: { ...current.consents, [field]: value }
    }
    sessionStorage.setItem('application_draft', JSON.stringify(updated))
    set({ application: updated })
  },
  
  setStep: (step) => {
    get().updateApplication({ currentStep: step })
  },
  
  mockParseCV: (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userEmail = get().application.details.email
        const parsed = { ...MOCK_PARSED_CV, email: userEmail }
        get().updateApplication({
          cv: { name: file.name, size: file.size, type: file.type },
          cvParsed: true,
          parsedData: parsed,
          details: { ...get().application.details, ...parsed },
        })
        resolve(parsed)
      }, 2500)
    })
  },
  
  submitApplication: () => {
    const refNumber = `APP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`
    get().updateApplication({
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      referenceNumber: refNumber,
    })
    return refNumber
  },
  
  resetApplication: () => {
    sessionStorage.removeItem('application_draft')
    set({ application: { ...INITIAL_APPLICATION } })
  },
}))
