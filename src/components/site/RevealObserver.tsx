import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Global scroll-reveal: observes any `.reveal` or `.reveal-stagger > *` in the
 * document and toggles `.is-visible` when they enter the viewport. Re-scans on
 * every route change.
 */
export function RevealObserver() {
  const location = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observe = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        ".reveal:not(.is-visible), .reveal-stagger > *:not(.is-visible)"
      );
      if (!nodes.length) return null;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delayAttr = el.dataset.revealDelay;
            if (delayAttr) el.style.transitionDelay = `${delayAttr}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px 10% 0px" }
      );

      nodes.forEach((n, i) => {
        if (
          n.parentElement?.classList.contains("reveal-stagger") &&
          !n.style.transitionDelay
        ) {
          n.style.transitionDelay = `${Math.min(i * 45, 240)}ms`;
        }
        io.observe(n);
      });
      return io;
    };

    const raf = requestAnimationFrame(() => {
      // defer one frame so newly mounted route content is in the DOM
    });
    const io = observe();

    // Safety net: after 1.2s, force-reveal anything the observer missed
    // (covers fast navigation, hydration races, and content already in view).
    const fallback = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(
          ".reveal:not(.is-visible), .reveal-stagger > *:not(.is-visible)"
        )
        .forEach((el) => el.classList.add("is-visible"));
    }, 1200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      io?.disconnect();
    };
  }, [location]);

  return null;
}
