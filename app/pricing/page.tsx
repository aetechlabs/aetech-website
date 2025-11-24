'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, ClockIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, DocumentCheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PricingPage() {
  const features = [
    {
      icon: <DocumentCheckIcon className="w-6 h-6" />,
      title: 'Internationalisation Ready',
      description: 'Both UI and server parts ready to be translated based on 2 text files.'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: 'Email & SMS Notifications',
      description: 'Ready-to-use notification system with customizable templates.'
    },
    {
      icon: <CheckIcon className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Google Analytics integration and Facebook pixel tracking.'
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'OAuth Integration',
      description: 'Login with Facebook, Google, LinkedIn, and other providers.'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: 'Support Chat',
      description: 'Tawk.io integration for real-time customer support.'
    },
    {
      icon: <DocumentCheckIcon className="w-6 h-6" />,
      title: 'Newsletter Integration',
      description: 'Mailchimp integration for email campaigns and list management.'
    }
  ];

  const afterProjectOptions = [
    {
      title: 'Continue Development',
      description: 'Extend our initial contract and continue cooperation with new features, improvements, and enhancements.',
      icon: <ClockIcon className="w-8 h-8" />
    },
    {
      title: 'Retainer Contract',
      description: 'Stabilize costs and ensure ongoing support with a dedicated team. Monthly retainers provide priority access and consistent maintenance.',
      icon: <CurrencyDollarIcon className="w-8 h-8" />
    },
    {
      title: 'Support & Maintenance',
      description: 'Monitor and maintain your app with our specialized support packages.',
      icon: <ShieldCheckIcon className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] pt-20 lg:pt-32 pb-16 overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/a-computer-instructor-standing-while-students-code.jpg"
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
          >
            <span className="text-red-400">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          >
            Transparent, value-driven pricing for your project.
          </motion.p>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Pricing Approach
            </h2>
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                At AETech, we understand that every project is unique, with its own set of requirements, complexities, and challenges. We are committed to providing a pricing structure that is both fair and transparent.
              </p>
              <p>
                Our pricing is based on the scope and complexity of your project. We provide detailed estimates after understanding your requirements, and work efficiently to deliver maximum value. Our pre-built component library allows us to deliver faster without compromising quality.
              </p>
              
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 mt-8 border border-red-100 dark:border-red-900/30">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Why Custom Quotes?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Tailored Estimates:</strong>
                      <span className="text-gray-700 dark:text-gray-300"> Each project has different demands and complexities. By understanding your specific needs first, we can offer an accurate and fair estimate that reflects the value you'll receive.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Project-Specific:</strong>
                      <span className="text-gray-700 dark:text-gray-300"> Our pricing varies based on project complexity, required features, timeline, and technology requirements. We provide accurate estimates after understanding your specific needs.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Consulting:</strong>
                      <span className="text-gray-700 dark:text-gray-300"> Before any agreement, we prefer a detailed discussion about your project requirements to provide a comprehensive proposal with accurate cost estimation.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Payment Details
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300">
              <p className="text-lg">
                We don't charge any fees before the contract is signed. All the consultations, calls, estimations and sometimes research is <strong className="text-red-500">free for you</strong>.
              </p>
              <p>
                Before creating the contract, we estimate the total project cost based on scope and requirements. This can change based on changes to the scope, feedback provided or technological challenges, but you will be informed upfront.
              </p>
              <p>
                On the contract, we clearly outline the project scope, timeline, deliverables, and payment terms.
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment terms are flexible - we can work with <span className="text-red-500">milestone-based payments</span>, monthly retainers, or custom arrangements that suit your project.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Common Components Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Common Components, Ready to Use
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We have built an internal components library that saves significant time and reduces costs. These battle-tested components speed up delivery while maintaining high quality and customization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all"
              >
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* After Project Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              What's After the Project is Done?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {afterProjectOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white mb-6">
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {option.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-red-500 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss your requirements and provide you with a transparent, tailored estimate.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-red-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Get Your Free Consultation
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
