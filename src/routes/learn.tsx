import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [
    { title: "Learn to Spot Phishing — PhishGuard AI" },
    { name: "description", content: "Simple tips to recognise fake bank, UPI and KYC links." },
    { property: "og:title", content: "Learn to Spot Phishing — PhishGuard AI" },
    { property: "og:description", content: "Simple tips to recognise fake bank, UPI and KYC links." },
  ] }),
  component: Learn,
});

function Learn() {
  const { t } = useT();
  return (
    <div>
      <h1 className="text-3xl font-bold"><span className="text-gradient">{t("learn")}</span></h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(["tip1", "tip2", "tip3", "tip4"] as const).map((k, i) => (
          <div key={k} className="glass rise rounded-xl p-6 transition-transform hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
            <Lightbulb className="text-primary" /><p className="mt-3">{t(k)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
