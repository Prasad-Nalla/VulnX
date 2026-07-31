import { useState } from "react";
import { FiCpu, FiShield, FiAlertTriangle, FiCheckCircle, FiCopy, FiCheck, FiTerminal } from "react-icons/fi";

const PortScanCard = ({ ports }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!ports) return null;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-rose-950/80 text-rose-400 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
      case "HIGH":
        return "bg-amber-950/80 text-amber-400 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
      case "MEDIUM":
        return "bg-yellow-950/80 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/40";
    }
  };

  const criticalCount = ports.filter((p) => p.risk === "CRITICAL" || p.risk === "HIGH").length;

  return (
    <div className="mt-6 glass-panel p-6 sm:p-8 font-mono">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/30 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <FiCpu className="text-emerald-400 text-xl" />
            <h2 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
              Nmap Port & Service Scanner
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase">
              Top 100+ Ports Engine
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Multithreaded socket banner grabbing & Nmap service version detection
          </p>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">OPEN PORTS</span>
            <span className="text-sm font-bold text-emerald-400">{ports.length}</span>
          </div>
          <div className="bg-slate-950 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">HIGH RISK</span>
            <span className={`text-sm font-bold ${criticalCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {criticalCount}
            </span>
          </div>
        </div>
      </div>

      {/* No Open Ports State */}
      {ports.length === 0 ? (
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-6 text-center">
          <FiCheckCircle className="text-emerald-400 text-3xl mx-auto mb-2" />
          <h3 className="text-sm font-bold text-emerald-300 uppercase">NO COMMON OPEN PORTS DETECTED</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
            Probed 100+ standard service ports (FTP, SSH, Telnet, SMTP, DNS, HTTP, HTTPS, SMB, MySQL, Postgres, Redis, Mongo, Elastic). All tested target ports rejected connections or filtered TCP packets.
          </p>
        </div>
      ) : (
        /* Open Ports Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ports.map((port, index) => (
            <div
              key={index}
              className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 transition-all hover:border-emerald-500/60 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-emerald-300 font-mono">
                        PORT {port.port} / TCP
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(port.risk)}`}>
                        {port.risk || "LOW"} RISK
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">
                      {port.service}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/50 uppercase">
                    [{port.status || "OPEN"}]
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <FiShield className="text-emerald-500" />
                  <span>Category: <strong className="text-slate-300">{port.category || "Network Service"}</strong></span>
                </div>
              </div>

              {/* Service Banner Inspection Box */}
              {port.banner && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <FiTerminal className="text-emerald-500" /> BANNER / SERVICE DETECTED:
                    </span>
                    <button
                      onClick={() => handleCopy(port.banner, index)}
                      className="text-emerald-500 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedIndex === index ? (
                        <>
                          <FiCheck className="text-xs text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy className="text-xs" /> Copy Banner
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900/90 border border-emerald-500/20 rounded-lg p-2.5 text-xs text-emerald-300 font-mono break-all leading-snug">
                    {port.banner}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortScanCard;