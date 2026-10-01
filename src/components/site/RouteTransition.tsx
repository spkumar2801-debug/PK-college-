import { useState, useEffect, useRef, type ReactNode } from "react";
import { CollegeCrest } from "@/components/site/CollegeCrest";
import { useCollegeStore } from "@/lib/college-store";

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
 * Core Guarantees:
 * 1. Absolute Failsafe: Overlay is unconditionally removed within 1400ms under any circumstance.
 * 2. Visual-Only: Never awaits Firestore, Cloudinary, images, videos, Auth, or CMS data.
 * 3. Robust Scroll Lock: Immediately locks body and html scrolling without layout jump.
 * 4. Automatic Cleanup: Cleans up all DOM styles, listeners, and timers on exit or unmount.
 * 5. Single Transition Instance: Prevents rapid-click stacking and timer conflicts.
 */
export function RouteTransition({ children, pathname }: RouteTransitionProps) {
  const store = useCollegeStore();
  const site = store?.siteSettings;

  // Visibility and progress state
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(25);

  // References to guarantee independent cleanup and failsafe
  const isTransitioningRef = useRef(true);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMountRef = useRef(true);
  const lastPathnameRef = useRef<string>(pathname);

  // Unconditional force-hide and cleanup function
  const forceHideTransition = () => {
    isTransitioningRef.current = false;
    setIsVisible(false);
    setProgress(100);

    // Clear all timers
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current);
      failsafeTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Restore html & body scroll styles
    if (typeof document !== "undefined") {
      try {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      } catch {
        // Safe fallback
      }
    }

    // Remove wheel and touch scroll blockers
    if (typeof window !== "undefined") {
      try {
        window.removeEventListener("wheel", preventScroll, { capture: true });
        window.removeEventListener("touchmove", preventScroll, { capture: true });
      } catch {
        // Safe fallback
      }
    }
  };

  // Start the visual transition
  const startTransition = (durationMs = 850) => {
    // If already transitioning, don't interrupt the active exit timer
    if (isTransitioningRef.current && !isFirstMountRef.current) return;
    isTransitioningRef.current = true;

    if (typeof window === "undefined") return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = prefersReducedMotion ? 200 : durationMs;

    // 1. Lock body & html scrolling immediately
    try {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
      window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    } catch {
      // Safe fallback
    }

    // 2. Show overlay
    setIsVisible(true);
    setProgress(prefersReducedMotion ? 100 : 25);

    // 3. Decorative progress animation
    if (!prefersReducedMotion) {
      let currentProgress = 25;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        currentProgress += 18;
        if (currentProgress >= 95) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          currentProgress = 95;
        }
        setProgress(currentProgress);
      }, duration / 5);
    }

    // 4. Normal exit timer (700-1000ms)
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    finishTimeoutRef.current = setTimeout(() => {
      forceHideTransition();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, duration);

    // 5. ABSOLUTE HARD FAILSAFE: Unconditionally force-hide at 1400ms max (less than 1.5s)
    if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
    failsafeTimeoutRef.current = setTimeout(() => {
      forceHideTransition();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 1400);
  };

  // INITIAL MOUNT / PAGE LOAD / REFRESH
  useEffect(() => {
    // Trigger the initial load transition for ~850ms on first mount
    startTransition(850);

    return () => {
      forceHideTransition();
    };
  }, []);

  // Global click interceptor for internal navigation links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, mailto, tel, downloads, target="_blank", anchors, or admin
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

      // If clicking the current path, ignore
      const currentPath = window.location.pathname;
      if (href === currentPath || href === `${currentPath}/`) return;

      // Trigger transition immediately on click
      const isMobile = window.innerWidth < 640;
      startTransition(isMobile ? 950 : 800);
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // Route change listener (handles browser Back/Forward and router navigation)
  useEffect(() => {
    if (isFirstMountRef.current) {
      // Handled by initial mount effect
      isFirstMountRef.current = false;
      lastPathnameRef.current = pathname;
      return;
    }

    if (lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      // If not already active from click, start transition (e.g. Back/Forward)
      if (!isTransitioningRef.current) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
        startTransition(isMobile ? 950 : 800);
      }
    }
  }, [pathname]);

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
            transitionDuration: progress >= 95 ? "120ms" : "200ms",
          }}
        />
      </div>

      {/* 2. Premium PK College Overlay with Backdrop Blur & Dim */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[999998] flex items-center justify-center bg-[#07172f]/45 backdrop-blur-sm select-none transition-all ease-out ${
          isVisible
            ? "opacity-100 pointer-events-auto duration-150"
            : "opacity-0 pointer-events-none duration-250"
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
            {site?.name || "PK College of Engineering & Technology"}
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
                transitionDuration: progress >= 95 ? "120ms" : "180ms",
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

