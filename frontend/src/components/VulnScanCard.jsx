import { FiShield, FiCheckCircle, FiSearch, FiCode, FiLayers, FiAlertTriangle } from "react-icons/fi";

const VulnScanCard = ({ vulnData }) => {
  if (!vulnData) {
    return (
      <div className="border border-emerald-500/30 rounded-lg p-6 bg-black/90 font-mono text-emerald-400">
        <p className="text-xs">[!] Active vulnerability scan data unavailable for this target.</p>
      </div>
    );
  }

  const crawler = vulnData.crawler || {};
  const sqli = vulnData.sqli || {};
  const xss = vulnData.xss || {};

  const sqliFindings = sqli.findings || [];
  const xssFindings = xss.findings || [];
  const totalVulns = sqliFindings.length + xssFindings.length;

  return (
    <div className="space-y-6 font-mono">
      
      {/* Top Banner Stats */}
      <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2">
              <FiShield className="text-emerald-400 text-lg animate-pulse" />
              <h3 className="text-lg font-bold text-emerald-400 neon-text-green">
                [+] ACTIVE VULNERABILITY & CRAWLER AUDIT
              </h3>
            </div>
            <p className="text-emerald-600 text-xs mt-1">
              Deep Crawling + Payload Probing (SQLi Error Signatures & Reflected XSS Vectors)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded border text-xs font-bold ${
              totalVulns > 0 
                ? "bg-red-950/80 border-red-500/60 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                : "bg-emerald-950/80 border-emerald-500/60 text-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.3)]"
            }`}>
              {totalVulns > 0 ? `[-] ${totalVulns} ACTIVE THREATS FOUND` : "[+] TARGET CLEAN (0 HIGH/CRIT VULNS)"}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-emerald-950/40 p-3 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <FiSearch /> PAGES CRAWLED
            </span>
            <p className="text-lg font-bold text-emerald-300 mt-1">{crawler.total_crawled || 0}</p>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <FiLayers /> DISCOVERED FORMS
            </span>
            <p className="text-lg font-bold text-emerald-300 mt-1">{(crawler.discovered_forms || []).length}</p>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <FiAlertTriangle className="text-amber-400" /> SQL INJECTION
            </span>
            <p className={`text-lg font-bold mt-1 ${sqliFindings.length > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {sqliFindings.length}
            </p>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <FiCode className="text-cyan-400" /> REFLECTED XSS
            </span>
            <p className={`text-lg font-bold mt-1 ${xssFindings.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {xssFindings.length}
            </p>
          </div>
        </div>
      </div>

      {/* SQL Injection Findings */}
      <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
        <h4 className="text-sm font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
          <span>[+] SQL INJECTION (SQLi) PROBING RESULTS</span>
        </h4>

        {sqliFindings.length === 0 ? (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-emerald-400 text-xs flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400 text-sm" />
            <span>No SQL injection syntax errors or DBMS signature leaks detected during probe execution.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {sqliFindings.map((item, idx) => (
              <div key={idx} className="bg-red-950/30 border border-red-500/50 rounded p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-900 text-red-100 rounded text-[10px]">
                      {item.severity || "HIGH"}
                    </span>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-red-400/80 font-mono">DBMS: {item.dbms}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="text-emerald-500 font-bold">Target Param:</span> <code className="text-amber-300">{item.parameter}</code>
                </p>
                <p className="text-xs text-slate-300">
                  <span className="text-emerald-500 font-bold">Payload:</span> <code className="text-red-300 bg-black px-2 py-0.5 rounded border border-red-500/40">{item.payload}</code>
                </p>
                <p className="text-xs text-slate-400 bg-black/60 p-2 rounded border border-red-900/40 text-[11px]">
                  <span className="text-red-400 font-bold">Evidence:</span> {item.evidence}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reflected XSS Findings */}
      <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
        <h4 className="text-sm font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
          <span>[+] REFLECTED CROSS-SITE SCRIPTING (XSS) RESULTS</span>
        </h4>

        {xssFindings.length === 0 ? (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-emerald-400 text-xs flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400 text-sm" />
            <span>No unescaped script tag reflections found in target forms or query parameters.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {xssFindings.map((item, idx) => (
              <div key={idx} className="bg-amber-950/30 border border-amber-500/50 rounded p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-900 text-amber-100 rounded text-[10px]">
                      {item.severity || "HIGH"}
                    </span>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="text-emerald-500 font-bold">Input Field:</span> <code className="text-amber-300">{item.parameter}</code>
                </p>
                <p className="text-xs text-slate-300">
                  <span className="text-emerald-500 font-bold">Payload:</span> <code className="text-amber-300 bg-black px-2 py-0.5 rounded border border-amber-500/40">{item.payload}</code>
                </p>
                <p className="text-xs text-slate-400 bg-black/60 p-2 rounded border border-amber-900/40 text-[11px]">
                  <span className="text-amber-400 font-bold">Evidence:</span> {item.evidence}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crawled Forms & Inputs Table */}
      <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95">
        <h4 className="text-sm font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
          <span>[+] DISCOVERED WEB FORMS & INPUT ENDPOINTS</span>
        </h4>

        {(crawler.discovered_forms || []).length === 0 ? (
          <p className="text-xs text-emerald-600">No HTML forms were detected on the entry page.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                  <th className="p-2">Form Action URL</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Form Inputs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-slate-300">
                {(crawler.discovered_forms || []).map((form, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/20">
                    <td className="p-2 text-emerald-300 text-[11px] truncate max-w-xs">{form.form_url}</td>
                    <td className="p-2 text-cyan-400 font-bold">{form.method}</td>
                    <td className="p-2 text-[11px]">
                      {(form.inputs || []).map(i => i.name).join(", ") || "No input names"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default VulnScanCard;
