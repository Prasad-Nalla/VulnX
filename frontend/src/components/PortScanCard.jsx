const PortScanCard = ({ ports }) => {

  if (!ports || ports.length === 0) return null;

  return (

    <div className="mt-10 border border-cyan-500/20 rounded-2xl p-8 bg-slate-900 shadow-lg shadow-cyan-500/10">

      <h2 className="text-3xl font-bold text-white mb-6">
        Open Ports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {ports.map((port, index) => (

          <div
            key={index}
            className="bg-black border border-cyan-500/20 rounded-xl p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {port.port}
                </h2>

                <p className="text-slate-400 mt-1">
                  {port.service}
                </p>

              </div>

              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl font-semibold">
                {port.status}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default PortScanCard;