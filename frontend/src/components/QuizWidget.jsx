import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLang, API } from "@/i18n";

const QuizWidget = ({ compact = false }) => {
  const { t, lang, rtl } = useLang();
  const [questions, setQuestions] = useState(null);
  const [stage, setStage] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.get(`${API}/quiz/questions`).then((r) => setQuestions(r.data)).catch(() => setQuestions([]));
  }, []);

  const start = () => {
    setStage("playing");
    setIdx(0);
    setSelected(null);
    setScore(0);
  };

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[idx].correct_index) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setStage("done");
      axios.post(`${API}/quiz/results`, { score, total: questions.length, lang }).catch(() => {});
    } else {
      setIdx((v) => v + 1);
      setSelected(null);
    }
  };

  const NextIcon = rtl ? ArrowLeft : ArrowRight;

  return (
    <div data-testid="quiz-widget" className="relative bg-white border border-slate-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] overflow-hidden">
      <div className="relative h-1 bg-slate-100 tracing-beam overflow-hidden" aria-hidden="true" />
      {questions === null ? (
        <div className="p-12 text-center text-slate-500 font-medium">{t.quiz.loading}</div>
      ) : (
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="p-8 sm:p-12 text-center">
              <ShieldCheck size={44} className="mx-auto text-civic-amber mb-5" strokeWidth={1.5} />
              <p className="font-mono-civic text-sm font-semibold text-slate-500 mb-8" dir="ltr">{questions.length} × MCQ</p>
              <button
                data-testid="quiz-start-button"
                onClick={start}
                className="inline-flex items-center gap-2 px-8 h-12 rounded-md bg-civic-navy text-white font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5"
              >
                {t.quiz.start} <NextIcon size={18} />
              </button>
            </motion.div>
          )}

          {stage === "playing" && (
            <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: rtl ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: rtl ? 40 : -40 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-5 gap-4">
                <span className="text-xs font-mono-civic font-semibold uppercase tracking-widest text-civic-amberdark">
                  {t.quiz.question} {idx + 1} {t.quiz.of} {questions.length}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{questions[idx].topic[lang]}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mb-7 overflow-hidden" role="progressbar" aria-valuenow={idx + 1} aria-valuemax={questions.length}>
                <motion.div data-testid="quiz-progress" className="h-full bg-civic-amber rounded-full" initial={false} animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} />
              </div>
              <h3 data-testid="quiz-question-text" className="font-display text-lg sm:text-xl font-bold text-civic-navy mb-6 leading-snug">
                {questions[idx].question[lang]}
              </h3>
              <div className="grid gap-3">
                {questions[idx].options.map((opt, i) => {
                  const isCorrect = i === questions[idx].correct_index;
                  const isPicked = selected === i;
                  let cls = "border-slate-200 hover:border-civic-amber hover:bg-amber-50 text-slate-700";
                  if (selected !== null) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isPicked) cls = "border-red-400 bg-red-50 text-red-900";
                    else cls = "border-slate-200 text-slate-400";
                  }
                  return (
                    <motion.button
                      key={i}
                      data-testid={`quiz-option-${i}`}
                      onClick={() => choose(i)}
                      disabled={selected !== null}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className={`w-full min-h-[44px] text-start px-5 py-3.5 rounded-md border-2 font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center justify-between gap-3 ${cls}`}
                    >
                      <span>{opt[lang]}</span>
                      {selected !== null && isCorrect && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
                      {selected !== null && isPicked && !isCorrect && <XCircle size={20} className="text-red-500 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {selected !== null && (
                  <motion.div data-testid="quiz-explanation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                    <div className={`mt-5 p-5 rounded-md border-s-4 ${selected === questions[idx].correct_index ? "border-emerald-500 bg-emerald-50" : "border-red-400 bg-red-50"}`}>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${selected === questions[idx].correct_index ? "text-emerald-700" : "text-red-700"}`}>
                        {selected === questions[idx].correct_index ? t.quiz.correct : t.quiz.wrong} — {t.quiz.explanation}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">{questions[idx].explanation[lang]}</p>
                    </div>
                    <button
                      data-testid="quiz-next-button"
                      onClick={next}
                      className="mt-5 inline-flex items-center gap-2 px-7 h-11 rounded-md bg-civic-navy text-white font-bold hover:bg-slate-800 transition-colors"
                    >
                      {idx + 1 >= questions.length ? t.quiz.finish : t.quiz.next} <NextIcon size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="p-8 sm:p-12 text-center">
              <p className="text-xs font-mono-civic font-semibold uppercase tracking-[0.25em] text-civic-amberdark mb-4">{t.quiz.scoreTitle}</p>
              <motion.p data-testid="quiz-score" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }} className="font-display text-6xl sm:text-7xl font-black text-civic-navy tracking-tight" dir="ltr">
                {Math.round((score / questions.length) * 100)}%
              </motion.p>
              <p className="mt-2 text-sm font-semibold text-slate-500" dir="ltr">{score} / {questions.length}</p>
              <p className="mt-5 text-slate-600 max-w-md mx-auto leading-relaxed">
                {score / questions.length >= 0.8 ? t.quiz.excellent : score / questions.length >= 0.5 ? t.quiz.good : t.quiz.poor}
              </p>
              {score / questions.length >= 0.8 && (
                <motion.div data-testid="quiz-badge" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-7 mx-auto max-w-sm rounded-lg border-2 border-civic-amber bg-amber-50 p-6">
                  <Award size={36} className="mx-auto text-civic-amberdark mb-3" />
                  <p className="font-display font-extrabold text-civic-navy">{t.quiz.badge}</p>
                  <p className="text-xs text-slate-500 mt-1">{t.quiz.badgeNote}</p>
                </motion.div>
              )}
              <button
                data-testid="quiz-restart-button"
                onClick={start}
                className="mt-8 inline-flex items-center gap-2 px-7 h-11 rounded-md border-2 border-civic-navy text-civic-navy font-bold hover:bg-civic-navy hover:text-white transition-colors"
              >
                <RotateCcw size={16} /> {t.quiz.retry}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default QuizWidget;
