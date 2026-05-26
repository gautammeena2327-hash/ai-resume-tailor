'use client'

import { useState } from 'react'
import { Copy, Download, Loader2, Crown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const FREE_QUESTIONS_LIMIT = 1

export default function InterviewQuestionsPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [interviewQuestions, setInterviewQuestions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [showTool, setShowTool] = useState(false)
  const [questionCount, setQuestionCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('interviewQuestionCount')
      const lastReset = localStorage.getItem('interviewLastReset')
      const now = new Date().getTime()
      
      if (lastReset && now - parseInt(lastReset) > 30 * 24 * 60 * 60 * 1000) {
        localStorage.setItem('interviewQuestionCount', '0')
        localStorage.setItem('interviewLastReset', now.toString())
        return 0
      }
      return parseInt(saved || '0')
    }
    return 0
  })

  const handleSubmit = async () => {
    if (!jobDescription || questionCount >= FREE_QUESTIONS_LIMIT) return

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to predict questions')
      }
      setInterviewQuestions(data.interviewQuestions || '')
      setIsFallback(data.isFallback || false)
      const newCount = questionCount + 1
      setQuestionCount(newCount)
      localStorage.setItem('interviewQuestionCount', newCount.toString())
    } catch (error: unknown) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewQuestions)
  }

  const downloadAsText = () => {
    const blob = new Blob([interviewQuestions], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'interview-questions.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Interview Questions Predictor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Predict likely interview questions based on job description
          </p>
        </div>

        <div className="flex justify-center items-center gap-6 text-sm mb-8">
          <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow">
            <span className="text-gray-500 dark:text-gray-400">{questionCount}/{FREE_QUESTIONS_LIMIT} free predictions used</span>
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
              className="px-10 py-5 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white rounded-2xl font-bold text-xl hover:from-orange-700 hover:via-red-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto group"
            >
              <HelpCircle className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform" />
              Predict Questions
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              AI-powered interview question prediction
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
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Resume (Optional)
                </label>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume (optional)..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none transition-all"
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
                disabled={!jobDescription || isLoading || questionCount >= FREE_QUESTIONS_LIMIT}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Predicting...
                  </>
                ) : questionCount >= FREE_QUESTIONS_LIMIT ? (
                  'Upgrade to continue'
                ) : (
                  '❓ Predict Questions'
                )}
              </button>
            </div>
          </div>
        )}

        {interviewQuestions && showTool && (
          <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
            {isFallback && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                Note: OpenAI API unavailable. Showing sample questions.
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Predicted Interview Questions
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
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 flex items-center shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
                {interviewQuestions}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}