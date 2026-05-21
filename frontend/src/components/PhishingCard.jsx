const PhishingCard = ({ result }) => {

  if (!result) return null;

  return (

    <div
      className={`
        mt-10 rounded-2xl p-8 border
        ${
          result.verdict === "SAFE"
            ? "border-green-500/30 bg-green-500/5"
            : result.verdict === "SUSPICIOUS"
            ? "border-yellow-500/30 bg-yellow-500/5"
            : "border-red-500/30 bg-red-500/5"
        }
      `}
    >

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Phishing Analysis
          </h2>

          <p className="text-slate-400 mt-2">
            URL threat detection system
          </p>

        </div>

        <div
          className={`
            px-5 py-3 rounded-xl font-bold text-lg
            ${
              result.verdict === "SAFE"
                ? "bg-green-500/20 text-green-400"
                : result.verdict === "SUSPICIOUS"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >

          {result.verdict}

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400 text-sm">
            Threat Score
          </p>

          <h2 className="text-5xl font-black text-white mt-3">
            {result.score}
          </h2>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400 text-sm mb-4">
            Detection Reasons
          </p>

          <div className="space-y-3">

            {result.reasons.length === 0 ? (

              <div className="text-green-400">
                No suspicious indicators found
              </div>

            ) : (

              result.reasons.map((reason, index) => (

                <div
                  key={index}
                  className="text-sm text-slate-300"
                >
                  • {reason}
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