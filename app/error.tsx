'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'
import Navigation from './components/Navigation'
import FloatingParticles from '@/components/FloatingParticles'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />
      
      {/* Error Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={15} className="text-orange-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-100/50 dark:from-orange-900/20 dark:to-red-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
                <ExclamationTriangleIcon className="w-12 h-12 text-orange-500" />
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Something went wrong!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                We encountered an unexpected error. Our technical team has been notified and 
                is working to resolve the issue.
              </p>
              
              {/* Error Details (for development) */}
              {process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left max-w-2xl mx-auto mb-6"
                >
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    Error Details (Development Mode):
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="text-6xl mb-6">⚠️</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "Even the best technology needs a moment to reboot"
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Try Again
              </motion.button>
              
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center border border-orange-500 text-orange-500 hover:bg-orange-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </motion.button>
              </Link>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Need immediate assistance?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  Contact Support
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/" 
                  className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  Homepage
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <a 
                  href="mailto:support@aetech.com" 
                  className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  Email Us
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
