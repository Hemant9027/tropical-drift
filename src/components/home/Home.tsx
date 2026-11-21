"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Check,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { Btn, Marquee, Reveal, SectionLabel, Sticker } from "@/components/ui";
import { FAQS, FEATURED, PREFILL_KEY, SERVICES, type Prefill } from "@/lib/data";
import { track } from "@/lib/tracking";
import { BUSINESS, WA_INTRO } from "@/lib/site";

const HERO_ACCENTS = {
  days: "text-[#E4654C]",
  stays: "text-[#2C8A82]",
  memories: "text-[#2E7D57]",
};

const SERVICE_OPTIONS = [
  "Villas & Beautiful Stays",
  "Airport Transportation",
  "Private Boat Experiences",
  "Dining & Celebrations",
  "Itinerary Planning",
  "Not sure yet",
];

const GALLERY = [
  { src: "/images/snorkel.jpg", alt: "Scuba diver exploring a colorful coral reef underwater", label: "On the water" },
  { src: "/images/celebration.jpg", alt: "Wedding table set up on a beach", label: "Celebrations" },
  { src: "/images/cabana.jpg", alt: "Palm tree beside white sand on a tropical beach", label: "Slow days" },
  { src: "/images/island-road.jpg", alt: "Red dirt road running between palm trees", label: "Getting around" },
];

const WHY = [
  { t: "Local destination knowledge", d: "More than six years living and working in Turks & Caicos, with firsthand familiarity with the island." },
  { t: "Personalized concierge assistance", d: "Recommendations that start with you — your preferences, travel style, group and priorities." },
  { t: "Thoughtful travel planning", d: "Details coordinated before you arrive so your holiday does not feel like a second job." },
  { t: "Hospitality experience", d: "A background in Forbes Five-Star hospitality shaping professionalism, discretion and warmth." },
  { t: "Trusted local coordination", d: "Relationships built with restaurants, private chefs, charters, transport and experience partners." },
  { t: "Support before & during", d: "A direct point of contact — reachable on WhatsApp and iMessage throughout your stay." },
];

export default function Home() {
  const router = useRouter();
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState(2);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  function startPlanning(e: React.FormEvent) {
    e.preventDefault();
    track("start_planning_click", { source: "search_panel", service });
    const prefill: Prefill = { service, arrival, departure, guests };
    try {
      window.localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
    } catch {
      /* noop */
    }
    router.push("/plan-your-stay");
  }

  function requestService(interest: string, source: string) {
    track("service_enquiry", { service: interest, source });
    const prefill: Prefill = { service: interest };
    try {
      window.localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
    } catch {
      /* noop */
    }
    router.push("/plan-your-stay");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://www.tropicaldrifttravel.com/");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      {/* ============ ANNOUNCEMENT MARQUEE ============ */}
      <div className="border-b-[3px] border-ink bg-ink py-2.5 text-cream">
        <Marquee
          items={[
            "YOUR ISLAND STAY, HANDLED",
            "PRIVATE CONCIERGE",
            "TURKS & CAICOS",
            "VILLAS & DINING",
            "PERSONALIZED EXPERIENCES",
          ]}
        />
      </div>

      {/* ============ HERO ============ */}
      <section className="dots relative overflow-hidden bg-cream pt-10 md:pt-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Reveal>
              <Sticker tone="bg-coral" rotate={-4}>
                Hello, Paradise!
              </Sticker>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="label-caps flex items-center gap-2 border-2 border-ink/25 bg-white/70 px-3 py-2 text-ink/70">
                <MapPin size={13} strokeWidth={2.6} className="text-coral" />
                Turks &amp; Caicos · Your Island Escape
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-[16ch] text-[clamp(2.7rem,8.4vw,7rem)] font-black">
              <span className="block">
                Island <em className={`${HERO_ACCENTS.days} italic`}>Days</em>.
              </span>
              <span className="block">
                Effortless <em className={`${HERO_ACCENTS.stays} italic`}>Stays</em>.
              </span>
              <span className="block">
                Beautiful <em className={`${HERO_ACCENTS.memories} italic`}>Memories</em>.
              </span>
            </h1>
          </Reveal>

          <div className="mt-7 grid gap-7 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <Reveal delay={0.12}>
              <p className="max-w-xl text-lg leading-relaxed text-ink/75 md:text-xl">
                Beautiful villas, unforgettable experiences, effortless dining and every little
                detail handled — your Turks &amp; Caicos escape, thoughtfully planned.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Btn href="/services" variant="coral">
                  Explore Our Services <ArrowRight size={17} strokeWidth={2.6} />
                </Btn>
                <Btn
                  href="/plan-your-stay"
                  variant="ghost"
                  onClick={() => track("start_planning_click", { source: "hero" })}
                >
                  Plan My Stay
                </Btn>
              </div>
            </Reveal>
          </div>

          {/* Search panel */}
          <Reveal delay={0.22}>
            <form
              onSubmit={startPlanning}
              aria-label="Quick concierge search"
              className="mt-9 rounded-[26px] border-[3px] border-ink bg-white p-4 shadow-hard md:p-5"
            >
              <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_0.9fr_auto] md:items-end">
                <div>
                  <label htmlFor="q-service" className="label-caps mb-1.5 block text-ink/60">
                    Service needed
                  </label>
                  <select
                    id="q-service"
                    className="field"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="q-arrival" className="label-caps mb-1.5 block text-ink/60">
                    Arrival
                  </label>
                  <input
                    id="q-arrival"
                    type="date"
                    className="field"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="q-departure" className="label-caps mb-1.5 block text-ink/70">
                    Departure
                  </label>
                  <input
                    id="q-departure"
                    type="date"
                    className="field"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="q-guests" className="label-caps mb-1.5 block text-ink/60">
                    Guests
                  </label>
                  <input
                    id="q-guests"
                    type="number"
                    min={1}
                    max={30}
                    className="field"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
                <Btn type="submit" variant="sun" className="h-[50px] w-full md:w-auto">
                  Start Planning
                </Btn>
              </div>
            </form>
          </Reveal>

          {/* Panoramic photo */}
          <div className="relative mt-10 pb-16 md:pb-24">
            <Reveal y={40}>
              <div className="relative overflow-hidden rounded-[28px] border-[3px] border-ink shadow-hard-lg">
                <img
                  src="/images/hero-gracebay.jpg"
                  alt="White sand beach and turquoise water at golden hour"
                  className="h-[46vw] max-h-[560px] min-h-[240px] w-full object-cover"
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                />
              </div>
            </Reveal>
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10">
              <Sticker tone="bg-sun" rotate={-3} className="floaty">
                Paradise, Personally Planned
              </Sticker>
            </div>
            <div className="absolute -right-1 bottom-10 hidden rotate-6 rounded-full border-[3px] border-ink bg-aqua px-4 py-2 text-xs font-bold shadow-hard-sm lg:block">
              Est. in the islands ✦
            </div>
          </div>
        </div>
      </section>

      {/* ============ WELCOME (AQUA) ============ */}
      <section className="relative overflow-hidden border-y-[3px] border-ink bg-aqua">
        <div className="dots-light absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div>
            <Reveal>
              <p className="label-caps text-ink/70">A more personal way to travel</p>
              <h2 className="mt-4 text-[clamp(2.2rem,5.6vw,4.6rem)] font-black">
                <span className="block">Your Own Little</span>
                <span className="block">
                  Piece of <em className={`${HERO_ACCENTS.memories} italic`}>Paradise</em>.
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/85">
                Tropical Drift Travel is a personalized concierge service created to help couples,
                families and groups experience Turks &amp; Caicos with less friction. Cladly works
                directly with each guest — understanding what you are looking for, then coordinating
                the details around your preferences, travel style and budget.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Btn href="/about" variant="ink">
                  Meet Your Concierge
                </Btn>
                <Btn href="/contact" variant="cream">
                  Get in Touch
                </Btn>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[400px] md:min-h-[470px]">
            <Reveal delay={0.1}>
              <div className="absolute left-0 top-0 w-[64%] rotate-[-5deg] overflow-hidden rounded-[22px] border-[3px] border-ink shadow-hard">
                <img
                  src="/images/villa.jpg"
                  alt="Infinity pool overlooking a blue bay and distant islands"
                  className="h-[240px] w-full object-cover md:h-[300px]"
                  loading="lazy"
                  width={1536}
                  height={1024}
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="absolute bottom-0 right-0 w-[64%] rotate-[4deg] overflow-hidden rounded-[22px] border-[3px] border-ink shadow-hard">
                <img
                  src="/images/boat.jpg"
                  alt="White sailboat sailing across the ocean"
                  className="h-[220px] w-full object-cover md:h-[280px]"
                  loading="lazy"
                  width={1536}
                  height={1024}
                />
              </div>
            </Reveal>
            <div className="absolute left-2 top-[46%] z-10">
              <Sticker tone="bg-sun" rotate={-6}>
                Stay
              </Sticker>
            </div>
            <div className="absolute right-3 top-4 z-10">
              <Sticker tone="bg-cream" rotate={5}>
                Explore
              </Sticker>
            </div>
            <div className="absolute bottom-6 left-4 z-10">
              <Sticker tone="bg-coral" rotate={-2}>
                Unwind
              </Sticker>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED SERVICES ============ */}
      <section id="featured" className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 border-b-[3px] border-ink pb-7">
              <div>
                <SectionLabel>What we coordinate</SectionLabel>
                <h2 className="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-black">
                  How can Tropical Drift <em className={`${HERO_ACCENTS.days} italic`}>help</em>?
                </h2>
              </div>
              <p className="max-w-sm text-ink/70">
                Not every trip needs the same kind of planning. Some guests want the whole
                itinerary handled — others need a few details organized before they arrive.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 space-y-20 md:space-y-28">
            {FEATURED.map((s, i) => (
              <Reveal key={s.id}>
                <article
                  id={s.id}
                  className={`grid items-center gap-9 md:grid-cols-2 md:gap-14 ${
                    i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="flex flex-wrap items-center gap-3">
                      <Sticker tone={s.stickerColor} rotate={-3}>
                        {s.sticker}
                      </Sticker>
                      <span className="label-caps text-ink/55">{s.kicker}</span>
                    </div>
                    <h3 className="mt-5 text-[clamp(2.1rem,4.6vw,3.7rem)] font-black">{s.title}</h3>
                    <p className={`mt-3 font-display text-2xl italic font-semibold ${i === 0 ? HERO_ACCENTS.days : i === 1 ? HERO_ACCENTS.stays : HERO_ACCENTS.memories}`}>
                      {s.tagline}
                    </p>
                    <p className="mt-5 max-w-xl leading-relaxed text-ink/75">{s.body}</p>
                    <ul className="mt-6 space-y-2.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm font-semibold">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun">
                            <Check size={11} strokeWidth={3.2} />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      <Btn variant={i === 1 ? "aqua" : "coral"} onClick={() => requestService(s.interest, s.id)}>
                        {s.cta} <ArrowUpRight size={17} strokeWidth={2.6} />
                      </Btn>
                    </div>
                  </div>

                  <div className={`relative ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="arch overflow-hidden border-[3px] border-ink shadow-hard">
                      <img
                        src={s.image}
                        alt={s.alt}
                        loading="lazy"
                        width={1536}
                        height={1024}
                        className="h-[340px] w-full object-cover md:h-[520px]"
                      />
                    </div>
                    <span
                      className={`absolute -bottom-4 ${i % 2 === 1 ? "-left-3 rotate-3" : "-right-3 -rotate-3"} sticker ${s.stickerColor}`}
                    >
                      0{i + 1} / 03
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICE GRID ============ */}
      <section id="more" className="border-y-[3px] border-ink bg-sand py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <SectionLabel>The everyday details</SectionLabel>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)] font-black">
              Everything in <em className={`${HERO_ACCENTS.stays} italic`}>between</em>.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <button
                    type="button"
                    onClick={() => requestService(s.interest, s.id)}
                    className="group flex h-full w-full flex-col items-start rounded-[22px] border-[3px] border-ink bg-cream p-6 text-left shadow-hard-sm transition-transform hover:-translate-y-1.5"
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink ${s.color}`}
                    >
                      <Icon size={22} strokeWidth={2.3} />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-extrabold">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{s.blurb}</p>
                    <span className="label-caps mt-5 flex items-center gap-1.5 text-teal group-hover:text-coral">
                      Request this <ArrowRight size={14} strokeWidth={3} />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY TROPICAL DRIFT ============ */}
      <section id="why" className="relative overflow-hidden bg-ink py-16 text-cream md:py-24">
        <div className="dots-light absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1240px] px-5 md:px-6">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div>
              <Reveal>
                <p className="label-caps text-sun">Why Tropical Drift</p>
                <h2 className="mt-4 text-[clamp(2.2rem,5.4vw,4.4rem)] font-black">
                  <span className="block">Personal Touch.</span>
                  <span className="block">
                    <em className="text-[#6DBCB5] italic">Island Magic</em>.
                  </span>
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-cream/75">
                  Founded by <strong className="text-sun">{BUSINESS.founder}</strong>, Tropical
                  Drift was built from the ground up — turning local knowledge and a passion for
                  hospitality into a service that feels genuinely personal.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Btn href="/about" variant="sun">
                    Meet Your Concierge
                  </Btn>
                  <Btn href={WA_INTRO} external variant="cream">
                    <MessageCircle size={16} /> WhatsApp Cladly
                  </Btn>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {WHY.map((w, i) => (
                <Reveal key={w.t} delay={i * 0.06}>
                  <div className="h-full rounded-[20px] border-2 border-cream/25 bg-cream/[0.06] p-5">
                    <span className="label-caps text-aqua">0{i + 1}</span>
                    <h3 className="mt-2 font-display text-xl font-extrabold leading-tight text-cream">
                      {w.t}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/70">{w.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/20 pt-6 text-sm text-cream/60">
              <span className="label-caps text-sun">Fluent in four languages</span>
              <span>Direct point of contact before &amp; during your stay</span>
              <span>WhatsApp &amp; iMessage support while you are on island</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ INSTAGRAM ============ */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionLabel>Social</SectionLabel>
                <h2 className="mt-3 text-[clamp(2.1rem,5vw,4rem)] font-black">
                  <span className="block">Island Moments.</span>
                  <span className="block">
                    <em className={`${HERO_ACCENTS.days} italic`}>Worth Sharing</em>.
                  </span>
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Btn href={BUSINESS.instagram} external variant="aqua">
                  <AtSign size={16} /> Follow {BUSINESS.instagramHandle}
                </Btn>
                <Btn
                  variant="cream"
                  onClick={() => {
                    track("instagram_click", { action: "share" });
                    if (navigator.share) {
                      void navigator.share({
                        title: "Tropical Drift Travel",
                        text: "Your Island Stay, Handled — Turks & Caicos concierge",
                        url: "https://www.tropicaldrifttravel.com/",
                      });
                    } else {
                      void copyLink();
                    }
                  }}
                >
                  <Share2 size={16} /> {copied ? "Link copied!" : "Share"}
                </Btn>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {GALLERY.map((g, i) => (
              <Reveal key={g.src} delay={i * 0.06}>
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("instagram_click", { source: "gallery" })}
                  className="group relative block overflow-hidden rounded-[20px] border-[3px] border-ink shadow-hard-sm"
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    width={1536}
                    height={1024}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      i % 2 === 0 ? "h-56 md:h-72" : "h-56 md:h-72"
                    }`}
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/85 px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-cream">
                    {g.label} <ArrowUpRight size={13} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink/55">
            Destination gallery — follow{" "}
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="underline hover:text-coral">
              {BUSINESS.instagramHandle}
            </a>{" "}
            for real island moments.
          </p>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="border-y-[3px] border-ink bg-sand py-16 md:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-6">
          <div>
            <Reveal>
              <SectionLabel>Good to know</SectionLabel>
              <h2 className="mt-3 text-[clamp(2.1rem,4.6vw,3.6rem)] font-black">
                Questions,
                <br />
                <em className={`${HERO_ACCENTS.stays} italic`}>answered</em>.
              </h2>
              <p className="mt-4 max-w-xs text-ink/70">
                Still wondering about something? The Island Concierge chat is one tap away.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={f.q} delay={i * 0.04}>
                  <div className="rounded-[20px] border-[3px] border-ink bg-cream shadow-hard-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenFaq(open ? null : i);
                        if (!open) track("faq_open", { q: f.q.slice(0, 40) });
                      }}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-display text-lg font-extrabold leading-snug md:text-xl">
                        {f.q}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun">
                        {open ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 leading-relaxed text-ink/75">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-coral py-16 md:py-24">
        <div className="dots absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1240px] px-5 text-center md:px-6">
          <Reveal>
            <Sticker tone="bg-cream" rotate={-3}>
              Let&rsquo;s begin
            </Sticker>
            <h2 className="mx-auto mt-6 max-w-[15ch] text-[clamp(2.3rem,7vw,6rem)] font-black">
              <span className="block">Your Island Stay.</span>
              <span className="block">
                <em className="text-cream italic">Beautifully Handled</em>.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink/85">
              Tell us your plans, and let&rsquo;s make your Turks &amp; Caicos getaway effortless.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Btn
                href="/plan-your-stay"
                variant="sun"
                onClick={() => track("start_planning_click", { source: "final_cta" })}
              >
                Plan My Stay <ArrowRight size={17} strokeWidth={2.6} />
              </Btn>
              <Btn href={WA_INTRO} external variant="cream">
                <MessageCircle size={17} /> Chat on WhatsApp
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Internal links for SEO */}
      <nav aria-label="Related pages" className="mx-auto max-w-[1240px] px-5 py-10 md:px-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/60">
          <li><Link href="/services" className="hover:text-coral">Concierge services</Link></li>
          <li><Link href="/plan-your-stay" className="hover:text-coral">Trip planner</Link></li>
          <li><Link href="/contact" className="hover:text-coral">Contact &amp; enquiries</Link></li>
          <li><Link href="/about" className="hover:text-coral">About Cladly</Link></li>
          <li><Link href="/demo-insights" className="hover:text-coral">Demo insights</Link></li>
        </ul>
      </nav>
    </>
  );
}
