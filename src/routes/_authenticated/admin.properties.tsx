import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Save, X, RefreshCw, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { slugify, normalizeLocationName } from "@/lib/slug";
import { MultiImageUploader, type GalleryItem } from "@/components/admin/MultiImageUploader";

const supabase = supabaseTyped as unknown as {
  auth: typeof supabaseTyped.auth;
  from: (t: string) => any;
};

export const Route = createFileRoute("/_authenticated/admin/properties")({
  head: () => ({
    meta: [
      { title: "Properties · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PropertiesAdmin,
});

type Property = {
  id: string;
  name: string;
  destination: string | null;
  description: string | null;
  price_per_night: number | null;
  image_url: string | null;
  images: string[] | null;
  gallery: GalleryItem[] | null;
  amenities: string[] | null;
  bedrooms: number | null;
  guests: number | null;
  status: string;
  created_at: string;
};

const empty = (): Partial<Property> => ({
  name: "",
  destination: "",
  description: "",
  price_per_night: null,
  image_url: "",
  images: [],
  gallery: [],
  amenities: [],
  bedrooms: null,
  guests: null,
  status: "published",
});

function PropertiesAdmin() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<Partial<Property> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const admin = (roles ?? []).some((r: any) => r.role === "admin");
    setIsAdmin(admin);
    if (!admin) { setLoading(false); return; }
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Property[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  const save = async () => {
    if (!editing?.name?.trim()) return toast.error("Name required");

    // Normalize location: trim, collapse whitespace, snap to existing canonical spelling.
    let destination: string | null = null;
    const rawLoc = (editing.destination ?? "");
    if (rawLoc.length > 0) {
      const normalized = normalizeLocationName(rawLoc);
      if (!normalized) return toast.error("Location can't be just whitespace");
      const existing = Array.from(
        new Set(items.map((i) => i.destination).filter(Boolean) as string[])
      );
      const slug = slugify(normalized);
      const canonical = existing.find((d) => slugify(d) === slug);
      destination = canonical ?? normalized;
    }

    const gallery = (editing.gallery ?? []).filter((g) => g && g.url);
    const images = gallery.map((g) => g.url);
    const payload = {
      name: editing.name.trim(),
      destination,
      description: editing.description || null,
      price_per_night: editing.price_per_night ?? null,
      image_url: images[0] ?? null,
      images,
      gallery,
      amenities: editing.amenities ?? [],
      bedrooms: editing.bedrooms ?? null,
      guests: editing.guests ?? null,
      status: editing.status || "published",
    };
    if (editing.id) {
      const { error } = await supabase.from("properties").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Updated");
    } else {
      const { error } = await supabase.from("properties").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Added");
    }
    setEditing(null);
    load();
  };

  const toggleStatus = async (p: Property) => {
    const next = p.status === "published" ? "draft" : "published";
    setItems((prev) => prev.map((i) => (i.id === p.id ? { ...i, status: next } : i)));
    const { error } = await supabase.from("properties").update({ status: next }).eq("id", p.id);
    if (error) {
      setItems((prev) => prev.map((i) => (i.id === p.id ? { ...i, status: p.status } : i)));
      return toast.error(error.message);
    }
    toast.success(next === "published" ? "Property visible on site" : "Property hidden from site");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((p) => p.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

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
            <h1 className="mt-3 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">Properties</h1>
            <p className="mt-2 text-sm text-muted-foreground">{items.length} listings</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Inquiries</Link>
            <Link to="/admin/content" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Content</Link>
            <Link to="/admin/destinations" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Destinations</Link>
            <Link to="/admin/locations" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Locations</Link>
            <Link to="/admin/testimonials" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Testimonials</Link>
            <Link to="/admin/layout" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Page Builder</Link>
            <button onClick={load} className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted"><RefreshCw size={14} /> Refresh</button>
            <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"><Plus size={14} /> Add</button>
            <button onClick={signOut} className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase"><LogOut size={14} /> Sign out</button>
          </div>
        </div>

        {loading ? (
          <p className="mt-16 text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">No properties yet. Click Add to create one.</div>
        ) : (
          <div className="mt-10 grid gap-4">
            {items.map((p) => (
              <article key={p.id} className="border border-border bg-background p-6 flex flex-wrap items-start gap-6">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-32 h-24 object-cover" />}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display font-light text-2xl tracking-[-0.02em]">{p.name}</h2>
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase px-2 py-1 bg-muted text-muted-foreground">{p.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.destination ?? "—"} · {p.bedrooms ?? "?"} bd · {p.guests ?? "?"} guests
                  </p>
                  {p.description && <p className="mt-2 text-sm line-clamp-2">{p.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none" title={p.status === "published" ? "Visible on site — click to hide" : "Hidden from site — click to publish"}>
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">{p.status === "published" ? "Visible" : "Hidden"}</span>
                    <span
                      role="switch"
                      aria-checked={p.status === "published"}
                      onClick={() => toggleStatus(p)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.status === "published" ? "bg-primary" : "bg-muted border border-border"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${p.status === "published" ? "translate-x-5" : "translate-x-0.5"}`} />
                    </span>
                  </label>
                  <button onClick={() => setEditing(p)} className="h-9 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted">Edit</button>
                  <button onClick={() => remove(p.id)} className="h-9 w-9 inline-flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground"><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-background border border-border max-w-2xl w-full p-8 my-12" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h2 className="font-display font-light text-2xl">{editing.id ? "Edit property" : "Add property"}</h2>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="grid gap-4">
              <Field label="Name"><input className="input" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Location">
                <input
                  className="input"
                  list="destination-options"
                  value={editing.destination ?? ""}
                  onChange={(e) => setEditing({ ...editing, destination: e.target.value })}
                  placeholder="Select existing or type a new location"
                />
                <datalist id="destination-options">
                  {Array.from(new Set(items.map((i) => i.destination).filter(Boolean))).map((d) => (
                    <option key={d as string} value={d as string} />
                  ))}
                </datalist>
                <span className="mt-1 block text-[0.65rem] text-muted-foreground">Pick from existing tags or type a new one to create it.</span>
              </Field>
              <Field label="Gallery images">
                <MultiImageUploader
                  value={
                    editing.gallery && editing.gallery.length
                      ? editing.gallery
                      : (editing.images && editing.images.length
                          ? editing.images.map((url) => ({ url, caption: "", alt: "" }))
                          : (editing.image_url ? [{ url: editing.image_url, caption: "", alt: "" }] : []))
                  }
                  onChange={(items) => setEditing({ ...editing, gallery: items, images: items.map((i) => i.url), image_url: items[0]?.url ?? "" })}
                  folder="properties"
                />
              </Field>
              <Field label="Description"><textarea className="input min-h-[100px]" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Bedrooms"><input type="number" className="input" value={editing.bedrooms ?? ""} onChange={(e) => setEditing({ ...editing, bedrooms: e.target.value ? Number(e.target.value) : null })} /></Field>
                <Field label="Guests"><input type="number" className="input" value={editing.guests ?? ""} onChange={(e) => setEditing({ ...editing, guests: e.target.value ? Number(e.target.value) : null })} /></Field>
                <Field label="Price / night"><input type="number" step="0.01" className="input" value={editing.price_per_night ?? ""} onChange={(e) => setEditing({ ...editing, price_per_night: e.target.value ? Number(e.target.value) : null })} /></Field>
              </div>
              <Field label="Amenities (comma separated)">
                <input className="input" value={(editing.amenities ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </Field>
              <Field label="Status">
                <select className="input" value={editing.status ?? "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-3 mt-8 border-t border-border pt-6">
              <button onClick={() => setEditing(null)} className="h-10 px-5 border border-border text-xs tracking-[0.18em] uppercase">Cancel</button>
              <button onClick={save} className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"><Save size={14} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;height:40px;padding:0 12px;border:1px solid hsl(var(--border));background:hsl(var(--background));font-size:14px}textarea.input{padding:10px 12px;height:auto}`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
