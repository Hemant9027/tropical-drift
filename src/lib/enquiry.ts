import { BUSINESS, waLink } from "./site";

export interface Enquiry {
  id: string;
  createdAt: string;
  arrival: string;
  departure: string;
  nights: number | null;
  adults: number;
  children: number;
  accommodation: string;
  interests: string[];
  style: string;
  budget: string;
  occasion: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  country: string;
}

const KEY = "tdt_enquiries_v1";

export function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TDT-${out}`;
}

export function saveEnquiry(e: Enquiry): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: Enquiry[] = raw ? (JSON.parse(raw) as Enquiry[]) : [];
    list.unshift(e);
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 25)));
  } catch {
    /* noop */
  }
}

export function readEnquiries(): Enquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Enquiry[]) : [];
  } catch {
    return [];
  }
}

export function nightsBetween(arrival: string, departure: string): number | null {
  if (!arrival || !departure) return null;
  const a = new Date(`${arrival}T00:00:00`);
  const d = new Date(`${departure}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(d.getTime())) return null;
  const diff = Math.round((d.getTime() - a.getTime()) / 86400000);
  return diff > 0 ? diff : null;
}

export function prettyDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function guestLine(adults: number, children: number): string {
  const a = `${adults} adult${adults === 1 ? "" : "s"}`;
  const c = children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : "";
  return a + c;
}

/** Structured summary shown to the guest and used for the WhatsApp hand-off. */
export function buildSummary(e: Enquiry): string {
  const lines = [
    `ENQUIRY ${e.id}`,
    `${BUSINESS.name} — ${BUSINESS.location}`,
    "",
    `Guest: ${e.firstName} ${e.lastName}`,
    `Email: ${e.email}`,
    `WhatsApp: ${e.whatsapp}`,
    `Country: ${e.country || "—"}`,
    "",
    `Arrival: ${prettyDate(e.arrival)}`,
    `Departure: ${prettyDate(e.departure)}`,
    `Nights: ${e.nights ?? "—"}`,
    `Guests: ${guestLine(e.adults, e.children)}`,
    `Accommodation already booked: ${e.accommodation}`,
    "",
    `Interested in: ${e.interests.join(", ") || "—"}`,
    `Travel style: ${e.style || "—"}`,
    `Budget range: ${e.budget || "Not shared"}`,
    `Occasion: ${e.occasion || "None"}`,
    "",
    `Notes: ${e.notes || "None"}`,
    "",
    "Sent from the Tropical Drift website concept preview.",
  ];
  return lines.join("\n");
}

export function buildWhatsAppMessage(e: Enquiry): string {
  return [
    `Hello ${BUSINESS.shortName}! Here is my concierge request (${e.id}).`,
    "",
    `${e.firstName} ${e.lastName} · ${e.country || "—"}`,
    `Email: ${e.email} · WhatsApp: ${e.whatsapp}`,
    `Dates: ${prettyDate(e.arrival)} → ${prettyDate(e.departure)} (${e.nights ?? "?"} nights)`,
    `Guests: ${guestLine(e.adults, e.children)}`,
    `Accommodation booked: ${e.accommodation}`,
    `Interested in: ${e.interests.join(", ") || "—"}`,
    `Travel style: ${e.style || "—"}`,
    `Budget: ${e.budget || "Not shared"}`,
    `Occasion: ${e.occasion || "None"}`,
    `Notes: ${e.notes || "None"}`,
    "",
    "Please let me know what you can coordinate. Thank you!",
  ].join("\n");
}

export function enquiryWhatsAppLink(e: Enquiry): string {
  return waLink(buildWhatsAppMessage(e));
}
