export type Verdict = "SAFE" | "RISKY" | "DANGEROUS";
export type Finding = { key: string; weight: number; detail: string };
export type ScanResult = {
  id: string; url: string; domain: string; score: number; verdict: Verdict;
  findings: Finding[]; createdAt: string;
};

const BRANDS = ["sbi", "hdfc", "icici", "paytm", "phonepe", "google", "amazon", "microsoft", "irctc", "aadhaar", "uidai", "paypal", "apple"];
const OFFICIAL = ["sbi.co.in", "onlinesbi.sbi", "hdfcbank.com", "icicibank.com", "paytm.com", "phonepe.com", "google.com", "amazon.in", "amazon.com", "microsoft.com", "irctc.co.in", "uidai.gov.in", "paypal.com", "apple.com"];
const TLDS = ["xyz", "top", "tk", "ml", "ga", "cf", "gq", "click", "zip", "mov", "work", "link", "rest", "country", "buzz", "icu"];
const SHORT = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "ow.ly"];
const WORDS = ["login", "verify", "update", "secure", "account", "kyc", "bank", "otp", "reward", "free", "suspend", "confirm", "wallet", "refund", "prize"];

const deleet = (s: string) => s.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/5/g, "s").replace(/@/g, "a").replace(/rn/g, "m");

export function analyze(raw: string): ScanResult {
  let input = raw.trim();
  if (!/^[a-z]+:\/\//i.test(input)) input = "http://" + input;
  const u = new URL(input);
  const host = u.hostname.toLowerCase();
  const f: Finding[] = [];
  const add = (key: string, weight: number, detail: string) => f.push({ key, weight, detail });
  const isOfficial = OFFICIAL.some((d) => host === d || host.endsWith("." + d));

  if (u.protocol !== "https:") add("noHttps", 15, "Connection is not encrypted (HTTP).");
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) add("ip", 25, "Uses a raw IP address instead of a domain.");
  if (input.length > 90) add("long", 10, `URL is ${input.length} characters long.`);
  if (host.split(".").length > 4) add("subdomains", 12, "Excessive number of subdomains.");
  const tld = host.split(".").pop() || "";
  if (TLDS.includes(tld)) add("tld", 15, `Suspicious top-level domain .${tld}`);
  if (SHORT.includes(host)) add("shortener", 15, "URL shortener hides the real destination.");
  if (host.startsWith("xn--") || host.includes(".xn--") || /[^\x00-\x7f]/.test(raw)) add("homograph", 25, "Punycode / look-alike characters detected.");
  if (u.username || raw.includes("@")) add("at", 20, "Contains '@' which can hide the real host.");
  if ((host.match(/-/g) || []).length >= 2) add("hyphens", 8, "Many hyphens in domain name.");
  const kw = WORDS.filter((w) => (host + u.pathname).toLowerCase().includes(w));
  if (kw.length) add("keywords", Math.min(25, kw.length * 7), `Phishing keywords: ${kw.join(", ")}`);
  if (!isOfficial) {
    const norm = deleet(host);
    const b = BRANDS.find((x) => norm.includes(x));
    if (b) add("brand", 30, `Impersonates "${b.toUpperCase()}" on a non-official domain.`);
  }
  if (/[?&](url|redirect|next|goto)=https?/i.test(u.search)) add("redirect", 12, "Contains an open-redirect parameter.");

  let score = Math.min(100, f.reduce((a, b) => a + b.weight, 0));
  if (isOfficial) score = Math.min(score, 10);
  const verdict: Verdict = score >= 60 ? "DANGEROUS" : score >= 25 ? "RISKY" : "SAFE";
  return { id: crypto.randomUUID(), url: raw.trim(), domain: host, score, verdict, findings: f, createdAt: new Date().toISOString() };
}
