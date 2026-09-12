import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LogOut,
  ShieldAlert,
  Inbox,
  Building2,
  FileText,
  MapPin,
  MessageSquareQuote,
  LayoutGrid,
  HelpCircle,
  ExternalLink,
  PanelLeft,
  UserCog,
  ShieldCheck,



} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
};

const NAV: { to: any; label: string; icon: typeof Inbox }[] = [
  { to: "/admin", label: "Inquiries", icon: Inbox },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/layout", label: "Page Builder", icon: LayoutGrid },
  { to: "/admin/guide", label: "Guide", icon: HelpCircle },
  { to: "/admin/account", label: "Account", icon: UserCog },
  { to: "/admin/sessions", label: "Sessions", icon: ShieldCheck },


];


export function AdminShell({ title, eyebrow = "Concierge Desk", description, children }: AdminShellProps) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      setEmail(u.user?.email ?? null);
      if (!uid) return setIsAdmin(false);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return (
      <section className="min-h-screen grid place-items-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }
  if (isAdmin === false) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto text-muted-foreground" size={32} />
          <h1 className="mt-6 font-display font-light text-3xl">Not authorised</h1>
          <button onClick={signOut} className="mt-6 text-sm underline text-muted-foreground">
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar email={email} onSignOut={signOut} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 h-14 flex items-center gap-3 border-b border-border bg-background/90 backdrop-blur px-4 md:px-6">
            <SidebarTrigger aria-label="Toggle navigation">
              <PanelLeft size={16} />
            </SidebarTrigger>
            <div className="h-5 w-px bg-border" />
            <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground truncate">
              {eyebrow}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 text-xs tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground border border-border rounded-sm"
              >
                <ExternalLink size={12} /> View site
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 md:px-8 py-8 md:py-10">
            <div className="max-w-6xl mx-auto">
              <div className="pb-6 border-b border-border">
                <h1 className="font-display font-light text-3xl md:text-4xl tracking-[-0.02em]">
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{description}</p>
                )}
              </div>
              <div className="mt-8">{children}</div>
            </div>
          </main>
        </div>
        <AdminChatbot />
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (to: string) =>
    to === "/admin" ? pathname === "/admin" : pathname === to || pathname.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-sm bg-primary text-primary-foreground grid place-items-center text-xs font-medium tracking-[0.14em]">
            N
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Nomzy</p>
              <p className="text-sm font-medium truncate">Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = isActive(n.to);
                return (
                  <SidebarMenuItem key={n.label}>
                    <SidebarMenuButton asChild isActive={active} tooltip={n.label}>
                      <Link to={n.to} className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{n.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && email && (
          <p className="px-2 pt-1 text-xs text-muted-foreground truncate" title={email}>
            {email}
          </p>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} tooltip="Sign out">
              <LogOut size={16} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
