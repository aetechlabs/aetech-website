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
  MegaphoneIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Comments', href: '/admin/comments', icon: ChatBubbleLeftIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Contacts', href: '/admin/contacts', icon: EnvelopeIcon },
  { name: 'Bootcamp', href: '/admin/bootcamp', icon: AcademicCapIcon },
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

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
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
            className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <motion.div 
          className={`hidden lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
          initial={{ x: -288 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
            {/* Logo and branding with collapse button */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#c1272d] to-red-600">
              {!sidebarCollapsed ? (
                <Image
                  src="/website-assets/logo-banner-white.png"
                  alt="AETech"
                  width={200}
                  height={50}
                  className="h-12 w-auto"
                />
              ) : (
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#c1272d] font-bold text-lg">A</span>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Admin info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={session.user?.image || '/default-avatar.svg'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-3 overflow-hidden">
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
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#c1272d] text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} ${
                        isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }`}
                    />
                    {!sidebarCollapsed && item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Theme Toggle */}
            <div className="p-4">
              <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
                <ThemeToggle />
                {!sidebarCollapsed && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                )}
              </div>
            </div>

            {/* Sign out button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/signout"
                className={`group flex items-center w-full ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200`}
                title={sidebarCollapsed ? 'Sign Out' : undefined}
              >
                <ArrowRightOnRectangleIcon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400`} />
                {!sidebarCollapsed && 'Sign Out'}
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
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#c1272d] to-red-600">
                  <Image
                    src="/website-assets/logo-banner-white.png"
                    alt="AETech"
                    width={200}
                    height={50}
                    className="h-12 w-auto"
                  />
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile admin info */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src={session.user?.image || '/default-avatar.svg'}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session.user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session.user?.email || 'admin@aetechlabs.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-[#c1272d] text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                          }`}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile theme toggle and sign out */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                  </div>
                  <Link
                    href="/admin/signout"
                    className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
                    Sign Out
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <Image
                src="/website-assets/logo-dark-500.png"
                alt="AETech"
                width={120}
                height={30}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/website-assets/logo-white-500.png"
                alt="AETech"
                width={120}
                height={30}
                className="h-8 w-auto hidden dark:block"
              />
              <ThemeToggle />
            </div>
          </div>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            <motion.div 
              className="p-3 sm:p-6 lg:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
