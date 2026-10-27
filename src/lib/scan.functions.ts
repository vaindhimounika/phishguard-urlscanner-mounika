import { createServerFn } from "@tanstack/react-start";
import { analyze, type ScanResult } from "./engine";

const SHEET_ID = "1wKcn2ae11bfM_6qe7gdMRKv_8nXg2CrPELoDHz8B7aU";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

async function appendToSheet(r: ScanResult) {
  const lov = process.env["LOVABLE_API_KEY"];
  const key = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lov || !key) { console.error("Google Sheets keys missing"); return false; }
  const row = [r.id, r.createdAt, r.url, r.domain, r.score, r.verdict, r.findings.map((f) => f.detail).join(" | ") || "None"];
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${GATEWAY}/spreadsheets/${SHEET_ID}/values/Scans!A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] }),
      });
      if (res.ok) return true;
      console.error(`Sheets append failed [${res.status}]: ${await res.text()}`);
      if (res.status < 500 && res.status !== 429) return false;
    } catch (e) { console.error("Sheets append error", e); }
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

export const scanUrl = createServerFn({ method: "POST" })
  .inputValidator((d: { url: string; privacy?: boolean }) => {
    if (typeof d?.url !== "string" || d.url.length < 3 || d.url.length > 2048) throw new Error("Invalid URL");
    return { url: d.url, privacy: !!d.privacy };
  })
  .handler(async ({ data }) => {
    let r: ScanResult;
    try { r = analyze(data.url); } catch { throw new Error("Could not parse that URL"); }
    const savedToSheet = data.privacy ? false : await appendToSheet(r);
    return { ...r, savedToSheet };
  });
