"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { CHAT_SUGGESTIONS, FALLBACK_REPLY, INTENTS } from "@/lib/data";
import { track } from "@/lib/tracking";
import { WA_INTRO } from "@/lib/site";

interface Msg {
  id: number;
  from: "bot" | "guest";
  text: string;
  chips?: string[];
}

const GREETING: Msg = {
  id: 1,
  from: "bot",
  text: "Welcome to Turks & Caicos 🌴 I'm the Island Concierge assistant for Tropical Drift Travel. Ask me about transfers, villas, boats, dining or celebrations — or start planning your trip.",
  chips: CHAT_SUGGESTIONS,
};

function matchIntent(input: string) {
  const text = input.toLowerCase();
  let best: { score: number; reply: string; chips?: string[] } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keywords) {
      if (text.includes(k)) score += k.length > 4 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, reply: intent.reply, chips: intent.chips };
    }
  }
  return best;
}

function chipTarget(label: string): { href?: string; reply?: string } {
  const l = label.toLowerCase();
  if (l.includes("whatsapp")) return { href: WA_INTRO };
  if (l.includes("plan my stay")) return { href: "/plan-your-stay" };
  if (l.includes("contact")) return { href: "/contact" };
  if (l.includes("services") || l.includes("villa help")) return { href: "/services" };
  if (l.includes("transportation")) return { reply: "Of course — transportation requests are one of the most common things guests ask about." };
  if (l.includes("reservation")) return { reply: "Happy to help you request a reservation." };
  if (l.includes("water")) return { reply: "Private boat days are a favourite — charters, sunset sails and snorkelling can all be coordinated around your dates." };
  if (l.includes("celebration")) return { reply: "Tell me the occasion and roughly when you arrive, and I'll help you get it in front of Cladly." };
  if (l.includes("offer")) return { reply: "Tropical Drift can assist with villa and resort recommendations, airport transportation, private boat charters, snorkelling, dining reservations, grocery pre-stocking, celebrations and full itinerary planning." };
  return {};
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMsgs((m) => [...m, { id: nextId.current++, from: "guest", text: clean }]);
    setValue("");
    setTyping(true);

    const intent = matchIntent(clean);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: nextId.current++,
          from: "bot",
          text: intent ? intent.reply : FALLBACK_REPLY,
          chips: intent?.chips ?? ["Chat on WhatsApp", "Plan My Stay"],
        },
      ]);
    }, 620);
  }

  function onChip(label: string) {
    const target = chipTarget(label);
    if (target.href) {
      track("chat_handoff", { label });
      if (target.href.startsWith("http")) {
        window.open(target.href, "_blank", "noopener,noreferrer");
      } else {
        window.location.assign(target.href);
      }
      return;
    }
    if (target.reply) {
      setMsgs((m) => [...m, { id: nextId.current++, from: "guest", text: label }]);
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: nextId.current++, from: "bot", text: target.reply! }]);
      }, 500);
      return;
    }
    send(label);
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) track("chat_open", { source: "fab" });
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close Island Concierge chat" : "Ask Your Island Concierge"}
        className="fixed bottom-5 right-4 z-[70] flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-sun px-4 py-3 text-sm font-bold shadow-hard-sm transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        {open ? <X size={18} strokeWidth={2.6} /> : <Bot size={18} strokeWidth={2.6} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Your Island Concierge"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Island Concierge chat"
            className="fixed bottom-[86px] right-3 z-[70] flex max-h-[76vh] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-[26px] border-[3px] border-ink bg-cream shadow-hard md:bottom-[92px] md:right-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b-[3px] border-ink bg-aqua px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-cream">
                  <Bot size={19} strokeWidth={2.4} />
                </span>
                <div>
                  <p className="font-display text-lg font-black leading-none">Ask Your Island Concierge</p>
                  <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink/70">
                    Simulated assistant · not a live AI
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream"
              >
                <X size={15} strokeWidth={2.6} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="dots flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m) => (
                <div key={m.id} className={m.from === "guest" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[86%] rounded-2xl border-[2.5px] border-ink px-3.5 py-2.5 text-[0.9rem] leading-relaxed ${
                      m.from === "guest" ? "bg-coral" : "bg-white shadow-hard-sm"
                    }`}
                  >
                    {m.text}
                    {m.chips && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.chips.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => onChip(c)}
                            className="rounded-full border-2 border-ink bg-sun px-3 py-1.5 text-[0.72rem] font-bold transition-transform hover:-translate-y-0.5"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-aqua"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(value);
              }}
              className="flex items-center gap-2 border-t-[3px] border-ink bg-cream px-3 py-3"
            >
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about transfers, villas, boats…"
                aria-label="Message the Island Concierge"
                className="field !rounded-full !border-[2.5px] !py-2.5 text-sm"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink bg-coral shadow-hard-sm transition-transform hover:-translate-y-0.5"
              >
                <Send size={17} strokeWidth={2.5} />
              </button>
            </form>

            <div className="flex items-center justify-between gap-2 border-t-2 border-ink/15 bg-cream px-4 py-2 text-[0.65rem] font-semibold text-ink/55">
              <span className="flex items-center gap-1">
                <Sparkles size={11} /> Rule-based demo replies
              </span>
              <Link href="/plan-your-stay" onClick={() => track("chat_handoff", { label: "footer_plan" })} className="underline hover:text-coral">
                Plan my stay
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
