/**
 * utils/AppError.js - Custom Error Class
 * Allows controllers to throw structured errors with HTTP status codes
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Distinguishes operational errors from bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
