import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BedDouble, MapPin, Users } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import {
  PropertyFilters,
  applyPropertyFilters,
  type PropertyFilterValue,
  type StayLength,
} from "@/components/site/PropertyFilters";

const supabase = supabaseTyped as unknown as { from: (t: string) => any };

const searchSchema = z.object({
  budgetMax: fallback(z.number().optional(), undefined),
  wifi: fallback(z.boolean().optional(), undefined),
  workspace: fallback(z.boolean().optional(), undefined),
  stay: fallback(z.enum(["any", "short", "medium", "long"]).optional(), undefined),
});

export const Route = createFileRoute("/locations/$slug")({
  validateSearch: zodValidator(searchSchema),
  head: ({ params }) => {
    const pretty = decodeURIComponent(params.slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const title = `${pretty} stays — Nomzy Escapes`;
    const description = `Workation properties in ${pretty}, Kerala. Filter by budget, WiFi, workspace, and stay length.`;
    const canonical = `https://kerala-escape-co.lovable.app/locations/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: LocationPage,
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

function LocationPage() {
  const { slug } = Route.useParams();
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

  const matches = useMemo(
    () => items.filter((p) => p.destination && slugify(p.destination) === slug),
    [items, slug]
  );
  const displayName = matches[0]?.destination ?? decodeURIComponent(slug).replace(/-/g, " ");

  const filterValue: PropertyFilterValue = {
    budgetMax: search.budgetMax ?? null,
    wifi: search.wifi ?? false,
    workspace: search.workspace ?? false,
    stay: (search.stay as StayLength | undefined) ?? "any",
  };
  const maxBudget = matches.reduce((m, p) => Math.max(m, p.price_per_night ?? 0), 0);
  const filtered = applyPropertyFilters(matches, filterValue);

  const updateFilters = (next: PropertyFilterValue) => {
    navigate({
      search: () => ({
        budgetMax: next.budgetMax ?? undefined,
        wifi: next.wifi || undefined,
        workspace: next.workspace || undefined,
        stay: next.stay === "any" ? undefined : next.stay,
      }),
      replace: true,
    });
  };

  return (
    <section className="min-h-screen bg-background pt-32 pb-20">
      <div className="container-editorial">
        <Link to="/properties" className="inline-flex items-center gap-1 text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">
          <ArrowLeft size={12} /> All properties
        </Link>
        <p className="eyebrow text-muted-foreground mt-6 inline-flex items-center gap-1">
          <MapPin size={11} /> {displayName}, Kerala
        </p>
        <h1 className="mt-3 font-display font-light text-4xl md:text-6xl tracking-[-0.02em]">
          Stays in {displayName}
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          {matches.length} curated workation {matches.length === 1 ? "home" : "homes"} in {displayName}. Filter to find your fit.
        </p>

        <PropertyFilters value={filterValue} onChange={updateFilters} maxBudget={maxBudget} hideBudget={slug === "fort-kochi"} />

        {loading ? (
          <p className="mt-16 text-muted-foreground">Loading…</p>
        ) : matches.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">
            No properties tagged for {displayName} yet.
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">
            No properties match these filters in {displayName}.
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
                  <h2 className="font-display font-light text-2xl tracking-[-0.02em]">{p.name}</h2>
                  {p.description && <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{p.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {p.bedrooms != null && <span className="inline-flex items-center gap-1"><BedDouble size={13} /> {p.bedrooms} bd</span>}
                    {p.guests != null && <span className="inline-flex items-center gap-1"><Users size={13} /> {p.guests} guests</span>}
                  </div>
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
