import Link from "next/link";
import { AtSign, MessageCircle, Globe } from "lucide-react";
import { Marquee, Wordmark } from "./ui";
import { BUSINESS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-cream">
      <div className="bg-coral py-3 text-ink">
        <Marquee
          slow
          items={[
            "YOUR ISLAND STAY, HANDLED",
            "PRIVATE CONCIERGE",
            "TURKS & CAICOS",
            "VILLAS & DINING",
            "PERSONALIZED EXPERIENCES",
          ]}
        />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <div className="text-cream">
              <Wordmark />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              {BUSINESS.name} — personalised concierge support for accommodation, transportation,
              dining, activities and celebrations across the {BUSINESS.location}.
            </p>
            <p className="mt-4 label-caps text-aqua">{BUSINESS.location}</p>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-sun">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Concierge Services", href: "/services" },
                { label: "Plan Your Stay", href: "/plan-your-stay" },
                { label: "Contact", href: "/contact" },
                { label: "About", href: "/about" },
                { label: "Demo Insights", href: "/demo-insights" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/75 transition-colors hover:text-coral">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-sun">Services</h3>
            <ul className="space-y-3 text-sm text-cream/75">
              <li>
                <Link href="/services#villas" className="hover:text-coral">
                  Villas &amp; Stays
                </Link>
              </li>
              <li>
                <Link href="/services#boats" className="hover:text-coral">
                  Private Boat Charters
                </Link>
              </li>
              <li>
                <Link href="/services#dining" className="hover:text-coral">
                  Dining &amp; Celebrations
                </Link>
              </li>
              <li>
                <Link href="/services#more" className="hover:text-coral">
                  Airport Transportation
                </Link>
              </li>
              <li>
                <Link href="/services#more" className="hover:text-coral">
                  Itinerary Planning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-sun">Reach Cladly</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`https://wa.me/${BUSINESS.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/75 hover:text-coral"
                >
                  <MessageCircle size={15} /> WhatsApp {BUSINESS.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/75 hover:text-coral"
                >
                  <AtSign size={15} /> {BUSINESS.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/75 hover:text-coral"
                >
                  <Globe size={15} /> tropicaldrifttravel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/20 pt-6">
          <div className="flex flex-col gap-3 text-xs text-cream/55 md:flex-row md:items-center md:justify-between">
            <p>
              <strong className="text-sun">Personalized Website Concept Preview</strong> — this is a
              design concept, not the official {BUSINESS.shortName} website. Service details are
              confirmed personally by the concierge.
            </p>
            <p>
              <a
                href="https://infycrestsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream"
              >
                {BUSINESS.conceptCredit}
              </a>{" "}
              · © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
