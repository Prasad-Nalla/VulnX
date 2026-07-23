const OverviewCard = ({ overall, summary, url, fullData, onExportJson, onExportReport }) => {
  if (!overall) return null;

  return (
    <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_25px_rgba(0,255,102,0.15)] font-mono">
      
      {/* Top Console Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-emerald-500/30">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Grade Gauge */}
          <div className="relative flex items-center justify-center w-28 h-28 rounded-lg bg-emerald-950/60 border-2 border-emerald-500 shadow-[0_0_20px_rgba(0,255,102,0.25)]">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black tracking-tight text-emerald-400 neon-text-green">{overall.grade}</span>
              <span className="text-xs font-bold text-emerald-500 mt-0.5">{overall.score}/100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-bold text-emerald-400 neon-text-green">
                SECURITY RATING: {overall.status}
              </h2>
            </div>
            <p className="text-emerald-500 text-xs mt-2">
              TARGET_HOST: <span className="text-emerald-300 font-bold">{url}</span>
            </p>
            <p className="text-emerald-600 text-xs mt-1">
              FINAL_DEST: <span className="text-emerald-400">{fullData?.final_url || url}</span> (HTTP/{fullData?.status_code || 200})
            </p>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-2.5 w-full lg:w-auto">
          <button
            onClick={onExportJson}
            className="px-4 py-2 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-xs font-bold text-emerald-300 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(0,255,102,0.3)]"
          >
            <span>[+] EXPORT JSON REPORT</span>
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.4)]"
          >
            <span>[+] PRINT KALI REPORT</span>
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase text-emerald-500 mb-2 flex items-center gap-2">
          <span>[+] KALI SECURITY ASSESSMENT SUMMARY</span>
        </h3>
        <p className="text-emerald-300 text-xs leading-relaxed bg-emerald-950/40 p-4 rounded border border-emerald-500/30">
          {summary}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-black p-3.5 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">HTTP HEADERS</p>
          <p className="text-sm font-bold text-emerald-300 mt-1">
            {fullData?.headers ? `${Object.values(fullData.headers).filter(v => v !== "Missing").length}/${Object.keys(fullData.headers).length} OK` : "Audited"}
          </p>
        </div>

        <div className="bg-black p-3.5 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">SSL ENCRYPTION</p>
          <p className={`text-sm font-bold mt-1 ${fullData?.ssl?.is_valid ? "text-emerald-400" : "text-red-400"}`}>
            {fullData?.ssl?.is_valid ? "VALID CERT" : "SSL WARNING"}
          </p>
        </div>

        <div className="bg-black p-3.5 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">EMAIL PROTECTION</p>
          <p className={`text-sm font-bold mt-1 ${fullData?.dns?.email_security?.spf_configured ? "text-emerald-400" : "text-amber-400"}`}>
            {fullData?.dns?.email_security?.spf_configured ? "SPF ACTIVE" : "NO SPF"}
          </p>
        </div>

        <div className="bg-black p-3.5 rounded border border-emerald-500/30">
          <p className="text-[10px] uppercase text-emerald-600 font-bold">PHISHING THREAT</p>
          <p className={`text-sm font-bold mt-1 ${fullData?.phishing?.verdict === "SAFE" ? "text-emerald-400" : "text-red-400"}`}>
            {fullData?.phishing?.verdict || "SAFE"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
