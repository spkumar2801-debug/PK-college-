import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Calendar, Search, Tag, X, FileText, ChevronRight } from "lucide-react";
import { site, type Announcement } from "@/data/site";
import { InstitutionalPageBanner } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: `Announcements & Notices | ${site.name}` },
      {
        name: "description",
        content: `Official college notices, circulars, examination timetables, and admissions announcements from ${site.name}, Vijayawada.`,
      },
      { property: "og:title", content: `Announcements | ${site.name}` },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const store = useCollegeStore();
  const { announcements, siteSettings } = store;
  const site = siteSettings;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotice, setActiveNotice] = useState<Announcement | null>(null);

  const categories = ["All", "Admissions", "Examinations", "Circulars", "Placements", "Academics"];

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCat = selectedCategory === "All" || ann.category === selectedCategory;
    const matchesQuery =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <InstitutionalPageBanner
        title="Announcements & Official Notices"
        subtitle="Official administrative circulars, examination schedules, academic notifications, and placement updates."
        breadcrumbs={[{ label: "Announcements & News" }]}
      />

      <section className="py-8 sm:py-14 bg-white">
        <div className="college-container max-w-5xl">
          {/* Controls: Search & Category */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded">
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
                    selectedCategory === cat
                      ? "bg-[#0b224d] text-white border-[#0b224d]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-[#0b224d] outline-none bg-white"
              />
            </div>
          </div>

          {/* Notices List */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="p-8 sm:p-12 text-center border-2 border-dashed border-slate-200 rounded text-slate-500">
                <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No announcements found matching your criteria.</p>
              </div>
            ) : (
              filteredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setActiveNotice(ann)}
                  className="bg-white border border-slate-200 hover:border-[#0b224d] rounded p-4 sm:p-5 shadow-sm transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      {ann.isUrgent && (
                        <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                          Urgent Notice
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar size={12} /> {ann.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0b224d] mb-1.5">
                      {ann.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {ann.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#b45309] hover:underline self-end md:self-center whitespace-nowrap pt-2 md:pt-0">
                    <span>Read Full Circular</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Notice Detail Dialog */}
      {activeNotice && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveNotice(null)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-300 rounded shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {activeNotice.category}
                </span>
                <span className="text-xs text-slate-500 ml-2">Date: {activeNotice.date}</span>
                <h3 className="text-lg font-bold text-[#0b224d] mt-2">
                  {activeNotice.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveNotice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed mb-6">
              <p className="font-semibold text-slate-900">{activeNotice.summary}</p>
              {(activeNotice.content || activeNotice.details) && (
                <p>{activeNotice.content || activeNotice.details}</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveNotice(null)}
                className="bg-[#0b224d] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
