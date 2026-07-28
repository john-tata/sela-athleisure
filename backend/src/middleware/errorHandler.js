const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code || 'ERROR',
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: err.errors?.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') || 'Validation error',
      code: 'VALIDATION_ERROR',
    });
  }

  // Supabase errors
  if (err.code && err.message) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
  }

  // Generic error
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};

module.exports = errorHandler;
