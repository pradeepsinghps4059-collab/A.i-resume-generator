'use client';

import type { ReactNode } from 'react';
import type { Resume } from '@/types/resume';

interface Props {
  resume: Resume;
}

export function ResumePreview({ resume }: Props) {
  switch (resume.template) {
    case 'minimal': return <MinimalTemplate resume={resume} />;
    case 'professional': return <ProfessionalTemplate resume={resume} />;
    default: return <ModernTemplate resume={resume} />;
  }
}

// ─── Shared helpers ─────────────────────────────────────────────────────────────

const SectionHeading = ({ children, color = '#6366f1' }: { children: ReactNode; color?: string }) => (
  <div style={{ borderBottom: `2px solid ${color}`, marginBottom: 8, paddingBottom: 4 }}>
    <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color }}>
      {children}
    </h3>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul style={{ margin: '4px 0 0 0', paddingLeft: 0, listStyle: 'none' }}>
    {items.filter(Boolean).map((item, i) => (
      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3, fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
        <span style={{ color: '#6366f1', marginTop: 2, flexShrink: 0 }}>▸</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// ─── 1. Modern Template ─────────────────────────────────────────────────────────

function ModernTemplate({ resume }: Props) {
  const { personalInfo: pi, experience, education, skills, projects, certifications } = resume;

  return (
    <div className="resume-page" style={{
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      backgroundColor: '#fff',
      padding: '40px 48px',
      minHeight: '297mm',
      color: '#111827',
      fontSize: 11,
      lineHeight: 1.6,
      boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
      borderRadius: 4,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>
              {pi.fullName || 'Your Name'}
            </h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: 9.5, color: '#6b7280' }}>
            {pi.email && <div>{pi.email}</div>}
            {pi.phone && <div>{pi.phone}</div>}
            {pi.location && <div>{pi.location}</div>}
            {pi.linkedin && <div>{pi.linkedin}</div>}
            {pi.github && <div>{pi.github}</div>}
          </div>
        </div>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 2, marginTop: 10 }} />
      </div>

      {/* Summary */}
      {pi.summary && (
        <div style={{ marginBottom: 18 }}>
          <SectionHeading>Professional Summary</SectionHeading>
          <p style={{ fontSize: 10.5, color: '#374151', margin: 0, lineHeight: 1.7 }}>{pi.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <SectionHeading>Experience</SectionHeading>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11.5, color: '#111827' }}>{exp.position}</div>
                  <div style={{ fontSize: 10.5, color: '#6366f1', fontWeight: 600 }}>{exp.company}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 9.5, color: '#6b7280', flexShrink: 0, marginLeft: 10 }}>
                  <div>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                  {exp.location && <div>{exp.location}</div>}
                </div>
              </div>
              {exp.description && <p style={{ fontSize: 10, color: '#4b5563', margin: '4px 0 0' }}>{exp.description}</p>}
              {exp.bullets.filter(Boolean).length > 0 && <BulletList items={exp.bullets} />}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <SectionHeading>Education</SectionHeading>
          {education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 11 }}>{edu.institution}</div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>
                  {edu.degree} {edu.field ? `in ${edu.field}` : ''} {edu.gpa ? `· GPA: ${edu.gpa}` : ''}
                </div>
                {edu.honors && <div style={{ fontSize: 9.5, color: '#6366f1' }}>{edu.honors}</div>}
              </div>
              <div style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, marginLeft: 10 }}>
                {edu.startDate} — {edu.endDate}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <SectionHeading>Skills</SectionHeading>
          {skills.map((group, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: 10 }}>
              <span style={{ fontWeight: 700, color: '#374151' }}>{group.category}: </span>
              <span style={{ color: '#6b7280' }}>{group.items.join(' · ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <SectionHeading>Projects</SectionHeading>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontSize: 11 }}>{proj.name}</div>
                {proj.liveUrl && (
                  <div style={{ fontSize: 9, color: '#6366f1' }}>{proj.liveUrl}</div>
                )}
              </div>
              {proj.technologies.length > 0 && (
                <div style={{ fontSize: 9.5, color: '#6366f1', marginBottom: 2 }}>
                  {proj.technologies.join(' · ')}
                </div>
              )}
              {proj.description && <p style={{ fontSize: 10, color: '#4b5563', margin: '2px 0 0' }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <SectionHeading>Certifications</SectionHeading>
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: 10, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#6b7280' }}> · {cert.issuer}</span>}
              </div>
              {cert.date && <span style={{ color: '#6b7280', fontSize: 9.5 }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 2. Minimal Template ────────────────────────────────────────────────────────

function MinimalTemplate({ resume }: Props) {
  const { personalInfo: pi, experience, education, skills, projects, certifications } = resume;

  return (
    <div className="resume-page" style={{
      fontFamily: "'Plus Jakarta Sans', 'Georgia', serif",
      backgroundColor: '#fff',
      padding: '48px 56px',
      minHeight: '297mm',
      color: '#1a1a1a',
      fontSize: 11,
      lineHeight: 1.65,
      boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
      borderRadius: 4,
    }}>
      {/* Header — ultra clean */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid #e5e7eb', paddingBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 6px', color: '#111' }}>
          {pi.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 9.5, color: '#9ca3af' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github].filter(Boolean).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {pi.summary && (
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 10.5, color: '#4b5563', margin: 0, lineHeight: 1.8, fontStyle: 'italic' }}>{pi.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>Experience</h3>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16 }}>
              <div style={{ paddingTop: 1 }}>
                <div style={{ fontSize: 9.5, color: '#6b7280' }}>{exp.startDate} –</div>
                <div style={{ fontSize: 9.5, color: '#6b7280' }}>{exp.current ? 'Present' : exp.endDate}</div>
                {exp.location && <div style={{ fontSize: 9, color: '#d1d5db', marginTop: 2 }}>{exp.location}</div>}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 11 }}>{exp.position}</div>
                <div style={{ fontSize: 10.5, color: '#6b7280', marginBottom: 4 }}>{exp.company}</div>
                {exp.bullets.filter(Boolean).map((b, bi) => (
                  <div key={bi} style={{ fontSize: 10, color: '#4b5563', marginBottom: 2, paddingLeft: 8 }}>– {b}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>Education</h3>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16 }}>
              <div style={{ fontSize: 9.5, color: '#6b7280' }}>{edu.endDate}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 11 }}>{edu.institution}</div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>{edu.degree} {edu.field ? `· ${edu.field}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>Skills</h3>
          {skills.map((group, i) => (
            <div key={i} style={{ marginBottom: 5, fontSize: 10, display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16 }}>
              <span style={{ color: '#9ca3af' }}>{group.category}</span>
              <span style={{ color: '#374151' }}>{group.items.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 3. Professional Template ──────────────────────────────────────────────────

function ProfessionalTemplate({ resume }: Props) {
  const { personalInfo: pi, experience, education, skills, certifications } = resume;

  return (
    <div className="resume-page" style={{
      fontFamily: "'Plus Jakarta Sans', 'Arial', sans-serif",
      backgroundColor: '#fff',
      minHeight: '297mm',
      color: '#1a1a2e',
      fontSize: 10.5,
      lineHeight: 1.6,
      boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
      borderRadius: 4,
      display: 'grid',
      gridTemplateColumns: '190px 1fr',
    }}>
      {/* Left sidebar */}
      <div style={{ background: '#1a1a2e', padding: '36px 20px', color: '#e2e8f0' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 24, fontWeight: 700, color: '#818cf8' }}>
            {(pi.fullName || 'U')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#818cf8', marginBottom: 4 }}>Contact</div>
          {[pi.email, pi.phone, pi.location].filter(Boolean).map((item, i) => (
            <div key={i} style={{ fontSize: 8.5, color: '#94a3b8', marginBottom: 2, wordBreak: 'break-word' }}>{item}</div>
          ))}
          {(pi.linkedin || pi.github) && (
            <div style={{ marginTop: 8 }}>
              {pi.linkedin && <div style={{ fontSize: 8, color: '#818cf8', marginBottom: 2 }}>{pi.linkedin}</div>}
              {pi.github && <div style={{ fontSize: 8, color: '#818cf8' }}>{pi.github}</div>}
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#818cf8', marginBottom: 8 }}>Skills</div>
            {skills.map((group, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>{group.category}</div>
                {group.items.map((skill, si) => (
                  <div key={si} style={{ fontSize: 8, color: '#cbd5e1', marginBottom: 2 }}>· {skill}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <div style={{ fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#818cf8', marginBottom: 8 }}>Certifications</div>
            {certifications.map((cert, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 8.5, color: '#e2e8f0', fontWeight: 600 }}>{cert.name}</div>
                <div style={{ fontSize: 7.5, color: '#94a3b8' }}>{cert.issuer}</div>
                <div style={{ fontSize: 7, color: '#64748b' }}>{cert.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main content */}
      <div style={{ padding: '36px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', margin: '0 0 2px' }}>{pi.fullName || 'Your Name'}</h1>
          <div style={{ width: 40, height: 3, background: '#6366f1', borderRadius: 2, marginBottom: 10 }} />
        </div>

        {pi.summary && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 6 }}>Profile</div>
            <p style={{ fontSize: 10, color: '#4b5563', margin: 0, lineHeight: 1.7 }}>{pi.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 8 }}>Experience</div>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11 }}>{exp.position}</div>
                    <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 600 }}>{exp.company} {exp.location ? `· ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0 }}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.bullets.filter(Boolean).map((b, bi) => (
                  <div key={bi} style={{ fontSize: 9.5, color: '#4b5563', marginTop: 3, paddingLeft: 10 }}>• {b}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 8 }}>Education</div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 10.5 }}>{edu.institution}</div>
                  <div style={{ fontSize: 9.5, color: '#6b7280' }}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                  {edu.gpa && <div style={{ fontSize: 9, color: '#9ca3af' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0 }}>{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
