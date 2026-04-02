/**
 * controllers/resume.controller.js - Resume CRUD Controller
 */

const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all resumes for authenticated user
 * @route   GET /api/resumes
 * @access  Protected
 */
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('title template createdAt lastEditedAt atsAnalysis.score personalInfo.fullName')
      .sort({ lastEditedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: { resumes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single resume by ID
 * @route   GET /api/resumes/:id
 * @access  Protected (owner only)
 */
const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return next(new AppError('Resume not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 * @access  Protected
 */
const createResume = async (req, res, next) => {
  try {
    // Enforce resume limit for free plan users
    const FREE_PLAN_LIMIT = 3;
    if (req.user.plan === 'free') {
      const count = await Resume.countDocuments({ user: req.user._id });
      if (count >= FREE_PLAN_LIMIT) {
        return next(new AppError(`Free plan allows up to ${FREE_PLAN_LIMIT} resumes. Upgrade to Pro for unlimited.`, 403));
      }
    }

    const resume = await Resume.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a resume (full or partial)
 * @route   PUT /api/resumes/:id
 * @access  Protected (owner only)
 */
const updateResume = async (req, res, next) => {
  try {
    // Fields that cannot be updated via this endpoint
    const { user, _id, ...updateData } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...updateData, lastEditedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return next(new AppError('Resume not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated',
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Protected (owner only)
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return next(new AppError('Resume not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Duplicate a resume
 * @route   POST /api/resumes/:id/duplicate
 * @access  Protected (owner only)
 */
const duplicateResume = async (req, res, next) => {
  try {
    const source = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!source) {
      return next(new AppError('Resume not found.', 404));
    }

    const sourceObj = source.toObject();
    delete sourceObj._id;
    delete sourceObj.createdAt;
    delete sourceObj.updatedAt;

    const duplicate = await Resume.create({
      ...sourceObj,
      title: `${source.title} (Copy)`,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Resume duplicated',
      data: { resume: duplicate },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResumes, getResume, createResume, updateResume, deleteResume, duplicateResume };
