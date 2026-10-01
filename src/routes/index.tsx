import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GraduationCap,
  HardHat,
  Lightbulb,
  MapPin,
  School,
  TrendingUp,
  Wrench,
  Zap,
  ZoomIn,
  X,
  Award,
  Briefcase,
  Layers,
  Phone,
  Mail,
  Sparkles,
  Building,
  ShieldCheck,
} from "lucide-react";
import { site as staticSite, imagery } from "@/data/site";
import { SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";
import { SafeSectionBoundary } from "@/components/site/SafeSectionBoundary";
import type { GalleryItem } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${staticSite.name} | Premier Engineering College` },
      {
        name: "description",
        content: `Official portal of ${staticSite.name}. Approved by AICTE, offering 4-Year B.Tech undergraduate engineering programs in CSE, AI&DS, AIML, ECE, EEE, Mechanical, and Civil Engineering with modern laboratories and structured placement ecosystems.`,
      },
      { property: "og:title", content: staticSite.name },
      {
        property: "og:description",
        content: `Excellence in Technical Education, Applied Research & Placements at ${staticSite.name}.`,
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const store = useCollegeStore();
  const { announcements, events, siteSettings, departments, homepage, facilities, leadership, galleryItems, placements } = store;
  const site = siteSettings;

  const [activeGalleryPreview, setActiveGalleryPreview] = useState<GalleryItem | null>(null);

  // Placements CMS Data derived strictly from Store / Firestore
  const hp = placements?.highestPackage;
  const hasHighestPackage = Boolean(
    hp &&
    hp.isVisible !== false &&
    (hp.packageAmount?.trim() || hp.studentName?.trim() || hp.companyName?.trim())
  );
  const placementStats = placements?.yearlyStats || [];
  const latestPlacement = placementStats.find((s) => s.isFeatured) || placementStats[0] || null;
  const chronologicalHistory = [...placementStats].sort((a, b) => a.year.localeCompare(b.year));
  const hasAnyPlacementData = hasHighestPackage || placementStats.length > 0;

  // Approved total intake calculated strictly from active departments
  const totalApprovedSeats = departments.reduce((acc, d) => acc + (Number(d.intake) || 0), 0);

  const getDeptIcon = (slug: string) => {
    switch (slug) {
      case "cse":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "ai-ds":
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case "aiml":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "ece":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "eee":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "mech":
        return <Wrench className="w-5 h-5 text-amber-500" />;
      case "civil":
        return <HardHat className="w-5 h-5 text-amber-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-500" />;
    }
  };

  const getAccreditationDisplay = (text: string = "NAAC A+") => {
    const trimmed = text.trim();
    const gradeMatch = trimmed.match(/(A\+{1,2}|B\+{1,2}|A|B)(?=\s|$)/i);
    if (gradeMatch && gradeMatch.index !== undefined && gradeMatch[1]) {
      const grade = gradeMatch[1].toUpperCase();
      let prefix = trimmed.slice(0, gradeMatch.index).trim();
      prefix = prefix.replace(/\bgrade\b/i, "").trim();
      return {
        prefix: prefix || "NAAC",
        grade: grade,
      };
    }
    const spaceIdx = trimmed.indexOf(" ");
    if (spaceIdx > 0) {
      return {
        prefix: trimmed.slice(0, spaceIdx),
        grade: trimmed.slice(spaceIdx + 1),
      };
    }
    return {
      prefix: "NAAC",
      grade: trimmed || "A+",
    };
  };

  const accreditationParts = getAccreditationDisplay(homepage.accreditation || "NAAC A+");

  const heroFallback = (
    <section className="college-hero relative overflow-hidden bg-[#07172f]">
      <img
        src={imagery.campusMain}
        alt={`${site.name} Campus Academic Block`}
        className="hero-bg-image"
        width={1536}
        height={1024}
      />
      <div className="hero-overlay-gradient" />
      <div className="absolute inset-0 hero-grid-lines pointer-events-none" />
      <div className="college-container relative z-10 w-full py-12 sm:py-16 md:py-24">
        <div className="hero-content-wrap max-w-3xl">
          <div data-reveal="fade-in" className="hero-tag inline-flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-semibold tracking-wide">
              {`B.Tech Admissions Open · Approved by AICTE · Counseling Code: ${site.code}`}
            </span>
          </div>
          <h1 data-reveal="fade-up" data-reveal-delay="1" className="hero-main-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            {site.name}
          </h1>
          <p data-reveal="fade-up" data-reveal-delay="2" className="hero-subtitle text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl">
            {site.tagline}
          </p>
          <div data-reveal="fade-up" data-reveal-delay="3" className="hero-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              to="/admissions"
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all btn-institutional"
            >
              <span>Explore Admissions</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/departments"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
              <span>Undergraduate Programs</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/* 1. College Hero Section (Institutional Facade with High Legibility Dark Overlay) */}
      <SafeSectionBoundary sectionName="Hero" fallback={heroFallback}>
        <section className="college-hero relative overflow-hidden bg-[#07172f]">
          <img
            src={homepage.heroImage || imagery.campusMain}
            alt={`${site.name} Campus Academic Block`}
            className="hero-bg-image"
            width={1536}
            height={1024}
          />
          <div className="hero-overlay-gradient" />

          {/* Subtle Architectural Grid Lines Overlay with Ambient Drift */}
          <div className="absolute inset-0 hero-grid-lines pointer-events-none" />

          <div className="college-container relative z-10 w-full py-12 sm:py-16 md:py-24">
            <div className="hero-content-wrap max-w-3xl">
              {/* Accreditation & Announcement Badge */}
              <div data-reveal="fade-in" className="hero-tag inline-flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span className="font-semibold tracking-wide">
                  {homepage.topBannerText || `B.Tech Admissions Open · Approved by AICTE · Counseling Code: ${site.code}`}
                </span>
              </div>

              <h1 data-reveal="fade-up" data-reveal-delay="1" className="hero-main-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
                {homepage.heroHeading || site.name}
              </h1>

              <p data-reveal="fade-up" data-reveal-delay="2" className="hero-subtitle text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl">
                {homepage.heroSubtitle || site.tagline}
              </p>

              <div data-reveal="fade-up" data-reveal-delay="3" className="hero-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to={homepage.heroPrimaryBtnLink || "/admissions"}
                  className="bg-[#d97706] hover:bg-[#b45309] text-white px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all btn-institutional"
                >
                  <span>{homepage.heroPrimaryBtnText || "Explore Admissions"}</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to={homepage.heroSecondaryBtnLink || "/departments"}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                >
                  <span>{homepage.heroSecondaryBtnText || "Undergraduate Programs"}</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* Institutional Accreditation & Autonomy Highlight Section */}
      <SafeSectionBoundary sectionName="Accreditation Highlight">
        {homepage.showAccreditation !== false && (
          <section
            id="accreditation-highlight"
            aria-label="Accreditation and Institutional Status"
            className={`relative z-20 border-b transition-colors duration-300 ${
              homepage.homepageHighlight !== false
                ? "bg-[#07172f] text-white border-amber-500/25 shadow-md"
                : "bg-white text-slate-900 border-slate-200 shadow-xs"
            }`}
          >
          {/* Subtle architectural gold accent border */}
          {homepage.homepageHighlight !== false && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
          )}

          <div className="college-container py-6 sm:py-8 md:py-9">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
              
              {/* Left: Institutional Status & NAAC A+ Badge (Adhering to strict visual hierarchy) */}
              <div
                data-reveal="fade-up"
                className={`w-full lg:w-auto shrink-0 flex flex-col items-center justify-center p-5 sm:p-6 md:p-7 rounded border text-center transition-all ${
                  homepage.homepageHighlight !== false
                    ? "bg-[#0b224d]/95 border-amber-500/35 shadow-md"
                    : "bg-slate-50 border-slate-300 shadow-xs"
                }`}
              >
                {/* 1. AUTONOMOUS (Top of Visual Hierarchy) */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded text-xs font-black uppercase tracking-[0.22em] border shadow-xs ${
                    homepage.homepageHighlight !== false
                      ? "bg-amber-400/15 border-amber-400/35 text-amber-300"
                      : "bg-[#0b224d] border-[#0b224d] text-white"
                  }`}
                >
                  <Award className={`w-3.5 h-3.5 ${homepage.homepageHighlight !== false ? "text-amber-400" : "text-amber-300"}`} />
                  <span>{homepage.institutionStatus || "Autonomous"}</span>
                </div>

                {/* Elegant Downward Hierarchy Connector Arrow */}
                <div
                  aria-hidden="true"
                  className={`my-1 text-xs font-mono font-bold select-none ${
                    homepage.homepageHighlight !== false ? "text-amber-400/60" : "text-[#0b224d]/50"
                  }`}
                >
                  ↓
                </div>

                {/* 2. NAAC (Above A+) */}
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-xs sm:text-sm font-extrabold uppercase tracking-[0.28em] ${
                      homepage.homepageHighlight !== false ? "text-slate-200" : "text-[#0b224d]"
                    }`}
                  >
                    {accreditationParts.prefix}
                  </span>

                  {/* 3. A+ (Main Visual Highlight with subtle gold shine) */}
                  <span
                    className={`font-black tracking-tight leading-none my-1 font-serif grade-highlight-accent ${
                      accreditationParts.grade.length > 2
                        ? "text-3xl sm:text-4xl text-amber-400"
                        : "text-5xl sm:text-6xl text-amber-400"
                    }`}
                  >
                    {accreditationParts.grade}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 ${
                      homepage.homepageHighlight !== false ? "text-amber-300/80" : "text-amber-700"
                    }`}
                  >
                    Institutional Grade
                  </span>
                </div>
              </div>

              {/* Right: Academic Standing & Official Recognition */}
              <div className="flex-1 flex flex-col justify-center text-center lg:text-left w-full">
                <div data-reveal="fade-up" className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      homepage.homepageHighlight !== false ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                      homepage.homepageHighlight !== false ? "text-amber-300" : "text-amber-700"
                    }`}
                  >
                    National Quality Accreditation & Regulatory Standing
                  </span>
                </div>

                <h2
                  data-reveal="fade-up"
                  data-reveal-delay="1"
                  className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mb-2.5 font-serif ${
                    homepage.homepageHighlight !== false ? "text-white" : "text-[#0b224d]"
                  }`}
                >
                  {homepage.institutionStatus || "Autonomous"} Institution with{" "}
                  <span className="text-amber-400">{homepage.accreditation || "NAAC A+"}</span> Accreditation
                </h2>

                <p
                  data-reveal="fade-up"
                  data-reveal-delay="2"
                  className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mb-4 ${
                    homepage.homepageHighlight !== false ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {homepage.accreditationDescription ||
                    "Conferred Academic Autonomy by UGC and Accredited with Prestigious Grade A+ by NAAC, recognizing highest benchmarks in engineering curricula, research laboratories, and institutional quality."}
                </p>

                {/* Official Accreditation Badges */}
                <div data-reveal="fade-up" data-reveal-delay="3" className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div
                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                      homepage.homepageHighlight !== false
                        ? "bg-white/10 border-white/15 text-slate-200"
                        : "bg-slate-100 border-slate-300 text-slate-800"
                    }`}
                  >
                    UGC Conferred Autonomy
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                      homepage.homepageHighlight !== false
                        ? "bg-amber-400/10 border-amber-400/30 text-amber-300"
                        : "bg-amber-50 border-amber-300 text-amber-900"
                    }`}
                  >
                    NAAC Grade A+ Accredited
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                      homepage.homepageHighlight !== false
                        ? "bg-white/10 border-white/15 text-slate-200"
                        : "bg-slate-100 border-slate-300 text-slate-800"
                    }`}
                  >
                    Approved by AICTE, New Delhi
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                      homepage.homepageHighlight !== false
                        ? "bg-white/10 border-white/15 text-slate-200"
                        : "bg-slate-100 border-slate-300 text-slate-800"
                    }`}
                  >
                    Industry-Aligned B.Tech Programs
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}
      </SafeSectionBoundary>

      {/* 2. PLACEMENT HIGHLIGHTS (Directly below Autonomous / NAAC A+ section; CMS controlled) */}
      <SafeSectionBoundary sectionName="Placement Highlights">
        <section className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200" aria-label="Placement Highlights">
          <div className="college-container">
          {/* Section Header */}
          <div data-reveal="fade-up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">
                <Briefcase size={14} className="text-amber-600" />
                <span>Career Outcomes & Placements</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0b224d] font-serif">
                {placements?.overviewHeading || "Campus Placement Highlights & Career Opportunities"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {placements?.overviewDescription || "Explore placement outcomes, career opportunities, recruiting partners, and year-on-year placement progression at PK College of Engineering & Technology."}
              </p>
            </div>
            <Link
              to="/placements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#991b1b] hover:text-[#7f1d1d] hover:underline flex-shrink-0"
            >
              <span>Explore Placement Cell & Roadmap</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {hasAnyPlacementData ? (
            <div className="space-y-8">
              {/* HIGHEST PACKAGE DEDICATED CMS SHOWCASE (Appears automatically when admin adds highest package) */}
              {hasHighestPackage && hp && (
                <div
                  data-reveal="fade-up"
                  className="bg-white rounded-xl border border-amber-300 shadow-md overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    {/* Student Photo Column */}
                    <div className="md:col-span-4 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 text-center relative">
                      <div className="absolute top-3 left-3 bg-[#0b224d] text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-400" />
                        <span>Highest Package</span>
                      </div>

                      {hp.studentPhoto ? (
                        <div className="w-36 h-44 sm:w-44 sm:h-52 rounded-lg overflow-hidden border-4 border-white shadow-md bg-slate-300 mt-4 mb-2">
                          <img
                            src={hp.studentPhoto}
                            alt={hp.studentName ? `${hp.studentName} - Highest Package Offer` : "Highest Package Student"}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-36 h-44 sm:w-44 sm:h-52 rounded-lg border-2 border-dashed border-slate-300 bg-white/80 flex flex-col items-center justify-center p-3 mt-4 mb-2 text-slate-400">
                          <GraduationCap size={44} className="mb-1 text-slate-500" />
                          <span className="text-[11px] font-bold text-slate-600">Student Profile</span>
                        </div>
                      )}

                      <span className="text-[11px] font-semibold text-slate-500">
                        {hp.placementYear ? `Placement Season ${hp.placementYear}` : "Campus Recruitment"}
                      </span>
                    </div>

                    {/* Student & Offer Information */}
                    <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Package Badge */}
                        <div className="inline-flex items-baseline gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 mb-3">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Top Offer:</span>
                          <span className="text-2xl sm:text-3xl font-black text-[#0b224d]">
                            {hp.currency || "₹"} {hp.packageAmount || "Highest Package"}
                          </span>
                        </div>

                        {/* Student Name */}
                        <h3 className="text-xl sm:text-2xl font-black text-[#0b224d] tracking-tight">
                          {hp.studentName || "Verified Engineering Graduate"}
                        </h3>

                        {/* Degree / Program / Department */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                          {[hp.program, hp.department].filter(Boolean).join(" • ") || "Engineering Graduate"}
                          {hp.batchYear ? ` | Batch of ${hp.batchYear}` : ""}
                        </p>

                        {/* Recruiter Card */}
                        {hp.companyName && (
                          <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-md mt-3">
                            <Building size={18} className="text-[#0b224d] flex-shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Recruiting Enterprise</span>
                              <span className="text-sm font-bold text-[#0b224d]">{hp.companyName}</span>
                            </div>
                            {hp.placementYear && (
                              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0b224d]">
                                Year {hp.placementYear}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Achievement Description */}
                        {(hp.achievementDescription || hp.description) && (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-amber-400 pl-3 py-1 mt-3">
                            "{hp.achievementDescription || hp.description}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Verified Campus Placement Record</span>
                        </span>
                        <Link
                          to="/placements"
                          className="font-bold text-[#b45309] hover:underline flex items-center gap-1"
                        >
                          <span>Full Placements Report</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placement Key Stat Cards (Rendered if yearly statistics are present) */}
              {placementStats.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {/* HIGHEST PACKAGE (Highlighted with premium visual emphasis!) */}
                    <div
                      data-reveal="fade-up"
                      data-reveal-delay="1"
                      className="placement-highest-card rounded p-5 sm:p-6 text-white flex flex-col justify-between college-card-interactive"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="placement-highest-badge px-2.5 py-0.5 rounded text-[10px] shadow-xs">
                            ★ Highest Package
                          </span>
                          <span className="text-[11px] font-bold text-amber-300">
                            {latestPlacement?.year || "Current Session"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                          Top Career Offer
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight mt-1 mb-2">
                          {latestPlacement?.highestPackage
                            ? `${latestPlacement.highestPackageCurrency || "₹"} ${latestPlacement.highestPackage}`
                            : hp?.packageAmount
                              ? `${hp.currency || "₹"} ${hp.packageAmount}`
                              : "To be updated"}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-300/90 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span>Verified Campus Drive</span>
                        <span className="text-amber-400 font-bold">Session {latestPlacement?.year || hp?.placementYear || "2025"}</span>
                      </div>
                    </div>

                    {/* AVERAGE PACKAGE */}
                    <div
                      data-reveal="fade-up"
                      data-reveal-delay="2"
                      className="bg-white rounded p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between college-card-interactive"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Average Package
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#0b224d] font-mono tracking-tight mt-1 mb-2">
                          {latestPlacement?.averagePackage
                            ? `${latestPlacement.highestPackageCurrency || "₹"} ${latestPlacement.averagePackage}`
                            : "To be updated"}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span>Engineering Streams</span>
                        <span className="font-semibold text-slate-700">Batch {latestPlacement?.year || "2025"}</span>
                      </div>
                    </div>

                    {/* STUDENTS PLACED */}
                    <div
                      data-reveal="fade-up"
                      data-reveal-delay="3"
                      className="bg-white rounded p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between college-card-interactive"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Students Placed
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#0b224d] font-mono tracking-tight mt-1 mb-2">
                          {latestPlacement?.studentsPlaced ?? "To be updated"}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span>{latestPlacement?.placementPercentage ? `${latestPlacement.placementPercentage} Placement Rate` : "Placement Rate"}</span>
                        <span className="font-semibold text-slate-700">{latestPlacement?.studentsEligible ? `${latestPlacement.studentsEligible} Eligible` : ""}</span>
                      </div>
                    </div>

                    {/* RECRUITING COMPANIES */}
                    <div
                      data-reveal="fade-up"
                      data-reveal-delay="4"
                      className="bg-white rounded p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between college-card-interactive"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Recruiting Companies
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#0b224d] font-mono tracking-tight mt-1 mb-2">
                          {latestPlacement?.companiesCount ? `${latestPlacement.companiesCount}+` : "To be updated"}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span>Corporate Partners</span>
                        <span className="font-semibold text-slate-700">On & Off Campus</span>
                      </div>
                    </div>
                  </div>

                  {/* Chronological Year-on-Year Placement Progression History */}
                  {chronologicalHistory.length > 0 && (
                    <div data-reveal="fade-up" className="bg-white border border-slate-200 rounded p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-[#b45309]" />
                          <h3 className="font-bold text-xs sm:text-sm text-[#0b224d] uppercase tracking-wider">
                            Year-on-Year Placement Progression ({chronologicalHistory.map((s) => s.year).join(" → ")})
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Chronological Records Managed in Admin CMS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {chronologicalHistory.map((stat, idx) => (
                          <div
                            key={stat.id || stat.year}
                            className={`p-4 rounded border transition-all ${
                              stat.isFeatured
                                ? "bg-amber-50/50 border-amber-300 shadow-xs"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-[#0b224d] text-white">
                                Batch {stat.year}
                              </span>
                              {idx < chronologicalHistory.length - 1 && (
                                <span className="text-[11px] font-bold text-amber-600 hidden md:inline">
                                  Progression →
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Highest</span>
                                <span className="font-extrabold text-[#0b224d]">
                                  {stat.highestPackage ? `${stat.highestPackageCurrency || "₹"} ${stat.highestPackage}` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Average</span>
                                <span className="font-bold text-slate-700">
                                  {stat.averagePackage ? `${stat.highestPackageCurrency || "₹"} ${stat.averagePackage}` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Placed</span>
                                <span className="font-bold text-slate-700">
                                  {stat.studentsPlaced ? `${stat.studentsPlaced} (${stat.placementPercentage || "—"})` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Recruiters</span>
                                <span className="font-bold text-slate-700">
                                  {stat.companiesCount ? `${stat.companiesCount} Cos.` : "—"}
                                </span>
                              </div>
                            </div>

                            {stat.description && (
                              <p className="text-[11px] text-slate-600 line-clamp-2 pt-2 border-t border-slate-200/80 leading-snug">
                                {stat.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Clean Empty State: No Hardcoded Data Fabricated */
            <div data-reveal="fade-up" className="bg-white rounded p-8 sm:p-10 border border-slate-200 text-center max-w-2xl mx-auto shadow-xs">
              <Briefcase size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="font-bold text-base text-[#0b224d] mb-1">Placement Records Updating</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                The Training & Placement Cell is currently compiling and verifying recruitment statistics for the recent graduating sessions. Inquire at the placement desk for corporate recruitment guidelines and active placement schedules.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/placements" className="px-4 py-2 bg-[#0b224d] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#102a5c]">
                  View Placement Roadmap
                </Link>
                <Link to="/contact" className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-50">
                  Contact TPO Desk
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      </SafeSectionBoundary>

      {/* 3. Key Institutional Matrix Strip (ONLY Real/Admin CMS Data) */}
      <section className="stats-strip bg-[#0b224d] text-white border-y border-white/10 py-5">
        <div className="college-container">
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            <div data-reveal="fade-up" data-reveal-delay="1" className="stat-box p-3 border-r border-white/10">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                {site.foundedYear}
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">Established</div>
              <div className="stat-sub text-[10px] text-slate-400">Technical Foundation</div>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="2" className="stat-box p-3 border-r border-white/10">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                {departments.length}
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">B.Tech Branches</div>
              <div className="stat-sub text-[10px] text-slate-400">Undergraduate Programs</div>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="3" className="stat-box p-3 border-r border-white/10">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                {totalApprovedSeats}
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">Approved Seats</div>
              <div className="stat-sub text-[10px] text-slate-400">Annual Intake Matrix</div>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="4" className="stat-box p-3 border-r border-white/10">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400">
                AICTE
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">Approved</div>
              <div className="stat-sub text-[10px] text-slate-400">Technical Council</div>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="5" className="stat-box p-3 border-r border-white/10">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                {site.code}
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">Counseling Code</div>
              <div className="stat-sub text-[10px] text-slate-400">State Admissions Desk</div>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="6" className="stat-box p-3">
              <div className="stat-number text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                4-Year
              </div>
              <div className="stat-label text-xs font-bold text-slate-200 uppercase mt-0.5">B.Tech Degree</div>
              <div className="stat-sub text-[10px] text-slate-400">Semester Pattern</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Core Pillars Quick Cards */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="college-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div data-reveal="fade-up" data-reveal-delay="1" className="p-5 sm:p-6 bg-slate-50 border-t-4 border-[#0b224d] rounded-b shadow-sm hover:shadow-md transition flex flex-col college-card-interactive">
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-3">
                <GraduationCap size={22} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-1.5">B.Tech Admissions</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed flex-1">
                Annual seat intake under Convener quota and institutional quota. Complete eligibility guidelines and verification desk.
              </p>
              <Link to="/admissions" className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 mt-auto">
                <span>View Admission Process</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="2" className="p-5 sm:p-6 bg-slate-50 border-t-4 border-[#d97706] rounded-b shadow-sm hover:shadow-md transition flex flex-col college-card-interactive">
              <div className="w-10 h-10 rounded bg-[#d97706] text-white flex items-center justify-center mb-3">
                <Cpu size={22} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-1.5">Engineering Departments</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed flex-1">
                {departments.length} specialized branches including Computing, AI & Data Science, AIML, Electronics, Electrical, Mechanical, and Civil.
              </p>
              <Link to="/departments" className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 mt-auto">
                <span>Explore Departments</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="3" className="p-5 sm:p-6 bg-slate-50 border-t-4 border-[#991b1b] rounded-b shadow-sm hover:shadow-md transition flex flex-col college-card-interactive">
              <div className="w-10 h-10 rounded bg-[#991b1b] text-white flex items-center justify-center mb-3">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-1.5">Training & Placements</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed flex-1">
                Structured 4-year employability roadmap, aptitude sessions, programming bootcamps, and campus placement drives.
              </p>
              <Link to="/placements" className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 mt-auto">
                <span>Placement Cell Overview</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div data-reveal="fade-up" data-reveal-delay="4" className="p-5 sm:p-6 bg-slate-50 border-t-4 border-emerald-700 rounded-b shadow-sm hover:shadow-md transition flex flex-col college-card-interactive">
              <div className="w-10 h-10 rounded bg-emerald-700 text-white flex items-center justify-center mb-3">
                <Building2 size={22} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-1.5">Campus Infrastructure</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed flex-1">
                Central digital library, high-speed computing centers, specialized core labs, sports complex, and fleet transport.
              </p>
              <Link to="/facilities" className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 mt-auto">
                <span>Campus & Amenities</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial: About the Institution */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        {/* Subtle geometric watermark with ambient pattern drift */}
        <div className="absolute inset-0 bg-[radial-gradient(#0b224d08_1px,transparent_1px)] [background-size:20px_20px] ambient-pattern-shift pointer-events-none" />

        <div className="college-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative" data-reveal="image-reveal">
                <img
                  src={imagery.campusCourtyard}
                  alt={`${site.name} Courtyard and Academic Complex`}
                  className="rounded-lg shadow-md w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] object-cover border-4 border-white"
                  width={1200}
                  height={900}
                />
                <div data-reveal="fade-up" data-reveal-delay="3" className="absolute -bottom-4 -right-4 bg-[#0b224d] text-white p-4 rounded-lg shadow-lg border-2 border-amber-500 hidden sm:block max-w-[240px]">
                  <p className="text-[11px] font-extrabold uppercase text-amber-400">Institutional Excellence</p>
                  <p className="text-xs text-slate-200 mt-1 leading-snug">
                    Dedicated to technical discipline & practical engineering competence.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span data-reveal="fade-up" className="text-xs font-bold text-[#b45309] uppercase tracking-wider mb-2 inline-block">
                About the Institution
              </span>
              <h2 data-reveal="fade-up" data-reveal-delay="1" className="text-2xl sm:text-3xl font-extrabold text-[#0b224d] leading-tight mb-4">
                {homepage.aboutPreviewTitle || "Building Tomorrow's Engineers with Academic Rigor & Practical Discipline"}
              </h2>
              <p data-reveal="fade-up" data-reveal-delay="2" className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                {homepage.aboutPreviewText || (
                  <>
                    <strong>{site.name}</strong> was established with an institutional mandate to provide high-standard, disciplined technical education accessible to aspiring engineers. The college merges rigorous foundational engineering theory with intensive laboratory work.
                  </>
                )}
              </p>
              <p data-reveal="fade-up" data-reveal-delay="2" className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Our campus features modern computing complexes, specialized electronics and mechanical laboratories, an extensive central digital library, and an active Training & Placement cell that bridges academic syllabus requirements with industrial expectations.
              </p>

              <div data-reveal="fade-up" data-reveal-delay="3" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-semibold">Outcome-Based Technical Curricula</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-semibold">Dedicated Doctorate & Post-Graduate Faculty</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-semibold">Departmental Specialized Laboratories</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-semibold">Structured Employability & Soft-Skill Training</span>
                </div>
              </div>

              <div data-reveal="fade-up" data-reveal-delay="4" className="flex items-center gap-3.5 flex-wrap">
                <Link
                  to="/about"
                  className="bg-[#0b224d] hover:bg-[#102a5c] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
                >
                  <span>Know More About College</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/vision-mission"
                  className="text-xs font-bold text-[#0b224d] hover:text-[#b45309] flex items-center gap-1"
                >
                  <span>Vision & Mission</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Principal's Message Spotlight */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="college-container">
          <div className="p-6 sm:p-8 md:p-10 bg-slate-50 border border-slate-200 border-l-4 border-l-[#d97706] rounded-lg shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-4 text-center lg:text-left" data-reveal="slide-right">
                <div className="inline-block p-1 bg-white border border-slate-300 rounded shadow-xs mb-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded bg-[#0b224d] text-white flex flex-col items-center justify-center p-3 text-center">
                    <School size={36} className="text-amber-400 mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Principal's Desk</span>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0b224d] leading-snug">
                  {leadership.principal.name}
                </h3>
                <p className="text-xs font-bold text-[#b45309] uppercase tracking-wide mt-0.5">
                  Principal
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto lg:mx-0">
                  {leadership.principal.qualifications}
                </p>
              </div>

              <div className="lg:col-span-8" data-reveal="slide-left" data-reveal-delay="1">
                <span className="text-xs font-bold uppercase text-[#b45309] tracking-wider mb-1 block">
                  Institutional Leadership Message
                </span>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0b224d] mb-3">
                  "Excellence in Engineering Education with Human Values and Discipline"
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 italic">
                  "{leadership.principal.message.slice(0, 340)}..."
                </p>
                <Link
                  to="/principal-message"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b224d] hover:text-[#b45309] uppercase tracking-wider"
                >
                  <span>Read Full Principal's Message</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Academic Programs / Departments Showcase (Dynamically Loaded from Firestore/Store) */}
      <SafeSectionBoundary sectionName="Academic Departments">
        <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="college-container">
            <SectionHeader
              eyebrow="Academic Disciplines"
              title="Undergraduate Engineering Departments"
              subtitle="Approved 4-Year B.Tech degree programs structured to combine theoretical foundations with intensive laboratory training."
            />

            <div className="departments-grid-wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, idx) => (
                <div
                  key={dept.code}
                  data-reveal="fade-up"
                  data-reveal-delay={String((idx % 3) + 1)}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition flex flex-col college-card-interactive"
                >
                  <div className="relative aspect-[16/10] overflow-hidden img-zoom-hover">
                    <img
                      src={dept.image}
                      alt={dept.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#0b224d] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                      Branch {dept.code}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                      {dept.intake} Seats
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getDeptIcon(dept.slug)}
                      <span className="text-[11px] font-bold uppercase text-slate-600">
                        Approved Intake: <strong className="text-emerald-800">{dept.intake} Seats</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#0b224d] mb-1.5 line-clamp-1">
                      {dept.shortTitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
                      {dept.overview}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mb-4">
                      <span>HOD: <strong className="text-slate-700">{dept.hod.name}</strong></span>
                      <span>4-Year B.Tech</span>
                    </div>

                    <Link
                      to="/departments"
                      search={{ dept: dept.slug }}
                      className="w-full text-center bg-slate-100 hover:bg-[#0b224d] text-[#0b224d] hover:text-white py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors mt-auto flex items-center justify-center gap-1.5"
                    >
                      <span>Department Profile & Labs</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* 7. Why Choose PK College (Institutional Strengths Grid) */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Institutional Strengths"
            title="Why Choose PK College of Engineering & Technology"
            subtitle="Dedicated to student-centric technical education, modern engineering laboratories, and structured employability training."
            dataReveal="fade-up"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="1"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <Cpu size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Modern Laboratory Ecosystems</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated departmental laboratories equipped with contemporary hardware, high-performance computing systems, and licensed engineering software tools.
              </p>
            </div>

            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="2"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <Layers size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Outcome-Based Education</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured curriculum aligning with technical education statutory standards, focusing on continuous evaluation, problem-solving, and practical coursework.
              </p>
            </div>

            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="3"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">4-Year Placement Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commencing in the first year with analytical aptitude, technical communication, coding assessments, and mock interviews facilitated by the T&P Cell.
              </p>
            </div>

            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="1"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Central Digital Library</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extensive catalog of technical reference volumes, international journal subscriptions, digital e-learning portals, and silent research reading zones.
              </p>
            </div>

            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="2"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Technical Societies & Chapters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active student professional chapters, coding hackathons, technical symposiums, robotics clubs, and annual institutional project exhibitions.
              </p>
            </div>

            <div
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition flex flex-col college-card-interactive"
              data-reveal="fade-up"
              data-reveal-delay="3"
            >
              <div className="w-10 h-10 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0b224d] mb-2">Disciplined Campus Environment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Safe, ragging-free campus with disciplined student mentorship, active grievance committees, CCTV-monitored facilities, and dedicated bus transportation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Campus & Facilities Showcase */}
      <SafeSectionBoundary sectionName="Campus Facilities">
        <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="college-container">
            <SectionHeader
              eyebrow="Campus Life & Infrastructure"
              title="World-Class Facilities for Technical Mastery"
              subtitle="A comprehensive learning, residential, and recreational environment with modern infrastructure."
              dataReveal="fade-up"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {facilities.slice(0, 4).map((fac, idx) => (
                <div
                  key={fac.id}
                  data-reveal="fade-up"
                  data-reveal-delay={String(idx + 1)}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition flex flex-col college-card-interactive"
                >
                  <div className="img-zoom-hover aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={fac.image} alt={fac.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-[#0b224d] text-base mb-1">{fac.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{fac.description}</p>
                    <Link
                      to="/facilities"
                      className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 mt-auto"
                    >
                      <span>Explore Facility</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8" data-reveal="fade-up" data-reveal-delay="3">
              <Link
                to="/facilities"
                className="inline-flex items-center gap-2 bg-[#0b224d] hover:bg-[#102a5c] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider btn-institutional shadow-xs"
              >
                <span>View All Campus Facilities & Amenities</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* 9. Dual Section: Notices & Circulars + Upcoming Campus Events */}
      <SafeSectionBoundary sectionName="Notices and Events">
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200 w-full overflow-hidden">
          <div className="college-container w-full max-w-full">
            <div className="notice-events-grid grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 w-full max-w-full min-w-0">
              {/* Announcements Panel */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-5 md:p-6 shadow-xs w-full max-w-full min-w-0 box-border">
                <div data-reveal="fade-up" className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#991b1b] animate-ping shrink-0" />
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0b224d] truncate">Notices &amp; Circulars</h3>
                  </div>
                  <Link
                    to="/announcements"
                    className="text-xs font-bold text-[#0b224d] hover:text-[#b45309] flex items-center gap-1 shrink-0 whitespace-nowrap"
                  >
                    <span>All Notices</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-3 w-full min-w-0">
                  {announcements.slice(0, 4).map((ann, idx) => {
                    const parts = ann.date.split("-");
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const day = parts[2] || "01";
                    const month = monthNames[parseInt(parts[1] || "1", 10) - 1] || "Sep";

                    return (
                      <div
                        key={ann.id}
                        data-reveal="fade-up"
                        data-reveal-delay={String(idx + 1)}
                        className="p-3 bg-white border border-slate-200 rounded flex items-start gap-2.5 sm:gap-3 hover:border-slate-300 transition w-full max-w-full min-w-0 box-border"
                        style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                      >
                        <div className="text-center bg-[#0b224d] text-white px-2 py-1.5 rounded flex flex-col justify-center shrink-0 w-11 sm:w-12 box-border">
                          <span className="text-xs font-bold leading-none">{day}</span>
                          <span className="text-[10px] uppercase text-amber-300 font-semibold mt-0.5 leading-none">{month}</span>
                        </div>

                        <div className="flex-1 min-w-0 w-full" style={{ overflowWrap: "anywhere", wordBreak: "normal" }}>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1 min-w-0">
                            <span className="text-[10px] font-bold text-[#b45309] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block break-normal">
                              {ann.category}
                            </span>
                            {ann.isUrgent && (
                              <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded inline-block break-normal">
                                Important
                              </span>
                            )}
                          </div>
                          <Link
                            to="/announcements"
                            className="text-xs font-bold text-[#0b224d] hover:underline block leading-snug"
                            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                          >
                            {ann.title}
                          </Link>
                          {ann.summary && (
                            <p
                              className="text-[11px] text-slate-500 mt-1 leading-relaxed"
                              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                            >
                              {ann.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Events Panel */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-5 md:p-6 shadow-xs w-full max-w-full min-w-0 box-border">
                <div data-reveal="fade-up" className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar size={18} className="text-[#0b224d] shrink-0" />
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0b224d] truncate">Upcoming Events</h3>
                  </div>
                  <Link
                    to="/events"
                    className="text-xs font-bold text-[#0b224d] hover:text-[#b45309] flex items-center gap-1 shrink-0 whitespace-nowrap"
                  >
                    <span>All Events</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-3 w-full min-w-0">
                  {events.slice(0, 3).map((evt, idx) => (
                    <div
                      key={evt.id}
                      data-reveal="fade-up"
                      data-reveal-delay={String(idx + 1)}
                      className="p-3 bg-white border border-slate-200 rounded flex flex-row items-start gap-2.5 sm:gap-3 hover:border-slate-300 transition w-full max-w-full min-w-0 box-border"
                      style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                    >
                      {/* Responsive Event Image Container */}
                      <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-18 sm:h-18 md:w-16 md:h-16 shrink-0 rounded overflow-hidden border border-slate-200 bg-slate-100 relative aspect-square box-border">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0 w-full" style={{ overflowWrap: "anywhere", wordBreak: "normal" }}>
                        <span
                          className="text-[10px] font-bold text-[#b45309] block mb-1 leading-snug"
                          style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                        >
                          {evt.category} · {evt.date}
                        </span>
                        <h4
                          className="text-xs font-bold text-[#0b224d] mb-1 leading-snug"
                          style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                        >
                          {evt.title}
                        </h4>
                        <p
                          className="text-[11px] text-slate-500 flex items-start gap-1 leading-snug mt-0.5"
                          style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                        >
                          <MapPin size={11} className="shrink-0 mt-0.5 text-slate-400" />
                          <span className="min-w-0" style={{ overflowWrap: "anywhere", wordBreak: "normal" }}>
                            {evt.venue}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* 10. Photo Gallery Showcase with Click-to-Preview Modal */}
      <SafeSectionBoundary sectionName="Photo Gallery">
        <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="college-container">
            <div className="flex items-center justify-between mb-8" data-reveal="fade-up">
              <div>
                <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider block mb-1">
                  Campus Impressions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b224d]">Life at PK College</h2>
              </div>
              <Link
                to="/gallery"
                className="text-xs font-bold text-[#0b224d] hover:text-[#b45309] flex items-center gap-1"
              >
                <span>View Full Gallery</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryItems.slice(0, 4).map((item, idx) => (
                <div
                  key={item.id}
                  data-reveal="image-reveal"
                  data-reveal-delay={String(idx + 1)}
                  onClick={() => setActiveGalleryPreview(item)}
                  className="relative group overflow-hidden rounded-lg border border-slate-200 aspect-[4/3] img-zoom-hover cursor-pointer shadow-xs college-card-interactive"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5">
                    <span className="text-white text-xs font-bold truncate">{item.title}</span>
                    <div className="flex items-center justify-between text-amber-300 text-[10px] font-semibold mt-0.5">
                      <span>{item.category}</span>
                      <span className="flex items-center gap-1 text-white">
                        <ZoomIn size={12} />
                        <span>Enlarge</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* 11. Admissions Action Callout Banner */}
      <SafeSectionBoundary sectionName="Admissions Callout">
        <section className="bg-[#0b224d] text-white py-12 sm:py-16 border-t-4 border-[#d97706] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] hero-grid-lines pointer-events-none" />

          <div className="college-container relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div data-reveal="fade-up">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 block">
                  Admissions & Enrollment Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Ready to Begin Your Engineering Career at PKCET?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Get branch counseling guidance, scholarship information, and laboratory tours directly from our admissions team.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3 text-xs text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-400" />
                    <span>{site.phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-400" />
                    <span>{site.email}</span>
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                    Counseling Code: {site.code}
                  </span>
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center shrink-0"
                data-reveal="fade-up"
                data-reveal-delay="2"
              >
                <Link
                  to="/admissions"
                  className="w-full sm:w-auto text-center bg-[#d97706] hover:bg-[#b45309] text-white px-7 py-3 rounded-md font-bold text-xs uppercase tracking-wider shadow-md transition-colors btn-institutional"
                >
                  Apply / Enquire Online
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto text-center bg-transparent hover:bg-white/10 text-white border border-white/40 px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Contact Campus Desk
                </Link>
              </div>
            </div>
          </div>
        </section>
      </SafeSectionBoundary>

      {/* Lightbox Modal for Gallery Preview */}
      {activeGalleryPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveGalleryPreview(null)}
        >
          <div
            className="bg-[#07172f] rounded-lg overflow-hidden max-w-3xl w-full border border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-[#0b224d] text-white flex items-center justify-between border-b border-slate-700">
              <div>
                <h4 className="text-sm font-bold truncate">{activeGalleryPreview.title}</h4>
                <span className="text-[10px] text-amber-400 font-semibold">{activeGalleryPreview.category}</span>
              </div>
              <button
                onClick={() => setActiveGalleryPreview(null)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activeGalleryPreview.image}
                alt={activeGalleryPreview.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
