'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full bg-slate-700 dark:bg-slate-600 border border-slate-600 dark:border-slate-500 transition-colors duration-300 ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-200 shadow-md"
        animate={{
          x: theme === 'dark' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: theme === 'dark' ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <Moon size={12} className="text-slate-400" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: theme === 'light' ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <Sun size={12} className="text-amber-500" />
      </motion.div>
    </motion.button>
  );
}