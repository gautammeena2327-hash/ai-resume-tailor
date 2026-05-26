'use client'

import { useState } from 'react'
import { Copy, Download, Loader2, Crown, Briefcase, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const FREE_ESTIMATES_LIMIT = 1

export default function SalaryEstimatorPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [salaryEstimate, setSalaryEstimate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [showTool, setShowTool] = useState(false)
  const [estimateCount, setEstimateCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('salaryEstimateCount')
      const lastReset = localStorage.getItem('salaryLastReset')
      const now = new Date().getTime()
      
      if (lastReset && now - parseInt(lastReset) > 30 * 24 * 60 * 60 * 1000) {
        localStorage.setItem('salaryEstimateCount', '0')
        localStorage.setItem('salaryLastReset', now.toString())
        return 0
      }
      return parseInt(saved || '0')
    }
    return 0
  })

  const handleSubmit = async () => {
    if (!jobDescription || estimateCount >= FREE_ESTIMATES_LIMIT) return

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/salary-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to estimate salary')
      }
      setSalaryEstimate(data.salaryEstimate || '')
      setIsFallback(data.isFallback || false)
      const newCount = estimateCount + 1
      setEstimateCount(newCount)
      localStorage.setItem('salaryEstimateCount', newCount.toString())
    } catch (error: unknown) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(salaryEstimate)
  }

  const downloadAsText = () => {
    const blob = new Blob([salaryEstimate], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salary-estimate.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Salary Estimator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Get salary estimates for US and UK based on job requirements
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 text-sm mb-8">
          <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow">
            <span className="text-gray-500 dark:text-gray-400">{estimateCount}/{FREE_ESTIMATES_LIMIT} free estimates used</span>
          </div>
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
            <Crown className="w-4 h-4" />
            Upgrade for more
          </Link>
        </div>

        {!showTool && (
          <div className="text-center">
            <button
              onClick={() => setShowTool(true)}
              className="px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto group"
            >
              <Briefcase className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform" />
              Estimate Salary
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              AI-powered salary estimates for US & UK markets
            </p>
          </div>
        )}

        {showTool && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowTool(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 resize-none transition-all"
              />
            </div>

            <div className="mt-6 text-center">
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!jobDescription || isLoading || estimateCount >= FREE_ESTIMATES_LIMIT}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Estimating...
                  </>
                ) : estimateCount >= FREE_ESTIMATES_LIMIT ? (
                  'Upgrade to continue'
                ) : (
                  '💰 Estimate Salary'
                )}
              </button>
            </div>
          </div>
        )}

        {salaryEstimate && showTool && (
          <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
            {isFallback && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                Note: OpenAI API unavailable. Showing estimated ranges.
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Salary Estimate (USD & GBP)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={downloadAsText}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
                {salaryEstimate}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}