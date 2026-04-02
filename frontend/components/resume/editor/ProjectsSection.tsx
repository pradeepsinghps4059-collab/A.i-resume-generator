'use client';

import { useState } from 'react';
import { FolderOpen, Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Resume, Project } from '@/types/resume';

interface Props { resume: Resume; onUpdate: (u: Partial<Resume>) => void; }

const emptyProject = (): Project => ({
  name: '', description: '', technologies: [], liveUrl: '', repoUrl: '',
  startDate: '', endDate: '', bullets: [''],
});

export function ProjectsSection({ resume, onUpdate }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const updateProject = (index: number, updates: Partial<Project>) => {
    onUpdate({ projects: resume.projects.map((p, i) => i === index ? { ...p, ...updates } : p) });
  };

  const addProject = () => {
    onUpdate({ projects: [...resume.projects, emptyProject()] });
    setExpanded(resume.projects.length);
  };

  const removeProject = (index: number) => {
    onUpdate({ projects: resume.projects.filter((_, i) => i !== index) });
  };

  const addTech = (index: number, tech: string) => {
    if (!tech.trim()) return;
    const project = resume.projects[index];
    if (project.technologies.includes(tech.trim())) return;
    updateProject(index, { technologies: [...project.technologies, tech.trim()] });
    setTechInput({ ...techInput, [index]: '' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-sky-600/15 border border-sky-500/20 flex items-center justify-center">
          <FolderOpen size={16} className="text-sky-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-white">Projects</h2>
          <p className="text-slate-500 text-xs">Showcase your best work</p>
        </div>
        <button onClick={addProject} className="btn-secondary text-xs py-1.5">
          <Plus size={14} /> Add
        </button>
      </div>

      {resume.projects.length === 0 && (
        <div className="text-center py-10 card border-dashed">
          <FolderOpen size={28} className="text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-3">No projects added yet</p>
          <button onClick={addProject} className="btn-secondary text-xs"><Plus size={13} /> Add project</button>
        </div>
      )}

      {resume.projects.map((project, index) => (
        <div key={index} className="card overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === index ? null : index)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{project.name || 'New Project'}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {project.technologies.slice(0, 3).join(', ') || 'No technologies listed'}
              </p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeProject(index); }}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
            {expanded === index ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </button>

          {expanded === index && (
            <div className="p-4 pt-0 space-y-3 border-t border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Project Name *</label>
                <input value={project.name} onChange={(e) => updateProject(index, { name: e.target.value })}
                  placeholder="My Awesome Project" className="input-field" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea value={project.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                  rows={3} placeholder="What does this project do? What problem does it solve?"
                  className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Live URL</label>
                  <input value={project.liveUrl} onChange={(e) => updateProject(index, { liveUrl: e.target.value })}
                    placeholder="https://myproject.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">GitHub Repo</label>
                  <input value={project.repoUrl} onChange={(e) => updateProject(index, { repoUrl: e.target.value })}
                    placeholder="https://github.com/..." className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Technologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.technologies.map((tech, ti) => (
                    <span key={ti} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      {tech}
                      <button onClick={() => updateProject(index, { technologies: project.technologies.filter((_, i) => i !== ti) })}
                        className="text-slate-500 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput[index] || ''}
                    onChange={(e) => setTechInput({ ...techInput, [index]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && addTech(index, techInput[index] || '')}
                    placeholder="React, Node.js, MongoDB..." className="input-field flex-1 text-sm" />
                  <button onClick={() => addTech(index, techInput[index] || '')}
                    className="btn-secondary text-xs py-1.5"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
