'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { Template } from '@/types/resume';

interface TemplateSelectorProps {
  value: Template;
  onChange: (template: Template) => void;
}

const templates: Array<{ id: Template; label: string; color: string; description: string }> = [
  { id: 'modern', label: 'Modern', color: 'text-brand-400', description: 'Bold header and crisp section rhythm.' },
  { id: 'minimal', label: 'Minimal', color: 'text-emerald-400', description: 'Clean editorial look with light styling.' },
  { id: 'professional', label: 'Professional', color: 'text-sky-400', description: 'Executive layout with a strong sidebar.' },
];

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = templates.find((template) => template.id === value) ?? templates[0];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={containerRef} data-onboarding="templates">
      <button onClick={() => setOpen((previous) => !previous)} className="btn-secondary text-sm py-1.5 gap-2">
        <span className={current.color}>◆</span>
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 w-72 card shadow-xl py-1 animate-slide-up">
          <p className="px-4 py-2 text-xs text-slate-500 font-medium">Select Template</p>
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-800 ${
                value === template.id ? 'bg-slate-800' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 text-sm">
                <span className={template.color}>◆</span>
                <span className={value === template.id ? 'text-white' : 'text-slate-300'}>{template.label}</span>
                {value === template.id && <CheckCircle size={13} className="ml-auto text-brand-400" />}
              </div>
              <p className="mt-1 text-xs text-slate-500">{template.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
