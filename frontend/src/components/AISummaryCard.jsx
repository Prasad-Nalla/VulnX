const AISummaryCard = ({ summary }) => {

  if (!summary) return null;

  return (

    <div className="mt-10 border border-purple-500/20 bg-slate-900 rounded-2xl p-8 shadow-lg shadow-purple-500/10">

      <h2 className="text-3xl font-bold text-white mb-5">
        AI Security Analysis
      </h2>

      <div className="bg-black border border-purple-500/20 rounded-xl p-6">

        <p className="text-slate-300 leading-8">
          {summary}
        </p>

      </div>

    </div>

  );
};

export default AISummaryCard;