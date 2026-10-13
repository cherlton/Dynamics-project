import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

export default function DocumentsPage() {
  const navigate = useNavigate()
  const { application, updateDocuments, setStep } = useApplicationStore()
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

  const [docs, setDocs] = useState(application.documents || {
    certifiedId: null,
    coverLetter: null,
    coverLetterText: '',
    qualifications: [],
    other: [],
  })

  const [coverMode, setCoverMode] = useState('text')
  const [error, setError] = useState('')

  const idInputRef = useRef(null)
  const certInputRef = useRef(null)
  const otherInputRef = useRef(null)
  const coverFileInputRef = useRef(null)

  const handleIdUpload = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('ID file must be smaller than 5MB.')
      return
    }
    const docData = {
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      type: file.type,
    }
    const updated = { ...docs, certifiedId: docData }
    setDocs(updated)
    updateDocuments('certifiedId', docData)
    setError('')
  }

  const handleQualificationUpload = (files) => {
    if (!files?.length) return
    const newItems = Array.from(files).map(f => ({
      id: 'cert-' + Math.random().toString(36).substring(2, 7),
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
    }))
    const updated = { ...docs, qualifications: [...(docs.qualifications || []), ...newItems] }
    setDocs(updated)
    updateDocuments('qualifications', updated.qualifications)
  }

  const removeQualification = (id) => {
    const updated = (docs.qualifications || []).filter(q => q.id !== id)
    setDocs(prev => ({ ...prev, qualifications: updated }))
    updateDocuments('qualifications', updated)
  }

  const handleOtherUpload = (files) => {
    if (!files?.length) return
    const newItems = Array.from(files).slice(0, 5).map(f => ({
      id: 'oth-' + Math.random().toString(36).substring(2, 7),
      name: f.name,
      size: f.size,
      label: 'Supporting Doc',
      uploadedAt: new Date().toISOString(),
    }))
    const updated = { ...docs, other: [...(docs.other || []), ...newItems] }
    setDocs(updated)
    updateDocuments('other', updated.other)
  }

  const removeOther = (id) => {
    const updated = (docs.other || []).filter(o => o.id !== id)
    setDocs(prev => ({ ...prev, other: updated }))
    updateDocuments('other', updated)
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!docs.certifiedId) {
      setError('Certified ID copy or Passport is required to proceed.')
      return
    }
    setStep(3)
    shuffleNavigate(navigate, '/apply/screening', 'forward')
  }

  return (
    <PortalLayout
      category="STEP 03 OF 05 — STATUTORY VERIFICATION"
      title="Submit supporting candidate documentation"
      subtitle="Upload your certified ID copy or passport and qualification certificates to authenticate your candidate profile under POPIA."
      currentStep={2}
      showProgressBar={true}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Section 03 of 05 — Formal Verification
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Supporting Documents
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please attach your certified identification copy and any relevant certificates to authenticate your submission.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-xs text-red-800 rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-5">
          {/* 1. Mandatory ID Document */}
          <div className="border border-slate-300 p-4 bg-slate-50">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Certified South African ID or Passport *
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Certified within the last 3 months. PDF, JPG, or PNG (Max 5MB).
                </p>
              </div>
              <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 border border-red-200 uppercase tracking-wider">
                Mandatory
              </span>
            </div>

            {/* Just-in-time Privacy Notice */}
            <p className="text-[11px] text-slate-600 bg-white p-2.5 border border-slate-200 my-2 leading-relaxed">
              <strong>Statutory Requirement:</strong> In compliance with South African labor regulations, your ID verifies your entitlement to work. Uploaded documents are encrypted and accessible exclusively by designated talent evaluators under POPIA.
            </p>

            {!docs.certifiedId ? (
              <div
                onClick={() => idInputRef.current?.click()}
                className="border border-dashed border-slate-300 hover:border-slate-800 p-5 text-center cursor-pointer transition-colors bg-white mt-3"
              >
                <input
                  ref={idInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0])}
                />
                <span className="text-xs font-semibold text-slate-900 block uppercase tracking-wider">
                  Select Certified ID / Passport File
                </span>
                <span className="text-[11px] text-slate-400">PDF, JPG, PNG up to 5MB</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-white border border-slate-300 mt-3">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">{docs.certifiedId.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {(docs.certifiedId.size / 1024).toFixed(0)} KB • Attached securely
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDocs(prev => ({ ...prev, certifiedId: null }))
                    updateDocuments('certifiedId', null)
                  }}
                  className="text-xs text-red-700 hover:text-red-900 font-bold uppercase tracking-wider px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* 2. Cover Letter */}
          <div className="border border-slate-200 p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                Cover Letter (Optional)
              </h3>
              <div className="flex items-center gap-1 border border-slate-200 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCoverMode('text')}
                  className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    coverMode === 'text' ? 'bg-[#0f1b29] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Type Statement
                </button>
                <button
                  type="button"
                  onClick={() => setCoverMode('file')}
                  className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    coverMode === 'file' ? 'bg-[#0f1b29] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {coverMode === 'text' ? (
              <div>
                <textarea
                  rows={3}
                  value={docs.coverLetterText || ''}
                  onChange={(e) => {
                    const updated = { ...docs, coverLetterText: e.target.value }
                    setDocs(updated)
                    updateDocuments('coverLetterText', e.target.value)
                  }}
                  placeholder="Outline your alignment with the role and key career motivations..."
                  className="input-field text-xs py-2"
                />
                <span className="text-[10px] text-slate-400 block text-right mt-1">
                  {(docs.coverLetterText || '').length} characters
                </span>
              </div>
            ) : (
              <div>
                {!docs.coverLetter ? (
                  <div
                    onClick={() => coverFileInputRef.current?.click()}
                    className="border border-dashed border-slate-300 p-4 text-center cursor-pointer hover:bg-slate-50"
                  >
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const d = { name: file.name, size: file.size }
                          setDocs(prev => ({ ...prev, coverLetter: d }))
                          updateDocuments('coverLetter', d)
                        }
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                      Attach Cover Letter Document
                    </span>
                    <span className="text-[11px] text-slate-400">PDF, DOC, DOCX up to 5MB</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-900">{docs.coverLetter.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDocs(prev => ({ ...prev, coverLetter: null }))
                        updateDocuments('coverLetter', null)
                      }}
                      className="text-xs text-red-700 hover:text-red-900 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Qualifications */}
          <div className="border border-slate-200 p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Qualification Certificates (Optional)
                </h3>
                <p className="text-[11px] text-slate-500">Degree, diploma or technical certificates</p>
              </div>
              <button
                type="button"
                onClick={() => certInputRef.current?.click()}
                className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5"
              >
                + Attach Certificates
              </button>
              <input
                ref={certInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleQualificationUpload(e.target.files)}
              />
            </div>

            {(docs.qualifications || []).length > 0 && (
              <div className="space-y-1.5 pt-1">
                {docs.qualifications.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="font-medium text-slate-900">{q.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({(q.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQualification(q.id)}
                      className="text-xs text-red-700 hover:text-red-900 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Other Documents */}
          <div className="border border-slate-200 p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Supplementary Records (Optional)
                </h3>
                <p className="text-[11px] text-slate-500">References, license copies, or awards (Up to 5 files)</p>
              </div>
              <button
                type="button"
                onClick={() => otherInputRef.current?.click()}
                className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5"
              >
                + Add Records
              </button>
              <input
                ref={otherInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleOtherUpload(e.target.files)}
              />
            </div>

            {(docs.other || []).length > 0 && (
              <div className="space-y-1.5 pt-1">
                {docs.other.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-900">{o.name}</span>
                    <button
                      type="button"
                      onClick={() => removeOther(o.id)}
                      className="text-xs text-red-700 hover:text-red-900 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep(1); shuffleNavigate(navigate, '/apply/details', 'backward') }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              ← Back to Details
            </button>

            <button
              type="submit"
              className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-6 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none shadow-sm"
              style={{ borderRadius: 0 }}
            >
              Next: Screening Questions →
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  )
}
