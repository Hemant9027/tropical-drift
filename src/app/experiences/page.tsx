import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Island Experiences — Snorkelling, Sailing & Island Days",
  description:
    "Private boat charters, sunset sails, snorkelling and scuba diving, fishing, ATV adventures, jet skiing, horseback riding and kiteboarding in Turks & Caicos — coordinated by your concierge.",
  alternates: { canonical: "/experiences" },
  openGraph: {
    title: "Island Experiences | Tropical Drift Travel Turks & Caicos",
    description: "Your island days can look different every time.",
    url: "/experiences",
  },
};

export default function ExperiencesPage() {
  return (
    <ComingSoon
      eyebrow="Island experiences"
      titleStart="Days on the"
      titleAccent="water"
      titleEnd="and beyond"
      blurb="A full experiences gallery — private charters, sunset sails, snorkelling, fishing, ATVs, jet skis, horseback riding and kiteboarding — is planned as a follow-up to this concept. You can request any of them in the trip planner today."
      image="/images/snorkel.jpg"
      alt="Scuba diver exploring a colorful coral reef underwater"
    />
  );
}
