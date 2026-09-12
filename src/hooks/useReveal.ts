import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` class to elements with `.reveal` once they scroll into view.
 * Supports stagger via `data-reveal-delay="120"` (ms) and groups via `.reveal-stagger > *`.
 */
export function useReveal() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current ?? document;
    const nodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-stagger > *"
    );
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n, i) => {
      if (n.parentElement?.classList.contains("reveal-stagger")) {
        n.style.transitionDelay = `${i * 90}ms`;
      }
      io.observe(n);
    });

    return () => io.disconnect();
  }, []);

  return rootRef;
}
