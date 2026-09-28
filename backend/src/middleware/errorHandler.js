/**
 * Centralized Error Handling Middleware.
 * Catches errors from routes/controllers and formats a clean, safe JSON response.
 *
 * Prevents leaking:
 * - Stack traces
 * - Database connection strings or internal paths
 * - Sensitive environment details
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // Determine appropriate HTTP status code
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  const isProduction = process.env.NODE_ENV === 'production';

  // Format client-facing message
  let message = err.message || 'Something went wrong';

  // Handle Mongoose-specific errors cleanly
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image exceeds the maximum allowed size of 5MB'
        : `Upload error: ${err.message}`;
  }

  // Obscure 500 internal server error details in production
  if (isProduction && statusCode === 500) {
    message = 'Internal server error';
  }

  // Server-side logging (retains details in server console for operational monitoring without leaking to client response)
  console.error(`[Error] ${statusCode} - ${req.method} ${req.originalUrl}:`, err.message);
  if (!isProduction && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
