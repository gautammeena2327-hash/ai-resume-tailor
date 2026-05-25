'use client'

import { useState } from 'react'
import { Check, Send } from 'lucide-react'

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    localStorage.setItem('waitlist_email', email)
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
    }, 1000)
  }

  const plans = [
    { name: 'Free', price: '$0', period: 'forever', tailors: 3, features: ['3 resume tailors per month', 'ATS-optimized content', 'Basic templates', 'Download as text'] },
    { name: 'Pro', price: '$19', period: 'month', tailors: 150, features: ['150 resume tailors per month', 'All Free features', 'PDF export', 'All templates', 'Priority support'] },
    { name: 'Business', price: '$49', period: 'month', tailors: 750, features: ['750 resume tailors per month', 'All Pro features', 'Team sharing', 'Custom templates'] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Simple, transparent pricing. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.tailors} resume tailors/month</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Get notified when Pro plans launch
          </h3>
          {submitted ? (
            <div className="text-center text-green-600 dark:text-green-400">
              Thanks! We'll notify you when Pro plans are available.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? <Send className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}