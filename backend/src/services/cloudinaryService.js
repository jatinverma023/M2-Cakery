const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const DEFAULT_FOLDER = 'm2-cakery/products';

/**
 * Validate image buffer metadata before upload.
 *
 * @param {object} file
 * @param {string} file.mimetype
 * @param {number} file.size
 */
function validateImageFile(file) {
  if (!file) {
    throw new Error('No image file provided');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Invalid image type: '${file.mimetype}'. Allowed formats are JPEG, PNG, and WebP.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image exceeds the maximum allowed size of 5MB');
  }

  return true;
}

/**
 * Upload an image buffer to Cloudinary using upload_stream.
 * Never writes image binaries to local disk.
 *
 * @param {Buffer} buffer - Raw file buffer
 * @param {object} [options]
 * @param {string} [options.folder] - Target folder in Cloudinary
 * @param {boolean} [options.isPrimary] - Whether this is primary image
 * @returns {Promise<{ url: string, publicId: string, isPrimary: boolean }>}
 */
async function uploadImageBuffer(buffer, options = {}) {
  if (!isCloudinaryConfigured()) {
    const error = new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
    error.statusCode = 503;
    error.isCloudinaryError = true;
    throw error;
  }

  if (!buffer || !Buffer.isBuffer(buffer)) {
    const error = new Error('Invalid file buffer supplied for upload');
    error.statusCode = 400;
    throw error;
  }

  const folder = options.folder || DEFAULT_FOLDER;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp', // Standardize to high-efficiency webp
        quality: 'auto:good',
      },
      (error, result) => {
        if (error) {
          const rawMessage = error.message || '';
          const httpCode =
            error.http_code ||
            (rawMessage.includes('403') ? 403 : rawMessage.includes('401') ? 401 : null);

          const maskedApiKey = process.env.CLOUDINARY_API_KEY
            ? `${process.env.CLOUDINARY_API_KEY.slice(0, 4)}...`
            : 'not configured';
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'not configured';

          let clientMessage = `Cloudinary upload failed: ${rawMessage}`;
          let statusCode = 502;

          if (httpCode === 403) {
            console.error('[Cloudinary Diagnostic] Upload rejected: HTTP 403 Forbidden.');
            console.error(`[Cloudinary Diagnostic] Target Cloud Name: '${cloudName}', API Key: '${maskedApiKey}'`);
            console.error(
              '[Cloudinary Diagnostic] Root Cause: Upstream storage service rejected upload due to missing permissions (e.g. actions=["create"]) or account/plan restrictions.'
            );
            console.error(
              '[Cloudinary Diagnostic] Troubleshooting Action: Log in to Cloudinary Console > Settings > Access Keys / Permissions to ensure upload permissions are enabled for this key.'
            );

            clientMessage =
              'Cloudinary upload failed: Storage service permission error (HTTP 403). Please verify Cloudinary account and API key permissions.';
            statusCode = 502;
          } else if (httpCode === 401) {
            console.error('[Cloudinary Diagnostic] Upload rejected: HTTP 401 Unauthorized.');
            console.error(`[Cloudinary Diagnostic] Target Cloud Name: '${cloudName}', API Key: '${maskedApiKey}'`);
            console.error('[Cloudinary Diagnostic] Root Cause: Invalid Cloudinary API Key or Secret.');
            console.error(
              '[Cloudinary Diagnostic] Troubleshooting Action: Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.'
            );

            clientMessage =
              'Cloudinary upload failed: Authentication error (HTTP 401). Please verify Cloudinary credentials in configuration.';
            statusCode = 502;
          } else if (error.http_code === 400 || rawMessage.includes('Invalid image')) {
            console.error(`[Cloudinary Diagnostic] Upload rejected: HTTP 400 Bad Request (${rawMessage}).`);
            clientMessage = `Cloudinary upload failed: Invalid image format or corrupted file (${rawMessage}).`;
            statusCode = 400;
          } else {
            console.error(
              `[Cloudinary Diagnostic] Upload failed (${error.http_code || 'N/A'}): ${rawMessage}`
            );
            statusCode = 502;
          }

          const uploadErr = new Error(clientMessage);
          uploadErr.statusCode = statusCode;
          uploadErr.isCloudinaryError = true;
          return reject(uploadErr);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: Boolean(options.isPrimary),
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a single image asset from Cloudinary by its publicId.
 *
 * @param {string} publicId
 * @returns {Promise<{ success: boolean, publicId: string }>}
 */
async function deleteImage(publicId) {
  if (!publicId) return { success: true, publicId: '' };

  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary returned status: ${result.result}`);
    }
    return { success: true, publicId };
  } catch (error) {
    throw new Error(`Failed to delete Cloudinary asset (${publicId}): ${error.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary concurrently.
 *
 * @param {string[]} publicIds
 * @returns {Promise<Array<{ success: boolean, publicId: string }>>}
 */
async function deleteMultipleImages(publicIds = []) {
  const validIds = publicIds.filter(Boolean);
  if (validIds.length === 0) return [];
  return Promise.all(validIds.map((id) => deleteImage(id)));
}

module.exports = {
  validateImageFile,
  uploadImageBuffer,
  deleteImage,
  deleteMultipleImages,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
};
