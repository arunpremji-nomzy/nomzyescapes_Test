import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, BedDouble, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";

const supabase = supabaseTyped as unknown as { from: (t: string) => any };

export const Route = createFileRoute("/properties/$id")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("properties")
      .select("id,name,description,image_url,destination")
      .eq("id", params.id)
      .eq("status", "published")
      .maybeSingle();
    return { property: data as { id: string; name: string; description: string | null; image_url: string | null; destination: string | null } | null };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.property;
    const name = p?.name ?? "Workation Stay";
    const title = `Stay at ${name} — Nomzy Escapes`;
    const baseDesc = p?.description?.trim();
    const fallbackDesc = `Book ${name}${p?.destination ? ` in ${p.destination}` : ""} — a curated Nomzy Escapes workation home with verified WiFi, dedicated workspace, and local support.`;
    const description = baseDesc && baseDesc.length >= 50 ? baseDesc.slice(0, 300) : fallbackDesc;
    const url = `https://kerala-escape-co.lovable.app/properties/${params.id}`;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "product" },
    ];
    if (p?.image_url) {
      meta.push({ property: "og:image", content: p.image_url });
      meta.push({ name: "twitter:image", content: p.image_url });
    }
    const scripts = p
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: description,
            image: p.image_url ?? undefined,
            url,
          }),
        }]
      : [];
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: PropertyDetail,
});

type GalleryItem = { url: string; caption?: string; alt?: string };
type Property = {
  id: string;
  name: string;
  destination: string | null;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  gallery: GalleryItem[] | null;
  amenities: string[] | null;
  bedrooms: number | null;
  guests: number | null;
};

function PropertyDetail() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("properties").select("*").eq("id", id).eq("status", "published").maybeSingle();
      setP(data as Property | null);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (!p) return;
      const gallery = resolveGallery(p);
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, p]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error("Name and email are required");
    }
    if (form.name.length > 100 || form.email.length > 255 || form.message.length > 1000) {
      return toast.error("Input too long");
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      source: "property",
      destination: p?.name ?? null,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Inquiry sent");
  };

  if (loading) {
    return <section className="min-h-screen pt-32 container-editorial"><p className="text-muted-foreground">Loading…</p></section>;
  }
  if (!p) {
    return (
      <section className="min-h-screen pt-32 container-editorial">
        <p className="text-muted-foreground">Property not found.</p>
        <Link to="/properties" className="mt-4 inline-flex items-center gap-2 text-sm underline"><ArrowLeft size={14} /> Back to properties</Link>
      </section>
    );
  }

  const gallery = resolveGallery(p);

  return (
    <section className="min-h-screen bg-background pt-28 pb-20">
      <div className="container-editorial">
        <Link to="/properties" className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> All properties
        </Link>

        {gallery.length > 0 && (
          <div className="mt-8 grid gap-3">
            <figure>
              <button type="button" onClick={() => setLightbox(0)} className="block w-full overflow-hidden group">
                <img src={gallery[0].url} alt={gallery[0].alt || p.name} className="w-full aspect-[16/9] object-cover transition-transform group-hover:scale-[1.01]" />
              </button>
              {gallery[0].caption && (
                <figcaption className="mt-2 text-xs text-muted-foreground">{gallery[0].caption}</figcaption>
              )}
            </figure>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {gallery.slice(1).map((item, i) => (
                  <figure key={`${item.url}-${i}`}>
                    <button type="button" onClick={() => setLightbox(i + 1)} className="block w-full overflow-hidden group">
                      <img src={item.url} alt={item.alt || `${p.name} — photo ${i + 2}`} className="w-full aspect-square object-cover transition-transform group-hover:scale-[1.02]" />
                    </button>
                    {item.caption && (
                      <figcaption className="mt-1 text-[10px] tracking-[0.12em] uppercase text-muted-foreground line-clamp-2">{item.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h1 className="font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">{p.name}</h1>
            {p.destination && (
              <p className="mt-3 inline-flex items-center gap-1 text-xs tracking-[0.18em] uppercase text-muted-foreground">
                <MapPin size={12} /> {p.destination}
              </p>
            )}
            {p.description && <p className="mt-6 text-foreground/80 leading-relaxed whitespace-pre-line">{p.description}</p>}

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              {p.bedrooms != null && <span className="inline-flex items-center gap-2"><BedDouble size={14} /> {p.bedrooms} bedrooms</span>}
              {p.guests != null && <span className="inline-flex items-center gap-2"><Users size={14} /> {p.guests} guests</span>}
            </div>

            {p.amenities && p.amenities.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <p className="eyebrow text-muted-foreground mb-4">Amenities</p>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {p.amenities.map((a) => <li key={a}>· {a}</li>)}
                </ul>
              </div>
            )}
          </div>

          <aside className="border border-border p-6 h-fit md:sticky md:top-28">
            <p className="eyebrow text-muted-foreground">Inquire</p>
            <h2 className="mt-3 font-display font-light text-2xl tracking-[-0.02em]">Request this stay</h2>

            {sent ? (
              <p className="mt-6 text-sm text-muted-foreground">Thank you — your concierge will be in touch shortly.</p>
            ) : (
              <form onSubmit={submit} className="mt-6 grid gap-4">
                <input className="h-11 px-3 border border-border bg-background text-sm" placeholder="Your name" maxLength={100} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="email" className="h-11 px-3 border border-border bg-background text-sm" placeholder="Email" maxLength={255} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="h-11 px-3 border border-border bg-background text-sm" placeholder="Phone / WhatsApp (optional)" maxLength={32} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <textarea className="min-h-[110px] p-3 border border-border bg-background text-sm" placeholder="Dates, guests, anything we should know…" maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <button type="submit" disabled={submitting} className="h-11 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase disabled:opacity-60">
                  {submitting ? "Sending…" : "Send inquiry"}
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>

      {lightbox !== null && gallery[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <figure className="max-h-full max-w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lightbox].url} alt={gallery[lightbox].alt || p.name} className="max-h-[85vh] max-w-full object-contain" />
            {gallery[lightbox].caption && (
              <figcaption className="text-sm text-white/85 text-center max-w-2xl">{gallery[lightbox].caption}</figcaption>
            )}
          </figure>
          <button type="button" onClick={() => setLightbox(null)} className="absolute top-4 right-4 h-10 w-10 inline-flex items-center justify-center bg-white/10 text-white hover:bg-white/20" aria-label="Close">✕</button>
          {gallery.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length)); }} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center bg-white/10 text-white hover:bg-white/20" aria-label="Previous">‹</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length)); }} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center bg-white/10 text-white hover:bg-white/20" aria-label="Next">›</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function resolveGallery(p: Property): GalleryItem[] {
  if (p.gallery && Array.isArray(p.gallery) && p.gallery.length > 0) {
    return p.gallery.filter((g) => g && g.url);
  }
  if (p.images && p.images.length > 0) {
    return p.images.map((url) => ({ url, caption: "", alt: "" }));
  }
  if (p.image_url) return [{ url: p.image_url, caption: "", alt: "" }];
  return [];
}
