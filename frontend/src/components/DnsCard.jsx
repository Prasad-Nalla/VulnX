import { useState } from "react";

const DnsCard = ({ dns }) => {
  const [activeTab, setActiveTab] = useState("email");

  if (!dns || !dns.success) {
    return (
      <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black font-mono">
        <h2 className="text-xl font-bold text-emerald-400">[+] DNS RECORDS & EMAIL SECURITY</h2>
        <p className="text-emerald-600 mt-2 text-xs">DNS query records unavailable or host failed resolution.</p>
      </div>
    );
  }

  const { records, email_security } = dns;

  return (
    <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-emerald-500/30 gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 neon-text-green">
            [+] DNS INTELLIGENCE & EMAIL SECURITY
          </h2>
          <p className="text-emerald-600 text-xs mt-1">DOMAIN: <span className="text-emerald-300">{dns.domain}</span></p>
        </div>

        <div className="flex gap-2 bg-emerald-950/40 p-1 rounded border border-emerald-500/30">
          <button
            onClick={() => setActiveTab("email")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === "email" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
            }`}
          >
            [+] EMAIL SPOOFING (SPF/DMARC)
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === "records" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
            }`}
          >
            [+] RAW DNS RECORDS
          </button>
        </div>
      </div>

      {activeTab === "email" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-950/20 p-5 rounded border border-emerald-500/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-emerald-300">SPF SECURITY RECORD</h3>
              {email_security?.spf_configured ? (
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded text-[11px] font-bold">
                  [✓ CONFIGURED]
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/60 rounded text-[11px] font-bold">
                  [✕ MISSING SPF]
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 mb-3">
              Sender Policy Framework (SPF) specifies authorized mail servers.
            </p>
            <div className="bg-black p-3 rounded border border-emerald-500/30 text-xs text-emerald-300 break-all">
              {email_security?.spf_record || "No valid v=spf1 TXT record found."}
            </div>
          </div>

          <div className="bg-emerald-950/20 p-5 rounded border border-emerald-500/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-emerald-300">DMARC POLICY RECORD</h3>
              {email_security?.dmarc_configured ? (
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded text-[11px] font-bold">
                  [✓ CONFIGURED]
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/60 rounded text-[11px] font-bold">
                  [✕ MISSING DMARC]
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 mb-3">
              DMARC instructs receiving mail servers on handling spoofed email.
            </p>
            <div className="bg-black p-3 rounded border border-emerald-500/30 text-xs text-emerald-300 break-all">
              {email_security?.dmarc_record || "No valid v=DMARC1 TXT record found."}
            </div>
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <div className="mt-6 space-y-3">
          {Object.entries(records).map(([type, list]) => (
            <div key={type} className="bg-black p-3.5 rounded border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-bold text-xs rounded border border-emerald-500/40">
                  {type}
                </span>
                <span className="text-[11px] text-emerald-600">({list.length} records)</span>
              </div>

              {list.length === 0 ? (
                <p className="text-[11px] text-emerald-700">No {type} records found.</p>
              ) : (
                <ul className="space-y-1">
                  {list.map((rec, i) => (
                    <li key={i} className="text-xs text-emerald-300 break-all bg-emerald-950/30 px-3 py-1 rounded border border-emerald-500/20">
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
