const SslCard = ({ ssl }) => {
  if (!ssl) return null;

  if (!ssl.success) {
    return (
      <div className="mt-6 border border-red-500/50 rounded-lg p-6 bg-black font-mono">
        <h2 className="text-xl font-bold text-red-400 mb-2">
          [-] SSL / TLS CERTIFICATE ANALYSIS ERROR
        </h2>
        <p className="text-red-300 text-xs">
          STATUS: {ssl.warning || ssl.error || "Failed to establish SSL connection on port 443."}
        </p>
      </div>
    );
  }

  const daysLeft = ssl.days_remaining;
  const isExpiringSoon = daysLeft !== null && daysLeft < 30;
  const isExpired = daysLeft !== null && daysLeft < 0;

  return (
    <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-emerald-500/30 gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 neon-text-green">
            [+] SSL / TLS ENCRYPTION AUDIT
          </h2>
          <p className="text-emerald-600 text-xs mt-1">
            HOSTNAME: <span className="text-emerald-300">{ssl.hostname}</span>
          </p>
        </div>
        <div>
          {ssl.is_valid && !isExpired ? (
            <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60">
              [✓ VALID CERTIFICATE]
            </span>
          ) : (
            <span className="px-3 py-1 rounded text-xs font-bold bg-red-950 text-red-400 border border-red-500/60">
              [✕ INVALID / EXPIRED]
            </span>
          )}
        </div>
      </div>

      {ssl.warning && (
        <div className="mt-4 p-3 rounded bg-amber-950/60 border border-amber-500/50 text-amber-400 text-xs">
          [!] WARNING: {ssl.warning}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-emerald-950/30 p-4 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">CERTIFICATE ISSUER</p>
          <p className="text-sm font-bold text-emerald-300 mt-1">{ssl.issuer}</p>
        </div>

        <div className="bg-emerald-950/30 p-4 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">PROTOCOL & CIPHER</p>
          <p className="text-sm font-bold text-emerald-300 mt-1">{ssl.protocol}</p>
          <p className="text-[11px] text-emerald-500 truncate mt-0.5">{ssl.cipher}</p>
        </div>

        <div className="bg-emerald-950/30 p-4 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">DAYS REMAINING</p>
          <p className={`text-xl font-bold mt-1 ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
            {daysLeft !== null ? `${daysLeft} DAYS` : 'N/A'}
          </p>
          {daysLeft !== null && (
            <div className="w-full bg-black h-1.5 rounded mt-2 overflow-hidden border border-emerald-500/30">
              <div
                className={`h-full ${isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-black p-3 rounded border border-emerald-500/30">
          <span className="text-emerald-600 block text-[10px] uppercase font-bold">VALID FROM:</span>
          <span className="text-emerald-300">{ssl.valid_from || 'N/A'}</span>
        </div>
        <div className="bg-black p-3 rounded border border-emerald-500/30">
          <span className="text-emerald-600 block text-[10px] uppercase font-bold">VALID UNTIL:</span>
          <span className="text-emerald-300">{ssl.valid_to || 'N/A'}</span>
        </div>
      </div>

      {ssl.sans && ssl.sans.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-2">SUBJECT ALTERNATIVE NAMES (SANs)</p>
          <div className="flex flex-wrap gap-1.5">
            {ssl.sans.map((san, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-emerald-950/60 rounded text-[11px] text-emerald-300 border border-emerald-500/30">
                {san}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SslCard;
