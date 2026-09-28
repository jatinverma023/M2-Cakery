/**
 * Health check controller.
 * Returns public operational status and safe environment name.
 * Does not expose sensitive configuration, secrets, or internal paths.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'M² Cakery API is running',
    environment: process.env.NODE_ENV || 'development',
  });
};
