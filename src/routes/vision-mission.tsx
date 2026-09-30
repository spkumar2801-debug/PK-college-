import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Target, ShieldCheck, HeartHandshake, Eye, Sparkles, ArrowRight } from "lucide-react";
import { site as defaultSite } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/vision-mission")({
  head: () => ({
    meta: [
      { title: `Vision & Mission | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Read the official Vision, Mission, Core Values, and Quality Policy of PK College of Engineering & Technology.`,
      },
      { property: "og:title", content: `Vision & Mission | PK College of Engineering & Technology` },
    ],
  }),
  component: VisionMissionPage,
});

function VisionMissionPage() {
  const store = useCollegeStore();
  const site = store.siteSettings;
  const values = [
    {
      title: "Academic Integrity & Rigor",
      desc: "Upholding highest standards of honesty, discipline, and intellectual depth across classrooms and laboratories.",
    },
    {
      title: "Innovation & Problem Solving",
      desc: "Encouraging original thinking, design prototyping, and research that directly addresses societal challenges.",
    },
    {
      title: "Professional & Ethical Conduct",
      desc: "Instilling social responsibility, safety protocols, and empathy alongside technical excellence.",
    },
    {
      title: "Continuous Lifelong Learning",
      desc: "Empowering students with foundational learning habits to adapt seamlessly to evolving technological landscapes.",
    },
  ];

  return (
    <>
      <InstitutionalPageBanner
        title="Vision, Mission & Core Values"
        subtitle="The guiding compass directing academic curricula, faculty instruction, and institutional development at PKCET."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Vision & Mission" },
        ]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container max-w-5xl">
          {/* Vision Block */}
          <div className="mb-10 sm:mb-12 p-5 sm:p-8 md:p-10 bg-slate-50 border-2 border-slate-200 border-l-4 sm:border-l-8 border-l-[#0b224d] rounded shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#0b224d] text-white flex items-center justify-center flex-shrink-0">
                <Compass size={24} className="text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#b45309]">Institutional Direction</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b224d]">Institutional Vision</h2>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-medium">
              "{site.vision || "To emerge as a premier center of technical education and applied research, producing socially conscious, globally competent, and ethically grounded engineers capable of pioneering innovative technological solutions for societal advancement."}"
            </p>
          </div>

          {/* Mission Block */}
          <div className="mb-10 sm:mb-12 p-5 sm:p-8 md:p-10 bg-slate-50 border-2 border-slate-200 border-l-4 sm:border-l-8 border-l-[#b45309] rounded shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#b45309] text-white flex items-center justify-center flex-shrink-0">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#b45309]">Operational Mandate</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b224d]">Institutional Mission</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#b45309] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong>Academic Rigor:</strong> Deliver rigorous, outcome-based engineering education integrated with intensive hands-on laboratory experiences and continuous internal assessment.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#b45309] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong>Industry Integration:</strong> Cultivate proactive industrial partnerships, corporate guest lectures, internships, and skill development bootcamps to ensure career readiness.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#b45309] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong>Research & Innovation:</strong> Encourage faculty and student innovation through multidisciplinary project laboratories, patent filing, technical symposiums, and entrepreneurship incubation.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#b45309] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  <strong>Human Values & Ethics:</strong> Instill professional ethics, leadership qualities, environmental sustainability, and a commitment to nation-building.
                </p>
              </div>
            </div>
          </div>

          {/* Quality Policy & Core Values */}
          <div>
            <SectionHeader
              eyebrow="Ethical Foundations"
              title="Our Core Values"
              subtitle="The foundational values expected of every student, faculty member, and staff member at PKCET."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((val, idx) => (
                <div key={idx} className="p-5 border border-slate-200 bg-white rounded shadow-sm">
                  <h3 className="font-bold text-[#0b224d] text-base mb-2">{val.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded">
              <h4 className="font-bold text-[#b45309] text-sm mb-1 uppercase tracking-wide">
                Quality Policy of PKCET
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {site.name} is committed to continuous enhancement of its pedagogical methods, physical infrastructure, laboratory equipment, and faculty research capabilities to satisfy the requirements of regulatory statutory bodies, industrial stakeholders, and society.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
