const ResultCard = ({ title, status }) => {

  const isSafe = status !== "Missing";

  return (

    <div
      className={`
        relative overflow-hidden
        rounded-2xl p-5
        border transition-all duration-300
        hover:scale-[1.02]
        ${
          isSafe
            ? "border-green-500/30 hover:border-green-400 shadow-lg shadow-green-500/10 hover:shadow-green-500/20"
            : "border-red-500/30 hover:border-red-400 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
        }
        bg-slate-900
      `}
    >

      <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-white to-transparent"></div>

      <div className="flex justify-between items-center relative z-10">

        <div>

          <h2 className="text-white font-semibold text-lg">
            {title}
          </h2>

          <p className="text-slate-400 text-sm mt-2">

            {isSafe
              ? "Security protection detected"
              : "Potential security weakness found"}

          </p>

        </div>

        <span
          className={`
            px-4 py-2 rounded-xl
            text-sm font-bold
            ${
              isSafe
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }
          `}
        >

          {status}

        </span>

      </div>

    </div>

  );
};

export default ResultCard;