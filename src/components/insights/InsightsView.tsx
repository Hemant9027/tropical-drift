"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageCircle,
  MousePointerClick,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Btn, Reveal, Sticker } from "@/components/ui";
import { clearEvents, readEvents, summarize, type Insights } from "@/lib/tracking";

const LABELS: Record<string, string> = {
  start_planning_click: "Start Planning clicks",
  planner_start: "Trip planner starts",
  planner_step: "Planner step advances",
  planner_complete: "Trip planner completions",
  whatsapp_click: "WhatsApp CTA clicks",
  chat_open: "Chatbot opens",
  chat_handoff: "Chatbot hand-offs",
  service_enquiry: "Service enquiries",
  instagram_click: "Instagram interactions",
  faq_open: "FAQ opens",
};

const ICONS: Record<string, typeof MousePointerClick> = {
  start_planning_click: MousePointerClick,
  planner_start: ArrowRight,
  planner_complete: CheckCircle2,
  whatsapp_click: MessageCircle,
  chat_open: Bot,
  service_enquiry: MousePointerClick,
};

export default function InsightsView() {
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    const update = () => setInsights(summarize(readEvents()));
    update();
    window.addEventListener("tdt:events", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("tdt:events", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const cards: { key: string; label: string; hint: string }[] = [
    { key: "start_planning_click", label: "Start Planning clicks", hint: "Nav, hero, search panel, final CTA" },
    { key: "planner_start", label: "Planner starts", hint: "Opened /plan-your-stay" },
    { key: "planner_complete", label: "Planner completions", hint: "Summary generated" },
    { key: "whatsapp_click", label: "WhatsApp clicks", hint: "Any WhatsApp hand-off" },
    { key: "chat_open", label: "Chatbot opens", hint: "Island Concierge launcher" },
    { key: "service_enquiry", label: "Service enquiries", hint: "Service cards & CTAs" },
  ];

  const top = insights?.topServices ?? [];
  const maxTop = Math.max(1, ...top.map((t) => t.count));

  return (
    <>
      <section className="dots border-b-[3px] border-ink bg-cream pt-10 pb-12 md:pt-14 md:pb-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <Sticker tone="bg-coral" rotate={-3}>
              Internal preview
            </Sticker>
            <h1 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,6vw,4.8rem)] font-black">
              Demo Analytics —{" "}
              <em className="text-[#2C8A82] italic">Browser-Local Activity Only</em>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
              This dashboard shows how conversion tracking could work. Every number below comes
              from counters stored in <em>your</em> browser — they are not real visitors, leads or
              production conversion rates, and nothing is sent to any analytics service.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn href="/" variant="ghost">
                Back to Home
              </Btn>
              <Btn
                variant="coral"
                onClick={() => {
                  clearEvents();
                  setInsights(summarize(readEvents()));
                }}
              >
                <Trash2 size={16} /> Reset local counters
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          {!insights || insights.total === 0 ? (
            <div className="rounded-[26px] border-[3px] border-dashed border-ink/40 bg-sand p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-cream">
                <RefreshCw size={22} />
              </span>
              <h2 className="mt-5 text-3xl font-black">No activity recorded yet</h2>
              <p className="mx-auto mt-3 max-w-md text-ink/70">
                Click around the site — open the planner, tap a service, start a chat — then come
                back and these counters will update live.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Btn href="/" variant="sun">
                  Explore the site
                </Btn>
                <Btn href="/plan-your-stay" variant="aqua">
                  Start the planner
                </Btn>
              </div>
            </div>
          ) : (
            <>
              {/* Headline numbers */}
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-[24px] border-[3px] border-ink bg-ink p-6 text-cream shadow-hard">
                  <p className="label-caps text-sun">Total interactions</p>
                  <p className="mt-3 font-display text-6xl font-black">{insights.total}</p>
                  <p className="mt-2 text-sm text-cream/60">
                    across {insights.days || 1} day{insights.days === 1 ? "" : "s"} of local history
                  </p>
                </div>
                <div className="rounded-[24px] border-[3px] border-ink bg-aqua p-6 shadow-hard">
                  <p className="label-caps text-ink/70">Planner completions</p>
                  <p className="mt-3 font-display text-6xl font-black">
                    {insights.byEvent.planner_complete ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">summaries generated in this browser</p>
                </div>
                <div className="rounded-[24px] border-[3px] border-ink bg-sun p-6 shadow-hard">
                  <p className="label-caps text-ink/70">WhatsApp clicks</p>
                  <p className="mt-3 font-display text-6xl font-black">
                    {insights.byEvent.whatsapp_click ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">hand-offs attempted</p>
                </div>
              </div>

              {/* Event grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => {
                  const Icon = ICONS[c.key] ?? MousePointerClick;
                  const n = insights.byEvent[c.key] ?? 0;
                  return (
                    <motion.div
                      key={c.key}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-[20px] border-[3px] border-ink bg-white p-5 shadow-hard-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink bg-cream">
                          <Icon size={18} strokeWidth={2.4} />
                        </span>
                        <span className="font-display text-4xl font-black">{n}</span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-extrabold">{c.label}</h3>
                      <p className="mt-1 text-xs text-ink/60">{c.hint}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Most selected services */}
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border-[3px] border-ink bg-white p-6 shadow-hard-sm">
                  <h2 className="text-2xl font-black">Most selected services</h2>
                  <p className="mt-1 text-sm text-ink/60">
                    Counted when a visitor requests a service or picks it in the planner.
                  </p>
                  {top.length === 0 ? (
                    <p className="mt-6 rounded-[16px] border-2 border-dashed border-ink/30 p-6 text-center text-sm text-ink/60">
                      No service selections yet — tap a service card on the homepage.
                    </p>
                  ) : (
                    <ul className="mt-6 space-y-4">
                      {top.map((t, i) => (
                        <li key={t.name}>
                          <div className="flex items-baseline justify-between gap-3 text-sm font-bold">
                            <span>
                              {i + 1}. {t.name}
                            </span>
                            <span className="font-mono">{t.count}</span>
                          </div>
                          <div className="mt-1.5 h-4 overflow-hidden rounded-full border-2 border-ink bg-cream">
                            <motion.div
                              className={i % 3 === 0 ? "h-full bg-coral" : i % 3 === 1 ? "h-full bg-aqua" : "h-full bg-sun"}
                              initial={{ width: 0 }}
                              animate={{ width: `${(t.count / maxTop) * 100}%` }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-[24px] border-[3px] border-ink bg-sand p-6">
                  <h2 className="text-2xl font-black">All local counters</h2>
                  <ul className="mt-5 space-y-2 text-sm">
                    {Object.entries(insights.byEvent)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, v]) => (
                        <li key={k} className="flex items-center justify-between gap-3 border-b border-ink/15 pb-2">
                          <span className="font-semibold">{LABELS[k] ?? k}</span>
                          <span className="font-mono font-bold">{v}</span>
                        </li>
                      ))}
                  </ul>
                  <p className="mt-5 text-xs leading-relaxed text-ink/65">
                    Data lives under a localStorage key in this browser. Clearing site data or
                    switching devices resets it. No cookies, no third-party scripts, no login.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t-2 border-ink/10 pt-6 text-sm font-semibold text-ink/60">
            <Link href="/" className="hover:text-coral">Home</Link>
            <Link href="/plan-your-stay" className="hover:text-coral">Trip planner</Link>
            <Link href="/services" className="hover:text-coral">Services</Link>
            <Link href="/contact" className="hover:text-coral">Contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
