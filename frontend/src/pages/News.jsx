import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import { useLang, API } from "@/i18n";
import AlertTicker from "@/components/AlertTicker";
import { Reveal, MaskedLine } from "@/components/Reveal";

const News = () => {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    axios.get(`${API}/news`).then((r) => setNews(r.data)).catch(() => {});
  }, []);

  const cats = ["all", ...Object.keys(t.news.cats)];
  const filtered = filter === "all" ? news : news.filter((n) => n.category === filter);

  return (
    <div data-testid="news-page">
      <AlertTicker />
      <section className="bg-civic-deep py-20 sm:py-28 grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaskedLine delay={0.1}>
            <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
              <Newspaper size={14} /> {t.news.kicker}
            </span>
          </MaskedLine>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            <MaskedLine delay={0.25}>{t.news.title}</MaskedLine>
          </h1>
          <MaskedLine delay={0.4}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{t.news.sub}</p>
          </MaskedLine>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div data-testid="news-filters" className="flex flex-wrap gap-2 mb-12">
              {cats.map((c) => (
                <button
                  key={c}
                  data-testid={`news-filter-${c}`}
                  onClick={() => setFilter(c)}
                  className={`px-5 h-11 rounded-md text-sm font-bold transition-colors ${filter === c ? "bg-civic-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-civic-amber"}`}
                >
                  {c === "all" ? t.news.all : t.news.cats[c]}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((n, i) => (
              <Reveal key={n.nid} delay={i * 0.06}>
                <article data-testid={`news-item-${n.nid}`} className={`h-full bg-white border rounded-lg p-7 sm:p-8 ${n.urgent ? "border-red-300 relative overflow-hidden tracing-beam" : "border-slate-200"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest ${n.urgent ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                      {t.news.cats[n.category] || n.category}
                    </span>
                    <span className="text-xs font-mono-civic text-slate-400" dir="ltr">{n.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-civic-navy leading-snug">{n.title[lang]}</h2>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">{n.summary[lang]}</p>
                  <AnimatePresence>
                    {open === n.nid && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="mt-4 pt-4 border-t border-slate-100 text-sm leading-relaxed text-slate-600">{n.body[lang]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    data-testid={`news-toggle-${n.nid}`}
                    onClick={() => setOpen(open === n.nid ? null : n.nid)}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-civic-amberdark hover:text-civic-navy transition-colors"
                  >
                    {open === n.nid ? t.news.close : t.news.read} {open === n.nid ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
