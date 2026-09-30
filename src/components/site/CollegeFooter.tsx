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
    <footer className="college-main-footer">
      {/* Upper Main Footer Grid */}
      <div className="college-container">
        <div className="footer-top-grid">
          {/* Column 1: College Identity & Overview */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CollegeCrest className="w-12 h-12 flex-shrink-0" variant="dark" />
              <div>
                <h3 className="text-white font-extrabold text-base leading-tight uppercase">
                  {site.name}
                </h3>
                <p className="text-amber-400 text-xs font-semibold mt-0.5">
                  Knowledge · Innovation · Excellence
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              An institution dedicated to disciplined technical education, comprehensive laboratory practice, and ethical engineering leadership.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="footer-contact-item">
                <MapPin size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{site.address}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200">{site.phone}</span>
                  <span className="block text-slate-400 text-[11px]">Admissions: {site.admissionsPhone}</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <Mail size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200">{site.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Academic Departments */}
          <div>
            <h4 className="footer-col-title">B.Tech Departments</h4>
            <ul className="footer-links-list">
              {departments.map((dept) => (
                <li key={dept.code}>
                  <Link
                    to="/departments"
                    search={{ dept: dept.slug }}
                    className="flex items-center gap-1.5"
                  >
                    <ChevronRight size={13} className="text-amber-500" />
                    <span>{dept.shortTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/about" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>About the College</span>
                </Link>
              </li>
              <li>
                <Link to="/principal-message" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Principal's Message</span>
                </Link>
              </li>
              <li>
                <Link to="/vision-mission" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Vision & Mission</span>
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Admissions & Eligibility</span>
                </Link>
              </li>
              <li>
                <Link to="/placements" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Training & Placements</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Campus Facilities</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-amber-500" />
                  <span>Contact & Location</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Statutory Committees & Working Hours */}
          <div>
            <h4 className="footer-col-title">Statutory Cells</h4>
            <div className="space-y-1.5 text-xs text-slate-300 mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Anti-Ragging Committee (Zero Tolerance)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Internal Quality Assurance Cell (IQAC)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Women Grievance Redressal Cell</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>SC/ST & Minority Advisory Cell</span>
              </div>
            </div>

            <h4 className="footer-col-title">Campus Timings</h4>
            <div className="text-xs text-slate-300 flex items-start gap-2">
              <Clock size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{site.workingHours}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Closed on Sundays & Declared Public Holidays</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Lock size={12} />
                <span>Authorized Administrative Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="footer-bottom-bar">
        <div className="college-container footer-bottom-inner">
          <div>
            <span>© {currentYear} {site.name}. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            <span>Counseling Code: <strong>{site.code}</strong></span>
            <span>·</span>
            <span>Affiliations: <strong>AICTE Approved</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
