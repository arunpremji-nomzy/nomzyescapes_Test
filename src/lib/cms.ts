import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";

// Loose typing for tables not in generated types yet.
const supabase = supabaseTyped as unknown as {
  from: (t: string) => any;
};

export type CmsDestination = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  tagline: string | null;
  image_url: string | null;
  wifi: string | null;
  stays: number | null;
  starting_price: number | null;
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
  published: boolean;
};

export type CmsTestimonial = {
  id: string;
  author: string;
  role: string | null;
  country: string | null;
  flag: string | null;
  quote: string;
  image_url: string | null;
  destination_slug: string | null;
  stay_length: string | null;
  sort_order: number;
  published: boolean;
};

export function useCmsDestinations(opts: { includeUnpublished?: boolean } = {}) {
  return useQuery({
    queryKey: ["site_destinations", opts.includeUnpublished ? "all" : "published"],
    queryFn: async () => {
      let q = supabase.from("site_destinations").select("*").order("sort_order", { ascending: true });
      if (!opts.includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CmsDestination[];
    },
    staleTime: 60_000,
  });
}

export function useCmsTestimonials(opts: { includeUnpublished?: boolean } = {}) {
  return useQuery({
    queryKey: ["site_testimonials", opts.includeUnpublished ? "all" : "published"],
    queryFn: async () => {
      let q = supabase.from("site_testimonials").select("*").order("sort_order", { ascending: true });
      if (!opts.includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CmsTestimonial[];
    },
    staleTime: 60_000,
  });
}

export function useUpsertDestination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CmsDestination>) => {
      const { error } = await supabase.from("site_destinations").upsert(row, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_destinations"] }),
  });
}
export function useDeleteDestination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_destinations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_destinations"] }),
  });
}

export function useUpsertTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CmsTestimonial>) => {
      const { error } = await supabase.from("site_testimonials").upsert(row, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_testimonials"] }),
  });
}
export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_testimonials"] }),
  });
}

// --- Page layout ---------------------------------------------------------
export type PageKey = "home" | "destinations" | "experiences";
export type SectionConfig = { id: string; label: string; visible: boolean };

export const defaultLayouts: Record<PageKey, SectionConfig[]> = {
  home: [
    { id: "hero", label: "Hero", visible: true },
    { id: "prologue", label: "Prologue", visible: true },
    { id: "about", label: "About Nomzy Escapes", visible: true },
    { id: "signature", label: "Signature Moods", visible: true },
    { id: "whyKerala", label: "Why Kerala", visible: true },
    { id: "chapter1", label: "Chapter — Fort Kochi", visible: true },
    { id: "chapter2", label: "Chapter — Varkala", visible: true },
    { id: "howItWorks", label: "How It Works", visible: true },
    { id: "chapter3", label: "Chapter — Alleppey", visible: true },
    { id: "collection", label: "Featured Stays", visible: true },
    { id: "connectivity", label: "Connectivity", visible: true },
    { id: "testimonials", label: "Testimonials", visible: false },
    { id: "community", label: "Community", visible: true },
    { id: "retreats", label: "Corporate Retreats", visible: true },
    { id: "cta", label: "Final CTA", visible: true },
  ],
  destinations: [
    { id: "hero", label: "Hero", visible: true },
    { id: "intro", label: "Intro", visible: true },
    { id: "chapters", label: "Destination Chapters", visible: true },
    { id: "experiences", label: "Experiences", visible: true },
    { id: "faqs", label: "FAQs", visible: true },
    { id: "cta", label: "CTA", visible: true },
  ],
  experiences: [
    { id: "header", label: "Header", visible: true },
    { id: "cards", label: "Experience Cards", visible: true },
    { id: "cta", label: "CTA", visible: true },
  ],
};

export function usePageLayout(page: PageKey) {
  return useQuery({
    queryKey: ["page_layout", page],
    queryFn: async (): Promise<SectionConfig[]> => {
      const { data, error } = await (supabaseTyped as any)
        .from("site_content")
        .select("value")
        .eq("key", `layout_${page}`)
        .maybeSingle();
      if (error) throw error;
      const stored = data?.value as SectionConfig[] | undefined;
      if (!stored || !Array.isArray(stored) || stored.length === 0) return defaultLayouts[page];
      // Merge: keep stored order but include any new defaults that were added later
      const known = new Set(stored.map((s) => s.id));
      const additions = defaultLayouts[page].filter((s) => !known.has(s.id));
      return [...stored, ...additions];
    },
    staleTime: 60_000,
  });
}

export function useSavePageLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ page, value }: { page: PageKey; value: SectionConfig[] }) => {
      const { error } = await (supabaseTyped as any)
        .from("site_content")
        .upsert({ key: `layout_${page}`, value }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["page_layout", vars.page] }),
  });
}
