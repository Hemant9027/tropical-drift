import type { Metadata } from "next";
import Link from "next/link";
import Planner from "@/components/planner/Planner";

export const metadata: Metadata = {
  title: "Plan Your Stay — Turks & Caicos Vacation Planning",
  description:
    "Build a personalized Turks & Caicos trip request: your dates, travellers, interests and travel style. Get a structured concierge summary to send to Tropical Drift on WhatsApp.",
  alternates: { canonical: "/plan-your-stay" },
  openGraph: {
    title: "Plan Your Stay | Tropical Drift Travel Concierge",
    description:
      "A guided trip planner that turns your Turks & Caicos preferences into a tidy concierge request.",
    url: "/plan-your-stay",
  },
};

const crumbs = [
  { label: "Turks & Caicos Concierge", href: "/services" },
  { label: "Vacation Planning", href: "/plan-your-stay" },
  { label: "Private Boat Charter Concierge", href: "/services#boats" },
  { label: "Villa Concierge Services", href: "/services#villas" },
  { label: "Airport Transportation Coordination", href: "/services#more" },
];

export default function PlanYourStayPage() {
  return (
    <>
      <section className="dots border-b-[3px] border-ink bg-cream pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <p className="label-caps text-ink/55">Interactive trip planner</p>
          <h1 className="mt-4 max-w-[15ch] text-[clamp(2.6rem,7vw,5.6rem)] font-black">
            Let&rsquo;s plan your{" "}
            <em className="text-[#E4654C] italic">island days</em>.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
            Five short steps — dates, interests, travel style and how to reach you. At the end you
            get a beautifully organized summary you can send straight to Cladly on WhatsApp. No
            accounts, no payment, no commitment.
          </p>
        </div>
      </section>

      <section className="bg-cream py-10 md:py-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <Planner />
        </div>
      </section>

      <nav aria-label="Related concierge topics" className="border-t-2 border-ink/10 bg-sand py-8">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <p className="label-caps mb-3 text-ink/55">Keep exploring</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/70">
            {crumbs.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className="underline-offset-4 hover:text-coral hover:underline">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
