'use client'

import { useState, useEffect } from 'react'
import { Copy, Download, Loader2, FileText, Briefcase, Crown, Moon, Sun, Sparkles } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

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
  const [isFallback, setIsFallback] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
        return true
      }
    }
    return false
  })
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }, [isDark])

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
      setIsFallback(data.isFallback || false)
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

  const downloadAsPDF = () => {
    const doc = new jsPDF()
    const lines = doc.splitTextToSize(tailoredResume, 180)
    doc.text(lines, 10, 10)
    doc.save('tailored-resume.pdf')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
          <div className="absolute top-40 left-40 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-150"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-6xl relative">
          <header className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                AI Resume Tailor
              </h1>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </header>

          <section className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Resume Optimization</span>
            </div>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
              Get Your Dream Job Faster
            </h2>
            
<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
               Our AI analyzes job descriptions and rewrites your resume to pass Applicant Tracking Systems (ATS) and catch recruiters&apos; attention.
             </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
                ✓ ATS Optimized
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
                ✓ Keyword Enhanced
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
                ✓ Action Verbs
              </span>
            </div>
            
            <div className="flex justify-center items-center gap-6 text-sm">
              <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow">
                <span className="text-gray-500 dark:text-gray-400">{tailorCount}/{FREE_TAILORS_LIMIT} free tailors used</span>
              </div>
              <Link href="/cover-letter" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 transition-colors">
                <FileText className="w-4 h-4" />
                Cover Letter Generator
              </Link>
              <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                <Crown className="w-4 h-4" />
                Upgrade for more
              </Link>
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Professional Templates
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Choose from our professionally designed templates to make your resume stand out
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Professional", icon: "💼", desc: "Clean & corporate style", color: "from-blue-500 to-cyan-500" },
                { name: "Modern", icon: "✨", desc: "Contemporary design", color: "from-purple-500 to-violet-500" },
                { name: "Executive", icon: "👔", desc: "Senior-level focus", color: "from-gray-700 to-gray-900" },
                { name: "Creative", icon: "🎨", desc: "Design-oriented", color: "from-pink-500 to-rose-500" },
                { name: "Technical", icon: "💻", desc: "Tech-focused", color: "from-indigo-500 to-blue-500" },
                { name: "Academic", icon: "🎓", desc: "Education/CV", color: "from-emerald-500 to-teal-500" },
                { name: "Minimal", icon: "📄", desc: "Simple & clean", color: "from-slate-500 to-gray-500" },
                { name: "Infographic", icon: "📊", desc: "Visual layout", color: "from-amber-500 to-orange-500" }
              ].map((t, i) => (
                <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center cursor-pointer">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${t.color} rounded-2xl flex items-center justify-center text-2xl`}>
                    {t.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
            <div className="flex border-b dark:border-gray-700">
              <button
                onClick={() => setActiveTab('input')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'input'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <FileText className="inline w-5 h-5 mr-2" />
                Input
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'output'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
                }`}
                disabled={!tailoredResume}
              >
                <Briefcase className="inline w-5 h-5 mr-2" />
                Tailored Resume
              </button>
            </div>

            {activeTab === 'input' && (
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template Style
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
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
                      className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none transition-all"
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
                      className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!resume || !jobDescription || isLoading || tailorCount >= FREE_TAILORS_LIMIT}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Tailoring Resume...
                      </>
                    ) : tailorCount >= FREE_TAILORS_LIMIT ? (
                      'Upgrade to continue'
                    ) : (
                      '✨ Tailor My Resume'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              <div className="p-8">
                {isFallback && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-300 rounded-xl text-sm">
                    Note: OpenAI API unavailable. Showing template resume.
                  </div>
                )}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Your Tailored Resume
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center transition-all"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                    <button
                      onClick={downloadAsPDF}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </button>
                    <button
                      onClick={downloadAsText}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      TXT
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">{tailoredResume}</pre>
                </div>
              </div>
            )}
          </div>

          <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Get the Mobile App
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Coming soon! Tailor your resume on the go with our mobile app for iOS and Android.
            </p>
            <div className="flex justify-center gap-6">
              <div className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg opacity-60 cursor-not-allowed">
                <span className="text-gray-500 dark:text-gray-400 font-medium">App Store - Coming Soon</span>
              </div>
              <div className="px-8 py-4 bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-600 rounded-2xl shadow-lg opacity-60 cursor-not-allowed">
                <span className="text-green-600 dark:text-green-300 font-medium">Google Play - Coming Soon</span>
              </div>
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-12">
              What Our Users Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Johnson", role: "Software Engineer", text: "Got 3 interview calls within a week! The tailored resume highlighted exactly what employers wanted." },
                { name: "Michael Chen", role: "Product Manager", text: "Amazing tool! Saved me hours of editing. The ATS optimization really works." },
                { name: "Priya Sharma", role: "Marketing Lead", text: "Perfect for career changers. Helped me reframe my experience for new roles." }
              ].map((t, i) => (
                <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/20 dark:border-gray-700/50">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "Is it free?", a: "Yes! Get 3 free resume tailors per month. Upgrade for more." },
                { q: "How does ATS optimization work?", a: "We analyze job descriptions and incorporate relevant keywords from the posting." },
                { q: "Can I cancel anytime?", a: "Absolutely. No questions asked." }
              ].map((faq, i) => (
                <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <p className="font-semibold text-gray-900 dark:text-white">{faq.q}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{faq.a}</p>
                </div>
))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-8">
              Our Customers Have Been Hired By
            </h2>
             <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
               {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'IBM', 'Accenture', 'Deloitte', 'Goldman Sachs', 'JP Morgan'].map((company) => (
                 <div key={company} className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                   {company}
                 </div>
               ))}
             </div>
           </section>

<div className="mt-16 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Powered by OpenAI - Make your resume stand out to employers and ATS systems
              </p>
            </div>

            <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  Terms of Service
                </Link>
                <a href="mailto:support@ai-resume-tailor.com" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  Contact
                </a>
              </div>
            </footer>
         </div>
      </div>
    )
}