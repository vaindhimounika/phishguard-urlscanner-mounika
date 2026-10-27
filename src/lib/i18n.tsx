import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import te from "@/locales/te.json";
import hi from "@/locales/hi.json";

const dicts = { en, te, hi } as const;
export type Lang = keyof typeof dicts;
type Key = keyof typeof en;
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en", setLang: () => {}, t: (k) => en[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setL] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    if (s && s in dicts) setL(s);
  }, []);
  const setLang = (l: Lang) => { setL(l); localStorage.setItem("lang", l); };
  const t = (k: Key) => (dicts[lang] as Record<string, string>)[k] ?? en[k];
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
