/**
 * models/Resume.js - Resume Schema
 * Full resume data model with all sections and metadata
 */

const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  summary: { type: String, default: '' },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' }, // 'Present' or date string
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  // AI-enhanced bullet points stored as array
  bullets: [{ type: String }],
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  honors: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  liveUrl: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  bullets: [{ type: String }],
});

const skillsSchema = new mongoose.Schema({
  category: { type: String, default: 'Technical Skills' },
  items: [{ type: String }],
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  url: { type: String, default: '' },
});

// ─── ATS Analysis Result Schema ───────────────────────────────────────────────
const atsAnalysisSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100, default: null },
  keywords: {
    found: [String],
    missing: [String],
    suggested: [String],
  },
  suggestions: [String],
  scoreBreakdown: {
    keywordMatch: { type: Number, min: 0, max: 40, default: 0 },
    experienceMatch: { type: Number, min: 0, max: 30, default: 0 },
    skillsMatch: { type: Number, min: 0, max: 20, default: 0 },
    formatScore: { type: Number, min: 0, max: 10, default: 0 },
  },
  tailoringSuggestions: [String],
  jobDescription: { type: String, default: '' },
  analyzedAt: { type: Date, default: null },
}, { _id: false });

// ─── Main Resume Schema ───────────────────────────────────────────────────────
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: 'My Resume',
    },
    template: {
      type: String,
      enum: ['modern', 'minimal', 'professional'],
      default: 'modern',
    },
    personalInfo: {
      type: personalInfoSchema,
      default: () => ({}),
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    skills: {
      type: [skillsSchema],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    // Ordered list of sections for custom layout
    sectionOrder: {
      type: [String],
      default: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    },
    // ATS analysis results
    atsAnalysis: {
      type: atsAnalysisSchema,
      default: null,
    },
    // Metadata
    isPublic: {
      type: Boolean,
      default: false,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index for efficient querying ────────────────────────────────────────────
resumeSchema.index({ user: 1, createdAt: -1 });

// ─── Pre-save: Update lastEditedAt ───────────────────────────────────────────
resumeSchema.pre('save', function (next) {
  this.lastEditedAt = new Date();
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
