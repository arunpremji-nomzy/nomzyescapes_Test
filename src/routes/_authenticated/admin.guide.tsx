import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Inbox,
  Building2,
  FileText,
  MapPin,
  MessageSquareQuote,
  LayoutGrid,
  Image as ImageIcon,
  Shield,
  Upload,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  HelpCircle,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/guide")({
  head: () => ({
    meta: [
      { title: "Admin Guide · Nomzy Escapes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GuidePage,
});

type Step = { how: string; note?: string };
type Task = { icon: typeof Pencil; label: string; steps: Step[] };
type Section = {
  icon: typeof Inbox;
  title: string;
  to?: string;
  summary: string;
  tasks: Task[];
};

const SECTIONS: Section[] = [
  {
    icon: Inbox,
    title: "Inquiries",
    to: "/admin",
    summary: "Contact and booking requests submitted from the site.",
    tasks: [
      {
        icon: Pencil,
        label: "Reply / mark handled",
        steps: [
          { how: "Open Inquiries in the sidebar." },
          { how: "Click a row to see the guest's message, email, dates and destination." },
          { how: "Reply from your own email/WhatsApp using the links shown." },
          { how: "Click Mark as handled to move it out of the unread view.", note: "Guests are not notified — this only updates admin state." },
        ],
      },
      {
        icon: Trash2,
        label: "Delete an inquiry",
        steps: [
          { how: "Open the inquiry." },
          { how: "Click Delete and confirm.", note: "Permanent — export the details first if you need them." },
        ],
      },
    ],
  },
  {
    icon: Building2,
    title: "Properties",
    to: "/admin/properties",
    summary: "Stays shown on /properties and inside destination pages.",
    tasks: [
      {
        icon: Plus,
        label: "Add a property",
        steps: [
          { how: "Click New property (top right)." },
          { how: "Fill in name, slug, destination, price band, capacity and amenities.", note: "Slug becomes the URL: /properties/your-slug. Use lowercase-with-dashes." },
          { how: "Upload the hero image and gallery images with the image uploader." },
          { how: "Toggle Published on and click Save." },
        ],
      },
      {
        icon: Pencil,
        label: "Edit a property",
        steps: [
          { how: "Click the property in the list." },
          { how: "Change any field, replace or reorder gallery images." },
          { how: "Click Save. Changes appear on the live site within seconds." },
        ],
      },
      {
        icon: EyeOff,
        label: "Hide without deleting",
        steps: [
          { how: "Open the property and toggle Published off." },
          { how: "Save. The stay disappears from the public site but keeps all its data." },
        ],
      },
      {
        icon: Trash2,
        label: "Delete a property",
        steps: [
          { how: "Open the property, scroll to the bottom, click Delete." },
          { how: "Confirm.", note: "Permanent. Prefer unpublishing if you might bring it back." },
        ],
      },
    ],
  },
  {
    icon: FileText,
    title: "Content",
    to: "/admin/content",
    summary: "Editable copy and imagery for home, destinations index and marketing sections.",
    tasks: [
      {
        icon: Pencil,
        label: "Edit a section",
        steps: [
          { how: "Open Content and pick the tab for the section (hero, signature experiences, footer CTA, etc.)." },
          { how: "Change text fields. Use the image uploader for photos." },
          { how: "Click Save on that section.", note: "Each section saves independently — no global save button." },
        ],
      },
      {
        icon: Plus,
        label: "Add an item to a list (e.g. signature experience card)",
        steps: [
          { how: "Scroll to the list inside the tab." },
          { how: "Click Add item — a new empty row appears." },
          { how: "Fill in the fields and upload an image if needed." },
          { how: "Save the section." },
        ],
      },
      {
        icon: GripVertical,
        label: "Reorder items",
        steps: [
          { how: "Drag the handle on the left of each row up or down." },
          { how: "Save the section to lock the new order." },
        ],
      },
      {
        icon: Trash2,
        label: "Remove an item",
        steps: [
          { how: "Click the trash / remove icon on the row." },
          { how: "Save the section.", note: "Removal only becomes permanent after Save — refreshing before saving restores the row." },
        ],
      },
    ],
  },
  {
    icon: MapPin,
    title: "Destinations",
    to: "/admin/destinations",
    summary: "Pages under /destinations/:slug (Fort Kochi, Varkala, Alleppey, …).",
    tasks: [
      {
        icon: Plus,
        label: "Add a destination",
        steps: [
          { how: "Click New destination." },
          { how: "Set name, slug, hero image and intro copy." },
          { how: "Add highlights, gallery and day-in-the-life sections." },
          { how: "Publish and Save. It appears on /destinations automatically." },
        ],
      },
      {
        icon: Pencil,
        label: "Edit a destination",
        steps: [
          { how: "Click the destination card." },
          { how: "Update any block (hero, intro, gallery, highlights)." },
          { how: "Save." },
          { how: "Do not rename an existing slug unless you also update outbound links.", note: "Old URLs stop working when the slug changes." },
        ],
      },
      {
        icon: Trash2,
        label: "Delete a destination",
        steps: [
          { how: "Open the destination and click Delete." },
          { how: "Confirm.", note: "Properties linked to this destination will lose their link and need reassigning." },
        ],
      },
    ],
  },
  {
    icon: MessageSquareQuote,
    title: "Testimonials",
    to: "/admin/testimonials",
    summary: "Guest quotes on the home and destination pages.",
    tasks: [
      {
        icon: Plus,
        label: "Add a testimonial",
        steps: [
          { how: "Click Add testimonial." },
          { how: "Enter guest name, location, quote and an optional avatar image." },
          { how: "Save." },
        ],
      },
      {
        icon: Pencil,
        label: "Edit a quote",
        steps: [
          { how: "Click the pencil icon on a row." },
          { how: "Update text or image and Save." },
        ],
      },
      {
        icon: GripVertical,
        label: "Reorder",
        steps: [{ how: "Drag the handle. The order in admin is the order on the site." }],
      },
      {
        icon: EyeOff,
        label: "Hide temporarily",
        steps: [{ how: "Click the eye icon on the row to toggle visibility. No delete needed." }],
      },
      {
        icon: Trash2,
        label: "Delete a testimonial",
        steps: [{ how: "Click the trash icon and confirm.", note: "Permanent." }],
      },
    ],
  },
  {
    icon: LayoutGrid,
    title: "Page Builder",
    to: "/admin/layout",
    summary: "Reorder and hide entire sections on Home, Destinations and Experiences.",
    tasks: [
      {
        icon: GripVertical,
        label: "Reorder sections",
        steps: [
          { how: "Pick the page (Home / Destinations / Experiences) at the top." },
          { how: "Drag section rows up or down." },
          { how: "Save.", note: "Order on the live page updates within seconds." },
        ],
      },
      {
        icon: EyeOff,
        label: "Hide a section",
        steps: [
          { how: "Click the eye icon on the section row." },
          { how: "Save. The section disappears from the public page but its content stays intact." },
        ],
      },
      {
        icon: Pencil,
        label: "Reset to default",
        steps: [{ how: "Click Reset to default to restore the original order and visibility for that page." }],
      },
    ],
  },
];

function GuidePage() {
  return (
    <AdminShell
      title="Admin guide"
      eyebrow="How everything works"
      description="Step-by-step: how to edit, add, hide, reorder and delete in every section of the admin."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="space-y-10">
          <Card icon={HelpCircle} title="The basics">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• The sidebar on the left is your navigation. Toggle it with the icon in the header.</li>
              <li>• Every edit screen has a <span className="text-foreground">Save</span> button — nothing is saved automatically.</li>
              <li>• Use <span className="text-foreground">View site</span> in the header to open the live site in a new tab and check your changes.</li>
              <li>• Sign out from the bottom of the sidebar when you're done.</li>
            </ul>
          </Card>

          <Card icon={LayoutGrid} title="Icons you'll see everywhere">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><Pencil size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Pencil</span> — edit this item.</span></li>
              <li className="flex gap-2"><Plus size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Plus</span> — add a new item to a list.</span></li>
              <li className="flex gap-2"><GripVertical size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Drag handle</span> — click and hold to reorder.</span></li>
              <li className="flex gap-2"><Eye size={14} className="mt-1 shrink-0" />/<EyeOff size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Eye toggle</span> — hide/show without deleting.</span></li>
              <li className="flex gap-2"><Save size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Save</span> — commit your changes. Disabled when there's nothing to save.</span></li>
              <li className="flex gap-2"><Trash2 size={14} className="mt-1 shrink-0" /> <span><span className="text-foreground">Trash</span> — permanent delete. Always shows a confirm.</span></li>
            </ul>
          </Card>

          {SECTIONS.map((s) => (
            <SectionCard key={s.title} section={s} />
          ))}

          <Card icon={ImageIcon} title="Images & media">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><Upload size={14} className="mt-1 shrink-0" /> Use the image uploader wherever you see it — files up to 5&nbsp;MB, JPG or PNG.</li>
              <li>• You can also paste an external image URL if the asset already lives elsewhere.</li>
              <li>• To replace an image, click Replace image on the uploader — the old file stays in storage but is no longer referenced.</li>
              <li>• To remove an image, click the × on the preview then Save. The field becomes empty and the site falls back to the default (if any).</li>
              <li>• Aim for landscape 3:2 or 16:9 photos for hero and card images so nothing gets awkwardly cropped.</li>
            </ul>
          </Card>

          <Card icon={AlertTriangle} title="Before you delete">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Deletion is permanent — there is no undo or trash bin.</li>
              <li>• If you might bring an item back, use the eye toggle (hide) or Published off instead.</li>
              <li>• Changing a slug is effectively a delete + create for URLs — old links will 404. Update navigation and any shared links.</li>
              <li>• Deleting a destination unlinks properties assigned to it. Reassign those properties afterwards.</li>
            </ul>
          </Card>

          <Card icon={Shield} title="Access & safety">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Only accounts with the <span className="text-foreground">admin</span> role can reach this area.</li>
              <li>• If a change doesn't appear on the live site, reload the site tab — most updates go live within seconds.</li>
              <li>• When in doubt, hide instead of delete. You can always delete later; you can't un-delete.</li>
            </ul>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 h-max border border-border bg-background p-5">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">On this page</p>
          <nav className="mt-4 space-y-2 text-sm">
            {SECTIONS.map((s) => (
              <Link
                key={s.title}
                to={s.to as any}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <s.icon size={14} /> {s.title}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </AdminShell>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Inbox;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="h-8 w-8 grid place-items-center border border-border rounded-sm text-muted-foreground">
          <Icon size={15} />
        </div>
        <h2 className="font-display font-light text-xl tracking-[-0.01em]">{title}</h2>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

function SectionCard({ section }: { section: Section }) {
  const Icon = section.icon;
  return (
    <section className="border border-border bg-background p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <div className="h-8 w-8 grid place-items-center border border-border rounded-sm text-muted-foreground shrink-0">
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display font-light text-xl tracking-[-0.01em]">{section.title}</h2>
            {section.to && (
              <Link
                to={section.to as any}
                className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground border border-border px-2 py-0.5"
              >
                Open
              </Link>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{section.summary}</p>
        </div>
      </div>

      <div className="pt-4 space-y-5">
        {section.tasks.map((t) => {
          const TIcon = t.icon;
          return (
            <div key={t.label}>
              <div className="flex items-center gap-2">
                <TIcon size={14} className="text-muted-foreground" />
                <h3 className="text-sm font-medium tracking-[-0.005em]">{t.label}</h3>
              </div>
              <ol className="mt-2 ml-6 space-y-1.5 text-sm text-muted-foreground list-decimal">
                {t.steps.map((s, i) => (
                  <li key={i}>
                    {s.how}
                    {s.note && (
                      <span className="block text-xs text-muted-foreground/80 italic mt-0.5">
                        {s.note}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
