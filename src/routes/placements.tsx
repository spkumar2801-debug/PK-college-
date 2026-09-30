import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Filter,
  Maximize2,
  X,
  Target,
  FileCheck,
} from "lucide-react";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";
import type { PlacementGalleryItem, RecruiterCompany } from "@/data/site";

export const Route = createFileRoute("/placements")({
  head: () => ({
    meta: [
      { title: "Training & Placements | PK College of Engineering & Technology" },
      {
        name: "description",
        content:
          "Explore campus recruitment records, year-wise placement statistics, highest package achievements, recruiter network, and 4-year career readiness roadmap at PKCET.",
      },
      { property: "og:title", content: "Placements | PK College of Engineering & Technology" },
    ],
  }),
  component: PlacementsPage,
});

function PlacementsPage() {
  const store = useCollegeStore();
  const site = store.siteSettings;
  const placements = store.placements;

  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("All");
  const [activeLightboxImage, setActiveLightboxImage] = useState<PlacementGalleryItem | null>(null);

  // Highest Package Feature from CMS
  const hp = placements.highestPackage;

  // Yearly Stats from CMS (sorted descending)
  const yearlyStats = useMemo(() => {
    return [...(placements.yearlyStats || [])].sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      return yearB - yearA;
    });
  }, [placements.yearlyStats]);

  // Featured or Latest Year for Top Metric KPI bar
  const latestStat = useMemo(() => {
    return yearlyStats.find((s) => s.isFeatured) || yearlyStats[0] || null;
  }, [yearlyStats]);

  // Recruiters from CMS (filtered visible)
  const cmsRecruiters: RecruiterCompany[] = useMemo(() => {
    if (placements.companies && placements.companies.length > 0) {
      return placements.companies
        .filter((c) => c.isVisible !== false)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    }
    // Fallback if legacy strings exist
    return (placements.recruiters || []).map((r: any, idx: number) => {
      if (typeof r === "string") {
        return {
          id: `legacy-${idx}`,
          name: r,
          isVisible: true,
          displayOrder: idx,
        };
      }
      return r;
    });
  }, [placements.companies, placements.recruiters]);

  // Placement Gallery (filtered visible and category)
  const galleryItems = useMemo(() => {
    const all = (placements.gallery || []).filter((g) => g.isVisible !== false);
    if (selectedGalleryCategory === "All") return all;
    return all.filter((g) => g.category === selectedGalleryCategory);
  }, [placements.gallery, selectedGalleryCategory]);

  const galleryCategories = useMemo(() => {
    const set = new Set<string>();
    (placements.gallery || []).forEach((g) => {
      if (g.category && g.isVisible !== false) set.add(g.category);
    });
    return ["All", ...Array.from(set)];
  }, [placements.gallery]);

  // Student Placement Achievements (filtered visible)
  const visibleAchievements = useMemo(() => {
    return (placements.achievements || []).filter((a) => a.isVisible !== false);
  }, [placements.achievements]);

  return (
    <>
      <InstitutionalPageBanner
        title="Training & Placements"
        subtitle={
          placements.overviewDescription ||
          "Empowering engineering undergraduates with industry-oriented technical proficiencies, aptitude training, and corporate placement opportunities."
        }
        breadcrumbs={[{ label: "Placements" }]}
      />

      {/* QUICK KPI STATS STRIP (Drawn strictly from CMS) */}
      {latestStat && (
        <section className="bg-[#0b224d] text-white py-6 border-b border-amber-500/30">
          <div className="college-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
              <div className="px-3 py-2 text-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Highest Package {latestStat.year ? `(${latestStat.year})` : ""}
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {latestStat.highestPackage
                    ? `${latestStat.highestPackageCurrency || "₹"} ${latestStat.highestPackage}`
                    : "Verified at drive"}
                </span>
              </div>
              <div className="px-3 py-2 text-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Average Package
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {latestStat.averagePackage
                    ? `${latestStat.highestPackageCurrency || "₹"} ${latestStat.averagePackage}`
                    : "—"}
                </span>
              </div>
              <div className="px-3 py-2 text-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Placement Rate
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {latestStat.placementPercentage ||
                    (latestStat.studentsPlaced ? `${latestStat.studentsPlaced} Placed` : "Active Drives")}
                </span>
              </div>
              <div className="px-3 py-2 text-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Recruiting Partners
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {latestStat.companiesCount ? `${latestStat.companiesCount}+` : `${cmsRecruiters.length}+`}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 1: PLACEMENT OVERVIEW & PILLARS */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block mb-2">
                  Training & Corporate Relations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b224d] leading-tight">
                  {placements.overviewHeading || "Bridging Academic Instruction with Industrial Competence"}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {placements.overviewDescription || (
                  <>
                    The Training & Placement Cell (T&P) at <strong>{site.name}</strong> operates as a vibrant nexus
                    between undergraduate engineering talent and leading technology and core manufacturing enterprises.
                  </>
                )}
              </p>

              {placements.highlights && placements.highlights.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {placements.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-[#0b224d]"
                    >
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-[#0b224d]">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Comprehensive Placement Training & Drives</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-[#0b224d]">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Corporate Mock Interview Panels</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-[#0b224d]">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Industry Internship Mentorship</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-[#0b224d]">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Dedicated Career Counseling Cell</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#highest-package"
                  className="inline-flex items-center gap-2 bg-[#0b224d] hover:bg-[#102a5c] text-white text-xs font-bold px-5 py-2.5 rounded uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Award size={14} className="text-amber-300" />
                  <span>View Highest Package</span>
                </a>
                <a
                  href="#yearly-performance"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded uppercase tracking-wider transition-colors"
                >
                  <TrendingUp size={14} />
                  <span>Year-wise Records</span>
                </a>
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded uppercase tracking-wider transition-colors"
                >
                  <ImageIcon size={14} />
                  <span>Placement Gallery</span>
                </a>
              </div>
            </div>

            {/* TPO Desk Card */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded-lg shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b45309] block">
                      Official Desk
                    </span>
                    <h3 className="text-lg font-bold text-[#0b224d]">Training & Placement Cell</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100/70 text-[#0b224d] flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Head of Corporate Relations</span>
                    <span className="font-bold text-sm text-slate-800">
                      {placements.contactPerson?.name || "T&P Officer"}
                    </span>
                    {placements.contactPerson?.designation && (
                      <p className="text-xs text-slate-500">{placements.contactPerson.designation}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-700">
                    {placements.contactPerson?.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail size={15} className="text-amber-600 flex-shrink-0" />
                        <a
                          href={`mailto:${placements.contactPerson.email}`}
                          className="hover:text-[#0b224d] hover:underline break-all"
                        >
                          {placements.contactPerson.email}
                        </a>
                      </div>
                    )}
                    {placements.contactPerson?.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={15} className="text-amber-600 flex-shrink-0" />
                        <a href={`tel:${placements.contactPerson.phone}`} className="hover:text-[#0b224d]">
                          {placements.contactPerson.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link
                    to="/contact"
                    className="w-full block text-center bg-[#0b224d] hover:bg-[#102a5c] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Send Recruitment Enquiry
                  </Link>
                  <p className="text-[11px] text-slate-400 text-center">
                    Companies interested in conducting on-campus recruitment are invited to contact the cell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROMINENT HIGHEST PACKAGE SHOWCASE */}
      <section id="highest-package" className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Hall of Achievement"
            title="Highest Campus Placement Package"
            subtitle="Celebrating individual student excellence and corporate recognition through our industry-aligned engineering programs."
          />

          {hp && hp.isVisible !== false && (hp.packageAmount || hp.studentName) ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200/90 shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                {/* Student Photo Column */}
                <div className="md:col-span-5 bg-gradient-to-b from-slate-100 to-slate-200 relative min-h-[300px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-200">
                  {hp.studentPhoto ? (
                    <div className="w-full max-w-[280px] aspect-[4/5] rounded-lg overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                      <img
                        src={hp.studentPhoto}
                        alt={hp.studentName ? `${hp.studentName} - Highest Package` : "Highest Package Student"}
                        className="w-full h-full object-cover object-top transition duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[240px] aspect-[4/5] rounded-lg border-2 border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center p-4 text-center">
                      <GraduationCap size={48} className="text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-600">Student Profile Photo</span>
                      <span className="text-[10px] text-slate-400 mt-1">Uploaded via Admin Portal</span>
                    </div>
                  )}

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-[#0b224d] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>Highest Placement</span>
                  </div>
                </div>

                {/* Information Column */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Package Banner */}
                    <div className="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-lg bg-amber-50 border border-amber-300 mb-4">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Highest Package:</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#0b224d]">
                        {hp.currency || "₹"} {hp.packageAmount || "—"}
                      </span>
                    </div>

                    {/* Student Identity */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#0b224d] tracking-tight mb-1">
                      {hp.studentName || "Verified Graduate"}
                    </h3>

                    {/* Department & Program */}
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4">
                      {[hp.program, hp.department].filter(Boolean).join(" • ") || "Engineering Graduate"}
                      {hp.batchYear ? ` | Batch of ${hp.batchYear}` : ""}
                    </p>

                    {/* Corporate Recruiter */}
                    {hp.companyName && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md mb-4">
                        <Building size={18} className="text-[#0b224d] flex-shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Recruiting Enterprise</span>
                          <span className="text-sm font-bold text-[#0b224d]">{hp.companyName}</span>
                        </div>
                        {hp.placementYear && (
                          <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0b224d]">
                            Season {hp.placementYear}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Achievement Description */}
                    {(hp.achievementDescription || hp.description) && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-amber-400 pl-3 py-1">
                        "{hp.achievementDescription || hp.description}"
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Verified T&P Record</span>
                    </span>
                    <span className="font-semibold text-[#0b224d]">PKCET Placement Cell</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-8 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
              <Award size={40} className="mx-auto text-amber-500/80 mb-3" />
              <h3 className="text-base font-bold text-[#0b224d] mb-1">
                Highest Package Records in Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Official student placement records and verified highest salary package benchmarks will be published by
                the Training & Placement Cell as corporate offer confirmations conclude.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: YEAR-WISE PLACEMENT PERFORMANCE */}
      <section id="yearly-performance" className="py-12 sm:py-16 bg-white">
        <div className="college-container">
          <SectionHeader
            eyebrow="Year-on-Year Progression"
            title="Year-wise Placement Performance"
            subtitle="Transparent and auditable campus recruitment statistics compiled across academic years."
          />

          {yearlyStats.length > 0 ? (
            <div className="space-y-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-lg shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b224d] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5 font-bold">Academic Year</th>
                      <th className="p-3.5 font-bold">Highest Package</th>
                      <th className="p-3.5 font-bold">Average Package</th>
                      <th className="p-3.5 font-bold">Median Package</th>
                      <th className="p-3.5 font-bold text-center">Students Placed</th>
                      <th className="p-3.5 font-bold text-center">Eligible</th>
                      <th className="p-3.5 font-bold text-center">Placement %</th>
                      <th className="p-3.5 font-bold text-center">Companies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {yearlyStats.map((stat) => (
                      <tr
                        key={stat.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          stat.isFeatured ? "bg-amber-50/30" : "bg-white"
                        }`}
                      >
                        <td className="p-3.5 font-black text-[#0b224d]">
                          <span className="flex items-center gap-1.5">
                            {stat.year}
                            {stat.isFeatured && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">
                                Featured
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="p-3.5 font-extrabold text-amber-700">
                          {stat.highestPackage
                            ? `${stat.highestPackageCurrency || "₹"} ${stat.highestPackage}`
                            : "—"}
                        </td>
                        <td className="p-3.5 font-bold text-slate-700">
                          {stat.averagePackage
                            ? `${stat.highestPackageCurrency || "₹"} ${stat.averagePackage}`
                            : "—"}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {stat.medianPackage
                            ? `${stat.highestPackageCurrency || "₹"} ${stat.medianPackage}`
                            : "—"}
                        </td>
                        <td className="p-3.5 text-center font-bold text-[#0b224d]">
                          {stat.studentsPlaced || "—"}
                        </td>
                        <td className="p-3.5 text-center text-slate-600">
                          {stat.studentsEligible || "—"}
                        </td>
                        <td className="p-3.5 text-center">
                          {stat.placementPercentage ? (
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                              {stat.placementPercentage}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3.5 text-center font-bold text-slate-700">
                          {stat.companiesCount ? `${stat.companiesCount}+` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                {yearlyStats.map((stat) => (
                  <div
                    key={stat.id}
                    className={`p-5 rounded-lg border shadow-xs ${
                      stat.isFeatured ? "bg-amber-50/40 border-amber-300" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                      <span className="text-sm font-black text-[#0b224d]">Placement Year {stat.year}</span>
                      {stat.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs mb-3">
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-amber-700 uppercase block">Highest Pkg</span>
                        <span className="font-extrabold text-[#0b224d]">
                          {stat.highestPackage
                            ? `${stat.highestPackageCurrency || "₹"} ${stat.highestPackage}`
                            : "—"}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Pkg</span>
                        <span className="font-extrabold text-[#0b224d]">
                          {stat.averagePackage
                            ? `${stat.highestPackageCurrency || "₹"} ${stat.averagePackage}`
                            : "—"}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Placed</span>
                        <span className="font-extrabold text-[#0b224d]">
                          {stat.studentsPlaced || "—"}
                          {stat.studentsEligible ? ` / ${stat.studentsEligible}` : ""}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Percentage</span>
                        <span className="font-extrabold text-emerald-700">
                          {stat.placementPercentage || "—"}
                        </span>
                      </div>
                    </div>

                    {stat.description && (
                      <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 leading-relaxed">
                        {stat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg text-center max-w-xl mx-auto">
              <TrendingUp size={36} className="mx-auto text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-[#0b224d] mb-1">
                Year-wise Placement Records in Compilation
              </h3>
              <p className="text-xs text-slate-500">
                Official placement registers for eligible batches are maintained and published by the Training &
                Placement Cell upon drive completion.
              </p>
            </div>
          )}
        </div>
      </section>
 
      {/* SECTION 3B: STUDENT PLACEMENT ACHIEVEMENTS / SELECT RECRUITS */}
      {visibleAchievements.length > 0 && (
        <section id="student-achievements" className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
          <div className="college-container">
            <SectionHeader
              eyebrow="Placement Success"
              title="Student Placement Achievements"
              subtitle="Recognizing our distinguished engineering graduates selected by renowned corporate partners."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {visibleAchievements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-100 mb-3 shadow-xs">
                      {item.studentPhoto ? (
                        <img
                          src={item.studentPhoto}
                          alt={item.studentName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <GraduationCap size={32} />
                        </div>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-[#0b224d] mb-0.5">{item.studentName}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">
                      {[item.program, item.department].filter(Boolean).join(" • ") || "Engineering Graduate"}
                      {item.batchYear ? ` (${item.batchYear})` : ""}
                    </p>

                    <div className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 my-2">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0b224d]">
                        <Building size={14} className="text-[#b45309]" />
                        <span>{item.companyName}</span>
                      </div>
                      {item.packageAmount && (
                        <div className="text-xs font-black text-amber-700 mt-1">
                          {item.currency || "₹"} {item.packageAmount}
                        </div>
                      )}
                    </div>

                    {item.achievementDescription && (
                      <p className="text-[11px] text-slate-600 italic line-clamp-3 leading-relaxed mt-1">
                        "{item.achievementDescription}"
                      </p>
                    )}
                  </div>

                  {item.placementYear && (
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex justify-between items-center">
                      <span>Placement Season</span>
                      <span className="text-[#0b224d] font-extrabold">{item.placementYear}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: CORPORATE RECRUITERS & RECRUITING COMPANIES */}
      <section id="recruiters" className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Corporate Alliances"
            title="Recruiting Partners & Industry Associates"
            subtitle="Technology companies, manufacturing corporations, and service organizations participating in campus recruitment."
          />

          {cmsRecruiters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {cmsRecruiters.map((recruiter) => (
                <div
                  key={recruiter.id}
                  className="group p-4 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center hover:border-[#0b224d] hover:shadow-md transition-all min-h-[90px] relative"
                >
                  {(recruiter.logoUrl || recruiter.logo) ? (
                    <div className="w-full h-12 flex items-center justify-center mb-2 px-2">
                      <img
                        src={recruiter.logoUrl || recruiter.logo}
                        alt={recruiter.name}
                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <Building size={24} className="text-slate-400 group-hover:text-[#0b224d] transition-colors mb-1.5" />
                  )}

                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{recruiter.name}</span>

                  {recruiter.placementYear && (
                    <span className="text-[10px] text-slate-400 mt-0.5">{recruiter.placementYear}</span>
                  )}

                  {recruiter.websiteUrl && (
                    <a
                      href={recruiter.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-1.5 right-1.5 text-slate-300 hover:text-[#0b224d] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title={`Visit ${recruiter.name}`}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center max-w-2xl mx-auto shadow-xs">
              <Building size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-[#0b224d] mb-1">Corporate Recruitment Roster</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-4">
                Recruitment partners and visiting campus drive schedules are announced as the placement season proceeds.
              </p>
              <p className="text-xs text-slate-400">
                For recruitment collaborations, contact:{" "}
                <span className="font-semibold text-slate-700">{placements.contactPerson?.email || "tpo@pkcet.edu.in"}</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: 4-YEAR CAREER READINESS ROADMAP */}
      <section id="roadmap" className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Pedagogical Staging"
            title="4-Year Career Readiness Training Roadmap"
            subtitle="Methodical skill enhancement integrated alongside the regular semester engineering curriculum."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {placements.trainingRoadmap.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-slate-200 border-t-4 border-t-[#b45309] rounded-lg shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase text-[#b45309] block mb-1">Stage 0{idx + 1}</span>
                  <h3 className="text-base font-bold text-[#0b224d] mb-1">{stage.year}</h3>
                  <p className="text-xs text-slate-500 font-semibold mb-3">{stage.focus}</p>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {stage.modules.map((mod, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: STEP-BY-STEP CAMPUS PLACEMENT PROCESS */}
      <section id="process" className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="college-container max-w-4xl">
          <SectionHeader
            eyebrow="Recruitment Framework"
            title="Step-by-Step Campus Placement Process"
            subtitle="Transparent and merit-based recruitment framework followed at PKCET."
          />

          <div className="space-y-3">
            {placements.placementProcedure.map((proc, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-lg flex items-start gap-4 shadow-xs"
              >
                <span className="w-8 h-8 rounded-full bg-[#0b224d] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1 font-medium">{proc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: PLACEMENT GALLERY (CMS-CONTROLLED CLOUDINARY PHOTOS) */}
      <section id="gallery" className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Visual Record"
            title="Placement Gallery & Campus Drives"
            subtitle="Glimpses of recruitment sessions, corporate interactive seminars, technical assessments, and celebratory offer distribution."
          />

          {/* Category Filter Pills */}
          {galleryCategories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedGalleryCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    selectedGalleryCategory === cat
                      ? "bg-[#0b224d] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxImage(item)}
                  className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || item.image || ""}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 size={24} />
                    </div>
                    {item.category && (
                      <span className="absolute top-2 left-2 bg-[#0b224d]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                        {item.category}
                      </span>
                    )}
                    {(item.year || item.placementYear) && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.year || item.placementYear}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-xs text-[#0b224d] group-hover:text-amber-700 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg text-center max-w-xl mx-auto">
              <ImageIcon size={36} className="mx-auto text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-[#0b224d] mb-1">Placement Gallery Photographs</h3>
              <p className="text-xs text-slate-500">
                Photographs from current and upcoming recruitment drives, industrial workshops, and student felicitations
                will be published by the cell administrator.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL FOR GALLERY IMAGES */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50">
              <div>
                <h4 className="font-bold text-sm text-[#0b224d]">{activeLightboxImage.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  {activeLightboxImage.category && <span>Category: {activeLightboxImage.category}</span>}
                  {(activeLightboxImage.year || activeLightboxImage.placementYear) && (
                    <span>• Year: {activeLightboxImage.year || activeLightboxImage.placementYear}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeLightboxImage.imageUrl || activeLightboxImage.image || ""}
                alt={activeLightboxImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {activeLightboxImage.description && (
              <div className="p-4 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                {activeLightboxImage.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 8: ENQUIRY / CORPORATE ENGAGEMENT CTA */}
      <section className="py-12 bg-gradient-to-r from-[#0b224d] to-[#102a5c] text-white">
        <div className="college-container text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Corporate Collaboration</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Schedule a Campus Recruitment Drive or Technical Interaction
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our Training & Placement Cell provides comprehensive on-campus and virtual recruitment infrastructure,
            including modern testing computer labs, interview suites, and faculty coordinators.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="bg-[#b45309] hover:bg-[#92400e] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
            >
              Contact Placement Cell
            </Link>
            <a
              href={`mailto:${placements.contactPerson?.email || "tpo@pkcet.edu.in"}`}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Email TPO Direct
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
