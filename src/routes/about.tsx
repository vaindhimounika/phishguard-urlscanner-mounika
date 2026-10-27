import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — PhishGuard AI" },
    { name: "description", content: "Why PhishGuard AI exists and how it detects phishing." },
    { property: "og:title", content: "About — PhishGuard AI" },
    { property: "og:description", content: "Why PhishGuard AI exists and how it detects phishing." },
  ] }),
  component: About,
});

function About() {
  const { t } = useT();
  return (
    <div className="glass rise mx-auto max-w-2xl rounded-xl p-8">
      <h1 className="text-3xl font-bold"><span className="text-gradient">{t("about")}</span></h1>
      <p className="mt-4 text-muted-foreground">{t("aboutText")}</p>
      <p className="mt-4 text-sm text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}
