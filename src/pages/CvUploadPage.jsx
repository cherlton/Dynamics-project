import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'
import Modal from '../components/Modal'

export default function CvUploadPage() {
  const navigate = useNavigate()
  const { application, mockParseCV, updateApplication, setStep } = useApplicationStore()
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)
  const fileInputRef = useRef(null)

  const [dragActive, setDragActive] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')
  const [manualModalOpen, setManualModalOpen] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setError('')

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const isExtensionValid =
      file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setError('Please upload a PDF, DOC, or DOCX document.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be 5MB or less.')
      return
    }

    setParsing(true)
    try {
      await mockParseCV(file)
    } finally {
      setParsing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleNext = () => {
    if (!application.cvParsed) return
    setStep(1)
    shuffleNavigate(navigate, '/apply/details', 'forward')
  }

  const handleManualFill = () => {
    updateApplication({ cvParsed: true, parsedData: null })
    setStep(1)
    shuffleNavigate(navigate, '/apply/details', 'forward')
  }

  const handleRemove = () => {
    updateApplication({ cv: null, cvParsed: false, parsedData: null })
  }

  return (
    <PortalLayout
      category="STEP 01 OF 05 — CREDENTIALS EXTRACTION"
      title="Upload your CV for automated candidate parsing"
      subtitle="Upload your CV or resume in PDF or Word format to extract your career milestones, education, and proficiencies in seconds."
      currentStep={0}
      showProgressBar={true}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Section 01 of 05 — Curriculum Vitae
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Upload your CV / Resume
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            We will extract your career chronology to streamline your application. You will have full liberty to edit every detail.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-xs text-red-800 rounded-none">
            {error}
          </div>
        )}

        {/* Minimal formal dropzone without bubbly rounded borders */}
        {!application.cv && !parsing && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-8 text-center cursor-pointer transition-colors duration-150 rounded-none ${
              dragActive
                ? 'border-[#0f1b29] bg-slate-100'
                : 'border-slate-300 hover:border-[#0f1b29] bg-white'
            }`}
            style={{ borderRadius: 0 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Minimal document glyph */}
            <div className="w-10 h-10 border border-slate-300 flex items-center justify-center mx-auto mb-3 text-slate-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Select or drag your document here
            </h3>
            <p className="text-[11px] text-slate-500">
              Supported formats: PDF, DOC, DOCX (Maximum file size: 5 MB)
            </p>
          </div>
        )}

        {/* Parsing state with formal typography and zero cartoon icons */}
        {parsing && (
          <div className="p-8 border border-slate-300 bg-slate-50 text-center space-y-3 rounded-none">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent animate-spin mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900">
              Analyzing document structure...
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our secure ingestion service is pre-populating your work chronology and qualifications.
            </p>
          </div>
        )}

        {/* Uploaded File summary card */}
        {application.cv && !parsing && (
          <div className="border border-slate-300 bg-slate-50 p-4 rounded-none">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-slate-300 bg-white flex items-center justify-center text-xs font-bold text-slate-800">
                  DOC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{application.cv.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Extracted
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {(application.cv.size / (1024 * 1024)).toFixed(2)} MB • Ready for review
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-700 hover:text-red-900 underline font-medium px-2 py-1"
              >
                Remove
              </button>
            </div>

            {application.parsedData && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Candidate</span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {application.parsedData.firstName} {application.parsedData.surname}
                  </span>
                </div>
                <div className="bg-white p-2 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Roles</span>
                  <span className="font-semibold text-slate-900">
                    {application.parsedData.experience?.length || 0} extracted
                  </span>
                </div>
                <div className="bg-white p-2 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Degrees</span>
                  <span className="font-semibold text-slate-900">
                    {application.parsedData.education?.length || 0} extracted
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* POPIA Section 71 Notice: Formal statement */}
        <div className="mt-5 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 uppercase tracking-wider text-[10px] block mb-0.5">
            POPIA Section 71 Compliance Notice
          </strong>
          Automated parsing is utilized solely for your convenience to minimize repetitive typing. All candidate submissions are personally evaluated by certified human talent partners.
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setManualModalOpen(true)}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-slate-900 underline"
          >
            Enter details manually
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!application.cvParsed || parsing}
            className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-6 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none disabled:opacity-40"
            style={{ borderRadius: 0 }}
          >
            Next: Review Details →
          </button>
        </div>
      </div>

      <Modal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title="Manual Profile Entry"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            If you prefer not to upload a resume file at this stage, you may proceed directly to Step 2 and enter your educational credentials and work history manually.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setManualModalOpen(false)}
              className="border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-800 rounded-none"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleManualFill}
              className="bg-[#0f1b29] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Continue Manually
            </button>
          </div>
        </div>
      </Modal>
    </PortalLayout>
  )
}
