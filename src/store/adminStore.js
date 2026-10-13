import { create } from 'zustand'

// Mock candidate data for the admin dashboard
const generateMockCandidates = () => {
  const jobs = [
    { id: 'job-001', title: 'Senior Business Analyst' },
    { id: 'job-002', title: 'Software Engineer' },
    { id: 'job-003', title: 'UX Designer' },
  ]
  
  const statuses = ['submitted', 'under-review', 'shortlisted', 'interview', 'rejected']
  const sources = ['linkedin', 'direct', 'referral', 'career-site']
  const provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape']
  const qualifications = ['Matric', 'Diploma', 'Bachelors', 'Honours', 'Masters', 'PhD']
  
  const firstNames = ['Thabo', 'Naledi', 'Sipho', 'Zanele', 'Bongani', 'Lindiwe', 'Mandla', 'Nomsa', 'Kagiso', 'Palesa',
    'Tshepo', 'Ayanda', 'Mpho', 'Nthabiseng', 'Sizwe', 'Thandiwe', 'Khaya', 'Lerato', 'Themba', 'Nosipho',
    'Andile', 'Busisiwe', 'Dumisani', 'Fikile', 'Gugu', 'Hlelo', 'Itumeleng', 'Jabulani', 'Karabo', 'Lebo',
    'Mbali', 'Nkosi', 'Olwethu', 'Phumzile', 'Refilwe', 'Siyanda', 'Thandeka', 'Unathi', 'Vusi', 'Wandile',
    'Xolani', 'Yanga', 'Zinhle', 'Amogelang', 'Bonolo', 'Dikeledi', 'Elethu', 'Fezeka', 'Gcina', 'Hlengiwe']
  
  const lastNames = ['Mokoena', 'Ndlovu', 'Nkosi', 'Dlamini', 'Zulu', 'Mthembu', 'Khumalo', 'Ngcobo', 'Mkhize', 'Mahlangu',
    'Van der Merwe', 'Botha', 'Pretorius', 'Du Plessis', 'Nel', 'Jacobs', 'Pillay', 'Naidoo', 'Govender', 'Singh',
    'Molefe', 'Motaung', 'Tau', 'Phiri', 'Banda', 'Chauke', 'Cele', 'Gumede', 'Hadebe', 'Jansen',
    'Langa', 'Maseko', 'Radebe', 'Shabalala', 'Tshabalala', 'Vilakazi', 'Zondi', 'Buthelezi', 'Sithole', 'Zwane']
  
  const candidates = []
  
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const job = jobs[i % 3]
    const status = i < 5 ? 'submitted' : statuses[Math.floor(Math.random() * statuses.length)]
    const province = provinces[Math.floor(Math.random() * provinces.length)]
    const qualification = qualifications[Math.floor(Math.random() * qualifications.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const daysAgo = Math.floor(Math.random() * 30)
    const appliedDate = new Date(Date.now() - daysAgo * 86400000)
    const score = Math.floor(Math.random() * 40) + 60
    const yearsExp = Math.floor(Math.random() * 15) + 1
    
    const hasKnockout = Math.random() > 0.85
    
    candidates.push({
      id: `cand-${String(i + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '')}@email.co.za`,
      phone: `+27 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      idNumber: `${String(90 + Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}${Math.floor(Math.random() * 2)}${String(Math.floor(Math.random() * 9))}${Math.floor(Math.random() * 10)}`,
      job,
      status,
      source,
      province,
      qualification,
      yearsExperience: yearsExp,
      score,
      hasKnockout,
      appliedDate: appliedDate.toISOString(),
      appliedDateFormatted: appliedDate.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      cv: { name: `${firstName}_${lastName}_CV.pdf`, size: Math.floor(Math.random() * 3000000) + 200000 },
      education: [
        {
          qualification: qualification === 'Matric' ? 'National Senior Certificate' : `${qualification} of Commerce`,
          institution: ['University of Pretoria', 'UCT', 'Wits', 'Stellenbosch', 'UKZN', 'UJ'][Math.floor(Math.random() * 6)],
          fieldOfStudy: ['Business Management', 'Computer Science', 'Design', 'Finance', 'Engineering', 'Marketing'][Math.floor(Math.random() * 6)],
          yearCompleted: String(2024 - Math.floor(Math.random() * 10)),
          status: 'completed',
        }
      ],
      experience: [
        {
          jobTitle: ['Analyst', 'Developer', 'Designer', 'Manager', 'Consultant'][Math.floor(Math.random() * 5)],
          company: ['Investec', 'Standard Bank', 'FNB', 'Nedbank', 'Absa', 'Discovery', 'Old Mutual'][Math.floor(Math.random() * 7)],
          startDate: `${2024 - yearsExp}-01`,
          endDate: '',
          current: true,
        }
      ],
      skills: ['Communication', 'Problem Solving', 'Teamwork', 'SQL', 'Excel', 'Agile'].slice(0, Math.floor(Math.random() * 4) + 2),
      screening: {
        legallyEntitled: !hasKnockout ? 'yes' : (Math.random() > 0.5 ? 'yes' : 'no'),
        noticePeriod: ['Immediate', '2 Weeks', '1 Month', '2 Months', '3 Months'][Math.floor(Math.random() * 5)],
        salaryExpectation: `R ${(Math.floor(Math.random() * 50) + 30) * 1000}`,
      },
      notes: [],
      tags: [],
      activityLog: [
        { action: 'Application submitted', timestamp: appliedDate.toISOString(), by: 'System' },
      ],
      consents: {
        termsAccepted: true,
        privacyAccepted: true,
        talentPool: Math.random() > 0.3,
        marketing: Math.random() > 0.5,
        version: '1.0',
        timestamp: appliedDate.toISOString(),
      },
      retentionDate: new Date(appliedDate.getTime() + 365 * 86400000).toISOString(),
    })
  }
  
  // Add 5 incomplete registrants
  for (let i = 0; i < 5; i++) {
    const firstName = firstNames[50 + i] || firstNames[i]
    const lastName = lastNames[40 + i] || lastNames[i]
    candidates.push({
      id: `reg-${String(i + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '')}@email.co.za`,
      phone: '',
      job: jobs[i % 3],
      status: 'incomplete',
      source: 'linkedin',
      province: '',
      qualification: '',
      yearsExperience: 0,
      score: 0,
      hasKnockout: false,
      appliedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000).toISOString(),
      appliedDateFormatted: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      cv: null,
      education: [],
      experience: [],
      skills: [],
      screening: {},
      notes: [],
      tags: [],
      activityLog: [],
      consents: { termsAccepted: true, privacyAccepted: true },
    })
  }
  
  return candidates
}

export const useAdminStore = create((set, get) => ({
  candidates: generateMockCandidates(),
  selectedCandidateId: null,
  filters: {
    search: '',
    job: '',
    status: '',
    source: '',
    province: '',
    qualification: '',
  },
  sortBy: 'appliedDate',
  sortOrder: 'desc',
  
  setSelectedCandidate: (id) => set({ selectedCandidateId: id }),
  
  updateFilters: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }))
  },
  
  clearFilters: () => {
    set({
      filters: { search: '', job: '', status: '', source: '', province: '', qualification: '' }
    })
  },
  
  setSorting: (field) => {
    const { sortBy, sortOrder } = get()
    if (sortBy === field) {
      set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      set({ sortBy: field, sortOrder: 'desc' })
    }
  },
  
  getFilteredCandidates: () => {
    const { candidates, filters, sortBy, sortOrder } = get()
    let filtered = [...candidates]
    
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
    }
    if (filters.job) filtered = filtered.filter(c => c.job.id === filters.job)
    if (filters.status) filtered = filtered.filter(c => c.status === filters.status)
    if (filters.source) filtered = filtered.filter(c => c.source === filters.source)
    if (filters.province) filtered = filtered.filter(c => c.province === filters.province)
    if (filters.qualification) filtered = filtered.filter(c => c.qualification === filters.qualification)
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (sortBy === 'name') { aVal = a.name; bVal = b.name }
      if (sortBy === 'score') { aVal = a.score; bVal = b.score }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    
    return filtered
  },
  
  shortlistCandidate: (id) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'shortlisted',
            activityLog: [...c.activityLog, {
              action: 'Shortlisted',
              timestamp: new Date().toISOString(),
              by: 'Sarah Johnson',
            }],
          }
        }
        return c
      })
    }))
  },
  
  rejectCandidate: (id, reason) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'rejected',
            rejectionReason: reason,
            activityLog: [...c.activityLog, {
              action: `Rejected: ${reason}`,
              timestamp: new Date().toISOString(),
              by: 'Sarah Johnson',
            }],
          }
        }
        return c
      })
    }))
  },
  
  moveToStage: (id, stage) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: stage,
            activityLog: [...c.activityLog, {
              action: `Moved to ${stage}`,
              timestamp: new Date().toISOString(),
              by: 'Sarah Johnson',
            }],
          }
        }
        return c
      })
    }))
  },
  
  addNote: (id, text) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id) {
          return {
            ...c,
            notes: [...c.notes, { text, by: 'Sarah Johnson', timestamp: new Date().toISOString() }],
            activityLog: [...c.activityLog, {
              action: 'Note added',
              timestamp: new Date().toISOString(),
              by: 'Sarah Johnson',
            }],
          }
        }
        return c
      })
    }))
  },
  
  addTag: (id, tag) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id && !c.tags.includes(tag)) {
          return { ...c, tags: [...c.tags, tag] }
        }
        return c
      })
    }))
  },
  
  removeTag: (id, tag) => {
    set(state => ({
      candidates: state.candidates.map(c => {
        if (c.id === id) {
          return { ...c, tags: c.tags.filter(t => t !== tag) }
        }
        return c
      })
    }))
  },
  
  getStats: () => {
    const { candidates } = get()
    const now = new Date()
    const sevenDaysAgo = new Date(now - 7 * 86400000)
    
    const activeCandidates = candidates.filter(c => c.status !== 'incomplete')
    
    return {
      newApplications: activeCandidates.filter(c => new Date(c.appliedDate) >= sevenDaysAgo).length,
      totalCandidates: activeCandidates.length,
      shortlisted: activeCandidates.filter(c => c.status === 'shortlisted').length,
      interviews: activeCandidates.filter(c => c.status === 'interview').length,
      underReview: activeCandidates.filter(c => c.status === 'under-review').length,
      rejected: activeCandidates.filter(c => c.status === 'rejected').length,
      submitted: activeCandidates.filter(c => c.status === 'submitted').length,
      incomplete: candidates.filter(c => c.status === 'incomplete').length,
      bySource: {
        linkedin: activeCandidates.filter(c => c.source === 'linkedin').length,
        direct: activeCandidates.filter(c => c.source === 'direct').length,
        referral: activeCandidates.filter(c => c.source === 'referral').length,
        'career-site': activeCandidates.filter(c => c.source === 'career-site').length,
      },
      byJob: {
        'Senior Business Analyst': activeCandidates.filter(c => c.job.id === 'job-001').length,
        'Software Engineer': activeCandidates.filter(c => c.job.id === 'job-002').length,
        'UX Designer': activeCandidates.filter(c => c.job.id === 'job-003').length,
      },
      avgScore: Math.round(activeCandidates.reduce((sum, c) => sum + c.score, 0) / activeCandidates.length),
    }
  },
}))
