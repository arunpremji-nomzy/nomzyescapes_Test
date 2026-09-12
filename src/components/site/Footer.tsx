import { Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";
import logoAsset from "@/assets/nomzy-logo.png.asset.json";

export function Footer() {
  const { data: s } = useSiteContent("settings");
  if (!s) return null;
  const waDigits = s.whatsapp.replace(/\D/g, "");

  return (
    <footer className="bg-primary text-primary-foreground mt-32">
      <div className="container-editorial py-20 grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <img src={logoAsset.url} alt={`${s.brand} ${s.brandSuffix}`} className="h-40 w-auto" />
          <p className="mt-6 max-w-sm text-sm text-primary-foreground/70 leading-relaxed">
            {s.footerTagline}
          </p>
        </div>

        <div>
          <div className="eyebrow text-primary-foreground/50 mb-4">Explore</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/destinations" className="hover:text-accent">Destinations</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-primary-foreground/50 mb-4">Popular</div>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li><Link to="/destinations/$slug" params={{ slug: "fort-kochi" }} className="hover:text-accent">Fort Kochi Workation</Link></li>
            <li><Link to="/destinations/$slug" params={{ slug: "varkala" }} className="hover:text-accent">Varkala Workation</Link></li>
            <li><Link to="/destinations/$slug" params={{ slug: "alleppey" }} className="hover:text-accent">Alleppey Workation</Link></li>
            <li><Link to="/destinations" className="hover:text-accent">Workation Kerala</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-primary-foreground/50 mb-4">Contact</div>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-accent">{s.phone}</a></li>
            <li><a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">WhatsApp Us</a></li>
            <li><a href={`mailto:${s.email}`} className="hover:text-accent">{s.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-editorial py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-primary-foreground/50">
          <span>© {new Date().getFullYear()} {s.brand} {s.brandSuffix} · Kochi, Kerala, India</span>
          <span>{s.footerCopyright}</span>
        </div>
      </div>
    </footer>
  );
}
