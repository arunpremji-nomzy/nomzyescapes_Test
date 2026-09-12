import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wifi, Check } from "lucide-react";
import heroImg from "@/assets/hero-kerala.jpg?format=webp&quality=68&w=1920";
import workspaceImg from "@/assets/property-workspace.jpg?format=webp&quality=70&w=1200";
import fortkochiAsset from "@/assets/fort-kochi-yellow.jpg.asset.json";
import varkalaAsset from "@/assets/dest-varkala.jpg.asset.json";
import alleppeyAsset from "@/assets/dest-alleppey.jpg.asset.json";
const fortkochiFull = fortkochiAsset.url;
const varkalaFull = varkalaAsset.url;
const alleppeyFull = alleppeyAsset.url;
import communityDinner from "@/assets/community-dinner.jpg?format=webp&quality=72&w=900";
import communityWorkation from "@/assets/community-workation.jpg?format=webp&quality=72&w=900";
import communityCafe from "@/assets/community-cafe.jpg?format=webp&quality=72&w=900";
import communitySurf from "@/assets/community-surf.jpg?format=webp&quality=72&w=900";
import communityYoga from "@/assets/community-yoga.jpg?format=webp&quality=72&w=900";
import communityHouseboat from "@/assets/community-houseboat.jpg?format=webp&quality=72&w=900";
import { destinations } from "@/lib/destinations";
import { useSiteContent, defaultContent } from "@/lib/site-content";
import { useCmsTestimonials, usePageLayout, useCmsDestinations } from "@/lib/cms";
import { Fragment, type ReactNode } from "react";
import { HeroCarousel } from "@/components/site/HeroCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nomzy Escapes — Workations in Kerala" },
      { name: "description", content: "Curated workation stays for remote workers in Fort Kochi, Varkala, and Alleppey. Verified WiFi, monthly stays, local support." },
      { property: "og:title", content: "Nomzy Escapes — Workations in Kerala" },
      { property: "og:description", content: "Curated workation stays for remote workers in Fort Kochi, Varkala, and Alleppey. Verified WiFi, monthly stays, local support." },
      { property: "og:url", content: "https://kerala-escape-co.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://kerala-escape-co.lovable.app/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nomzy Escapes",
          url: "https://kerala-escape-co.lovable.app/",
          description: "Curated workation stays and immersive Kerala experiences for remote professionals.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Nomzy Escapes",
          url: "https://kerala-escape-co.lovable.app/",
        }),
      },
    ],
  }),
  component: Index,
});

const trustBarFallback = defaultContent.hero.trustBar;

const whyKerala = [
  { stat: "Fibre", unit: "", label: "High-speed, speed-tested WiFi across every curated stay." },
  { stat: "30–50%", unit: "", label: "Lower living costs than Bali, Lisbon or Chiang Mai." },
  { stat: "28°", unit: "C", label: "Year-round tropical climate. No winter, no excuses." },
  { stat: "#1", unit: "", label: "Safest state in India for long-stay travellers." },
  { stat: "Jio", unit: " · Airtel", label: "Backup 4G/5G connectivity across every destination." },
  { stat: "Inverter", unit: "-backed", label: "Power stability so deadlines never depend on the grid." },
];

const chapters = [
  {
    slug: "fort-kochi",
    name: "Fort Kochi",
    number: "Chapter I",
    image: fortkochiFull,
    mood: "Heritage & Cafés",
    quote: "Work between heritage streets and seaside cafés.",
    body: "Colonial verandahs, espresso at sunrise, gallery openings after dusk. An urban workation with five centuries of texture.",
  },
  {
    slug: "varkala",
    name: "Varkala",
    number: "Chapter II",
    image: varkalaFull,
    mood: "Surf & Wellness",
    quote: "Ocean views become your office.",
    body: "Red cliffs above the Arabian Sea. Surf at dawn, yoga at noon, deep work between the waves.",
  },
  {
    slug: "alleppey",
    name: "Alleppey",
    number: "Chapter III",
    image: alleppeyFull,
    mood: "Slow Living",
    quote: "Slow mornings. Deep work.",
    body: "Palm-shaded canals, paddy fields below sea level, and the most restorative silence in Kerala.",
  },
];

const featuredProperties = [
  {
    name: "The Heritage Verandah",
    destination: "Fort Kochi",
    image: destinations[0].image,
    wifi: "High-speed fibre",
    detail: "Restored colonial home with a private courtyard desk.",
  },
  {
    name: "Cliff Studio 07",
    destination: "Varkala",
    image: destinations[1].image,
    wifi: "High-speed fibre",
    detail: "Ocean-facing studio steps from the cliff path.",
  },
  {
    name: "The Backwater Studio",
    destination: "Alleppey",
    image: workspaceImg,
    wifi: "High-speed fibre",
    detail: "Standalone teakwood villa on a private canal.",
  },
];


const testimonials = [
  { quote: "Three weeks in Fort Kochi reset the way I work. Mornings on the verandah, video calls under colonial arches.", name: "Sofía Marín", role: "Product Designer", flag: "🇪🇸", country: "Spain", stay: "Stayed 3 weeks" },
  { quote: "Nomzy made Varkala effortless. The wifi was real, the cliff view was unreal, the local team felt like family.", name: "Daniel Okafor", role: "Founder", flag: "🇩🇪", country: "Germany", stay: "Stayed 5 weeks" },
  { quote: "Alleppey was the most productive month of my year. Nothing but water, paddy fields, and the work.", name: "Anya Kostova", role: "Writer", flag: "🇵🇹", country: "Portugal", stay: "Stayed 6 weeks" },
];

function Index() {
  const { data: hero } = useSiteContent("hero");
  const { data: experiencesContent } = useSiteContent("experiences");
  const { data: communityContent } = useSiteContent("community");
  const { data: signatureContent } = useSiteContent("signature");
  const sig = signatureContent ?? defaultContent.signature;

  const { data: cmsTestimonials } = useCmsTestimonials();
  const { data: layout } = usePageLayout("home");
  const { data: cmsDestinations } = useCmsDestinations();
  const liveChapters = (cmsDestinations ?? [])
    .filter((d) => d.published)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      image: d.image_url || "",
      mood: d.tagline || d.region || "",
    }));
  const displayChapters = liveChapters.length ? liveChapters : chapters;
  const h = hero ?? defaultContent.hero;
  const expItems = experiencesContent?.items?.length ? experiencesContent.items : defaultContent.experiences.items;
  const trustBar = h.trustBar?.length ? h.trustBar : trustBarFallback;
  const heroBg = h.imageUrl || heroImg;
  const liveTestimonials = (cmsTestimonials && cmsTestimonials.length > 0)
    ? cmsTestimonials.map((t) => ({
        quote: t.quote,
        name: t.author,
        role: t.role ?? "",
        flag: t.flag ?? "",
        country: t.country ?? "",
        stay: t.stay_length ?? "",
        image: t.image_url ?? "",
      }))
    : testimonials.map((t) => ({ ...t, image: "" }));

  const sections: Record<string, ReactNode> = {
    hero: (
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        <div className="relative z-10 container-editorial h-full flex flex-col justify-end pt-28 pb-16 md:pb-20 text-primary-foreground">
          <p className="eyebrow text-primary-foreground/80 animate-fade-up">{h.eyebrow}</p>
          <h1
            className="mt-5 font-display font-light max-w-5xl animate-fade-up tracking-[-0.03em] leading-[0.95] text-[clamp(2.75rem,6.5vw,6rem)]"
            dangerouslySetInnerHTML={{ __html: h.titleHtml }}
          />
          <div
            className="mt-6 max-w-xl text-base md:text-lg text-primary-foreground/90 leading-relaxed animate-fade-up [&_p]:my-1.5"
            dangerouslySetInnerHTML={{ __html: h.subtitleHtml }}
          />
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">
            <a
              href={h.primaryCtaTo}
              className="group inline-flex items-center gap-3 px-7 h-12 bg-accent text-accent-foreground text-xs tracking-[0.2em] uppercase hover:brightness-95 transition"
            >
              {h.primaryCtaLabel}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={h.secondaryCtaTo}
              className="inline-flex items-center px-7 h-12 border border-primary-foreground/40 text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              {h.secondaryCtaLabel}
            </a>
          </div>
          <ul className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 max-w-4xl border-t border-primary-foreground/15 pt-5 animate-fade-up">
            {trustBar.map((t) => (
              <li key={t} className="flex items-center gap-2 text-xs md:text-sm text-primary-foreground/90">
                <Check size={14} className="text-accent shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    prologue: (
      <section className="relative py-28 md:py-40 overflow-hidden" style={{ background: "#F5C542" }}>
        {/* Soft texture overlay */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 70% at 12% 20%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(55% 65% at 92% 85%, rgba(30,90,160,0.10), transparent 65%)",
          }}
        />
        <div className="container-editorial grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-3 reveal">
            <p className="eyebrow" style={{ color: "#1e3a6b" }}>Prologue</p>
            <span
              aria-hidden
              className="mt-4 block h-px w-16"
              style={{ background: "linear-gradient(90deg,#1e3a6b,#0d1b3d)" }}
            />
          </div>
          <h2 className="md:col-span-9 reveal font-display font-light text-3xl md:text-5xl leading-[1.15] tracking-[-0.02em]" data-reveal-delay="120" style={{ color: "#1a1208" }}>
            A different kind of base — tropical,{" "}
            <span style={{ color: "#1e3a6b" }}>affordable</span>, English-friendly,
            and quietly built for long, focused stays.{" "}
            <span className="italic" style={{ color: "#6b3410" }}>
              This is Kerala, on your terms.
            </span>
          </h2>
        </div>
      </section>
    ),

    about: (
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,197,66,0.06) 0%, rgba(30,90,160,0.05) 100%)",
        }}
      >
        <div className="container-editorial grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-4">
            <p className="eyebrow reveal" style={{ color: "#1e5aa0" }}>About Nomzy Escapes</p>
            <h2 className="reveal mt-5 font-display font-light text-3xl md:text-4xl leading-[1.15] tracking-[-0.02em]" data-reveal-delay="120">
              Workations, rooted in{" "}
              <em style={{ color: "#b8892a" }}>Kerala&rsquo;s</em> culture.
            </h2>
            <span
              aria-hidden
              className="reveal mt-6 block h-[2px] w-20"
              style={{ background: "linear-gradient(90deg,#F5C542,#1e5aa0)" }}
              data-reveal-delay="240"
            />
          </div>
          <div
            className="md:col-span-8 space-y-5 text-base md:text-lg leading-relaxed text-muted-foreground reveal pl-0 md:pl-8 md:border-l"
            style={{ borderColor: "rgba(30,90,160,0.18)" }}
            data-reveal-delay="200"
          >
            <p>
              Nomzy Escapes curates long-stay workations across Kerala — pairing
              fibre-fast, workspace-ready homes with the soul of the place around
              them. We hand-pick every property, verify the WiFi, and partner with
              local hosts so you arrive to a stay that simply works.
            </p>
            <p>
              Beyond the desk, our on-the-ground team weaves in the culture you
              came for: Kathakali evenings in Fort Kochi, sunrise yoga on Varkala
              cliffs, slow houseboat mornings in Alleppey, home-cooked Sadhya
              lunches, spice-trail walks, surf lessons, Ayurveda rituals, and
              quiet temple visits — guided by the people who live them.
            </p>
            <p className="text-foreground/85 font-medium">
              One concierge, verified stays, real local experiences.{" "}
              <span style={{ color: "#1e5aa0" }}>That&rsquo;s the Nomzy way.</span>
            </p>
          </div>
        </div>
      </section>
    ),

    signature: (
      <section className="py-28 md:py-36">
        <div className="container-editorial mb-20">
          <p className="eyebrow reveal">{sig.eyebrow}</p>
          <h2 className="reveal mt-6 display-xl max-w-4xl" data-reveal-delay="120">
            {sig.heading} <span className="italic font-light">{sig.headingItalic}</span>
          </h2>
        </div>

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 h-auto md:h-[80vh]">
          {displayChapters.map((c) => (
            <Link
              key={c.slug}
              to="/destinations/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden block aspect-[3/4] md:aspect-auto md:h-full"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-primary-foreground">
                <p className="eyebrow text-primary-foreground/70">{c.mood}</p>
                <h3 className="mt-4 font-display font-light text-5xl md:text-6xl leading-[0.95] tracking-[-0.03em]">{c.name}</h3>
                <div className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    ),
    whyKerala: (
      <>
        {/* Experience marquee */}
        <section className="py-12 md:py-16 border-y border-border bg-background overflow-hidden">
          <div className="container-editorial flex items-end justify-between mb-6">
            <p className="eyebrow">Experiences · A glimpse of Kerala</p>
            <Link to="/experiences" className="link-underline hidden md:inline-flex text-xs tracking-[0.2em] uppercase items-center gap-2">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="group relative">
            <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
              {[...expItems, ...expItems].map((e, i) => (
                <figure key={i} className="relative h-56 md:h-72 aspect-[4/5] overflow-hidden shrink-0 bg-muted">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <div className="font-display text-base leading-tight">{e.title}</div>
                    <div className="mt-0.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase text-white/70">{e.region}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-14 md:py-20">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-10">
              <p className="eyebrow reveal text-primary-foreground/60">01 — Why Kerala</p>
              <Link to="/destinations" className="reveal link-underline hidden md:inline-flex text-xs tracking-[0.2em] uppercase items-center gap-2">
                Explore destinations <ArrowRight size={14} />
              </Link>
            </div>
            <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
              {whyKerala.map((k, i) => (
                <div key={k.label} className="border-t border-primary-foreground/20 pt-5">
                  <span className="font-mono text-xs text-primary-foreground/50">0{i + 1}</span>
                  <div className="mt-3 font-display font-light text-2xl md:text-3xl leading-[1.05] tracking-[-0.02em]">
                    {k.stat}
                    {k.unit && <span className="text-primary-foreground/40 text-[0.45em] align-top ml-2">{k.unit}</span>}
                  </div>
                  <p className="mt-3 max-w-sm text-sm text-primary-foreground/75 leading-relaxed">{k.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    ),

    howItWorks: (
      <section className="py-28 md:py-36">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-4">
              <p className="eyebrow reveal">03 — How it works</p>
            </div>
            <h2 className="md:col-span-8 reveal display-xl" data-reveal-delay="120">
              A workation, <span className="italic">fully arranged</span> before you land.
            </h2>
          </div>
          <ol className="reveal-stagger grid md:grid-cols-3 gap-px bg-border">
            {[
              { n: "01", t: "Tell us your plans", b: "Share your dates, budget, and the way you like to work." },
              { n: "02", t: "We curate your stay", b: "Handpicked properties, workspaces, and local experiences." },
              { n: "03", t: "Arrive and work", b: "Everything — wifi, transfers, support — sorted before arrival." },
            ].map((s) => (
              <li key={s.n} className="bg-background p-10 md:p-12">
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                <h3 className="mt-8 font-display font-light text-4xl tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    ),
    collection: (
      <section className="py-28 md:py-36 bg-muted/40">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-20 items-end">
            <div className="md:col-span-7">
              <p className="eyebrow reveal">04 — The Collection</p>
              <h2 className="reveal mt-6 display-xl" data-reveal-delay="120">
                Signature <span className="italic">stays.</span>
              </h2>
            </div>
            <p className="md:col-span-5 reveal text-muted-foreground leading-relaxed" data-reveal-delay="200">
              A small, deliberate collection — one signature property from each destination. Every stay is
              speed-tested, atmosphere-first, and curated for long-form work.
            </p>
          </div>
          <div className="reveal-stagger grid md:grid-cols-3 gap-8 md:gap-12">
            {featuredProperties.map((p) => (
              <article key={p.name} className="group">
                <div className="image-zoom aspect-[3/4] relative">
                  <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="mt-6">
                  <div className="eyebrow text-[0.65rem]">{p.destination}</div>
                  <h3 className="mt-3 font-display font-light text-3xl tracking-[-0.02em]">{p.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.detail}</p>
                  <div className="mt-5 flex items-center text-xs border-t border-border pt-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Wifi size={12} /> {p.wifi}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    connectivity: null,
    testimonials: null,
    community: (() => {
      const fallbackImages = [communityDinner, communityWorkation, communityCafe, communitySurf, communityYoga, communityHouseboat];
      const c = communityContent ?? defaultContent.community;
      const items = c.items.map((it, i) => ({
        src: it.image || fallbackImages[i] || fallbackImages[0],
        alt: it.alt || it.caption,
        caption: it.caption,
      }));
      return (
        <section className="py-28 md:py-36 bg-muted/30">
          <div className="container-editorial">
            <div className="grid md:grid-cols-12 gap-10 mb-16 items-end">
              <div className="md:col-span-7">
                <p className="eyebrow reveal">{c.eyebrow}</p>
                <h2
                  className="reveal mt-6 display-xl"
                  data-reveal-delay="120"
                  dangerouslySetInnerHTML={{ __html: c.titleHtml }}
                />
              </div>
              <p className="md:col-span-5 reveal text-muted-foreground leading-relaxed" data-reveal-delay="200">
                {c.intro}
              </p>
            </div>
            <div className="reveal-stagger grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {items.map((p, i) => (
                <figure key={`${p.caption}-${i}`}>
                  <div className="image-zoom aspect-square relative">
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      );
    })(),

    retreats: (
      <section className="py-24 md:py-32 border-y border-border bg-muted/40">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow reveal">07 — For teams</p>
            <h2 className="reveal mt-6 display-xl" data-reveal-delay="120">
              An offsite in <span className="italic">Kerala?</span>
            </h2>
            <ul className="reveal mt-10 grid sm:grid-cols-3 gap-6 text-sm" data-reveal-delay="200">
              {["Team retreats", "Startup offsites", "Leadership retreats"].map((x) => (
                <li key={x} className="border-t border-border pt-4">
                  <Check size={14} className="text-accent" />
                  <div className="mt-3 font-display text-xl">{x}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5 md:text-right">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-7 h-12 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase"
            >
              Explore Corporate Retreats
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    ),
    cta: (
      <section className="py-12 md:py-16">
        <div className="container-editorial">
          <div className="reveal reveal-scale relative overflow-hidden bg-accent text-accent-foreground p-6 md:p-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
              <div>
                <p className="eyebrow text-accent-foreground/70">Begin</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl leading-[1.05] tracking-[-0.02em]">
                  Plan your <span className="italic">Kerala</span> workation.
                </h2>
                <p className="mt-3 max-w-md text-sm text-accent-foreground/80 leading-relaxed">
                  Tell us how long you have. We&rsquo;ll design the stay, the wifi, and everything in between.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 h-11 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group justify-self-start md:justify-self-end"
              >
                Start an enquiry
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  const order = layout ?? Object.keys(sections).map((id) => ({ id, label: id, visible: true }));
  return (
    <>
      {order.map((s) =>
        s.visible && sections[s.id] ? <Fragment key={s.id}>{sections[s.id]}</Fragment> : null,
      )}
    </>
  );
}

