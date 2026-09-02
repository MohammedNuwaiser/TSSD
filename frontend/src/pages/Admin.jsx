import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Download, Inbox } from "lucide-react";
import { useLang, API } from "@/i18n";
import { Emblem } from "@/components/Header";
import { Reveal } from "@/components/Reveal";

const inputCls = "w-full min-h-[44px] px-4 py-3 rounded-md border border-slate-300 bg-white text-sm text-civic-navy focus:outline-none focus:ring-2 focus:ring-civic-amber focus:border-civic-amber";

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
};

const Admin = () => {
  const { t } = useLang();
  const [token, setToken] = useState(() => localStorage.getItem("tssd_token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState("all");

  const headers = { Authorization: `Bearer ${token}` };

  const load = () => {
    axios.get(`${API}/enquiries`, { headers }).then((r) => setEnquiries(r.data)).catch(() => {
      localStorage.removeItem("tssd_token");
      setToken(null);
    });
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem("tssd_token", data.token);
      setToken(data.token);
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("tssd_token");
    setToken(null);
  };

  const setStatus = async (id, status) => {
    await axios.patch(`${API}/enquiries/${id}`, { status }, { headers });
    load();
  };

  const exportCsv = async () => {
    const { data } = await axios.get(`${API}/enquiries/export`, { headers, responseType: "blob" });
    const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div data-testid="admin-login-page" className="min-h-[70vh] bg-civic-deep grain-overlay flex items-center justify-center px-4 py-20">
        <Reveal className="w-full max-w-md">
          <form onSubmit={login} className="bg-white rounded-lg border border-slate-200 p-8 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Emblem />
              <div>
                <h1 className="font-display text-xl font-extrabold text-civic-navy">{t.admin.title}</h1>
                <p className="text-xs text-slate-500">{t.admin.loginSub}</p>
              </div>
            </div>
            {error && <p data-testid="admin-login-error" className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm font-semibold text-red-700">{error}</p>}
            <label htmlFor="ad-email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.admin.email}</label>
            <input id="ad-email" data-testid="admin-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mb-5`} dir="ltr" />
            <label htmlFor="ad-pass" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.admin.password}</label>
            <input id="ad-pass" data-testid="admin-password-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mb-7`} dir="ltr" />
            <button data-testid="admin-login-button" type="submit" disabled={loading} className="w-full h-12 rounded-md bg-civic-navy text-white font-bold hover:bg-civic-amberdark transition-colors disabled:opacity-60">
              {loading ? t.admin.loggingIn : t.admin.login}
            </button>
          </form>
        </Reveal>
      </div>
    );
  }

  const counts = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    in_progress: enquiries.filter((e) => e.status === "in_progress").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };
  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);
  const tabs = [
    { key: "all", label: t.admin.filterAll },
    { key: "pending", label: t.admin.pending },
    { key: "in_progress", label: t.admin.inProgress },
    { key: "resolved", label: t.admin.resolved },
  ];

  return (
    <div data-testid="admin-dashboard" className="min-h-[70vh] bg-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-civic-navy tracking-tight">{t.admin.dashboard}</h1>
          <div className="flex gap-3">
            <button data-testid="admin-export-button" onClick={exportCsv} className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-slate-300 bg-white text-sm font-bold text-civic-navy hover:border-civic-amber transition-colors">
              <Download size={16} /> {t.admin.exportCsv}
            </button>
            <button data-testid="admin-logout-button" onClick={logout} className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-civic-navy text-white text-sm font-bold hover:bg-red-700 transition-colors">
              <LogOut size={16} /> {t.admin.logout}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: t.admin.total, value: counts.total, key: "total" },
            { label: t.admin.pending, value: counts.pending, key: "pending" },
            { label: t.admin.inProgress, value: counts.in_progress, key: "in_progress" },
            { label: t.admin.resolved, value: counts.resolved, key: "resolved" },
          ].map((s) => (
            <div key={s.key} data-testid={`admin-stat-${s.key}`} className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="font-mono-civic text-3xl font-semibold text-civic-navy" dir="ltr">{s.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              data-testid={`admin-filter-${tab.key}`}
              onClick={() => setFilter(tab.key)}
              className={`px-5 h-11 rounded-md text-sm font-bold transition-colors ${filter === tab.key ? "bg-civic-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-civic-amber"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {[t.admin.from, t.admin.type, t.admin.subjectCol, t.admin.message, t.admin.date, t.admin.status, t.admin.actions].map((h, i) => (
                  <th key={i} className="text-start px-5 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    <Inbox size={32} className="mx-auto mb-3 opacity-50" />
                    {t.admin.empty}
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} data-testid={`admin-enquiry-row-${e.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-civic-navy">{e.name}</p>
                      <p className="text-xs text-slate-500" dir="ltr">{e.email}</p>
                      {e.phone && <p className="text-xs text-slate-400" dir="ltr">{e.phone}</p>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{t.contact.types[e.type] || e.type}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{e.subject}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[240px] truncate">{e.message}</td>
                    <td className="px-5 py-4 font-mono-civic text-xs text-slate-500 whitespace-nowrap" dir="ltr">{e.created_at?.slice(0, 10)}</td>
                    <td className="px-5 py-4">
                      <span data-testid={`admin-status-${e.id}`} className={`px-2.5 py-1 rounded text-[11px] font-extrabold uppercase tracking-widest ${statusColors[e.status]}`}>
                        {e.status === "pending" ? t.admin.pending : e.status === "in_progress" ? t.admin.inProgress : t.admin.resolved}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {e.status === "pending" && (
                          <button data-testid={`admin-progress-${e.id}`} onClick={() => setStatus(e.id, "in_progress")} className="px-3 py-1.5 rounded border border-blue-300 text-blue-700 text-xs font-bold hover:bg-blue-50">
                            {t.admin.markProgress}
                          </button>
                        )}
                        {e.status !== "resolved" && (
                          <button data-testid={`admin-resolve-${e.id}`} onClick={() => setStatus(e.id, "resolved")} className="px-3 py-1.5 rounded border border-emerald-300 text-emerald-700 text-xs font-bold hover:bg-emerald-50">
                            {t.admin.markResolved}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
