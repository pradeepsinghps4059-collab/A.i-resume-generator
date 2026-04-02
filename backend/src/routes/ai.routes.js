/**
 * routes/ai.routes.js - AI Feature Routes
 */

const express = require('express');
const router = express.Router();
const {
  generateSummary, improveBullet, atsAnalyze, suggestSkills, tailorForJob,
} = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');
const {
  aiGenerateSummaryRules, aiImproveBulletRules, aiAtsAnalyzeRules, aiSuggestSkillsRules, aiTailorRules, validate,
} = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

// AI-specific rate limiter — stricter than the global limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 20,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait before making more AI requests.',
  },
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

// All AI routes require auth
router.use(protect);
router.use(aiLimiter);

router.post('/generate-summary', aiGenerateSummaryRules, validate, generateSummary);
router.post('/improve-bullet', aiImproveBulletRules, validate, improveBullet);
router.post('/ats-analyze', aiAtsAnalyzeRules, validate, atsAnalyze);
router.post('/suggest-skills', aiSuggestSkillsRules, validate, suggestSkills);
router.post('/tailor', aiTailorRules, validate, tailorForJob);

module.exports = router;
