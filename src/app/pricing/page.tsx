'use client'

import { useState } from 'react'
import { Check, CreditCard } from 'lucide-react'

export default function PricingPage() {
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
        alert('Payment setup in progress. Please try again later.')
      } else {
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
            handler: () => {
              alert('Payment successful!')
            },
            theme: { color: '#3b82f6' }
          }
          // @ts-ignore
          const rzp = new window.Razorpay(options)
          rzp.open()
        }
      }
    } catch {
      alert('Something went wrong.')
    } finally {
      setIsLoading(null)
    }
  }

  const plans = [
    { name: 'Free', price: '₹0', period: 'forever', tailors: 3, features: ['3 resume tailors per month', 'ATS-optimized content', 'Basic templates'], plan: null },
    { name: 'Pro', price: '₹1500', period: 'month', tailors: 150, features: ['150 resume tailors per month', 'All Free features', 'PDF export', 'Priority support'], plan: 'pro' },
    { name: 'Business', price: '₹4000', period: 'month', tailors: 750, features: ['750 resume tailors per month', 'All Pro features', 'Team sharing'], plan: 'business' }
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
      </div>
    </div>
  )
}