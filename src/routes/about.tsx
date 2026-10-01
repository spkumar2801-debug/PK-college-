import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Target,
  Users,
  Compass,
  Award,
  ArrowRight,
} from "lucide-react";
import { site as defaultSite, imagery, leadership as defaultLeadership } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Learn about the institutional background, vision, leadership, and academic philosophy of PK College of Engineering & Technology.`,
      },
      { property: "og:title", content: `About | PK College of Engineering & Technology` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const store = useCollegeStore();
  const site = store.siteSettings;
  const leadership = store.leadership;

  return (
    <>
      <InstitutionalPageBanner
        title="About the Institution"
        subtitle={`Discover the founding story, educational values, and administrative leadership behind ${site.name}.`}
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Overview Section */}
      <section className="py-14 bg-white">
        <div className="college-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block mb-2">
                {site.established} · Our Genesis & Growth
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b224d] mb-4">
                Dedicated to Educational Excellence in Engineering
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                <strong>{site.name}</strong> was established with the institutional commitment to offer quality technical education to aspiring engineering students. The college is dedicated to fostering sound engineering fundamentals, disciplined learning, and practical laboratory experimentation.
              </p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                {site.aboutText || "Spread across a landscaped campus, our institution provides an inspiring physical environment conducive to deep study, creative inquiry, and collaborative engineering projects."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0b224d]">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Comprehensive Laboratory Infrastructure</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0b224d]">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Structured B.Tech Engineering Curriculum</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0b224d]">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Status: {site.established}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0b224d]">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Counseling Code: {site.counselingCode}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border-4 border-slate-100 rounded shadow-md overflow-hidden">
                <img
                  src={imagery.campusMain}
                  alt={`${site.name} Administrative Block`}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-4 bg-[#0b224d] text-white">
                  <h4 className="font-bold text-sm text-amber-400">Campus Infrastructure</h4>
                  <p className="text-xs text-slate-300 mt-1">Modern Academic Blocks, Laboratories & Student Amenities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Summary */}
      <section className="py-14 bg-slate-100 border-y border-slate-200">
        <div className="college-container">
          <SectionHeader
            eyebrow="Core Philosophy"
            title="Vision & Mission of PKCET"
            subtitle="The fundamental principles guiding our curriculum, faculty mentorship, and student development."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 sm:p-8 bg-white border border-slate-200 border-t-4 border-t-[#0b224d] rounded shadow-sm">
              <div className="w-12 h-12 rounded bg-[#0b224d] text-white flex items-center justify-center mb-4">
                <Compass size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#0b224d] mb-3">Our Vision</h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {site.vision || "To emerge as a premier center of technical education and research in Andhra Pradesh, producing socially conscious, globally competent, and ethically grounded engineers capable of pioneering innovative technological solutions for societal advancement."}
              </p>
              <Link
                to="/vision-mission"
                className="text-xs font-bold text-[#b45309] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Vision Document</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="p-5 sm:p-8 bg-white border border-slate-200 border-t-4 border-t-[#b45309] rounded shadow-sm">
              <div className="w-12 h-12 rounded bg-[#b45309] text-white flex items-center justify-center mb-4">
                <Target size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#0b224d] mb-3">Our Mission</h3>
              <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                {(site.missions && site.missions.length > 0
                  ? site.missions
                  : site.mission
                  ? site.mission.split("\n").map((m) => m.trim()).filter(Boolean)
                  : [
                      "Deliver rigorous, outcome-based engineering education integrated with intensive hands-on laboratory experiences.",
                      "Cultivate strong industrial partnerships to facilitate internships, corporate mentorship, and campus recruitments.",
                      "Instill professional ethics, leadership qualities, environmental consciousness, and life-long learning values in every student.",
                    ]
                ).map((mText, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    <span>{mText}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Administration */}
      <section id="leadership" className="py-14 bg-white">
        <div className="college-container">
          <SectionHeader
            eyebrow="Institutional Governance"
            title="Leadership & Administrative Desk"
            subtitle="Distinguished leaders guiding the academic trajectory and governance of PKCET."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Principal's Card */}
            <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#b45309] tracking-wider mb-2 block">
                  Principal & Head of Institution
                </span>
                <h3 className="text-lg font-bold text-[#0b224d] mb-1">{leadership.principal.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{leadership.principal.qualifications}</p>
                <p className="text-xs text-slate-700 leading-relaxed mb-4 italic">
                  "{leadership.principal.message.slice(0, 220)}..."
                </p>
              </div>
              <Link
                to="/principal-message"
                className="text-xs font-bold text-[#0b224d] hover:text-[#b45309] inline-flex items-center gap-1 mt-2"
              >
                <span>View Principal's Full Address</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Chairman's Card */}
            <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#b45309] tracking-wider mb-2 block">
                  Founder & Chairman
                </span>
                <h3 className="text-lg font-bold text-[#0b224d] mb-1">{leadership.chairman.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{leadership.chairman.title}</p>
                <p className="text-xs text-slate-700 leading-relaxed mb-4 italic">
                  "{leadership.chairman.message}"
                </p>
              </div>
              <div className="text-xs font-bold text-slate-500">
                PK Educational Academy
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
