const headerDescriptions = {
  "Content-Security-Policy": "Restricts sources of scripts, images, and resources to prevent Cross-Site Scripting (XSS) and data injection.",
  "Strict-Transport-Security": "Forces web browsers to communicate exclusively over encrypted HTTPS connections (HSTS).",
  "X-Frame-Options": "Prevents framing of your webpage to shield users against Clickjacking attacks.",
  "X-Content-Type-Options": "Stops browsers from MIME-sniffing responses away from declared Content-Types (nosniff).",
  "Referrer-Policy": "Controls how much HTTP referrer information is transmitted during navigation.",
  "Permissions-Policy": "Restricts browser features like camera, geolocation, and microphone access.",
  "X-XSS-Protection": "Enables legacy browser XSS filters (replaced by CSP in modern web standards)."
};

const ResultCard = ({ title, status }) => {
  const isSafe = status !== "Missing";
  const description = headerDescriptions[title] || "HTTP Security Response Header";

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
        ${
          isSafe
            ? "border-emerald-500/30 bg-slate-900/90 hover:border-emerald-400/60 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10"
            : "border-red-500/30 bg-slate-900/90 hover:border-red-400/60 shadow-lg shadow-red-500/5 hover:shadow-red-500/10"
        }
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`text-xl ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSafe ? '🛡️' : '⚠️'}
            </span>
            <h3 className="text-white font-bold text-lg font-mono tracking-tight">
              {title}
            </h3>
          </div>

          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>

          {isSafe && (
            <div className="mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              <span className="text-slate-500 text-[10px] block uppercase font-sans font-bold">Header Value:</span>
              <code>{status}</code>
            </div>
          )}
        </div>

        <span
          className={`
            px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase shrink-0 border shadow-sm
            ${
              isSafe
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-red-500/20 text-red-300 border-red-500/40"
            }
          `}
        >
          {isSafe ? "✓ Configured" : "✕ Missing"}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;