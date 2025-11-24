'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Set active section based on current pathname
    if (pathname === '/about') {
      setActiveSection('about');
    } else if (pathname === '/contact') {
      setActiveSection('contact');
    } else if (pathname === '/pricing') {
      setActiveSection('pricing');
    } else if (pathname === '/faq') {
      setActiveSection('faq');
    } else if (pathname === '/why') {
      setActiveSection('why');
    } else {
      setActiveSection('home');
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'services', 'contact'];
      const scrollPos = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page and trying to scroll to a section, navigate to home first
    if (pathname !== '/' && (sectionId === 'home' || sectionId === 'services')) {
      router.push(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (item: any) => {
    if (item.type === 'scroll') {
      scrollToSection(item.id);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', type: 'scroll' },
    { id: 'about', label: 'About', type: 'link', href: '/about' },
    { id: 'services', label: 'Services', type: 'scroll' },
    { id: 'why', label: 'Why Us', type: 'link', href: '/why' },
    { id: 'pricing', label: 'Pricing', type: 'link', href: '/pricing' },
    { id: 'faq', label: 'FAQ', type: 'link', href: '/faq' },
    { id: 'contact', label: 'Contact', type: 'link', href: '/contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-200/30 dark:border-gray-700/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/assets/Dark transparent logo.png"
                alt="AETech Logo"
                width={140}
                height={45}
                className="h-10 w-auto dark:hidden cursor-pointer transition-transform hover:scale-105"
              />
              <Image
                src="/logo-dark.png"
                alt="AETech Logo"
                width={140}
                height={45}
                className="h-10 w-auto hidden dark:block cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-full p-1">
              {navItems.map((item) => {
                if (item.type === 'link' && item.href) {
                  return (
                    <Link key={item.id} href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
                          pathname === item.href
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  );
                }
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      activeSection === item.id
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed inset-0 top-20 z-40"
            >
              <div className="h-full px-4 py-6 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl p-3 space-y-3">
                  {navItems.map((item, index) => {
                  if (item.type === 'link' && item.href) {
                    return (
                      <Link key={item.id} href={item.href}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`block w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all cursor-pointer ${
                            pathname === item.href
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-98'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    );
                  }

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)}
                      className={`block w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all ${
                        activeSection === item.id
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
    