import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Cpu,
  FlaskConical,
  GraduationCap,
  HardHat,
  Lightbulb,
  Mail,
  School,
  User,
  Wrench,
  Zap,
  ArrowRight,
} from "lucide-react";
import { site as defaultSite, departments as initialDepartments, type Department } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/departments")({
  validateSearch: (search: Record<string, unknown>): { dept?: string | undefined } => ({
    dept: typeof search["dept"] === "string" ? (search["dept"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Academic Departments | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Explore the B.Tech engineering departments: CSE, AI&DS, ECE, EEE, Mechanical, and Civil Engineering with laboratories and HOD profiles.`,
      },
      { property: "og:title", content: `Departments | PK College of Engineering & Technology` },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const store = useCollegeStore();
  const departments = store.departments;
  const search = useSearch({ from: "/departments" });
  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>(search.dept || "cse");
  const selectedDept = (
    departments.find((d) => d.slug === selectedDeptSlug) ||
    departments[0] ||
    initialDepartments[0]
  ) as Department;

  return (
    <>
      <InstitutionalPageBanner
        title="Engineering Departments"
        subtitle="Explore our 6 approved B.Tech disciplines, specialized laboratories, faculty leadership, and career pathways."
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Departments" },
        ]}
      />

      <section className="py-12 bg-white">
        <div className="college-container">
          {/* Department Selection Bar */}
          <div className="mb-10 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max border-b border-slate-200 pb-3">
              {departments.map((dept) => {
                const isSelected = selectedDept.slug === dept.slug;
                return (
                  <button
                    key={dept.code}
                    onClick={() => setSelectedDeptSlug(dept.slug)}
                    className={`px-4 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      isSelected
                        ? "bg-[#0b224d] text-white border-[#0b224d] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>Branch {dept.code}:</span>
                    <span>{dept.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Department Details Header */}
          <div className="p-5 sm:p-8 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#b45309] mb-1">
                  <span>Branch Code: {selectedDept.code}</span>
                  <span>·</span>
                  <span>Approved Intake: {selectedDept.intake} Seats</span>
                  <span>·</span>
                  <span>4 Years (8 Semesters)</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0b224d] mb-4">
                  {selectedDept.title}
                </h2>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-6">
                  {selectedDept.overview}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#0b224d]">
                  <span className="p-2 bg-white border border-slate-200 rounded">
                    Degree: <strong>B.Tech (4 Years / 8 Semesters)</strong>
                  </span>
                  <span className="p-2 bg-white border border-slate-200 rounded">
                    Laboratories: <strong>{selectedDept.laboratories.length} Department Labs</strong>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4">
                <img
                  src={selectedDept.image}
                  alt={selectedDept.title}
                  className="rounded border border-slate-200 w-full h-56 object-cover shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* HOD Profile & Vision/Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            {/* HOD Card */}
            <div className="lg:col-span-4">
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded bg-[#0b224d] text-white flex items-center justify-center">
                      <School size={24} className="text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#b45309]">Department Desk</span>
                      <h3 className="text-base font-bold text-[#0b224d] leading-snug">{selectedDept.hod.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed mb-4">
                    <p><strong>Designation:</strong> {selectedDept.hod.designation}</p>
                    <p><strong>Academic Status:</strong> {selectedDept.hod.qualification}</p>
                    <p><strong>Experience:</strong> {selectedDept.hod.experience}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Mail size={13} className="text-[#b45309]" />
                    <span>{selectedDept.hod.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departmental Vision & Mission */}
            <div className="lg:col-span-8">
              <div className="p-6 bg-white border border-slate-200 rounded h-full space-y-6">
                <div>
                  <h4 className="text-sm font-extrabold uppercase text-[#b45309] tracking-wider mb-1">
                    Department Vision
                  </h4>
                  <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedDept.vision}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold uppercase text-[#b45309] tracking-wider mb-2">
                    Department Mission
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                    {selectedDept.mission.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Laboratories & Career Prospects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Laboratories */}
            <div className="p-6 bg-white border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical size={20} className="text-[#0b224d]" />
                <h3 className="text-lg font-bold text-[#0b224d]">Departmental Laboratories</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-700">
                {selectedDept.laboratories.map((lab, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 border border-slate-100 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{lab}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Prospects */}
            <div className="p-6 bg-white border border-slate-200 border-t-4 border-t-[#b45309] rounded shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={20} className="text-[#b45309]" />
                <h3 className="text-lg font-bold text-[#0b224d]">Career Prospects & Job Roles</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-700 mb-6">
                {selectedDept.careerProspects.map((career, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 border border-slate-100 rounded">
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-800">{career}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Key Competency Domains</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDept.keyDomains.map((domain, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-medium">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enquire For Department Admission CTA */}
          <div className="p-6 bg-[#0b224d] text-white rounded flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-amber-400">
                Interested in {selectedDept.shortTitle} at PKCET?
              </h4>
              <p className="text-xs text-slate-200 mt-1">
                Approved intake: {selectedDept.intake} seats under EAMCET Convener Quota & Institutional Quota.
              </p>
            </div>
            <Link
              to="/admissions"
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Enquire for Admission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
