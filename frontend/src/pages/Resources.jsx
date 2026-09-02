import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Download, FileText } from "lucide-react";
import { useLang, API } from "@/i18n";
import { IMAGES } from "@/assets";
import AlertTicker from "@/components/AlertTicker";
import { Reveal, MaskedLine } from "@/components/Reveal";

const Resources = () => {
  const { t, lang } = useLang();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get(`${API}/resources`).then((r) => setResources(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="resources-page">
      <AlertTicker />
      <section className="relative bg-civic-deep py-20 sm:py-28 grain-overlay overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={IMAGES.highway} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-civic-deep via-civic-deep/85 to-civic-deep/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaskedLine delay={0.1}>
            <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
              <BookOpen size={14} /> {t.resources.kicker}
            </span>
          </MaskedLine>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            <MaskedLine delay={0.25}>{t.resources.title}</MaskedLine>
          </h1>
          <MaskedLine delay={0.4}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{t.resources.sub}</p>
          </MaskedLine>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => (
            <Reveal key={r.rid} delay={i * 0.06}>
              <article data-testid={`resource-card-${r.rid}`} className="group flex flex-col h-full bg-white border border-slate-200 rounded-lg p-7 hover:border-civic-amber hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-civic-navy text-civic-amber">
                    <FileText size={22} />
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest">{r.category[lang]}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-civic-navy leading-snug">{r.title[lang]}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-1">{r.description[lang]}</p>
                <p className="mt-4 text-xs font-mono-civic text-slate-400" dir="ltr">
                  {t.resources.updated}: {r.updated} · {r.pages} {t.resources.pages}
                </p>
                <a
                  data-testid={`resource-download-${r.rid}`}
                  href={`${API}/resources/${r.rid}/download`}
                  className="mt-6 inline-flex items-center justify-center gap-2 px-5 h-11 rounded-md bg-civic-navy text-white text-sm font-bold hover:bg-civic-amberdark transition-colors"
                >
                  <Download size={16} /> {t.resources.download}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resources;
