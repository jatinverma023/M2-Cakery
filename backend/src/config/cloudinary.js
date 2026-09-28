const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary SDK using environment variables.
 * Does not throw immediately if variables are unconfigured, but marks availability.
 */
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured: () => isConfigured,
};
