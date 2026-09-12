import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, LogOut, ShieldAlert, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { slugify, normalizeLocationName } from "@/lib/slug";

const supabase = supabaseTyped as unknown as {
  auth: typeof supabaseTyped.auth;
  from: (t: string) => any;
};

export const Route = createFileRoute("/_authenticated/admin/locations")({
  head: () => ({
    meta: [
      { title: "Locations · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LocationsAdmin,
});

type Row = { destination: string; count: number };

function LocationsAdmin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const admin = (roles ?? []).some((r: any) => r.role === "admin");
    setIsAdmin(admin);
    if (!admin) { setLoading(false); return; }
    const { data, error } = await supabase.from("properties").select("destination");
    if (error) { toast.error(error.message); setLoading(false); return; }
    const counts = new Map<string, number>();
    for (const p of (data ?? []) as { destination: string | null }[]) {
      if (!p.destination) continue;
      counts.set(p.destination, (counts.get(p.destination) ?? 0) + 1);
    }
    setRows(Array.from(counts.entries()).map(([destination, count]) => ({ destination, count })).sort((a, b) => a.destination.localeCompare(b.destination)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  const rename = async (oldName: string) => {
    const input = window.prompt(`Rename "${oldName}" to:`, oldName);
    if (input == null) return;
    const next = normalizeLocationName(input);
    if (!next) return toast.error("Name can't be empty");
    if (next === oldName) return;
    const existing = rows.find((r) => slugify(r.destination) === slugify(next) && r.destination !== oldName);
    if (existing && !confirm(`This will merge with existing "${existing.destination}" (${existing.count} listings). Continue?`)) return;
    const target = existing?.destination ?? next;
    const { error } = await supabase.from("properties").update({ destination: target }).eq("destination", oldName);
    if (error) return toast.error(error.message);
    toast.success(existing ? "Merged" : "Renamed");
    load();
  };

  const untag = async (name: string, count: number) => {
    if (!confirm(`Remove the "${name}" tag from ${count} ${count === 1 ? "property" : "properties"}? The properties themselves are kept.`)) return;
    const { error } = await supabase.from("properties").update({ destination: null }).eq("destination", name);
    if (error) return toast.error(error.message);
    toast.success("Location removed");
    load();
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
            <h1 className="mt-3 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">Locations</h1>
            <p className="mt-2 text-sm text-muted-foreground">{rows.length} unique location {rows.length === 1 ? "tag" : "tags"} across properties</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Inquiries</Link>
            <Link to="/admin/properties" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Properties</Link>
            <Link to="/admin/content" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Content</Link>
            <Link to="/admin/destinations" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Destinations</Link>
            <button onClick={load} className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted"><RefreshCw size={14} /> Refresh</button>
            <button onClick={signOut} className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase"><LogOut size={14} /> Sign out</button>
          </div>
        </div>

        {loading ? (
          <p className="mt-16 text-muted-foreground text-sm">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">
            No location tags yet. Add a property with a location to see it here.
          </div>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {rows.map((r) => (
              <li key={r.destination} className="flex flex-wrap items-center gap-4 py-5">
                <div className="flex-1 min-w-[200px]">
                  <div className="inline-flex items-center gap-2 font-display text-2xl">
                    <MapPin size={16} className="text-muted-foreground" /> {r.destination}
                  </div>
                  <p className="mt-1 text-xs tracking-[0.18em] uppercase text-muted-foreground">
                    {r.count} {r.count === 1 ? "listing" : "listings"} · /locations/{slugify(r.destination)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/locations/$slug"
                    params={{ slug: slugify(r.destination) }}
                    className="h-9 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted inline-flex items-center"
                  >
                    View
                  </Link>
                  <button onClick={() => rename(r.destination)} className="h-9 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted inline-flex items-center gap-2">
                    <Pencil size={13} /> Rename
                  </button>
                  <button onClick={() => untag(r.destination, r.count)} className="h-9 w-9 inline-flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground" title="Remove tag from all listings">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10 text-xs text-muted-foreground max-w-xl leading-relaxed">
          Renaming updates the location tag on every matching property. Renaming to an existing name merges. Deleting only removes the tag — property data is preserved and can be re-tagged later.
        </p>
      </div>
    </section>
  );
}
