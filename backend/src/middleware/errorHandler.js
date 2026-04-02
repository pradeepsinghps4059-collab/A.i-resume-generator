/**
 * middleware/errorHandler.js - Global Error Handler
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Log error
  if (process.env.NODE_ENV !== 'test') {
    logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  }

  // ─── Mongoose Bad ObjectId ──────────────────────────────────────────────────
  if (err.name === 'CastError') {
    error = { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
  }

  // ─── Mongoose Duplicate Key ─────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = { statusCode: 409, message: `An account with this ${field} already exists.` };
  }

  // ─── Mongoose Validation Error ──────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = { statusCode: 400, message: messages.join('. ') };
  }

  // ─── JWT Errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = { statusCode: 401, message: 'Invalid token. Please log in again.' };
  }

  if (err.name === 'TokenExpiredError') {
    error = { statusCode: 401, message: 'Token expired. Please log in again.' };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
