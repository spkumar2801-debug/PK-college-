import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  Briefcase,
  TrendingUp,
  Award,
  Building2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  X,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  type PlacementData,
  type PlacementYearStat,
  type HighestPackageFeature,
  type StudentPlacementAchievement,
  type RecruiterCompany,
  type PlacementGalleryItem,
} from "@/data/site";
import { uploadMediaFile, validateMediaFile } from "@/lib/media-upload";

interface PlacementsAdminProps {
  store: {
    placements: PlacementData;
    updatePlacements: (updates: Partial<PlacementData>) => Promise<void>;
    updateHighestPackage: (updates: Partial<HighestPackageFeature>) => Promise<void>;
    addPlacementYear: (stat: PlacementYearStat) => Promise<void>;
    updatePlacementYear: (id: string, updates: Partial<PlacementYearStat>) => Promise<void>;
    deletePlacementYear: (id: string) => Promise<void>;
    addRecruiterCompany: (company: RecruiterCompany) => Promise<void>;
    updateRecruiterCompany: (id: string, updates: Partial<RecruiterCompany>) => Promise<void>;
    deleteRecruiterCompany: (id: string) => Promise<void>;
    addPlacementGalleryItem: (item: PlacementGalleryItem) => Promise<void>;
    updatePlacementGalleryItem: (id: string, updates: Partial<PlacementGalleryItem>) => Promise<void>;
    deletePlacementGalleryItem: (id: string) => Promise<void>;
    addPlacementAchievement?: (item: StudentPlacementAchievement) => Promise<void>;
    updatePlacementAchievement?: (id: string, updates: Partial<StudentPlacementAchievement>) => Promise<void>;
    deletePlacementAchievement?: (id: string) => Promise<void>;
  };
  triggerToast: (msg: string | { text: string; type?: "success" | "error" }) => void;
}

type SubTab = "overview" | "statistics" | "highestPackage" | "yearWise" | "achievements" | "companies" | "gallery";

export function PlacementsAdmin({ store, triggerToast }: PlacementsAdminProps) {
  const [subTab, setSubTab] = useState<SubTab>("overview");
  const placements = store.placements;

  // ----------------------------------------------------
  // SUBTAB 3: HIGHEST PACKAGE STATE & HANDLERS
  // ----------------------------------------------------
  const highestPackage = placements.highestPackage || {
    packageAmount: "",
    currency: "₹",
    placementYear: "",
    studentName: "",
    department: "",
    program: "B.Tech",
    batchYear: "",
    companyName: "",
    studentPhoto: "",
    photoPublicId: "",
    description: "",
    isVisible: true,
  };

  const highestPhotoInputRef = useRef<HTMLInputElement>(null);
  const [highestPhotoFile, setHighestPhotoFile] = useState<File | null>(null);
  const [highestPhotoPreview, setHighestPhotoPreview] = useState<string | null>(null);
  const [isUploadingHighestPhoto, setIsUploadingHighestPhoto] = useState(false);
  const [highestPhotoError, setHighestPhotoError] = useState("");

  const handleHighestPhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      setHighestPhotoError(validation.error || "Invalid image file");
      triggerToast(validation.error || "Invalid image file");
      e.target.value = "";
      return;
    }

    setHighestPhotoError("");
    setHighestPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHighestPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadHighestPhoto = async () => {
    if (!highestPhotoFile) {
      triggerToast("Please select a student photo to upload.");
      return;
    }

    setIsUploadingHighestPhoto(true);
    setHighestPhotoError("");
    try {
      const result = await uploadMediaFile(highestPhotoFile, "placements/highest_package", { maxSizeMB: 5 });
      await store.updateHighestPackage({
        studentPhoto: result.url,
        photoPublicId: result.publicId,
      });
      setHighestPhotoFile(null);
      setHighestPhotoPreview(null);
      if (highestPhotoInputRef.current) highestPhotoInputRef.current.value = "";
      triggerToast("Student photo uploaded and saved to Cloudinary!");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Cloudinary upload failed. Existing photo preserved.";
      setHighestPhotoError(msg);
      triggerToast(msg);
    } finally {
      setIsUploadingHighestPhoto(false);
    }
  };

  const handleRemoveHighestPhoto = async () => {
    if (!window.confirm("Remove highest-package student photo?")) return;
    try {
      await store.updateHighestPackage({
        studentPhoto: "",
        photoPublicId: "",
      });
      setHighestPhotoFile(null);
      setHighestPhotoPreview(null);
      triggerToast("Student photo removed.");
    } catch (err: any) {
      triggerToast("Failed to remove photo.");
    }
  };

  const [isSavingHighestPackage, setIsSavingHighestPackage] = useState(false);

  const handleSaveHighestPackageForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setIsSavingHighestPackage(true);
    setHighestPhotoError("");

    let uploadedPhotoUrl = highestPackage.studentPhoto || "";
    let uploadedPhotoPublicId = highestPackage.photoPublicId || "";

    try {
      if (highestPhotoFile) {
        setIsUploadingHighestPhoto(true);
        const result = await uploadMediaFile(highestPhotoFile, "placements/highest_package", { maxSizeMB: 5 });
        uploadedPhotoUrl = result.url;
        uploadedPhotoPublicId = result.publicId;
        setHighestPhotoFile(null);
        setHighestPhotoPreview(null);
        if (highestPhotoInputRef.current) highestPhotoInputRef.current.value = "";
      }

      const updates: Partial<HighestPackageFeature> = {
        packageAmount: String(fd.get("packageAmount") || "").trim(),
        currency: String(fd.get("currency") || "₹").trim(),
        placementYear: String(fd.get("placementYear") || "").trim(),
        studentName: String(fd.get("studentName") || "").trim(),
        department: String(fd.get("department") || "").trim(),
        program: String(fd.get("program") || "B.Tech").trim(),
        batchYear: String(fd.get("batchYear") || "").trim(),
        companyName: String(fd.get("companyName") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        achievementDescription: String(fd.get("achievementDescription") || fd.get("description") || "").trim(),
        studentPhoto: uploadedPhotoUrl,
        photoPublicId: uploadedPhotoPublicId,
        isVisible: fd.get("isVisible") === "on",
      };

      await store.updateHighestPackage(updates);
      triggerToast("Highest package feature updated successfully!");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to update highest package details.";
      setHighestPhotoError(msg);
      triggerToast(msg);
    } finally {
      setIsSavingHighestPackage(false);
      setIsUploadingHighestPhoto(false);
    }
  };

  // ----------------------------------------------------
  // SUBTAB 5: STUDENT ACHIEVEMENTS MODAL & ACTIONS
  // ----------------------------------------------------
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<StudentPlacementAchievement | null>(null);
  const [achievementPhotoFile, setAchievementPhotoFile] = useState<File | null>(null);
  const [achievementPhotoPreview, setAchievementPhotoPreview] = useState<string | null>(null);
  const [isUploadingAchievementPhoto, setIsUploadingAchievementPhoto] = useState(false);
  const [achievementError, setAchievementError] = useState("");

  const handleAchievementPhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const val = validateMediaFile(file, { maxSizeMB: 5 });
    if (!val.valid) {
      setAchievementError(val.error || "Invalid image file");
      triggerToast(val.error || "Invalid image file");
      e.target.value = "";
      return;
    }
    setAchievementError("");
    setAchievementPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAchievementPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAchievement = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const studentName = String(fd.get("studentName") || "").trim();
    const companyName = String(fd.get("companyName") || "").trim();
    const packageAmount = String(fd.get("packageAmount") || "").trim();

    if (!studentName) {
      triggerToast("Student name is required.");
      return;
    }
    if (!companyName) {
      triggerToast("Company name is required.");
      return;
    }
    if (!packageAmount) {
      triggerToast("Package amount is required.");
      return;
    }

    setIsUploadingAchievementPhoto(true);
    setAchievementError("");

    try {
      let photoUrl = editingAchievement?.studentPhoto || "";
      let publicId = editingAchievement?.photoPublicId || "";

      if (achievementPhotoFile) {
        const uploadRes = await uploadMediaFile(achievementPhotoFile, "placements/achievements", { maxSizeMB: 5 });
        photoUrl = uploadRes.url;
        publicId = uploadRes.publicId;
      }

      const achievementData: StudentPlacementAchievement = {
        id: editingAchievement ? editingAchievement.id : `achieve-${Date.now()}`,
        studentName,
        rollNumber: String(fd.get("rollNumber") || "").trim(),
        department: String(fd.get("department") || "").trim(),
        program: String(fd.get("program") || "B.Tech").trim(),
        companyName,
        packageAmount,
        currency: String(fd.get("currency") || "₹").trim(),
        roleDesignation: String(fd.get("roleDesignation") || "").trim(),
        placementYear: String(fd.get("placementYear") || new Date().getFullYear().toString()).trim(),
        studentPhoto: photoUrl,
        photoPublicId: publicId,
        achievementDescription: String(fd.get("achievementDescription") || "").trim(),
        displayOrder: Number(fd.get("displayOrder") || 0),
        isVisible: fd.get("isVisible") === "on",
      };

      if (editingAchievement) {
        if (store.updatePlacementAchievement) {
          await store.updatePlacementAchievement(editingAchievement.id, achievementData);
        }
        triggerToast(`Achievement for "${studentName}" updated.`);
      } else {
        if (store.addPlacementAchievement) {
          await store.addPlacementAchievement(achievementData);
        }
        triggerToast(`Added achievement for "${studentName}".`);
      }

      setShowAchievementModal(false);
      setEditingAchievement(null);
      setAchievementPhotoFile(null);
      setAchievementPhotoPreview(null);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to save achievement.";
      setAchievementError(msg);
      triggerToast(msg);
    } finally {
      setIsUploadingAchievementPhoto(false);
    }
  };

  // ----------------------------------------------------
  // SUBTAB 4: YEAR-WISE PLACEMENT MODAL & ACTIONS
  // ----------------------------------------------------
  const [showYearModal, setShowYearModal] = useState(false);
  const [editingYearStat, setEditingYearStat] = useState<PlacementYearStat | null>(null);

  const handleSaveYearRecord = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const yearVal = String(fd.get("year") || "").trim();
    if (!yearVal) {
      triggerToast("Placement year is required.");
      return;
    }

    const statRecord: PlacementYearStat = {
      id: editingYearStat ? editingYearStat.id : `stat-${yearVal}-${Date.now()}`,
      year: yearVal,
      highestPackage: String(fd.get("highestPackage") || "").trim(),
      highestPackageCurrency: String(fd.get("highestPackageCurrency") || "₹").trim(),
      averagePackage: String(fd.get("averagePackage") || "").trim(),
      medianPackage: String(fd.get("medianPackage") || "").trim(),
      studentsPlaced: String(fd.get("studentsPlaced") || "").trim(),
      studentsEligible: String(fd.get("studentsEligible") || "").trim(),
      placementPercentage: String(fd.get("placementPercentage") || "").trim(),
      companiesCount: String(fd.get("companiesCount") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      isFeatured: fd.get("isFeatured") === "on",
    };

    if (editingYearStat) {
      await store.updatePlacementYear(editingYearStat.id, statRecord);
      triggerToast(`Placement stats for ${yearVal} updated.`);
    } else {
      await store.addPlacementYear(statRecord);
      triggerToast(`Placement stats for ${yearVal} created.`);
    }

    setShowYearModal(false);
    setEditingYearStat(null);
  };

  // ----------------------------------------------------
  // SUBTAB 5: RECRUITER COMPANY MODAL & ACTIONS
  // ----------------------------------------------------
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<RecruiterCompany | null>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [isUploadingCompanyLogo, setIsUploadingCompanyLogo] = useState(false);
  const [companyLogoError, setCompanyLogoError] = useState("");

  const handleCompanyLogoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const val = validateMediaFile(file, { maxSizeMB: 3, allowSvg: true });
    if (!val.valid) {
      setCompanyLogoError(val.error || "Invalid logo format");
      triggerToast(val.error || "Invalid logo format");
      e.target.value = "";
      return;
    }
    setCompanyLogoError("");
    setCompanyLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setCompanyLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) {
      triggerToast("Company name is required.");
      return;
    }

    setIsUploadingCompanyLogo(true);
    setCompanyLogoError("");

    try {
      let logoUrl = editingCompany?.logo || "";
      let logoPublicId = editingCompany?.logoPublicId || "";

      if (companyLogoFile) {
        const uploadRes = await uploadMediaFile(companyLogoFile, "placements/companies", { maxSizeMB: 3, allowSvg: true });
        logoUrl = uploadRes.url;
        logoPublicId = uploadRes.publicId;
      }

      const companyData: RecruiterCompany = {
        id: editingCompany ? editingCompany.id : `comp-${Date.now()}`,
        name,
        logo: logoUrl,
        logoPublicId,
        placementYear: String(fd.get("placementYear") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        websiteUrl: String(fd.get("websiteUrl") || "").trim(),
        displayOrder: Number(fd.get("displayOrder") || 0),
        isVisible: fd.get("isVisible") === "on",
      };

      if (editingCompany) {
        await store.updateRecruiterCompany(editingCompany.id, companyData);
        triggerToast(`Recruiter "${name}" updated.`);
      } else {
        await store.addRecruiterCompany(companyData);
        triggerToast(`Recruiter "${name}" added.`);
      }

      setShowCompanyModal(false);
      setEditingCompany(null);
      setCompanyLogoFile(null);
      setCompanyLogoPreview(null);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to save company.";
      setCompanyLogoError(msg);
      triggerToast(msg);
    } finally {
      setIsUploadingCompanyLogo(false);
    }
  };

  // ----------------------------------------------------
  // SUBTAB 6: PLACEMENT GALLERY MODAL & ACTIONS
  // ----------------------------------------------------
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<PlacementGalleryItem | null>(null);
  const [galleryPhotoFile, setGalleryPhotoFile] = useState<File | null>(null);
  const [galleryPhotoPreview, setGalleryPhotoPreview] = useState<string | null>(null);
  const [isUploadingGalleryPhoto, setIsUploadingGalleryPhoto] = useState(false);
  const [galleryPhotoError, setGalleryPhotoError] = useState("");

  const handleGalleryPhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const val = validateMediaFile(file, { maxSizeMB: 6 });
    if (!val.valid) {
      setGalleryPhotoError(val.error || "Invalid image");
      triggerToast(val.error || "Invalid image");
      e.target.value = "";
      return;
    }
    setGalleryPhotoError("");
    setGalleryPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setGalleryPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGalleryPhoto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    if (!title) {
      triggerToast("Photo title/caption is required.");
      return;
    }

    if (!editingGalleryItem && !galleryPhotoFile) {
      triggerToast("Please select an image file to upload.");
      return;
    }

    setIsUploadingGalleryPhoto(true);
    setGalleryPhotoError("");

    try {
      let imageUrl = editingGalleryItem?.image || "";
      let publicId = editingGalleryItem?.publicId || "";

      if (galleryPhotoFile) {
        const uploadRes = await uploadMediaFile(galleryPhotoFile, "placements/gallery", { maxSizeMB: 6 });
        imageUrl = uploadRes.url;
        publicId = uploadRes.publicId;
      }

      const itemData: PlacementGalleryItem = {
        id: editingGalleryItem ? editingGalleryItem.id : `place-gal-${Date.now()}`,
        image: imageUrl,
        publicId,
        title,
        category: String(fd.get("category") || "Placement Drives"),
        placementYear: String(fd.get("placementYear") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        displayOrder: Number(fd.get("displayOrder") || 0),
        isVisible: fd.get("isVisible") === "on",
      };

      if (editingGalleryItem) {
        await store.updatePlacementGalleryItem(editingGalleryItem.id, itemData);
        triggerToast(`Gallery photo "${title}" updated.`);
      } else {
        await store.addPlacementGalleryItem(itemData);
        triggerToast(`Placement photo "${title}" uploaded to Cloudinary.`);
      }

      setShowGalleryModal(false);
      setEditingGalleryItem(null);
      setGalleryPhotoFile(null);
      setGalleryPhotoPreview(null);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to save placement gallery photo.";
      setGalleryPhotoError(msg);
      triggerToast(msg);
    } finally {
      setIsUploadingGalleryPhoto(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Placements Admin Header Banner */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0b224d] flex items-center gap-2">
            <Briefcase className="text-amber-600" size={22} />
            <span>Training & Placements Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control placement statistics, highest package feature, recruiters, and placement gallery photos.
          </p>
        </div>
      </div>

      {/* Subtab Navigation Strip */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px bg-slate-50 p-1 rounded-t border">
        {[
          { id: "overview" as SubTab, label: "1. Placement Overview", icon: Layers },
          { id: "statistics" as SubTab, label: "2. Placement Statistics", icon: TrendingUp },
          { id: "highestPackage" as SubTab, label: "3. Highest Package", icon: Award },
          { id: "yearWise" as SubTab, label: "4. Year-wise Placement", icon: Calendar },
          { id: "achievements" as SubTab, label: "5. Students / Achievements", icon: Sparkles },
          { id: "companies" as SubTab, label: "6. Recruiters / Companies", icon: Building2 },
          { id: "gallery" as SubTab, label: "7. Placement Gallery", icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded transition-all whitespace-nowrap ${
                active
                  ? "bg-[#0b224d] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Icon size={14} className={active ? "text-amber-400" : "text-slate-500"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. OVERVIEW SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "overview" && (
        <div className="space-y-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await store.updatePlacements({
                overviewHeading: String(fd.get("overviewHeading") || ""),
                overviewDescription: String(fd.get("overviewDescription") || ""),
                contactPerson: {
                  name: String(fd.get("tpoName") || placements.contactPerson?.name || ""),
                  designation: String(fd.get("tpoDesignation") || placements.contactPerson?.designation || ""),
                  email: String(fd.get("tpoEmail") || placements.contactPerson?.email || ""),
                  phone: String(fd.get("tpoPhone") || placements.contactPerson?.phone || ""),
                },
              });
              triggerToast("Placement overview and TPO desk information saved.");
            }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                <span>Placement Narrative & Headings</span>
                <span className="text-[10px] text-slate-400 font-normal">Public Placements Page Header</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Main Heading
                </label>
                <input
                  name="overviewHeading"
                  defaultValue={placements.overviewHeading || "Campus Placement Highlights & Career Opportunities"}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs font-semibold"
                  placeholder="e.g. Campus Placement Highlights & Career Opportunities"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Summary & Description
                </label>
                <textarea
                  name="overviewDescription"
                  rows={3}
                  defaultValue={
                    placements.overviewDescription ||
                    "The Training & Placement Cell facilitates industry readiness through continuous technical training, coding assessments, and campus recruitment drives."
                  }
                  className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  placeholder="Comprehensive narrative of placement initiatives, campus readiness, and student career grooming..."
                />
              </div>
            </div>

            {/* TPO Official Contact Desk */}
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2">
                Training & Placement Officer (TPO) Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Officer Name</label>
                  <input
                    name="tpoName"
                    defaultValue={placements.contactPerson?.name}
                    placeholder="e.g. Training & Placement Officer"
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation</label>
                  <input
                    name="tpoDesignation"
                    defaultValue={placements.contactPerson?.designation}
                    placeholder="e.g. Head - Training & Placements"
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official T&P Email</label>
                  <input
                    name="tpoEmail"
                    defaultValue={placements.contactPerson?.email}
                    placeholder="e.g. placements@pk-college.edu.in"
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telephone / Desk</label>
                  <input
                    name="tpoPhone"
                    defaultValue={placements.contactPerson?.phone}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm transition"
              >
                Save Overview & TPO Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. PLACEMENT STATISTICS & HIGHLIGHTS */}
      {/* ---------------------------------------------------- */}
      {subTab === "statistics" && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-1">Placement Statistics Calculation</span>
            The placement metrics displayed on the public website automatically aggregate from your recorded year-wise data below, ensuring complete consistency without hardcoding.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Recorded Batches</span>
              <span className="text-xl font-black text-[#0b224d]">
                {(placements.yearlyStats || []).length} Years
              </span>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">Highest Package Feature</span>
              <span className="text-xl font-black text-amber-700">
                {highestPackage.packageAmount
                  ? `${highestPackage.currency || "₹"} ${highestPackage.packageAmount}`
                  : "Not Configured"}
              </span>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Recruiting Partners</span>
              <span className="text-xl font-black text-[#0b224d]">
                {(placements.companies || []).length} Companies
              </span>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Placement Gallery Assets</span>
              <span className="text-xl font-black text-[#0b224d]">
                {(placements.gallery || []).length} Photos
              </span>
            </div>
          </div>

          {/* Quick Year Records Summary */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider">
                Active Year Records Overview
              </h3>
              <button
                type="button"
                onClick={() => setSubTab("yearWise")}
                className="text-xs font-bold text-amber-600 hover:text-amber-800"
              >
                Manage Year Records →
              </button>
            </div>

            {(!placements.yearlyStats || placements.yearlyStats.length === 0) ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No yearly records entered yet. Go to <strong>Year-wise Placements</strong> tab to add real academic batches.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="p-2.5">Year</th>
                      <th className="p-2.5">Eligible</th>
                      <th className="p-2.5">Placed</th>
                      <th className="p-2.5">Percentage</th>
                      <th className="p-2.5">Highest</th>
                      <th className="p-2.5">Average</th>
                      <th className="p-2.5">Companies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {placements.yearlyStats.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-[#0b224d]">Batch {s.year}</td>
                        <td className="p-2.5">{s.studentsEligible || "—"}</td>
                        <td className="p-2.5 font-semibold text-emerald-700">{s.studentsPlaced || "—"}</td>
                        <td className="p-2.5 font-bold">{s.placementPercentage || "—"}</td>
                        <td className="p-2.5 font-bold text-amber-700">
                          {s.highestPackage ? `${s.highestPackageCurrency || "₹"} ${s.highestPackage}` : "—"}
                        </td>
                        <td className="p-2.5">{s.averagePackage ? `${s.highestPackageCurrency || "₹"} ${s.averagePackage}` : "—"}</td>
                        <td className="p-2.5">{s.companiesCount || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. HIGHEST PACKAGE FEATURE SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "highestPackage" && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-950 space-y-1">
            <span className="font-extrabold uppercase text-[11px] block">
              ★ Highest Package Feature Configuration
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This card is prominently showcased on the public Placements page and college homepage.
              Upload the verified student photo directly via Cloudinary. If placement data is still being finalized, keep fields empty to display an appropriate professional notice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Photo Upload */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSaveHighestPackageForm} className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider">
                    Candidate & Offer Information
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isVisible"
                      name="isVisible"
                      defaultChecked={highestPackage.isVisible ?? true}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <label htmlFor="isVisible" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      Show on Website
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Highest Package Amount *
                    </label>
                    <input
                      name="packageAmount"
                      defaultValue={highestPackage.packageAmount}
                      placeholder="e.g. 12 LPA"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-extrabold text-[#0b224d]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Example: 12 LPA or 14.5 Lakhs/Annum</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Currency Symbol</label>
                    <input
                      name="currency"
                      defaultValue={highestPackage.currency || "₹"}
                      placeholder="₹"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Student / Graduate Name
                    </label>
                    <input
                      name="studentName"
                      defaultValue={highestPackage.studentName}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Recruiting Company Name
                    </label>
                    <input
                      name="companyName"
                      defaultValue={highestPackage.companyName}
                      placeholder="e.g. Amazon / Microsoft / Tata Elxsi"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                    <input
                      name="department"
                      defaultValue={highestPackage.department}
                      placeholder="e.g. CSE or ECE"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree / Program</label>
                    <input
                      name="program"
                      defaultValue={highestPackage.program || "B.Tech"}
                      placeholder="B.Tech"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Batch / Placement Year</label>
                    <input
                      name="placementYear"
                      defaultValue={highestPackage.placementYear}
                      placeholder="e.g. 2025"
                      className="w-full p-2.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Graduation Batch Range (Optional)
                  </label>
                  <input
                    name="batchYear"
                    defaultValue={highestPackage.batchYear}
                    placeholder="e.g. Batch 2021 - 2025"
                    className="w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Achievement Remarks / Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={highestPackage.description}
                    placeholder="Short description of role offered, campus drive details, or student commendation..."
                    className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    type="submit"
                    className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm transition"
                  >
                    Save Highest Package Details
                  </button>
                </div>
              </form>

              {/* Photo Upload Section */}
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-[#0b224d] uppercase tracking-wider border-b pb-2">
                  Student Photo Upload (Cloudinary)
                </h3>

                {highestPhotoError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Upload Failed</p>
                      <p className="text-[11px]">{highestPhotoError}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-28 bg-slate-100 border border-slate-300 rounded overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                    {highestPhotoPreview || highestPackage.studentPhoto ? (
                      <img
                        src={highestPhotoPreview || highestPackage.studentPhoto}
                        alt="Highest Package Student"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <GraduationCap size={28} className="mx-auto mb-1 opacity-60" />
                        <span className="text-[10px] font-bold block">No Photo</span>
                      </div>
                    )}
                    {isUploadingHighestPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <RefreshCw size={18} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      ref={highestPhotoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleHighestPhotoSelect}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0b224d] hover:file:bg-blue-100"
                    />
                    <p className="text-[11px] text-slate-400">
                      Standard student portrait. Max size: 5 MB (JPG, PNG, WEBP).
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      {highestPhotoFile && (
                        <button
                          type="button"
                          disabled={isUploadingHighestPhoto}
                          onClick={handleUploadHighestPhoto}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                        >
                          {isUploadingHighestPhoto ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              <span>Save to Cloudinary</span>
                            </>
                          )}
                        </button>
                      )}

                      {highestPackage.studentPhoto && (
                        <button
                          type="button"
                          onClick={handleRemoveHighestPhoto}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Card Preview */}
            <div className="lg:col-span-5 space-y-3 sticky top-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Live Public Card Preview
              </span>

              <div className="bg-gradient-to-br from-[#07172f] via-[#0b224d] to-[#12316c] text-white p-6 rounded-lg border-2 border-amber-500/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-[#07172f] font-black text-[10px] uppercase px-3 py-1 rounded-bl tracking-wider shadow">
                  ★ HIGHEST PACKAGE
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                      Placement Session {highestPackage.placementYear || "2025"}
                    </span>
                    <div className="text-3xl font-black text-amber-400 tracking-tight mt-1">
                      {highestPackage.currency || "₹"} {highestPackage.packageAmount || "— LPA"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                    <div className="w-16 h-20 bg-slate-800/80 rounded border border-amber-400/40 overflow-hidden shrink-0 shadow-md">
                      {highestPhotoPreview || highestPackage.studentPhoto ? (
                        <img
                          src={highestPhotoPreview || highestPackage.studentPhoto}
                          alt="Student Portrait"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <GraduationCap size={24} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base text-white truncate">
                        {highestPackage.studentName || "Student Name"}
                      </h4>
                      <p className="text-xs text-amber-200/90 font-medium truncate">
                        {highestPackage.program || "B.Tech"} · {highestPackage.department || "Engineering"}
                      </p>
                      <p className="text-xs text-slate-300 font-semibold mt-1">
                        Offered by: <strong className="text-white">{highestPackage.companyName || "Company Partner"}</strong>
                      </p>
                      {highestPackage.batchYear && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{highestPackage.batchYear}</p>
                      )}
                    </div>
                  </div>

                  {highestPackage.description && (
                    <p className="text-xs text-slate-300 italic pt-2 border-t border-white/10 leading-relaxed">
                      "{highestPackage.description}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. YEAR-WISE PLACEMENTS SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "yearWise" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0b224d] uppercase tracking-wider">
                  Yearly Placement Records
                </h3>
                <p className="text-xs text-slate-500">
                  Each year's record stores verified stats such as eligible candidates, students placed, percentages, and packages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingYearStat(null);
                  setShowYearModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>+ Add Placement Year</span>
              </button>
            </div>

            {(!placements.yearlyStats || placements.yearlyStats.length === 0) ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded p-4">
                <Briefcase size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No year-wise placement records added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                  Click "+ Add Placement Year" above to enter real verified records for academic sessions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {placements.yearlyStats.map((stat) => (
                  <div
                    key={stat.id}
                    className={`p-4 rounded border transition-all ${
                      stat.isFeatured ? "bg-amber-50/40 border-amber-300" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#0b224d] px-2.5 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">
                          Academic Batch {stat.year}
                        </span>
                        {stat.isFeatured && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingYearStat(stat);
                            setShowYearModal(true);
                          }}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete placement records for year ${stat.year}?`)) {
                              await store.deletePlacementYear(stat.id);
                              triggerToast(`Placement record for ${stat.year} deleted.`);
                            }
                          }}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded text-xs font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-amber-700 uppercase block">Highest Package</span>
                        <span className="text-sm font-extrabold text-[#0b224d]">
                          {stat.highestPackage ? `${stat.highestPackageCurrency || "₹"} ${stat.highestPackage}` : "—"}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Package</span>
                        <span className="text-sm font-extrabold text-[#0b224d]">
                          {stat.averagePackage ? `${stat.highestPackageCurrency || "₹"} ${stat.averagePackage}` : "—"}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Students Placed</span>
                        <span className="text-sm font-extrabold text-[#0b224d]">
                          {stat.studentsPlaced || "—"}
                          {stat.studentsEligible ? ` / ${stat.studentsEligible}` : ""}
                          {stat.placementPercentage ? ` (${stat.placementPercentage})` : ""}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Recruiting Companies</span>
                        <span className="text-sm font-extrabold text-[#0b224d]">
                          {stat.companiesCount ? `${stat.companiesCount}+` : "—"}
                        </span>
                      </div>
                    </div>

                    {stat.description && (
                      <p className="text-[11px] text-slate-600 mt-2.5 pt-2 border-t border-slate-200 leading-relaxed">
                        {stat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. STUDENTS / PLACEMENT ACHIEVEMENTS SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "achievements" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0b224d] uppercase tracking-wider">
                  Students / Placement Achievements
                </h3>
                <p className="text-xs text-slate-500">
                  Manage individual student placement achievements, corporate offer letters, salary packages, and verified profile photography via Cloudinary.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAchievement(null);
                  setAchievementPhotoFile(null);
                  setAchievementPhotoPreview(null);
                  setAchievementError("");
                  setShowAchievementModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>+ Add Achievement</span>
              </button>
            </div>

            {(!placements.achievements || placements.achievements.length === 0) ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded p-4">
                <Sparkles size={36} className="mx-auto text-amber-500/70 mb-2" />
                <p className="text-xs font-bold text-slate-600">No student placement achievements added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Add Achievement" to showcase verified student placement offers, company names, and packages.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {placements.achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white border rounded p-4 shadow-xs flex flex-col justify-between transition-all ${
                      item.isVisible === false ? "opacity-60 bg-slate-50 border-dashed" : "border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-14 h-16 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.studentPhoto ? (
                            <img
                              src={item.studentPhoto}
                              alt={item.studentName}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <GraduationCap size={22} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-[#0b224d] truncate">{item.studentName}</h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#0b224d]">
                              {item.placementYear}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {[item.program, item.department].filter(Boolean).join(" • ")}
                          </p>
                          {item.rollNumber && (
                            <p className="text-[10px] text-slate-400 font-mono">Reg: {item.rollNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Company:</span>
                          <span className="font-bold text-[#0b224d]">{item.companyName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Package:</span>
                          <span className="font-black text-amber-700">{item.currency || "₹"} {item.packageAmount}</span>
                        </div>
                        {item.roleDesignation && (
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Role:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[140px]">{item.roleDesignation}</span>
                          </div>
                        )}
                      </div>

                      {item.achievementDescription && (
                        <p className="text-[11px] text-slate-600 italic line-clamp-2 mt-2 pt-2 border-t border-slate-100">
                          "{item.achievementDescription}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={async () => {
                          if (store.updatePlacementAchievement) {
                            await store.updatePlacementAchievement(item.id, { isVisible: !item.isVisible });
                            triggerToast(`Achievement visibility set to ${!item.isVisible ? "Visible" : "Hidden"}.`);
                          }
                        }}
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          item.isVisible !== false ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {item.isVisible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.isVisible !== false ? "Visible" : "Hidden"}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAchievement(item);
                            setAchievementPhotoFile(null);
                            setAchievementPhotoPreview(item.studentPhoto || null);
                            setAchievementError("");
                            setShowAchievementModal(true);
                          }}
                          className="text-[#0b224d] hover:text-blue-800 text-[11px] font-bold flex items-center gap-0.5"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete achievement record for "${item.studentName}"?`)) {
                              if (store.deletePlacementAchievement) {
                                await store.deletePlacementAchievement(item.id);
                                triggerToast("Achievement record removed.");
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-[11px] font-semibold flex items-center gap-0.5"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. COMPANIES / RECRUITERS SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "companies" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0b224d] uppercase tracking-wider">
                  Corporate Recruiters & Placement Partners
                </h3>
                <p className="text-xs text-slate-500">
                  Manage recruiting enterprises, upload company logos directly via Cloudinary, and link official corporate domains.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCompany(null);
                  setCompanyLogoFile(null);
                  setCompanyLogoPreview(null);
                  setCompanyLogoError("");
                  setShowCompanyModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>+ Add Recruiter</span>
              </button>
            </div>

            {(!placements.companies || placements.companies.length === 0) ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded p-4">
                <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No recruiters added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Add Recruiter" to add company partners and upload logos via Cloudinary.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {placements.companies.map((comp) => (
                  <div key={comp.id} className="bg-slate-50 rounded border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                          {comp.placementYear ? `Year ${comp.placementYear}` : "Recruiter"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => store.updateRecruiterCompany(comp.id, { isVisible: !comp.isVisible })}
                            className="text-slate-400 hover:text-slate-700 p-1"
                            title={comp.isVisible ? "Visible on website" : "Hidden from website"}
                          >
                            {comp.isVisible ? <Eye size={14} className="text-emerald-600" /> : <EyeOff size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCompany(comp);
                              setCompanyLogoFile(null);
                              setCompanyLogoPreview(null);
                              setCompanyLogoError("");
                              setShowCompanyModal(true);
                            }}
                            className="text-slate-500 hover:text-slate-900 p-1"
                            title="Edit recruiter"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete recruiter "${comp.name}"?`)) {
                                await store.deleteRecruiterCompany(comp.id);
                                triggerToast(`Recruiter "${comp.name}" deleted.`);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete recruiter"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        {comp.logo ? (
                          <img
                            src={comp.logo}
                            alt={comp.name}
                            className="w-12 h-12 object-contain rounded bg-white p-1 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                            <Building2 size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-[#0b224d] truncate">{comp.name}</h4>
                          {comp.websiteUrl && (
                            <a
                              href={comp.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 mt-0.5 truncate"
                            >
                              <span>Visit Website</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {comp.description && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {comp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. PLACEMENT GALLERY SUBTAB */}
      {/* ---------------------------------------------------- */}
      {subTab === "gallery" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0b224d] uppercase tracking-wider">
                  Placement Photo Gallery
                </h3>
                <p className="text-xs text-slate-500">
                  Upload verified photographs of campus recruitment drives, interview sessions, and placement ceremonies to Cloudinary.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingGalleryItem(null);
                  setGalleryPhotoFile(null);
                  setGalleryPhotoPreview(null);
                  setGalleryPhotoError("");
                  setShowGalleryModal(true);
                }}
                className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>+ Add Placement Photo</span>
              </button>
            </div>

            {(!placements.gallery || placements.gallery.length === 0) ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded p-4">
                <ImageIcon size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No placement photos uploaded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Add Placement Photo" to upload real campus drive photos via Cloudinary.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {placements.gallery.map((item) => (
                  <div key={item.id} className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="h-40 bg-slate-100 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#0b224d]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {item.category}
                        </span>
                        {item.placementYear && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-[#07172f] text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                            {item.placementYear}
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <h4 className="font-bold text-xs text-[#0b224d] mb-1">{item.title}</h4>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">Order: {item.displayOrder || 0}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => store.updatePlacementGalleryItem(item.id, { isVisible: !item.isVisible })}
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title={item.isVisible ? "Visible on website" : "Hidden"}
                        >
                          {item.isVisible ? <Eye size={13} className="text-emerald-600" /> : <EyeOff size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGalleryItem(item);
                            setGalleryPhotoFile(null);
                            setGalleryPhotoPreview(null);
                            setGalleryPhotoError("");
                            setShowGalleryModal(true);
                          }}
                          className="text-amber-700 hover:text-amber-900 font-bold p-1 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete photo "${item.title}"?`)) {
                              await store.deletePlacementGalleryItem(item.id);
                              triggerToast(`Photo "${item.title}" deleted.`);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT YEAR-WISE PLACEMENT RECORD */}
      {/* ---------------------------------------------------- */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingYearStat ? `Edit Batch ${editingYearStat.year} Records` : "Add New Placement Year Record"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data entered here will be saved to Firestore and rendered in the public placement tables.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowYearModal(false);
                  setEditingYearStat(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveYearRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Placement Year *
                  </label>
                  <input
                    name="year"
                    required
                    placeholder="e.g. 2025"
                    defaultValue={editingYearStat?.year || ""}
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Currency Symbol
                  </label>
                  <input
                    name="highestPackageCurrency"
                    defaultValue={editingYearStat?.highestPackageCurrency || "₹"}
                    placeholder="₹"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-700 uppercase mb-1">
                    Highest Package (Prominent)
                  </label>
                  <input
                    name="highestPackage"
                    placeholder="e.g. 12 LPA"
                    defaultValue={editingYearStat?.highestPackage || ""}
                    className="w-full p-2.5 border border-amber-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Average Package
                  </label>
                  <input
                    name="averagePackage"
                    placeholder="e.g. 4.8 LPA"
                    defaultValue={editingYearStat?.averagePackage || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Eligible Students
                  </label>
                  <input
                    name="studentsEligible"
                    placeholder="e.g. 175"
                    defaultValue={editingYearStat?.studentsEligible || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Students Placed
                  </label>
                  <input
                    name="studentsPlaced"
                    placeholder="e.g. 148"
                    defaultValue={editingYearStat?.studentsPlaced || ""}
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
                    defaultValue={editingYearStat?.placementPercentage || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Recruiting Companies Count
                  </label>
                  <input
                    name="companiesCount"
                    placeholder="e.g. 38"
                    defaultValue={editingYearStat?.companiesCount || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Median Package (Optional)
                  </label>
                  <input
                    name="medianPackage"
                    placeholder="e.g. 4.2 LPA"
                    defaultValue={editingYearStat?.medianPackage || ""}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Placement Description / Summary
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Summary of campus placement drives, sectors, and top recruiters for this batch..."
                  defaultValue={editingYearStat?.description || ""}
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editingYearStat?.isFeatured ?? true}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="isFeatured" className="font-bold text-slate-700 select-none cursor-pointer">
                  Featured Year on Homepage & Placement Overview
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearModal(false);
                    setEditingYearStat(null);
                  }}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow"
                >
                  {editingYearStat ? "Save Changes" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT STUDENT PLACEMENT ACHIEVEMENT */}
      {/* ---------------------------------------------------- */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingAchievement ? `Edit Achievement: ${editingAchievement.studentName}` : "Add Student Achievement"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload student portrait to Cloudinary and record offer details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAchievementModal(false);
                  setEditingAchievement(null);
                  setAchievementPhotoFile(null);
                  setAchievementPhotoPreview(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {achievementError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error Notice</p>
                  <p className="text-[11px]">{achievementError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveAchievement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Student Photo (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 bg-slate-100 border border-slate-300 rounded overflow-hidden flex items-center justify-center shrink-0">
                    {achievementPhotoPreview || editingAchievement?.studentPhoto ? (
                      <img
                        src={achievementPhotoPreview || editingAchievement?.studentPhoto}
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap size={22} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAchievementPhotoSelect}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0b224d]"
                    />
                    <p className="text-[10px] text-slate-400">JPG, PNG, WEBP. Max 5 MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Student Name *</label>
                  <input
                    name="studentName"
                    required
                    defaultValue={editingAchievement?.studentName || ""}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 border border-slate-300 rounded font-semibold text-[#0b224d]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Roll / Reg No (Optional)</label>
                  <input
                    name="rollNumber"
                    defaultValue={editingAchievement?.rollNumber || ""}
                    placeholder="e.g. 21PK1A0501"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    name="department"
                    defaultValue={editingAchievement?.department || "CSE"}
                    placeholder="e.g. CSE / ECE"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Program</label>
                  <input
                    name="program"
                    defaultValue={editingAchievement?.program || "B.Tech"}
                    placeholder="B.Tech"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Company Name *</label>
                  <input
                    name="companyName"
                    required
                    defaultValue={editingAchievement?.companyName || ""}
                    placeholder="e.g. Tata Consultancy Services"
                    className="w-full p-2.5 border border-slate-300 rounded font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-700 uppercase mb-1">Package Offered *</label>
                  <input
                    name="packageAmount"
                    required
                    defaultValue={editingAchievement?.packageAmount || ""}
                    placeholder="e.g. 9.5 LPA"
                    className="w-full p-2.5 border border-amber-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Role / Designation</label>
                  <input
                    name="roleDesignation"
                    defaultValue={editingAchievement?.roleDesignation || ""}
                    placeholder="e.g. Graduate Trainee / SDE"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Placement Year *</label>
                  <input
                    name="placementYear"
                    required
                    defaultValue={editingAchievement?.placementYear || new Date().getFullYear().toString()}
                    placeholder="e.g. 2025"
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-[#0b224d]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Remarks / Quote (Optional)</label>
                <textarea
                  name="achievementDescription"
                  rows={2}
                  defaultValue={editingAchievement?.achievementDescription || ""}
                  placeholder="Student comment, interview experience, or faculty commendation..."
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="achieveIsVisible"
                    name="isVisible"
                    defaultChecked={editingAchievement?.isVisible ?? true}
                    className="w-4 h-4 text-[#0b224d] rounded"
                  />
                  <label htmlFor="achieveIsVisible" className="font-bold text-slate-700 select-none cursor-pointer">
                    Show on Placements Portal
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Order:</span>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingAchievement?.displayOrder || 0}
                    className="w-16 p-1 border border-slate-300 rounded text-center text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAchievementModal(false);
                    setEditingAchievement(null);
                    setAchievementPhotoFile(null);
                    setAchievementPhotoPreview(null);
                  }}
                  className="px-4 py-2 border rounded font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingAchievementPhoto}
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isUploadingAchievementPhoto ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Saving to Cloudinary...</span>
                    </>
                  ) : (
                    <span>{editingAchievement ? "Update Achievement" : "Save Achievement"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT RECRUITER COMPANY */}
      {/* ---------------------------------------------------- */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingCompany ? `Edit Recruiter: ${editingCompany.name}` : "Add Corporate Recruiter"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload company logo to Cloudinary and specify corporate recruitment details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCompanyModal(false);
                  setEditingCompany(null);
                  setCompanyLogoFile(null);
                  setCompanyLogoPreview(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {companyLogoError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Logo Upload Notice</p>
                  <p className="text-[11px]">{companyLogoError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Company / Recruiter Name *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingCompany?.name || ""}
                  placeholder="e.g. Infosys, TCS, Cognizant, Wipro, L&T"
                  className="w-full p-2.5 border border-slate-300 rounded font-bold text-[#0b224d]"
                />
              </div>

              {/* Logo Selection */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Company Logo (Upload via Cloudinary)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleCompanyLogoSelect}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0b224d]"
                />
                <p className="text-[10px] text-slate-400 mt-1">PNG, SVG, WEBP, or JPG. Max 3 MB.</p>
              </div>

              {(companyLogoPreview || editingCompany?.logo) && (
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-3">
                  <img
                    src={companyLogoPreview || editingCompany?.logo}
                    alt="Logo Preview"
                    className="w-14 h-14 object-contain rounded bg-white p-1 border"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Logo Status</span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {companyLogoPreview ? "New Logo Ready for Cloudinary Upload" : "Existing Cloudinary Logo"}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Placement Year (Optional)</label>
                  <input
                    name="placementYear"
                    defaultValue={editingCompany?.placementYear || ""}
                    placeholder="e.g. 2025"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingCompany?.displayOrder || 0}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Website URL (Optional)</label>
                <input
                  name="websiteUrl"
                  type="url"
                  defaultValue={editingCompany?.websiteUrl || ""}
                  placeholder="https://www.example.com"
                  className="w-full p-2.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Brief Description (Optional)</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingCompany?.description || ""}
                  placeholder="e.g. Core manufacturing engineering partner / Global IT consulting..."
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded">
                <input
                  type="checkbox"
                  id="compIsVisible"
                  name="isVisible"
                  defaultChecked={editingCompany?.isVisible ?? true}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="compIsVisible" className="font-bold text-slate-700 select-none cursor-pointer">
                  Display on Public Website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompanyModal(false);
                    setEditingCompany(null);
                    setCompanyLogoFile(null);
                    setCompanyLogoPreview(null);
                  }}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCompanyLogo}
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isUploadingCompanyLogo && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingCompany ? "Save Changes" : "Add Recruiter"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PLACEMENT GALLERY PHOTO */}
      {/* ---------------------------------------------------- */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b224d]">
                  {editingGalleryItem ? `Edit Photo: ${editingGalleryItem.title}` : "Upload Placement Photo"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload verified high-resolution photograph to Cloudinary.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGalleryModal(false);
                  setEditingGalleryItem(null);
                  setGalleryPhotoFile(null);
                  setGalleryPhotoPreview(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {galleryPhotoError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Photo Upload Notice</p>
                  <p className="text-[11px]">{galleryPhotoError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveGalleryPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {editingGalleryItem ? "Replace Photo (Optional)" : "Select Image File *"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required={!editingGalleryItem}
                  onChange={handleGalleryPhotoSelect}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0b224d]"
                />
                <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP. Max 6 MB.</p>
              </div>

              {(galleryPhotoPreview || editingGalleryItem?.image) && (
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Photo Preview</span>
                  <img
                    src={galleryPhotoPreview || editingGalleryItem?.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded border border-slate-200 shadow-xs"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Photo Caption / Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingGalleryItem?.title || ""}
                  placeholder="e.g. Annual Campus Recruitment Drive 2025"
                  className="w-full p-2.5 border border-slate-300 rounded font-semibold text-[#0b224d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingGalleryItem?.category || "Placement Drives"}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="Placement Drives">Placement Drives</option>
                    <option value="Recruitment Events">Recruitment Events</option>
                    <option value="Student Interviews">Student Interviews</option>
                    <option value="Training">Training & Workshops</option>
                    <option value="Career Guidance">Career Guidance</option>
                    <option value="Placement Cell">Placement Cell Activities</option>
                    <option value="Offer Letters / Achievements">Offer Letters & Achievements</option>
                    <option value="Industry Interaction">Industry Interaction</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Placement Year (Optional)</label>
                  <input
                    name="placementYear"
                    defaultValue={editingGalleryItem?.placementYear || ""}
                    placeholder="e.g. 2025"
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingGalleryItem?.description || ""}
                  placeholder="Additional context on the recruitment activity or batch participation..."
                  className="w-full p-2.5 border border-slate-300 rounded leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingGalleryItem?.displayOrder || 0}
                    className="w-full p-2.5 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-bold text-slate-700 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      name="isVisible"
                      defaultChecked={editingGalleryItem?.isVisible ?? true}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Visible in Public Gallery</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowGalleryModal(false);
                    setEditingGalleryItem(null);
                    setGalleryPhotoFile(null);
                    setGalleryPhotoPreview(null);
                  }}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingGalleryPhoto}
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2 rounded font-bold uppercase tracking-wider shadow disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isUploadingGalleryPhoto && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingGalleryItem ? "Save Changes" : "Upload to Cloudinary"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
