'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <ComputerDesktopIcon className="h-5 w-5" />;
    } else if (theme === 'light') {
      return <SunIcon className="h-5 w-5" />;
    } else {
      return <MoonIcon className="h-5 w-5" />;
    }
  };

  const getTooltip = () => {
    if (theme === 'system') {
      return 'System theme (click for light)';
    } else if (theme === 'light') {
      return 'Light theme (click for dark)';
    } else {
      return 'Dark theme (click for system)';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      title={getTooltip()}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-300 dark:border-gray-600"
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  );
}
