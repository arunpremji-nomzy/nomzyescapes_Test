import { useEffect, useState } from "react";

const KEY = "nomzy.shortlist.v1";

export function useShortlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs]);

  const toggle = (slug: string) =>
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const remove = (slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug));
  const has = (slug: string) => slugs.includes(slug);
  const clear = () => setSlugs([]);

  return { slugs, toggle, remove, has, clear };
}
