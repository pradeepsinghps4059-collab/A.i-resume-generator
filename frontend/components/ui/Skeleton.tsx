'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-200 rounded-lg ${className}`}
      style={{
        background: animate
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
          : undefined,
        backgroundSize: '200% 100%',
        animation: animate ? 'shimmer 1.5s infinite' : undefined,
      }}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`card p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      <Skeleton className="h-20 w-full mb-4 rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonForm({ fields = 4, className = '' }: { fields?: number; className?: string }) {
  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </motion.div>
  );
}

export function SkeletonStats({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="glass-card p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </motion.div>
      ))}
    </div>
  );
}