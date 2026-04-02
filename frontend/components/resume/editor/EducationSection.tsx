'use client';

// ─── Education Section ────────────────────────────────────────────────────────

import { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Resume, Education } from '@/types/resume';

interface Props { resume: Resume; onUpdate: (u: Partial<Resume>) => void; }

const emptyEdu = (): Education => ({
  institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', honors: '',
});

export function EducationSection({ resume, onUpdate }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const updateEdu = (index: number, updates: Partial<Education>) => {
    onUpdate({ education: resume.education.map((e, i) => i === index ? { ...e, ...updates } : e) });
  };

  const addEdu = () => {
    onUpdate({ education: [...resume.education, emptyEdu()] });
    setExpanded(resume.education.length);
  };

  const removeEdu = (index: number) => {
    onUpdate({ education: resume.education.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
          <GraduationCap size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-white">Education</h2>
        </div>
        <button onClick={addEdu} className="btn-secondary text-xs py-1.5">
          <Plus size={14} /> Add
        </button>
      </div>

      {resume.education.length === 0 && (
        <div className="text-center py-10 card border-dashed">
          <GraduationCap size={28} className="text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No education added yet</p>
          <button onClick={addEdu} className="btn-secondary text-xs mt-3"><Plus size={13} /> Add education</button>
        </div>
      )}

      {resume.education.map((edu, index) => (
        <div key={index} className="card overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === index ? null : index)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{edu.institution || 'New Institution'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeEdu(index); }}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
            {expanded === index ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </button>

          {expanded === index && (
            <div className="p-4 pt-0 space-y-3 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Institution *</label>
                  <input value={edu.institution} onChange={(e) => updateEdu(index, { institution: e.target.value })}
                    placeholder="MIT" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Degree</label>
                  <input value={edu.degree} onChange={(e) => updateEdu(index, { degree: e.target.value })}
                    placeholder="Bachelor of Science" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Field of Study</label>
                  <input value={edu.field} onChange={(e) => updateEdu(index, { field: e.target.value })}
                    placeholder="Computer Science" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                  <input value={edu.startDate} onChange={(e) => updateEdu(index, { startDate: e.target.value })}
                    placeholder="Sep 2018" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">End Date</label>
                  <input value={edu.endDate} onChange={(e) => updateEdu(index, { endDate: e.target.value })}
                    placeholder="May 2022" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">GPA (optional)</label>
                  <input value={edu.gpa} onChange={(e) => updateEdu(index, { gpa: e.target.value })}
                    placeholder="3.8 / 4.0" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Honors / Distinctions</label>
                  <input value={edu.honors} onChange={(e) => updateEdu(index, { honors: e.target.value })}
                    placeholder="Magna Cum Laude" className="input-field" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
