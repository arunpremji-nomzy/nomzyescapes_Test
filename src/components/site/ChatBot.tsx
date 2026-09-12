import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Bug, RotateCw, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const THROTTLE_MS = 80; // smoother streaming on slow networks
const MIN_SEND_INTERVAL = 800; // throttle rapid sends
const MAX_RETRIES = 2;

type DebugMeta = {
  fetchedAt?: string;
  totalAvailable?: number;
  candidates?: Array<{ id: string; name: string }>;
  cited?: Array<{ id: string; name: string }>;
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [debug, setDebug] = useState(false);
  const [input, setInput] = useState("");
  const [lastError, setLastError] = useState<string | null>(null);
  const lastSendRef = useRef(0);
  const retriesRef = useRef(0);
  const lastTextRef = useRef<string>("");

  const { messages, sendMessage, status, regenerate } = useChat({
    transport,
    experimental_throttle: THROTTLE_MS,
    onError: (err) => {
      setLastError(err.message || "Network error");
      // Auto-retry on transient failures
      if (retriesRef.current < MAX_RETRIES) {
        retriesRef.current += 1;
        const delay = 600 * 2 ** (retriesRef.current - 1);
        setTimeout(() => {
          setLastError(null);
          regenerate().catch(() => {});
        }, delay);
      }
    },
    onFinish: () => {
      retriesRef.current = 0;
      setLastError(null);
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const busy = status === "submitted" || status === "streaming";

  const doSend = useCallback(
    async (text: string) => {
      const now = Date.now();
      if (now - lastSendRef.current < MIN_SEND_INTERVAL) return;
      lastSendRef.current = now;
      lastTextRef.current = text;
      retriesRef.current = 0;
      setLastError(null);
      try {
        await sendMessage({ text });
      } catch (err) {
        setLastError(err instanceof Error ? err.message : "Send failed");
      }
    },
    [sendMessage],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await doSend(text);
  };

  const onManualRetry = () => {
    setLastError(null);
    retriesRef.current = 0;
    regenerate().catch((err) => setLastError(err?.message ?? "Retry failed"));
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open concierge chat"
          className="fixed bottom-6 right-24 z-50 inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {open && (
        <div className="fixed z-50 flex flex-col overflow-hidden bg-background shadow-2xl inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[560px] sm:max-h-[80vh] sm:border sm:border-border sm:rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-primary-foreground">
            <div>
              <p className="font-display text-lg leading-none">Concierge</p>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase opacity-70 mt-1">
                {debug ? "Debug mode" : "Ask anything"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDebug((v) => !v)}
                aria-label="Toggle debug mode"
                title="Toggle debug mode"
                className={`hover:opacity-100 transition-opacity ${debug ? "opacity-100" : "opacity-60"}`}
              >
                <Bug size={16} />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="hover:opacity-70">
                <X size={20} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-2">Hi! I'm your Kerala workation concierge.</p>
                <p>Ask me about properties, destinations, prices, amenities, or long-stay options.</p>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isUser = m.role === "user";
              const meta = (m as unknown as { metadata?: DebugMeta }).metadata;
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  {isUser ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 bg-primary text-primary-foreground text-sm">
                      {text}
                    </div>
                  ) : (
                    <div className="max-w-[90%] text-sm text-foreground prose prose-sm prose-neutral max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_li]:my-0.5">
                      {text ? <ReactMarkdown>{text}</ReactMarkdown> : <StreamSkeleton />}
                    </div>
                  )}
                  {debug && !isUser && meta && (
                    <DebugPanel meta={meta} />
                  )}
                </div>
              );
            })}
            {status === "submitted" && <StreamSkeleton />}
            {lastError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive flex items-center justify-between gap-2">
                <span>Connection issue: {lastError}</span>
                <button
                  onClick={onManualRetry}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-destructive text-destructive-foreground"
                >
                  <RotateCw size={12} /> Retry
                </button>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a stay…"
              className="flex-1 bg-muted/40 rounded-full px-4 h-10 text-sm outline-none focus:ring-2 focus:ring-accent"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function StreamSkeleton() {
  return (
    <div className="space-y-2 py-1" aria-label="Loading response">
      <div className="h-2.5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-2.5 w-5/6 rounded bg-muted animate-pulse" />
      <div className="h-2.5 w-2/3 rounded bg-muted animate-pulse" />
    </div>
  );
}

function DebugPanel({ meta }: { meta: DebugMeta }) {
  return (
    <div className="mt-2 w-full max-w-[90%] rounded-lg border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5 font-medium text-foreground mb-1.5">
        <Database size={11} />
        Grounding data
        {meta.fetchedAt && (
          <span className="ml-auto font-normal opacity-70">
            {new Date(meta.fetchedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div>
        Fetched <strong>{meta.totalAvailable ?? 0}</strong> live properties ·{" "}
        Cited <strong>{meta.cited?.length ?? 0}</strong>
      </div>
      {meta.cited && meta.cited.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {meta.cited.map((p) => (
            <li key={p.id} className="truncate">
              ✓ {p.name} <span className="opacity-50">({p.id.slice(0, 8)})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
