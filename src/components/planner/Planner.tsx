"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Copy,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { Btn, Reveal, Sticker } from "@/components/ui";
import { BUDGETS, COUNTRIES, INTERESTS, OCCASIONS, PREFILL_KEY, STYLES, type Prefill } from "@/lib/data";
import { track } from "@/lib/tracking";
import {
  buildSummary,
  enquiryWhatsAppLink,
  guestLine,
  makeReference,
  nightsBetween,
  prettyDate,
  saveEnquiry,
  type Enquiry,
} from "@/lib/enquiry";
import { BUSINESS, WA_INTRO } from "@/lib/site";

/* ------------------------------------------------------------------ */

const schema = z
  .object({
    arrival: z.string().min(1, "Please choose your arrival date"),
    departure: z.string().min(1, "Please choose your departure date"),
    adults: z.number().min(1, "At least one adult traveller").max(30, "Please contact us for large groups"),
    children: z.number().min(0).max(20),
    accommodation: z.enum(["yes", "no"], { message: "Let us know if your stay is already booked" }),
    interests: z.array(z.string()).min(1, "Choose at least one experience"),
    style: z.string().min(1, "Choose the travel style that fits you"),
    budget: z.string().optional(),
    occasion: z.string().optional(),
    notes: z.string().max(800, "Please keep it under 800 characters").optional(),
    firstName: z.string().min(1, "Please share your first name").max(60),
    lastName: z.string().min(1, "Please share your last name").max(60),
    email: z
      .string()
      .min(1, "Please share your email")
      .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "Enter a valid email address"),
    whatsapp: z
      .string()
      .min(7, "Enter a WhatsApp number we can reach you on")
      .regex(/^[0-9+()\-\s]{7,20}$/, "Use digits, spaces, +, - or ( )"),
    country: z.string().min(1, "Please choose your country"),
  })
  .superRefine((val, ctx) => {
    if (val.arrival && val.departure && val.departure <= val.arrival) {
      ctx.addIssue({ code: "custom", path: ["departure"], message: "Departure must be after arrival" });
    }
  });

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["arrival", "departure", "adults", "children", "accommodation"],
  ["interests"],
  ["style", "budget", "occasion", "notes"],
  ["firstName", "lastName", "email", "whatsapp", "country"],
  [],
];

const STEPS = [
  { n: "01", label: "Your trip", hint: "Dates & travellers" },
  { n: "02", label: "Interests", hint: "What you want to do" },
  { n: "03", label: "Travel style", hint: "Your pace & occasion" },
  { n: "04", label: "Contact", hint: "How to reach you" },
  { n: "05", label: "Review", hint: "Send your request" },
];

const ACCENT = ["text-[#E4654C]", "text-[#2C8A82]", "text-[#2E7D57]"];

export default function Planner() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      arrival: "",
      departure: "",
      adults: 2,
      children: 0,
      accommodation: "no",
      interests: [],
      style: "",
      budget: "",
      occasion: "",
      notes: "",
      firstName: "",
      lastName: "",
      email: "",
      whatsapp: "",
      country: "",
    },
  });

  const interests = watch("interests") ?? [];
  const style = watch("style");
  const accommodation = watch("accommodation");

  /* Prefill from the homepage search panel */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFILL_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Prefill;
      const map: Record<string, string> = {
        Villa: "villas",
        Boat: "boat",
        Dining: "dining",
        Airport: "airport",
        Itinerary: "",
        Cabana: "cabana",
      };
      const found = Object.entries(map).find(([k]) => p.service?.includes(k));
      if (found && found[1]) setValue("interests", [found[1]]);
      if (p.arrival) setValue("arrival", p.arrival);
      if (p.departure) setValue("departure", p.departure);
      if (p.guests) setValue("adults", p.guests);
      if (p.service) setPrefilled(true);
      window.localStorage.removeItem(PREFILL_KEY);
    } catch {
      /* noop */
    }
    track("planner_start", { source: "plan-your-stay" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nights = useMemo(() => nightsBetween(watch("arrival"), watch("departure")), [watch("arrival"), watch("departure")]);
  const arrivalErr = errors.arrival?.message || errors.departure?.message;

  async function goto(next: number) {
    const dir = next > step ? 1 : -1;
    if (dir === 1) {
      const fields = STEP_FIELDS[step];
      const ok = fields.length ? await trigger(fields, { shouldFocus: true }) : true;
      if (!ok) return;
      track("planner_step", { step: String(step + 1) });
    }
    setDirection(dir);
    setStep(next);
    document.getElementById("planner-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleInterest(id: string) {
    const current = getValues("interests");
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
    if (next.length === 1 && current.length === 0) trigger("interests");
  }

  const onSubmit = (values: FormValues) => {
    setSubmitting(true);
    window.setTimeout(() => {
      const ref = makeReference();
      const record: Enquiry = {
        id: ref,
        createdAt: new Date().toISOString(),
        arrival: values.arrival,
        departure: values.departure,
        nights: nightsBetween(values.arrival, values.departure),
        adults: values.adults,
        children: values.children,
        accommodation: values.accommodation === "yes" ? "Yes" : "No",
        interests: values.interests.map(
          (id) => INTERESTS.find((i) => i.id === id)?.label ?? id
        ),
        style: STYLES.find((s) => s.id === values.style)?.label ?? values.style,
        budget: values.budget || "",
        occasion: values.occasion || "",
        notes: values.notes || "",
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        whatsapp: values.whatsapp.trim(),
        country: values.country,
      };
      saveEnquiry(record);
      track("planner_complete", { services: record.interests.join("|"), style: record.style });
      setEnquiry(record);
      setSubmitting(false);
      document.getElementById("planner-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  };

  /* ---------------- Success screen ---------------- */
  if (enquiry) {
    return (
      <div
        id="planner-card"
        className="overflow-hidden rounded-[28px] border-[3px] border-ink bg-cream shadow-hard-lg"
      >
        <div className="border-b-[3px] border-ink bg-aqua px-6 py-8 text-center md:px-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-sun shadow-hard-sm">
            <Check size={30} strokeWidth={3} />
          </span>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-black">
            Your summary is <em className="text-cream italic">ready</em>.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/80">
            Thank you for sharing your travel plans! Your request summary is ready. Please send it
            to Tropical Drift through WhatsApp so the team can review your preferences.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-cream px-4 py-2 font-mono text-sm font-bold tracking-wider shadow-hard-sm">
            {enquiry.id}
          </p>
        </div>

        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-10">
          <div>
            <p className="label-caps text-ink/55">Enquiry summary</p>
            <dl className="mt-4 divide-y-2 divide-ink/10 rounded-[20px] border-[3px] border-ink bg-white">
              {[
                ["Guest", `${enquiry.firstName} ${enquiry.lastName}`],
                ["Dates", `${prettyDate(enquiry.arrival)} → ${prettyDate(enquiry.departure)} · ${enquiry.nights ?? "—"} nights`],
                ["Travellers", guestLine(enquiry.adults, enquiry.children)],
                ["Stay booked?", enquiry.accommodation],
                ["Interested in", enquiry.interests.join(", ")],
                ["Travel style", enquiry.style],
                ["Budget range", enquiry.budget || "Not shared"],
                ["Occasion", enquiry.occasion || "None"],
                ["Email", enquiry.email],
                ["WhatsApp", enquiry.whatsapp],
                ["Country", enquiry.country],
                ["Notes", enquiry.notes || "None"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-3 px-4 py-3 text-sm">
                  <dt className="label-caps pt-0.5 text-ink/50">{k}</dt>
                  <dd className="font-semibold break-words">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-3">
              <Btn variant="ghost" href="/plan-your-stay">
                Plan another trip
              </Btn>
              <Btn
                variant="cream"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(buildSummary(enquiry));
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Copy size={16} /> {copied ? "Summary copied!" : "Copy summary"}
              </Btn>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[20px] border-[3px] border-ink bg-sun p-5 shadow-hard-sm">
              <p className="label-caps">Simulated acknowledgment</p>
              <p className="mt-3 text-sm leading-relaxed">
                &ldquo;Thank you for sharing your travel plans! Your request summary is ready.
                Please send it to Tropical Drift through WhatsApp so the team can review your
                preferences.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-ink/60">
                Preview only — no email or server confirmation has been sent from this concept.
              </p>
            </div>

            <a
              href={enquiryWhatsAppLink(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { source: "planner_success" })}
              className="btn btn-ink w-full"
            >
              <MessageCircle size={17} /> Send via WhatsApp
            </a>

            <p className="rounded-[16px] border-2 border-dashed border-ink/40 bg-white/60 p-4 text-xs leading-relaxed text-ink/70">
              <strong>Browser-local only.</strong> This enquiry is saved in this browser until you
              send it through WhatsApp. Nothing has been transmitted to {BUSINESS.shortName} yet.
            </p>

            <a
              href={WA_INTRO}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { source: "planner_success_intro" })}
              className="btn btn-ghost w-full"
            >
              Just say hello instead
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Wizard ---------------- */
  return (
    <div id="planner-card" className="grid gap-6 md:grid-cols-[270px_1fr] md:gap-8">
      {/* Rail */}
      <aside className="md:sticky md:top-[96px] md:self-start">
        <div className="rounded-[24px] border-[3px] border-ink bg-ink p-5 text-cream shadow-hard">
          <p className="label-caps text-sun">Your concierge request</p>
          <ol className="mt-4 space-y-2.5">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => i < step && void goto(i)}
                    disabled={i > step}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-center gap-3 rounded-full border-2 px-3 py-2 text-left transition-colors ${
                      active
                        ? "border-ink bg-sun text-ink"
                        : done
                          ? "border-aqua/60 bg-aqua/15 text-cream"
                          : "border-cream/20 text-cream/45"
                    } ${i <= step ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="font-mono text-xs font-bold">{done ? "✓" : s.n}</span>
                    <span className="text-sm font-bold">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 overflow-hidden rounded-[16px] border-2 border-cream/25">
            <img
              src="/images/cabana.jpg"
              alt="Palm tree beside white sand on a tropical beach"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-32 w-full object-cover"
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-cream/65">
            Nothing is booked here. This creates a summary you send to Cladly yourself.
          </p>
        </div>
      </aside>

      {/* Card */}
      <div className="rounded-[26px] border-[3px] border-ink bg-white shadow-hard-lg">
        {/* Mobile progress */}
        <div className="border-b-[3px] border-ink px-5 py-4 md:hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-ink/60">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span>{STEPS[step].label}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-ink bg-cream">
            <motion.div
              className="h-full bg-coral"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="min-h-[520px] px-5 py-7 md:px-9 md:py-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 34 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -34 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ---------- STEP 1 ---------- */}
                {step === 0 && (
                  <section aria-label="Step 1: your trip">
                    <div className="flex flex-wrap items-center gap-3">
                      <Sticker tone="bg-coral" rotate={-3}>
                        <Calendar size={13} /> Step one
                      </Sticker>
                      {prefilled && (
                        <span className="label-caps rounded-full border-2 border-ink bg-aqua px-3 py-1.5">
                          Prefilled from the homepage
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-black">
                      Tell us about <em className={`${ACCENT[0]} italic`}>your trip</em>.
                    </h2>
                    <p className="mt-3 max-w-lg text-ink/70">
                      Dates help Cladly understand the shape of your stay. Nothing is booked at this
                      stage.
                    </p>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="arrival" className="label-caps mb-2 block">
                          Arrival date
                        </label>
                        <input
                          id="arrival"
                          type="date"
                          className={`field ${arrivalErr && errors.arrival ? "field-error" : ""}`}
                          {...register("arrival")}
                        />
                        {errors.arrival && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.arrival.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="departure" className="label-caps mb-2 block">
                          Departure date
                        </label>
                        <input
                          id="departure"
                          type="date"
                          className={`field ${errors.departure ? "field-error" : ""}`}
                          {...register("departure")}
                        />
                        {errors.departure && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.departure.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="adults" className="label-caps mb-2 block">
                          Adults
                        </label>
                        <input
                          id="adults"
                          type="number"
                          min={1}
                          max={30}
                          className={`field ${errors.adults ? "field-error" : ""}`}
                          {...register("adults", {
                            setValueAs: (v) => (v === "" || v === null || Number.isNaN(Number(v)) ? 1 : Number(v)),
                          })}
                        />
                        {errors.adults && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.adults.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="children" className="label-caps mb-2 block">
                          Children
                        </label>
                        <input
                          id="children"
                          type="number"
                          min={0}
                          max={20}
                          className={`field ${errors.children ? "field-error" : ""}`}
                          {...register("children", {
                            setValueAs: (v) => (v === "" || v === null || Number.isNaN(Number(v)) ? 0 : Number(v)),
                          })}
                        />
                        {errors.children && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.children.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {nights !== null && nights > 0 && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sand px-4 py-2 text-sm font-bold">
                        <Sparkles size={14} /> {nights} night{nights === 1 ? "" : "s"} ·{" "}
                        {guestLine(getValues("adults") || 1, getValues("children") || 0)}
                      </p>
                    )}

                    <fieldset className="mt-7">
                      <legend className="label-caps mb-3">Accommodation already booked?</legend>
                      <div className="flex flex-wrap gap-3">
                        {(["yes", "no"] as const).map((v) => (
                          <label
                            key={v}
                            className={`cursor-pointer rounded-full border-[3px] border-ink px-5 py-3 text-sm font-bold transition-all ${
                              accommodation === v ? "bg-aqua shadow-hard-sm" : "bg-white hover:bg-cream"
                            }`}
                          >
                            <input
                              type="radio"
                              className="sr-only"
                              value={v}
                              {...register("accommodation")}
                            />
                            {v === "yes" ? "Yes, it is booked" : "No, not yet"}
                          </label>
                        ))}
                      </div>
                      {errors.accommodation && (
                        <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                          {errors.accommodation.message}
                        </p>
                      )}
                    </fieldset>
                  </section>
                )}

                {/* ---------- STEP 2 ---------- */}
                {step === 1 && (
                  <section aria-label="Step 2: interests">
                    <Sticker tone="bg-aqua" rotate={-3}>
                      Step two
                    </Sticker>
                    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-black">
                      What <em className={`${ACCENT[1]} italic`}>interests</em> you?
                    </h2>
                    <p className="mt-3 max-w-lg text-ink/70">
                      Pick as many as you like — these become the services in your request.
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {INTERESTS.map((it) => {
                        const Icon = it.icon;
                        const on = interests.includes(it.id);
                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => toggleInterest(it.id)}
                            aria-pressed={on}
                            className={`relative flex flex-col items-start rounded-[18px] border-[3px] border-ink p-4 text-left transition-all ${
                              on
                                ? "bg-sun shadow-hard-sm -translate-y-0.5"
                                : "bg-cream hover:-translate-y-0.5 hover:shadow-hard-sm"
                            }`}
                          >
                            <span
                              className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink ${on ? "bg-coral" : "bg-white"}`}
                            >
                              <Icon size={19} strokeWidth={2.4} />
                            </span>
                            <span className="mt-3 font-display text-lg font-extrabold leading-tight">
                              {it.label}
                            </span>
                            <span className="mt-1 text-xs text-ink/60">{it.note}</span>
                            {on && (
                              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-aqua">
                                <Check size={12} strokeWidth={3.4} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.interests && (
                      <p role="alert" className="mt-3 text-sm font-semibold text-[#C2452F]">
                        {errors.interests.message}
                      </p>
                    )}
                  </section>
                )}

                {/* ---------- STEP 3 ---------- */}
                {step === 2 && (
                  <section aria-label="Step 3: travel style">
                    <Sticker tone="bg-sun" rotate={-3}>
                      Step three
                    </Sticker>
                    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-black">
                      Your travel <em className={`${ACCENT[2]} italic`}>style</em>.
                    </h2>
                    <p className="mt-3 max-w-lg text-ink/70">
                      This shapes the recommendations — not the price. Tropical Drift quotes each
                      request personally.
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {STYLES.map((s) => {
                        const on = style === s.id;
                        return (
                          <label
                            key={s.id}
                            className={`cursor-pointer rounded-[18px] border-[3px] border-ink p-4 transition-all ${
                              on ? "bg-aqua shadow-hard-sm -translate-y-0.5" : "bg-cream hover:-translate-y-0.5"
                            }`}
                          >
                            <input
                              type="radio"
                              className="sr-only"
                              value={s.id}
                              {...register("style")}
                            />
                            <span className="flex items-center justify-between">
                              <span className="font-display text-lg font-extrabold leading-tight">
                                {s.label}
                              </span>
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink ${on ? "bg-sun" : "bg-white"}`}
                              >
                                {on && <Check size={12} strokeWidth={3.4} />}
                              </span>
                            </span>
                            <span className="mt-1.5 block text-xs text-ink/65">{s.note}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.style && (
                      <p role="alert" className="mt-3 text-sm font-semibold text-[#C2452F]">
                        {errors.style.message}
                      </p>
                    )}

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="budget" className="label-caps mb-2 block">
                          Estimated budget range <span className="text-ink/45">(optional)</span>
                        </label>
                        <select id="budget" className="field" {...register("budget")}>
                          <option value="">Prefer not to say</option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-xs text-ink/55">
                          A rough guide only — no prices are calculated here.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="occasion" className="label-caps mb-2 block">
                          Special occasion <span className="text-ink/45">(optional)</span>
                        </label>
                        <select id="occasion" className="field" {...register("occasion")}>
                          {OCCASIONS.map((o) => (
                            <option key={o || "none"} value={o}>
                              {o || "None / just a holiday"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="notes" className="label-caps mb-2 block">
                          Additional preferences <span className="text-ink/45">(optional)</span>
                        </label>
                        <textarea
                          id="notes"
                          rows={4}
                          placeholder="Dietary needs, flight times, villa area you like, things you would love to arrange…"
                          className={`field resize-none ${errors.notes ? "field-error" : ""}`}
                          {...register("notes")}
                        />
                        {errors.notes && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.notes.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* ---------- STEP 4 ---------- */}
                {step === 3 && (
                  <section aria-label="Step 4: contact information">
                    <Sticker tone="bg-coral" rotate={-3}>
                      Step four
                    </Sticker>
                    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-black">
                      How do we <em className={`${ACCENT[0]} italic`}>reach you</em>?
                    </h2>
                    <p className="mt-3 max-w-lg text-ink/70">
                      Cladly works directly with each guest — your details stay in this browser
                      until you send the summary yourself.
                    </p>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      {(
                        [
                          ["firstName", "First name", "text", "Cladly"],
                          ["lastName", "Last name", "text", "Hyppolite"],
                        ] as const
                      ).map(([name, label, type, ph]) => (
                        <div key={name}>
                          <label htmlFor={name} className="label-caps mb-2 block">
                            {label}
                          </label>
                          <input
                            id={name}
                            type={type}
                            autoComplete="given-name"
                            placeholder={ph}
                            className={`field ${errors[name] ? "field-error" : ""}`}
                            {...register(name)}
                          />
                          {errors[name] && (
                            <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                              {errors[name]?.message}
                            </p>
                          )}
                        </div>
                      ))}

                      <div>
                        <label htmlFor="email" className="label-caps mb-2 block">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={`field ${errors.email ? "field-error" : ""}`}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="whatsapp" className="label-caps mb-2 block">
                          WhatsApp number
                        </label>
                        <input
                          id="whatsapp"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+1 649 000 0000"
                          className={`field ${errors.whatsapp ? "field-error" : ""}`}
                          {...register("whatsapp")}
                        />
                        {errors.whatsapp && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.whatsapp.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="country" className="label-caps mb-2 block">
                          Country
                        </label>
                        <select
                          id="country"
                          className={`field ${errors.country ? "field-error" : ""}`}
                          {...register("country")}
                        >
                          <option value="">Choose your country</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p role="alert" className="mt-2 text-sm font-semibold text-[#C2452F]">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* ---------- STEP 5 ---------- */}
                {step === 4 && (
                  <section aria-label="Step 5: review">
                    <Sticker tone="bg-aqua" rotate={-3}>
                      Almost there
                    </Sticker>
                    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-black">
                      Review your <em className={`${ACCENT[1]} italic`}>request</em>.
                    </h2>
                    <p className="mt-3 max-w-lg text-ink/70">
                      Check everything below — you can jump back to edit any part.
                    </p>

                    <div className="mt-7 space-y-4">
                      {[
                        {
                          n: 0,
                          title: "Your trip",
                          rows: [
                            ["Dates", `${prettyDate(getValues("arrival"))} → ${prettyDate(getValues("departure"))}`],
                            ["Nights", String(nights ?? "—")],
                            ["Travellers", guestLine(getValues("adults") || 1, getValues("children") || 0)],
                            ["Stay booked?", getValues("accommodation") === "yes" ? "Yes" : "No"],
                          ],
                        },
                        {
                          n: 1,
                          title: "Interests",
                          rows: [
                            [
                              "Selected",
                              getValues("interests")
                                .map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id)
                                .join(", ") || "—",
                            ],
                          ],
                        },
                        {
                          n: 2,
                          title: "Style & details",
                          rows: [
                            ["Travel style", STYLES.find((s) => s.id === getValues("style"))?.label ?? "—"],
                            ["Budget", getValues("budget") || "Not shared"],
                            ["Occasion", getValues("occasion") || "None"],
                            ["Notes", getValues("notes") || "None"],
                          ],
                        },
                        {
                          n: 3,
                          title: "Contact",
                          rows: [
                            ["Name", `${getValues("firstName")} ${getValues("lastName")}`],
                            ["Email", getValues("email")],
                            ["WhatsApp", getValues("whatsapp")],
                            ["Country", getValues("country")],
                          ],
                        },
                      ].map((block) => (
                        <div
                          key={block.title}
                          className="rounded-[20px] border-[3px] border-ink bg-cream p-4 shadow-hard-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-display text-xl font-extrabold">{block.title}</h3>
                            <button
                              type="button"
                              onClick={() => void goto(block.n)}
                              className="label-caps rounded-full border-2 border-ink bg-sun px-3 py-1.5 transition-transform hover:-translate-y-0.5"
                            >
                              Edit
                            </button>
                          </div>
                          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                            {block.rows.map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="label-caps shrink-0 pt-0.5 text-ink/50">{k}</dt>
                                <dd className="font-semibold break-words">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink bg-cream px-5 py-5 md:px-9">
            <Btn variant="ghost" onClick={() => void goto(step - 1)} disabled={step === 0}>
              <ArrowLeft size={17} strokeWidth={2.6} /> Back
            </Btn>

            {step < STEPS.length - 1 ? (
              <Btn variant="coral" onClick={() => void goto(step + 1)}>
                Next <ArrowRight size={17} strokeWidth={2.6} />
              </Btn>
            ) : (
              <Btn type="submit" variant="ink" disabled={submitting}>
                {submitting ? (
                  <>
                    <motion.span
                      className="h-4 w-4 rounded-full border-2 border-cream border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Preparing your summary…
                  </>
                ) : (
                  <>
                    Send My Concierge Request <Send size={16} strokeWidth={2.5} />
                  </>
                )}
              </Btn>
            )}
          </div>
        </form>

        <p className="border-t-2 border-ink/10 bg-white px-5 py-3 text-xs text-ink/55 md:px-9">
          This concept saves your enquiry in this browser only. To reach{" "}
          {BUSINESS.shortName} for real, send it via WhatsApp to {BUSINESS.phoneDisplay}.{" "}
          <Link href="/contact" className="underline hover:text-coral">
            Contact page
          </Link>
        </p>
      </div>
    </div>
  );
}
