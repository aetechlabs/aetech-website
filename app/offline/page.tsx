'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  WifiIcon, 
  ArrowPathIcon, 
  HomeIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation'
import FloatingParticles from '@/components/FloatingParticles'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Check initial status
    setIsOnline(navigator.onLine)

    // Listen for network changes
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />
      
      {/* Offline Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={20} className="text-gray-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-100/50 dark:from-gray-900/50 dark:to-blue-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Connection Status Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                isOnline 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-800/50'
              }`}>
                {isOnline ? (
                  <WifiIcon className="w-12 h-12 text-green-500" />
                ) : (
                  <div className="relative">
                    <WifiIcon className="w-12 h-12 text-gray-400" />
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Status Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {isOnline 
                  ? 'Great! Your internet connection is back. You can now browse all features.'
                  : 'It looks like you\'re not connected to the internet. Please check your connection and try again.'
                }
              </p>
            </motion.div>

            {/* Connection Status Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                isOnline 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                {isOnline ? 'Online' : 'Offline'}
              </div>
              
              <div className="text-6xl mb-6">
                {isOnline ? '🌐' : '📡'}
              </div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                {isOnline 
                  ? '"Welcome back to the digital world!"'
                  : '"Sometimes we all need a digital detox"'
                }
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
                onClick={handleRetry}
                disabled={!isOnline}
                className={`inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isOnline 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                {isOnline ? 'Reload Page' : 'Check Connection'}
              </motion.button>
              
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center border border-gray-500 text-gray-500 hover:bg-gray-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </motion.button>
              </Link>
            </motion.div>

            {/* Offline Features */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  What you can do while offline:
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📖</div>
                    <h4 className="font-medium mb-1">Read Cached Content</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Previously loaded pages may still be available
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">💾</div>
                    <h4 className="font-medium mb-1">Draft Content</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your form data will be saved locally
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🔄</div>
                    <h4 className="font-medium mb-1">Auto-Sync</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      We'll sync when you're back online
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Troubleshooting Tips */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-8 text-sm text-gray-500 dark:text-gray-500"
              >
                <p className="mb-2">💡 Troubleshooting Tips:</p>
                <ul className="text-left max-w-md mx-auto space-y-1">
                  <li>• Check your WiFi or mobile data connection</li>
                  <li>• Try turning airplane mode on and off</li>
                  <li>• Restart your browser or device</li>
                  <li>• Contact your internet service provider</li>
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
