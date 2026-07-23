import { useState } from "react";

const TerminalPanel = ({ results, url, rawHeaders }) => {
  const [copied, setCopied] = useState(false);

  if (!results) return null;

  const handleCopyRaw = () => {
    if (!rawHeaders) return;
    const formatted = Object.entries(rawHeaders).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-3 text-cyan-400 font-mono text-xs font-semibold flex items-center gap-1.5">
            <span>💻</span> vulnx-audit-terminal --target={url}
          </span>
        </div>

        {rawHeaders && (
          <button
            onClick={handleCopyRaw}
            className="text-[11px] font-mono font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
          >
            {copied ? <span className="text-emerald-400">✓ Headers Copied!</span> : <span>📋 Copy Raw Headers</span>}
          </button>
        )}
      </div>

      <div className="p-6 font-mono text-xs space-y-3 leading-relaxed">
        <p className="text-slate-400">
          <span className="text-cyan-400 font-bold">[INFO]</span> Target Host: <span className="text-white">{url}</span>
        </p>

        <p className="text-slate-400">
          <span className="text-cyan-400 font-bold">[INFO]</span> Auditing Security Response Headers...
        </p>

        {Object.entries(results).map(([key, value]) => (
          <p key={key} className="flex items-start gap-2">
            {value !== "Missing" ? (
              <span className="text-emerald-400 font-bold shrink-0">[+] PRESENT</span>
            ) : (
              <span className="text-red-400 font-bold shrink-0">[-] MISSING</span>
            )}
            <span className="text-slate-200">{key}:</span>
            <span className={value !== "Missing" ? "text-cyan-300 break-all" : "text-red-400 font-semibold"}>
              {value}
            </span>
          </p>
        ))}

        <p className="text-emerald-400 font-bold pt-2">
          [✓] Security Header Analysis Finished
        </p>

        {rawHeaders && Object.keys(rawHeaders).length > 0 && (
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <p className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Complete Raw HTTP Response Headers ({Object.keys(rawHeaders).length} items):
            </p>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto space-y-1">
              {Object.entries(rawHeaders).map(([key, value]) => (
                <p key={key} className="text-slate-300 break-all">
                  <span className="text-cyan-400 font-semibold">{key}:</span> {value}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;