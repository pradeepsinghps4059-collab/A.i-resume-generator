'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Loader2,
  Sparkles,
  Target,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '@/lib/api';
import { getErrorMessage, getScoreColor, getScoreLabel } from '@/lib/utils';
import type { ATSAnalysis, Resume } from '@/types/resume';

interface Props {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function ATSSection({ resume, onUpdate }: Props) {
  const [jobDescription, setJobDescription] = useState(resume.atsAnalysis?.jobDescription ?? '');
  const tailoringSuggestions = resume.atsAnalysis?.tailoringSuggestions ?? [];

  const analyzeMutation = useMutation({
    mutationFn: () => aiAPI.atsAnalyze({ resumeId: resume._id, jobDescription }),
    onSuccess: (response) => {
      const analysis = response.data.data.analysis as ATSAnalysis;
      onUpdate({ atsAnalysis: analysis });
      toast.success('ATS analysis complete.');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const tailorMutation = useMutation({
    mutationFn: () => aiAPI.tailorForJob({ resumeId: resume._id, jobDescription }),
    onSuccess: (response) => {
      const suggestions = response.data.data.suggestions as string[];
      onUpdate({
        atsAnalysis: {
          ...(resume.atsAnalysis ?? createEmptyAnalysis()),
          jobDescription,
          tailoringSuggestions: suggestions,
          analyzedAt: resume.atsAnalysis?.analyzedAt ?? new Date().toISOString(),
        },
      });
      toast.success('Tailoring suggestions generated.');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const ats = resume.atsAnalysis;
  const score = ats?.score ?? null;

  return (
    <div className="space-y-5 animate-fade-in" data-onboarding="ai-assistant">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center">
          <BarChart3 size={16} className="text-brand-400" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-white">ATS Optimization</h2>
          <p className="text-slate-500 text-xs">Analyze keyword coverage and tailor the resume for a role</p>
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-xs font-medium text-slate-400 mb-2">Paste Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={8}
          placeholder="Paste the full job description here for ATS scoring and job matching recommendations."
          className="input-field resize-none text-sm leading-relaxed"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={jobDescription.trim().length < 50 || analyzeMutation.isPending}
            className="btn-primary flex-1 justify-center"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze ATS Compatibility
              </>
            )}
          </button>
          <button
            onClick={() => tailorMutation.mutate()}
            disabled={jobDescription.trim().length < 50 || tailorMutation.isPending}
            className="btn-secondary flex-1 justify-center"
          >
            {tailorMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Matching
              </>
            ) : (
              <>
                <Target size={16} /> Tailor For Job
              </>
            )}
          </button>
        </div>
        {jobDescription.trim().length > 0 && jobDescription.trim().length < 50 && (
          <p className="text-amber-500 text-xs mt-2">
            Add a little more detail so the analysis has enough signal to work with.
          </p>
        )}
      </div>

      {ats && score !== null && (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className={`text-5xl font-display font-bold ${getScoreColor(score)}`}>{score}%</div>
                <div className="text-slate-400 text-sm">{getScoreLabel(score)}</div>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                {ats.scoreBreakdown && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <ScorePill label="Keywords" value={ats.scoreBreakdown.keywordMatch} />
                    <ScorePill label="Experience" value={ats.scoreBreakdown.experienceMatch} />
                    <ScorePill label="Skills" value={ats.scoreBreakdown.skillsMatch} />
                    <ScorePill label="Format" value={ats.scoreBreakdown.formatScore} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {ats.keywords.found.length > 0 && (
            <KeywordPanel
              icon={<CheckCircle size={15} className="text-emerald-400" />}
              title={`Keywords Found (${ats.keywords.found.length})`}
              items={ats.keywords.found}
              itemClassName="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            />
          )}

          {ats.keywords.missing.length > 0 && (
            <KeywordPanel
              icon={<AlertTriangle size={15} className="text-amber-400" />}
              title={`Missing Keywords (${ats.keywords.missing.length})`}
              items={ats.keywords.missing}
              itemClassName="bg-amber-500/10 border-amber-500/20 text-amber-400"
            />
          )}

          {ats.suggestions.length > 0 && (
            <SuggestionPanel
              title="Improvement Suggestions"
              icon={<AlertCircle size={15} className="text-brand-400" />}
              suggestions={ats.suggestions}
            />
          )}

          {tailoringSuggestions.length > 0 && (
            <SuggestionPanel
              title="Job Match Recommendations"
              icon={<Target size={15} className="text-sky-400" />}
              suggestions={tailoringSuggestions}
            />
          )}

          {ats.analyzedAt && (
            <p className="text-xs text-slate-600 text-center">
              Last analyzed: {new Date(ats.analyzedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
      <div className="text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-200">{value}</div>
    </div>
  );
}

function KeywordPanel({
  icon,
  title,
  items,
  itemClassName,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  itemClassName: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className={`px-2 py-0.5 rounded-lg border text-xs ${itemClassName}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SuggestionPanel({
  title,
  icon,
  suggestions,
}: {
  title: string;
  icon: ReactNode;
  suggestions: string[];
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={`${title}-${index}`} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-brand-400 font-bold mt-0.5">{index + 1}.</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function createEmptyAnalysis(): ATSAnalysis {
  return {
    score: null,
    keywords: { found: [], missing: [], suggested: [] },
    suggestions: [],
    jobDescription: '',
    analyzedAt: null,
    scoreBreakdown: null,
    tailoringSuggestions: [],
  };
}
