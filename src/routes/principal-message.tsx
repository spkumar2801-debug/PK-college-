import { createFileRoute, Link } from "@tanstack/react-router";
import { School, Award, CheckCircle2, Mail, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import { site as defaultSite, leadership as defaultLeadership, imagery } from "@/data/site";
import { InstitutionalPageBanner } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/principal-message")({
  head: () => ({
    meta: [
      { title: `Principal's Message | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Read the official message from the Principal of PK College of Engineering & Technology, detailing the institutional academic vision and student mentorship principles.`,
      },
      { property: "og:title", content: `Principal's Message | PK College of Engineering & Technology` },
    ],
  }),
  component: PrincipalMessagePage,
});

function PrincipalMessagePage() {
  const store = useCollegeStore();
  const site = store.siteSettings;
  const p = store.leadership.principal;

  return (
    <>
      <InstitutionalPageBanner
        title="Principal's Message"
        subtitle="Guiding vision, educational philosophy, and address to prospective engineers and parents."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Principal's Message" },
        ]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            {/* Principal Profile Card */}
            <div className="lg:col-span-4">
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm text-center">
                <div className="inline-block p-1 bg-white border border-slate-300 rounded shadow-sm mb-4">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded bg-[#0b224d] text-white flex flex-col items-center justify-center p-3">
                    <School size={40} className="text-amber-400 mb-1 sm:mb-2" />
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Office of Principal</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-[#0b224d] mb-1">{p.name}</h2>
                <p className="text-xs font-bold text-[#b45309] uppercase tracking-wide mb-2">
                  Principal & Professor
                </p>
                <p className="text-xs text-slate-600 mb-4">{p.qualifications}</p>

                <div className="pt-4 border-t border-slate-200 text-left text-xs space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-amber-600 flex-shrink-0" />
                    <span>{p.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-amber-600 flex-shrink-0" />
                    <span className="truncate">{site.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-amber-600 flex-shrink-0" />
                    <span>{site.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <Link
                    to="/admissions"
                    className="w-full block bg-[#0b224d] hover:bg-[#102a5c] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Admissions Enquiry
                  </Link>
                </div>
              </div>
            </div>

            {/* Principal Full Address */}
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block mb-2">
                From the Desk of the Principal
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0b224d] mb-4 sm:mb-6">
                "Technical Competence, Innovation, and Character Form the Bedrock of Modern Engineering"
              </h2>

              <div className="prose prose-slate max-w-none text-sm md:text-base text-slate-700 leading-relaxed space-y-4">
                <p className="font-semibold text-slate-900">
                  Dear Students, Parents, and Aspirants,
                </p>
                <p>
                  It gives me immense pleasure to welcome you to <strong>{site.name}</strong>. Our institution stands committed to producing industry-ready, technically proficient, and ethically upright engineering graduates who can thrive in an increasingly dynamic global landscape.
                </p>
                <p>
                  Today, the frontiers of engineering are evolving at unprecedented speed. From pervasive Artificial Intelligence and automated robotics to renewable energy smart grids and sustainable civil infrastructures, the problems of tomorrow demand an agile mind and rigorous hands-on problem-solving capabilities. At PKCET, we ensure that theoretical knowledge acquired in classrooms finds immediate application across our departmental laboratories and workshops.
                </p>
                <p>
                  We believe that education must extend far beyond the syllabus. Our students are continuously encouraged to participate in technical symposiums, collaborative projects, and co-curricular learning. Through our proactive Training & Placement Cell, we nurture communication skills, programming aptitude, and professional confidence right from the early semesters.
                </p>
                <p>
                  To the prospective students joining our campus, I assure you of a transformative four-year undergraduate journey where your intellectual curiosities will be honored, your talents honed by devoted mentors, and your career aspirations realized.
                </p>
              </div>

              {/* Key Pillars */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-base font-bold text-[#0b224d] mb-3">Our Core Academic Pillars</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.keyPoints.map((kp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-semibold">{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0b224d]"
                >
                  <ArrowLeft size={14} />
                  <span>Back to About Us</span>
                </Link>

                <Link
                  to="/departments"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:underline"
                >
                  <span>Explore B.Tech Departments</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
