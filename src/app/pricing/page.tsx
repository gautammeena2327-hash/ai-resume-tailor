'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    tailors: 3,
    features: [
      '3 resume tailors per month',
      'ATS-optimized content',
      'Basic templates',
      'Download as text',
    ],
    productId: null,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'month',
    tailors: 150,
    features: [
      '150 resume tailors per month',
      'All Free features',
      'PDF export',
      'All templates',
      'Priority support',
      'Cancel anytime',
    ],
    productId: 'your-pro-product-id',
    variantId: 1078654,
    popular: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: 'month',
    tailors: 750,
    features: [
      '750 resume tailors per month',
      'All Pro features',
      'Team sharing',
      'Custom templates',
      'API access',
      '24/7 support',
    ],
    productId: 'your-business-product-id',
    variantId: 1078671,
  },
]

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (variantId: number | null) => {
    if (!variantId) return
    setIsLoading(variantId.toString())
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId }),
      })
      const { url } = await response.json()
      if (url) window.location.assign(url)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Simple, transparent pricing. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {plan.tailors} resume tailors/month
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.variantId ?? null)}
                disabled={!plan.variantId || isLoading === plan.variantId?.toString()}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading === plan.variantId?.toString() ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by Lemon Squeezy. Secure payments. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}