import { useEffect } from "react";

/**
 * Initializes IntersectionObserver to apply scroll entrance reveals
 * to elements marked with data-reveal.
 * Automatically respects prefers-reduced-motion.
 * Safely reveals elements as they enter the viewport and ensures
 * elements already in view on mount are revealed immediately.
 */
export function useScrollReveal(pathname?: string) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let onScroll: (() => void) | null = null;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    // Small delay ensures hydration is complete before observing
    const timer = setTimeout(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        document.querySelectorAll("[data-reveal]").forEach((el) => {
          el.classList.add("revealed");
        });
        return;
      }

      // Reveal elements currently inside or scrolled past the trigger threshold
      const revealInView = () => {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Trigger when element enters ~30-40px into viewport (10-20% of section)
          if (rect.top <= windowHeight - 30 && rect.bottom >= 0) {
            el.classList.add("revealed");
            observer?.unobserve(el);
          }
        });
      };

      revealInView();

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Animate only once - unobserve permanently
                obs.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -30px 0px", // Trigger when ~10-20% enters viewport
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

        // Listen for dynamically loaded CMS/Firebase elements
        mutationObserver = new MutationObserver(() => {
          observePending();
          revealInView();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // Scroll listener for fast scroll / fallback
        onScroll = () => {
          if (scrollTimer) clearTimeout(scrollTimer);
          scrollTimer = setTimeout(revealInView, 40);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        // Fallback for older browsers
        document.querySelectorAll("[data-reveal]").forEach((el) => {
          el.classList.add("revealed");
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [pathname]);
}
