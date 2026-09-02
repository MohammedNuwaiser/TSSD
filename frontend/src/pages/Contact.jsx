import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Clock, PhoneCall, Send } from "lucide-react";
import { useLang, API } from "@/i18n";
import AlertTicker from "@/components/AlertTicker";
import { Reveal, MaskedLine } from "@/components/Reveal";

const inputCls = "w-full min-h-[44px] px-4 py-3 rounded-md border border-slate-300 bg-white text-sm text-civic-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-amber focus:border-civic-amber transition-shadow";

const Contact = () => {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "general", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, form);
      toast.success(t.contact.success);
      setForm({ name: "", email: "", phone: "", type: "general", subject: "", message: "" });
    } catch {
      toast.error("Error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <AlertTicker />
      <section className="bg-civic-deep py-20 sm:py-28 grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaskedLine delay={0.1}>
            <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
              <PhoneCall size={14} /> {t.contact.kicker}
            </span>
          </MaskedLine>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            <MaskedLine delay={0.25}>{t.contact.title}</MaskedLine>
          </h1>
          <MaskedLine delay={0.4}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{t.contact.sub}</p>
          </MaskedLine>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7">
            <form data-testid="contact-form" onSubmit={submit} className="bg-white border border-slate-200 rounded-lg p-7 sm:p-10">
              <h2 className="font-display text-2xl font-extrabold text-civic-navy tracking-tight mb-8">{t.contact.formTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cf-name" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.name}</label>
                  <input id="cf-name" data-testid="contact-name-input" required value={form.name} onChange={set("name")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="cf-email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.email}</label>
                  <input id="cf-email" data-testid="contact-email-input" type="email" required value={form.email} onChange={set("email")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="cf-phone" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.phone}</label>
                  <input id="cf-phone" data-testid="contact-phone-input" value={form.phone} onChange={set("phone")} className={inputCls} dir="ltr" />
                </div>
                <div>
                  <label htmlFor="cf-type" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.type}</label>
                  <select id="cf-type" data-testid="contact-type-select" value={form.type} onChange={set("type")} className={inputCls}>
                    {Object.entries(t.contact.types).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-subject" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.subject}</label>
                  <input id="cf-subject" data-testid="contact-subject-input" required value={form.subject} onChange={set("subject")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.contact.message}</label>
                  <textarea id="cf-message" data-testid="contact-message-input" required rows={5} value={form.message} onChange={set("message")} className={inputCls} />
                </div>
              </div>
              <button
                data-testid="contact-submit-button"
                type="submit"
                disabled={sending}
                className="mt-8 inline-flex items-center gap-2 px-8 h-12 rounded-md bg-civic-navy text-white font-bold hover:bg-civic-amberdark transition-colors disabled:opacity-60"
              >
                <Send size={16} /> {sending ? t.contact.sending : t.contact.submit}
              </button>
            </form>
          </Reveal>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <Reveal delay={0.1}>
              <div data-testid="emergency-card" className="bg-civic-navy rounded-lg p-7 sm:p-8 grain-overlay relative overflow-hidden">
                <h3 className="relative z-10 font-display text-lg font-extrabold text-white uppercase tracking-widest mb-6">{t.contact.emergencyTitle}</h3>
                <div className="relative z-10 flex flex-col gap-3">
                  {t.contact.hotlines.map((h) => (
                    <a key={h.number} data-testid={`contact-hotline-${h.number.replace(/\s/g, "")}`} href={`tel:${h.number.replace(/\s/g, "")}`} className="flex items-center justify-between gap-6 px-5 py-4 rounded-md bg-white/5 border border-white/15 hover:border-amber-400/60 transition-all group">
                      <span className="text-sm font-semibold text-slate-300">{h.label}</span>
                      <span className="font-mono-civic text-lg font-bold text-civic-amber group-hover:text-amber-300" dir="ltr">{h.number}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div data-testid="hours-card" className="bg-white border border-slate-200 rounded-lg p-7 sm:p-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-civic-navy uppercase tracking-widest mb-4">
                  <Clock size={18} className="text-civic-amberdark" /> {t.contact.hoursTitle}
                </h3>
                <p className="text-sm font-semibold text-slate-600">{t.contact.hours}</p>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div data-testid="address-card" className="bg-white border border-slate-200 rounded-lg p-7 sm:p-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-civic-navy uppercase tracking-widest mb-4">
                  <MapPin size={18} className="text-civic-amberdark" /> {t.contact.addressTitle}
                </h3>
                <p className="text-sm font-semibold text-slate-600">{t.contact.address}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
