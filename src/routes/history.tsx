import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { setHistory, useHistory } from "@/lib/history";
import { useT } from "@/lib/i18n";
import { verdictColor } from "@/components/ScanResultCard";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [
    { title: "Scan History — PhishGuard AI" },
    { name: "description", content: "Review every link you have scanned." },
    { property: "og:title", content: "Scan History — PhishGuard AI" },
    { property: "og:description", content: "Review every link you have scanned." },
  ] }),
  component: Hist,
});

function Hist() {
  const { t } = useT();
  const h = useHistory();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold"><span className="text-gradient">{t("history")}</span></h1>
        {h.length > 0 && <button onClick={() => setHistory([])} className="glass rounded-lg px-3 py-2 text-sm">{t("clear")}</button>}
      </div>
      {h.length === 0 && <p className="mt-6 text-muted-foreground">{t("empty")}</p>}
      <ul className="mt-6 space-y-3">
        {h.map((s) => (
          <li key={s.id} className="glass rise flex items-center gap-4 rounded-xl p-4">
            <div className="w-12 text-center text-xl font-bold" style={{ color: verdictColor[s.verdict] }}>{s.score}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-sm">{s.url}</div>
              <div className="text-xs text-muted-foreground">{t(s.verdict)} · {new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <button aria-label="Delete" onClick={() => setHistory(h.filter((x) => x.id !== s.id))} className="p-2 text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
