import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Image as ImageIcon, X, ZoomIn } from "lucide-react";
import { site, type GalleryItem } from "@/data/site";
import { InstitutionalPageBanner, SectionHeader } from "@/components/site/SiteLayout";
import { useCollegeStore } from "@/lib/college-store";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Photo Gallery | ${site.name}` },
      {
        name: "description",
        content: `Explore photographic glimpses of campus infrastructure, high-tech engineering laboratories, academic spaces, and sports facilities at ${site.name}, Vijayawada.`,
      },
      { property: "og:title", content: `Gallery | ${site.name}` },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const store = useCollegeStore();
  const { galleryItems, siteSettings } = store;
  const site = siteSettings;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ["All", "Campus", "Laboratories", "Library", "Sports", "Academic Spaces", "Events", "Departments"];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory,
  );

  return (
    <>
      <InstitutionalPageBanner
        title="Campus Photo Gallery"
        subtitle="Visual impressions of academic blocks, advanced engineering laboratories, sports arenas, and campus life at PKCET."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="py-14 bg-white">
        <div className="college-container">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
                  activeCategory === cat
                    ? "bg-[#0b224d] text-white border-[#0b224d]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group cursor-pointer bg-white border border-slate-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#0b224d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-[#0b224d]">
                      <ZoomIn size={20} />
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col flex-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#b45309] tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-[#0b224d] line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] bg-white rounded overflow-hidden shadow-2xl flex flex-col"
          >
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.alt}
              className="max-h-[70vh] object-contain bg-black"
            />
            <div className="p-4 bg-white border-t border-slate-200">
              <span className="text-xs font-bold uppercase text-[#b45309] block">
                {selectedPhoto.category}
              </span>
              <h3 className="text-sm font-bold text-[#0b224d]">
                {selectedPhoto.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
