'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import FloatingParticles from '@/components/FloatingParticles'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-20">
      {/* 404 Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={20} className="text-red-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-gray-100/50 dark:from-red-900/20 dark:to-gray-900/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-8xl md:text-9xl font-bold text-red-500 dark:text-red-400 leading-none">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The page you're looking for seems to have vanished into the digital void. 
                Don't worry, our tech team is probably working on something amazing!
              </p>
            </motion.div>

            {/* Illustration/Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="text-6xl mb-6">🔍</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "Sometimes you have to get lost to find something better"
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="inline-flex items-center border border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Go Back
              </motion.button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                You might be interested in:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/bootcamp" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  DevStarter Bootcamp
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/blog" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  Our Blog
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/about" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  About Us
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/contact" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
