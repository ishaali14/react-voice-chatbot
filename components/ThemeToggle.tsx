import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'next-i18next';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  // Add a mounting state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Only show the component after client-side hydration is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return null or a placeholder during server-side rendering
  if (!isMounted) {
    // Return a placeholder with the same size to prevent layout shift
    return (
      <button
        className="flex items-center justify-center h-10 px-4 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 transition-colors duration-200"
        aria-label={t('theme.toggle')}
      >
        <div className="w-5 h-5"></div>
        <span className="ml-2 hidden md:block">...</span>
      </button>
    );
  }
  
  // Only render the actual component on the client side
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-10 px-4 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label={t('theme.toggle')}
    >
      {theme === 'light' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
      <span className="ml-2 hidden md:block">{theme === 'light' ? t('dark') : t('light')}</span>
    </button>
  );
}