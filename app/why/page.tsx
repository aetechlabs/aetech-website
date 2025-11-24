'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  CodeBracketIcon,
  ChartBarIcon,
  HeartIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function WhyPage() {
  const reasons = [
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: 'Speed Without Compromise',
      description: 'Our pre-built component library saves up to 90% of development time compared to building from scratch, while maintaining high quality and customization. What takes others months, we deliver in weeks.',
      stats: 'Up to 90% faster delivery'
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: 'Transparent, Fair Pricing',
      description: 'No hidden costs, no surprises. Our pricing is competitive and transparent, with our efficiency meaning you pay for results, not wasted time. Fixed-price options available for well-defined projects.',
      stats: 'Value-driven pricing'
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Cross-Stack Expertise',
      description: 'We work across multiple technology stacks, choosing the best tools for your specific needs. Your project is built with modern, scalable technologies that are maintainable and future-proof.',
      stats: 'Tech-agnostic approach'
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: 'Direct Access to Experts',
      description: 'No account managers or middlemen - you work directly with experienced developers who understand your vision. We are a lean, senior team focused on quality over quantity.',
      stats: 'Senior-level expertise'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Quality Guaranteed',
      description: 'Every line of code is tested, every feature is documented. We include 30 days of warranty and offer ongoing maintenance. Security, performance, and reliability are built-in, not add-ons.',
      stats: '99.9% uptime guaranteed'
    },
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: 'Strategic Thinking',
      description: 'We do not just code what you ask - we provide strategic input based on experience. We will suggest improvements, identify potential issues, and help you make informed decisions.',
      stats: 'Proactive problem solving'
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: 'Clean, Maintainable Code',
      description: 'Our code is documented, structured, and follows best practices. If you want to hire others later or build an internal team, they will thank you. No technical debt or shortcuts.',
      stats: 'A+ code quality standards'
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Data-Driven Approach',
      description: 'We use analytics and research to guide decisions, not just opinions. Your project benefits from insights into user behavior, industry trends, and proven design patterns.',
      stats: 'Evidence-based decisions'
    },
    {
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: 'Launch Support Included',
      description: 'We do not disappear after deployment. Training, documentation, and launch support ensure your team can manage the system confidently. We are invested in your success.',
      stats: 'End-to-end partnership'
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: 'Educational Focus',
      description: 'As educators and trainers, we excel at explaining complex concepts simply. You will understand what we are building and why, empowering you to make informed decisions.',
      stats: 'Knowledge transfer included'
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Global Perspective',
      description: 'We build for international audiences with multi-language support, timezone consideration, and cultural awareness. Your solution works for local and global users.',
      stats: 'International standards'
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'We Actually Care',
      description: 'This is not just business - we are passionate about technology and helping businesses succeed. Your project success is our success, and we treat it as our own.',
      stats: '100% client satisfaction'
    }
  ];

  const comparisonPoints = [
    {
      category: 'Development Speed',
      us: 'Pre-built components, agile delivery',
      others: 'Build everything from scratch',
      advantage: '3-5x faster'
    },
    {
      category: 'Cost',
      us: 'Efficient delivery with time savings',
      others: 'Higher rates with longer timelines',
      advantage: 'Better value'
    },
    {
      category: 'Communication',
      us: 'Direct access to developers',
      others: 'Through account managers',
      advantage: 'Clearer, faster'
    },
    {
      category: 'Technology',
      us: 'Cross-stack, best tool for the job',
      others: 'Often limited to one stack',
      advantage: 'Flexible & optimal'
    },
    {
      category: 'Quality',
      us: 'Senior developers, code reviews',
      others: 'Mixed experience levels',
      advantage: 'Higher quality'
    },
    {
      category: 'Support',
      us: '30-day warranty + ongoing options',
      others: 'Extra cost or limited',
      advantage: 'Better coverage'
    }
  ];

  const testimonialHighlights = [
    {
      quote: 'Speed and quality I did not think were possible',
      author: 'Sarah M.',
      role: 'Startup Founder'
    },
    {
      quote: 'Finally, developers who understand business',
      author: 'James T.',
      role: 'CEO, Tech Company'
    },
    {
      quote: 'Best investment we made in our digital presence',
      author: 'Maria G.',
      role: 'Marketing Director'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] pt-20 lg:pt-32 pb-16 overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/a-computer-instructor-standing-while-students-code.jpg"
            alt="Team at work"
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
            Why Choose <span className="text-red-400">AETech?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          >
            Because your project deserves more than cookie-cutter solutions and broken promises.
          </motion.p>
        </div>
      </section>

      {/* Main Reasons Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              12 Compelling Reasons
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Not just promises - here's what actually makes us different
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all"
              >
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {reason.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {reason.description}
                </p>
                <div className="text-sm font-semibold text-red-500">
                  {reason.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              How We Stack Up
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              An honest comparison with typical development agencies
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-white">
              <div>Aspect</div>
              <div>AETech</div>
              <div>Others</div>
              <div>Advantage</div>
            </div>
            {comparisonPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {point.category}
                </div>
                <div className="text-green-600 dark:text-green-400">
                  {point.us}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {point.others}
                </div>
                <div className="text-red-500 font-semibold">
                  {point.advantage}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Highlights */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              What Clients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialHighlights.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl text-red-500 mb-4">"</div>
                <p className="text-lg text-gray-900 dark:text-white mb-6 italic">
                  {testimonial.quote}
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-red-500 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss your project and show you exactly why clients choose us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white text-red-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
              >
                Start Your Project
              </Link>
              <Link
                href="/pricing"
                className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition-all border-2 border-white"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
