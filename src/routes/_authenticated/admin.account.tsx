import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/account")({
  head: () => ({
    meta: [
      { title: "Account · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingSignOutOthers, setLoadingSignOutOthers] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const e = data.user?.email ?? "";
      setCurrentEmail(e);
      setEmail(e);
    });
  }, []);

  const onUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email === currentEmail) return toast.error("Enter a new email");
    setLoadingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      toast.success("Confirmation sent", {
        description: "Check both old and new inboxes to confirm the change.",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setLoadingEmail(false);
    }
  };

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoadingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirm("");
      toast.success("Password updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const onSignOutOthers = async () => {
    setLoadingSignOutOthers(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "others" });
      if (error) throw error;
      toast.success("Signed out from all other devices");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign out other sessions");
    } finally {
      setLoadingSignOutOthers(false);
    }
  };

  return (
    <AdminShell
      title="Account"
      eyebrow="Settings"
      description="Update your sign-in email, change your password, and manage active sessions."
    >
      <div className="space-y-16 max-w-xl">
        <section>
          <h2 className="eyebrow text-muted-foreground">Email / Username</h2>
          <form onSubmit={onUpdateEmail} className="mt-4 space-y-6">
            <label className="block">
              <span className="text-sm">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>
            <button
              type="submit"
              disabled={loadingEmail}
              className="inline-flex items-center gap-3 h-11 px-6 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {loadingEmail ? "Updating…" : "Update email"}
              <ArrowRight size={14} />
            </button>
          </form>
        </section>

        <section>
          <h2 className="eyebrow text-muted-foreground">Change password</h2>
          <form onSubmit={onUpdatePassword} className="mt-4 space-y-6">
            <label className="block">
              <span className="text-sm">New password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Confirm new password</span>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>
            <button
              type="submit"
              disabled={loadingPassword}
              className="inline-flex items-center gap-3 h-11 px-6 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {loadingPassword ? "Updating…" : "Update password"}
              <ArrowRight size={14} />
            </button>
          </form>
        </section>

        <section>
          <h2 className="eyebrow text-muted-foreground">Active sessions</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Signed out from anywhere you don't recognise? Revoke all other sessions —
            your current device stays signed in.
          </p>
          <button
            type="button"
            onClick={onSignOutOthers}
            disabled={loadingSignOutOthers}
            className="mt-6 inline-flex items-center gap-3 h-11 px-6 border border-border text-xs tracking-[0.2em] uppercase hover:bg-muted disabled:opacity-50"
          >
            <LogOut size={14} />
            {loadingSignOutOthers ? "Signing out…" : "Sign out all other devices"}
          </button>
        </section>
      </div>
    </AdminShell>
  );
}
