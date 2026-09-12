import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowRight, MapPin, Heart, X, Mail, MessageCircle, Bookmark, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import fortKochiFull from "@/assets/dest-fortkochi.png";
import varkalaFull from "@/assets/dest-varkala.jpg";
import alleppeyFull from "@/assets/dest-alleppey.jpg";
import collageFortKochi from "@/assets/collage-fortkochi.jpg";
import collageVarkala from "@/assets/collage-varkala.jpg";
import collageAlleppey from "@/assets/collage-alleppey.jpg";
import expFortKochi from "@/assets/exp-fortkochi.jpg";
import expVarkala from "@/assets/exp-varkala.jpg";
import expAlleppey from "@/assets/exp-alleppey.jpg";
import { destinations } from "@/lib/destinations";
import { useShortlist } from "@/hooks/useShortlist";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCmsDestinations } from "@/lib/cms";
import { useSiteContent, defaultContent } from "@/lib/site-content";


const destinationFaqs: Record<string, { q: string; a: string }[]> = {
  "fort-kochi": [
    { q: "How reliable is the WiFi in Fort Kochi?", a: "Every curated stay runs on high-speed fibre, speed-tested monthly by our team for sustained video calls and screen-share. Coworking spots like Untitled Project are vetted the same way." },
    { q: "What stay lengths work best here?", a: "Fort Kochi is ideal for 1–4 weeks. The compact, walkable nature and rich café culture make it perfect for shorter, immersive creative stints." },
    { q: "What's the workspace setup like?", a: "Heritage homes with private courtyards and dedicated desks, plus 6+ coworking spaces within a 10-minute walk. Inverter-backed power for the occasional outage." },
  ],
  varkala: [
    { q: "Is the WiFi reliable on the cliff?", a: "Yes — high-speed fibre at every stay, with 4G/5G backup via Jio. We avoid cliff cafés as your primary workspace and verify in-stay speeds instead." },
    { q: "How long do people usually stay?", a: "Most nomads stay 2–8 weeks. Varkala's surf-and-yoga rhythm pairs well with longer stays where mornings are for the ocean and afternoons for deep work." },
    { q: "Are workspaces ocean-facing?", a: "Most stays offer cliff- or garden-facing desks. We can also arrange day passes at quiet workspaces away from the cliff strip when you need full focus." },
  ],
  alleppey: [
    { q: "Is the WiFi strong enough for video calls?", a: "Yes — high-speed fibre at all stays, tested for sustained calls. The remote setting means we provision dual ISP fallback and inverter power as standard." },
    { q: "Can I stay for several months?", a: "Alleppey is built for long stays — 4 weeks to 3 months is our most common booking. Long-stay rates unlock after 30 nights." },
    { q: "What's the workspace like?", a: "Standalone backwater villas with private verandahs over the water, traditional teakwood desks, and almost zero ambient distraction." },
  ],
};



export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinations — Three Ways to Work from Kerala" },
      { name: "description", content: "Fort Kochi, Varkala, Alleppey — three editorial chapters for remote workers. Find the rhythm that matches your work style." },
      { property: "og:title", content: "Three Ways to Work from Kerala" },
      { property: "og:description", content: "Heritage cafés, ocean cliffs, or quiet backwaters — choose the workation that matches your rhythm." },
    ],
    links: [{ rel: "canonical", href: "https://kerala-escape-co.lovable.app/destinations" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: Object.values(destinationFaqs)
            .flat()
            .map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        }),
      },
    ],
  }),
  component: DestinationsPage,
});

const chapters = [
  {
    slug: "fort-kochi" as const,
    chapter: "Chapter 01",
    headline: "Work between cafés, galleries and colonial streets.",
    traits: ["Creative", "Walkable", "Cultural", "Urban"],
    metrics: [
      { value: "Fibre", unit: "", label: "High-Speed WiFi" },
      { value: "12", unit: "", label: "Curated Stays" },
      { value: "Creatives", unit: "", label: "Best For" },
    ],
    image: fortKochiFull,
    align: "left" as const,
  },
  {
    slug: "varkala" as const,
    chapter: "Chapter 02",
    headline: "Ocean views become your office.",
    traits: ["Surf", "Wellness", "Community", "Freedom"],
    metrics: [
      { value: "Fibre", unit: "", label: "High-Speed WiFi" },
      { value: "13", unit: "", label: "Curated Stays" },
      { value: "Wellness", unit: "", label: "Best For" },
    ],
    image: varkalaFull,
    align: "right" as const,
  },
  {
    slug: "alleppey" as const,
    chapter: "Chapter 03",
    headline: "Slow mornings. Deep work.",
    traits: ["Quiet", "Nature", "Focus", "Restoration"],
    metrics: [
      { value: "Fibre", unit: "", label: "High-Speed WiFi" },
      { value: "11", unit: "", label: "Curated Stays" },
      { value: "Deep Work", unit: "", label: "Best For" },
    ],
    image: alleppeyFull,
    align: "left" as const,
  },
];

const comparison = [
  { name: "Fort Kochi", bestFor: "Creatives", atmosphere: "Urban & Cultural", stay: "1–4 Weeks", slug: "fort-kochi" as const },
  { name: "Varkala", bestFor: "Wellness", atmosphere: "Coastal & Social", stay: "2–8 Weeks", slug: "varkala" as const },
  { name: "Alleppey", bestFor: "Focus", atmosphere: "Quiet & Restorative", stay: "1–12 Weeks", slug: "alleppey" as const },
];

const stats = [
  { value: "Fibre", unit: "", label: "High-speed, speed-tested internet across every curated stay." },
  { value: "30–50%", unit: "", label: "Lower cost of living than Europe." },
  { value: "300+", unit: "days", label: "Of tropical weather every year." },
];

const moodCards = [
  { mood: "Heritage & Culture", dest: "Fort Kochi", slug: "fort-kochi" as const, image: collageFortKochi },
  { mood: "Surf & Wellness", dest: "Varkala", slug: "varkala" as const, image: collageVarkala },
  { mood: "Quiet & Focus", dest: "Alleppey", slug: "alleppey" as const, image: collageAlleppey },
];

const experiencesByDest = [
  { dest: "Fort Kochi", slug: "fort-kochi" as const, image: expFortKochi, items: ["Heritage Walks", "Spice Market Tours", "Art Galleries"] },
  { dest: "Varkala", slug: "varkala" as const, image: expVarkala, items: ["Surf Lessons", "Yoga Sessions", "Cliffside Cafés"] },
  { dest: "Alleppey", slug: "alleppey" as const, image: expAlleppey, items: ["Houseboat Evenings", "Kayaking", "Village Trails"] },
];

function DestinationsPage() {
  const shortlist = useShortlist();
  const [inquirySlug, setInquirySlug] = useState<string | null>(null);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const { data: cmsDestinations } = useCmsDestinations();
  const { data: sigExpData } = useSiteContent("signatureExperiences");
  const sigExp = sigExpData ?? defaultContent.signatureExperiences;
  const sigExpCards = sigExp.items.map((it) => {
    const fallback = experiencesByDest.find((f) => f.slug === it.slug);
    return {
      slug: it.slug,
      dest: it.dest,
      image: it.image || fallback?.image || "",
      moments: it.moments,
    };
  });

  const coreSlugs = new Set(["fort-kochi", "varkala", "alleppey"]);
  const extraDestinations = (cmsDestinations ?? []).filter(
    (d) => d.slug && !coreSlugs.has(d.slug) && d.image_url,
  );

  const openInquiry = (slug: string) => setInquirySlug(slug);
  const closeInquiry = () => setInquirySlug(null);

  return (
    <>
      {/* HERO — cinematic split */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3">
          {[fortKochiFull, varkalaFull, alleppeyFull].map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
                style={{ animationDelay: `${i * 800}ms` }}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80" />
        <div className="relative z-10 container-editorial h-full flex flex-col justify-end pt-28 pb-20 text-primary-foreground">
          <p className="eyebrow text-primary-foreground/75 animate-fade-up">The Directory · Kerala · India</p>
          <h1 className="mt-6 font-display font-light text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.03em] max-w-5xl animate-fade-up">
            Three ways to <span className="italic">work from Kerala.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-primary-foreground/85 leading-relaxed animate-fade-up">
            Each destination offers a different rhythm of remote work — from heritage cafés
            and creative communities to ocean cliffs and quiet backwaters.
          </p>
          <div className="mt-12 flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-primary-foreground/60 animate-fade-up">
            <span>Scroll</span>
            <div className="h-px w-12 bg-primary-foreground/40" />
          </div>
        </div>
      </section>

      {/* CHAPTERS */}
      {chapters.map((c) => (
        <ChapterSection
          key={c.slug}
          c={c}
          saved={shortlist.has(c.slug)}
          onSave={() => {
            shortlist.toggle(c.slug);
            toast(shortlist.has(c.slug) ? "Removed from your shortlist" : "Saved to your shortlist", {
              description: destinations.find((d) => d.slug === c.slug)?.name,
            });
          }}
          onInquire={() => openInquiry(c.slug)}
        />
      ))}

      {/* MOOD SELECTOR */}
      <section className="py-28 md:py-36">
        <div className="container-editorial mb-20">
          <p className="eyebrow">The Selector</p>
          <h2 className="mt-6 font-display font-light text-5xl md:text-7xl leading-[0.98] tracking-[-0.03em] max-w-4xl">
            What&rsquo;s your <span className="italic">workation style?</span>
          </h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 h-auto ${extraDestinations.length === 0 ? "md:h-[85vh]" : ""}`}>
          {moodCards.map((m) => (
            <Link
              key={m.slug}
              to="/destinations/$slug"
              params={{ slug: m.slug }}
              className="group relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-full md:min-h-[85vh]"
            >
              <img
                src={m.image}
                alt={m.dest}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-primary-foreground">
                <p className="eyebrow text-primary-foreground/70">{m.mood}</p>
                <h3 className="mt-5 font-display font-light text-5xl md:text-7xl leading-[0.9] tracking-[-0.03em]">{m.dest}</h3>
                <div className="mt-6 max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">
                  <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border-b border-primary-foreground/60 pb-1">
                    Discover {m.dest} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {extraDestinations.map((d) => {
            const href = d.cta_link && d.cta_link.length > 0 ? d.cta_link : `/destinations/${d.slug}`;
            const mood = d.tagline || d.region || "Curated Stay";
            return (
              <a
                key={d.id}
                href={href}
                className="group relative overflow-hidden aspect-[3/4] md:aspect-auto md:min-h-[85vh]"
              >
                <img
                  src={d.image_url ?? ""}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-primary-foreground">
                  <p className="eyebrow text-primary-foreground/70">{mood}</p>
                  <h3 className="mt-5 font-display font-light text-5xl md:text-7xl leading-[0.9] tracking-[-0.03em]">{d.name}</h3>
                  <div className="mt-6 max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">
                    <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border-b border-primary-foreground/60 pb-1">
                      Discover {d.name} <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* UNIQUE SELECTED LOCATIONS — beyond the three hubs */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <p className="md:col-span-3 eyebrow">Hand-picked · Beyond the three</p>
            <h2 className="md:col-span-9 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
              Unique selected <span className="italic">locations in Kerala.</span>
            </h2>
            <p className="md:col-span-9 md:col-start-4 text-muted-foreground leading-relaxed max-w-2xl">
              We focus on three core hubs, but Kerala has more pockets worth a detour.
              These are curated side-trips and quieter escapes our guests return for —
              available on request as add-ons to your stay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { name: "Wayanad", region: "Western Ghats", note: "Misty plantations, treehouse stays, and cool-air weekends 1,500m above the coast." },
              { name: "Munnar", region: "Tea Country", note: "Endless tea estates, colonial bungalows, and the cleanest air in South India." },
              { name: "Kumarakom", region: "Vembanad Lake", note: "Bird sanctuary, lakeside villas, and the larger, quieter sister of Alleppey." },
              { name: "Thekkady", region: "Periyar Reserve", note: "Spice plantations and India's most accessible tiger reserve — a two-night ritual." },
              { name: "Bekal", region: "North Malabar", note: "A 17th-century sea fort, empty beaches, and the slow Malabar food trail." },
              { name: "Marari", region: "Coastal Hamlet", note: "Fishing-village beach 30 minutes from Alleppey — wide, quiet, unplugged." },
              { name: "Kovalam", region: "South Coast", note: "Lighthouse beach, Ayurveda heritage, and the closest coast to Trivandrum airport." },
              { name: "Vagamon", region: "Idukki Hills", note: "Rolling meadows, pine forests, and paragliding above tea-green valleys." },
              { name: "Nelliyampathy", region: "Palakkad Hills", note: "Off-grid orange orchards and cardamom estates few travellers reach." },
            ].map((l, i) => (
              <article key={l.name} className="border-t border-border pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">{l.region}</span>
                </div>
                <h3 className="mt-4 font-display font-light text-3xl tracking-[-0.02em] flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" /> {l.name}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{l.note}</p>
              </article>
            ))}
          </div>

          <p className="mt-16 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Available as bespoke add-ons · Ask your concierge
          </p>
        </div>
      </section>

      {/* COMPARISON — editorial cards */}
      <section className="py-28 md:py-36 bg-muted/40">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <p className="md:col-span-3 eyebrow">At A Glance</p>
            <h2 className="md:col-span-9 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
              Three rhythms, <span className="italic">side by side.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {comparison.map((c, i) => (
              <Link
                key={c.slug}
                to="/destinations/$slug"
                params={{ slug: c.slug }}
                className="group bg-background border border-border p-10 md:p-12 flex flex-col hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
              >
                <div className="font-mono text-xs opacity-60">0{i + 1}</div>
                <h3 className="mt-6 font-display font-light text-5xl md:text-6xl tracking-[-0.02em]">{c.name}</h3>
                <dl className="mt-10 space-y-5 border-t border-border group-hover:border-primary-foreground/20 pt-6 flex-1">
                  <Row label="Best For" value={c.bestFor} />
                  <Row label="Atmosphere" value={c.atmosphere} />
                  <Row label="Stay Length" value={c.stay} />
                </dl>
                <div className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                  Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-primary-foreground py-28 md:py-40">
        <div className="container-editorial">
          <p className="eyebrow text-primary-foreground/60">Why Kerala Works</p>
          <div className="mt-16 grid md:grid-cols-3 gap-x-12 gap-y-20">
            {stats.map((s, i) => (
              <div key={s.label} className="border-t border-primary-foreground/20 pt-8">
                <span className="font-mono text-xs text-primary-foreground/50">0{i + 1}</span>
                <div className="mt-6 font-display font-light leading-[0.95] tracking-[-0.04em] text-[clamp(3.5rem,7vw,6.5rem)]">
                  {s.value}
                  {s.unit && <span className="text-primary-foreground/40 text-[0.4em] align-top ml-3">{s.unit}</span>}
                </div>
                <p className="mt-6 max-w-xs text-primary-foreground/75 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-28 md:py-36">
        <div className="container-editorial mb-20">
          <p className="eyebrow">{sigExp.eyebrow}</p>
          <h2 className="mt-6 font-display font-light text-5xl md:text-7xl leading-[0.98] tracking-[-0.03em] max-w-4xl">
            {sigExp.heading} <span className="italic">{sigExp.headingItalic}</span>
          </h2>
        </div>
        <div className="space-y-px">
          {sigExpCards.map((e, i) => (
            <article key={e.slug} className="grid md:grid-cols-12 gap-0 bg-muted/30">
              <div className={`md:col-span-7 relative aspect-[16/10] md:aspect-auto md:min-h-[60vh] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <img src={e.image} alt={e.dest} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105" />
              </div>
              <div className="md:col-span-5 p-10 md:p-16 flex flex-col justify-center">
                <p className="eyebrow">{e.dest}</p>
                <h3 className="mt-6 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">
                  {sigExp.cardHeading} <span className="italic">{sigExp.cardHeadingItalic}</span>
                </h3>
                <ul className="mt-10 space-y-5">
                  {e.moments.map((item, idx) => (
                    <li key={`${item}-${idx}`} className="flex items-baseline gap-5 border-b border-border pb-4">
                      <span className="font-mono text-xs text-muted-foreground">0{idx + 1}</span>
                      <span className="font-display font-light text-2xl tracking-[-0.01em]">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: e.slug }}
                  className="mt-10 inline-flex items-center gap-3 self-start text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 group"
                >
                  {sigExp.discoverLabel} {e.dest} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </section>

      {/* FAQ — destination-specific */}
      <section className="py-28 md:py-36 bg-muted/40">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <p className="md:col-span-3 eyebrow">Considerations</p>
            <h2 className="md:col-span-9 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
              Questions by <span className="italic">destination.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {destinations.map((d) => (
              <div key={d.slug} className="bg-background border border-border p-8 md:p-10 flex flex-col">
                <p className="eyebrow">{d.region}</p>
                <h3 className="mt-3 font-display font-light text-3xl tracking-[-0.02em]">{d.name}</h3>
                <Accordion type="single" collapsible className="mt-6 flex-1">
                  {destinationFaqs[d.slug]?.map((f, i) => (
                    <AccordionItem key={i} value={`${d.slug}-${i}`} className="border-border">
                      <AccordionTrigger className="text-left font-display font-light text-base tracking-[-0.01em] hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <button
                  type="button"
                  onClick={() => openInquiry(d.slug)}
                  className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 self-start group"
                >
                  Ask About {d.name} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>

          {/* Contact fallback */}
          <div className="mt-16 border border-border bg-background p-8 md:p-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <p className="eyebrow">Still wondering?</p>
              <h3 className="mt-3 font-display font-light text-2xl md:text-3xl tracking-[-0.02em]">
                Your concierge replies within a working day — on email or WhatsApp.
              </h3>
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-3 md:justify-end">
              <a
                href="mailto:info@nomzyescapes.com"
                className="inline-flex items-center gap-2 px-5 h-11 border border-border text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail size={14} /> Email
              </a>
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 h-11 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container-editorial">
          <div className="bg-accent text-accent-foreground p-12 md:p-20 grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <p className="eyebrow text-accent-foreground/70">Begin</p>
              <h2 className="mt-6 font-display font-light text-5xl md:text-7xl leading-[0.98] tracking-[-0.03em]">
                Found your <span className="italic">rhythm?</span>
              </h2>
              <p className="mt-8 max-w-md text-accent-foreground/85 leading-relaxed">
                Tell us which destination matches your work style. Your concierge will design the rest.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group"
              >
                Plan My Workation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING SHORTLIST BUTTON */}
      {shortlist.slugs.length > 0 && (
        <button
          type="button"
          onClick={() => setShortlistOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 pl-5 pr-3 h-12 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Bookmark size={16} className="fill-accent text-accent" />
          <span className="text-xs tracking-[0.2em] uppercase">My Shortlist</span>
          <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 bg-accent text-accent-foreground text-xs font-medium">
            {shortlist.slugs.length}
          </span>
        </button>
      )}

      {/* SHORTLIST SHEET */}
      <ShortlistSheet
        open={shortlistOpen}
        onOpenChange={setShortlistOpen}
        slugs={shortlist.slugs}
        onRemove={shortlist.remove}
        onClear={shortlist.clear}
        onInquire={(slug) => {
          setShortlistOpen(false);
          openInquiry(slug);
        }}
      />

      {/* INQUIRY SHEET */}
      <InquirySheet slug={inquirySlug} onClose={closeInquiry} />
    </>
  );
}

function ChapterSection({
  c,
  saved,
  onSave,
  onInquire,
}: {
  c: (typeof chapters)[number];
  saved: boolean;
  onSave: () => void;
  onInquire: () => void;
}) {
  const dest = destinations.find((d) => d.slug === c.slug);
  return (
    <section
      className="chapter-fixed relative min-h-screen flex items-center text-primary-foreground"
      style={{ backgroundImage: `url(${c.image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/75" />
      <div className="relative container-editorial py-32 md:py-40 w-full">
        <div className={`max-w-2xl ${c.align === "right" ? "ml-auto" : ""}`}>
          <div className="flex items-center justify-between gap-4 reveal">
            <p className="eyebrow text-primary-foreground/70">{c.chapter} · {dest?.name}</p>
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from shortlist" : "Save this vibe"}
              className={`inline-flex items-center gap-2 px-3 h-9 border text-xs tracking-[0.2em] uppercase transition-colors ${
                saved
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              }`}
            >
              <Heart size={14} className={saved ? "fill-current" : ""} />
              {saved ? "Saved" : "Save vibe"}
            </button>
          </div>
          <h2 className="reveal mt-8 font-display font-light text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.03em]" data-reveal-delay="120">
            {c.headline}
          </h2>
          <p className="reveal mt-8 max-w-lg text-base md:text-lg text-primary-foreground/85 leading-relaxed" data-reveal-delay="200">
            {dest?.overview}
          </p>

          <ul className="reveal mt-10 flex flex-wrap gap-2" data-reveal-delay="260">
            {c.traits.map((t) => (
              <li key={t} className="px-4 h-8 inline-flex items-center border border-primary-foreground/30 text-xs tracking-[0.2em] uppercase">
                {t}
              </li>
            ))}
          </ul>

          <dl className="reveal mt-12 grid grid-cols-3 gap-px bg-primary-foreground/10 max-w-xl" data-reveal-delay="320">
            {c.metrics.map((m) => (
              <div key={m.label} className="bg-black/30 backdrop-blur-sm p-5">
                <div className="font-display font-light text-2xl md:text-3xl tracking-[-0.02em]">
                  {m.value}
                  {m.unit && <span className="text-primary-foreground/50 text-base ml-1">{m.unit}</span>}
                </div>
                <div className="mt-2 eyebrow text-[0.6rem] text-primary-foreground/60">{m.label}</div>
              </div>
            ))}
          </dl>

          <div className="reveal mt-12 flex flex-wrap gap-3" data-reveal-delay="380">
            <button
              type="button"
              onClick={onInquire}
              className="inline-flex items-center gap-3 px-7 h-12 bg-accent text-accent-foreground text-xs tracking-[0.2em] uppercase group"
            >
              Inquire About {dest?.name} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/destinations/$slug"
              params={{ slug: c.slug }}
              className="inline-flex items-center gap-3 px-7 h-12 border border-primary-foreground/40 text-xs tracking-[0.2em] uppercase hover:bg-primary-foreground hover:text-primary transition-colors group"
            >
              <MapPin size={14} /> Discover
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InquirySheet({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const open = slug !== null;
  const dest = slug ? destinations.find((d) => d.slug === slug) : null;
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset on close
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onClose();
      setTimeout(() => setSent(false), 300);
    }
  };



  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto bg-background">
        <SheetHeader className="text-left">
          <p className="eyebrow">Inquire · On-Page Concierge</p>
          <SheetTitle className="font-display font-light text-3xl md:text-4xl tracking-[-0.02em]">
            {dest?.name}
          </SheetTitle>
          <SheetDescription>
            Share your dates and preferences. Your concierge will reply within one working day.
          </SheetDescription>
        </SheetHeader>

        {sent ? (
          <div className="mt-10 border border-border bg-muted/40 p-8">
            <p className="eyebrow">Received</p>
            <h3 className="mt-3 font-display font-light text-2xl tracking-[-0.02em]">Thank you.</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your inquiry for {dest?.name} is on its way to our concierge.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              const fd = new FormData(e.currentTarget);
              const length = String(fd.get("length") || "");
              const prefs = String(fd.get("prefs") || "");
              const message = [length && `Stay length: ${length}`, prefs].filter(Boolean).join("\n\n");
              try {
                const { error } = await (supabase as any).from("inquiries").insert({
                  source: "destinations",
                  destination: dest?.name ?? null,
                  name: String(fd.get("name") || ""),
                  email: String(fd.get("email") || ""),
                  start_date: String(fd.get("arrival") || "") || null,
                  end_date: String(fd.get("departure") || "") || null,
                  message: message || null,
                });
                if (error) throw error;
                setSent(true);
                toast("Inquiry sent", { description: `${dest?.name} · We'll be in touch shortly.` });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not send inquiry");
              } finally {
                setSubmitting(false);
              }
            }}
            className="mt-8 space-y-6"
          >
            <Field label="Full name">
              <input required type="text" name="name" className="form-input" />
            </Field>
            <Field label="Email">
              <input required type="email" name="email" className="form-input" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Arrival">
                <input type="date" name="arrival" className="form-input" />
              </Field>
              <Field label="Departure">
                <input type="date" name="departure" className="form-input" />
              </Field>
            </div>
            <Field label="Stay length">
              <select name="length" className="form-input" defaultValue="2-4 weeks">
                <option>Under a week</option>
                <option>1–2 weeks</option>
                <option>2–4 weeks</option>
                <option>1–3 months</option>
                <option>3+ months</option>
              </select>
            </Field>
            <Field label="Preferences">
              <textarea
                name="prefs"
                rows={4}
                className="form-input resize-none"
                placeholder="Workspace style, WiFi needs, surf/yoga, dietary, anything else…"
              />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-3 h-12 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Inquiry"} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}

        <style>{`
          .form-input { width: 100%; background: transparent; border: 0; border-bottom: 1px solid var(--border); padding: 0.6rem 0; font-size: 0.95rem; color: var(--foreground); outline: none; transition: border-color 0.2s; }
          .form-input:focus { border-color: var(--foreground); }
        `}</style>
      </SheetContent>
    </Sheet>
  );
}

const PREFERENCES = [
  { id: "creative", label: "Creative", tags: ["creative", "art", "cafés", "heritage", "cosmopolitan"] },
  { id: "wellness", label: "Wellness", tags: ["wellness", "yoga", "surf", "beach"] },
  { id: "focus", label: "Deep Focus", tags: ["focus", "quiet", "slow living", "retreat", "deep work"] },
  { id: "nature", label: "Nature", tags: ["nature", "backwaters", "houseboats", "sunsets"] },
  { id: "social", label: "Community", tags: ["community", "social", "walkable"] },
  { id: "urban", label: "Urban", tags: ["urban", "cultural", "walkable", "cosmopolitan"] },
];

function scoreDestination(d: NonNullable<ReturnType<typeof destinations.find>>, prefIds: string[]) {
  if (prefIds.length === 0) return 0;
  const haystack = [...d.vibe, d.bestFor, d.workation].join(" ").toLowerCase();
  let score = 0;
  for (const pid of prefIds) {
    const pref = PREFERENCES.find((p) => p.id === pid);
    if (!pref) continue;
    for (const t of pref.tags) if (haystack.includes(t)) score += 1;
  }
  return score;
}

function ShortlistCarousel({ dest }: { dest: NonNullable<ReturnType<typeof destinations.find>> }) {
  const slides = [
    { kind: "image" as const, image: dest.image, caption: dest.tagline },
    { kind: "vibe" as const, image: dest.image, title: "The Vibe", body: dest.vibe.join(" · ") },
    { kind: "work" as const, image: dest.image, title: "Workation Rhythm", body: dest.workation },
    { kind: "exp" as const, image: dest.image, title: "Signature Experiences", body: dest.experiences.slice(0, 4).join(" · ") },
  ];
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  const go = (n: number) => setI((prev) => (prev + n + slides.length) % slides.length);

  return (
    <div
      className="relative aspect-[4/3] sm:aspect-[16/10] bg-muted overflow-hidden select-none"
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={s.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
            {s.kind === "image" ? (
              <p className="font-display text-base sm:text-lg leading-snug">{s.caption}</p>
            ) : (
              <>
                <p className="eyebrow text-[0.6rem] text-white/80">{s.title}</p>
                <p className="mt-1 font-display text-sm sm:text-base leading-snug">{s.body}</p>
              </>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center bg-background/80 hover:bg-background text-foreground"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center bg-background/80 hover:bg-background text-foreground"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute top-3 right-3 flex gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

function ShortlistSheet({
  open,
  onOpenChange,
  slugs,
  onRemove,
  onClear,
  onInquire,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  slugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
  onInquire: (slug: string) => void;
}) {
  const [prefs, setPrefs] = useState<string[]>([]);
  const togglePref = (id: string) =>
    setPrefs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const saved = slugs
    .map((s) => destinations.find((d) => d.slug === s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const scored = saved.map((d) => ({ d, score: scoreDestination(d, prefs) }));
  const topScore = Math.max(0, ...scored.map((x) => x.score));
  const ranked = [...scored].sort((a, b) => b.score - a.score);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-background">
        <SheetHeader className="text-left">
          <p className="eyebrow">Your Shortlist</p>
          <SheetTitle className="font-display font-light text-3xl md:text-4xl tracking-[-0.02em]">
            Saved <span className="italic">vibes.</span>
          </SheetTitle>
          <SheetDescription>
            Swipe through each destination and tell us what matters — we&rsquo;ll surface your best fit.
          </SheetDescription>
        </SheetHeader>

        {saved.length === 0 ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            No destinations saved yet. Tap <span className="font-medium text-foreground">Save vibe</span> on any chapter to start your shortlist.
          </div>
        ) : (
          <>
            <div className="mt-6">
              <p className="eyebrow text-[0.6rem] mb-3">What matters most?</p>
              <div className="flex flex-wrap gap-2">
                {PREFERENCES.map((p) => {
                  const on = prefs.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePref(p.id)}
                      className={`px-3 h-8 text-[0.7rem] tracking-[0.15em] uppercase border transition-colors ${
                        on
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 space-y-8">
              {ranked.map(({ d, score }) => {
                const isBest = prefs.length > 0 && score > 0 && score === topScore;
                return (
                  <article key={d.slug} className={`border bg-background overflow-hidden ${isBest ? "border-foreground shadow-lg" : "border-border"}`}>
                    {isBest && (
                      <div className="flex items-center gap-2 px-4 h-9 bg-foreground text-background">
                        <Sparkles size={12} />
                        <span className="text-[0.65rem] tracking-[0.2em] uppercase">Best Fit For You</span>
                      </div>
                    )}
                    <ShortlistCarousel dest={d} />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="eyebrow text-[0.6rem]">{d.region}</p>
                          <h3 className="mt-1 font-display font-light text-2xl tracking-[-0.02em] truncate">{d.name}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(d.slug)}
                          className="shrink-0 h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <dl className="mt-4 grid grid-cols-3 gap-3 text-[0.7rem]">
                        <div>
                          <dt className="eyebrow text-[0.55rem] opacity-70">Best For</dt>
                          <dd className="mt-1 font-display">{d.bestFor}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow text-[0.55rem] opacity-70">WiFi</dt>
                          <dd className="mt-1 font-display">{d.wifi.split(" · ")[1] ?? d.wifi}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow text-[0.55rem] opacity-70">Length</dt>
                          <dd className="mt-1 font-display">{d.stayLength}</dd>
                        </div>
                      </dl>
                      {prefs.length > 0 && (
                        <p className="mt-3 text-[0.7rem] text-muted-foreground">
                          {score > 0
                            ? `Matches ${score} of your ${prefs.length} ${prefs.length === 1 ? "priority" : "priorities"}.`
                            : "No matches for your selected priorities."}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => onInquire(d.slug)}
                          className="inline-flex items-center gap-2 px-3 h-9 bg-primary text-primary-foreground text-[0.65rem] tracking-[0.2em] uppercase"
                        >
                          Inquire
                        </button>
                        <Link
                          to="/destinations/$slug"
                          params={{ slug: d.slug }}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-2 px-3 h-9 border border-border text-[0.65rem] tracking-[0.2em] uppercase"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={onClear}
                className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
              <Link
                to="/contact"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 px-5 h-11 bg-accent text-accent-foreground text-xs tracking-[0.2em] uppercase"
              >
                Plan All <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="eyebrow text-[0.62rem] opacity-70">{label}</dt>
      <dd className="font-display text-lg tracking-[-0.01em] text-right">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
    </label>
  );
}

