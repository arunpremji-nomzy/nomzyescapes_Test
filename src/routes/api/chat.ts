import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown };
type PropMeta = { id: string; name: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: properties } = await supabaseAdmin
          .from("properties")
          .select("id,name,destination,description,price_per_night,bedrooms,guests,amenities,status")
          .eq("status", "published")
          .limit(50);

        const propsArr = properties ?? [];
        const fetchedAt = new Date().toISOString();

        const propertyContext = propsArr
          .map(
            (p) =>
              `• [${p.name}] — ${p.destination ?? "Kerala"} | ₹${p.price_per_night ?? "?"}/night | ${p.bedrooms ?? "?"}BR, sleeps ${p.guests ?? "?"} | Amenities: ${(p.amenities ?? []).join(", ") || "—"}\n  ${p.description ?? ""}`,
          )
          .join("\n\n");

        const system = `You are the Nomzy Escapes concierge — a warm, concise assistant helping travellers plan Kerala workations. Use ONLY the real property data below when recommending stays. If asked about something not listed, say so honestly and offer the WhatsApp concierge (+91 62388 39179).

LIVE PROPERTIES (${propsArr.length}, fetched ${fetchedAt}):
${propertyContext || "No properties available right now."}

Style: short paragraphs, markdown bullet lists, mention prices in ₹, suggest 1–3 properties max per answer. Always refer to properties by their exact name (in brackets above).`;

        const gateway = createLovableAiGatewayProvider(key);
        let cited: PropMeta[] = [];
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system,
          messages: await convertToModelMessages(messages as UIMessage[]),
          onFinish: ({ text }) => {
            const lower = (text ?? "").toLowerCase();
            cited = propsArr
              .filter((p) => p.name && lower.includes(p.name.toLowerCase()))
              .map((p) => ({ id: p.id, name: p.name }));
          },
        });

        return result.toUIMessageStreamResponse({
          messageMetadata: ({ part }) => {
            if (part.type === "finish") {
              return {
                fetchedAt,
                totalAvailable: propsArr.length,
                candidates: propsArr.map((p) => ({ id: p.id, name: p.name })) as PropMeta[],
                cited,
              };
            }
          },
        });
      },
    },
  },
});
