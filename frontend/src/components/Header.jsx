import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, PhoneCall, Languages } from "lucide-react";
import { useLang } from "@/i18n";

export const Emblem = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 2 6 8v14c0 11 7.6 20.4 18 24 10.4-3.6 18-13 18-24V8L24 2z" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
    <path d="M24 12v24" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
    <path d="M14 18c3-2 6.5-3 10-3s7 1 10 3" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Header = () => {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/programs", label: t.nav.programs },
    { to: "/quiz", label: t.nav.quiz },
    { to: "/news", label: t.nav.news },
    { to: "/resources", label: t.nav.resources },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header data-testid="site-header" className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <Link to="/" data-testid="brand-logo-link" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
            <Emblem />
            <span className="leading-tight">
              <span className="block font-display font-extrabold text-civic-navy tracking-tight text-base sm:text-lg">{t.brand.short}</span>
              <span className="block text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-widest">{t.brand.name}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-link-${l.to === "/" ? "home" : l.to.slice(1)}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    isActive ? "text-civic-navy bg-amber-400/20" : "text-slate-600 hover:text-civic-navy hover:bg-slate-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:999"
              data-testid="header-hotline-button"
              className="hidden md:inline-flex items-center gap-2 px-4 h-11 rounded-md bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <PhoneCall size={16} /> {t.hotline}
            </a>
            <button
              data-testid="language-switch-button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-md border border-slate-300 text-sm font-bold text-civic-navy hover:bg-slate-100 transition-colors"
            >
              <Languages size={16} /> {t.langSwitch}
            </button>
            <button
              data-testid="mobile-menu-toggle"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-300 text-civic-navy"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-slate-200 bg-white" aria-label="Mobile">
          <div className="px-4 py-3 flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`mobile-nav-link-${l.to === "/" ? "home" : l.to.slice(1)}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-md text-base font-semibold ${isActive ? "text-civic-navy bg-amber-400/20" : "text-slate-600"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a href="tel:999" data-testid="mobile-hotline-button" className="mt-2 inline-flex items-center justify-center gap-2 px-4 h-11 rounded-md bg-red-600 text-white text-sm font-bold">
              <PhoneCall size={16} /> {t.hotline}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
