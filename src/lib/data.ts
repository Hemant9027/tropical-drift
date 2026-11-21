import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Fish,
  GlassWater,
  Heart,
  Palmtree,
  Plane,
  Sailboat,
  Tent,
  PartyPopper,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Featured services (editorial, alternating)                          */
/* ------------------------------------------------------------------ */

export interface FeaturedService {
  id: string;
  kicker: string;
  sticker: string;
  stickerColor: string;
  title: string;
  accent: string;
  tagline: string;
  body: string;
  points: string[];
  image: string;
  alt: string;
  cta: string;
  interest: string;
}

export const FEATURED: FeaturedService[] = [
  {
    id: "villas",
    kicker: "01 — Where you stay",
    sticker: "Stay",
    stickerColor: "bg-sun",
    title: "Villas & Beautiful Stays",
    accent: "Stays",
    tagline: "Find your perfect island home.",
    body: "Tropical Drift helps you make sense of the islands' accommodation options — from beachfront villas to resort suites — and shares personalised recommendations based on the way you like to travel, who you are travelling with and the kind of stay you have in mind. If you have already booked, the concierge can still help with the details around it.",
    points: [
      "Personalised accommodation recommendations",
      "Villa and resort guidance before you book",
      "Help arranging the details around your stay",
    ],
    image: "/images/villa.jpg",
    alt: "Infinity pool overlooking a blue bay and distant islands",
    cta: "Request Villa Help",
    interest: "Luxury Villas",
  },
  {
    id: "boats",
    kicker: "02 — Days on the water",
    sticker: "Explore",
    stickerColor: "bg-aqua",
    title: "Private Boat Experiences",
    accent: "Ocean",
    tagline: "A little ocean, a lot of magic.",
    body: "Spend the day on the water with a private charter arranged around your plans. Tropical Drift can help coordinate private boat charters, snorkelling and scuba outings, sunset sails, fishing trips and other island activities with trusted local providers — so the day feels effortless from the moment you step aboard.",
    points: [
      "Private boat charters and sunset sails",
      "Snorkelling, scuba diving and fishing",
      "Island activities coordinated around your dates",
    ],
    image: "/images/boat.jpg",
    alt: "White sailboat sailing across the ocean",
    cta: "Plan a Day on the Water",
    interest: "Private Boat Charters",
  },
  {
    id: "dining",
    kicker: "03 — Tables & occasions",
    sticker: "Unwind",
    stickerColor: "bg-coral",
    title: "Dining & Celebrations",
    accent: "Moments",
    tagline: "Make every moment memorable.",
    body: "From restaurant reservations to beach dinners, proposals, room setups and celebrations, Tropical Drift can help arrange the touches that make a trip feel like yours. Share the occasion and the mood you are after, and the concierge will work on the details with you.",
    points: [
      "Restaurant recommendations and reservations",
      "Beach dinners, proposals and room setups",
      "Special occasions planned with care",
    ],
    image: "/images/dining.jpg",
    alt: "Outdoor dining tables with an ocean view at sunset",
    cta: "Arrange a Reservation",
    interest: "Fine Dining",
  },
];

/* ------------------------------------------------------------------ */
/* Smaller service grid                                                */
/* ------------------------------------------------------------------ */

export interface ServiceItem {
  id: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  color: string;
  interest: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "airport",
    title: "Airport Transportation",
    blurb: "Coordination of comfortable transfers to and from Providenciales International Airport.",
    icon: Plane,
    color: "bg-sun",
    interest: "Airport Transportation",
  },
  {
    id: "itinerary",
    title: "Itinerary Planning",
    blurb: "A personalised plan built around your travel style, pace and priorities.",
    icon: Compass,
    color: "bg-aqua",
    interest: "Itinerary Planning",
  },
  {
    id: "cabanas",
    title: "Beach Cabanas",
    blurb: "Help arranging a shaded spot on the sand for a slow, unhurried beach day.",
    icon: Tent,
    color: "bg-coral",
    interest: "Beach Cabanas",
  },
  {
    id: "prestock",
    title: "Villa Pre-Stocking",
    blurb: "Groceries and essentials waiting for you so the first evening feels easy.",
    icon: GlassWater,
    color: "bg-sand",
    interest: "Grocery Pre-Stocking",
  },
  {
    id: "sports",
    title: "Sports Activities",
    blurb: "ATV adventures, jet skis, horseback riding, kiteboarding and more island energy.",
    icon: Waves,
    color: "bg-aqua",
    interest: "Family Activities",
  },
  {
    id: "occasions",
    title: "Special Occasions",
    blurb: "Birthdays, proposals, anniversaries and celebrations planned with discretion.",
    icon: PartyPopper,
    color: "bg-sun",
    interest: "Celebrations",
  },
];

/* ------------------------------------------------------------------ */
/* Planner                                                             */
/* ------------------------------------------------------------------ */

export const INTERESTS: { id: string; label: string; icon: LucideIcon; note: string }[] = [
  { id: "villas", label: "Luxury Villas", icon: Palmtree, note: "Villa & resort guidance" },
  { id: "airport", label: "Airport Transportation", icon: Plane, note: "Arrival & departure transfers" },
  { id: "boat", label: "Private Boat Charters", icon: Sailboat, note: "Charters & island days" },
  { id: "snorkel", label: "Snorkeling", icon: Fish, note: "Reefs, marine life & diving" },
  { id: "dining", label: "Fine Dining", icon: UtensilsCrossed, note: "Reservations & recommendations" },
  { id: "romantic", label: "Romantic Experiences", icon: Heart, note: "Sunsets, dinners & surprises" },
  { id: "family", label: "Family Activities", icon: Compass, note: "Days out for every age" },
  { id: "cabana", label: "Beach Cabanas", icon: Tent, note: "Shade, loungers & slow days" },
  { id: "celebration", label: "Celebrations", icon: PartyPopper, note: "Birthdays, proposals, anniversaries" },
  { id: "grocery", label: "Grocery Pre-Stocking", icon: GlassWater, note: "Arrive to a stocked kitchen" },
];

export const STYLES: { id: string; label: string; note: string }[] = [
  { id: "relaxed", label: "Relaxed & Peaceful", note: "Slow mornings, spa time, nothing rushed" },
  { id: "romantic", label: "Romantic Getaway", note: "Just the two of you" },
  { id: "family", label: "Family Vacation", note: "Easy days for every age" },
  { id: "adventure", label: "Adventure & Exploration", note: "Water, islands and activity" },
  { id: "luxury", label: "Luxury Escape", note: "The best of everything, quietly arranged" },
  { id: "celebration", label: "Special Celebration", note: "An occasion worth marking" },
];

export const BUDGETS = [
  "Not sure yet",
  "Thoughtful & sensible",
  "Comfortable",
  "Premium",
  "Money is not the point",
];

export const OCCASIONS = ["", "Honeymoon", "Anniversary", "Birthday", "Proposal", "Family reunion", "Other"];

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "Caribbean",
  "Haiti",
  "Other",
];

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Can you help plan my entire vacation?",
    a: "Yes — many guests share the shape of their trip and let Tropical Drift coordinate the details around it, from accommodation recommendations and airport transportation to dining, activities and celebrations. Start with the trip planner and share as much or as little as you like.",
  },
  {
    q: "Can I request only one service?",
    a: "Absolutely. Not every trip needs the same kind of planning. Some guests only need a few reservations or one transfer organised — select just the services you are interested in and send the request.",
  },
  {
    q: "Can you arrange airport transportation?",
    a: "Tropical Drift can help coordinate transportation to and from Providenciales International Airport. Share your arrival date, flight details and the number of travellers in the trip planner and the concierge can take it from there.",
  },
  {
    q: "Do you coordinate private boat charters?",
    a: "Yes — private boat charters, sunset sails, snorkelling, scuba diving and fishing can all be coordinated with local providers around your dates and group. Availability is confirmed personally rather than through an online booking engine.",
  },
  {
    q: "Can you help organize special occasions?",
    a: "Celebrations are a big part of what the concierge arranges — beach dinners, proposals, room setups, birthdays and anniversaries. Tell Cladly what you have in mind and she will work on the details with you.",
  },
  {
    q: "How do I start planning?",
    a: "Use the trip planner to share your dates, interests and travel style. You will get a structured summary you can send straight to Tropical Drift on WhatsApp, or you can start a conversation with the Island Concierge chat at any time.",
  },
];

/* ------------------------------------------------------------------ */
/* Chatbot — rule-based, simulated                                     */
/* ------------------------------------------------------------------ */

export interface Intent {
  id: string;
  keywords: string[];
  reply: string;
  chips?: string[];
}

export const INTENTS: Intent[] = [
  {
    id: "airport",
    keywords: ["airport", "transfer", "transportation", "shuttle", "flight", "pickup", "ride"],
    reply:
      "Absolutely! Tropical Drift can help coordinate airport transportation for your stay. Would you like to share your arrival date and number of travellers?",
    chips: ["Plan My Stay", "Request Transportation", "Chat on WhatsApp"],
  },
  {
    id: "villa",
    keywords: ["villa", "hotel", "stay", "accommodation", "rent", "resort", "booking", "where"],
    reply:
      "I can help you get started with accommodation. Tropical Drift shares personalised villa and resort recommendations based on your travel style, group and dates — and can help with the details even if you have already booked.",
    chips: ["Plan My Stay", "See Villa Help", "Chat on WhatsApp"],
  },
  {
    id: "boat",
    keywords: ["boat", "charter", "yacht", "sail", "snorkel", "scuba", "dive", "fishing", "water", "jet ski"],
    reply:
      "Days on the water are one of the best parts of Turks & Caicos. Private boat charters, sunset sails, snorkelling, scuba diving and fishing can all be coordinated around your dates. What kind of day are you imagining?",
    chips: ["Plan My Stay", "Plan a Day on the Water", "Chat on WhatsApp"],
  },
  {
    id: "dining",
    keywords: ["restaurant", "dinner", "dining", "reservation", "eat", "food", "chef", "table", "lunch"],
    reply:
      "Happy to help with that! Tropical Drift can help with restaurant recommendations and reservations, as well as beach dinners and in-villa arrangements. How many people will be dining, and do you have a date in mind?",
    chips: ["Plan My Stay", "Request a Reservation", "Chat on WhatsApp"],
  },
  {
    id: "celebration",
    keywords: ["celebration", "birthday", "proposal", "anniversary", "honeymoon", "wedding", "romantic", "surprise"],
    reply:
      "What a lovely reason to travel. Beach dinners, proposals, room setups and celebrations can be arranged with care and discretion. Tell me the occasion and roughly when you are arriving.",
    chips: ["Plan My Stay", "Request Celebration Help", "Chat on WhatsApp"],
  },
  {
    id: "planning",
    keywords: ["plan", "itinerary", "trip", "schedule", "days", "itenerary", "holiday", "vacation", "advice"],
    reply:
      "Let's build it together. The trip planner takes about two minutes: your dates, the experiences you want, your travel style and how to reach you. You will get a tidy summary to send to Cladly.",
    chips: ["Plan My Stay", "See Services", "Chat on WhatsApp"],
  },
  {
    id: "contact",
    keywords: ["contact", "whatsapp", "call", "phone", "email", "reach", "cladly", "talk", "human", "person"],
    reply:
      `You can reach ${"Cladly"} directly on WhatsApp at +1 649 341 2898, or through the contact page. She works directly with each guest before and during the stay.`,
    chips: ["Chat on WhatsApp", "Contact Page", "Plan My Stay"],
  },
  {
    id: "price",
    keywords: ["price", "cost", "how much", "rate", "fee", "budget", "quote", "expensive"],
    reply:
      "I can help you get started, but Cladly can provide the most accurate details — pricing is tailored to each guest's itinerary and the services requested. Would you like to send your question directly?",
    chips: ["Chat on WhatsApp", "Plan My Stay"],
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good evening", "bonjour", "bonswa"],
    reply:
      "Hello, and welcome to Turks & Caicos 🌴 I am the Island Concierge assistant. Tell me what you are dreaming of — villas, boats, dining, celebrations — and I will point you in the right direction.",
    chips: ["Plan My Stay", "What do you offer?", "Chat on WhatsApp"],
  },
];

export const FALLBACK_REPLY =
  "I can help you get started, but Cladly can provide the most accurate details. Would you like to send your question directly?";

export const CHAT_SUGGESTIONS = [
  "Can you arrange airport transportation?",
  "We want a private boat day",
  "Help with a villa",
  "Restaurant reservations",
];

/* ------------------------------------------------------------------ */
/* Trip planner prefill from the homepage search panel                 */
/* ------------------------------------------------------------------ */

export const PREFILL_KEY = "tdt_prefill_v1";

export interface Prefill {
  service?: string;
  arrival?: string;
  departure?: string;
  guests?: number;
}
