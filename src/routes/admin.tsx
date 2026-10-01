import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent, useRef, type ChangeEvent } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Bell,
  Building,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Edit2,
  User,
  Users,
  X,
  ExternalLink,
  Upload,
  Briefcase,
  Layers,
  MapPin,
  Phone,
  Globe,
  Home,
  Award,
  BookOpen,
  Sparkles,
  Menu,
  Database,
  RefreshCw,
  AlertCircle,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  site as defaultSite,
  departments as initialDepartments,
  type Announcement,
  type CollegeEvent,
  type GalleryItem,
  type AdmissionEnquiry,
  type Department,
  type CollegeFacility,
  type GalleryCategory,
  type PlacementYearStat,
} from "@/data/site";
import { CollegeCrest } from "@/components/site/CollegeCrest";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FacilityModal } from "@/components/admin/FacilityModal";
import { AnnouncementModal } from "@/components/admin/AnnouncementModal";
import { EventModal } from "@/components/admin/EventModal";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { useCollegeStore } from "@/lib/college-store";
import { uploadMediaFile, validateMediaFile } from "@/lib/media-upload";
import { PlacementsAdmin } from "@/components/admin/PlacementsAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Administrative Portal | PK College of Engineering & Technology` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type AdminTab =
  | "overview"
  | "settings"
  | "homepage"
  | "departments"
  | "admissions"
  | "placements"
  | "facilities"
  | "gallery"
  | "events"
  | "announcements"
  | "contact";

type SettingsSubTab = "branding" | "general" | "principal" | "contact" | "social";

interface DepartmentEditorFormProps {
  department: Department;
  onSave: (slug: string, updates: Partial<Department>) => Promise<void>;
  onDelete?: (slug: string) => Promise<void>;
  canDelete: boolean;
  deptImageInputRef: React.RefObject<HTMLInputElement | null>;
  pendingDeptFile: File | null;
  pendingDeptPreview: string | null;
  setPendingDeptFile: (file: File | null) => void;
  setPendingDeptPreview: (preview: string | null) => void;
  isUploading: boolean;
  onUploadImage: (slug: string) => Promise<void>;
  onDeptSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  deptUploadError?: string;
  triggerToast: (msg: string) => void;
}

function DepartmentEditorForm({
  department,
  onSave,
  onDelete,
  canDelete,
  deptImageInputRef,
  pendingDeptFile,
  pendingDeptPreview,
  setPendingDeptFile,
  setPendingDeptPreview,
  isUploading,
  onUploadImage,
  onDeptSelect,
  deptUploadError,
  triggerToast,
}: DepartmentEditorFormProps) {
  const [intake, setIntake] = useState(department.intake);
  const [title, setTitle] = useState(department.title);
  const [shortTitle, setShortTitle] = useState(department.shortTitle);
  const [established, setEstablished] = useState(department.established || "");
  const [overview, setOverview] = useState(department.overview || "");
  const [vision, setVision] = useState(department.vision || "");
  const [missionText, setMissionText] = useState((department.mission || []).join("\n"));
  const [labsText, setLabsText] = useState((department.laboratories || []).join("\n"));
  const [keyDomainsText, setKeyDomainsText] = useState((department.keyDomains || []).join(", "));
  const [careerProspectsText, setCareerProspectsText] = useState((department.careerProspects || []).join(", "));
  const [hodName, setHodName] = useState(department.hod?.name || "");
  const [hodDesignation, setHodDesignation] = useState(department.hod?.designation || "");
  const [hodQualification, setHodQualification] = useState(department.hod?.qualification || "");
  const [hodExperience, setHodExperience] = useState(department.hod?.experience || "");
  const [hodEmail, setHodEmail] = useState(department.hod?.email || "");

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIntake(department.intake);
    setTitle(department.title);
    setShortTitle(department.shortTitle);
    setEstablished(department.established || "");
    setOverview(department.overview || "");
    setVision(department.vision || "");
    setMissionText((department.mission || []).join("\n"));
    setLabsText((department.laboratories || []).join("\n"));
    setKeyDomainsText((department.keyDomains || []).join(", "));
    setCareerProspectsText((department.careerProspects || []).join(", "));
    setHodName(department.hod?.name || "");
    setHodDesignation(department.hod?.designation || "");
    setHodQualification(department.hod?.qualification || "");
    setHodExperience(department.hod?.experience || "");
    setHodEmail(department.hod?.email || "");
    setIsDirty(false);
  }, [department]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const resetForm = () => {
    setIntake(department.intake);
    setTitle(department.title);
    setShortTitle(department.shortTitle);
    setEstablished(department.established || "");
    setOverview(department.overview || "");
    setVision(department.vision || "");
    setMissionText((department.mission || []).join("\n"));
    setLabsText((department.laboratories || []).join("\n"));
    setKeyDomainsText((department.keyDomains || []).join(", "));
    setCareerProspectsText((department.careerProspects || []).join(", "));
    setHodName(department.hod?.name || "");
    setHodDesignation(department.hod?.designation || "");
    setHodQualification(department.hod?.qualification || "");
    setHodExperience(department.hod?.experience || "");
    setHodEmail(department.hod?.email || "");
    setIsDirty(false);
    triggerToast(`Discarded unsaved edits for ${department.shortTitle}.`);
  };

  const resetToDefault = () => {
    const init = initialDepartments.find((d) => d.slug === department.slug || d.code === department.code);
    if (!init) {
      triggerToast("No institutional template found for this custom branch.");
      return;
    }
    setIntake(init.intake);
    setTitle(init.title);
    setShortTitle(init.shortTitle);
    setEstablished(init.established || "");
    setOverview(init.overview || "");
    setVision(init.vision || "");
    setMissionText((init.mission || []).join("\n"));
    setLabsText((init.laboratories || []).join("\n"));
    setKeyDomainsText((init.keyDomains || []).join(", "));
    setCareerProspectsText((init.careerProspects || []).join(", "));
    setHodName(init.hod?.name || "");
    setHodDesignation(init.hod?.designation || "");
    setHodQualification(init.hod?.qualification || "");
    setHodExperience(init.hod?.experience || "");
    setHodEmail(init.hod?.email || "");
    setIsDirty(true);
    triggerToast(`Loaded institutional template for ${init.shortTitle}. Click Save Changes to apply.`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedIntake = Math.max(10, Math.min(600, Number(intake) || department.intake));
      await onSave(department.slug, {
        intake: parsedIntake,
        title: title.trim(),
        shortTitle: shortTitle.trim(),
        established: established.trim(),
        overview: overview.trim(),
        vision: vision.trim(),
        mission: missionText.split("\n").map((s) => s.trim()).filter(Boolean),
        laboratories: labsText.split("\n").map((s) => s.trim()).filter(Boolean),
        keyDomains: keyDomainsText.split(",").map((s) => s.trim()).filter(Boolean),
        careerProspects: careerProspectsText.split(",").map((s) => s.trim()).filter(Boolean),
        hod: {
          name: hodName.trim(),
          designation: hodDesignation.trim(),
          qualification: hodQualification.trim(),
          experience: hodExperience.trim(),
          email: hodEmail.trim(),
        },
      });
      setIsDirty(false);
      triggerToast(`Saved ${shortTitle}! Approved Intake is now ${parsedIntake} seats.`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to save department changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
      {/* Active Editor Visual Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#0b224d] text-white px-2 py-0.5 rounded">
              Active Editor
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-amber-300">
              Branch Code: {department.code}
            </span>
            <span className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-amber-200">
              slug: {department.slug}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#0b224d] mt-1.5">
            You are editing: Departments → {title}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Current Approved Intake: <strong className="text-emerald-700 font-extrabold">{intake} Seats</strong> · Updating here updates the public website, admissions seat matrix, and academic divisions immediately upon saving.
          </p>
        </div>

        {isDirty && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border border-amber-400 text-amber-900 rounded-md text-xs font-bold animate-pulse shrink-0">
            <AlertCircle size={14} className="text-amber-700" />
            <span>Unsaved Changes</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. SEATS / INTAKE EDITING */}
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-lg shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <label className="block text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
              Approved Annual Intake / Seats (Required)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-800 font-semibold">Quick Presets:</span>
              {[60, 120, 180, 240].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setIntake(preset);
                    markDirty();
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded font-bold border transition ${
                    intake === preset
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              name="intake"
              type="number"
              min={10}
              max={600}
              value={intake}
              onChange={(e) => {
                setIntake(Number(e.target.value));
                markDirty();
              }}
              required
              className="w-36 p-2.5 bg-white border-2 border-emerald-600 rounded text-base font-extrabold text-[#0b224d]"
            />
            <span className="text-xs text-emerald-900 font-medium">
              Example: Change 180 to 100 → updates public website and seat matrix immediately upon clicking Save Changes.
            </span>
          </div>
        </div>

        {/* 2. Titles & Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Department Title
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markDirty();
              }}
              required
              className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Short Title (Pill / Navbar)
            </label>
            <input
              value={shortTitle}
              onChange={(e) => {
                setShortTitle(e.target.value);
                markDirty();
              }}
              required
              className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Established Status / Year
            </label>
            <input
              value={established}
              onChange={(e) => {
                setEstablished(e.target.value);
                markDirty();
              }}
              placeholder="e.g. 2021 or To be updated"
              className="w-full p-2.5 border border-slate-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Key Technical Domains (Comma separated)
            </label>
            <input
              value={keyDomainsText}
              onChange={(e) => {
                setKeyDomainsText(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Machine Learning, Cloud Computing, VLSI"
              className="w-full p-2.5 border border-slate-300 rounded text-xs"
            />
          </div>
        </div>

        {/* 3. Department Overview */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Department Academic Overview
          </label>
          <textarea
            value={overview}
            onChange={(e) => {
              setOverview(e.target.value);
              markDirty();
            }}
            rows={3}
            required
            className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
          />
        </div>

        {/* 4. Vision & Mission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Department Vision
            </label>
            <textarea
              value={vision}
              onChange={(e) => {
                setVision(e.target.value);
                markDirty();
              }}
              rows={3}
              className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Department Mission Statements (One per line)
            </label>
            <textarea
              value={missionText}
              onChange={(e) => {
                setMissionText(e.target.value);
                markDirty();
              }}
              rows={3}
              placeholder="Enter each mission statement on a new line"
              className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* 5. Laboratories List */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Department Laboratories (One per line)
          </label>
          <textarea
            value={labsText}
            onChange={(e) => {
              setLabsText(e.target.value);
              markDirty();
            }}
            rows={4}
            placeholder="Advanced Computing Lab&#10;Software Engineering Lab&#10;Database Systems Lab"
            className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono leading-relaxed"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Displayed on the public department profile under Department Laboratories.
          </p>
        </div>

        {/* 6. Career Prospects */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Career Prospects (Comma separated)
          </label>
          <input
            value={careerProspectsText}
            onChange={(e) => {
              setCareerProspectsText(e.target.value);
              markDirty();
            }}
            placeholder="Software Development Engineer, Systems Architect, Data Analyst"
            className="w-full p-2.5 border border-slate-300 rounded text-xs"
          />
        </div>

        {/* 7. HOD Details */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h4 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider flex items-center gap-1.5">
            <User size={14} />
            <span>Head of Department (HOD) Profile</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                HOD Name
              </label>
              <input
                value={hodName}
                onChange={(e) => {
                  setHodName(e.target.value);
                  markDirty();
                }}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Designation
              </label>
              <input
                value={hodDesignation}
                onChange={(e) => {
                  setHodDesignation(e.target.value);
                  markDirty();
                }}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Academic Qualifications
              </label>
              <input
                value={hodQualification}
                onChange={(e) => {
                  setHodQualification(e.target.value);
                  markDirty();
                }}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Experience
              </label>
              <input
                value={hodExperience}
                onChange={(e) => {
                  setHodExperience(e.target.value);
                  markDirty();
                }}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Department Email
              </label>
              <input
                value={hodEmail}
                onChange={(e) => {
                  setHodEmail(e.target.value);
                  markDirty();
                }}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* 8. Department Laboratory / Profile Image */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase">
              Departments → {shortTitle} → Laboratory & Department Profile Image
            </span>
            <p className="text-[11px] text-slate-500">
              Displayed in: Departments → {title} → Header & Laboratory Banner
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={department.image}
              alt={title}
              className="w-28 h-20 object-cover rounded border border-slate-300 shadow-xs"
            />
            <div>
              <p className="text-xs font-semibold text-slate-700">Current Department Photograph</p>
              <p className="text-[11px] text-slate-500">Displayed on the branch profile page</p>
            </div>
          </div>

          {deptUploadError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Department Photo Upload Failed</p>
                <p className="text-[11px] mt-0.5">{deptUploadError}</p>
              </div>
            </div>
          )}

          {pendingDeptPreview && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={pendingDeptPreview} alt="Dept Preview" className="w-20 h-14 object-cover rounded border" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">New Department Photo Selected</p>
                  <p className="text-[11px] text-emerald-700 font-mono">{pendingDeptFile?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => onUploadImage(department.slug)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold uppercase shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isUploading && <RefreshCw size={12} className="animate-spin" />}
                  <span>{isUploading ? "Uploading to Cloudinary..." : "Save Image"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingDeptFile(null);
                    setPendingDeptPreview(null);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 px-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div>
            <input
              ref={deptImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onDeptSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => deptImageInputRef.current?.click()}
              className="bg-[#0b224d] text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-[#102a5c] transition disabled:opacity-60"
            >
              <Upload size={13} />
              <span>{pendingDeptFile ? "Choose Different Image" : "Choose New Department Image"}</span>
            </button>
          </div>
        </div>

        {/* 9. Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Changes & Publish</span>
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded font-bold text-xs uppercase tracking-wider border border-slate-300 transition flex items-center gap-1.5"
              >
                <X size={14} />
                <span>Cancel / Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetToDefault}
              className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded text-xs font-medium transition flex items-center gap-1 hover:bg-slate-100"
            >
              <RotateCcw size={13} />
              <span>Reset to Defaults</span>
            </button>
          </div>

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={async () => {
                const confirmed = window.confirm(
                  `Are you sure you want to delete ${title}? This will remove it from the public website and Firestore.`
                );
                if (confirmed) {
                  await onDelete(department.slug);
                }
              }}
              className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-2 border border-red-200 rounded hover:bg-red-50 flex items-center gap-1.5 transition"
            >
              <Trash2 size={13} />
              <span>Delete Department</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function AdminPage() {
  const store = useCollegeStore();
  const site = store.siteSettings || defaultSite;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>("branding");
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Monitor Firebase Auth State
  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === "undefined") return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email || "admin@pk-college.edu.in");
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUserEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setAdminDrawerOpen(false);
  };

  // Departments CMS State
  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>("cse");
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // Modals state
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CollegeEvent | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<CollegeFacility | null>(null);
  const [showAddPlacementModal, setShowAddPlacementModal] = useState(false);
  const [editingPlacementYear, setEditingPlacementYear] = useState<PlacementYearStat | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<AdmissionEnquiry | null>(null);

  // Search & Filter state
  const [annSearch, setAnnSearch] = useState("");
  const [annCategoryFilter, setAnnCategoryFilter] = useState("All");
  const [enqStatusFilter, setEnqStatusFilter] = useState("All");
  const [enqSearch, setEnqSearch] = useState("");
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("All");
  const [gallerySearch, setGallerySearch] = useState("");

  // Upload busy state & refs
  const [isUploading, setIsUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const deptImageInputRef = useRef<HTMLInputElement>(null);

  // Preview before saving states
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [pendingLogoPreview, setPendingLogoPreview] = useState<string | null>(null);

  const [pendingFaviconFile, setPendingFaviconFile] = useState<File | null>(null);
  const [pendingFaviconPreview, setPendingFaviconPreview] = useState<string | null>(null);

  const [pendingHeroFile, setPendingHeroFile] = useState<File | null>(null);
  const [pendingHeroPreview, setPendingHeroPreview] = useState<string | null>(null);

  const [pendingDeptFile, setPendingDeptFile] = useState<File | null>(null);
  const [pendingDeptPreview, setPendingDeptPreview] = useState<string | null>(null);

  const [galleryModalPreview, setGalleryModalPreview] = useState<string | null>(null);
  const [galleryModalError, setGalleryModalError] = useState("");
  const [brandingError, setBrandingError] = useState("");
  const [heroUploadError, setHeroUploadError] = useState("");
  const [deptUploadError, setDeptUploadError] = useState("");

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Handle Login via Firebase Authentication
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      setAuthError("Please enter your administrative email and password.");
      setAuthBusy(false);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Verify admin role authorization in Firestore
      try {
        const adminDocRef = doc(db, "admins", credential.user.uid);
        const record = await getDoc(adminDocRef);
        if (record.exists()) {
          if (record.data()["active"] === false) {
            await signOut(auth);
            setAuthError("This administrator account has been deactivated by institutional authority.");
            setAuthBusy(false);
            return;
          }
        } else {
          // Automatic bootstrap: Provision active administrator document for authenticated user
          await setDoc(adminDocRef, {
            email: credential.user.email || email,
            active: true,
            role: "administrator",
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (docErr) {
        console.warn("Admin authorization check notice:", docErr);
      }

      setCurrentUserEmail(credential.user.email || email);
      setIsAuthenticated(true);
      triggerToast("Authenticated successfully to PK College Administrative Portal.");
    } catch (err: any) {
      console.error("Firebase auth login error:", err);
      let message = "Invalid email or password. Please verify credentials.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        message = "Invalid administrative credentials. Please verify your email and password registered in the Firebase console.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Account access temporarily locked due to repeated failed attempts. Please reset password or try again later.";
      } else if (err.code === "auth/network-request-failed") {
        message = "Network connection failed. Please check your internet connectivity.";
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  }

  // Handle Logout via Firebase Authentication
  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out notice:", err);
    }
    setIsAuthenticated(false);
    setCurrentUserEmail("");
    triggerToast("Signed out of administrative portal.");
  }

  // 1. Logo Select & Save
  function handleLogoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateMediaFile(file, { allowSvg: true, maxSizeMB: 5 });
    if (!validation.valid) {
      triggerToast(validation.error || "Invalid logo file");
      e.target.value = "";
      return;
    }
    setPendingLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePendingLogo() {
    if (!pendingLogoFile) return;
    setIsUploading(true);
    setBrandingError("");
    try {
      const res = await uploadMediaFile(pendingLogoFile, "branding", { allowSvg: true, maxSizeMB: 5 });
      await store.updateSiteSettings({ logoUrl: res.url });
      setPendingLogoFile(null);
      setPendingLogoPreview(null);
      setBrandingError("");
      triggerToast("College Logo saved! Updated everywhere across Header, Mobile Header, Footer, and Admin Portal.");
    } catch (err: any) {
      console.error("Logo upload error:", err);
      const msg = err?.message || "Failed to upload and save logo.";
      setBrandingError(msg);
      triggerToast(msg);
    } finally {
      setIsUploading(false);
    }
  }

  // 2. Favicon Select & Save
  function handleFaviconSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateMediaFile(file, { allowSvg: true, maxSizeMB: 2 });
    if (!validation.valid) {
      triggerToast(validation.error || "Invalid favicon file");
      e.target.value = "";
      return;
    }
    setBrandingError("");
    setPendingFaviconFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingFaviconPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePendingFavicon() {
    if (!pendingFaviconFile) return;
    setIsUploading(true);
    setBrandingError("");
    try {
      const res = await uploadMediaFile(pendingFaviconFile, "branding", { allowSvg: true, maxSizeMB: 2 });
      await store.updateSiteSettings({ faviconUrl: res.url });
      setPendingFaviconFile(null);
      setPendingFaviconPreview(null);
      setBrandingError("");
      triggerToast("Browser Favicon updated successfully!");
    } catch (err: any) {
      console.error("Favicon upload error:", err);
      const msg = err?.message || "Failed to upload and save favicon.";
      setBrandingError(msg);
      triggerToast(msg);
    } finally {
      setIsUploading(false);
    }
  }

  // 3. Hero Image Select & Save
  function handleHeroSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateMediaFile(file, { maxSizeMB: 10 });
    if (!validation.valid) {
      triggerToast(validation.error || "Invalid hero image file");
      e.target.value = "";
      return;
    }
    setHeroUploadError("");
    setPendingHeroFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingHeroPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePendingHero() {
    if (!pendingHeroFile) return;
    setIsUploading(true);
    setHeroUploadError("");
    try {
      const res = await uploadMediaFile(pendingHeroFile, "hero", { maxSizeMB: 10 });
      await store.updateHomepage({ heroImage: res.url });
      setPendingHeroFile(null);
      setPendingHeroPreview(null);
      setHeroUploadError("");
      triggerToast("Homepage Hero Banner updated successfully on the public website!");
    } catch (err: any) {
      console.error("Hero upload error:", err);
      const msg = err?.message || "Failed to upload hero image.";
      setHeroUploadError(msg);
      triggerToast(msg);
    } finally {
      setIsUploading(false);
    }
  }

  // 4. Department Image Select & Save
  function handleDeptSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateMediaFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      triggerToast(validation.error || "Invalid department image file");
      e.target.value = "";
      return;
    }
    setDeptUploadError("");
    setPendingDeptFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingDeptPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePendingDept(deptCode: string) {
    if (!pendingDeptFile) return;
    setIsUploading(true);
    setDeptUploadError("");
    try {
      const res = await uploadMediaFile(pendingDeptFile, "departments", { maxSizeMB: 5 });
      await store.updateDepartment(deptCode, { image: res.url });
      setPendingDeptFile(null);
      setPendingDeptPreview(null);
      setDeptUploadError("");
      triggerToast(`Department image saved successfully for ${deptCode}!`);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to upload department image.";
      setDeptUploadError(msg);
      triggerToast(msg);
    } finally {
      setIsUploading(false);
    }
  }

  // 5. Facility Handlers
  async function handleSaveFacility(
    data: Omit<CollegeFacility, "id"> & { id?: string },
    imageFile: File | null,
    imageRemoved: boolean,
  ) {
    let finalImageUrl = data.image || "";
    if (imageRemoved) {
      finalImageUrl = "";
    } else if (imageFile) {
      const res = await uploadMediaFile(imageFile, "facilities", { maxSizeMB: 5 });
      finalImageUrl = res.url;
    }

    if (data.id) {
      await store.updateFacility(data.id, {
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        keyFeatures: data.keyFeatures,
        image: finalImageUrl,
        published: data.published,
      });
      triggerToast(`Saved facility: ${data.title}! Details and photo updated.`);
    } else {
      await store.addFacility({
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        keyFeatures: data.keyFeatures,
        image: finalImageUrl,
        published: data.published,
      });
      triggerToast(`Added new facility: ${data.title}!`);
    }
  }

  async function handleDeleteFacility(id: string) {
    await store.deleteFacility(id);
    triggerToast("Facility deleted successfully.");
  }

  // 6. Announcement Handlers
  async function handleSaveAnnouncement(data: Omit<Announcement, "id"> & { id?: string }) {
    if (data.id) {
      await store.updateAnnouncement(data.id, data);
      triggerToast(`Updated notice: ${data.title}`);
    } else {
      await store.addAnnouncement(data);
      triggerToast(`Published announcement: ${data.title}`);
    }
  }

  // 7. Event Handlers
  async function handleSaveEvent(
    data: Omit<CollegeEvent, "id"> & { id?: string },
    imageFile: File | null,
    imageRemoved: boolean,
  ) {
    let finalImageUrl = data.image || "";
    if (imageRemoved) {
      finalImageUrl = "";
    } else if (imageFile) {
      const res = await uploadMediaFile(imageFile, "events", { maxSizeMB: 5 });
      finalImageUrl = res.url;
    }

    if (data.id) {
      await store.updateEvent(data.id, { ...data, image: finalImageUrl });
      triggerToast(`Updated event: ${data.title}`);
    } else {
      await store.addEvent({ ...data, image: finalImageUrl });
      triggerToast(`Added event: ${data.title}`);
    }
  }

  // 1. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07172f] flex flex-col">
        <AdminHeader isAuthenticated={false} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-[#0b224d] p-6 text-center border-b-4 border-[#d97706]">
            <CollegeCrest className="w-16 h-16 mx-auto mb-2" />
            <h1 className="text-white font-extrabold text-base tracking-tight uppercase">
              {site.name}
            </h1>
            <p className="text-amber-400 text-xs font-semibold mt-1">
              Campus Content Management & Administrative Portal
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Administrator Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@pk-college.edu.in"
                  required
                  autoComplete="email"
                  className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter administrator password"
                  required
                  autoComplete="current-password"
                  className="w-full p-2.5 text-xs md:text-sm border border-slate-300 rounded focus:border-[#0b224d] outline-none"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Lock size={13} />
                    <span>Authentication Notice</span>
                  </p>
                  <p>{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={authBusy}
                className="w-full bg-[#0b224d] hover:bg-[#102a5c] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {authBusy ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying with Firebase Auth...</span>
                  </>
                ) : (
                  <span>Sign In to Admin Portal</span>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Database size={12} className="text-[#0b224d]" />
                  <span>Firebase Project: pk-college-74f41</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Use your provisioned administrator account created in the Firebase Authentication console.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Protected Institutional Administrative Area — Authorized Staff Only
          </div>
        </div>
      </div>
    </div>
    );
  }

  const selectedDepartment = (
    store.departments.find(
      (d) => d.slug === selectedDeptSlug || d.code === selectedDeptSlug,
    ) ||
    store.departments[0] ||
    initialDepartments[0]
  ) as Department;

  // 2. Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0b224d] text-white px-4 py-3 rounded-lg shadow-xl border border-amber-500 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dedicated Clean Admin Header */}
      <AdminHeader
        isAuthenticated={true}
        currentUserEmail={currentUserEmail}
        onLogout={handleLogout}
        sidebarOpen={adminDrawerOpen}
        onToggleSidebar={() => setAdminDrawerOpen(!adminDrawerOpen)}
        activeTabTitle={activeTab}
      />

      {/* Admin Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row relative w-full overflow-hidden">
        {/* Backdrop for mobile drawer */}
        {adminDrawerOpen && (
          <div
            onClick={() => setAdminDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden animate-in fade-in"
            aria-hidden="true"
          />
        )}

        {/* ADMIN SIDEBAR (Slide-over drawer on mobile, static column on md+) */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#07172f] text-slate-200 flex flex-col flex-shrink-0 md:static md:min-h-[calc(100vh-3.5rem)] border-r border-slate-800 transition-transform duration-300 ${
          adminDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <CollegeCrest className="w-10 h-10 flex-shrink-0" />
            <div className="overflow-hidden">
              <h2 className="font-bold text-xs text-white uppercase tracking-tight truncate">
                {site.name}
              </h2>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Control Panel & CMS
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminDrawerOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Context Navigation */}
        <nav className="p-3 space-y-1 flex-1 text-xs overflow-y-auto">
          <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Management
          </div>

          <button
            onClick={() => selectTab("overview")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "overview" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => selectTab("settings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "settings" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Settings size={15} />
            <span>College Settings</span>
          </button>

          <button
            onClick={() => selectTab("homepage")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "homepage" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Home size={15} />
            <span>Homepage CMS</span>
          </button>

          <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Academic & Programs
          </div>

          <button
            onClick={() => selectTab("departments")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "departments" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Building size={15} />
            <div className="flex-1 flex justify-between items-center">
              <span>Departments & Seats</span>
              <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {store.departments.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectTab("admissions")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "admissions" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <GraduationCap size={15} />
            <div className="flex-1 flex justify-between items-center">
              <span>Admissions & Enquiries</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {store.enquiries.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectTab("placements")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "placements" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Briefcase size={15} />
            <span>Training & Placements</span>
          </button>

          <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Campus Media & Content
          </div>

          <button
            onClick={() => selectTab("facilities")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "facilities" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Layers size={15} />
            <span>Campus & Facilities</span>
          </button>

          <button
            onClick={() => selectTab("gallery")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "gallery" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <ImageIcon size={15} />
            <div className="flex-1 flex justify-between items-center">
              <span>Photo Gallery</span>
              <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.2 rounded-full">
                {store.galleryItems.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectTab("announcements")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "announcements" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Bell size={15} />
            <div className="flex-1 flex justify-between items-center">
              <span>Announcements</span>
              <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.2 rounded-full">
                {store.announcements.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectTab("events")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "events" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Calendar size={15} />
            <div className="flex-1 flex justify-between items-center">
              <span>Campus Events</span>
              <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.2 rounded-full">
                {store.events.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectTab("contact")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors ${
              activeTab === "contact" ? "bg-[#0b224d] text-white font-bold" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Phone size={15} />
            <span>Contact Desk</span>
          </button>
        </nav>

        {/* User Info & Actions */}
        <div className="p-3 bg-[#051124] border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-[#0f172a] font-black flex items-center justify-center text-xs">
              A
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate">{currentUserEmail}</p>
              <p className="text-[10px] text-slate-400">Campus Administrator</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center rounded text-[11px] flex items-center justify-center gap-1"
            >
              <span>View Site</span>
              <ExternalLink size={10} />
            </Link>
            <button
              onClick={handleLogout}
              className="py-1 px-2.5 bg-red-900/60 hover:bg-red-800 text-red-200 text-center rounded text-[11px] flex items-center justify-center gap-1"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto min-w-0 max-w-full">
        {/* Top Breadcrumb & Live Sync indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-bold capitalize">
              {activeTab === "settings"
                ? `College Settings / ${settingsSubTab}`
                : activeTab === "departments"
                ? `Departments / ${selectedDepartment.shortTitle}`
                : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CMS Connected: Public site updates automatically</span>
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center">
                  <Building size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Engineering Branches</p>
                  <p className="text-xl font-bold text-[#0b224d]">{store.departments.length} Departments</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-amber-600 text-white flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Approved Intake</p>
                  <p className="text-xl font-bold text-[#0b224d]">
                    {store.departments.reduce((acc, d) => acc + (Number(d.intake) || 0), 0)} Seats
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-700 text-white flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Active Notices</p>
                  <p className="text-xl font-bold text-[#0b224d]">{store.announcements.length} Published</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-emerald-700 text-white flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Media Assets</p>
                  <p className="text-xl font-bold text-[#0b224d]">{store.galleryItems.length} Images</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-[#0b224d] uppercase tracking-wider mb-4">
                CMS Quick Actions & Site Control
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setSettingsSubTab("branding");
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-xs text-[#0b224d]">Replace College Logo</p>
                  <p className="text-[11px] text-slate-500 mt-1">Upload brand logo or favicon</p>
                </button>

                <button
                  onClick={() => setActiveTab("departments")}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-xs text-[#0b224d]">Edit Department Seats</p>
                  <p className="text-[11px] text-slate-500 mt-1">Change intake e.g. 180 to 100</p>
                </button>

                <button
                  onClick={() => setShowAddAnnModal(true)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-xs text-[#0b224d]">Post New Announcement</p>
                  <p className="text-[11px] text-slate-500 mt-1">Publish circulars or notices</p>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setSettingsSubTab("general");
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-xs text-[#0b224d]">Edit Founded Year / Info</p>
                  <p className="text-[11px] text-slate-500 mt-1">Update general college metadata</p>
                </button>
              </div>
            </div>

            {/* Firebase Backend & Data Synchronization */}
            <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
                    <Database size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b224d] uppercase tracking-wide">
                      Firebase Backend & Cloud Firestore Sync
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Connected to Project: <span className="font-mono font-bold text-slate-700">pk-college-74f41</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSeeding}
                  onClick={async () => {
                    setIsSeeding(true);
                    const res: any = await store.seedInitialFirestoreData();
                    setIsSeeding(false);
                    if (res === true || res?.success) {
                      triggerToast("All campus CMS data synced to Cloud Firestore successfully! Changes are live on production.");
                    } else {
                      const msg = res?.error?.message ? ` (${res.error.message})` : "";
                      triggerToast(`Cloud Firestore sync blocked${msg}. Ensure firestore.rules is published in Firebase Console.`);
                    }
                  }}
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 transition"
                >
                  <RefreshCw size={13} className={isSeeding ? "animate-spin" : ""} />
                  <span>{isSeeding ? "Writing to Firestore..." : "Sync All CMS Data to Cloud Firestore"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Authentication</span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Firebase Auth Active</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{currentUserEmail}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Firestore Database</span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Real-time Listeners Live</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Departments, Settings, CMS</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Media Storage</span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1 truncate font-mono text-[11px]">
                    Cloudinary (e8mmudhk)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Preset: Pk college · Unsigned CDN</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLEGE SETTINGS (Branding, General, Principal, Contact, Social) */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            {/* Sub-tab Navigation */}
            <div className="flex border-b border-slate-200 bg-white rounded-t p-2 gap-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setSettingsSubTab("branding")}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  settingsSubTab === "branding"
                    ? "bg-[#0b224d] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                1. Branding & Logo
              </button>
              <button
                onClick={() => setSettingsSubTab("general")}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  settingsSubTab === "general"
                    ? "bg-[#0b224d] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                2. General Information
              </button>
              <button
                onClick={() => setSettingsSubTab("principal")}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  settingsSubTab === "principal"
                    ? "bg-[#0b224d] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                3. Principal's Desk
              </button>
              <button
                onClick={() => setSettingsSubTab("contact")}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  settingsSubTab === "contact"
                    ? "bg-[#0b224d] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                4. Contact Information
              </button>
              <button
                onClick={() => setSettingsSubTab("social")}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  settingsSubTab === "social"
                    ? "bg-[#0b224d] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                5. Social Media Links
              </button>
            </div>

            {/* Subtab 1: Branding & Logo */}
            {settingsSubTab === "branding" && (
              <div className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-6">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900">
                  <p className="font-extrabold uppercase tracking-wide">
                    You are editing: College Settings → Institutional Branding
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Controls brand identity across Desktop Navbar, Mobile Header, Footer, Admin Portal, and Browser Favicon. Changes synchronize to Firestore & Cloudinary CDN.
                  </p>
                </div>

                {brandingError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Branding Asset Upload Failed</p>
                      <p className="text-[11px] leading-relaxed">{brandingError}</p>
                    </div>
                  </div>
                )}

                {/* Current Logo Preview Matrix */}
                <div>
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                    Current Active College Logo Previews
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center">
                      <p className="text-[11px] font-bold text-slate-600 uppercase mb-3">
                        Light Background (Cards & Documents)
                      </p>
                      <div className="w-24 h-24 mx-auto flex items-center justify-center p-2 bg-white rounded border border-slate-200 shadow-xs">
                        <CollegeCrest className="w-16 h-16" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        {site.logoUrl ? "Using custom uploaded logo" : "Using official institutional monogram"}
                      </p>
                    </div>

                    <div className="p-4 bg-[#07172f] border border-slate-800 rounded text-center">
                      <p className="text-[11px] font-bold text-amber-400 uppercase mb-3">
                        Dark Background (Header & Navbar)
                      </p>
                      <div className="w-24 h-24 mx-auto flex items-center justify-center p-2 bg-[#0b224d] rounded border border-slate-700 shadow-xs">
                        <CollegeCrest className="w-16 h-16" variant="dark" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">Appearance in the college header bar</p>
                    </div>
                  </div>
                </div>

                {/* Preview Before Saving for New Logo */}
                {pendingLogoPreview && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-900 uppercase">
                        Preview Before Saving: New Selected Logo
                      </span>
                      <span className="text-[11px] text-emerald-700 font-mono">
                        {pendingLogoFile?.name} ({(pendingLogoFile ? pendingLogoFile.size / 1024 : 0).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white border border-emerald-200 rounded text-center">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">White BG Preview</p>
                        <img src={pendingLogoPreview} alt="New Logo Preview" className="h-16 mx-auto object-contain" />
                      </div>
                      <div className="p-3 bg-[#07172f] border border-slate-800 rounded text-center">
                        <p className="text-[10px] text-amber-400 font-bold mb-1">Navbar Dark BG Preview</p>
                        <img src={pendingLogoPreview} alt="New Logo Preview" className="h-16 mx-auto object-contain" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={handleSavePendingLogo}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 size={14} />
                        <span>{isUploading ? "Uploading to Cloudinary..." : "Save & Apply New Logo"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPendingLogoFile(null);
                          setPendingLogoPreview(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded text-xs font-bold uppercase"
                      >
                        Cancel Preview
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload & Replace Controls */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase">Upload or Replace College Logo</p>
                    <p className="text-[11px] text-slate-500">Pick a high-resolution PNG, SVG, or JPG file.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => logoInputRef.current?.click()}
                      className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                    >
                      <Upload size={14} />
                      <span>{pendingLogoFile ? "Choose Different File" : "Choose New Logo File"}</span>
                    </button>

                    {site.logoUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          await store.updateSiteSettings({ logoUrl: "" });
                          triggerToast("Custom logo removed. Reverted to official PK monogram crest.");
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded text-xs font-bold uppercase"
                      >
                        Reset to Official Crest
                      </button>
                    )}
                  </div>
                </div>

                {/* Browser Favicon Management */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Browser Favicon Management
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Controls the icon in browser tabs and bookmarks. Supports SVG, ICO, PNG.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 p-1 bg-white border border-slate-300 rounded flex items-center justify-center">
                        {site.faviconUrl || site.logoUrl ? (
                          <img src={site.faviconUrl || site.logoUrl} alt="Favicon" className="w-6 h-6 object-contain" />
                        ) : (
                          <CollegeCrest className="w-6 h-6" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-600 font-semibold">Active Favicon</span>
                    </div>
                  </div>

                  {pendingFaviconPreview && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img src={pendingFaviconPreview} alt="Favicon Preview" className="w-7 h-7 object-contain bg-white p-0.5 rounded border" />
                        <span className="text-xs text-emerald-950 font-bold">New Favicon Selected — Click Save to Apply</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={handleSavePendingFavicon}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold uppercase"
                        >
                          {isUploading ? "Saving..." : "Save Favicon"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingFaviconFile(null);
                            setPendingFaviconPreview(null);
                          }}
                          className="text-slate-600 hover:text-slate-800 text-xs px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1.5"
                    >
                      <Upload size={13} />
                      <span>Upload Favicon</span>
                    </button>
                    {site.faviconUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          await store.updateSiteSettings({ faviconUrl: "" });
                          triggerToast("Custom favicon removed. Reverted to default crest.");
                        }}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>

                {/* Name & Short Name Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    await store.updateSiteSettings({
                      name: String(fd.get("name") || ""),
                      shortName: String(fd.get("shortName") || ""),
                      counselingCode: String(fd.get("counselingCode") || ""),
                    });
                    triggerToast("Branding settings saved successfully.");
                  }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Official Registered College Name
                    </label>
                    <input
                      name="name"
                      defaultValue={site.name}
                      required
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold text-[#0b224d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Short Monogram / Abbreviation
                      </label>
                      <input
                        name="shortName"
                        defaultValue={site.shortName}
                        className="w-full p-2.5 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        State Counseling Code
                      </label>
                      <input
                        name="counselingCode"
                        defaultValue={site.counselingCode}
                        className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    Save Branding Settings
                  </button>
                </form>
              </div>
            )}

            {/* Subtab 2: General Information */}
            {settingsSubTab === "general" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await store.updateSiteSettings({
                    foundedYear: String(fd.get("foundedYear") || ""),
                    established: `Founded in ${fd.get("foundedYear") || "2021"}`,
                    tagline: String(fd.get("tagline") || ""),
                    aboutText: String(fd.get("aboutText") || ""),
                    vision: String(fd.get("vision") || ""),
                    mission: String(fd.get("mission") || ""),
                    affiliations: String(fd.get("affiliations") || ""),
                  });
                  triggerToast("General College Information updated successfully.");
                }}
                className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-4"
              >
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 font-medium">
                  <strong>You are editing:</strong> College Settings → General Information (About Us page, Header Subtitles, and Academic Metadata).
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Founded / Established Year
                    </label>
                    <input
                      name="foundedYear"
                      defaultValue={site.foundedYear || "2021"}
                      placeholder="e.g. 2021"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">e.g. 2021 → updates to "Founded in 2021" publicly</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Institutional Tagline / Motto
                    </label>
                    <input
                      name="tagline"
                      defaultValue={site.tagline}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Regulatory Affiliations & Approvals Subtitle
                  </label>
                  <input
                    name="affiliations"
                    defaultValue={site.affiliations}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    About the College (Overview Narrative)
                  </label>
                  <textarea
                    name="aboutText"
                    rows={4}
                    defaultValue={site.aboutText}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Institutional Vision Statement
                  </label>
                  <textarea
                    name="vision"
                    rows={3}
                    defaultValue={site.vision}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Institutional Mission Statement
                  </label>
                  <textarea
                    name="mission"
                    rows={3}
                    defaultValue={site.mission || (site.missions ? site.missions.join("\n") : "")}
                    placeholder="Provide the core mission statement and institutional objectives..."
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Save General Information
                </button>
              </form>
            )}

            {/* Subtab 3: Principal's Desk */}
            {settingsSubTab === "principal" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const points = String(fd.get("keyPoints") || "")
                    .split("\n")
                    .map((p) => p.trim())
                    .filter(Boolean);
                  await store.updateLeadership({
                    principal: {
                      name: String(fd.get("name") || store.leadership.principal.name),
                      title: String(fd.get("title") || store.leadership.principal.title),
                      qualifications: String(fd.get("qualifications") || store.leadership.principal.qualifications),
                      experience: String(fd.get("experience") || store.leadership.principal.experience),
                      message: String(fd.get("message") || store.leadership.principal.message),
                      keyPoints: points.length > 0 ? points : store.leadership.principal.keyPoints,
                    },
                  });
                  triggerToast("Principal's Desk & Leadership details updated successfully!");
                }}
                className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-4"
              >
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 font-medium">
                  <strong>You are editing:</strong> College Settings → Principal's Desk (Public Homepage Spotlight, About Page, and /principal-message).
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Principal's Full Name
                    </label>
                    <input
                      name="name"
                      defaultValue={store.leadership.principal.name}
                      required
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Institutional Designation / Title
                    </label>
                    <input
                      name="title"
                      defaultValue={store.leadership.principal.title}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Qualifications & Degrees
                    </label>
                    <input
                      name="qualifications"
                      defaultValue={store.leadership.principal.qualifications}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Administrative Experience
                    </label>
                    <input
                      name="experience"
                      defaultValue={store.leadership.principal.experience}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Official Welcome Message & Address
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    defaultValue={store.leadership.principal.message}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Key Institutional Pillars (1 point per line)
                  </label>
                  <textarea
                    name="keyPoints"
                    rows={4}
                    defaultValue={store.leadership.principal.keyPoints.join("\n")}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Save Principal's Desk Information
                </button>
              </form>
            )}

            {/* Subtab 4: Contact Information */}
            {settingsSubTab === "contact" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await store.updateSiteSettings({
                    phone: String(fd.get("phone") || ""),
                    admissionsPhone: String(fd.get("admissionsPhone") || ""),
                    email: String(fd.get("email") || ""),
                    admissionsEmail: String(fd.get("admissionsEmail") || ""),
                    examCellEmail: String(fd.get("examCellEmail") || ""),
                    placementEmail: String(fd.get("placementEmail") || ""),
                    address: String(fd.get("address") || ""),
                    city: String(fd.get("city") || ""),
                    state: String(fd.get("state") || ""),
                    pincode: String(fd.get("pincode") || ""),
                    location: String(fd.get("location") || ""),
                    workingHours: String(fd.get("workingHours") || ""),
                    mapsUrl: String(fd.get("mapsUrl") || ""),
                  });
                  triggerToast("Contact details updated successfully. Header, Footer, and Contact page synchronized.");
                }}
                className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-4"
              >
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 font-medium">
                  <strong>You are editing:</strong> College Settings → Contact Information (Top Header Bar, Footer, and Public Contact Page).
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Main Telephone / Contact Number
                    </label>
                    <input
                      name="phone"
                      defaultValue={site.phone}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Admissions Desk Phone Number
                    </label>
                    <input
                      name="admissionsPhone"
                      defaultValue={site.admissionsPhone}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Official General College Email
                    </label>
                    <input
                      name="email"
                      defaultValue={site.email}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Admissions Desk Email
                    </label>
                    <input
                      name="admissionsEmail"
                      defaultValue={site.admissionsEmail}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Campus Physical Address
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    defaultValue={site.address}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Town</label>
                    <input name="city" defaultValue={site.city} className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                    <input name="state" defaultValue={site.state} className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Postal Pincode</label>
                    <input name="pincode" defaultValue={site.pincode} className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Office Timings</label>
                    <input name="workingHours" defaultValue={site.workingHours} className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Maps Link</label>
                    <input name="mapsUrl" defaultValue={site.mapsUrl} placeholder="https://maps.google.com/..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Save Contact Information
                </button>
              </form>
            )}

            {/* Subtab 5: Social Links */}
            {settingsSubTab === "social" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await store.updateSiteSettings({
                    socialLinks: {
                      facebook: String(fd.get("facebook") || ""),
                      twitter: String(fd.get("twitter") || ""),
                      linkedin: String(fd.get("linkedin") || ""),
                      youtube: String(fd.get("youtube") || ""),
                      instagram: String(fd.get("instagram") || ""),
                    },
                  });
                  triggerToast("Social media handles saved successfully.");
                }}
                className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-4"
              >
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-medium">
                  <strong>You are editing:</strong> College Settings → Social Media Handles (College Footer and Contact Directory).
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile URL</label>
                  <input name="linkedin" defaultValue={site.socialLinks?.linkedin} placeholder="https://linkedin.com/school/..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Twitter / X URL</label>
                  <input name="twitter" defaultValue={site.socialLinks?.twitter} placeholder="https://x.com/..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">YouTube Channel URL</label>
                  <input name="youtube" defaultValue={site.socialLinks?.youtube} placeholder="https://youtube.com/@..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facebook Page URL</label>
                  <input name="facebook" defaultValue={site.socialLinks?.facebook} placeholder="https://facebook.com/..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>

                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Save Social Links
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: HOMEPAGE CMS */}
        {activeTab === "homepage" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#0b224d]">Homepage Content Management</h2>
              <p className="text-xs text-slate-500">
                Configure hero heading, hero image, flash banner ticker, and call to action sections.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await store.updateHomepage({
                  heroHeading: String(fd.get("heroHeading") || ""),
                  heroSubtitle: String(fd.get("heroSubtitle") || ""),
                  topBannerText: String(fd.get("topBannerText") || ""),
                  heroPrimaryBtnText: String(fd.get("heroPrimaryBtnText") || ""),
                  heroPrimaryBtnLink: String(fd.get("heroPrimaryBtnLink") || ""),
                  heroSecondaryBtnText: String(fd.get("heroSecondaryBtnText") || ""),
                  heroSecondaryBtnLink: String(fd.get("heroSecondaryBtnLink") || ""),
                  aboutPreviewTitle: String(fd.get("aboutPreviewTitle") || ""),
                  aboutPreviewText: String(fd.get("aboutPreviewText") || ""),
                  ctaTitle: String(fd.get("ctaTitle") || ""),
                  ctaText: String(fd.get("ctaText") || ""),
                  institutionStatus: String(fd.get("institutionStatus") || "Autonomous"),
                  accreditation: String(fd.get("accreditation") || "NAAC A+"),
                  accreditationDescription: String(fd.get("accreditationDescription") || ""),
                  showAccreditation: fd.get("showAccreditation") === "on",
                  homepageHighlight: fd.get("homepageHighlight") === "on",
                });
                triggerToast("Homepage content updated! Public homepage reflects these changes immediately.");
              }}
              className="space-y-6"
            >
              {/* Section 1: Hero Section */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider">
                    Homepage → Hero Section
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Above The Fold
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hero Main Heading (H1)
                  </label>
                  <input
                    name="heroHeading"
                    defaultValue={store.homepage.heroHeading}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold text-[#0b224d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hero Subtitle / Description
                  </label>
                  <textarea
                    name="heroSubtitle"
                    rows={2}
                    defaultValue={store.homepage.heroSubtitle}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                {/* Hero Image Management */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        You are editing image displayed in: Public Homepage → Main Facade Hero Banner
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Primary campus image displayed above the fold to visitors on desktop, tablet, and mobile.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={store.homepage.heroImage || "/assets/campus-main.jpg"}
                      alt="Current Hero Banner"
                      className="w-36 h-20 object-cover rounded border border-slate-300 shadow-xs"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Current Hero Banner Graphic</p>
                      <p className="text-[11px] text-slate-500">Standard institutional campus facade</p>
                    </div>
                  </div>

                  {heroUploadError && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">Hero Banner Upload Failed</p>
                        <p className="text-[11px] leading-relaxed">{heroUploadError}</p>
                      </div>
                    </div>
                  )}

                  {pendingHeroPreview && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <img src={pendingHeroPreview} alt="Hero Preview" className="w-28 h-16 object-cover rounded border" />
                        <div>
                          <p className="text-xs font-bold text-emerald-950">New Hero Banner Selected</p>
                          <p className="text-[11px] text-emerald-700 font-mono">{pendingHeroFile?.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={handleSavePendingHero}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase shadow-sm"
                        >
                          {isUploading ? "Uploading to Cloudinary..." : "Save & Apply Hero Image"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingHeroFile(null);
                            setPendingHeroPreview(null);
                          }}
                          className="text-xs text-slate-600 hover:text-slate-900 px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={heroImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => heroImageInputRef.current?.click()}
                      className="bg-[#0b224d] text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1.5"
                    >
                      <Upload size={13} />
                      <span>{pendingHeroFile ? "Choose Different Image" : "Choose New Hero Image"}</span>
                    </button>
                    {store.homepage.heroImage && (
                      <button
                        type="button"
                        onClick={async () => {
                          await store.updateHomepage({ heroImage: "" });
                          triggerToast("Custom hero image removed. Reverted to campus default facade.");
                        }}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Reset to Default Facade
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Primary Action Button Text & Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="heroPrimaryBtnText"
                        defaultValue={store.homepage.heroPrimaryBtnText}
                        className="w-1/2 p-2 border border-slate-300 rounded text-xs font-semibold"
                      />
                      <input
                        name="heroPrimaryBtnLink"
                        defaultValue={store.homepage.heroPrimaryBtnLink}
                        className="w-1/2 p-2 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Secondary Action Button Text & Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="heroSecondaryBtnText"
                        defaultValue={store.homepage.heroSecondaryBtnText}
                        className="w-1/2 p-2 border border-slate-300 rounded text-xs font-semibold"
                      />
                      <input
                        name="heroSecondaryBtnLink"
                        defaultValue={store.homepage.heroSecondaryBtnLink}
                        className="w-1/2 p-2 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Accreditation & Institutional Status Highlight */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Homepage → Institutional Status & Accreditation Section</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Highlights Autonomous status, NAAC A+ accreditation, and institutional credentials right below the hero section.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                        store.homepage.showAccreditation !== false
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-slate-100 border-slate-300 text-slate-600"
                      }`}
                    >
                      {store.homepage.showAccreditation !== false ? "● Visible on Homepage" : "○ Hidden from Homepage"}
                    </span>
                  </div>
                </div>

                {/* Status & Accreditation Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Institution Status
                    </label>
                    <input
                      name="institutionStatus"
                      defaultValue={store.homepage.institutionStatus || "Autonomous"}
                      placeholder="Autonomous"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold text-[#0b224d]"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Displayed at the top of the visual hierarchy (e.g. Autonomous, UGC Autonomous).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Accreditation
                    </label>
                    <input
                      name="accreditation"
                      defaultValue={store.homepage.accreditation || "NAAC A+"}
                      placeholder="NAAC A+"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold text-amber-600"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Primary national accreditation (e.g. NAAC A+). "A+" receives highest visual weight.
                    </p>
                  </div>
                </div>

                {/* Accreditation Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Accreditation Description
                  </label>
                  <textarea
                    name="accreditationDescription"
                    rows={3}
                    defaultValue={
                      store.homepage.accreditationDescription ||
                      "Conferred Academic Autonomy by UGC and Accredited with Prestigious Grade A+ by NAAC, recognizing highest benchmarks in engineering curricula, research laboratories, and institutional quality."
                    }
                    placeholder="Enter official accreditation description and regulatory recognitions..."
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Institutional statement explaining academic autonomy, research benchmarks, and national standing.
                  </p>
                </div>

                {/* On / Off Toggles */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Show on Homepage Toggle */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="showAccreditation"
                      name="showAccreditation"
                      defaultChecked={store.homepage.showAccreditation !== false}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0b224d] focus:ring-[#0b224d]"
                    />
                    <div>
                      <label htmlFor="showAccreditation" className="text-xs font-bold text-slate-800 uppercase cursor-pointer">
                        Show on Homepage
                      </label>
                      <p className="text-[11px] text-slate-500">
                        On / Off toggle. When turned Off, the section is completely removed from the homepage with zero empty gap.
                      </p>
                    </div>
                  </div>

                  {/* Homepage Highlight Toggle */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="homepageHighlight"
                      name="homepageHighlight"
                      defaultChecked={store.homepage.homepageHighlight !== false}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0b224d] focus:ring-[#0b224d]"
                    />
                    <div>
                      <label htmlFor="homepageHighlight" className="text-xs font-bold text-slate-800 uppercase cursor-pointer">
                        Homepage Highlight
                      </label>
                      <p className="text-[11px] text-slate-500">
                        On / Off toggle. On = Premium Deep Navy & Refined Gold finish; Off = Crisp Institutional White styling.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Specific Save Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={async (e) => {
                      const container = e.currentTarget.closest(".space-y-5");
                      if (!container) return;
                      const statusInput = container.querySelector<HTMLInputElement>('input[name="institutionStatus"]');
                      const accInput = container.querySelector<HTMLInputElement>('input[name="accreditation"]');
                      const descInput = container.querySelector<HTMLTextAreaElement>('textarea[name="accreditationDescription"]');
                      const showInput = container.querySelector<HTMLInputElement>('input[name="showAccreditation"]');
                      const highlightInput = container.querySelector<HTMLInputElement>('input[name="homepageHighlight"]');

                      await store.updateHomepage({
                        institutionStatus: statusInput?.value || "Autonomous",
                        accreditation: accInput?.value || "NAAC A+",
                        accreditationDescription: descInput?.value || "",
                        showAccreditation: showInput ? showInput.checked : true,
                        homepageHighlight: highlightInput ? highlightInput.checked : true,
                      });
                      triggerToast("Accreditation & Institutional Status updated successfully! Homepage refreshed.");
                    }}
                    className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                  >
                    <Save size={13} />
                    <span>Save Accreditation Settings</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Top Flash Banner */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2">
                  Homepage → Top Flash Notification / Ticker
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Announcement Banner Message
                  </label>
                  <input
                    name="topBannerText"
                    defaultValue={store.homepage.topBannerText}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs font-medium"
                  />
                </div>
              </div>

              {/* Section 3: About Preview */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2">
                  Homepage → About Section Preview
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title</label>
                  <input
                    name="aboutPreviewTitle"
                    defaultValue={store.homepage.aboutPreviewTitle}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Text</label>
                  <textarea
                    name="aboutPreviewText"
                    rows={3}
                    defaultValue={store.homepage.aboutPreviewText}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 4: Call to Action */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2">
                  Homepage → Bottom Call To Action (CTA)
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Heading</label>
                  <input
                    name="ctaTitle"
                    defaultValue={store.homepage.ctaTitle}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Subtext</label>
                  <textarea
                    name="ctaText"
                    rows={2}
                    defaultValue={store.homepage.ctaText}
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                Save All Homepage Sections
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: DEPARTMENTS & SEATS CMS */}
        {activeTab === "departments" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Departments CMS & Seats Management</h2>
                <p className="text-xs text-slate-500">
                  Select any engineering branch below to edit its approved intake seats (e.g. 180 → 100), HOD profile, syllabus, and laboratories.
                </p>
              </div>
            </div>

            {/* Department Selector Pills with Visual Active State & Intake Matrix */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex flex-wrap gap-2">
                {store.departments.map((dept) => {
                  const isSelected = selectedDepartment.slug === dept.slug;
                  return (
                    <button
                      key={dept.slug}
                      type="button"
                      onClick={() => setSelectedDeptSlug(dept.slug)}
                      className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${
                        isSelected
                          ? "bg-[#0b224d] text-white border-[#0b224d] shadow-sm ring-2 ring-amber-500 scale-[1.02]"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      {isSelected && <Check size={13} className="text-amber-400 flex-shrink-0" />}
                      <span>{dept.shortTitle}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 font-extrabold"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {dept.intake} Seats
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowAddDeptModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm transition"
              >
                <Plus size={14} />
                <span>Add Department</span>
              </button>
            </div>

            {/* Form is strictly keyed by selectedDepartment.slug so switching departments always renders that exact department's pristine data */}
            <DepartmentEditorForm
              key={selectedDepartment.slug}
              department={selectedDepartment}
              onSave={async (slug, updates) => {
                await store.updateDepartment(slug, updates);
              }}
              onDelete={async (slug) => {
                await store.deleteDepartment(slug);
                const remaining = store.departments.filter((d) => d.slug !== slug);
                if (remaining[0]) {
                  setSelectedDeptSlug(remaining[0].slug);
                }
                triggerToast("Department deleted successfully.");
              }}
              canDelete={store.departments.length > 1}
              deptImageInputRef={deptImageInputRef}
              pendingDeptFile={pendingDeptFile}
              pendingDeptPreview={pendingDeptPreview}
              setPendingDeptFile={setPendingDeptFile}
              setPendingDeptPreview={setPendingDeptPreview}
              isUploading={isUploading}
              onDeptSelect={handleDeptSelect}
              deptUploadError={deptUploadError}
              onUploadImage={async (slug) => {
                if (!pendingDeptFile) return;
                setIsUploading(true);
                setDeptUploadError("");
                try {
                  const res = await uploadMediaFile(pendingDeptFile, "departments", { maxSizeMB: 5 });
                  await store.updateDepartment(slug, { image: res.url });
                  setPendingDeptFile(null);
                  setPendingDeptPreview(null);
                  setDeptUploadError("");
                  triggerToast(`Department image updated successfully for ${selectedDepartment.shortTitle}!`);
                } catch (err: any) {
                  console.error(err);
                  const msg = err?.message || "Failed to upload department image.";
                  setDeptUploadError(msg);
                  triggerToast(msg);
                } finally {
                  setIsUploading(false);
                }
              }}
              triggerToast={triggerToast}
            />
          </div>
        )}

        {/* TAB 5: ADMISSIONS & ENQUIRIES */}
        {activeTab === "admissions" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Admissions & Student Enquiries</h2>
                <p className="text-xs text-slate-500">Prospective student applications, enquiry records, and admission counseling desk</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={enqSearch}
                    onChange={(e) => setEnqSearch(e.target.value)}
                    placeholder="Search applicant, phone, city..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white w-48 sm:w-60 focus:ring-1 focus:ring-[#0b224d] outline-none"
                  />
                  {enqSearch && (
                    <button onClick={() => setEnqSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <select
                  value={enqStatusFilter}
                  onChange={(e) => setEnqStatusFilter(e.target.value)}
                  className="p-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
                >
                  <option value="All">All Statuses ({store.enquiries.length})</option>
                  <option value="Pending">Pending ({store.enquiries.filter(e => e.status === "Pending").length})</option>
                  <option value="Contacted">Contacted ({store.enquiries.filter(e => e.status === "Contacted").length})</option>
                  <option value="Enrolled">Enrolled ({store.enquiries.filter(e => e.status === "Enrolled").length})</option>
                  <option value="Closed">Closed ({store.enquiries.filter(e => e.status === "Closed").length})</option>
                </select>
              </div>
            </div>

            {store.enquiries.length === 0 ? (
              <div className="bg-white p-8 rounded border border-slate-200 text-center text-slate-500">
                <GraduationCap size={32} className="mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">No Enquiries Received Yet</p>
                <p className="text-xs mt-1">When students submit the Admissions Enquiry Form, their records appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded border border-slate-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs min-w-[680px]">
                  <thead className="bg-[#0b224d] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Branch Selected</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {store.enquiries
                      .filter((enq) => {
                        const matchesStatus = enqStatusFilter === "All" || enq.status === enqStatusFilter;
                        const q = enqSearch.trim().toLowerCase();
                        const matchesSearch =
                          !q ||
                          enq.fullName.toLowerCase().includes(q) ||
                          enq.email.toLowerCase().includes(q) ||
                          enq.phone.includes(q) ||
                          enq.branch.toLowerCase().includes(q) ||
                          (enq.city && enq.city.toLowerCase().includes(q));
                        return matchesStatus && matchesSearch;
                      })
                      .map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-slate-900">
                            <div>{enq.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {enq.submittedAt ? new Date(enq.submittedAt).toLocaleDateString() : ""}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-blue-900">{enq.branch}</td>
                          <td className="p-3">
                            <p className="font-medium text-slate-800">{enq.phone}</p>
                            <p className="text-[11px] text-slate-500">{enq.email}</p>
                          </td>
                          <td className="p-3 text-slate-700">{enq.city || "—"}</td>
                          <td className="p-3">
                            <select
                              value={enq.status}
                              onChange={(e) => store.updateEnquiryStatus(enq.id, e.target.value as any)}
                              className={`p-1 text-[11px] border rounded font-bold ${
                                enq.status === "Pending"
                                  ? "border-amber-300 bg-amber-50 text-amber-900"
                                  : enq.status === "Contacted"
                                  ? "border-blue-300 bg-blue-50 text-blue-900"
                                  : enq.status === "Enrolled"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                  : "border-slate-300 bg-slate-50 text-slate-700"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingEnquiry(enq)}
                                className="px-2 py-1 text-slate-600 hover:text-[#0b224d] hover:bg-slate-100 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                                title="View details"
                              >
                                <Eye size={13} />
                                <span>Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Delete enquiry from ${enq.fullName}?`)) {
                                    await store.deleteEnquiry(enq.id);
                                    triggerToast("Enquiry deleted.");
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                title="Delete enquiry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TRAINING & PLACEMENTS CMS */}
        {activeTab === "placements" && (
          <PlacementsAdmin store={store} triggerToast={triggerToast} />
        )}

        {/* TAB 7: CAMPUS & FACILITIES */}
        {activeTab === "facilities" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Campus & Facilities Management</h2>
                <p className="text-xs text-slate-500">Manage Central Library, Computing Center, Workshops, Sports, and Hostels</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingFacility(null);
                  setShowAddFacilityModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} />
                <span>+ Add Facility</span>
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
              <span className="font-extrabold uppercase">You are editing: Campus Facilities</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                All facility photographs and descriptions can be customized and updated live on the public facilities page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {store.facilities.map((fac) => (
                <div key={fac.id} className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <img
                      src={fac.image || "/assets/campus-main.jpg"}
                      alt={fac.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%230b224d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-weight='bold' font-size='16'%3EPK College Facility%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-[#0b224d]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      Facilities → {fac.title}
                    </span>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-sm text-[#0b224d] mb-1">{fac.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{fac.description}</p>
                    <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-semibold">
                      You are editing images displayed in: Campus Facilities → {fac.title}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {(fac.keyFeatures || []).length} Key Features
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingFacility(fac);
                          setShowAddFacilityModal(false);
                        }}
                        className="text-xs font-bold text-[#b45309] hover:text-[#92400e] hover:underline flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit Facility & Photo</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete facility "${fac.title}"?`)) {
                            await handleDeleteFacility(fac.id);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 p-1"
                        title="Delete facility"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PHOTO GALLERY CMS */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Photo Gallery & Media Management</h2>
                <p className="text-xs text-slate-500">
                  Every image displays a clear "Used in / Location" indicator so you know exactly where it appears on the public website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingGalleryItem(null);
                  setGalleryModalPreview(null);
                  setGalleryModalError("");
                  setShowAddGalleryModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} />
                <span>+ Upload Photo</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
              <div className="flex flex-wrap gap-1.5">
                {(["All", "Campus", "Laboratories", "Academic Spaces", "Library", "Sports", "Events", "Departments"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      galleryCategoryFilter === cat
                        ? "bg-[#0b224d] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Filter gallery photos..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white w-full sm:w-56 focus:ring-1 focus:ring-[#0b224d] outline-none"
                />
                {gallerySearch && (
                  <button onClick={() => setGallerySearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {store.galleryItems
                .filter((item) => {
                  const matchesCat = galleryCategoryFilter === "All" || item.category === galleryCategoryFilter;
                  const q = gallerySearch.trim().toLowerCase();
                  const matchesSearch =
                    !q ||
                    item.title.toLowerCase().includes(q) ||
                    (item.usedIn && item.usedIn.toLowerCase().includes(q));
                  return matchesCat && matchesSearch;
                })
                .map((item) => (
                  <div key={item.id} className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%230b224d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-weight='bold' font-size='14'%3EPK College Photo%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-[#0b224d]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{item.title}</p>
                      {item.usedIn && (
                        <p className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-semibold truncate mb-2">
                          Used in: {item.usedIn}
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">ID #{item.id}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGalleryItem(item);
                              setGalleryModalPreview(item.image);
                              setGalleryModalError("");
                              setShowAddGalleryModal(true);
                            }}
                            className="text-[#0b224d] hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete photo "${item.title}"?`)) {
                                await store.deleteGalleryItem(item.id);
                                triggerToast("Photo removed from gallery.");
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 9: ANNOUNCEMENTS CMS */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Announcements & Circulars CMS</h2>
                <p className="text-xs text-slate-500">Post, publish, edit, or delete official college circulars and student notifications</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAnn(null);
                  setShowAddAnnModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} />
                <span>+ New Announcement</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
              <div className="flex flex-wrap gap-1.5">
                {["All", "Academic", "Examinations", "Admissions", "Placements", "General"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAnnCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      annCategoryFilter === cat
                        ? "bg-[#0b224d] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={annSearch}
                  onChange={(e) => setAnnSearch(e.target.value)}
                  placeholder="Search announcements..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white w-full sm:w-60 focus:ring-1 focus:ring-[#0b224d] outline-none"
                />
                {annSearch && (
                  <button onClick={() => setAnnSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-[#0b224d] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Title & Summary</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {store.announcements
                    .filter((ann) => {
                      const matchesCat = annCategoryFilter === "All" || ann.category === annCategoryFilter;
                      const q = annSearch.trim().toLowerCase();
                      const matchesSearch =
                        !q ||
                        ann.title.toLowerCase().includes(q) ||
                        ann.summary.toLowerCase().includes(q) ||
                        (ann.content && ann.content.toLowerCase().includes(q));
                      return matchesCat && matchesSearch;
                    })
                    .map((ann) => (
                      <tr key={ann.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 whitespace-nowrap text-slate-500 font-mono">{ann.date}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                            {ann.category}
                          </span>
                          {ann.isUrgent && (
                            <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold text-[9px] uppercase">
                              Urgent
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{ann.title}</p>
                          <p className="text-slate-500 text-[11px] line-clamp-1">{ann.summary}</p>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAnn(ann);
                                setShowAddAnnModal(false);
                              }}
                              className="text-[#0b224d] hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 hover:underline"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete notice "${ann.title}"?`)) {
                                  await store.deleteAnnouncement(ann.id);
                                  triggerToast("Announcement deleted.");
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete notice"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: EVENTS CMS */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b224d]">Campus Events & Symposia CMS</h2>
                <p className="text-xs text-slate-500">Manage symposiums, workshops, technical conferences, and sports meets</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setShowAddEventModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} />
                <span>+ Add Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {store.events.map((evt) => (
                <div key={evt.id} className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  {evt.image && (
                    <div className="h-36 bg-slate-100 relative overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                        {evt.category}
                      </span>
                      {evt.registrationOpen ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-1.5 py-0.5 rounded">
                          Registration Open
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 font-medium px-1.5 py-0.5 rounded">
                          Closed
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#0b224d] mb-1">{evt.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{evt.description}</p>
                    <p className="text-[11px] text-slate-500 font-medium">📅 {evt.date} {evt.time ? `· ${evt.time}` : ""} | 📍 {evt.venue}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">ID #{evt.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEvent(evt);
                          setShowAddEventModal(false);
                        }}
                        className="text-[#0b224d] hover:text-blue-800 text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Delete event "${evt.title}"?`)) {
                            await store.deleteEvent(evt.id);
                            triggerToast("Event deleted.");
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: CONTACT DESK */}
        {activeTab === "contact" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#0b224d]">Contact Desk CMS</h2>
              <p className="text-xs text-slate-500">
                Manage all institutional contact details, admissions helpdesk numbers, office timings, map coordinates, and social handles.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await store.updateSiteSettings({
                  phone: String(fd.get("phone") || ""),
                  admissionsPhone: String(fd.get("admissionsPhone") || ""),
                  email: String(fd.get("email") || ""),
                  admissionsEmail: String(fd.get("admissionsEmail") || ""),
                  address: String(fd.get("address") || ""),
                  city: String(fd.get("city") || ""),
                  state: String(fd.get("state") || ""),
                  pincode: String(fd.get("pincode") || ""),
                  workingHours: String(fd.get("workingHours") || ""),
                  mapsUrl: String(fd.get("mapsUrl") || ""),
                  socialLinks: {
                    linkedin: String(fd.get("linkedin") || ""),
                    youtube: String(fd.get("youtube") || ""),
                    twitter: String(fd.get("twitter") || ""),
                    facebook: String(fd.get("facebook") || ""),
                    instagram: String(fd.get("instagram") || ""),
                  },
                });
                triggerToast("Contact desk updated and synchronized across all public routes & Firestore.");
              }}
              className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-5"
            >
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 font-medium">
                <strong>Live Sync:</strong> Values saved here immediately reflect on the Header top bar, Footer, and Public Contact Page.
              </div>

              {/* Telephone & Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Main Institutional Phone</label>
                  <input name="phone" defaultValue={site.phone} placeholder="Official telephone / mobile" className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admissions Helpline</label>
                  <input name="admissionsPhone" defaultValue={site.admissionsPhone} placeholder="Admissions inquiry number" className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
              </div>

              {/* Emails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official General Email</label>
                  <input name="email" defaultValue={site.email} placeholder="info@pk-college.edu.in" className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admissions Desk Email</label>
                  <input name="admissionsEmail" defaultValue={site.admissionsEmail} placeholder="admissions@pk-college.edu.in" className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Postal Campus Address</label>
                <textarea name="address" rows={2} defaultValue={site.address} placeholder="Campus road, locality..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Town</label>
                  <input name="city" defaultValue={site.city} className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                  <input name="state" defaultValue={site.state} className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pincode</label>
                  <input name="pincode" defaultValue={site.pincode} className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Office Timings</label>
                  <input name="workingHours" defaultValue={site.workingHours} placeholder="e.g. Mon - Sat: 9:00 AM - 5:00 PM" className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Maps Link</label>
                  <input name="mapsUrl" defaultValue={site.mapsUrl} placeholder="https://maps.google.com/..." className="w-full p-2.5 border border-slate-300 rounded text-xs" />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-[#0b224d] uppercase tracking-wide">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn URL</label>
                    <input name="linkedin" defaultValue={site.socialLinks?.linkedin || ""} placeholder="https://linkedin.com/..." className="w-full p-2 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">YouTube URL</label>
                    <input name="youtube" defaultValue={site.socialLinks?.youtube || ""} placeholder="https://youtube.com/..." className="w-full p-2 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Twitter / X URL</label>
                    <input name="twitter" defaultValue={site.socialLinks?.twitter || ""} placeholder="https://x.com/..." className="w-full p-2 border border-slate-300 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Facebook URL</label>
                    <input name="facebook" defaultValue={site.socialLinks?.facebook || ""} placeholder="https://facebook.com/..." className="w-full p-2 border border-slate-300 rounded text-xs" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm transition"
              >
                Save Contact Desk & Social Media
              </button>
            </form>
          </div>
        )}
      </main>
      </div>

      {/* MODAL: ADD DEPARTMENT */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">Add New Engineering Department</h3>
                <p className="text-[11px] text-slate-500">Creates new branch and registers intake in Firestore</p>
              </div>
              <button onClick={() => setShowAddDeptModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const title = String(fd.get("title") || "").trim();
                const shortTitle = String(fd.get("shortTitle") || "").trim();
                const code = String(fd.get("code") || shortTitle).trim().toUpperCase();
                const slug = String(fd.get("slug") || shortTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
                const intake = Number(fd.get("intake")) || 60;
                const degree = String(fd.get("degree") || "B.Tech");
                const overview = String(
                  fd.get("overview") ||
                    `Department of ${title} at PK College of Engineering & Technology offering comprehensive technical curriculum.`
                );
                const hodName = String(fd.get("hodName") || "Department Chair");

                await store.addDepartment({
                  code,
                  title,
                  shortTitle,
                  slug,
                  established: `Established in ${new Date().getFullYear()}`,
                  intake,
                  overview,
                  image: store.galleryItems[0]?.image || "/assets/campus-main.jpg",
                  hod: {
                    name: hodName,
                    designation: "Head of the Department",
                    qualification: "Ph.D / M.Tech",
                    experience: "10+ Years",
                    email: `${code.toLowerCase()}.hod@pk-college.edu.in`,
                  },
                  laboratories: [
                    `${shortTitle} Advanced Research & Computing Lab`,
                    `${shortTitle} Specialized Engineering Lab`,
                  ],
                  keyDomains: ["Core Systems", "Advanced Technologies", "Applied Engineering"],
                  careerProspects: ["Systems Engineer", "Project Lead", "Technical Specialist"],
                  vision: `To achieve academic and research excellence in ${title}.`,
                  mission: [
                    `Deliver rigorous academic and laboratory education in ${title}.`,
                    "Foster innovative engineering research and disciplined professional practice.",
                  ],
                });

                setShowAddDeptModal(false);
                setSelectedDeptSlug(slug);
                triggerToast(`Department ${shortTitle} successfully created with ${intake} approved seats!`);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Department Name / Discipline
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  className="w-full p-2.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Short Acronym / Code
                  </label>
                  <input
                    name="shortTitle"
                    required
                    placeholder="e.g. AI & DS"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Approved Annual Intake (Seats)
                  </label>
                  <input
                    name="intake"
                    type="number"
                    defaultValue={60}
                    min={10}
                    max={600}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    URL Slug (Identifier)
                  </label>
                  <input
                    name="slug"
                    placeholder="e.g. ai-data-science"
                    className="w-full p-2.5 border border-slate-300 rounded font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Degree Awarded
                  </label>
                  <input
                    name="degree"
                    defaultValue="B.Tech"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Head of Department (HOD)
                </label>
                <input
                  name="hodName"
                  placeholder="e.g. Dr. K. Ramesh, Ph.D."
                  className="w-full p-2.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Department Narrative Overview
                </label>
                <textarea
                  name="overview"
                  rows={3}
                  placeholder="Brief overview of curriculum focus, technical objectives, and student development..."
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0b224d] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow hover:bg-[#071633]"
                >
                  Create & Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ANNOUNCEMENT */}
      <AnnouncementModal
        isOpen={showAddAnnModal || Boolean(editingAnn)}
        announcement={editingAnn}
        onClose={() => {
          setShowAddAnnModal(false);
          setEditingAnn(null);
        }}
        onSave={handleSaveAnnouncement}
        onDelete={store.deleteAnnouncement}
      />

      {/* MODAL: ADD / EDIT CAMPUS EVENT */}
      <EventModal
        isOpen={showAddEventModal || Boolean(editingEvent)}
        event={editingEvent}
        onClose={() => {
          setShowAddEventModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={store.deleteEvent}
      />

      {/* MODAL: ADD / EDIT PHOTO GALLERY ITEM */}
      {(showAddGalleryModal || Boolean(editingGalleryItem)) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingGalleryItem ? `Edit Photo: ${editingGalleryItem.title}` : "Upload Image to Media Gallery"}
                </h3>
                <p className="text-[11px] text-slate-500">Live preview & location tagging for public campus display</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddGalleryModal(false);
                  setEditingGalleryItem(null);
                  setGalleryModalPreview(null);
                  setGalleryModalError("");
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {galleryModalError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Gallery Photo Upload Failed</p>
                  <p className="text-[11px] leading-relaxed">{galleryModalError}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const file = fd.get("imageFile") as File;
                const title = String(fd.get("title") || "").trim() || "Campus Media Asset";
                const category = (fd.get("category") as GalleryCategory) || "Campus";
                const usedIn = String(fd.get("usedIn") || "Gallery → Campus");

                setIsUploading(true);
                setGalleryModalError("");
                try {
                  if (editingGalleryItem) {
                    let imageUrl = editingGalleryItem.image;
                    if (file && file.size > 0) {
                      const res = await uploadMediaFile(file, "gallery", { maxSizeMB: 5 });
                      imageUrl = res.url;
                    }
                    await store.updateGalleryItem(editingGalleryItem.id, {
                      title,
                      category,
                      usedIn,
                      alt: title,
                      image: imageUrl,
                    });
                    triggerToast(`Updated photo: ${title}`);
                  } else {
                    let imageUrl = "/assets/campus-main.jpg";
                    if (file && file.size > 0) {
                      const res = await uploadMediaFile(file, "gallery", { maxSizeMB: 5 });
                      imageUrl = res.url;
                    }
                    await store.addGalleryItem({
                      title,
                      category,
                      image: imageUrl,
                      alt: title,
                      usedIn,
                    });
                    triggerToast(`Photo added to gallery: ${title}`);
                  }
                  setShowAddGalleryModal(false);
                  setEditingGalleryItem(null);
                  setGalleryModalPreview(null);
                  setGalleryModalError("");
                } catch (err: any) {
                  console.error(err);
                  const msg = err?.message || "Failed to save gallery item.";
                  setGalleryModalError(msg);
                  triggerToast(msg);
                } finally {
                  setIsUploading(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {editingGalleryItem ? "Replace Photo (Optional)" : "Select Image File *"}
                </label>
                <input
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required={!editingGalleryItem}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const val = validateMediaFile(f, { maxSizeMB: 5 });
                    if (!val.valid) {
                      triggerToast(val.error || "Invalid file format");
                      e.target.value = "";
                      return;
                    }
                    const r = new FileReader();
                    r.onload = () => {
                      if (typeof r.result === "string") setGalleryModalPreview(r.result);
                    };
                    r.readAsDataURL(f);
                  }}
                  className="w-full p-2 border border-slate-300 rounded file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0b224d] hover:file:bg-blue-100"
                />
                <p className="text-[10px] text-slate-400 mt-1">Accepted: JPG, PNG, WEBP · Max: 5 MB</p>
              </div>

              {(galleryModalPreview || editingGalleryItem?.image) && (
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>{galleryModalPreview ? "New Photo Preview" : "Current Photo Preview"}</span>
                    <span className="text-emerald-600 font-medium">Ready</span>
                  </div>
                  <img
                    src={galleryModalPreview || editingGalleryItem?.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded border border-slate-200 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%230b224d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-weight='bold' font-size='14'%3EPK College Photo%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image Caption / Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingGalleryItem?.title || ""}
                  placeholder="e.g. Mechanical CNC Machining Center"
                  className="w-full p-2.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingGalleryItem?.category || "Campus"}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Campus">Campus</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Academic Spaces">Academic Spaces</option>
                    <option value="Library">Library</option>
                    <option value="Sports">Sports</option>
                    <option value="Events">Events</option>
                    <option value="Departments">Departments</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Where This Image Appears</label>
                  <select
                    name="usedIn"
                    defaultValue={editingGalleryItem?.usedIn || "Homepage → Campus Section"}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                  >
                    <option value="Homepage → Campus Section">Homepage → Campus Section</option>
                    <option value="Homepage → Hero">Homepage → Hero</option>
                    <option value="Departments → CSE → Computing Labs">Departments → CSE → Computing Labs</option>
                    <option value="Departments → AI & DS → Machine Learning Suite">Departments → AI & DS → Machine Learning Suite</option>
                    <option value="Departments → ECE → Embedded Systems Lab">Departments → ECE → Embedded Systems Lab</option>
                    <option value="Departments → EEE → Power Systems Lab">Departments → EEE → Power Systems Lab</option>
                    <option value="Departments → Mechanical → Advanced Manufacturing Lab">Departments → Mechanical → Advanced Manufacturing Lab</option>
                    <option value="Departments → Civil → Structural & Geotech Lab">Departments → Civil → Structural & Geotech Lab</option>
                    <option value="Facilities → Central Knowledge Resource Library">Facilities → Central Knowledge Resource Library</option>
                    <option value="Facilities → High-Performance Computing Center">Facilities → High-Performance Computing Center</option>
                    <option value="Campus Life → Multipurpose Sports Arena">Campus Life → Multipurpose Sports Arena</option>
                    <option value="Events → Tech Fest & Convocation">Events → Tech Fest & Convocation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGalleryModal(false);
                    setEditingGalleryItem(null);
                    setGalleryModalPreview(null);
                    setGalleryModalError("");
                  }}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-[#0b224d] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow hover:bg-[#071633] disabled:opacity-70 flex items-center gap-1.5"
                >
                  {isUploading && <RefreshCw size={13} className="animate-spin" />}
                  <span>{editingGalleryItem ? "Save Changes" : "Upload Asset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CAMPUS FACILITY (PROFESSIONAL REDESIGN) */}
      <FacilityModal
        isOpen={Boolean(editingFacility || showAddFacilityModal)}
        facility={editingFacility}
        onClose={() => {
          setEditingFacility(null);
          setShowAddFacilityModal(false);
        }}
        onSave={handleSaveFacility}
        onDelete={handleDeleteFacility}
      />

      {/* MODAL: VIEW ADMISSION ENQUIRY DETAILS */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">Admission Enquiry Details</h3>
                <p className="text-[11px] text-slate-500 font-mono">Enquiry ID: #{viewingEnquiry.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingEnquiry(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">Candidate Selected Discipline</span>
                  <span className="text-sm font-extrabold text-[#0b224d]">{viewingEnquiry.branch}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Application Status</span>
                  <select
                    value={viewingEnquiry.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      store.updateEnquiryStatus(viewingEnquiry.id, newStatus);
                      setViewingEnquiry({ ...viewingEnquiry, status: newStatus });
                      triggerToast(`Status updated to ${newStatus}`);
                    }}
                    className="p-1 border rounded text-xs font-bold bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingEnquiry.fullName}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Submission Date</span>
                  <span className="text-slate-700">
                    {viewingEnquiry.submittedAt ? new Date(viewingEnquiry.submittedAt).toLocaleString() : "Recent"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Phone / Mobile</span>
                  <a href={`tel:${viewingEnquiry.phone}`} className="font-bold text-blue-900 hover:underline">
                    {viewingEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Email Address</span>
                  <a href={`mailto:${viewingEnquiry.email}`} className="font-bold text-blue-900 hover:underline">
                    {viewingEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">City</span>
                  <span className="text-slate-800">{viewingEnquiry.city || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Prior Qualification</span>
                  <span className="text-slate-800">{viewingEnquiry.qualification || "12th Standard / Inter"}</span>
                </div>
              </div>

              {viewingEnquiry.message && (
                <div>
                  <span className="font-bold text-slate-700 uppercase text-[11px] block mb-1">
                    Candidate Query / Remarks
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded leading-relaxed text-slate-700">
                    {viewingEnquiry.message}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Delete enquiry from ${viewingEnquiry.fullName}?`)) {
                      await store.deleteEnquiry(viewingEnquiry.id);
                      setViewingEnquiry(null);
                      triggerToast("Enquiry record deleted.");
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Delete Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingEnquiry(null)}
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase text-xs shadow"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PLACEMENT YEAR */}
      {(showAddPlacementModal || editingPlacementYear) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingPlacementYear ? `Edit Placement Year ${editingPlacementYear.year}` : "Add New Placement Year Record"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Values entered here are saved to Firestore and rendered across the website.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddPlacementModal(false);
                  setEditingPlacementYear(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const yearVal = String(fd.get("year") || "").trim();
                if (!yearVal) {
                  alert("Placement year is required (e.g. 2025).");
                  return;
                }

                const recordData: PlacementYearStat = {
                  id: editingPlacementYear ? editingPlacementYear.id : `stat-${yearVal}-${Date.now()}`,
                  year: yearVal,
                  highestPackage: String(fd.get("highestPackage") || "").trim(),
                  highestPackageCurrency: String(fd.get("highestPackageCurrency") || "₹").trim(),
                  averagePackage: String(fd.get("averagePackage") || "").trim(),
                  studentsPlaced: String(fd.get("studentsPlaced") || "").trim(),
                  studentsEligible: String(fd.get("studentsEligible") || "").trim(),
                  placementPercentage: String(fd.get("placementPercentage") || "").trim(),
                  companiesCount: String(fd.get("companiesCount") || "").trim(),
                  description: String(fd.get("description") || "").trim(),
                  isFeatured: fd.get("isFeatured") === "on",
                };

                if (editingPlacementYear) {
                  await store.updatePlacementYear(editingPlacementYear.id, recordData);
                  triggerToast(`Placement record for ${yearVal} updated.`);
                } else {
                  await store.addPlacementYear(recordData);
                  triggerToast(`Placement record for ${yearVal} created.`);
                }

                setShowAddPlacementModal(false);
                setEditingPlacementYear(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Placement Year *
                  </label>
                  <input
                    name="year"
                    required
                    placeholder="e.g. 2025"
                    defaultValue={editingPlacementYear?.year || ""}
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Highest Package Currency
                  </label>
                  <input
                    name="highestPackageCurrency"
                    defaultValue={editingPlacementYear?.highestPackageCurrency || "₹"}
                    placeholder="₹"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-700 uppercase mb-1">
                    Highest Package (Prominent) *
                  </label>
                  <input
                    name="highestPackage"
                    placeholder="e.g. 12 LPA"
                    defaultValue={editingPlacementYear?.highestPackage || ""}
                    className="w-full p-2.5 border border-amber-300 rounded font-bold text-[#0b224d]"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Appears with top visual weight</p>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Average Package
                  </label>
                  <input
                    name="averagePackage"
                    placeholder="e.g. 4.8 LPA"
                    defaultValue={editingPlacementYear?.averagePackage || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Students Placed
                  </label>
                  <input
                    name="studentsPlaced"
                    placeholder="e.g. 148"
                    defaultValue={editingPlacementYear?.studentsPlaced || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Eligible Students
                  </label>
                  <input
                    name="studentsEligible"
                    placeholder="e.g. 175"
                    defaultValue={editingPlacementYear?.studentsEligible || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Placement %
                  </label>
                  <input
                    name="placementPercentage"
                    placeholder="e.g. 84.5%"
                    defaultValue={editingPlacementYear?.placementPercentage || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Number of Recruiting Companies
                </label>
                <input
                  name="companiesCount"
                  placeholder="e.g. 38"
                  defaultValue={editingPlacementYear?.companiesCount || ""}
                  className="w-full p-2.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Placement Description / Summary
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Summary of campus placement drives, sectors, and top recruiters for this batch..."
                  defaultValue={editingPlacementYear?.description || ""}
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editingPlacementYear?.isFeatured ?? true}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="isFeatured" className="font-bold text-slate-700 select-none">
                  Set as Featured Placement Year on Homepage Cards
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlacementModal(false);
                    setEditingPlacementYear(null);
                  }}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow"
                >
                  {editingPlacementYear ? "Save Changes" : "Create Placement Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
