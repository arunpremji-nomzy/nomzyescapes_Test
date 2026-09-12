import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { LogOut, Mail, Phone, Calendar, MapPin, RefreshCw, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
// Types not yet regenerated for new tables; cast to loosen typing.
const supabase = supabaseTyped as unknown as {
  auth: typeof supabaseTyped.auth;
  from: (table: string) => any;
};

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Inquiries · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Inquiry = {
  id: string;
  source: string;
  destination: string | null;
  name: string;
  email: string;
  phone: string | null;
  party_size: string | null;
  start_date: string | null;
  end_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const admin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
    setIsAdmin(admin);
    if (!admin) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setInquiries((data ?? []) as Inquiry[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const visible = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  if (isAdmin === false) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto text-muted-foreground" size={32} />
          <h1 className="mt-6 font-display font-light text-3xl tracking-[-0.02em]">Not authorised</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account doesn't have admin access. Contact the site owner.
          </p>
          <button onClick={signOut} className="mt-6 text-sm underline text-muted-foreground">
            Sign out
          </button>
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
              Guest Inquiries
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {inquiries.length} total · {inquiries.filter((i) => i.status === "new").length} new
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase hover:bg-muted"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <Link
              to="/admin/properties"
              className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
            >
              Properties
            </Link>
            <Link to="/admin/content" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Content</Link>
            <Link to="/admin/destinations" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Destinations</Link>
            <Link to="/admin/testimonials" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Testimonials</Link>
            <Link to="/admin/layout" className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground">Page Builder</Link>
            <Link
              to="/"
              className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
            >
              View site
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          {["all", "new", "contacted", "booked", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 h-9 text-xs tracking-[0.18em] uppercase border transition-colors ${
                filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-16 text-muted-foreground text-sm">Loading inquiries…</p>
        ) : visible.length === 0 ? (
          <div className="mt-16 border border-dashed border-border p-16 text-center text-muted-foreground">
            No inquiries here yet.
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {visible.map((inq) => (
              <article key={inq.id} className="border border-border bg-background p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-display font-light text-2xl tracking-[-0.02em]">{inq.name}</h2>
                      <span className="text-[0.65rem] tracking-[0.2em] uppercase px-2 py-1 bg-muted text-muted-foreground">
                        {inq.source}
                      </span>
                      {inq.destination && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} /> {inq.destination}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <a href={`mailto:${inq.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
                        <Mail size={13} /> {inq.email}
                      </a>
                      {inq.phone && (
                        <a href={`tel:${inq.phone}`} className="inline-flex items-center gap-2 hover:text-foreground">
                          <Phone size={13} /> {inq.phone}
                        </a>
                      )}
                      {(inq.start_date || inq.end_date) && (
                        <span className="inline-flex items-center gap-2">
                          <Calendar size={13} /> {inq.start_date ?? "—"} → {inq.end_date ?? "—"}
                        </span>
                      )}
                      {inq.party_size && <span>· {inq.party_size}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      className="h-9 px-3 border border-border bg-background text-xs tracking-[0.18em] uppercase"
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="booked">booked</option>
                      <option value="closed">closed</option>
                    </select>
                    <button
                      onClick={() => remove(inq.id)}
                      aria-label="Delete"
                      className="h-9 w-9 inline-flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {inq.message && (
                  <p className="mt-5 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 border-t border-border pt-5">
                    {inq.message}
                  </p>
                )}
                <p className="mt-4 text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground">
                  {new Date(inq.created_at).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
