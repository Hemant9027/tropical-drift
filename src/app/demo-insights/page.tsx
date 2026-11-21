import type { Metadata } from "next";
import InsightsView from "@/components/insights/InsightsView";

export const metadata: Metadata = {
  title: "Demo Insights — Browser-Local Interaction Preview",
  description:
    "A demonstration analytics dashboard showing how key interactions — planner starts, completions, WhatsApp clicks and service enquiries — could be tracked locally.",
  robots: { index: false, follow: false },
};

export default function DemoInsightsPage() {
  return <InsightsView />;
}
