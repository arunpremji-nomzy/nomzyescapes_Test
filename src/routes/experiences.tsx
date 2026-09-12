import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Local Experiences — Nomzy Escapes" },
      { name: "description", content: "Ten immersive Kerala experiences for long-stay guests — village canals, tea plantation walks, Theyyam rituals, and Ayurvedic wellness." },
      { property: "og:title", content: "Local Experiences — Nomzy Escapes" },
      { property: "og:description", content: "Curated Kerala experiences: backwaters, tea hills, surf, Kathakali, Theyyam, Ayurveda and more." },
    ],
    links: [{ rel: "canonical", href: "/experiences" }],
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  const { data } = useSiteContent("experiences");
  if (!data) return null;
  const experiences = data.items;

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 border-b border-border">
        <div className="container-editorial">
          <p className="eyebrow">{data.eyebrow}</p>
          <h1
            className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] max-w-4xl [&_em]:italic [&_em]:text-[#b8892a]"
            dangerouslySetInnerHTML={{ __html: data.titleHtml }}
          />
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {data.intro}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {experiences.map((e, i) => (
              <article key={e.title + i} className="group hover-lift">
                <div className="image-zoom relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[0.65rem] tracking-[0.2em] text-white/85">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="eyebrow text-white/70">{e.region}</p>
                    <h2 className="mt-2 font-display text-2xl md:text-[1.7rem] leading-tight">{e.title}</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{e.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="container-editorial">
          <div className="bg-accent text-accent-foreground p-12 md:p-20 grid md:grid-cols-2 gap-10 items-end">
            <div>
              <p className="eyebrow text-accent-foreground/70">{data.ctaEyebrow}</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{data.ctaTitle}</h2>
            </div>
            <div className="flex md:justify-end">
              <Link
                to={data.ctaTo as string}
                className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group"
              >
                {data.ctaLabel}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
