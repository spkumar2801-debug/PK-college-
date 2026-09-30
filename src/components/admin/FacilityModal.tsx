import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import type { CollegeFacility } from "@/data/site";
import { validateMediaFile, uploadMediaFile } from "@/lib/media-upload";

interface FacilityModalProps {
  isOpen: boolean;
  facility: CollegeFacility | null; // null => Add Mode, object => Edit Mode
  onClose: () => void;
  onSave: (
    data: Omit<CollegeFacility, "id"> & { id?: string },
    imageFile: File | null,
    imageRemoved: boolean,
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function FacilityModal({
  isOpen,
  facility,
  onClose,
  onSave,
  onDelete,
}: FacilityModalProps) {
  const isEdit = Boolean(facility);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [published, setPublished] = useState(true);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync state whenever modal opens or active facility changes
  useEffect(() => {
    if (facility) {
      setTitle(facility.title || "");
      setTagline(facility.tagline || "");
      setDescription(facility.description || "");
      setKeyFeaturesText((facility.keyFeatures || []).join("\n"));
      setPublished(facility.published !== false);
    } else {
      setTitle("");
      setTagline("");
      setDescription("");
      setKeyFeaturesText("");
      setPublished(true);
    }
    setPendingFile(null);
    setPendingPreview(null);
    setImageRemoved(false);
    setImageLoadError(false);
    setErrorMessage("");
    setIsSaving(false);
  }, [facility, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const currentImageUrl = facility?.image || "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate using institutional standard
    const validation = validateMediaFile(file, {
      allowedExtensions: ["jpg", "jpeg", "png", "webp"],
      maxSizeMB: 5,
    });

    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file selected.");
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setPendingFile(file);
    setImageRemoved(false);
    setImageLoadError(false);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPendingFile(null);
    setPendingPreview(null);
    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Facility Name / Title is required.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Facility Description is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      // Parse key features from newline separated text
      const features = keyFeaturesText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      await onSave(
        {
          ...(facility?.id ? { id: facility.id } : {}),
          title: title.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          keyFeatures: features,
          image: imageRemoved ? "" : currentImageUrl,
          published,
        },
        pendingFile,
        imageRemoved,
      );

      onClose();
    } catch (err: any) {
      console.error("Facility save error:", err);
      setErrorMessage(err.message || "Failed to save facility. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facility-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full my-auto flex flex-col max-h-[92vh] overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0b224d] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div>
            <h3 id="facility-modal-title" className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
              {isEdit ? `Edit Facility: ${facility?.title}` : "Add New Campus Facility"}
            </h3>
            <p className="text-[11px] text-amber-300 font-medium">
              Campus & Infrastructure CMS · Synchronizes live to public facilities page
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-semibold flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* 1. Facility Image Section */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-amber-600" />
                  <span>Facility Photograph</span>
                </label>
                <span className="text-[10px] text-slate-500">Max size: 5 MB · JPG, PNG, WEBP</span>
              </div>

              {/* Preview Box */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-44 h-28 bg-slate-200 rounded-md border border-slate-300 overflow-hidden relative flex items-center justify-center shrink-0">
                  {pendingPreview ? (
                    <img
                      src={pendingPreview}
                      alt="Pending upload preview"
                      className="w-full h-full object-cover"
                    />
                  ) : !imageRemoved && currentImageUrl && !imageLoadError ? (
                    <img
                      src={currentImageUrl}
                      alt={title || "Current facility image"}
                      className="w-full h-full object-cover"
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <ImageIcon size={28} className="mx-auto mb-1 opacity-40" />
                      <span className="text-[10px] block font-medium">
                        {imageRemoved ? "Photo Removed" : "No Photo Assigned"}
                      </span>
                    </div>
                  )}

                  {pendingPreview && (
                    <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow-xs">
                      New Selected
                    </span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Upload size={13} />
                      <span>{pendingFile || currentImageUrl ? "Replace Photo" : "Upload Photo"}</span>
                    </button>

                    {(pendingFile || (!imageRemoved && currentImageUrl)) && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-700 px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1.5 transition"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {pendingFile && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Selected: <strong>{pendingFile.name}</strong> ({(pendingFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                  {!pendingFile && currentImageUrl && !imageRemoved && (
                    <p className="text-[10px] text-slate-500">
                      Currently using official campus facility photography.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Facility Title */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Facility Name / Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Central Digital Library & Information Centre"
                required
                className="w-full p-2.5 border border-slate-300 rounded font-semibold text-xs focus:border-[#0b224d]"
              />
            </div>

            {/* 3. Tagline */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Tagline / Highlight Summary
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. A comprehensive repository of scientific and engineering knowledge"
                className="w-full p-2.5 border border-slate-300 rounded text-xs"
              />
            </div>

            {/* 4. Description */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive description of equipment, study spaces, lab capabilities..."
                required
                className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
              />
            </div>

            {/* 5. Key Features List */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 uppercase">
                  Key Features / Lab Capabilities
                </label>
                <span className="text-[10px] text-slate-500">Enter one feature per line</span>
              </div>
              <textarea
                rows={4}
                value={keyFeaturesText}
                onChange={(e) => setKeyFeaturesText(e.target.value)}
                placeholder="Open access lending system&#10;Digital library wing with computer terminals&#10;Subscriptions to IEEE/Springer engineering journals&#10;Spacious quiet reading hall for students"
                className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                These bullet points appear in the facility cards on the public website and in admissions collateral.
              </p>
            </div>

            {/* 6. Visibility Status */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="facility-published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0b224d]"
              />
              <label htmlFor="facility-published" className="font-bold text-slate-800 cursor-pointer">
                Publish Facility (Visible on Public Website)
              </label>
            </div>
          </div>

          {/* Modal Footer (Sticky) */}
          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              {isEdit && onDelete && facility && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    const confirmed = window.confirm(
                      `Are you sure you want to permanently delete "${facility.title}" from the public website and Firestore?`,
                    );
                    if (confirmed) {
                      setIsSaving(true);
                      try {
                        await onDelete(facility.id);
                        onClose();
                      } catch (err: any) {
                        setErrorMessage(err.message || "Failed to delete facility.");
                        setIsSaving(false);
                      }
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  <span>Delete Facility</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Facility</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
