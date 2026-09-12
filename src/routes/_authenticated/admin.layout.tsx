import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { SortableList } from "@/components/admin/SortableList";
import {
  usePageLayout,
  useSavePageLayout,
  defaultLayouts,
  type PageKey,
  type SectionConfig,
} from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/layout")({
  head: () => ({
    meta: [
      { title: "Page Builder · Nomzy Escapes Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LayoutAdmin,
});

const PAGES: { key: PageKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "destinations", label: "Destinations" },
  { key: "experiences", label: "Experiences" },
];

function LayoutAdmin() {
  const [page, setPage] = useState<PageKey>("home");

  return (
    <AdminShell title="Page Builder" description="Drag to reorder. Toggle the eye to show or hide a section.">
      <div className="flex flex-wrap gap-2 mb-8">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPage(p.key)}
            className={`px-4 h-9 text-xs tracking-[0.18em] uppercase border transition-colors ${
              page === p.key ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Editor key={page} page={page} />
    </AdminShell>
  );
}

function Editor({ page }: { page: PageKey }) {
  const { data, isLoading } = usePageLayout(page);
  const save = useSavePageLayout();
  const [draft, setDraft] = useState<SectionConfig[] | null>(null);

  useEffect(() => { if (data) setDraft(data); }, [data]);

  if (isLoading || !draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-muted-foreground mb-4">
        {draft.length} section{draft.length === 1 ? "" : "s"} — {draft.filter((s) => s.visible).length} visible
      </p>
      <SortableList
        items={draft}
        onReorder={setDraft}
        renderItem={(s, i) => (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <div className="text-sm">{s.label}</div>
              <div className="text-[0.65rem] text-muted-foreground font-mono">{s.id}</div>
            </div>
            <button
              onClick={() => setDraft(draft.map((x) => x.id === s.id ? { ...x, visible: !x.visible } : x))}
              className={`h-9 w-9 border inline-flex items-center justify-center ${s.visible ? "border-border" : "border-dashed border-muted-foreground/40 text-muted-foreground"}`}
              title={s.visible ? "Hide section" : "Show section"}
            >
              {s.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        )}
      />
      <div className="border-t border-border mt-8 pt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setDraft(defaultLayouts[page])}
          className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={14} /> Reset to default
        </button>
        <button
          onClick={() => save.mutate({ page, value: draft }, { onSuccess: () => toast.success("Layout saved") })}
          disabled={save.isPending || !dirty}
          className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase disabled:opacity-60"
        >
          <Save size={14} /> {save.isPending ? "Saving…" : "Save layout"}
        </button>
      </div>
    </div>
  );
}
