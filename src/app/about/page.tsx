import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Meet Your Concierge — Cladly Hyppolite, Turks & Caicos",
  description:
    "Learn about Cladly Hyppolite, founder of Tropical Drift Travel Concierge Services — six years living and working in Turks & Caicos with a Forbes Five-Star hospitality background and four languages.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Meet Your Concierge | Tropical Drift Travel",
    description: "The person behind your island stay, in Turks & Caicos.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow="About the concierge"
      titleStart="Meet"
      titleAccent="Cladly"
      titleEnd="Hyppolite"
      blurb="A dedicated page for the founder story is on the concept roadmap — more than six years living and working in Turks & Caicos, a Forbes Five-Star hospitality background, four languages spoken, and a direct point of contact for every guest. Until then, WhatsApp is the fastest way to say hello."
      image="/images/coming-soon.jpg"
      alt="A small tropical island surrounded by blue ocean under a clear sky"
    />
  );
}
