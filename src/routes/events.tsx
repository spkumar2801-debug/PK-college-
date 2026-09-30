import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, MapPin, Tag, CheckCircle2 } from "lucide-react";
import { site } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: `Campus Events & Conferences | ${site.name}` },
      {
        name: "description",
        content: `Stay updated on technical symposiums, national conferences, sports tournaments, and cultural fests at ${site.name}, Vijayawada.`,
      },
      { property: "og:title", content: `Events | ${site.name}` },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const store = useCollegeStore();
  const { events, siteSettings } = store;
  const site = siteSettings;
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Technical", "Workshop", "Sports", "Cultural", "Conference"];

  const filteredEvents = events.filter(
    (e) => filterCategory === "All" || e.category === filterCategory,
  );

  return (
    <>
      <InstitutionalPageBanner
        title="College Events & Activities"
        subtitle="National conferences, inter-collegiate technical symposia, industrial workshops, and cultural celebrations at PKCET."
        breadcrumbs={[{ label: "Events" }]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
                  filterCategory === cat
                    ? "bg-[#0b224d] text-white border-[#0b224d]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 rounded p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 sm:gap-6 items-start"
              >
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full md:w-56 h-40 object-cover rounded flex-shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar size={13} /> {evt.date}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock size={13} /> {evt.time}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#0b224d] mb-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-700 font-medium flex items-center gap-1">
                      <MapPin size={14} className="text-[#b45309]" />
                      <strong>Venue:</strong> {evt.venue}
                    </span>

                    {evt.registrationOpen ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px]">
                        <CheckCircle2 size={13} /> Registration Open
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px]">
                        Closed / Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
