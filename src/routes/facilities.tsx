import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  Bus,
  CheckCircle2,
  Cpu,
  Home,
  ShieldCheck,
  Trophy,
  Utensils,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { site as defaultSite, collegeFacilities as defaultFacilities } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: `Campus Life & Facilities | PK College of Engineering & Technology` },
      {
        name: "description",
        content: `Discover campus infrastructure at PK College of Engineering & Technology: Central Digital Library, departmental laboratories, sports grounds, residential hostels, and transport network.`,
      },
      { property: "og:title", content: `Facilities | PK College of Engineering & Technology` },
    ],
  }),
  component: FacilitiesPage,
});

function FacilitiesPage() {
  const store = useCollegeStore();
  const site = store.siteSettings;
  const collegeFacilities = store.facilities;
  return (
    <>
      <InstitutionalPageBanner
        title="Campus Infrastructure & Facilities"
        subtitle="Purpose-built academic, computational, residential, and sporting amenities designed for holistic undergraduate engineering education."
        breadcrumbs={[{ label: "Campus Life / Facilities" }]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          <SectionHeader
            eyebrow="Physical Ecosystem"
            title="Learning & Living Amenities"
            subtitle="Explore the departmental laboratory hubs, digital repositories, and student life amenities across our campus."
          />

          <div className="space-y-8 sm:space-y-12 md:space-y-16">
            {collegeFacilities.map((fac, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={fac.id}
                  id={fac.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center border border-slate-200 rounded-lg p-4 sm:p-6 md:p-8 bg-slate-50 shadow-sm"
                >
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="relative rounded overflow-hidden shadow border-2 border-white aspect-[16/10]">
                      <img
                        src={fac.image}
                        alt={fac.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={750}
                      />
                    </div>
                  </div>

                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block mb-1">
                      Facility 0{idx + 1}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#0b224d] mb-1">
                      {fac.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-3 italic">
                      "{fac.tagline}"
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-5">
                      {fac.description}
                    </p>

                    <h4 className="text-xs font-bold uppercase text-slate-900 mb-2.5">
                      Salient Features & Specifications:
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 mb-6">
                      {fac.keyFeatures.map((feat: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick CTA */}
          <div className="mt-14 p-8 bg-[#0b224d] text-white rounded text-center">
            <h3 className="text-xl font-bold text-white mb-2">Schedule a Campus Visit</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto mb-4">
              Prospective students and parents are welcome to visit our campus, inspect our laboratories, and meet faculty mentors during college working hours.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider"
            >
              <span>Get Directions to Campus</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
