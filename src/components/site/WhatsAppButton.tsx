import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export function WhatsAppButton() {
  const { data: s } = useSiteContent("settings");
  const phone = (s?.whatsapp ?? "916238839179").replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hi ${s?.brand ?? "Nomzy"} ${s?.brandSuffix ?? "Escapes"}! I'd like to plan a Kerala workation.`,
  );
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
    >
      <MessageCircle size={24} fill="currentColor" />
    </a>
  );
}
