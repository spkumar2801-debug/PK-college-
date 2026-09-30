import {
  uploadImageToCloudinary,
  validateImageFile,
  type CloudinaryUploadResult,
} from "./cloudinary";

export interface UploadResult {
  url: string; // Permanent Cloudinary secure_url
  source: "cloudinary";
  path: string; // Cloudinary public_id
  publicId: string;
  filename: string;
  sizeBytes: number;
}

export interface MediaValidationOptions {
  allowedExtensions?: string[];
  allowSvg?: boolean;
  allowPdf?: boolean;
  maxSizeMB?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file before upload based on size, extension, and security rules.
 */
export function validateMediaFile(
  file: File,
  options: MediaValidationOptions = {},
): ValidationResult {
  const { allowedExtensions = ["jpg", "jpeg", "png", "webp"], allowSvg = false, maxSizeMB = 10 } = options;
  const exts = [...allowedExtensions];
  if (allowSvg && !exts.includes("svg")) exts.push("svg");

  return validateImageFile(file, { maxSizeMB, allowedExtensions: exts });
}

/**
 * Uploads an image file to Cloudinary with format and size validation.
 * Uses the ONE centralized Cloudinary service and returns permanent secure_url.
 */
export async function uploadMediaFile(
  file: File,
  _folder: string = "general",
  options: MediaValidationOptions = {},
): Promise<UploadResult> {
  const { allowSvg = false, allowedExtensions = ["jpg", "jpeg", "png", "webp"], maxSizeMB = 10 } = options;
  const exts = [...allowedExtensions];
  if (allowSvg && !exts.includes("svg")) exts.push("svg");

  const result: CloudinaryUploadResult = await uploadImageToCloudinary(file, {
    maxSizeMB,
    allowedExtensions: exts,
    timeoutMs: 30000,
  });

  return {
    url: result.secure_url,
    source: "cloudinary",
    path: result.public_id,
    publicId: result.public_id,
    filename: result.original_filename || file.name,
    sizeBytes: result.bytes || file.size,
  };
}

export { uploadImageToCloudinary };

