'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Code2, Plus, Trash2, X, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { Resume, SkillGroup } from '@/types/resume';

interface Props { resume: Resume; onUpdate: (u: Partial<Resume>) => void; }

export function SkillsSection({ resume, onUpdate }: Props) {
  const [jobTitle, setJobTitle] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({});

  const updateGroup = (index: number, updates: Partial<SkillGroup>) => {
    onUpdate({ skills: resume.skills.map((g, i) => i === index ? { ...g, ...updates } : g) });
  };

  const addGroup = () => {
    onUpdate({ skills: [...resume.skills, { category: 'New Category', items: [] }] });
  };

  const removeGroup = (index: number) => {
    onUpdate({ skills: resume.skills.filter((_, i) => i !== index) });
  };

  const addSkill = (groupIndex: number, skill: string) => {
    if (!skill.trim()) return;
    const group = resume.skills[groupIndex];
    if (group.items.includes(skill.trim())) return;
    updateGroup(groupIndex, { items: [...group.items, skill.trim()] });
    setNewSkillInputs({ ...newSkillInputs, [groupIndex]: '' });
  };

  const removeSkill = (groupIndex: number, skillIndex: number) => {
    const updated = resume.skills[groupIndex].items.filter((_, i) => i !== skillIndex);
    updateGroup(groupIndex, { items: updated });
  };

  // AI skill suggestions
  const allSkills = resume.skills.flatMap((g) => g.items);

  const suggestMutation = useMutation({
    mutationFn: () => aiAPI.suggestSkills({ jobTitle, existingSkills: allSkills }),
    onSuccess: (res) => {
      const suggested = res.data.data.skills as string[];
      toast.success(`Got ${suggested.length} skill suggestions!`);
      // Add to first group or create new group
      if (resume.skills.length > 0) {
        const newItems = suggested.filter(s => !allSkills.includes(s));
        updateGroup(0, { items: [...resume.skills[0].items, ...newItems.slice(0, 8)] });
      }
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
          <Code2 size={16} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-white">Skills</h2>
          <p className="text-slate-500 text-xs">Group skills by category</p>
        </div>
        <button onClick={addGroup} className="btn-secondary text-xs py-1.5">
          <Plus size={14} /> Add Group
        </button>
      </div>

      {/* AI Suggest panel */}
      <div className="card p-4 border-brand-500/20 bg-brand-600/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-brand-400" />
          <span className="text-sm font-medium text-slate-300">AI Skill Suggestions</span>
        </div>
        <div className="flex gap-2">
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="input-field flex-1 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && suggestMutation.mutate()}
          />
          <button
            onClick={() => suggestMutation.mutate()}
            disabled={!jobTitle.trim() || suggestMutation.isPending}
            className="btn-primary text-sm py-2"
          >
            {suggestMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Suggest'}
          </button>
        </div>
      </div>

      {/* Skill groups */}
      {resume.skills.map((group, groupIndex) => (
        <div key={groupIndex} className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              value={group.category}
              onChange={(e) => updateGroup(groupIndex, { category: e.target.value })}
              className="input-field text-sm font-medium flex-1"
              placeholder="Category name"
            />
            <button onClick={() => removeGroup(groupIndex)}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {group.items.map((skill, skillIdx) => (
              <span key={skillIdx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700">
                {skill}
                <button onClick={() => removeSkill(groupIndex, skillIdx)}
                  className="text-slate-500 hover:text-red-400 transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input
              value={newSkillInputs[groupIndex] || ''}
              onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [groupIndex]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addSkill(groupIndex, newSkillInputs[groupIndex] || '')}
              placeholder="Add a skill and press Enter..."
              className="input-field text-sm flex-1"
            />
            <button
              onClick={() => addSkill(groupIndex, newSkillInputs[groupIndex] || '')}
              className="btn-secondary text-xs py-1.5"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      ))}

      {resume.skills.length === 0 && (
        <div className="text-center py-10 card border-dashed">
          <Code2 size={28} className="text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-3">No skill groups yet</p>
          <button onClick={addGroup} className="btn-secondary text-xs"><Plus size={13} /> Add skill group</button>
        </div>
      )}
    </div>
  );
}
