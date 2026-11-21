import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Island Journal — Turks & Caicos Travel Notes",
  description:
    "Travel notes, planning tips and island inspiration for Turks & Caicos — an editorial journal planned as part of the Tropical Drift Travel website concept.",
  alternates: { canonical: "/journal" },
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return (
    <ComingSoon
      eyebrow="Island journal"
      titleStart="Notes from"
      titleAccent="the"
      titleEnd="islands"
      blurb="An editorial journal — when to visit, how to plan a villa stay, what to know before your first boat day — is on the roadmap. For now, the concierge chat can answer most planning questions in seconds."
      image="/images/island-road.jpg"
      alt="Red dirt road running between palm trees"
    />
  );
}
