import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "How do I add a new property?",
  "How do I hide a testimonial without deleting it?",
  "How do I reorder homepage sections?",
  "What happens if I change a slug?",
];

export function AdminChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: "admin-helper",
    transport: new DefaultChatTransport({ api: "/api/admin-chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    await sendMessage({ text: t });
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:scale-105 transition"
          aria-label="Open admin assistant"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 left-5 z-40 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-2rem))] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <header className="h-12 px-4 flex items-center justify-between border-b border-border bg-muted/40 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <Sparkles size={13} />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-medium">Admin Assistant</p>
                <p className="text-[10px] text-muted-foreground tracking-[0.14em] uppercase">
                  Ask anything
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 w-7 grid place-items-center rounded hover:bg-muted"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi! I can help you use the admin panel — how to edit, add, hide, reorder or delete anything. Ask away.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="text-[11px] px-2.5 py-1 border border-border rounded-full hover:bg-muted text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m: UIMessage) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] rounded-lg px-3 py-2 bg-primary text-primary-foreground text-sm whitespace-pre-wrap"
                        : "max-w-[92%] text-sm text-foreground prose prose-sm prose-neutral dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5"
                    }
                  >
                    {isUser ? text : <ReactMarkdown>{text}</ReactMarkdown>}
                  </div>
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={12} className="animate-spin" /> Thinking…
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive">
                Something went wrong. Try again.
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t border-border p-2 flex items-end gap-2 shrink-0"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about the admin…"
              rows={1}
              className="flex-1 resize-none bg-background text-sm px-3 py-2 border border-border rounded outline-none focus:ring-1 focus:ring-ring max-h-32"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="h-9 w-9 grid place-items-center rounded bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Send"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
