'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { PersonalInfo, Resume } from '@/types/resume';

interface Props {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function PersonalInfoSection({ resume, onUpdate }: Props) {
  const [targetRole, setTargetRole] = useState('');
  const personalInfo = resume.personalInfo;

  const updateField = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
    onUpdate({ personalInfo: { ...personalInfo, [field]: value } });
  };

  const generateSummaryMutation = useMutation({
    mutationFn: () =>
      aiAPI.generateSummary({
        personalInfo,
        experience: resume.experience,
        skills: resume.skills,
        targetRole: targetRole.trim() || undefined,
      }),
    onSuccess: (response) => {
      const summary = response.data.data.summary as string;
      onUpdate({ personalInfo: { ...personalInfo, summary } });
      toast.success('Professional summary generated.');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 border border-brand-500/30 flex items-center justify-center animate-float">
          <User size={20} className="text-brand-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-xl">Personal Information</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Your contact details and professional links</p>
        </div>
      </div>

      <div className="glass-card p-6 border-brand-500/20 bg-gradient-to-br from-brand-600/5 to-purple-600/5 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-brand-600/20 flex items-center justify-center">
            <Sparkles size={16} className="text-brand-400 animate-pulse-glow" />
          </div>
          <span className="text-sm font-semibold text-slate-300">AI Summary Generator</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="Target role, for example Senior Full-Stack Engineer"
            className="input-field flex-1 text-sm"
          />
          <button
            onClick={() => generateSummaryMutation.mutate()}
            disabled={generateSummaryMutation.isPending}
            className="btn-primary justify-center group"
            type="button"
          >
            {generateSummaryMutation.isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating
              </>
            ) : (
              <>
                <Sparkles size={15} className="group-hover:animate-bounce" /> Generate Summary
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 animate-slide-up animation-delay-200">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name *</label>
          <input
            value={personalInfo.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="Jane Smith"
            className="input-field text-base"
          />
        </div>
        <div className="animate-slide-up animation-delay-300">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email *</label>
          <input
            value={personalInfo.email}
            onChange={(event) => updateField('email', event.target.value)}
            type="email"
            placeholder="jane@example.com"
            className="input-field"
          />
        </div>
        <div className="animate-slide-up animation-delay-400">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone</label>
          <input
            value={personalInfo.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="+1 (555) 000-0000"
            className="input-field"
          />
        </div>
        <div className="md:col-span-2 animate-slide-up animation-delay-500">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Location</label>
          <input
            value={personalInfo.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="San Francisco, CA"
            className="input-field"
          />
        </div>
        <div className="animate-slide-up animation-delay-600">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">LinkedIn</label>
          <input
            value={personalInfo.linkedin}
            onChange={(event) => updateField('linkedin', event.target.value)}
            placeholder="linkedin.com/in/janesmithdev"
            className="input-field"
          />
        </div>
        <div className="animate-slide-up animation-delay-700">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">GitHub</label>
          <input
            value={personalInfo.github}
            onChange={(event) => updateField('github', event.target.value)}
            placeholder="github.com/janesmith"
            className="input-field"
          />
        </div>
        <div className="md:col-span-2 animate-slide-up animation-delay-800">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Website / Portfolio</label>
          <input
            value={personalInfo.website}
            onChange={(event) => updateField('website', event.target.value)}
            placeholder="https://janesmith.dev"
            className="input-field"
          />
        </div>
        <div className="md:col-span-2 animate-slide-up animation-delay-900">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Professional Summary</label>
          <textarea
            value={personalInfo.summary}
            onChange={(event) => updateField('summary', event.target.value)}
            rows={4}
            placeholder="Write a brief summary, or generate one with AI."
            className="input-field resize-none leading-relaxed text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Keep this to 3-4 sentences focused on impact, specialization, and job fit.
          </p>
        </div>
      </div>
    </div>
  );
}
