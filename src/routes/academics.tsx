import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Layers,
  Scroll,
  ArrowRight,
} from "lucide-react";
import { site as defaultSite, admissionsInfo } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: `Academics & B.Tech Programs | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Explore undergraduate B.Tech engineering programs, academic regulations, examination procedures, and curriculum at PK College of Engineering & Technology.`,
      },
      { property: "og:title", content: `Academics | PK College of Engineering & Technology` },
    ],
  }),
  component: AcademicsPage,
});

function AcademicsPage() {
  const store = useCollegeStore();
  const departments = store.departments;
  const site = store.siteSettings;
  const semestersRoadmap = [
    {
      year: "First Year (Semesters I & II)",
      title: "Foundational Sciences & Basic Engineering",
      points: [
        "Engineering Mathematics, Physics & Chemistry",
        "Problem Solving and Programming in C / Python",
        "Engineering Graphics & CAD Drawing",
        "Basic Electrical & Electronics Engineering Labs",
        "English Communication Skills Lab & Environmental Science",
      ],
    },
    {
      year: "Second Year (Semesters III & IV)",
      title: "Core Engineering Fundamentals",
      points: [
        "Branch-specific core subjects (Data Structures, Circuits, Mechanics, Materials)",
        "Discrete Mathematics and Probability & Statistics",
        "Comprehensive Departmental Laboratory Practicals",
        "Object Oriented Programming & Database Management",
        "Design Thinking and Mandatory Social Internships",
      ],
    },
    {
      year: "Third Year (Semesters V & VI)",
      title: "Advanced Specialization & Professional Electives",
      points: [
        "Domain-specific advanced engineering topics",
        "Open Electives from interdisciplinary branches",
        "Industry-certified training modules & mini-projects",
        "Employability enhancement and technical aptitude labs",
        "Summer Industry Internship after VI semester",
      ],
    },
    {
      year: "Fourth Year (Semesters VII & VIII)",
      title: "Capstone Projects, Internships & Placements",
      points: [
        "Major Capstone Project Work (Design, Fabrication, Simulation)",
        "Full-semester Industry Internship / Placement Drives",
        "Professional Ethics and Universal Human Values",
        "Patent filing, Research paper publishing & viva-voce",
      ],
    },
  ];

  return (
    <>
      <InstitutionalPageBanner
        title="Academic Programs & Regulations"
        subtitle="A comprehensive pedagogical framework designed to impart deep technical competence and practical mastery."
        breadcrumbs={[{ label: "Academics" }]}
      />

      {/* Programs Offered Table */}
      <section id="programs" className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          <SectionHeader
            eyebrow="Undergraduate Degree"
            title="Approved B.Tech Programs & Annual Intake"
            subtitle="All engineering programs are 4-year (8-semester) full-time Bachelor of Technology degrees."
          />

          <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0b224d] text-white">
                  <th className="p-3.5 border-b font-bold">Code</th>
                  <th className="p-3.5 border-b font-bold">Program Name</th>
                  <th className="p-3.5 border-b font-bold">Approved Intake</th>
                  <th className="p-3.5 border-b font-bold">Duration</th>
                  <th className="p-3.5 border-b font-bold text-right">Department Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {departments.map((dept) => (
                  <tr key={dept.code} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-[#b45309]">Branch {dept.code}</td>
                    <td className="p-3.5 font-semibold text-[#0b224d]">
                      {dept.shortTitle}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{dept.intake} Seats</td>
                    <td className="p-3.5 text-slate-600">4 Years (8 Semesters)</td>
                    <td className="p-3.5 text-right">
                      <Link
                        to="/departments"
                        search={{ dept: dept.slug }}
                        className="inline-flex items-center gap-1 font-bold text-[#0b224d] hover:text-[#b45309]"
                      >
                        <span>View Details</span>
                        <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4-Year Curriculum Roadmap */}
      <section id="curriculum" className="py-8 sm:py-14 bg-slate-50 border-y border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Curriculum Structure"
            title="4-Year Academic Progression Roadmap"
            subtitle="Carefully structured semester milestones ensuring a balance between theoretical foundations and applied engineering."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {semestersRoadmap.map((roadmap, idx) => (
              <div key={idx} className="p-4 sm:p-6 bg-white border border-slate-200 rounded shadow-sm border-t-4 border-t-[#0b224d]">
                <span className="text-xs font-bold uppercase text-[#b45309] block mb-1">
                  {roadmap.year}
                </span>
                <h3 className="text-lg font-bold text-[#0b224d] mb-3">{roadmap.title}</h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {roadmap.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Regulations & Examination Cell */}
      <section id="regulations" className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* Academic Regulations */}
            <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center gap-3 mb-4">
                <Scroll size={24} className="text-[#0b224d]" />
                <h3 className="text-xl font-bold text-[#0b224d]">Academic Regulations</h3>
              </div>
              <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                <p>
                  <strong>Attendance Requirement:</strong> A student shall be eligible to appear for the semester end examinations if they acquire a minimum of 75% aggregate attendance across all courses.
                </p>
                <p>
                  <strong>Assessment Framework:</strong> Continuous Internal Evaluation (CIE) carries 30% weightage (Mid-Examinations, Assignments, and Quizzes) and Semester End Examination (SEE) carries 70% weightage.
                </p>
                <p>
                  <strong>Laboratory Evaluation:</strong> Laboratory performance is assessed continuously for experiment execution, lab records, and practical end exams.
                </p>
              </div>
            </div>

            {/* Examination Cell */}
            <div id="examination" className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList size={24} className="text-[#b45309]" />
                <h3 className="text-xl font-bold text-[#0b224d]">Examination Cell</h3>
              </div>
              <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                <p>
                  <strong>Grading System:</strong> Follows the standard 10-point Letter Grade System (O, A+, A, B+, B, C, F) based on relative and absolute performance benchmarks.
                </p>
                <p>
                  <strong>Notification & Grievance:</strong> Examination timetables, hall tickets, revaluation notifications, and grade sheets are issued through the Examination Cell.
                </p>
                <p>
                  <strong>Confidentiality & Rigor:</strong> Central evaluation, barcode coding of answer scripts, and strict vigilance ensure complete fairness in all institutional examinations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-[#0b224d] text-white rounded flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-amber-400">Looking for Admission Information?</h4>
              <p className="text-xs text-slate-200 mt-1">Review eligibility criteria, counseling codes, and application guidelines for the upcoming session.</p>
            </div>
            <Link
              to="/admissions"
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Admissions Portal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
