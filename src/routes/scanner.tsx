import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radar } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { scanUrl } from "@/lib/scan.functions";
import type { ScanResult } from "@/lib/engine";
import { saveScan } from "@/lib/history";
import { useT } from "@/lib/i18n";
import { ScanResultCard } from "@/components/ScanResultCard";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [
    { title: "URL Scanner — PhishGuard AI" },
    { name: "description", content: "Paste any link and get an instant phishing risk score." },
    { property: "og:title", content: "URL Scanner — PhishGuard AI" },
    { property: "og:description", content: "Paste any link and get an instant phishing risk score." },
  ] }),
  component: Scanner,
});

const DEMOS = ["https://www.sbi.co.in", "http://sbi-kyc-update.xyz/login/verify", "http://paytrn-reward.top/free-prize", "bit.ly/3xYzAbc", "http://192.168.4.20/hdfc/otp"];

function Scanner() {
  const { t } = useT();
  const scan = useServerFn(scanUrl);
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(-1);
  const [res, setRes] = useState<ScanResult | null>(null);
  const [err, setErr] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  async function run(u = url) {
    if (!u.trim()) return;
    setUrl(u); setErr(""); setRes(null);
    for (let i = 0; i < 4; i++) { setStep(i); await new Promise((r) => setTimeout(r, 350)); }
    try {
      const r = await scan({ data: { url: u, privacy } });
      setRes(r); if (!privacy) saveScan(r);
    } catch (e) { setErr((e as Error).message); }
    setStep(-1);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold md:text-4xl"><span className="text-gradient">{t("scanner")}</span></h1>
      <form onSubmit={(e) => { e.preventDefault(); run(); }} className="glass mt-6 flex flex-col gap-3 rounded-xl p-3 sm:flex-row">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("placeholder")}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono outline-none" />
        <button disabled={step >= 0} className="btn-neon rounded-lg px-6 py-3 font-semibold disabled:opacity-60">{t("scan")}</button>
      </form>
      <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} /> {t("privacy")}
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">{t("demo")}:</span>
        {DEMOS.map((d) => (
          <button key={d} onClick={() => run(d)} className="glass rounded-full px-3 py-1 font-mono text-xs hover:text-primary">{d}</button>
        ))}
      </div>
      {step >= 0 && (
        <div className="glass mt-8 flex items-center gap-6 rounded-xl p-6">
          <div className="relative h-20 w-20 shrink-0 rounded-full border border-primary/40">
            <div className="radar absolute inset-0 rounded-full" style={{ background: "conic-gradient(var(--primary), transparent 30%)" }} />
            <Radar className="absolute inset-0 m-auto text-foreground" />
          </div>
          <ul className="space-y-1 text-sm">
            {steps.map((s, i) => <li key={s} className={i <= step ? "text-primary" : "text-muted-foreground"}>{i < step ? "✓" : i === step ? "›" : "·"} {s}</li>)}
          </ul>
        </div>
      )}
      {err && <p className="mt-6 text-danger">{err}</p>}
      {res && <ScanResultCard r={res} />}
    </div>
  );
}
