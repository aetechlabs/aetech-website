'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  RocketLaunchIcon,
  EnvelopeIcon,
  BellIcon,
  SparklesIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation'
import FloatingParticles from '@/components/FloatingParticles'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Launch date countdown (example: 30 days from now)
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30)
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = launchDate.getTime() - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      if (distance < 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSubscribed(true)
    setLoading(false)
    setEmail('')
  }

  const features = [
    { 
      icon: "🚀", 
      title: "Advanced Features", 
      description: "Cutting-edge functionality designed for the future" 
    },
    { 
      icon: "⚡", 
      title: "Lightning Fast", 
      description: "Optimized performance with modern technology stack" 
    },
    { 
      icon: "🎨", 
      title: "Beautiful Design", 
      description: "Intuitive and elegant user interface experience" 
    },
    { 
      icon: "🔒", 
      title: "Secure & Private", 
      description: "Enterprise-grade security and privacy protection" 
    },
    { 
      icon: "🌐", 
      title: "Global Ready", 
      description: "Built for users worldwide with multi-language support" 
    },
    { 
      icon: "🔧", 
      title: "Easy Integration", 
      description: "Seamless integration with your existing workflow" 
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />
      
      {/* Coming Soon Page Content */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <FloatingParticles count={30} className="text-purple-500/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Launch Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <RocketLaunchIcon className="w-12 h-12 text-purple-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Something <span className="text-purple-500">Amazing</span> is Coming
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                We're working on something extraordinary that will revolutionize your experience. 
                Get ready for the next generation of innovation from AETech Research Labs.
              </p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full mb-6">
                <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  Expected Launch Date
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {timeLeft.days}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {timeLeft.hours}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seconds</div>
                </div>
              </div>
              
              <div className="text-6xl mb-6">🎉</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "The best is yet to come"
              </p>
            </motion.div>

            {/* Email Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              {!subscribed ? (
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Be the first to know when we launch!
                  </h3>
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <BellIcon className="h-5 w-5 mr-2" />
                          Notify Me
                        </>
                      )}
                    </motion.button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    We'll never spam you. Unsubscribe at any time.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 max-w-md mx-auto"
                >
                  <div className="text-green-600 dark:text-green-400 text-4xl mb-3">✅</div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    You're all set!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    We'll send you an email as soon as we launch. Get ready for something amazing!
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-semibold mb-8 text-gray-700 dark:text-gray-300">
                What to expect:
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Navigation Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm">
                Stay connected with AETech Research Labs
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  href="/blog" 
                  className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Read Our Blog
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/bootcamp" 
                  className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Join Our Bootcamp
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/about" 
                  className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  About Us
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
