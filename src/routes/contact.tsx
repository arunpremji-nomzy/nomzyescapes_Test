import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Wifi, MapPin, Users, Sparkles, Compass, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, defaultContent } from "@/lib/site-content";
import alleppeyAsset from "@/assets/dest-alleppey.jpg.asset.json";
import fortKochiAsset from "@/assets/dest-fortkochi.jpg.asset.json";
import varkalaAsset from "@/assets/dest-varkala.jpg.asset.json";
const heroImg = alleppeyAsset.url;
const fortKochi = fortKochiAsset.url;
const varkala = varkalaAsset.url;
const alleppey = alleppeyAsset.url;
import workspace from "@/assets/property-workspace.jpg?format=webp&quality=72&w=1400";
import keralaHero from "@/assets/hero-kerala.jpg?format=webp&quality=72&w=1400";

const CONCIERGE_ICONS: Record<string, typeof MapPin> = { MapPin, Check, Sparkles, Compass, Wifi, Users };
const fallbackDestImage = (slug: string) =>
  slug === "fort-kochi" ? fortKochi : slug === "varkala" ? varkala : slug === "alleppey" ? alleppey : fortKochi;
const fallbackExpImage = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("heritage")) return fortKochi;
  if (t.includes("surf")) return varkala;
  if (t.includes("backwater")) return alleppey;
  if (t.includes("ayurveda")) return keralaHero;
  return workspace;
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Plan My Stay — Nomzy Escapes Concierge" },
      { name: "description", content: "A guided concierge journey to design your Kerala workation — destination, dates, work style, experiences. We curate the rest." },
      { property: "og:title", content: "Plan My Stay — Nomzy Escapes" },
      { property: "og:description", content: "Your Kerala workation, designed around how you live and work." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const trust = [
  "Verified High-Speed WiFi",
  "Long-Stay Friendly",
  "Local Concierge Support",
  "Handpicked Properties",
  "Flexible Experiences",
];

const travellerOptions = ["Solo", "Couple", "Friends", "Team Retreat"];
const stayLengths = ["Weekend", "1 Week", "2–4 Weeks", "1–3 Months", "Custom"];
const priorities = [
  "Fast WiFi", "Private Workspace", "Beach Access", "Wellness",
  "Culture", "Quiet Environment", "Long Stay Discounts", "Team Retreat",
];

const experiences = [
  { title: "Heritage Walks", place: "Fort Kochi", image: fortKochi },
  { title: "Surf Sessions", place: "Varkala", image: varkala },
  { title: "Backwater Mornings", place: "Alleppey", image: alleppey },
  { title: "Ayurveda & Wellness", place: "Across Kerala", image: keralaHero },
  { title: "Local Food Experiences", place: "Across Kerala", image: workspace },
];

const testimonials = [
  { quote: "Nomzy made Kerala feel effortless. From WiFi to local recommendations, everything was perfectly arranged.", name: "Daniel Okafor", country: "Germany", stay: "Stayed 6 weeks", flag: "🇩🇪" },
  { quote: "The concierge knew exactly where I'd thrive. Three weeks in Fort Kochi felt like a private membership club.", name: "Sofía Marín", country: "Spain", stay: "Stayed 3 weeks", flag: "🇪🇸" },
  { quote: "I came for one month and stayed for three. Nothing was a transaction — every detail felt personal.", name: "Anya Kostova", country: "Portugal", stay: "Stayed 12 weeks", flag: "🇵🇹" },
];

const faqs = [
  { q: "How fast is the WiFi?", a: "Every property is fibre-tested for sustained video calls and screen-share, with backup 4G/5G via Jio and Airtel, and inverter-backed power for outages." },
  { q: "Can I stay for several months?", a: "Yes. Most properties offer long-stay rates from 30+ nights, and our concierge can negotiate extended stays of 3–6 months." },
  { q: "Do you arrange experiences?", a: "Houseboats, Ayurveda, surf lessons, cooking classes, heritage walks — your concierge curates everything based on your interests." },
  { q: "Can you help with airport transfers?", a: "Yes. We arrange private transfers from Kochi or Trivandrum airports, and any inter-city travel during your stay." },
  { q: "Can teams book retreats?", a: "Absolutely. We design 5–14 day team retreats with workspaces, group accommodation, experiences, and on-the-ground support." },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [traveller, setTraveller] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: contactDestData } = useSiteContent("contactDestinations");
  const { data: contactConciergeData } = useSiteContent("contactConcierge");
  const { data: contactExpData } = useSiteContent("contactExperiences");
  const destSection = contactDestData ?? defaultContent.contactDestinations;
  const concierge = contactConciergeData ?? defaultContent.contactConcierge;
  const expSection = contactExpData ?? defaultContent.contactExperiences;
  const destinationOptions = destSection.items.map((d) => ({
    ...d,
    image: d.image || fallbackDestImage(d.slug),
  }));
  const experiences = expSection.items.map((e) => ({
    ...e,
    image: e.image || fallbackExpImage(e.title),
  }));

  const togglePriority = (p: string) =>
    setSelectedPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const messageParts = [
      traveller && `Travelling as: ${traveller}`,
      length && `Stay length: ${length}`,
      selectedPriorities.length && `Priorities: ${selectedPriorities.join(", ")}`,
    ].filter(Boolean);
    try {
      const { error } = await (supabase as any).from("inquiries").insert({
        source: "contact",
        destination: destination || null,
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("whatsapp") || "") || null,
        party_size: traveller || null,
        message: messageParts.join("\n") || null,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Inquiry sent", { description: "Your concierge will be in touch." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* HERO — split screen */}
      <section className="relative min-h-screen grid md:grid-cols-2 pt-24 md:pt-0">
        <div className="flex items-center px-6 md:px-16 lg:px-24 py-20 md:py-32 bg-background order-2 md:order-1">
          <div className="max-w-xl">
            <p className="eyebrow">Concierge · By Invitation Feel</p>
            <h1 className="mt-8 font-display font-light text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.03em]">
              Your Kerala workation,<br />
              <span className="italic">designed around</span> how you live and work.
            </h1>
            <p className="mt-8 text-muted-foreground leading-relaxed text-base md:text-lg max-w-md">
              Tell us your preferred destination, travel dates, work style, and interests.
              We&rsquo;ll curate the ideal stay, experiences, and local recommendations for you.
            </p>
            <a href="#journey" className="mt-10 inline-flex items-center gap-3 px-7 h-12 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group">
              Begin Your Journey
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
        <div className="relative order-1 md:order-2 h-[55vh] md:h-auto md:min-h-screen overflow-hidden">
          <img
            src={heroImg}
            alt="Kerala backwaters at golden hour"
            className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-primary-foreground">
            <p className="eyebrow text-primary-foreground/70">Backwaters · Alleppey</p>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border py-8 bg-muted/30">
        <div className="container-editorial">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-3 text-xs md:text-sm">
                <Check size={14} className="text-accent shrink-0" />
                <span className="tracking-wide">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* JOURNEY — guided steps */}
      <section id="journey" className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <p className="md:col-span-3 eyebrow">The Journey</p>
            <h2 className="md:col-span-9 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
              Four quiet steps. <span className="italic text-muted-foreground">No forms to fill out twice.</span>
            </h2>
          </div>

          {sent ? (
            <div className="border border-border p-12 md:p-20 bg-muted/40 max-w-3xl mx-auto text-center">
              <p className="eyebrow">Received</p>
              <h2 className="mt-6 font-display font-light text-5xl md:text-6xl tracking-[-0.02em]">Thank you.</h2>
              <p className="mt-6 text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your concierge will be in touch within one working day with a tailored proposal,
                photographs of the shortlisted properties, and a few questions to refine the stay.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-24">

              {/* Step 01 */}
              <Step number="01" title="Who are you travelling with?">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {travellerOptions.map((opt) => (
                    <ChoiceCard
                      key={opt}
                      active={traveller === opt}
                      onClick={() => setTraveller(opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </Step>

              {/* Step 02 */}
              <Step number={destSection.eyebrow.replace(/^Step\s*/i, "") || "02"} title={destSection.title}>
                <div className="grid md:grid-cols-3 gap-6">
                  {destinationOptions.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => setDestination(d.slug)}
                      className={`group relative aspect-[3/4] overflow-hidden text-left transition-all ${
                        destination === d.slug ? "ring-2 ring-accent ring-offset-4 ring-offset-background" : ""
                      }`}
                    >
                      <img src={d.image} alt={d.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
                      <div className="absolute inset-0 p-7 flex flex-col justify-end text-primary-foreground">
                        <p className="eyebrow text-primary-foreground/80">{d.tag}</p>
                        <h3 className="mt-3 font-display font-light text-4xl tracking-[-0.02em]">{d.name}</h3>
                        {destination === d.slug && (
                          <div className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                            <Check size={14} className="text-accent" /> Selected
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDestination("undecided")}
                    className={`md:col-span-3 border border-dashed border-border p-6 text-sm text-muted-foreground hover:border-foreground transition-colors text-center ${
                      destination === "undecided" ? "border-foreground text-foreground" : ""
                    }`}
                  >
                    {destSection.undecidedLabel}
                  </button>
                </div>
              </Step>

              {/* Step 03 */}
              <Step number="03" title="How long will you stay?">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                  {stayLengths.map((opt) => (
                    <ChoiceCard
                      key={opt}
                      active={length === opt}
                      onClick={() => setLength(opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </Step>

              {/* Step 04 */}
              <Step number="04" title="What's important to you?">
                <p className="text-muted-foreground text-sm -mt-4 mb-6">Select all that apply.</p>
                <div className="flex flex-wrap gap-3">
                  {priorities.map((p) => {
                    const active = selectedPriorities.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePriority(p)}
                        className={`px-5 h-11 text-sm border transition-all ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {active && <Check size={13} className="inline mr-2 -mt-px" />}
                        {p}
                      </button>
                    );
                  })}
                </div>
              </Step>

              {/* Step 05 — Contact */}
              <Step number="05" title="Where shall we reach you?">
                <div className="grid md:grid-cols-3 gap-8">
                  <Field label="Full name">
                    <input required type="text" name="name" className="form-input" />
                  </Field>
                  <Field label="Email">
                    <input required type="email" name="email" className="form-input" />
                  </Field>
                  <Field label="WhatsApp (optional)">
                    <input type="tel" name="whatsapp" className="form-input" />
                  </Field>
                </div>
                <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-border pt-10">
                  <p className="text-sm text-muted-foreground max-w-md">
                    A concierge will respond within one working day with a private proposal.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-3 px-8 h-14 bg-accent text-accent-foreground text-xs tracking-[0.2em] uppercase self-start md:self-auto disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send To My Concierge"}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Step>
            </form>
          )}
        </div>
      </section>

      {/* CONCIERGE — dark editorial */}
      <section className="bg-primary text-primary-foreground py-28 md:py-36">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden">
            <img src={concierge.image || workspace} alt="Local Kerala concierge" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="md:col-span-7 md:pl-8">
            <p className="eyebrow text-primary-foreground/60">{concierge.eyebrow}</p>
            <h2 className="mt-6 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]" dangerouslySetInnerHTML={{ __html: concierge.titleHtml }} />
            <p className="mt-8 text-primary-foreground/75 leading-relaxed max-w-xl">
              {concierge.body}
            </p>
            <ul className="mt-12 grid sm:grid-cols-2 gap-px bg-primary-foreground/10">
              {concierge.features.map((x) => {
                const Icon = CONCIERGE_ICONS[x.icon] ?? MapPin;
                return (
                  <li key={x.label} className="bg-primary p-6 flex items-center gap-4">
                    <Icon size={20} className="text-accent shrink-0" />
                    <span className="text-sm">{x.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* SIGNATURE EXPERIENCES */}
      <section className="py-28 md:py-36">
        <div className="container-editorial mb-20">
          <p className="eyebrow reveal">{expSection.eyebrow}</p>
          <h2 className="mt-6 font-display font-light text-5xl md:text-7xl leading-[0.98] tracking-[-0.03em] max-w-4xl" dangerouslySetInnerHTML={{ __html: expSection.titleHtml }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-[70vh]">
          {experiences.map((e) => (
            <div key={e.title} className="group relative overflow-hidden aspect-[3/4] md:aspect-auto">
              <img src={e.image} alt={e.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/75" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <p className="eyebrow text-primary-foreground/70 text-[0.62rem]">{e.place}</p>
                <h3 className="mt-2 font-display font-light text-2xl md:text-3xl leading-tight tracking-[-0.02em]">{e.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 md:py-36">
        <div className="container-editorial max-w-5xl">
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <p className="md:col-span-3 eyebrow">Considerations</p>
            <h2 className="md:col-span-9 font-display font-light text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
              Frequently <span className="italic">asked.</span>
            </h2>
          </div>
          <div className="border-t border-border">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full py-7 flex items-center justify-between gap-6 text-left group"
                  >
                    <span className="font-display font-light text-2xl md:text-3xl tracking-[-0.02em] group-hover:text-muted-foreground transition-colors">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={22}
                      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      open ? "grid-rows-[1fr] pb-8" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container-editorial">
          <div className="relative overflow-hidden bg-accent text-accent-foreground p-12 md:p-20 lg:p-28">
            <div className="grid md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-8">
                <p className="eyebrow text-accent-foreground/70">Begin</p>
                <h2 className="mt-6 font-display font-light text-5xl md:text-7xl leading-[0.98] tracking-[-0.03em]">
                  Let&rsquo;s create your <span className="italic">perfect Kerala workation.</span>
                </h2>
                <p className="mt-8 max-w-lg text-accent-foreground/85 leading-relaxed">
                  Tell us where you&rsquo;d like to work from and we&rsquo;ll take care of the details.
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <a
                  href="#journey"
                  className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase group"
                >
                  Start My Journey
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--border);
          padding: 0.75rem 0;
          font-size: 1rem;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: var(--foreground); }
      `}</style>
    </>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-12 gap-6 md:gap-10">
      <div className="md:col-span-3">
        <div className="font-mono text-xs text-muted-foreground">Step {number}</div>
        <h3 className="mt-4 font-display font-light text-3xl md:text-4xl leading-tight tracking-[-0.02em]">{title}</h3>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

function ChoiceCard({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-20 md:h-24 border text-sm md:text-base font-display font-light tracking-[-0.01em] transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border hover:border-foreground bg-background"
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3">{label}</span>
      {children}
    </label>
  );
}
