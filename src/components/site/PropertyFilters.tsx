import { Wifi, Briefcase, CalendarRange, IndianRupee, X } from "lucide-react";

export type StayLength = "any" | "short" | "medium" | "long";

export type PropertyFilterValue = {
  budgetMax: number | null;
  wifi: boolean;
  workspace: boolean;
  stay: StayLength;
};

export const defaultFilters: PropertyFilterValue = {
  budgetMax: null,
  wifi: false,
  workspace: false,
  stay: "any",
};

const WIFI_TAGS = ["high-speed fibre", "high-speed wifi", "fibre internet", "fast wifi"];
const WORK_TAGS = ["workspace", "desk", "co-working", "standing desk", "ergonomic chair"];
const LONG_STAY_TAGS = ["monthly stays", "long stay", "monthly discount"];

const has = (amenities: string[] | null | undefined, tags: string[]) =>
  (amenities ?? []).some((a) => tags.includes(a.trim().toLowerCase()));

export function applyPropertyFilters<
  T extends { price_per_night?: number | null; amenities?: string[] | null }
>(items: T[], f: PropertyFilterValue): T[] {
  return items.filter((p) => {
    if (f.budgetMax != null && (p.price_per_night ?? 0) > f.budgetMax) return false;
    if (f.wifi && !has(p.amenities, WIFI_TAGS)) return false;
    if (f.workspace && !has(p.amenities, WORK_TAGS)) return false;
    if (f.stay === "long" && !has(p.amenities, LONG_STAY_TAGS)) return false;
    return true;
  });
}

type Props = {
  value: PropertyFilterValue;
  onChange: (next: PropertyFilterValue) => void;
  maxBudget: number;
  hideBudget?: boolean;
};

export function PropertyFilters({ value, onChange, maxBudget, hideBudget = false }: Props) {
  const sliderMax = Math.max(1000, Math.ceil(maxBudget / 500) * 500);
  const current = value.budgetMax ?? sliderMax;
  const active =
    value.budgetMax != null || value.wifi || value.workspace || value.stay !== "any";

  return (
    <div className={`mt-6 border border-border bg-background p-5 grid gap-5 ${hideBudget ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
      {!hideBudget && (
      <label className="block">

        <span className="block text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground mb-2 inline-flex items-center gap-1">
          <IndianRupee size={11} /> Budget / night
        </span>
        <input
          type="range"
          min={500}
          max={sliderMax}
          step={500}
          value={current}
          onChange={(e) =>
            onChange({
              ...value,
              budgetMax: Number(e.target.value) >= sliderMax ? null : Number(e.target.value),
            })
          }
          className="w-full"
        />
        <span className="block text-xs text-muted-foreground mt-1">
          Up to ₹{current.toLocaleString("en-IN")}{value.budgetMax == null && " (any)"}
        </span>
      </label>
      )}

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"

          checked={value.wifi}
          onChange={(e) => onChange({ ...value, wifi: e.target.checked })}
        />
        <Wifi size={14} /> High-speed WiFi
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={value.workspace}
          onChange={(e) => onChange({ ...value, workspace: e.target.checked })}
        />
        <Briefcase size={14} /> Workspace setup
      </label>

      <label className="block">
        <span className="block text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground mb-2 inline-flex items-center gap-1">
          <CalendarRange size={11} /> Stay length
        </span>
        <select
          value={value.stay}
          onChange={(e) => onChange({ ...value, stay: e.target.value as StayLength })}
          className="w-full h-9 px-2 border border-border bg-background text-sm"
        >
          <option value="any">Any length</option>
          <option value="short">Short (≤ 7 nights)</option>
          <option value="medium">Medium (8–29 nights)</option>
          <option value="long">Long (30+ nights)</option>
        </select>
      </label>

      {active && (
        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="md:col-span-4 justify-self-start inline-flex items-center gap-1 text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
        >
          <X size={12} /> Clear filters
        </button>
      )}
    </div>
  );
}
