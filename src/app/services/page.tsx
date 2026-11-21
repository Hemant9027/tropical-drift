import type { Metadata } from "next";
import ServicesView from "@/components/services/ServicesView";

export const metadata: Metadata = {
  title: "Concierge Services in Turks & Caicos — Villas, Boats & Dining",
  description:
    "Tropical Drift coordinates villas and stays, private boat charters, snorkelling, dining reservations, airport transportation, beach cabanas, villa pre-stocking, sports activities and special occasions across Turks & Caicos.",
  alternates: { canonical: "/services" },
  keywords: [
    "villa concierge services Turks and Caicos",
    "private boat charter concierge",
    "airport transportation coordination Providenciales",
  ],
  openGraph: {
    title: "Concierge Services | Tropical Drift Travel Turks & Caicos",
    description:
      "Villas, private boats, dining, celebrations and every detail in between — coordinated by a personal island concierge.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesView />;
}
