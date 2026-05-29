'use client'

import { useState } from 'react'
import { Copy, Download, Loader2, FileText } from 'lucide-react'

export default function CoverLetterPage() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [showTool, setShowTool] = useState(false)

  const handleSubmit = async () => {
    if (!resume || !jobDescription) return

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate cover letter')
      }
      setCoverLetter(data.coverLetter || '')
      setIsFallback(data.isFallback || false)
    } catch (error: unknown) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
  }

  const downloadAsText = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cover-letter.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Cover Letter Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Generate personalized cover letters in seconds - completely free!
            </p>
          </div>

          {!showTool && (
            <div className="text-center">
              <button
                onClick={() => setShowTool(true)}
                className="px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto group"
              >
                <FileText className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform" />
                Build Your Cover Letter Now
              </button>
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                AI-powered cover letter generation
              </p>
            </div>
          )}

          {showTool && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 animate-in slide-in-from-bottom duration-500">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowTool(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Resume
                  </label>
                  <textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume here..."
                    className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!resume || !jobDescription || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    '✨ Generate Cover Letter'
                  )}
                </button>
              </div>
            </div>
          )}

          {coverLetter && showTool && (
            <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 animate-in slide-in-from-bottom duration-500">
              {isFallback && (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-300 rounded-xl text-sm">
                  Note: OpenAI API unavailable. Showing template cover letter.
                </div>
              )}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Your Cover Letter
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center transition-all shadow-lg"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={downloadAsText}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">{coverLetter}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
}