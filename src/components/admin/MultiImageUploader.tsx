import { useState } from "react";
import { Upload, X, Loader2, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type GalleryItem = { url: string; caption: string; alt: string };

type Props = {
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  folder?: string;
};

export function MultiImageUploader({ value, onChange, folder = "properties" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");

  const uploadOne = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is over 5MB — skipped`);
      return null;
    }
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (upErr) {
      toast.error(upErr.message);
      return null;
    }
    const { data: signed, error: signErr } = await supabase.storage
      .from("site-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signErr || !signed) {
      toast.error(signErr?.message ?? "Failed to get URL");
      return null;
    }
    return signed.signedUrl;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const next = [...value];
    for (const f of Array.from(files)) {
      const url = await uploadOne(f);
      if (url) next.push({ url, caption: "", alt: "" });
    }
    setUploading(false);
    onChange(next);
    toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded`);
  };

  const patch = (i: number, p: Partial<GalleryItem>) =>
    onChange(value.map((it, j) => (j === i ? { ...it, ...p } : it)));
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const makeCover = (i: number) => {
    if (i === 0) return;
    const next = [...value];
    const [it] = next.splice(i, 1);
    next.unshift(it);
    onChange(next);
  };
  const addUrl = () => {
    const u = pasteUrl.trim();
    if (!u) return;
    onChange([...value, { url: u, caption: "", alt: "" }]);
    setPasteUrl("");
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid gap-3">
          {value.map((item, i) => (
            <div key={`${item.url}-${i}`} className="border border-border bg-background p-3 grid grid-cols-[120px_1fr] gap-3">
              <div className="relative">
                <img src={item.url} alt={item.alt} className="w-full aspect-square object-cover border border-border" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[0.55rem] tracking-[0.15em] uppercase px-1.5 py-0.5">
                    <Star size={9} /> Cover
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground">Image #{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => move(i, -1)} className="h-7 w-7 border border-border inline-flex items-center justify-center hover:bg-muted" title="Move up"><ArrowLeft size={11} /></button>
                    <button type="button" onClick={() => move(i, 1)} className="h-7 w-7 border border-border inline-flex items-center justify-center hover:bg-muted" title="Move down"><ArrowRight size={11} /></button>
                    {i !== 0 && (
                      <button type="button" onClick={() => makeCover(i)} className="h-7 w-7 border border-border inline-flex items-center justify-center hover:bg-muted" title="Make cover"><Star size={11} /></button>
                    )}
                    <button type="button" onClick={() => remove(i)} className="h-7 w-7 border border-border inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground" title="Remove"><X size={11} /></button>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.caption}
                  onChange={(e) => patch(i, { caption: e.target.value })}
                  placeholder="Caption (shown under the photo)"
                  className="h-9 px-3 border border-border bg-background text-xs"
                />
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => patch(i, { alt: e.target.value })}
                  placeholder="Alt text (describe the image for accessibility & SEO)"
                  className="h-9 px-3 border border-border bg-background text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase cursor-pointer hover:bg-muted">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading…" : "Upload images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-[0.65rem] text-muted-foreground">Pick multiple files at once · up to 5MB each · first image is the cover</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={pasteUrl}
          onChange={(e) => setPasteUrl(e.target.value)}
          placeholder="or paste an image URL"
          className="flex-1 h-9 px-3 border border-border bg-background text-xs"
        />
        <button type="button" onClick={addUrl} disabled={!pasteUrl.trim()} className="h-9 px-3 border border-border text-[0.65rem] tracking-[0.18em] uppercase hover:bg-muted disabled:opacity-50">Add</button>
      </div>
    </div>
  );
}
