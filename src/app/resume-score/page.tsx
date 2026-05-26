'use client'

import { useState } from 'react'
import { Copy, Download, Loader2, BarChart3 } from 'lucide-react'

export default function ResumeScorePage() {
  const [resume, setResume] = useState('')
  const [resumeScore, setResumeScore] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [showTool, setShowTool] = useState(false)

  const handleSubmit = async () => {
    if (!resume) return

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/resume-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to score resume')
      }
      setResumeScore(data.resumeScore || '')
      setIsFallback(data.isFallback || false)
    } catch (error: unknown) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeScore)
  }

  const downloadAsText = () => {
    const blob = new Blob([resumeScore], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-score.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Resume Score Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant feedback and a score (0-100) for your resume
          </p>
        </div>

        {!showTool && (
          <div className="text-center">
            <button
              onClick={() => setShowTool(true)}
              className="px-10 py-5 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white rounded-2xl font-bold text-xl hover:from-amber-700 hover:via-yellow-700 hover:to-orange-700 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto group"
            >
              <BarChart3 className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform" />
              Check My Resume Score
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Free instant resume analysis
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
                Your Resume
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 resize-none transition-all"
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
                disabled={!resume || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scoring...
                  </>
                ) : (
                  '📊 Get Resume Score'
                )}
              </button>
            </div>
          </div>
        )}

        {resumeScore && showTool && (
          <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
            {isFallback && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                Note: OpenAI API unavailable. Showing sample score.
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Resume Analysis
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
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 flex items-center shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
                {resumeScore}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}