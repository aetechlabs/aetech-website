'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  XMarkIcon,
  CalendarDaysIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface Banner {
  id: string
  type: 'TOP_ANNOUNCEMENT' | 'BOOTCAMP' | 'URGENCY' | 'GENERAL'
  title: string
  message: string
  isActive: boolean
  priority: number
  startDate: string | null
  endDate: string | null
  backgroundColor: string
  textColor: string
  linkUrl: string | null
  linkText: string | null
  showCountdown: boolean
  countdownDeadline: string | null
  createdAt: string
  updatedAt: string
}

interface DynamicBannerProps {
  type?: 'TOP_ANNOUNCEMENT' | 'BOOTCAMP' | 'URGENCY' | 'GENERAL'
  position?: 'top' | 'bottom' | 'inline'
  delay?: number // For delayed display like BootcampBanner
  autoShow?: boolean // For auto-show functionality
  className?: string
}

export default function DynamicBanner({ 
  type, 
  position = 'inline',
  delay = 0,
  autoShow = true,
  className = ""
}: DynamicBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [visibleBanners, setVisibleBanners] = useState<Set<string>>(new Set())
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: any }>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchBanners()
    }
  }, [isMounted])

  useEffect(() => {
    if (isLoaded && autoShow && delay > 0 && isMounted) {
      const timer = setTimeout(() => {
        banners.forEach(banner => {
          if (shouldShowBanner(banner)) {
            setVisibleBanners(prev => new Set([...prev, banner.id]))
          }
        })
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [banners, isLoaded, autoShow, delay, isMounted])

  useEffect(() => {
    if (!isMounted) return
    
    // Update countdown timers every second
    const interval = setInterval(() => {
      const newTimeLeft: { [key: string]: any } = {}
      
      banners.forEach(banner => {
        if (banner.showCountdown && banner.countdownDeadline) {
          const now = new Date()
          const deadline = new Date(banner.countdownDeadline)
          const timeDiff = deadline.getTime() - now.getTime()
          
          if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 3600 * 24))
            const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600))
            const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60))
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
            
            newTimeLeft[banner.id] = { days, hours, minutes, seconds, total: timeDiff }
          } else {
            newTimeLeft[banner.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
          }
        }
      })
      
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(interval)
  }, [banners, isMounted])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners/public')
      const result = await response.json()
      if (result.success) {
        const activeBanners = result.data.filter((banner: Banner) => {
          if (!banner.isActive) return false
          if (type && banner.type !== type) return false
          
          const now = new Date()
          if (banner.startDate && new Date(banner.startDate) > now) return false
          if (banner.endDate && new Date(banner.endDate) < now) return false
          
          return true
        }).sort((a: Banner, b: Banner) => b.priority - a.priority)
        
        setBanners(activeBanners)
        
        // Show banners immediately if no delay
        if (delay === 0 || !autoShow) {
          activeBanners.forEach((banner: Banner) => {
            if (shouldShowBanner(banner)) {
              setVisibleBanners(prev => new Set([...prev, banner.id]))
            }
          })
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  const shouldShowBanner = (banner: Banner) => {
    if (!isMounted) return false
    
    // Check if banner was dismissed
    const storageKey = `banner-dismissed-${banner.id}`
    
    try {
      if (banner.type === 'TOP_ANNOUNCEMENT') {
        // Check if dismissed today
        const today = new Date().toDateString()
        const dismissed = localStorage.getItem(storageKey)
        return dismissed !== today
      } else if (banner.type === 'BOOTCAMP') {
        // Check if dismissed in this session
        const dismissed = sessionStorage.getItem(storageKey)
        return !dismissed
      }
      
      // For URGENCY and GENERAL, check if dismissed
      const dismissed = localStorage.getItem(storageKey)
      return !dismissed
    } catch {
      // If localStorage/sessionStorage fails, show banner
      return true
    }
  }

  const handleDismiss = (banner: Banner) => {
    if (!isMounted) return
    
    const storageKey = `banner-dismissed-${banner.id}`
    
    try {
      if (banner.type === 'TOP_ANNOUNCEMENT') {
        const today = new Date().toDateString()
        localStorage.setItem(storageKey, today)
      } else if (banner.type === 'BOOTCAMP') {
        sessionStorage.setItem(storageKey, 'true')
      } else {
        localStorage.setItem(storageKey, 'true')
      }
    } catch {
      // If storage fails, still hide banner
    }
    
    setVisibleBanners(prev => {
      const newSet = new Set(prev)
      newSet.delete(banner.id)
      return newSet
    })
    setDismissedBanners(prev => new Set([...prev, banner.id]))
  }

  const handleClose = (banner: Banner) => {
    setVisibleBanners(prev => {
      const newSet = new Set(prev)
      newSet.delete(banner.id)
      return newSet
    })
    // Don't mark as dismissed for temporary close
  }

  const renderCountdown = (banner: Banner) => {
    const time = timeLeft[banner.id]
    if (!time || time.total <= 0) return null

    return (
      <div className="flex items-center gap-2 text-sm">
        <CalendarDaysIcon className="h-4 w-4" />
        <span>
          {time.days > 0 && `${time.days}d `}
          {time.hours > 0 && `${time.hours}h `}
          {time.minutes > 0 && `${time.minutes}m `}
          {time.seconds}s
        </span>
      </div>
    )
  }

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted || !isLoaded || banners.length === 0) {
    return null
  }

  const visibleBannersList = banners.filter(banner => 
    visibleBanners.has(banner.id) && !dismissedBanners.has(banner.id)
  )

  if (visibleBannersList.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      {visibleBannersList.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ 
            height: 0, 
            opacity: 0,
            ...(position === 'top' && { y: -100 })
          }}
          animate={{ 
            height: "auto", 
            opacity: 1,
            ...(position === 'top' && { y: 0 })
          }}
          exit={{ 
            height: 0, 
            opacity: 0,
            ...(position === 'top' && { y: -100 })
          }}
          transition={{ duration: 0.3 }}
          className={`
            ${position === 'top' ? 'fixed top-0 left-0 right-0 z-50' : ''}
            ${className}
          `}
          style={{
            backgroundColor: banner.backgroundColor,
            color: banner.textColor
          }}
        >
          {/* Animated background pattern for some banner types */}
          {banner.type === 'TOP_ANNOUNCEMENT' && (
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          <div className="relative px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm sm:text-base truncate">
                      {banner.title}
                    </span>
                    {banner.showCountdown && banner.countdownDeadline && (
                      <div className="hidden sm:block">
                        {renderCountdown(banner)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm opacity-90 line-clamp-2">
                    {banner.message}
                  </p>
                  {banner.showCountdown && banner.countdownDeadline && (
                    <div className="sm:hidden mt-1">
                      {renderCountdown(banner)}
                    </div>
                  )}
                </div>

                {banner.linkUrl && banner.linkText && (
                  <Link
                    href={banner.linkUrl}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {banner.linkText}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {banner.type === 'BOOTCAMP' && (
                  <button
                    onClick={() => handleClose(banner)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Close"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDismiss(banner)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Dismiss"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
