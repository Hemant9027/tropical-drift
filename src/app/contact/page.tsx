import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact a Turks & Caicos Concierge — WhatsApp Enquiry",
  description:
    "Contact Tropical Drift Travel Concierge Services in Turks & Caicos. Message Cladly on WhatsApp at +1 649 341 2898 or send a structured enquiry about villas, transportation, dining and activities.",
  alternates: { canonical: "/contact" },
  keywords: ["Turks and Caicos concierge contact", "Providenciales luxury concierge WhatsApp"],
  openGraph: {
    title: "Contact | Tropical Drift Travel Concierge, Turks & Caicos",
    description: "Reach your island concierge directly on WhatsApp or send a structured enquiry.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactView />;
}
