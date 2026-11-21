"use client";

import { MessageCircle } from "lucide-react";
import { track } from "@/lib/tracking";
import { WA_INTRO } from "@/lib/site";

export default function WhatsAppFab() {
  return (
    <a
      href={WA_INTRO}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { source: "sticky_fab" })}
      aria-label="Chat with Tropical Drift on WhatsApp"
      className="fixed bottom-5 left-4 z-[65] flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-aqua shadow-hard transition-transform hover:-translate-y-1 md:bottom-6 md:left-6 md:hidden"
    >
      <MessageCircle size={22} strokeWidth={2.6} />
    </a>
  );
}
