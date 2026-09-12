import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, LogOut, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, useSiteContent, useUpdateSiteContent } from "@/lib/site-content";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({
    meta: [
      { title: "Site Content · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ContentAdmin,
});

function ContentAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"hero" | "settings" | "faqs" | "experiences" | "community" | "signature" | "signatureExp" | "features" | "contactDest" | "contactConcierge" | "contactExp">("hero");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return setIsAdmin(false);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) return <p className="p-12 text-sm text-muted-foreground">Loading…</p>;
  if (isAdmin === false) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto text-muted-foreground" size={32} />
          <h1 className="mt-6 font-display font-light text-3xl">Not authorised</h1>
          <button onClick={signOut} className="mt-6 text-sm underline text-muted-foreground">Sign out</button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background pt-28 pb-20">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="eyebrow text-muted-foreground">Concierge Desk</p>
            <h1 className="mt-3 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">
              Site Content
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit the live website copy, settings and FAQs.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Inquiries</Link>
            <Link to="/admin/properties" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Properties</Link>
            <Link to="/admin/destinations" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Destinations</Link>
            <Link to="/admin/testimonials" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Testimonials</Link>
            <Link to="/admin/layout" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Page Builder</Link>
            <Link to="/" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">View site</Link>
            <button onClick={signOut} className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          {([
            ["hero", "hero"],
            ["settings", "settings"],
            ["faqs", "faqs"],
            ["experiences", "experiences"],
            ["community", "community"],
            ["signature", "signature (mood)"],
            ["signatureExp", "signature · experiences"],
            ["features", "features"],


            ["contactDest", "contact · destinations"],
            ["contactConcierge", "contact · concierge"],
            ["contactExp", "contact · experiences"],
          ] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-9 text-xs tracking-[0.18em] uppercase border transition-colors ${
                tab === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "hero" && <HeroEditor />}
          {tab === "settings" && <SettingsEditor />}
          {tab === "faqs" && <FaqsEditor />}
          {tab === "experiences" && <ExperiencesEditor />}
          {tab === "community" && <CommunityEditor />}
          {tab === "signature" && <SignatureEditor />}
          {tab === "signatureExp" && <SignatureExperiencesEditor />}
          {tab === "features" && <FeaturesEditor />}


          {tab === "contactDest" && <ContactDestinationsEditor />}
          {tab === "contactConcierge" && <ContactConciergeEditor />}
          {tab === "contactExp" && <ContactExperiencesEditor />}
        </div>
      </div>
    </section>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="border-t border-border pt-6 mt-8 flex justify-end">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase disabled:opacity-60"
      >
        <Save size={14} /> {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function HeroEditor() {
  const { data } = useSiteContent("hero");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.hero | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.hero>(k: K, v: typeof defaultContent.hero[K]) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow (small text above headline)">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
      </Section>
      <Section label="Headline (rich text — use italic for accents)">
        <RichTextEditor value={draft.titleHtml} onChange={(v) => set("titleHtml", v)} minHeight={120} />
      </Section>
      <Section label="Subtitle">
        <RichTextEditor value={draft.subtitleHtml} onChange={(v) => set("subtitleHtml", v)} minHeight={100} />
      </Section>
      <div className="grid sm:grid-cols-2 gap-4">
        <Section label="Primary CTA label">
          <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.primaryCtaLabel} onChange={(e) => set("primaryCtaLabel", e.target.value)} />
        </Section>
        <Section label="Primary CTA link (e.g. /contact)">
          <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.primaryCtaTo} onChange={(e) => set("primaryCtaTo", e.target.value)} />
        </Section>
        <Section label="Secondary CTA label">
          <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.secondaryCtaLabel} onChange={(e) => set("secondaryCtaLabel", e.target.value)} />
        </Section>
        <Section label="Secondary CTA link">
          <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.secondaryCtaTo} onChange={(e) => set("secondaryCtaTo", e.target.value)} />
        </Section>
      </div>
      <Section label="Hero background image (leave empty for default)">
        <ImageUploader value={draft.imageUrl ?? ""} onChange={(v) => set("imageUrl", v)} folder="hero" />
      </Section>
      <Section label="Trust bar items (one per line)">
        <textarea
          className="w-full min-h-[120px] p-3 border border-border bg-background text-sm"
          value={draft.trustBar.join("\n")}
          onChange={(e) => set("trustBar", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      </Section>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "hero", value: draft }, { onSuccess: () => toast.success("Hero saved") })}
      />
    </div>
  );
}

function SettingsEditor() {
  const { data } = useSiteContent("settings");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.settings | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.settings>(k: K, v: string) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <Section label="Brand name"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.brand} onChange={(e) => set("brand", e.target.value)} /></Section>
        <Section label="Brand suffix"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.brandSuffix} onChange={(e) => set("brandSuffix", e.target.value)} /></Section>
        <Section label="Contact phone (display)"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Section>
        <Section label="WhatsApp number (digits only, with country code)"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Section>
        <Section label="Contact email"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.email} onChange={(e) => set("email", e.target.value)} /></Section>
      </div>
      <Section label="Footer tagline">
        <textarea className="w-full min-h-[80px] p-3 border border-border bg-background text-sm" value={draft.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} />
      </Section>
      <Section label="Footer copyright line">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.footerCopyright} onChange={(e) => set("footerCopyright", e.target.value)} />
      </Section>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "settings", value: draft }, { onSuccess: () => toast.success("Settings saved") })}
      />
    </div>
  );
}

function FaqsEditor() {
  const { data } = useSiteContent("faqs");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<Array<{ q: string; a: string }> | null>(null);
  useEffect(() => { if (data && !draft) setDraft([...data]); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="grid gap-4 max-w-3xl">
      {draft.map((f, i) => (
        <div key={i} className="border border-border p-4 grid gap-3 bg-background">
          <div className="flex items-start gap-3">
            <input
              className="flex-1 h-10 px-3 border border-border bg-background text-sm font-medium"
              placeholder="Question"
              value={f.q}
              onChange={(e) => setDraft(draft.map((x, j) => j === i ? { ...x, q: e.target.value } : x))}
            />
            <button onClick={() => setDraft(draft.filter((_, j) => j !== i))} className="h-10 w-10 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
          </div>
          <RichTextEditor
            value={f.a}
            onChange={(v) => setDraft(draft.map((x, j) => j === i ? { ...x, a: v } : x))}
            minHeight={80}
          />
        </div>
      ))}
      <button
        onClick={() => setDraft([...draft, { q: "", a: "" }])}
        className="inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted self-start"
      >
        <Plus size={14} /> Add FAQ
      </button>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "faqs", value: draft }, { onSuccess: () => toast.success("FAQs saved") })}
      />
    </div>
  );
}

function ExperiencesEditor() {
  const { data } = useSiteContent("experiences");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.experiences | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data, items: [...data.items] }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.experiences>(k: K, v: typeof defaultContent.experiences[K]) =>
    setDraft({ ...draft, [k]: v });

  const setItem = (i: number, patch: Partial<typeof draft.items[number]>) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, ...patch } : it) });

  const removeItem = (i: number) =>
    setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) });

  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    setDraft({ ...draft, items });
  };

  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { title: "", blurb: "", region: "", image: "" }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
      </Section>
      <Section label="Headline (use <em>…</em> for accent)">
        <RichTextEditor value={draft.titleHtml} onChange={(v) => set("titleHtml", v)} minHeight={100} />
      </Section>
      <Section label="Intro paragraph">
        <textarea className="w-full min-h-[80px] p-3 border border-border bg-background text-sm" value={draft.intro} onChange={(e) => set("intro", e.target.value)} />
      </Section>

      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Experience cards</p>
        <div className="grid gap-4">
          {draft.items.map((it, i) => (
            <div key={i} className="border border-border p-4 grid gap-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(i, -1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveItem(i, 1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeItem(i)} className="h-8 w-8 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Title" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Region" value={it.region} onChange={(e) => setItem(i, { region: e.target.value })} />
              </div>
              <textarea className="min-h-[70px] p-3 border border-border bg-background text-sm" placeholder="Blurb" value={it.blurb} onChange={(e) => setItem(i, { blurb: e.target.value })} />
              <Section label="Image">
                <ImageUploader value={it.image} onChange={(v) => setItem(i, { image: v })} folder="experiences" />
              </Section>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add experience
        </button>
      </div>

      <div className="border-t border-border pt-6 grid gap-4">
        <p className="eyebrow text-muted-foreground">Call to action</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Section label="CTA eyebrow"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.ctaEyebrow} onChange={(e) => set("ctaEyebrow", e.target.value)} /></Section>
          <Section label="CTA button label"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} /></Section>
        </div>
        <Section label="CTA title">
          <textarea className="w-full min-h-[70px] p-3 border border-border bg-background text-sm" value={draft.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} />
        </Section>
        <Section label="CTA link (e.g. /contact)">
          <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.ctaTo} onChange={(e) => set("ctaTo", e.target.value)} />
        </Section>
      </div>

      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "experiences", value: draft }, { onSuccess: () => toast.success("Experiences saved") })}
      />
    </div>
  );
}

function CommunityEditor() {
  const { data } = useSiteContent("community");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.community | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data, items: [...data.items] }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.community>(k: K, v: typeof defaultContent.community[K]) =>
    setDraft({ ...draft, [k]: v });

  const setItem = (i: number, patch: Partial<typeof draft.items[number]>) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, ...patch } : it) });

  const removeItem = (i: number) =>
    setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) });

  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    setDraft({ ...draft, items });
  };

  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { image: "", caption: "", alt: "" }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
      </Section>
      <Section label="Headline (use <em>…</em> for accent)">
        <RichTextEditor value={draft.titleHtml} onChange={(v) => set("titleHtml", v)} minHeight={100} />
      </Section>
      <Section label="Intro paragraph">
        <textarea className="w-full min-h-[80px] p-3 border border-border bg-background text-sm" value={draft.intro} onChange={(e) => set("intro", e.target.value)} />
      </Section>

      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Community photos</p>
        <div className="grid gap-4">
          {draft.items.map((it, i) => (
            <div key={i} className="border border-border p-4 grid gap-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(i, -1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveItem(i, 1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeItem(i)} className="h-8 w-8 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </div>
              <Section label="Image">
                <ImageUploader value={it.image} onChange={(v) => setItem(i, { image: v })} folder="community" />
              </Section>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Caption (e.g. Long-table dinner · Fort Kochi)" value={it.caption} onChange={(e) => setItem(i, { caption: e.target.value })} />
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Alt text (for accessibility)" value={it.alt} onChange={(e) => setItem(i, { alt: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add photo
        </button>
      </div>

      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "community", value: draft }, { onSuccess: () => toast.success("Community saved") })}
      />
    </div>
  );
}

function FeaturesEditor() {
  const { data } = useSiteContent("features");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<{ propertiesEnabled: boolean } | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <span
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${on ? "bg-primary" : "bg-muted border border-border"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </span>
  );

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="border border-border p-6 bg-background">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display font-light text-xl tracking-[-0.02em]">Properties section</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When disabled, the Properties page is hidden from the website and removed from the navigation. Only Home, Destinations, Experiences and Contact remain visible.
            </p>
            <p className="mt-2 text-xs tracking-[0.18em] uppercase text-muted-foreground">
              {draft.propertiesEnabled ? "Visible to visitors" : "Hidden from visitors"}
            </p>
          </div>
          <Toggle on={draft.propertiesEnabled} onChange={(v) => setDraft({ ...draft, propertiesEnabled: v })} />
        </div>
      </div>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "features", value: draft }, { onSuccess: () => toast.success("Features saved") })}
      />
    </div>
  );
}

function ContactDestinationsEditor() {
  const { data } = useSiteContent("contactDestinations");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.contactDestinations | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data, items: [...data.items] }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const setItem = (i: number, patch: Partial<typeof draft.items[number]>) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, ...patch } : it) });
  const removeItem = (i: number) =>
    setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    setDraft({ ...draft, items });
  };
  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { slug: "", name: "", tag: "", image: "" }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow (e.g. Step 02)">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} />
      </Section>
      <Section label="Section title">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      </Section>
      <Section label="Undecided option label">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.undecidedLabel} onChange={(e) => setDraft({ ...draft, undecidedLabel: e.target.value })} />
      </Section>
      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Destination cards</p>
        <div className="grid gap-4">
          {draft.items.map((it, i) => (
            <div key={i} className="border border-border p-4 grid gap-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(i, -1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveItem(i, 1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeItem(i)} className="h-8 w-8 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Slug (e.g. fort-kochi)" value={it.slug} onChange={(e) => setItem(i, { slug: e.target.value })} />
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Name (e.g. Fort Kochi)" value={it.name} onChange={(e) => setItem(i, { name: e.target.value })} />
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Tag (e.g. Heritage & Café Culture)" value={it.tag} onChange={(e) => setItem(i, { tag: e.target.value })} />
              </div>
              <Section label="Image">
                <ImageUploader value={it.image} onChange={(v) => setItem(i, { image: v })} folder="contact-destinations" />
              </Section>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add destination
        </button>
      </div>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "contactDestinations", value: draft }, { onSuccess: () => toast.success("Saved") })}
      />
    </div>
  );
}

function ContactConciergeEditor() {
  const { data } = useSiteContent("contactConcierge");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.contactConcierge | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data, features: [...data.features] }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const iconOptions = ["MapPin", "Check", "Sparkles", "Compass", "Wifi", "Users"];
  const setFeat = (i: number, patch: Partial<typeof draft.features[number]>) =>
    setDraft({ ...draft, features: draft.features.map((it, j) => j === i ? { ...it, ...patch } : it) });
  const removeFeat = (i: number) =>
    setDraft({ ...draft, features: draft.features.filter((_, j) => j !== i) });
  const addFeat = () =>
    setDraft({ ...draft, features: [...draft.features, { icon: "MapPin", label: "" }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} />
      </Section>
      <Section label="Headline (use <em>…</em> for italic accent)">
        <RichTextEditor value={draft.titleHtml} onChange={(v) => setDraft({ ...draft, titleHtml: v })} minHeight={100} />
      </Section>
      <Section label="Body paragraph">
        <textarea className="w-full min-h-[100px] p-3 border border-border bg-background text-sm" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
      </Section>
      <Section label="Concierge image">
        <ImageUploader value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} folder="contact-concierge" />
      </Section>
      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Feature items</p>
        <div className="grid gap-3">
          {draft.features.map((f, i) => (
            <div key={i} className="border border-border p-4 grid sm:grid-cols-[160px_1fr_auto] gap-3 bg-background items-center">
              <select className="h-10 px-3 border border-border bg-background text-sm" value={f.icon} onChange={(e) => setFeat(i, { icon: e.target.value })}>
                {iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Label" value={f.label} onChange={(e) => setFeat(i, { label: e.target.value })} />
              <button onClick={() => removeFeat(i)} className="h-10 w-10 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={addFeat} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add feature
        </button>
      </div>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "contactConcierge", value: draft }, { onSuccess: () => toast.success("Saved") })}
      />
    </div>
  );
}

function ContactExperiencesEditor() {
  const { data } = useSiteContent("contactExperiences");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.contactExperiences | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data, items: [...data.items] }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const setItem = (i: number, patch: Partial<typeof draft.items[number]>) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, ...patch } : it) });
  const removeItem = (i: number) =>
    setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    setDraft({ ...draft, items });
  };
  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { title: "", place: "", image: "" }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <Section label="Eyebrow">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} />
      </Section>
      <Section label="Headline (use <em>…</em> for italic accent)">
        <RichTextEditor value={draft.titleHtml} onChange={(v) => setDraft({ ...draft, titleHtml: v })} minHeight={100} />
      </Section>
      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Experience cards (5 recommended)</p>
        <div className="grid gap-4">
          {draft.items.map((it, i) => (
            <div key={i} className="border border-border p-4 grid gap-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(i, -1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveItem(i, 1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeItem(i)} className="h-8 w-8 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Title (e.g. Heritage Walks)" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                <input className="h-10 px-3 border border-border bg-background text-sm" placeholder="Place (e.g. Fort Kochi)" value={it.place} onChange={(e) => setItem(i, { place: e.target.value })} />
              </div>
              <Section label="Image">
                <ImageUploader value={it.image} onChange={(v) => setItem(i, { image: v })} folder="contact-experiences" />
              </Section>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add card
        </button>
      </div>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "contactExperiences", value: draft }, { onSuccess: () => toast.success("Saved") })}
      />
    </div>
  );
}

function SignatureEditor() {
  const { data } = useSiteContent("signature");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.signature | null>(null);
  useEffect(() => { if (data && !draft) setDraft({ ...data }); }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.signature>(k: K, v: string) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="grid gap-6 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Edits the "Choose your workation mood" section on the home page. The cards themselves (image, name, mood label) are managed under{" "}
        <Link to="/admin/destinations" className="underline hover:text-foreground">Destinations</Link>.
      </p>
      <Section label="Eyebrow (small text above headline)">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
      </Section>
      <Section label="Headline">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.heading} onChange={(e) => set("heading", e.target.value)} />
      </Section>
      <Section label="Headline (italic accent)">
        <input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.headingItalic} onChange={(e) => set("headingItalic", e.target.value)} />
      </Section>
      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "signature", value: draft }, { onSuccess: () => toast.success("Signature saved") })}
      />
    </div>
  );
}

function SignatureExperiencesEditor() {
  const { data } = useSiteContent("signatureExperiences");
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<typeof defaultContent.signatureExperiences | null>(null);
  useEffect(() => {
    if (data && !draft) setDraft({ ...data, items: data.items.map((i) => ({ ...i, moments: [...i.moments] })) });
  }, [data, draft]);
  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof typeof defaultContent.signatureExperiences>(k: K, v: typeof defaultContent.signatureExperiences[K]) =>
    setDraft({ ...draft, [k]: v });

  const setItem = (i: number, patch: Partial<typeof draft.items[number]>) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, ...patch } : it) });

  const setMoment = (i: number, m: number, v: string) =>
    setDraft({ ...draft, items: draft.items.map((it, j) => j === i ? { ...it, moments: it.moments.map((x, k) => k === m ? v : x) } : it) });

  const removeItem = (i: number) =>
    setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) });

  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    setDraft({ ...draft, items });
  };

  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { slug: "", dest: "", image: "", moments: ["", "", ""] }] });

  return (
    <div className="grid gap-6 max-w-3xl">
      <p className="text-sm text-muted-foreground">
        Edits the "Signature experiences" section on the Destinations page.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Section label="Eyebrow"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} /></Section>
        <Section label="Discover link label"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.discoverLabel} onChange={(e) => set("discoverLabel", e.target.value)} /></Section>
        <Section label="Headline"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.heading} onChange={(e) => set("heading", e.target.value)} /></Section>
        <Section label="Headline (italic accent)"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.headingItalic} onChange={(e) => set("headingItalic", e.target.value)} /></Section>
        <Section label="Card heading"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.cardHeading} onChange={(e) => set("cardHeading", e.target.value)} /></Section>
        <Section label="Card heading (italic accent)"><input className="w-full h-10 px-3 border border-border bg-background text-sm" value={draft.cardHeadingItalic} onChange={(e) => set("cardHeadingItalic", e.target.value)} /></Section>
      </div>

      <div className="border-t border-border pt-6">
        <p className="eyebrow text-muted-foreground mb-4">Destination cards</p>
        <div className="grid gap-4">
          {draft.items.map((it, i) => (
            <div key={i} className="border border-border p-4 grid gap-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(i, -1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveItem(i, 1)} className="h-8 w-8 border border-border text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeItem(i)} className="h-8 w-8 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Section label="Destination slug (e.g. fort-kochi)"><input className="h-10 px-3 border border-border bg-background text-sm w-full" value={it.slug} onChange={(e) => setItem(i, { slug: e.target.value })} /></Section>
                <Section label="Destination label"><input className="h-10 px-3 border border-border bg-background text-sm w-full" value={it.dest} onChange={(e) => setItem(i, { dest: e.target.value })} /></Section>
              </div>
              <Section label="Image">
                <ImageUploader value={it.image} onChange={(v) => setItem(i, { image: v })} folder="signature-experiences" />
              </Section>
              <div className="grid sm:grid-cols-3 gap-3">
                {[0, 1, 2].map((m) => (
                  <Section key={m} label={`Moment 0${m + 1}`}>
                    <input className="h-10 px-3 border border-border bg-background text-sm w-full" value={it.moments[m] ?? ""} onChange={(e) => setMoment(i, m, e.target.value)} />
                  </Section>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 h-10 px-4 border border-dashed border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">
          <Plus size={14} /> Add destination
        </button>
      </div>

      <SaveBar
        saving={update.isPending}
        onSave={() => update.mutate({ key: "signatureExperiences", value: draft }, { onSuccess: () => toast.success("Signature experiences saved") })}
      />
    </div>
  );
}


