import { Link } from "react-router-dom";
import { MapPin, Clock, PhoneCall } from "lucide-react";
import { useLang } from "@/i18n";
import { Emblem } from "@/components/Header";

const Footer = () => {
  const { t } = useLang();
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/programs", label: t.nav.programs },
    { to: "/quiz", label: t.nav.quiz },
    { to: "/news", label: t.nav.news },
    { to: "/resources", label: t.nav.resources },
    { to: "/contact", label: t.nav.contact },
  ];
  return (
    <footer data-testid="site-footer" className="bg-civic-deep text-slate-300">
      <div className="road-stripe h-1.5 w-full" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Emblem />
              <span className="leading-tight">
                <span className="block font-display font-extrabold text-white text-lg">{t.brand.short}</span>
                <span className="block text-xs text-slate-400 uppercase tracking-widest">{t.brand.name}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{t.footer.about}</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base mb-5 uppercase tracking-widest">{t.footer.quick}</h3>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.to}>
                  <Link data-testid={`footer-link-${l.to === "/" ? "home" : l.to.slice(1)}`} to={l.to} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base mb-5 uppercase tracking-widest">{t.contact.emergencyTitle}</h3>
            <ul className="space-y-3">
              {t.contact.hotlines.map((h) => (
                <li key={h.number} className="flex items-center gap-3">
                  <PhoneCall size={14} className="text-amber-400 shrink-0" />
                  <span className="text-sm text-slate-400">{h.label}</span>
                  <a data-testid={`footer-hotline-${h.number.replace(/\s/g, "")}`} href={`tel:${h.number.replace(/\s/g, "")}`} className="font-mono-civic text-sm font-semibold text-amber-400 hover:text-amber-300" dir="ltr">{h.number}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base mb-5 uppercase tracking-widest">{t.footer.contact}</h3>
            <p className="flex items-start gap-3 text-sm text-slate-400 mb-4">
              <MapPin size={14} className="text-amber-400 mt-1 shrink-0" /> {t.contact.address}
            </p>
            <p className="flex items-start gap-3 text-sm text-slate-400">
              <Clock size={14} className="text-amber-400 mt-1 shrink-0" /> {t.contact.hours}
            </p>
            <Link to="/admin" data-testid="footer-admin-link" className="inline-block mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors">
              {t.footer.admin} →
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{t.footer.rights}</p>
          <p className="text-xs font-mono-civic text-slate-600 uppercase tracking-widest">WCAG 2.1 AA · EN / AR</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
