'use client'

import { motion } from 'framer-motion'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: string
}

export default function GradientText({ 
  children, 
  className = '', 
  gradient = 'from-red-500 via-red-600 to-red-700'
}: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.span>
  )
}
