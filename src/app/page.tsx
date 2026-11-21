import type { Metadata } from "next";
import Home from "@/components/home/Home";

export const metadata: Metadata = {
  title: "Tropical Drift Travel | Turks & Caicos Concierge Services",
  description:
    "Beautiful villas, unforgettable experiences, effortless dining and every little detail handled. Personalized Turks & Caicos concierge planning, private boat charters, airport transportation and celebrations.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tropical Drift Travel | Your Island Stay, Handled.",
    description:
      "Personalized concierge support for villas, transportation, dining and island experiences in Turks & Caicos.",
    url: "/",
  },
};

export default function Page() {
  return <Home />;
}
