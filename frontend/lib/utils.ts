/**
 * lib/utils.ts - Shared Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string for display */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Get ATS score color class */
export function getScoreColor(score: number | null): string {
  if (score === null) return 'text-slate-400';
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

/** Get ATS score label */
export function getScoreLabel(score: number | null): string {
  if (score === null) return 'Not analyzed';
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

/** Extract axios error message */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'An error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

/** Generate an empty resume skeleton */
export function createEmptyResume(title = 'My Resume'): Partial<import('@/types/resume').Resume> {
  return {
    title,
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experience: [],
    education: [],
    projects: [],
    skills: [{ category: 'Technical Skills', items: [] }],
    certifications: [],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    atsAnalysis: {
      score: null,
      keywords: { found: [], missing: [], suggested: [] },
      suggestions: [],
      jobDescription: '',
      analyzedAt: null,
      scoreBreakdown: null,
      tailoringSuggestions: [],
    },
  };
}

/** Estimate how complete a resume is for builder UX */
export function calculateResumeCompleteness(resume: Partial<import('@/types/resume').Resume> | null): number {
  if (!resume) return 0;

  const checks = [
    Boolean(resume.title?.trim()),
    Boolean(resume.personalInfo?.fullName?.trim()),
    Boolean(resume.personalInfo?.email?.trim()),
    Boolean(resume.personalInfo?.summary?.trim()),
    Boolean(resume.experience?.length),
    Boolean(resume.education?.length),
    Boolean(resume.skills?.some((group) => group.items.length > 0)),
    Boolean(resume.projects?.length || resume.certifications?.length),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
