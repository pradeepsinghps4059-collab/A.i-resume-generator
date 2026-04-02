'use client';

import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EnhancedToast } from './EnhancedToast';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    toastCounter.current += 1;
    const id = `toast-${toastCounter.current}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <EnhancedToast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Helper functions for different toast types
export function useToastHelpers() {
  const { showToast } = useToast();

  return {
    success: (title: string, message?: string) =>
      showToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      showToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      showToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      showToast({ type: 'info', title, message }),
  };
}
