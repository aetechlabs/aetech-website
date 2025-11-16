'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowPathIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline'
import FloatingParticles from '@/components/FloatingParticles'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-20">
      {/* Loading Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={25} className="text-blue-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Loading Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowPathIcon className="w-12 h-12 text-blue-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Loading Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Loading...
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We're preparing something amazing for you. This won't take long!
              </p>
            </motion.div>

            {/* Animated Progress Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="flex justify-center space-x-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#3B82F6", "#8B5CF6", "#3B82F6"]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-3 h-3 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
              
              <div className="text-6xl mb-6">⚡</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "Great things take time, but not too much time"
              </p>
            </motion.div>

            {/* Loading Stats/Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <ClockIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Fast Loading</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized for speed and performance
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <HomeIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Modern Tech</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with cutting-edge technology
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <ArrowPathIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Great UX</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Designed for the best user experience
                </p>
              </div>
            </motion.div>

            {/* Fallback Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm">
                Taking longer than expected?
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Return to Homepage
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
