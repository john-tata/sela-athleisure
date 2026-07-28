const AppError = require('../utils/AppError');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      })
      .join(', ');

    return next(new AppError(message, 400, 'VALIDATION_ERROR'));
  }

  req.body = result.data;
  next();
};