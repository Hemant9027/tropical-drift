"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Menu } from "lucide-react";
import { Btn, Wordmark } from "./ui";
import { track } from "@/lib/tracking";
import { WA_INTRO } from "@/lib/site";

const LEFT = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Plan Your Stay", href: "/plan-your-stay" },
];
const RIGHT = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkCls = (href: string) =>
    `relative text-[0.9rem] font-bold transition-colors hover:text-coral ${
      pathname === href ? "text-coral" : ""
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-cream">
        <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-4 md:px-6">
          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-sun shadow-hard-sm md:hidden"
          >
            <Menu size={18} strokeWidth={2.6} />
          </button>

          {/* Desktop left links */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {LEFT.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Centered wordmark */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="Tropical Drift Travel — home"
          >
            <Wordmark compact />
          </Link>

          {/* Desktop right links + CTA */}
          <div className="hidden items-center gap-6 md:flex">
            {RIGHT.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                {l.label}
              </Link>
            ))}
            <Btn
              variant="sun"
              href="/plan-your-stay"
              className="!px-5 !py-3 text-sm"
              onClick={() => track("start_planning_click", { source: "nav" })}
            >
              Start Planning
            </Btn>
          </div>

          {/* Mobile WhatsApp circle */}
          <a
            href={WA_INTRO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            onClick={() => track("whatsapp_click", { source: "nav_mobile" })}
            className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-aqua shadow-hard-sm md:hidden"
          >
            <MessageCircle size={18} strokeWidth={2.6} />
          </a>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-cream dots md:hidden"
          >
            <div className="flex h-[74px] items-center justify-between border-b-[3px] border-ink px-4">
              <Wordmark compact />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-coral shadow-hard-sm"
              >
                <X size={18} strokeWidth={2.6} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-6 pt-8" aria-label="Mobile">
              {[...LEFT, ...RIGHT].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b-2 border-ink/25 py-4 font-display text-[2.4rem] font-black leading-none hover:text-coral"
                  >
                    {l.label}
                    <span className="text-sm font-bold text-aqua">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3 px-6">
              <Btn
                variant="sun"
                href="/plan-your-stay"
                onClick={() => {
                  track("start_planning_click", { source: "mobile_drawer" });
                  setOpen(false);
                }}
                className="w-full"
              >
                Start Planning
              </Btn>
              <Btn variant="ghost" href={WA_INTRO} external className="w-full">
                Chat on WhatsApp
              </Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
