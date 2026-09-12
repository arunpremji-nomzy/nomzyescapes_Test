import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, BedDouble, Users } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import {
  PropertyFilters,
  applyPropertyFilters,
  defaultFilters,
  type PropertyFilterValue,
  type StayLength,
} from "@/components/site/PropertyFilters";

const supabase = supabaseTyped as unknown as { from: (t: string) => any };

const searchSchema = z.object({
  location: fallback(z.string().optional(), undefined),
  budgetMax: fallback(z.number().optional(), undefined),
  wifi: fallback(z.boolean().optional(), undefined),
  workspace: fallback(z.boolean().optional(), undefined),
  stay: fallback(z.enum(["any", "short", "medium", "long"]).optional(), undefined),
});

export const Route = createFileRoute("/properties/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Workation Stays & Homes in Kerala — Nomzy Escapes" },
      { name: "description", content: "Browse hand-picked workation homes across Fort Kochi, Varkala, and Alleppey — verified WiFi, dedicated workspaces, and stays from a week to a season." },
      { property: "og:title", content: "Workation Stays & Homes in Kerala — Nomzy Escapes" },
      { property: "og:description", content: "Browse hand-picked workation homes across Fort Kochi, Varkala, and Alleppey — verified WiFi, dedicated workspaces, and stays from a week to a season." },
      { property: "og:url", content: "https://kerala-escape-co.lovable.app/properties" },
    ],
    links: [
      { rel: "canonical", href: "https://kerala-escape-co.lovable.app/properties" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Workation Stays & Homes in Kerala",
          url: "https://kerala-escape-co.lovable.app/properties",
        }),
      },
    ],
  }),
  component: PropertiesPage,
});

type Property = {
  id: string;
  name: string;
  destination: string | null;
  description: string | null;
  image_url: string | null;
  amenities: string[] | null;
  bedrooms: number | null;
  guests: number | null;
  price_per_night: number | null;
};

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setItems((data ?? []) as Property[]);
      setLoading(false);
    })();
  }, []);

  const locations = Array.from(
    new Set(items.map((p) => p.destination).filter((d): d is string => !!d))
  ).sort();

  const activeLocation = search.location ?? null;
  const byLocation = activeLocation
    ? items.filter((p) => p.destination === activeLocation)
    : items;

  const filterValue: PropertyFilterValue = {
    budgetMax: search.budgetMax ?? null,
    wifi: search.wifi ?? false,
    workspace: search.workspace ?? false,
    stay: (search.stay as StayLength | undefined) ?? "any",
  };
  const maxBudget = items.reduce((m, p) => Math.max(m, p.price_per_night ?? 0), 0);

  const filtered = applyPropertyFilters(byLocation, filterValue);

  const updateFilters = (next: PropertyFilterValue) => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({
        ...prev,
        budgetMax: next.budgetMax ?? undefined,
        wifi: next.wifi || undefined,
        workspace: next.workspace || undefined,
        stay: next.stay === "any" ? undefined : next.stay,
      }),
      replace: true,
    });
  };

  const setLocation = (loc: string | null) => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, location: loc ?? undefined }),
      replace: true,
    });
  };

  return (
    <section className="min-h-screen bg-background pt-32 pb-20">
      <div className="container-editorial">
        <p className="eyebrow text-muted-foreground">The Collection</p>
        <h1 className="mt-3 font-display font-light text-4xl md:text-6xl tracking-[-0.02em]">Properties</h1>
        <p className="mt-4 text-muted-foreground max-w-xl">Hand-picked workation homes — review, shortlist, and inquire.</p>

        {locations.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setLocation(null)}
              className={`inline-flex items-center gap-1 h-8 px-3 border text-[0.7rem] tracking-[0.18em] uppercase transition-colors ${
                activeLocation === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              All
            </button>
            {locations.map((loc) => (
              <Link
                key={loc}
                to="/locations/$slug"
                params={{ slug: slugify(loc) }}
                className="inline-flex items-center gap-1 h-8 px-3 border text-[0.7rem] tracking-[0.18em] uppercase transition-colors border-border text-muted-foreground hover:bg-muted"
              >
                <MapPin size={11} /> {loc}
              </Link>
            ))}
          </div>
        )}

        <PropertyFilters value={filterValue} onChange={updateFilters} maxBudget={maxBudget} />

        {loading ? (
          <p className="mt-16 text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">
            {activeLocation ? `No properties in ${activeLocation} matching these filters.` : "No properties match these filters."}
          </div>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <article key={p.id} className="group border border-border bg-background overflow-hidden flex flex-col">
                <Link to="/properties/$id" params={{ id: p.id }} className="block">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-muted" />
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Link to="/properties/$id" params={{ id: p.id }} className="block">
                    <h2 className="font-display font-light text-2xl tracking-[-0.02em]">{p.name}</h2>
                  </Link>
                  {p.destination && (
                    <Link
                      to="/locations/$slug"
                      params={{ slug: slugify(p.destination) }}
                      className="mt-2 inline-flex items-center gap-1 text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground self-start"
                    >
                      <MapPin size={12} /> {p.destination}
                    </Link>
                  )}
                  <Link to="/properties/$id" params={{ id: p.id }} className="block">
                    {p.description && <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{p.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {p.bedrooms != null && <span className="inline-flex items-center gap-1"><BedDouble size={13} /> {p.bedrooms} bd</span>}
                      {p.guests != null && <span className="inline-flex items-center gap-1"><Users size={13} /> {p.guests} guests</span>}
                    </div>
                  </Link>
                  <Link
                    to="/properties/$id"
                    params={{ id: p.id }}
                    className="mt-5 inline-flex items-center justify-center w-full h-10 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Book now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
