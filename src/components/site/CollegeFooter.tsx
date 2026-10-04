import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Lock,
} from "lucide-react";
import { departments } from "@/data/site";
import { CollegeCrest } from "@/components/site/CollegeCrest";
import { useCollegeStore } from "@/lib/college-store";

export function CollegeFooter() {
  const currentYear = new Date().getFullYear();
  const { siteSettings, departments } = useCollegeStore();
  const site = siteSettings;

  return (
    <footer className="college-main-footer" role="contentinfo">
      {/* Upper Main Footer Grid */}
      <div className="college-container">
        <div className="footer-top-grid">
          {/* Column 1: College Identity & Overview */}
          <div className="w-full min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <CollegeCrest className="w-10 h-10 flex-shrink-0" variant="dark" />
              <div className="min-w-0">
                <h3 className="text-white font-extrabold text-sm sm:text-base leading-tight uppercase tracking-tight break-words">
                  {site.name}
                </h3>
                <p className="text-amber-400 text-xs font-semibold mt-0.5">
                  Knowledge · Innovation · Excellence
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed mb-4 max-w-sm break-words">
              An institution dedicated to disciplined technical education, comprehensive laboratory practice, and ethical engineering leadership.
            </p>

            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>AICTE Approved · Conferred Autonomy</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="w-full min-w-0">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/admissions" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Admissions &amp; Eligibility</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Engineering Departments</span>
                </Link>
              </li>
              <li>
                <Link to="/placements" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Training &amp; Placements</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Campus Facilities</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Campus Events</span>
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Circulars &amp; Notices</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academics & Programs */}
          <div className="w-full min-w-0">
            <h4 className="footer-col-title">Academics</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/academics" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>B.Tech Degree Programs</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" search={{ dept: "cse" }} className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Computer Science (CSE)</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" search={{ dept: "ai-ds" }} className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>AI &amp; Data Science</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" search={{ dept: "aiml" }} className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>AI &amp; Machine Learning</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" search={{ dept: "ece" }} className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Electronics &amp; Comm. (ECE)</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" search={{ dept: "eee" }} className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>Electrical &amp; Electronics</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500 shrink-0" />
                  <span>About the College</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus Desk */}
          <div className="w-full min-w-0">
            <h4 className="footer-col-title">Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="footer-contact-item">
                <Phone size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <a href={`tel:${site.phone}`} className="text-slate-200 hover:text-amber-400 font-semibold block break-words transition-colors">
                    {site.phone}
                  </a>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    Admissions: {site.admissionsPhone}
                  </span>
                </div>
              </div>

              <div className="footer-contact-item">
                <Mail size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${site.email}`} className="text-slate-200 hover:text-amber-400 font-semibold break-all transition-colors min-w-0 flex-1">
                  {site.email}
                </a>
              </div>

              <div className="footer-contact-item">
                <MapPin size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 break-words min-w-0 flex-1 leading-snug">
                  {site.location || site.address}
                </span>
              </div>

              <div className="footer-contact-item">
                <Clock size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-slate-200 block font-medium">{site.workingHours}</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">Closed on Declared Holidays</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/80">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <Lock size={12} />
                  <span>Authorized Administrative Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="footer-bottom-bar">
        <div className="college-container footer-bottom-inner">
          <div className="text-xs text-slate-400 break-words">
            <span>© {currentYear} {site.name}. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap justify-center sm:justify-end">
            <span>Counseling Code: <strong className="text-amber-400 font-mono">{site.code}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Affiliation: <strong className="text-slate-200">AICTE Approved</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
