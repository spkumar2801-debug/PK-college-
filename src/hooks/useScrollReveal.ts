import { useEffect } from "react";

/**
 * Initializes IntersectionObserver to apply scroll entrance reveals
 * to elements marked with data-reveal.
 * Automatically respects prefers-reduced-motion.
 * Safely reveals elements as they enter the viewport and ensures
 * elements already in view on mount are revealed immediately.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("revealed");
      });
      return undefined;
    }

    // Reveal elements currently inside or scrolled past the viewport
    const revealInView = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight - 20) {
          el.classList.add("revealed");
        }
      });
    };

    // Immediate check on initial mount for above-the-fold elements
    revealInView();

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -25px 0px",
          threshold: [0, 0.05, 0.1],
        },
      );

      const observePending = () => {
        if (!observer) return;
        const activeObs = observer;
        const elements = document.querySelectorAll("[data-reveal]:not(.revealed)");
        elements.forEach((el) => activeObs.observe(el));
      };

      observePending();

      // Listen for DOM changes when Firebase data loads or components re-render
      const mutationObserver = new MutationObserver(() => {
        observePending();
        revealInView();
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });

      // Fast-scroll safety check: if user scrolls rapidly
      let scrollTimer: ReturnType<typeof setTimeout>;
      const onScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(revealInView, 60);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        observer?.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        clearTimeout(scrollTimer);
      };
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("revealed");
      });
      return undefined;
    }
  }, []);
}
