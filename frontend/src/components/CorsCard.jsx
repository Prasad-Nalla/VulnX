const CorsCard = ({ corsAudit, dnssecInfo }) => {
  if (!corsAudit && !dnssecInfo) return null;

  return (
    <div className="mt-6 space-y-6 font-mono">
      
      {/* CORS Misconfiguration Audit */}
      <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/30 gap-2">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 neon-text-green">
              [+] CORS MISCONFIGURATION AUDIT
            </h2>
            <p className="text-emerald-600 text-xs mt-1">
              Cross-Origin Resource Sharing policy reflection & credentials check
            </p>
          </div>

          <span className={`px-3 py-1 rounded text-xs font-bold shrink-0 border ${
            corsAudit?.vulnerable ? "bg-red-950 text-red-400 border-red-500/60" : "bg-emerald-950 text-emerald-300 border-emerald-500/60"
          }`}>
            [{corsAudit?.vulnerable ? `RISK: ${corsAudit.risk}` : "CORS SECURE"}]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-black p-4 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-600 block font-bold uppercase">ALLOWED ORIGIN (REFLECTED):</span>
            <span className="text-emerald-300 font-bold text-sm">{corsAudit?.allow_origin || "None"}</span>
          </div>

          <div className="bg-black p-4 rounded border border-emerald-500/30">
            <span className="text-[10px] text-emerald-600 block font-bold uppercase">ALLOW CREDENTIALS:</span>
            <span className="text-emerald-300 font-bold text-sm">{corsAudit?.allow_credentials || "False"}</span>
          </div>
        </div>

        {corsAudit?.reasons && corsAudit.reasons.length > 0 && (
          <div className="mt-4 p-3.5 bg-red-950/30 rounded border border-red-500/40 text-xs space-y-1">
            <span className="text-red-400 font-bold block mb-1">[-] CORS VULNERABILITY REASONS:</span>
            {corsAudit.reasons.map((r, i) => (
              <p key={i} className="text-red-300 flex items-start gap-1.5">
                <span>•</span> <span>{r}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* DNSSEC Validation */}
      {dnssecInfo && (
        <div className="border border-emerald-500/40 rounded-lg p-6 bg-black/95">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-emerald-400 neon-text-green">
                [+] DNSSEC AUTHENTICATION CHECK
              </h3>
              <p className="text-emerald-600 text-xs mt-0.5">
                Domain Name System Security Extensions cryptographic verification
              </p>
            </div>

            <span className={`px-3 py-1 rounded text-xs font-bold border ${
              dnssecInfo.enabled ? "bg-emerald-950 text-emerald-300 border-emerald-500/60" : "bg-amber-950 text-amber-400 border-amber-500/60"
            }`}>
              {dnssecInfo.enabled ? "[✓ DNSSEC ACTIVE]" : "[✕ DNSSEC NOT ENABLED]"}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default CorsCard;
