export const BUSINESS = {
  name: "Tropical Drift Travel Concierge Services",
  shortName: "Tropical Drift",
  founder: "Cladly Hyppolite",
  location: "Turks & Caicos Islands",
  region: "Providenciales, Turks & Caicos Islands",
  phoneDisplay: "+1 649 341 2898",
  whatsappRaw: "16493412898",
  whatsappDisplay: "+1 649 341 2898",
  website: "https://www.tropicaldrifttravel.com/",
  instagram: "https://www.instagram.com/tropicaldrifttravel",
  instagramHandle: "@tropicaldrifttravel",
  tagline: "Your Island Stay, Handled.",
  conceptCredit: "Concept Designed by InfyCrest Solutions",
} as const;

export function waLink(text: string): string {
  return `https://wa.me/${BUSINESS.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export const WA_INTRO = waLink(
  "Hello Tropical Drift! I found your website concept and would like to plan my stay in Turks & Caicos."
);

export const SOCIAL = [
  { label: "Instagram", href: BUSINESS.instagram },
  { label: "WhatsApp", href: WA_INTRO },
  { label: "Official Site", href: BUSINESS.website },
] as const;
