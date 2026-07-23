import { useState } from "react";

const RemediationCard = ({ remediations }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [serverType, setServerType] = useState("nginx");

  if (!remediations || remediations.length === 0) {
    return (
      <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-xl">[+]</span>
          <div>
            <h2 className="text-lg font-bold text-emerald-300">SECURITY HARDENING COMPLETE</h2>
            <p className="text-emerald-500 font-semibold text-xs mt-1">
              No critical remediation steps needed. All standard security headers and email protections are present.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-emerald-500/30 gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 neon-text-green">
            [+] REMEDIATION & CODE HARDENING GENERATOR
          </h2>
          <p className="text-emerald-600 text-xs mt-1">
            Copyable web server snippets to resolve detected vulnerabilities ({remediations.length} items to fix)
          </p>
        </div>

        <div className="flex gap-2 bg-emerald-950/40 p-1 rounded border border-emerald-500/30">
          <button
            onClick={() => setServerType("nginx")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              serverType === "nginx" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
            }`}
          >
            NGINX
          </button>
          <button
            onClick={() => setServerType("apache")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              serverType === "apache" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
            }`}
          >
            APACHE
          </button>
          <button
            onClick={() => setServerType("meta")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              serverType === "meta" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
            }`}
          >
            HTML / DNS
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {remediations.map((item, idx) => {
          const codeSnippet = item[serverType] || item.nginx;

          return (
            <div key={idx} className="bg-black p-5 rounded border border-emerald-500/30">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.severity === "HIGH" ? "bg-red-950 text-red-400 border-red-500/60" :
                    item.severity === "MEDIUM" ? "bg-amber-950 text-amber-400 border-amber-500/60" :
                    "bg-emerald-950 text-emerald-300 border-emerald-500/60"
                  }`}>
                    [{item.severity} SEVERITY]
                  </span>
                  <h3 className="text-sm font-bold text-emerald-300">{item.title}</h3>
                </div>

                <button
                  onClick={() => handleCopy(codeSnippet, idx)}
                  className="bg-emerald-950 hover:bg-emerald-900 text-[11px] font-bold text-emerald-300 px-3 py-1 rounded border border-emerald-500/50 transition-all"
                >
                  {copiedIndex === idx ? (
                    <span className="text-emerald-400">[✓ COPIED]</span>
                  ) : (
                    <span>[+] COPY CODE</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-emerald-600 mb-3">{item.impact}</p>

              <div className="relative bg-black p-3.5 rounded border border-emerald-500/30 text-xs text-emerald-300 break-all overflow-x-auto">
                <span className="text-emerald-600 block text-[10px] font-bold uppercase mb-1">
                  {serverType.toUpperCase()} CONFIGURATION SNIPPET:
                </span>
                <code>{codeSnippet}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RemediationCard;
