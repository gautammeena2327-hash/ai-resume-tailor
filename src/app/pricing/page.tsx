'use client'

import { Check, Mail } from 'lucide-react'

export default function PricingPage() {
  const handleContact = (plan: string) => {
    const subject = encodeURIComponent(`Upgrade to ${plan} Plan`)
    const body = encodeURIComponent(`Hi! I want to upgrade to the ${plan} plan. Please send me payment details.\n\nName:\nEmail:\n`)
    window.location.href = `mailto:contact@airestailor.com?subject=${subject}&body=${body}`
  }

  const plans = [
    { name: 'Free', price: '$0', period: 'forever', tailors: 3, features: ['3 resume tailors per month', 'ATS-optimized content', 'Basic templates', 'Download as text'] },
    { name: 'Pro', price: '$19', period: 'month', tailors: 150, features: ['150 resume tailors per month', 'All Free features', 'PDF export', 'All templates', 'Priority support'] },
    { name: 'Business', price: '$49', period: 'month', tailors: 750, features: ['750 resume tailors per month', 'All Pro features', 'Team sharing', 'Custom templates', '24/7 support'] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 dark:text-gray-300">Payment via UPI, PayPal, or Bank Transfer. Manual activation.</p>
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
              {p.name !== 'Free' && (
                <button
                  onClick={() => handleContact(p.name)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact for Payment
                </button>
              )}
              {p.name === 'Free' && (
                <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium">
                  Current Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}