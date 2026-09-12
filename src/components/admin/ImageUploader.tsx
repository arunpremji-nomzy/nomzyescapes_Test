import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

export function ImageUploader({ value, onChange, folder = "general" }: Props) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(false);
      return;
    }
    const { data: signed, error: signErr } = await supabase.storage
      .from("site-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (signErr || !signed) {
      toast.error(signErr?.message ?? "Failed to get URL");
      return;
    }
    onChange(signed.signedUrl);
    toast.success("Image uploaded");
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-auto object-cover border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 h-6 w-6 bg-background border border-border rounded-full inline-flex items-center justify-center"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <label className="inline-flex items-center gap-2 h-10 px-4 border border-border text-xs tracking-[0.18em] uppercase cursor-pointer hover:bg-muted">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL"
        className="w-full h-9 px-3 border border-border bg-background text-xs"
      />
    </div>
  );
}
