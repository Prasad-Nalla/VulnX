const GeoTechCard = ({ geoInfo, techStack, perfInfo, securityFiles }) => {
  if (!geoInfo && !techStack && !perfInfo) return null;

  return (
    <div className="mt-6 space-y-6 font-mono">
      
      {/* Geolocation */}
      <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <h2 className="text-xl font-bold text-emerald-400 pb-4 border-b border-emerald-500/30 neon-text-green">
          [+] IP GEOLOCATION & SERVER INFRASTRUCTURE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-emerald-950/20 p-4 rounded border border-emerald-500/30">
            <p className="text-[10px] uppercase text-emerald-600 font-bold">SERVER IP & ASN</p>
            <p className="text-sm font-bold text-emerald-300 mt-1">{geoInfo?.ip || "N/A"}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 truncate">{geoInfo?.asn || "N/A"}</p>
          </div>

          <div className="bg-emerald-950/20 p-4 rounded border border-emerald-500/30">
            <p className="text-[10px] uppercase text-emerald-600 font-bold">GEOGRAPHIC LOCATION</p>
            <p className="text-sm font-bold text-emerald-300">
              {geoInfo?.city ? `${geoInfo.city}, ${geoInfo.country}` : geoInfo?.country || "Unknown Location"}
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5">{geoInfo?.region || "N/A"}</p>
          </div>

          <div className="bg-emerald-950/20 p-4 rounded border border-emerald-500/30">
            <p className="text-[10px] uppercase text-emerald-600 font-bold">HOSTING ISP / ORG</p>
            <p className="text-sm font-bold text-emerald-300 truncate">{geoInfo?.org || geoInfo?.isp || "Unknown ISP"}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 truncate">ISP: {geoInfo?.isp || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Tech Stack & Latency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95">
          <h3 className="text-base font-bold text-emerald-400 mb-3">
            [+] DETECTED TECH STACK
          </h3>

          {!techStack || techStack.length === 0 ? (
            <p className="text-xs text-emerald-700">No specific framework headers detected.</p>
          ) : (
            <div className="space-y-2">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between bg-black p-3 rounded border border-emerald-500/30 text-xs">
                  <span className="text-emerald-600 font-bold">{tech.category}</span>
                  <span className="font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95">
          <h3 className="text-base font-bold text-emerald-400 mb-3">
            [+] LATENCY & REDIRECT STEPS
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-black p-3 rounded border border-emerald-500/30">
              <span className="text-emerald-600 font-bold">RESPONSE LATENCY</span>
              <span className="font-bold text-emerald-300">
                {perfInfo?.response_time_ms ? `${perfInfo.response_time_ms} ms` : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between bg-black p-3 rounded border border-emerald-500/30">
              <span className="text-emerald-600 font-bold">REDIRECT STEPS</span>
              <span className="font-bold text-emerald-300">
                {perfInfo?.redirect_count !== undefined ? `${perfInfo.redirect_count} redirects` : "0"}
              </span>
            </div>

            {perfInfo?.redirect_chain && perfInfo.redirect_chain.length > 0 && (
              <div className="mt-2">
                <span className="text-[11px] text-emerald-600 block mb-1">REDIRECT HISTORY:</span>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {perfInfo.redirect_chain.map((step, i) => (
                    <div key={i} className="text-[11px] bg-black p-1.5 rounded text-emerald-300 border border-emerald-500/20 truncate">
                      <span className="text-amber-400 font-bold mr-1">HTTP {step.status_code}</span> → {step.url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Security Files */}
      <div className="border border-emerald-500/40 rounded-lg p-5 bg-black/95">
        <h3 className="text-base font-bold text-emerald-400 mb-3">
          [+] SECURITY POLICY & SEARCH FILES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-4 rounded border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300">robots.txt</span>
              {securityFiles?.robots_txt?.found ? (
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded text-[10px] font-bold">[FOUND]</span>
              ) : (
                <span className="px-2 py-0.5 bg-black text-emerald-700 rounded text-[10px]">[NOT FOUND]</span>
              )}
            </div>
            {securityFiles?.robots_txt?.found ? (
              <pre className="text-[10px] text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/30 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {securityFiles.robots_txt.preview}
              </pre>
            ) : (
              <p className="text-[11px] text-emerald-700 mt-2">No /robots.txt file detected.</p>
            )}
          </div>

          <div className="bg-black p-4 rounded border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300">security.txt</span>
              {securityFiles?.security_txt?.found ? (
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded text-[10px] font-bold">[FOUND]</span>
              ) : (
                <span className="px-2 py-0.5 bg-black text-emerald-700 rounded text-[10px]">[NOT FOUND]</span>
              )}
            </div>
            {securityFiles?.security_txt?.found ? (
              <pre className="text-[10px] text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/30 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {securityFiles.security_txt.preview}
              </pre>
            ) : (
              <p className="text-[11px] text-emerald-700 mt-2">No /.well-known/security.txt file detected.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default GeoTechCard;
