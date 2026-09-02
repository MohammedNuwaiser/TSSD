import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft, AlertTriangle, Info, Megaphone, ChevronRight, ChevronLeft, Siren } from "lucide-react";
import { useLang, API } from "@/i18n";
import { IMAGES } from "@/assets";
import AlertTicker from "@/components/AlertTicker";
import QuizWidget from "@/components/QuizWidget";
import { Reveal, MaskedLine, ChapterHeading } from "@/components/Reveal";

const Home = () => {
  const { t, lang, rtl } = useLang();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  useEffect(() => {
    axios.get(`${API}/announcements`).then((r) => setAnnouncements(r.data)).catch(() => {});
    axios.get(`${API}/news`).then((r) => setNews(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const Arrow = rtl ? ArrowLeft : ArrowRight;
  const Chevron = rtl ? ChevronLeft : ChevronRight;
  const programImages = [IMAGES.patrol, IMAGES.car, IMAGES.night, IMAGES.highway];

  return (
    <div data-testid="home-page">
      <AlertTicker />

      {/* HERO */}
      <section ref={heroRef} data-testid="hero-section" className="relative overflow-hidden bg-civic-deep grain-overlay">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0" aria-hidden="true">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-civic-deep/95 via-civic-deep/80 to-civic-deep/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-civic-deep via-transparent to-civic-deep/60" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <MaskedLine delay={0.1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">
              <Siren size={14} /> {t.hero.kicker}
            </span>
          </MaskedLine>
          <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white max-w-4xl">
            <MaskedLine delay={0.25}>{t.hero.line1}</MaskedLine>
            <MaskedLine delay={0.4}>
              <span className="text-civic-amber">{t.hero.line2}</span>
            </MaskedLine>
          </h1>
          <MaskedLine delay={0.6}>
            <p className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">{t.hero.sub}</p>
          </MaskedLine>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-wrap gap-4">
            <Link to="/quiz" data-testid="hero-quiz-cta" className="inline-flex items-center gap-2 px-8 h-13 py-3.5 rounded-md bg-civic-amber text-civic-navy font-extrabold text-sm sm:text-base hover:bg-amber-400 transition-all hover:-translate-y-0.5 shadow-[0_16px_40px_-12px_rgba(245,158,11,0.5)]">
              {t.hero.ctaQuiz} <Arrow size={18} />
            </Link>
            <Link to="/contact" data-testid="hero-report-cta" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md border-2 border-white/30 text-white font-bold text-sm sm:text-base hover:bg-white/10 hover:border-white/50 transition-all">
              {t.hero.ctaReport}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} data-testid="hero-metrics" className="mt-16 grid grid-cols-2 lg:grid-cols-4 border border-white/15 divide-x divide-white/15 rtl:divide-x-reverse backdrop-blur-sm bg-white/5">
            {t.hero.stats.map((s, i) => (
              <div key={i} className="px-5 py-5">
                <p className="font-mono-civic text-2xl sm:text-3xl font-semibold text-civic-amber" dir="ltr">{s.value}</p>
                <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-slate-300">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL MARQUEE */}
      <div data-testid="editorial-marquee" className="bg-civic-navy border-y border-amber-400/30 overflow-hidden marquee-paused py-4" dir="ltr">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[0, 1].map((n) => (
            <span key={n} aria-hidden={n === 1} className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-[0.3em] text-amber-400/80 pe-8">
              {t.marquee.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section data-testid="announcements-section" className="bg-slate-50 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChapterHeading kicker={t.announcements.kicker} title={t.announcements.title} sub={t.announcements.sub} />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {announcements.map((a, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <article data-testid={`announcement-card-${i}`} className={`relative h-full p-6 rounded-lg border bg-white overflow-hidden ${a.severity === "urgent" ? "border-red-300 tracing-beam" : "border-slate-200"}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 ${a.severity === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                      {a.severity === "urgent" ? <AlertTriangle size={12} /> : <Info size={12} />}
                      {a.severity === "urgent" ? (lang === "ar" ? "عاجل" : "Urgent") : (lang === "ar" ? "إشعار" : "Notice")}
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium">{a.text[lang]}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROGRAMS — CHAPTER 01 */}
      <section data-testid="programs-section" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <ChapterHeading kicker={t.programs.kicker} title={t.programs.title} sub={t.programs.sub} />
            <Reveal delay={0.2}>
              <Link to="/programs" data-testid="programs-cta" className="inline-flex items-center gap-2 text-sm font-bold text-civic-amberdark hover:text-civic-navy transition-colors uppercase tracking-widest">
                {t.programs.cta} <Chevron size={16} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.programs.items.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Link to="/programs" data-testid={`program-card-${i}`} className="group block h-full bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-civic-amber hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.3)] transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={programImages[i]} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-civic-deep/70 to-transparent" />
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded bg-civic-amber text-civic-navy text-[10px] font-extrabold uppercase tracking-widest">{p.tag}</span>
                  </div>
                  <div className="p-6">
                    <p className="font-mono-civic text-xs font-semibold text-civic-amberdark mb-2" dir="ltr">{p.stat}</p>
                    <h3 className="font-display text-lg font-bold text-civic-navy leading-snug group-hover:text-civic-amberdark transition-colors">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ — CHAPTER 02 (high-engagement mid-page placement) */}
      <section data-testid="quiz-section" className="relative bg-civic-navy py-20 sm:py-28 grain-overlay overflow-hidden">
        <div className="absolute -top-20 -end-20 w-96 h-96 rounded-full bg-civic-amber/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center mb-12">
            <ChapterHeading kicker={t.quiz.kicker} title={t.quiz.title} sub={t.quiz.sub} dark />
          </div>
          <Reveal delay={0.15}>
            <QuizWidget />
          </Reveal>
        </div>
      </section>

      {/* NEWS — CHAPTER 03 */}
      <section data-testid="news-section" className="bg-slate-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <ChapterHeading kicker={t.news.kicker} title={t.news.title} sub={t.news.sub} />
            <Reveal delay={0.2}>
              <Link to="/news" data-testid="news-cta" className="inline-flex items-center gap-2 text-sm font-bold text-civic-amberdark hover:text-civic-navy transition-colors uppercase tracking-widest">
                {t.nav.news} <Chevron size={16} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {news.map((n, i) => (
              <Reveal key={n.nid} delay={i * 0.08}>
                <Link to="/news" data-testid={`news-card-${i}`} className="group flex flex-col h-full bg-white border border-slate-200 rounded-lg p-7 hover:border-civic-amber hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest ${n.urgent ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                      {t.news.cats[n.category] || n.category}
                    </span>
                    <span className="text-xs font-mono-civic text-slate-400" dir="ltr">{n.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-civic-navy leading-snug group-hover:text-civic-amberdark transition-colors">{n.title[lang]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{n.summary[lang]}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-civic-amberdark">
                    {t.news.read} <Chevron size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY STRIP — CHAPTER 05 teaser */}
      <section data-testid="emergency-strip" className="relative bg-civic-deep py-20 grain-overlay overflow-hidden">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} viewport={{ once: true }} className="absolute inset-0" aria-hidden="true">
          <img src={IMAGES.car} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <ChapterHeading kicker={t.contact.kicker} title={t.contact.title} sub={t.contact.sub} dark />
          <Reveal delay={0.15} className="shrink-0">
            <div className="flex flex-col gap-3">
              {t.contact.hotlines.map((h) => (
                <a key={h.number} data-testid={`strip-hotline-${h.number.replace(/\s/g, "")}`} href={`tel:${h.number.replace(/\s/g, "")}`} className="flex items-center justify-between gap-8 px-6 py-4 rounded-md bg-white/5 border border-white/15 hover:border-amber-400/60 hover:bg-white/10 transition-all group">
                  <span className="text-sm font-semibold text-slate-300">{h.label}</span>
                  <span className="font-mono-civic text-xl font-bold text-civic-amber group-hover:text-amber-300" dir="ltr">{h.number}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <Link to="/contact" data-testid="strip-contact-cta" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-civic-amber text-civic-navy font-extrabold hover:bg-amber-400 transition-all hover:-translate-y-0.5">
              {t.contact.formTitle} <Arrow size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
