import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import {
  FileText, Upload, CheckCircle2, AlertCircle, Trash2, ArrowRight,
  ArrowLeft, Lock, Shield, Plus, FileCheck
} from 'lucide-react'

export default function DocumentsPage() {
  const navigate = useNavigate()
  const { application, updateDocuments, setStep } = useApplicationStore()

  const [docs, setDocs] = useState(application.documents || {
    certifiedId: null,
    coverLetter: null,
    coverLetterText: '',
    qualifications: [],
    other: [],
  })

  const [coverMode, setCoverMode] = useState('text') // 'text' | 'file'
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
    navigate('/apply/screening')
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-card w-full mx-auto p-4 md:py-8">
        <div className="card-form shadow-xl animate-fade-in">
          <ProgressBar currentStep={2} />

          <div className="mb-6">
            <h1 className="text-page-title text-gray-900">Supporting Documents</h1>
            <div className="gray-dash mt-2 mb-2" />
            <p className="text-gray-600 text-sm">
              Please provide certified identification and any optional documents that support your application.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-6">
            {/* 1. Mandatory ID Document */}
            <div className="p-5 border-2 border-blue-200 rounded-2xl bg-blue-50/20">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-700" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Certified South African ID or Passport <span className="text-danger">*</span>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Certified within the last 3 months. PDF, JPG, or PNG (Max 5MB).
                  </p>
                </div>
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>

              {/* Just-in-time Privacy Notice (POPIA compliant) */}
              <div className="my-3 p-3 bg-white rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-gray-600">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Why we need this:</strong> In accordance with SA labour law, your ID confirms your right to work. It is stored encrypted in compliance with POPIA, only accessible by authorized recruiters, and retained strictly for the statutory retention period.
                </p>
              </div>

              {!docs.certifiedId ? (
                <div
                  onClick={() => idInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white"
                >
                  <input
                    ref={idInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0])}
                  />
                  <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-gray-800 block">Click to upload Certified ID</span>
                  <span className="text-[11px] text-gray-400">PDF, JPG, PNG up to 5MB</span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-white border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">{docs.certifiedId.name}</span>
                      <span className="text-[10px] text-gray-500">
                        {(docs.certifiedId.size / 1024).toFixed(0)} KB • Uploaded securely
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDocs(prev => ({ ...prev, certifiedId: null }))
                      updateDocuments('certifiedId', null)
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                    title="Remove ID"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. Cover Letter (Optional) */}
            <div className="p-5 border border-gray-200 rounded-2xl bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900 text-sm">Cover Letter (Optional)</h3>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setCoverMode('text')}
                    className={`px-2.5 py-1 rounded font-medium ${coverMode === 'text' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}
                  >
                    Type Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMode('file')}
                    className={`px-2.5 py-1 rounded font-medium ${coverMode === 'file' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {coverMode === 'text' ? (
                <div>
                  <textarea
                    rows={4}
                    value={docs.coverLetterText || ''}
                    onChange={(e) => {
                      const updated = { ...docs, coverLetterText: e.target.value }
                      setDocs(updated)
                      updateDocuments('coverLetterText', e.target.value)
                    }}
                    placeholder="Tell the hiring manager why you are a great fit for this role..."
                    className="input-field text-sm"
                  />
                  <span className="text-[10px] text-gray-400 block text-right mt-1">
                    {(docs.coverLetterText || '').length} characters
                  </span>
                </div>
              ) : (
                <div>
                  {!docs.coverLetter ? (
                    <div
                      onClick={() => coverFileInputRef.current?.click()}
                      className="border border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50"
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
                      <Upload className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Upload cover letter (PDF, DOC)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-xs font-medium text-gray-800">{docs.coverLetter.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocs(prev => ({ ...prev, coverLetter: null }))
                          updateDocuments('coverLetter', null)
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Qualification Certificates (Optional) */}
            <div className="p-5 border border-gray-200 rounded-2xl bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Qualification Certificates (Optional)</h3>
                  <p className="text-xs text-gray-500">Degree, diploma or matric certificates (PDF, JPG)</p>
                </div>
                <button
                  type="button"
                  onClick={() => certInputRef.current?.click()}
                  className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
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
                <div className="space-y-2 pt-2">
                  {docs.qualifications.map((q) => (
                    <div key={q.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">{q.name}</span>
                        <span className="text-gray-400">({(q.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQualification(q.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Other Documents */}
            <div className="p-5 border border-gray-200 rounded-2xl bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Other Documents (Optional)</h3>
                  <p className="text-xs text-gray-500">Portfolio, reference letters, proof of address (Up to 5 files)</p>
                </div>
                <button
                  type="button"
                  onClick={() => otherInputRef.current?.click()}
                  className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add File</span>
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
                <div className="space-y-2 pt-2">
                  {docs.other.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">{o.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOther(o.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back & Next Navigation */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep(1); navigate('/apply/details') }}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <span>Next: Screening Questions</span>
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
