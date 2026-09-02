import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import { useLang, API } from "@/i18n";

const AlertTicker = () => {
  const { lang, t } = useLang();
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API}/announcements`).then((r) => setItems(r.data)).catch(() => {});
  }, []);

  if (!items.length) return null;
  const strip = items.map((a) => a.text[lang]).join("   ·   ");

  return (
    <div data-testid="alert-ticker" className="bg-red-600 text-white overflow-hidden marquee-paused">
      <div className="flex items-center">
        <span className="shrink-0 z-10 bg-red-700 px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <AlertTriangle size={14} /> {t.tickerLabel}
        </span>
        <div dir="ltr" className="overflow-hidden flex-1">
          <div className="flex w-max animate-marquee-fast whitespace-nowrap py-2 text-sm font-semibold">
            <span className="pe-12">{strip}</span>
            <span className="pe-12" aria-hidden="true">{strip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTicker;
