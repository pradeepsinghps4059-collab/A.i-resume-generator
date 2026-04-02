import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastManager';
import { OnboardingManager } from '@/components/ui/OnboardingManager';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'ResumeAI - AI-Powered Resume Builder',
    template: '%s | ResumeAI',
  },
  description:
    'Build professional, ATS-optimized resumes in minutes with AI assistance. Create, customize, and export polished resumes tailored to your dream job.',
  keywords: ['resume builder', 'AI resume', 'ATS resume', 'professional resume', 'CV builder'],
  authors: [{ name: 'ResumeAI' }],
  openGraph: {
    title: 'ResumeAI - AI-Powered Resume Builder',
    description: 'Build ATS-optimized resumes with AI assistance',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${fraunces.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <QueryProvider>
              {children}
              <OnboardingManager />
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
