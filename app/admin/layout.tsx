'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../../components/ThemeToggle'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  TagIcon, 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  EnvelopeIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  AcademicCapIcon,
  MegaphoneIcon,
  HeartIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Comments', href: '/admin/comments', icon: ChatBubbleLeftIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Contacts', href: '/admin/contacts', icon: EnvelopeIcon },
  { name: 'Bootcamp', href: '/admin/bootcamp', icon: AcademicCapIcon },
  { name: 'Volunteers', href: '/admin/volunteers', icon: HeartIcon },
  { name: 'Sponsors', href: '/admin/sponsors', icon: BuildingOfficeIcon },
  { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon },
  { name: 'Email Marketing', href: '/admin/emails', icon: PaperAirplaneIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    
    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <motion.div 
          className={`hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
          initial={{ x: -288 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
            {/* Logo and branding with collapse button */}
            <div className="flex items-center justify-between p-4 lg:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {!sidebarCollapsed ? (
                <div className="flex items-center min-w-0">
                  <Image
                    src="/logo-dark.png"
                    alt="AETech"
                    width={120}
                    height={30}
                    className="h-8 lg:h-10 w-auto dark:hidden"
                    priority
                  />
                  <Image
                    src="/logo-light.png"
                    alt="AETech"
                    width={120}
                    height={30}
                    className="h-8 lg:h-10 w-auto hidden dark:block"
                    priority
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 font-bold text-lg">A</span>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Admin info */}
            <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={session.user?.image || '/default-avatar.svg'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                  />
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-3 overflow-hidden flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {session.user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user?.email || 'admin@aetechlabs.com'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2 overflow-y-auto min-h-0">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3 lg:px-4'} py-2.5 lg:py-3 text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation ${
                      isActive
                        ? 'bg-red-50 dark:bg-red-900/20 text-[#c1272d] dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? '' : 'mr-3'} ${
                        isActive ? 'text-[#c1272d] dark:text-red-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Theme Toggle */}
            <div className="p-3 lg:p-4">
              <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
                <ThemeToggle />
                {!sidebarCollapsed && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                )}
              </div>
            </div>

            {/* Sign out button */}
            <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/signout"
                className={`group flex items-center w-full ${sidebarCollapsed ? 'justify-center px-2' : 'px-3 lg:px-4'} py-2.5 lg:py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 touch-manipulation`}
                title={sidebarCollapsed ? 'Sign Out' : undefined}
              >
                <ArrowRightOnRectangleIcon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? '' : 'mr-3'} text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400`} />
                {!sidebarCollapsed && (
                  <span className="truncate">Sign Out</span>
                )}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center min-w-0">
                    <Image
                      src="/logo-dark.png"
                      alt="AETech"
                      width={120}
                      height={30}
                      className="h-8 sm:h-10 w-auto dark:hidden"
                      priority
                    />
                    <Image
                      src="/logo-light.png"
                      alt="AETech"
                      width={120}
                      height={30}
                      className="h-8 sm:h-10 w-auto hidden dark:block"
                      priority
                    />
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-2 rounded-md touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile admin info */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src={session.user?.image || '/default-avatar.svg'}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3 overflow-hidden flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session.user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {session.user?.email || 'admin@aetechlabs.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 touch-manipulation ${
                          isActive
                            ? 'bg-red-50 dark:bg-red-900/20 text-[#c1272d] dark:text-red-300 border border-red-200 dark:border-red-800'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${
                            isActive ? 'text-[#c1272d] dark:text-red-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile theme toggle and sign out */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <ThemeToggle />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Theme</span>
                  </div>
                  <Link
                    href="/admin/signout"
                    className="group flex items-center w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 touch-manipulation"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
                    <span className="truncate">Sign Out</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-md touch-manipulation"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center">
                <Image
                  src="/logo-dark.png"
                  alt="AETech"
                  width={80}
                  height={20}
                  className="h-6 sm:h-7 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logo-light.png"
                  alt="AETech"
                  width={80}
                  height={20}
                  className="h-6 sm:h-7 w-auto hidden dark:block"
                  priority
                />
              </div>
              
              <div className="p-1">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="flex-1 overflow-auto bg-transparent">
            <motion.div 
              className="p-4 sm:p-6 lg:p-8 max-w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-full overflow-hidden">
                {children}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
