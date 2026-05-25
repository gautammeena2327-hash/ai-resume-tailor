'use client'

import { useState } from 'react'
import { Copy, Download, Loader2, FileText, Briefcase, Crown } from 'lucide-react'
import Link from 'next/link'

const FREE_TAILORS_LIMIT = 3

export default function Home() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tailoredResume, setTailoredResume] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [template, setTemplate] = useState('professional')
  const [activeTab, setActiveTab] = useState('input')
  const [tailorCount, setTailorCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tailorCount')
      const lastReset = localStorage.getItem('lastReset')
      const now = new Date().getTime()

      if (lastReset && now - parseInt(lastReset) > 30 * 24 * 60 * 60 * 1000) {
        localStorage.setItem('tailorCount', '0')
        localStorage.setItem('lastReset', now.toString())
        return 0
      }

      return parseInt(saved || '0')
    }
    return 0
  })

  const handleSubmit = async () => {
    if (!resume || !jobDescription || tailorCount >= FREE_TAILORS_LIMIT) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, template }),
      })

      const data = await response.json()
      setTailoredResume(data.tailoredResume || '')
      setActiveTab('output')
      const newCount = tailorCount + 1
      setTailorCount(newCount)
      localStorage.setItem('tailorCount', newCount.toString())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tailoredResume)
  }

  const downloadAsText = () => {
    const blob = new Blob([tailoredResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tailored-resume.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Resume Tailor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Optimize your resume for any job in seconds
          </p>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tailorCount}/{FREE_TAILORS_LIMIT} free tailors used
            </span>
            <Link href="/cover-letter" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Cover Letter Generator
            </Link>
            <Link href="/pricing" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              <Crown className="w-4 h-4 mr-1" />
              Upgrade for more
            </Link>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'input'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="inline w-5 h-5 mr-2" />
              Input
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'output'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              disabled={!tailoredResume}
            >
              <Briefcase className="inline w-5 h-5 mr-2" />
              Tailored Resume
            </button>
          </div>

          {activeTab === 'input' && (
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Style
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="executive">Executive</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Current Resume
                  </label>
                  <textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your current resume here..."
                    className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
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
                    className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

<div className="mt-6 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={!resume || !jobDescription || isLoading || tailorCount >= FREE_TAILORS_LIMIT}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Tailoring Resume...
                    </>
                  ) : tailorCount >= FREE_TAILORS_LIMIT ? (
                    'Upgrade to continue'
                  ) : (
                    'Tailor My Resume'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Tailored Resume
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
                  {tailoredResume}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by OpenAI - Make your resume stand out to employers and ATS systems
          </p>
        </div>
      </div>
    </div>
  )
}