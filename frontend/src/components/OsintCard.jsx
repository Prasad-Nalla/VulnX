const OsintCard = ({ subdomainsInfo, cookieAudit, pageMetadata }) => {
  if (!subdomainsInfo && !cookieAudit && !pageMetadata) return null;

  return (
    <div className="mt-6 space-y-6 font-mono">
      
      {/* Subdomain Enumeration (OSINT) */}
      <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/30 gap-2">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 neon-text-green">
              [+] OSINT SUBDOMAIN ENUMERATION (CRT.SH LOGS)
            </h2>
            <p className="text-emerald-600 text-xs mt-1">
              ROOT DOMAIN: <span className="text-emerald-300">{subdomainsInfo?.root_domain || "Target"}</span>
            </p>
          </div>

          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded text-xs font-bold shrink-0">
            [{subdomainsInfo?.count || 0} SUBDOMAINS DISCOVERED]
          </span>
        </div>

        {!subdomainsInfo?.subdomains || subdomainsInfo.subdomains.length === 0 ? (
          <p className="text-xs text-emerald-700 mt-4">No public Certificate Transparency subdomains found.</p>
        ) : (
          <div className="mt-4">
            <p className="text-[10px] text-emerald-600 font-bold uppercase mb-2">DISCOVERED SUBDOMAINS LIST:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {subdomainsInfo.subdomains.map((sub, i) => (
                <div key={i} className="text-xs text-emerald-300 bg-emerald-950/20 px-3 py-1.5 rounded border border-emerald-500/30 truncate flex items-center gap-1.5">
                  <span className="text-emerald-500 text-[10px] font-bold">›</span>
                  <span className="truncate">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cookie Security Audit */}
      <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30 mb-4">
          <h3 className="text-base font-bold text-emerald-400 neon-text-green">
            [+] COOKIE SECURITY FLAGS AUDIT
          </h3>
          <span className="text-xs text-emerald-500 font-bold">
            ({cookieAudit?.count || 0} Cookies Detected)
          </span>
        </div>

        {!cookieAudit?.cookies || cookieAudit.cookies.length === 0 ? (
          <p className="text-xs text-emerald-700">No HTTP cookies were set by the target response.</p>
        ) : (
          <div className="space-y-2">
            {cookieAudit.cookies.map((c, idx) => (
              <div key={idx} className="bg-black p-3 rounded border border-emerald-500/30 text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-emerald-300 text-sm">{c.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">DOMAIN: {c.domain}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded border font-bold ${c.secure ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60' : 'bg-red-950 text-red-400 border-red-500/60'}`}>
                    {c.secure ? '[✓ SECURE]' : '[✕ NOT SECURE]'}
                  </span>

                  <span className={`px-2 py-0.5 rounded border font-bold ${c.http_only ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60' : 'bg-amber-950 text-amber-400 border-amber-500/60'}`}>
                    {c.http_only ? '[✓ HTTPONLY]' : '[✕ NO HTTPONLY]'}
                  </span>

                  <span className="px-2 py-0.5 rounded border font-bold bg-black text-emerald-400 border-emerald-500/40">
                    SAMESITE: {c.same_site}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page HTML Metadata */}
      {pageMetadata && (
        <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95">
          <h3 className="text-base font-bold text-emerald-400 mb-3 border-b border-emerald-500/30 pb-2">
            [+] PAGE HTML METADATA & OPENGRAPH
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-black p-3.5 rounded border border-emerald-500/30">
              <span className="text-[10px] text-emerald-600 block font-bold uppercase">HTML TITLE:</span>
              <span className="text-emerald-300 font-bold">{pageMetadata.title || "N/A"}</span>
            </div>

            <div className="bg-black p-3.5 rounded border border-emerald-500/30">
              <span className="text-[10px] text-emerald-600 block font-bold uppercase">HTML PAYLOAD SIZE:</span>
              <span className="text-emerald-300 font-bold">{pageMetadata.html_size_bytes ? `${pageMetadata.html_size_bytes} bytes` : "N/A"}</span>
            </div>

            <div className="bg-black p-3.5 rounded border border-emerald-500/30 md:col-span-2">
              <span className="text-[10px] text-emerald-600 block font-bold uppercase">META DESCRIPTION:</span>
              <span className="text-emerald-300">{pageMetadata.description || "No description meta tag provided."}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OsintCard;
