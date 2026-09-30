import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Trophy, Star, CheckCircle2, ChevronRight } from "lucide-react";
import { site } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: `Institutional Achievements | ${site.name}` },
      {
        name: "description",
        content: `Academic recognitions, student project achievements, and institutional milestones from ${site.name}.`,
      },
      { property: "og:title", content: `Achievements | ${site.name}` },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const achievementPillars = [
    {
      category: "Technical Innovation",
      title: "Student Project Competitions & Hackathons",
      desc: "Recognitions earned by undergraduate engineering students in regional and national technical symposiums and design contests.",
      note: "Annual records curated by Departmental Coordinators",
    },
    {
      category: "Academic Excellence",
      title: "University Academic Distinctions",
      desc: "Consistent academic performance, semester distinctions, and department toppers felicitated at annual academic celebrations.",
      note: "Published each academic evaluation cycle",
    },
    {
      category: "Engineering Innovation",
      title: "Project Prototyping & Technical Publications",
      desc: "Faculty and student collaborative projects, engineering conference presentations, and technical prototypes developed in departmental labs.",
      note: "Coordinated through the College Incubation Cell",
    },
    {
      category: "Sports & Extra-Curriculars",
      title: "Inter-Collegiate Sports & Athletic Laurels",
      desc: "Student athletes representing PKCET in collegiate cricket, volleyball, badminton, and athletic tournaments.",
      note: "Supervised by the Physical Education Department",
    },
  ];

  return (
    <>
      <InstitutionalPageBanner
        title="Student & Institutional Achievements"
        subtitle="Celebrating academic honors, technical innovations, and campus milestones across departments."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Achievements" },
        ]}
      />

      <section className="py-14 bg-white">
        <div className="college-container max-w-5xl">
          <SectionHeader
            eyebrow="Milestones"
            title="Laurels & Student Accomplishments"
            subtitle="Highlights of accomplishments achieved by our students and faculty mentors."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievementPillars.map((ach, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {ach.category}
                  </span>
                  <span className="font-medium text-slate-500">{ach.note}</span>
                </div>

                <h3 className="text-base font-bold text-[#0b224d] mb-2 leading-snug">
                  {ach.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {ach.desc}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#0b224d] font-semibold">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Institutional Milestone</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-100 border border-slate-200 rounded text-center">
            <h4 className="font-bold text-sm text-[#0b224d] mb-1">
              Have an academic or research milestone to share?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Students and faculty can submit their achievements to the Internal Quality Assurance Cell (IQAC).
            </p>
            <Link
              to="/contact"
              className="text-xs font-bold text-[#b45309] hover:underline"
            >
              Contact Administrative Cell
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
