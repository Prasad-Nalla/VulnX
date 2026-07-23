const SslCard = ({ ssl }) => {
  if (!ssl) return null;

  if (!ssl.success) {
    return (
      <div className="mt-6 border border-red-500/30 rounded-2xl p-6 bg-slate-900 shadow-lg shadow-red-500/10">
        <h2 className="text-2xl font-bold text-red-400 mb-2 flex items-center gap-2">
          <span>🔒</span> SSL / TLS Certificate Analysis
        </h2>
        <p className="text-slate-300">
          <span className="font-semibold text-red-400">Status:</span> {ssl.warning || ssl.error || "Failed to establish SSL connection."}
        </p>
      </div>
    );
  }

  const daysLeft = ssl.days_remaining;
  const isExpiringSoon = daysLeft !== null && daysLeft < 30;
  const isExpired = daysLeft !== null && daysLeft < 0;

  return (
    <div className="mt-6 border border-emerald-500/30 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-xl shadow-emerald-500/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-emerald-400">🔒</span> SSL / TLS Encryption Audit
          </h2>
          <p className="text-slate-400 text-sm mt-1">Hostname: <span className="text-cyan-400 font-mono">{ssl.hostname}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {ssl.is_valid && !isExpired ? (
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Valid Certificate
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
              ✕ Invalid / Expired
            </span>
          )}
        </div>
      </div>

      {ssl.warning && (
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          ⚠️ {ssl.warning}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Certificate Issuer</p>
          <p className="text-lg font-bold text-slate-200">{ssl.issuer}</p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">TLS Protocol & Cipher</p>
          <p className="text-lg font-bold text-cyan-400 font-mono">{ssl.protocol}</p>
          <p className="text-xs text-slate-400 truncate mt-1">{ssl.cipher}</p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Days Remaining</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
              {daysLeft !== null ? `${daysLeft} days` : 'N/A'}
            </span>
          </div>
          {daysLeft !== null && (
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block text-xs">Valid From:</span>
          <span className="text-slate-200 font-mono text-xs">{ssl.valid_from || 'N/A'}</span>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block text-xs">Valid Until:</span>
          <span className="text-slate-200 font-mono text-xs">{ssl.valid_to || 'N/A'}</span>
        </div>
      </div>

      {ssl.sans && ssl.sans.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Subject Alternative Names (SANs)</p>
          <div className="flex flex-wrap gap-2">
            {ssl.sans.map((san, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 border border-slate-800">
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
