'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-center">
            <span className="text-red-400">
              Privacy Policy
            </span>
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
              Last updated: August 7, 2025
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  AETech Research Labs Limited ("AETech Labs", "we", "us", or "our") respects your privacy and is 
                  committed to protecting your personal data. This privacy policy explains how we collect, use, 
                  and protect your information when you visit our website www.aetechlabs.com or use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Company Information</h2>
                <div className="text-gray-700 dark:text-gray-300 mb-4">
                  <p><strong>Data Controller:</strong> AETech Research Labs Limited</p>
                  <p><strong>Registration Number:</strong> RC 8627078</p>
                  <p><strong>Address:</strong> Suite 30, 2nd Floor Es-Em Plaza, No 34, Munguno Crescent, Behind Berger Yard, Utako Abuja, Nigeria</p>
                  <p><strong>Email:</strong> info@aetechlabs.com</p>
                  <p><strong>Phone:</strong> +234 704 440 0347</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Information We Collect</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may collect and process the following types of personal data:
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3.1 Information You Provide</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Contact information (name, email address, phone number)</li>
                  <li>Company or organization details</li>
                  <li>Project requirements and specifications</li>
                  <li>Messages and communications sent through our contact forms</li>
                  <li>Information provided during consultations or service delivery</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3.2 Information Automatically Collected</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Website usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To deliver our technology services and solutions</li>
                  <li>To communicate about projects, updates, and service-related matters</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our legitimate business interests</li>
                  <li>To send relevant information about our services (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Legal Basis for Processing</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We process your personal data based on:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Consent:</strong> When you provide explicit consent for specific processing activities</li>
                  <li><strong>Contract:</strong> When processing is necessary for the performance of a contract</li>
                  <li><strong>Legitimate Interest:</strong> When we have a legitimate business interest</li>
                  <li><strong>Legal Obligation:</strong> When required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may share your personal data with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Third-party service providers who assist in delivering our services</li>
                  <li>Professional advisors (lawyers, accountants, auditors)</li>
                  <li>Government authorities when required by law</li>
                  <li>Business partners (only with your explicit consent)</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal data, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Staff training on data protection practices</li>
                  <li>Secure backup and recovery procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">8. Data Retention</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, 
                  including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Contact inquiries: Up to 3 years after last contact</li>
                  <li>Client project data: Up to 7 years after project completion</li>
                  <li>Website analytics: Up to 2 years</li>
                  <li>Legal requirements: As required by applicable law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">9. Your Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Under applicable data protection laws, you have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Restriction:</strong> Limit the processing of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  To exercise any of these rights, please contact us at info@aetechlabs.com.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">10. Cookies and Tracking</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website uses cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Improve website functionality and user experience</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Remember your preferences and settings</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">11. Third-Party Links</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website may contain links to third-party websites. We are not responsible for the privacy 
                  practices of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">12. International Data Transfers</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may transfer your personal data to countries outside Nigeria for processing. When we do so, 
                  we ensure appropriate safeguards are in place to protect your data in accordance with applicable 
                  data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">13. Changes to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any significant changes 
                  by posting the new policy on our website and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">14. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>AETech Research Labs Limited</strong><br/>
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
