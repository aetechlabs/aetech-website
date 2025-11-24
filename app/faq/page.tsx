'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { 
  QuestionMarkCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
    { id: 'pricing', name: 'Pricing & Payment', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { id: 'process', name: 'Process & Timeline', icon: <ClockIcon className="w-5 h-5" /> },
    { id: 'technical', name: 'Technical', icon: <CodeBracketIcon className="w-5 h-5" /> },
    { id: 'support', name: 'Support', icon: <ShieldCheckIcon className="w-5 h-5" /> },
  ];

  const faqs: FAQItem[] = [
    {
      category: 'pricing',
      question: 'How much does a typical project cost?',
      answer: 'Project costs vary based on scope and complexity, typically ranging from ₦200,000 for simple projects to ₦10,000,000+ for complex enterprise applications. A simple website might cost ₦200,000-₦800,000, while a full web application with custom features could be ₦2,000,000-₦10,000,000+. We provide detailed estimates after understanding your requirements and use our pre-built component library to save significant development time and reduce costs.'
    },
    {
      category: 'pricing',
      question: 'Do you offer fixed-price projects?',
      answer: 'Yes! After an initial consultation and requirements gathering, we can provide a fixed-price quote for well-defined projects. This gives you budget certainty while we maintain the flexibility to deliver the best solution. For ongoing work or evolving requirements, hourly billing works better.'
    },
    {
      category: 'pricing',
      question: 'What payment terms do you accept?',
      answer: 'We typically work with milestone-based payments: 30% upfront to begin work, 40% at midpoint review, and 30% upon completion. For larger projects, we can arrange monthly billing. We accept bank transfers, credit cards, and can accommodate international payments.'
    },
    {
      category: 'pricing',
      question: 'Are there any hidden costs?',
      answer: 'No hidden costs! Our hourly rate covers development, testing, and deployment. Additional costs would only include third-party services you choose (hosting, domains, APIs, etc.), and we always discuss these with you upfront. We provide transparent weekly reports showing hours worked and progress made.'
    },
    {
      category: 'process',
      question: 'How long does a typical project take?',
      answer: 'Timeline varies by complexity. A landing page might take 1-2 weeks, a business website 3-6 weeks, and a full application 2-6 months. We provide realistic timelines during our initial consultation and keep you updated weekly. Our component library significantly reduces development time compared to building from scratch.'
    },
    {
      category: 'process',
      question: 'What is your development process?',
      answer: 'We follow an agile approach: 1) Discovery & Planning - understand your needs, 2) Design & Prototyping - create wireframes and mockups, 3) Development - build in iterative sprints, 4) Testing & Review - ensure quality, 5) Deployment & Training - launch and support. You\'re involved at every stage with regular check-ins and demos.'
    },
    {
      category: 'process',
      question: 'Can I see progress during development?',
      answer: 'Absolutely! We use staging environments where you can see your project taking shape in real-time. Weekly demos show completed features, and we provide access to our project management tools. Your feedback is incorporated continuously, not just at the end.'
    },
    {
      category: 'process',
      question: 'What happens if I need changes during development?',
      answer: 'Changes are normal and expected! Minor tweaks are included in the quoted hours. For significant scope changes, we discuss the impact on timeline and cost, then adjust the plan with your approval. Our flexible hourly model makes adapting to new requirements straightforward.'
    },
    {
      category: 'technical',
      question: 'What technologies do you use?',
      answer: 'We work across multiple technology stacks and frameworks, choosing the best tools for your specific needs. Whether it is web applications, mobile apps, or backend systems, we select modern, scalable technologies that prioritize performance, maintainability, and your project requirements. We are tech-agnostic and solution-focused.'
    },
    {
      category: 'technical',
      question: 'Will my website be mobile-friendly?',
      answer: 'Yes, 100%! All our projects are built mobile-first and responsive across all devices. We test on various screen sizes, browsers, and devices to ensure a seamless experience. Mobile optimization is included in every project, not an add-on.'
    },
    {
      category: 'technical',
      question: 'Do you provide hosting and domain services?',
      answer: 'We guide you through selecting and setting up hosting and domains, recommending providers based on your needs and budget. While we do not resell hosting, we handle all technical setup and can manage hosting on your behalf. We work with various hosting providers to find the best fit for your project.'
    },
    {
      category: 'technical',
      question: 'Will I own the code and design?',
      answer: 'Yes! Upon final payment, you receive full ownership of all code, designs, and assets. We provide complete source code, documentation, and deployment instructions. You\'re free to modify, extend, or hire others to work on it. We can also provide training for your team.'
    },
    {
      category: 'technical',
      question: 'Is the website secure?',
      answer: 'Security is built-in, not bolted-on. We implement SSL certificates, secure authentication, input validation, SQL injection prevention, XSS protection, and follow OWASP security guidelines. Regular security updates and monitoring can be included in maintenance packages.'
    },
    {
      category: 'technical',
      question: 'Can you integrate with existing systems?',
      answer: 'Yes! We have extensive experience integrating with CRMs, payment gateways, email services, APIs, and custom systems. Whether it\'s Salesforce, Stripe, SendGrid, or your proprietary software, we can build secure connections to streamline your workflows.'
    },
    {
      category: 'support',
      question: 'Do you provide support after launch?',
      answer: 'Yes! We offer three options: 1) Warranty Period - 30 days free bug fixes after launch, 2) Maintenance Packages - monthly retainer for updates and support, 3) Pay-as-you-go - support when needed. Most clients choose a maintenance package for peace of mind.'
    },
    {
      category: 'support',
      question: 'What if something breaks after launch?',
      answer: 'During the 30-day warranty, we fix any bugs at no cost. After that, support depends on your chosen plan. We respond quickly to issues - critical bugs within hours, minor issues within 1-2 business days. Emergency support is available for maintained sites.'
    },
    {
      category: 'support',
      question: 'Can you train my team to use the system?',
      answer: 'Absolutely! We provide comprehensive training sessions, video tutorials, and documentation. Training can be in-person or remote, for technical or non-technical users. We ensure your team feels confident managing content, using features, and performing basic troubleshooting.'
    },
    {
      category: 'support',
      question: 'How do I request updates or new features later?',
      answer: 'Simply contact us! We maintain relationships with our clients long-term. For small changes, we often handle them quickly under maintenance agreements. For new features, we provide estimates and can schedule work based on your timeline and budget.'
    },
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <QuestionMarkCircleIcon className="w-20 h-20 mx-auto text-red-500 mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              Frequently Asked <span className="text-red-500">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about working with AETech. Can't find your answer? 
              <Link href="/contact" className="text-red-500 hover:text-red-600 ml-1">
                Contact us
              </Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-red-500 rounded-2xl p-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-white mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We're here to help! Schedule a free consultation to discuss your project.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-red-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
