import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · Nomzy Escapes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase auto-processes the recovery token from the URL hash.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      if (signOutOthers) {
        const { error: soErr } = await supabase.auth.signOut({ scope: "others" });
        if (soErr) throw soErr;
        toast.success("Password updated", { description: "Signed out from all other devices." });
      } else {
        toast.success("Password updated");
      }
      setDone(true);
      setTimeout(() => navigate({ to: "/admin" }), 800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-24">
      <div className="w-full max-w-md">
        <Link to="/" className="eyebrow text-muted-foreground">← Nomzy Escapes</Link>
        <h1 className="mt-6 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">
          Set a new password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {ready
            ? "Choose a strong password you haven't used before."
            : "Verifying your reset link…"}
        </p>

        {ready && !done && (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <label className="block">
              <span className="eyebrow">New password</span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>
            <label className="block">
              <span className="eyebrow">Confirm password</span>
              <input
                required
                type="password"
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={signOutOthers}
                onChange={(e) => setSignOutOthers(e.target.checked)}
                className="mt-1 h-4 w-4 accent-foreground"
              />
              <span className="text-sm text-muted-foreground">
                Sign out from all other devices
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 h-12 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password"}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {done && (
          <p className="mt-10 text-sm text-muted-foreground">
            Password updated. Redirecting…
          </p>
        )}

        <Link
          to="/auth"
          className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </section>
  );
}
