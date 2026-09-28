import { useState, useRef } from 'react';
import productApi from '../api/productApi';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({ onImagesUploaded, currentImageCount = 0 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setErrorMessage(null);
    const validFiles = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a supported format. Please upload JPEG, PNG, or WebP.`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadedResults = [];
    const errors = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const isFirstUploaded = currentImageCount === 0 && i === 0;

      try {
        const response = await productApi.uploadImage(file, isFirstUploaded);
        if (response?.data) {
          uploadedResults.push({
            url: response.data.url,
            publicId: response.data.publicId,
            isPrimary: isFirstUploaded,
          });
        }
      } catch (err) {
        errors.push(`${file.name}: ${err.message || 'Upload failed'}`);
      }
    }

    setUploading(false);

    if (errors.length > 0) {
      setErrorMessage(errors.join('; '));
    }

    if (uploadedResults.length > 0) {
      onImagesUploaded(uploadedResults);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="admin-uploader-box">
      <div
        className={`admin-dropzone ${isDragging ? 'is-dragging' : ''} ${uploading ? 'is-uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Click or drag photos here to upload to Cloudinary"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />

        <div className="admin-dropzone-content">
          <div className="admin-dropzone-icon" aria-hidden="true">
            {uploading ? '⏳' : '📷'}
          </div>

          <div className="admin-dropzone-text">
            {uploading ? (
              <p className="admin-dropzone-primary">Uploading to Cloudinary...</p>
            ) : (
              <>
                <p className="admin-dropzone-primary">
                  <span>Click to browse</span> or drag and drop photos here
                </p>
                <p className="admin-dropzone-hint">
                  Supports JPEG, PNG, and WebP (up to 5MB each)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="admin-uploader-error" role="alert">
          <span className="admin-error-icon" aria-hidden="true">
            ⚠
          </span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
