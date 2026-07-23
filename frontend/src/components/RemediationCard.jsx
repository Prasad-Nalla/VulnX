import { useState } from "react";

const RemediationCard = ({ remediations }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [serverType, setServerType] = useState("nginx");

  if (!remediations || remediations.length === 0) {
    return (
      <div className="mt-6 border border-emerald-500/30 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-2xl">🎉</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Security Hardening Status</h2>
            <p className="text-emerald-400 font-semibold text-sm mt-1">
              No critical remediation steps needed! All standard security headers and email protections are present.
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
    <div className="mt-6 border border-violet-500/30 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-xl shadow-violet-500/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-violet-400">🛠️</span> Security Remediation & Hardening Generator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Copyable web server snippets to resolve detected vulnerabilities ({remediations.length} items to fix)
          </p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setServerType("nginx")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              serverType === "nginx" ? "bg-violet-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Nginx
          </button>
          <button
            onClick={() => setServerType("apache")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              serverType === "apache" ? "bg-violet-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Apache
          </button>
          <button
            onClick={() => setServerType("meta")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              serverType === "meta" ? "bg-violet-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            HTML / DNS
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {remediations.map((item, idx) => {
          const codeSnippet = item[serverType] || item.nginx;

          return (
            <div key={idx} className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    item.severity === "HIGH" ? "bg-red-500/20 text-red-400 border border-red-500/40" :
                    item.severity === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                    "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  }`}>
                    {item.severity} SEVERITY
                  </span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>

                <button
                  onClick={() => handleCopy(codeSnippet, idx)}
                  className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  {copiedIndex === idx ? (
                    <span className="text-emerald-400">✓ Copied!</span>
                  ) : (
                    <span>📋 Copy Code</span>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4">{item.impact}</p>

              <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-violet-300 break-all overflow-x-auto">
                <span className="text-slate-600 block text-[10px] uppercase font-sans mb-1 font-bold">
                  {serverType.toUpperCase()} Configuration Snippet:
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
