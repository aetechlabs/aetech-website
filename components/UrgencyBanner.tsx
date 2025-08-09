'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface UrgencyBannerProps {
  message?: string
  countdown?: string
  className?: string
  deadlineDate?: string // New prop for deadline
}

export default function UrgencyBanner({ 
  message,
  countdown = "Registration closes August 10, 2025 at 11:59 PM",
  className = "",
  deadlineDate = "2025-08-10T23:59:59"
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  })
  const [dynamicMessage, setDynamicMessage] = useState<string>("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const deadline = new Date(deadlineDate)
      const timeDiff = deadline.getTime() - now.getTime()
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 3600 * 24))
        const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600))
        const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60))
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds, total: timeDiff })
        
        // Update message based on time left
        if (days > 1) {
          setDynamicMessage(`⚡ Only ${days} days left to register!`)
        } else if (days === 1) {
          setDynamicMessage("⚡ Last day to register!")
        } else if (days === 0 && hours > 0) {
          setDynamicMessage("⚡ Registration closes today!")
        } else {
          setDynamicMessage("⚡ Last chance to register!")
        }
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
        setDynamicMessage("Registration has closed")
      }
    }

    calculateTimeLeft()
    // Update every second for accurate countdown
    const interval = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(interval)
  }, [deadlineDate])

  // Use provided message or dynamic message
  const displayMessage = message || dynamicMessage
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white py-4 px-6 rounded-xl shadow-lg ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        {/* Header with icon and message */}
        <div className="flex items-center space-x-4">
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

          <div className="font-bold text-lg">{displayMessage}</div>

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

        {/* Countdown Timer */}
        {timeLeft.total > 0 && (
          <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs uppercase tracking-wide">Days</div>
            </div>
            <div className="text-xl font-bold">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-xl font-bold">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide">Minutes</div>
            </div>
            <div className="text-xl font-bold">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide">Seconds</div>
            </div>
          </div>
        )}

        {/* Subtitle */}
        <div className="text-sm opacity-90 flex items-center space-x-1">
          <SparklesIcon className="h-4 w-4" />
          <span>{countdown}</span>
          <SparklesIcon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  )
}
