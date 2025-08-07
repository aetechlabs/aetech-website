'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  AcademicCapIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function FloatingBootcampButton() {
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
          delay: 5 // Show after 5 seconds
        }}
        className="fixed bottom-6 right-6 z-30"
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
        <Link href="/bootcamp">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(193, 39, 45, 0.7)",
                "0 0 0 10px rgba(193, 39, 45, 0)",
                "0 0 0 20px rgba(193, 39, 45, 0)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }
            }}
            className="bg-gradient-to-r from-[#c1272d] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-4 shadow-2xl cursor-pointer flex items-center space-x-3 transition-all duration-300"
          >
            {/* Icon with pulse animation */}
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, -10, 10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <AcademicCapIcon className="h-6 w-6" />
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
                  <span className="font-semibold text-sm">Join FREE Bootcamp!</span>
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
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3 border-2 border-white"
        />

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10, y: 10 }}
              className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg"
            >
              🚀 Register before Aug 10!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
