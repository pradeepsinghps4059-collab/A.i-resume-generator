'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnhancedToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50',
    borderColor: 'border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-200',
    iconColor: 'text-emerald-500',
    progressColor: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10 dark:bg-red-500/10 light:bg-red-50',
    borderColor: 'border-red-500/20 dark:border-red-500/20 light:border-red-200',
    iconColor: 'text-red-500',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-50',
    borderColor: 'border-amber-500/20 dark:border-amber-500/20 light:border-amber-200',
    iconColor: 'text-amber-500',
    progressColor: 'bg-amber-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-50',
    borderColor: 'border-blue-500/20 dark:border-blue-500/20 light:border-blue-200',
    iconColor: 'text-blue-500',
    progressColor: 'bg-blue-500',
  },
};

export function EnhancedToast({ id, type, title, message, duration = 4000, onClose }: EnhancedToastProps) {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            onClose(id);
            return 0;
          }
          return prev - (100 / (duration / 50));
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      className={`relative w-80 p-4 rounded-xl border backdrop-blur-md shadow-lg ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${config.iconColor}`}>
          <Icon size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 light:text-slate-900">
            {title}
          </h4>
          {message && (
            <p className="text-xs text-slate-600 dark:text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 light:hover:text-slate-900 transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 light:bg-slate-200 rounded-b-xl overflow-hidden"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.05 }}
        >
          <div className={`h-full ${config.progressColor} rounded-b-xl`} />
        </motion.div>
      )}
    </motion.div>
  );
}