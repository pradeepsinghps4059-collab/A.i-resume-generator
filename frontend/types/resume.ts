// types/resume.ts - Shared TypeScript types for the resume application

export type Template = 'modern' | 'minimal' | 'professional';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Experience {
  _id?: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  repoUrl: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
}

export interface ATSAnalysis {
  score: number | null;
  keywords: {
    found: string[];
    missing: string[];
    suggested: string[];
  };
  suggestions: string[];
  jobDescription: string;
  analyzedAt: string | null;
  scoreBreakdown: {
    keywordMatch: number;
    experienceMatch: number;
    skillsMatch: number;
    formatScore: number;
  } | null;
  tailoringSuggestions: string[];
}

export interface Resume {
  _id: string;
  user: string;
  title: string;
  template: Template;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  sectionOrder: string[];
  atsAnalysis: ATSAnalysis | null;
  isPublic: boolean;
  lastEditedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListItem {
  _id: string;
  title: string;
  template: Template;
  createdAt: string;
  lastEditedAt: string;
  personalInfo: { fullName: string };
  atsAnalysis: { score: number | null } | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  plan: 'free' | 'pro';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ActiveSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'ats';
