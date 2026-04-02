'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, LogOut, User, LayoutDashboard, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function DashboardNav({ 'data-onboarding': dataOnboarding }: { 'data-onboarding'?: string }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch { /* ignore */ }
    logout();
    toast.success('Signed out');
    router.replace('/auth/login');
  };

  return (
    <header className="border-b border-slate-800 dark:border-slate-800 border-slate-300 bg-white/80 dark:bg-surface-950/80 backdrop-blur-sm sticky top-0 z-50" data-onboarding={dataOnboarding}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">ResumeAI</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/dashboard'
                ? 'bg-slate-800 dark:bg-slate-800 bg-slate-100 text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-800/60 dark:hover:bg-slate-800/60 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/builder/new" className="btn-primary text-sm py-2">
            <Plus size={16} /> New Resume
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <User size={15} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-200 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">{user?.plan} plan</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2"
            title="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
