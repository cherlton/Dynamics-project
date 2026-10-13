import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight, Sparkles, UserCheck } from 'lucide-react'

export default function CvUploadPage() {
  const navigate = useNavigate()
  const { application, mockParseCV, updateApplication, setStep } = useApplicationStore()
  const fileInputRef = useRef(null)

  const [dragActive, setDragActive] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')
  const [manualModalOpen, setManualModalOpen] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setError('')

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const isExtensionValid = file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')

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
    navigate('/apply/details')
  }

  const handleManualFill = () => {
    updateApplication({ cvParsed: true, parsedData: null })
    setStep(1)
    navigate('/apply/details')
  }

  const handleRemove = () => {
    updateApplication({ cv: null, cvParsed: false, parsedData: null })
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-card w-full mx-auto p-4 md:py-8">
        <div className="card-form shadow-xl animate-fade-in">
          {/* Progress Bar */}
          <ProgressBar currentStep={0} />

          <div className="mb-6">
            <h1 className="text-page-title text-gray-900">Upload your CV / Resume</h1>
            <div className="gray-dash mt-2 mb-3" />
            <p className="text-gray-600 text-sm">
              We’ll automatically parse your experience, education, and skills to save you time.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          {!application.cv && !parsing && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Drag and drop your CV here, or <span className="text-blue-600 underline">browse</span>
              </h3>
              <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX up to 5MB</p>
            </div>
          )}

          {/* Parsing State */}
          {parsing && (
            <div className="p-8 border border-blue-200 bg-blue-50/40 rounded-2xl text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Reading and extracting details from your CV...</span>
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="h-3 bg-blue-200/60 rounded-full animate-pulse" />
                <div className="h-3 bg-blue-200/40 rounded-full animate-pulse w-4/5 mx-auto" />
                <div className="h-3 bg-blue-200/30 rounded-full animate-pulse w-3/5 mx-auto" />
              </div>
              <p className="text-xs text-gray-500">This usually takes about 2 to 3 seconds.</p>
            </div>
          )}

          {/* Uploaded File Chip */}
          {application.cv && !parsing && (
            <div className="border border-green-200 bg-green-50/50 rounded-2xl p-6 animate-slide-up">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{application.cv.name}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Extracted
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(application.cv.size / (1024 * 1024)).toFixed(2)} MB • Ready for review
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove CV"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Parsed Preview Highlight */}
              {application.parsedData && (
                <div className="mt-4 pt-4 border-t border-green-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-green-100">
                    <span className="text-gray-400 block text-[10px]">Candidate</span>
                    <span className="font-semibold text-gray-800">{application.parsedData.firstName} {application.parsedData.surname}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-green-100">
                    <span className="text-gray-400 block text-[10px]">Experience</span>
                    <span className="font-semibold text-gray-800">{application.parsedData.experience.length} roles found</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-green-100">
                    <span className="text-gray-400 block text-[10px]">Education</span>
                    <span className="font-semibold text-gray-800">{application.parsedData.education.length} degrees found</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* POPIA Section 71 Reassurance */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-900">POPIA Section 71 Notice:</strong> We use automated tools solely to extract details from your CV for convenience. You will always have the right to review and correct all details on the next screen. All recruitment decisions are evaluated by our human talent managers.
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setManualModalOpen(true)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline"
            >
              I can't upload a CV (Fill manually)
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!application.cvParsed || parsing}
              className="btn-primary flex items-center gap-2"
            >
              <span>Next: Review Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry Explanation Modal */}
      <Modal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title="Continue Without CV Upload"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Uploading a CV lets our parser pre-fill your qualifications and work history. If you don't have your CV file right now, you can enter all information manually in Step 2.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setManualModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleManualFill}
              className="btn-primary text-xs"
            >
              Continue Manually
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
