/**
 * middleware/validate.js - Request Validation Middleware
 * Uses express-validator to validate and sanitize incoming request bodies
 */

const { validationResult, body } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs after validation rules — returns 400 with field errors if any fail
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('. ');
    return next(new AppError(messages, 400));
  }
  next();
};

// ─── Auth Validation Rules ────────────────────────────────────────────────────

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Resume Validation Rules ──────────────────────────────────────────────────

const resumeRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('template')
    .optional()
    .isIn(['modern', 'minimal', 'professional']).withMessage('Invalid template selection'),
];

// ─── AI Validation Rules ──────────────────────────────────────────────────────

const aiGenerateSummaryRules = [
  body('personalInfo').notEmpty().withMessage('Personal info is required'),
  body('experience').isArray().withMessage('Experience must be an array'),
  body('skills').isArray().withMessage('Skills must be an array'),
];

const aiImproveBulletRules = [
  body('bullet').trim().notEmpty().withMessage('Bullet text is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
];

const aiAtsAnalyzeRules = [
  body('resumeId').notEmpty().withMessage('Resume ID is required'),
  body('jobDescription').trim().notEmpty().withMessage('Job description is required')
    .isLength({ min: 50 }).withMessage('Job description is too short'),
];

const aiSuggestSkillsRules = [
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('existingSkills').optional().isArray().withMessage('Existing skills must be an array'),
  body('jobDescription').optional().isString().withMessage('Job description must be text'),
];

const aiTailorRules = [
  body('resumeId').notEmpty().withMessage('Resume ID is required'),
  body('jobDescription').trim().notEmpty().withMessage('Job description is required')
    .isLength({ min: 50 }).withMessage('Job description is too short'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  resumeRules,
  aiGenerateSummaryRules,
  aiImproveBulletRules,
  aiAtsAnalyzeRules,
  aiSuggestSkillsRules,
  aiTailorRules,
};
