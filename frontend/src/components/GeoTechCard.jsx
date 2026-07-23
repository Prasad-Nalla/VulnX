const GeoTechCard = ({ geoInfo, techStack, perfInfo, securityFiles }) => {
  if (!geoInfo && !techStack && !perfInfo) return null;

  return (
    <div className="mt-6 space-y-6">
      
      {/* Geolocation & Server Infrastructure */}
      <div className="border border-cyan-500/30 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-xl shadow-cyan-500/5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 pb-6 border-b border-slate-800">
          <span className="text-cyan-400">🌍</span> IP Geolocation & Server Infrastructure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Server IP & ASN</p>
            <p className="text-lg font-bold text-cyan-400 font-mono">{geoInfo?.ip || "N/A"}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{geoInfo?.asn || "N/A"}</p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Geographic Location</p>
            <p className="text-lg font-bold text-white">
              {geoInfo?.city ? `${geoInfo.city}, ${geoInfo.country}` : geoInfo?.country || "Unknown Location"}
            </p>
            <p className="text-xs text-slate-400 mt-1">{geoInfo?.region || "N/A"}</p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Hosting Organization / ISP</p>
            <p className="text-lg font-bold text-emerald-400 truncate">{geoInfo?.org || geoInfo?.isp || "Unknown ISP"}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">ISP: {geoInfo?.isp || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Web Tech Stack & HTTP Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Detected Tech Stack */}
        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/90 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-amber-400">⚡</span> Detected Technology Stack
          </h3>

          {!techStack || techStack.length === 0 ? (
            <p className="text-xs text-slate-400">No specific framework tokens exposed in HTTP headers.</p>
          ) : (
            <div className="space-y-3">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">{tech.category}</span>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latency & Redirect Chain */}
        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/90 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-emerald-400">⏱️</span> Response Latency & Redirects
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Response Latency</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {perfInfo?.response_time_ms ? `${perfInfo.response_time_ms} ms` : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Redirect Steps</span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {perfInfo?.redirect_count !== undefined ? `${perfInfo.redirect_count} redirects` : "0"}
              </span>
            </div>

            {perfInfo?.redirect_chain && perfInfo.redirect_chain.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Redirect History:</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {perfInfo.redirect_chain.map((step, i) => (
                    <div key={i} className="text-[11px] font-mono bg-slate-950 p-2 rounded text-slate-300 border border-slate-800/60 truncate">
                      <span className="text-amber-400 font-bold mr-2">HTTP {step.status_code}</span> → {step.url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Security Files (Robots.txt & Security.txt) */}
      <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/90 backdrop-blur-md">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-violet-400">📄</span> Security Policy & Search File Inspection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">robots.txt</span>
              {securityFiles?.robots_txt?.found ? (
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">Found</span>
              ) : (
                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">Not Found</span>
              )}
            </div>
            {securityFiles?.robots_txt?.found ? (
              <pre className="text-[10px] font-mono text-cyan-300 bg-slate-900 p-3 rounded-lg border border-slate-800 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {securityFiles.robots_txt.preview}
              </pre>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No standard /robots.txt file detected.</p>
            )}
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">security.txt (.well-known)</span>
              {securityFiles?.security_txt?.found ? (
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">Found</span>
              ) : (
                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">Not Found</span>
              )}
            </div>
            {securityFiles?.security_txt?.found ? (
              <pre className="text-[10px] font-mono text-violet-300 bg-slate-900 p-3 rounded-lg border border-slate-800 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {securityFiles.security_txt.preview}
              </pre>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No /.well-known/security.txt vulnerability disclosure policy found.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default GeoTechCard;
