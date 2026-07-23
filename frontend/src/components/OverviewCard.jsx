const OverviewCard = ({ overall, summary, url, fullData, onExportJson, onExportReport }) => {
  if (!overall) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/40";
    if (score >= 60) return "from-cyan-500 to-blue-400 text-cyan-400 border-cyan-500/40";
    if (score >= 45) return "from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40";
    return "from-red-500 to-rose-400 text-red-400 border-red-500/40";
  };

  const scoreGradient = getScoreColor(overall.score);

  return (
    <div className="mt-6 border border-slate-800 rounded-2xl p-8 bg-slate-900/90 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className={`relative flex items-center justify-center w-32 h-32 rounded-full bg-slate-950 border-4 shadow-xl ${scoreGradient}`}>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black tracking-tight text-white">{overall.grade}</span>
              <span className="text-xs font-mono font-bold text-slate-400">{overall.score}/100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="text-3xl font-bold text-white">Overall Security Rating</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-slate-950 border ${scoreGradient}`}>
                {overall.status}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Analyzed Target: <span className="text-cyan-400 font-mono font-semibold">{url}</span>
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Final Destination: <span className="text-slate-300 font-mono">{fullData?.final_url || url}</span> (HTTP Status: {fullData?.status_code || 200})
            </p>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-3 w-full lg:w-auto">
          <button
            onClick={onExportJson}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <span>📥</span> Export JSON Audit
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>📄</span> Print Audit Summary
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span>🤖</span> Executive AI Risk Summary
        </h3>
        <p className="text-slate-200 text-base leading-relaxed bg-slate-950/80 p-5 rounded-xl border border-slate-800">
          {summary}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Security Headers</p>
          <p className="text-lg font-bold text-white mt-1">
            {fullData?.headers ? `${Object.values(fullData.headers).filter(v => v !== "Missing").length}/${Object.keys(fullData.headers).length} Present` : "Audited"}
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">SSL Encryption</p>
          <p className={`text-lg font-bold mt-1 ${fullData?.ssl?.is_valid ? "text-emerald-400" : "text-red-400"}`}>
            {fullData?.ssl?.is_valid ? "Valid SSL Cert" : "SSL Warning"}
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Email Protection</p>
          <p className={`text-lg font-bold mt-1 ${fullData?.dns?.email_security?.spf_configured ? "text-emerald-400" : "text-amber-400"}`}>
            {fullData?.dns?.email_security?.spf_configured ? "SPF Active" : "No SPF Record"}
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Phishing Threat</p>
          <p className={`text-lg font-bold mt-1 ${fullData?.phishing?.verdict === "SAFE" ? "text-emerald-400" : "text-red-400"}`}>
            {fullData?.phishing?.verdict || "SAFE"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
