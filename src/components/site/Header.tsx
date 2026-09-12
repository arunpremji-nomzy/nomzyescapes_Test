import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/nomzy-logo.png";
import { useSiteContent } from "@/lib/site-content";

const baseNav = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/properties", label: "Properties" },
  { to: "/experiences", label: "Experiences" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: features } = useSiteContent("features");
  const propertiesEnabled = features?.propertiesEnabled ?? true;
  const nav = baseNav.filter((n) => propertiesEnabled || n.to !== "/properties");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On non-home pages the background is light, so always use the light/scrolled chrome.
  const onLight = scrolled || !isHome;

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-[5vw] pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto w-full max-w-[1400px] rounded-3xl transition-all duration-[350ms] ease-out ${
          onLight
            ? "bg-white/85 backdrop-blur-2xl border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            : "bg-white/10 backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-8 px-6 md:px-8 transition-all duration-[350ms] ease-out ${
            scrolled ? "h-[68px]" : "h-[80px]"
          }`}
        >
          <Link to="/" className="flex items-center shrink-0" aria-label="Nomzy Escapes home">
            <img
              src={logoAsset}
              alt="Nomzy Escapes"
              className={`h-auto transition-all duration-[350ms] ease-out ${
                scrolled
                  ? "w-[200px] md:w-[260px]"
                  : "w-[230px] md:w-[300px]"
              } ${
                onLight
                  ? "drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                  : "drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]"
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-[350ms] ${
                  onLight
                    ? "text-[#1f1f1f]/80 hover:text-[#1f1f1f] font-medium"
                    : "text-white/90 hover:text-white font-medium"
                }`}
                activeProps={{
                  className: `relative px-4 py-2 text-sm tracking-wide font-semibold ${
                    onLight ? "text-[#c9a84c]" : "text-white"
                  } after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:bg-[#c9a84c]`,
                }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center justify-center px-6 h-10 text-[0.7rem] tracking-[0.2em] uppercase font-semibold rounded-full bg-black text-white hover:bg-[#c9a84c] hover:text-black transition-all duration-[350ms]"
            >
              Plan My Stay
            </Link>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className={`md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
                onLight ? "text-[#1f1f1f] hover:bg-black/5" : "text-white hover:bg-white/10"
              }`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>




      {open && (
        <div className="pointer-events-auto md:hidden mt-2 mx-auto w-full max-w-[1400px] rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/30 shadow-[0_12px_40px_rgba(0,0,0,0.08)] animate-fade-up">
          <div className="px-6 py-5 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-display text-foreground border-b border-border/40 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center h-11 bg-black text-white text-xs tracking-[0.18em] uppercase font-semibold rounded-full"
            >
              Plan My Stay
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
