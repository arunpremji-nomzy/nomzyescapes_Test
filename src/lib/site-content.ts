import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Defaults — used as fallback when admin hasn't saved a value yet.
// Editing in the admin Content panel overrides any of these.
export const defaultContent = {
  hero: {
    eyebrow: "Kerala · India · For Remote Workers",
    titleHtml:
      "Work From Kerala&rsquo;s<br/><em>Most Inspiring Destinations.</em>",
    subtitleHtml:
      "<p>A curated collection of workation stays for digital nomads, remote workers, and long-stay travellers across Fort Kochi, Varkala, Alleppey, and selected destinations.</p>",
    primaryCtaLabel: "Plan My Workation",
    primaryCtaTo: "/contact",
    secondaryCtaLabel: "Browse Destinations",
    secondaryCtaTo: "/destinations",
    trustBar: [
      "Verified High-Speed WiFi",
      "Monthly Stay Options",
      "Local Support Team",
      "Curated Workspaces",
    ],
    imageUrl: "",
  },
  settings: {
    phone: "+91 62388 39179",
    whatsapp: "916238839179",
    email: "info@nomzyescapes.com",
    footerTagline:
      "Curated workation stays across Kerala — verified WiFi, soulful properties, and quiet places to do your best work.",
    footerCopyright: "Work from paradise.",
    brand: "Nomzy",
    brandSuffix: "Escapes",
  },
  faqs: [
    { q: "How fast is the WiFi?", a: "Every property is fibre-tested for sustained video calls and screen-share, with backup 4G/5G via Jio and Airtel, and inverter-backed power for outages." },
    { q: "Can I stay for several months?", a: "Yes. Most properties offer long-stay rates from 30+ nights, and our concierge can negotiate extended stays of 3–6 months." },
    { q: "Do you arrange experiences?", a: "Houseboats, Ayurveda, surf lessons, cooking classes, heritage walks — your concierge curates everything based on your interests." },
    { q: "Can you help with airport transfers?", a: "Yes. We arrange private transfers from Kochi or Trivandrum airports, and any inter-city travel during your stay." },
    { q: "Can teams book retreats?", a: "Absolutely. We design 5–14 day team retreats with workspaces, group accommodation, experiences, and on-the-ground support." },
  ],
  experiences: {
    eyebrow: "Local Experiences",
    titleHtml: "Ten ways to <em>live Kerala</em>, not just visit it.",
    intro: "Hand-picked encounters our long-stay guests return for — bookable as half-day add-ons or woven into a longer itinerary by your concierge.",
    ctaEyebrow: "Curate yours",
    ctaTitle: "Tell us what calls to you — we'll build the week around it.",
    ctaLabel: "Start an enquiry",
    ctaTo: "/contact",
    items: [
      { title: "Village Canal Tours", blurb: "Drift through narrow backwater canals on a country canoe, past paddy fields and waking villages.", region: "Alleppey · Kumarakom", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80&auto=format&fit=crop" },
      { title: "Tea Plantation Visits", blurb: "Walk emerald terraces in the high ranges and learn the craft from third-generation tea makers.", region: "Munnar · Vagamon", image: "https://images.unsplash.com/photo-1582547246939-9543f76f3e57?w=1200&q=80&auto=format&fit=crop" },
      { title: "Trekking", blurb: "Sunrise climbs to grassland summits and cloud-forest trails in the Western Ghats.", region: "Munnar · Wayanad", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80&auto=format&fit=crop" },
      { title: "Surfing", blurb: "Gentle, consistent breaks and a friendly local surf community on Kerala's quieter coastline.", region: "Varkala · Kovalam", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80&auto=format&fit=crop" },
      { title: "Wildlife Safaris", blurb: "Jeep and boat safaris through Periyar and Wayanad — elephants, gaur and the occasional big cat.", region: "Thekkady · Wayanad", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80&auto=format&fit=crop" },
      { title: "Kathakali Performances", blurb: "An intimate evening of Kerala's storied dance-drama — green-faced heroes, drums and oil-lamp light.", region: "Fort Kochi", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80&auto=format&fit=crop" },
      { title: "Theyyam Village Experience", blurb: "Witness a centuries-old ritual where performers become living deities in north Kerala courtyards.", region: "Kannur · Kasaragod", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80&auto=format&fit=crop" },
      { title: "Ayurvedic Wellness", blurb: "Doctor-led consultations and traditional therapies at vetted wellness centres across the state.", region: "Kovalam · Thrissur", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80&auto=format&fit=crop" },
      { title: "Kayaking", blurb: "Paddle quiet lagoons at dawn or open backwaters at golden hour — guided routes for every level.", region: "Alleppey · Poovar", image: "https://images.unsplash.com/photo-1526188717906-1febc287a99e?w=1200&q=80&auto=format&fit=crop" },
      { title: "Kerala Sadya", blurb: "A 26-dish vegetarian feast served on a banana leaf — Kerala's most generous expression of hospitality.", region: "Statewide", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&q=80&auto=format&fit=crop" },
    ],
  },
  community: {
    eyebrow: "06b — Community",
    titleHtml: "Real people, <em>real stays.</em>",
    intro: "Solo travellers, founders, and small groups choosing Kerala for a slower kind of work week. These are scenes from recent stays — not stock imagery.",
    items: [
      { image: "", caption: "Long-table dinner · Fort Kochi", alt: "Long-table dinner with travellers in Fort Kochi" },
      { image: "", caption: "Morning desk · Alleppey", alt: "Traveller working at a verandah desk in Alleppey" },
      { image: "", caption: "Filter coffee · Fort Kochi", alt: "Friends over filter coffee at a Fort Kochi cafe" },
      { image: "", caption: "Sunset surf · Varkala", alt: "Surfer on Varkala beach at sunset" },
      { image: "", caption: "Cliff yoga · Varkala", alt: "Morning yoga on Varkala cliff" },
      { image: "", caption: "Houseboat desk · Alleppey", alt: "Working from a houseboat verandah in Alleppey" },
    ],
  },
  signature: {
    eyebrow: "02 — Signature",
    heading: "Choose your",
    headingItalic: "workation mood.",
  },
  signatureExperiences: {
    eyebrow: "More Than A Place To Stay",
    heading: "Signature",
    headingItalic: "experiences.",
    cardHeading: "Three signature",
    cardHeadingItalic: "moments.",
    discoverLabel: "Discover",
    items: [
      { slug: "fort-kochi", dest: "Fort Kochi", image: "", moments: ["Heritage Walks", "Spice Market Tours", "Art Galleries"] },
      { slug: "varkala", dest: "Varkala", image: "", moments: ["Surf Lessons", "Yoga Sessions", "Cliffside Cafés"] },
      { slug: "alleppey", dest: "Alleppey", image: "", moments: ["Houseboat Evenings", "Kayaking", "Village Trails"] },
    ],
  },
  features: {
    propertiesEnabled: true,
  },


  contactDestinations: {
    eyebrow: "Step 02",
    title: "Choose your destination",
    undecidedLabel: "Not sure yet — recommend something based on my work style.",
    items: [
      { slug: "fort-kochi", name: "Fort Kochi", tag: "Heritage & Café Culture", image: "" },
      { slug: "varkala", name: "Varkala", tag: "Surf & Wellness", image: "" },
      { slug: "alleppey", name: "Alleppey", tag: "Backwater Slow Living", image: "" },
    ],
  },
  contactConcierge: {
    eyebrow: "A Familiar Face",
    titleHtml: "Meet your local <em>Kerala concierge.</em>",
    body: "Not a chatbot, not a call centre. A small team based in Kochi who personally verify every property, walk every neighbourhood, and know which café has the best espresso at 7am.",
    image: "",
    features: [
      { icon: "MapPin", label: "Local Expertise" },
      { icon: "Check", label: "Property Verification" },
      { icon: "Sparkles", label: "Personal Recommendations" },
      { icon: "Compass", label: "Experience Planning" },
    ],
  },
  contactExperiences: {
    eyebrow: "Beyond The Stay",
    titleHtml: "More than a <em>place to stay.</em>",
    items: [
      { title: "Heritage Walks", place: "Fort Kochi", image: "" },
      { title: "Surf Sessions", place: "Varkala", image: "" },
      { title: "Backwater Mornings", place: "Alleppey", image: "" },
      { title: "Ayurveda & Wellness", place: "Across Kerala", image: "" },
      { title: "Local Food Experiences", place: "Across Kerala", image: "" },
    ],
  },
} satisfies {
  hero: {
    eyebrow: string;
    titleHtml: string;
    subtitleHtml: string;
    primaryCtaLabel: string;
    primaryCtaTo: string;
    secondaryCtaLabel: string;
    secondaryCtaTo: string;
    trustBar: string[];
    imageUrl: string;
  };
  settings: {
    phone: string;
    whatsapp: string;
    email: string;
    footerTagline: string;
    footerCopyright: string;
    brand: string;
    brandSuffix: string;
  };

  faqs: Array<{ q: string; a: string }>;
  experiences: {
    eyebrow: string;
    titleHtml: string;
    intro: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaLabel: string;
    ctaTo: string;
    items: Array<{ title: string; blurb: string; region: string; image: string }>;
  };
  community: {
    eyebrow: string;
    titleHtml: string;
    intro: string;
    items: Array<{ image: string; caption: string; alt: string }>;
  };
  signature: {
    eyebrow: string;
    heading: string;
    headingItalic: string;
  };
  signatureExperiences: {
    eyebrow: string;
    heading: string;
    headingItalic: string;
    cardHeading: string;
    cardHeadingItalic: string;
    discoverLabel: string;
    items: Array<{ slug: string; dest: string; image: string; moments: string[] }>;
  };

  features: {
    propertiesEnabled: boolean;
  };

  contactDestinations: {
    eyebrow: string;
    title: string;
    undecidedLabel: string;
    items: Array<{ slug: string; name: string; tag: string; image: string }>;
  };
  contactConcierge: {
    eyebrow: string;
    titleHtml: string;
    body: string;
    image: string;
    features: Array<{ icon: string; label: string }>;
  };
  contactExperiences: {
    eyebrow: string;
    titleHtml: string;
    items: Array<{ title: string; place: string; image: string }>;
  };
};

export type SiteContentKey = keyof typeof defaultContent;

export function useSiteContent<K extends SiteContentKey>(key: K) {
  return useQuery({
    queryKey: ["site_content", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content" as never)
        .select("value")
        .eq("key" as never, key)
        .maybeSingle();
      if (error) throw error;
      const stored = (data as { value?: unknown } | null)?.value;
      return (stored ?? defaultContent[key]) as typeof defaultContent[K];
    },
    staleTime: 60_000,
  });
}

export function useUpdateSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: SiteContentKey; value: unknown }) => {
      const { error } = await supabase
        .from("site_content" as never)
        .upsert({ key, value } as never, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["site_content", vars.key] });
    },
  });
}

/** Convert a stored storage path (or full URL) into a usable image URL. */
export async function resolveMediaUrl(pathOrUrl: string): Promise<string> {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
  const { data } = await supabase.storage
    .from("site-media")
    .createSignedUrl(pathOrUrl, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? "";
}
