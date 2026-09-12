import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, RefreshCw, Smartphone, Monitor, Tablet, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/sessions")({
  head: () => ({
    meta: [
      { title: "Active sessions · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SessionsPage,
});

type SessionRow = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  refreshed_at: string | null;
  not_after: string | null;
  user_agent: string | null;
  ip: string | null;
  aal: string | null;
  is_current: boolean;
};

type Geo = { city?: string; region?: string; country?: string };

function parseUA(ua: string | null) {
  if (!ua) return { device: "Unknown device", os: "", browser: "", Icon: Globe };
  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const os = /Windows/i.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) ? "macOS"
    : /Android/i.test(ua) ? "Android"
    : /iPhone|iPad|iOS/i.test(ua) ? "iOS"
    : /Linux/i.test(ua) ? "Linux" : "";
  const browser = /Edg\//i.test(ua) ? "Edge"
    : /Chrome\//i.test(ua) ? "Chrome"
    : /Firefox\//i.test(ua) ? "Firefox"
    : /Safari\//i.test(ua) ? "Safari" : "Browser";
  const Icon = isTablet ? Tablet : isMobile ? Smartphone : Monitor;
  return { device: `${browser} on ${os || "Unknown"}`, os, browser, Icon };
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((Date.now() - d) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function SessionsPage() {
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [geo, setGeo] = useState<Record<string, Geo>>({});
  const [revoking, setRevoking] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.rpc("get_my_sessions");
      if (error) throw error;
      setRows((data ?? []) as SessionRow[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!rows) return;
    const unique = Array.from(new Set(rows.map((r) => r.ip).filter((ip): ip is string => !!ip && !geo[ip])));
    unique.forEach((ip) => {
      fetch(`https://ipapi.co/${ip}/json/`)
        .then((r) => r.json())
        .then((j) => {
          if (j && !j.error) {
            setGeo((g) => ({
              ...g,
              [ip]: { city: j.city, region: j.region, country: j.country_name },
            }));
          }
        })
        .catch(() => {});
    });
  }, [rows]);

  const revoke = async (id: string, isCurrent: boolean) => {
    if (isCurrent) {
      toast.error("This is your current session. Use Sign out instead.");
      return;
    }
    if (!confirm("Sign out this device?")) return;
    setRevoking(id);
    try {
      const { data, error } = await supabase.rpc("revoke_my_session", { _session_id: id });
      if (error) throw error;
      if (!data) throw new Error("Session not found");
      toast.success("Device signed out");
      setRows((rs) => (rs ?? []).filter((r) => r.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <AdminShell
      title="Active sessions"
      eyebrow="Security"
      description="Every device currently signed in to your account. Revoke any you don't recognise."
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {rows ? `${rows.length} active session${rows.length === 1 ? "" : "s"}` : "Loading…"}
        </p>
        <button
          onClick={load}
          disabled={refreshing}
          className="inline-flex items-center gap-2 h-9 px-4 text-xs tracking-[0.16em] uppercase border border-border hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="border border-border rounded-sm divide-y divide-border bg-background">
        {rows === null && (
          <div className="p-8 text-sm text-muted-foreground">Loading sessions…</div>
        )}
        {rows && rows.length === 0 && (
          <div className="p-8 text-sm text-muted-foreground">No active sessions found.</div>
        )}
        {rows?.map((r) => {
          const { device, Icon } = parseUA(r.user_agent);
          const g = r.ip ? geo[r.ip] : undefined;
          const location = g
            ? [g.city, g.region, g.country].filter(Boolean).join(", ")
            : r.ip
            ? "Locating…"
            : "Unknown location";
          return (
            <div key={r.id} className="p-4 md:p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-sm bg-muted grid place-items-center shrink-0">
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium truncate">{device}</p>
                  {r.is_current && (
                    <span className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 bg-primary text-primary-foreground rounded-sm">
                      This device
                    </span>
                  )}
                  {r.aal && r.aal !== "aal1" && (
                    <span className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 border border-border rounded-sm">
                      {r.aal.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground truncate">
                  {location}{r.ip ? ` · ${r.ip}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last active {timeAgo(r.refreshed_at ?? r.updated_at)}
                  {" · "}Signed in {timeAgo(r.created_at)}
                </p>
              </div>
              {!r.is_current && (
                <button
                  onClick={() => revoke(r.id, r.is_current)}
                  disabled={revoking === r.id}
                  className="inline-flex items-center gap-2 h-9 px-3 text-xs tracking-[0.16em] uppercase border border-border hover:bg-muted disabled:opacity-50 shrink-0"
                >
                  <LogOut size={12} />
                  {revoking === r.id ? "…" : "Revoke"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Location is estimated from the sign-in IP address and may be approximate.
      </p>
    </AdminShell>
  );
}
