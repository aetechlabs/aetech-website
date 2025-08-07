'use client'

import { motion } from 'framer-motion'
import { 
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface UrgencyBannerProps {
  message?: string
  countdown?: string
  className?: string
}

export default function UrgencyBanner({ 
  message = "Limited spots available - Register now!",
  countdown = "Registration closes August 10, 2025 at 11:59 PM",
  className = ""
}: UrgencyBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white py-4 px-6 rounded-xl shadow-lg ${className}`}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* Pulsing icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <ClockIcon className="h-6 w-6" />
        </motion.div>

        {/* Content */}
        <div className="text-center">
          <div className="font-bold text-lg mb-1">{message}</div>
          <div className="text-sm opacity-90 flex items-center justify-center space-x-1">
            <SparklesIcon className="h-4 w-4" />
            <span>{countdown}</span>
            <SparklesIcon className="h-4 w-4" />
          </div>
        </div>

        {/* Animated sparkles */}
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
          <SparklesIcon className="h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  )
}
