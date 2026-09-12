import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";

const supabase = supabaseTyped as unknown as { from: (t: string) => any };

const BASE_URL = "https://kerala-escape-co.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/properties", changefreq: "weekly", priority: "0.9" },
          { path: "/destinations", changefreq: "monthly", priority: "0.8" },
          { path: "/experiences", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
        ];

        try {
          const { data: properties } = await supabase
            .from("properties")
            .select("id,updated_at")
            .eq("status", "published");
          for (const p of (properties ?? []) as { id: string; updated_at?: string }[]) {
            entries.push({
              path: `/properties/${p.id}`,
              lastmod: p.updated_at,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        } catch {
          // ignore — sitemap still serves static entries
        }

        try {
          const { data: destinations } = await supabase
            .from("destinations")
            .select("slug,updated_at")
            .eq("published", true);
          for (const d of (destinations ?? []) as { slug: string; updated_at?: string }[]) {
            entries.push({
              path: `/destinations/${d.slug}`,
              lastmod: d.updated_at,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        } catch {
          // ignore
        }

        try {
          const { data: props } = await supabase
            .from("properties")
            .select("destination,updated_at")
            .eq("status", "published");
          const seen = new Map<string, string | undefined>();
          for (const p of (props ?? []) as { destination: string | null; updated_at?: string }[]) {
            if (!p.destination) continue;
            const slug = p.destination
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            if (!slug) continue;
            const prev = seen.get(slug);
            if (!prev || (p.updated_at && p.updated_at > prev)) seen.set(slug, p.updated_at);
          }
          for (const [slug, lastmod] of seen) {
            entries.push({
              path: `/locations/${slug}`,
              lastmod,
              changefreq: "weekly",
              priority: "0.6",
            });
          }
        } catch {
          // ignore
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
