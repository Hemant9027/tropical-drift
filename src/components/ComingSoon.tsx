import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Btn, Reveal, Sticker } from "./ui";
import { WA_INTRO } from "@/lib/site";

interface Props {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  titleEnd?: string;
  blurb: string;
  image: string;
  alt: string;
}

export default function ComingSoon({
  eyebrow,
  titleStart,
  titleAccent,
  titleEnd,
  blurb,
  image,
  alt,
}: Props) {
  return (
    <>
      <section className="dots relative overflow-hidden bg-cream pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 md:grid-cols-[1.05fr_0.95fr] md:px-6">
          <div>
            <Reveal>
              <Sticker tone="bg-sun" rotate={-4}>
                {eyebrow}
              </Sticker>
              <h1 className="mt-7 text-[clamp(2.6rem,7vw,5.4rem)] font-black">
                {titleStart} <em className="text-[#E4654C] italic">{titleAccent}</em>
                {titleEnd ? (
                  <>
                    {" "}
                    <em className="text-[#2C8A82] italic">{titleEnd}</em>
                  </>
                ) : null}
                .
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">{blurb}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href="/" variant="coral">
                  <ArrowLeft size={17} strokeWidth={2.6} /> Back to Home
                </Btn>
                <Btn href={WA_INTRO} external variant="ghost">
                  <MessageCircle size={16} /> Chat on WhatsApp
                </Btn>
                <Btn href="/plan-your-stay" variant="aqua">
                  Plan My Stay <ArrowRight size={17} strokeWidth={2.6} />
                </Btn>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border-[3px] border-ink shadow-hard-lg">
                <img
                  src={image}
                  alt={alt}
                  width={1536}
                  height={1024}
                  className="h-[320px] w-full object-cover md:h-[460px]"
                />
              </div>
              <span className="absolute -bottom-4 left-6 sticker bg-aqua rotate-[-4deg]">
                Coming soon
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t-[3px] border-ink bg-sand py-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-6">
          <h2 className="max-w-[20ch] text-[clamp(1.8rem,4vw,3rem)] font-black">
            This page is part of the concept roadmap.
          </h2>
          <p className="mt-4 max-w-2xl text-ink/70">
            The four fully built pages are the homepage, the trip planner, concierge services and
            contact. Everything else is intentionally kept lean — but you can already reach the
            concierge on WhatsApp.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="/services" variant="sun">
              View Services
            </Btn>
            <Btn href="/contact" variant="cream">
              Contact
            </Btn>
            <Link href="/demo-insights" className="btn btn-ghost">
              Demo Insights
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
