import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import WhatsAppFab from "@/components/WhatsAppFab";
import "./globals.css";

const siteUrl = "https://tropicaldrifttravel-concept.example/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tropical Drift Travel | Turks & Caicos Concierge Services",
    template: "%s | Tropical Drift Travel Concierge",
  },
  description:
    "Personalized Turks & Caicos concierge services in Providenciales — villa recommendations, airport transportation, private boat charters, dining reservations and trip planning by local concierge Cladly Hyppolite.",
  keywords: [
    "Turks and Caicos concierge",
    "Providenciales luxury concierge",
    "Turks and Caicos vacation planning",
    "private boat charter concierge",
    "villa concierge services Turks and Caicos",
    "airport transportation coordination Providenciales",
  ],
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: "Tropical Drift Travel | Your Island Stay, Handled.",
    description:
      "Beautiful villas, unforgettable experiences, effortless dining and every little detail handled — your Turks & Caicos escape, thoughtfully planned.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tropical Drift Travel | Turks & Caicos Concierge",
    description:
      "Personalized concierge support for villas, transportation, dining and island experiences in Turks & Caicos.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF9ED",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: BUSINESS.name,
  founder: BUSINESS.founder,
  areaServed: "Turks and Caicos Islands",
  description:
    "Personalized luxury concierge service in Turks & Caicos coordinating accommodation recommendations, transportation, dining, activities and celebrations.",
  url: BUSINESS.website,
  sameAs: [BUSINESS.instagram],
  telephone: BUSINESS.phoneDisplay,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500..900;1,9..144,500..900&family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-ink antialiased">
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
        <Chatbot />
      </body>
    </html>
  );
}
