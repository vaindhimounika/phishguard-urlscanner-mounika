import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ScanResult } from "@/lib/engine";
import { useT } from "@/lib/i18n";

export const verdictColor = { SAFE: "var(--safe)", RISKY: "var(--risky)", DANGEROUS: "var(--danger)" } as const;

export function ScanResultCard({ r }: { r: ScanResult }) {
  const { t } = useT();
  const c = verdictColor[r.verdict];
  const Icon = r.verdict === "SAFE" ? ShieldCheck : r.verdict === "RISKY" ? AlertTriangle : ShieldAlert;
  const circ = 2 * Math.PI * 52;
  return (
    <div className="glass rise mt-8 grid gap-6 rounded-xl p-6 md:grid-cols-[200px_1fr]">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - r.score / 100)}
            style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 8px ${c})` }} />
        </svg>
        <div className="-mt-28 mb-14 text-center">
          <div className="text-4xl font-bold">{r.score}</div>
          <div className="text-xs text-muted-foreground">{t("riskScore")}</div>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-2xl font-bold" style={{ color: c }}>
          <Icon /> {t(r.verdict)}
        </div>
        <p className="mt-1 break-all font-mono text-sm text-muted-foreground">{r.domain}</p>
        <h3 className="mt-4 font-semibold">{t("threats")}</h3>
        <ul className="mt-2 space-y-2">
          {r.findings.length === 0 && <li className="text-muted-foreground">{t("none")}</li>}
          {r.findings.map((f, i) => (
            <li key={f.key} className="rise glass flex justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ animationDelay: `${i * 80}ms` }}>
              <span>{f.detail}</span><span className="font-mono" style={{ color: c }}>+{f.weight}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
