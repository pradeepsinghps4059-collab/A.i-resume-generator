'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { Resume, Experience } from '@/types/resume';

interface Props {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

const emptyExp = (): Experience => ({
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  bullets: [''],
});

export function ExperienceSection({ resume, onUpdate }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const updateExp = (index: number, updates: Partial<Experience>) => {
    const updated = resume.experience.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, ...updates } : entry
    );
    onUpdate({ experience: updated });
  };

  const addExp = () => {
    onUpdate({ experience: [...resume.experience, emptyExp()] });
    setExpanded(resume.experience.length);
  };

  const removeExp = (index: number) => {
    onUpdate({ experience: resume.experience.filter((_, entryIndex) => entryIndex !== index) });
    setExpanded(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-600/15">
          <Briefcase size={16} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-white">Work Experience</h2>
          <p className="text-xs text-slate-500">Most recent first</p>
        </div>
        <button type="button" onClick={addExp} className="btn-secondary py-1.5 text-xs">
          <Plus size={14} /> Add
        </button>
      </div>

      {resume.experience.length === 0 && (
        <div className="card border-dashed py-10 text-center">
          <Briefcase size={28} className="mx-auto mb-2 text-slate-700" />
          <p className="text-sm text-slate-500">No experience added yet</p>
          <button type="button" onClick={addExp} className="btn-secondary mt-3 text-xs">
            <Plus size={13} /> Add experience
          </button>
        </div>
      )}

      {resume.experience.map((exp, index) => (
        <ExperienceCard
          key={index}
          exp={exp}
          isExpanded={expanded === index}
          onToggle={() => setExpanded(expanded === index ? null : index)}
          onChange={(updates) => updateExp(index, updates)}
          onRemove={() => removeExp(index)}
        />
      ))}
    </div>
  );
}

interface CardProps {
  exp: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (updates: Partial<Experience>) => void;
  onRemove: () => void;
}

function ExperienceCard({ exp, isExpanded, onToggle, onChange, onRemove }: CardProps) {
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null);

  const improveMutation = useMutation({
    mutationFn: ({ bullet, idx }: { bullet: string; idx: number }) => {
      setImprovingIdx(idx);
      return aiAPI.improveBullet({ bullet, jobTitle: exp.position, company: exp.company });
    },
    onSuccess: (res, { idx }) => {
      const improved = res.data.data.improved as string;
      const updated = [...exp.bullets];
      updated[idx] = improved;
      onChange({ bullets: updated });
      setImprovingIdx(null);
      toast.success('Bullet improved!');
    },
    onError: (error) => {
      setImprovingIdx(null);
      toast.error(getErrorMessage(error));
    },
  });

  const updateBullet = (idx: number, value: string) => {
    const updated = [...exp.bullets];
    updated[idx] = value;
    onChange({ bullets: updated });
  };

  const addBullet = () => onChange({ bullets: [...exp.bullets, ''] });
  const removeBullet = (idx: number) => {
    onChange({ bullets: exp.bullets.filter((_, bulletIndex) => bulletIndex !== idx) });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4 transition-colors hover:bg-slate-800/40">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {exp.position || 'New Position'}
              {exp.company ? ` @ ${exp.company}` : ''}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-red-400/10 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 border-t border-slate-800 p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Position *</label>
              <input
                value={exp.position}
                onChange={(e) => onChange({ position: e.target.value })}
                placeholder="Software Engineer"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Company *</label>
              <input
                value={exp.company}
                onChange={(e) => onChange({ company: e.target.value })}
                placeholder="Acme Corp"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Start Date</label>
              <input
                value={exp.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
                placeholder="Jan 2022"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">End Date</label>
              <input
                value={exp.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
                placeholder="Present"
                disabled={exp.current}
                className="input-field disabled:opacity-50"
              />
              <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    onChange({
                      current: e.target.checked,
                      endDate: e.target.checked ? 'Present' : '',
                    })
                  }
                  className="rounded"
                />
                Currently working here
              </label>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Location</label>
              <input
                value={exp.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="San Francisco, CA (Remote)"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-slate-400">Key Achievements / Responsibilities</label>
              <button
                type="button"
                onClick={addBullet}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
              >
                <Plus size={12} /> Add bullet
              </button>
            </div>
            <div className="space-y-2">
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2.5 text-xs text-slate-600">•</span>
                  <textarea
                    value={bullet}
                    onChange={(e) => updateBullet(idx, e.target.value)}
                    rows={2}
                    placeholder="Describe an achievement or responsibility..."
                    className="input-field flex-1 resize-none text-sm"
                  />
                  <div className="mt-1 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => improveMutation.mutate({ bullet, idx })}
                      disabled={!bullet.trim() || improvingIdx === idx}
                      title="Improve with AI"
                      className="rounded-lg bg-brand-600/10 p-1.5 text-brand-400 transition-colors hover:bg-brand-600/20 disabled:opacity-40"
                    >
                      {improvingIdx === idx ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Sparkles size={13} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBullet(idx)}
                      className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-red-400/10 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
