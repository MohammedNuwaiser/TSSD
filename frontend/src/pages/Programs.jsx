import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { useLang } from "@/i18n";
import { IMAGES } from "@/assets";
import AlertTicker from "@/components/AlertTicker";
import { Reveal, MaskedLine, ChapterHeading } from "@/components/Reveal";

const Programs = () => {
  const { t } = useLang();
  const programImages = [IMAGES.patrol, IMAGES.car, IMAGES.night, IMAGES.highway];

  return (
    <div data-testid="programs-page">
      <AlertTicker />
      <section className="relative bg-civic-deep py-24 sm:py-32 grain-overlay overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={IMAGES.patrol} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-civic-deep via-civic-deep/85 to-civic-deep/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaskedLine delay={0.1}>
            <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
              <Megaphone size={14} /> {t.programs.kicker}
            </span>
          </MaskedLine>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            <MaskedLine delay={0.25}>{t.programs.title}</MaskedLine>
          </h1>
          <MaskedLine delay={0.4}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{t.programs.sub}</p>
          </MaskedLine>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10">
          {t.programs.items.map((p, i) => (
            <Reveal key={i} delay={0.05}>
              <article data-testid={`program-detail-${i}`} className="group grid md:grid-cols-12 bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-civic-amber transition-colors duration-300">
                <div className={`relative md:col-span-5 h-64 md:h-auto overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <img src={programImages[i]} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-civic-deep/60 to-transparent" />
                  <span className="absolute top-4 start-4 px-3 py-1.5 rounded bg-civic-amber text-civic-navy text-[11px] font-extrabold uppercase tracking-widest">{p.tag}</span>
                </div>
                <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                  <p className="font-mono-civic text-sm font-semibold text-civic-amberdark mb-3" dir="ltr">{String(i + 1).padStart(2, "0")} — {p.stat}</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-civic-navy tracking-tight">{p.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Programs;
