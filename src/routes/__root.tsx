import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { RevealObserver } from "../components/site/RevealObserver";
import { WhatsAppButton } from "../components/site/WhatsAppButton";
import { ChatBot } from "../components/site/ChatBot";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-foreground">Lost in the backwaters</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has drifted away.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center px-6 h-11 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Something went quiet.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Try again, or head home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-5 h-10 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase"
          >
            Try again
          </button>
          <a href="/" className="px-5 h-10 inline-flex items-center border border-border text-xs tracking-[0.18em] uppercase">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nomzy Escapes — Work From Paradise" },
      { name: "description", content: "Curated workation stays and immersive Kerala experiences for remote professionals." },
      { property: "og:title", content: "Nomzy Escapes — Work From Paradise" },
      { property: "og:description", content: "Curated workation stays and immersive Kerala experiences for remote professionals." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Nomzy Escapes" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "d3BFaLaUPC29DJvesF-ewOT3bfmK5yeXEHXWiyvB21g" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
         <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-6M2TLBX7MF"
    />

    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6M2TLBX7MF');
        `,
      }}
    />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RevealObserver />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <Toaster />
    </QueryClientProvider>
  );
}
