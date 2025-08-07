'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  ArrowPathIcon,
  HomeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation'
import FloatingParticles from '@/components/FloatingParticles'

export default function MaintenancePage() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const maintenanceTasks = [
    { task: "Database optimization", status: "completed" },
    { task: "Security updates", status: "completed" },
    { task: "Performance improvements", status: "in-progress" },
    { task: "Feature deployment", status: "pending" },
    { task: "System testing", status: "pending" }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />
      
      {/* Maintenance Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={25} className="text-yellow-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-100/50 dark:from-yellow-900/20 dark:to-orange-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Maintenance Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <WrenchScrewdriverIcon className="w-12 h-12 text-yellow-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Maintenance Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Scheduled Maintenance
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                We're currently performing scheduled maintenance to improve your experience. 
                Our services will be back online shortly with enhanced performance and new features!
              </p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="inline-flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-6 py-3 rounded-full mb-6">
                <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                  Estimated completion time
                </span>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {timeRemaining.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {timeRemaining.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {timeRemaining.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seconds</div>
                </div>
              </div>
              
              <div className="text-6xl mb-6">🔧</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "Making things better, one upgrade at a time"
              </p>
            </motion.div>

            {/* Maintenance Progress */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
                Maintenance Progress
              </h3>
              <div className="max-w-2xl mx-auto space-y-3">
                {maintenanceTasks.map((item, index) => (
                  <motion.div
                    key={item.task}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{item.task}</span>
                    <div className="flex items-center">
                      {item.status === 'completed' && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircleIcon className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                      {item.status === 'in-progress' && (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 mr-1"
                          >
                            <ArrowPathIcon className="w-5 h-5" />
                          </motion.div>
                          <span className="text-sm font-medium">In Progress</span>
                        </div>
                      )}
                      {item.status === 'pending' && (
                        <div className="flex items-center text-gray-500 dark:text-gray-500">
                          <ClockIcon className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh Status
              </motion.button>
              
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </motion.button>
              </Link>
            </motion.div>

            {/* What's New */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faster loading times and improved responsiveness
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-2xl mb-3">🔒</div>
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enhanced security measures and data protection
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-2xl mb-3">✨</div>
                <h4 className="font-semibold mb-2">Features</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New features and improved user experience
                </p>
              </div>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm">
                Need assistance during maintenance?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a 
                  href="mailto:support@aetech.com" 
                  className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
                >
                  Email Support
                </a>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <a 
                  href="/contact" 
                  className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
                >
                  Contact Form
                </a>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-gray-500 dark:text-gray-500">
                  Follow @aetech for updates
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
