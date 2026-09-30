import { type ReactNode, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { CollegeHeader } from "@/components/site/CollegeHeader";
import { CollegeFooter } from "@/components/site/CollegeFooter";
import { useCollegeStore } from "@/lib/college-store";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function PublicLayout({ children }: { children: ReactNode }) {
  const store = useCollegeStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useScrollReveal();

  useEffect(() => {
    const customFavicon = store.siteSettings?.faviconUrl || store.siteSettings?.logoUrl;
    if (customFavicon && typeof document !== "undefined") {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = customFavicon;
      }
    }
  }, [store.siteSettings?.faviconUrl, store.siteSettings?.logoUrl]);

  // Double-guard: NEVER render public website header, news ticker, or footer on /admin routes
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans">
      <CollegeHeader />
      <main className="flex-1 w-full">{children}</main>
      <CollegeFooter />
    </div>
  );
}

export const SiteLayout = PublicLayout;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function InstitutionalPageBanner({
  title,
  subtitle,
  breadcrumbs = [],
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <section className="bg-[#0b224d] text-white border-b-4 border-[#d97706] py-7 sm:py-10 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="college-container relative z-10">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-amber-200 mb-2 sm:mb-3">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <HomeIcon size={12} />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((b, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="text-slate-400" />
                {b.href ? (
                  <Link to={b.href} className="hover:text-white">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = "",
  dataReveal = "fade-up",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  dataReveal?: string;
}) {
  return (
    <div
      className={`mb-8 sm:mb-10 ${centered ? "text-center max-w-3xl mx-auto" : ""} ${className}`}
      {...(dataReveal ? { "data-reveal": dataReveal } : {})}
    >
      {eyebrow && (
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#b45309] mb-1.5 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0b224d] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`w-16 h-1 bg-[#d97706] mt-3.5 ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}
