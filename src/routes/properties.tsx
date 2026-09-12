import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/properties")({
  component: PropertiesGate,
});

function PropertiesGate() {
  const { data: features, isLoading } = useSiteContent("features");
  if (isLoading) return null;
  const enabled = features?.propertiesEnabled ?? true;
  if (!enabled) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-md text-center">
          <p className="eyebrow text-muted-foreground">Currently unavailable</p>
          <h1 className="mt-4 font-display font-light text-3xl md:text-4xl tracking-[-0.02em]">
            Properties are not available right now.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Please check back soon, or reach out to our concierge for personalised recommendations.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/" className="h-10 px-5 inline-flex items-center border border-border text-xs tracking-[0.18em] uppercase">Home</Link>
            <Link to="/contact" className="h-10 px-5 inline-flex items-center bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase">Contact</Link>
          </div>
        </div>
      </section>
    );
  }
  return <Outlet />;
}
