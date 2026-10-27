import { useEffect, useState } from "react";
import type { ScanResult } from "./engine";

const KEY = "phishguard-history";
export function loadHistory(): ScanResult[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveScan(s: ScanResult) {
  const h = [s, ...loadHistory()].slice(0, 200);
  localStorage.setItem(KEY, JSON.stringify(h));
  window.dispatchEvent(new Event("history"));
}
export function setHistory(h: ScanResult[]) {
  localStorage.setItem(KEY, JSON.stringify(h));
  window.dispatchEvent(new Event("history"));
}
export function useHistory() {
  const [h, setH] = useState<ScanResult[]>([]);
  useEffect(() => {
    const f = () => setH(loadHistory());
    f(); window.addEventListener("history", f);
    return () => window.removeEventListener("history", f);
  }, []);
  return h;
}
