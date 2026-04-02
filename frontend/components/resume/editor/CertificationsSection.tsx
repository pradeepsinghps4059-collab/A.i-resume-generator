'use client';

import { Award, Plus, Trash2 } from 'lucide-react';
import type { Certification, Resume } from '@/types/resume';

interface SectionProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

const emptyCert = (): Certification => ({
  name: '',
  issuer: '',
  date: '',
  credentialId: '',
  url: '',
});

export function CertificationsSection({ resume, onUpdate }: SectionProps) {
  const addCert = () => {
    onUpdate({ certifications: [...resume.certifications, emptyCert()] });
  };

  const updateCert = (index: number, updates: Partial<Certification>) => {
    onUpdate({
      certifications: resume.certifications.map((certification, currentIndex) =>
        currentIndex === index ? { ...certification, ...updates } : certification
      ),
    });
  };

  const removeCert = (index: number) => {
    onUpdate({ certifications: resume.certifications.filter((_, currentIndex) => currentIndex !== index) });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-rose-600/15 border border-rose-500/20 flex items-center justify-center">
          <Award size={16} className="text-rose-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-white">Certifications</h2>
          <p className="text-slate-500 text-xs">Highlight industry credentials and licenses</p>
        </div>
        <button onClick={addCert} className="btn-secondary text-xs py-1.5">
          <Plus size={14} /> Add
        </button>
      </div>

      {resume.certifications.length === 0 && (
        <div className="text-center py-10 card border-dashed">
          <Award size={28} className="text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-3">No certifications added yet</p>
          <button onClick={addCert} className="btn-secondary text-xs">
            <Plus size={13} /> Add certification
          </button>
        </div>
      )}

      {resume.certifications.map((cert, index) => (
        <div key={index} className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Certification {index + 1}</span>
            <button
              onClick={() => removeCert(index)}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Certification Name *</label>
              <input
                value={cert.name}
                onChange={(event) => updateCert(index, { name: event.target.value })}
                placeholder="AWS Certified Solutions Architect"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Issuing Organization</label>
              <input
                value={cert.issuer}
                onChange={(event) => updateCert(index, { issuer: event.target.value })}
                placeholder="Amazon Web Services"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date Earned</label>
              <input
                value={cert.date}
                onChange={(event) => updateCert(index, { date: event.target.value })}
                placeholder="March 2024"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Credential ID</label>
              <input
                value={cert.credentialId}
                onChange={(event) => updateCert(index, { credentialId: event.target.value })}
                placeholder="ABC123XYZ"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Verification URL</label>
              <input
                value={cert.url}
                onChange={(event) => updateCert(index, { url: event.target.value })}
                placeholder="https://credential.example.com"
                className="input-field"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
