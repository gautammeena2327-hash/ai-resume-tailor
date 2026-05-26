import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Use of Service</h2>
            <p>By using AI Resume Tailor, you agree to use our service for legitimate purposes only. Do not submit false information or attempt to abuse our system.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Subscription and Payments</h2>
            <p>Pro and Business plans are billed monthly through LemonSqueezy. You can cancel anytime from your account settings.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Disclaimer</h2>
            <p>We provide resume optimization services but do not guarantee employment outcomes. Results may vary based on your input and job market conditions.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Limitation of Liability</h2>
            <p>AI Resume Tailor shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
          </section>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}