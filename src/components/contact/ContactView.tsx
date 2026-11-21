"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, ArrowRight, Check, Clock, Globe, MapPin, MessageCircle, Send } from "lucide-react";
import { Btn, Reveal, Sticker } from "@/components/ui";
import { track } from "@/lib/tracking";
import { BUSINESS, WA_INTRO, waLink } from "@/lib/site";
import { readEnquiries, prettyDate } from "@/lib/enquiry";

const schema = z.object({
  name: z.string().min(1, "Please share your name").max(80),
  email: z
    .string()
    .min(1, "Please share your email")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "Enter a valid email address"),
  topic: z.string().min(1, "Choose a topic"),
  message: z
    .string()
    .min(10, "Tell us a little more (10 characters minimum)")
    .max(800, "Please keep it under 800 characters"),
});

type FormValues = z.infer<typeof schema>;

const TOPICS = [
  "Villas & accommodation",
  "Airport transportation",
  "Private boat experiences",
  "Dining & reservations",
  "Celebrations",
  "Full trip planning",
];

export default function ContactView() {
  const [sent, setSent] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", topic: TOPICS[0], message: "" },
  });

  useEffect(() => {
    try {
      setSaved(
        readEnquiries().map(
          (e) => `${e.id} · ${e.firstName} ${e.lastName} · ${prettyDate(e.arrival)}`
        )
      );
    } catch {
      /* noop */
    }
  }, []);

  function onSubmit(values: FormValues) {
    const ref = `MSG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const text = `Hello ${BUSINESS.shortName}! (${ref})\nName: ${values.name}\nEmail: ${values.email}\nTopic: ${values.topic}\n\n${values.message}`;
    setSent(ref);
    track("whatsapp_click", { source: "contact_form" });
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    reset();
  }

  return (
    <>
      <section className="dots border-b-[3px] border-ink bg-cream pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <Sticker tone="bg-sun" rotate={-3}>
              Say hello
            </Sticker>
            <h1 className="mt-6 max-w-[15ch] text-[clamp(2.6rem,7vw,5.6rem)] font-black">
              Let&rsquo;s talk about your <em className="text-[#2C8A82] italic">island stay</em>.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
              The fastest way to reach {BUSINESS.shortName} is WhatsApp — you will be speaking with{" "}
              {BUSINESS.founder} directly, before and during your stay.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 md:grid-cols-[0.95fr_1.05fr] md:px-6">
          {/* Channels */}
          <div className="space-y-5">
            <a
              href={WA_INTRO}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { source: "contact_card" })}
              className="block rounded-[22px] border-[3px] border-ink bg-aqua p-6 shadow-hard transition-transform hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-cream">
                <MessageCircle size={21} strokeWidth={2.5} />
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold">WhatsApp the concierge</h2>
              <p className="mt-2 font-mono text-lg font-bold">{BUSINESS.whatsappDisplay}</p>
              <p className="mt-2 text-sm text-ink/75">
                Send a message, share your dates, or ask a quick question. Open a chat →
              </p>
            </a>

            <div className="grid gap-5 sm:grid-cols-2">
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("instagram_click", { source: "contact_card" })}
                className="rounded-[22px] border-[3px] border-ink bg-sun p-5 shadow-hard-sm transition-transform hover:-translate-y-1"
              >
                <AtSign size={20} strokeWidth={2.5} />
                <h3 className="mt-3 font-display text-xl font-extrabold">Instagram</h3>
                <p className="mt-1 text-sm font-semibold">{BUSINESS.instagramHandle}</p>
              </a>
              <a
                href={BUSINESS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[22px] border-[3px] border-ink bg-coral p-5 shadow-hard-sm transition-transform hover:-translate-y-1"
              >
                <Globe size={20} strokeWidth={2.5} />
                <h3 className="mt-3 font-display text-xl font-extrabold">Official website</h3>
                <p className="mt-1 break-all text-sm font-semibold">tropicaldrifttravel.com</p>
              </a>
            </div>

            <ul className="rounded-[22px] border-[3px] border-ink bg-white p-6 text-sm shadow-hard-sm">
              <li className="flex items-start gap-3 pb-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-teal" />
                <span>
                  <strong>{BUSINESS.location}</strong> — island-wide coordination, including
                  Providenciales and surrounding cays.
                </span>
              </li>
              <li className="flex items-start gap-3 border-t-2 border-ink/10 pt-3">
                <Clock size={17} className="mt-0.5 shrink-0 text-teal" />
                <span>
                  Messaging support on WhatsApp and iMessage throughout your stay — exact response
                  times are confirmed personally.
                </span>
              </li>
              <li className="flex items-start gap-3 border-t-2 border-ink/10 pt-3">
                <Check size={17} className="mt-0.5 shrink-0 text-teal" />
                <span>
                  No public phone line, ratings or opening hours are shown here because they are
                  not verified for this concept.
                </span>
              </li>
            </ul>

            {saved.length > 0 && (
              <div className="rounded-[22px] border-[3px] border-dashed border-ink/40 bg-sand p-5">
                <p className="label-caps text-ink/60">Saved in this browser</p>
                <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                  {saved.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink/60">
                  These enquiries have not been sent — open one from the planner to share it.
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="rounded-[26px] border-[3px] border-ink bg-white p-6 shadow-hard-lg md:p-8">
            <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-black">
              Send an <em className="text-[#E4654C] italic">enquiry</em>
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              This opens a pre-filled WhatsApp message — nothing is stored on a server.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="label-caps mb-2 block">
                    Your name
                  </label>
                  <input
                    id="c-name"
                    className={`field ${errors.name ? "field-error" : ""}`}
                    autoComplete="name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="c-email" className="label-caps mb-2 block">
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    autoComplete="email"
                    className={`field ${errors.email ? "field-error" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="c-topic" className="label-caps mb-2 block">
                  What can we help with?
                </label>
                <select id="c-topic" className="field" {...register("topic")}>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {errors.topic && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                    {errors.topic.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="c-message" className="label-caps mb-2 block">
                  Your message
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  placeholder="Dates, number of travellers, what you would love to arrange…"
                  className={`field resize-none ${errors.message ? "field-error" : ""}`}
                  {...register("message")}
                />
                {errors.message && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Btn type="submit" variant="coral" disabled={isSubmitting}>
                  {isSubmitting ? "Preparing…" : "Open WhatsApp Draft"} <Send size={16} strokeWidth={2.5} />
                </Btn>
                <Btn variant="ghost" href="/plan-your-stay">
                  Use the trip planner <ArrowRight size={16} strokeWidth={2.6} />
                </Btn>
              </div>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-[16px] border-[3px] border-ink bg-aqua p-4 text-sm font-semibold"
                  >
                    Draft reference <span className="font-mono">{sent}</span> prepared. Your WhatsApp
                    app should have opened — press send there to reach Tropical Drift. If it did
                    not open, message {BUSINESS.whatsappDisplay} directly.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="mt-6 border-t-2 border-ink/10 pt-4 text-xs text-ink/55">
              For full trip details, the{" "}
              <a href="/plan-your-stay" className="underline hover:text-coral">
                trip planner
              </a>{" "}
              creates a structured summary you can send in one message.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
