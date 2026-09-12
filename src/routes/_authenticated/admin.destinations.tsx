import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";
import {
  useCmsDestinations,
  useUpsertDestination,
  useDeleteDestination,
  type CmsDestination,
} from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DestinationsAdmin,
});

const blank = (sort_order = 0): Partial<CmsDestination> => ({
  slug: "",
  name: "",
  region: "",
  tagline: "",
  image_url: "",
  wifi: "",
  stays: 0,
  starting_price: 0,
  cta_label: "Explore",
  cta_link: "",
  sort_order,
  published: true,
});

function DestinationsAdmin() {
  const { data, isLoading } = useCmsDestinations({ includeUnpublished: true });
  const upsert = useUpsertDestination();
  const del = useDeleteDestination();
  const [items, setItems] = useState<CmsDestination[]>([]);
  const [editing, setEditing] = useState<Partial<CmsDestination> | null>(null);

  useEffect(() => { if (data) setItems(data); }, [data]);

  const saveOrder = async (next: CmsDestination[]) => {
    setItems(next);
    await Promise.all(
      next.map((row, idx) =>
        row.sort_order === idx ? null : upsert.mutateAsync({ id: row.id, sort_order: idx }),
      ),
    );
  };

  return (
    <AdminShell title="Destinations" description="Edit destination cards shown across the site.">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(blank(items.length))}
          className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"
        >
          <Plus size={14} /> New destination
        </button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && items.length === 0 && (
        <p className="text-sm text-muted-foreground border border-dashed border-border p-8 text-center">
          No destinations yet. Click <em>New destination</em> to add your first.
        </p>
      )}

      {items.length > 0 && (
        <SortableList
          items={items}
          onReorder={saveOrder}
          renderItem={(d) => (
            <div className="flex items-center gap-4">
              {d.image_url ? (
                <img src={d.image_url} alt="" className="h-16 w-24 object-cover" />
              ) : (
                <div className="h-16 w-24 bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg truncate">{d.name || d.slug}</h3>
                  {!d.published && <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground border border-border px-1.5">Draft</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{d.region} · {d.wifi} · {d.stays} stays · ₹{d.starting_price ?? 0}</p>
              </div>
              <button
                onClick={() => upsert.mutate({ id: d.id, published: !d.published })}
                className="h-9 w-9 border border-border inline-flex items-center justify-center"
                title={d.published ? "Unpublish" : "Publish"}
              >
                {d.published ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => setEditing(d)}
                className="h-9 px-3 border border-border text-xs tracking-[0.18em] uppercase"
              >Edit</button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${d.name}"?`)) del.mutate(d.id);
                }}
                className="h-9 w-9 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
              ><Trash2 size={14} /></button>
            </div>
          )}
        />
      )}

      {editing && (
        <EditDrawer
          row={editing}
          onClose={() => setEditing(null)}
          onSave={(row) => {
            upsert.mutate(row, {
              onSuccess: () => {
                toast.success("Saved");
                setEditing(null);
              },
              onError: (e: any) => toast.error(e?.message ?? "Save failed"),
            });
          }}
          saving={upsert.isPending}
        />
      )}
    </AdminShell>
  );
}

function EditDrawer({
  row,
  onClose,
  onSave,
  saving,
}: {
  row: Partial<CmsDestination>;
  onClose: () => void;
  onSave: (r: Partial<CmsDestination>) => void;
  saving: boolean;
}) {
  const [d, setD] = useState<Partial<CmsDestination>>(row);
  const set = <K extends keyof CmsDestination>(k: K, v: CmsDestination[K]) => setD({ ...d, [k]: v });
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
        <h2 className="font-display text-2xl">{row.id ? "Edit destination" : "New destination"}</h2>
        <div className="mt-6 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug (URL)"><input className={input} value={d.slug ?? ""} onChange={(e) => set("slug", e.target.value)} /></Field>
            <Field label="Name"><input className={input} value={d.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Region"><input className={input} value={d.region ?? ""} onChange={(e) => set("region", e.target.value)} /></Field>
            <Field label="WiFi quality"><input className={input} placeholder="Fibre · 100 Mbps" value={d.wifi ?? ""} onChange={(e) => set("wifi", e.target.value)} /></Field>
            <Field label="Stay count"><input type="number" className={input} value={d.stays ?? 0} onChange={(e) => set("stays", Number(e.target.value))} /></Field>
            <Field label="Starting price (₹)"><input type="number" className={input} value={d.starting_price ?? 0} onChange={(e) => set("starting_price", Number(e.target.value))} /></Field>
            <Field label="Explore CTA label"><input className={input} value={d.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} /></Field>
            <Field label="Explore CTA link"><input className={input} placeholder="/destinations/fort-kochi" value={d.cta_link ?? ""} onChange={(e) => set("cta_link", e.target.value)} /></Field>
          </div>
          <Field label="Tagline">
            <textarea className="w-full min-h-[80px] p-3 border border-border bg-background text-sm" value={d.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Hero image">
            <ImageUploader value={d.image_url ?? ""} onChange={(v) => set("image_url", v)} folder="destinations" />
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
            disabled={saving || !d.slug || !d.name}
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
