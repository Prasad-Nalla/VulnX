const WhoisCard = ({ info }) => {

  if (!info) return null;

  return (

    <div className="mt-10 border border-blue-500/20 bg-slate-900 rounded-2xl p-8 shadow-lg shadow-blue-500/10">

      <h2 className="text-3xl font-bold text-white mb-6">
        Domain Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-black border border-blue-500/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Domain
          </p>

          <h2 className="text-white text-xl mt-2 break-all">
            {info.domain}
          </h2>
        </div>

        <div className="bg-black border border-blue-500/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            IP Address
          </p>

          <h2 className="text-white text-xl mt-2">
            {info.ip}
          </h2>
        </div>

        <div className="bg-black border border-blue-500/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Registrar
          </p>

          <h2 className="text-white text-lg mt-2 break-all">
            {info.registrar}
          </h2>
        </div>

        <div className="bg-black border border-blue-500/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Expiration Date
          </p>

          <h2 className="text-white text-lg mt-2">
            {info.expiration_date}
          </h2>
        </div>

      </div>

      {info.raw_whois && (
        <div className="mt-8 bg-slate-950 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Raw WHOIS Data
          </h3>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap break-words">
            {info.raw_whois}
          </pre>
        </div>
      )}

    </div>

  );
};

export default WhoisCard;