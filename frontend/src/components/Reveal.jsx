import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 36 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const ChapterHeading = ({ chapter, kicker, title, sub, dark = false }) => (
  <div className="max-w-3xl">
    <Reveal>
      <p className={`flex items-center gap-3 text-xs font-mono-civic font-semibold uppercase tracking-[0.25em] mb-4 ${dark ? "text-amber-400" : "text-civic-amberdark"}`}>
        <span className={`inline-block w-10 h-px ${dark ? "bg-amber-400" : "bg-civic-amberdark"}`} aria-hidden="true" />
        {kicker}
      </p>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${dark ? "text-white" : "text-civic-navy"}`}>
        {title}
      </h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.16}>
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{sub}</p>
      </Reveal>
    )}
  </div>
);
