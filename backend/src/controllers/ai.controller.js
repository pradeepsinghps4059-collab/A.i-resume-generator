/**
 * controllers/ai.controller.js - AI Feature Controller
 * Routes AI requests to the OpenAI service with rate limiting per user
 */

const Resume = require('../models/Resume');
const User = require('../models/User');
const openaiService = require('../services/openai.service');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Check and increment user's AI usage count.
 * Free users get 20 AI calls/month.
 */
const checkAndIncrementAIUsage = async (user) => {
  const FREE_LIMIT = 20;

  // Reset usage if the reset date has passed
  if (new Date() > user.aiUsage.resetAt) {
    await User.findByIdAndUpdate(user._id, {
      'aiUsage.count': 1,
      'aiUsage.resetAt': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return;
  }

  if (user.plan === 'free' && user.aiUsage.count >= FREE_LIMIT) {
    throw new AppError(`AI usage limit reached (${FREE_LIMIT}/month). Upgrade to Pro for unlimited AI.`, 429);
  }

  await User.findByIdAndUpdate(user._id, { $inc: { 'aiUsage.count': 1 } });
};

/**
 * @desc    Generate professional summary
 * @route   POST /api/ai/generate-summary
 * @access  Protected
 */
const generateSummary = async (req, res, next) => {
  try {
    await checkAndIncrementAIUsage(req.user);

    const { personalInfo, experience, skills, targetRole } = req.body;
    const summary = await openaiService.generateSummary({ personalInfo, experience, skills, targetRole });

    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Improve a bullet point
 * @route   POST /api/ai/improve-bullet
 * @access  Protected
 */
const improveBullet = async (req, res, next) => {
  try {
    await checkAndIncrementAIUsage(req.user);

    const { bullet, jobTitle, company } = req.body;
    const improved = await openaiService.improveBullet(bullet, jobTitle, company);

    res.status(200).json({
      success: true,
      data: { improved },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze resume ATS compatibility
 * @route   POST /api/ai/ats-analyze
 * @access  Protected
 */
const atsAnalyze = async (req, res, next) => {
  try {
    await checkAndIncrementAIUsage(req.user);

    const { resumeId, jobDescription } = req.body;

    // Fetch the resume (ensure ownership)
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return next(new AppError('Resume not found.', 404));
    }

    const analysis = await openaiService.analyzeATS(resume.toObject(), jobDescription);

    // Persist ATS analysis results to the resume
    resume.atsAnalysis = {
      score: analysis.score,
      keywords: analysis.keywords,
      suggestions: analysis.suggestions,
      scoreBreakdown: analysis.scoreBreakdown,
      tailoringSuggestions: analysis.tailoringSuggestions || [],
      jobDescription: jobDescription.substring(0, 2000),
      analyzedAt: new Date(),
    };
    await resume.save();

    logger.info(`ATS analysis completed for resume ${resumeId}: score ${analysis.score}`);

    res.status(200).json({
      success: true,
      data: { analysis, resumeId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Suggest skills for a job title
 * @route   POST /api/ai/suggest-skills
 * @access  Protected
 */
const suggestSkills = async (req, res, next) => {
  try {
    await checkAndIncrementAIUsage(req.user);

    const { jobTitle, existingSkills, jobDescription } = req.body;
    const skills = await openaiService.suggestSkills(jobTitle, existingSkills, jobDescription);

    res.status(200).json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tailoring suggestions for a specific job
 * @route   POST /api/ai/tailor
 * @access  Protected
 */
const tailorForJob = async (req, res, next) => {
  try {
    await checkAndIncrementAIUsage(req.user);

    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return next(new AppError('Resume not found.', 404));
    }

    const suggestions = await openaiService.tailorForJob(resume.toObject(), jobDescription);

    resume.atsAnalysis = {
      ...(resume.atsAnalysis?.toObject?.() || resume.atsAnalysis || {}),
      score: resume.atsAnalysis?.score ?? null,
      keywords: resume.atsAnalysis?.keywords || { found: [], missing: [], suggested: [] },
      suggestions: resume.atsAnalysis?.suggestions || [],
      scoreBreakdown: resume.atsAnalysis?.scoreBreakdown || {
        keywordMatch: 0,
        experienceMatch: 0,
        skillsMatch: 0,
        formatScore: 0,
      },
      tailoringSuggestions: suggestions,
      jobDescription: jobDescription.substring(0, 2000),
      analyzedAt: new Date(),
    };
    await resume.save();

    res.status(200).json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateSummary, improveBullet, atsAnalyze, suggestSkills, tailorForJob };
