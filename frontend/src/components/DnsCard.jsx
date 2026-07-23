import { useState } from "react";

const DnsCard = ({ dns }) => {
  const [activeTab, setActiveTab] = useState("email");

  if (!dns || !dns.success) {
    return (
      <div className="mt-6 border border-slate-800 rounded-2xl p-6 bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-300">🌐 DNS Records & Email Security</h2>
        <p className="text-slate-400 mt-2">DNS query records unavailable or host failed resolution.</p>
      </div>
    );
  }

  const { records, email_security } = dns;

  return (
    <div className="mt-6 border border-cyan-500/30 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-xl shadow-cyan-500/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-cyan-400">🌐</span> DNS Intelligence & Email Security
          </h2>
          <p className="text-slate-400 text-sm mt-1">Domain: <span className="text-cyan-400 font-mono">{dns.domain}</span></p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "email" ? "bg-cyan-500 text-black shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Email Spoofing (SPF/DMARC)
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "records" ? "bg-cyan-500 text-black shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Raw DNS Records
          </button>
        </div>
      </div>

      {activeTab === "email" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">SPF Security Record</h3>
              {email_security?.spf_configured ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-semibold">
                  ✓ Configured
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-semibold">
                  ✕ Missing SPF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Sender Policy Framework (SPF) specifies which mail servers are authorized to send email on behalf of your domain.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              {email_security?.spf_record || "No valid v=spf1 TXT record found."}
            </div>
          </div>

          <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">DMARC Policy Record</h3>
              {email_security?.dmarc_configured ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-semibold">
                  ✓ Configured
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-semibold">
                  ✕ Missing DMARC
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Domain-based Message Authentication, Reporting, and Conformance (DMARC) instructs receiving servers on handling unauthenticated emails.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              {email_security?.dmarc_record || "No valid v=DMARC1 TXT record found."}
            </div>
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <div className="mt-6 space-y-4">
          {Object.entries(records).map(([type, list]) => (
            <div key={type} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 bg-slate-800 text-cyan-400 font-mono font-bold text-xs rounded">
                  {type}
                </span>
                <span className="text-xs text-slate-400">({list.length} entries)</span>
              </div>

              {list.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">No {type} records found.</p>
              ) : (
                <ul className="space-y-1">
                  {list.map((rec, i) => (
                    <li key={i} className="text-xs font-mono text-slate-300 break-all bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800/60">
                      {rec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DnsCard;
