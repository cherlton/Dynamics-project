import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import {
  Sparkles, Check, Plus, Trash2, ArrowRight, ArrowLeft,
  User, GraduationCap, Briefcase, Award, Globe, Save
} from 'lucide-react'

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
]

export default function DetailsPage() {
  const navigate = useNavigate()
  const { application, updateDetails, setStep } = useApplicationStore()

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

  // Calculate total years of experience
  const totalYearsExp = useMemo(() => {
    if (!details.experience?.length) return 0
    return details.experience.length * 2.5 // approximate or derived
  }, [details.experience])

  // Skills & Languages tag management
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
    navigate('/apply/documents')
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-8">
        <div className="bg-white rounded-card shadow-xl p-6 md:p-8 animate-fade-in">
          <ProgressBar currentStep={1} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-page-title text-gray-900">Review & Edit Details</h1>
              <div className="gray-dash mt-2 mb-2" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <Save className="w-3.5 h-3.5" />
              <span>{lastSaved}</span>
            </div>
          </div>

          {/* Auto-filled top banner */}
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong>Pre-populated from CV:</strong> We've extracted your background details. Blue badges mark auto-filled values. You can review, correct, or add anything missing below.
            </div>
          </div>

          <form onSubmit={handleNext} className="space-y-8">
            {/* 1. Personal Details Card */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <User className="w-5 h-5 text-blue-700" />
                <h2 className="text-section-title text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="input-label mb-0" htmlFor="firstName">First Name *</label>
                    {!editedFields.firstName && details.firstName && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">Auto-filled</span>
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="input-label mb-0" htmlFor="surname">Surname *</label>
                    {!editedFields.surname && details.surname && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">Auto-filled</span>
                    )}
                  </div>
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
                    className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="input-label mb-0" htmlFor="mobile">Mobile Number (SA) *</label>
                    {!editedFields.mobile && details.mobile && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">Auto-filled</span>
                    )}
                  </div>
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

            {/* 2. Education Card */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-700" />
                  <h2 className="text-section-title text-gray-900">Education & Qualifications</h2>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Qualification</span>
                </button>
              </div>

              <div className="space-y-4">
                {(details.education || []).map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="input-label text-xs">Qualification *</label>
                        <input
                          type="text"
                          value={edu.qualification}
                          onChange={e => updateEducationItem(idx, 'qualification', e.target.value)}
                          placeholder="e.g. BCom Information Systems"
                          required
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="input-label text-xs">Institution *</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={e => updateEducationItem(idx, 'institution', e.target.value)}
                          placeholder="e.g. University of Pretoria"
                          required
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="input-label text-xs">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={e => updateEducationItem(idx, 'fieldOfStudy', e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="input-label text-xs">Year Completed</label>
                          <input
                            type="text"
                            value={edu.yearCompleted}
                            onChange={e => updateEducationItem(idx, 'yearCompleted', e.target.value)}
                            placeholder="e.g. 2021"
                            className="input-field text-sm py-2"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducationItem(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg mb-0.5"
                          title="Delete qualification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Work Experience Card */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-700" />
                  <h2 className="text-section-title text-gray-900">Work Experience</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium ml-2">
                    ~{Math.round(totalYearsExp)} yrs experience
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {(details.experience || []).map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="input-label text-xs">Job Title *</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={e => updateExperienceItem(idx, 'jobTitle', e.target.value)}
                          placeholder="e.g. Senior Analyst"
                          required
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="input-label text-xs">Company *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => updateExperienceItem(idx, 'company', e.target.value)}
                          placeholder="e.g. Standard Bank"
                          required
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="input-label text-xs">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={e => updateExperienceItem(idx, 'startDate', e.target.value)}
                          placeholder="YYYY-MM"
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="input-label text-xs">End Date</label>
                          <input
                            type="text"
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={e => updateExperienceItem(idx, 'endDate', e.target.value)}
                            placeholder="YYYY-MM or Present"
                            disabled={exp.current}
                            className="input-field text-sm py-2 disabled:bg-gray-100"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperienceItem(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg mb-0.5"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="input-label text-xs">Key Responsibilities</label>
                      <textarea
                        rows={2}
                        value={exp.responsibilities}
                        onChange={e => updateExperienceItem(idx, 'responsibilities', e.target.value)}
                        placeholder="Highlight your key achievements and duties..."
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Skills & Languages Card */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Award className="w-4 h-4 text-blue-700" />
                  <h3 className="font-semibold text-gray-900 text-sm">Key Skills</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(details.skills || []).map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full border border-blue-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-500 hover:text-red-600 font-bold"
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
                    placeholder="Add a skill (e.g. Python)"
                    className="input-field text-xs py-2"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(e))}
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary text-xs px-3 py-2">
                    Add
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-700" />
                  <h3 className="font-semibold text-gray-900 text-sm">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(details.languages || []).map(lang => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200"
                    >
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="text-gray-400 hover:text-red-600 font-bold"
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
                    placeholder="Add a language (e.g. English)"
                    className="input-field text-xs py-2"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage(e))}
                  />
                  <button type="button" onClick={addLanguage} className="btn-secondary text-xs px-3 py-2">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Back & Next Navigation */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep(0); navigate('/apply/cv') }}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <span>Next: Supporting Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
