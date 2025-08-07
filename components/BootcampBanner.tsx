'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  XMarkIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface BootcampBannerProps {
  delay?: number // Delay before showing banner (in milliseconds)
  autoShow?: boolean // Whether to show automatically
}

export default function BootcampBanner({ delay = 3000, autoShow = true }: BootcampBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if banner was already dismissed in this session
    const dismissed = sessionStorage.getItem('bootcamp-banner-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show banner after delay if autoShow is enabled
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay, autoShow])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('bootcamp-banner-dismissed', 'true')
  }

  const handleClose = () => {
    setIsVisible(false)
    // Don't mark as dismissed when just closing, allow it to show again
  }

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />
          
          {/* Banner */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              rotateX: -15 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              rotateX: 15 
            }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.6 
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg mx-4 px-4 max-h-[90vh] overflow-y-auto"
          >
            <div 
              className="relative bg-gradient-to-br from-[#c1272d] via-red-600 to-red-700 rounded-2xl shadow-2xl overflow-hidden min-h-fit"
              style={{ 
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto'
              }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
                />
                <motion.div
                  animate={{ 
                    rotate: [360, 0],
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-400/20 rounded-full"
                />
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>

              {/* Content */}
              <div className="relative p-6 sm:p-8 text-white text-center">
                {/* Pulsing icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="inline-block p-4 bg-white/20 rounded-full mb-6"
                >
                  <AcademicCapIcon className="h-12 w-12" />
                </motion.div>

                {/* Animated title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-bold mb-3"
                >
                  🚀 AETech DevStarter Bootcamp
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-red-100 mb-6 leading-relaxed text-sm sm:text-base"
                >
                  Join our <span className="font-semibold text-yellow-300">FREE 3-week</span> intensive tech bootcamp! 
                  Learn Data Science, AI, Web Development & more.
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center space-x-3 sm:space-x-6 mb-6 sm:mb-8 text-xs sm:text-sm flex-wrap gap-y-2"
                >
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 mr-1" />
                    <span>3 Weeks</span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    <span>100% FREE</span>
                  </div>
                  <div className="flex items-center">
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    <span>5 Skills</span>
                  </div>
                </motion.div>

                {/* Urgency indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-yellow-400 text-gray-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 inline-block"
                >
                  ⏰ Registration closes August 10, 2025
                </motion.div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link href="/bootcamp">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-300 shadow-lg"
                        onClick={handleDismiss}
                      >
                        🎓 Enroll Now - FREE!
                      </motion.button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link href="/bootcamp">
                      <button
                        className="w-full text-white border-2 border-white/30 hover:border-white/50 py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 text-sm sm:text-base"
                        onClick={handleDismiss}
                      >
                        Learn More
                      </button>
                    </Link>
                  </motion.div>
                </div>

                {/* Small disclaimer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-red-200 mt-4"
                >
                  Limited spots available • First come, first served
                </motion.p>
              </div>

              {/* Animated sparkles */}
              <div className="absolute top-4 left-4">
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: 0.5 
                  }}
                >
                  <SparklesIcon className="h-4 w-4 text-yellow-400" />
                </motion.div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: 1 
                  }}
                >
                  <SparklesIcon className="h-4 w-4 text-yellow-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
