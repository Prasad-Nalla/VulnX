const headerDescriptions = {
  "Content-Security-Policy": "Restricts script execution & resources to prevent Cross-Site Scripting (XSS).",
  "Strict-Transport-Security": "Forces browsers to connect strictly over encrypted HTTPS connections (HSTS).",
  "X-Frame-Options": "Disables unauthorized iframe embedding to shield against Clickjacking.",
  "X-Content-Type-Options": "Prevents browsers from MIME-sniffing away from declared Content-Types (nosniff).",
  "Referrer-Policy": "Controls HTTP referrer privacy metadata included in request headers.",
  "Permissions-Policy": "Restricts browser API access (camera, microphone, geolocation).",
  "X-XSS-Protection": "Enables legacy browser XSS filters."
};

const ResultCard = ({ title, status }) => {
  const isSafe = status !== "Missing";
  const description = headerDescriptions[title] || "HTTP Security Response Header";

  return (
    <div
      className={`
        rounded-lg p-5 border font-mono transition-all duration-300
        ${
          isSafe
            ? "border-emerald-500/40 bg-black/90 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]"
            : "border-red-500/40 bg-black/90 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        }
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <span className={`font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSafe ? '[+]' : '[-]'}
            </span>
            <h3 className="text-emerald-300 font-bold text-base tracking-tight">
              {title}
            </h3>
          </div>

          <p className="text-emerald-600 text-xs mt-1 leading-relaxed">
            {description}
          </p>

          {isSafe && (
            <div className="mt-3 bg-emerald-950/40 p-2.5 rounded border border-emerald-500/30 text-xs text-emerald-300 break-all">
              <span className="text-emerald-600 text-[10px] block uppercase font-bold">HEADER VALUE:</span>
              <code>{status}</code>
            </div>
          )}
        </div>

        <span
          className={`
            px-3 py-1 rounded text-xs font-bold uppercase shrink-0 border
            ${
              isSafe
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/60"
                : "bg-red-950 text-red-400 border-red-500/60"
            }
          `}
        >
          {isSafe ? "[✓ PASSED]" : "[✕ MISSING]"}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;