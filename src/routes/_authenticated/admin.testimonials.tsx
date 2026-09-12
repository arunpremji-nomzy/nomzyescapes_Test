import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";
import {
  useCmsTestimonials,
  useUpsertTestimonial,
  useDeleteTestimonial,
  useCmsDestinations,
  type CmsTestimonial,
} from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TestimonialsAdmin,
});

const blank = (sort_order = 0): Partial<CmsTestimonial> => ({
  author: "",
  role: "",
  country: "",
  flag: "",
  quote: "",
  image_url: "",
  destination_slug: "",
  stay_length: "",
  sort_order,
  published: true,
});

function TestimonialsAdmin() {
  const { data, isLoading } = useCmsTestimonials({ includeUnpublished: true });
  const { data: destinations } = useCmsDestinations({ includeUnpublished: true });
  const upsert = useUpsertTestimonial();
  const del = useDeleteTestimonial();
  const [items, setItems] = useState<CmsTestimonial[]>([]);
  const [editing, setEditing] = useState<Partial<CmsTestimonial> | null>(null);

  useEffect(() => { if (data) setItems(data); }, [data]);

  const saveOrder = async (next: CmsTestimonial[]) => {
    setItems(next);
    await Promise.all(
      next.map((row, idx) =>
        row.sort_order === idx ? null : upsert.mutateAsync({ id: row.id, sort_order: idx }),
      ),
    );
  };

  return (
    <AdminShell title="Testimonials" description="Voices from guests who stayed. Drag to reorder, toggle to publish.">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(blank(items.length))}
          className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"
        >
          <Plus size={14} /> New testimonial
        </button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && items.length === 0 && (
        <p className="text-sm text-muted-foreground border border-dashed border-border p-8 text-center">
          No testimonials yet.
        </p>
      )}

      {items.length > 0 && (
        <SortableList
          items={items}
          onReorder={saveOrder}
          renderItem={(t) => (
            <div className="flex items-center gap-4">
              {t.image_url ? (
                <img src={t.image_url} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center font-display">
                  {t.author.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg truncate">{t.author}</h3>
                  {!t.published && <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground border border-border px-1.5">Draft</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate italic">"{t.quote.slice(0, 90)}{t.quote.length > 90 ? "…" : ""}"</p>
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  {t.flag} {t.country} {t.destination_slug ? `· ${t.destination_slug}` : ""}
                </p>
              </div>
              <button
                onClick={() => upsert.mutate({ id: t.id, published: !t.published })}
                className="h-9 w-9 border border-border inline-flex items-center justify-center"
                title={t.published ? "Unpublish" : "Publish"}
              >
                {t.published ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => setEditing(t)} className="h-9 px-3 border border-border text-xs tracking-[0.18em] uppercase">Edit</button>
              <button
                onClick={() => { if (confirm(`Delete testimonial by ${t.author}?`)) del.mutate(t.id); }}
                className="h-9 w-9 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
              ><Trash2 size={14} /></button>
            </div>
          )}
        />
      )}

      {editing && (
        <EditDrawer
          row={editing}
          destinations={destinations ?? []}
          onClose={() => setEditing(null)}
          onSave={(row) =>
            upsert.mutate(row, {
              onSuccess: () => { toast.success("Saved"); setEditing(null); },
              onError: (e: any) => toast.error(e?.message ?? "Save failed"),
            })
          }
          saving={upsert.isPending}
        />
      )}
    </AdminShell>
  );
}

function EditDrawer({
  row, destinations, onClose, onSave, saving,
}: {
  row: Partial<CmsTestimonial>;
  destinations: { slug: string; name: string }[];
  onClose: () => void;
  onSave: (r: Partial<CmsTestimonial>) => void;
  saving: boolean;
}) {
  const [d, setD] = useState<Partial<CmsTestimonial>>(row);
  const set = <K extends keyof CmsTestimonial>(k: K, v: CmsTestimonial[K]) => setD({ ...d, [k]: v });
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="block">
      <span className="block text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
  const input = "w-full h-10 px-3 border border-border bg-background text-sm";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div className="bg-background w-full max-w-xl h-full overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl">{row.id ? "Edit testimonial" : "New testimonial"}</h2>
        <div className="mt-6 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Author"><input className={input} value={d.author ?? ""} onChange={(e) => set("author", e.target.value)} /></Field>
            <Field label="Role"><input className={input} value={d.role ?? ""} onChange={(e) => set("role", e.target.value)} /></Field>
            <Field label="Country"><input className={input} value={d.country ?? ""} onChange={(e) => set("country", e.target.value)} /></Field>
            <Field label="Flag (emoji)"><input className={input} value={d.flag ?? ""} onChange={(e) => set("flag", e.target.value)} /></Field>
            <Field label="Stay length"><input className={input} placeholder="Stayed 3 weeks" value={d.stay_length ?? ""} onChange={(e) => set("stay_length", e.target.value)} /></Field>
            <Field label="Destination tag">
              <select className={input} value={d.destination_slug ?? ""} onChange={(e) => set("destination_slug", e.target.value)}>
                <option value="">— None —</option>
                {destinations.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Quote">
            <textarea className="w-full min-h-[120px] p-3 border border-border bg-background text-sm" value={d.quote ?? ""} onChange={(e) => set("quote", e.target.value)} />
          </Field>
          <Field label="Author photo">
            <ImageUploader value={d.image_url ?? ""} onChange={(v) => set("image_url", v)} folder="testimonials" />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={d.published ?? true} onChange={(e) => set("published", e.target.checked)} />
            Published
          </label>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex justify-between">
          <button onClick={onClose} className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Cancel</button>
          <button
            onClick={() => onSave(d)}
            disabled={saving || !d.author || !d.quote}
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
