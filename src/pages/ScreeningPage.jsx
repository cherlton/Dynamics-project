import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import { HelpCircle, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ScreeningPage() {
  const navigate = useNavigate()
  const { application, updateScreening, setStep } = useApplicationStore()

  const [screening, setScreening] = useState(application.screening || {})
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    const updated = { ...screening, [field]: value }
    setScreening(updated)
    updateScreening(field, value)
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!screening.legallyEntitled || !screening.noticePeriod) {
      setError('Please answer all required screening questions.')
      return
    }
    setStep(4)
    navigate('/apply/summary')
  }

  return (
    <div className="bg-gradient-portal flex flex-col min-h-screen">
      <div className="flex-1 max-w-card w-full mx-auto p-4 md:py-8">
        <div className="card-form shadow-xl animate-fade-in">
          <ProgressBar currentStep={3} />

          <div className="mb-6">
            <h1 className="text-page-title text-gray-900">Screening Questions</h1>
            <div className="gray-dash mt-2 mb-2" />
            <p className="text-gray-600 text-sm">
              Please answer these role-specific questions to help our hiring committee evaluate your alignment.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-6">
            {/* Group 1: Eligibility & Compliance (Knock-out questions with gentle advice) */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">1. Eligibility</span>

              {/* Legal entitlement question */}
              <div>
                <label className="input-label font-semibold text-gray-900">
                  Are you legally entitled to work in South Africa? <span className="text-danger">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1">
                    <input
                      type="radio"
                      name="legallyEntitled"
                      value="yes"
                      checked={screening.legallyEntitled === 'yes'}
                      onChange={() => handleChange('legallyEntitled', 'yes')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">Yes (Citizen / PR / Valid Permit)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1">
                    <input
                      type="radio"
                      name="legallyEntitled"
                      value="no"
                      checked={screening.legallyEntitled === 'no'}
                      onChange={() => handleChange('legallyEntitled', 'no')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">No (Require sponsorship)</span>
                  </label>
                </div>

                {screening.legallyEntitled === 'no' && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800 animate-slide-up">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Note:</strong> This role normally requires existing work entitlement in South Africa. Our talent team will review any international applications manually without automated disqualification.
                    </div>
                  </div>
                )}
              </div>

              {/* Driver's Licence question */}
              <div className="pt-3 border-t border-gray-100">
                <label className="input-label font-semibold text-gray-900">
                  Do you hold a valid South African driver’s licence?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1">
                    <input
                      type="radio"
                      name="driversLicence"
                      value="yes"
                      checked={screening.driversLicence === 'yes'}
                      onChange={() => handleChange('driversLicence', 'yes')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-800">Yes (Code 8 / B or higher)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1">
                    <input
                      type="radio"
                      name="driversLicence"
                      value="no"
                      checked={screening.driversLicence === 'no'}
                      onChange={() => handleChange('driversLicence', 'no')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-800">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Group 2: Availability & Experience */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">2. Availability & Logistics</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label font-semibold text-gray-900" htmlFor="noticePeriod">
                    Notice Period <span className="text-danger">*</span>
                  </label>
                  <select
                    id="noticePeriod"
                    value={screening.noticePeriod || ''}
                    onChange={e => handleChange('noticePeriod', e.target.value)}
                    required
                    className="input-field bg-white"
                  >
                    <option value="">Select notice period</option>
                    <option value="Immediate">Immediate / Available now</option>
                    <option value="2 Weeks">Calendar 2 Weeks</option>
                    <option value="1 Month">1 Calendar Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>

                <div>
                  <label className="input-label font-semibold text-gray-900" htmlFor="availabilityDate">
                    Earliest Start Date
                  </label>
                  <input
                    id="availabilityDate"
                    type="date"
                    value={screening.availabilityDate || ''}
                    onChange={e => handleChange('availabilityDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label font-semibold text-gray-900" htmlFor="salaryExpectation">
                    Monthly Salary Expectation (ZAR, Gross)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">R</span>
                    <input
                      id="salaryExpectation"
                      type="text"
                      placeholder="e.g. 65,000"
                      value={screening.salaryExpectation || ''}
                      onChange={e => handleChange('salaryExpectation', e.target.value)}
                      className="input-field pl-8"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 block mt-1">Optional, assists with role bracket alignment</span>
                </div>

                <div>
                  <label className="input-label font-semibold text-gray-900" htmlFor="workMode">
                    Preferred Work Arrangement
                  </label>
                  <select
                    id="workMode"
                    value={screening.workMode || ''}
                    onChange={e => handleChange('workMode', e.target.value)}
                    className="input-field bg-white"
                  >
                    <option value="">Select work mode</option>
                    <option value="Hybrid">Hybrid (2-3 days office)</option>
                    <option value="Remote">Fully Remote</option>
                    <option value="On-site">On-site (Johannesburg office)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 3: Motivation Statement */}
            <div className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">3. Statement of Motivation</span>

              <label className="input-label font-semibold text-gray-900" htmlFor="whyWorkHere">
                Why are you interested in this position?
              </label>
              <textarea
                id="whyWorkHere"
                rows={4}
                maxLength={800}
                value={screening.whyWorkHere || ''}
                onChange={e => handleChange('whyWorkHere', e.target.value)}
                placeholder="Share what excites you about this role and how your strengths align..."
                className="input-field text-sm"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400">
                <span>Maximum 800 characters</span>
                <span>{(screening.whyWorkHere || '').length} / 800</span>
              </div>
            </div>

            {/* Back & Next Navigation */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep(2); navigate('/apply/documents') }}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <span>Next: Review & Submit</span>
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
