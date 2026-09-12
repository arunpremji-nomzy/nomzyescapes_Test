import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MapPin, Wifi, Calendar } from "lucide-react";
import { destinations, getDestination, type Destination } from "@/lib/destinations";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }): { dest: Destination } => {
    const dest = getDestination(params.slug);
    if (!dest) throw notFound();
    return { dest };
  },
  head: ({ loaderData, params }) => {
    const d = loaderData?.dest;
    const title = d ? `${d.name} Workation — Nomzy Escapes` : "Destination — Nomzy Escapes";
    const description = d ? `${d.name} workation: ${d.tagline}` : "Kerala workation destination.";
    const canonical = `https://kerala-escape-co.lovable.app/destinations/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        ...(d ? [{ property: "og:image", content: d.image as unknown as string }] : []),
      ],
      links: d ? [{ rel: "canonical", href: canonical }] : [],
      scripts: d
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: d.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            },
          ]
        : [],
    };
  },
  component: DestinationDetail,
  notFoundComponent: () => (
    <div className="pt-40 pb-32 container-editorial text-center">
      <h1 className="font-display text-5xl">Destination not found</h1>
      <Link to="/destinations" className="mt-8 inline-flex items-center gap-2 text-sm">
        Back to all destinations <ArrowRight size={14} />
      </Link>
    </div>
  ),
});

function DestinationDetail() {
  const { dest: d } = Route.useLoaderData() as { dest: Destination };
  const others = destinations.filter((x) => x.slug !== d.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
        <div className="relative z-10 container-editorial h-full flex flex-col justify-end pb-20 text-primary-foreground">
          <div className="flex items-center gap-2 eyebrow text-primary-foreground/80">
            <MapPin size={12} /> {d.region} · Kerala
          </div>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] animate-fade-up">
            {d.name}
          </h1>
          <p className="mt-6 max-w-xl font-display italic text-xl md:text-2xl text-primary-foreground/90">
            {d.tagline}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <p className="eyebrow">Overview</p>
          </div>
          <div className="md:col-span-9">
            <p className="font-display text-3xl md:text-4xl leading-snug">{d.overview}</p>
            <div className="mt-10 flex flex-wrap gap-2">
              {d.vibe.map((v) => (
                <span key={v} className="px-4 h-9 inline-flex items-center border border-border text-xs tracking-[0.18em] uppercase">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-16 bg-muted/40 border-b border-border">
        <div className="container-editorial grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          <Fact icon={<Wifi size={16} />} label="Connectivity" value={d.wifi} />
          <Fact icon={<Calendar size={16} />} label="Best Season" value={d.bestSeason} />
          <Fact label="Curated Stays" value={`${d.stays} properties`} />
        </div>
      </section>

      {/* Why Work From Here */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <p className="eyebrow">Why work from here</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl max-w-3xl">{d.workation}</h2>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {d.highlights.map((h, i) => (
              <div key={h.title} className="bg-background p-8 lg:p-10">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl">{h.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="container-editorial">
          <p className="eyebrow text-primary-foreground/60">Top Experiences</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl">In and around {d.name}.</h2>
          <ul className="mt-16 divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
            {d.experiences.map((e, i) => (
              <li key={e} className="flex items-baseline gap-8 py-6 group">
                <span className="font-mono text-xs text-primary-foreground/50 w-10">0{i + 1}</span>
                <span className="font-display text-3xl md:text-4xl flex-1 group-hover:text-accent transition-colors">{e}</span>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Day in the life */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <p className="eyebrow">A day in {d.name}</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">A sample rhythm from our long-stay guests — adapt it to your own.</p>
          </div>
          <ol className="md:col-span-9 divide-y divide-border border-y border-border">
            {d.dayInLife.map((step) => (
              <li key={step.time} className="grid grid-cols-12 gap-6 py-6">
                <div className="col-span-3 md:col-span-2 font-mono text-sm text-muted-foreground">{step.time}</div>
                <div className="col-span-9 md:col-span-10">
                  <h3 className="font-display text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing — hidden for Fort Kochi */}
      {d.slug !== "fort-kochi" && (
        <section className="py-24 md:py-32 border-b border-border bg-muted/40">
          <div className="container-editorial">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <p className="eyebrow">What it costs</p>
                <h2 className="mt-4 font-display text-5xl md:text-6xl">From {d.weeklyPrice} a week.</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">Indicative rates from our verified partners. Final pricing is shared on enquiry.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {d.pricing.map((p) => (
                <div key={p.label} className="bg-background p-8">
                  <p className="eyebrow text-muted-foreground">{p.label}</p>
                  <p className="mt-4 font-display text-3xl">{p.value}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Logistics */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <p className="eyebrow">Getting there & living here</p>
          </div>
          <dl className="md:col-span-9 grid sm:grid-cols-2 gap-px bg-border border border-border">
            {d.logistics.map((l) => (
              <div key={l.label} className="bg-background p-6">
                <dt className="eyebrow text-muted-foreground">{l.label}</dt>
                <dd className="mt-2 font-display text-lg leading-snug">{l.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Nearby */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container-editorial">
          <p className="eyebrow">Worth the detour</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl max-w-3xl">Day trips from {d.name}.</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-border border border-border">
            {d.nearby.map((n) => (
              <div key={n.name} className="bg-background p-8">
                <p className="font-mono text-xs text-muted-foreground">{n.distance} away</p>
                <h3 className="mt-4 font-display text-2xl">{n.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{n.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 font-display text-5xl">Good to know.</h2>
          </div>
          <div className="md:col-span-8 divide-y divide-border border-y border-border">
            {d.faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                  <span className="font-display text-2xl leading-snug">{f.q}</span>
                  <span className="font-mono text-xs text-muted-foreground mt-2 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* Inquiry */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="bg-accent text-accent-foreground p-12 md:p-20 grid md:grid-cols-2 gap-12 items-end">
            <div>
              <p className="eyebrow text-accent-foreground/70">Begin</p>
              <h2 className="mt-4 font-display text-5xl md:text-6xl">Plan your {d.name} workation.</h2>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group"
              >
                Start an enquiry
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other destinations */}
      <section className="pb-32">
        <div className="container-editorial">
          <p className="eyebrow mb-10">Other destinations</p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/destinations/$slug"
                params={{ slug: o.slug }}
                className="group block hover-lift"
              >
                <div className="image-zoom relative aspect-[16/10]">
                  <img src={o.image} alt={o.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                    <p className="eyebrow text-primary-foreground/70">{o.region}</p>
                    <h3 className="mt-2 font-display text-3xl">{o.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Fact({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-background p-6 md:p-8">
      <div className="eyebrow flex items-center gap-2">{icon}{label}</div>
      <div className="mt-3 font-display text-xl">{value}</div>
    </div>
  );
}
