'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  BarChart3,
  Clock,
  Copy,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { SkeletonCard, SkeletonStats } from '@/components/ui/Skeleton';
import { formatDate, getErrorMessage, getScoreColor, getScoreLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { resumeAPI } from '@/lib/api';
import type { ResumeListItem } from '@/types/resume';

type FilterMode = 'all' | 'analyzed' | 'needs-work';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeAPI.getAll().then((response) => response.data.data.resumes as ResumeListItem[]),
  });
  const resumes = useMemo(() => data ?? [], [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => resumeAPI.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume duplicated');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        resume.title.toLowerCase().includes(query) ||
        resume.personalInfo?.fullName?.toLowerCase().includes(query);

      const score = resume.atsAnalysis?.score ?? null;
      const matchesFilter =
        filter === 'all' ||
        (filter === 'analyzed' && score !== null) ||
        (filter === 'needs-work' && score !== null && score < 75);

      return matchesSearch && matchesFilter;
    });
  }, [filter, resumes, search]);

  const stats = useMemo(() => {
    const analyzed = resumes.filter((resume) => resume.atsAnalysis?.score !== null);
    const averageScore =
      analyzed.length > 0
        ? Math.round(analyzed.reduce((sum, resume) => sum + (resume.atsAnalysis?.score ?? 0), 0) / analyzed.length)
        : null;

    const templateCount = new Set(resumes.map((resume) => resume.template)).size;

    return {
      total: resumes.length,
      analyzed: analyzed.length,
      averageScore,
      templateCount,
    };
  }, [resumes]);

  return (
    <div className="animate-fade-in space-y-8" data-onboarding="dashboard">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1">My Resumes</h1>
          <p className="text-slate-400 max-w-2xl">
            Welcome back, <span className="text-slate-200 dark:text-slate-200">{user?.name}</span>. Keep one polished master resume and spin tailored versions out from here.
          </p>
        </div>
        <Link href="/dashboard/builder/new" className="btn-primary w-full justify-center sm:w-auto" data-onboarding="builder">
          <Plus size={18} /> New Resume
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <SkeletonStats />
        ) : (
          <>
            <StatsCard label="Total resumes" value={String(stats.total)} accent="text-brand-300" />
            <StatsCard label="ATS analyzed" value={String(stats.analyzed)} accent="text-emerald-300" />
            <StatsCard label="Average ATS score" value={stats.averageScore !== null ? `${stats.averageScore}%` : 'N/A'} accent="text-sky-300" />
            <StatsCard label="Templates used" value={String(stats.templateCount)} accent="text-amber-300" />
          </>
        )}
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by resume title or candidate name"
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: 'All resumes' },
              { id: 'analyzed' as const, label: 'ATS analyzed' },
              { id: 'needs-work' as const, label: 'Needs attention' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                  filter === option.id
                    ? 'border-brand-500/40 bg-brand-500/10 text-brand-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-8 text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Failed to load resumes</p>
          <p className="text-slate-500 text-sm mt-1">Please refresh the page</p>
        </div>
      )}

      {!isLoading && !isError && resumes.length === 0 && (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-brand-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Build your first resume</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Use AI to generate stronger content, tailor for a job description, and export a polished PDF in minutes.
          </p>
          <Link href="/dashboard/builder/new" className="btn-primary">
            <Plus size={18} /> Create my first resume
          </Link>
        </div>
      )}

      {!isLoading && !isError && resumes.length > 0 && filteredResumes.length === 0 && (
        <div className="card p-12 text-center">
          <Search size={28} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No resumes match this view</p>
          <p className="text-slate-500 text-sm mt-1">Try a different search or filter.</p>
        </div>
      )}

      {!isLoading && filteredResumes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              isMenuOpen={activeMenu === resume._id}
              onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
              onDelete={(id) => {
                if (confirm('Delete this resume? This cannot be undone.')) {
                  deleteMutation.mutate(id);
                }
                setActiveMenu(null);
              }}
              onDuplicate={(id) => {
                duplicateMutation.mutate(id);
                setActiveMenu(null);
              }}
            />
          ))}

          <Link
            href="/dashboard/builder/new"
            className="card p-6 border-dashed border-slate-700 hover:border-brand-500/50 hover:bg-slate-900/80 transition-all group flex flex-col items-center justify-center min-h-[220px] text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 group-hover:bg-brand-600/20 flex items-center justify-center mb-3 transition-colors">
              <Plus size={22} className="text-brand-400" />
            </div>
            <p className="text-slate-400 group-hover:text-slate-300 font-medium text-sm transition-colors">Create new resume</p>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatsCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 animate-scale-in group">
      <div className={`text-3xl font-display font-bold ${accent} group-hover:scale-110 transition-transform duration-300`}>{value}</div>
      <div className="text-sm text-slate-500 mt-2 font-medium">{label}</div>
      <div className="w-8 h-1 bg-gradient-to-r from-transparent via-current to-transparent rounded-full mt-3 opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

interface ResumeCardProps {
  resume: ResumeListItem;
  isMenuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function ResumeCard({ resume, isMenuOpen, onMenuToggle, onDelete, onDuplicate }: ResumeCardProps) {
  const score = resume.atsAnalysis?.score ?? null;

  return (
    <div className="card p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 group animate-scale-in hover:scale-[1.02] cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-3 py-1 rounded-full border font-semibold capitalize transition-all duration-300 ${
                resume.template === 'modern'
                  ? 'text-brand-400 border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20'
                  : resume.template === 'minimal'
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'text-sky-400 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20'
              }`}
            >
              {resume.template}
            </span>
          </div>
          <h3 className="font-semibold text-white truncate group-hover:text-slate-100 transition-colors">{resume.title}</h3>
          {resume.personalInfo?.fullName && (
            <p className="text-slate-500 text-xs mt-0.5 truncate group-hover:text-slate-400 transition-colors">{resume.personalInfo.fullName}</p>
          )}
        </div>

        <div className="relative ml-2">
          <button
            onClick={() => onMenuToggle(resume._id)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-all duration-200 hover:scale-110"
          >
            <MoreVertical size={16} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-10 w-48 card shadow-2xl py-2 animate-slide-up border border-slate-700/60">
              <Link
                href={`/dashboard/builder/${resume._id}`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all duration-200 rounded-lg mx-2"
              >
                <Edit3 size={15} /> Edit Resume
              </Link>
              <button
                onClick={() => onDuplicate(resume._id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all duration-200 rounded-lg mx-2"
              >
                <Copy size={15} /> Duplicate
              </button>
              <div className="border-t border-slate-800/60 my-2 mx-2" />
              <button
                onClick={() => onDelete(resume._id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-200 rounded-lg mx-2"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-800/40 mb-4 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
        <BarChart3 size={18} className={`${score !== null ? getScoreColor(score) : 'text-slate-600'} group-hover:scale-110 transition-transform duration-300`} />
        <div className="flex-1">
          <div className="text-xs text-slate-500 mb-1 font-medium">ATS Score</div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getScoreColor(score)} group-hover:scale-105 transition-transform duration-200`}>{score !== null ? `${score}%` : '—'}</span>
            <span className="text-xs text-slate-500">{getScoreLabel(score)}</span>
          </div>
        </div>
        {score !== null && (
          <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
              <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-700" />
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${(score / 100) * 94.2} 94.2`}
                strokeLinecap="round"
                className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'} drop-shadow-sm`}
                stroke="currentColor"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-950/50 px-4 py-3 mb-4 flex items-center gap-3 text-xs text-slate-500 hover:border-slate-700/60 transition-all duration-200">
        <FileText size={13} className="text-slate-400" />
        <span className="flex-1">{score === null ? 'Run ATS analysis to get job-match feedback.' : 'Use duplicate to spin a role-specific version quickly.'}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-xs bg-slate-800/40 px-3 py-1.5 rounded-lg">
          <Clock size={12} />
          {formatDate(resume.lastEditedAt)}
        </div>
        <Link
          href={`/dashboard/builder/${resume._id}`}
          className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-semibold transition-all duration-200 hover:scale-105 px-3 py-1.5 rounded-lg hover:bg-brand-500/10"
        >
          <Edit3 size={14} /> Edit
        </Link>
      </div>
    </div>
  );
}
