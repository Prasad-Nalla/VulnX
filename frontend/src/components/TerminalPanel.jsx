const TerminalPanel = ({ results, url, rawHeaders }) => {

  if (!results) return null;

  return (

    <div className="mt-10 bg-black border border-green-500/30 rounded-2xl overflow-hidden shadow-lg shadow-green-500/10">

      <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/20 bg-green-500/5">

        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>

        <span className="ml-4 text-green-400 font-mono text-sm">
          vulnX-terminal
        </span>

      </div>

      <div className="p-5 font-mono text-sm space-y-3 text-green-400">

        <p>
          <span className="text-green-500">[+]</span>
          {" "}Target: {url}
        </p>

        <p>
          <span className="text-green-500">[+]</span>
          {" "}Initializing vulnerability scan...
        </p>

        {Object.entries(results).map(
          ([key, value]) => (

            <p key={key}>

              {value !== "Missing" ? (
                <span className="text-green-500">[+]</span>
              ) : (
                <span className="text-red-500">[-]</span>
              )}

              {" "}
              {key}: {value}

            </p>

          )
        )}

        <p className="text-cyan-400">
          [✓] Scan completed successfully
        </p>

        {rawHeaders && Object.keys(rawHeaders).length > 0 && (
          <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-300">
            <div className="mb-3 text-white font-semibold">
              Raw HTTP Headers
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {Object.entries(rawHeaders).map(([key, value]) => (
                <p key={key} className="text-sm text-slate-300 break-all">
                  <span className="text-green-400">{key}:</span> {value}
                </p>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>

  );
};

export default TerminalPanel;