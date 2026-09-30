import { useState, useEffect, type FormEvent } from "react";
import { X, Save, RefreshCw, AlertCircle, Trash2, Bell } from "lucide-react";
import type { Announcement } from "@/data/site";

interface AnnouncementModalProps {
  isOpen: boolean;
  announcement: Announcement | null;
  onClose: () => void;
  onSave: (data: Omit<Announcement, "id"> & { id?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function AnnouncementModal({
  isOpen,
  announcement,
  onClose,
  onSave,
  onDelete,
}: AnnouncementModalProps) {
  const isEdit = Boolean(announcement);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<Announcement["category"]>("Academic");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0] ?? "";
    if (announcement) {
      setTitle(announcement.title || "");
      setDate(announcement.date || today);
      setCategory(announcement.category || "Academic");
      setSummary(announcement.summary || "");
      setContent(announcement.content || "");
      setIsUrgent(Boolean(announcement.isUrgent));
    } else {
      setTitle("");
      setDate(today);
      setCategory("Academic");
      setSummary("");
      setContent("");
      setIsUrgent(false);
    }
    setErrorMessage("");
    setIsSaving(false);
  }, [announcement, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Announcement Title is required.");
      return;
    }
    if (!summary.trim()) {
      setErrorMessage("Summary is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await onSave({
        ...(announcement?.id ? { id: announcement.id } : {}),
        title: title.trim(),
        date: date.trim() || (new Date().toISOString().split("T")[0] ?? ""),
        category,
        summary: summary.trim(),
        content: (content || summary).trim(),
        isUrgent,
      });
      onClose();
    } catch (err: any) {
      console.error("Announcement save error:", err);
      setErrorMessage(err.message || "Failed to save announcement.");
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
              <Bell size={16} className="text-amber-400" />
              <span>{isEdit ? "Edit College Announcement" : "Post New Official Notice"}</span>
            </h3>
            <p className="text-[11px] text-amber-300 font-medium">
              Synchronizes to public marquee ticker, notices section, and announcements archive
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

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Notice Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. B.Tech Admissions Process Guidelines — Notification for Academic Session"
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
                  <option value="Academic">Academic</option>
                  <option value="Examinations">Examinations</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Placements">Placements</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Publication Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Brief Summary <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short excerpt displayed in ticker preview and card list..."
                required
                className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Full Circular Details & Instructions
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed regulatory or academic notification text..."
                className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
              />
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2.5">
              <input
                type="checkbox"
                id="ann-urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded border-red-300 text-red-600"
              />
              <div>
                <label htmlFor="ann-urgent" className="font-bold text-red-800 text-xs cursor-pointer block">
                  Mark as Priority / Urgent Notice
                </label>
                <span className="text-[10px] text-red-600">
                  Displays with distinct high-visibility red badge on the public ticker and circulars board.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              {isEdit && onDelete && announcement && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    if (window.confirm(`Delete circular "${announcement.title}"?`)) {
                      setIsSaving(true);
                      await onDelete(announcement.id);
                      onClose();
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Delete Notice</span>
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
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>{isEdit ? "Update Notice" : "Publish Notice"}</span>
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
