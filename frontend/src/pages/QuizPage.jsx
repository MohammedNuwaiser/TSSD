import { ShieldCheck } from "lucide-react";
import { useLang } from "@/i18n";
import AlertTicker from "@/components/AlertTicker";
import QuizWidget from "@/components/QuizWidget";
import { MaskedLine } from "@/components/Reveal";

const QuizPage = () => {
  const { t } = useLang();
  return (
    <div data-testid="quiz-page">
      <AlertTicker />
      <section className="relative bg-civic-navy py-20 sm:py-28 grain-overlay overflow-hidden">
        <div className="absolute -bottom-24 -start-24 w-96 h-96 rounded-full bg-civic-amber/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MaskedLine delay={0.1}>
              <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
                <ShieldCheck size={14} /> {t.quiz.kicker}
              </span>
            </MaskedLine>
            <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              <MaskedLine delay={0.25}>{t.quiz.title}</MaskedLine>
            </h1>
            <MaskedLine delay={0.4}>
              <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">{t.quiz.sub}</p>
            </MaskedLine>
          </div>
          <QuizWidget />
        </div>
      </section>
    </div>
  );
};

export default QuizPage;
