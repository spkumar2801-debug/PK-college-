import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut, ExternalLink, Shield, ArrowLeft, User } from "lucide-react";
import { CollegeCrest } from "@/components/site/CollegeCrest";

interface AdminHeaderProps {
  onToggleSidebar?: (() => void) | undefined;
  sidebarOpen?: boolean | undefined;
  currentUserEmail?: string | undefined;
  onLogout?: (() => void) | undefined;
  isAuthenticated?: boolean | undefined;
  activeTabTitle?: string | undefined;
}

export function AdminHeader({
  onToggleSidebar,
  sidebarOpen,
  currentUserEmail,
  onLogout,
  isAuthenticated = false,
  activeTabTitle,
}: AdminHeaderProps) {
  return (
    <header className="w-full bg-[#07172f] text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
        {/* Brand: Logo + Admin Portal Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <CollegeCrest className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 transition-transform group-hover:scale-105" />
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white uppercase truncate flex items-center gap-1.5">
                <span className="hidden sm:inline">PK College</span>
                <span className="text-amber-400">Admin Portal</span>
                <Shield size={13} className="text-amber-400 hidden xs:inline" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block truncate">
                Institutional Management & Content Control System
              </span>
            </div>
          </Link>

          {activeTabTitle && (
            <div className="hidden lg:flex items-center gap-1 pl-3 border-l border-slate-700 text-xs text-slate-300">
              <span className="text-slate-500 font-mono">/</span>
              <span className="font-semibold text-amber-300">{activeTabTitle}</span>
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Public Website Preview Link */}
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors font-medium"
                title="Open Public Website in new tab"
              >
                <ExternalLink size={13} />
                <span>Live Website</span>
              </Link>

              {/* Logged in User Badge (Desktop) */}
              <div className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-200 bg-slate-800/90 px-3 py-1 rounded border border-slate-700 font-mono">
                <User size={13} className="text-amber-400" />
                <span className="truncate max-w-[150px]">{currentUserEmail || "Admin User"}</span>
              </div>

              {/* Logout Button (Desktop/Tablet) */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-red-300 hover:text-red-200 px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 font-semibold transition-colors"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              )}

              {/* Mobile Sidebar Hamburger Button */}
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all"
                  aria-label={sidebarOpen ? "Close Admin navigation" : "Open Admin navigation"}
                  aria-expanded={sidebarOpen}
                >
                  {sidebarOpen ? <X size={20} className="text-amber-400" /> : <Menu size={20} />}
                </button>
              )}
            </>
          ) : (
            /* Non-authenticated (Login view) link back to public site */
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Public Website</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
