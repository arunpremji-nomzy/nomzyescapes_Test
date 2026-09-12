ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
UPDATE public.properties
SET gallery = COALESCE(
  (SELECT jsonb_agg(jsonb_build_object('url', u, 'caption', '', 'alt', '')) FROM unnest(images) AS u),
  '[]'::jsonb
)
WHERE (gallery IS NULL OR gallery = '[]'::jsonb) AND images IS NOT NULL AND cardinality(images) > 0;