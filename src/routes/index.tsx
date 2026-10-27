import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Languages, Fingerprint } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PhishGuard AI — Phishing URL Detection" },
    { name: "description", content: "Detect phishing links, fake bank & UPI sites instantly. English, Telugu, Hindi." },
    { property: "og:title", content: "PhishGuard AI — Phishing URL Detection" },
    { property: "og:description", content: "Detect phishing links, fake bank & UPI sites instantly." },
  ] }),
  component: Index,
});

function Index() {
  const { t } = useT();
  const feats = [[Zap, "Instant heuristics"], [Fingerprint, "Brand impersonation"], [Languages, "EN · తె · हि"]] as const;
  return (
    <section className="grid items-center gap-10 py-10 md:grid-cols-2">
      <div className="rise">
        <h1 className="text-4xl font-bold leading-tight md:text-6xl"><span className="text-gradient">{t("heroTitle")}</span></h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("heroSub")}</p>
        <Link to="/scanner" className="btn-neon mt-8 inline-block rounded-xl px-7 py-4 font-semibold">{t("scanNow")}</Link>
        <div className="mt-10 flex flex-wrap gap-3">
          {feats.map(([I, l]) => <div key={l} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm"><I className="h-4 w-4 text-primary" />{l}</div>)}
        </div>
      </div>
      <div className="floaty relative mx-auto aspect-square w-64 md:w-96">
        <div className="absolute inset-0 rounded-full border border-primary/30" />
        <div className="absolute inset-8 rounded-full border border-primary/20" />
        <div className="radar absolute inset-0 rounded-full" style={{ background: "conic-gradient(color-mix(in oklab, var(--primary) 45%, transparent), transparent 25%)" }} />
        <ShieldCheck className="absolute inset-0 m-auto h-1/3 w-1/3 text-primary" style={{ filter: "drop-shadow(0 0 25px var(--primary))" }} />
      </div>
    </section>
  );
}
