/**
 * Official Centralized Cloudinary Upload Service for PK College of Engineering & Technology
 * Unsigned browser uploads directly to Cloudinary.
 * Never exposes API Secret in client code.
 */

export const CLOUDINARY_CLOUD_NAME =
  (import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined)?.trim() || "e8mmudhk";
export const CLOUDINARY_UPLOAD_PRESET =
  (import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] as string | undefined)?.trim() || "Pk college";

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at?: string;
  original_filename?: string;
}

export interface CloudinaryUploadOptions {
  timeoutMs?: number;
  maxSizeMB?: number;
  allowedExtensions?: string[];
}

/**
 * Translates Cloudinary HTTP errors and response payloads into clear,
 * actionable institutional error messages for the administrator.
 */
export function formatCloudinaryError(status: number, data: any, originalError?: any): string {
  const serverMsg = data?.error?.message || originalError?.message || "";

  if (serverMsg.toLowerCase().includes("upload preset not found") || serverMsg.toLowerCase().includes("preset")) {
    return `Cloudinary error: Upload preset "${CLOUDINARY_UPLOAD_PRESET}" was not found or is misconfigured in cloud "${CLOUDINARY_CLOUD_NAME}". Please verify unsigned upload settings in Cloudinary Console.`;
  }

  if (serverMsg.toLowerCase().includes("unsigned upload has not been enabled") || serverMsg.toLowerCase().includes("unsigned")) {
    return `Cloudinary error: Unsigned upload is disabled for preset "${CLOUDINARY_UPLOAD_PRESET}". Please mark this preset as "Unsigned" in the Cloudinary Settings > Upload Presets.`;
  }

  if (serverMsg.toLowerCase().includes("cloud name not found") || status === 404) {
    return `Cloudinary error: Cloud account "${CLOUDINARY_CLOUD_NAME}" was not found (404). Please verify VITE_CLOUDINARY_CLOUD_NAME.`;
  }

  if (status === 401 || status === 403) {
    return `Cloudinary permission denied (${status}): ${serverMsg || "Unauthorized upload attempt. Please check upload preset permissions."}`;
  }

  if (status === 400) {
    return `Cloudinary upload rejected (400): ${serverMsg || "Invalid image file or parameters."}`;
  }

  if (serverMsg.toLowerCase().includes("timeout") || originalError?.name === "AbortError") {
    return "Cloudinary upload timed out. The server did not respond in time. Please check your internet connection and try again.";
  }

  if (originalError?.message && (originalError.message.includes("Failed to fetch") || originalError.message.includes("NetworkError"))) {
    return "Network error: Unable to reach Cloudinary (api.cloudinary.com). Please verify internet connectivity.";
  }

  return `Cloudinary upload failed: ${serverMsg || "Unknown error occurred during media upload."}`;
}

/**
 * Validates file format and size before transmitting to Cloudinary.
 */
export function validateImageFile(
  file: File,
  options: { maxSizeMB?: number; allowedExtensions?: string[] } = {}
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file was selected for upload." };
  }

  const { maxSizeMB = 10, allowedExtensions = ["jpg", "jpeg", "png", "webp", "svg"] } = options;

  if (file.size === 0) {
    return { valid: false, error: "The selected file is empty (0 bytes). Please choose a valid image file." };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image is too large (${sizeInMB} MB). Maximum allowed limit is ${maxSizeMB} MB. Please select a smaller image.`,
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const dangerousExts = ["exe", "bat", "cmd", "sh", "php", "js", "html", "htm", "vbs", "ps1", "jar", "bin"];
  if (dangerousExts.includes(ext)) {
    return {
      valid: false,
      error: `Security alert: Executable or script files (.${ext}) are not permitted.`,
    };
  }

  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported format .${ext}. Please select an image in ${allowedExtensions.map((e) => e.toUpperCase()).join(", ")} format.`,
    };
  }

  return { valid: true };
}

/**
 * ONE Centralized Cloudinary Upload Service: uploadImageToCloudinary
 *
 * It:
 * - validates file
 * - creates FormData
 * - adds file
 * - adds upload_preset
 * - uploads to Cloudinary
 * - verifies response.ok
 * - parses response
 * - returns secure_url and public_id
 * - handles errors
 */
export async function uploadImageToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { timeoutMs = 30000, maxSizeMB = 10, allowedExtensions } = options;

  // 1. Validate file
  const validation = validateImageFile(
    file,
    allowedExtensions ? { maxSizeMB, allowedExtensions } : { maxSizeMB }
  );
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed.");
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary configuration missing: VITE_CLOUDINARY_CLOUD_NAME is not set.");
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration missing: VITE_CLOUDINARY_UPLOAD_PRESET is not set.");
  }

  // 2. Create FormData containing file and upload_preset
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // 3. Upload with timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Cloudinary upload failed HTTP:", response.status, data);
      throw new Error(formatCloudinaryError(response.status, data));
    }

    if (!data || !data.secure_url) {
      console.error("Malformed Cloudinary response:", data);
      throw new Error("Cloudinary returned a malformed response without a secure_url.");
    }

    return {
      secure_url: data.secure_url,
      public_id: data.public_id || "",
      format: data.format || "",
      bytes: data.bytes || file.size,
      width: data.width,
      height: data.height,
      created_at: data.created_at,
      original_filename: data.original_filename || file.name,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Cloudinary upload timed out after ${Math.round(timeoutMs / 1000)} seconds. Please try again.`);
    }
    if (err.message && (err.message.startsWith("Cloudinary") || err.message.startsWith("Unsupported") || err.message.startsWith("Image is too large"))) {
      throw err;
    }
    console.error("Cloudinary upload exception:", err);
    throw new Error(formatCloudinaryError(0, null, err));
  }
}

// Backward-compatible alias for existing callers
export const uploadToCloudinary = uploadImageToCloudinary;

