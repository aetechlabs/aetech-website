'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HomeIcon, 
  TagIcon, 
  ChatBubbleLeftIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface BlogHeaderProps {
  currentPage?: 'blog' | 'about' | 'contact';
}

export default function BlogHeader({ currentPage = 'blog' }: BlogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/blog', label: 'Blog', icon: TagIcon, key: 'blog' },
    { href: '/about', label: 'About', icon: UserGroupIcon, key: 'about' },
    { href: '/contact', label: 'Contact', icon: ChatBubbleLeftIcon, key: 'contact' },
  ];

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/website-assets/logo-white-500.png"
              alt="AETech Research Labs Limited"
              width={40}
              height={40}
              className="h-10 w-10 dark:hidden transform group-hover:scale-105 transition-transform"
            />
            <Image
              src="/website-assets/logo-dark-500.png"
              alt="AETech Research Labs Limited"
              width={40}
              height={40}
              className="h-10 w-10 hidden dark:block transform group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 dark:text-white">AETech</span>
              <span className="text-sm text-red-600 dark:text-red-400 block -mt-1">
                {currentPage === 'blog' ? 'Blog' : currentPage === 'about' ? 'About' : 'Contact'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === currentPage || (item.href === '/' && !currentPage);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 transition-colors ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-1 overflow-hidden"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === currentPage || (item.href === '/' && !currentPage);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
