"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Btn, Reveal, SectionLabel, Sticker } from "@/components/ui";
import { FEATURED, PREFILL_KEY, SERVICES, type Prefill } from "@/lib/data";
import { track } from "@/lib/tracking";
import { WA_INTRO } from "@/lib/site";

const ACCENT = ["text-[#E4654C]", "text-[#2C8A82]", "text-[#2E7D57]"];

const EXTRA = [
  {
    t: "Sunset sails & snorkelling",
    d: "Enjoy the islands from the water as the sun goes down, or explore the reefs and marine life surrounding Turks & Caicos.",
    img: "/images/snorkel.jpg",
    alt: "Scuba diver exploring a colorful coral reef underwater",
  },
  {
    t: "Fishing, ATVs & island adventures",
    d: "Arrange a fishing experience suited to your trip, see more of the island on an ATV, or add jet skis, parasailing, horseback riding and kiteboarding.",
    img: "/images/island-road.jpg",
    alt: "Red dirt road running between palm trees",
  },
  {
    t: "Celebrations & beach dinners",
    d: "Beach dinners, proposals, room setups and celebrations coordinated with care and discretion.",
    img: "/images/celebration.jpg",
    alt: "Wedding table set up on a beach",
  },
];

export default function ServicesView() {
  const router = useRouter();

  function request(interest: string, source: string) {
    track("service_enquiry", { service: interest, source });
    const prefill: Prefill = { service: interest };
    try {
      window.localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
    } catch {
      /* noop */
    }
    router.push("/plan-your-stay");
  }

  return (
    <>
      <section className="dots border-b-[3px] border-ink bg-cream pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <Sticker tone="bg-aqua" rotate={-3}>
              Concierge services
            </Sticker>
            <h1 className="mt-6 max-w-[16ch] text-[clamp(2.6rem,7vw,5.6rem)] font-black">
              Everything your island stay <em className="text-[#2C8A82] italic">needs</em>.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
              Tropical Drift is a concierge service — it coordinates experiences and services with
              trusted local providers rather than owning hotels, boats or transport fleets. Every
              request is reviewed personally by Cladly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn href="/plan-your-stay" variant="coral" onClick={() => track("start_planning_click", { source: "services_hero" })}>
                Plan My Stay <ArrowRight size={17} strokeWidth={2.6} />
              </Btn>
              <Btn href={WA_INTRO} external variant="ghost">
                <MessageCircle size={16} /> Ask on WhatsApp
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured three */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] space-y-20 px-5 md:space-y-28 md:px-6">
          {FEATURED.map((s, i) => (
            <Reveal key={s.id}>
              <article
                id={s.id}
                className={`grid items-center gap-9 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Sticker tone={s.stickerColor} rotate={-3}>
                      {s.sticker}
                    </Sticker>
                    <span className="label-caps text-ink/55">{s.kicker}</span>
                  </div>
                  <h2 className="mt-5 text-[clamp(2.1rem,4.6vw,3.7rem)] font-black">{s.title}</h2>
                  <p className={`mt-3 font-display text-2xl font-semibold italic ${ACCENT[i]}`}>
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
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Btn variant={i === 1 ? "aqua" : "coral"} onClick={() => request(s.interest, s.id)}>
                      {s.cta} <ArrowUpRight size={17} strokeWidth={2.6} />
                    </Btn>
                    <Link href="/plan-your-stay" className="btn btn-ghost">
                      Add to my trip
                    </Link>
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
      </section>

      {/* Grid */}
      <section id="more" className="border-y-[3px] border-ink bg-sand py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <SectionLabel>And the rest</SectionLabel>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-black">
              The details that make it <em className="text-[#E4654C] italic">effortless</em>.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <button
                    type="button"
                    onClick={() => request(s.interest, s.id)}
                    className="group flex h-full w-full flex-col items-start rounded-[22px] border-[3px] border-ink bg-cream p-6 text-left shadow-hard-sm transition-transform hover:-translate-y-1.5"
                  >
                    <span className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink ${s.color}`}>
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

      {/* Experience strip */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Reveal>
            <SectionLabel>Featured experiences</SectionLabel>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-black">
              Your island days can look <em className="text-[#2E7D57] italic">different</em> every time.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {EXTRA.map((e, i) => (
              <Reveal key={e.t} delay={i * 0.07}>
                <figure className="overflow-hidden rounded-[22px] border-[3px] border-ink bg-white shadow-hard-sm">
                  <img
                    src={e.img}
                    alt={e.alt}
                    loading="lazy"
                    width={1536}
                    height={1024}
                    className="h-56 w-full object-cover"
                  />
                  <figcaption className="p-5">
                    <h3 className="font-display text-xl font-extrabold">{e.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{e.d}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-[3px] border-ink bg-teal py-16 text-cream md:py-20">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-7 px-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="max-w-[16ch] text-[clamp(2rem,4.6vw,3.6rem)] font-black">
              Not sure what to ask for?
            </h2>
            <p className="mt-4 max-w-lg text-cream/80">
              Start with the trip planner — pick what sounds good and Cladly will shape the rest
              with you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Btn href="/plan-your-stay" variant="sun">
              Start Planning <ArrowRight size={17} strokeWidth={2.6} />
            </Btn>
            <Btn href={WA_INTRO} external variant="cream">
              <MessageCircle size={16} /> Chat on WhatsApp
            </Btn>
          </div>
        </div>
      </section>

      <nav aria-label="Related pages" className="mx-auto max-w-[1240px] px-5 py-10 md:px-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/60">
          <li><Link href="/" className="hover:text-coral">Home</Link></li>
          <li><Link href="/plan-your-stay" className="hover:text-coral">Trip planner</Link></li>
          <li><Link href="/contact" className="hover:text-coral">Contact &amp; enquiries</Link></li>
          <li><Link href="/about" className="hover:text-coral">About the concierge</Link></li>
        </ul>
      </nav>
    </>
  );
}
