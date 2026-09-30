import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  X,
  Save,
  RefreshCw,
  AlertCircle,
  Trash2,
  Calendar,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import type { CollegeEvent } from "@/data/site";
import { validateMediaFile, uploadMediaFile } from "@/lib/media-upload";

interface EventModalProps {
  isOpen: boolean;
  event: CollegeEvent | null;
  onClose: () => void;
  onSave: (
    data: Omit<CollegeEvent, "id"> & { id?: string },
    imageFile: File | null,
    imageRemoved: boolean,
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function EventModal({
  isOpen,
  event,
  onClose,
  onSave,
  onDelete,
}: EventModalProps) {
  const isEdit = Boolean(event);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CollegeEvent["category"]>("Technical");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setCategory(event.category || "Technical");
      setDate(event.date || "");
      setTime(event.time || "");
      setVenue(event.venue || "");
      setDescription(event.description || "");
      setRegistrationOpen(event.registrationOpen !== false);
    } else {
      setTitle("");
      setCategory("Technical");
      setDate("");
      setTime("10:00 AM - 4:00 PM");
      setVenue("Main Auditorium");
      setDescription("");
      setRegistrationOpen(true);
    }
    setPendingFile(null);
    setPendingPreview(null);
    setImageRemoved(false);
    setErrorMessage("");
    setIsSaving(false);
  }, [event, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const currentImageUrl = event?.image || "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Event Title is required.");
      return;
    }
    if (!date.trim()) {
      setErrorMessage("Event Date is required (e.g. October 20, 2026).");
      return;
    }
    if (!venue.trim()) {
      setErrorMessage("Event Venue is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await onSave(
        {
          ...(event?.id ? { id: event.id } : {}),
          title: title.trim(),
          category,
          date: date.trim(),
          time: time.trim(),
          venue: venue.trim(),
          description: description.trim(),
          registrationOpen,
          image: imageRemoved ? "" : currentImageUrl,
        },
        pendingFile,
        imageRemoved,
      );
      onClose();
    } catch (err: any) {
      console.error("Event save error:", err);
      setErrorMessage(err.message || "Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full my-auto flex flex-col max-h-[92vh] overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#0b224d] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" />
              <span>{isEdit ? `Edit Event: ${event?.title}` : "Add Campus Event / Symposium"}</span>
            </h3>
            <p className="text-[11px] text-amber-300 font-medium">
              Synchronizes to public events calendar and upcoming symposia listing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-semibold flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Event Banner Image */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-amber-600" />
                  <span>Event Poster / Image Banner</span>
                </label>
                <span className="text-[10px] text-slate-500">Max size: 5 MB</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 h-16 bg-slate-200 rounded border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                  {pendingPreview ? (
                    <img src={pendingPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : !imageRemoved && currentImageUrl ? (
                    <img src={currentImageUrl} alt={title || "Event"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-slate-400 font-semibold text-center p-1">No Image</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5"
                    >
                      <Upload size={12} />
                      <span>{pendingFile || currentImageUrl ? "Replace Banner" : "Upload Banner"}</span>
                    </button>
                    {(pendingFile || (!imageRemoved && currentImageUrl)) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPendingFile(null);
                          setPendingPreview(null);
                          setImageRemoved(true);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="bg-slate-200 text-slate-700 hover:text-red-700 px-2.5 py-1.5 rounded font-semibold text-xs flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  {pendingFile && (
                    <p className="text-[10px] text-emerald-700 font-medium">
                      Selected: {pendingFile.name} ({(pendingFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Event Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Symposium on Generative AI & Robotics"
                required
                className="w-full p-2.5 border border-slate-300 rounded font-semibold text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Event Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. October 20, 2026"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 4:00 PM"
                  className="w-full p-2.5 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Venue <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Main Auditorium, Block A"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of symposium, speaker sessions, eligibility, certificates..."
                className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="event-reg"
                checked={registrationOpen}
                onChange={(e) => setRegistrationOpen(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0b224d]"
              />
              <label htmlFor="event-reg" className="font-bold text-slate-800 cursor-pointer">
                Registration Open (Show Active Registration Status)
              </label>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              {isEdit && onDelete && event && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    if (window.confirm(`Delete event "${event.title}"?`)) {
                      setIsSaving(true);
                      await onDelete(event.id);
                      onClose();
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Delete Event</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>{isEdit ? "Update Event" : "Publish Event"}</span>
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
