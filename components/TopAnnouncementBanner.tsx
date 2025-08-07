'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  XMarkIcon,
  MegaphoneIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

export default function TopAnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed today
    const today = new Date().toDateString()
    const dismissedDate = localStorage.getItem('top-banner-dismissed')
    
    if (dismissedDate !== today) {
      setIsVisible(true)
    }
    setIsLoaded(true)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    const today = new Date().toDateString()
    localStorage.setItem('top-banner-dismissed', today)
  }

  // Don't render until client-side hydration is complete
  if (!isLoaded || !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-[#c1272d] to-red-600 text-white fixed top-0 left-0 right-0 z-[60] overflow-hidden"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="h-full w-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`
              }}
            />
          </div>

          <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            {/* Content */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Animated icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <MegaphoneIcon className="h-5 w-5 text-yellow-300" />
              </motion.div>

              {/* Text content */}
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="font-semibold">🎓 FREE Bootcamp Alert!</span>
                <span className="hidden sm:inline">AETech DevStarter - 3 weeks intensive tech training.</span>
                <div className="flex items-center space-x-1 text-yellow-200">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Reg. closes Aug 10</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/bootcamp">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
                >
                  Join Now
                </motion.button>
              </Link>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
