/**
 * Demo conversion-tracking store.
 * Everything lives in this browser's localStorage — nothing is sent anywhere.
 */

export type TrackEvent =
  | "start_planning_click"
  | "planner_start"
  | "planner_step"
  | "planner_complete"
  | "whatsapp_click"
  | "chat_open"
  | "chat_handoff"
  | "service_enquiry"
  | "instagram_click"
  | "faq_open";

export interface StoredEvent {
  e: TrackEvent;
  at: number;
  meta?: Record<string, string>;
}

const KEY = "tdt_events_v1";
const MAX = 600;

function safeParse(raw: string | null): StoredEvent[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredEvent[]) : [];
  } catch {
    return [];
  }
}

export function track(e: TrackEvent, meta?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    const list = safeParse(window.localStorage.getItem(KEY));
    list.push({ e, at: Date.now(), meta });
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
    window.dispatchEvent(new CustomEvent("tdt:events"));
  } catch {
    /* storage unavailable — demo only */
  }
}

export function readEvents(): StoredEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export interface Insights {
  total: number;
  byEvent: Record<string, number>;
  topServices: { name: string; count: number }[];
  last3: StoredEvent[];
  days: number;
}

export function summarize(events: StoredEvent[]): Insights {
  const byEvent: Record<string, number> = {};
  const services: Record<string, number> = {};
  let oldest = Date.now();
  for (const ev of events) {
    byEvent[ev.e] = (byEvent[ev.e] ?? 0) + 1;
    if (ev.e === "service_enquiry" && ev.meta?.service) {
      services[ev.meta.service] = (services[ev.meta.service] ?? 0) + 1;
    }
    if (ev.meta?.service && ev.e === "planner_complete") {
      /* counted separately below */
    }
    if (ev.at < oldest) oldest = ev.at;
  }
  const topServices = Object.entries(services)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const days = events.length ? Math.max(1, Math.round((Date.now() - oldest) / 86400000)) : 0;
  return {
    total: events.length,
    byEvent,
    topServices,
    last3: events.slice(-3).reverse(),
    days,
  };
}

export function clearEvents(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("tdt:events"));
  } catch {
    /* noop */
  }
}
