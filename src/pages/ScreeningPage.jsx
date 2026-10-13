import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../store/applicationStore'
import { useUiStore } from '../store/uiStore'
import PortalLayout from '../components/PortalLayout'

export default function ScreeningPage() {
  const navigate = useNavigate()
  const { application, updateScreening, setStep } = useApplicationStore()
  const shuffleNavigate = useUiStore(s => s.shuffleNavigate)

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
    shuffleNavigate(navigate, '/apply/summary', 'forward')
  }

  return (
    <PortalLayout
      category="STEP 04 OF 05 — ROLE ALIGNMENT"
      title="Screening and candidate eligibility evaluation"
      subtitle="Answer key role alignment, statutory employment eligibility, and availability questions to guide our talent committee."
      currentStep={3}
      showProgressBar={true}
    >
      <div>
        <div className="mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Section 04 of 05 — Role Alignment
          </span>
          <h2 className="formal-heading-dark text-2xl sm:text-3xl font-semibold">
            Screening Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            These questions assist our human talent reviewers in evaluating role expectations and logistic parameters.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-xs text-red-800 rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-5">
          {/* Group 1: Eligibility */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              1. Statutory Eligibility
            </h3>

            {/* Legal Entitlement */}
            <div>
              <label className="input-label font-bold text-slate-900 mb-2">
                Are you legally entitled to work in South Africa? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 hover:border-slate-800 bg-white">
                  <input
                    type="radio"
                    name="legallyEntitled"
                    value="yes"
                    checked={screening.legallyEntitled === 'yes'}
                    onChange={() => handleChange('legallyEntitled', 'yes')}
                    className="text-[#0f1b29] focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Yes (Citizen / PR / Valid Permit)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 hover:border-slate-800 bg-white">
                  <input
                    type="radio"
                    name="legallyEntitled"
                    value="no"
                    checked={screening.legallyEntitled === 'no'}
                    onChange={() => handleChange('legallyEntitled', 'no')}
                    className="text-[#0f1b29] focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    No (Require Sponsorship)
                  </span>
                </label>
              </div>

              {screening.legallyEntitled === 'no' && (
                <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-300 text-xs text-amber-900">
                  <strong>Notice:</strong> This role typically requires South African work authorization. Our talent team evaluates sponsorship availability on a case-by-case basis.
                </div>
              )}
            </div>

            {/* Driver's Licence */}
            <div className="pt-2 border-t border-slate-100">
              <label className="input-label font-bold text-slate-900 mb-2">
                Do you hold a valid South African driver’s licence?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 hover:border-slate-800 bg-white">
                  <input
                    type="radio"
                    name="driversLicence"
                    value="yes"
                    checked={screening.driversLicence === 'yes'}
                    onChange={() => handleChange('driversLicence', 'yes')}
                    className="text-[#0f1b29] focus:ring-0"
                  />
                  <span className="text-xs text-slate-800">Yes (Code 8 / B or higher)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 hover:border-slate-800 bg-white">
                  <input
                    type="radio"
                    name="driversLicence"
                    value="no"
                    checked={screening.driversLicence === 'no'}
                    onChange={() => handleChange('driversLicence', 'no')}
                    className="text-[#0f1b29] focus:ring-0"
                  />
                  <span className="text-xs text-slate-800">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Group 2: Availability & Expectations */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              2. Availability & Compensation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="input-label font-bold text-slate-900" htmlFor="noticePeriod">
                  Notice Period *
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
                <label className="input-label font-bold text-slate-900" htmlFor="availabilityDate">
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
                <label className="input-label font-bold text-slate-900" htmlFor="salaryExpectation">
                  Monthly Salary Expectation (ZAR, Gross)
                </label>
                <input
                  id="salaryExpectation"
                  type="text"
                  placeholder="e.g. 65,000"
                  value={screening.salaryExpectation || ''}
                  onChange={e => handleChange('salaryExpectation', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label font-bold text-slate-900" htmlFor="workMode">
                  Preferred Work Arrangement
                </label>
                <select
                  id="workMode"
                  value={screening.workMode || ''}
                  onChange={e => handleChange('workMode', e.target.value)}
                  className="input-field bg-white"
                >
                  <option value="">Select arrangement</option>
                  <option value="Hybrid">Hybrid (2-3 days office)</option>
                  <option value="Remote">Fully Remote</option>
                  <option value="On-site">On-site (Johannesburg headquarters)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 3: Motivation Statement */}
          <div className="border border-slate-200 p-4 sm:p-5 bg-white space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              3. Professional Statement
            </h3>

            <label className="input-label" htmlFor="whyWorkHere">
              Why are you interested in joining Gaspar?
            </label>
            <textarea
              id="whyWorkHere"
              rows={3}
              maxLength={800}
              value={screening.whyWorkHere || ''}
              onChange={e => handleChange('whyWorkHere', e.target.value)}
              placeholder="Outline your professional experience and how your skill profile aligns with this position..."
              className="input-field text-xs py-2"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Maximum 800 characters</span>
              <span>{(screening.whyWorkHere || '').length} / 800</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep(2); shuffleNavigate(navigate, '/apply/documents', 'backward') }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-5 font-semibold text-xs uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              ← Back to Documents
            </button>

            <button
              type="submit"
              className="bg-[#0f1b29] hover:bg-[#1a2d42] text-white py-3 px-6 font-semibold text-xs uppercase tracking-wider transition-all duration-150 rounded-none shadow-sm"
              style={{ borderRadius: 0 }}
            >
              Next: Review & Submit →
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  )
}
