'use client'

import { useState } from 'react'
import { Check, Send, CreditCard } from 'lucide-react'

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setIsLoading(plan)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await response.json()
      
      if (data.error) {
        alert(`Payment setup pending. ${data.error}`)
      } else {
        // Load Razorpay checkout
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        script.onload = () => {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'AI Resume Tailor',
            description: data.name,
            order_id: data.orderId,
            handler: (response: any) => {
              alert('Payment successful! Order ID: ' + response.razorpay_order_id)
            },
            theme: { color: '#3b82f6' }
          }
          // @ts-ignore
          const rzp = new window.Razorpay(options)
          rzp.open()
        }
      }
    } catch {
      alert('Something went wrong. Please try the waitlist below.')
    } finally {
      setIsLoading(null)
    }
  }

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
    { name: 'Free', price: '$0', period: 'forever', tailors: 3, features: ['3 resume tailors per month', 'ATS-optimized content', 'Basic templates', 'Download as text'], plan: null },
    { name: 'Pro', price: '₹1900', period: 'month', tailors: 150, features: ['150 resume tailors per month', 'All Free features', 'PDF export', 'All templates', 'Priority support'], plan: 'pro' },
    { name: 'Business', price: '₹4900', period: 'month', tailors: 750, features: ['750 resume tailors per month', 'All Pro features', 'Team sharing', 'Custom templates'], plan: 'business' }
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
          {plans.map(p => (
            <div key={p.name} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{p.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{p.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/{p.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.tailors} resume tailors/month</p>
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => p.plan && handleSubscribe(p.plan)}
                disabled={!p.plan || isLoading === p.plan}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? <CreditCard className="w-5 h-5 mr-2 animate-spin" /> : <CreditCard className="w-5 h-5 mr-2" />}
                {p.plan ? 'Get Started' : 'Free'}
              </button>
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