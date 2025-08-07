'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-black dark:via-gray-900 dark:to-red-950">
      {/* Simple Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/website-assets/logo-white-500.png"
                alt="AETech Research Labs Limited"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                AETech Labs
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Home
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
              Last updated: August 7, 2025
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  By accessing and using the services provided by AETech Research Labs Limited ("AETech Labs", "we", "us", or "our"), 
                  you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the 
                  above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Company Information</h2>
                <div className="text-gray-700 dark:text-gray-300 mb-4">
                  <p><strong>Company Name:</strong> AETech Research Labs Limited</p>
                  <p><strong>Registration Number:</strong> RC 8627078</p>
                  <p><strong>Address:</strong> Suite 30, 2nd Floor Es-Em Plaza, No 34, Munguno Crescent, Behind Berger Yard, Utako Abuja, Nigeria</p>
                  <p><strong>Email:</strong> info@aetechlabs.com</p>
                  <p><strong>Phone:</strong> +234 704 440 0347</p>
                  <p><strong>Website:</strong> www.aetechlabs.com</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Services Description</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  AETech Labs provides technology solutions including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Software Development and Engineering</li>
                  <li>Artificial Intelligence and Machine Learning Solutions</li>
                  <li>Data Systems and Analytics</li>
                  <li>IT Consulting and Systems Integration</li>
                  <li>Research and Development Services</li>
                  <li>Training and Capacity Building</li>
                  <li>Technology Advisory Services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Use License</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Permission is granted to temporarily download one copy of the materials on AETech Labs' website for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Disclaimer</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The materials on AETech Labs' website are provided on an 'as is' basis. AETech Labs makes no warranties, 
                  expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                  implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                  of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Limitations</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  In no event shall AETech Research Labs Limited or its suppliers be liable for any damages (including, 
                  without limitation, damages for loss of data or profit, or due to business interruption) arising out of 
                  the use or inability to use the materials on AETech Labs' website, even if AETech Labs or an authorized 
                  representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Privacy Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the 
                  website, to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">8. Governing Law</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws of Nigeria and you 
                  irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">9. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  AETech Labs may revise these terms of service for its website at any time without notice. By using this 
                  website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">10. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> info@aetechlabs.com<br/>
                    <strong>Phone:</strong> +234 704 440 0347<br/>
                    <strong>Address:</strong> Suite 30, 2nd Floor Es-Em Plaza, No 34, Munguno Crescent, Behind Berger Yard, Utako Abuja, Nigeria
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
