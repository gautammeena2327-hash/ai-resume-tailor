'use client'

import { useState, useEffect } from 'react'
import { Copy, Download, Loader2, FileText, Briefcase, Crown, Moon, Sun, Sparkles, Link2, HelpCircle, BarChart3, Edit3, DollarSign, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

const FREE_TAILORS_LIMIT = 2

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
  const [showResumeTool, setShowResumeTool] = useState(false)
  
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

  useEffect(() => {
    if (showResumeTool) {
      const el = document.getElementById('resume-tool')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showResumeTool])

  const openResumeTool = () => {
    setShowResumeTool(true)
  }

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
            Tailor Your Resume For Every Job In Seconds
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            ATS-optimized resumes powered by AI — without fake experience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
              ✓ Land More Interviews
            </span>
            <span className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
              ✓ ATS Optimized
            </span>
            <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
              ✓ Never Fabricated
            </span>
          </div>
        </section>

        <section className="mb-16 text-center">
          <button
            onClick={openResumeTool}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Try Free - Tailor My Resume
          </button>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
            No credit card required • AI-powered • Instant results
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Choose Your Tool</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
{
                title: "Resume Tailor", 
                desc: "ATS-optimized resume tuning",
                icon: <Edit3 className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500",
                href: "#",
                badge: "2 free/month",
                action: openResumeTool
              },
              { 
                title: "Cover Letter Generator", 
                desc: "Personalized cover letters",
                icon: <FileText className="w-8 h-8" />,
                color: "from-indigo-500 to-purple-500",
                href: "/cover-letter",
                badge: "Free"
              },
              { 
                title: "LinkedIn Summary", 
                desc: "Professional About section",
                icon: <Link2 className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500",
                href: "/linkedin-summary",
                badge: "Pro feature"
              },
              { 
                title: "Salary Estimator", 
                desc: "US/UK salary predictions",
                icon: <DollarSign className="w-8 h-8" />,
                color: "from-green-500 to-emerald-500",
                href: "/salary-estimator",
                badge: "Pro feature"
              },
              { 
                title: "Interview Questions", 
                desc: "Predicted questions",
                icon: <HelpCircle className="w-8 h-8" />,
                color: "from-orange-500 to-red-500",
                href: "/interview-questions",
                badge: "Business feature"
              },
              { 
                title: "Resume Score", 
                desc: "Get your resume rated (0-100)",
                icon: <BarChart3 className="w-8 h-8" />,
                color: "from-amber-500 to-yellow-500",
                href: "/resume-score",
                badge: "Free"
              }
            ].map((tool, i) => (
              <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 hover:scale-105 transition-all">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center text-white`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">{tool.desc}</p>
                <span className="block text-center text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  {tool.badge}
                </span>
                {tool.action ? (
                  <button
                    onClick={tool.action}
                    className={`w-full py-2 bg-gradient-to-r ${tool.color} text-white rounded-xl font-medium hover:opacity-90 transition-all`}
                  >
                    Open Tool
                  </button>
                ) : (
                  <Link href={tool.href} className={`block w-full py-2 bg-gradient-to-r ${tool.color} text-white rounded-xl font-medium hover:opacity-90 transition-all text-center`}>
                    Open Tool
                  </Link>
                )}
</div>
            ))}
          </div>
        </section>

        <section className="mb-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
            <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-3xl font-bold text-white mb-4">Unlock All Features</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Go Pro for 150 resume tailors/month, LinkedIn Summary, Salary Estimator, and more!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/pricing" className="inline-block px-8 py-3 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-lg hover:scale-105 transition-all">
                Upgrade Now - Just $19/month
              </Link>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                2 free/month
              </span>
            </div>
          </div>
        </section>

        {!showResumeTool && (
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                🎉 Start Free - No credit card required
              </span>
            </div>
            <button
              onClick={openResumeTool}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto group"
            >
              <FileText className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform" />
              Create My Resume
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              AI-powered resume optimization in seconds
            </p>
          </div>
        )}

        {showResumeTool && (
          <div id="resume-tool" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
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
              <button
                onClick={() => setShowResumeTool(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ✕
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
                    <option value="minimal">Minimal</option>
                    <option value="technical">Technical</option>
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
        )}

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
            <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}