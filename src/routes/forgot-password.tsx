import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password · Nomzy Escapes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent", { description: "Check your email inbox." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-24">
      <div className="w-full max-w-md">
        <Link to="/auth" className="eyebrow text-muted-foreground">← Back to sign in</Link>
        <h1 className="mt-6 font-display font-light text-4xl md:text-5xl tracking-[-0.02em]">
          Forgot password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {sent
            ? "We've sent you a reset link. Open it from your email to set a new password."
            : "Enter your account email and we'll send you a reset link."}
        </p>

        {!sent && (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <label className="block">
              <span className="eyebrow">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 h-12 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
