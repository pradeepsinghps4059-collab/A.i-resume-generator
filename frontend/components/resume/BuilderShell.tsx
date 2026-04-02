'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle,
  Code2,
  Download,
  Eye,
  EyeOff,
  FolderOpen,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { calculateResumeCompleteness } from '@/lib/utils';
import { useResumeStore } from '@/store/resume.store';
import type { ActiveSection, Resume } from '@/types/resume';
import { ATSSection } from './editor/ATSSection';
import { CertificationsSection } from './editor/CertificationsSection';
import { EducationSection } from './editor/EducationSection';
import { ExperienceSection } from './editor/ExperienceSection';
import { PersonalInfoSection } from './editor/PersonalInfoSection';
import { ProjectsSection } from './editor/ProjectsSection';
import { SkillsSection } from './editor/SkillsSection';
import { TemplateSelector } from './editor/TemplateSelector';
import { ResumePreview } from './preview/ResumePreview';

interface BuilderShellProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
  onSave: () => void;
}

const NAV_ITEMS: { id: ActiveSection; label: string; icon: ReactNode }[] = [
  { id: 'personal', label: 'Personal', icon: <User size={15} /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={15} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={15} /> },
  { id: 'skills', label: 'Skills', icon: <Code2 size={15} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={15} /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={15} /> },
  { id: 'ats', label: 'ATS Score', icon: <BarChart3 size={15} /> },
];

export function BuilderShell({ resume, onUpdate, onSave }: BuilderShellProps) {
  const { activeSection, setActiveSection, isDirty, isSaving, isPreviewMode, setPreviewMode } = useResumeStore();
  const printRef = useRef<HTMLDivElement>(null);
  const completeness = calculateResumeCompleteness(resume);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resume.title || 'Resume',
    onAfterPrint: () => toast.success('PDF exported!'),
  });

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection resume={resume} onUpdate={onUpdate} />;
      case 'experience':
        return <ExperienceSection resume={resume} onUpdate={onUpdate} />;
      case 'education':
        return <EducationSection resume={resume} onUpdate={onUpdate} />;
      case 'skills':
        return <SkillsSection resume={resume} onUpdate={onUpdate} />;
      case 'projects':
        return <ProjectsSection resume={resume} onUpdate={onUpdate} />;
      case 'certifications':
        return <CertificationsSection resume={resume} onUpdate={onUpdate} />;
      case 'ats':
        return <ATSSection resume={resume} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <header className="border-b border-slate-800 bg-surface-950/90 backdrop-blur-sm sticky top-0 z-40 no-print">
        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/dashboard" className="btn-ghost p-2 text-slate-500">
                <ArrowLeft size={18} />
              </Link>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-white truncate">{resume.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {isSaving ? (
                    <>
                      <Loader2 size={10} className="animate-spin" /> Saving...
                    </>
                  ) : isDirty ? (
                    <span className="text-amber-500">Unsaved changes</span>
                  ) : (
                    <>
                      <CheckCircle size={10} className="text-emerald-500" /> Saved
                    </>
                  )}
                  <span className="text-slate-700">•</span>
                  <span>{completeness}% complete</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <TemplateSelector value={resume.template} onChange={(template) => onUpdate({ template })} />
              <button onClick={() => setPreviewMode(!isPreviewMode)} className="btn-secondary text-sm py-1.5">
                {isPreviewMode ? (
                  <>
                    <EyeOff size={15} /> Edit
                  </>
                ) : (
                  <>
                    <Eye size={15} /> Preview
                  </>
                )}
              </button>
              <button onClick={onSave} className="btn-secondary text-sm py-1.5">
                <Save size={15} /> Save
              </button>
              <button onClick={handlePrint} className="btn-primary text-sm py-1.5" data-onboarding="export">
                <Download size={15} /> Export PDF
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {NAV_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setPreviewMode(false);
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-300 hover:scale-105 animate-scale-in ${
                    activeSection === item.id
                      ? 'border-brand-500/50 bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-brand-300 shadow-lg shadow-brand-500/20'
                      : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700/60'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <TemplateSelector value={resume.template} onChange={(template) => onUpdate({ template })} />
              <button onClick={() => setPreviewMode(!isPreviewMode)} className="btn-secondary text-sm py-1.5 flex-1 justify-center">
                {isPreviewMode ? (
                  <>
                    <EyeOff size={15} /> Edit
                  </>
                ) : (
                  <>
                    <Eye size={15} /> Preview
                  </>
                )}
              </button>
              <button onClick={onSave} className="btn-secondary text-sm py-1.5">
                <Save size={15} />
              </button>
              <button onClick={handlePrint} className="btn-primary text-sm py-1.5">
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!isPreviewMode && (
          <aside className="hidden lg:block w-56 border-r border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-sm flex-shrink-0 no-print">
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full nav-item animate-slide-in-right ${
                    activeSection === item.id
                      ? 'active shadow-lg'
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.id === 'ats' && <Sparkles size={12} className="text-brand-400 animate-pulse-glow" />}
                  {activeSection === item.id && (
                    <div className="w-1.5 h-6 bg-gradient-to-b from-brand-400 to-purple-400 rounded-full ml-auto animate-scale-in" />
                  )}
                </button>
              ))}
            </nav>

            <div className="px-4 mt-8">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500">{completeness}% complete</div>
              </div>
            </div>
          </aside>
        )}

        {!isPreviewMode && (
          <div className="flex-1 overflow-y-auto no-print">
            <div className="max-w-3xl mx-auto p-6 space-y-5">
              <div className="card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">Builder progress</div>
                    <div className="text-white font-medium">Focus on the highest-signal sections first</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-brand-300">{completeness}%</div>
                    <div className="text-xs text-slate-500">completion</div>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400" style={{ width: `${completeness}%` }} />
                </div>
              </div>

              {renderSection()}
            </div>
          </div>
        )}

        <div
          className={`${
            isPreviewMode ? 'flex-1' : 'w-full lg:w-[500px] xl:w-[540px] flex-shrink-0'
          } overflow-y-auto bg-slate-800/30 border-l border-slate-800`}
        >
          <div className="p-6 flex justify-center">
            <div ref={printRef} className="w-full max-w-[210mm]">
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
