import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Information We Collect</h2>
            <p>We collect information you provide directly to us when using our AI Resume Tailor service. This may include your resume content and job descriptions.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How We Use Your Information</h2>
            <p>We use your information solely to provide and improve our resume tailoring services. Your data is processed through OpenAI's API for resume optimization.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. Your resume data is not stored permanently on our servers.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Third-Party Services</h2>
            <p>We use OpenAI for resume processing and LemonSqueezy for payments. These services have their own privacy policies.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contact Us</h2>
            <p>Questions about this Privacy Policy? Contact us at privacy@ai-resume-tailor.com</p>
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