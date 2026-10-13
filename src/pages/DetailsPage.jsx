import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
]

export default function DetailsPage() {
  const navigate = useNavigate()
  const { application, updateDetails, setStep } = useApplicationStore()
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [details, setLocalDetails] = useState({ ...application.details })
  const [editedFields, setEditedFields] = useState({})
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [lastSaved, setLastSaved] = useState('Saved just now')

  const handleChange = (field, value) => {
    const updated = { ...details, [field]: value }
    setLocalDetails(updated)
    setEditedFields(prev => ({ ...prev, [field]: true }))
    updateDetails(field, value)
    setLastSaved('Saved just now')
  }

  // Education management
  const addEducation = () => {
    const newEdu = {
      id: 'edu-' + Date.now(),
      qualification: '',
      institution: '',
      fieldOfStudy: '',
      yearCompleted: '',
      status: 'completed',
    }
    const updated = [...(details.education || []), newEdu]
    handleChange('education', updated)
  }

  const updateEducationItem = (index, field, value) => {
    const updated = [...(details.education || [])]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('education', updated)
  }

  const removeEducationItem = (index) => {
    const updated = details.education.filter((_, i) => i !== index)
    handleChange('education', updated)
  }

  // Experience management
  const addExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
    }
    const updated = [...(details.experience || []), newExp]
    handleChange('experience', updated)
  }

  const updateExperienceItem = (index, field, value) => {
    const updated = [...(details.experience || [])]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('experience', updated)
  }

  const removeExperienceItem = (index) => {
    const updated = details.experience.filter((_, i) => i !== index)
    handleChange('experience', updated)
  }

  const totalYearsExp = useMemo(() => {
    if (!details.experience?.length) return 0
    return details.experience.length * 2.5
  }, [details.experience])

  const addSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    if (!details.skills?.includes(newSkill.trim())) {
      handleChange('skills', [...(details.skills || []), newSkill.trim()])
    }
    setNewSkill('')
  }

  const removeSkill = (skillToRemove) => {
    handleChange('skills', details.skills.filter(s => s !== skillToRemove))
  }

  const addLanguage = (e) => {
    e.preventDefault()
    if (!newLanguage.trim()) return
    if (!details.languages?.includes(newLanguage.trim())) {
      handleChange('languages', [...(details.languages || []), newLanguage.trim()])
    }
    setNewLanguage('')
  }

  const removeLanguage = (langToRemove) => {
    handleChange('languages', details.languages.filter(l => l !== langToRemove))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep(2)
    shuffleNavigate(navigate, '/apply/documents', 'forward')
  }

  return (
    <PortalLayout
      category="STEP 02 OF 05 — PROFILE CURATION"
      title="Review and curate your professional dossier"
      subtitle="Verify auto-filled employment history, educational credentials, and core competencies extracted from your CV."
      currentStep={1}
      showProgressBar={true}
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Section 02 of 05 — Comprehensive Profile
            </span>
            <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold mt-0.5">
              Review and Edit Details
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 border border-slate-200 self-start sm:self-auto">
            {lastSaved}
          </span>
        </div>

        {/* Minimal info banner */}
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <strong>Pre-populated from CV:</strong> Values extracted from your document are pre-filled below. Review every field and amend where necessary.
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* 1. Personal Information */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-2 border-b border-slate-100">
              1. Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="input-label" htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={details.firstName || ''}
                  onChange={e => handleChange('firstName', e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="surname">Surname *</label>
                <input
                  id="surname"
                  type="text"
                  value={details.surname || ''}
                  onChange={e => handleChange('surname', e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="emailReadonly">Email Address (Verified)</label>
                <input
                  id="emailReadonly"
                  type="email"
                  value={details.email || ''}
                  readOnly
                  className="input-field bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="mobile">Mobile Number (SA) *</label>
                <input
                  id="mobile"
                  type="tel"
                  value={details.mobile || ''}
                  onChange={e => handleChange('mobile', e.target.value)}
                  placeholder="+27 82 123 4567"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="city">City / Town *</label>
                <input
                  id="city"
                  type="text"
                  value={details.city || ''}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="e.g. Johannesburg"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="province">Province *</label>
                <select
                  id="province"
                  value={details.province || ''}
                  onChange={e => handleChange('province', e.target.value)}
                  required
                  className="input-field bg-white"
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="nationality">Nationality</label>
                <input
                  id="nationality"
                  type="text"
                  value={details.nationality || 'South African'}
                  onChange={e => handleChange('nationality', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="idNumber">SA ID Number / Passport</label>
                <input
                  id="idNumber"
                  type="text"
                  value={details.idNumber || ''}
                  onChange={e => handleChange('idNumber', e.target.value)}
                  placeholder="13-digit SA ID number"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* 2. Education & Qualifications */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Education & Qualifications
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="text-[11px] uppercase font-bold text-slate-700 hover:text-slate-900 border border-slate-300 px-2.5 py-1"
              >
                + Add Qualification
              </button>
            </div>

            <div className="space-y-3">
              {(details.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-3 bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                      <label className="input-label text-[10px]">Qualification *</label>
                      <input
                        type="text"
                        value={edu.qualification}
                        onChange={e => updateEducationItem(idx, 'qualification', e.target.value)}
                        placeholder="e.g. BCom Information Systems"
                        required
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="input-label text-[10px]">Institution *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => updateEducationItem(idx, 'institution', e.target.value)}
                        placeholder="e.g. University of Pretoria"
                        required
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="input-label text-[10px]">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={e => updateEducationItem(idx, 'fieldOfStudy', e.target.value)}
                        placeholder="e.g. Commerce"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="input-label text-[10px]">Year</label>
                        <input
                          type="text"
                          value={edu.yearCompleted}
                          onChange={e => updateEducationItem(idx, 'yearCompleted', e.target.value)}
                          placeholder="e.g. 2021"
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducationItem(idx)}
                        className="text-xs text-red-600 hover:text-red-800 p-2 font-bold"
                        title="Delete qualification"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Work Experience */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3. Work Experience
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 font-medium">
                  ~{Math.round(totalYearsExp)} yrs experience
                </span>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="text-[11px] uppercase font-bold text-slate-700 hover:text-slate-900 border border-slate-300 px-2.5 py-1"
              >
                + Add Role
              </button>
            </div>

            <div className="space-y-3">
              {(details.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-3 bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                      <label className="input-label text-[10px]">Job Title *</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={e => updateExperienceItem(idx, 'jobTitle', e.target.value)}
                        placeholder="e.g. Senior Analyst"
                        required
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="input-label text-[10px]">Company *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => updateExperienceItem(idx, 'company', e.target.value)}
                        placeholder="e.g. Standard Bank"
                        required
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="input-label text-[10px]">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => updateExperienceItem(idx, 'startDate', e.target.value)}
                        placeholder="YYYY-MM"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="input-label text-[10px]">End Date</label>
                        <input
                          type="text"
                          value={exp.current ? 'Present' : exp.endDate}
                          onChange={e => updateExperienceItem(idx, 'endDate', e.target.value)}
                          placeholder="YYYY-MM"
                          disabled={exp.current}
                          className="input-field text-xs py-1.5 disabled:bg-slate-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperienceItem(idx)}
                        className="text-xs text-red-600 hover:text-red-800 p-2 font-bold"
                        title="Delete role"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="input-label text-[10px]">Key Responsibilities</label>
                    <textarea
                      rows={2}
                      value={exp.responsibilities}
                      onChange={e => updateExperienceItem(idx, 'responsibilities', e.target.value)}
                      placeholder="Outline core responsibilities and achievements..."
                      className="input-field text-xs py-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Skills & Languages */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-100">
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-1 mb-2.5">
                {(details.skills || []).map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 border border-slate-300"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Risk Modeling)"
                  className="input-field text-xs py-1.5"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(e))}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs px-3 py-1 font-semibold uppercase tracking-wider"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-100">
                Languages
              </h3>
              <div className="flex flex-wrap gap-1 mb-2.5">
                {(details.languages || []).map(lang => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 border border-slate-300"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-slate-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={e => setNewLanguage(e.target.value)}
                  placeholder="Add language (e.g. English)"
                  className="input-field text-xs py-1.5"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage(e))}
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs px-3 py-1 font-semibold uppercase tracking-wider"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons: unrounded rectangular, with next-step transition */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep(0); shuffleNavigate(navigate, '/apply/cv', 'backward') }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              ← Back to CV
            </button>

            <button
              type="submit"
              className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-6 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none shadow-sm"
              style={{ borderRadius: 0 }}
            >
              Next: Supporting Documents →
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  )
}
