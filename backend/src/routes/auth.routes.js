/**
 * routes/auth.routes.js - Authentication Routes
 */

const express = require('express');
const router = express.Router();
const {
  register, login, refreshToken, getMe, logout, updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const {
  registerRules, loginRules, validate,
} = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

// Stricter rate limit for auth endpoints
const authLimiter = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10,
      message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
    });

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

module.exports = router;
