import { createFileRoute } from "@tanstack/react-router";
import { useHistory } from "@/lib/history";
import { useT } from "@/lib/i18n";
import { verdictColor } from "@/components/ScanResultCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — PhishGuard AI" },
    { name: "description", content: "Your phishing scan statistics at a glance." },
    { property: "og:title", content: "Dashboard — PhishGuard AI" },
    { property: "og:description", content: "Your phishing scan statistics at a glance." },
  ] }),
  component: Dash,
});

function Dash() {
  const { t } = useT();
  const h = useHistory();
  const v = (["SAFE", "RISKY", "DANGEROUS"] as const).map((k) => ({ k, n: h.filter((x) => x.verdict === k).length }));
  const avg = h.length ? Math.round(h.reduce((a, b) => a + b.score, 0) / h.length) : 0;
  return (
    <div>
      <h1 className="text-3xl font-bold"><span className="text-gradient">{t("dashboard")}</span></h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("total")} value={h.length} color="var(--primary)" />
        {v.map(({ k, n }) => <Stat key={k} label={t(k)} value={n} color={verdictColor[k]} />)}
      </div>
      <div className="glass mt-6 rounded-xl p-6">
        <div className="mb-3 text-sm text-muted-foreground">{t("riskScore")} · avg {avg}</div>
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          {v.map(({ k, n }) => <div key={k} style={{ width: `${h.length ? (n / h.length) * 100 : 0}%`, background: verdictColor[k], transition: "width 1s" }} />)}
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rise rounded-xl p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-4xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
