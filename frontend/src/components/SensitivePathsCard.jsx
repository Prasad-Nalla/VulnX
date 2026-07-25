const SensitivePathsCard = ({ exposedPaths, cveAdvisories }) => {
  if (!exposedPaths && (!cveAdvisories || cveAdvisories.length === 0)) return null;

  return (
    <div className="mt-6 space-y-6 font-mono">
      
      {/* Exposed Sensitive Endpoint Scanner */}
      <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/30 gap-2">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 neon-text-green">
              [+] EXPOSED SENSITIVE PATH & DIRECTORY DISCOVERY
            </h2>
            <p className="text-emerald-600 text-xs mt-1">
              Probed common configuration files, source control, and admin endpoints
            </p>
          </div>

          <span className={`px-3 py-1 rounded text-xs font-bold shrink-0 border ${
            exposedPaths?.count > 0 ? "bg-red-950 text-red-400 border-red-500/60" : "bg-emerald-950 text-emerald-300 border-emerald-500/60"
          }`}>
            [{exposedPaths?.count || 0} SENSITIVE PATHS EXPOSED]
          </span>
        </div>

        {!exposedPaths?.results || exposedPaths.results.length === 0 ? (
          <p className="text-xs text-emerald-400 mt-4">[✓] All probed sensitive paths returned 404 Not Found or were blocked.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {exposedPaths.results.map((res, i) => (
              <div key={i} className={`p-3 rounded border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                res.exposed ? "bg-red-950/40 border-red-500/60 text-red-300" : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
              }`}>
                <div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className={res.exposed ? "text-red-400" : "text-emerald-400"}>
                      {res.exposed ? "[-] EXPOSED" : "[✓] PROTECTED"}
                    </span>
                    <span>/{res.path}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-0.5">{res.label}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    res.exposed ? "bg-red-950 text-red-300 border-red-500/60" : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                  }`}>
                    HTTP {res.status_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CVE Advisory Engine */}
      {cveAdvisories && cveAdvisories.length > 0 && (
        <div className="border border-red-500/50 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <h3 className="text-lg font-bold text-red-400 mb-3 border-b border-red-500/30 pb-2">
            [-] CVE VULNERABILITY ADVISORIES DETECTED
          </h3>

          <div className="space-y-3">
            {cveAdvisories.map((adv, idx) => (
              <div key={idx} className="bg-red-950/30 p-4 rounded border border-red-500/40 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-red-400 text-sm">{adv.cve}</span>
                  <span className="px-2 py-0.5 bg-red-900 text-red-200 text-[10px] font-bold rounded">
                    {adv.severity}
                  </span>
                </div>
                <p className="text-emerald-300 font-bold mb-1">Target Component: {adv.tech}</p>
                <p className="text-emerald-600 text-[11px]">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SensitivePathsCard;
