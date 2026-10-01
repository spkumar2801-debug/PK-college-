import { useState, useEffect, useRef, type ReactNode } from "react";
import { CollegeCrest } from "@/components/site/CollegeCrest";

interface RouteTransitionProps {
  children: ReactNode;
  pathname: string;
}

// Global scroll prevention handler for wheel and touchmove
function preventScroll(e: Event) {
  e.preventDefault();
}

/**
 * Premium Institutional Route Transition & Page Reveal
 * for PK College of Engineering & Technology.
 *
 * Guarantees:
 * 1. Independent Client Timers: Normal dismissal at ~850ms.
 * 2. Absolute Failsafe: Hard JS failsafes at 1400ms and 1500ms.
 * 3. Immediate Scroll Lock: body and html overflow hidden + wheel/touch prevention while visible.
 * 4. Zero Data Coupling: Completely decoupled from Firestore, Firebase Auth, Cloudinary, CMS, or media.
 */
export function RouteTransition({ children, pathname }: RouteTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(30);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Restores all scroll, pointer-events, and hides the overlay completely
  const forceHideTransition = () => {
    setIsVisible(false);
    setProgress(100);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (failsafeRef.current) {
      clearTimeout(failsafeRef.current);
      failsafeRef.current = null;
    }

    if (typeof document !== "undefined") {
      try {
        // Direct DOM failsafe: guarantees immediate dismissal regardless of React queue
        const overlay = document.getElementById("pk-page-transition-overlay");
        if (overlay) {
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";
          overlay.style.opacity = "0";
        }
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.removeProperty("overflow");
        document.documentElement.style.removeProperty("overflow");
        document.body.style.removeProperty("pointer-events");
      } catch {
        // Safe fallback
      }
    }

    if (typeof window !== "undefined") {
      try {
        window.removeEventListener("wheel", preventScroll, { capture: true });
        window.removeEventListener("touchmove", preventScroll, { capture: true });
      } catch {
        // Safe fallback
      }
    }
  };

  // Locks scrolling and prepares overlay
  const lockScroll = () => {
    if (typeof document !== "undefined") {
      try {
        const overlay = document.getElementById("pk-page-transition-overlay");
        if (overlay) {
          overlay.style.display = "";
          overlay.style.pointerEvents = "";
          overlay.style.opacity = "";
        }
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } catch {
        // Safe fallback
      }
    }
    if (typeof window !== "undefined") {
      try {
        window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
        window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
      } catch {
        // Safe fallback
      }
    }
  };

  // 1. INITIAL MOUNT / FIRST PAGE LOAD / REFRESH
  useEffect(() => {
    lockScroll();
    setIsVisible(true);
    setProgress(35);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = prefersReducedMotion ? 200 : 850;

    const p1 = setTimeout(() => setProgress(75), duration * 0.35);
    const p2 = setTimeout(() => setProgress(95), duration * 0.7);

    // Normal hide timer (~850ms)
    timerRef.current = setTimeout(() => {
      forceHideTransition();
    }, duration);

    // Hard failsafe at 1400ms max (less than 1.5s)
    failsafeRef.current = setTimeout(() => {
      forceHideTransition();
    }, 1400);

    // Absolute fallback failsafe at 1500ms
    const absoluteFailsafe = setTimeout(() => {
      forceHideTransition();
    }, 1500);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(absoluteFailsafe);
      forceHideTransition();
    };
  }, []);

  // 2. INTERNAL ROUTE CHANGE (handles router navigation & Back/Forward)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    lockScroll();
    setIsVisible(true);
    setProgress(35);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = prefersReducedMotion ? 200 : 750;

    const p = setTimeout(() => setProgress(90), duration * 0.5);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      forceHideTransition();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, duration);

    if (failsafeRef.current) clearTimeout(failsafeRef.current);
    failsafeRef.current = setTimeout(() => {
      forceHideTransition();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 1400);

    return () => {
      clearTimeout(p);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
    };
  }, [pathname]);

  // 3. GLOBAL LINK CLICK INTERCEPTOR
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        anchor.target === "_blank" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.hasAttribute("download") ||
        href.startsWith("/admin")
      ) {
        return;
      }

      const currentPath = window.location.pathname;
      if (href === currentPath || href === `${currentPath}/`) return;

      lockScroll();
      setIsVisible(true);
      setProgress(40);
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  return (
    <>
      {/* 1. Top Slim High-Precision Progress Bar */}
      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 h-[3px] z-[999999] pointer-events-none transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#0b224d] via-[#d97706] to-[#f59e0b] shadow-[0_0_8px_rgba(217,119,6,0.6)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress >= 90 ? "120ms" : "200ms",
          }}
        />
      </div>

      {/* 2. Premium PK College Overlay with Backdrop Blur & Dim */}
      <div
        id="pk-page-transition-overlay"
        aria-hidden="true"
        className={`fixed inset-0 z-[999998] flex items-center justify-center bg-[#07172f]/45 backdrop-blur-sm select-none transition-all ease-out duration-200 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-[290px] w-full mx-4 transition-all duration-200 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Institutional Crest with subtle soft pulse */}
          <div className="relative flex items-center justify-center mb-3">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
            <CollegeCrest className="w-13 h-13 sm:w-14 sm:h-14 relative z-10" />
          </div>

          {/* College Identity */}
          <h2 className="text-xs font-black uppercase tracking-wider text-[#0b224d] text-center leading-tight">
            PK College of Engineering & Technology
          </h2>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">
            Academic Portal
          </span>

          {/* Micro Progress Bar inside Badge */}
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-3.5">
            <div
              className="h-full bg-gradient-to-r from-[#0b224d] via-[#d97706] to-[#f59e0b] rounded-full transition-all ease-out"
              style={{
                width: `${progress}%`,
                transitionDuration: progress >= 90 ? "120ms" : "180ms",
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Destination Page Content (Always in DOM and visible) */}
      <div className="route-transition-content w-full min-w-0 max-w-full">
        {children}
      </div>
    </>
  );
}
