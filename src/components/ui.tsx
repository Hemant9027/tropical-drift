"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------------- Reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Sticker ---------------- */

export function Sticker({
  children,
  tone = "bg-sun",
  className = "",
  rotate = -3,
}: {
  children: ReactNode;
  tone?: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={`sticker ${tone} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/* ---------------- Buttons ---------------- */

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "coral" | "sun" | "aqua" | "ink" | "ghost" | "cream";
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

const variantClass: Record<string, string> = {
  coral: "btn-coral",
  sun: "btn-sun",
  aqua: "btn-aqua",
  ink: "btn-ink",
  ghost: "btn-ghost",
  cream: "btn-cream",
};

export function Btn({
  children,
  href,
  variant = "coral",
  className = "",
  external = false,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: BtnProps) {
  const cls = `btn ${variantClass[variant]} ${className}`;
  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ---------------- Marquee ---------------- */

export function Marquee({
  items,
  className = "",
  slow = false,
}: {
  items: string[];
  className?: string;
  slow?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className={`marquee-track ${slow ? "marquee-slow" : ""}`}>
        {row.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap px-5 text-[0.78rem] font-bold uppercase tracking-[0.18em]">
              {t}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0l2.6 8.2L23 12l-8.4 3.8L12 24l-2.6-8.2L1 12l8.4-3.8z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label-caps flex items-center gap-2 ${className}`}>
      <span className="inline-block h-2 w-2 rounded-full bg-coral" />
      {children}
    </p>
  );
}

/* ---------------- Wordmark ---------------- */

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg
        viewBox="0 0 48 48"
        className={compact ? "h-8 w-8" : "h-9 w-9"}
        role="img"
        aria-label="Tropical Drift palm mark"
      >
        <circle cx="24" cy="24" r="22" fill="#6DBCB5" stroke="#22342F" strokeWidth="3" />
        <path
          d="M24 36c0-7 0-11 1-15"
          stroke="#22342F"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M25 21c-3-5-8-7-13-6 4 1 7 3 9 6M25 21c1-6 5-9 11-9-4 2-7 5-8 9M25 21c4-3 9-3 13 0-5 0-8 1-11 4M25 21c-4-3-9-3-13 0 5 0 8 1 11 4"
          fill="#22342F"
        />
        <path d="M15 37c6 3 12 3 18 0" stroke="#F17B66" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-black tracking-tight">TROPICAL</span>
        <span className="block font-display text-[1.05rem] font-black tracking-tight">
          DRIFT<span className="text-coral">.</span>
        </span>
      </span>
    </span>
  );
}
