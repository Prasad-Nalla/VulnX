const PhishingCard = ({ result }) => {
  if (!result) return null;

  return (
    <div
      className={`
        mt-6 rounded-lg p-6 border font-mono shadow-[0_0_20px_rgba(0,255,102,0.15)]
        ${
          result.verdict === "SAFE"
            ? "border-emerald-500/40 bg-black/95"
            : result.verdict === "SUSPICIOUS"
            ? "border-amber-500/40 bg-black/95"
            : "border-red-500/40 bg-black/95"
        }
      `}
    >
      <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30 mb-6">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 neon-text-green">
            [+] PHISHING & URL HEURISTICS DETECTOR
          </h2>
          <p className="text-emerald-600 text-xs mt-1">
            Automated threat pattern heuristic engine
          </p>
        </div>

        <div
          className={`
            px-4 py-1.5 rounded text-xs font-bold uppercase border
            ${
              result.verdict === "SAFE"
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/60"
                : result.verdict === "SUSPICIOUS"
                ? "bg-amber-950 text-amber-400 border-amber-500/60"
                : "bg-red-950 text-red-400 border-red-500/60"
            }
          `}
        >
          [{result.verdict}]
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black border border-emerald-500/30 rounded p-4">
          <p className="text-emerald-600 text-[10px] uppercase font-bold">THREAT HEURISTIC SCORE</p>
          <h3 className="text-4xl font-black text-emerald-300 mt-2 neon-text-green">
            {result.score} <span className="text-xs text-emerald-600 font-normal">/ 100</span>
          </h3>
        </div>

        <div className="bg-black border border-emerald-500/30 rounded p-4">
          <p className="text-emerald-600 text-[10px] uppercase font-bold mb-2">DETECTION INDICATORS</p>
          <div className="space-y-1.5 text-xs text-emerald-300">
            {result.reasons.length === 0 ? (
              <div className="text-emerald-400">[✓] Zero threat heuristics triggered.</div>
            ) : (
              result.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">[!]</span>
                  <span>{reason}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingCard;