import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Bell,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { site } from "@/data/site";
import { CollegeCrest } from "@/components/site/CollegeCrest";
import { useCollegeStore } from "@/lib/college-store";

export function CollegeHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { announcements, siteSettings } = useCollegeStore();
  const site = siteSettings;

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [mobileOpen]);

  const latestNotice = announcements[0] || {
    id: "default",
    title: "B.Tech Admissions Process Guidelines — Notification for Academic Session",
    date: "2026-09-20",
  };

  const navItems = [
    { label: "Home", href: "/" },
    {
      label: "About",
      href: "/about",
      dropdown: [
        { label: "About the Institution", href: "/about" },
        { label: "Principal's Message", href: "/principal-message" },
        { label: "Vision, Mission & Values", href: "/vision-mission" },
        { label: "Governing Body & Leadership", href: "/about#leadership" },
      ],
    },
    {
      label: "Academics",
      href: "/academics",
      dropdown: [
        { label: "B.Tech Undergraduate Programs", href: "/academics" },
        { label: "Academic Regulations & Evaluation", href: "/academics#regulations" },
        { label: "Examination Cell & Grading", href: "/academics#examination" },
        { label: "Curriculum Roadmap", href: "/academics#curriculum" },
      ],
    },
    {
      label: "Departments",
      href: "/departments",
      dropdown: [
        { label: "Computer Science & Engineering (CSE)", href: "/departments?dept=cse" },
        { label: "AI & Data Science (AI & DS)", href: "/departments?dept=ai-ds" },
        { label: "AI & Machine Learning (AIML)", href: "/departments?dept=aiml" },
        { label: "Electronics & Communication (ECE)", href: "/departments?dept=ece" },
        { label: "Electrical & Electronics (EEE)", href: "/departments?dept=eee" },
        { label: "Mechanical Engineering (ME)", href: "/departments?dept=mech" },
        { label: "Civil Engineering (CE)", href: "/departments?dept=civil" },
      ],
    },
    {
      label: "Admissions",
      href: "/admissions",
      dropdown: [
        { label: "Admissions Overview & Guidelines", href: "/admissions" },
        { label: "Eligibility Criteria (EAMCET/ECET)", href: "/admissions#eligibility" },
        { label: "Seat Matrix & Approved Intake", href: "/admissions#intake" },
        { label: "Documents Required Checklist", href: "/admissions#documents" },
        { label: "Online Admission Enquiry Form", href: "/admissions#enquiry" },
      ],
    },
    {
      label: "Placements",
      href: "/placements",
      dropdown: [
        { label: "Training & Placement Cell", href: "/placements" },
        { label: "4-Year Career Readiness Roadmap", href: "/placements#roadmap" },
        { label: "Placement Procedure & Guidelines", href: "/placements#process" },
      ],
    },
    {
      label: "Campus Life",
      href: "/facilities",
      dropdown: [
        { label: "Central Digital Library", href: "/facilities#fac-library" },
        { label: "Central Computing Center", href: "/facilities#fac-computing" },
        { label: "Engineering Workshops & Labs", href: "/facilities#fac-workshop" },
        { label: "Sports Complex & Athletic Grounds", href: "/facilities#fac-sports" },
        { label: "Hostels & Student Residence", href: "/facilities#fac-hostels" },
        { label: "College Bus Transport Network", href: "/facilities#fac-transport" },
      ],
    },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Announcements", href: "/announcements" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full relative z-40 bg-white">
      {/* 1. Top Utility Bar (Visible on Desktop >= 1024px; Hidden on Mobile & Tablet to keep header clean) */}
      <div className="top-utility-bar hidden lg:block">
        <div className="college-container top-utility-inner">
          <div className="top-utility-left">
            <span className="utility-item">
              <MapPin size={13} className="text-amber-400" />
              <span>{site.location}</span>
            </span>
            <span className="utility-item hidden lg:inline-flex">
              <Phone size={13} className="text-amber-400" />
              <span>{site.phone}</span>
            </span>
            <span className="utility-item hidden xl:inline-flex">
              <Mail size={13} className="text-amber-400" />
              <span>{site.email}</span>
            </span>
            <span className="code-badge">{site.counselingCode}</span>
          </div>

          <div className="top-utility-right">
            <Link to="/admissions" className="utility-link font-semibold text-amber-300">
              Admissions
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/academics" className="utility-link">
              Exam Cell
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/contact" className="utility-link font-medium">
              Contact Desk
            </Link>
          </div>
        </div>
      </div>

      {/* 2A. Dedicated Mobile & Tablet Header (< 1024px: 320px to 834px) */}
      <div className="lg:hidden mobile-header-bar bg-white border-b border-slate-200">
        <div className="college-container">
          <div className="flex items-center justify-between gap-2 py-2 w-full">
            {/* LEFT: PK Logo/Mark + Title */}
            <Link
              to="/"
              className="flex items-center gap-2 min-w-0 flex-1 no-underline"
              aria-label={`${site.name} Home`}
            >
              <CollegeCrest className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-[#0b224d] font-black text-[11px] min-[360px]:text-[12px] leading-tight tracking-tight uppercase truncate">
                  PK COLLEGE OF ENGINEERING &amp;
                </span>
                <span className="block text-[#991b1b] font-black text-[11px] min-[360px]:text-[12px] leading-tight tracking-tight uppercase">
                  TECHNOLOGY
                </span>
              </div>
            </Link>

            {/* RIGHT: Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shrink-0 shadow-xs hover:bg-slate-50 transition-colors"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} className="text-[#991b1b]" /> : <Menu size={20} className="min-[360px]:w-[22px] min-[360px]:h-[22px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2B. Dedicated Desktop Header (>= 1024px) */}
      <div className="hidden lg:block desktop-college-header bg-white border-b border-slate-200">
        <div className="college-container">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Logo + Full College Name + Affiliations Subtitle */}
            <Link
              to="/"
              className="flex items-center gap-3.5 min-w-0 flex-1 no-underline group"
              aria-label={`${site.name} Home`}
            >
              <CollegeCrest className="w-14 h-14 flex-shrink-0 transition-transform group-hover:scale-105" />
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-extrabold text-[20px] xl:text-[23px] text-[#0b224d] uppercase leading-[1.2] tracking-tight">
                  {site.name}
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide truncate mt-0.5">
                  {site.affiliations}
                </span>
              </div>
            </Link>

            {/* Desktop Actions: Admissions Helpdesk Desk + Apply Now Button */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="desktop-contact-box text-right pr-4 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Admissions Helpdesk
                </span>
                <a
                  href={`tel:${site.admissionsPhone}`}
                  className="text-xs font-extrabold text-[#0b224d] hover:text-[#991b1b] transition-colors"
                >
                  {site.admissionsPhone}
                </a>
              </div>

              <Link
                to="/admissions"
                className="inline-flex items-center gap-1.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition-colors hover:shadow active:scale-95"
              >
                <GraduationCap size={15} />
                <span>Apply Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Desktop lg+) */}
      <nav className="college-navbar hidden lg:block" aria-label="Main college navigation">
        <div className="college-container">
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="nav-item"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`nav-link ${pathname === item.href ? "active" : ""}`}
                >
                  <span>{item.label}</span>
                  {item.dropdown && <ChevronDown size={14} className="opacity-80" />}
                </Link>

                {item.dropdown && openDropdown === item.label && (
                  <div className="nav-dropdown animate-in fade-in slide-in-from-top-1 duration-150">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="dropdown-link"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 4. Live Right-to-Left Continuous Announcement Marquee Ticker (Smooth, No Jumps, Pause on Hover) */}
      {announcements.length > 0 && (
        <div
          className="announcement-ticker-bar bg-slate-100/95 border-b border-slate-200/90 py-1 sm:py-1.5 overflow-hidden w-full select-none"
          role="region"
          aria-label="Latest College Announcements"
        >
          <div className="college-container flex items-center gap-2 sm:gap-3 w-full">
            {/* Ticker Indicator Badge matching screenshot */}
            <div className="inline-flex items-center gap-1.5 bg-[#b91c1c] text-white text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded flex-shrink-0 tracking-wider shadow-xs z-10">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Latest News</span>
            </div>

            {/* Seamless Infinite Continuous Marquee (Translate 0% to -50%) */}
            <div className="ticker-marquee-container flex-1 min-w-0 overflow-hidden relative">
              <div className="ticker-marquee-track">
                {/* 2 Identical tracks for seamless infinite looping */}
                {[0, 1].map((copyIndex) => (
                  <div
                    key={copyIndex}
                    className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10"
                    aria-hidden={copyIndex === 1}
                  >
                    {announcements.map((ann, idx) => (
                      <Link
                        key={`${copyIndex}-${ann.id || idx}`}
                        to="/announcements"
                        className="inline-flex items-center gap-2 text-xs sm:text-[13px] text-slate-800 hover:text-[#0b224d] font-medium transition-colors group whitespace-nowrap"
                      >
                        {ann.isUrgent ? (
                          <span className="text-[9px] font-black uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 tracking-wider">
                            Urgent
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded tracking-wider">
                            {ann.category || "Notice"}
                          </span>
                        )}
                        <span className="group-hover:underline text-slate-900 font-semibold">
                          {ann.title}
                        </span>
                        <span className="text-slate-400 font-normal text-[11px]">
                          ({ann.date})
                        </span>
                        <span className="text-amber-500 font-bold ml-1">✦</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* View All Announcements Link (Desktop & Tablet) */}
            <Link
              to="/announcements"
              className="hidden sm:inline-flex text-[11px] font-bold text-[#0b224d] hover:text-[#991b1b] items-center gap-1 flex-shrink-0 whitespace-nowrap pl-2 border-l border-slate-200 z-10"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* 5. Mobile Navigation Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#07172f]/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container (width: min(100vw, 400px), height: 100dvh) */}
          <div
            className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[400px] bg-white shadow-2xl flex flex-col box-border overflow-hidden animate-in slide-in-from-right duration-300"
            style={{ width: "min(100vw, 400px)" }}
          >
            {/* Fixed Drawer Header: LOGO + COLLEGE NAME + CLOSE BUTTON */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 bg-white shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2.5 min-w-0 flex-1 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                <CollegeCrest className="w-8 h-8 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[#0b224d] font-black text-[11px] min-[360px]:text-xs leading-tight uppercase tracking-tight truncate">
                    PK College of Engineering &amp;
                  </span>
                  <span className="block text-[#991b1b] font-black text-[11px] min-[360px]:text-xs leading-tight uppercase tracking-tight">
                    Technology
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 ml-2"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Navigation Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-3 space-y-3 min-h-0">
              {/* Admissions CTA */}
              <Link
                to="/admissions"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-xs transition-colors py-2.5 px-3"
                onClick={() => setMobileOpen(false)}
              >
                <GraduationCap size={16} className="shrink-0" />
                <span>Admissions 2026–27</span>
              </Link>

              {/* Navigation Items (15px font size, medium/semibold, subtle separators) */}
              <nav className="flex flex-col divide-y divide-slate-100 border-y border-slate-100" aria-label="Mobile Navigation Links">
                {navItems.map((item) => (
                  <div key={item.label} className="py-0.5">
                    {item.dropdown ? (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedSection(
                              mobileExpandedSection === item.label ? null : item.label,
                            )
                          }
                          className="w-full min-h-[44px] flex items-center justify-between text-left font-semibold text-slate-800 text-[15px] py-2.5 px-1 hover:text-[#0b224d] transition-colors"
                          aria-expanded={mobileExpandedSection === item.label}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${
                              mobileExpandedSection === item.label ? "rotate-180 text-amber-600" : ""
                            }`}
                          />
                        </button>
                        {mobileExpandedSection === item.label && (
                          <div className="pl-3 mb-2 space-y-0.5 border-l-2 border-amber-500 py-1 bg-slate-50/70 rounded-r">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                className="block min-h-[40px] flex items-center text-[13px] font-medium text-slate-700 hover:text-[#0b224d] hover:bg-white px-2 py-1.5 rounded transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="block min-h-[44px] flex items-center font-semibold text-slate-800 text-[15px] py-2.5 px-1 hover:text-[#0b224d] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Institutional Desk Card (Clean information panel, fully responsive, zero clipping) */}
              <div className="mt-4 mb-2 p-3 sm:p-3.5 bg-white border border-[#0b224d]/15 rounded-lg shadow-xs w-full max-w-full box-border">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                    <span className="font-extrabold uppercase text-[10px] tracking-wider text-[#0b224d]">
                      Institutional Desk
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80 shrink-0">
                    PKEC–2026
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Phone size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <a
                      href={`tel:${site.phone}`}
                      className="font-semibold text-slate-800 hover:text-amber-600 transition-colors break-words leading-tight"
                    >
                      {site.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${site.email}`}
                      className="font-semibold text-slate-800 hover:text-amber-600 transition-colors break-all leading-tight"
                    >
                      {site.email}
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-snug break-words">
                      {site.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
