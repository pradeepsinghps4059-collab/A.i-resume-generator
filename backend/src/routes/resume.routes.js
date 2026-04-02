/**
 * routes/resume.routes.js - Resume CRUD Routes
 */

const express = require('express');
const router = express.Router();
const {
  getResumes, getResume, createResume, updateResume, deleteResume, duplicateResume,
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth');
const { resumeRules, validate } = require('../middleware/validate');

// All resume routes require authentication
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(resumeRules, validate, createResume);

router.route('/:id')
  .get(getResume)
  .put(resumeRules, validate, updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);

module.exports = router;
