
-- Destinations CMS table
CREATE TABLE public.site_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  region text,
  tagline text,
  image_url text,
  wifi text,
  stays integer DEFAULT 0,
  starting_price numeric,
  cta_label text DEFAULT 'Explore',
  cta_link text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_destinations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_destinations TO authenticated;
GRANT ALL ON public.site_destinations TO service_role;
ALTER TABLE public.site_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published destinations" ON public.site_destinations
  FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert destinations" ON public.site_destinations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update destinations" ON public.site_destinations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete destinations" ON public.site_destinations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_destinations_set_updated
  BEFORE UPDATE ON public.site_destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Testimonials
CREATE TABLE public.site_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role text,
  country text,
  flag text,
  quote text NOT NULL,
  image_url text,
  destination_slug text,
  stay_length text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_testimonials TO authenticated;
GRANT ALL ON public.site_testimonials TO service_role;
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published testimonials" ON public.site_testimonials
  FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert testimonials" ON public.site_testimonials
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update testimonials" ON public.site_testimonials
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete testimonials" ON public.site_testimonials
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_testimonials_set_updated
  BEFORE UPDATE ON public.site_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
