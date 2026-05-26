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

        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Resume Optimization</span>
              </div>
              
              <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                Tailor Your Resume For Every Job In Seconds
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                ATS-optimized resumes powered by AI — without fake experience.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg">
                  ✓ Land More Interviews
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium shadow-lg">
                  ✓ ATS Optimized
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full text-sm font-medium shadow-lg">
                  ✓ Never Fabricated
                </span>
              </div>
              
              <button
                onClick={openResumeTool}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Try Free - Tailor My Resume
              </button>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                No credit card required • AI-powered • Instant results
              </p>
            </div>

            <div className="relative">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">ATS Score Preview</h4>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">85</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Keyword Match</span>
                      <span className="text-green-600 font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">ATS Compatibility</span>
                      <span className="text-blue-600 font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Top Keywords Added:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs">Project Management</span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs">React.js</span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs">Agile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: '🔒', text: 'Secure Resume Upload', desc: 'Your data stays private' },
              { icon: '🎯', text: 'ATS Optimized', desc: 'Beat applicant tracking systems' },
              { icon: '✅', text: 'No Fake Experience', desc: 'Real, honest achievements only' },
              { icon: '📄', text: 'PDF Export', desc: 'Ready-to-send formats' },
              { icon: '🤝', text: 'Realistic Results', desc: 'Truthful, compelling content' },
              { icon: '🛡️', text: 'Privacy First', desc: 'End-to-end encrypted' }
            ].map((item, i) => (
              <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 shadow-lg hover:scale-105 transition-all">
                <span className="text-xl mt-1">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
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