import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Shield, X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

const links = [
  ["/", "home"], ["/scanner", "scanner"], ["/dashboard", "dashboard"],
  ["/history", "history"], ["/learn", "learn"], ["/about", "about"],
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10" />
      <header className="glass sticky top-0 z-20 border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Shield className="h-6 w-6 text-primary" /> <span className="text-gradient">PhishGuard AI</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {links.map(([to, k]) => (
              <Link key={to} to={to} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>{t(k)}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}
              className="glass rounded-lg px-2 py-2 text-sm">
              <option value="en">EN</option><option value="te">తె</option><option value="hi">हि</option>
            </select>
            <button aria-label="Menu" className="p-2 md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="rise flex flex-col px-4 pb-3 md:hidden">
            {links.map(([to, k]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-muted-foreground">{t(k)}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
