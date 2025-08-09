'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function FloatingSponsorButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 300,
          delay: 8 // Show after 8 seconds (after bootcamp button)
        }}
        className="fixed bottom-6 left-6 z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors z-50"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>

        {/* Main button */}
        <Link href="/contact">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.7)",
                "0 0 0 10px rgba(34, 197, 94, 0)",
                "0 0 0 20px rgba(34, 197, 94, 0)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut"
              }
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl cursor-pointer flex items-center space-x-3 transition-all duration-300"
          >
            {/* Icon with pulse animation */}
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
              }}
              transition={{ 
                duration: isHovered ? 0.6 : 2,
                repeat: isHovered ? 3 : Infinity,
                ease: "easeInOut"
              }}
            >
              <HeartIcon className="h-6 w-6" />
            </motion.div>

            {/* Text that slides in on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="font-semibold text-sm">Sponsor Us!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Floating notification dot */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3 border-2 border-white"
        />

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -10, y: 10 }}
              className="absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg"
            >
              💚 Support Research & Education
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional message bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
            y: [0, -10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut"
          }}
          className="absolute -top-16 left-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-600 whitespace-nowrap"
        >
          🌱 Help us grow AgriTech
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
