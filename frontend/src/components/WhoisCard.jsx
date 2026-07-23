const WhoisCard = ({ info }) => {
  if (!info) return null;

  return (
    <div className="mt-6 border border-emerald-500/40 bg-black/95 rounded-lg p-6 font-mono shadow-[0_0_20px_rgba(0,255,102,0.15)]">
      <h2 className="text-xl font-bold text-emerald-400 mb-4 border-b border-emerald-500/30 pb-3 neon-text-green">
        [+] WHOIS DOMAIN INTELLIGENCE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black border border-emerald-500/30 rounded p-3.5">
          <p className="text-emerald-600 text-[10px] uppercase font-bold">DOMAIN NAME</p>
          <p className="text-emerald-300 font-bold text-sm mt-1 break-all">{info.domain}</p>
        </div>

        <div className="bg-black border border-emerald-500/30 rounded p-3.5">
          <p className="text-emerald-600 text-[10px] uppercase font-bold">RESOLVED IP</p>
          <p className="text-emerald-300 font-bold text-sm mt-1">{info.ip}</p>
        </div>

        <div className="bg-black border border-emerald-500/30 rounded p-3.5">
          <p className="text-emerald-600 text-[10px] uppercase font-bold">REGISTRAR</p>
          <p className="text-emerald-300 font-bold text-sm mt-1 break-all">{info.registrar}</p>
        </div>

        <div className="bg-black border border-emerald-500/30 rounded p-3.5">
          <p className="text-emerald-600 text-[10px] uppercase font-bold">EXPIRATION DATE</p>
          <p className="text-emerald-300 font-bold text-sm mt-1">{info.expiration_date}</p>
        </div>
      </div>

      {info.raw_whois && (
        <div className="mt-6 bg-black border border-emerald-500/30 rounded p-4">
          <h3 className="text-xs font-bold text-emerald-400 mb-2 uppercase">
            RAW WHOIS DATA OUTPUT:
          </h3>
          <pre className="text-emerald-300 text-[11px] font-mono whitespace-pre-wrap break-words max-h-60 overflow-y-auto bg-emerald-950/20 p-3 rounded border border-emerald-500/20">
            {info.raw_whois}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WhoisCard;